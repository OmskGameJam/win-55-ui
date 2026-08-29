import { inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import type { ResolvedCursor } from './cursors'

export interface CursorContextApi {
  /** This context's effective scheme/role/cursor - already resolved against its own ancestor chain, so a nested CursorContext can use these directly as its own inheritance defaults (see CursorContext.vue). */
  scheme: ComputedRef<string>
  role: ComputedRef<string>
  cursor: ComputedRef<string | undefined>
  /** True while this context or any ancestor has an in-flight addBusy()/addProgress() promise - see CursorContext.vue's roleForState. Exposed mainly so a nested CursorContext (or v-cursor) can fold an ancestor's active state into its own, and so a directive's watchEffect has something reactive to depend on. */
  hasBusy: ComputedRef<boolean>
  hasProgress: ComputedRef<boolean>
  /** Resolves a role against this context's current effective scheme - substituting the busy/progress role instead when `role` is "default" and one is active (see CursorContext.vue's roleForState). */
  resolveRole: (role: string) => Promise<ResolvedCursor | undefined>
  /** Tracks `promise` as "busy" (the plain hourglass "wait" role) for as long as it's pending - every "default"-role cursor in this context's subtree shows "wait" instead until it settles. Takes priority over addProgress. */
  addBusy: (promise: Promise<unknown>) => void
  /** Same as addBusy, but the "arrow + hourglass" progress role - lower priority than busy. */
  addProgress: (promise: Promise<unknown>) => void
  /**
   * True under a `root` CursorContext (or a descendant of one) - see CursorContext.vue's `root`
   * prop and CursorOverlay.vue. A DOM-rendered cursor overlay takes over painting the cursor
   * entirely, so the real `cursor` CSS property is forced to the bare keyword `none` throughout
   * this whole subtree instead of `url(...) x y, auto` - a url() that successfully loads and
   * renders is what the browser actually paints, completely independent of whatever fallback
   * keyword follows it in the list, so swapping only the fallback (an earlier, wrong attempt at
   * this) never stopped native painting anywhere except the rare edge-of-viewport dead zone.
   * `none` throughout is the only way to fully hand painting over to the overlay - which is also
   * why the resolved cursor has to travel through CURSOR_TOKEN_PROPERTY instead, a channel the
   * browser never tries to render on its own. Propagates downward only, same direction as
   * scheme/role/cursor.
   */
  hideNativeCursor: ComputedRef<boolean>
}

export const CURSOR_CONTEXT_KEY: InjectionKey<CursorContextApi> = Symbol('win55ui:cursor-context')

/**
 * CSS custom property carrying a resolved cursor's `url(...) x y` (no fallback keyword - there's
 * nothing to fall back to here, this is never the real `cursor` property) wherever hideNativeCursor
 * is true. Custom properties inherit down the DOM exactly like `cursor` does, and - unlike
 * `cursor` - are never interpreted as something to paint, so CursorOverlay can read one back via
 * getComputedStyle() without the browser ever attempting to render it natively.
 */
export const CURSOR_TOKEN_PROPERTY = '--win55-cursor'

export function provideCursorContext(api: CursorContextApi): void {
  provide(CURSOR_CONTEXT_KEY, api)
}

/** For a component's own <script setup> - inject() works normally there. A directive can't call this itself; see directives/cursor.ts for why and how it reaches the same provided value. */
export function useCursorContext(): CursorContextApi | undefined {
  return inject(CURSOR_CONTEXT_KEY, undefined)
}

/**
 * A plain object property, not part of Vue's provide/inject system at all - stashed directly on a
 * CursorContext's own rendered DOM element (see CursorContext.vue's onMounted), and read back by
 * walking real `.parentElement` links (see findNearestCursorContext below).
 *
 * Why not just binding.instance._.provides, the trick v-cursor's own directive hooks otherwise
 * need for inject() (see directives/cursor.ts's doc comment on that)? That trick still resolves to
 * the WRONG instance for the extremely common case of `<CursorContext><div v-cursor="...">` written
 * directly in one template: slot content is compiled with Vue's `_withCtx`, which deliberately
 * makes vnode creation (including whatever a directive's `withDirectives()` sees as binding.instance)
 * attribute back to the component that *authored* the slot content, not the component that ends up
 * rendering it - i.e. the parent that wrote `<CursorContext>`, not CursorContext itself - even
 * though the actual mounted DOM/component tree correctly nests the div under CursorContext. Real
 * `provide()`/`inject()` for component instances is unaffected (it resolves through the actual
 * mount-time parent chain, not `_withCtx`), which is exactly why useCursorContext() - and every
 * other inject() in this codebase - doesn't need any of this.
 */
const CURSOR_CONTEXT_DOM_MARKER = '__win55CursorContext'

export function markCursorContextElement(el: Element, api: CursorContextApi): void {
  ;(el as unknown as Record<string, CursorContextApi>)[CURSOR_CONTEXT_DOM_MARKER] = api
}

export function unmarkCursorContextElement(el: Element): void {
  delete (el as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
}

/** Walks real DOM `.parentElement` links (starting at `el` itself) to find the nearest marked CursorContext ancestor - see CURSOR_CONTEXT_DOM_MARKER's doc comment for why this, and not binding.instance, is what v-cursor needs. */
export function findNearestCursorContext(el: Element | null): CursorContextApi | undefined {
  let node = el
  while (node) {
    const api = (node as unknown as Record<string, CursorContextApi | undefined>)[CURSOR_CONTEXT_DOM_MARKER]
    if (api) return api
    node = node.parentElement
  }
  return undefined
}
