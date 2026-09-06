import { discover } from './discover.js'
import { generateSprites } from './sprite.js'
import { hasFlag, parseArgs } from './cli-args.js'

function usage(exitCode = 0): never {
  const output = [
    'Usage:',
    '  npm run cursors -- discover',
    '    Scans src-cursors/ (flat, one .cur/.ani per physical cursor) and (re)writes manifest.json and',
    '    scheme.json. manifest.json is purely physical metadata (dimensions, hotspot, bit depth, animation',
    '    frame count, screen-XOR "invert" usage) always re-derived from the files themselves, plus sourceFile',
    '    carried over from the existing manifest.json when present (not recoverable from the binary alone).',
    '    scheme.json holds the actual role -> cursorId mapping per scheme and is not derivable from disk once',
    '    byte-identical duplicates are deduped away, so it is preserved verbatim from the existing scheme.json,',
    '    only dropping (and reporting) a role whose cursorId no longer exists.',
    '  npm run cursors -- sprite [--force]',
    '    Renders every cursor in manifest.json to public/win-55-ui/cursors/<cursorId>/{normal,invert}.gif',
    '    at 2x scale. A layer with no opaque pixels in any frame (e.g. crosshair has no "normal" layer) is',
    '    skipped rather than written blank. An existing output file is left alone (it may have been hand-',
    '    touched-up) unless --force overwrites it. Reads manifest.json as-is - run discover first if stale.',
    '    Also (re)publishes manifest.json and scheme.json themselves to public/win-55-ui/cursors/ - the',
    '    runtime registry src/helpers/cursors.ts resolves scheme/role names against - always overwritten.',
  ].join('\n')

  if (exitCode === 0) console.log(output)
  else console.error(output)
  process.exit(exitCode)
}

function fail(message: string): never {
  console.error(`cursors-cli: ${message}`)
  process.exit(1)
}

function cmdDiscover(): void {
  const result = discover()

  console.log(`cursors-cli: discovered ${result.cursorsFound} cursor(s), ${Object.keys(result.schemeIndex).length} scheme(s)`)
  if (result.cursorsAdded.length > 0) console.log(`  new cursor(s): ${result.cursorsAdded.join(', ')}`)
  if (result.cursorsRemoved.length > 0) console.log(`  cursor(s) no longer on disk (dropped from manifest.json): ${result.cursorsRemoved.join(', ')}`)
  if (result.danglingSchemeRoles.length > 0) console.warn(`  scheme.json role(s) pointing at a missing cursor (dropped, fix by hand): ${result.danglingSchemeRoles.join(', ')}`)
  if (result.orphanCursors.length > 0) console.warn(`  cursor(s) not used by any scheme (add to scheme.json by hand): ${result.orphanCursors.join(', ')}`)
  if (result.suspiciousInvertCursors.length > 0) console.warn(`  suspicious invert color(s) in: ${result.suspiciousInvertCursors.join(', ')}`)

  console.log('cursors-cli: wrote src-cursors/manifest.json and src-cursors/scheme.json')
}

function cmdSprite(args: string[]): void {
  const { flags } = parseArgs(args)
  const result = generateSprites(hasFlag(flags, 'force'))

  console.log(`cursors-cli: rendered ${result.cursorsProcessed} cursor(s), ${result.layersWritten} layer(s) written`)
  if (result.layersSkippedEmpty.length > 0) console.log(`  skipped (no opaque pixels): ${result.layersSkippedEmpty.join(', ')}`)
  if (result.layersSkippedExisting.length > 0) console.log(`  skipped (already exists, pass --force to overwrite): ${result.layersSkippedExisting.join(', ')}`)
  console.log('cursors-cli: published public/win-55-ui/cursors/manifest.json and scheme.json')
}

function main(): void {
  const [command, ...rest] = process.argv.slice(2)

  if (!command || command === '-h' || command === '--help' || command === 'help') {
    usage(0)
  }

  switch (command) {
    case 'discover':
      cmdDiscover()
      break
    case 'sprite':
      cmdSprite(rest)
      break
    default:
      fail(`unknown command: ${command}`)
  }
}

main()
