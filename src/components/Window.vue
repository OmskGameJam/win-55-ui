<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import Titlebar from './Titlebar.vue'
import Box from './Box.vue'

// Define props for overflow control
const props = defineProps<{
  extraStyles?: CSSProperties
  extraClass?: string
  minWidth?: number
  minHeight?: number
  resizable?: boolean
  resizableHorizontally?: boolean
  resizableVertically?: boolean
  
  // Titlebar passthrough props
  title: string
  icon?: string
  placeholderButtons?: boolean
  disabled?: boolean
  gradientColorA?: string
  gradientColorB?: string

  // New faux mode
  faux?: boolean
  
  // Overflow control for inner container
  overflowX?: 'auto' | 'hidden' | 'scroll' | 'visible'
  overflowY?: 'auto' | 'hidden' | 'scroll' | 'visible'
}>()

// v-model bindings
const x = defineModel<number>('x', { default: 100 })
const y = defineModel<number>('y', { default: 100 })
const width = defineModel<number>('width', { default: 320 })
const height = defineModel<number>('height', { default: 220 })

const edge = 6

const minWidth = props.minWidth ?? 240
const minHeight = props.minHeight ?? 40

const allowHorizontal = computed(() => (props.resizable ?? false) || (props.resizableHorizontally ?? false))
const allowVertical = computed(() => (props.resizable ?? false) || (props.resizableVertically ?? false))

let dragging = false
let resizing = false
let resizeDir = ''
let activeResizeDir = ''

let startX = 0
let startY = 0
let startW = 0
let startH = 0
let startLeft = 0
let startTop = 0

// --- Dragging and Resizing ---
function startDrag(e: MouseEvent) {
  if (props.faux) return
  if (resizeDir) return

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
  if (!resizeDir) return
  if (!allowHorizontal.value && !allowVertical.value) return

  resizing = true
  activeResizeDir = resizeDir

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
    x.value = startLeft + dx
    y.value = startTop + dy
  }

  if (resizing) {
    const dir = activeResizeDir

    if (allowHorizontal.value && dir.includes('e')) {
      width.value = Math.max(minWidth, startW + dx)
    }

    if (allowVertical.value && dir.includes('s')) {
      height.value = Math.max(minHeight, startH + dy)
    }

    if (allowHorizontal.value && dir.includes('w')) {
      const newWidth = startW - dx
      const clamped = Math.max(minWidth, newWidth)
      width.value = clamped
      x.value = startLeft + (startW - clamped)
    }

    if (allowVertical.value && dir.includes('n')) {
      const newHeight = startH - dy
      const clamped = Math.max(minHeight, newHeight)
      height.value = clamped
      y.value = startTop + (startH - clamped)
    }
  }
}

function stopAll() {
  dragging = false
  resizing = false
  activeResizeDir = ''

  document.body.style.userSelect = ''

  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopAll)
}

function detectEdge(e: MouseEvent) {
  if (props.faux) {
    resizeDir = ''
    return
  }

  if (resizing) return

  if (!allowHorizontal.value && !allowVertical.value) {
    resizeDir = ''
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

  resizeDir = dir
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
    @mousemove="detectEdge"
    @mousedown="startResize"
  >
    <!-- Window container with flex layout -->
    <div
      class="window-container"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }"
    >
      <!-- Titlebar with fixed height -->
      <div class="titlebar-wrapper" @mousedown.stop="startDrag" :style="{ height: '34px' }">
        <Titlebar
          :title="title"
          :icon="icon"
          :placeholder-buttons="placeholderButtons"
          :disabled="disabled"
          :gradient-color-a="faux ? '#888888' : gradientColorA"
          :gradient-color-b="faux ? '#555555' : gradientColorB"
        >
          <template #buttons>
            <slot name="titlebar-buttons"></slot>
          </template>
        </Titlebar>
      </div>
      
      <!-- Inner container that fills remaining space with 2px gutter -->
      <div 
        class="inner-container"
        :style="{
          flex: '1',
          overflowX: props.overflowX ?? 'auto',
          overflowY: props.overflowY ?? 'auto',
          marginTop: '4px',
          boxSizing: 'border-box'
        }"
      >
        <slot></slot>
      </div>
    </div>
  </Box>
</template>