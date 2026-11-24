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

// One picker per app; position/size survive close/reopen.
export const pickerOpen = ref(false)
export const pickerPosition = ref<PickerPosition>({ x: 160, y: 120, width: 360, height: 420 })
/* shallowRef keeps raw object identity for `activeTarget === target` comparisons. */
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

/* Global so the icon cycles in one sequence across every RichInput. */
let nextButtonIconIndex = 0

export function pickNextButtonIcon(codes: string[]): string {
  const choice = codes[nextButtonIconIndex % codes.length]

  nextButtonIconIndex += 1

  return choice
}
