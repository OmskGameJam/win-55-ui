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
  /** Whether the normal/invert sprites exist; either may be absent. */
  hasNormal: boolean
  hasInvert: boolean
  /** Animated cursors only: ms to hold each `native-<i>.gif` still. */
  nativeFrameDelays?: number[]
}

export type CursorsManifest = Record<string, CursorEntry>

export interface SchemeInfo {
  displayName: string
  roles: Record<string, string>
}

export type SchemeIndex = Record<string, SchemeInfo>

// Static after loadCursors(); cursorsVersion bumps when data lands so computeds recompute.
let manifest: CursorsManifest = {}
let schemeIndex: SchemeIndex = {}
export const cursorsVersion = ref(0)

let loadPromise: Promise<void> | null = null

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load ${url}: ${response.status} ${response.statusText}`)
  return response.json() as Promise<T>
}

/** Fetches the manifest and scheme once; idempotent. */
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

/** Resolves the scheme index after loading. */
export async function loadSchemeIndex(): Promise<SchemeIndex> {
  await loadCursors()
  return schemeIndex
}

/** Overlay sprites render at 2x; native.gif is 1:1 and uses the raw hotspot. */
export const SPRITE_SCALE = 2

const CURSORS_BASE_URL = '/win-55-ui/cursors'

/** Used when a scheme lacks a role. */
const FALLBACK_SCHEME = 'windows-default'

/** Fallback CSS keyword per role. */
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

/** cursorId for a scheme/role, falling back to windows-default. */
export function cursorIdFor(scheme: string, role: string): string | undefined {
  void cursorsVersion.value
  return idInScheme(scheme, role) ?? (scheme === FALLBACK_SCHEME ? undefined : idInScheme(FALLBACK_SCHEME, role))
}

export function manifestEntryFor(cursorId: string): CursorEntry | undefined {
  void cursorsVersion.value
  return manifest[cursorId]
}

/** Native cursor value; bare keyword when the role has no sprite. */
export function cursorCssFor(scheme: string, role: string): string | undefined {
  const keyword = ROLE_KEYWORD[role]
  const cursorId = cursorIdFor(scheme, role)
  const entry = cursorId ? manifest[cursorId] : undefined
  if (!cursorId || !entry) return keyword
  return `url("${CURSORS_BASE_URL}/${cursorId}/native.gif") ${entry.hotspotX ?? 0} ${entry.hotspotY ?? 0}, ${keyword ?? 'default'}`
}

/** `cursorCssFor` that never returns a bare keyword; falls back to the scheme's `default`. */
export function themedCursorCssFor(scheme: string, role: string): string | undefined {
  const value = cursorCssFor(scheme, role)
  if (value?.startsWith('url(') || role === 'default') return value
  return cursorCssFor(scheme, 'default') ?? value
}

/** Replaces the trailing keyword with `fallback`; a missing value becomes the fallback. */
export function withCssFallback(value: string | undefined, fallback: string): string {
  if (!value) return fallback
  const comma = value.lastIndexOf(',')
  return comma === -1 ? value : `${value.slice(0, comma)}, ${fallback}`
}
