import { readFileSync } from 'node:fs'
import { fontsManifestPath } from './paths.js'

/**
 * Overrides for rasterizeFont's auto-kerning knobs, all optional (each falls back to
 * rasterizeFont's own default when omitted). There's no separate "enabled" flag here - presence
 * of a `kerning` block on a face IS what turns auto-kerning on for it; an empty object (`{}`)
 * means "auto-kerning on, with every default".
 */
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

export interface FontsManifest {
  faces: FaceEntry[]
}

/**
 * TofuMaker companion filename for a face - `{name}.ttf` -> `{name}-TofuMaker.ttf`. Derived from
 * `face.ttf` rather than a separate manifest field: it's a 1:1, always-present companion to every
 * face's own ttf, not an independent thing to configure per face.
 */
export function tofuTtfFilename(face: FaceEntry): string {
  return face.ttf.replace(/\.ttf$/i, '-TofuMaker.ttf')
}

/** Same derivation, for the CSS font-family string (`{fontName}-{style}-{size}-TofuMaker`). */
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

  return { faces: faces as FaceEntry[] }
}

export function loadFontsManifest(): FontsManifest {
  return parseFontsManifest(readFileSync(fontsManifestPath, 'utf8'))
}
