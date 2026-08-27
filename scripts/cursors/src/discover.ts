import { readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { srcCursorsDir } from './paths.js'
import { analyzeRoleFile } from './analyze.js'
import { loadPreservedCursors, loadSchemeIndex, writeCursorsManifest, writeSchemeIndex, type CursorsManifest, type SchemeIndex } from './manifest.js'

const CURSOR_EXTENSIONS = new Set(['.cur', '.ani'])

function listCursorFiles(): string[] {
  return readdirSync(srcCursorsDir)
    .filter((name) => CURSOR_EXTENSIONS.has(extname(name).toLowerCase()))
    .sort()
}

export interface DiscoverResult {
  manifest: CursorsManifest
  schemeIndex: SchemeIndex
  cursorsFound: number
  cursorsAdded: string[]
  cursorsRemoved: string[]
  /** "scheme/role -> cursorId" entries dropped from scheme.json because that cursorId no longer exists in src-cursors/ - needs a manual fix (repoint the role, or restore the file). */
  danglingSchemeRoles: string[]
  /** Cursor ids on disk with no scheme.json role pointing at them - a new file with nobody using it yet. */
  orphanCursors: string[]
  /** Cursor ids with at least one non-white invert pixel. */
  suspiciousInvertCursors: string[]
}

/**
 * Rebuilds manifest.json from what's actually on disk under src-cursors/ - purely physical,
 * per-file properties, with no notion of scheme/role membership (see CursorEntry). Binary metadata
 * (dimensions, hotspot, invert usage, bit depth, frame count) is always re-derived from the file
 * itself, never trusted from the old manifest. `sourceFile` is carried over (via
 * loadPreservedCursors, not the strict manifest reader - see its doc comment), since it isn't
 * recoverable from the binary alone.
 *
 * scheme.json - the "role -> cursorId" mapping per scheme (see SchemeInfo) - can't be derived from
 * src-cursors/ at all once byte-identical duplicates are deduped away, so it's loaded and preserved
 * verbatim instead, only dropping (and reporting) a role whose cursorId no longer exists on disk.
 */
export function discover(): DiscoverResult {
  const preserved = loadPreservedCursors()

  const manifest: CursorsManifest = {}
  const cursorsAdded: string[] = []
  const suspiciousInvertCursors: string[] = []

  for (const filename of listCursorFiles()) {
    const cursorId = basename(filename, extname(filename))
    const previous = preserved[cursorId]
    if (!previous) cursorsAdded.push(cursorId)

    // Dimensions/hotspot are always trustworthy, even for a reconstructed file - only the
    // invert/bit-depth signal is destroyed by reconstruction (see CursorEntry.reconstructed), so
    // only that subset is overridden from the last captured ground truth.
    const metadata = analyzeRoleFile(join(srcCursorsDir, filename))
    if (previous?.reconstructed && previous.metadata) {
      const { usesInvert, bitcounts, frameCount, invertFrames, suspiciousInvertFrames } = previous.metadata
      Object.assign(metadata, { usesInvert, bitcounts, frameCount, invertFrames, suspiciousInvertFrames })
    }

    if (metadata.suspiciousInvertFrames > 0) suspiciousInvertCursors.push(cursorId)

    manifest[cursorId] = { file: filename, sourceFile: previous?.sourceFile, reconstructed: previous?.reconstructed, ...metadata }
  }

  const cursorsRemoved = Object.keys(preserved).filter((cursorId) => !(cursorId in manifest))

  writeCursorsManifest(manifest)

  const oldSchemeIndex = loadSchemeIndex()
  const schemeIndex: SchemeIndex = {}
  const danglingSchemeRoles: string[] = []
  const referencedCursors = new Set<string>()

  for (const [scheme, info] of Object.entries(oldSchemeIndex)) {
    const roles: Record<string, string> = {}
    for (const [role, cursorId] of Object.entries(info.roles)) {
      if (cursorId in manifest) {
        roles[role] = cursorId
        referencedCursors.add(cursorId)
      } else {
        danglingSchemeRoles.push(`${scheme}/${role} -> ${cursorId}`)
      }
    }
    schemeIndex[scheme] = { displayName: info.displayName, roles }
  }

  const orphanCursors = Object.keys(manifest).filter((cursorId) => !referencedCursors.has(cursorId))

  writeSchemeIndex(schemeIndex)

  return {
    manifest,
    schemeIndex,
    cursorsFound: Object.keys(manifest).length,
    cursorsAdded,
    cursorsRemoved,
    danglingSchemeRoles,
    orphanCursors,
    suspiciousInvertCursors,
  }
}
