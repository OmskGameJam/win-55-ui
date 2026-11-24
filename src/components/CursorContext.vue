<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect, type CSSProperties } from 'vue'
import { cursorCssFor, cursorIdFor, cursorsVersion, loadCursors, themedCursorCssFor, withCssFallback } from '../helpers/cursors'
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
  CURSOR_NATIVE_LINK_PROPERTY,
  CURSOR_NATIVE_TEXT_PROPERTY,
  CURSOR_NATIVE_NOTALLOWED_PROPERTY,
  NATIVE_CURSOR_PROPS,
  MANAGED_CURSOR_PROPS,
  type CursorContextApi,
  type CursorMode,
  type CursorRole,
} from '../helpers/cursorContext'
import CursorOverlay from './CursorOverlay.vue'

interface Props {
  element?: string
  /** `undefined` inherits the nearest context's scheme. */
  scheme?: string
  /** Pin one cursor for the subtree; unset derives it from each element's native `cursor`. */
  role?: CursorRole
  /** OS cursor instead of the kit cursor. `undefined` inherits; `false` re-enables locally. */
  disabled?: boolean
  /** `native` paints real CSS cursors; `immersive` hides them and draws sprites in an overlay. */
  mode?: CursorMode
  /** Publishes scheme + cursor props on `<html>` and mounts the overlay, reaching teleported content. */
  root?: boolean
  /** `root` only: hard-disable everywhere, beating nested re-enables. Not the same as `disabled`. */
  disableAll?: boolean
}

const props = defineProps<Props>()

const tag = computed(() => props.element ?? 'span')

// Unset props inherit the nearest ancestor context's effective value.
const parent = useCursorContext()
const effectiveScheme = computed(() => props.scheme ?? parent?.scheme.value ?? 'windows-default')
// No pinned role here or above; derive per element.
const effectiveRole = computed(() => props.role ?? parent?.role.value)
// Root kill switch wins, then own prop, then inherited. `:disabled="false"` re-enables locally.
const effectiveDisabled = computed(() => isGlobalCursorDisabled() || (props.disabled ?? parent?.disabled.value ?? false))
const effectiveMode = computed<CursorMode>(() => props.mode ?? parent?.mode.value ?? 'native')

// Sets make duplicate adds/removes harmless; entries drop when the promise settles.
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

// Downward only: a child's busy state never leaks to a sibling or ancestor.
const hasBusy = computed(() => ownBusyPromises.size > 0 || parent?.hasBusy.value === true)
const hasProgress = computed(() => ownProgressPromises.size > 0 || parent?.hasProgress.value === true)

// Busy/progress only replace an unpinned or `default` cursor.
function roleForState(role: string | undefined): string | undefined {
  if (role !== undefined && role !== 'default') return role
  if (hasBusy.value) return 'wait'
  if (hasProgress.value) return 'progress'
  return role
}

function resolveRole(role: string): string | undefined {
  return cursorIdFor(effectiveScheme.value, roleForState(role) ?? 'default')
}

function resolveRoleCss(role: string): string | undefined {
  return cursorCssFor(effectiveScheme.value, roleForState(role) ?? 'default')
}

// Re-theming levels chain their default ahead of the inherited one as url() fallbacks,
// so a sprite still decoding falls back to the ambient cursor, not the OS cursor.
const nativeBaseCss = computed<string>(() => {
  if (effectiveDisabled.value) return 'auto'
  void cursorsVersion.value
  const own = themedCursorCssFor(effectiveScheme.value, 'default') ?? 'default'
  const inherited = parent?.nativeBaseCss.value
  if (!inherited || inherited === 'auto') return own
  return props.root || props.scheme !== undefined ? withCssFallback(own, inherited) : inherited
})

const api: CursorContextApi = {
  scheme: effectiveScheme,
  mode: effectiveMode,
  role: effectiveRole,
  disabled: effectiveDisabled,
  hasBusy,
  hasProgress,
  resolveRole,
  resolveRoleCss,
  nativeBaseCss,
  addBusy,
  addProgress,
}

provideCursorContext(api)

defineExpose({ addBusy, addProgress, resolveRole, resolveRoleCss })

void loadCursors()

const rootEl = ref<HTMLElement>()

onMounted(() => {
  // v-cursor finds the context by DOM walk, not inject().
  if (rootEl.value) markCursorContextElement(rootEl.value, api)
  if (props.root) setRootCursorContext(api)
})

onUnmounted(() => {
  if (rootEl.value) unmarkCursorContextElement(rootEl.value)
  if (!props.root) return
  clearRootCursorContext(api)
  setGlobalCursorDisabled(false)
  for (const prop of MANAGED_CURSOR_PROPS) document.documentElement.style.removeProperty(prop)
})

const pinnedRole = computed(() => roleForState(effectiveRole.value))

// Stamp native props only where this context changes the subtree theme.
// `root` always stamps because it seeds the document base.
const publishesNative = computed(
  () =>
    props.root ||
    props.scheme !== undefined ||
    props.disabled === false ||
    effectiveDisabled.value ||
    pinnedRole.value !== undefined,
)

// One source of truth for the :style binding and the <html> sync.
const cursorDeclaration = computed<Record<string, string>>(() => {
  void cursorsVersion.value // recompute when cursor data lands or a scheme reloads
  const scheme = effectiveScheme.value
  const role = pinnedRole.value
  const d: Record<string, string> = {}
  if (props.root || props.scheme) d[CURSOR_SCHEME_PROPERTY] = scheme

  if (effectiveMode.value === 'immersive') {
    d.cursor = 'none'
    // `auto` in a disabled subtree, `none` otherwise
    d[CURSOR_NATIVE_PROPERTY] = effectiveDisabled.value ? 'auto' : 'none'
    // a pinned role rides the token; unpinned roles derive per element
    const id = role ? cursorIdFor(scheme, role) : undefined
    if (id) d[CURSOR_TOKEN_PROPERTY] = id
    return d
  }

  if (!publishesNative.value) return d

  // `disabled` is the sanctioned OS-cursor opt-out, same as [data-win55-cursor="off"]
  if (effectiveDisabled.value) {
    for (const prop of NATIVE_CURSOR_PROPS) d[prop] = 'auto'
    return d
  }

  // Every value ends with nativeBaseCss, so an undecoded sprite falls back to it.
  const fallback = nativeBaseCss.value

  // a pinned role flattens the subtree to one cursor; a bare-keyword unresolved role stays as-is
  if (role) {
    const css = withCssFallback(cursorCssFor(scheme, role), fallback)
    for (const prop of NATIVE_CURSOR_PROPS) d[prop] = css
    return d
  }

  d[CURSOR_NATIVE_PROPERTY] = fallback
  d[CURSOR_NATIVE_LINK_PROPERTY] = withCssFallback(themedCursorCssFor(scheme, 'link'), fallback)
  d[CURSOR_NATIVE_TEXT_PROPERTY] = withCssFallback(themedCursorCssFor(scheme, 'text'), fallback)
  d[CURSOR_NATIVE_NOTALLOWED_PROPERTY] = withCssFallback(themedCursorCssFor(scheme, 'not-allowed'), fallback)
  return d
})

const styles = computed<CSSProperties>(() => {
  const s: CSSProperties = {}
  if (!props.element) s.display = 'contents'
  if (!props.root) Object.assign(s, cursorDeclaration.value)
  return s
})

if (props.root) {
  watchEffect(() => setGlobalCursorDisabled(props.disableAll === true))

  // Teleported content escapes the wrapper, so mirror the declaration onto <html>.
  watchEffect(() => {
    const decl = cursorDeclaration.value
    const style = document.documentElement.style
    for (const prop of MANAGED_CURSOR_PROPS) {
      if (decl[prop] !== undefined) style.setProperty(prop, decl[prop])
      else style.removeProperty(prop)
    }
  })
}
</script>

<template>
  <component :is="tag" :style="styles" ref="rootEl">
    <slot />
  </component>
  <!-- root only; self-hides in native mode -->
  <CursorOverlay v-if="root" />
</template>
