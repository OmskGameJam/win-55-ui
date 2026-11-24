import { onUnmounted } from 'vue'
import { manifestEntryFor } from './cursors'
import {
  CURSOR_NATIVE_PROPERTY,
  CURSOR_NATIVE_LINK_PROPERTY,
  CURSOR_NATIVE_TEXT_PROPERTY,
  CURSOR_NATIVE_NOTALLOWED_PROPERTY,
  NATIVE_LINK_SELECTOR,
  NATIVE_TEXT_SELECTOR,
} from './cursorContext'

// CSS `cursor: url()` only paints frame 0, so native mode swaps inline cursor URLs per frame.
// Each write keeps the on-screen frame and ambient tail as fallbacks to avoid flashing the OS cursor.
// Frame <img>s stay referenced and decoded so stills remain in the image cache.

const CURSOR_ID_RE = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/

/** The native cursor value actually painted for `el`, including derived link/text/disabled roles. */
function nativeCursorValueFor(el: Element): string {
  const cs = getComputedStyle(el)
  let derived = ''
  if (el.closest(':disabled')) derived = cs.getPropertyValue(CURSOR_NATIVE_NOTALLOWED_PROPERTY)
  else if (el.matches(NATIVE_LINK_SELECTOR)) derived = cs.getPropertyValue(CURSOR_NATIVE_LINK_PROPERTY)
  else if (el.matches(NATIVE_TEXT_SELECTOR)) derived = cs.getPropertyValue(CURSOR_NATIVE_TEXT_PROPERTY)
  derived = derived.trim()
  return derived && derived !== 'none' ? derived : cs.getPropertyValue(CURSOR_NATIVE_PROPERTY).trim()
}

export interface CursorFrameAnimator {
  evaluate: (el: Element | null) => void
  stop: () => void
}

export function createCursorFrameAnimator(): CursorFrameAnimator {
  let activeEl: HTMLElement | null = null
  let activeCursorId = ''
  // `url("...native.gif") x y` - the animated frame's url + hotspot
  let frameHead = ''
  // everything after that url: ambient fallbacks + keyword
  let frameTail = 'default'
  let frameDelays: number[] = []
  let frameIndex = 0
  let frameTimer: number | undefined
  // held so decoded stills stay in the image cache for the whole loop
  let frameImages: HTMLImageElement[] = []

  function stopAnimation(): void {
    if (frameTimer !== undefined) {
      clearTimeout(frameTimer)
      frameTimer = undefined
    }
    frameImages = []
    if (activeEl) {
      activeEl.style.removeProperty('cursor')
      activeEl = null
    }
  }

  function frameUrl(i: number): string {
    return frameHead.replace('native.gif', `native-${i}.gif`)
  }

  function tick(): void {
    const el = activeEl
    if (!el || !el.isConnected) {
      stopAnimation()
      return
    }
    const onscreen = (frameIndex + frameDelays.length - 1) % frameDelays.length
    el.style.setProperty('cursor', `${frameUrl(frameIndex)}, ${frameUrl(onscreen)}, ${frameTail}`, 'important')
    const hold = frameDelays[frameIndex] || 60
    frameIndex = (frameIndex + 1) % frameDelays.length
    frameTimer = window.setTimeout(tick, hold)
  }

  function evaluate(el: Element | null): void {
    if (!(el instanceof HTMLElement) || !el.isConnected) return

    const nativeValue = nativeCursorValueFor(el)
    const cursorId = CURSOR_ID_RE.exec(nativeValue)?.[1]
    const delays = cursorId ? manifestEntryFor(cursorId)?.nativeFrameDelays : undefined

    if (!cursorId || !delays || delays.length < 2) {
      stopAnimation()
      return
    }
    if (el === activeEl && cursorId === activeCursorId) return

    stopAnimation()

    // Split at the first top-level comma: head is the url + hotspot, tail is the fallback chain.
    const firstComma = nativeValue.indexOf(',', nativeValue.indexOf(')') + 1)
    frameHead = (firstComma === -1 ? nativeValue : nativeValue.slice(0, firstComma)).trim()
    frameTail = firstComma === -1 ? 'default' : nativeValue.slice(firstComma + 1).trim()

    frameImages = []
    for (let i = 0; i < delays.length; i++) {
      const img = new Image()
      img.src = `/win-55-ui/cursors/${cursorId}/native-${i}.gif`
      img.decode().catch(() => {})
      frameImages.push(img)
    }

    activeEl = el
    activeCursorId = cursorId
    frameDelays = delays
    frameIndex = 0
    tick()
  }

  onUnmounted(stopAnimation)

  return { evaluate, stop: stopAnimation }
}
