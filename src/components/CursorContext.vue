<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect, type CSSProperties } from 'vue'
import { resolveCursor } from '../helpers/cursors'
import {
  provideCursorContext,
  useCursorContext,
  markCursorContextElement,
  unmarkCursorContextElement,
  setRootCursorContext,
  clearRootCursorContext,
  setGlobalCursorDisabled,
  isGlobalCursorDisabled,
  CURSOR_TOKEN_PROPERTY,
  CURSOR_SCHEME_PROPERTY,
  CURSOR_NATIVE_PROPERTY,
  type CursorContextApi,
} from '../helpers/cursorContext'
import CursorOverlay from './CursorOverlay.vue'

interface Props {
  element?: string
  scheme?: string
  /** Pins one cursor for the whole subtree. Left unset, each element's cursor is derived from its native `cursor` (link -> `link`, text field -> `text`, ...) and resolved against `scheme` - see CursorOverlay.vue. */
  role?: string
  /** Turns the kit cursor off for this subtree - the OS cursor renders instead. Inherits; a nested `<CursorContext :disabled="false">` turns it back on. */
  disabled?: boolean
  /**
   * Puts `cursor: none` + the ambient scheme on `<html>` instead of this wrapper's element, and
   * mounts CursorOverlay. For the one outermost CursorContext of an app: CSS inheritance follows the
   * real DOM, so `<Teleport>`-ed content (dropdown menus, Window, ...) lands under `<body>` outside
   * this wrapper's subtree - only a style set on `<html>` reaches everything. `<html>` not `<body>`
   * because body's box is only as tall as its content (Meyer reset), so it isn't reliably an
   * ancestor of every hoverable pixel.
   */
  root?: boolean
  /** `root` only: hard-disables the kit cursor everywhere, overriding any nested re-enable. */
  disableAll?: boolean
}

const props = defineProps<Props>()

const tag = computed(() => props.element ?? 'span')

// Unset props inherit the nearest ancestor context's effective (already-inherited) value.
const parent = useCursorContext()
const effectiveScheme = computed(() => props.scheme ?? parent?.scheme.value ?? 'windows-default')
// undefined = no pinned role here or above; the subtree derives per element (see CursorOverlay.vue).
const effectiveRole = computed(() => props.role ?? parent?.role.value)
// `root disable-all` wins; else own prop, else inherited. `:disabled="false"` re-enables inside a disabled ancestor.
const effectiveDisabled = computed(() => isGlobalCursorDisabled() || (props.disabled ?? parent?.disabled.value ?? false))
// The inherited `--win55-cursor-native`: `auto` shows the OS cursor, `none` (re-enable) hands back to the kit.
// `auto` not `revert` - a CSS-wide keyword can't be stored in a custom property. undefined = don't override.
const nativeCursor = computed(() => (effectiveDisabled.value ? 'auto' : props.disabled === false ? 'none' : undefined))

// A Set, not a counter - adding the same promise twice can't double-count, and a duplicate removal
// is a no-op. Entries drop via finally (resolve or reject alike).
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

// Downward only: own promises OR the parent's state, never a child's - so an outer addBusy() covers
// the whole subtree while a child's can't leak up to a sibling or ancestor.
const hasBusy = computed(() => ownBusyPromises.size > 0 || parent?.hasBusy.value === true)
const hasProgress = computed(() => ownProgressPromises.size > 0 || parent?.hasProgress.value === true)

// busy/progress replace only an unpinned or "default" cursor - a deliberately picked role passes
// straight through, and undefined stays undefined (the subtree keeps deriving per element).
function roleForState(role: string | undefined): string | undefined {
  if (role !== undefined && role !== 'default') return role
  if (hasBusy.value) return 'wait'
  if (hasProgress.value) return 'progress'
  return role
}

function resolveRole(role: string): Promise<string | undefined> {
  return resolveCursor(effectiveScheme.value, roleForState(role) ?? 'default')
}

const api: CursorContextApi = {
  scheme: effectiveScheme,
  role: effectiveRole,
  disabled: effectiveDisabled,
  hasBusy,
  hasProgress,
  resolveRole,
  addBusy,
  addProgress,
}

provideCursorContext(api)

defineExpose({ addBusy, addProgress, resolveRole })

const rootEl = ref<HTMLElement>()

onMounted(() => {
  // stash the api on the DOM element so v-cursor can find it by parent walk (inject() doesn't work there)
  if (rootEl.value) markCursorContextElement(rootEl.value, api)
  if (props.root) setRootCursorContext(api)
})

onUnmounted(() => {
  if (rootEl.value) unmarkCursorContextElement(rootEl.value)
  if (!props.root) return
  clearRootCursorContext(api)
  setGlobalCursorDisabled(false)
  const html = document.documentElement
  html.style.cursor = ''
  html.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  html.style.removeProperty(CURSOR_SCHEME_PROPERTY)
  html.style.removeProperty(CURSOR_NATIVE_PROPERTY)
})

const pinnedRole = computed(() => roleForState(effectiveRole.value))
// undefined while no role is pinned - the subtree derives per element instead
const cursorId = ref<string>()

watchEffect(() => {
  const role = pinnedRole.value
  if (!role) {
    cursorId.value = undefined
    return
  }
  void resolveCursor(effectiveScheme.value, role).then((id) => {
    cursorId.value = id
  })
})

const styles = computed(() => {
  const s: CSSProperties = {}
  if (!props.element) s.display = 'contents'

  if (!props.root) {
    const rec = s as Record<string, string>
    rec.cursor = 'none'
    if (props.scheme) rec[CURSOR_SCHEME_PROPERTY] = effectiveScheme.value
    if (cursorId.value) rec[CURSOR_TOKEN_PROPERTY] = cursorId.value
    if (nativeCursor.value) rec[CURSOR_NATIVE_PROPERTY] = nativeCursor.value
  }

  return s
})

if (props.root) {
  watchEffect(() => setGlobalCursorDisabled(props.disableAll === true))
}

watchEffect(() => {
  if (!props.root) return

  const html = document.documentElement
  html.style.cursor = 'none'
  html.style.setProperty(CURSOR_SCHEME_PROPERTY, effectiveScheme.value)

  if (cursorId.value) {
    html.style.setProperty(CURSOR_TOKEN_PROPERTY, cursorId.value)
  } else {
    html.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  }

  if (nativeCursor.value) {
    html.style.setProperty(CURSOR_NATIVE_PROPERTY, nativeCursor.value)
  } else {
    html.style.removeProperty(CURSOR_NATIVE_PROPERTY)
  }
})
</script>

<template>
  <component :is="tag" :style="styles" ref="rootEl">
    <slot />
  </component>
  <CursorOverlay v-if="root" />
</template>
