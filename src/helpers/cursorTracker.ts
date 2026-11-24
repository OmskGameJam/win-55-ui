import { onMounted, onUnmounted } from 'vue'

// One pointer listener set shared by the immersive sprite and native frame animator.

const SWEEP_MS = 120

interface CursorTrackerHandlers {
  onMove: (x: number, y: number) => void
  /** Element under the pointer changed; `null` means keep the last cursor. */
  onIdentity: (el: Element | null) => void
  /** Pointer left the window or the tab was hidden. */
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

  // Not in the DOM event maps; the wrapper avoids a global-type cast.
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

  // Background intervals are clamped, so stop on hide and restart with an immediate sweep.
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
