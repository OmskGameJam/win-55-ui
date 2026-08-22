import { readFileSync } from 'node:fs'
import { fontsManifestPath } from './paths.js'

/** Auto-kerning knobs for rasterizeFont, enabled by the mere presence of this block (even `{}`) rather than a separate flag. */
export interface KerningConfig {
  rightSideCount?: number
  rightSideVolume?: number
  flatRightSideGap?: number
  tailRightSideGap?: number
}

export interface FaceEntry {
  fontName: string
  style: string
  size: number
  /** Vector font to strike, relative to src-font/. Presence enables `strike-all` for this face. */
  source?: string
  /** strike-all's output path, relative to src-font/ - the hand-editable primary BDF. Required if `source` is set. */
  strikeBdf?: string
  /** Vector fonts to strike as fallbacks, relative to src-font/, merged in order first to last by `merge-all`. */
  fallbackSource?: string[]
  /** fallback-all's output paths, relative to src-font/ - same length and order as `fallbackSource`. */
  fallbackBdf?: string[]
  /** merge-all's output path, relative to src-font/ - the merged BDF `build-all` reads when this face has fallbacks. */
  mergePath?: string
  /** Built TTF filename, relative to src-font/ - also the filename `push-fonts` copies it under in public/win-55-ui/font/. */
  ttf: string
  /** Auto-kerning options passed to `strike`/`fallback` when (re)striking this face. Omit for the pre-auto-kerning defaults. */
  kerning?: KerningConfig
}

/** Inclusive codepoint range, hex strings (no "U+" prefix). */
export interface DroppedRange {
  start: string
  end: string
  /** Not read by anything. */
  label?: string
}

export interface FontsManifest {
  faces: FaceEntry[]
  /** Codepoints excluded from every fallback merge (fallbackBdf itself stays untouched). See FONTS.md. */
  droppedRanges?: DroppedRange[]
  /** Codepoints exempted from droppedRanges. See FONTS.md for the list and how it was derived. */
  allowedCodepoints?: string[]
}

export function expandDroppedRanges(manifest: FontsManifest): number[] {
  const allowed = new Set((manifest.allowedCodepoints ?? []).map((s) => parseInt(s, 16)))
  const codepoints: number[] = []

  for (const range of manifest.droppedRanges ?? []) {
    const start = parseInt(range.start, 16)
    const end = parseInt(range.end, 16)
    for (let cp = start; cp <= end; cp++) {
      if (!allowed.has(cp)) codepoints.push(cp)
    }
  }

  return codepoints
}

export function tofuTtfFilename(face: FaceEntry): string {
  return face.ttf.replace(/\.ttf$/i, '-TofuMaker.ttf')
}

export function tofuFamilyName(face: FaceEntry): string {
  return `${face.fontName}-${face.style}-${face.size}-TofuMaker`
}

function assertString(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`fonts.json: ${path} must be a non-empty string`)
}

function assertOptionalString(value: unknown, path: string): asserts value is string | undefined {
  if (value !== undefined) assertString(value, path)
}

function assertOptionalStringArray(value: unknown, path: string): asserts value is string[] | undefined {
  if (value === undefined) return
  if (!Array.isArray(value)) throw new Error(`fonts.json: ${path} must be an array`)
  value.forEach((v, i) => assertString(v, `${path}[${i}]`))
}

function assertFaceEntry(value: unknown, index: number): asserts value is FaceEntry {
  if (typeof value !== 'object' || value === null) throw new Error(`fonts.json: faces[${index}] is not an object`)
  const face = value as Record<string, unknown>
  const path = (key: string) => `faces[${index}].${key}`

  assertString(face.fontName, path('fontName'))
  assertString(face.style, path('style'))
  assertString(face.ttf, path('ttf'))

  if (typeof face.size !== 'number' || !Number.isInteger(face.size)) {
    throw new Error(`fonts.json: ${path('size')} must be an integer`)
  }

  assertOptionalString(face.source, path('source'))
  assertOptionalString(face.strikeBdf, path('strikeBdf'))
  assertOptionalString(face.mergePath, path('mergePath'))
  assertOptionalStringArray(face.fallbackSource, path('fallbackSource'))
  assertOptionalStringArray(face.fallbackBdf, path('fallbackBdf'))

  if (face.source !== undefined && face.strikeBdf === undefined) {
    throw new Error(`fonts.json: ${path('source')} is set but ${path('strikeBdf')} is missing (nowhere for strike-all to write)`)
  }

  const fallbackSource = face.fallbackSource as string[] | undefined
  const fallbackBdf = face.fallbackBdf as string[] | undefined

  if (fallbackSource !== undefined || fallbackBdf !== undefined) {
    if (fallbackSource === undefined || fallbackBdf === undefined) {
      throw new Error(`fonts.json: ${path('fallbackSource')} and ${path('fallbackBdf')} must both be set, or neither`)
    }
    if (fallbackSource.length !== fallbackBdf.length) {
      throw new Error(`fonts.json: ${path('fallbackSource')} and ${path('fallbackBdf')} must be the same length (one bdf per fallback source)`)
    }
  }

  if (face.kerning !== undefined) {
    if (typeof face.kerning !== 'object' || face.kerning === null) throw new Error(`fonts.json: ${path('kerning')} must be an object`)
  }
}

const HEX_CODEPOINT = /^[0-9a-fA-F]+$/

function assertDroppedRange(value: unknown, index: number): asserts value is DroppedRange {
  if (typeof value !== 'object' || value === null) throw new Error(`fonts.json: droppedRanges[${index}] is not an object`)
  const range = value as Record<string, unknown>

  assertString(range.start, `droppedRanges[${index}].start`)
  assertString(range.end, `droppedRanges[${index}].end`)
  assertOptionalString(range.label, `droppedRanges[${index}].label`)

  if (!HEX_CODEPOINT.test(range.start)) throw new Error(`fonts.json: droppedRanges[${index}].start must be a hex codepoint, got "${range.start}"`)
  if (!HEX_CODEPOINT.test(range.end)) throw new Error(`fonts.json: droppedRanges[${index}].end must be a hex codepoint, got "${range.end}"`)
  if (parseInt(range.start, 16) > parseInt(range.end, 16)) {
    throw new Error(`fonts.json: droppedRanges[${index}]: start (${range.start}) is after end (${range.end})`)
  }
}

export function parseFontsManifest(jsonText: string): FontsManifest {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (e) {
    throw new Error(`fonts.json: invalid JSON - ${(e as Error).message}`)
  }

  if (typeof parsed !== 'object' || parsed === null || !Array.isArray((parsed as Record<string, unknown>).faces)) {
    throw new Error('fonts.json: expected a top-level "faces" array')
  }

  const faces = (parsed as { faces: unknown[] }).faces
  faces.forEach(assertFaceEntry)

  const droppedRanges = (parsed as Record<string, unknown>).droppedRanges
  if (droppedRanges !== undefined) {
    if (!Array.isArray(droppedRanges)) throw new Error('fonts.json: "droppedRanges" must be an array')
    droppedRanges.forEach(assertDroppedRange)
  }

  const allowedCodepoints = (parsed as Record<string, unknown>).allowedCodepoints
  if (allowedCodepoints !== undefined) {
    if (!Array.isArray(allowedCodepoints)) throw new Error('fonts.json: "allowedCodepoints" must be an array')
    allowedCodepoints.forEach((cp, i) => {
      assertString(cp, `allowedCodepoints[${i}]`)
      if (!HEX_CODEPOINT.test(cp)) throw new Error(`fonts.json: allowedCodepoints[${i}] must be a hex codepoint, got "${cp}"`)
    })
  }

  return {
    faces: faces as FaceEntry[],
    droppedRanges: droppedRanges as DroppedRange[] | undefined,
    allowedCodepoints: allowedCodepoints as string[] | undefined,
  }
}

export function loadFontsManifest(): FontsManifest {
  return parseFontsManifest(readFileSync(fontsManifestPath, 'utf8'))
}
