import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFontsManifest, expandDroppedRanges } from '../src/fontsManifest.js'

test('parseFontsManifest accepts a minimal valid face (ttf only)', () => {
  const manifest = parseFontsManifest(JSON.stringify({ faces: [{ fontName: 'Standard', style: 'Bold', size: 12, ttf: 'Standard-Bold-12.ttf' }] }))
  assert.equal(manifest.faces.length, 1)
  assert.equal(manifest.faces[0].ttf, 'Standard-Bold-12.ttf')
})

test('parseFontsManifest accepts a fully-populated face with multiple fallback sources', () => {
  const face = {
    fontName: 'Standard',
    style: 'Regular',
    size: 12,
    source: 'liberation_sans/LiberationSans-Regular.ttf',
    strikeBdf: 'LiberationSans-Regular-12.bdf',
    fallbackSource: ['noto_sans_jp/NotoSansJP-Regular.ttf', 'some_other/Other-Regular.ttf'],
    fallbackBdf: ['NotoSansJP-Regular-12.fallback.bdf', 'Other-Regular-12.fallback.bdf'],
    mergePath: 'Standard-Regular-12.bdf',
    ttf: 'Standard-Regular-12.ttf',
    kerning: { rightSideCount: 1 },
  }
  const manifest = parseFontsManifest(JSON.stringify({ faces: [face] }))
  assert.deepEqual(manifest.faces[0], face)
})

test('parseFontsManifest rejects invalid JSON', () => {
  assert.throws(() => parseFontsManifest('{not json'), /invalid JSON/)
})

test('parseFontsManifest rejects a missing top-level faces array', () => {
  assert.throws(() => parseFontsManifest(JSON.stringify({})), /expected a top-level "faces" array/)
  assert.throws(() => parseFontsManifest(JSON.stringify({ faces: 'nope' })), /expected a top-level "faces" array/)
})

test('parseFontsManifest rejects a face missing required fields', () => {
  assert.throws(() => parseFontsManifest(JSON.stringify({ faces: [{ style: 'Regular', size: 12, ttf: 'x.ttf' }] })), /fontName/)
  assert.throws(() => parseFontsManifest(JSON.stringify({ faces: [{ fontName: 'Standard', style: 'Regular', ttf: 'x.ttf' }] })), /size/)
})

test('parseFontsManifest rejects source without strikeBdf', () => {
  assert.throws(
    () =>
      parseFontsManifest(
        JSON.stringify({ faces: [{ fontName: 'Standard', style: 'Regular', size: 12, ttf: 'x.ttf', source: 'x.ttf' }] }),
      ),
    /strikeBdf/,
  )
})

test('parseFontsManifest rejects fallbackSource without fallbackBdf', () => {
  assert.throws(
    () =>
      parseFontsManifest(
        JSON.stringify({
          faces: [{ fontName: 'Standard', style: 'Regular', size: 12, ttf: 'x.ttf', fallbackSource: ['x.ttf'] }],
        }),
      ),
    /fallbackBdf/,
  )
})

test('parseFontsManifest rejects mismatched fallbackSource/fallbackBdf lengths', () => {
  assert.throws(
    () =>
      parseFontsManifest(
        JSON.stringify({
          faces: [
            {
              fontName: 'Standard',
              style: 'Regular',
              size: 12,
              ttf: 'x.ttf',
              fallbackSource: ['a.ttf', 'b.ttf'],
              fallbackBdf: ['a.bdf'],
            },
          ],
        }),
      ),
    /same length/,
  )
})

test('parseFontsManifest accepts droppedRanges as hex-string codepoint ranges', () => {
  const manifest = parseFontsManifest(
    JSON.stringify({
      faces: [],
      droppedRanges: [{ start: '4E00', end: '9FFF', label: 'CJK Unified Ideographs' }],
    }),
  )
  assert.deepEqual(manifest.droppedRanges, [{ start: '4E00', end: '9FFF', label: 'CJK Unified Ideographs' }])
})

test('parseFontsManifest omits droppedRanges entirely when absent, rather than defaulting to []', () => {
  const manifest = parseFontsManifest(JSON.stringify({ faces: [] }))
  assert.equal(manifest.droppedRanges, undefined)
})

test('parseFontsManifest rejects a non-array droppedRanges', () => {
  assert.throws(() => parseFontsManifest(JSON.stringify({ faces: [], droppedRanges: 'nope' })), /"droppedRanges" must be an array/)
})

test('parseFontsManifest rejects a droppedRanges entry with a non-hex start/end', () => {
  assert.throws(
    () => parseFontsManifest(JSON.stringify({ faces: [], droppedRanges: [{ start: 'not-hex', end: '9FFF' }] })),
    /droppedRanges\[0\]\.start must be a hex codepoint/,
  )
})

test('parseFontsManifest rejects a droppedRanges entry where start is after end', () => {
  assert.throws(
    () => parseFontsManifest(JSON.stringify({ faces: [], droppedRanges: [{ start: '9FFF', end: '4E00' }] })),
    /start \(9FFF\) is after end \(4E00\)/,
  )
})

test('expandDroppedRanges flattens ranges into individual codepoints, inclusive of both ends', () => {
  const manifest = parseFontsManifest(
    JSON.stringify({
      faces: [],
      droppedRanges: [
        { start: '41', end: '43' }, // A, B, C
        { start: '61', end: '61' }, // a
      ],
    }),
  )
  assert.deepEqual(expandDroppedRanges(manifest), [0x41, 0x42, 0x43, 0x61])
})

test('parseFontsManifest accepts allowedCodepoints as hex-string codepoints', () => {
  const manifest = parseFontsManifest(JSON.stringify({ faces: [], allowedCodepoints: ['4EBA', '76CA'] }))
  assert.deepEqual(manifest.allowedCodepoints, ['4EBA', '76CA'])
})

test('parseFontsManifest rejects a non-array allowedCodepoints', () => {
  assert.throws(() => parseFontsManifest(JSON.stringify({ faces: [], allowedCodepoints: 'nope' })), /"allowedCodepoints" must be an array/)
})

test('parseFontsManifest rejects a non-hex allowedCodepoints entry', () => {
  assert.throws(
    () => parseFontsManifest(JSON.stringify({ faces: [], allowedCodepoints: ['not-hex'] })),
    /allowedCodepoints\[0\] must be a hex codepoint/,
  )
})

test('expandDroppedRanges excludes allowedCodepoints even though they fall inside a dropped range', () => {
  const manifest = parseFontsManifest(
    JSON.stringify({
      faces: [],
      droppedRanges: [{ start: '4E00', end: '4E10' }],
      allowedCodepoints: ['4EBA'], // U+4EBA = 0x4EBA, inside the range above
    }),
  )
  assert.ok(!expandDroppedRanges(manifest).includes(0x4eba), 'allowed codepoint must not appear in the drop list')
  assert.ok(expandDroppedRanges(manifest).includes(0x4e01), 'everything else in the range is still dropped')
})

test('expandDroppedRanges returns an empty array when droppedRanges is absent', () => {
  const manifest = parseFontsManifest(JSON.stringify({ faces: [] }))
  assert.deepEqual(expandDroppedRanges(manifest), [])
})
