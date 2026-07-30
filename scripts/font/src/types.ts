export interface Bbx {
  w: number
  h: number
  xoff: number
  yoff: number
}

export interface BdfGlyph {
  name: string
  /** Unicode codepoint, or -1 for an unencoded glyph (BDF spec allows this, we don't produce it). */
  encoding: number
  swidth: [number, number]
  dwidth: [number, number]
  bbx: Bbx
  /** bbx.h rows x bbx.w cols, row 0 = top. 1 = ink, 0 = background. */
  bitmap: number[][]
  /** Present when this glyph's bitmap was pulled in via `merge` from a fallback source. */
  source?: 'fallback'
}

export type BdfPropertyValue = string | number

export interface BdfFont {
  /** The XLFD string from the FONT line, kept verbatim for round-tripping. */
  fontXlfd: string
  /** SIZE pointSize xres yres */
  pointSize: number
  xres: number
  yres: number
  fontBoundingBox: Bbx
  /** STARTPROPERTIES block, quoted values kept as strings, bare tokens parsed as numbers. */
  properties: Record<string, BdfPropertyValue>
  glyphs: BdfGlyph[]
}

export interface Point {
  x: number
  y: number
}

/** A closed polygon contour in raster (pixel-index) space, not yet scaled to font units. */
export type Contour = Point[]

export interface GlyphContours {
  contours: Contour[]
}
