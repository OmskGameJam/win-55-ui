import { onMounted, onUnmounted } from 'vue'
import { loadCursorsManifest, type CursorsManifest } from './cursors'
import { CURSOR_NATIVE_PROPERTY } from './cursorContext'

// A CSS `cursor: url()` only ever paints frame 0 of an animated GIF, so native mode animates .ani
// cursors here: it rewrites the hovered element's inline `cursor` through the per-frame stills
// (native-<i>.gif) on a timer, one element at a time. A stale last frame left on an element the
// pointer has moved off is harmless - stopAnimation() removes it (handing the element back to the
// stylesheet) the next time identity is re-checked there, and a switch writes the new frame 0 in
// the same tick, so nothing flashes. Called by CursorOverlay, so it lives under the root
// CursorContext; inert in immersive mode, where --win55-cursor-native is `none`, never a sprite url.

const SWEEP_MS = 200
const CURSOR_ID_RE = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/

export function useCursorFrameAnimator(): void {
  let manifest: CursorsManifest = {}
  let activeEl: HTMLElement | null = null
  let activeCursorId = ''
  let frameBase = ''
  let frameDelays: number[] = []
  let frameIndex = 0
  let frameTimer: number | undefined
  let sweepTimer: number | undefined
  let lastX = -1
  let lastY = -1

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

    // --win55-cursor-native, not computed `cursor`: it's what a role/scheme change updates and it's
    // immune to our own per-frame inline writes.
    const nativeValue = getComputedStyle(el).getPropertyValue(CURSOR_NATIVE_PROPERTY).trim()
    const cursorId = CURSOR_ID_RE.exec(nativeValue)?.[1]
    const delays = cursorId ? manifest[cursorId]?.nativeFrameDelays : undefined

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

  function onPointerOver(event: PointerEvent): void {
    lastX = event.clientX
    lastY = event.clientY
    if (event.target instanceof Element) evaluate(event.target)
  }

  function onPointerOut(event: PointerEvent): void {
    // relatedTarget null = the pointer left the window
    if (event.relatedTarget === null) stopAnimation()
  }

  // Catches an identity change under a stationary pointer (busy/progress activating, a shifted element).
  function sweep(): void {
    evaluate(document.elementFromPoint(lastX, lastY))
  }

  function onVisibilityChange(): void {
    if (document.hidden) {
      stopAnimation()
      if (sweepTimer !== undefined) {
        clearInterval(sweepTimer)
        sweepTimer = undefined
      }
    } else {
      // a background setInterval is clamped, and stays clamped for the first tick after refocus
      if (sweepTimer === undefined) sweepTimer = window.setInterval(sweep, SWEEP_MS)
      sweep()
    }
  }

  onMounted(async () => {
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    sweepTimer = window.setInterval(sweep, SWEEP_MS)

    manifest = await loadCursorsManifest()
    sweep()
  })

  onUnmounted(() => {
    document.removeEventListener('pointerover', onPointerOver)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (sweepTimer !== undefined) clearInterval(sweepTimer)
    stopAnimation()
  })
}
