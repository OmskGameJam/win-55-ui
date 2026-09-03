import { onMounted, onUnmounted } from 'vue'

// The one set of pointer listeners for the whole cursor system. CursorOverlay drives both the
// immersive sprite draw and the native-mode .ani frame animator off this, so there's a single
// pointerover listener and a single sweep interval regardless of mode.

const SWEEP_MS = 120

interface CursorTrackerHandlers {
  /** Every pointer sample - for the sprite's compositor-only transform write. */
  onMove: (x: number, y: number) => void
  /** The element under the pointer changed (or `null` from elementFromPoint over the scrollbar / a gap - the handler should keep the last cursor). */
  onIdentity: (el: Element | null) => void
  /** The pointer left the window, or the tab was hidden - hide everything. */
  onLeave: () => void
}

export function useCursorTracker({ onMove, onIdentity, onLeave }: CursorTrackerHandlers): void {
  let x = 0
  let y = 0
  let sweepHandle: number | undefined

  function onPointerMove(event: PointerEvent): void {
    x = event.clientX
    y = event.clientY
    onMove(x, y)
  }

  // pointerrawupdate isn't in the DOM event maps; this wrapper keeps its addEventListener call off a global-type cast.
  function onPointerRawUpdate(event: Event): void {
    onPointerMove(event as PointerEvent)
  }

  function onPointerOver(event: PointerEvent): void {
    if (!(event.target instanceof Element)) return
    x = event.clientX
    y = event.clientY
    onIdentity(event.target)
  }

  function onPointerOut(event: PointerEvent): void {
    // relatedTarget null = the pointer left the window, not a crossing to a child
    if (event.relatedTarget === null) onLeave()
  }

  function sweep(): void {
    onIdentity(document.elementFromPoint(x, y))
  }

  // A background setInterval is clamped to >=1s and stays clamped for the first tick after refocus,
  // so stop the sweep on hide and restart + sweep immediately on show.
  function onVisibilityChange(): void {
    if (document.hidden) {
      if (sweepHandle !== undefined) {
        clearInterval(sweepHandle)
        sweepHandle = undefined
      }
      onLeave()
    } else {
      if (sweepHandle === undefined) sweepHandle = window.setInterval(sweep, SWEEP_MS)
      sweep()
    }
  }

  onMounted(() => {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    if ('onpointerrawupdate' in window) {
      window.addEventListener('pointerrawupdate', onPointerRawUpdate, { passive: true })
    }
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    sweepHandle = window.setInterval(sweep, SWEEP_MS)
  })

  onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerrawupdate', onPointerRawUpdate)
    document.removeEventListener('pointerover', onPointerOver)
    document.removeEventListener('pointerout', onPointerOut)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    if (sweepHandle !== undefined) clearInterval(sweepHandle)
  })
}
