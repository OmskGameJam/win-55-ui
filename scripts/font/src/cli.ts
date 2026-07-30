import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, copyFileSync } from 'node:fs'
import { basename, dirname, extname, resolve } from 'node:path'
import { parseArgs, getFlag, hasFlag } from './cli-args.js'
import { projectRoot, srcFontDir, publicFontDir } from './paths.js'
import { parseBdf, writeBdf } from './bdf.js'
import { rasterizeFont, type Hinting, type RasterizeOptions } from './rasterize.js'
import { mergeBdf, summarizeBackfill } from './merge.js'
import { buildTtf } from './build.js'
import { computeRegistrationPlan, insertFontFace, insertSupportedFace, isSizeRegistered } from './register.js'
import { SIZES } from './registry.js'
import type { BdfFont } from './types.js'

function usage(exitCode = 0): never {
  const output = [
    'Usage:',
    '  npm run font -- strike <source.ttf> <pixelSize> [--out bdf] [--hinting native|auto] [--charset chars] [--force]',
    '  npm run font -- fallback <source.ttf> <pixelSize> [--out bdf] [--hinting native|auto] [--charset chars] [--force]',
    '  npm run font -- merge <primary.bdf> <fallback.bdf> --out bdf [--skip cp,cp,...] [--report path.json] [--verbose]',
    '  npm run font -- build <bdf> [--out ttf] [--family name] [--style name] [--units-per-em-scale 100] [--report path.json]',
    '  npm run font -- register <style> <size> [--ttf path] [--write] [--font-name Standard]',
    '  npm run font -- all <source.ttf> <style> <size> [--fallback-source ttf] [--force]',
    '  (strike/fallback/all refuse to overwrite an existing .bdf unless --force is given — existing BDFs may be hand-edited)',
    '  npm run font -- check <bdf>',
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
): Promise<BdfFont> {
  if (!SIZES.includes(pixelSize)) {
    console.warn(`font-cli: warning: ${pixelSize}px isn't in the known SIZES list (${SIZES.join(', ')}) — continuing anyway`)
  }

  if (!existsSync(sourcePath)) fail(`source font not found: ${sourcePath}`)

  if (existsSync(outPath) && !force) {
    fail(`${outPath} already exists — pass --force to overwrite (existing BDFs may be hand-edited, don't clobber them silently)`)
  }

  const bdfFont = await rasterizeFont(sourcePath, pixelSize, opts)

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
  const hinting = getFlag(flags, 'hinting') as Hinting | undefined
  if (hinting && hinting !== 'native' && hinting !== 'auto') fail(`--hinting must be "native" or "auto", got "${hinting}"`)

  const outPath = getFlag(flags, 'out') ? resolve(getFlag(flags, 'out')!) : defaultStrikeOut(sourcePath, pixelSize, suffix)

  await runRasterizeToFile(resolve(sourcePath), pixelSize, outPath, { hinting, charset: getFlag(flags, 'charset') }, hasFlag(flags, 'force'))
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

function cmdRegister(args: string[]): void {
  const { positional, flags } = parseArgs(args)
  const [style, sizeArg] = positional
  if (!style || !sizeArg) usage(1)

  const size = parsePixelSize(sizeArg)
  const fontName = getFlag(flags, 'font-name') ?? 'Standard'
  const plan = computeRegistrationPlan(style, size, fontName)

  const cssPath = resolve(projectRoot, 'src', 'index.css')
  const tsPath = resolve(projectRoot, 'src', 'helpers', 'typography.ts')
  const tsText = readFileSync(tsPath, 'utf8')

  console.log('--- add to src/index.css ---')
  console.log(plan.cssBlock)
  console.log('\n--- add to SUPPORTED_FACES in src/helpers/typography.ts ---')
  console.log(plan.supportedFacesEntry)

  if (!isSizeRegistered(tsText, size)) {
    console.log(`\nnote: ${size} isn't in the SIZES array in typography.ts yet — add it by hand if this is a wholly new pixel size.`)
  }

  if (hasFlag(flags, 'write')) {
    const ttfPath = getFlag(flags, 'ttf')
    if (!ttfPath) fail('--write requires --ttf <path to the built .ttf>')

    mkdirSync(publicFontDir, { recursive: true })
    copyFileSync(resolve(ttfPath), resolve(publicFontDir, plan.publicTtfFilename))

    const cssText = readFileSync(cssPath, 'utf8')
    writeFileSync(cssPath, insertFontFace(cssText, plan.cssBlock), 'utf8')
    writeFileSync(tsPath, insertSupportedFace(tsText, plan.supportedFacesEntry), 'utf8')

    console.log(`\nfont-cli: wrote ${plan.publicTtfFilename} to public/win-55-ui/font/ and patched index.css + typography.ts — review with git diff.`)
  }
}

async function cmdAll(args: string[]): Promise<void> {
  const { positional, flags } = parseArgs(args)
  const [sourcePath, style, sizeArg] = positional
  if (!sourcePath || !style || !sizeArg) usage(1)

  const pixelSize = parsePixelSize(sizeArg)
  const force = hasFlag(flags, 'force')
  const strikeOut = defaultStrikeOut(sourcePath, pixelSize)

  await runRasterizeToFile(resolve(sourcePath), pixelSize, strikeOut, {}, force)

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
    case 'register':
      cmdRegister(rest)
      break
    case 'all':
      await cmdAll(rest)
      break
    case 'check':
      cmdCheck(rest)
      break
    default:
      fail(`unknown command: ${command}`)
  }
}

main()
