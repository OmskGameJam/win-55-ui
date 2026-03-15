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
 * Vite plugin that serves win-55-ui assets.
 * In dev mode, intercepts /win-55-ui/ requests and serves files from the package.
 * In build mode, emits asset files into the output directory.
 */
export function win55ui() {
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
