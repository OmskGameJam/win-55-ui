import { nextTick, ref, watchEffect, type Directive, type Ref, type WatchStopHandle } from 'vue'
import { resolveCursor } from '../helpers/cursors'
import { findNearestCursorContext, CURSOR_TOKEN_PROPERTY, type CursorContextApi } from '../helpers/cursorContext'

async function applyCursor(el: HTMLElement, role: string, context: CursorContextApi | undefined): Promise<void> {
  if (!role) {
    el.style.removeProperty('cursor')
    el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
    return
  }

  const cursorId = context ? await context.resolveRole(role) : await resolveCursor('windows-default', role)
  if (!cursorId) {
    el.style.removeProperty('cursor')
    el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
    return
  }

  // the real `cursor` stays `none`; the cursorId rides CURSOR_TOKEN_PROPERTY for CursorOverlay to draw
  el.style.cursor = 'none'
  el.style.setProperty(CURSOR_TOKEN_PROPERTY, cursorId)
}

interface CursorDirectiveState {
  role: Ref<string>
  stop: WatchStopHandle
}

const stateByElement = new WeakMap<HTMLElement, CursorDirectiveState>()

// v-cursor="role" - a one-element CursorContext: resolves `role` against the nearest ancestor
// context's scheme, falling back to the registered root context, then windows-default.
const cursorDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const role = ref(binding.value)
    let stop: WatchStopHandle = () => {}
    stateByElement.set(el, { role, stop: () => stop() })

    // deferred: an ancestor CursorContext marks its element from its own onMounted, which runs after this hook
    void nextTick(() => {
      // a DOM walk, not inject() - see CURSOR_CONTEXT_DOM_MARKER for why inject() picks the wrong instance here
      const context = findNearestCursorContext(el)
      // a lifetime effect, not a one-shot: a "default" role must swap to wait/progress when the context's busy state flips
      stop = watchEffect(() => {
        void applyCursor(el, role.value, context)
      })
    })
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
