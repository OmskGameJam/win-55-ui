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
}

export type CursorsManifest = Record<string, CursorEntry>

export interface SchemeInfo {
  displayName: string
  roles: Record<string, string>
}

export type SchemeIndex = Record<string, SchemeInfo>

let manifestPromise: Promise<CursorsManifest> | null = null
let schemeIndexPromise: Promise<SchemeIndex> | null = null

/**
 * Loads `manifest.json` (published by `npm run cursors -- sprite`, see scripts/cursors/src/sprite.ts's
 * publishRegistry) at runtime, caching the result so it's only fetched once.
 */
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

export interface ResolvedCursor {
  cursorId: string
  /** Path to the flat alpha layer (public/win-55-ui/cursors/<cursorId>/normal.gif) - see CLAUDE.md's "Курсоры" section. A cursor whose design is entirely screen-invert (e.g. most schemes' crosshair/text) has no normal.gif at all; this URL 404s and the CSS `cursor` rule falls through to its plain `auto` fallback until invert-layer rendering exists. */
  url: string
  hotspotX: number
  hotspotY: number
}

const SPRITE_SCALE = 2

/** Every scheme in scheme.json (except windows-default itself) has a role gap somewhere - not every themed pack ships a "handwriting" or "help" cursor, e.g. - so this is the fallback resolveCursor reaches for below instead of leaving a role unresolved. */
const FALLBACK_SCHEME = 'windows-default'

function resolveInScheme(schemeIndex: SchemeIndex, manifest: CursorsManifest, scheme: string, role: string): ResolvedCursor | undefined {
  const cursorId = schemeIndex[scheme]?.roles[role]
  if (!cursorId) return undefined

  const entry = manifest[cursorId]
  if (!entry || entry.hotspotX === null || entry.hotspotY === null) return undefined

  return {
    cursorId,
    url: `/win-55-ui/cursors/${cursorId}/normal.gif`,
    hotspotX: entry.hotspotX * SPRITE_SCALE,
    hotspotY: entry.hotspotY * SPRITE_SCALE,
  }
}

/**
 * Resolves a scheme/role pair to its published sprite. Falls back to the same role in the
 * windows-default scheme if the requested scheme doesn't have it (or doesn't exist at all) -
 * undefined only when neither has a usable cursor for that role.
 */
export async function resolveCursor(scheme: string, role: string): Promise<ResolvedCursor | undefined> {
  const [schemeIndex, manifest] = await Promise.all([loadSchemeIndex(), loadCursorsManifest()])

  const direct = resolveInScheme(schemeIndex, manifest, scheme, role)
  if (direct) return direct

  if (scheme === FALLBACK_SCHEME) return undefined
  return resolveInScheme(schemeIndex, manifest, FALLBACK_SCHEME, role)
}
