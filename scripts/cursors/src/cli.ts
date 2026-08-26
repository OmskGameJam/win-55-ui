import { discover } from './discover.js'
import { generateSprites } from './sprite.js'

function usage(exitCode = 0): never {
  const output = [
    'Usage:',
    '  npm run cursors -- discover',
    '    Scans every directory under src-cursors/ for .cur/.ani role files and (re)writes manifest.json.',
    '    Per-role metadata (dimensions, hotspot, bit depth, animation frame count, screen-XOR "invert" usage)',
    '    is always re-derived from the files themselves. displayName and sourceFile are carried over from the',
    "    existing manifest.json when present, since they aren't recoverable from the binary alone.",
    '  npm run cursors -- sprite',
    '    Renders every role in manifest.json to public/win-55-ui/cursors/<scheme>/<role>/{normal,invert}.gif',
    '    at 2x scale. A layer with no opaque pixels in any frame (e.g. crosshair has no "normal" layer) is',
    '    skipped rather than written blank. Reads manifest.json as-is - run discover first if it may be stale.',
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

  console.log(`cursors-cli: discovered ${result.schemesFound} scheme(s), ${result.rolesFound} role(s)`)
  if (result.schemesAdded.length > 0) console.log(`  new scheme(s): ${result.schemesAdded.join(', ')}`)
  if (result.schemesRemoved.length > 0) console.log(`  scheme(s) no longer on disk (dropped from manifest.json): ${result.schemesRemoved.join(', ')}`)
  if (result.rolesAdded.length > 0) console.log(`  new role(s): ${result.rolesAdded.join(', ')}`)
  if (result.rolesRemoved.length > 0) console.log(`  role(s) no longer on disk (dropped from manifest.json): ${result.rolesRemoved.join(', ')}`)
  if (result.suspiciousInvertRoles.length > 0) console.warn(`  suspicious invert color(s) in: ${result.suspiciousInvertRoles.join(', ')}`)

  console.log('cursors-cli: wrote src-cursors/manifest.json')
}

function cmdSprite(): void {
  const result = generateSprites()

  console.log(`cursors-cli: rendered ${result.rolesProcessed} role(s), ${result.layersWritten} layer(s) written`)
  if (result.layersSkippedEmpty.length > 0) console.log(`  skipped (no opaque pixels): ${result.layersSkippedEmpty.join(', ')}`)
}

function main(): void {
  const [command] = process.argv.slice(2)

  if (!command || command === '-h' || command === '--help' || command === 'help') {
    usage(0)
  }

  switch (command) {
    case 'discover':
      cmdDiscover()
      break
    case 'sprite':
      cmdSprite()
      break
    default:
      fail(`unknown command: ${command}`)
  }
}

main()
