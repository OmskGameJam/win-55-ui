import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSupportedFacesModule, buildFontFaceCss } from './register.js'
import { publicUrlPrefix } from './paths.js'
import type { FontsManifest } from './fontsManifest.js'

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Matches register.ts's `url("${publicUrlPrefix}/font/<filename>")` - built from config, not hardcoded here. */
function fontUrlRegex(filename: string): RegExp {
  return new RegExp(`url\\("${escapeRegex(publicUrlPrefix)}/font/${escapeRegex(filename)}"\\)`)
}

const manifest: FontsManifest = {
  faces: [
    { fontName: 'Standard', style: 'Regular', size: 12, ttf: 'Standard-Regular-12.ttf' },
    { fontName: 'Standard', style: 'Bold', size: 16, ttf: 'Standard-Bold-16.ttf' },
  ],
}

test('buildSupportedFacesModule emits one SUPPORTED_FACES entry per face, in manifest order', () => {
  const out = buildSupportedFacesModule(manifest)

  assert.match(out, /export const SUPPORTED_FACES/)
  assert.match(out, /\{ fontName: 'Standard', style: 'Regular', size: 12 \}/)
  assert.match(out, /\{ fontName: 'Standard', style: 'Bold', size: 16 \}/)
  assert.ok(out.indexOf("size: 12") < out.indexOf("size: 16"))
})

test('buildSupportedFacesModule carries the "do not edit" banner', () => {
  const out = buildSupportedFacesModule(manifest)
  assert.match(out, /AUTO-GENERATED/)
  assert.match(out, /Do not edit by hand/)
})

test('buildFontFaceCss emits a primary @font-face block per face, family name matching typography.ts\'s reconstruction', () => {
  const out = buildFontFaceCss(manifest)

  assert.match(out, /font-family: "Standard-Regular-12"/)
  assert.match(out, fontUrlRegex('Standard-Regular-12.ttf'))
  assert.match(out, /font-family: "Standard-Bold-16"/)
  assert.match(out, fontUrlRegex('Standard-Bold-16.ttf'))
})

test('buildFontFaceCss also emits a TofuMaker companion @font-face block per face', () => {
  const out = buildFontFaceCss(manifest)

  assert.match(out, /font-family: "Standard-Regular-12-TofuMaker"/)
  assert.match(out, fontUrlRegex('Standard-Regular-12-TofuMaker.ttf'))
  assert.match(out, /font-family: "Standard-Bold-16-TofuMaker"/)
  assert.match(out, fontUrlRegex('Standard-Bold-16-TofuMaker.ttf'))
})

test('buildFontFaceCss emits exactly two blocks per face (primary + TofuMaker)', () => {
  const out = buildFontFaceCss(manifest)
  const blockCount = (out.match(/@font-face/g) ?? []).length
  assert.equal(blockCount, manifest.faces.length * 2)
})

test('buildFontFaceCss uses face.ttf verbatim for the url even if it diverges from the {fontName}-{style}-{size} convention', () => {
  const out = buildFontFaceCss({ faces: [{ fontName: 'Standard', style: 'Regular', size: 12, ttf: 'weird-legacy-name.ttf' }] })
  assert.match(out, /font-family: "Standard-Regular-12"/)
  assert.match(out, fontUrlRegex('weird-legacy-name.ttf'))
  assert.match(out, fontUrlRegex('weird-legacy-name-TofuMaker.ttf'))
})

test('buildFontFaceCss carries the "do not edit" banner', () => {
  const out = buildFontFaceCss(manifest)
  assert.match(out, /AUTO-GENERATED/)
  assert.match(out, /Do not edit by hand/)
})
