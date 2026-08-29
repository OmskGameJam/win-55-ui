import { nextTick, ref, watchEffect, type Directive, type Ref, type WatchStopHandle } from 'vue'
import { resolveCursor } from '../helpers/cursors'
import { findNearestCursorContext, CURSOR_TOKEN_PROPERTY, type CursorContextApi } from '../helpers/cursorContext'

async function applyCursor(el: HTMLElement, role: string, context: CursorContextApi | undefined): Promise<void> {
  if (!role) {
    el.style.removeProperty('cursor')
    el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
    return
  }

  const resolved = context ? await context.resolveRole(role) : await resolveCursor('windows-default', role)
  if (!resolved) {
    el.style.removeProperty('cursor')
    el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
    return
  }

  const token = `url(${resolved.url}) ${resolved.hotspotX} ${resolved.hotspotY}`

  // See CursorContextApi.hideNativeCursor's doc comment for why this can't be a plain fallback-
  // keyword swap: a url() that loads and renders is what the browser paints, full stop, regardless
  // of whatever fallback follows it - "none" has to be the whole value, with the actual resolved
  // cursor handed to CursorOverlay through CURSOR_TOKEN_PROPERTY instead.
  if (context?.hideNativeCursor.value) {
    el.style.cursor = 'none'
    el.style.setProperty(CURSOR_TOKEN_PROPERTY, token)
  } else {
    el.style.cursor = `${token}, auto`
    el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  }
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
 * Finding that ancestor is a real DOM walk (findNearestCursorContext), not provide()/inject() -
 * see CURSOR_CONTEXT_DOM_MARKER's doc comment in cursorContext.ts for why inject() (or the
 * binding.instance workaround an earlier version of this file used) resolves to the wrong instance
 * for the extremely common case of v-cursor written directly inside a <CursorContext> in the same
 * template. That walk has to be deferred past nextTick(), though: a CursorContext only stashes
 * itself on its element from its own onMounted, which - completely ordinarily for Vue - fires
 * *after* every descendant's own mounted hook, this directive's included. Looking synchronously
 * from `mounted` would run before any ancestor has had the chance to stash anything; nextTick()
 * resolves once the whole initial render (and every mounted hook in it) has already settled.
 *
 * Kept alive as a watchEffect for the element's whole lifetime after that (not just re-applied from
 * mounted/updated) so it also reacts to the ambient context alone changing - a role of "default"
 * swaps live to "wait"/"progress" the moment the nearest CursorContext's addBusy()/addProgress()
 * promises go in flight, exactly like that CursorContext's own rendering does (both call the same
 * context.resolveRole, which is where the busy/progress substitution actually happens).
 */
const cursorDirective: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    const role = ref(binding.value)
    let stop: WatchStopHandle = () => {}
    stateByElement.set(el, { role, stop: () => stop() })

    void nextTick(() => {
      const context = findNearestCursorContext(el)
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
