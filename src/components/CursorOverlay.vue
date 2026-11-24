<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { cursorIdFor, cursorsVersion, loadCursors, manifestEntryFor, SPRITE_SCALE } from '../helpers/cursors'
import { CURSOR_TOKEN_PROPERTY, CURSOR_SCHEME_PROPERTY, CURSOR_NATIVE_PROPERTY, NATIVE_TEXT_SELECTOR } from '../helpers/cursorContext'
import { useCursorTracker } from '../helpers/cursorTracker'
import { createCursorFrameAnimator } from '../helpers/cursorFrameAnimator'

// Immersive cursor: two fixed <img> layers (invert under normal) teleported to <body>.
// They escape the viewport-edge limit of `cursor: url()` and can blend with the page.

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

// Per layer, not a wrapper: a transformed ancestor would isolate the invert layer's blend group.
function applyTransform(): void {
  const t = `translate(${snapToGrid(pendingX - lastHotspotX)}px, ${snapToGrid(pendingY - lastHotspotY)}px)`
  if (normalImg.value) normalImg.value.style.transform = t
  if (invertImg.value) invertImg.value.style.transform = t
}

function setVisible(next: boolean): void {
  const n = normalImg.value
  const iv = invertImg.value
  // skip redundant writes - they still dirty style
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

// Immersive sets `cursor: none`, so derive the role from element semantics instead.
function wouldBeCursorRole(el: Element): string {
  if (el.closest('a[href], area[href]')) return 'link'
  if (el.closest(NATIVE_TEXT_SELECTOR)) return 'text'
  if (el.closest(':disabled')) return 'not-allowed'
  return 'default'
}

// Native is the default; overlay draws only when --win55-cursor-native is explicitly `none`.
function dispatch(el: Element | null): void {
  if (!el) return // scrollbar or a gap - keep the last cursor

  // escape hatch: the kit is hands-off, the browser paints `cursor: revert`
  if (el.closest('[data-win55-cursor="off"]')) {
    applyCursorId('')
    animator.stop()
    return
  }

  const cs = getComputedStyle(el)
  if (cs.getPropertyValue(CURSOR_NATIVE_PROPERTY).trim() !== 'none') {
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

// re-dispatch when cursor data or a scheme lands, without waiting for the sweep
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
