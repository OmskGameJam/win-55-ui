import { resolve, join, extname } from 'node:path'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const packageDir = fileURLToPath(new URL('.', import.meta.url))
const assetsRoot = resolve(packageDir, 'public', 'win-55-ui')

const MIME_TYPES = {
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
}

const LEGACY_SCROLLBAR_WARNING_CSS = `
@property --win55-legacy-flash {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@keyframes win55-legacy-flash {
  0%, 70%, 100% { --win55-legacy-flash: 0; }
  85% { --win55-legacy-flash: 1; }
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
 * Vite plugin that injects a stylesheet flashing native (non-Box) scrollbars red.
 * Active only while the dev server is running.
 */
export function win55uiDevWarnings() {
  return {
    name: 'win-55-ui-dev-warnings',

    transformIndexHtml(_html, ctx) {
      if (!ctx.server) return
      return [{ tag: 'style', attrs: { 'data-win55-dev': '' }, children: LEGACY_SCROLLBAR_WARNING_CSS, injectTo: 'head' }]
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
  return [win55uiAssets(), win55uiDevWarnings()]
}
