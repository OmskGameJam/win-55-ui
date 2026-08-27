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
}

export const CURSOR_CONTEXT_KEY: InjectionKey<CursorContextApi> = Symbol('win55ui:cursor-context')

export function provideCursorContext(api: CursorContextApi): void {
  provide(CURSOR_CONTEXT_KEY, api)
}

/** For a component's own <script setup> - inject() works normally there. A directive can't call this itself; see directives/cursor.ts for why and how it reaches the same provided value. */
export function useCursorContext(): CursorContextApi | undefined {
  return inject(CURSOR_CONTEXT_KEY, undefined)
}
