import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { traceGlyphContours, signedArea } from '../src/contours.js'
import { rasterizeFont } from '../src/rasterize.js'
import { srcFontDir } from '../src/paths.js'

const sourceTtf = resolve(srcFontDir, 'liberation_sans', 'LiberationSans-Regular.ttf')

function inkPixelCount(bitmap: number[][]): number {
  return bitmap.reduce((sum, row) => sum + row.filter((v) => v !== 0).length, 0)
}

/** The exact invariant build.ts's self-check relies on: contour areas sum to the ink pixel count. */
function assertAreaInvariant(bitmap: number[][], contours: ReturnType<typeof traceGlyphContours>) {
  const total = contours.reduce((sum, c) => sum + signedArea(c), 0)
  assert.equal(total, inkPixelCount(bitmap), 'sum of signed contour areas must equal the ink pixel count')
}

test('single isolated pixel produces one positive-area square contour', () => {
  const bitmap = [[1]]
  const contours = traceGlyphContours(bitmap)

  assert.equal(contours.length, 1)
  assert.equal(contours[0].length, 4)
  assert.equal(signedArea(contours[0]), 1)
  assertAreaInvariant(bitmap, contours)
})

test('a ring with a hole produces one outer and one hole contour of opposite sign', () => {
  const bitmap = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ]
  const contours = traceGlyphContours(bitmap)

  assert.equal(contours.length, 2)

  const areas = contours.map(signedArea).sort((a, b) => a - b)
  assert.equal(areas[0], -1) // the hole
  assert.equal(areas[1], 9) // outer 3x3 perimeter, unaffected by the missing center pixel

  assertAreaInvariant(bitmap, contours)
})

test('two pixels touching only at a corner trace as two separate simple contours', () => {
  const bitmap = [
    [1, 0],
    [0, 1],
  ]
  const contours = traceGlyphContours(bitmap)

  assert.equal(contours.length, 2, 'diagonal touch must not fuse into one self-crossing loop')
  for (const c of contours) {
    assert.equal(c.length, 4, 'each isolated pixel is a simple 4-point square')
    assert.equal(signedArea(c), 1)
  }
  assertAreaInvariant(bitmap, contours)
})

test('a dot-and-stem glyph (like "i") produces two disconnected contours', () => {
  const bitmap = [[1], [0], [1], [1], [1]] // dot, gap, 3px stem
  const contours = traceGlyphContours(bitmap)

  assert.equal(contours.length, 2)

  const areas = contours.map(signedArea).sort((a, b) => a - b)
  assert.deepEqual(areas, [1, 3]) // dot area 1, stem area 3

  assertAreaInvariant(bitmap, contours)
})

test('a fully empty bitmap produces no contours', () => {
  const bitmap = [
    [0, 0],
    [0, 0],
  ]
  assert.deepEqual(traceGlyphContours(bitmap), [])
})

test('real 12px glyphs trace soundly, even where thin strokes only touch diagonally', async () => {
  // At 12px, LiberationSans-Regular's hinted 'o'/'B' rings are exactly 1px thick and their
  // sides touch only at pixel corners (not edges) — so under strict 4-connectivity they
  // decompose into several disjoint simple contours rather than one outer+hole pair. That's
  // correct, not a bug: the union of disjoint positive contours rasterizes to the identical
  // pixel coverage a ring-with-hole would. This test locks in that the tracer stays sound
  // (no degenerate contours, area invariant holds) on this real, structurally tricky data.
  const font = await rasterizeFont(sourceTtf, 12, { charset: 'AoBeg%' })

  for (const name of ['A', 'o', 'percent', 'B', 'e', 'g']) {
    const glyph = font.glyphs.find((g) => g.name === name)
    assert.ok(glyph, `glyph ${name} not found`)

    const contours = traceGlyphContours(glyph!.bitmap)

    for (const c of contours) {
      assert.ok(c.length >= 4, `${name}: every contour must be a simple polygon`)
      assert.notEqual(signedArea(c), 0, `${name}: no degenerate zero-area contour`)
    }
    assertAreaInvariant(glyph!.bitmap, contours)
  }
})

test('real 24px glyphs (thick enough strokes to form genuine rings) produce true hole contours', async () => {
  const font = await rasterizeFont(sourceTtf, 24, { charset: 'oBeg' })

  for (const name of ['o', 'B', 'e', 'g']) {
    const glyph = font.glyphs.find((g) => g.name === name)!
    const contours = traceGlyphContours(glyph.bitmap)

    assert.ok(contours.some((c) => signedArea(c) < 0), `${name}: expected at least one hole contour`)
    assertAreaInvariant(glyph.bitmap, contours)
  }
})

test('percent-shaped glyph with two separate holed circles and a bar stays topologically sound', () => {
  // Mirrors the real 'percent' glyph's shape class: two ring blobs (each with a hole)
  // plus a disconnected diagonal bar, some pixels only diagonally adjacent.
  const bitmap = [
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ]
  const contours = traceGlyphContours(bitmap)

  // Whatever the exact decomposition, every contour must be a valid simple polygon
  // (at least 4 points, nonzero area) and the area invariant must hold exactly.
  for (const c of contours) {
    assert.ok(c.length >= 4, 'every contour must be a simple polygon')
    assert.notEqual(signedArea(c), 0, 'no degenerate zero-area contour')
  }
  assertAreaInvariant(bitmap, contours)
})
