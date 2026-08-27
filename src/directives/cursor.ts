import { ref, watchEffect, type Directive, type DirectiveBinding, type Ref, type WatchStopHandle } from 'vue'
import { resolveCursor } from '../helpers/cursors'
import { CURSOR_CONTEXT_KEY, type CursorContextApi } from '../helpers/cursorContext'

/**
 * A directive hook doesn't run with Vue's "current instance" set - patch/mount happens after
 * unsetCurrentInstance() in @vue/runtime-core, unlike a component's own render - so inject() can't
 * be called here directly (it would silently see whatever instance, if any, happens to be current
 * elsewhere, not the owner of this binding). binding.instance is the public proxy of the component
 * that used v-cursor; its proxy target exposes the real internal instance under `_` (see
 * PublicInstanceProxyHandlers.get in @vue/runtime-core), and `.provides` there is the exact
 * prototype-chained object provide()/inject() themselves read from - walking it by hand reproduces
 * inject(CURSOR_CONTEXT_KEY) for this one case where the normal API doesn't reach.
 */
function findCursorContext(binding: DirectiveBinding): CursorContextApi | undefined {
  const instance = binding.instance as { _?: { provides?: Record<string | symbol, unknown> } } | null | undefined
  return instance?._?.provides?.[CURSOR_CONTEXT_KEY] as CursorContextApi | undefined
}

async function applyCursor(el: HTMLElement, role: string, context: CursorContextApi | undefined): Promise<void> {
  if (!role) {
    el.style.removeProperty('cursor')
    return
  }

  const resolved = context ? await context.resolveRole(role) : await resolveCursor('windows-default', role)
  el.style.cursor = resolved ? `url(${resolved.url}) ${resolved.hotspotX} ${resolved.hotspotY}, auto` : ''
}

interface CursorDirectiveState {
  role: Ref<string>
  stop: WatchStopHandle
}

const stateByElement = new WeakMap<HTMLElement, CursorDirectiveState>()

/**
 * v-cursor="role" - swaps this element (or a component's root element, via Vue's normal directive
 * fallthrough) to a different cursor role, resolved against the nearest ancestor CursorContext's
 * active scheme (see CursorContext.vue and helpers/cursorContext.ts) - basically a lightweight,
 * in-place CursorContext for one element rather than a whole subtree. Falls back to the
 * windows-default scheme when there's no ancestor CursorContext at all.
 *
 * Kept alive as a watchEffect for the element's whole lifetime (not just re-applied from mounted/
 * updated) so it reacts to the ambient context alone changing too - a role of "default" swaps live
 * to "wait"/"progress" the moment the nearest CursorContext's addBusy()/addProgress() promises go
 * in flight, exactly like that CursorContext's own rendering does (both call the same
 * context.resolveRole, which is where the busy/progress substitution actually happens).
 */
const cursorDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const context = findCursorContext(binding)
    const role = ref(binding.value)
    const stop = watchEffect(() => {
      void applyCursor(el, role.value, context)
    })
    stateByElement.set(el, { role, stop })
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return
    const state = stateByElement.get(el)
    if (state) state.role.value = binding.value
  },
  unmounted(el) {
    stateByElement.get(el)?.stop()
    stateByElement.delete(el)
  },
}

export default cursorDirective
