import { reactive } from 'vue'

export interface Win55PreloadProgress {
  total: number
  loaded: number
  percent: number
  done: boolean
}

export interface Win55PreloadApi {
  /** Global, shared by every caller. */
  progress: Readonly<Win55PreloadProgress>
  addPreloadPath: (path: string) => void
  startPreload: () => Promise<void>
}

const CONCURRENCY = 8

/** Generated at build time from the public asset list. */
const MANIFEST_PATH = 'win-55-ui/assets.json'

/** Manifest paths are base-relative; `/...` and absolute URLs are taken as written. */
const BASE_URL = import.meta.env.BASE_URL || '/'
const MANIFEST_URL = `${BASE_URL}${MANIFEST_PATH}`

const IMAGE_EXTENSIONS = new Set(['avif', 'bmp', 'gif', 'ico', 'jpeg', 'jpg', 'png', 'svg', 'webp'])
const FONT_EXTENSIONS = new Set(['otf', 'ttf', 'woff', 'woff2'])

// Module singleton: every caller observes the same run, including mid-preload mounts.
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

/** Fetches and registers the generated list; idempotent and failure-tolerant. */
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

function fontFamilyOf(url: string): string {
  const path = url.split(/[?#]/)[0]
  const name = path.slice(path.lastIndexOf('/') + 1)
  const dot = name.lastIndexOf('.')
  return dot === -1 ? name : name.slice(0, dot)
}

function preloadImage(url: string): Promise<void> {
  const image = new Image()
  image.src = url
  // decode() resolves when the frame is ready to paint; older engines use load.
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
      // Loads through @font-face so the font is parsed, not just HTTP-cached.
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
        // One missing file must not stall the run: warn and continue.
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

/** Importing alone must not fetch; the first API use primes the manifest. */
let primed = false

/**
 * Global reactive preload progress plus an extendable queue. The first call primes
 * the generated asset list; it never downloads an asset by itself.
 */
export function useWin55Preload(): Win55PreloadApi {
  if (!primed) {
    primed = true
    if (typeof document !== 'undefined') void loadManifest()
  }
  return api
}
