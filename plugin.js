import { resolve, join, extname } from 'node:path'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const packageDir = fileURLToPath(new URL('.', import.meta.url))
const publicRoot = resolve(packageDir, 'public')
const assetsRoot = resolve(publicRoot, 'win-55-ui')

const PRELOAD_MANIFEST_URL = '/win-55-ui/assets.json'

const toPosix = (path) => path.split('\\').join('/')

const MIME_TYPES = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.csv': 'text/csv',
}

const DEV_WARNING_CSS = `
@property --win55-legacy-flash {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@keyframes win55-legacy-flash {
  0%, 70%, 100% { --win55-legacy-flash: 0; }
  85% { --win55-legacy-flash: 1; }
}
@property --win55-off-grid-flash {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@keyframes win55-off-grid-flash {
  0%, 70%, 100% { --win55-off-grid-flash: 0; }
  85% { --win55-off-grid-flash: 1; }
}
:root {
  --win55-legacy-flash-color: rgb(255 0 0 / calc(var(--win55-legacy-flash) * 0.35));
  animation: win55-legacy-flash 2s ease-in-out infinite;
}
*::-webkit-scrollbar {
  background-color: var(--win55-legacy-flash-color);
}
*::-webkit-scrollbar-corner {
  background: linear-gradient(var(--win55-legacy-flash-color), var(--win55-legacy-flash-color)), #999;
}
*::-webkit-scrollbar-track,
*::-webkit-scrollbar-thumb,
*::-webkit-scrollbar-button {
  box-shadow: inset 0 0 0 100px var(--win55-legacy-flash-color);
}
.win55-off-grid {
  --win55-off-grid-x: 255 0 0;
  --win55-off-grid-y: 255 0 0;
  box-shadow:
    inset 2px 0 0 rgb(var(--win55-off-grid-x) / calc(var(--win55-off-grid-flash) * 0.35)),
    inset -2px 0 0 rgb(var(--win55-off-grid-x) / calc(var(--win55-off-grid-flash) * 0.35)),
    inset 0 2px 0 rgb(var(--win55-off-grid-y) / calc(var(--win55-off-grid-flash) * 0.35)),
    inset 0 -2px 0 rgb(var(--win55-off-grid-y) / calc(var(--win55-off-grid-flash) * 0.35)) !important;
  animation: win55-off-grid-flash 2s ease-in-out infinite !important;
}
.win55-off-grid-position-x { --win55-off-grid-x: 255 0 0; }
.win55-off-grid-position-y { --win55-off-grid-y: 255 0 0; }
.win55-off-grid-size-x { --win55-off-grid-x: 0 0 255; }
.win55-off-grid-size-y { --win55-off-grid-y: 0 0 255; }
.win55-off-grid-position-x.win55-off-grid-size-x { --win55-off-grid-x: 255 255 0; }
.win55-off-grid-position-y.win55-off-grid-size-y { --win55-off-grid-y: 255 255 0; }
html.win55-off-grid-hold .win55-off-grid {
  --win55-off-grid-flash: 1;
  animation: none !important;
}
`

const OFF_GRID_DETECTOR_JS = `
(() => {
  const BASE = 'win55-off-grid'
  const POSITION_X = 'win55-off-grid-position-x'
  const POSITION_Y = 'win55-off-grid-position-y'
  const SIZE_X = 'win55-off-grid-size-x'
  const SIZE_Y = 'win55-off-grid-size-y'
  const HOLD = 'win55-off-grid-hold'
  const SCAN_MS = 1000
  const SKIP = { SCRIPT: 1, STYLE: 1, LINK: 1, META: 1, TITLE: 1, BASE: 1 }

  // Page scroll is not a layout mistake, so compare document-relative edges.
  const badPositionX = (rect) => (rect.left + window.scrollX) % 2 !== 0
  const badPositionY = (rect) => (rect.top + window.scrollY) % 2 !== 0
  const badSizeX = (rect) => rect.width % 2 !== 0
  const badSizeY = (rect) => rect.height % 2 !== 0

  // Loading is not a layout mistake: fonts and images reflow the page while
  // they decode, and once a transient state is recorded it would never clear.
  // Wait for both the load event and the font set before the first real scan.
  const ready = () => (
    document.readyState === 'complete' &&
    (!document.fonts || document.fonts.status !== 'loading')
  )

  const scan = () => {
    if (!document.body || !ready()) return

    // Elements keep getting rescanned until all four warnings are collected,
    // since a later layout can add another one. Settled elements drop out.
    const pending = ':not(.win55-off-grid-position-x.win55-off-grid-position-y.win55-off-grid-size-x.win55-off-grid-size-y)'
    for (const el of document.body.querySelectorAll(pending)) {
      if (SKIP[el.tagName]) continue

      const rect = el.getBoundingClientRect()
      const positionX = badPositionX(rect)
      const positionY = badPositionY(rect)
      const sizeX = badSizeX(rect)
      const sizeY = badSizeY(rect)
      if (!positionX && !positionY && !sizeX && !sizeY) continue

      el.classList.add(BASE)
      if (positionX) el.classList.add(POSITION_X)
      if (positionY) el.classList.add(POSITION_Y)
      if (sizeX) el.classList.add(SIZE_X)
      if (sizeY) el.classList.add(SIZE_Y)
    }
  }

  const clearWarnings = () => {
    for (const el of document.querySelectorAll('.win55-off-grid')) {
      el.classList.remove(BASE, POSITION_X, POSITION_Y, SIZE_X, SIZE_Y)
    }
  }

  // Shift freezes the pulse at full visibility; Ctrl clears every accumulated
  // warning. Listen in the capture phase so app-level handlers cannot swallow
  // either key, but never preventDefault/stopPropagation: both presses must
  // still reach everything else (selection, shortcuts, etc).
  const hold = (held) => document.documentElement.classList.toggle(HOLD, held)
  const onKeyDown = (event) => {
    if (event.key === 'Control' && !event.repeat) clearWarnings()
    hold(event.shiftKey)
  }
  const onKeyUp = (event) => hold(event.shiftKey)
  window.addEventListener('keydown', onKeyDown, { capture: true })
  window.addEventListener('keyup', onKeyUp, { capture: true })
  window.addEventListener('blur', () => hold(false))

  if (document.readyState === 'complete') scan()
  else window.addEventListener('load', scan, { once: true })

  if (document.fonts) document.fonts.ready.then(scan)

  setInterval(scan, SCAN_MS)
})()
`

function collectFiles(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectFiles(full, rel))
    } else {
      files.push({ relativePath: rel, fullPath: full })
    }
  }
  return files
}

/**
 * Emoji GIFs are resolved one at a time from the runtime registry (see
 * `src/directives/emoji.ts`), so pulling all of them up front would queue
 * hundreds of files nothing has asked for yet. Their indexes (`*.json`, `*.csv`,
 * `NOTICE.md`) stay in the list: those are the entry points the runtime fetches.
 */
const LAZY_EMOJI_DIRS = ['win-55-ui/emoji/', 'win-55-ui/x-emoji/']

function isLazyEmojiAsset(relativePath) {
  const path = relativePath.toLowerCase()
  return path.endsWith('.gif') && LAZY_EMOJI_DIRS.some((dir) => path.startsWith(dir))
}

/**
 * Every file under the public directory that is not an on-demand emoji GIF, as
 * paths relative to it, so the runtime can resolve them against
 * `import.meta.env.BASE_URL` instead of a hard-coded deployment path. Sorted
 * for a reproducible build.
 */
function collectPreloadManifest() {
  if (!existsSync(publicRoot)) return []

  return collectFiles(publicRoot)
    .map((file) => toPosix(file.relativePath))
    .filter((file) => !isLazyEmojiAsset(file))
    .sort()
}

/**
 * Vite plugin that generates `win-55-ui/assets.json` - the preload list, built
 * by walking the public directory - and serves it in dev.
 *
 * Because the list is scanned from disk at build time (and on every dev
 * request), it tracks the directory instead of a hand-maintained list. Paths are
 * relative to the public root; runtime code resolves them against the
 * deployment base, so dev, production and sub-path deploys all agree.
 *
 * Runtime counterpart: `src/helpers/preload.ts`, which fetches this file.
 */
export function win55uiPreloadManifest() {
  const manifest = () => JSON.stringify(collectPreloadManifest())

  return {
    name: 'win-55-ui-preload-manifest',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next()
        if (!req.url.split('?')[0].endsWith(PRELOAD_MANIFEST_URL)) return next()
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(manifest())
      })
    },

    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'win-55-ui/assets.json',
        source: manifest(),
      })
    },
  }
}

/**
 * Vite plugin that injects dev-only warnings:
 * - native (non-Box) scrollbars flash red;
 * - any element ever seen off the 2px grid gets side-specific outlines: red for
 *   bad position, blue for bad size, yellow for both. Horizontal problems mark
 *   left/right; vertical problems mark top/bottom. Holding Shift freezes the
 *   pulse at full visibility; pressing Ctrl clears accumulated warnings.
 * Active only while the dev server is running.
 */
export function win55uiDevWarnings() {
  return {
    name: 'win-55-ui-dev-warnings',

    transformIndexHtml(_html, ctx) {
      if (!ctx.server) return
      return [
        { tag: 'style', attrs: { 'data-win55-dev': '' }, children: DEV_WARNING_CSS, injectTo: 'head' },
        { tag: 'script', attrs: { 'data-win55-dev': '' }, children: OFF_GRID_DETECTOR_JS, injectTo: 'head' },
      ]
    },
  }
}

function win55uiAssets() {
  return {
    name: 'win-55-ui',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/win-55-ui/')) return next()

        const relPath = req.url.slice('/win-55-ui/'.length).split('?')[0]
        const filePath = join(assetsRoot, relPath)

        try {
          const stat = statSync(filePath)
          if (stat.isFile()) {
            const content = readFileSync(filePath)
            const ext = extname(filePath)
            const mime = MIME_TYPES[ext]
            if (mime) {
              res.setHeader('Content-Type', mime)
            }
            res.end(content)
            return
          }
        } catch {
          // file not found — fall through
        }
        next()
      })
    },

    generateBundle() {
      const files = collectFiles(assetsRoot)
      for (const file of files) {
        this.emitFile({
          type: 'asset',
          fileName: `win-55-ui/${file.relativePath}`,
          source: readFileSync(file.fullPath),
        })
      }
    },
  }
}

/**
 * Vite plugin that serves win-55-ui assets.
 * In dev mode, intercepts /win-55-ui/ requests and serves files from the package.
 * In build mode, emits asset files into the output directory.
 * In dev mode, also injects the native-scrollbar warning stylesheet.
 */
export function win55ui() {
  return [win55uiPreloadManifest(), win55uiAssets(), win55uiDevWarnings()]
}
