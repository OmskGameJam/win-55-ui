import { test } from 'node:test'
import assert from 'node:assert/strict'
import opentype from 'opentype.js'
import svg2ttf from 'svg2ttf'
import { insertSfntTable, buildGaspTable, GASP_DOGRAY, GASP_GRIDFIT } from '../src/sfnt.js'

function tinySvgFont(): string {
  // A single filled 4x4 square glyph, straight lines only — enough to exercise a real glyf/loca font.
  const unitsPerEm = 400
  return (
    '<?xml version="1.0" standalone="no"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
    `<font id="TestFont" horiz-adv-x="${unitsPerEm}">` +
    `<font-face font-family="TestFont" units-per-em="${unitsPerEm}" ascent="${unitsPerEm}" descent="0" />` +
    `<missing-glyph horiz-adv-x="${unitsPerEm}" />` +
    `<glyph unicode="X" glyph-name="X" horiz-adv-x="${unitsPerEm}" d="M0,0 L400,0 L400,400 L0,400 Z" />` +
    '</font></defs></svg>'
  )
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

test('insertSfntTable adds a gasp table to a real svg2ttf-produced font without corrupting it', () => {
  const ttf = svg2ttf(tinySvgFont(), {})
  const original = toArrayBuffer(ttf.buffer)

  const gaspBytes = buildGaspTable([{ maxPpem: 0xffff, behavior: GASP_DOGRAY }])
  const withGasp = insertSfntTable(original, 'gasp', gaspBytes)

  // The font must still be a valid, parseable TrueType font afterward — opentype.js's parser
  // validates table checksums implicitly by simply not throwing on well-formed input, and glyph
  // data must still resolve correctly (proves offsets/padding after the inserted table are sound).
  const reparsed = opentype.parse(withGasp)
  assert.equal(reparsed.outlinesFormat, 'truetype')
  const glyph = reparsed.charToGlyph('X')
  const bbox = glyph.getBoundingBox()
  assert.deepEqual([bbox.x1, bbox.y1, bbox.x2, bbox.y2], [0, 0, 400, 400])

  // Confirm the gasp table is actually present and byte-correct by reading it back manually
  // (opentype.js doesn't parse gasp into a friendly structure).
  const view = new DataView(withGasp)
  const bytes = new Uint8Array(withGasp)
  const numTables = view.getUint16(4)
  let gaspOffset = -1
  let gaspLength = -1
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16
    const tag = String.fromCharCode(bytes[rec], bytes[rec + 1], bytes[rec + 2], bytes[rec + 3])
    if (tag === 'gasp') {
      gaspOffset = view.getUint32(rec + 8)
      gaspLength = view.getUint32(rec + 12)
    }
  }
  assert.ok(gaspOffset >= 0, 'gasp table must be present in the directory')
  assert.equal(gaspLength, 8)
  assert.equal(view.getUint16(gaspOffset), 0, 'gasp version')
  assert.equal(view.getUint16(gaspOffset + 2), 1, 'gasp numRanges')
  assert.equal(view.getUint16(gaspOffset + 4), 0xffff, 'gasp range maxPpem')
  assert.equal(view.getUint16(gaspOffset + 6), GASP_DOGRAY, 'gasp range behavior')
})

test('insertSfntTable throws if the tag already exists', () => {
  const ttf = svg2ttf(tinySvgFont(), {})
  const original = toArrayBuffer(ttf.buffer)
  assert.throws(() => insertSfntTable(original, 'head', new Uint8Array(4)), /already has a 'head' table/)
})

test('buildGaspTable sorts ranges ascending by maxPpem regardless of input order', () => {
  const bytes = buildGaspTable([
    { maxPpem: 0xffff, behavior: GASP_DOGRAY },
    { maxPpem: 8, behavior: GASP_GRIDFIT },
  ])
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  assert.equal(view.getUint16(2), 2, 'numRanges')
  assert.equal(view.getUint16(4), 8, 'first range must be the smaller maxPpem')
  assert.equal(view.getUint16(4 + 4), 0xffff, 'second range must be the larger maxPpem')
})

test('buildGaspTable rejects an empty range list', () => {
  assert.throws(() => buildGaspTable([]), /at least one range/)
})
