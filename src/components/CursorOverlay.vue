<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { loadCursorsManifest, type CursorsManifest } from '../helpers/cursors'
import { CURSOR_TOKEN_PROPERTY } from '../helpers/cursorContext'

/**
 * The DOM-rendered stand-in for the OS cursor - mounted once by the topmost `root` CursorContext
 * (see CursorContext.vue), which hides the real cursor for its whole subtree in favor of this.
 *
 * Why this exists at all: a native `cursor: url(img) x y` can't be painted once the pointer gets
 * close enough to a viewport edge that part of the image would have to render outside it - every
 * browser just falls back to the next value in the list instead (see CLAUDE.md's "Курсоры"
 * section's "Известное ограничение" - real Windows has the exact same limit for native cursors, so
 * this isn't a departure from authenticity, it's the same rule). A plain `position: fixed` element
 * has no such limit, so moving cursor rendering here sidesteps the whole problem.
 *
 * How it knows what to show: rather than re-implementing hover/resolution logic, this reads back
 * getComputedStyle(elementUnderPointer)'s CURSOR_TOKEN_PROPERTY on every animation frame (see
 * frameLoop - a continuous self-scheduling rAF loop, not something mousemove triggers, see there
 * for why) - the exact value CursorContext and v-cursor already computed and set through
 * completely ordinary CSS inheritance (see their own `cursorToken`/`applyCursor`), just carried
 * through a custom property instead of the real `cursor` property - see
 * CursorContextApi.hideNativeCursor's doc comment for why the real property can't double as this
 * channel once native painting is suppressed. That string already carries the resolved cursorId
 * (in the normal.gif URL) and hotspot; this only has to parse it back out, then look up
 * hasNormal/hasInvert for that cursorId in the published manifest to decide which of the two
 * layers to actually show.
 */

const CURSOR_TOKEN_PATTERN = /url\(["']?([^"')]+)["']?\)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/
const CURSOR_ID_PATTERN = /\/cursors\/([^/]+)\/normal\.gif(?:[?#]|$)/
/** Pixel grid every other sprite/asset in this UI kit is aligned to - see CLAUDE.md. */
const GRID = 2
/**
 * A native scrollbar-thumb drag (custom-styled ::-webkit-scrollbar included - still native for
 * event purposes) sends the page no mousemove at all while the thumb is held, so onMouseMove never
 * runs and pendingX/pendingY would sit frozen until the button is released. onScroll below treats a
 * scroll with no mousemove or wheel in the last DRAG_SCROLL_QUIET_MS as that drag and nudges
 * pendingX/pendingY from the scroll delta instead; retainThroughDragScroll keeps the cursor painted
 * for the same window, since over the scrollbar gutter elementFromPoint returns null.
 */
const DRAG_SCROLL_QUIET_MS = 100
/** Floor for the estimated scrollbar thumb length when converting a scroll delta to pointer travel. */
const MIN_THUMB_PX = 16

const rootEl = ref<HTMLDivElement>()
const normalImg = ref<HTMLImageElement>()
const invertImg = ref<HTMLImageElement>()

let manifest: CursorsManifest = {}
let lastCursorId: string | undefined
let lastHotspotX = 0
let lastHotspotY = 0

// The mousemove handler only ever writes these two numbers - the actual work (elementFromPoint,
// getComputedStyle, the DOM writes) all happens in the frameLoop below instead, reading whatever
// is latest here at the time. Plain module-scope variables, not refs: nothing here needs to be
// reactive, and Vue's reactivity would add tracking/scheduling overhead mousemove can't afford.
let pendingX = 0
let pendingY = 0
let rafHandle: number | null = null

let lastMouseMoveAt = 0
let lastWheelAt = 0
let lastDragScrollAt = 0
let scrollProbe: { node: Element; left: number; top: number } | null = null

function snapToGrid(n: number): number {
  return Math.round(n / GRID) * GRID
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n
}

function onMouseMove(event: MouseEvent): void {
  pendingX = event.clientX
  pendingY = event.clientY
  lastMouseMoveAt = performance.now()
}

function onWheel(): void {
  lastWheelAt = performance.now()
}

function resolveScroller(target: EventTarget | null): Element {
  if (target instanceof Element && target !== document.documentElement && target !== document.body) {
    return target
  }
  return document.scrollingElement ?? document.documentElement
}

/**
 * Best-effort pointer tracking for a native scrollbar-thumb drag (see DRAG_SCROLL_QUIET_MS). The
 * thumb stays under the pointer 1:1 as it is dragged, so the pointer moved
 * scrollDelta * thumbTravel / scrollRange, with thumbTravel/scrollRange estimated from the
 * scroller's own metrics. Gated to a scroll with no recent mousemove or wheel, which is what a
 * thumb drag looks like - keyboard and programmatic scrolling also pass the gate and get a small
 * wrong nudge that the next real mousemove corrects.
 */
function onScroll(event: Event): void {
  const now = performance.now()
  if (now - lastMouseMoveAt < DRAG_SCROLL_QUIET_MS || now - lastWheelAt < DRAG_SCROLL_QUIET_MS) {
    scrollProbe = null
    return
  }

  const node = resolveScroller(event.target)
  const { scrollLeft, scrollTop } = node

  if (!scrollProbe || scrollProbe.node !== node) {
    scrollProbe = { node, left: scrollLeft, top: scrollTop }
    return
  }

  const dTop = scrollTop - scrollProbe.top
  const dLeft = scrollLeft - scrollProbe.left
  scrollProbe.left = scrollLeft
  scrollProbe.top = scrollTop

  const rangeY = node.scrollHeight - node.clientHeight
  if (rangeY > 0 && dTop !== 0) {
    const thumb = Math.max(MIN_THUMB_PX, (node.clientHeight * node.clientHeight) / node.scrollHeight)
    const travel = Math.max(1, node.clientHeight - thumb)
    pendingY = clamp(pendingY + (dTop * travel) / rangeY, 0, window.innerHeight - 1)
  }

  const rangeX = node.scrollWidth - node.clientWidth
  if (rangeX > 0 && dLeft !== 0) {
    const thumb = Math.max(MIN_THUMB_PX, (node.clientWidth * node.clientWidth) / node.scrollWidth)
    const travel = Math.max(1, node.clientWidth - thumb)
    pendingX = clamp(pendingX + (dLeft * travel) / rangeX, 0, window.innerWidth - 1)
  }

  if (dTop !== 0 || dLeft !== 0) lastDragScrollAt = now
}

function positionRoot(root: HTMLDivElement, hotspotX: number, hotspotY: number): void {
  root.style.visibility = 'visible'
  root.style.transform = `translate(${snapToGrid(pendingX - hotspotX)}px, ${snapToGrid(pendingY - hotspotY)}px)`
}

/**
 * While onScroll is actively nudging pendingX/pendingY through a native thumb drag, keep painting
 * the last resolved cursor instead of hiding: the pointer is parked over the scrollbar gutter where
 * elementFromPoint returns null and no CURSOR_TOKEN_PROPERTY can be read, but the cursor is still on
 * screen and, thanks to onScroll, still moving.
 */
function retainThroughDragScroll(root: HTMLDivElement): boolean {
  if (!lastCursorId || performance.now() - lastDragScrollAt > DRAG_SCROLL_QUIET_MS) return false
  positionRoot(root, lastHotspotX, lastHotspotY)
  return true
}

/**
 * Runs every animation frame for as long as this component is mounted (i.e. always, while a
 * `root` CursorContext is active), not just in response to mousemove - elementFromPoint and
 * getComputedStyle (both force a hit-test/style recalc) are read fresh each frame here, rather
 * than piggybacking on however often mousemove happens to fire. mousemove itself does nothing but
 * update pendingX/pendingY above - keeping that handler as cheap as physically possible is what
 * matters for responsiveness, not when the heavier read/write work is scheduled relative to it.
 */
function frameLoop(): void {
  rafHandle = requestAnimationFrame(frameLoop)

  const root = rootEl.value
  if (!root) return

  const target = document.elementFromPoint(pendingX, pendingY)
  const token = target ? getComputedStyle(target).getPropertyValue(CURSOR_TOKEN_PROPERTY) : ''
  const tokenMatch = token.match(CURSOR_TOKEN_PATTERN)

  if (!tokenMatch) {
    if (!retainThroughDragScroll(root)) root.style.visibility = 'hidden'
    return
  }

  const [, url, hotspotXStr, hotspotYStr] = tokenMatch
  const idMatch = url.match(CURSOR_ID_PATTERN)
  const cursorId = idMatch?.[1]

  if (!cursorId) {
    if (!retainThroughDragScroll(root)) root.style.visibility = 'hidden'
    return
  }

  if (cursorId !== lastCursorId) {
    lastCursorId = cursorId
    const entry = manifest[cursorId]

    if (normalImg.value) {
      if (entry?.hasNormal) {
        normalImg.value.src = `/win-55-ui/cursors/${cursorId}/normal.gif`
        normalImg.value.style.display = ''
      } else {
        normalImg.value.style.display = 'none'
        normalImg.value.removeAttribute('src')
      }
    }

    if (invertImg.value) {
      if (entry?.hasInvert) {
        invertImg.value.src = `/win-55-ui/cursors/${cursorId}/invert.gif`
        invertImg.value.style.display = ''
      } else {
        invertImg.value.style.display = 'none'
        invertImg.value.removeAttribute('src')
      }
    }
  }

  lastHotspotX = Number(hotspotXStr)
  lastHotspotY = Number(hotspotYStr)
  positionRoot(root, lastHotspotX, lastHotspotY)
}

/** Once the pointer actually leaves the browser viewport there's no further mousemove to hide us on - without this the overlay would stay stuck showing its last position and image indefinitely. `relatedTarget === null` is the standard way to tell "left the document" apart from "moved onto a child element" on a mouseout. */
function onMouseOut(event: MouseEvent): void {
  if (event.relatedTarget !== null) return
  const root = rootEl.value
  if (root) root.style.visibility = 'hidden'
}

onMounted(async () => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('scroll', onScroll, { capture: true, passive: true })
  document.addEventListener('mouseout', onMouseOut)
  rafHandle = requestAnimationFrame(frameLoop)
  manifest = await loadCursorsManifest()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scroll', onScroll, { capture: true })
  document.removeEventListener('mouseout', onMouseOut)
  if (rafHandle !== null) cancelAnimationFrame(rafHandle)
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="rootEl"
      style="position: fixed; top: 0; left: 0; visibility: hidden; pointer-events: none; z-index: 2147483647; will-change: transform"
    >
      <img ref="invertImg" alt="" style="position: absolute; top: 0; left: 0; image-rendering: pixelated; mix-blend-mode: difference" />
      <img ref="normalImg" alt="" style="position: absolute; top: 0; left: 0; image-rendering: pixelated" />
    </div>
  </Teleport>
</template>
