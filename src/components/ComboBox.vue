<script setup lang="ts" generic="T">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import RichInput from './RichInput.vue'
import Button from './Button.vue'
import Box from './Box.vue'
import type { BoxType } from './Box.vue'
import { COMBO_LIST_SLIDE_MS, type ComboBoxItem } from '../helpers/comboBox'

// Initial size before the field is measured: 24px text line + two 6px bevels.
const FIELD_HEIGHT = 36
const BEVEL = 6
const ICON_SIZE = 14

// List metrics: one text line per row plus the 2px appearance border.
const LIST_ROW_HEIGHT = 24
const LIST_BORDER = 2
const LIST_PREFERRED_LINES = 5
const LIST_BAIL_RESERVE = 3
// Stop the slide just before the near border fully clears the clip, so the
// seam-side bevel stays tucked under the field.
const LIST_END_OFFSET = 2

const ICON_SRC = '/win-55-ui/mini-buttons/down-lg.png'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  boxType?: BoxType
  /** Styles for the whole field/button row; the inner field is managed by the component. */
  extraStyles?: CSSProperties
  multiline?: boolean
  wrap?: boolean
  showEmojiButton?: boolean
  /**
   * Either rich rows (`{ key, data }`, select emits the row object) or plain
   * strings (`select` emits the string). With plain strings and no `select`
   * listener, choosing a row updates `modelValue`.
   */
  data?: readonly ComboBoxItem<T>[] | readonly string[]
}>(), {
  placeholder: '',
  disabled: false,
  maxLength: undefined,
  boxType: 'textarea',
  extraStyles: undefined,
  multiline: false,
  wrap: true,
  showEmojiButton: false,
  data: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [selection: ComboBoxItem<T> | string]
  toggle: []
}>()

const instance = getCurrentInstance()
const hasSelectListener = () => Boolean(instance?.vnode.props?.onSelect)

type ListPosition =
  | { side: 'down'; top: number; left: number; width: number; height: number }
  | { side: 'up'; bottom: number; left: number; width: number; height: number }

// Exact centering often lands on an odd pixel; bias to the upper-left cell of
// the 2x2 center block so the icon stays on the grid.
const evenDown = (value: number) => Math.floor(value / 2) * 2
const evenUp = (value: number) => Math.ceil(value / 2) * 2

// The initial containing block for the teleported list excludes a classic
// horizontal scrollbar, unlike window.innerHeight.
const viewportHeight = () => document.documentElement.clientHeight

// The field grows on its own (an emoji raises the line box); the button follows
// whatever height the field reports and stays square.
const fieldRef = ref<HTMLDivElement | null>(null)
const fieldHeight = ref(FIELD_HEIGHT)
let fieldObserver: ResizeObserver | null = null

const measureField = () => {
  const height = fieldRef.value?.getBoundingClientRect().height
  if (height) fieldHeight.value = evenUp(height)
  refreshListPosition()
}

const rootRef = ref<HTMLDivElement | null>(null)
const listRef = ref<HTMLDivElement | null>(null)
const open = ref(false)
const listPosition = ref<ListPosition | null>(null)
const listSettled = ref(false)
let settleTimer: ReturnType<typeof setTimeout> | null = null
let disposeTimer: ReturnType<typeof setTimeout> | null = null

const dataItems = computed<readonly (string | ComboBoxItem<T>)[]>(() => props.data ?? [])
const entries = computed(() =>
  dataItems.value.map((item) => (typeof item === 'string' ? item : item.key)))
const listContentHeight = computed(() => entries.value.length * LIST_ROW_HEIGHT + LIST_BORDER * 2)

const listHeightForLines = (lines: number) => lines * LIST_ROW_HEIGHT + LIST_BORDER * 2

const choosePlacement = (
  spaceDown: number,
  spaceUp: number,
  contentHeight: number,
): Pick<ListPosition, 'side' | 'height'> => {
  if (contentHeight <= spaceDown) return { side: 'down', height: contentHeight }
  if (listHeightForLines(LIST_PREFERRED_LINES) <= spaceDown) {
    return { side: 'down', height: listHeightForLines(LIST_PREFERRED_LINES) }
  }
  if (contentHeight <= spaceUp) return { side: 'up', height: contentHeight }
  if (listHeightForLines(LIST_PREFERRED_LINES) <= spaceUp) {
    return { side: 'up', height: listHeightForLines(LIST_PREFERRED_LINES) }
  }

  const side = spaceDown >= spaceUp ? 'down' : 'up'
  const space = Math.max(spaceDown, spaceUp)
  const availableLines = Math.floor((space - LIST_BORDER * 2) / LIST_ROW_HEIGHT)
  const computedLines = availableLines - LIST_BAIL_RESERVE

  // Under 5 computed lines there is no reserve worth keeping; stretch to the
  // viewport edge instead. The +2 accounts for the clipped seam-side border.
  const height = computedLines < LIST_PREFERRED_LINES
    ? Math.max(0, evenDown(space + LIST_END_OFFSET))
    : listHeightForLines(computedLines)

  return { side, height: Math.min(contentHeight, height) }
}

const calculateListPosition = (): ListPosition | null => {
  const field = fieldRef.value
  const root = rootRef.value
  if (!field || !root) return null

  const rect = field.getBoundingClientRect()
  const rowRect = root.getBoundingClientRect()
  const { side, height } = choosePlacement(
    viewportHeight() - rect.bottom,
    rect.top,
    listContentHeight.value,
  )

  const anchorTop = rect.top + window.scrollY
  const anchorBottom = rect.bottom + window.scrollY
  const base = {
    // The list spans the whole row, including the drop button.
    left: rowRect.left + window.scrollX,
    width: evenDown(rowRect.width),
    height,
  }

  // Down pins its top edge; up pins its bottom edge from the initial
  // containing block, so an animated height grows out from the field.
  return side === 'down'
    ? { side, top: anchorBottom, ...base }
    : { side, bottom: viewportHeight() - anchorTop, ...base }
}

const refreshListPosition = () => {
  if (open.value) listPosition.value = calculateListPosition()
}

const clearDisposeTimer = () => {
  if (disposeTimer !== null) {
    clearTimeout(disposeTimer)
    disposeTimer = null
  }
}

const clearSettleTimer = () => {
  if (settleTimer !== null) {
    clearTimeout(settleTimer)
    settleTimer = null
  }
}

// Vue's transition cleanup can miss in a throttled tab; drop the clip on a
// timer as a hard guarantee that nothing partial stays painted.
const handleAfterLeave = () => {
  if (open.value) return
  clearDisposeTimer()
  listPosition.value = null
}

const closeList = () => {
  clearSettleTimer()
  listSettled.value = false
  open.value = false
  clearDisposeTimer()
  disposeTimer = setTimeout(() => {
    if (!open.value) listPosition.value = null
  }, COMBO_LIST_SLIDE_MS + 32)
}

const openList = () => {
  if (props.disabled || entries.value.length === 0) return
  clearDisposeTimer()
  clearSettleTimer()
  listSettled.value = false
  listPosition.value = calculateListPosition()
  open.value = true
  // If the tab is throttled the enter classes can stay stuck mid-slide;
  // force the final offset once the animation should be over.
  settleTimer = setTimeout(() => {
    settleTimer = null
    listSettled.value = true
  }, COMBO_LIST_SLIDE_MS + 16)
}

const toggleList = () => {
  if (open.value) closeList()
  else openList()

  emit('toggle')
}

const selectEntry = (index: number) => {
  const item = dataItems.value[index]
  if (item === undefined) return

  if (typeof item === 'string') {
    emit('select', item)
    if (!hasSelectListener()) emit('update:modelValue', item)
  } else {
    emit('select', item)
  }

  closeList()
}

const handleDocumentClick = (e: MouseEvent) => {
  if (!open.value) return

  const target = e.target as Node
  if (rootRef.value?.contains(target) || listRef.value?.contains(target)) return

  closeList()
}

const handleViewportChange = () => refreshListPosition()

onMounted(() => {
  if (fieldRef.value) {
    fieldObserver = new ResizeObserver(measureField)
    fieldObserver.observe(fieldRef.value)
    measureField()
  }

  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  fieldObserver?.disconnect()
  fieldObserver = null
  clearDisposeTimer()
  clearSettleTimer()
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange)
  document.removeEventListener('click', handleDocumentClick)
})

watch(entries, () => {
  if (entries.value.length === 0) closeList()
  else refreshListPosition()
})
watch(() => props.disabled, (disabled) => {
  if (disabled) closeList()
})

const rootStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  ...props.extraStyles,
}))

const buttonStyles = computed(() => ({
  width: `${fieldHeight.value}px`,
  height: `${fieldHeight.value}px`,
  paddingBottom: 0,
  paddingRight: 0,
}))

const buttonContentStyles = {
  position: 'relative',
  width: '100%',
  height: '100%',
} as const

const iconStyles = computed<CSSProperties>(() => {
  const contentSize = fieldHeight.value - BEVEL * 2
  const offset = evenDown((contentSize - ICON_SIZE) / 2)

  return {
    position: 'absolute',
    left: `${offset}px`,
    top: `${offset}px`,
    width: `${ICON_SIZE}px`,
    height: `${ICON_SIZE}px`,
    display: 'block',
    imageRendering: 'pixelated',
  }
})

const listStyles = computed<CSSProperties>(() => {
  const position = listPosition.value
  if (!position) return {}

  // Start tucked behind the field with only the far 6px border peeking out,
  // and stop 2px short so the seam-side border stays clipped.
  const start = position.height - LIST_BORDER
  const startShift = position.side === 'down' ? -start : start
  const endShift = position.side === 'down' ? -LIST_END_OFFSET : LIST_END_OFFSET

  return {
    position: 'absolute',
    left: `${position.left}px`,
    width: `${position.width}px`,
    height: `${position.height}px`,
    ...(position.side === 'down'
      ? { top: `${position.top}px` }
      : { bottom: `${position.bottom}px` }),
    '--combo-list-slide': `${COMBO_LIST_SLIDE_MS}ms`,
    '--combo-list-start': `${startShift}px`,
    '--combo-list-end': `${endShift}px`,
  } as CSSProperties
})

const listBoxStyles = computed<CSSProperties>(() => {
  const position = listPosition.value
  if (!position) return { height: '0px' }

  // The Box is full height and rides the transform; the clip is static, so
  // rows move with the animation instead of being revealed in place.
  return {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: `${position.height}px`,
    border: `2px solid black`,
    background: 'white',
    ...(position.side === 'down' ? { top: 0 } : { bottom: 0 }),
  }
})
</script>

<template>
  <div ref="rootRef" class="combo-box" :style="rootStyles" @keydown.esc="closeList">
    <div ref="fieldRef" class="combo-box-field">
      <RichInput
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :max-length="maxLength"
        :box-type="boxType"
        :multiline="multiline"
        :wrap="wrap"
        :show-emoji-button="showEmojiButton"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <Button
      :extra-styles="buttonStyles"
      :content-styles="buttonContentStyles"
      :disabled="disabled"
      aria-label="Open options"
      @click="toggleList"
    >
      <img :src="ICON_SRC" alt="" draggable="false" :style="iconStyles" />
    </Button>
  </div>

  <Teleport to="body">
    <div
      v-if="listPosition"
      ref="listRef"
      class="combo-list"
      :data-side="listPosition.side"
      :style="listStyles"
    >
      <Transition
        name="combo-list"
        appear
        :duration="COMBO_LIST_SLIDE_MS"
        @after-leave="handleAfterLeave"
      >
        <Box
          v-if="open"
          type="none"
          overflow="auto"
          :extra-styles="listBoxStyles"
          :extra-class="listSettled ? 'combo-list-settled' : undefined"
        >
          <div class="combo-list-rows" role="listbox">
            <div
              v-for="(label, index) in entries"
              :key="index"
              class="combo-list-row"
              role="option"
              @click="selectEntry(index)"
            >
              {{ label }}
            </div>
          </div>
        </Box>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.combo-box-field {
  flex: 1 1 0%;
  min-width: 0;
}

.combo-list {
  z-index: 1000;
  overflow: hidden;
  pointer-events: none;
}

.combo-list > * {
  pointer-events: auto;
  transform: translateY(var(--combo-list-end));
}

.combo-list-enter-active,
.combo-list-leave-active {
  transition: transform var(--combo-list-slide) linear;
}

.combo-list-enter-from,
.combo-list-leave-to {
  transform: translateY(var(--combo-list-start));
}

.combo-list-settled:not(.combo-list-leave-active) {
  transform: translateY(var(--combo-list-end)) !important;
  transition: none !important;
}

.combo-list-rows {
  user-select: none;
}

.combo-list-row {
  height: 24px;
  line-height: 24px;
  padding: 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.combo-list-row:hover {
  background-color: var(--win55-cga-blue);
  color: var(--win55-cga-white);
}
</style>
