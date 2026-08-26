import type { BdfFont, BdfGlyph } from './types.js'

const BLANK_ALLOWLIST_PREFIXES = ['space', 'nbspace']

export interface MergeOptions {
  /** Codepoints to exclude from backfill even though the fallback has them. */
  skip?: number[]
}

export interface MergeReportEntry {
  encoding: number
  char: string
  fallbackGlyphName: string
}

export interface MergeResult {
  merged: BdfFont
  backfilled: MergeReportEntry[]
}

function inkCount(glyph: BdfGlyph): number {
  return glyph.bitmap.reduce((sum, row) => sum + row.filter((v) => v === 1).length, 0)
}

function isAllowlistedBlank(glyph: BdfGlyph): boolean {
  return inkCount(glyph) === 0 && BLANK_ALLOWLIST_PREFIXES.some((prefix) => glyph.name.startsWith(prefix))
}

/**
 * Fills gaps in `primary` using glyphs from `fallback`, for codepoints `primary` is missing
 * entirely, or (only on the small blank-glyph allowlist) declares but leaves visually empty.
 * A heuristic "blank BBX = gap" rule would be wrong in general — it would clobber a legitimately
 * blank glyph's metrics (e.g. `space`) with the fallback's differently-metriced one whenever the
 * primary's own space just happens to also be blank, which it always is.
 */
export function mergeBdf(primary: BdfFont, fallback: BdfFont, opts: MergeOptions = {}): MergeResult {
  if (primary.pointSize !== fallback.pointSize) {
    throw new Error(
      `cannot merge BDFs of different sizes (primary SIZE ${primary.pointSize}, fallback SIZE ${fallback.pointSize}) — ` +
        're-strike both at the same pixel size first',
    )
  }

  const skip = new Set(opts.skip ?? [])
  const byEncoding = new Map<number, BdfGlyph>(primary.glyphs.map((g) => [g.encoding, g]))
  const backfilled: MergeReportEntry[] = []

  for (const fallbackGlyph of fallback.glyphs) {
    if (skip.has(fallbackGlyph.encoding)) continue

    const existing = byEncoding.get(fallbackGlyph.encoding)
    const shouldBackfill = !existing || isAllowlistedBlank(existing)

    if (!shouldBackfill) continue

    byEncoding.set(fallbackGlyph.encoding, { ...fallbackGlyph, source: 'fallback' })
    backfilled.push({
      encoding: fallbackGlyph.encoding,
      char: String.fromCodePoint(fallbackGlyph.encoding),
      fallbackGlyphName: fallbackGlyph.name,
    })
  }

  const glyphs = [...byEncoding.values()].sort((a, b) => a.encoding - b.encoding)

  return { merged: { ...primary, glyphs }, backfilled }
}

const MAX_RANGES_SHOWN = 8

/**
 * Compact console summary, e.g. "backfilled 41 glyphs: U+00A1-U+00A9, U+2018, U+2019" — never
 * one line per glyph. Contiguous runs collapse into ranges, but a sparse backfill (e.g. patching
 * in a few thousand scattered CJK/symbol codepoints from a much more complete fallback font) can
 * still produce thousands of disjoint ranges — capped at `MAX_RANGES_SHOWN` so the console line
 * itself can't turn back into spam; the full list is always available via `--report`.
 */
export function summarizeBackfill(backfilled: MergeReportEntry[]): string {
  if (backfilled.length === 0) return 'backfilled 0 glyphs'

  const codepoints = backfilled.map((b) => b.encoding).sort((a, b) => a - b)
  const ranges: string[] = []
  let start = codepoints[0]
  let prev = codepoints[0]

  const hex = (cp: number) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`
  const flush = () => ranges.push(start === prev ? hex(start) : `${hex(start)}-${hex(prev)}`)

  for (let i = 1; i < codepoints.length; i++) {
    if (codepoints[i] === prev + 1) {
      prev = codepoints[i]
      continue
    }
    flush()
    start = prev = codepoints[i]
  }
  flush()

  const shown = ranges.length > MAX_RANGES_SHOWN ? ranges.slice(0, MAX_RANGES_SHOWN) : ranges
  const omitted = ranges.length - shown.length
  const suffix = omitted > 0 ? `, ... (+${omitted} more range${omitted === 1 ? '' : 's'}, use --report for the full list)` : ''

  return `backfilled ${backfilled.length} glyph${backfilled.length === 1 ? '' : 's'} across ${ranges.length} range${ranges.length === 1 ? '' : 's'}: ${shown.join(', ')}${suffix}`
}
