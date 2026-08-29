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
 * Latency: the position is written straight from onMouseMove as a compositor-only transform (no
 * layout, no reads), so the sprite is glued to the pointer with no added frame. The expensive part -
 * reading back getComputedStyle(elementUnderPointer)'s CURSOR_TOKEN_PROPERTY to learn which sprite
 * and hotspot to show (the value CursorContext/v-cursor already set through ordinary CSS
 * inheritance, carried on a custom property the browser never tries to paint - see
 * CursorContextApi.hideNativeCursor) - forces a style/hit-test flush, so it is rate-limited to
 * IDENTITY_POLL_MS in frameLoop rather than run per frame. A shape or busy-state change landing a
 * frame or two late is imperceptible; the pointer position lagging is not.
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
 * pendingX/pendingY from the scroll delta instead; resolveIdentity keeps the sprite shown for the
 * same window, since over the scrollbar gutter elementFromPoint returns null.
 */
const DRAG_SCROLL_QUIET_MS = 100
/** Floor for the estimated scrollbar thumb length when converting a scroll delta to pointer travel. */
const MIN_THUMB_PX = 16
/**
 * How often frameLoop re-resolves the cursor's identity (sprite, hotspot, shown-or-not) from
 * elementFromPoint + getComputedStyle. That pair forces a synchronous style/layout flush; running
 * it every animation frame - as this once did - dropped the flush right into the middle of the
 * frame trying to move the cursor, which is what made it feel a frame behind. ~30Hz is far tighter
 * than a shape or busy-state change needs to feel instant, and the position path never waits on it.
 */
const IDENTITY_POLL_MS = 32

const rootEl = ref<HTMLDivElement>()
const normalImg = ref<HTMLImageElement>()
const invertImg = ref<HTMLImageElement>()

let manifest: CursorsManifest = {}
let lastCursorId: string | undefined
let lastHotspotX = 0
let lastHotspotY = 0
let visible = false

// pendingX/pendingY: latest pointer position, from onMouseMove (and nudged by onScroll during a
// native scrollbar drag, which sends no mousemove). Plain module-scope vars, not refs - none of
// this needs to be reactive, and the tracking/scheduling overhead would land on the pointer path.
let pendingX = 0
let pendingY = 0
let rafHandle: number | null = null

let lastMouseMoveAt = 0
let lastWheelAt = 0
let lastDragScrollAt = 0
let lastIdentityAt = 0
let scrollProbe: { node: Element; left: number; top: number } | null = null

function snapToGrid(n: number): number {
  return Math.round(n / GRID) * GRID
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n
}

/**
 * The entire cost of moving the cursor: one compositor-only transform write, no DOM reads. Called
 * from onMouseMove for zero added latency, and from frameLoop for the frames without one (scrollbar
 * drag via onScroll, a hotspot that just changed under a still pointer, first paint).
 */
function applyTransform(root: HTMLDivElement): void {
  root.style.transform = `translate(${snapToGrid(pendingX - lastHotspotX)}px, ${snapToGrid(pendingY - lastHotspotY)}px)`
}

/** Guarded so a redundant write never dirties style - that is what forced the next getComputedStyle into a full recalc. */
function setVisible(root: HTMLDivElement, next: boolean): void {
  if (next === visible) return
  visible = next
  root.style.visibility = next ? 'visible' : 'hidden'
}

function onMouseMove(event: MouseEvent): void {
  pendingX = event.clientX
  pendingY = event.clientY
  lastMouseMoveAt = performance.now()

  const root = rootEl.value
  if (root && lastCursorId) applyTransform(root)
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

function swapLayer(img: HTMLImageElement | undefined, src: string | undefined): void {
  if (!img) return
  if (src) {
    img.src = src
    img.style.display = ''
  } else {
    img.style.display = 'none'
    img.removeAttribute('src')
  }
}

/**
 * Re-resolves which sprite/hotspot the cursor should have from whatever sits under the pointer, and
 * whether it should show at all. The expensive half (elementFromPoint + getComputedStyle both force
 * a flush) - frameLoop rate-limits it to IDENTITY_POLL_MS; the position path never waits on it.
 */
function resolveIdentity(root: HTMLDivElement): void {
  const target = document.elementFromPoint(pendingX, pendingY)
  const token = target ? getComputedStyle(target).getPropertyValue(CURSOR_TOKEN_PROPERTY) : ''
  const tokenMatch = token.match(CURSOR_TOKEN_PATTERN)
  const cursorId = tokenMatch ? tokenMatch[1].match(CURSOR_ID_PATTERN)?.[1] : undefined

  if (!tokenMatch || !cursorId) {
    // Over the scrollbar gutter mid native-drag elementFromPoint is null, but the cursor is very
    // much still on screen and, via onScroll, still moving - keep the last sprite for that window.
    const draggingScrollbar = performance.now() - lastDragScrollAt <= DRAG_SCROLL_QUIET_MS
    setVisible(root, draggingScrollbar && lastCursorId !== undefined)
    return
  }

  if (cursorId !== lastCursorId) {
    lastCursorId = cursorId
    const entry = manifest[cursorId]
    swapLayer(normalImg.value, entry?.hasNormal ? `/win-55-ui/cursors/${cursorId}/normal.gif` : undefined)
    swapLayer(invertImg.value, entry?.hasInvert ? `/win-55-ui/cursors/${cursorId}/invert.gif` : undefined)
  }

  lastHotspotX = Number(tokenMatch[2])
  lastHotspotY = Number(tokenMatch[3])
  setVisible(root, true)
  applyTransform(root)
}

/**
 * Cheap every frame: re-apply the transform so the sprite stays glued even on frames with no
 * mousemove (scrollbar drag via onScroll, a just-changed hotspot, first paint). Rate-limited:
 * re-resolve the cursor's identity at most every IDENTITY_POLL_MS - see that constant.
 */
function frameLoop(): void {
  rafHandle = requestAnimationFrame(frameLoop)

  const root = rootEl.value
  if (!root) return

  if (visible) applyTransform(root)

  const now = performance.now()
  if (now - lastIdentityAt >= IDENTITY_POLL_MS) {
    lastIdentityAt = now
    resolveIdentity(root)
  }
}

/** Once the pointer actually leaves the browser viewport there's no further mousemove to hide us on - without this the overlay would stay stuck showing its last position and image indefinitely. `relatedTarget === null` is the standard way to tell "left the document" apart from "moved onto a child element" on a mouseout. */
function onMouseOut(event: MouseEvent): void {
  if (event.relatedTarget !== null) return
  const root = rootEl.value
  if (root) setVisible(root, false)
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
