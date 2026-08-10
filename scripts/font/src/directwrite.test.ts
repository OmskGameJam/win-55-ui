import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { createFace, destroyFace, glyphExists, renderGlyph } from './directwrite.js'
import { srcFontDir } from './paths.js'

const sourceTtf = resolve(srcFontDir, 'liberation_sans', 'LiberationSans-Regular.ttf')

test('createFace/destroyFace: a face can be created, used, and cleanly released', () => {
  const face = createFace(sourceTtf, 12)
  assert.equal(face.pixelSize, 12)
  assert.ok(face.designUnitsPerEm > 0, 'designUnitsPerEm must be read from the real font')
  destroyFace(face)
})

test('glyphExists is true for a codepoint the font supports and false otherwise', () => {
  const face = createFace(sourceTtf, 12)
  assert.equal(glyphExists(face, 'A'.codePointAt(0)!), true)
  assert.equal(glyphExists(face, 0x1f600), false) // an emoji Liberation Sans doesn't have
  destroyFace(face)
})

test('renderGlyph produces a strictly bilevel bitmap matching its own reported width/height', () => {
  const face = createFace(sourceTtf, 12)
  const g = renderGlyph(face, 'A'.codePointAt(0)!)

  assert.equal(g.height, g.pixels.length)
  if (g.height > 0) assert.equal(g.width, g.pixels[0].length)

  for (const row of g.pixels) {
    for (const v of row) assert.ok(v === 0 || v === 255, 'DirectWrite ALIASED texture must be strictly bilevel (0 or 255)')
  }

  assert.ok(Number.isInteger(g.freetype.advance.x), 'advance must round to an integer device pixel count')
  destroyFace(face)
})

test('renderGlyph handles a blank glyph (space) as a zero-size bitmap with a real advance', () => {
  const face = createFace(sourceTtf, 12)
  const g = renderGlyph(face, ' '.codePointAt(0)!)
  assert.equal(g.width, 0)
  assert.equal(g.height, 0)
  assert.deepEqual(g.pixels, [])
  assert.ok(g.freetype.advance.x > 0, 'space must still have a positive advance width')
  destroyFace(face)
})

test('renderGlyph correctly reports descender depth (bitmap_top < height) for a descending glyph', () => {
  const face = createFace(sourceTtf, 12)
  const g = renderGlyph(face, 'g'.codePointAt(0)!)
  assert.ok(g.y < g.height, "'g' must dip below the baseline: bitmap_top should be less than the total glyph height")
  destroyFace(face)
})

test("regression: 'S' at 12px renders without the stray-pixel artifact FreeType produces on this font", () => {
  // The whole reason this backend exists: FreeType (any hinting mode/interpreter version tested)
  // renders the second-to-last row of 'S' as "#...##" (an extra, asymmetric pixel) on this font at
  // this size; DirectWrite's ALIASED mode renders the clean, symmetric "#....#" instead - verified
  // against a real Windows app (Aseprite, via Skia's DirectWrite backend) rendering the same glyph
  // clean. See FONTS.md for the full investigation.
  const face = createFace(sourceTtf, 12)
  const g = renderGlyph(face, 'S'.codePointAt(0)!)

  const secondToLastRow = g.pixels[g.pixels.length - 2]
  const rowStr = secondToLastRow.map((v) => (v ? '#' : '.')).join('')
  assert.equal(rowStr, '#....#', `expected the clean symmetric row, got "${rowStr}"`)
  destroyFace(face)
})
