import { test } from 'node:test'
import assert from 'node:assert/strict'
import opentype from 'opentype.js'
import { contourToSvgPath, buildSvgFontXml, svgFontToTtf } from './svgFont.js'
import type { Bbx, Contour } from './types.js'

test('contourToSvgPath maps a single contour to font-unit, y-up, baseline-relative coordinates', () => {
  // A 2x2 ink square starting at the top-left of a 2x2 bbx sitting flush on the baseline.
  const square: Contour = [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 2 },
    { x: 0, y: 2 },
  ]
  const bbx: Bbx = { w: 2, h: 2, xoff: 0, yoff: 0 }

  const d = contourToSvgPath([square], bbx, 100)

  // p.y=0 (top of bitmap) -> yoff+h = 2 rows -> 200 font units (top edge).
  // p.y=2 (bottom of bitmap) -> yoff = 0 -> 0 font units (baseline).
  assert.equal(d, 'M0,200 L200,200 L200,0 L0,0 Z')
})

test('contourToSvgPath joins multiple contours (e.g. an outer ring and a hole) into one path', () => {
  const outer: Contour = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ]
  const hole: Contour = [
    { x: 1, y: 1 },
    { x: 1, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 1 },
  ]
  const bbx: Bbx = { w: 4, h: 4, xoff: 0, yoff: 0 }

  const d = contourToSvgPath([outer, hole], bbx, 1)
  assert.equal(d.match(/Z/g)?.length, 2, 'must contain one closed subpath per contour')
  assert.ok(d.startsWith('M0,4'), 'first contour must come first')
})

test('buildSvgFontXml escapes XML-special characters in glyph unicode and names', () => {
  const xml = buildSvgFontXml({
    familyName: 'Test',
    styleName: 'Regular',
    unitsPerEm: 100,
    missingGlyphAdvanceWidth: 100,
    ascent: 100,
    descent: 0,
    glyphs: [{ name: 'ampersand', unicode: '&'.codePointAt(0)!, advanceWidth: 100, d: 'M0,0 L100,0 L100,100 Z' }],
  })

  assert.match(xml, /unicode="&amp;"/)
  assert.doesNotMatch(xml, /unicode="&"/, 'a bare & would produce invalid XML')
})

test('svgFontToTtf produces a real glyf/loca TrueType font for a codepoint that needs XML escaping', () => {
  const buffer = svgFontToTtf({
    familyName: 'Test',
    styleName: 'Regular',
    unitsPerEm: 400,
    missingGlyphAdvanceWidth: 400,
    ascent: 400,
    descent: 0,
    glyphs: [
      {
        name: 'ampersand',
        unicode: '&'.codePointAt(0)!,
        advanceWidth: 400,
        d: contourToSvgPath(
          [
            [
              { x: 0, y: 0 },
              { x: 4, y: 0 },
              { x: 4, y: 4 },
              { x: 0, y: 4 },
            ],
          ],
          { w: 4, h: 4, xoff: 0, yoff: 0 },
          100,
        ),
      },
    ],
  })

  const parsed = opentype.parse(buffer)
  assert.equal(parsed.outlinesFormat, 'truetype')
  const glyph = parsed.charToGlyph('&')
  const bbox = glyph.getBoundingBox()
  assert.deepEqual([bbox.x1, bbox.y1, bbox.x2, bbox.y2], [0, 0, 400, 400])
})
