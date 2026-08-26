import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// scripts/cursors/dist/src -> dist -> cursors -> scripts -> project root (rootDir is scripts/cursors, so dist/ nests one level deeper than src/ did)
export const projectRoot = resolve(__dirname, '..', '..', '..', '..')

// scripts/font/src/paths.ts and scripts/emoji-cli.js read paths.config.json independently - see CLAUDE.md.
interface PathsConfig {
  srcCursors: string
  publicCursors: string
}

const config: PathsConfig = JSON.parse(readFileSync(resolve(projectRoot, 'paths.config.json'), 'utf8'))

export const srcCursorsDir = resolve(projectRoot, config.srcCursors)
export const publicCursorsDir = resolve(projectRoot, config.publicCursors)

export const cursorsManifestPath = resolve(srcCursorsDir, 'manifest.json')
