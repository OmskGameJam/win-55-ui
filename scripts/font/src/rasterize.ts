import { readFileSync } from 'node:fs'
import { basename, extname } from 'node:path'
// lv_font_conv doesn't declare package "exports" or types, and its wrapper around the bundled
// FreeType WASM build is CommonJS — reach into it directly rather than going through the
// package's own high-level (file-conversion) CLI, which only exposes a whole-font-to-embedded-
// format pipeline, not raw per-glyph hinted bitmaps.
import { createRequire } from 'node:module'
import opentype from 'opentype.js'
import type { BdfFont, BdfGlyph } from './types.js'

const require = createRequire(import.meta.url)

interface FreetypeFace {
  ptr: number
  font: number
  units_per_em: number
  ascender: number
  descender: number
  height: number
}

interface FreetypeGlyphRender {
  x: number
  y: number
  width: number
  height: number
  advance_x: number
  advance_y: number
  pixels: number[][]
  freetype: {
    advance: { x: number; y: number }
  }
}

interface FreetypeModule {
  init(): Promise<void>
  fontface_create(source: Uint8Array, size: number): FreetypeFace
  fontface_destroy(face: FreetypeFace): void
  glyph_exists(face: FreetypeFace, code: number): boolean
  glyph_render(
    face: FreetypeFace,
    code: number,
    opts: { mono?: boolean; autohint_off?: boolean },
  ): FreetypeGlyphRender
}

const ft: FreetypeModule = require('lv_font_conv/lib/freetype')

let ftInitialized = false

async function ensureFreetypeInit(): Promise<void> {
  if (!ftInitialized) {
    await ft.init()
    ftInitialized = true
  }
}

export type Hinting = 'native' | 'auto'

export interface RasterizeOptions {
  /**
   * 'native' uses the font's own hint instructions. Default, because it reproduces the old
   * hand-made BDFs bit-for-bit for Liberation Sans (verified against LiberationSans-Regular-12.bdf's
   * 'a' and 'o' — FreeType's autohinter measurably thickens stems/corners on this font instead).
   * 'auto' forces FreeType's autohinter instead, for source fonts with poor/no native hints.
   */
  hinting?: Hinting
  /** Restrict rasterization to these characters instead of the source font's full cmap. */
  charset?: string
  /** Family/style label recorded in the BDF header properties (best-effort, informational). */
  family?: string
  style?: string
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

function cmapCodepoints(otFont: opentype.Font): number[] {
  const map = (otFont.tables.cmap as { glyphIndexMap?: Record<string, number> })?.glyphIndexMap ?? {}
  return Object.keys(map)
    .map(Number)
    .filter((cp) => Number.isFinite(cp))
    .sort((a, b) => a - b)
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
  await ensureFreetypeInit()

  const buffer = readFileSync(sourcePath)
  const bytes = new Uint8Array(buffer)

  const otFont = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
  const derived = deriveFamilyStyle(sourcePath)
  const family = opts.family ?? derived.family
  const style = opts.style ?? derived.style

  const codepoints = opts.charset
    ? [...new Set([...opts.charset].map((ch) => ch.codePointAt(0)!))].sort((a, b) => a - b)
    : cmapCodepoints(otFont)

  const face = ft.fontface_create(bytes, pixelSize)
  const autohintOff = (opts.hinting ?? 'native') === 'native'

  const glyphs: BdfGlyph[] = []

  for (const codepoint of codepoints) {
    if (!ft.glyph_exists(face, codepoint)) continue

    const rendered = ft.glyph_render(face, codepoint, { mono: true, autohint_off: autohintOff })

    const nonBilevel = rendered.pixels.flat().some((v) => v !== 0 && v !== 255)
    if (nonBilevel) {
      throw new Error(`rasterizer produced non-bilevel pixels for codepoint U+${codepoint.toString(16)} — expected strict mono output`)
    }

    const bitmap = rendered.pixels.map((row) => row.map((v) => (v ? 1 : 0)))
    const dwidthX = Math.round(rendered.freetype.advance.x)
    const dwidthY = Math.round(rendered.freetype.advance.y)
    const swidthX = Math.round((rendered.advance_x * 1000) / pixelSize)

    glyphs.push({
      name: glyphNameFor(otFont, codepoint),
      encoding: codepoint,
      swidth: [swidthX, 0],
      dwidth: [dwidthX, dwidthY],
      bbx: { w: rendered.width, h: rendered.height, xoff: rendered.x, yoff: rendered.y - rendered.height },
      bitmap,
    })
  }

  ft.fontface_destroy(face)

  // Rounding ascent and descent independently doesn't guarantee they sum back to pixelSize —
  // build.ts uses FONT_ASCENT+FONT_DESCENT as the TTF's hhea ascender/descender, which is what a
  // browser sizes the line box from. Any shortfall there becomes leftover CSS leading, split
  // above and below the glyphs at `line-height: 1` — i.e. the whole strike renders shifted down
  // by that many pixels instead of sitting flush with the top of its line box. Deriving descent
  // from ascent (instead of rounding both separately) makes the sum exact by construction.
  const fontAscent = Math.round((otFont.ascender / otFont.unitsPerEm) * pixelSize)
  const fontDescent = pixelSize - fontAscent

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
