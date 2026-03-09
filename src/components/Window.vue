<script setup lang="ts">
import { ref } from 'vue'
import type { CSSProperties } from 'vue'
import Titlebar from './Titlebar.vue'
import Box from './Box.vue'

const props = defineProps<{
  extraStyles?: CSSProperties
  extraClass?: string
  minWidth?: number
  minHeight?: number
  resizable?: boolean
  resizableHorizontally?: boolean
  resizableVertically?: boolean
}>()

// v-model bindings
const x = defineModel<number>('x', { default: 100 })
const y = defineModel<number>('y', { default: 100 })
const width = defineModel<number>('width', { default: 320 })
const height = defineModel<number>('height', { default: 220 })

const edge = 6

const minWidth = props.minWidth ?? 240
const minHeight = props.minHeight ?? 40

// resolve resize permissions
const allowHorizontal =
  props.resizable ?? props.resizableHorizontally ?? false

const allowVertical =
  props.resizable ?? props.resizableVertically ?? false

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

const cursor = ref('default')

function startDrag(e: MouseEvent) {
  if (resizeDir) return
  dragging = true

  startX = e.clientX
  startY = e.clientY
  startLeft = x.value
  startTop = y.value

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopAll)
}

function startResize(e: MouseEvent) {
  if (!resizeDir) return
  if (!allowHorizontal && !allowVertical) return

  resizing = true
  activeResizeDir = resizeDir

  startX = e.clientX
  startY = e.clientY
  startW = width.value
  startH = height.value
  startLeft = x.value
  startTop = y.value

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', stopAll)
}

function onMove(e: MouseEvent) {
  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (dragging) {
    x.value = startLeft + dx
    y.value = startTop + dy
  }

  if (resizing) {
    const dir = activeResizeDir

    if (allowHorizontal && dir.includes('e')) {
      width.value = Math.max(minWidth, startW + dx)
    }

    if (allowVertical && dir.includes('s')) {
      height.value = Math.max(minHeight, startH + dy)
    }

    if (allowHorizontal && dir.includes('w')) {
      const newWidth = startW - dx
      const clamped = Math.max(minWidth, newWidth)
      width.value = clamped
      x.value = startLeft + (startW - clamped)
    }

    if (allowVertical && dir.includes('n')) {
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

  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', stopAll)
}

function detectEdge(e: MouseEvent) {
  if (resizing) return
  if (!allowHorizontal && !allowVertical) {
    resizeDir = ''
    cursor.value = 'default'
    return
  }

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()

  const left = e.clientX - rect.left
  const right = rect.right - e.clientX
  const top = e.clientY - rect.top
  const bottom = rect.bottom - e.clientY

  let dir = ''

  if (allowVertical) {
    if (top < edge) dir += 'n'
    else if (bottom < edge) dir += 's'
  }

  if (allowHorizontal) {
    if (left < edge) dir += 'w'
    else if (right < edge) dir += 'e'
  }

  resizeDir = dir

  const map: Record<string, string> = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize'
  }

  cursor.value = map[dir] ?? 'default'
}
</script>

<template>
  <Box
    :extra-styles="{
      position: 'absolute',
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: height + 'px',
      cursor,
      ...extraStyles
    }"
    type="panel-d-2"
    @mousemove="detectEdge"
    @mousedown="startResize"
  >
    <div @mousedown.stop="startDrag">
      <Titlebar title="Oleg" icon="/win-55-ui/icons/program.png" />
    </div>
    <slot></slot>
  </Box>
</template>