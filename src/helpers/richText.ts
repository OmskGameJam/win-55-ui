import { EMOJI_DETECTION_PATTERN } from './emoji'

export type RichNode =
  | { type: 'text'; value: string }
  | { type: 'emoji'; emoji: string; code?: string }
  | { type: 'break' }
  | { type: 'bold' | 'italic' | 'underline' | 'strike'; children: RichNode[] }
  | { type: 'color'; value: string; children: RichNode[] }
  | { type: 'size'; value: number; children: RichNode[] }
  | { type: 'url'; href: string; children: RichNode[] }

export interface ShortcodeLookup {
  get(name: string): { emoji: string; code: string } | undefined
}

/** Raw unicode emoji -> registry code. */
export type EmojiRegistryLookup = Record<string, string>

type TagType = 'bold' | 'italic' | 'underline' | 'strike' | 'color' | 'size' | 'url'

// Includes tags Typography may not render; the parser emits nodes and lets the renderer degrade.
const ALLOWED_TAGS: Record<string, TagType> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  s: 'strike',
  strike: 'strike',
  color: 'color',
  size: 'size',
  url: 'url',
}

/** Always leaf nodes, with or without a trailing slash. */
const SELF_CLOSING_TAGS = new Set(['br'])

/** [size=] keyword shorthands, alongside raw numeric values. */
const SIZE_KEYWORDS: Record<string, number> = {
  normal: 12,
  big: 24,
}

interface Frame {
  tagType: TagType
  value?: string
  children: RichNode[]
}

function nodesToPlainText(nodes: RichNode[]): string {
  return nodes.map((node) => {
    if (node.type === 'text') return node.value
    if (node.type === 'emoji') return node.emoji
    if (node.type === 'break') return '\n'
    return nodesToPlainText(node.children)
  }).join('')
}

function frameToNode(frame: Frame): RichNode {
  switch (frame.tagType) {
    case 'color':
      return { type: 'color', value: frame.value ?? 'inherit', children: frame.children }
    case 'size': {
      const raw = (frame.value ?? '').trim().toLowerCase()
      const keywordSize = SIZE_KEYWORDS[raw]
      const parsedSize = Number.parseInt(frame.value ?? '', 10)
      const size = keywordSize ?? (Number.isFinite(parsedSize) ? parsedSize : SIZE_KEYWORDS.normal)
      return { type: 'size', value: size, children: frame.children }
    }
    case 'url':
      return {
        type: 'url',
        href: frame.value ?? nodesToPlainText(frame.children).trim(),
        children: frame.children,
      }
    default:
      return { type: frame.tagType, children: frame.children }
  }
}

function findLastFrameIndex(stack: Frame[], tagType: TagType): number {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].tagType === tagType) return i
  }

  return -1
}

function splitShortcodeEmoji(raw: string, shortcodes: ShortcodeLookup | null): RichNode[] {
  if (!raw) return []
  if (!shortcodes) return [{ type: 'text', value: raw }]

  const nodes: RichNode[] = []
  const pattern = /:([a-zA-Z0-9_+-]+):/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(raw))) {
    const resolved = shortcodes.get(match[1].toLowerCase())

    if (!resolved) continue

    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: raw.slice(lastIndex, match.index) })
    }

    nodes.push({ type: 'emoji', emoji: resolved.emoji, code: resolved.code })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < raw.length) {
    nodes.push({ type: 'text', value: raw.slice(lastIndex) })
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', value: raw }]
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const rawEmojiRegexCache = new WeakMap<EmojiRegistryLookup, RegExp>()
const noRegistryEmojiRegex = new RegExp(EMOJI_DETECTION_PATTERN, 'gu')

/** Registry emoji first (longest first), then generic pictographs. */
function getRawEmojiRegex(registry: EmojiRegistryLookup | null): RegExp {
  if (!registry) return noRegistryEmojiRegex

  const cached = rawEmojiRegexCache.get(registry)

  if (cached) return cached

  const registryEmojis = Object.keys(registry).sort((a, b) => b.length - a.length).map(escapeRegExp)
  const pattern = registryEmojis.length > 0
    ? `${registryEmojis.join('|')}|${EMOJI_DETECTION_PATTERN}`
    : EMOJI_DETECTION_PATTERN
  const regex = new RegExp(pattern, 'gu')

  rawEmojiRegexCache.set(registry, regex)

  return regex
}

/** Splits raw emoji into `emoji` nodes; registry matches carry a `code`. */
function splitRawEmoji(text: string, registry: EmojiRegistryLookup | null): RichNode[] {
  const regex = getRawEmojiRegex(registry)

  const nodes: RichNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  regex.lastIndex = 0

  while ((match = regex.exec(text))) {
    const emoji = match[0]
    const code = registry?.[emoji]

    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }

    nodes.push({ type: 'emoji', emoji, code })
    lastIndex = match.index + emoji.length
  }

  if (lastIndex < text.length) {
    nodes.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', value: text }]
}

function splitEmoji(
  raw: string,
  shortcodes: ShortcodeLookup | null,
  registry: EmojiRegistryLookup | null,
): RichNode[] {
  const result: RichNode[] = []

  for (const node of splitShortcodeEmoji(raw, shortcodes)) {
    if (node.type === 'text') {
      result.push(...splitRawEmoji(node.value, registry))
    } else {
      result.push(node)
    }
  }

  return result
}

/**
 * Parses a limited BBCode subset plus `:shortcode:` emoji into RichNodes.
 * Unknown or malformed tags pass through as literal text.
 */
export function parseRichText(
  text: string,
  shortcodes: ShortcodeLookup | null,
  registry: EmojiRegistryLookup | null = null,
): RichNode[] {
  const root: RichNode[] = []
  const stack: Frame[] = []
  const tagPattern = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  const currentChildren = (): RichNode[] => (stack.length ? stack[stack.length - 1].children : root)
  const pushText = (raw: string) => currentChildren().push(...splitEmoji(raw, shortcodes, registry))

  while ((match = tagPattern.exec(text))) {
    const [full, closing, rawTag, rawValue] = match
    const tagName = rawTag.toLowerCase()

    if (SELF_CLOSING_TAGS.has(tagName)) {
      pushText(text.slice(lastIndex, match.index))
      lastIndex = match.index + full.length
      currentChildren().push({ type: 'break' })
      continue
    }

    const tagType = ALLOWED_TAGS[tagName]

    if (!tagType) continue

    pushText(text.slice(lastIndex, match.index))
    lastIndex = match.index + full.length

    if (!closing) {
      stack.push({ tagType, value: rawValue, children: [] })
      continue
    }

    const frameIndex = findLastFrameIndex(stack, tagType)

    if (frameIndex === -1) {
      pushText(full)
      continue
    }

    // Lenient with overlapping/improperly nested tags: any deeper frames
    // still open when a shallower one closes just get folded upward.
    while (stack.length > frameIndex + 1) {
      const innerFrame = stack.pop()!
      stack[stack.length - 1].children.push(frameToNode(innerFrame))
    }

    const frame = stack.pop()!
    currentChildren().push(frameToNode(frame))
  }

  pushText(text.slice(lastIndex))

  // Unclosed tags at EOF: fold their children up as literal (unwrapped) text.
  while (stack.length) {
    const frame = stack.pop()!
    const parentChildren = stack.length ? stack[stack.length - 1].children : root
    parentChildren.push(...frame.children)
  }

  return root
}
