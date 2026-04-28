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
import { findNearestColor, parseHexPalette } from '../helpers/color'

export interface EmojiDirectiveOptions extends EmojiRegistryOptions {
  className?: string
}

export type EmojiDirectiveBindingValue = boolean | EmojiDirectiveOptions | undefined

const DEFAULT_CLASS_NAME = 'win55-emoji'
const DEFAULT_IMAGE_CLASS_NAME = 'win55-emoji-image'
const BASE_EMOJI_SIZE = 15
const UI_SCALE = 2

export const FALLBACK_EMOJI_PALETTE = [
"#000000",
"#020202",
"#2E2E2E",
"#700000",
"#007000",
"#000070",
"#700070",
"#007070",
"#BB0202",
"#F72E2E",
"#BB7E02",
"#02BB02",
"#2EF72E",
"#F7F22E",
"#0202BB",
"#2E2EF7",
"#BB02BB",
"#F72EF7",
"#02BBBB",
"#2EF7F7",
"#8F8F8F",
"#C4C4C4",
"#D7D7D7",
"#FFC4C4",
"#C4FFC4",
"#FFFFC4",
"#C4C4FF",
"#FFC4FF",
"#C4FFFF",
"#FAFAFA",
"#FFFFFF",
"#000000"
] as const

const FALLBACK_EMOJI_PALETTE_RGB = parseHexPalette(FALLBACK_EMOJI_PALETTE)
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

function quantizeCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  palette: readonly [number, number, number][],
  percentage: number,                       // new param, range 0..1
): void {
  // clamp percentage to valid range
  const t = Math.min(1, Math.max(0, percentage));

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const originalR = data[i];
    const originalG = data[i + 1];
    const originalB = data[i + 2];
    const alpha = data[i + 3];

    if (alpha < 80) {
      // transparent: keep fully transparent
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else {
      // find nearest colour in palette
      const [rQuant, gQuant, bQuant] = findNearestColor(
        originalR, originalG, originalB, palette
      );

      // interpolate between original and quantized
      const r = Math.round(originalR + (rQuant - originalR) * t);
      const g = Math.round(originalG + (gQuant - originalG) * t);
      const b = Math.round(originalB + (bQuant - originalB) * t);

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;   // make opaque (original behaviour)
    }
  }

  context.putImageData(imageData, 0, 0);
}

function smoothCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const imageData = context.getImageData(0, 0, width, height)
  const src = new Uint8ClampedArray(imageData.data)
  const dst = imageData.data
  const idx = (x: number, y: number) => (y * width + x) * 4

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y)
      const neighbors = [
        x > 0 ? idx(x - 1, y) : -1,
        x < width - 1 ? idx(x + 1, y) : -1,
        y > 0 ? idx(x, y - 1) : -1,
        y < height - 1 ? idx(x, y + 1) : -1,
      ].filter(n => n !== -1)
      const opaque = neighbors.filter(n => src[n + 3] > 127)

      if (src[i + 3] > 127 && opaque.length <= 1) {
        dst[i] = dst[i + 1] = dst[i + 2] = dst[i + 3] = 0
      } else if (src[i + 3] === 0 && opaque.length >= 3) {
        const n = opaque[0]
        dst[i] = src[n]; dst[i + 1] = src[n + 1]; dst[i + 2] = src[n + 2]; dst[i + 3] = 255
      }
    }
  }

  context.putImageData(imageData, 0, 0)
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

  const fontStack = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif'
  const probe = BASE_EMOJI_SIZE * 4

  context.textBaseline = 'alphabetic'
  context.font = `${probe}px ${fontStack}`

  const pm = context.measureText(emoji)
  const pw = pm.actualBoundingBoxLeft + pm.actualBoundingBoxRight
  const ph = pm.actualBoundingBoxAscent + pm.actualBoundingBoxDescent

  if (pw > 0 && ph > 0) {
    const fontSize = probe * Math.min((BASE_EMOJI_SIZE) / pw, (BASE_EMOJI_SIZE) / ph)
    context.font = `${fontSize}px ${fontStack}`
    const m = context.measureText(emoji)
    const gw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
    const gh = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
    const x = (BASE_EMOJI_SIZE - gw) / 2 + m.actualBoundingBoxLeft
    const y = (BASE_EMOJI_SIZE - gh) / 2 + m.actualBoundingBoxAscent
    context.fillText(emoji, x, y-0.5)
    quantizeCanvas(context, BASE_EMOJI_SIZE, BASE_EMOJI_SIZE, FALLBACK_EMOJI_PALETTE_RGB, 0.1)
    smoothCanvas(context, BASE_EMOJI_SIZE, BASE_EMOJI_SIZE)
    drawInsetBlackOutline(canvas)
  }

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
  image.addEventListener('load', () => {
    const w = image.naturalWidth * UI_SCALE
    const h = image.naturalHeight * UI_SCALE
    wrapper.style.width = `${w}px`
    wrapper.style.height = `${h}px`
    image.style.width = `${w}px`
    image.style.height = `${h}px`
  }, { once: true })
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

/**
 * Draws a black inset outline on the sprite inside a canvas.
 * The outline is applied exactly on the outermost non‑transparent pixels.
 *
 * @param canvas - The target HTMLCanvasElement (size is inferred from its dimensions)
 */
function drawInsetBlackOutline(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('Unable to get 2D context from canvas');
    return;
  }

  const width = canvas.width;
  const height = canvas.height;

  // Read the current pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data; // Uint8ClampedArray in RGBA order

  // Helper: get alpha value of a pixel (0 = fully transparent)
  const getAlpha = (x: number, y: number): number => {
    if (x < 0 || y < 0 || x >= width || y >= height) return 0;
    return data[(y * width + x) * 4 + 3];
  };

  // ------- 1. Find all transparent pixels connected to the canvas border -------
  // (these define the "outside" background)
  const isBackground = Array.from({ length: height }, () => Array(width).fill(false));
  const queue: { x: number; y: number }[] = [];

  // Enqueue all border pixels that are fully transparent
  for (let x = 0; x < width; x++) {
    if (getAlpha(x, 0) === 0 && !isBackground[0][x]) {
      isBackground[0][x] = true;
      queue.push({ x, y: 0 });
    }
    if (getAlpha(x, height - 1) === 0 && !isBackground[height - 1][x]) {
      isBackground[height - 1][x] = true;
      queue.push({ x, y: height - 1 });
    }
  }
  for (let y = 0; y < height; y++) {
    if (getAlpha(0, y) === 0 && !isBackground[y][0]) {
      isBackground[y][0] = true;
      queue.push({ x: 0, y });
    }
    if (getAlpha(width - 1, y) === 0 && !isBackground[y][width - 1]) {
      isBackground[y][width - 1] = true;
      queue.push({ x: width - 1, y });
    }
  }

  // BFS flood fill to mark all transparent cells reachable from the border
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length) {
    const { x, y } = queue.shift()!;
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 && nx < width &&
        ny >= 0 && ny < height &&
        !isBackground[ny][nx] &&
        getAlpha(nx, ny) === 0
      ) {
        isBackground[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // ------- 2. Identify the external edge pixels of the sprite -------
  // An opaque pixel is an edge if it has a neighbour that is:
  //   - out of canvas bounds, or
  //   - a transparent pixel that belongs to the outside background
  const isEdge = Array.from({ length: height }, () => Array(width).fill(false));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (getAlpha(x, y) === 0) continue; // skip transparent pixels

      let edge = false;
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        // Out of bounds → treat as outside background
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          edge = true;
          break;
        }
        const neighborAlpha = getAlpha(nx, ny);
        if (neighborAlpha === 0 && isBackground[ny][nx]) {
          edge = true;
          break;
        }
      }
      if (edge) isEdge[y][x] = true;
    }
  }

  // ------- 3. Apply black outline on the edge pixels -------
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isEdge[y][x]) {
        const idx = (y * width + x) * 4;
        data[idx] = 0;     // R = 0
        data[idx + 1] = 0; // G = 0
        data[idx + 2] = 0; // B = 0
        // Alpha channel is left unchanged
      }
    }
  }

  // Write the modified pixels back to the canvas
  ctx.putImageData(imageData, 0, 0);
}

export const customEmojiDirective = emojiDirective
export default emojiDirective
