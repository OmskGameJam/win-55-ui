<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect, type CSSProperties } from 'vue'
import { resolveCursor, type ResolvedCursor } from '../helpers/cursors'
import {
  provideCursorContext,
  useCursorContext,
  markCursorContextElement,
  unmarkCursorContextElement,
  CURSOR_TOKEN_PROPERTY,
  type CursorContextApi,
} from '../helpers/cursorContext'
import CursorOverlay from './CursorOverlay.vue'

interface Props {
  element?: string
  /** Raw CSS `cursor` value (e.g. "pointer", or a full "url(...) x y, auto") - set verbatim and skips scheme/role resolution entirely when given. */
  cursor?: string
  scheme?: string
  role?: string
  /**
   * Applies the resolved cursor to `<html>` (document.documentElement) instead of this wrapper's
   * own element, and mounts CursorOverlay - a DOM-rendered cursor that takes over from the native
   * OS one (see hideNativeCursor below and CursorOverlay.vue for why). A wrapper's `cursor` only
   * reaches its actual DOM descendants via CSS inheritance - it never covers bare page background,
   * or content `<Teleport>`-ed elsewhere in the DOM (a BaseDropdown/MenuDropdown's menu, a Window,
   * ...): Vue keeps those as this context's descendants for provide()/inject() purposes, but in the
   * real DOM they end up as siblings under `<body>`, outside this wrapper's subtree, so inheritance
   * never reaches them. `<html>` rather than `<body>` specifically - body's own box is only ever as
   * tall/wide as it needs to be for its content (the Meyer reset strips margin but never forces
   * `height: 100%`), so it isn't reliably an ancestor of every hoverable pixel the way the true
   * viewport root, `<html>`, always is. `root` is meant for the one outermost CursorContext
   * wrapping a whole app, where that gap matters.
   */
  root?: boolean
}

const props = defineProps<Props>()

const tag = computed(() => props.element ?? 'span')

// A prop left unset here falls back to the nearest ancestor CursorContext's own effective value
// (itself already inherited, so this chains through any depth of nesting), only reaching the
// hardcoded default at the outermost context. `element` is deliberately not part of this - it's a
// per-wrapper rendering choice, not a cursor-resolution parameter.
const parent = useCursorContext()
const effectiveScheme = computed(() => props.scheme ?? parent?.scheme.value ?? 'windows-default')
const effectiveRole = computed(() => props.role ?? parent?.role.value ?? 'default')
const effectiveCursor = computed(() => props.cursor ?? parent?.cursor.value)

// addBusy/addProgress promises tracked at this context specifically - each just a set of in-flight
// promises, removed (via finally, resolved or rejected alike) once settled. A Set rather than a
// counter so adding the same promise twice can't double-count it, and so a duplicate finally-driven
// removal is a harmless no-op.
const ownBusyPromises = reactive(new Set<Promise<unknown>>())
const ownProgressPromises = reactive(new Set<Promise<unknown>>())

function addBusy(promise: Promise<unknown>): void {
  ownBusyPromises.add(promise)
  void promise.finally(() => ownBusyPromises.delete(promise))
}

function addProgress(promise: Promise<unknown>): void {
  ownProgressPromises.add(promise)
  void promise.finally(() => ownProgressPromises.delete(promise))
}

// Busy/progress propagates downward only, same direction as scheme/role/cursor above: this
// context's own promises plus whatever its parent is already showing, so an outer addBusy()
// reaches every "default" cursor in the whole subtree below it. There's no path back up - a
// context only ever reads its parent's hasBusy/hasProgress, never a child's, so nothing here can
// leak out to affect a sibling subtree or an ancestor.
const hasBusy = computed(() => ownBusyPromises.size > 0 || parent?.hasBusy.value === true)
const hasProgress = computed(() => ownProgressPromises.size > 0 || parent?.hasProgress.value === true)

// Same downward-only propagation: a root context's whole subtree hides the native cursor, in favor
// of CursorOverlay - see the doc comment on CursorContextApi.hideNativeCursor for why.
const hideNativeCursor = computed(() => props.root === true || parent?.hideNativeCursor.value === true)

/**
 * Windows' own IDC_WAIT/IDC_APPSTARTING split: busy ("wait" role - plain hourglass, blocks input)
 * takes priority over progress ("progress" role - arrow + hourglass, still interactive). Only ever
 * substitutes for the plain "default" arrow - a deliberately-picked role (not-allowed, ns-resize,
 * v-cursor="'text'", ...) is never swapped out from under the caller.
 */
function roleForState(role: string): string {
  if (role !== 'default') return role
  if (hasBusy.value) return 'wait'
  if (hasProgress.value) return 'progress'
  return 'default'
}

function resolveRole(role: string): Promise<ResolvedCursor | undefined> {
  return resolveCursor(effectiveScheme.value, roleForState(role))
}

const api: CursorContextApi = {
  scheme: effectiveScheme,
  role: effectiveRole,
  cursor: effectiveCursor,
  hasBusy,
  hasProgress,
  resolveRole,
  addBusy,
  addProgress,
  hideNativeCursor,
}

provideCursorContext(api)

defineExpose({ addBusy, addProgress, resolveRole })

// v-cursor can't rely on provide()/inject() (see CURSOR_CONTEXT_DOM_MARKER's doc comment in
// cursorContext.ts for why) - stashing the same api object directly on this context's own rendered
// element is what it walks up to instead.
const rootEl = ref<HTMLElement>()

onMounted(() => {
  if (rootEl.value) markCursorContextElement(rootEl.value, api)
})

onUnmounted(() => {
  if (rootEl.value) unmarkCursorContextElement(rootEl.value)
})

const resolved = ref<ResolvedCursor>()

watchEffect(() => {
  if (effectiveCursor.value) return // explicit cursor wins - no need to resolve at all
  void resolveRole(effectiveRole.value).then((r) => {
    resolved.value = r
  })
})

// The resolved cursor as a bare "url(...) x y" token, no fallback keyword - this is what travels
// through CURSOR_TOKEN_PROPERTY for CursorOverlay to read back (see hideNativeCursor's doc comment
// for why it can't just read the real `cursor` property once native painting is suppressed).
// undefined for the explicit-cursor escape hatch (an arbitrary raw string, not necessarily
// url()-shaped) - that path bypasses the overlay entirely, see nativeCursorValue below.
const cursorToken = computed(() => {
  if (effectiveCursor.value || !resolved.value) return undefined
  return `url(${resolved.value.url}) ${resolved.value.hotspotX} ${resolved.value.hotspotY}`
})

// What actually goes into the real `cursor` property. The explicit-cursor prop always wins here
// too, applied completely as-is - it's a deliberate bypass of resolution *and* the overlay, not
// just of scheme/role. Otherwise: "none" once hideNativeCursor silences native painting for good
// (see its doc comment - a fallback keyword alone can't do this), else the ordinary resolved
// cursor with its normal `, auto` fallback, unchanged from before hideNativeCursor existed.
const nativeCursorValue = computed(() => {
  if (effectiveCursor.value) return effectiveCursor.value
  if (!cursorToken.value) return undefined
  return hideNativeCursor.value ? 'none' : `${cursorToken.value}, auto`
})

const styles = computed(() => {
  const s: CSSProperties = {}
  if (!props.element) s.display = 'contents'

  if (!props.root) {
    if (nativeCursorValue.value) s.cursor = nativeCursorValue.value
    if (hideNativeCursor.value && cursorToken.value) {
      ;(s as Record<string, string>)[CURSOR_TOKEN_PROPERTY] = cursorToken.value
    }
  }

  return s
})

watchEffect(() => {
  if (!props.root) return

  const html = document.documentElement
  html.style.cursor = nativeCursorValue.value ?? ''

  if (hideNativeCursor.value && cursorToken.value) {
    html.style.setProperty(CURSOR_TOKEN_PROPERTY, cursorToken.value)
  } else {
    html.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  }
})

onUnmounted(() => {
  if (!props.root) return
  document.documentElement.style.cursor = ''
  document.documentElement.style.removeProperty(CURSOR_TOKEN_PROPERTY)
})
</script>

<template>
  <component :is="tag" :style="styles" ref="rootEl">
    <slot />
  </component>
  <CursorOverlay v-if="root" />
</template>
