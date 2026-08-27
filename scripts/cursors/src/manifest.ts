import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { cursorsManifestPath, schemeIndexPath } from './paths.js'
import type { RoleMetadata } from './analyze.js'

export interface CursorEntry extends RoleMetadata {
  /** Filename in src-cursors/, e.g. "3d-bronze-crosshair.cur". */
  file: string
  /** Provenance only (a registry-scraped original filename, or "live:OCR_<id>") - not derivable from the file itself, so discover preserves it across re-runs instead of regenerating it. */
  sourceFile?: string
  /**
   * True when the .cur bytes were synthesized from a live-captured HCURSOR (see CurExtract.cs)
   * rather than being an original pristine cursor resource. Reconstruction always flattens the
   * AND/XOR raster op into 32bpp color+alpha, so re-parsing the file can never recover true
   * usesInvert/bitcounts - discover preserves this cursor's metadata verbatim instead of
   * re-deriving it, the same way it preserves sourceFile.
   */
  reconstructed?: boolean
}

/** Purely physical, per-file properties - a cursor entry has no idea which scheme(s)/role(s) reference it (see SchemeInfo). */
export type CursorsManifest = Record<string, CursorEntry>

export interface SchemeInfo {
  /** Human-readable label. Not derivable from the scheme slug for every scheme (e.g. "3d-bronze" -> "3D-Bronze"), so discover preserves an existing value instead of overwriting it with a guess. */
  displayName: string
  /**
   * role -> cursorId. The actual scheme membership lives here, not on the cursor - several
   * schemes can point the same role at the same cursorId (a byte-identical duplicate, see
   * CLAUDE.md's "Курсоры" section). Not derivable from src-cursors/ once duplicates are deduped
   * away, so discover preserves this across re-runs, validating that every cursorId still exists.
   */
  roles: Record<string, string>
}

export type SchemeIndex = Record<string, SchemeInfo>

function assertCursorEntry(value: unknown, path: string): asserts value is CursorEntry {
  if (typeof value !== 'object' || value === null) throw new Error(`manifest.json: ${path} is not an object`)
  const cursor = value as Record<string, unknown>

  if (typeof cursor.file !== 'string' || cursor.file.length === 0) throw new Error(`manifest.json: ${path}.file must be a non-empty string`)
  if (typeof cursor.animated !== 'boolean') throw new Error(`manifest.json: ${path}.animated must be a boolean`)
  if (typeof cursor.usesInvert !== 'boolean') throw new Error(`manifest.json: ${path}.usesInvert must be a boolean`)
  if (typeof cursor.frameCount !== 'number') throw new Error(`manifest.json: ${path}.frameCount must be a number`)
  if (typeof cursor.invertFrames !== 'number') throw new Error(`manifest.json: ${path}.invertFrames must be a number`)
  if (!Array.isArray(cursor.bitcounts)) throw new Error(`manifest.json: ${path}.bitcounts must be an array`)
  if (typeof cursor.width !== 'number') throw new Error(`manifest.json: ${path}.width must be a number`)
  if (typeof cursor.height !== 'number') throw new Error(`manifest.json: ${path}.height must be a number`)
  if (typeof cursor.suspiciousInvertFrames !== 'number') throw new Error(`manifest.json: ${path}.suspiciousInvertFrames must be a number`)
  if (cursor.reconstructed !== undefined && typeof cursor.reconstructed !== 'boolean') {
    throw new Error(`manifest.json: ${path}.reconstructed must be a boolean`)
  }
}

export function parseCursorsManifest(jsonText: string): CursorsManifest {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (e) {
    throw new Error(`manifest.json: invalid JSON - ${(e as Error).message}`)
  }

  if (typeof parsed !== 'object' || parsed === null) throw new Error('manifest.json: expected a top-level object')

  for (const [cursorId, entry] of Object.entries(parsed as Record<string, unknown>)) {
    assertCursorEntry(entry, `"${cursorId}"`)
  }

  return parsed as CursorsManifest
}

/** Empty manifest if manifest.json doesn't exist yet - discover has to work on a bare src-cursors/ directory. */
export function loadCursorsManifest(): CursorsManifest {
  if (!existsSync(cursorsManifestPath)) return {}
  return parseCursorsManifest(readFileSync(cursorsManifestPath, 'utf8'))
}

export interface PreservedCursor {
  sourceFile?: string
  reconstructed?: boolean
  /** Only set when reconstructed - the last known metadata, trusted verbatim since a reconstructed file's own bytes can't yield it back (see CursorEntry.reconstructed doc comment). */
  metadata?: RoleMetadata
}

/**
 * Pulls sourceFile + reconstructed (and - for reconstructed cursors only - the full metadata) out
 * of an existing manifest.json without running it through the full schema validation in
 * parseCursorsManifest, so a schema change elsewhere can't cost us this hand-curated/scraped/
 * captured data. Best-effort: any shape mismatch just yields fewer preserved fields, never an error.
 */
export function loadPreservedCursors(): Record<string, PreservedCursor> {
  if (!existsSync(cursorsManifestPath)) return {}

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(cursorsManifestPath, 'utf8'))
  } catch {
    return {}
  }
  if (typeof parsed !== 'object' || parsed === null) return {}

  const result: Record<string, PreservedCursor> = {}
  for (const [cursorId, cursorValue] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof cursorValue !== 'object' || cursorValue === null) continue
    const c = cursorValue as Record<string, unknown>

    const preserved: PreservedCursor = {}
    if (typeof c.sourceFile === 'string') preserved.sourceFile = c.sourceFile
    if (c.reconstructed === true) {
      preserved.reconstructed = true
      if (
        typeof c.animated === 'boolean' &&
        typeof c.usesInvert === 'boolean' &&
        typeof c.frameCount === 'number' &&
        typeof c.invertFrames === 'number' &&
        Array.isArray(c.bitcounts) &&
        typeof c.width === 'number' &&
        typeof c.height === 'number'
      ) {
        preserved.metadata = {
          animated: c.animated,
          usesInvert: c.usesInvert,
          frameCount: c.frameCount,
          invertFrames: c.invertFrames,
          bitcounts: c.bitcounts as number[],
          width: c.width,
          height: c.height,
          hotspotX: typeof c.hotspotX === 'number' ? c.hotspotX : null,
          hotspotY: typeof c.hotspotY === 'number' ? c.hotspotY : null,
          suspiciousInvertFrames: typeof c.suspiciousInvertFrames === 'number' ? c.suspiciousInvertFrames : 0,
        }
      }
    }

    result[cursorId] = preserved
  }

  return result
}

/** Sorted keys for a stable diff between runs. No BOM (plain 'utf8', not 'utf8-sig') - a Node JSON.parse elsewhere in this toolkit would choke on one. */
export function writeCursorsManifest(manifest: CursorsManifest): void {
  const sorted: CursorsManifest = {}
  for (const cursorId of Object.keys(manifest).sort()) sorted[cursorId] = manifest[cursorId]
  writeFileSync(cursorsManifestPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8')
}

function assertSchemeInfo(value: unknown, path: string): asserts value is SchemeInfo {
  if (typeof value !== 'object' || value === null) throw new Error(`scheme.json: ${path} is not an object`)
  const scheme = value as Record<string, unknown>

  if (typeof scheme.displayName !== 'string') throw new Error(`scheme.json: ${path}.displayName must be a string`)
  if (typeof scheme.roles !== 'object' || scheme.roles === null) throw new Error(`scheme.json: ${path}.roles must be an object`)
  for (const [role, cursorId] of Object.entries(scheme.roles as Record<string, unknown>)) {
    if (typeof cursorId !== 'string' || cursorId.length === 0) throw new Error(`scheme.json: ${path}.roles.${role} must be a non-empty string`)
  }
}

export function parseSchemeIndex(jsonText: string): SchemeIndex {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (e) {
    throw new Error(`scheme.json: invalid JSON - ${(e as Error).message}`)
  }

  if (typeof parsed !== 'object' || parsed === null) throw new Error('scheme.json: expected a top-level object')

  for (const [scheme, entry] of Object.entries(parsed as Record<string, unknown>)) {
    assertSchemeInfo(entry, `"${scheme}"`)
  }

  return parsed as SchemeIndex
}

/** Empty index if scheme.json doesn't exist yet. */
export function loadSchemeIndex(): SchemeIndex {
  if (!existsSync(schemeIndexPath)) return {}
  return parseSchemeIndex(readFileSync(schemeIndexPath, 'utf8'))
}

/** Sorted scheme keys, sorted role keys within each scheme, for a stable diff between runs. */
export function writeSchemeIndex(index: SchemeIndex): void {
  const sorted: SchemeIndex = {}
  for (const scheme of Object.keys(index).sort()) {
    const sortedRoles: Record<string, string> = {}
    for (const role of Object.keys(index[scheme].roles).sort()) sortedRoles[role] = index[scheme].roles[role]
    sorted[scheme] = { ...index[scheme], roles: sortedRoles }
  }
  writeFileSync(schemeIndexPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8')
}
