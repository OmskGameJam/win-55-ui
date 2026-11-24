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
  // Wipe first so a mode switch or strong/weak handover leaves no stale props.
  clear(el)
  if (!role) return

  if (native) {
    const roleCss = context ? context.resolveRoleCss(role) : cursorCssFor('windows-default', role)
    if (!roleCss) return
    // Append the ambient default chain so an undecoded sprite never flashes the OS cursor.
    const fallback = context ? context.nativeBaseCss.value : themedCursorCssFor('windows-default', 'default')
    const value = withCssFallback(roleCss, fallback ?? 'default')
    // Inline `!important` beats UA rules; the native props override inherited derivation.
    el.style.setProperty('cursor', value, 'important')
    for (const p of NATIVE_CURSOR_PROPS) el.style.setProperty(p, value)
    return
  }

  const cursorId = context ? context.resolveRole(role) : cursorIdFor('windows-default', role)
  if (!cursorId) return

  // Keep `cursor: none`; the id rides the token for the overlay to draw.
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
  // bumped when a slot is added/removed so the effect re-picks the active slot
  rev: Ref<number>
  stop?: WatchStopHandle
}

// One controller per element: strong wins over weak, so a component's weak default
// can be overridden by a consumer's strong v-cursor. Two of the same strength throw.
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

  // Defer: an ancestor CursorContext marks its element in a later onMounted.
  void nextTick(() => {
    const current = controllers.get(el)
    if (!current || current[strength] !== slot) return
    // DOM walk, not inject(), which would pick the slot author's instance.
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

// v-cursor="role" - resolves against the nearest context, root context, then windows-default.
const cursorDirective = makeCursorDirective('strong')

// v-cursor-weak yields to a strong v-cursor on the same element.
export const cursorWeakDirective = makeCursorDirective('weak')

export default cursorDirective
