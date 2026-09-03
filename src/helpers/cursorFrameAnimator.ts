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

// A CSS `cursor: url()` only ever paints frame 0 of an animated GIF, so native mode animates .ani
// cursors here: it rewrites the hovered element's inline `cursor` through the per-frame stills
// (native-<i>.gif) on a timer, one element at a time. Driven by CursorOverlay's shared cursor
// tracker (evaluate / stop), so it re-checks at pointerover speed, not on a slow poll of its own.
// A stale last frame left on an element the pointer moved off is harmless - stopAnimation() removes
// it (handing the element back to the stylesheet) on the next evaluate there, and a switch writes
// the new frame 0 in the same tick, so nothing flashes. Inert in immersive mode, where the native
// props are `none`, never a sprite url.

const CURSOR_ID_RE = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/

/** Which `--win55-cursor-native*` the browser is actually painting for `el` (mirrors index.css's `:where()` rules), so a derived link/text/disabled cursor animates too, not just the base. */
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
  /** Point the animator at the element under the pointer. Starts / switches / stops as needed. */
  evaluate: (el: Element | null) => void
  stop: () => void
}

export function createCursorFrameAnimator(): CursorFrameAnimator {
  let activeEl: HTMLElement | null = null
  let activeCursorId = ''
  let frameBase = ''
  let frameDelays: number[] = []
  let frameIndex = 0
  let frameTimer: number | undefined

  function stopAnimation(): void {
    if (frameTimer !== undefined) {
      clearTimeout(frameTimer)
      frameTimer = undefined
    }
    if (activeEl) {
      activeEl.style.removeProperty('cursor')
      activeEl = null
    }
  }

  function tick(): void {
    const el = activeEl
    if (!el || !el.isConnected) {
      stopAnimation()
      return
    }
    el.style.setProperty('cursor', frameBase.replace('native.gif', `native-${frameIndex}.gif`), 'important')
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
    for (let i = 0; i < delays.length; i++) {
      new Image().src = `/win-55-ui/cursors/${cursorId}/native-${i}.gif`
    }
    activeEl = el
    activeCursorId = cursorId
    frameBase = nativeValue
    frameDelays = delays
    frameIndex = 0
    tick()
  }

  onUnmounted(stopAnimation)

  return { evaluate, stop: stopAnimation }
}
