import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { cursorsManifestPath } from './paths.js'
import type { RoleMetadata } from './analyze.js'

export interface RoleEntry extends RoleMetadata {
  /** Filename within the scheme's directory, e.g. "crosshair.cur". */
  file: string
  /** Provenance only (a registry-scraped original filename, or "live:OCR_<id>") - not derivable from the file itself, so discover preserves it across re-runs instead of regenerating it. */
  sourceFile?: string
  /**
   * True when the .cur bytes were synthesized from a live-captured HCURSOR (see CurExtract.cs)
   * rather than being an original pristine cursor resource. Reconstruction always flattens the
   * AND/XOR raster op into 32bpp color+alpha, so re-parsing the file can never recover true
   * usesInvert/bitcounts - discover preserves this role's metadata verbatim instead of
   * re-deriving it, the same way it preserves sourceFile.
   */
  reconstructed?: boolean
}

export interface SchemeEntry {
  /** Human-readable label. Not derivable from the directory slug for every scheme (e.g. "3d-bronze" -> "3D-Bronze"), so discover preserves an existing value instead of overwriting it with a guess. */
  displayName: string
  roles: Record<string, RoleEntry>
}

export type CursorsManifest = Record<string, SchemeEntry>

function assertRoleEntry(value: unknown, path: string): asserts value is RoleEntry {
  if (typeof value !== 'object' || value === null) throw new Error(`manifest.json: ${path} is not an object`)
  const role = value as Record<string, unknown>

  if (typeof role.file !== 'string' || role.file.length === 0) throw new Error(`manifest.json: ${path}.file must be a non-empty string`)
  if (typeof role.animated !== 'boolean') throw new Error(`manifest.json: ${path}.animated must be a boolean`)
  if (typeof role.usesInvert !== 'boolean') throw new Error(`manifest.json: ${path}.usesInvert must be a boolean`)
  if (typeof role.frameCount !== 'number') throw new Error(`manifest.json: ${path}.frameCount must be a number`)
  if (typeof role.invertFrames !== 'number') throw new Error(`manifest.json: ${path}.invertFrames must be a number`)
  if (!Array.isArray(role.bitcounts)) throw new Error(`manifest.json: ${path}.bitcounts must be an array`)
  if (typeof role.width !== 'number') throw new Error(`manifest.json: ${path}.width must be a number`)
  if (typeof role.height !== 'number') throw new Error(`manifest.json: ${path}.height must be a number`)
  if (typeof role.suspiciousInvertFrames !== 'number') throw new Error(`manifest.json: ${path}.suspiciousInvertFrames must be a number`)
  if (role.reconstructed !== undefined && typeof role.reconstructed !== 'boolean') {
    throw new Error(`manifest.json: ${path}.reconstructed must be a boolean`)
  }
}

function assertSchemeEntry(value: unknown, slug: string): asserts value is SchemeEntry {
  if (typeof value !== 'object' || value === null) throw new Error(`manifest.json: "${slug}" is not an object`)
  const scheme = value as Record<string, unknown>

  if (typeof scheme.displayName !== 'string') throw new Error(`manifest.json: "${slug}".displayName must be a string`)
  if (typeof scheme.roles !== 'object' || scheme.roles === null) throw new Error(`manifest.json: "${slug}".roles must be an object`)

  for (const [role, entry] of Object.entries(scheme.roles as Record<string, unknown>)) {
    assertRoleEntry(entry, `"${slug}".roles.${role}`)
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

  for (const [slug, entry] of Object.entries(parsed as Record<string, unknown>)) {
    assertSchemeEntry(entry, slug)
  }

  return parsed as CursorsManifest
}

/** Empty manifest if manifest.json doesn't exist yet - discover has to work on a bare src-cursors/ directory. */
export function loadCursorsManifest(): CursorsManifest {
  if (!existsSync(cursorsManifestPath)) return {}
  return parseCursorsManifest(readFileSync(cursorsManifestPath, 'utf8'))
}

export interface PreservedRole {
  sourceFile?: string
  reconstructed?: boolean
  /** Only set when reconstructed - the last known metadata, trusted verbatim since a reconstructed file's own bytes can't yield it back (see RoleEntry.reconstructed doc comment). */
  metadata?: RoleMetadata
}

export interface PreservedScheme {
  displayName?: string
  roles: Record<string, PreservedRole>
}

/**
 * Pulls displayName + per-role provenance (sourceFile, reconstructed, and - for reconstructed
 * roles only - the full metadata) out of an existing manifest.json without running it through
 * the full schema validation in parseCursorsManifest, so a schema change elsewhere (a renamed or
 * added field) can't cost us this hand-curated/scraped/captured data. Best-effort: any shape
 * mismatch just yields fewer preserved fields, never an error.
 */
export function loadPreservedFields(): Record<string, PreservedScheme> {
  if (!existsSync(cursorsManifestPath)) return {}

  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(cursorsManifestPath, 'utf8'))
  } catch {
    return {}
  }
  if (typeof parsed !== 'object' || parsed === null) return {}

  const result: Record<string, PreservedScheme> = {}
  for (const [slug, schemeValue] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof schemeValue !== 'object' || schemeValue === null) continue
    const scheme = schemeValue as Record<string, unknown>

    const preserved: PreservedScheme = { roles: {} }
    if (typeof scheme.displayName === 'string') preserved.displayName = scheme.displayName

    if (typeof scheme.roles === 'object' && scheme.roles !== null) {
      for (const [role, roleValue] of Object.entries(scheme.roles as Record<string, unknown>)) {
        if (typeof roleValue !== 'object' || roleValue === null) continue
        const r = roleValue as Record<string, unknown>

        const preservedRole: PreservedRole = {}
        if (typeof r.sourceFile === 'string') preservedRole.sourceFile = r.sourceFile
        if (r.reconstructed === true) {
          preservedRole.reconstructed = true
          if (
            typeof r.animated === 'boolean' &&
            typeof r.usesInvert === 'boolean' &&
            typeof r.frameCount === 'number' &&
            typeof r.invertFrames === 'number' &&
            Array.isArray(r.bitcounts) &&
            typeof r.width === 'number' &&
            typeof r.height === 'number'
          ) {
            preservedRole.metadata = {
              animated: r.animated,
              usesInvert: r.usesInvert,
              frameCount: r.frameCount,
              invertFrames: r.invertFrames,
              bitcounts: r.bitcounts as number[],
              width: r.width,
              height: r.height,
              hotspotX: typeof r.hotspotX === 'number' ? r.hotspotX : null,
              hotspotY: typeof r.hotspotY === 'number' ? r.hotspotY : null,
              suspiciousInvertFrames: typeof r.suspiciousInvertFrames === 'number' ? r.suspiciousInvertFrames : 0,
            }
          }
        }

        preserved.roles[role] = preservedRole
      }
    }

    result[slug] = preserved
  }

  return result
}

/** Sorted keys for a stable diff between runs. No BOM (plain 'utf8', not 'utf8-sig') - a Node JSON.parse elsewhere in this toolkit would choke on one. */
export function writeCursorsManifest(manifest: CursorsManifest): void {
  const sorted: CursorsManifest = {}
  for (const schemeSlug of Object.keys(manifest).sort()) {
    const scheme = manifest[schemeSlug]
    const sortedRoles: Record<string, RoleEntry> = {}
    for (const role of Object.keys(scheme.roles).sort()) sortedRoles[role] = scheme.roles[role]
    sorted[schemeSlug] = { ...scheme, roles: sortedRoles }
  }

  writeFileSync(cursorsManifestPath, JSON.stringify(sorted, null, 2) + '\n', 'utf8')
}
