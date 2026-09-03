<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { cursorIdFor, cursorsVersion, loadCursors, manifestEntryFor, SPRITE_SCALE } from '../helpers/cursors'
import { CURSOR_TOKEN_PROPERTY, CURSOR_SCHEME_PROPERTY, CURSOR_NATIVE_PROPERTY, NATIVE_TEXT_SELECTOR } from '../helpers/cursorContext'
import { useCursorTracker } from '../helpers/cursorTracker'
import { createCursorFrameAnimator } from '../helpers/cursorFrameAnimator'

// Draws the immersive cursor as two sibling `position: fixed` <img> layers (invert under normal)
// teleported into <body>, mounted once by the `root` CursorContext. A `cursor: url()` can't paint
// near a viewport edge and can't do the invert/blend layer; a `position: fixed` element has neither
// limit. In native mode the overlay stays hidden and this component is just the host for the shared
// pointer tracker + the .ani frame animator.

const GRID = 2

const animator = createCursorFrameAnimator()

const normalImg = ref<HTMLImageElement>()
const invertImg = ref<HTMLImageElement>()

let lastCursorId = ''
let lastHotspotX = 0
let lastHotspotY = 0
let visible = false
let pendingX = 0
let pendingY = 0

function snapToGrid(n: number): number {
  return Math.round(n / GRID) * GRID
}

// Per layer, not a shared wrapper: a transformed ancestor would isolate invertImg's blend group
// off from the page its mix-blend-mode has to reach.
function applyTransform(): void {
  const t = `translate(${snapToGrid(pendingX - lastHotspotX)}px, ${snapToGrid(pendingY - lastHotspotY)}px)`
  if (normalImg.value) normalImg.value.style.transform = t
  if (invertImg.value) invertImg.value.style.transform = t
}

function setVisible(next: boolean): void {
  const n = normalImg.value
  const iv = invertImg.value
  // skip a redundant write - it still dirties style
  if ((!n && !iv) || next === visible) return
  visible = next
  const v = next ? 'visible' : 'hidden'
  if (n) n.style.visibility = v
  if (iv) iv.style.visibility = v
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

function applyCursorId(cursorId: string): void {
  if (cursorId === lastCursorId) {
    setVisible(cursorId !== '')
    return
  }
  lastCursorId = cursorId

  if (!cursorId) {
    setVisible(false)
    return
  }

  const entry = manifestEntryFor(cursorId)
  swapLayer(normalImg.value, entry?.hasNormal ? `/win-55-ui/cursors/${cursorId}/normal.gif` : undefined)
  swapLayer(invertImg.value, entry?.hasInvert ? `/win-55-ui/cursors/${cursorId}/invert.gif` : undefined)
  lastHotspotX = (entry?.hotspotX ?? 0) * SPRITE_SCALE
  lastHotspotY = (entry?.hotspotY ?? 0) * SPRITE_SCALE

  setVisible(true)
  applyTransform()
}

// index.css keeps `.cursor` at `none` in immersive, so getComputedStyle can't report what the
// browser would have shown - a link, a text field, or a disabled control (author `cursor:` never
// happens in this kit, so the ancestor walk that used to be here is gone).
function wouldBeCursorRole(el: Element): string {
  if (el.closest('a[href], area[href]')) return 'link'
  if (el.closest(NATIVE_TEXT_SELECTOR)) return 'text'
  if (el.closest(':disabled')) return 'not-allowed'
  return 'default'
}

// The one identity dispatch: native mode / disabled -> browser paints, overlay hidden, hand the
// element to the frame animator; immersive -> resolve token or derived role and draw the sprite.
function dispatch(el: Element | null): void {
  if (!el) return // over the scrollbar / a gap - keep the last cursor

  const cs = getComputedStyle(el)
  const native = cs.getPropertyValue(CURSOR_NATIVE_PROPERTY).trim()
  if ((native && native !== 'none') || el.closest('[data-win55-cursor="off"]')) {
    applyCursorId('')
    animator.evaluate(el)
    return
  }

  animator.stop()
  const token = cs.getPropertyValue(CURSOR_TOKEN_PROPERTY).trim()
  if (token) {
    applyCursorId(token)
    return
  }
  const scheme = cs.getPropertyValue(CURSOR_SCHEME_PROPERTY).trim() || 'windows-default'
  applyCursorId(cursorIdFor(scheme, wouldBeCursorRole(el)) ?? '')
}

function onLeave(): void {
  applyCursorId('')
  animator.stop()
}

useCursorTracker({
  onMove: (x, y) => {
    pendingX = x
    pendingY = y
    if (lastCursorId) applyTransform()
  },
  onIdentity: dispatch,
  onLeave,
})

// re-dispatch once cursor data (or a fresh scheme) lands, without waiting for the sweep
watch(cursorsVersion, () => dispatch(document.elementFromPoint(pendingX, pendingY)))

onMounted(() => {
  void loadCursors()
})
</script>

<template>
  <Teleport to="body">
    <img
      ref="invertImg"
      alt=""
      style="position: fixed; top: 0; left: 0; visibility: hidden; pointer-events: none; z-index: 2147483647; image-rendering: pixelated; mix-blend-mode: difference"
    />
    <img
      ref="normalImg"
      alt=""
      style="position: fixed; top: 0; left: 0; visibility: hidden; pointer-events: none; z-index: 2147483647; image-rendering: pixelated"
    />
  </Teleport>
</template>
