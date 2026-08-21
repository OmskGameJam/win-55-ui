import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import opentype from 'opentype.js'
import { buildTofuFont } from '../src/tofu.js'
import { rasterizeFont } from '../src/rasterize.js'
import { srcFontDir } from '../src/paths.js'
import type { BdfFont } from '../src/types.js'

const sourceTtf = resolve(srcFontDir, 'liberation_sans', 'LiberationSans-Regular.ttf')

function fixtureFont(glyphs: BdfFont['glyphs']): BdfFont {
  return {
    fontXlfd: 'test',
    pointSize: 10,
    xres: 75,
    yres: 75,
    fontBoundingBox: { w: 10, h: 10, xoff: 0, yoff: 0 },
    properties: { FAMILY_NAME: 'Test', WEIGHT_NAME: 'Regular', FONT_ASCENT: 8, FONT_DESCENT: 2 },
    glyphs,
  }
}

test('buildTofuFont refuses to build without a ? (U+003F) glyph in the source BDF', () => {
  const font = fixtureFont([
    { name: 'A', encoding: 65, swidth: [0, 0], dwidth: [2, 0], bbx: { w: 2, h: 2, xoff: 0, yoff: 0 }, bitmap: [[1, 1], [1, 1]] },
  ])
  assert.throws(() => buildTofuFont(font), /no '\?' .*U\+003F.* glyph/)
})

test("buildTofuFont fails hard (not a soft finding) on a malformed '?' glyph", () => {
  const font = fixtureFont([
    {
      name: 'question',
      encoding: 0x3f,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [null, [1, 1]] as unknown as number[][], // malformed row -> throws mid-trace
    },
  ])
  assert.throws(() => buildTofuFont(font), /tracing failed/)
})

test('buildTofuFont end to end: a real strike produces a valid TrueType font covering the whole Unicode space', async () => {
  const bdfFont = await rasterizeFont(sourceTtf, 12, { charset: 'A?' })
  const buffer = buildTofuFont(bdfFont, { family: 'TofuTest', style: 'Regular' })

  const parsed = opentype.parse(buffer)
  assert.equal(parsed.outlinesFormat, 'truetype')
  assert.equal(parsed.unitsPerEm, 1200) // 12px * scale 100

  const questionMarkGlyph = bdfFont.glyphs.find((g) => g.encoding === 0x3f)!
  const expectedBbox = [
    questionMarkGlyph.bbx.xoff * 100,
    questionMarkGlyph.bbx.yoff * 100,
    (questionMarkGlyph.bbx.xoff + questionMarkGlyph.bbx.w) * 100,
    (questionMarkGlyph.bbx.yoff + questionMarkGlyph.bbx.h) * 100,
  ]

  // Every one of these - including codepoints nowhere near '?' or each other - must resolve to
  // the exact same glyph, with the exact same shape as the source strike's own '?' glyph.
  const sampleCodepoints = [0x0041, 0x003f, 0x00a9, 0x0400, 0x4e2d, 0xd7ff, 0xe000, 0x1f600, 0x10ffff]
  const glyphIndices = new Set<number>()
  for (const cp of sampleCodepoints) {
    const index = parsed.charToGlyphIndex(String.fromCodePoint(cp))
    assert.notEqual(index, 0, `U+${cp.toString(16)} must resolve to a real glyph, not .notdef`)
    glyphIndices.add(index)

    const glyph = parsed.glyphs.get(index)
    const bbox = glyph.getBoundingBox()
    assert.deepEqual([bbox.x1, bbox.y1, bbox.x2, bbox.y2], expectedBbox, `U+${cp.toString(16)}: must have the '?' glyph's exact shape`)
  }
  assert.equal(glyphIndices.size, 1, 'every sampled codepoint must resolve to the same single glyph')

  // .notdef (glyph 0) also carries the '?' shape as a belt-and-suspenders fallback.
  const notdef = parsed.glyphs.get(0)
  const notdefBbox = notdef.getBoundingBox()
  assert.deepEqual([notdefBbox.x1, notdefBbox.y1, notdefBbox.x2, notdefBbox.y2], expectedBbox)
})
