import { nextTick, ref, watchEffect, type Directive, type Ref, type WatchStopHandle } from 'vue'
import { resolveCursor, resolveCursorCss } from '../helpers/cursors'
import {
  findNearestCursorContext,
  CURSOR_TOKEN_PROPERTY,
  CURSOR_NATIVE_PROPERTY,
  CURSOR_NATIVE_LINK_PROPERTY,
  CURSOR_NATIVE_TEXT_PROPERTY,
  type CursorContextApi,
  type CursorRole,
} from '../helpers/cursorContext'

function clear(el: HTMLElement): void {
  el.style.removeProperty('cursor')
  el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  el.style.removeProperty(CURSOR_NATIVE_PROPERTY)
  el.style.removeProperty(CURSOR_NATIVE_LINK_PROPERTY)
  el.style.removeProperty(CURSOR_NATIVE_TEXT_PROPERTY)
}

async function applyCursor(el: HTMLElement, role: CursorRole, context: CursorContextApi | undefined): Promise<void> {
  const native = (context?.mode.value ?? 'native') === 'native'
  // wipe first - keeps a live mode switch from leaving the other branch's props behind
  clear(el)
  if (!role) return

  if (native) {
    const value = context ? await context.resolveRoleCss(role) : await resolveCursorCss('windows-default', role)
    if (!value) return
    // inline `!important` wins on the element itself (over index.css's `:where()` UA rules); the
    // three custom props override the inherited derivation for the subtree, nested <a>/fields included
    el.style.setProperty('cursor', value, 'important')
    el.style.setProperty(CURSOR_NATIVE_PROPERTY, value)
    el.style.setProperty(CURSOR_NATIVE_LINK_PROPERTY, value)
    el.style.setProperty(CURSOR_NATIVE_TEXT_PROPERTY, value)
    return
  }

  const cursorId = context ? await context.resolveRole(role) : await resolveCursor('windows-default', role)
  if (!cursorId) return

  // the real `cursor` stays `none`; the cursorId rides CURSOR_TOKEN_PROPERTY for CursorOverlay to draw
  el.style.cursor = 'none'
  el.style.setProperty(CURSOR_TOKEN_PROPERTY, cursorId)
}

interface CursorDirectiveState {
  role: Ref<CursorRole>
  stop: WatchStopHandle
}

const stateByElement = new WeakMap<HTMLElement, CursorDirectiveState>()

// v-cursor="role" - a one-element CursorContext: resolves `role` against the nearest ancestor
// context's scheme, falling back to the registered root context, then windows-default.
const cursorDirective: Directive<HTMLElement, CursorRole> = {
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
