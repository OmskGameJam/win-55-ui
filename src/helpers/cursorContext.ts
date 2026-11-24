import { inject, provide, ref, type ComputedRef, type InjectionKey } from 'vue'

/** `native` paints real CSS cursors; `immersive` hides them and draws sprites in an overlay. */
export type CursorMode = 'native' | 'immersive'

/**
 * Known cursor roles. The open union lets unknown roles type-check and resolve
 * through the windows-default fallback while keeping editor completions.
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
  /** Effective scheme after ancestor inheritance. */
  scheme: ComputedRef<string>
  /** Effective render mode after ancestor inheritance. */
  mode: ComputedRef<CursorMode>
  /** Pinned role, or `undefined` when each element derives its own cursor. */
  role: ComputedRef<CursorRole | undefined>
  /** True when the kit cursor is off; the OS cursor renders instead. */
  disabled: ComputedRef<boolean>
  /** True while this context or an ancestor has an in-flight busy promise. */
  hasBusy: ComputedRef<boolean>
  hasProgress: ComputedRef<boolean>
  /** Resolves a role to a cursorId; busy/progress replace `default`. Undefined until data loads. */
  resolveRole: (role: CursorRole) => string | undefined
  /** As `resolveRole`, but returns a native CSS cursor value. */
  resolveRoleCss: (role: CursorRole) => string | undefined
  /** Subtree default as a native CSS value, with ancestor fallbacks. `auto` when disabled. */
  nativeBaseCss: ComputedRef<string>
  /** Show wait for unpinned cursors until `promise` settles; beats progress. */
  addBusy: (promise: Promise<unknown>) => void
  /** Show progress for unpinned cursors until `promise` settles. */
  addProgress: (promise: Promise<unknown>) => void
}

export const CURSOR_CONTEXT_KEY: InjectionKey<CursorContextApi> = Symbol('win55ui:cursor-context')

/** Inherited cursorId, read via getComputedStyle; set only where a role is pinned. */
export const CURSOR_TOKEN_PROPERTY = '--win55-cursor'

/** Inherited scheme for the overlay's themed lookups. */
export const CURSOR_SCHEME_PROPERTY = '--win55-scheme'

/** Inherited native cursor values for links and text fields. */
export const CURSOR_NATIVE_LINK_PROPERTY = '--win55-cursor-native-link'
export const CURSOR_NATIVE_TEXT_PROPERTY = '--win55-cursor-native-text'
/** Inherited native cursor value for disabled controls. */
export const CURSOR_NATIVE_NOTALLOWED_PROPERTY = '--win55-cursor-native-notallowed'

/** Selectors treated as links or text fields for cursor derivation. */
export const NATIVE_LINK_SELECTOR = 'a[href], area[href]'
export const NATIVE_TEXT_SELECTOR =
  'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]'

/** Inherited native cursor value; `none` means immersive, `auto` means the OS cursor. */
export const CURSOR_NATIVE_PROPERTY = '--win55-cursor-native'

/** All four inherited native cursor props. */
export const NATIVE_CURSOR_PROPS = [
  CURSOR_NATIVE_PROPERTY,
  CURSOR_NATIVE_LINK_PROPERTY,
  CURSOR_NATIVE_TEXT_PROPERTY,
  CURSOR_NATIVE_NOTALLOWED_PROPERTY,
] as const

/** Every property a CursorContext writes on its element or `<html>`. */
export const MANAGED_CURSOR_PROPS = ['cursor', CURSOR_SCHEME_PROPERTY, CURSOR_TOKEN_PROPERTY, ...NATIVE_CURSOR_PROPS] as const

// Hard kill switch; beats nested re-enables.
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

/** For `<script setup>`; directives use `findNearestCursorContext` instead. */
export function useCursorContext(): CursorContextApi | undefined {
  return inject(CURSOR_CONTEXT_KEY, undefined)
}

/** Stashed on each context element for `findNearestCursorContext` to find by DOM walk. */
const CURSOR_CONTEXT_DOM_MARKER = '__win55CursorContext'

export function markCursorContextElement(el: Element, api: CursorContextApi): void {
  ;(el as unknown as Record<string, CursorContextApi>)[CURSOR_CONTEXT_DOM_MARKER] = api
}

export function unmarkCursorContextElement(el: Element): void {
  delete (el as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
}

// Fallback for teleported content outside every marked subtree.
let rootCursorContext: CursorContextApi | undefined

export function setRootCursorContext(api: CursorContextApi): void {
  rootCursorContext = api
}

export function clearRootCursorContext(api: CursorContextApi): void {
  if (rootCursorContext === api) rootCursorContext = undefined
}

/** Nearest marked ancestor, else the registered root context. */
export function findNearestCursorContext(el: Element | null): CursorContextApi | undefined {
  let node = el
  while (node) {
    const api = (node as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
    if (api) return api
    node = node.parentElement
  }
  return rootCursorContext
}
