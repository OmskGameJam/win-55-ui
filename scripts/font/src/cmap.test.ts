import { test } from 'node:test'
import assert from 'node:assert/strict'
import opentype from 'opentype.js'
import svg2ttf from 'svg2ttf'
import { stripCmapFormat4 } from './cmap.js'
import { getSfntTable, replaceSfntTable } from './sfnt.js'

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

function tinySvgFont(): string {
  const unitsPerEm = 400
  const square = 'M0,0 L400,0 L400,400 L0,400 Z'
  return (
    '<?xml version="1.0" standalone="no"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
    `<font id="TestFont" horiz-adv-x="${unitsPerEm}">` +
    `<font-face font-family="TestFont" units-per-em="${unitsPerEm}" ascent="${unitsPerEm}" descent="0" />` +
    `<missing-glyph horiz-adv-x="${unitsPerEm}" />` +
    `<glyph unicode="A" glyph-name="A" horiz-adv-x="${unitsPerEm}" d="${square}" />` +
    `<glyph unicode="B" glyph-name="B" horiz-adv-x="${unitsPerEm}" d="${square}" />` +
    '</font></defs></svg>'
  )
}

function readCmapSubtableFormats(cmapData: Uint8Array): number[] {
  const view = new DataView(cmapData.buffer, cmapData.byteOffset, cmapData.byteLength)
  const numTables = view.getUint16(2)
  const formats: number[] = []
  for (let i = 0; i < numTables; i++) {
    const rec = 4 + i * 8
    const offset = view.getUint32(rec + 4)
    formats.push(view.getUint16(offset))
  }
  return formats
}

test('stripCmapFormat4 removes format 4 subtables and keeps format 0/12 byte-identical', () => {
  const ttf = svg2ttf(tinySvgFont(), {})
  const buffer = toArrayBuffer(ttf.buffer)
  const cmap = getSfntTable(buffer, 'cmap')!

  // svg2ttf always builds this exact directory shape: two format-4 headers, two format-12
  // headers (sharing one subtable), one format-0 header.
  assert.deepEqual(readCmapSubtableFormats(cmap), [4, 12, 0, 4, 12])

  const stripped = stripCmapFormat4(cmap)
  const formats = readCmapSubtableFormats(stripped)
  assert.deepEqual(formats, [12, 0, 12], 'both format-4 headers must be gone, others kept in order')
})

test('stripCmapFormat4 is a no-op when there is nothing to strip', () => {
  const ttf = svg2ttf(tinySvgFont(), {})
  const cmap = getSfntTable(toArrayBuffer(ttf.buffer), 'cmap')!
  const stripped = stripCmapFormat4(stripCmapFormat4(cmap))
  assert.deepEqual(stripped, stripCmapFormat4(cmap))
})

test('a font with format 4 stripped from cmap still resolves every glyph correctly', () => {
  const ttf = svg2ttf(tinySvgFont(), {})
  const buffer = toArrayBuffer(ttf.buffer)
  const cmap = getSfntTable(buffer, 'cmap')!
  const patched = replaceSfntTable(buffer, 'cmap', stripCmapFormat4(cmap))

  const parsed = opentype.parse(patched)
  assert.equal(parsed.outlinesFormat, 'truetype')

  for (const ch of ['A', 'B']) {
    const glyph = parsed.charToGlyph(ch)
    const bbox = glyph.getBoundingBox()
    assert.deepEqual([bbox.x1, bbox.y1, bbox.x2, bbox.y2], [0, 0, 400, 400], `glyph "${ch}" must still resolve correctly`)
  }
})
