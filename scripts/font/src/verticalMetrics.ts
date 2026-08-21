import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { srcFontDir } from './paths.js'

export interface VerticalMetrics {
  fontAscent: number
  fontDescent: number
}

function cachePath(fontName: string, pixelSize: number, baseDir: string): string {
  return resolve(baseDir, `${fontName}-${pixelSize}.measurements.json`)
}

/** `baseDir` defaults to the real `src-font/` - tests pass `srcFontTestsDir` instead, see paths.ts. */
export function readCachedVerticalMetrics(fontName: string, pixelSize: number, baseDir: string = srcFontDir): VerticalMetrics | null {
  const path = cachePath(fontName, pixelSize, baseDir)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8')) as VerticalMetrics
}

export function writeCachedVerticalMetrics(fontName: string, pixelSize: number, metrics: VerticalMetrics, baseDir: string = srcFontDir): void {
  const path = cachePath(fontName, pixelSize, baseDir)
  mkdirSync(dirname(path), { recursive: true }) // baseDir may not exist yet - e.g. src-font-tests/ in tests
  writeFileSync(path, JSON.stringify(metrics, null, 2) + '\n', 'utf8')
}

/**
 * All styles of one family (Regular/Bold/Italic/BoldItalic) sharing a pixel size must declare the
 * same ascent/descent - otherwise line-height math stays correct (the sum is unaffected) but
 * anything that positions content relative to where the *ink* sits within that box - a fixed-height
 * flex row centering a titlebar, an inline image with vertical-align: baseline - shifts by a pixel
 * when the active style changes, even though nothing about the surrounding layout moved. Whichever
 * style is struck first for a (fontName, pixelSize) pair - conventionally Regular - measures its
 * own real ink (see rasterizeFont) and caches the result to src-font/{fontName}-{pixelSize}.
 * measurements.json; every later style at that size reuses the cached value instead of measuring
 * its own. If a later style's real ink is deeper/taller than the cached value allows, that's a
 * soft finding (the glyph itself isn't clipped, but it can visually spill past the line box into
 * the next line) - flagged via the returned `overflow`, never silently swallowed.
 */
export function resolveVerticalMetrics(
  fontName: string,
  pixelSize: number,
  measured: VerticalMetrics,
  baseDir: string = srcFontDir,
): { metrics: VerticalMetrics; overflow: string[] } {
  const cached = readCachedVerticalMetrics(fontName, pixelSize, baseDir)

  if (!cached) {
    writeCachedVerticalMetrics(fontName, pixelSize, measured, baseDir)
    return { metrics: measured, overflow: [] }
  }

  const overflow: string[] = []
  if (measured.fontAscent > cached.fontAscent) {
    overflow.push(`real ascent (${measured.fontAscent}px) exceeds the cached ${fontName}-${pixelSize} ascent (${cached.fontAscent}px)`)
  }
  if (measured.fontDescent > cached.fontDescent) {
    overflow.push(`real descent (${measured.fontDescent}px) exceeds the cached ${fontName}-${pixelSize} descent (${cached.fontDescent}px)`)
  }

  return { metrics: cached, overflow }
}
