import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { rasterizeFont } from './rasterize.js'
import { traceGlyphContours, signedArea } from './contours.js'
import { srcFontDir } from './paths.js'

const sourceTtf = resolve(srcFontDir, 'liberation_sans', 'LiberationSans-Regular.ttf')

test('rasterizeFont produces strict bilevel glyphs with sane metrics and traceable contours', async () => {
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'AoBg%i ' })

  assert.ok(font.glyphs.length >= 6)

  for (const glyph of font.glyphs) {
    for (const row of glyph.bitmap) {
      for (const v of row) {
        assert.ok(v === 0 || v === 1, `${glyph.name}: bitmap must be strictly bilevel`)
      }
    }

    assert.ok(Number.isInteger(glyph.dwidth[0]), `${glyph.name}: DWIDTH must be an integer`)
    assert.equal(glyph.bbx.h, glyph.bitmap.length)
    if (glyph.bitmap.length > 0) assert.equal(glyph.bbx.w, glyph.bitmap[0].length)

    // Feeds straight into the contour tracer without throwing, and the area invariant holds —
    // this is the real end-to-end join point between the rasterize and build stages.
    const contours = traceGlyphContours(glyph.bitmap)
    const inkCount = glyph.bitmap.flat().filter((v) => v === 1).length
    const areaSum = contours.reduce((sum, c) => sum + signedArea(c), 0)
    assert.equal(areaSum, inkCount, `${glyph.name}: contour area sum must equal ink pixel count`)
  }
})

test('rasterizeFont makes FONT_ASCENT + FONT_DESCENT sum exactly to pixelSize, for every size', async () => {
  // Regression: independently rounding ascent/descent from the source font's design-unit metrics
  // can leave a 1px shortfall, which build.ts turns into leftover CSS line-height leading — the
  // whole strike renders shifted down by that many pixels at `line-height: 1` instead of sitting
  // flush with the top of its line box.
  for (const pixelSize of [10, 12, 16, 24]) {
    const font = await rasterizeFont(sourceTtf, pixelSize, { charset: 'A' })
    assert.equal(
      Number(font.properties.FONT_ASCENT) + Number(font.properties.FONT_DESCENT),
      pixelSize,
      `pixelSize ${pixelSize}: FONT_ASCENT (${font.properties.FONT_ASCENT}) + FONT_DESCENT (${font.properties.FONT_DESCENT}) must equal pixelSize`,
    )
  }
})

test('rasterizeFont respects an explicit --charset filter', async () => {
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'Ao' })
  const names = font.glyphs.map((g) => g.encoding).sort()
  assert.deepEqual(names, ['A'.codePointAt(0), 'o'.codePointAt(0)].sort())
})

test('rasterizeFont skips codepoints the source font does not support', async () => {
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'A\u{1F600}' }) // A + an emoji Liberation Sans lacks
  assert.deepEqual(
    font.glyphs.map((g) => g.encoding),
    ['A'.codePointAt(0)],
  )
})
