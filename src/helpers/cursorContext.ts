import { inject, provide, ref, type ComputedRef, type InjectionKey } from 'vue'

/**
 * How a subtree's cursor is painted. Inherited down the context chain like `disabled`.
 * - `native`: a real CSS `cursor: url()`, the browser paints it (no invert layer).
 * - `immersive`: `cursor: none` everywhere, CursorOverlay draws the sprite (invert layer, edge-safe).
 */
export type CursorMode = 'native' | 'immersive'

/**
 * A cursor role - the abstract slot (`link`, `text`, `not-allowed`, ...) a scheme maps to a
 * concrete cursor. These are every role the shipped schemes define (see
 * `public/win-55-ui/cursors/scheme.json`); `(string & {})` keeps the union open - an unknown role
 * still type-checks and resolves through the windows-default fallback - while giving editors the
 * known names as completions for `<CursorContext role>` and `v-cursor`.
 */
export type CursorRole =
  | 'default'
  | 'link'
  | 'text'
  | 'move'
  | 'not-allowed'
  | 'wait'
  | 'progress'
  | 'help'
  | 'crosshair'
  | 'handwriting'
  | 'alternate'
  | 'ns-resize'
  | 'ew-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | (string & {})

export interface CursorContextApi {
  /** Effective scheme, already resolved against this context's ancestor chain. */
  scheme: ComputedRef<string>
  /** Effective render mode, already resolved against this context's ancestor chain. */
  mode: ComputedRef<CursorMode>
  /** Effective *pinned* role, or undefined when nothing pins one and the cursor is left to derive from the element's native `cursor` (see CursorOverlay.vue). */
  role: ComputedRef<CursorRole | undefined>
  /** True when the kit cursor is off for this subtree (a `disabled` ancestor, or a `root` with `disable-all`); the OS cursor renders instead. */
  disabled: ComputedRef<boolean>
  /** True while this context or any ancestor has an in-flight addBusy()/addProgress() promise. */
  hasBusy: ComputedRef<boolean>
  hasProgress: ComputedRef<boolean>
  /** Resolves a role against the effective scheme to a cursorId, substituting busy/progress for "default" when one is active (see CursorContext.vue's roleForState). */
  resolveRole: (role: CursorRole) => Promise<string | undefined>
  /** As resolveRole, but returns a native-mode CSS `cursor` value (`url(...) x y, kw`) instead of a cursorId. */
  resolveRoleCss: (role: CursorRole) => Promise<string | undefined>
  /** Shows the "wait" hourglass for every unpinned / "default" cursor in this subtree until `promise` settles. Takes priority over addProgress. */
  addBusy: (promise: Promise<unknown>) => void
  /** As addBusy, but the "arrow + hourglass" progress cursor - lower priority. */
  addProgress: (promise: Promise<unknown>) => void
}

export const CURSOR_CONTEXT_KEY: InjectionKey<CursorContextApi> = Symbol('win55ui:cursor-context')

/**
 * Resolved cursorId, inherited down the DOM like `cursor` but never painted, so CursorOverlay reads
 * it via getComputedStyle. Set only where a role is pinned (`role` prop, `v-cursor`, busy/progress);
 * where it's absent CursorOverlay derives the cursor from the element's native `cursor` instead.
 */
export const CURSOR_TOKEN_PROPERTY = '--win55-cursor'

/** Effective scheme, inherited down the DOM, so CursorOverlay resolves a derived role in the right themed pack. */
export const CURSOR_SCHEME_PROPERTY = '--win55-scheme'

/**
 * Native mode only. Resolved `url(...) x y, kw` for the `link` / `text` roles of the effective
 * scheme (or `auto` inside a `disabled` subtree), inherited down the DOM. index.css's
 * `:where(a[href])` / `:where(textarea, ...)` rules paint them, so links and text fields get a
 * themed context cursor with no per-element JS. A CursorContext that changes its subtree's theme
 * republishes both, so nesting re-themes the derived cursors; a pinned `role` sets both equal to
 * the base cursor (the subtree flattens to one cursor).
 */
export const CURSOR_NATIVE_LINK_PROPERTY = '--win55-cursor-native-link'
export const CURSOR_NATIVE_TEXT_PROPERTY = '--win55-cursor-native-text'

/**
 * The value index.css's `* { cursor: var(--win55-cursor-native, none) !important }` rule paints,
 * inherited down the DOM:
 * - unset / `none` - immersive: OS cursor hidden, CursorOverlay draws the sprite.
 * - `url("...") x y, kw` - native mode: the browser paints the themed sprite directly.
 * - `auto` - OS cursor renders. Only inside a `disabled` subtree or `[data-win55-cursor="off"]`.
 * CursorOverlay hides itself whenever the value under the pointer is anything other than `none`.
 */
export const CURSOR_NATIVE_PROPERTY = '--win55-cursor-native'

/** Every property a CursorContext writes - the `root` context clears/mirrors this whole set on `<html>`. */
export const MANAGED_CURSOR_PROPS = [
  'cursor',
  CURSOR_SCHEME_PROPERTY,
  CURSOR_TOKEN_PROPERTY,
  CURSOR_NATIVE_PROPERTY,
  CURSOR_NATIVE_LINK_PROPERTY,
  CURSOR_NATIVE_TEXT_PROPERTY,
] as const

// Hard kill switch from a `root` context's `disable-all` - overrides any nested re-enable.
const globalCursorDisabled = ref(false)

export function setGlobalCursorDisabled(value: boolean): void {
  globalCursorDisabled.value = value
}

export function isGlobalCursorDisabled(): boolean {
  return globalCursorDisabled.value
}

export function provideCursorContext(api: CursorContextApi): void {
  provide(CURSOR_CONTEXT_KEY, api)
}

/** For a component's own <script setup>. A directive can't inject(); it uses findNearestCursorContext instead. */
export function useCursorContext(): CursorContextApi | undefined {
  return inject(CURSOR_CONTEXT_KEY, undefined)
}

/**
 * Property name under which each CursorContext stashes its api on its own DOM element, for v-cursor
 * to find by `.parentElement` walk. inject() / binding.instance can't be used from the directive:
 * for `<CursorContext><div v-cursor>` in one template, `_withCtx` attributes the vnode to the
 * component that authored the slot, not CursorContext, even though the mounted tree nests right.
 */
const CURSOR_CONTEXT_DOM_MARKER = '__win55CursorContext'

export function markCursorContextElement(el: Element, api: CursorContextApi): void {
  ;(el as unknown as Record<string, CursorContextApi>)[CURSOR_CONTEXT_DOM_MARKER] = api
}

export function unmarkCursorContextElement(el: Element): void {
  delete (el as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
}

// The one `root` CursorContext. `<Teleport>`-ed content sits outside every CursorContext element's
// subtree, so the `.parentElement` walk can't reach one - findNearestCursorContext falls back here.
let rootCursorContext: CursorContextApi | undefined

export function setRootCursorContext(api: CursorContextApi): void {
  rootCursorContext = api
}

export function clearRootCursorContext(api: CursorContextApi): void {
  if (rootCursorContext === api) rootCursorContext = undefined
}

/** Nearest marked CursorContext ancestor by `.parentElement` walk, else the registered `root` context, else undefined. */
export function findNearestCursorContext(el: Element | null): CursorContextApi | undefined {
  let node = el
  while (node) {
    const api = (node as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
    if (api) return api
    node = node.parentElement
  }
  return rootCursorContext
}
