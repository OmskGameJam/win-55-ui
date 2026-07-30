import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import opentype from 'opentype.js'
import { buildTtf } from './build.js'
import { rasterizeFont } from './rasterize.js'
import { srcFontDir } from './paths.js'
import type { BdfFont } from './types.js'

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

test('buildTtf produces a font whose glyph geometry lands exactly on the pixel grid', () => {
  const font = fixtureFont([
    {
      name: 'X',
      encoding: 'X'.codePointAt(0)!,
      swidth: [0, 0],
      dwidth: [3, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    },
  ])

  const { buffer, report } = buildTtf(font, { family: 'Fixture', style: 'Regular' })

  assert.deepEqual(report.flagged, [])
  assert.equal(report.glyphCount, 1)

  const reparsed = opentype.parse(buffer)
  const glyph = reparsed.charToGlyph('X')
  const bbox = glyph.getBoundingBox()

  assert.deepEqual([bbox.x1, bbox.y1, bbox.x2, bbox.y2], [0, 0, 200, 200])
  assert.equal(glyph.advanceWidth, 300)
  assert.equal(reparsed.unitsPerEm, 1000)
})

test('buildTtf sets USE_TYPO_METRICS so browsers size line boxes from our exact ascender/descender', () => {
  // Without this OS/2 fsSelection bit, browsers by default fall back to usWinAscent/usWinDescent,
  // which opentype.js auto-computes from the actual glyph ink extents of whatever's in the built
  // font — not from the ascender/descender we pass in. That mismatch is what caused rendered text
  // to sit visibly offset from the top of its line box at `line-height: 1`, regardless of how
  // exactly ascender+descender summed to unitsPerEm.
  const font = fixtureFont([
    {
      name: 'X',
      encoding: 88,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    },
  ])

  const { buffer } = buildTtf(font)
  const reparsed = opentype.parse(buffer)

  const USE_TYPO_METRICS = 0x0080
  assert.ok(
    (Number(reparsed.tables.os2.fsSelection) & USE_TYPO_METRICS) !== 0,
    'OS/2 fsSelection must have the USE_TYPO_METRICS bit set',
  )
})

test('buildTtf writes a gasp table requesting grayscale rendering across the full ppem range', () => {
  // This is what actually lets Windows render our already-grid-aligned, hint-less glyf outlines
  // with zero antialiasing bleed — matches the old hand-made fonts' gasp table exactly. svg2ttf
  // (the library producing our glyf/loca output) doesn't write a gasp table on its own, so
  // build.ts splices one in afterward; this test guards that splice actually landing in the
  // final bytes, not just build.ts calling the function.
  const font = fixtureFont([
    {
      name: 'X',
      encoding: 88,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    },
  ])

  const { buffer } = buildTtf(font)
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  const numTables = view.getUint16(4)

  let gaspOffset = -1
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16
    const tag = String.fromCharCode(bytes[rec], bytes[rec + 1], bytes[rec + 2], bytes[rec + 3])
    if (tag === 'gasp') gaspOffset = view.getUint32(rec + 8)
  }

  assert.ok(gaspOffset >= 0, 'gasp table must be present')
  assert.equal(view.getUint16(gaspOffset), 0, 'gasp version')
  assert.equal(view.getUint16(gaspOffset + 2), 1, 'gasp numRanges')
  assert.equal(view.getUint16(gaspOffset + 4), 0xffff, 'range covers the full ppem range')
  assert.equal(view.getUint16(gaspOffset + 6), 0x0002, 'DOGRAY behavior flag')
})

test('buildTtf output is real glyf/loca TrueType, not CFF', () => {
  // opentype.js's own writer can only produce CFF-flavored OpenType — this is the whole reason
  // build.ts moved to svg2ttf. Guard against silently regressing back to CFF output.
  const font = fixtureFont([
    {
      name: 'X',
      encoding: 88,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    },
  ])

  const { buffer } = buildTtf(font)
  const reparsed = opentype.parse(buffer)
  assert.equal(reparsed.outlinesFormat, 'truetype')
})

test('a hard per-glyph error is skipped, not fatal — the rest of the font still builds', () => {
  // Simulates a corrupted/hand-edited glyph (e.g. a stray null row) that makes the tracer
  // throw. This should never happen for any glyph produced by our own bdf.ts parser, but a
  // hand-edited BDF is fair game — one broken glyph must not take the whole build down.
  const font = fixtureFont([
    {
      name: 'A',
      encoding: 65,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [
        [1, 1],
        [1, 1],
      ],
    },
    {
      name: 'corrupted',
      encoding: 66,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 },
      bitmap: [null, [1, 1]] as unknown as number[][], // malformed row -> throws mid-trace
    },
  ])

  const { buffer, report } = buildTtf(font)

  assert.equal(report.skipped.length, 1)
  assert.equal(report.skipped[0].name, 'corrupted')
  assert.match(report.skipped[0].issues[0], /tracing failed/)
  assert.equal(report.glyphCount, 1, 'only the good glyph counts toward the built font')

  const reparsed = opentype.parse(buffer)
  assert.ok(reparsed.charToGlyphIndex('A') !== 0, 'the good glyph is present in the built font')
  assert.equal(reparsed.charToGlyphIndex(String.fromCodePoint(66)), 0, 'the corrupted glyph has no cmap entry at all')
})

test('a bitmap/BBX dimension mismatch is a soft finding, not a build failure', () => {
  const font = fixtureFont([
    {
      name: 'bad',
      encoding: 66,
      swidth: [0, 0],
      dwidth: [2, 0],
      bbx: { w: 2, h: 2, xoff: 0, yoff: 0 }, // declares 2x2...
      bitmap: [[1]], // ...but the actual bitmap is 1x1
    },
  ])

  const { buffer, report } = buildTtf(font)

  assert.ok(buffer.byteLength > 0, 'font is still built despite the soft finding')
  assert.equal(report.flagged.length, 1)
  assert.match(report.flagged[0].issues[0], /bitmap dimensions/)
})

test('duplicate encodings across glyphs are flagged', () => {
  const glyph = (name: string): BdfFont['glyphs'][number] => ({
    name,
    encoding: 88,
    swidth: [0, 0],
    dwidth: [2, 0],
    bbx: { w: 1, h: 1, xoff: 0, yoff: 0 },
    bitmap: [[1]],
  })

  const font = fixtureFont([glyph('X'), glyph('X.dup')])
  const { report } = buildTtf(font)

  const dupIssue = report.flagged.find((f) => f.name === 'X.dup')
  assert.ok(dupIssue, 'the second glyph with the same encoding must be flagged')
  assert.match(dupIssue!.issues[0], /duplicate encoding/)
})

test('end to end: rasterizing a real source font and building it produces clean, grid-aligned output', async () => {
  const sourceTtf = resolve(srcFontDir, 'liberation_sans', 'LiberationSans-Regular.ttf')
  const bdfFont = await rasterizeFont(sourceTtf, 12, { charset: 'AoBg%i abc123' })

  const { buffer, report } = buildTtf(bdfFont, { family: 'E2E', style: 'Regular' })

  assert.deepEqual(report.flagged, [], `unexpected flagged glyphs: ${JSON.stringify(report.flagged)}`)

  const reparsed = opentype.parse(buffer)
  assert.equal(reparsed.unitsPerEm, 1200) // 12px * scale 100

  for (const bdfGlyph of bdfFont.glyphs) {
    const glyph = reparsed.charToGlyph(String.fromCodePoint(bdfGlyph.encoding))

    assert.equal(glyph.advanceWidth, bdfGlyph.dwidth[0] * 100, `${bdfGlyph.name}: advance width`)

    const inkCount = bdfGlyph.bitmap.reduce((sum, row) => sum + row.filter((v) => v === 1).length, 0)
    if (inkCount === 0) continue // e.g. space: empty path, opentype.js's bbox is a meaningless default

    const bbox = glyph.getBoundingBox()
    assert.deepEqual(
      [bbox.x1, bbox.y1, bbox.x2, bbox.y2],
      [
        bdfGlyph.bbx.xoff * 100,
        bdfGlyph.bbx.yoff * 100,
        (bdfGlyph.bbx.xoff + bdfGlyph.bbx.w) * 100,
        (bdfGlyph.bbx.yoff + bdfGlyph.bbx.h) * 100,
      ],
      `${bdfGlyph.name}: bounding box`,
    )
  }
})
