import { readFileSync } from 'node:fs'
import { basename, extname } from 'node:path'
import opentype from 'opentype.js'
import type { BdfFont, BdfGlyph } from './types.js'
import { createFace, destroyFace, glyphExists, renderGlyph } from './directwrite.js'

export interface RasterizeOptions {
  /** Restrict rasterization to these characters instead of the source font's full cmap. */
  charset?: string
  /** Family/style label recorded in the BDF header properties (best-effort, informational). */
  family?: string
  style?: string
  /**
   * Zero the left bearing and derive the right gap from right-hand ink volume instead of using
   * FreeType's own (source-font design-metric) bearings verbatim. Off by default - only pulls its
   * weight at small strike sizes, where a flat FreeType bearing wastes a whole pixel column.
   */
  generateKerning?: boolean
  /** How many columns, counted inward from the rightmost inked column, to sum ink over. Default 1. */
  rightSideCount?: number
  /** Ink-pixel threshold (over rightSideCount columns) at or below which a glyph is a "tail". Default 1. */
  rightSideVolume?: number
  /** Right-side gap applied when the ink volume is above rightSideVolume (a "flat" edge). Default 1. */
  flatRightSideGap?: number
  /** Right-side gap applied when the ink volume is at or below rightSideVolume (a "tail"). Default 0. */
  tailRightSideGap?: number
}

/** Resolved (defaults applied) auto-kerning parameters - an internal implementation detail, not part of the public options shape. */
interface KerningRule {
  rightSideCount: number
  rightSideVolume: number
  flatRightSideGap: number
  tailRightSideGap: number
}

function glyphNameFor(otFont: opentype.Font, codepoint: number): string {
  try {
    const glyph = otFont.charToGlyph(String.fromCodePoint(codepoint))
    if (glyph?.name && glyph.name !== '.notdef') return glyph.name
  } catch {
    // fall through to the synthetic name below
  }
  return `uni${codepoint.toString(16).toUpperCase().padStart(4, '0')}`
}

// Letter tails (y, j, comma's descender, ...) are a deliberate design feature worth the ink-column
// heuristic below. Everything non-alphabetic - hyphens, math operators, digits, currency signs,
// brackets, whatever - tends to be uniformly thin across its *whole* width rather than tapering at
// one edge, so the heuristic misreads it as a "tail" and starves it of a right gap. Rather than
// enumerating that ever-growing "everything else" list one Unicode category at a time (P*, S*,
// N*, ...), invert it: there is exactly one alphabetic class, spanning every script (Latin,
// Cyrillic, Greek, Armenian, Hebrew, ...), so test for that instead and flat-gap the rest by default.
const ALPHABETIC = /\p{Alphabetic}/u

function isAlphabetic(codepoint: number): boolean {
  return ALPHABETIC.test(String.fromCodePoint(codepoint))
}

function colInk(bitmap: number[][], x: number): number {
  return bitmap.reduce((n, row) => n + (row[x] === 1 ? 1 : 0), 0)
}

function rightmostInkColumn(bitmap: number[][], width: number): number {
  for (let x = width - 1; x >= 0; x--) {
    if (colInk(bitmap, x) > 0) return x
  }
  return -1
}

/**
 * FreeType's own left/right bearings come from the source vector font's design metrics, which
 * don't match the pixel-art convention this pipeline wants: glyphs packed flush left (no left
 * bearing at all), with a right gap sized to how "solid" the rightmost ink looks - a thin
 * diagonal tail (y, /, comma) shouldn't get the same dead column next to it as a flat right edge
 * (o, l, m). Anchors on the rightmost column that actually has ink (not just the rightmost column
 * of the bitmap - e.g. `space` is a 1x1 all-zero bitmap, not a zero-width one) and sums inward
 * from there over `rightSideCount` columns. The "no ink at all" case always wins regardless of
 * alphabetic-ness - it's the blank-glyph gap, not a tail/flat call.
 */
function autoRightGap(bitmap: number[][], width: number, codepoint: number, opts: KerningRule): number {
  const anchor = rightmostInkColumn(bitmap, width)
  if (anchor === -1) return 3 // no ink anywhere in the glyph (space, etc.)

  if (!isAlphabetic(codepoint)) return opts.flatRightSideGap

  let ink = 0
  for (let x = Math.max(0, anchor - opts.rightSideCount + 1); x <= anchor; x++) ink += colInk(bitmap, x)

  return ink <= opts.rightSideVolume ? opts.tailRightSideGap : opts.flatRightSideGap
}

function cmapCodepoints(otFont: opentype.Font): number[] {
  const map = (otFont.tables.cmap as { glyphIndexMap?: Record<string, number> })?.glyphIndexMap ?? {}
  return Object.keys(map)
    .map(Number)
    .filter((cp) => Number.isFinite(cp))
    .sort((a, b) => a - b)
}

const BASIC_LATIN_REFERENCE = new Set(
  [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'].map((ch) => ch.codePointAt(0)!),
)

/**
 * FONT_ASCENT/FONT_DESCENT used to come from the source vector font's raw, unhinted
 * hhea.ascender/unitsPerEm ratio - a value unconnected to where the actual rasterized, hinted
 * bitmap places its ink. For Liberation Sans at 12px that ratio rounds to an 11/1 ascent/descent
 * split, but the real rasterized ink (basic Latin) needs 9/2 - a full pixel of descenders (g, y,
 * p, q, j, comma, Q's tail) sat below the declared line box with `line-height: 1`. Measuring the
 * real ink instead - restricted to basic Latin so a handful of rare accented/symbol outliers
 * elsewhere in the repertoire (which can genuinely need more room than the nominal pixel size)
 * don't inflate the "normal" line-box metrics - reproduces the old hand-tuned Liberation Sans
 * values exactly, and generalizes correctly to any other source font or charset. Falls back to
 * every rasterized glyph when the strike has no basic Latin at all (e.g. a Cyrillic-only charset).
 */
function computeVerticalMetrics(glyphs: BdfGlyph[], pixelSize: number): { fontAscent: number; fontDescent: number } {
  const reference = glyphs.filter((glyph) => BASIC_LATIN_REFERENCE.has(glyph.encoding))
  const metricsSource = reference.length > 0 ? reference : glyphs

  let maxAscent = 0
  let maxDescent = 0
  for (const glyph of metricsSource) {
    const top = glyph.bbx.yoff + glyph.bbx.h
    if (top > maxAscent) maxAscent = top
    if (glyph.bbx.yoff < 0 && -glyph.bbx.yoff > maxDescent) maxDescent = -glyph.bbx.yoff
  }

  // Clamped so descent can never claim the whole (or more than the whole) nominal size on its
  // own - the sum with ascent must stay exactly pixelSize (see the FONT_ASCENT+FONT_DESCENT
  // invariant this feeds into below).
  const fontDescent = Math.min(maxDescent, pixelSize)
  const fontAscent = pixelSize - fontDescent

  return { fontAscent, fontDescent }
}

function deriveFamilyStyle(sourcePath: string): { family: string; style: string } {
  const name = basename(sourcePath, extname(sourcePath))
  const match = name.match(/^(.*?)-(Regular|Bold|Italic|BoldItalic)$/i)

  if (match) {
    return { family: match[1].replace(/([a-z])([A-Z])/g, '$1 $2'), style: match[2] }
  }

  return { family: name, style: 'Regular' }
}

export async function rasterizeFont(sourcePath: string, pixelSize: number, opts: RasterizeOptions = {}): Promise<BdfFont> {
  const buffer = readFileSync(sourcePath)

  const otFont = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const derived = deriveFamilyStyle(sourcePath)
  const family = opts.family ?? derived.family
  const style = opts.style ?? derived.style

  const codepoints = opts.charset
    ? [...new Set([...opts.charset].map((ch) => ch.codePointAt(0)!))].sort((a, b) => a - b)
    : cmapCodepoints(otFont)

  const face = createFace(sourcePath, pixelSize)

  const kerningOpts: KerningRule = {
    rightSideCount: opts.rightSideCount ?? 1,
    rightSideVolume: opts.rightSideVolume ?? 1,
    flatRightSideGap: opts.flatRightSideGap ?? 1,
    tailRightSideGap: opts.tailRightSideGap ?? 0,
  }

  const glyphs: BdfGlyph[] = []

  for (const codepoint of codepoints) {
    if (!glyphExists(face, codepoint)) continue

    const rendered = renderGlyph(face, codepoint)

    const nonBilevel = rendered.pixels.flat().some((v) => v !== 0 && v !== 255)
    if (nonBilevel) {
      throw new Error(`rasterizer produced non-bilevel pixels for codepoint U+${codepoint.toString(16)} — expected strict mono output`)
    }

    const bitmap = rendered.pixels.map((row) => row.map((v) => (v ? 1 : 0)))
    const dwidthY = Math.round(rendered.freetype.advance.y)
    const swidthX = Math.round((rendered.advance_x * 1000) / pixelSize)

    const dwidthX = opts.generateKerning
      ? rendered.width + autoRightGap(bitmap, rendered.width, codepoint, kerningOpts)
      : Math.round(rendered.freetype.advance.x)
    const xoff = opts.generateKerning ? 0 : rendered.x

    glyphs.push({
      name: glyphNameFor(otFont, codepoint),
      encoding: codepoint,
      swidth: [swidthX, 0],
      dwidth: [dwidthX, dwidthY],
      bbx: { w: rendered.width, h: rendered.height, xoff, yoff: rendered.y - rendered.height },
      bitmap,
    })
  }

  destroyFace(face)

  // build.ts uses FONT_ASCENT+FONT_DESCENT as the TTF's hhea/sTypo ascender/descender, which is
  // what a browser sizes the line box from at `line-height: 1` - see computeVerticalMetrics above
  // for why these come from the rasterized ink rather than the source font's own metrics.
  const { fontAscent, fontDescent } = computeVerticalMetrics(glyphs, pixelSize)

  return {
    fontXlfd: `-unknown-${family}-${style}-R-Normal--${pixelSize}-${pixelSize * 10}-75-75-P-0-ISO10646-1`,
    pointSize: pixelSize,
    xres: 75,
    yres: 75,
    fontBoundingBox: { w: pixelSize, h: pixelSize, xoff: 0, yoff: 0 },
    properties: {
      FAMILY_NAME: family,
      WEIGHT_NAME: style,
      PIXEL_SIZE: pixelSize,
      FONT_ASCENT: fontAscent,
      FONT_DESCENT: fontDescent,
    },
    glyphs,
  }
}
