import { nextTick, ref, watchEffect, type Directive, type Ref, type WatchStopHandle } from 'vue'
import { cursorCssFor, cursorIdFor, loadCursors, themedCursorCssFor, withCssFallback } from '../helpers/cursors'
import {
  findNearestCursorContext,
  NATIVE_CURSOR_PROPS,
  CURSOR_TOKEN_PROPERTY,
  type CursorContextApi,
  type CursorRole,
} from '../helpers/cursorContext'

function clear(el: HTMLElement): void {
  el.style.removeProperty('cursor')
  el.style.removeProperty(CURSOR_TOKEN_PROPERTY)
  for (const p of NATIVE_CURSOR_PROPS) el.style.removeProperty(p)
}

function applyCursor(el: HTMLElement, role: CursorRole, context: CursorContextApi | undefined): void {
  const native = (context?.mode.value ?? 'native') === 'native'
  // wipe first - keeps a live mode switch (or a strong -> weak handover) from leaving stale props behind
  clear(el)
  if (!role) return

  if (native) {
    const roleCss = context ? context.resolveRoleCss(role) : cursorCssFor('windows-default', role)
    if (!roleCss) return
    // end with the context's ambient default chain so a sprite still decoding never flashes the OS cursor
    const fallback = context ? context.nativeBaseCss.value : themedCursorCssFor('windows-default', 'default')
    const value = withCssFallback(roleCss, fallback ?? 'default')
    // inline `!important` wins on the element itself (over index.css's `:where()` UA rules); the
    // native props override the inherited derivation for the subtree, nested <a>/fields included
    el.style.setProperty('cursor', value, 'important')
    for (const p of NATIVE_CURSOR_PROPS) el.style.setProperty(p, value)
    return
  }

  const cursorId = context ? context.resolveRole(role) : cursorIdFor('windows-default', role)
  if (!cursorId) return

  // the real `cursor` stays `none`; the cursorId rides CURSOR_TOKEN_PROPERTY for CursorOverlay to draw
  el.style.cursor = 'none'
  el.style.setProperty(CURSOR_TOKEN_PROPERTY, cursorId)
}

type Strength = 'strong' | 'weak'

interface CursorSlot {
  role: Ref<CursorRole>
  context: CursorContextApi | undefined
}

interface ElementCursorState {
  strong?: CursorSlot
  weak?: CursorSlot
  // bumped on slot add/remove so the shared effect re-picks the active slot
  rev: Ref<number>
  stop?: WatchStopHandle
}

// One controller per rendered element, keyed by the element (not by directive binding). v-cursor
// owns the `strong` slot, v-cursor-weak the `weak` slot; a single effect applies `strong ?? weak`.
// So a component's own v-cursor-weak and a consumer's v-cursor (landing on the same element via
// directive fallthrough) coexist with deterministic precedence and independent teardown - strong
// wins, and if it unmounts the effect re-runs and weak takes over. One strong + one weak is the
// only valid pairing; a second of either strength on the same element throws (see attach).
const controllers = new WeakMap<HTMLElement, ElementCursorState>()

function activeSlot(state: ElementCursorState): CursorSlot | undefined {
  return state.strong ?? state.weak
}

function runController(el: HTMLElement): void {
  const state = controllers.get(el)
  if (!state) return
  void state.rev.value
  const slot = activeSlot(state)
  if (!slot) {
    clear(el)
    return
  }
  applyCursor(el, slot.role.value, slot.context)
}

function attach(el: HTMLElement, strength: Strength, value: CursorRole): void {
  void loadCursors()
  let state = controllers.get(el)
  if (!state) {
    state = { rev: ref(0) }
    controllers.set(el, state)
  }
  if (state[strength]) {
    const name = strength === 'strong' ? 'v-cursor' : 'v-cursor-weak'
    throw new Error(
      `[win-55-ui] two ${name} directives on one element. A reusable component must set its own ` +
        `cursor with v-cursor-weak so a consumer's v-cursor overrides it; two of the same strength ` +
        `on one element is unsupported. Element: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`,
    )
  }
  const slot: CursorSlot = { role: ref(value), context: undefined }
  state[strength] = slot
  state.rev.value++

  // deferred: an ancestor CursorContext marks its element from its own onMounted, which runs after this hook
  void nextTick(() => {
    const current = controllers.get(el)
    if (!current || current[strength] !== slot) return
    // a DOM walk, not inject() - see CURSOR_CONTEXT_DOM_MARKER for why inject() picks the wrong instance here
    slot.context = findNearestCursorContext(el)
    if (!current.stop) current.stop = watchEffect(() => runController(el))
    else if (slot === activeSlot(current)) current.rev.value++
  })
}

function detach(el: HTMLElement, strength: Strength): void {
  const state = controllers.get(el)
  if (!state) return
  state[strength] = undefined
  if (!state.strong && !state.weak) {
    state.stop?.()
    controllers.delete(el)
    clear(el)
    return
  }
  state.rev.value++
}

function makeCursorDirective(strength: Strength): Directive<HTMLElement, CursorRole> {
  return {
    mounted(el, binding) {
      attach(el, strength, binding.value)
    },
    updated(el, binding) {
      if (binding.value === binding.oldValue) return
      const slot = controllers.get(el)?.[strength]
      if (slot) slot.role.value = binding.value
    },
    unmounted(el) {
      detach(el, strength)
    },
  }
}

// v-cursor="role" - a one-element CursorContext: resolves `role` against the nearest ancestor
// context's scheme, falling back to the registered root context, then windows-default.
const cursorDirective = makeCursorDirective('strong')

// v-cursor-weak - same, but yields to a strong v-cursor on the same element. Reusable kit components
// set their own default cursor with this so a consumer's plain v-cursor overrides it cleanly.
export const cursorWeakDirective = makeCursorDirective('weak')

export default cursorDirective
