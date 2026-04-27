import type { Directive, DirectiveBinding } from 'vue'
import {
  getEmojiGifPathFromCode,
  loadEmojiRegistry,
  type EmojiRegistry,
  type EmojiRegistryOptions,
} from '../helpers/emoji'
import {
  getTextWithCustomEmoji,
} from '../helpers/emojiDom'

export interface EmojiDirectiveOptions extends EmojiRegistryOptions {
  className?: string
}

export type EmojiDirectiveBindingValue = boolean | EmojiDirectiveOptions | undefined

const DEFAULT_CLASS_NAME = 'win55-emoji'
const DEFAULT_IMAGE_CLASS_NAME = 'win55-emoji-image'
const BASE_EMOJI_SIZE = 15
const UI_SCALE = 2
const FALLBACK_EMOJI_PATTERN = [
  '[\\u{1F1E6}-\\u{1F1FF}]{2}',
  '[0-9#*]\\uFE0F?\\u20E3',
  '\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*',
  '\\p{Emoji_Presentation}',
].join('|')
const IGNORED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'TEXTAREA',
  'INPUT',
  'SELECT',
  'OPTION',
])

interface EmojiDirectiveState {
  binding: DirectiveBinding<EmojiDirectiveBindingValue>
  copyHandler: (event: ClipboardEvent) => void
  observer: MutationObserver | null
  renderFrame: number | null
  renderQueued: boolean
  version: number
}

const elementState = new WeakMap<HTMLElement, EmojiDirectiveState>()
const regexCache = new WeakMap<EmojiRegistry, RegExp>()
const fallbackEmojiImageCache = new Map<string, string>()

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getEmojiRegex(registry: EmojiRegistry): RegExp | null {
  const cachedRegex = regexCache.get(registry)

  if (cachedRegex) {
    return cachedRegex
  }

  const emojis = Object.keys(registry)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
  const pattern = emojis.length > 0
    ? `${emojis.join('|')}|${FALLBACK_EMOJI_PATTERN}`
    : FALLBACK_EMOJI_PATTERN

  const regex = new RegExp(pattern, 'gu')
  regexCache.set(registry, regex)

  return regex
}

function getDirectiveOptions(
  binding: DirectiveBinding<EmojiDirectiveBindingValue>,
): EmojiDirectiveOptions | null {
  if (binding.value === false) {
    return null
  }

  if (typeof binding.value === 'object') {
    return binding.value
  }

  return {}
}

function shouldSkipElement(element: Element): boolean {
  return (
    IGNORED_TAGS.has(element.tagName) ||
    element.hasAttribute('data-win55-emoji')
  )
}

function collectTextNodes(root: HTMLElement): Text[] {
  const textNodes: Text[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement

      if (!parent || shouldSkipElement(parent)) {
        return NodeFilter.FILTER_REJECT
      }

      if (!node.nodeValue?.trim()) {
        return NodeFilter.FILTER_REJECT
      }

      return NodeFilter.FILTER_ACCEPT
    },
  })

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text)
  }

  return textNodes
}

function getScaledEmojiSize(): string {
  return `${BASE_EMOJI_SIZE * UI_SCALE}px`
}

function getFallbackEmojiImageSrc(emoji: string): string {
  const cachedImageSrc = fallbackEmojiImageCache.get(emoji)

  if (cachedImageSrc) {
    return cachedImageSrc
  }

  const canvas = document.createElement('canvas')
  canvas.width = BASE_EMOJI_SIZE
  canvas.height = BASE_EMOJI_SIZE

  const context = canvas.getContext('2d')

  if (!context) {
    return ''
  }

  context.imageSmoothingEnabled = false
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  let fontSize = BASE_EMOJI_SIZE

  while (fontSize > 6) {
    context.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`

    if (context.measureText(emoji).width <= BASE_EMOJI_SIZE) {
      break
    }

    fontSize -= 1
  }

  context.clearRect(0, 0, BASE_EMOJI_SIZE, BASE_EMOJI_SIZE)
  context.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`
  context.fillText(emoji, BASE_EMOJI_SIZE / 2, BASE_EMOJI_SIZE / 2)

  const imageSrc = canvas.toDataURL('image/png')
  fallbackEmojiImageCache.set(emoji, imageSrc)

  return imageSrc
}

function createEmojiElement(
  emoji: string,
  imageSrc: string,
  options: EmojiDirectiveOptions,
): HTMLSpanElement {
  const wrapper = document.createElement('span')
  const image = document.createElement('img')

  wrapper.className = options.className ?? DEFAULT_CLASS_NAME
  wrapper.contentEditable = 'false'
  wrapper.dataset.win55Emoji = emoji
  wrapper.role = 'img'
  wrapper.ariaLabel = emoji
  wrapper.style.setProperty('--win55-emoji-size', getScaledEmojiSize())

  image.src = imageSrc
  image.alt = emoji
  image.className = DEFAULT_IMAGE_CLASS_NAME
  image.draggable = false
  image.dataset.win55EmojiImg = 'true'
  wrapper.append(image)

  return wrapper
}

function replaceEmojiInTextNode(
  textNode: Text,
  regex: RegExp,
  registry: EmojiRegistry,
  options: EmojiDirectiveOptions,
): void {
  const parent = textNode.parentElement

  if (!parent) {
    return
  }

  const selection = window.getSelection()
  const shouldRestoreCaret = Boolean(
    selection &&
    selection.rangeCount > 0 &&
    selection.isCollapsed &&
    selection.getRangeAt(0).startContainer === textNode,
  )
  const caretOffset = shouldRestoreCaret
    ? selection?.getRangeAt(0).startOffset ?? null
    : null
  const text = textNode.nodeValue ?? ''
  let lastIndex = 0
  let matched = false
  const fragment = document.createDocumentFragment()
  let caretContainer: Node | null = null
  let caretContainerOffset = 0

  const rememberCaret = (container: Node, offset: number) => {
    if (caretContainer) {
      return
    }

    caretContainer = container
    caretContainerOffset = offset
  }

  regex.lastIndex = 0

  for (const match of text.matchAll(regex)) {
    const emoji = match[0]
    const index = match.index
    const code = registry[emoji]

    if (index === undefined) {
      continue
    }

    matched = true

    if (index > lastIndex) {
      const beforeText = document.createTextNode(text.slice(lastIndex, index))

      if (
        caretOffset !== null &&
        caretOffset >= lastIndex &&
        caretOffset <= index
      ) {
        rememberCaret(beforeText, caretOffset - lastIndex)
      }

      fragment.append(beforeText)
    }

    const imageSrc = code
      ? getEmojiGifPathFromCode(code, options)
      : getFallbackEmojiImageSrc(emoji)

    if (!imageSrc) {
      continue
    }

    const emojiElement = createEmojiElement(emoji, imageSrc, options)
    fragment.append(emojiElement)

    if (
      caretOffset !== null &&
      caretOffset > index &&
      caretOffset <= index + emoji.length
    ) {
      rememberCaret(parent, Array.prototype.indexOf.call(parent.childNodes, textNode) + fragment.childNodes.length)
    }

    lastIndex = index + emoji.length
  }

  if (!matched) {
    return
  }

  if (lastIndex < text.length) {
    const afterText = document.createTextNode(text.slice(lastIndex))

    if (caretOffset !== null && caretOffset >= lastIndex) {
      rememberCaret(afterText, caretOffset - lastIndex)
    }

    fragment.append(afterText)
  } else if (caretOffset !== null && caretOffset >= lastIndex) {
    rememberCaret(parent, Array.prototype.indexOf.call(parent.childNodes, textNode) + fragment.childNodes.length)
  }

  textNode.replaceWith(fragment)

  if (shouldRestoreCaret && caretContainer) {
    const range = document.createRange()
    range.setStart(caretContainer, caretContainerOffset)
    range.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
}

async function renderEmoji(
  el: HTMLElement,
  state: EmojiDirectiveState,
): Promise<void> {
  const options = getDirectiveOptions(state.binding)

  if (!options) {
    return
  }

  state.version += 1
  const version = state.version
  const registry = await loadEmojiRegistry(options)

  if (elementState.get(el)?.version !== version || !el.isConnected) {
    return
  }

  const regex = getEmojiRegex(registry)

  if (!regex) {
    return
  }

  for (const textNode of collectTextNodes(el)) {
    replaceEmojiInTextNode(textNode, regex, registry, options)
  }
}

function scheduleRender(
  el: HTMLElement,
  state: EmojiDirectiveState,
): void {
  if (state.renderQueued) {
    return
  }

  state.renderQueued = true

  state.renderFrame = window.requestAnimationFrame(() => {
    state.renderQueued = false
    state.renderFrame = null
    void renderEmoji(el, state).catch((error: unknown) => {
      console.warn('[win-55-ui] Could not render custom emoji.', error)
    })
  })
}

function handleCopy(el: HTMLElement, event: ClipboardEvent): void {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !event.clipboardData) {
    return
  }

  const range = selection.getRangeAt(0)

  if (!range.intersectsNode(el)) {
    return
  }

  const fragment = range.cloneContents()
  const text = getTextWithCustomEmoji(fragment)

  if (!text) {
    return
  }

  event.clipboardData.setData('text/plain', text)
  event.preventDefault()
}

function observeElement(el: HTMLElement, state: EmojiDirectiveState): MutationObserver {
  const observer = new MutationObserver(() => {
    scheduleRender(el, state)
  })

  observer.observe(el, {
    characterData: true,
    childList: true,
    subtree: true,
  })

  return observer
}

const emojiDirective: Directive<HTMLElement, EmojiDirectiveBindingValue> = {
  mounted(el, binding) {
    const state: EmojiDirectiveState = {
      binding,
      copyHandler: (event) => handleCopy(el, event),
      observer: null,
      renderFrame: null,
      renderQueued: false,
      version: 0,
    }

    state.observer = observeElement(el, state)
    elementState.set(el, state)
    el.addEventListener('copy', state.copyHandler)
    scheduleRender(el, state)
  },
  updated(el, binding) {
    const state = elementState.get(el)

    if (!state) {
      return
    }

    state.binding = binding
    scheduleRender(el, state)
  },
  unmounted(el) {
    const state = elementState.get(el)

    if (state) {
      state.observer?.disconnect()

      if (state.renderFrame !== null) {
      window.cancelAnimationFrame(state.renderFrame)
      }

      el.removeEventListener('copy', state.copyHandler)
    }

    elementState.delete(el)
  },
}

export const customEmojiDirective = emojiDirective
export default emojiDirective
