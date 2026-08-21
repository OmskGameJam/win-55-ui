import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// scripts/font/dist/src -> scripts/font/dist -> scripts/font -> scripts -> project root
// (tsconfig.json's rootDir is scripts/font, spanning both src/ and test/, so dist/ mirrors that:
// src/*.ts -> dist/src/*.js - one extra hop up compared to the old flat src/ -> dist/ mapping)
export const projectRoot = resolve(__dirname, '..', '..', '..', '..')

/**
 * Repo directory layout, read from `paths.config.json` at the project root instead of hardcoded
 * per-module - `scripts/emoji-cli.js` reads the same file independently (it can't share this
 * module directly: it runs as plain JS straight from `scripts/`, this compiles via tsc into
 * `scripts/font/dist/`), so a renamed/moved directory is a one-line config edit instead of a grep
 * across two unrelated CLIs. Filenames *within* an already-configured directory (`fonts.json`,
 * `emoji-registry.csv`, ...) stay literal here - they're a code-level convention tied to the
 * parser that reads them, not a repo-layout fact.
 */
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
/** Where `public/win-55-ui` is mounted as a URL by Vite's publicDir serving - e.g. for `register.ts`'s @font-face src. */
export const publicUrlPrefix = config.publicUrlPrefix

/** The manifest driving strike-all/fallback-all/build-all/push-fonts/update-register. */
export const fontsManifestPath = resolve(srcFontDir, 'fonts.json')

/** `update-register`'s two output files - see register.ts. */
export const generatedFontsTsPath = resolve(projectRoot, config.generatedFontsTs)
export const generatedFontsCssPath = resolve(projectRoot, config.generatedFontsCss)

/**
 * Frozen test fixtures, NOT `src-font/` — `src-font/*.bdf` is live working data the user
 * regenerates interactively, so tests that need a stable, real-world BDF sample (rather than
 * on-the-fly output from our own rasterizer) live here instead, decoupled from that churn.
 */
export const fixturesDir = resolve(projectRoot, config.fontFixtures)

/**
 * Scratch directory for tests that need to actually write files to exercise real path-dependent
 * code (`verticalMetrics.ts`'s on-disk cache, `facePipeline.ts`'s `mergeChain`) - gitignored,
 * never `src-font/` itself and never the OS temp dir, so leftovers from a crashed run are easy to
 * find and wipe (`rm -rf src-font-tests/`) instead of polluting the real working tree or scattering
 * across `os.tmpdir()`. Tests are still expected to clean up their own files/subdirs when they pass.
 */
export const srcFontTestsDir = resolve(projectRoot, config.srcFontTests)
