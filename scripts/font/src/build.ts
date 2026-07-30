import opentype from 'opentype.js'
import type { BdfFont, BdfGlyph, Bbx, Contour } from './types.js'
import { traceGlyphContours, signedArea } from './contours.js'

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

// OS/2 fsSelection bits. REGULAR mirrors opentype.js's own default (it doesn't know about our
// style string). USE_TYPO_METRICS is the one that matters: without it, browsers by default size
// line boxes from OS/2 usWinAscent/usWinDescent, which opentype.js auto-computes from the actual
// glyph ink extents (max/min yMax/yMin across the built glyph set) — not from the ascender/
// descender we pass in, so our sum-to-unitsPerEm fix there has no effect on rendering. Setting
// this bit tells (spec-compliant) browsers to use sTypoAscender/sTypoDescender/sTypoLineGap
// instead, which opentype.js always sets to our own ascender/descender/0 — exact by construction.
const FS_SELECTION_REGULAR = 0x0040
const FS_SELECTION_USE_TYPO_METRICS = 0x0080

function emitContour(path: opentype.Path, contour: Contour, bbx: Bbx, scale: number): void {
  const toFont = (p: { x: number; y: number }) => ({
    x: (bbx.xoff + p.x) * scale,
    y: (bbx.yoff + bbx.h - p.y) * scale,
  })

  const points = contour.map(toFont)

  path.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) path.lineTo(points[i].x, points[i].y)
  path.close()
}

/** Raises a "degenerate contour" error the outer wrapper turns into a skip — see buildGlyph(). */
class DegenerateContourError extends Error {}

function buildGlyphUnsafe(
  bdfGlyph: BdfGlyph,
  scale: number,
  issues: string[],
  seenEncodings: Map<number, string>,
): opentype.Glyph {
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

  const path = new opentype.Path()

  for (const contour of contours) {
    if (contour.length < 3) throw new DegenerateContourError(`degenerate contour (${contour.length} points)`)
    emitContour(path, contour, bdfGlyph.bbx, scale)
  }

  return new opentype.Glyph({
    name: bdfGlyph.name,
    unicode: bdfGlyph.encoding,
    advanceWidth: bdfGlyph.dwidth[0] * scale,
    path,
  })
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
): opentype.Glyph | null {
  const issues: string[] = []

  let glyph: opentype.Glyph
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
  const ascender = Math.round(Number(bdfFont.properties.FONT_ASCENT ?? pixelSize) * scale)
  const descender = -Math.round(Number(bdfFont.properties.FONT_DESCENT ?? 0) * scale)

  const flagged: BuildReportEntry[] = []
  const skipped: BuildReportEntry[] = []
  const seenEncodings = new Map<number, string>()

  const notdef = new opentype.Glyph({ name: '.notdef', advanceWidth: Math.round(unitsPerEm / 2), path: new opentype.Path() })
  const glyphs: opentype.Glyph[] = [notdef]

  for (const bdfGlyph of bdfFont.glyphs) {
    const glyph = buildGlyph(bdfGlyph, scale, flagged, skipped, seenEncodings)
    if (glyph) glyphs.push(glyph)
  }

  const font = new opentype.Font({
    familyName: family,
    styleName: style,
    unitsPerEm,
    ascender,
    descender,
    glyphs,
    // @types/opentype.js mistypes fsSelection as `string`; the runtime source (font.js) uses it
    // directly as a numeric bitmask.
    fsSelection: (FS_SELECTION_REGULAR | FS_SELECTION_USE_TYPO_METRICS) as unknown as string,
  })

  const buffer = font.toArrayBuffer()

  selfCheckRoundTrip(buffer, bdfFont, scale, flagged, new Set(skipped.map((s) => s.encoding)))

  return { buffer, report: { glyphCount: glyphs.length - 1, flagged, skipped } }
}
