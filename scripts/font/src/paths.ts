import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// scripts/font/dist/src -> dist -> font -> scripts -> project root (rootDir is scripts/font, so dist/ nests one level deeper than src/ did)
export const projectRoot = resolve(__dirname, '..', '..', '..', '..')

// scripts/emoji-cli.js reads paths.config.json independently - see FONTS.md/CLAUDE.md.
interface PathsConfig {
  srcFont: string
  publicFont: string
  publicUrlPrefix: string
  fontFixtures: string
  srcFontTests: string
  generatedFontsTs: string
  generatedFontsCss: string
}

const config: PathsConfig = JSON.parse(readFileSync(resolve(projectRoot, 'paths.config.json'), 'utf8'))

export const srcFontDir = resolve(projectRoot, config.srcFont)
export const publicFontDir = resolve(projectRoot, config.publicFont)
export const publicUrlPrefix = config.publicUrlPrefix

/** Consumed by strike-all/fallback-all/build-all/push-fonts/update-register. */
export const fontsManifestPath = resolve(srcFontDir, 'fonts.json')

export const generatedFontsTsPath = resolve(projectRoot, config.generatedFontsTs)
export const generatedFontsCssPath = resolve(projectRoot, config.generatedFontsCss)

/** NOT `src-font/`, which is live, user-editable working data. */
export const fixturesDir = resolve(projectRoot, config.fontFixtures)

/** Gitignored - never `src-font/` or `os.tmpdir()`. See FONTS.md. */
export const srcFontTestsDir = resolve(projectRoot, config.srcFontTests)
