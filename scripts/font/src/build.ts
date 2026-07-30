import opentype from 'opentype.js'
import type { BdfFont, BdfGlyph } from './types.js'
import { traceGlyphContours, signedArea } from './contours.js'
import { contourToSvgPath, svgFontToTtf, type SvgGlyphSpec } from './svgFont.js'
import { insertSfntTable, replaceSfntTable, getSfntTable, buildGaspTable, GASP_DOGRAY } from './sfnt.js'
import { stripCmapFormat4 } from './cmap.js'

export interface BuildReportEntry {
  name: string
  encoding: number
  issues: string[]
}

export interface BuildReport {
  glyphCount: number
  flagged: BuildReportEntry[]
  /** Glyphs that couldn't be included at all (hard per-glyph errors) — everything else still built. */
  skipped: BuildReportEntry[]
}

export interface BuildResult {
  buffer: ArrayBuffer
  report: BuildReport
}

export interface BuildOptions {
  family?: string
  style?: string
  /** Font units per bitmap pixel. Every pixel-grid coordinate is an exact multiple of this. */
  unitsPerEmScale?: number
}

const DEFAULT_SCALE = 100

/** Raises a "degenerate contour" error the outer wrapper turns into a skip — see buildGlyph(). */
class DegenerateContourError extends Error {}

function buildGlyphUnsafe(
  bdfGlyph: BdfGlyph,
  scale: number,
  issues: string[],
  seenEncodings: Map<number, string>,
): SvgGlyphSpec {
  const bitmapHeight = bdfGlyph.bitmap.length
  const bitmapWidth = bdfGlyph.bitmap[0]?.length ?? 0

  if (bitmapHeight !== bdfGlyph.bbx.h || bitmapWidth !== bdfGlyph.bbx.w) {
    issues.push(`bitmap dimensions (${bitmapWidth}x${bitmapHeight}) don't match BBX (${bdfGlyph.bbx.w}x${bdfGlyph.bbx.h})`)
  }

  if (seenEncodings.has(bdfGlyph.encoding)) {
    issues.push(`duplicate encoding, also used by glyph "${seenEncodings.get(bdfGlyph.encoding)}"`)
  } else {
    seenEncodings.set(bdfGlyph.encoding, bdfGlyph.name)
  }

  const inkCount = bdfGlyph.bitmap.reduce((sum, row) => sum + row.filter((v) => v === 1).length, 0)

  if (inkCount > 0 && bdfGlyph.dwidth[0] <= 0) {
    issues.push(`non-positive advance width (${bdfGlyph.dwidth[0]}) on a glyph with visible ink`)
  }

  const contours = traceGlyphContours(bdfGlyph.bitmap)

  const areaSum = contours.reduce((sum, c) => sum + signedArea(c), 0)
  if (areaSum !== inkCount) {
    issues.push(`contour area sum (${areaSum}) does not match ink pixel count (${inkCount}) — possible tracer defect`)
  }

  for (const contour of contours) {
    if (contour.length < 3) throw new DegenerateContourError(`degenerate contour (${contour.length} points)`)
  }

  return {
    name: bdfGlyph.name,
    unicode: bdfGlyph.encoding,
    advanceWidth: bdfGlyph.dwidth[0] * scale,
    d: contourToSvgPath(contours, bdfGlyph.bbx, scale),
  }
}

/**
 * Returns null (and records a `skipped` entry) on a hard per-glyph error instead of throwing —
 * one broken glyph (typically from a hand-edited BDF) shouldn't take down the whole build. The
 * rest of the font still gets built, so there's always something to load in a viewer/browser and
 * cross-reference against the report, rather than nothing at all. Anything unexpected that a
 * single glyph's data can throw is caught here — not just the tracer — since a malformed bitmap
 * can just as easily blow up the ink-count pass before tracing is even reached.
 */
function buildGlyph(
  bdfGlyph: BdfGlyph,
  scale: number,
  flagged: BuildReportEntry[],
  skipped: BuildReportEntry[],
  seenEncodings: Map<number, string>,
): SvgGlyphSpec | null {
  const issues: string[] = []

  let glyph: SvgGlyphSpec
  try {
    glyph = buildGlyphUnsafe(bdfGlyph, scale, issues, seenEncodings)
  } catch (e) {
    const reason = e instanceof DegenerateContourError ? e.message : `tracing failed: ${(e as Error).message}`
    skipped.push({ name: bdfGlyph.name, encoding: bdfGlyph.encoding, issues: [reason] })
    return null
  }

  if (issues.length > 0) {
    flagged.push({ name: bdfGlyph.name, encoding: bdfGlyph.encoding, issues })
  }

  return glyph
}

function flagIssue(flagged: BuildReportEntry[], glyph: BdfGlyph, issue: string): void {
  const entry = flagged.find((f) => f.encoding === glyph.encoding)
  if (entry) entry.issues.push(issue)
  else flagged.push({ name: glyph.name, encoding: glyph.encoding, issues: [issue] })
}

/** Round-trips our own output through opentype.js's parser to catch our own serialization bugs. */
function selfCheckRoundTrip(
  buffer: ArrayBuffer,
  bdfFont: BdfFont,
  scale: number,
  flagged: BuildReportEntry[],
  skippedEncodings: Set<number>,
): void {
  const reparsed = opentype.parse(buffer)

  for (const bdfGlyph of bdfFont.glyphs) {
    if (skippedEncodings.has(bdfGlyph.encoding)) continue // already reported as skipped, don't also flag "missing"

    const index = reparsed.charToGlyphIndex(String.fromCodePoint(bdfGlyph.encoding))
    if (!index) {
      flagIssue(flagged, bdfGlyph, 're-parsed font has no cmap entry for this codepoint')
      continue
    }

    const glyph = reparsed.glyphs.get(index)
    const bbox = glyph.getBoundingBox()

    const offGrid = [bbox.x1, bbox.y1, bbox.x2, bbox.y2].some((v) => !Number.isInteger(v / scale))
    if (offGrid) {
      flagIssue(flagged, bdfGlyph, `re-parsed bounding box (${bbox.x1},${bbox.y1},${bbox.x2},${bbox.y2}) is not aligned to the ${scale}-unit pixel grid`)
    }

    if (glyph.advanceWidth !== undefined && !Number.isInteger(glyph.advanceWidth / scale)) {
      flagIssue(flagged, bdfGlyph, `re-parsed advance width (${glyph.advanceWidth}) is not a multiple of ${scale}`)
    }
  }
}

export function buildTtf(bdfFont: BdfFont, opts: BuildOptions = {}): BuildResult {
  const scale = opts.unitsPerEmScale ?? DEFAULT_SCALE
  const pixelSize = bdfFont.pointSize
  const unitsPerEm = pixelSize * scale

  const family = opts.family ?? String(bdfFont.properties.FAMILY_NAME ?? 'Untitled')
  const style = opts.style ?? String(bdfFont.properties.WEIGHT_NAME ?? 'Regular')
  const ascent = Math.round(Number(bdfFont.properties.FONT_ASCENT ?? pixelSize) * scale)
  const descent = -Math.round(Number(bdfFont.properties.FONT_DESCENT ?? 0) * scale)

  const flagged: BuildReportEntry[] = []
  const skipped: BuildReportEntry[] = []
  const seenEncodings = new Map<number, string>()

  const glyphs: SvgGlyphSpec[] = []
  for (const bdfGlyph of bdfFont.glyphs) {
    const glyph = buildGlyph(bdfGlyph, scale, flagged, skipped, seenEncodings)
    if (glyph) glyphs.push(glyph)
  }

  // svg2ttf writes real glyf/loca TrueType tables (opentype.js's writer is CFF-only — see the
  // halo investigation this replaced). It already defaults OS/2 fsSelection to
  // REGULAR|USE_TYPO_METRICS on its own, so browsers size line boxes from our exact
  // ascent/descent instead of glyph-extent-derived usWinAscent/usWinDescent — no extra work
  // needed for that part. It doesn't write a `gasp` table though, so we splice one in
  // afterward: DOGRAY across the full ppem range matches the old hand-made fonts' table exactly,
  // and is what lets Windows render already-grid-aligned outlines with zero antialiasing bleed.
  const baseBuffer = svgFontToTtf({
    familyName: family,
    styleName: style,
    unitsPerEm,
    ascent,
    descent,
    missingGlyphAdvanceWidth: Math.round(unitsPerEm / 2),
    glyphs,
  })

  const withGasp = insertSfntTable(baseBuffer, 'gasp', buildGaspTable([{ maxPpem: 0xffff, behavior: GASP_DOGRAY }]))

  // svg2ttf's cmap format 4 subtable overflows its 16-bit idRangeOffset field once a font has
  // enough BMP segments/glyphs (routine once fallback-merged into the thousands) — OTS then
  // rejects the whole cmap table and browsers refuse to load the font at all. Format 12 (which
  // svg2ttf also always writes) is a strict superset and is what every target browser already
  // prefers when both are present, so we just drop the broken subtable rather than patch it.
  const cmap = getSfntTable(withGasp, 'cmap')
  const buffer = cmap ? replaceSfntTable(withGasp, 'cmap', stripCmapFormat4(cmap)) : withGasp

  selfCheckRoundTrip(buffer, bdfFont, scale, flagged, new Set(skipped.map((s) => s.encoding)))

  return { buffer, report: { glyphCount: glyphs.length, flagged, skipped } }
}
