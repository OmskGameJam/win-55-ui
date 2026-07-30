import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { computeRegistrationPlan, insertFontFace, insertSupportedFace, isSizeRegistered } from './register.js'
import { projectRoot } from './paths.js'

test('computeRegistrationPlan builds the expected css family name and filename', () => {
  const plan = computeRegistrationPlan('Bold', 16)
  assert.equal(plan.cssFamilyName, 'Standard-Bold-16')
  assert.equal(plan.publicTtfFilename, 'Standard-Bold-16.ttf')
  assert.match(plan.cssBlock, /font-family: "Standard-Bold-16"/)
  assert.match(plan.cssBlock, /Standard-Bold-16\.ttf/)
  assert.equal(plan.supportedFacesEntry, "  { fontName: 'Standard', style: 'Bold', size: 16 },")
})

test('computeRegistrationPlan supports a non-default fontName', () => {
  const plan = computeRegistrationPlan('Regular', 14, 'Pixelated')
  assert.equal(plan.cssFamilyName, 'Pixelated-Regular-14')
  assert.equal(plan.publicTtfFilename, 'Pixelated-Regular-14.ttf')
  assert.equal(plan.supportedFacesEntry, "  { fontName: 'Pixelated', style: 'Regular', size: 14 },")
})

test('insertFontFace splices a new block above the anchor comment in the real index.css', () => {
  const cssPath = resolve(projectRoot, 'src', 'index.css')
  const original = readFileSync(cssPath, 'utf8')
  const plan = computeRegistrationPlan('Bold', 16)

  const updated = insertFontFace(original, plan.cssBlock)

  assert.ok(updated.includes(plan.cssBlock))
  assert.ok(updated.indexOf(plan.cssBlock) < updated.indexOf('font-cli: new @font-face blocks'))
  // idempotent w.r.t. everything else — only the anchor region changed
  assert.equal(updated.replace(plan.cssBlock + '\n\n', ''), original)
})

test('insertFontFace throws if the anchor comment is missing', () => {
  assert.throws(() => insertFontFace('body { color: red; }', '@font-face {}'), /anchor comment not found/)
})

test('insertSupportedFace splices a new entry above the anchor comment in the real typography.ts', () => {
  const tsPath = resolve(projectRoot, 'src', 'helpers', 'typography.ts')
  const original = readFileSync(tsPath, 'utf8')
  const plan = computeRegistrationPlan('Bold', 16)

  const updated = insertSupportedFace(original, plan.supportedFacesEntry)

  assert.ok(updated.includes(plan.supportedFacesEntry))
  assert.equal(updated.replace(plan.supportedFacesEntry + '\n', ''), original)
})

test('isSizeRegistered reflects the real SIZES array', () => {
  const tsPath = resolve(projectRoot, 'src', 'helpers', 'typography.ts')
  const text = readFileSync(tsPath, 'utf8')

  assert.equal(isSizeRegistered(text, 12), true)
  assert.equal(isSizeRegistered(text, 18), false)
})
