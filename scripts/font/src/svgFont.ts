import svg2ttf from 'svg2ttf'
import type { Bbx, Contour } from './types.js'

/**
 * Serializes one glyph's traced contours to an SVG path `d` string in font-unit, y-up,
 * baseline-relative coordinates — the same transform build.ts previously fed to opentype.js's
 * Path (moveTo/lineTo/close), just emitted as SVG path commands instead. Straight lines only:
 * our contours never have curves, so every point is an on-curve `L`.
 */
export function contourToSvgPath(contours: Contour[], bbx: Bbx, scale: number): string {
  const toFont = (p: { x: number; y: number }) => ({
    x: (bbx.xoff + p.x) * scale,
    y: (bbx.yoff + bbx.h - p.y) * scale,
  })

  return contours
    .map((contour) => {
      const points = contour.map(toFont)
      const [first, ...rest] = points
      const line = rest.map((p) => `L${p.x},${p.y}`).join(' ')
      return `M${first.x},${first.y} ${line} Z`
    })
    .join(' ')
}

export interface SvgGlyphSpec {
  name: string
  unicode: number
  advanceWidth: number
  /** SVG path 'd' string in font-unit coordinates, or '' for a blank glyph (e.g. space). */
  d: string
}

export interface SvgFontSpec {
  familyName: string
  styleName: string
  unitsPerEm: number
  ascent: number
  /** Negative, per OpenType convention. */
  descent: number
  missingGlyphAdvanceWidth: number
  glyphs: SvgGlyphSpec[]
}

function escapeXmlAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function buildSvgFontXml(spec: SvgFontSpec): string {
  const glyphElements = spec.glyphs
    .map((g) => {
      const unicodeAttr = escapeXmlAttr(String.fromCodePoint(g.unicode))
      const nameAttr = escapeXmlAttr(g.name)
      return `<glyph unicode="${unicodeAttr}" glyph-name="${nameAttr}" horiz-adv-x="${g.advanceWidth}" d="${g.d}" />`
    })
    .join('\n')

  return [
    '<?xml version="1.0" standalone="no"?>',
    '<svg xmlns="http://www.w3.org/2000/svg">',
    '<defs>',
    `<font id="${escapeXmlAttr(spec.familyName)}" horiz-adv-x="${spec.unitsPerEm}">`,
    `<font-face font-family="${escapeXmlAttr(spec.familyName)}" font-style="${escapeXmlAttr(spec.styleName)}" units-per-em="${spec.unitsPerEm}" ascent="${spec.ascent}" descent="${spec.descent}" />`,
    `<missing-glyph horiz-adv-x="${spec.missingGlyphAdvanceWidth}" />`,
    glyphElements,
    '</font>',
    '</defs>',
    '</svg>',
  ].join('\n')
}

export function svgFontToTtf(spec: SvgFontSpec): ArrayBuffer {
  const xml = buildSvgFontXml(spec)
  const result = svg2ttf(xml, { familyname: spec.familyName, subfamilyname: spec.styleName })
  const bytes = result.buffer
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}
