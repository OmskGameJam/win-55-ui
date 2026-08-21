import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseFontsManifest } from '../src/fontsManifest.js'

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
