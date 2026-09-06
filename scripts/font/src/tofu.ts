/**
 * "TofuMaker" fonts: a single-glyph companion font per strike, built from that strike's own '?'
 * glyph, mapped to *every* valid Unicode codepoint via cmap format 13 (see cmap.ts). Placed last
 * in a font-family CSS stack, this guarantees the browser can never fall through past our own
 * fonts to some system font for a character we don't have a bitmap for — every codepoint either
 * renders in our pixel style or as our own pixel-style '?', never a smooth system-font glyph.
 *
 * "Tofu" is the standard term for the empty box browsers show for a missing glyph (□) — this
 * repurposes the same "one placeholder covers everything" idea from real Unicode "Last Resort"
 * fonts, just with a themed glyph instead of a box, and built per-strike so it matches that
 * strike's own pixel style exactly rather than a generic placeholder shape.
 */

import type { BdfFont } from './types.js'
import { buildGlyphUnsafe, DegenerateContourError } from './build.js'
import { svgFontToTtf, type SvgGlyphSpec } from './svgFont.js'
import { insertSfntTable, replaceSfntTable, normalizeVerticalMetrics, buildGaspTable, GASP_DOGRAY } from './sfnt.js'
import { buildTofuCmapTable } from './cmap.js'

export interface TofuOptions {
  family?: string
  style?: string
  unitsPerEmScale?: number
}

const DEFAULT_SCALE = 100
const QUESTION_MARK_CODEPOINT = 0x3f
/** 0 = .notdef, 1 = the one real glyph — fixed, since this font only ever has these two. */
const QUESTION_MARK_GLYPH_ID = 1

/**
 * Builds a TofuMaker font from `bdfFont`'s own '?' glyph. Unlike build.ts's multi-thousand-glyph
 * pipeline, a single known, important glyph being malformed is a hard failure here, not a
 * soft-findings report — there's nothing else in this font to fall back on.
 */
export function buildTofuFont(bdfFont: BdfFont, opts: TofuOptions = {}): ArrayBuffer {
  const scale = opts.unitsPerEmScale ?? DEFAULT_SCALE
  const pixelSize = bdfFont.pointSize
  const unitsPerEm = pixelSize * scale

  const family = opts.family ?? String(bdfFont.properties.FAMILY_NAME ?? 'Untitled')
  const style = opts.style ?? String(bdfFont.properties.WEIGHT_NAME ?? 'Regular')
  const ascent = Math.round(Number(bdfFont.properties.FONT_ASCENT ?? pixelSize) * scale)
  const descent = -Math.round(Number(bdfFont.properties.FONT_DESCENT ?? 0) * scale)

  const questionMarkGlyph = bdfFont.glyphs.find((g) => g.encoding === QUESTION_MARK_CODEPOINT)
  if (!questionMarkGlyph) {
    throw new Error(`this BDF has no '?' (U+003F) glyph — can't build a TofuMaker font without one to build it from`)
  }

  const issues: string[] = []
  let glyph: SvgGlyphSpec
  try {
    glyph = buildGlyphUnsafe(questionMarkGlyph, scale, issues, new Map())
  } catch (e) {
    const reason = e instanceof DegenerateContourError ? e.message : `tracing failed: ${(e as Error).message}`
    throw new Error(`'?' glyph can't be traced, refusing to build a TofuMaker font from it: ${reason}`)
  }
  if (issues.length > 0) {
    throw new Error(`'?' glyph has issues, refusing to build a TofuMaker font from it: ${issues.join('; ')}`)
  }

  // .notdef gets the same '?' shape as the one real glyph — belt-and-suspenders. The format-13
  // cmap below already covers every valid codepoint, so glyph index 0 should never actually be
  // reached in practice, but there's no reason to leave it blank when we have the shape anyway.
  const baseBuffer = svgFontToTtf({
    familyName: family,
    styleName: style,
    unitsPerEm,
    ascent,
    descent,
    missingGlyphAdvanceWidth: glyph.advanceWidth,
    missingGlyphD: glyph.d,
    glyphs: [glyph],
  })

  const normalized = normalizeVerticalMetrics(baseBuffer, ascent, descent)

  const withGasp = insertSfntTable(normalized, 'gasp', buildGaspTable([{ maxPpem: 0xffff, behavior: GASP_DOGRAY }]))

  const cmap = buildTofuCmapTable(QUESTION_MARK_GLYPH_ID)
  return replaceSfntTable(withGasp, 'cmap', cmap)
}
