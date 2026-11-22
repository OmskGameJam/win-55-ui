import { reactive } from 'vue'

export interface Win55PreloadProgress {
  /** How many resources are registered for preloading. */
  total: number
  /** How many resources have settled - loaded or failed. */
  loaded: number
  /** `loaded / total` as a whole percentage, 0-100; kept in sync with the counts. */
  percent: number
  /** True once every registered resource has settled. */
  done: boolean
}

export interface Win55PreloadApi {
  /** The one global preload state, shared by every caller. */
  progress: Readonly<Win55PreloadProgress>
  /** Queue one extra resource; a base-relative path, a root-relative path or an absolute URL. */
  addPreloadPath: (path: string) => void
  /** Start (or resume) preloading everything registered so far; resolves when the queue drains. */
  startPreload: () => Promise<void>
}

/** Enough parallelism to hide latency without opening thousands of sockets. */
const CONCURRENCY = 8

/** Generated at build time by `win55uiPreloadManifest()` (see `plugin.js`). */
const MANIFEST_PATH = 'win-55-ui/assets.json'

/** Manifest paths are base-relative; `/...` and absolute URLs are taken as written. */
const BASE_URL = import.meta.env.BASE_URL || '/'
const MANIFEST_URL = `${BASE_URL}${MANIFEST_PATH}`

const IMAGE_EXTENSIONS = new Set(['avif', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg', 'webp'])
const FONT_EXTENSIONS = new Set(['otf', 'ttf', 'woff', 'woff2'])

// Module-level singleton: every `useWin55Preload()` call observes the same run,
// so a component that mounts mid-preload already sees the current progress.
const progress = reactive<Win55PreloadProgress>({
  total: 0,
  loaded: 0,
  percent: 0,
  done: false,
})

const seen = new Set<string>()
const queue: string[] = []
let manifestPromise: Promise<void> | null = null
let started = false
let running: Promise<void> | null = null

function updateProgress(): void {
  progress.percent = progress.total === 0
    ? (started ? 100 : 0)
    : Math.floor((progress.loaded / progress.total) * 100)
  progress.done = started && progress.loaded >= progress.total
}

function resolvePath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) return ''
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(trimmed) || trimmed.startsWith('/')) return trimmed
  return `${BASE_URL}${trimmed}`
}

function register(path: string): void {
  const url = resolvePath(path)
  if (!url || seen.has(url)) return
  seen.add(url)
  queue.push(url)
  progress.total = seen.size
  updateProgress()
}

/** Fetches and registers the generated asset list; idempotent and failure-tolerant. */
function loadManifest(): Promise<void> {
  if (!manifestPromise) {
    manifestPromise = (async () => {
      try {
        const response = await fetch(MANIFEST_URL)
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
        const files: unknown = await response.json()
        if (!Array.isArray(files)) throw new Error('expected an array of paths')
        for (const file of files) {
          if (typeof file === 'string') register(file)
        }
      } catch (error) {
        console.warn(`[win-55-ui] Could not load ${MANIFEST_URL}: ${(error as Error).message}`)
      }
    })()
  }
  return manifestPromise
}

function extensionOf(url: string): string {
  const path = url.split(/[?#]/)[0]
  const dot = path.lastIndexOf('.')
  return dot === -1 ? '' : path.slice(dot + 1).toLowerCase()
}

/** `Standard-Regular-12.ttf` -> `Standard-Regular-12`, the @font-face family name. */
function fontFamilyOf(url: string): string {
  const path = url.split(/[?#]/)[0]
  const name = path.slice(path.lastIndexOf('/') + 1)
  const dot = name.lastIndexOf('.')
  return dot === -1 ? name : name.slice(0, dot)
}

function preloadImage(url: string): Promise<void> {
  const image = new Image()
  image.src = url
  // decode() resolves only once the frame is ready to paint, which is the whole
  // point of preloading. Older engines fall back to the load event.
  if (typeof image.decode === 'function') return image.decode()
  return new Promise((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Could not preload image ${url}`))
  })
}

async function download(url: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not preload ${url}: ${response.status} ${response.statusText}`)
  // Consume the body so the transfer actually completes and lands in the cache.
  await response.arrayBuffer()
}

async function preloadFont(url: string): Promise<void> {
  const family = fontFamilyOf(url)
  if (family && typeof document !== 'undefined' && document.fonts) {
    try {
      // Loads through the family's @font-face rule, so the font is parsed and
      // ready for the next paint instead of merely sitting in the HTTP cache.
      const faces = await document.fonts.load(`16px "${family}"`)
      if (faces.length > 0) return
    } catch {
      // Undeclared or unusable family - fall through to a plain download.
    }
  }
  await download(url)
}

async function preloadOne(url: string): Promise<void> {
  const extension = extensionOf(url)
  if (IMAGE_EXTENSIONS.has(extension)) return preloadImage(url)
  if (FONT_EXTENSIONS.has(extension)) return preloadFont(url)
  return download(url)
}

async function runQueue(): Promise<void> {
  const worker = async () => {
    for (let url = queue.shift(); url !== undefined; url = queue.shift()) {
      try {
        await preloadOne(url)
      } catch (error) {
        // A single missing file must not stall the run: name it, count it, move on.
        console.warn(`[win-55-ui] Could not preload ${url}: ${(error as Error).message}`)
      }
      progress.loaded += 1
      updateProgress()
    }
  }

  const workers = Math.min(CONCURRENCY, Math.max(queue.length, 1))
  await Promise.all(Array.from({ length: workers }, worker))
}

function drain(): Promise<void> {
  if (!running) {
    running = runQueue().finally(() => {
      running = null
      // A path added just as the last worker exited starts a fresh run.
      if (queue.length) void drain()
    })
  }
  return running
}

function addPreloadPath(path: string): void {
  register(path)
  if (started) void drain()
}

async function startPreload(): Promise<void> {
  // SSR has nothing to fetch or decode; report the registered set as settled.
  if (typeof document === 'undefined') {
    started = true
    progress.loaded = progress.total
    updateProgress()
    return
  }

  await loadManifest()
  started = true
  updateProgress()
  await drain()
}

const api: Win55PreloadApi = {
  progress,
  addPreloadPath,
  startPreload,
}

/** Set once the API is used, so merely importing the library never fetches the list. */
let primed = false

/**
 * The win-55-ui preloading API (no conventional preloader): a global, reactive
 * progress record plus a queue you can extend and start from anywhere.
 *
 * The initial queue is every file under `public/` except the on-demand emoji
 * GIFs, generated at build time by `win55uiPreloadManifest()` and resolved
 * against `import.meta.env.BASE_URL`, so the same code works in dev, in a
 * production build and under a sub-path. Calling this primes that list so
 * `progress.total` is known before the first `startPreload()`; it never
 * downloads an asset by itself.
 */
export function useWin55Preload(): Win55PreloadApi {
  if (!primed) {
    primed = true
    if (typeof document !== 'undefined') void loadManifest()
  }
  return api
}
