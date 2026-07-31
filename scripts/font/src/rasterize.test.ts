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
  // build.ts uses this sum as the TTF's hhea/sTypo ascender+descender, which is what a browser
  // sizes the line box from at `line-height: 1` — any shortfall becomes leftover CSS leading and
  // shifts the whole strike down by that many pixels instead of sitting flush with the line box top.
  for (const pixelSize of [10, 12, 16, 24]) {
    const font = await rasterizeFont(sourceTtf, pixelSize, { charset: 'A' })
    assert.equal(
      Number(font.properties.FONT_ASCENT) + Number(font.properties.FONT_DESCENT),
      pixelSize,
      `pixelSize ${pixelSize}: FONT_ASCENT (${font.properties.FONT_ASCENT}) + FONT_DESCENT (${font.properties.FONT_DESCENT}) must equal pixelSize`,
    )
  }
})

test('rasterizeFont derives FONT_ASCENT/FONT_DESCENT from real rasterized ink, not the source font\'s raw ascender ratio', async () => {
  // Regression: Liberation Sans's raw hhea.ascender/unitsPerEm ratio rounds to an 11/1 split at
  // 12px, but the real rasterized ink of basic Latin (max ascent from 'A', max descent from 'Q'/
  // 'g'/'y'/'p'/',') only needs 9/2 — the old hand-made font used exactly 10/2 (9 real + 1px slack
  // put into ascent, 2 real + 0 slack into descent). If this drifts back to 11/1, descenders sit
  // a full pixel below the declared line box at `line-height: 1`.
  const font = await rasterizeFont(sourceTtf, 12)
  assert.equal(font.properties.FONT_ASCENT, 10)
  assert.equal(font.properties.FONT_DESCENT, 2)

  const fontDescent = Number(font.properties.FONT_DESCENT)
  const fontAscent = Number(font.properties.FONT_ASCENT)
  for (const ch of [...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']) {
    const glyph = font.glyphs.find((g) => g.encoding === ch.codePointAt(0))
    if (!glyph) continue
    assert.ok(-glyph.bbx.yoff <= fontDescent, `'${ch}': ink extends ${-glyph.bbx.yoff}px below baseline, past the declared FONT_DESCENT (${fontDescent}px)`)
    assert.ok(glyph.bbx.yoff + glyph.bbx.h <= fontAscent, `'${ch}': ink extends ${glyph.bbx.yoff + glyph.bbx.h}px above baseline, past the declared FONT_ASCENT (${fontAscent}px)`)
  }
})

test('rasterizeFont leaves FreeType bearings untouched unless --generate-kerning is requested', async () => {
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'o' })
  const o = font.glyphs[0]

  // Regression guard for the "fall back to exact pre-session behavior" contract: 'o' at 12px has
  // a real FreeType left bearing (historically BBX xoff 1) - if this drifts to 0 by default, the
  // opt-in flag has silently become the default again.
  assert.notEqual(o.bbx.xoff, 0, `o: default (no --generate-kerning) must keep FreeType's own left bearing`)
})

test('rasterizeFont, with generateKerning, zeroes the left bearing and derives the right gap from rightmost-column ink', async () => {
  // Independent re-derivation of the auto-kerning rule (not a re-export of rasterize.ts's private
  // helper) so this actually checks the contract, not just "the two implementations agree".
  function expectedRightGap(codepoint: number, bitmap: number[][], width: number): number {
    const rightmostInk = [...Array(width).keys()]
      .reverse()
      .find((x) => bitmap.some((row) => row[x] === 1))

    if (rightmostInk === undefined) return 3 // no ink anywhere - blank-glyph gap always wins
    if (!/\p{Alphabetic}/u.test(String.fromCodePoint(codepoint))) return 1 // flatRightSideGap default, see dedicated test below

    const inkInColumn = bitmap.reduce((n, row) => n + (row[rightmostInk] === 1 ? 1 : 0), 0)
    return inkInColumn <= 1 ? 0 : 1
  }

  // Includes Cyrillic (Ж) and Greek (Ω) letters alongside Latin - the alphabetic check must cover
  // every script Liberation Sans supports, not just Latin.
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'AoBg%i Ж Ω', generateKerning: true })
  assert.ok(font.glyphs.length >= 8)

  for (const glyph of font.glyphs) {
    assert.equal(glyph.bbx.xoff, 0, `${glyph.name}: left bearing must always be zeroed`)
    assert.equal(
      glyph.dwidth[0],
      glyph.bbx.w + expectedRightGap(glyph.encoding, glyph.bitmap, glyph.bbx.w),
      `${glyph.name}: DWIDTH must equal bitmap width + auto-kerned right gap`,
    )
  }
})

test('rasterizeFont, with generateKerning, always gives non-alphabetic glyphs the flat gap, bypassing the ink heuristic', async () => {
  // Regression for hyphens/math operators: a hyphen is a thin, uniform-width stroke across its
  // *entire* bitmap, not just at a tapering edge like a letter's tail - so on its own, the
  // ink-column heuristic misreads it as a "tail" and starves it of a right gap.
  const font = await rasterizeFont(sourceTtf, 12, {
    charset: '-+=.,',
    generateKerning: true,
    tailRightSideGap: 0,
    flatRightSideGap: 4,
  })

  assert.ok(font.glyphs.length >= 5)
  for (const glyph of font.glyphs) {
    assert.equal(glyph.dwidth[0], glyph.bbx.w + 4, `${glyph.name}: non-alphabetic glyphs must always get the flat gap, not the tail gap`)
  }
})

test('rasterizeFont auto-kerning respects custom rightSideCount/rightSideVolume/gap overrides', async () => {
  // A huge rightSideVolume means "every non-blank glyph reads as a tail" - isolates the gap
  // parameters from the volume/count thresholds so this doesn't just re-check the defaults.
  const font = await rasterizeFont(sourceTtf, 12, {
    charset: 'Ao ',
    generateKerning: true,
    rightSideCount: 3,
    rightSideVolume: 1000,
    flatRightSideGap: 9,
    tailRightSideGap: 5,
  })

  for (const glyph of font.glyphs) {
    const inkCount = glyph.bitmap.flat().filter((v) => v === 1).length
    const expectedGap = inkCount === 0 ? 3 : 5 // blank glyphs always get the hardcoded gap of 3
    assert.equal(glyph.dwidth[0], glyph.bbx.w + expectedGap, `${glyph.name}: expected tailRightSideGap (or the blank-glyph gap) to apply`)
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
