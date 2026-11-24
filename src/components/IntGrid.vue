<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { CELL, areaGrid, masonryGrid, repeatGrid, type IntGridFlow, type IntGridMode, type IntGridRect } from '../helpers/intGrid'

/**
 * Positions direct children in even pixels; owns their position/size and adds no wrapper.
 * `areas` reads both axes, so size it; other modes grow downward. Area names use
 * `data-intgrid-area`.
 */
const props = withDefaults(defineProps<{
  mode?: IntGridMode
  itemWidth?: number
  itemHeight?: number
  columns?: number
  gap?: number
  direction?: 'vertical' | 'horizontal'
  /** Which way items advance; reversed flows anchor to the far edge. */
  flow?: IntGridFlow
  /** Lay out inside the element's own box height instead of sizing to content. */
  fixedHeight?: boolean
  areas?: string
  cols?: string
  rows?: string
  extraClass?: string
  extraStyles?: CSSProperties
}>(), {
  mode: 'fill',
  itemWidth: 64,
  itemHeight: 32,
  columns: 4,
  gap: 2,
  direction: 'vertical',
  flow: 'ltr',
  fixedHeight: false,
})

const root = ref<HTMLDivElement | null>(null)

let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null

const children = () => (root.value ? ([...root.value.children] as HTMLElement[]) : [])

function place(el: HTMLElement, x: number, y: number, w: number, h?: number) {
  const s = el.style
  s.position = 'absolute'
  s.left = `${x}px`
  s.top = `${y}px`
  s.width = `${w}px`
  s.height = h === undefined ? 'auto' : `${h}px`
}

/**
 * Publishes row/col (screen order) and flowRow/flowCol (fill order) on the element,
 * plus custom properties for `calc()`.
 */
function mark(el: HTMLElement, r: IntGridRect) {
  const d = el.dataset
  d.win55Row = `${r.row}`
  d.win55Col = `${r.col}`
  d.win55FlowRow = `${r.flowRow}`
  d.win55FlowCol = `${r.flowCol}`

  const s = el.style
  s.setProperty('--win55-row', `${r.row}`)
  s.setProperty('--win55-col', `${r.col}`)
  s.setProperty('--win55-flow-row', `${r.flowRow}`)
  s.setProperty('--win55-flow-col', `${r.flowCol}`)
}

/** Row/col totals on the root; custom properties inherit to every child. */
function markTotals(el: HTMLElement, rows: number, cols: number) {
  el.dataset.win55Rows = `${rows}`
  el.dataset.win55Cols = `${cols}`
  el.style.setProperty('--win55-rows', `${rows}`)
  el.style.setProperty('--win55-cols', `${cols}`)
}

function layout() {
  const el = root.value
  if (!el) return

  const box = el.getBoundingClientRect()
  // The outer box is the only measurement.
  const width = Math.floor(box.width / CELL) * CELL
  const height = Math.floor(box.height / CELL) * CELL

  if (props.mode === 'areas') {
    if (!props.areas || !props.cols || !props.rows) return
    const out = areaGrid({
      width,
      height,
      areas: props.areas,
      columns: props.cols,
      rows: props.rows,
      gap: props.gap,
    })
    for (const child of children()) {
      const rect = out.rects[child.dataset.intgridArea ?? '']
      if (!rect) continue
      place(child, rect.x, rect.y, rect.w, rect.h)
      mark(child, rect)
    }
    markTotals(el, out.rows, out.cols)
    return
  }

  const items = children()
  if (!items.length) {
    if (!props.fixedHeight) el.style.height = ''
    return
  }

  let rects
  let contentHeight
  let naturalHeight = false
  let totalRows = 0
  let totalCols = 0

  if (props.mode === 'masonry') {
    const vertical = props.direction === 'vertical'
    const size = vertical ? props.itemWidth : props.itemHeight

    // Masonry is the only mode whose items are not uniform, so their cross size
    // has to be read from the DOM. Constrain the fitted axis, leave the other
    // natural, write everything first and then read once.
    for (const item of items) {
      item.style.position = 'absolute'
      item.style.left = '0px'
      item.style.top = '0px'
      item.style.width = vertical ? `${size}px` : 'max-content'
      item.style.height = vertical ? 'auto' : `${size}px`
      ro?.observe(item)
    }

    const sizes = items.map((item) => {
      const r = item.getBoundingClientRect()
      return vertical ? r.height : r.width
    })

    const out = masonryGrid({ width, sizes, itemSize: size, direction: props.direction, gap: props.gap, flow: props.flow, height: props.fixedHeight ? height : undefined })
    rects = out.rects
    contentHeight = out.height
    totalRows = out.rows
    totalCols = out.cols
    naturalHeight = vertical
  } else {
    const out = repeatGrid({
      width,
      count: items.length,
      itemHeight: props.itemHeight,
      itemWidth: props.mode === 'fill' ? props.itemWidth : undefined,
      columns: props.mode === 'columns' ? props.columns : undefined,
      gap: props.gap,
      flow: props.flow,
      height: props.fixedHeight ? height : undefined,
    })
    rects = out.rects
    contentHeight = out.height
    totalRows = out.rows
    totalCols = out.cols
  }

  items.forEach((item, i) => {
    const rect = rects[i]
    if (!rect) return
    place(item, rect.x, rect.y, rect.w, naturalHeight ? undefined : rect.h)
    mark(item, rect)
  })

  markTotals(el, totalRows, totalCols)

  if (!props.fixedHeight) {
    const next = `${contentHeight}px`
    if (el.style.height !== next) el.style.height = next
  }
}

watch(
  () => [props.mode, props.itemWidth, props.itemHeight, props.columns, props.gap, props.direction, props.flow, props.fixedHeight, props.areas, props.cols, props.rows],
  () => layout(),
  { flush: 'post' },
)

onMounted(() => {
  const el = root.value
  if (!el) return

  ro = new ResizeObserver(() => layout())
  ro.observe(el)

  mo = new MutationObserver(() => layout())
  mo.observe(el, { childList: true })

  layout()
})

onUnmounted(() => {
  ro?.disconnect()
  mo?.disconnect()
})

defineExpose({ layout })
</script>

<template>
  <div ref="root" :class="extraClass" :style="[{ position: 'relative' }, extraStyles]">
    <slot />
  </div>
</template>
