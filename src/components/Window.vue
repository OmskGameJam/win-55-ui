<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CSSProperties } from 'vue'
import Titlebar, { type TitlebarProps } from './Titlebar.vue'
import Box from './Box.vue'
import cursorDirective from '../directives/cursor'
import type { CursorRole } from '../helpers/cursorContext'
import type { BoxOverflow } from '../helpers/scroll'

const vCursor = cursorDirective

const props = withDefaults(defineProps<TitlebarProps & {
  extraStyles?: CSSProperties
  extraClass?: string
  minWidth?: number
  minHeight?: number
  resizable?: boolean
  resizableHorizontally?: boolean
  resizableVertically?: boolean

  // Faux mode
  faux?: boolean

  // Body overflow, forwarded to the inner Box
  overflow?: BoxOverflow
  overflowX?: BoxOverflow
  overflowY?: BoxOverflow
  forgiveVerticalOverflow?: boolean
}>(), {
  minWidth: 240,
  minHeight: 40,
})

const x = defineModel<number>('x', { default: 100 })
const y = defineModel<number>('y', { default: 100 })
const width = defineModel<number>('width', { default: 320 })
const height = defineModel<number>('height', { default: 220 })

const edge = 6

// Minima are declared sizes: snap up so a clamped window is still on the grid.
const minWidthEven = Math.ceil(props.minWidth / 2) * 2
const minHeightEven = Math.ceil(props.minHeight / 2) * 2

const allowHorizontal = computed(() => (props.resizable ?? false) || (props.resizableHorizontally ?? false))
const allowVertical = computed(() => (props.resizable ?? false) || (props.resizableVertically ?? false))

let dragging = false
let resizing = false
// which edge/corner the pointer is over ('' | n | s | e | w | ne | nw | se | sw)
const resizeDir = ref('')
let activeResizeDir = ''

// edge/corner -> diagonal-aware resize role, resolved by v-cursor
const RESIZE_ROLE: Record<string, CursorRole> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
}
const resizeRole = computed<CursorRole>(() => RESIZE_ROLE[resizeDir.value] ?? '')

let startX = 0
let startY = 0
let startW = 0
let startH = 0
let startLeft = 0
let startTop = 0

// Pointer deltas are fractional; every window edge lands on the 2px visual grid.
const even = (value: number) => Math.round(value / 2) * 2

function startDrag(e: MouseEvent) {
  if (props.faux) return
  if (resizeDir.value) return

  const target = e.target as HTMLElement
  if (target.closest('.titlebar-image') || target.closest('.titlebar-buttons')) return

  dragging = true

  startX = e.clientX
  startY = e.clientY
  startLeft = x.value
  startTop = y.value

  document.body.style.userSelect = 'none'

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopAll)
}

function startResize(e: MouseEvent) {
  if (props.faux) return
  if (!resizeDir.value) return
  if (!allowHorizontal.value && !allowVertical.value) return

  resizing = true
  activeResizeDir = resizeDir.value

  startX = e.clientX
  startY = e.clientY
  startW = width.value
  startH = height.value
  startLeft = x.value
  startTop = y.value

  document.body.style.userSelect = 'none'

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopAll)
}

function onMove(e: MouseEvent) {
  if (props.faux) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (dragging) {
    x.value = even(startLeft + dx)
    y.value = even(startTop + dy)
  }

  if (resizing) {
    const dir = activeResizeDir

    // Snap the boundary pair and derive the size from it: the fixed west/north edge must not
    // drift by a pixel just because the opposite edge rounded.
    let left = even(startLeft)
    let top = even(startTop)
    let right = even(startLeft + startW)
    let bottom = even(startTop + startH)

    if (allowHorizontal.value && dir.includes('e')) {
      right = Math.max(left + minWidthEven, even(startLeft + startW + dx))
    }

    if (allowVertical.value && dir.includes('s')) {
      bottom = Math.max(top + minHeightEven, even(startTop + startH + dy))
    }

    if (allowHorizontal.value && dir.includes('w')) {
      left = Math.min(right - minWidthEven, even(startLeft + dx))
    }

    if (allowVertical.value && dir.includes('n')) {
      top = Math.min(bottom - minHeightEven, even(startTop + dy))
    }

    x.value = left
    y.value = top
    width.value = right - left
    height.value = bottom - top
  }
}

function stopAll() {
  dragging = false
  resizing = false
  activeResizeDir = ''
  resizeDir.value = ''

  document.body.style.userSelect = ''

  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopAll)
}

function detectEdge(e: MouseEvent) {
  if (props.faux) {
    resizeDir.value = ''
    return
  }

  if (resizing) return

  if (!allowHorizontal.value && !allowVertical.value) {
    resizeDir.value = ''
    return
  }

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()

  const left = e.clientX - rect.left
  const right = rect.right - e.clientX
  const top = e.clientY - rect.top
  const bottom = rect.bottom - e.clientY

  let dir = ''

  if (allowVertical.value) {
    if (top < edge) dir += 'n'
    else if (bottom < edge) dir += 's'
  }

  if (allowHorizontal.value) {
    if (left < edge) dir += 'w'
    else if (right < edge) dir += 'e'
  }

  resizeDir.value = dir
}
</script>

<template>
  <Box
    :extra-class="extraClass"
    :extra-styles="props.faux
      ? extraStyles
      : {
          position: 'absolute',
          left: x + 'px',
          top: y + 'px',
          width: width + 'px',
          height: height + 'px',
          ...extraStyles
        }"
    type="panel-d-2"
    v-cursor="resizeRole"
    @mousemove="detectEdge"
    @mousedown="startResize"
  >
    <!-- Window container -->
    <div
      class="window-container"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }"
    >
      <!-- Titlebar -->
      <div class="titlebar-wrapper" @mousedown.stop="startDrag" :style="{ height: '34px' }">
        <Titlebar
          :title="title"
          :icon="icon"
          :show-placeholder-buttons="showPlaceholderButtons"
          :gradient-color-a="faux ? '#888888' : gradientColorA"
          :gradient-color-b="faux ? '#555555' : gradientColorB"
        >
          <template #buttons>
            <slot name="titlebar-buttons"></slot>
          </template>
        </Titlebar>
      </div>
      
      <!-- Body: Box supplies the custom scrollbars -->
      <Box
        type="none"
        :overflow-x="props.overflowX ?? props.overflow ?? 'auto'"
        :overflow-y="props.overflowY ?? props.overflow ?? 'auto'"
        :forgive-vertical-overflow="props.forgiveVerticalOverflow"
        :extra-styles="{
          flex: '1',
          minHeight: '0',
          marginTop: '4px'
        }"
      >
        <slot></slot>
      </Box>
    </div>
  </Box>
</template>