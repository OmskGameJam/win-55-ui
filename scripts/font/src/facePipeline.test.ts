import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { faceLabel, mergeChain, facesReferencingBdf } from './facePipeline.js'
import { writeBdf } from './bdf.js'
import { srcFontDir } from './paths.js'
import type { BdfFont, BdfGlyph } from './types.js'
import type { FaceEntry, FontsManifest } from './fontsManifest.js'

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

function face(overrides: Partial<FaceEntry>): FaceEntry {
  return { fontName: 'Test', style: 'Regular', size: 12, ttf: 'Test-Regular-12.ttf', ...overrides }
}

test('faceLabel formats fontName/style/size', () => {
  assert.equal(faceLabel(face({ fontName: 'Standard', style: 'Bold', size: 24 })), 'Standard/Bold/24')
})

test('mergeChain folds strike + one fallback', () => {
  const dir = mkdtempSync(join(tmpdir(), 'facepipeline-'))
  try {
    const strikePath = join(dir, 'strike.bdf')
    const fallbackPath = join(dir, 'fallback.bdf')
    writeFileSync(strikePath, writeBdf(font([glyph('A', 65)])), 'utf8')
    writeFileSync(fallbackPath, writeBdf(font([glyph('A', 65, false), glyph('B', 66)])), 'utf8')

    const { merged, backfilled } = mergeChain(strikePath, [fallbackPath])

    assert.deepEqual(
      merged.glyphs.map((g) => g.encoding),
      [65, 66],
    )
    assert.deepEqual(
      backfilled.map((b) => b.encoding),
      [66],
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('mergeChain folds multiple fallbacks in order, each backfilling only what is still missing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'facepipeline-'))
  try {
    const strikePath = join(dir, 'strike.bdf')
    const fallback1Path = join(dir, 'fallback1.bdf')
    const fallback2Path = join(dir, 'fallback2.bdf')
    writeFileSync(strikePath, writeBdf(font([glyph('A', 65)])), 'utf8')
    writeFileSync(fallback1Path, writeBdf(font([glyph('B', 66)])), 'utf8')
    // B is already backfilled by fallback1 by the time fallback2 runs - only C should come from it.
    writeFileSync(fallback2Path, writeBdf(font([glyph('B-alt', 66), glyph('C', 67)])), 'utf8')

    const { merged, backfilled } = mergeChain(strikePath, [fallback1Path, fallback2Path])

    assert.deepEqual(
      merged.glyphs.map((g) => g.encoding),
      [65, 66, 67],
    )
    assert.equal(merged.glyphs.find((g) => g.encoding === 66)?.name, 'B')
    assert.deepEqual(
      backfilled.map((b) => b.encoding),
      [66, 67],
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('facesReferencingBdf matches a face by strikeBdf', () => {
  const manifest: FontsManifest = { faces: [face({ strikeBdf: 'A-Regular-12.bdf' })] }
  const path = resolve(srcFontDir, 'A-Regular-12.bdf')

  const matches = facesReferencingBdf(manifest, path)

  assert.equal(matches.length, 1)
  assert.equal(matches[0].isMergePath, false)
})

test('facesReferencingBdf matches every face sharing the same fallbackBdf', () => {
  const shared = 'Fallback-12.fallback.bdf'
  const manifest: FontsManifest = {
    faces: [
      face({ style: 'Bold', fallbackBdf: [shared] }),
      face({ style: 'BoldItalic', fallbackBdf: [shared] }),
      face({ style: 'Italic', fallbackBdf: ['Other.fallback.bdf'] }),
    ],
  }
  const path = resolve(srcFontDir, shared)

  const matches = facesReferencingBdf(manifest, path)

  assert.deepEqual(
    matches.map((m) => m.face.style).sort(),
    ['Bold', 'BoldItalic'],
  )
  assert.ok(matches.every((m) => m.isMergePath === false))
})

test('facesReferencingBdf flags a mergePath match with isMergePath: true, unlike strikeBdf/fallbackBdf', () => {
  const manifest: FontsManifest = { faces: [face({ mergePath: 'Merged-Regular-12.bdf' })] }
  const path = resolve(srcFontDir, 'Merged-Regular-12.bdf')

  const matches = facesReferencingBdf(manifest, path)

  assert.equal(matches.length, 1)
  assert.equal(matches[0].isMergePath, true)
})

test('facesReferencingBdf returns nothing for a path no face references', () => {
  const manifest: FontsManifest = { faces: [face({ strikeBdf: 'A-Regular-12.bdf' })] }
  const path = resolve(srcFontDir, 'unrelated.bdf')

  assert.deepEqual(facesReferencingBdf(manifest, path), [])
})
