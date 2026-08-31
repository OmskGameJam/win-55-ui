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
  /** Whether `public/win-55-ui/cursors/<cursorId>/{normal,invert}.gif` exist (checked against disk at publish time). Neither is guaranteed - a cursor can be invert-only (crosshair/text) or normal-only. `native.gif` is written for every cursor, so it has no flag. */
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

/** The overlay's normal/invert sprites render at 2x source pixels (project rule) - multiply a manifest hotspot by this for them. native.gif is 1:1 and uses the raw hotspot. */
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

const CURSORS_BASE_URL = '/win-55-ui/cursors'

/** Role -> the native CSS `cursor` keyword used as the fallback tail of a `url()` value, and on its own when no sprite fits. */
const ROLE_KEYWORD: Record<string, string> = {
  default: 'default',
  link: 'pointer',
  text: 'text',
  'vertical-text': 'vertical-text',
  move: 'move',
  'not-allowed': 'not-allowed',
  wait: 'wait',
  progress: 'progress',
  help: 'help',
  crosshair: 'crosshair',
  handwriting: 'cell',
  'ns-resize': 'ns-resize',
  'ew-resize': 'ew-resize',
  'nesw-resize': 'nesw-resize',
  'nwse-resize': 'nwse-resize',
}

/**
 * Resolves a scheme/role pair to a native-mode CSS `cursor` value: `url("<cursorId>/native.gif") x y, kw`.
 * native.gif is a flat 1:1 bitmap (not 2x like the overlay's layers), so the manifest hotspot is
 * used as-is. Falls back to the plain CSS keyword when the role doesn't resolve; undefined only when
 * the role maps to no keyword at all.
 */
export async function resolveCursorCss(scheme: string, role: string): Promise<string | undefined> {
  const keyword = ROLE_KEYWORD[role]
  const cursorId = await resolveCursor(scheme, role)
  if (!cursorId) return keyword

  const manifest = await loadCursorsManifest()
  const entry = manifest[cursorId]
  if (!entry) return keyword

  return `url("${CURSORS_BASE_URL}/${cursorId}/native.gif") ${entry.hotspotX ?? 0} ${entry.hotspotY ?? 0}, ${keyword ?? 'default'}`
}

/**
 * Like resolveCursorCss but guaranteed to return a sprite `url(...)`, never a bare keyword: a role
 * with no sprite at all falls back to the scheme's `default` cursor. Used for the always-on paths
 * (subtree base, `<a>`/text-field derivation) so native mode never surfaces the OS cursor.
 */
export async function resolveCursorCssThemed(scheme: string, role: string): Promise<string | undefined> {
  const value = await resolveCursorCss(scheme, role)
  if (value?.startsWith('url(') || role === 'default') return value
  return (await resolveCursorCss(scheme, 'default')) ?? value
}
