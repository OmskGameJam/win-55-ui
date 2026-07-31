import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { srcFontDir } from './paths.js'

export interface VerticalMetrics {
  fontAscent: number
  fontDescent: number
}

function cachePath(fontName: string, pixelSize: number): string {
  return resolve(srcFontDir, `${fontName}-${pixelSize}.measurements.json`)
}

export function readCachedVerticalMetrics(fontName: string, pixelSize: number): VerticalMetrics | null {
  const path = cachePath(fontName, pixelSize)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8')) as VerticalMetrics
}

export function writeCachedVerticalMetrics(fontName: string, pixelSize: number, metrics: VerticalMetrics): void {
  writeFileSync(cachePath(fontName, pixelSize), JSON.stringify(metrics, null, 2) + '\n', 'utf8')
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
): { metrics: VerticalMetrics; overflow: string[] } {
  const cached = readCachedVerticalMetrics(fontName, pixelSize)

  if (!cached) {
    writeCachedVerticalMetrics(fontName, pixelSize, measured)
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
