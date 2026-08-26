import { readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { srcCursorsDir } from './paths.js'
import { analyzeRoleFile } from './analyze.js'
import { loadPreservedFields, writeCursorsManifest, type CursorsManifest, type SchemeEntry } from './manifest.js'

const CURSOR_EXTENSIONS = new Set(['.cur', '.ani'])

/** Best-effort fallback only - every scheme discover has actually produced so far already has a real displayName preserved from the registry scrape, so this only fires for a brand new directory dropped in by hand. */
function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => (/^\d+[a-z]+$/.test(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')
}

function listSchemeDirs(): string[] {
  return readdirSync(srcCursorsDir)
    .filter((name) => statSync(join(srcCursorsDir, name)).isDirectory())
    .sort()
}

function listRoleFiles(schemeDir: string): string[] {
  return readdirSync(schemeDir)
    .filter((name) => CURSOR_EXTENSIONS.has(extname(name).toLowerCase()))
    .sort()
}

export interface DiscoverResult {
  manifest: CursorsManifest
  schemesFound: number
  rolesFound: number
  schemesAdded: string[]
  schemesRemoved: string[]
  rolesAdded: string[] // "scheme/role"
  rolesRemoved: string[]
  /** "scheme/role" with at least one non-white invert pixel. */
  suspiciousInvertRoles: string[]
}

/**
 * Rebuilds manifest.json from what's actually on disk under src-cursors/ - every role's metadata
 * (dimensions, hotspot, invert usage, bit depth, frame count) is always re-derived from the file
 * itself, never trusted from the old manifest. Only displayName and sourceFile are carried over
 * (via loadPreservedFields, not the strict manifest reader - see its doc comment), since those
 * aren't recoverable from the binary.
 */
export function discover(): DiscoverResult {
  const preserved = loadPreservedFields()
  const manifest: CursorsManifest = {}

  const schemeSlugs = listSchemeDirs()
  const schemesAdded: string[] = []
  const rolesAdded: string[] = []
  const rolesRemoved: string[] = []
  const suspiciousInvertRoles: string[] = []
  let rolesFound = 0

  for (const slug of schemeSlugs) {
    const previousScheme = preserved[slug]
    if (!previousScheme) schemesAdded.push(slug)

    const schemeDir = join(srcCursorsDir, slug)
    const scheme: SchemeEntry = {
      displayName: previousScheme?.displayName ?? titleFromSlug(slug),
      roles: {},
    }

    for (const filename of listRoleFiles(schemeDir)) {
      const role = basename(filename, extname(filename))
      const previousRole = previousScheme?.roles[role]
      if (previousScheme && !previousRole) rolesAdded.push(`${slug}/${role}`)

      // Dimensions/hotspot are always trustworthy, even for a reconstructed file - only the
      // invert/bit-depth signal is destroyed by reconstruction (see RoleEntry.reconstructed),
      // so only that subset is overridden from the last captured ground truth.
      const metadata = analyzeRoleFile(join(schemeDir, filename))
      if (previousRole?.reconstructed && previousRole.metadata) {
        const { usesInvert, bitcounts, frameCount, invertFrames, suspiciousInvertFrames } = previousRole.metadata
        Object.assign(metadata, { usesInvert, bitcounts, frameCount, invertFrames, suspiciousInvertFrames })
      }

      if (metadata.suspiciousInvertFrames > 0) suspiciousInvertRoles.push(`${slug}/${role}`)

      scheme.roles[role] = { file: filename, sourceFile: previousRole?.sourceFile, reconstructed: previousRole?.reconstructed, ...metadata }
      rolesFound++
    }

    if (previousScheme) {
      for (const role of Object.keys(previousScheme.roles)) {
        if (!(role in scheme.roles)) rolesRemoved.push(`${slug}/${role}`)
      }
    }

    manifest[slug] = scheme
  }

  const schemesRemoved = Object.keys(preserved).filter((slug) => !manifest[slug])

  writeCursorsManifest(manifest)

  return { manifest, schemesFound: schemeSlugs.length, rolesFound, schemesAdded, schemesRemoved, rolesAdded, rolesRemoved, suspiciousInvertRoles }
}
