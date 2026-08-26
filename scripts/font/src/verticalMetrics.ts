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

export function readCachedVerticalMetrics(fontName: string, pixelSize: number, baseDir: string = srcFontDir): VerticalMetrics | null {
  const path = cachePath(fontName, pixelSize, baseDir)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8')) as VerticalMetrics
}

export function writeCachedVerticalMetrics(fontName: string, pixelSize: number, metrics: VerticalMetrics, baseDir: string = srcFontDir): void {
  const path = cachePath(fontName, pixelSize, baseDir)
  mkdirSync(dirname(path), { recursive: true }) // may not exist yet, e.g. in tests
  writeFileSync(path, JSON.stringify(metrics, null, 2) + '\n', 'utf8')
}

/**
 * Styles sharing a pixel size must declare identical ascent/descent, or content positioned relative
 * to ink within a fixed-height box (a centered titlebar, a baseline-aligned inline image) shifts by
 * a pixel when the active style changes, even though line-height itself doesn't move. The first
 * style struck for a (fontName, pixelSize) pair - conventionally Regular - measures its own ink and
 * caches it; every later style reuses that cache. A later style whose real ink exceeds the cached
 * value gets a soft warning (`overflow`).
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
