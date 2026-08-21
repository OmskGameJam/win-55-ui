import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeBdf, summarizeBackfill } from '../src/merge.js'
import type { BdfFont, BdfGlyph } from '../src/types.js'

function glyph(name: string, encoding: number, ink = true): BdfGlyph {
  return {
    name,
    encoding,
    swidth: [0, 0],
    dwidth: [2, 0],
    bbx: { w: 1, h: 1, xoff: 0, yoff: 0 },
    bitmap: [[ink ? 1 : 0]],
  }
}

function font(glyphs: BdfGlyph[], pointSize = 12): BdfFont {
  return {
    fontXlfd: 'test',
    pointSize,
    xres: 75,
    yres: 75,
    fontBoundingBox: { w: 1, h: 1, xoff: 0, yoff: 0 },
    properties: {},
    glyphs,
  }
}

test('backfills a codepoint entirely missing from primary', () => {
  const primary = font([glyph('A', 65)])
  const fallback = font([glyph('A', 65), glyph('B', 66)])

  const { merged, backfilled } = mergeBdf(primary, fallback)

  assert.equal(merged.glyphs.length, 2)
  const b = merged.glyphs.find((g) => g.encoding === 66)
  assert.equal(b?.source, 'fallback')
  assert.deepEqual(backfilled, [{ encoding: 66, char: 'B', fallbackGlyphName: 'B' }])
})

test('does not overwrite an existing non-blank primary glyph', () => {
  const primary = font([glyph('A-primary', 65, true)])
  const fallback = font([glyph('A-fallback', 65, true)])

  const { merged, backfilled } = mergeBdf(primary, fallback)

  assert.equal(merged.glyphs[0].name, 'A-primary')
  assert.equal(backfilled.length, 0)
})

test('backfills an allowlisted blank glyph (space)', () => {
  const primary = font([glyph('space', 32, false)])
  const fallback = font([glyph('space', 32, true)]) // fallback's space happens to have ink, contrived but exercises the path

  const { merged, backfilled } = mergeBdf(primary, fallback)

  assert.equal(merged.glyphs[0].source, 'fallback')
  assert.equal(backfilled.length, 1)
})

test('does NOT backfill a blank glyph outside the allowlist', () => {
  const primary = font([glyph('questiondown', 191, false)]) // blank but not space-like
  const fallback = font([glyph('questiondown', 191, true)])

  const { merged, backfilled } = mergeBdf(primary, fallback)

  assert.equal(merged.glyphs[0].name, 'questiondown')
  assert.equal(merged.glyphs[0].source, undefined)
  assert.equal(backfilled.length, 0)
})

test('--skip excludes a codepoint from backfill even when primary is missing it', () => {
  const primary = font([])
  const fallback = font([glyph('A', 65), glyph('B', 66)])

  const { merged, backfilled } = mergeBdf(primary, fallback, { skip: [66] })

  assert.deepEqual(merged.glyphs.map((g) => g.encoding), [65])
  assert.deepEqual(backfilled.map((b) => b.encoding), [65])
})

test('throws when primary and fallback declare different sizes', () => {
  const primary = font([], 12)
  const fallback = font([], 24)

  assert.throws(() => mergeBdf(primary, fallback), /different sizes/)
})

test('summarizeBackfill collapses contiguous codepoints into ranges', () => {
  const backfilled = [65, 66, 67, 70].map((cp) => ({ encoding: cp, char: String.fromCodePoint(cp), fallbackGlyphName: 'x' }))
  assert.equal(summarizeBackfill(backfilled), 'backfilled 4 glyphs across 2 ranges: U+0041-U+0043, U+0046')
})

test('summarizeBackfill handles zero and singular counts', () => {
  assert.equal(summarizeBackfill([]), 'backfilled 0 glyphs')
  assert.equal(
    summarizeBackfill([{ encoding: 65, char: 'A', fallbackGlyphName: 'A' }]),
    'backfilled 1 glyph across 1 range: U+0041',
  )
})

test('summarizeBackfill caps the console line at 8 ranges for a large sparse backfill', () => {
  // e.g. patching in a few thousand scattered codepoints from a much more complete fallback
  // font — every other codepoint, so nothing collapses into a run — must not spam the console.
  const backfilled = Array.from({ length: 16000 }, (_, i) => ({
    encoding: i * 2, // scattered: no two codepoints are adjacent, so every one is its own "range"
    char: String.fromCodePoint(i * 2),
    fallbackGlyphName: 'x',
  }))

  const summary = summarizeBackfill(backfilled)

  assert.match(summary, /^backfilled 16000 glyphs across 16000 ranges: /)
  assert.match(summary, /\(\+15992 more ranges, use --report for the full list\)$/)
  assert.equal(summary.match(/U\+[0-9A-F]+/g)?.length, 8, 'only 8 ranges printed before the "+N more" suffix')
})
