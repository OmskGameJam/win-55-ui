const DEFAULT_EMOJI_BASE_PATH = '/win-55-ui/emoji'
const DEFAULT_EMOJI_REGISTRY_URL = `${DEFAULT_EMOJI_BASE_PATH}/emoji-registry.csv`

export interface EmojiRegistry {
  [emoji: string]: string
}

export interface EmojiRegistryOptions {
  basePath?: string
  registryUrl?: string
}

let registryPromise: Promise<EmojiRegistry> | null = null
let registryPromiseUrl: string | null = null
let registry: EmojiRegistry | null = null

function cleanBasePath(basePath: string): string {
  return basePath.replace(/\/$/, '')
}

function normalizeCode(code: string): string {
  return code.trim().replace(/\.gif$/i, '')
}

function parseEmojiRegistry(csv: string): EmojiRegistry {
  const registry: EmojiRegistry = {}
  const rows = csv.replace(/^\uFEFF/, '').split(/\r?\n/)

  for (const [index, row] of rows.entries()) {
    const line = row.trim()

    if (!line) {
      continue
    }

    if (index === 0 && line.toLowerCase() === 'emoji,code') {
      continue
    }

    const separatorIndex = line.indexOf(',')

    if (separatorIndex === -1) {
      throw new Error(`Could not parse emoji registry row ${index + 1}: missing comma`)
    }

    const emoji = line.slice(0, separatorIndex).trim()
    const code = normalizeCode(line.slice(separatorIndex + 1))

    if (emoji && code) {
      registry[emoji] = code
    }
  }

  return registry
}

/**
 * Loads the emoji registry from the public two-column CSV at runtime.
 * The result is cached so the browser only fetches and parses it once.
 */
export async function loadEmojiRegistry(
  options: EmojiRegistryOptions = {},
): Promise<EmojiRegistry> {
  const registryUrl = options.registryUrl ?? DEFAULT_EMOJI_REGISTRY_URL

  if (registry && registryUrl === DEFAULT_EMOJI_REGISTRY_URL) {
    return registry
  }

  if (!registryPromise || registryPromiseUrl !== registryUrl) {
    registryPromiseUrl = registryUrl
    registryPromise = fetch(registryUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Could not load emoji registry from ${registryUrl}: ${response.status} ${response.statusText}`,
          )
        }

        return response.text()
      })
      .then(parseEmojiRegistry)
      .then((loadedRegistry) => {
        if (registryUrl === DEFAULT_EMOJI_REGISTRY_URL) {
          registry = loadedRegistry
        }

        return loadedRegistry
      })
  }

  return registryPromise
}

/**
 * Clears the cached registry. Useful if a host app swaps the CSV URL at runtime.
 */
export function resetEmojiRegistryCache(): void {
  registryPromise = null
  registryPromiseUrl = null
  registry = null
}

/**
 * Returns the full path to an emoji GIF file in the public directory.
 */
export async function getEmojiGifPath(
  emoji: string,
  options: EmojiRegistryOptions = {},
): Promise<string | null> {
  const loadedRegistry = await loadEmojiRegistry(options)
  const code = loadedRegistry[emoji]

  if (!code) {
    return null
  }

  return getEmojiGifPathFromCode(code, options)
}

/**
 * Returns a GIF path for a known registry code without loading the CSV.
 */
export function getEmojiGifPathFromCode(
  code: string,
  options: Pick<EmojiRegistryOptions, 'basePath'> = {},
): string {
  const basePath = cleanBasePath(options.basePath ?? DEFAULT_EMOJI_BASE_PATH)
  return `${basePath}/${normalizeCode(code)}.gif`
}

/**
 * Returns the entire emoji registry object.
 */
export async function getEmojiRegistry(
  options: EmojiRegistryOptions = {},
): Promise<EmojiRegistry> {
  return loadEmojiRegistry(options)
}

/**
 * Checks if an emoji exists in the registry.
 */
export async function hasEmoji(
  emoji: string,
  options: EmojiRegistryOptions = {},
): Promise<boolean> {
  const loadedRegistry = await loadEmojiRegistry(options)
  return emoji in loadedRegistry
}
