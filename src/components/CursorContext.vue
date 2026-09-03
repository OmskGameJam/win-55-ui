<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watchEffect, type CSSProperties } from 'vue'
import { cursorCssFor, cursorIdFor, cursorsVersion, loadCursors, themedCursorCssFor } from '../helpers/cursors'
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
  scheme?: string
  /** Pins one cursor for the whole subtree. Left unset, each element's cursor is derived from its native `cursor` (link -> `link`, text field -> `text`, ...) and resolved against `scheme` - see CursorOverlay.vue. */
  role?: CursorRole
  /** Turns the kit cursor off for this subtree - the OS cursor renders instead. Inherits; a nested `<CursorContext :disabled="false">` turns it back on. */
  disabled?: boolean
  /**
   * How the cursor is painted for this subtree - `native` (default; real CSS `cursor: url()`) or
   * `immersive` (`cursor: none` + CursorOverlay draws the sprite). Inherits like `disabled`.
   */
  mode?: CursorMode
  /**
   * Puts the ambient scheme + base `--win55-cursor-native` on `<html>` instead of this wrapper's
   * element, and mounts CursorOverlay. For the one outermost CursorContext of an app: CSS inheritance
   * follows the real DOM, so `<Teleport>`-ed content (dropdown menus, Window, ...) lands under
   * `<body>` outside this wrapper's subtree - only a style set on `<html>` reaches everything.
   * `<html>` not `<body>` because body's box is only as tall as its content (Meyer reset), so it
   * isn't reliably an ancestor of every hoverable pixel.
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
const effectiveMode = computed<CursorMode>(() => props.mode ?? parent?.mode.value ?? 'native')

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

function resolveRole(role: string): string | undefined {
  return cursorIdFor(effectiveScheme.value, roleForState(role) ?? 'default')
}

function resolveRoleCss(role: string): string | undefined {
  return cursorCssFor(effectiveScheme.value, roleForState(role) ?? 'default')
}

const api: CursorContextApi = {
  scheme: effectiveScheme,
  mode: effectiveMode,
  role: effectiveRole,
  disabled: effectiveDisabled,
  hasBusy,
  hasProgress,
  resolveRole,
  resolveRoleCss,
  addBusy,
  addProgress,
}

provideCursorContext(api)

defineExpose({ addBusy, addProgress, resolveRole, resolveRoleCss })

void loadCursors()

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
  for (const prop of MANAGED_CURSOR_PROPS) document.documentElement.style.removeProperty(prop)
})

const pinnedRole = computed(() => roleForState(effectiveRole.value))

// Native mode: stamp the inherited props only where this context changes its subtree's theme.
// A bare nested <CursorContext> stays transparent and inherits, matching immersive; `root` always
// stamps, since it seeds the base value for the whole document.
const publishesNative = computed(
  () =>
    props.root ||
    props.scheme !== undefined ||
    props.disabled === false ||
    effectiveDisabled.value ||
    pinnedRole.value !== undefined,
)

// The cursor properties this context contributes, one source of truth for both the :style binding
// (non-root) and the <html> sync (root). Absent keys mean "don't set / clear".
const cursorDeclaration = computed<Record<string, string>>(() => {
  void cursorsVersion.value // recompute once cursor data lands / a scheme reloads
  const scheme = effectiveScheme.value
  const role = pinnedRole.value
  const d: Record<string, string> = {}
  if (props.root || props.scheme) d[CURSOR_SCHEME_PROPERTY] = scheme

  if (effectiveMode.value === 'immersive') {
    d.cursor = 'none'
    // `auto` in a disabled subtree (OS cursor, overlay hides), `none` otherwise (overlay draws)
    d[CURSOR_NATIVE_PROPERTY] = effectiveDisabled.value ? 'auto' : 'none'
    // a pinned role rides the token for the overlay; unpinned leaves it to derive per element
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

  // a pinned role flattens the subtree to one cursor (its bare keyword fallback kept); the
  // always-on link/text/not-allowed derivations below never fall back to a bare keyword
  if (role) {
    const css = cursorCssFor(scheme, role)
    if (css) for (const prop of NATIVE_CURSOR_PROPS) d[prop] = css
    return d
  }

  const base = themedCursorCssFor(scheme, 'default')
  const link = themedCursorCssFor(scheme, 'link')
  const text = themedCursorCssFor(scheme, 'text')
  const notAllowed = themedCursorCssFor(scheme, 'not-allowed')
  if (base) d[CURSOR_NATIVE_PROPERTY] = base
  if (link) d[CURSOR_NATIVE_LINK_PROPERTY] = link
  if (text) d[CURSOR_NATIVE_TEXT_PROPERTY] = text
  if (notAllowed) d[CURSOR_NATIVE_NOTALLOWED_PROPERTY] = notAllowed
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

  // root's declaration can't ride :style (Teleported content escapes the wrapper's subtree) - mirror
  // it onto <html>, which is an ancestor of every painted pixel.
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
  <!-- root-only; inert in native mode - it self-hides wherever --win55-cursor-native isn't `none` -->
  <CursorOverlay v-if="root" />
</template>
