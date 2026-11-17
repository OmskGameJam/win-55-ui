<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'
import Box from './Box.vue'
import { cursorWeakDirective } from '../directives/cursor'

const vCursor = cursorWeakDirective

type SliderSize = 'small' | 'medium' | 'large'
type SliderOrientation = 'horizontal' | 'vertical'
type HandleKey = 'low' | 'high'

interface Thumb {
  src: string
  width: number
  height: number
}

interface Handle {
  key: HandleKey
  value: number
  thumb: Thumb
}

const TRACK_THICKNESS = 6
const RANGE_THICKNESS = 4
const NOTCH_LENGTH = 2
const NOTCH_THICKNESS = 12
const NOTCH_START_OFFSET = 2
const HORIZONTAL_SLIDER_PADDING = 16
const PAGE_STEP = 10
const EPSILON = 1e-9

const THUMBS: Record<SliderOrientation, Record<SliderSize, Thumb>> = {
  horizontal: {
    small: { src: '/win-55-ui/slider-thumbs/h-small.png', width: 10, height: 16 },
    medium: { src: '/win-55-ui/slider-thumbs/h-medium.png', width: 10, height: 20 },
    large: { src: '/win-55-ui/slider-thumbs/h-large.png', width: 14, height: 26 },
  },
  vertical: {
    small: { src: '/win-55-ui/slider-thumbs/v-small.png', width: 18, height: 10 },
    medium: { src: '/win-55-ui/slider-thumbs/v-medium.png', width: 22, height: 10 },
    large: { src: '/win-55-ui/slider-thumbs/v-large.png', width: 26, height: 14 },
  },
}

const props = withDefaults(defineProps<{
  size?: SliderSize
  sizeMax?: SliderSize
  orientation?: SliderOrientation
  normalized?: boolean
  rangeColor?: string
  fixedValues?: readonly number[]
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  extraStyles?: CSSProperties
  extraClass?: string
}>(), {
  size: 'medium',
  sizeMax: undefined,
  orientation: 'horizontal',
  normalized: false,
  rangeColor: 'var(--win55-cga-blue, #0000AA)',
  fixedValues: undefined,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  extraStyles: undefined,
  extraClass: undefined,
})

const model = defineModel<number>({ default: 0 })
const rangeModel = defineModel<[number, number]>('range')

const isVertical = computed(() => props.orientation === 'vertical')
const isRange = computed(() => rangeModel.value !== undefined)

const lowThumb = computed(() => THUMBS[props.orientation][props.size])
const highThumb = computed(() => THUMBS[props.orientation][props.sizeMax ?? props.size])

const activeThumbs = computed(() => (isRange.value ? [lowThumb.value, highThumb.value] : [lowThumb.value]))
const crossWidth = computed(() => Math.max(...activeThumbs.value.map((thumb) => thumb.width)))
const crossHeight = computed(() => Math.max(...activeThumbs.value.map((thumb) => thumb.height)))

const clamp = (value: number) => Math.min(props.max, Math.max(props.min, value))
const even = (value: number) => Math.round(value / 2) * 2

const stepSize = () => (props.step > 0 ? props.step : 1)
const stepPrecision = (step: number) => (String(step).split('.')[1] ?? '').length
const stepAt = (index: number) => {
  const step = stepSize()
  return Number((props.min + index * step).toFixed(stepPrecision(step)))
}

const snap = (value: number) => clamp(stepAt(Math.round((clamp(value) - props.min) / stepSize())))

const ratioFor = (value: number) => {
  if (props.max === props.min) return 0
  return (clamp(value) - props.min) / (props.max - props.min)
}

const fixed = computed(() => {
  const values = props.fixedValues ?? []
  const valid = values.filter((value) => Number.isFinite(value) && value >= props.min && value <= props.max)
  return [...new Set(valid)].sort((a, b) => a - b)
})

const isFixed = computed(() => fixed.value.length > 0)

const nearestIndex = (values: readonly number[], target: number) => {
  let best = 0
  let bestDistance = Infinity

  values.forEach((value, index) => {
    const distance = Math.abs(value - target)

    if (distance < bestDistance) {
      best = index
      bestDistance = distance
    }
  })

  return best
}

const nearestFixed = (value: number) => fixed.value[nearestIndex(fixed.value, clamp(value))]

const effectiveValue = (value: number) => (isFixed.value ? nearestFixed(value) : clamp(value))

const previousDiscrete = (value: number): number | null => {
  if (isFixed.value) {
    for (let index = fixed.value.length - 1; index >= 0; index -= 1) {
      if (fixed.value[index] < value) return fixed.value[index]
    }

    return null
  }

  const index = Math.ceil((value - props.min) / stepSize() - EPSILON) - 1
  if (index < 0) return null

  const previous = stepAt(index)
  return previous < value && previous >= props.min ? previous : null
}

const nextDiscrete = (value: number): number | null => {
  if (isFixed.value) {
    return fixed.value.find((candidate) => candidate > value) ?? null
  }

  const index = Math.floor((value - props.min) / stepSize() + EPSILON) + 1
  const next = stepAt(index)
  return next > value && next <= props.max ? next : null
}

const rangeValue = computed<[number, number]>(() => {
  const pair = rangeModel.value
  return pair && pair.length === 2 ? [pair[0], pair[1]] : [props.min, props.max]
})

const handles = computed<Handle[]>(() => {
  const low = {
    key: 'low' as const,
    value: effectiveValue(isRange.value ? rangeValue.value[0] : model.value),
    thumb: lowThumb.value,
  }

  if (!isRange.value) return [low]

  return [low, { key: 'high' as const, value: effectiveValue(rangeValue.value[1]), thumb: highThumb.value }]
})

const valueFor = (key: HandleKey) =>
  handles.value.find((handle) => handle.key === key)?.value ?? props.min

const valueMin = computed(() => (isFixed.value ? fixed.value[0] : props.min))
const valueMax = computed(() => (isFixed.value ? fixed.value[fixed.value.length - 1] : props.max))

const setHandleValue = (key: HandleKey, value: number) => {
  let next = isFixed.value ? nearestFixed(clamp(value)) : snap(value)

  if (!isRange.value) {
    if (next !== model.value) model.value = next
    return
  }

  const current = rangeValue.value
  const other = key === 'low' ? current[1] : current[0]
  const otherValue = isFixed.value ? effectiveValue(other) : clamp(other)

  if (props.normalized) {
    if (key === 'low' && next >= otherValue) {
      const previous = previousDiscrete(otherValue)
      if (previous === null) return
      next = previous
    } else if (key === 'high' && next <= otherValue) {
      const nextValue = nextDiscrete(otherValue)
      if (nextValue === null) return
      next = nextValue
    }
  }

  const nextRange: [number, number] = key === 'low' ? [next, otherValue] : [otherValue, next]
  if (nextRange[0] === current[0] && nextRange[1] === current[1]) return

  rangeModel.value = nextRange
}

watch([isRange, () => props.normalized, rangeValue, fixed], () => {
  if (!isRange.value || !props.normalized) return

  const low = effectiveValue(rangeValue.value[0])
  const high = effectiveValue(rangeValue.value[1])
  if (low !== high) return

  const above = nextDiscrete(high)
  if (above !== null) {
    rangeModel.value = [low, above]
    return
  }

  const below = previousDiscrete(low)
  if (below !== null) {
    rangeModel.value = [below, high]
  }
}, { immediate: true })

const rootRef = ref<HTMLDivElement | null>(null)
const rootWidth = ref(0)
const rootHeight = ref(0)
const dragValue = ref<number | null>(null)
let dragKey: HandleKey | null = null

const thumbExtent = (thumb: Thumb) => (isVertical.value ? thumb.height : thumb.width)

const tipInset = computed(() => Math.max(...activeThumbs.value.map(thumbExtent)) / 2)

const odd = (value: number) => Math.round((value - 1) / 2) * 2 + 1

// Single source of truth for a fixed value's pixel position: the thumb tip center.
const tipCenterFor = (value: number) => {
  const length = isVertical.value ? rootHeight.value : rootWidth.value
  const ratio = isVertical.value ? 1 - ratioFor(value) : ratioFor(value)
  const inset = tipInset.value
  return Math.min(length - inset, Math.max(inset, odd(inset + ratio * (length - inset * 2))))
}

// Horizontal sliders match the text-input box: tallest thumb + 8px above/below.
const rootStyle = computed<CSSProperties>(() => ({
  ...(isVertical.value
    ? { width: `${crossWidth.value}px`, height: '100%' }
    : { height: `${crossHeight.value + HORIZONTAL_SLIDER_PADDING}px` }),
  opacity: props.disabled ? 0.5 : 1,
  ...props.extraStyles,
}))

const trackOffset = computed<number | null>(() => {
  const crossSize = isVertical.value ? rootWidth.value : rootHeight.value
  return crossSize ? even((crossSize - TRACK_THICKNESS) / 2) : null
})

const trackStyle = computed<CSSProperties>(() => {
  const offset = trackOffset.value

  return isVertical.value
    ? {
        position: 'absolute',
        top: '0',
        bottom: '0',
        ...(offset === null
          ? { left: '50%', transform: 'translateX(-50%)' }
          : { left: `${offset}px` }),
        width: '0px',
        boxSizing: 'border-box',
        borderWidth: `0 ${TRACK_THICKNESS}px 0 0`,
        borderImageWidth: `0 ${TRACK_THICKNESS}px 0 0`,
      }
    : {
        position: 'absolute',
        left: '0',
        right: '0',
        ...(offset === null
          ? { top: '50%', transform: 'translateY(-50%)' }
          : { top: `${offset}px` }),
        height: '0px',
        boxSizing: 'border-box',
        borderWidth: `0 0 ${TRACK_THICKNESS}px 0`,
        borderImageWidth: `0 0 ${TRACK_THICKNESS}px 0`,
      }
})

const cssPx = (value: number | string) => (typeof value === 'number' ? `${value}px` : value)

const thumbBox = (handle: Handle, left: number | string, top: number | string): CSSProperties => ({
  left: cssPx(left),
  top: cssPx(top),
  width: `${handle.thumb.width}px`,
  height: `${handle.thumb.height}px`,
})

const fixedThumbStyle = (handle: Handle): CSSProperties => {
  const center = tipCenterFor(handle.value)

  return isVertical.value
    ? thumbBox(handle, even((crossWidth.value - handle.thumb.width) / 2), center - handle.thumb.height / 2)
    : thumbBox(handle, center - handle.thumb.width / 2, even((rootHeight.value - handle.thumb.height) / 2))
}

const evenTravelFor = (handle: Handle) => (
  isVertical.value
    ? even((1 - ratioFor(handle.value)) * (rootHeight.value - handle.thumb.height))
    : even(ratioFor(handle.value) * (rootWidth.value - handle.thumb.width))
)

// The real handle tracks the input continuously; its image is hidden but keeps the hit box.
const handleStyle = (handle: Handle): CSSProperties => {
  const activeDrag = dragKey === handle.key ? dragValue.value : null

  if (isFixed.value && rootWidth.value && rootHeight.value && activeDrag === null) {
    return fixedThumbStyle(handle)
  }

  const value = activeDrag ?? handle.value
  const position = isVertical.value ? 1 - ratioFor(value) : ratioFor(value)

  return isVertical.value
    ? {
        ...thumbBox(handle, (crossWidth.value - handle.thumb.width) / 2, `${position * 100}%`),
        transform: `translateY(-${position * 100}%)`,
      }
    : {
        ...thumbBox(handle, `${position * 100}%`, '50%'),
        transform: `translate(-${position * 100}%, -50%)`,
      }
}

// The visible thumb is snapped to the 2px grid so it stays pixel-aligned with the rest of the UI.
const fauxThumbStyle = (handle: Handle): CSSProperties => {
  if (!rootWidth.value || !rootHeight.value) return handleStyle(handle)
  if (isFixed.value) return fixedThumbStyle(handle)

  return isVertical.value
    ? thumbBox(handle, even((crossWidth.value - handle.thumb.width) / 2), evenTravelFor(handle))
    : thumbBox(handle, evenTravelFor(handle), even((rootHeight.value - handle.thumb.height) / 2))
}

const notchEdgeFor = (value: number) => tipCenterFor(value) - NOTCH_LENGTH / 2

// Snap the range bar to whole pixels so it can't spill past the track/handles.
const rangeStyle = computed<CSSProperties>(() => {
  if (!isRange.value) return {}

  const offset = trackOffset.value
  if (!rootWidth.value || !rootHeight.value || offset === null) return { display: 'none' }

  // The 4px fill sits on the even-aligned far 4px of the 6px groove.
  const cross = offset + 2

  const barStyle = (start: number, length: number): CSSProperties => ({
    position: 'absolute',
    backgroundColor: props.rangeColor,
    pointerEvents: 'none',
    ...(isVertical.value
      ? { top: `${start}px`, height: `${length}px`, left: `${cross}px`, width: `${RANGE_THICKNESS}px` }
      : { left: `${start}px`, width: `${length}px`, top: `${cross}px`, height: `${RANGE_THICKNESS}px` }),
  })

  if (isFixed.value) {
    const low = Math.min(handles.value[0].value, handles.value[1].value)
    const high = Math.max(handles.value[0].value, handles.value[1].value)
    const lowEdge = notchEdgeFor(low)
    const highEdge = notchEdgeFor(high)

    return isVertical.value
      ? barStyle(highEdge, Math.max(NOTCH_LENGTH, lowEdge + NOTCH_LENGTH - highEdge))
      : barStyle(lowEdge, Math.max(NOTCH_LENGTH, highEdge + NOTCH_LENGTH - lowEdge))
  }

  const center = (handle: Handle) => (
    evenTravelFor(handle) + (isVertical.value ? handle.thumb.height : handle.thumb.width) / 2
  )

  const first = center(handles.value[0])
  const second = center(handles.value[1])
  const start = even(Math.min(first, second))
  const end = even(Math.max(first, second))

  return barStyle(start, Math.max(0, end - start))
})

const notchStyle = (value: number): CSSProperties => {
  const offset = trackOffset.value
  if (!rootWidth.value || !rootHeight.value || offset === null) return { display: 'none' }

  const edge = notchEdgeFor(value)

  // 12px tick: 2px before the track, 6px across it, 4px past it.
  return isVertical.value
    ? {
        position: 'absolute',
        left: `${offset - NOTCH_START_OFFSET}px`,
        top: `${edge}px`,
        width: `${NOTCH_THICKNESS}px`,
        height: `${NOTCH_LENGTH}px`,
        backgroundColor: 'var(--win55-cga-dark-gray, #555555)',
        pointerEvents: 'none',
      }
    : {
        position: 'absolute',
        top: `${offset - NOTCH_START_OFFSET}px`,
        left: `${edge}px`,
        width: `${NOTCH_LENGTH}px`,
        height: `${NOTCH_THICKNESS}px`,
        backgroundColor: 'var(--win55-cga-dark-gray, #555555)',
        pointerEvents: 'none',
      }
}

const measureRoot = () => {
  const el = rootRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  rootWidth.value = Math.floor(rect.width)
  rootHeight.value = Math.floor(rect.height)
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measureRoot()
  resizeObserver = new ResizeObserver(measureRoot)

  if (rootRef.value) {
    resizeObserver.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

const handleElement = (key: HandleKey) =>
  rootRef.value?.querySelector<HTMLElement>(`.win55-slider-handle[data-handle="${key}"]`) ?? null

const focusHandle = (key: HandleKey) => {
  handleElement(key)?.focus({ preventScroll: true })
}

const handleCenter = (handle: Handle, rect: DOMRect) => {
  if (isFixed.value && rootWidth.value && rootHeight.value) {
    const tip = tipCenterFor(handle.value)
    return {
      x: isVertical.value ? rect.left + crossWidth.value / 2 : rect.left + tip,
      y: isVertical.value ? rect.top + tip : rect.top + rect.height / 2,
    }
  }

  const ratio = ratioFor(handle.value)

  return isVertical.value
    ? {
        x: rect.left + crossWidth.value / 2,
        y: rect.top + (1 - ratio) * (rect.height - handle.thumb.height) + handle.thumb.height / 2,
      }
    : {
        x: rect.left + ratio * (rect.width - handle.thumb.width) + handle.thumb.width / 2,
        y: rect.top + rect.height / 2,
      }
}

const pickHandle = (clientX: number, clientY: number): HandleKey => {
  if (!isRange.value || !rootRef.value) return 'low'

  const rect = rootRef.value.getBoundingClientRect()
  let best: HandleKey = 'low'
  let bestDistance = Infinity

  for (const handle of handles.value) {
    const center = handleCenter(handle, rect)
    const dx = clientX - center.x
    const dy = clientY - center.y
    const distance = dx * dx + dy * dy

    if (distance < bestDistance) {
      best = handle.key
      bestDistance = distance
    }
  }

  return best
}

const valueFromPointer = (clientX: number, clientY: number, key: HandleKey) => {
  const el = rootRef.value
  if (!el) return props.min

  const rect = el.getBoundingClientRect()
  const thumb = handles.value.find((handle) => handle.key === key)?.thumb ?? lowThumb.value

  if (isVertical.value) {
    const usable = rect.height - thumb.height
    const fromTop = usable > 0 ? (clientY - rect.top - thumb.height / 2) / usable : 0
    return props.max - fromTop * (props.max - props.min)
  }

  const usable = rect.width - thumb.width
  const ratio = usable > 0 ? (clientX - rect.left - thumb.width / 2) / usable : 0
  return props.min + ratio * (props.max - props.min)
}

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled || e.button !== 0) return

  const key = pickHandle(e.clientX, e.clientY)
  const value = valueFromPointer(e.clientX, e.clientY, key)
  dragKey = key
  dragValue.value = value
  focusHandle(key)
  rootRef.value?.setPointerCapture(e.pointerId)
  setHandleValue(key, value)
  e.preventDefault()
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragKey) return

  const value = valueFromPointer(e.clientX, e.clientY, dragKey)
  dragValue.value = value
  setHandleValue(dragKey, value)
}

const onPointerUp = (e: PointerEvent) => {
  if (!dragKey) return

  dragKey = null
  dragValue.value = null

  if (rootRef.value?.hasPointerCapture(e.pointerId)) {
    rootRef.value.releasePointerCapture(e.pointerId)
  }
}

type KeyMove = 'prev' | 'next' | 'page-prev' | 'page-next' | 'min' | 'max'

const keyMoveFor = (key: string): KeyMove | null => {
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      return 'prev'
    case 'ArrowRight':
    case 'ArrowUp':
      return 'next'
    case 'PageDown':
      return 'page-prev'
    case 'PageUp':
      return 'page-next'
    case 'Home':
      return 'min'
    case 'End':
      return 'max'
    default:
      return null
  }
}

const onKeyDown = (e: KeyboardEvent, key: HandleKey) => {
  if (props.disabled) return

  const move = keyMoveFor(e.key)
  if (!move) return

  e.preventDefault()

  if (isFixed.value) {
    const last = fixed.value.length - 1
    let index = nearestIndex(fixed.value, valueFor(key))

    if (move === 'min') index = 0
    else if (move === 'max') index = last
    else if (move === 'prev') index -= 1
    else if (move === 'next') index += 1
    else if (move === 'page-prev') index -= PAGE_STEP
    else if (move === 'page-next') index += PAGE_STEP

    setHandleValue(key, fixed.value[Math.max(0, Math.min(last, index))])
    return
  }

  const step = stepSize()
  let next = valueFor(key)

  if (move === 'min') next = props.min
  else if (move === 'max') next = props.max
  else if (move === 'prev') next -= step
  else if (move === 'next') next += step
  else if (move === 'page-prev') next -= step * PAGE_STEP
  else if (move === 'page-next') next += step * PAGE_STEP

  setHandleValue(key, next)
}
</script>

<template>
  <div
    ref="rootRef"
    :class="['win55-slider', extraClass ?? '']"
    :style="rootStyle"
    :role="isRange ? 'group' : undefined"
    v-cursor="disabled ? 'not-allowed' : 'default'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <Box type="border-groove" :extra-styles="trackStyle" />
    <div v-if="isRange" class="win55-slider-range" :style="rangeStyle" aria-hidden="true" />
    <div
      v-for="value in fixed"
      :key="`notch-${value}`"
      class="win55-slider-notch"
      :style="notchStyle(value)"
      aria-hidden="true"
    />
    <div
      v-for="handle in handles"
      :key="handle.key"
      class="win55-slider-handle"
      :data-handle="handle.key"
      :style="handleStyle(handle)"
      role="slider"
      :tabindex="disabled ? -1 : 0"
      :aria-orientation="orientation"
      :aria-valuemin="valueMin"
      :aria-valuemax="valueMax"
      :aria-valuenow="handle.value"
      :aria-disabled="disabled || undefined"
      @keydown="onKeyDown($event, handle.key)"
    >
      <img class="win55-slider-thumb" :src="handle.thumb.src" draggable="false" alt="" />
    </div>
    <img
      v-for="handle in handles"
      :key="`faux-${handle.key}`"
      class="win55-slider-faux-thumb"
      :src="handle.thumb.src"
      :style="fauxThumbStyle(handle)"
      draggable="false"
      alt=""
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.win55-slider {
  position: relative;
  width: 100%;
  user-select: none;
  touch-action: none;
}

.win55-slider-handle {
  position: absolute;
}

.win55-slider-thumb {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  image-rendering: pixelated;
}

.win55-slider-faux-thumb {
  position: absolute;
  pointer-events: none;
  image-rendering: pixelated;
}
</style>
