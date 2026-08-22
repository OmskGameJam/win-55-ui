/**
 * "I hand-edited a BDF, make the final font catch up" - re-merge (if needed) + rebuild + republish
 * a single manifest face, unconditionally overwriting every output. Deliberately separate from
 * cli.ts's strike-all/fallback-all/build-all/tofu-all/push-fonts: those intentionally skip a file
 * that already exists (existing BDFs may be hand-edited, existing TTFs may be mid-review) - this
 * is the opposite intent, always overwrite, driven by charedit.ts on exit.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { parseBdf, writeBdf } from './bdf.js'
import { mergeBdf, summarizeBackfill, type MergeResult } from './merge.js'
import { buildTtf } from './build.js'
import { buildTofuFont } from './tofu.js'
import { loadFontsManifest, expandDroppedRanges, tofuTtfFilename, type FaceEntry, type FontsManifest } from './fontsManifest.js'
import { srcFontDir, publicFontDir } from './paths.js'

export function faceLabel(face: FaceEntry): string {
  return `${face.fontName}/${face.style}/${face.size}`
}

/**
 * Sequentially folds strikeBdf + fallbackBdf[0..n] into one BDF, first to last - same rule merge-all
 * uses. `skip` (typically `expandDroppedRanges(manifest)`) excludes codepoints from backfill even
 * though a fallback has them - the fallbackBdf files themselves are untouched either way, only the
 * merged output excludes them (see fonts.json's `droppedRanges`, FONTS.md).
 */
export function mergeChain(strikeBdfPath: string, fallbackBdfPaths: string[], skip?: number[]): MergeResult {
  let primary = parseBdf(readFileSync(strikeBdfPath, 'utf8'))
  let backfilled: MergeResult['backfilled'] = []

  for (const fallbackPath of fallbackBdfPaths) {
    const fallback = parseBdf(readFileSync(fallbackPath, 'utf8'))
    const result = mergeBdf(primary, fallback, { skip })
    primary = result.merged
    backfilled = backfilled.concat(result.backfilled)
  }

  return { merged: primary, backfilled }
}

export interface RebuildResult {
  face: FaceEntry
  merged: boolean
  built: boolean
  tofuBuilt: boolean
  pushed: boolean
  log: string[]
}

/**
 * `skipMerge` is for when the edited BDF *is* face.mergePath itself: merge reads strikeBdf +
 * fallbackBdf and always writes mergePath from scratch, so re-running it would silently discard
 * an edit made directly to the merged file instead of the pre-merge strike.
 */
export function rebuildFace(face: FaceEntry, opts: { skipMerge?: boolean; droppedCodepoints?: number[] } = {}): RebuildResult {
  const log: string[] = []
  const result: RebuildResult = { face, merged: false, built: false, tofuBuilt: false, pushed: false, log }

  const hasFallback = !!(face.mergePath && face.strikeBdf && face.fallbackBdf && face.fallbackBdf.length > 0)

  if (!opts.skipMerge && hasFallback) {
    const strikeBdfPath = resolve(srcFontDir, face.strikeBdf!)
    const fallbackBdfPaths = face.fallbackBdf!.map((p) => resolve(srcFontDir, p))
    const missing = [strikeBdfPath, ...fallbackBdfPaths].filter((p) => !existsSync(p))

    if (missing.length > 0) {
      log.push(`skip merge for ${faceLabel(face)}: missing input(s): ${missing.join(', ')}`)
    } else {
      const { merged, backfilled } = mergeChain(strikeBdfPath, fallbackBdfPaths, opts.droppedCodepoints)
      const mergeOutPath = resolve(srcFontDir, face.mergePath!)
      mkdirSync(dirname(mergeOutPath), { recursive: true })
      writeFileSync(mergeOutPath, writeBdf(merged), 'utf8')
      log.push(`merged ${faceLabel(face)} -> ${face.mergePath} (${summarizeBackfill(backfilled)})`)
      result.merged = true
    }
  }

  const bdfRelPath = face.mergePath ?? face.strikeBdf
  if (!bdfRelPath) {
    log.push(`skip ${faceLabel(face)}: no strikeBdf/mergePath in manifest`)
    return result
  }

  const bdfPath = resolve(srcFontDir, bdfRelPath)
  if (!existsSync(bdfPath)) {
    log.push(`skip build for ${faceLabel(face)}: ${bdfRelPath} not found`)
    return result
  }

  const bdfFont = parseBdf(readFileSync(bdfPath, 'utf8'))

  let ttfBuffer: ArrayBuffer
  try {
    const buildResult = buildTtf(bdfFont, { family: face.fontName, style: face.style })
    ttfBuffer = buildResult.buffer

    const ttfOutPath = resolve(srcFontDir, face.ttf)
    const tmpPath = `${ttfOutPath}.tmp`
    mkdirSync(dirname(ttfOutPath), { recursive: true })
    writeFileSync(tmpPath, Buffer.from(ttfBuffer))
    renameSync(tmpPath, ttfOutPath)

    if (buildResult.report.flagged.length > 0 || buildResult.report.skipped.length > 0) {
      writeFileSync(`${ttfOutPath}.report.json`, JSON.stringify(buildResult.report, null, 2) + '\n', 'utf8')
    }

    log.push(`built ${faceLabel(face)} -> ${face.ttf} (${buildResult.report.glyphCount} glyphs)`)
    result.built = true
  } catch (e) {
    log.push(`build failed for ${faceLabel(face)}: ${(e as Error).message}`)
    return result
  }

  const tofuName = tofuTtfFilename(face)
  try {
    const tofuBuffer = buildTofuFont(bdfFont, { family: face.fontName, style: face.style })
    const tofuOutPath = resolve(srcFontDir, tofuName)
    const tofuTmpPath = `${tofuOutPath}.tmp`
    mkdirSync(dirname(tofuOutPath), { recursive: true })
    writeFileSync(tofuTmpPath, Buffer.from(tofuBuffer))
    renameSync(tofuTmpPath, tofuOutPath)

    log.push(`built ${faceLabel(face)} -> ${tofuName}`)
    result.tofuBuilt = true
  } catch (e) {
    log.push(`tofu build failed for ${faceLabel(face)}: ${(e as Error).message}`)
    return result
  }

  mkdirSync(publicFontDir, { recursive: true })
  copyFileSync(resolve(srcFontDir, face.ttf), resolve(publicFontDir, face.ttf))
  copyFileSync(resolve(srcFontDir, tofuName), resolve(publicFontDir, tofuName))
  log.push(`pushed ${faceLabel(face)} -> public/win-55-ui/font/${face.ttf} (+ TofuMaker)`)
  result.pushed = true

  return result
}

/** Every manifest face where `bdfPath` (absolute) is the strikeBdf, a fallbackBdf entry, or the mergePath itself. */
export function facesReferencingBdf(manifest: FontsManifest, bdfPath: string): { face: FaceEntry; isMergePath: boolean }[] {
  const matches: { face: FaceEntry; isMergePath: boolean }[] = []

  for (const face of manifest.faces) {
    const strikeAbs = face.strikeBdf ? resolve(srcFontDir, face.strikeBdf) : undefined
    const mergeAbs = face.mergePath ? resolve(srcFontDir, face.mergePath) : undefined
    const fallbackAbs = (face.fallbackBdf ?? []).map((p) => resolve(srcFontDir, p))

    if (bdfPath === strikeAbs || bdfPath === mergeAbs || fallbackAbs.includes(bdfPath)) {
      matches.push({ face, isMergePath: bdfPath === mergeAbs })
    }
  }

  return matches
}

/** The charedit.ts exit hook: rebuild + republish every face this BDF feeds into, always overwriting. */
export function rebuildFacesForBdf(bdfPath: string): RebuildResult[] {
  const manifest = loadFontsManifest()
  const droppedCodepoints = expandDroppedRanges(manifest)
  const matches = facesReferencingBdf(manifest, bdfPath)
  return matches.map(({ face, isMergePath }) => rebuildFace(face, { skipMerge: isMergePath, droppedCodepoints }))
}
