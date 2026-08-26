import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { srcFontTestsDir } from '../src/paths.js'
import { resolveVerticalMetrics, readCachedVerticalMetrics } from '../src/verticalMetrics.js'

function withTempFontName(run: (fontName: string) => void): void {
  const fontName = `TestFakeFont${Math.random().toString(36).slice(2)}`
  try {
    run(fontName)
  } finally {
    const path = resolve(srcFontTestsDir, `${fontName}-12.measurements.json`)
    if (existsSync(path)) unlinkSync(path)
  }
}

test('resolveVerticalMetrics caches the first measurement it sees', () => {
  withTempFontName((fontName) => {
    const result = resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    assert.deepEqual(result.metrics, { fontAscent: 10, fontDescent: 2 })
    assert.deepEqual(result.overflow, [])
    assert.deepEqual(readCachedVerticalMetrics(fontName, 12, srcFontTestsDir), { fontAscent: 10, fontDescent: 2 })
  })
})

test('resolveVerticalMetrics reuses the cached value instead of a later, different measurement', () => {
  withTempFontName((fontName) => {
    resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    const second = resolveVerticalMetrics(fontName, 12, { fontAscent: 9, fontDescent: 3 }, srcFontTestsDir)
    assert.deepEqual(second.metrics, { fontAscent: 10, fontDescent: 2 }, 'must return the cached (first) value, not the newly measured one')
  })
})

test('resolveVerticalMetrics flags, but does not silently swallow, a later style needing more room than cached', () => {
  withTempFontName((fontName) => {
    resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    const bold = resolveVerticalMetrics(fontName, 12, { fontAscent: 9, fontDescent: 3 }, srcFontTestsDir)
    assert.equal(bold.overflow.length, 1)
    assert.match(bold.overflow[0], /descent/)
  })
})

test('resolveVerticalMetrics flags ascent overflow independently from descent overflow', () => {
  withTempFontName((fontName) => {
    resolveVerticalMetrics(fontName, 12, { fontAscent: 9, fontDescent: 3 }, srcFontTestsDir)
    const result = resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    assert.equal(result.overflow.length, 1)
    assert.match(result.overflow[0], /ascent/)
  })
})

test('resolveVerticalMetrics reports no overflow when a later style needs less room than cached', () => {
  withTempFontName((fontName) => {
    resolveVerticalMetrics(fontName, 12, { fontAscent: 9, fontDescent: 3 }, srcFontTestsDir)
    const result = resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    assert.deepEqual(result.metrics, { fontAscent: 9, fontDescent: 3 })
  })
})

test('resolveVerticalMetrics keys the cache by (fontName, pixelSize) independently', () => {
  withTempFontName((fontName) => {
    resolveVerticalMetrics(fontName, 12, { fontAscent: 10, fontDescent: 2 }, srcFontTestsDir)
    assert.equal(readCachedVerticalMetrics(fontName, 24, srcFontTestsDir), null, 'a different pixel size must not see the 12px cache')
    assert.equal(readCachedVerticalMetrics(`${fontName}-other`, 12, srcFontTestsDir), null, 'a different font name must not see this cache')
  })
})
