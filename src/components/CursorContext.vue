<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watchEffect, type CSSProperties } from 'vue'
import { resolveCursor, type ResolvedCursor } from '../helpers/cursors'
import { provideCursorContext, useCursorContext } from '../helpers/cursorContext'

interface Props {
  element?: string
  /** Raw CSS `cursor` value (e.g. "pointer", or a full "url(...) x y, auto") - set verbatim and skips scheme/role resolution entirely when given. */
  cursor?: string
  scheme?: string
  role?: string
  /**
   * Applies the resolved cursor to `document.body` instead of this wrapper's own element. A
   * wrapper's `cursor` only reaches its actual DOM descendants via CSS inheritance - it never
   * covers bare page background, or content `<Teleport>`-ed elsewhere in the DOM (a BaseDropdown/
   * MenuDropdown's menu, a Window, ...): Vue keeps those as this context's descendants for
   * provide()/inject() purposes, but in the real DOM they end up as siblings under `<body>`,
   * outside this wrapper's subtree, so inheritance never reaches them. `root` is meant for the one
   * outermost CursorContext wrapping a whole app, where that gap matters.
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

provideCursorContext({
  scheme: effectiveScheme,
  role: effectiveRole,
  cursor: effectiveCursor,
  hasBusy,
  hasProgress,
  resolveRole,
  addBusy,
  addProgress,
})

defineExpose({ addBusy, addProgress, resolveRole })

const resolved = ref<ResolvedCursor>()

watchEffect(() => {
  if (effectiveCursor.value) return // explicit cursor wins - no need to resolve at all
  void resolveRole(effectiveRole.value).then((r) => {
    resolved.value = r
  })
})

const cursorCssValue = computed(() => {
  if (effectiveCursor.value) return effectiveCursor.value
  if (resolved.value) return `url(${resolved.value.url}) ${resolved.value.hotspotX} ${resolved.value.hotspotY}, auto`
  return undefined
})

const styles = computed(() => {
  const s: CSSProperties = {}
  if (!props.element) s.display = 'contents'
  if (!props.root && cursorCssValue.value) s.cursor = cursorCssValue.value
  return s
})

watchEffect(() => {
  if (!props.root) return
  document.body.style.cursor = cursorCssValue.value ?? ''
})

onUnmounted(() => {
  if (props.root) document.body.style.cursor = ''
})
</script>

<template>
  <component :is="tag" :style="styles">
    <slot />
  </component>
</template>
