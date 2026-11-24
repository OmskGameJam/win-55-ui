<script setup lang="ts" generic="T">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import RichInput from './RichInput.vue'
import Button from './Button.vue'
import Box from './Box.vue'
import type { BoxType } from './Box.vue'
import { COMBO_LIST_SLIDE_MS, type ComboBoxItem } from '../helpers/comboBox'

const ICON_SIZE = 14

const LIST_ROW_HEIGHT = 24
const LIST_BORDER = 2
const LIST_PREFERRED_HEIGHT = 5 * LIST_ROW_HEIGHT + LIST_BORDER * 2
// Stop the slide before the seam-side border clears the clip.
const LIST_END_OFFSET = 2

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  boxType?: BoxType
  /** Styles for the whole field/button row; the inner field is managed by the component. */
  extraStyles?: CSSProperties
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
  showEmojiButton: false,
  data: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  select: [selection: ComboBoxItem<T> | string]
}>()

const instance = getCurrentInstance()
// getCurrentInstance() is null outside setup, so capture it for click-time reads.
const hasSelectListener = () => Boolean(instance?.vnode.props?.onSelect)

interface ListEntry<T> {
  label: string
  item: string | ComboBoxItem<T>
}

interface ListPlacement {
  side: 'down' | 'up'
  height: number
}

type ListPosition = {
  left: number
  width: number
  height: number
} & (
  | { side: 'down'; top: number }
  | { side: 'up'; bottom: number }
)

// Exact centering often lands on an odd pixel; bias to the upper-left cell of
// the 2x2 center block so the icon stays on the grid.
const evenDown = (value: number) => Math.floor(value / 2) * 2
const evenUp = (value: number) => Math.ceil(value / 2) * 2
// The initial containing block excludes a classic horizontal scrollbar,
// unlike window.innerHeight.
const viewportHeight = () => document.documentElement.clientHeight

const fieldRef = ref<HTMLDivElement | null>(null)
// 24px text line + two 6px bevels.
const fieldHeight = ref(36)
const rootRef = ref<HTMLDivElement | null>(null)
const listRef = ref<HTMLDivElement | null>(null)
const open = ref(false)
const listPosition = ref<ListPosition | null>(null)
let fieldObserver: ResizeObserver | null = null
let disposeTimer: ReturnType<typeof setTimeout> | null = null

const entries = computed<ListEntry<T>[]>(() =>
  (props.data ?? []).map((item) => ({
    label: typeof item === 'string' ? item : item.key,
    item,
  })))
const listContentHeight = computed(() => entries.value.length * LIST_ROW_HEIGHT + LIST_BORDER * 2)

const choosePlacement = (
  spaceDown: number,
  spaceUp: number,
  contentHeight: number,
): ListPlacement => {
  if (contentHeight <= spaceDown) return { side: 'down', height: contentHeight }
  if (LIST_PREFERRED_HEIGHT <= spaceDown) return { side: 'down', height: LIST_PREFERRED_HEIGHT }
  if (contentHeight <= spaceUp) return { side: 'up', height: contentHeight }
  if (LIST_PREFERRED_HEIGHT <= spaceUp) return { side: 'up', height: LIST_PREFERRED_HEIGHT }

  const side = spaceDown >= spaceUp ? 'down' : 'up'
  const space = Math.max(spaceDown, spaceUp)
  // Reaching here means 5 lines did not fit on either side; fill the roomier
  // side all the way to the viewport edge.
  return { side, height: Math.min(contentHeight, Math.max(0, evenDown(space + LIST_END_OFFSET))) }
}

const calculateListPosition = (): ListPosition | null => {
  const field = fieldRef.value
  const root = rootRef.value
  if (!field || !root) return null

  const rect = field.getBoundingClientRect()
  const row = root.getBoundingClientRect()
  const { side, height } = choosePlacement(
    viewportHeight() - rect.bottom,
    rect.top,
    listContentHeight.value,
  )
  const base = {
    // The list spans the whole row, including the drop button.
    left: row.left + window.scrollX,
    width: evenDown(row.width),
    height,
  }

  return side === 'down'
    ? { side, top: rect.bottom + window.scrollY, ...base }
    : { side, bottom: viewportHeight() - rect.top - window.scrollY, ...base }
}

const refreshListPosition = () => {
  if (open.value) listPosition.value = calculateListPosition()
}

const measureField = () => {
  const height = fieldRef.value?.getBoundingClientRect().height
  if (height) fieldHeight.value = evenUp(height)
  refreshListPosition()
}

const clearDisposeTimer = () => {
  if (disposeTimer !== null) {
    clearTimeout(disposeTimer)
    disposeTimer = null
  }
}

const handleAfterLeave = () => {
  if (open.value) return
  clearDisposeTimer()
  listPosition.value = null
}

const closeList = () => {
  open.value = false
  clearDisposeTimer()
  // Hard-stop in case the leave transition never reports completion.
  disposeTimer = setTimeout(() => {
    if (!open.value) listPosition.value = null
  }, COMBO_LIST_SLIDE_MS + 32)
}

const openList = () => {
  if (props.disabled || entries.value.length === 0) return
  clearDisposeTimer()
  listPosition.value = calculateListPosition()
  open.value = true
}

const toggleList = () => {
  if (open.value) closeList()
  else openList()
}

const selectEntry = (entry: ListEntry<T>) => {
  if (typeof entry.item === 'string') {
    emit('select', entry.item)
    if (!hasSelectListener()) emit('update:modelValue', entry.item)
  } else {
    emit('select', entry.item)
  }

  closeList()
}

const handleDocumentClick = (e: MouseEvent) => {
  if (!open.value) return

  const target = e.target as Node
  if (rootRef.value?.contains(target) || listRef.value?.contains(target)) return

  closeList()
}

onMounted(() => {
  if (fieldRef.value) {
    fieldObserver = new ResizeObserver(measureField)
    fieldObserver.observe(fieldRef.value)
    measureField()
  }

  window.addEventListener('resize', refreshListPosition)
  window.addEventListener('scroll', refreshListPosition)
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  fieldObserver?.disconnect()
  fieldObserver = null
  clearDisposeTimer()
  window.removeEventListener('resize', refreshListPosition)
  window.removeEventListener('scroll', refreshListPosition)
  document.removeEventListener('click', handleDocumentClick)
})

watch(entries, () => {
  if (entries.value.length === 0) closeList()
  else refreshListPosition()
})
watch(() => props.disabled, (disabled) => {
  if (disabled) closeList()
})

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
  const contentSize = fieldHeight.value - 6 * 2
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

  // Start tucked behind the field with only the far border peeking out, and
  // stop 2px short so the seam-side border stays clipped.
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
    '--combo-list-border': `${LIST_BORDER}px`,
  } as CSSProperties
})
</script>

<template>
  <div ref="rootRef" class="combo-box" :style="extraStyles" @keydown.esc="closeList">
    <div ref="fieldRef" class="combo-box-field">
      <RichInput
        :model-value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :max-length="maxLength"
        :box-type="boxType"
        :show-emoji-button="showEmojiButton"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
    <Button
      :extra-styles="buttonStyles"
      :content-styles="buttonContentStyles"
      :disabled="disabled"
      aria-label="Toggle options"
      @click="toggleList"
    >
      <img src="/win-55-ui/mini-buttons/down-lg.png" alt="" draggable="false" :style="iconStyles" />
    </Button>
  </div>

  <Teleport to="body">
    <div v-if="listPosition" ref="listRef" class="combo-list" :data-side="listPosition.side" :style="listStyles">
      <Transition
        name="combo-list"
        appear
        :duration="COMBO_LIST_SLIDE_MS"
        @after-leave="handleAfterLeave"
      >
        <Box v-if="open" type="none" overflow="auto">
          <div class="combo-list-rows" role="listbox">
            <div
              v-for="(entry, index) in entries"
              :key="index"
              class="combo-list-row"
              role="option"
              @click="selectEntry(entry)"
            >
              {{ entry.label }}
            </div>
          </div>
        </Box>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.combo-box {
  display: flex;
  align-items: flex-start;
}

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
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  transform: translateY(var(--combo-list-end));
  border: var(--combo-list-border) solid black;
  background: white;
}

.combo-list[data-side='down'] > * {
  top: 0;
}

.combo-list[data-side='up'] > * {
  bottom: 0;
}

.combo-list-enter-active {
  animation: combo-list-enter var(--combo-list-slide) linear both;
}

.combo-list-leave-active {
  animation: combo-list-leave var(--combo-list-slide) linear both;
}

@keyframes combo-list-enter {
  from {
    transform: translateY(var(--combo-list-start));
  }
  to {
    transform: translateY(var(--combo-list-end));
  }
}

@keyframes combo-list-leave {
  from {
    transform: translateY(var(--combo-list-end));
  }
  to {
    transform: translateY(var(--combo-list-start));
  }
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
