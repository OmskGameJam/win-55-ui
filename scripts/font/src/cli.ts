import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from 'node:fs'
import { basename, dirname, extname, resolve } from 'node:path'
import { parseArgs, getFlag, hasFlag } from './cli-args.js'
import { srcFontDir, publicFontDir, generatedFontsTsPath, generatedFontsCssPath } from './paths.js'
import { parseBdf, writeBdf } from './bdf.js'
import { rasterizeFont, type RasterizeOptions } from './rasterize.js'
import { mergeBdf, summarizeBackfill } from './merge.js'
import { buildTtf } from './build.js'
import { buildTofuFont } from './tofu.js'
import { buildSupportedFacesModule, buildFontFaceCss } from './register.js'
import { loadFontsManifest, expandDroppedRanges, tofuTtfFilename, type FaceEntry } from './fontsManifest.js'
import { faceLabel, mergeChain } from './facePipeline.js'
import { resolveVerticalMetrics } from './verticalMetrics.js'
import { SIZES } from './registry.js'
import type { BdfFont } from './types.js'

function usage(exitCode = 0): never {
  const output = [
    'Usage:',
    '  npm run font -- strike <source.ttf> <pixelSize> [--out bdf] [--charset chars] [--force]',
    '    [--generate-kerning] [--right-side-count n] [--right-side-volume n] [--flat-right-side-gap n] [--tail-right-side-gap n]',
    '  npm run font -- fallback <source.ttf> <pixelSize> [--out bdf] [--charset chars] [--force]',
    '    [--generate-kerning] [--right-side-count n] [--right-side-volume n] [--flat-right-side-gap n] [--tail-right-side-gap n]',
    '  npm run font -- merge <primary.bdf> <fallback.bdf> --out bdf [--skip cp,cp,...] [--report path.json] [--verbose]',
    '  npm run font -- build <bdf> [--out ttf] [--family name] [--style name] [--units-per-em-scale 100] [--report path.json]',
    '  npm run font -- tofu <bdf> [--out ttf] [--family name] [--style name] [--units-per-em-scale 100]',
    '    builds a single-glyph TofuMaker font from <bdf>\'s own \'?\' glyph, mapped to every Unicode codepoint - see tofu.ts',
    '  npm run font -- all <source.ttf> <style> <size> [--fallback-source ttf] [--force]',
    '  (strike/fallback/all refuse to overwrite an existing .bdf unless --force is given — existing BDFs may be hand-edited)',
    '  npm run font -- check <bdf>',
    '',
    '  Driven by src-font/fonts.json, no arguments. Existing files are skipped with a warning, not overwritten:',
    '  npm run font -- strike-all      strike faces missing their "strikeBdf"',
    '  npm run font -- fallback-all    strike (fallbackSource[i], fallbackBdf[i]) pairs missing fallbackBdf[i]',
    '  npm run font -- merge-all       merge strikeBdf + fallbackBdf[] into "mergePath"',
    '  npm run font -- build-all       build (mergePath ?? strikeBdf) into "ttf"',
    '  npm run font -- tofu-all        build the TofuMaker companion for every face with a resolvable ttf source',
    '  npm run font -- push-fonts      copy every "ttf" (+ TofuMaker companion) to public/win-55-ui/font/ (always overwrites)',
    '  npm run font -- update-register regenerate generatedFonts.ts + generated-fonts.css from fonts.json (always overwrites)',
    '  npm run font -- full-pipeline-all   runs all seven of the above in order, with a stage progress bar',
  ].join('\n')

  if (exitCode === 0) console.log(output)
  else console.error(output)
  process.exit(exitCode)
}

function fail(message: string): never {
  console.error(`font-cli: ${message}`)
  process.exit(1)
}

function inkCount(bitmap: number[][]): number {
  return bitmap.reduce((sum, row) => sum + row.filter((v) => v === 1).length, 0)
}

function parseOptionalInt(flags: Record<string, string | boolean>, key: string): number | undefined {
  const raw = getFlag(flags, key)
  if (raw === undefined) return undefined
  const n = Number(raw)
  if (!Number.isInteger(n)) fail(`--${key} must be an integer, got "${raw}"`)
  return n
}

function parsePixelSize(raw: string | undefined): number {
  const size = Number(raw)
  if (!raw || !Number.isInteger(size) || size <= 0) fail(`invalid pixel size: ${raw}`)
  return size
}

function defaultStrikeOut(sourcePath: string, pixelSize: number, suffix = ''): string {
  return resolve(srcFontDir, `${basename(sourcePath, extname(sourcePath))}-${pixelSize}${suffix}.bdf`)
}

async function runRasterizeToFile(
  sourcePath: string,
  pixelSize: number,
  outPath: string,
  opts: RasterizeOptions,
  force = false,
  shareVerticalMetrics = false,
): Promise<BdfFont> {
  if (!SIZES.includes(pixelSize)) {
    console.warn(`font-cli: warning: ${pixelSize}px isn't in the known SIZES list (${SIZES.join(', ')}) — continuing anyway`)
  }

  if (!existsSync(sourcePath)) fail(`source font not found: ${sourcePath}`)

  if (existsSync(outPath) && !force) {
    fail(`${outPath} already exists — pass --force to overwrite (existing BDFs may be hand-edited, don't clobber them silently)`)
  }

  const bdfFont = await rasterizeFont(sourcePath, pixelSize, opts)

  // Fallback strikes don't carry their own FONT_ASCENT/FONT_DESCENT into the final font (merge
  // keeps the primary's properties untouched), so only primary strikes participate in the
  // cross-style cache - a fallback measured first would otherwise seed it with the wrong values.
  if (shareVerticalMetrics) {
    const fontName = String(bdfFont.properties.FAMILY_NAME)
    const { metrics, overflow } = resolveVerticalMetrics(fontName, pixelSize, {
      fontAscent: Number(bdfFont.properties.FONT_ASCENT),
      fontDescent: Number(bdfFont.properties.FONT_DESCENT),
    })

    bdfFont.properties.FONT_ASCENT = metrics.fontAscent
    bdfFont.properties.FONT_DESCENT = metrics.fontDescent

    for (const message of overflow) {
      console.warn(`font-cli: warning: ${fontName} ${pixelSize}px: ${message} (glyph ink isn't clipped, but it can visually spill into the next line)`)
    }
  }

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, writeBdf(bdfFont), 'utf8')
  parseBdf(readFileSync(outPath, 'utf8')) // sanity round-trip before declaring success

  console.log(`font-cli: wrote ${bdfFont.glyphs.length} glyphs to ${outPath}`)
  return bdfFont
}

async function cmdStrike(args: string[], suffix = ''): Promise<void> {
  const { positional, flags } = parseArgs(args)
  const [sourcePath, sizeArg] = positional
  if (!sourcePath || !sizeArg) usage(1)

  const pixelSize = parsePixelSize(sizeArg)

  const outPath = getFlag(flags, 'out') ? resolve(getFlag(flags, 'out')!) : defaultStrikeOut(sourcePath, pixelSize, suffix)

  await runRasterizeToFile(
    resolve(sourcePath),
    pixelSize,
    outPath,
    {
      charset: getFlag(flags, 'charset'),
      generateKerning: hasFlag(flags, 'generate-kerning'),
      rightSideCount: parseOptionalInt(flags, 'right-side-count'),
      rightSideVolume: parseOptionalInt(flags, 'right-side-volume'),
      flatRightSideGap: parseOptionalInt(flags, 'flat-right-side-gap'),
      tailRightSideGap: parseOptionalInt(flags, 'tail-right-side-gap'),
    },
    hasFlag(flags, 'force'),
    suffix === '', // primary strike ("strike"), not a fallback strike
  )
}

function cmdMerge(args: string[]): void {
  const { positional, flags } = parseArgs(args)
  const [primaryPath, fallbackPath] = positional
  if (!primaryPath || !fallbackPath) usage(1)

  const outPath = getFlag(flags, 'out')
  if (!outPath) fail('merge requires --out <bdf>')

  const skipArg = getFlag(flags, 'skip')
  const skip = skipArg ? skipArg.split(',').map(Number) : undefined
  const reportPath = getFlag(flags, 'report')
  const verbose = hasFlag(flags, 'verbose')

  const primary = parseBdf(readFileSync(resolve(primaryPath), 'utf8'))
  const fallback = parseBdf(readFileSync(resolve(fallbackPath), 'utf8'))

  let result: ReturnType<typeof mergeBdf>
  try {
    result = mergeBdf(primary, fallback, { skip })
  } catch (e) {
    fail((e as Error).message)
  }

  const resolvedOut = resolve(outPath)
  mkdirSync(dirname(resolvedOut), { recursive: true })
  writeFileSync(resolvedOut, writeBdf(result.merged), 'utf8')

  console.log(`font-cli: ${summarizeBackfill(result.backfilled)}`)
  if (verbose) {
    for (const b of result.backfilled) {
      console.log(`  U+${b.encoding.toString(16).toUpperCase().padStart(4, '0')} ${JSON.stringify(b.char)} <- ${b.fallbackGlyphName}`)
    }
  }
  if (reportPath) {
    writeFileSync(resolve(reportPath), JSON.stringify(result.backfilled, null, 2) + '\n', 'utf8')
  }
}

function cmdBuild(args: string[]): void {
  const { positional, flags } = parseArgs(args)
  const [bdfPath] = positional
  if (!bdfPath) usage(1)

  const bdfFont = parseBdf(readFileSync(resolve(bdfPath), 'utf8'))
  const scaleArg = getFlag(flags, 'units-per-em-scale')

  let result: ReturnType<typeof buildTtf>
  try {
    result = buildTtf(bdfFont, {
      family: getFlag(flags, 'family'),
      style: getFlag(flags, 'style'),
      unitsPerEmScale: scaleArg ? Number(scaleArg) : undefined,
    })
  } catch (e) {
    fail((e as Error).message)
  }

  const outPath = resolve(getFlag(flags, 'out') ?? resolve(srcFontDir, `${basename(bdfPath, extname(bdfPath))}.ttf`))
  const tmpPath = `${outPath}.tmp`

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(tmpPath, Buffer.from(result.buffer))
  renameSync(tmpPath, outPath) // only committed once buildTtf returned without a hard error

  const reportPath = resolve(getFlag(flags, 'report') ?? `${outPath}.report.json`)

  if (result.report.flagged.length > 0 || result.report.skipped.length > 0) {
    writeFileSync(reportPath, JSON.stringify(result.report, null, 2) + '\n', 'utf8')
    const parts = [
      result.report.flagged.length > 0 ? `${result.report.flagged.length} flagged` : null,
      result.report.skipped.length > 0 ? `${result.report.skipped.length} skipped (excluded from the font entirely)` : null,
    ].filter(Boolean)
    console.log(`font-cli: built ${outPath} — ${result.report.glyphCount} glyphs, ${parts.join(', ')}, see ${reportPath}`)
  } else {
    console.log(`font-cli: built ${outPath} — ${result.report.glyphCount} glyphs, no issues flagged`)
  }
}

function cmdTofu(args: string[]): void {
  const { positional, flags } = parseArgs(args)
  const [bdfPath] = positional
  if (!bdfPath) usage(1)

  const bdfFont = parseBdf(readFileSync(resolve(bdfPath), 'utf8'))
  const scaleArg = getFlag(flags, 'units-per-em-scale')

  let buffer: ArrayBuffer
  try {
    buffer = buildTofuFont(bdfFont, {
      family: getFlag(flags, 'family'),
      style: getFlag(flags, 'style'),
      unitsPerEmScale: scaleArg ? Number(scaleArg) : undefined,
    })
  } catch (e) {
    fail((e as Error).message)
  }

  const outPath = resolve(getFlag(flags, 'out') ?? resolve(srcFontDir, `${basename(bdfPath, extname(bdfPath))}-TofuMaker.ttf`))
  const tmpPath = `${outPath}.tmp`

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(tmpPath, Buffer.from(buffer))
  renameSync(tmpPath, outPath)

  console.log(`font-cli: built ${outPath} — every Unicode codepoint mapped to '?'`)
}

/** Presence of `face.kerning` (even `{}`) is what turns auto-kerning on for strike-all/fallback-all. */
function rasterizeOptionsFor(face: FaceEntry): RasterizeOptions {
  return { style: face.style, family: face.fontName, generateKerning: face.kerning !== undefined, ...face.kerning }
}

async function cmdStrikeAll(): Promise<void> {
  const manifest = loadFontsManifest()
  let struck = 0
  let skipped = 0

  for (const face of manifest.faces) {
    if (!face.source || !face.strikeBdf) continue

    const sourcePath = resolve(srcFontDir, face.source)
    const outPath = resolve(srcFontDir, face.strikeBdf)

    if (existsSync(outPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${face.strikeBdf} already exists`)
      skipped++
      continue
    }
    if (!existsSync(sourcePath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: source not found (${face.source})`)
      skipped++
      continue
    }

    await runRasterizeToFile(sourcePath, face.size, outPath, rasterizeOptionsFor(face), false, true)
    struck++
  }

  console.log(`font-cli: strike-all done - ${struck} struck, ${skipped} skipped`)
}

async function cmdFallbackAll(): Promise<void> {
  const manifest = loadFontsManifest()
  let struck = 0
  let skipped = 0

  for (const face of manifest.faces) {
    if (!face.fallbackSource || !face.fallbackBdf) continue

    for (let i = 0; i < face.fallbackSource.length; i++) {
      const sourcePath = resolve(srcFontDir, face.fallbackSource[i])
      const outPath = resolve(srcFontDir, face.fallbackBdf[i])

      if (existsSync(outPath)) {
        console.warn(`font-cli: skip ${faceLabel(face)}: ${face.fallbackBdf[i]} already exists`)
        skipped++
        continue
      }
      if (!existsSync(sourcePath)) {
        console.warn(`font-cli: skip ${faceLabel(face)}: fallback source not found (${face.fallbackSource[i]})`)
        skipped++
        continue
      }

      await runRasterizeToFile(sourcePath, face.size, outPath, rasterizeOptionsFor(face))
      struck++
    }
  }

  console.log(`font-cli: fallback-all done - ${struck} struck, ${skipped} skipped`)
}

function cmdMergeAll(): void {
  const manifest = loadFontsManifest()
  const droppedCodepoints = expandDroppedRanges(manifest)
  let merged = 0
  let skipped = 0

  for (const face of manifest.faces) {
    if (!face.mergePath || !face.strikeBdf || !face.fallbackBdf || face.fallbackBdf.length === 0) continue

    const outPath = resolve(srcFontDir, face.mergePath)
    if (existsSync(outPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${face.mergePath} already exists`)
      skipped++
      continue
    }

    const strikeBdfPath = resolve(srcFontDir, face.strikeBdf)
    const fallbackBdfPaths = face.fallbackBdf.map((bdf) => resolve(srcFontDir, bdf))

    const inputs = [
      { rel: face.strikeBdf, abs: strikeBdfPath },
      ...face.fallbackBdf.map((rel, i) => ({ rel, abs: fallbackBdfPaths[i] })),
    ]
    const missing = inputs.filter((input) => !existsSync(input.abs)).map((input) => input.rel)

    if (missing.length > 0) {
      console.warn(`font-cli: skip ${faceLabel(face)}: missing input(s): ${missing.join(', ')}`)
      skipped++
      continue
    }

    let result: ReturnType<typeof mergeBdf>
    try {
      result = mergeChain(strikeBdfPath, fallbackBdfPaths, droppedCodepoints)
    } catch (e) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${(e as Error).message}`)
      skipped++
      continue
    }

    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, writeBdf(result.merged), 'utf8')

    console.log(`font-cli: merged ${faceLabel(face)} -> ${face.mergePath} (${summarizeBackfill(result.backfilled)})`)
    merged++
  }

  console.log(`font-cli: merge-all done - ${merged} merged, ${skipped} skipped`)
}

function cmdBuildAll(): void {
  const manifest = loadFontsManifest()
  let built = 0
  let skipped = 0

  for (const face of manifest.faces) {
    const bdfRelPath = face.mergePath ?? face.strikeBdf
    if (!bdfRelPath) continue

    const bdfPath = resolve(srcFontDir, bdfRelPath)
    const outPath = resolve(srcFontDir, face.ttf)

    if (existsSync(outPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${face.ttf} already exists`)
      skipped++
      continue
    }
    if (!existsSync(bdfPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${bdfRelPath} not found`)
      skipped++
      continue
    }

    const bdfFont = parseBdf(readFileSync(bdfPath, 'utf8'))

    let result: ReturnType<typeof buildTtf>
    try {
      result = buildTtf(bdfFont, { family: face.fontName, style: face.style })
    } catch (e) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${(e as Error).message}`)
      skipped++
      continue
    }

    const tmpPath = `${outPath}.tmp`
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(tmpPath, Buffer.from(result.buffer))
    renameSync(tmpPath, outPath)

    if (result.report.flagged.length > 0 || result.report.skipped.length > 0) {
      writeFileSync(`${outPath}.report.json`, JSON.stringify(result.report, null, 2) + '\n', 'utf8')
    }

    console.log(`font-cli: built ${faceLabel(face)} -> ${face.ttf} (${result.report.glyphCount} glyphs)`)
    built++
  }

  console.log(`font-cli: build-all done - ${built} built, ${skipped} skipped`)
}

function cmdTofuAll(): void {
  const manifest = loadFontsManifest()
  let built = 0
  let skipped = 0

  for (const face of manifest.faces) {
    const bdfRelPath = face.mergePath ?? face.strikeBdf
    if (!bdfRelPath) continue

    const bdfPath = resolve(srcFontDir, bdfRelPath)
    const outPath = resolve(srcFontDir, tofuTtfFilename(face))

    if (existsSync(outPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${tofuTtfFilename(face)} already exists`)
      skipped++
      continue
    }
    if (!existsSync(bdfPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${bdfRelPath} not found`)
      skipped++
      continue
    }

    const bdfFont = parseBdf(readFileSync(bdfPath, 'utf8'))

    let buffer: ArrayBuffer
    try {
      buffer = buildTofuFont(bdfFont, { family: face.fontName, style: face.style })
    } catch (e) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${(e as Error).message}`)
      skipped++
      continue
    }

    const tmpPath = `${outPath}.tmp`
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(tmpPath, Buffer.from(buffer))
    renameSync(tmpPath, outPath)

    console.log(`font-cli: built ${faceLabel(face)} -> ${tofuTtfFilename(face)}`)
    built++
  }

  console.log(`font-cli: tofu-all done - ${built} built, ${skipped} skipped`)
}

function cmdPushFonts(): void {
  const manifest = loadFontsManifest()
  let pushed = 0
  let skipped = 0

  mkdirSync(publicFontDir, { recursive: true })

  for (const face of manifest.faces) {
    const srcPath = resolve(srcFontDir, face.ttf)
    const destPath = resolve(publicFontDir, face.ttf)

    if (!existsSync(srcPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)}: ${face.ttf} not found in src-font/`)
      skipped++
      continue
    }

    copyFileSync(srcPath, destPath)
    console.log(`font-cli: pushed ${faceLabel(face)} -> public/win-55-ui/font/${face.ttf}`)
    pushed++

    const tofuSrcPath = resolve(srcFontDir, tofuTtfFilename(face))
    const tofuDestPath = resolve(publicFontDir, tofuTtfFilename(face))

    if (!existsSync(tofuSrcPath)) {
      console.warn(`font-cli: skip ${faceLabel(face)} TofuMaker: ${tofuTtfFilename(face)} not found in src-font/ (run tofu-all first)`)
      skipped++
      continue
    }

    copyFileSync(tofuSrcPath, tofuDestPath)
    console.log(`font-cli: pushed ${faceLabel(face)} TofuMaker -> public/win-55-ui/font/${tofuTtfFilename(face)}`)
    pushed++
  }

  console.log(`font-cli: push-fonts done - ${pushed} pushed, ${skipped} skipped`)
}

function cmdUpdateRegister(): void {
  const manifest = loadFontsManifest()

  writeFileSync(generatedFontsTsPath, buildSupportedFacesModule(manifest), 'utf8')
  writeFileSync(generatedFontsCssPath, buildFontFaceCss(manifest), 'utf8')

  console.log(`font-cli: regenerated generatedFonts.ts and generated-fonts.css from ${manifest.faces.length} face(s) - review with git diff.`)
}

const PIPELINE_STAGES: { label: string; run: () => void | Promise<void> }[] = [
  { label: 'strike-all', run: cmdStrikeAll },
  { label: 'fallback-all', run: cmdFallbackAll },
  { label: 'merge-all', run: cmdMergeAll },
  { label: 'build-all', run: cmdBuildAll },
  { label: 'tofu-all', run: cmdTofuAll },
  { label: 'push-fonts', run: cmdPushFonts },
  { label: 'update-register', run: cmdUpdateRegister },
]

function printPipelineProgress(done: number, total: number, label: string): void {
  const width = 24
  const filled = Math.round((done / total) * width)
  const bar = '#'.repeat(filled) + '-'.repeat(width - filled)
  console.log(`\nfont-cli: [${bar}] ${done}/${total} - ${label}`)
}

/** Runs every manifest-driven stage in order - the "just BOOM and run everything" command. */
async function cmdFullPipelineAll(): Promise<void> {
  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i]
    printPipelineProgress(i, PIPELINE_STAGES.length, `starting ${stage.label}`)
    await stage.run()
  }
  printPipelineProgress(PIPELINE_STAGES.length, PIPELINE_STAGES.length, 'done')
}

async function cmdAll(args: string[]): Promise<void> {
  const { positional, flags } = parseArgs(args)
  const [sourcePath, style, sizeArg] = positional
  if (!sourcePath || !style || !sizeArg) usage(1)

  const pixelSize = parsePixelSize(sizeArg)
  const force = hasFlag(flags, 'force')
  const strikeOut = defaultStrikeOut(sourcePath, pixelSize)

  await runRasterizeToFile(resolve(sourcePath), pixelSize, strikeOut, {}, force, true)

  const fallbackSource = getFlag(flags, 'fallback-source')
  if (fallbackSource) {
    const fallbackOut = defaultStrikeOut(fallbackSource, pixelSize, '.fallback')
    await runRasterizeToFile(resolve(fallbackSource), pixelSize, fallbackOut, {}, force)

    const primary = parseBdf(readFileSync(strikeOut, 'utf8'))
    const fallback = parseBdf(readFileSync(fallbackOut, 'utf8'))
    const { merged, backfilled } = mergeBdf(primary, fallback)

    writeFileSync(strikeOut, writeBdf(merged), 'utf8')
    console.log(`font-cli: ${summarizeBackfill(backfilled)}`)
  }

  console.log(`\nfont-cli: strike ready at ${strikeOut}`)
  console.log('next steps: hand-review the BDF (it is plain text, edit pixels directly if needed), then:')
  console.log(`  npm run font -- build ${strikeOut} --style ${style}`)
  console.log(`  npm run font -- register ${style} ${pixelSize} --ttf <built.ttf> --write`)
}

function cmdCheck(args: string[]): void {
  const [bdfPath] = args
  if (!bdfPath) usage(1)

  const font = parseBdf(readFileSync(resolve(bdfPath), 'utf8'))

  const blank: string[] = []
  const issues: string[] = []
  const seen = new Map<number, string>()

  for (const glyph of font.glyphs) {
    if (inkCount(glyph.bitmap) === 0) blank.push(glyph.name)

    if (seen.has(glyph.encoding)) {
      issues.push(`duplicate encoding U+${glyph.encoding.toString(16)}: "${seen.get(glyph.encoding)}" and "${glyph.name}"`)
    } else {
      seen.set(glyph.encoding, glyph.name)
    }

    const bitmapWidth = glyph.bitmap[0]?.length ?? 0
    if (glyph.bitmap.length !== glyph.bbx.h || bitmapWidth !== glyph.bbx.w) {
      issues.push(`"${glyph.name}": bitmap ${bitmapWidth}x${glyph.bitmap.length} doesn't match BBX ${glyph.bbx.w}x${glyph.bbx.h}`)
    }
  }

  console.log(`font-cli: ${bdfPath}`)
  console.log(`  ${font.glyphs.length} glyphs, ${font.pointSize}px`)
  console.log(`  ${blank.length} blank glyph(s)${blank.length > 0 ? ': ' + blank.slice(0, 10).join(', ') + (blank.length > 10 ? ', ...' : '') : ''}`)

  if (issues.length > 0) {
    console.log(`  ${issues.length} issue(s):`)
    for (const issue of issues) console.log(`    ${issue}`)
  } else {
    console.log('  no structural issues found')
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || command === '-h' || command === '--help' || command === 'help') {
    usage(0)
  }

  switch (command) {
    case 'strike':
      await cmdStrike(rest)
      break
    case 'fallback':
      await cmdStrike(rest, '.fallback')
      break
    case 'merge':
      cmdMerge(rest)
      break
    case 'build':
      cmdBuild(rest)
      break
    case 'tofu':
      cmdTofu(rest)
      break
    case 'all':
      await cmdAll(rest)
      break
    case 'check':
      cmdCheck(rest)
      break
    case 'strike-all':
      await cmdStrikeAll()
      break
    case 'fallback-all':
      await cmdFallbackAll()
      break
    case 'merge-all':
      cmdMergeAll()
      break
    case 'build-all':
      cmdBuildAll()
      break
    case 'tofu-all':
      cmdTofuAll()
      break
    case 'push-fonts':
      cmdPushFonts()
      break
    case 'update-register':
      cmdUpdateRegister()
      break
    case 'full-pipeline-all':
      await cmdFullPipelineAll()
      break
    default:
      fail(`unknown command: ${command}`)
  }
}

main()
