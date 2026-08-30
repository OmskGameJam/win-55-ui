<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { loadCursorsManifest, resolveCursor, SPRITE_SCALE, type CursorsManifest } from '../helpers/cursors'
import { CURSOR_TOKEN_PROPERTY, CURSOR_SCHEME_PROPERTY } from '../helpers/cursorContext'

// Draws the cursor as two sibling `position: fixed` <img> layers (invert under normal) teleported
// into <body>, mounted once by the `root` CursorContext. A `cursor: url()` can't paint near a
// viewport edge and can't do the invert/blend layer; a `position: fixed` element has neither limit.

const GRID = 2
const IDENTITY_SWEEP_MS = 120

const NATIVE_ROLE: Record<string, string> = {
  pointer: 'link',
  text: 'text',
  'vertical-text': 'text',
  move: 'move',
  'all-scroll': 'move',
  grab: 'move',
  grabbing: 'move',
  'not-allowed': 'not-allowed',
  'no-drop': 'not-allowed',
  wait: 'wait',
  progress: 'progress',
  help: 'help',
  crosshair: 'crosshair',
  cell: 'crosshair',
  'ns-resize': 'ns-resize',
  'n-resize': 'ns-resize',
  's-resize': 'ns-resize',
  'row-resize': 'ns-resize',
  'ew-resize': 'ew-resize',
  'e-resize': 'ew-resize',
  'w-resize': 'ew-resize',
  'col-resize': 'ew-resize',
  'nesw-resize': 'nesw-resize',
  'ne-resize': 'nesw-resize',
  'sw-resize': 'nesw-resize',
  'nwse-resize': 'nwse-resize',
  'nw-resize': 'nwse-resize',
  'se-resize': 'nwse-resize',
}

const normalImg = ref<HTMLImageElement>()
const invertImg = ref<HTMLImageElement>()

let manifest: CursorsManifest = {}
let lastCursorId = ''
let lastHotspotX = 0
let lastHotspotY = 0
let visible = false

let pendingX = 0
let pendingY = 0
let sweepHandle: number | undefined

// `${scheme} ${role}` -> cursorId, so a derived resolution hits resolveCursor once per pair.
const derivedIdCache = new Map<string, string>()

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

  const entry = manifest[cursorId]
  swapLayer(normalImg.value, entry?.hasNormal ? `/win-55-ui/cursors/${cursorId}/normal.gif` : undefined)
  swapLayer(invertImg.value, entry?.hasInvert ? `/win-55-ui/cursors/${cursorId}/invert.gif` : undefined)
  lastHotspotX = (entry?.hotspotX ?? 0) * SPRITE_SCALE
  lastHotspotY = (entry?.hotspotY ?? 0) * SPRITE_SCALE

  setVisible(true)
  applyTransform()
}

function keywordRole(value: string): string {
  // value is "keyword" or "url(...) x y, keyword" - take the trailing keyword
  const keyword = value.split(',').pop()!.trim().split(/\s+/)[0]
  return NATIVE_ROLE[keyword] ?? 'default'
}

const UA_TEXT = 'textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]'

// index.css forces `.cursor` to `none`, so getComputedStyle can't report what the browser would
// have shown - reconstruct it from the nearest inline `cursor` then a small UA model.
function wouldBeCursorRole(el: Element): string {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const inline = (n as HTMLElement).style.cursor
    if (inline && inline !== 'none') return keywordRole(inline)
  }
  if (el.closest('a[href], area[href]')) return 'link'
  if (el.closest(UA_TEXT)) return 'text'
  if (el.closest(':disabled')) return 'not-allowed'
  return 'default'
}

function updateIdentity(el: Element | null): void {
  if (!el) return
  if (el.closest('[data-win55-cursor="off"]')) {
    applyCursorId('')
    return
  }

  const cs = getComputedStyle(el)
  const token = cs.getPropertyValue(CURSOR_TOKEN_PROPERTY).trim()
  if (token) {
    applyCursorId(token)
    return
  }

  const scheme = cs.getPropertyValue(CURSOR_SCHEME_PROPERTY).trim() || 'windows-default'
  const role = wouldBeCursorRole(el)
  const key = `${scheme} ${role}`
  const cached = derivedIdCache.get(key)
  if (cached !== undefined) {
    applyCursorId(cached)
    return
  }

  void resolveCursor(scheme, role).then((id) => {
    derivedIdCache.set(key, id ?? '')
    // re-run against wherever the pointer is now; the cache hit makes it synchronous
    updateIdentity(document.elementFromPoint(pendingX, pendingY))
  })
}

function onPointerMove(event: PointerEvent): void {
  pendingX = event.clientX
  pendingY = event.clientY
  if (lastCursorId) applyTransform()
}

// pointerrawupdate isn't in the DOM event maps; this wrapper keeps its addEventListener call off a global-type cast.
function onPointerRawUpdate(event: Event): void {
  onPointerMove(event as PointerEvent)
}

function onPointerOver(event: PointerEvent): void {
  if (!(event.target instanceof Element)) return
  pendingX = event.clientX
  pendingY = event.clientY
  updateIdentity(event.target)
}

function onPointerOut(event: PointerEvent): void {
  // relatedTarget null = the pointer left the window, not a crossing to a child
  if (event.relatedTarget !== null) return
  setVisible(false)
}

function identitySweep(): void {
  // null target (native scrollbar / off-screen) makes updateIdentity a no-op, keeping the last cursor
  updateIdentity(document.elementFromPoint(pendingX, pendingY))
}

// A background setInterval is clamped to >=1s and stays clamped for the first tick after refocus,
// so stop the sweep on hide and restart + sweep immediately on show.
function onVisibilityChange(): void {
  if (document.hidden) {
    if (sweepHandle !== undefined) {
      clearInterval(sweepHandle)
      sweepHandle = undefined
    }
    setVisible(false)
  } else {
    if (sweepHandle === undefined) sweepHandle = window.setInterval(identitySweep, IDENTITY_SWEEP_MS)
    identitySweep()
  }
}

onMounted(async () => {
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  if ('onpointerrawupdate' in window) {
    window.addEventListener('pointerrawupdate', onPointerRawUpdate, { passive: true })
  }
  document.addEventListener('pointerover', onPointerOver, { passive: true })
  document.addEventListener('pointerout', onPointerOut, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  sweepHandle = window.setInterval(identitySweep, IDENTITY_SWEEP_MS)

  manifest = await loadCursorsManifest()
  // a pointerover before now cached an id against the empty manifest (no layers) - drop it and re-resolve
  lastCursorId = ''
  identitySweep()
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerrawupdate', onPointerRawUpdate)
  document.removeEventListener('pointerover', onPointerOver)
  document.removeEventListener('pointerout', onPointerOut)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (sweepHandle !== undefined) clearInterval(sweepHandle)
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
