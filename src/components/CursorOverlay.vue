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
 * Latency: a DOM cursor is inherently a frame or more behind the hardware pointer - it goes through
 * the main-thread -> compositor -> display pipeline, the OS cursor does not. This can't beat that
 * floor, it just adds nothing on top of it:
 *  - Position is written straight from the pointer event (pointermove, plus pointerrawupdate where
 *    the browser has it, for raw sub-frame samples) as a compositor-only transform - no rAF hop, no
 *    reads, no layout.
 *  - Identity (which sprite + hotspot, shown or not) comes from getComputedStyle(CURSOR_TOKEN_PROPERTY)
 *    - the value CursorContext/v-cursor already set through ordinary CSS inheritance, carried on a
 *    custom property the browser never tries to paint (see CursorContextApi.hideNativeCursor). That
 *    read is done only when identity can actually have changed: on pointerover (element-boundary
 *    crossings, target in hand) and on a slow interval sweep for the pointer-still cases (a shifted
 *    element under it, or a busy/progress swap). Nothing runs getComputedStyle or elementFromPoint
 *    per frame - that per-frame forced style/layout flush was the old design.
 */

const CURSOR_TOKEN_PATTERN = /url\(["']?([^"')]+)["']?\)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/
const CURSOR_ID_PATTERN = /\/cursors\/([^/]+)\/normal\.gif(?:[?#]|$)/
/** Pixel grid every other sprite/asset in this UI kit is aligned to - see CLAUDE.md. */
const GRID = 2
/**
 * A native scrollbar-thumb drag (custom-styled ::-webkit-scrollbar included - still native for
 * event purposes) sends the page no pointermove at all while the thumb is held, so pendingX/pendingY
 * would sit frozen until the button is released. onScroll below treats a scroll with no pointermove
 * or wheel in the last DRAG_SCROLL_QUIET_MS as that drag and nudges pendingX/pendingY from the
 * scroll delta instead; identitySweep leaves the sprite shown for the same window, since over the
 * scrollbar gutter elementFromPoint returns null.
 */
const DRAG_SCROLL_QUIET_MS = 100
/** Floor for the estimated scrollbar thumb length when converting a scroll delta to pointer travel. */
const MIN_THUMB_PX = 16
/**
 * The pointer can wind up over a different element, or an element's cursor can change (busy/progress
 * state), with the pointer perfectly still - neither fires pointerover. This interval sweep is the
 * catch-all for that; everything else is event-driven. Imperceptible for a shape change, and it's
 * one elementFromPoint hit-test roughly 8 times a second.
 */
const IDENTITY_SWEEP_MS = 120

const rootEl = ref<HTMLDivElement>()
const normalImg = ref<HTMLImageElement>()
const invertImg = ref<HTMLImageElement>()

let manifest: CursorsManifest = {}
let lastCursorId: string | undefined
let lastToken = ''
let lastHotspotX = 0
let lastHotspotY = 0
let visible = false

// Latest pointer position, from onPointerMove (and nudged by onScroll during a native scrollbar
// drag, which sends no pointermove). Plain module-scope vars, not refs - none of this needs to be
// reactive, and the tracking/scheduling overhead would land on the pointer path.
let pendingX = 0
let pendingY = 0

let lastMoveAt = 0
let lastWheelAt = 0
let lastDragScrollAt = 0
let scrollProbe: { node: Element; left: number; top: number } | null = null
let sweepHandle: number | undefined

function snapToGrid(n: number): number {
  return Math.round(n / GRID) * GRID
}

function clamp(n: number, min: number, max: number): number {
  return n < min ? min : n > max ? max : n
}

/** The entire per-move cost: one compositor-only transform write, no reads, no layout. */
function applyTransform(): void {
  const root = rootEl.value
  if (!root) return
  root.style.transform = `translate(${snapToGrid(pendingX - lastHotspotX)}px, ${snapToGrid(pendingY - lastHotspotY)}px)`
}

/** Guarded so a redundant write never dirties style - that is what forced the next getComputedStyle into a full recalc. */
function setVisible(next: boolean): void {
  const root = rootEl.value
  if (!root || next === visible) return
  visible = next
  root.style.visibility = next ? 'visible' : 'hidden'
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
 * Turns a resolved CURSOR_TOKEN_PROPERTY value into the shown sprite + hotspot. Idempotent and
 * cheap on a repeat token (the common case - most pointerover crossings stay within one scheme),
 * so it's fine to call on every boundary crossing.
 */
function applyToken(token: string): void {
  const match = token.match(CURSOR_TOKEN_PATTERN)
  const cursorId = match ? match[1].match(CURSOR_ID_PATTERN)?.[1] : undefined

  if (!match || !cursorId) {
    lastToken = token
    setVisible(false)
    return
  }

  if (token === lastToken) {
    setVisible(true)
    return
  }
  lastToken = token

  if (cursorId !== lastCursorId) {
    lastCursorId = cursorId
    const entry = manifest[cursorId]
    swapLayer(normalImg.value, entry?.hasNormal ? `/win-55-ui/cursors/${cursorId}/normal.gif` : undefined)
    swapLayer(invertImg.value, entry?.hasInvert ? `/win-55-ui/cursors/${cursorId}/invert.gif` : undefined)
  }

  lastHotspotX = Number(match[2])
  lastHotspotY = Number(match[3])
  setVisible(true)
  applyTransform()
}

function readToken(el: Element | null): string {
  return el ? getComputedStyle(el).getPropertyValue(CURSOR_TOKEN_PROPERTY) : ''
}

// --- position: straight from the pointer event, no rAF in between ---

function onPointerMove(event: PointerEvent): void {
  pendingX = event.clientX
  pendingY = event.clientY
  lastMoveAt = performance.now()
  if (lastCursorId) applyTransform()
}

/** pointerrawupdate isn't in the DOM lib's event maps - this wrapper keeps its listener registration on the plain-string overload, no cast to a global type. */
function onPointerRawUpdate(event: Event): void {
  onPointerMove(event as PointerEvent)
}

// --- identity: event-driven (like custom-cursor.js's focusElements), not polled per frame ---

function onPointerOver(event: PointerEvent): void {
  if (!(event.target instanceof Element)) return
  pendingX = event.clientX
  pendingY = event.clientY
  applyToken(readToken(event.target))
}

/** Only when the pointer actually left the window (relatedTarget null), not on inner crossings. */
function onPointerOut(event: PointerEvent): void {
  if (event.relatedTarget !== null) return
  setVisible(false)
}

function identitySweep(): void {
  // Skipped while a scrollbar drag is feeding onScroll - elementFromPoint would just read the
  // gutter and hide the sprite mid-drag.
  if (performance.now() - lastDragScrollAt <= DRAG_SCROLL_QUIET_MS) return
  applyToken(readToken(document.elementFromPoint(pendingX, pendingY)))
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
 * scroller's own metrics. Gated to a scroll with no recent pointermove or wheel, which is what a
 * thumb drag looks like - keyboard and programmatic scrolling also pass the gate and get a small
 * wrong nudge that the next real pointermove corrects.
 */
function onScroll(event: Event): void {
  const now = performance.now()
  if (now - lastMoveAt < DRAG_SCROLL_QUIET_MS || now - lastWheelAt < DRAG_SCROLL_QUIET_MS) {
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

  if (dTop !== 0 || dLeft !== 0) {
    lastDragScrollAt = now
    applyTransform()
  }
}

onMounted(async () => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  if ('onpointerrawupdate' in window) {
    window.addEventListener('pointerrawupdate', onPointerRawUpdate, { passive: true })
  }
  document.addEventListener('pointerover', onPointerOver, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
  window.addEventListener('wheel', onWheel, { passive: true })
  window.addEventListener('scroll', onScroll, { capture: true, passive: true })
  sweepHandle = window.setInterval(identitySweep, IDENTITY_SWEEP_MS)

  manifest = await loadCursorsManifest()
  // A pointerover that landed before this point cached its token with no layers (manifest was
  // empty) - drop that so the sweep below does a full resolve now that entries are available.
  lastToken = ''
  lastCursorId = undefined
  identitySweep()
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerrawupdate', onPointerRawUpdate)
  document.removeEventListener('pointerover', onPointerOver)
  document.removeEventListener('pointerout', onPointerOut)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('scroll', onScroll, { capture: true })
  if (sweepHandle !== undefined) clearInterval(sweepHandle)
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
