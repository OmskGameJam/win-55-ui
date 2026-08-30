const MANIFEST_URL = '/win-55-ui/cursors/manifest.json'
const SCHEME_INDEX_URL = '/win-55-ui/cursors/scheme.json'

export interface CursorEntry {
  file: string
  sourceFile?: string
  reconstructed?: boolean
  animated: boolean
  usesInvert: boolean
  frameCount: number
  invertFrames: number
  bitcounts: number[]
  width: number
  height: number
  hotspotX: number | null
  hotspotY: number | null
  suspiciousInvertFrames: number
  /** Whether `public/win-55-ui/cursors/<cursorId>/{normal,invert}.gif` exist (checked against disk at publish time). Neither is guaranteed - a cursor can be invert-only (crosshair/text) or normal-only. */
  hasNormal: boolean
  hasInvert: boolean
}

export type CursorsManifest = Record<string, CursorEntry>

export interface SchemeInfo {
  displayName: string
  roles: Record<string, string>
}

export type SchemeIndex = Record<string, SchemeInfo>

let manifestPromise: Promise<CursorsManifest> | null = null
let schemeIndexPromise: Promise<SchemeIndex> | null = null

/** Fetches `manifest.json` (published by `npm run cursors -- sprite`) once, caching the result. */
export async function loadCursorsManifest(): Promise<CursorsManifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(MANIFEST_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load cursor manifest from ${MANIFEST_URL}: ${response.status} ${response.statusText}`)
      }

      return response.json() as Promise<CursorsManifest>
    })
  }

  return manifestPromise
}

/** Same as loadCursorsManifest, for `scheme.json` - the role -> cursorId mapping per scheme. */
export async function loadSchemeIndex(): Promise<SchemeIndex> {
  if (!schemeIndexPromise) {
    schemeIndexPromise = fetch(SCHEME_INDEX_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load cursor scheme index from ${SCHEME_INDEX_URL}: ${response.status} ${response.statusText}`)
      }

      return response.json() as Promise<SchemeIndex>
    })
  }

  return schemeIndexPromise
}

/** Clears both cached indexes. Useful if a host app swaps the cursors base URL at runtime. */
export function resetCursorsCache(): void {
  manifestPromise = null
  schemeIndexPromise = null
}

/** Sprites render at 2x source pixels (project rule), so a manifest hotspot needs multiplying by this. */
export const SPRITE_SCALE = 2

/** resolveCursor falls back here when a scheme lacks a role - not every themed pack ships e.g. `handwriting`/`help`. */
const FALLBACK_SCHEME = 'windows-default'

function resolveInScheme(schemeIndex: SchemeIndex, manifest: CursorsManifest, scheme: string, role: string): string | undefined {
  const cursorId = schemeIndex[scheme]?.roles[role]
  if (!cursorId) return undefined

  const entry = manifest[cursorId]
  if (!entry || entry.hotspotX === null || entry.hotspotY === null) return undefined

  return cursorId
}

/**
 * Resolves a scheme/role pair to a cursorId. Falls back to the same role in the windows-default
 * scheme if the requested scheme doesn't have it (or doesn't exist at all) - undefined only when
 * neither has a usable cursor for that role.
 */
export async function resolveCursor(scheme: string, role: string): Promise<string | undefined> {
  const [schemeIndex, manifest] = await Promise.all([loadSchemeIndex(), loadCursorsManifest()])

  return (
    resolveInScheme(schemeIndex, manifest, scheme, role) ??
    (scheme === FALLBACK_SCHEME ? undefined : resolveInScheme(schemeIndex, manifest, FALLBACK_SCHEME, role))
  )
}
