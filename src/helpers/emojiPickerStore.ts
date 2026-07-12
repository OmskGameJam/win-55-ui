import { ref, shallowRef } from 'vue'

export interface EmojiInsertTarget {
  insertEmoji(emoji: string): void
}

export interface PickerPosition {
  x: number
  y: number
  width: number
  height: number
}

/*
 * Module-level singleton: a single floating emoji picker Window is shared by
 * the whole app. Position/size live here (not in EmojiPickerWindow's own
 * state) so they survive across close/reopen for the lifetime of the page.
 */
export const pickerOpen = ref(false)
export const pickerPosition = ref<PickerPosition>({ x: 160, y: 120, width: 360, height: 420 })
/* shallowRef, not ref: a plain ref deep-wraps any object assigned to it in a
   reactive Proxy, which would make `activeTarget.value === someTarget`
   always false for the raw object identity BaseInput compares against. */
export const activeTarget = shallowRef<EmojiInsertTarget | null>(null)

export function registerActiveInput(target: EmojiInsertTarget): void {
  activeTarget.value = target
}

export function openPicker(): void {
  pickerOpen.value = true
}

export function closePicker(): void {
  pickerOpen.value = false
}

export function insertEmoji(emoji: string): void {
  activeTarget.value?.insertEmoji(emoji)
}

/* Tracked globally (not per-BaseInput-instance) so the trigger button cycles
   through the icon list in order, then repeats, continuing the same
   sequence regardless of which BaseInput most recently rerolled it. */
let nextButtonIconIndex = 0

export function pickNextButtonIcon(codes: string[]): string {
  const choice = codes[nextButtonIconIndex % codes.length]

  nextButtonIconIndex += 1

  return choice
}
