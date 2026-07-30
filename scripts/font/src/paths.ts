import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// scripts/font/dist -> scripts/font -> scripts -> project root
export const projectRoot = resolve(__dirname, '..', '..', '..')
export const srcFontDir = resolve(projectRoot, 'src-font')
export const publicFontDir = resolve(projectRoot, 'public', 'win-55-ui', 'font')

/**
 * Frozen test fixtures, NOT `src-font/` — `src-font/*.bdf` is live working data the user
 * regenerates interactively, so tests that need a stable, real-world BDF sample (rather than
 * on-the-fly output from our own rasterizer) live here instead, decoupled from that churn.
 */
export const fixturesDir = resolve(projectRoot, 'scripts', 'font', 'src', '__fixtures__')
