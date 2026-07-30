import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseBdf, writeBdf } from './bdf.js'
import { fixturesDir } from './paths.js'

function glyph(font: ReturnType<typeof parseBdf>, name: string) {
  const g = font.glyphs.find((g) => g.name === name)
  assert.ok(g, `glyph ${name} not found`)
  return g
}

function bitmapToHex(bitmap: number[][]): string[] {
  return bitmap.map((row) => {
    const bytesPerRow = Math.ceil(row.length / 8)
    let value = 0
    for (let x = 0; x < row.length; x++) {
      if (row[x]) value |= 1 << (bytesPerRow * 8 - 1 - x)
    }
    return value.toString(16).toUpperCase().padStart(bytesPerRow * 2, '0')
  })
}

test('parseBdf reads the real LiberationSans-Regular-12.bdf sample correctly', () => {
  const text = readFileSync(resolve(fixturesDir, 'liberation-sans-regular-12-fontforge-original.bdf'), 'utf8')
  const font = parseBdf(text)

  assert.equal(font.pointSize, 12)
  assert.equal(font.xres, 75)
  assert.equal(font.yres, 75)
  assert.equal(font.properties.FONT_ASCENT, 10)
  assert.equal(font.properties.FONT_DESCENT, 2)
  assert.equal(font.properties.FAMILY_NAME, 'Liberation Sans')
  assert.equal(font.glyphs.length, 682)

  const space = glyph(font, 'space')
  assert.equal(space.encoding, 32)
  assert.deepEqual(space.dwidth, [3, 0])
  assert.deepEqual(space.bbx, { w: 1, h: 1, xoff: 0, yoff: 0 })
  assert.deepEqual(bitmapToHex(space.bitmap), ['00'])

  const a = glyph(font, 'A')
  assert.equal(a.encoding, 65)
  assert.deepEqual(a.dwidth, [8, 0])
  assert.deepEqual(a.bbx, { w: 7, h: 9, xoff: 0, yoff: 0 })
  assert.deepEqual(bitmapToHex(a.bitmap), ['10', '28', '28', '28', '44', '7C', '44', '82', '82'])

  const o = glyph(font, 'o')
  assert.deepEqual(o.bbx, { w: 5, h: 7, xoff: 1, yoff: 0 })
  assert.deepEqual(bitmapToHex(o.bitmap), ['70', '88', '88', '88', '88', '88', '70'])

  const percent = glyph(font, 'percent')
  assert.deepEqual(percent.bbx, { w: 9, h: 9, xoff: 1, yoff: 0 })
  assert.deepEqual(
    bitmapToHex(percent.bitmap),
    ['6200', '9200', '9400', '9800', '6B00', '1480', '1480', '2480', '2300'],
  )
})

test('writeBdf/parseBdf round-trips the real sample losslessly', () => {
  const text = readFileSync(resolve(fixturesDir, 'liberation-sans-regular-12-fontforge-original.bdf'), 'utf8')
  const font = parseBdf(text)
  const reparsed = parseBdf(writeBdf(font))

  assert.equal(reparsed.glyphs.length, font.glyphs.length)
  assert.deepEqual(reparsed.properties, font.properties)
  assert.deepEqual(reparsed.fontBoundingBox, font.fontBoundingBox)

  for (let i = 0; i < font.glyphs.length; i++) {
    assert.deepEqual(reparsed.glyphs[i], font.glyphs[i], `glyph ${font.glyphs[i].name} mismatch after round-trip`)
  }
})
