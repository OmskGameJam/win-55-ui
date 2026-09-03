import { ref } from 'vue'

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
  /** Animated cursors only: ms to hold each `native-<i>.gif` still. Native mode flips the CSS `cursor` url through them on a timer (a CSS cursor never animates a GIF itself). */
  nativeFrameDelays?: number[]
}

export type CursorsManifest = Record<string, CursorEntry>

export interface SchemeInfo {
  displayName: string
  roles: Record<string, string>
}

export type SchemeIndex = Record<string, SchemeInfo>

// manifest.json + scheme.json are static once fetched, so everything resolves against these
// module vars synchronously after `loadCursors()` settles. `cursorsVersion` bumps when the data
// lands - a reactive read of it inside a computed/watchEffect makes that scope recompute then.
let manifest: CursorsManifest = {}
let schemeIndex: SchemeIndex = {}
export const cursorsVersion = ref(0)

let loadPromise: Promise<void> | null = null

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load ${url}: ${response.status} ${response.statusText}`)
  return response.json() as Promise<T>
}

/** Fetches manifest.json + scheme.json once (published by `npm run cursors -- sprite`); idempotent. */
export function loadCursors(): Promise<void> {
  if (!loadPromise) {
    loadPromise = Promise.all([
      fetchJson<CursorsManifest>(MANIFEST_URL),
      fetchJson<SchemeIndex>(SCHEME_INDEX_URL),
    ]).then(([m, s]) => {
      manifest = m
      schemeIndex = s
      cursorsVersion.value++
    })
  }
  return loadPromise
}

/** Awaits the one fetch, then resolves to the scheme index (slug -> displayName + role map). */
export async function loadSchemeIndex(): Promise<SchemeIndex> {
  await loadCursors()
  return schemeIndex
}

/** The overlay's normal/invert sprites render at 2x source pixels (project rule) - multiply a manifest hotspot by this for them. native.gif is 1:1 and uses the raw hotspot. */
export const SPRITE_SCALE = 2

const CURSORS_BASE_URL = '/win-55-ui/cursors'

/** Falls back here when a scheme lacks a role - not every themed pack ships e.g. `handwriting`/`help`. */
const FALLBACK_SCHEME = 'windows-default'

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

function idInScheme(scheme: string, role: string): string | undefined {
  const cursorId = schemeIndex[scheme]?.roles[role]
  if (!cursorId) return undefined
  const entry = manifest[cursorId]
  if (!entry || entry.hotspotX === null || entry.hotspotY === null) return undefined
  return cursorId
}

/** Sync cursorId for a scheme/role, with the windows-default fallback. undefined until `loadCursors()` settles or if neither scheme has the role. */
export function cursorIdFor(scheme: string, role: string): string | undefined {
  void cursorsVersion.value
  return idInScheme(scheme, role) ?? (scheme === FALLBACK_SCHEME ? undefined : idInScheme(FALLBACK_SCHEME, role))
}

export function manifestEntryFor(cursorId: string): CursorEntry | undefined {
  void cursorsVersion.value
  return manifest[cursorId]
}

/**
 * Sync native-mode CSS `cursor` value: `url("<cursorId>/native.gif") x y, kw` (native.gif is flat
 * 1:1, so the raw manifest hotspot). Falls back to the bare CSS keyword when the role has no sprite;
 * undefined only when the role maps to no keyword at all.
 */
export function cursorCssFor(scheme: string, role: string): string | undefined {
  const keyword = ROLE_KEYWORD[role]
  const cursorId = cursorIdFor(scheme, role)
  const entry = cursorId ? manifest[cursorId] : undefined
  if (!cursorId || !entry) return keyword
  return `url("${CURSORS_BASE_URL}/${cursorId}/native.gif") ${entry.hotspotX ?? 0} ${entry.hotspotY ?? 0}, ${keyword ?? 'default'}`
}

/**
 * cursorCssFor but never a bare keyword: a role with no sprite falls back to the scheme's `default`
 * cursor. For the always-on paths (subtree base, `<a>`/text-field/disabled derivation) so native
 * mode never surfaces the OS cursor.
 */
export function themedCursorCssFor(scheme: string, role: string): string | undefined {
  const value = cursorCssFor(scheme, role)
  if (value?.startsWith('url(') || role === 'default') return value
  return cursorCssFor(scheme, 'default') ?? value
}
