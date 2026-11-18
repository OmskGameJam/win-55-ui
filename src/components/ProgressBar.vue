<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect, type CSSProperties } from 'vue'
import Box, { type BoxType } from './Box.vue'

export interface ProgressBarSpan {
  start: number
  end: number
  color: string
}

export type ProgressBarValue = number | ProgressBarSpan[]

type FillStyle = 'segmented' | 'continuous'
type ProgressBoxType = BoxType | 'custom'

const DEFAULT_SEGMENT_COUNT = 23
const MIN_SEGMENT_LENGTH = 2
const STANDARD_BORDER_WIDTH = 6
const MARQUEE_STEP_MS = 50
const MARQUEE_LED_COUNT = 5
const MARQUEE_LED_GAP = 2

const BOX_BORDER_WIDTHS: Record<BoxType, number> = {
  indent: 6,
  'indent-dark': 6,
  'panel-d-1': 6,
  'panel-d-2': 6,
  textarea: 6,
  'border-groove': 6,
  'white-box': 6,
  notification: 12,
  none: 0,
}

const props = withDefaults(defineProps<{
  value?: ProgressBarValue
  max?: number
  boxType?: ProgressBoxType
  /** Inner padding, in visual pixels (multiples of 2 CSS px). */
  padding?: number
  /** Space between segments, in visual pixels (multiples of 2 CSS px). */
  gap?: number
  /** Segment length, in visual pixels (multiples of 2 CSS px). Mutually exclusive with segmentCount. */
  segmentLength?: number
  /** Segment count. Mutually exclusive with segmentLength. */
  segmentCount?: number
  fillStyle?: FillStyle
  width?: number
  height?: number
  fillColor?: string
  extraStyles?: CSSProperties
  extraClass?: string
}>(), {
  max: 100,
  boxType: 'border-groove',
  padding: 1,
  gap: 1,
  segmentLength: undefined,
  segmentCount: undefined,
  fillStyle: 'segmented',
  width: 384,
  height: 36,
  fillColor: '#000080',
  extraStyles: undefined,
  extraClass: undefined,
})

const evenDown = (value: number) => Math.floor(value / 2) * 2
const even = (value: number) => Math.round(value / 2) * 2
const visualPx = (value: number) => Math.max(0, Math.round(value)) * 2

const outerWidth = computed(() => even(props.width))
const outerHeight = computed(() => even(props.height))
const paddingPx = computed(() => visualPx(props.padding))
const gapPx = computed(() => visualPx(props.gap))
const explicitSegmentLength = computed(() => (
  props.segmentLength === undefined ? undefined : visualPx(props.segmentLength)
))
const explicitSegmentCount = computed(() => (
  props.segmentCount === undefined ? undefined : Math.max(0, Math.floor(props.segmentCount))
))

const boxBorderWidth = computed(() => {
  if (props.boxType === 'custom') return 0
  if (props.boxType === 'none') return STANDARD_BORDER_WIDTH
  return BOX_BORDER_WIDTHS[props.boxType] ?? STANDARD_BORDER_WIDTH
})

const resolvedBoxType = computed<BoxType>(() => (props.boxType === 'custom' ? 'none' : props.boxType))
const isGeometrylessBox = computed(() => props.boxType === 'none')

const trackRef = ref<HTMLDivElement | null>(null)
const measuredWidth = ref(0)
const measuredHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

const fallbackWidth = computed(() => (
  outerWidth.value - 2 * boxBorderWidth.value - 2 * paddingPx.value
))

const fallbackHeight = computed(() => (
  outerHeight.value - 2 * boxBorderWidth.value - 2 * paddingPx.value
))

const trackWidth = computed(() => {
  const width = measuredWidth.value > 0 ? measuredWidth.value : fallbackWidth.value
  return Math.max(0, evenDown(width))
})

const trackHeight = computed(() => {
  const height = measuredHeight.value > 0 ? measuredHeight.value : fallbackHeight.value
  return Math.max(0, evenDown(height))
})

const indeterminate = computed(() => props.value === undefined)

const clampValue = (value: number) => Math.min(props.max, Math.max(0, Number.isFinite(value) ? value : 0))

const determinateSpans = computed<ProgressBarSpan[]>(() => {
  if (props.value === undefined || !(props.max > 0)) return []

  const raw: readonly ProgressBarSpan[] = Array.isArray(props.value)
    ? props.value
    : [{ start: 0, end: props.value, color: props.fillColor }]

  return raw.flatMap((span) => {
    const start = clampValue(Math.min(span.start, span.end))
    const end = clampValue(Math.max(span.start, span.end))
    if (!(end > start)) return []
    return [{ start, end, color: span.color || props.fillColor }]
  })
})

const marqueePosition = ref(0)

// Windows' marquee is five "LEDs" wide. Each LED is 2/3 of the bar height
// with a 2px gap, and the block advances one LED every 30 ms.
const marqueePitch = computed(() => {
  const led = Math.round((trackHeight.value * 2) / 3)
  return Math.max(1, led + MARQUEE_LED_GAP)
})

const marqueeBlockWidth = computed(() => (
  Math.min(trackWidth.value, marqueePitch.value * MARQUEE_LED_COUNT)
))

const marqueeSpans = computed<ProgressBarSpan[]>(() => {
  const width = trackWidth.value
  const block = marqueeBlockWidth.value
  if (width <= 0 || block <= 0) return []

  const start = marqueePosition.value % width
  const end = start + block

  if (end <= width) {
    return [{ start: start / width, end: end / width, color: props.fillColor }]
  }

  const spans: ProgressBarSpan[] = [
    { start: start / width, end: 1, color: props.fillColor },
  ]
  const wrapped = Math.min(width, end - width)
  if (wrapped > 0) {
    spans.push({ start: 0, end: wrapped / width, color: props.fillColor })
  }

  return spans
})

const normalizedSpans = computed<ProgressBarSpan[]>(() => (
  indeterminate.value ? marqueeSpans.value : determinateSpans.value
))

const spanMax = computed(() => (indeterminate.value ? 1 : props.max))

const ariaValueNow = computed(() => (
  indeterminate.value
    ? undefined
    : determinateSpans.value.reduce((max, span) => Math.max(max, span.end), 0)
))

interface SegmentLayout {
  widths: number[]
}

// Spread leftover pixels one at a time so the final segment ends flush with the
// track. This deliberately puts some segments off the 2px grid.
const distributeSegmentWidths = (base: number, count: number, gap: number, width: number): number[] => {
  const remainder = width - base * count - (count - 1) * gap

  return Array.from({ length: count }, (_, index) => (
    base + Math.floor(((index + 1) * remainder) / count) - Math.floor((index * remainder) / count)
  ))
}

const segmentLayout = computed<SegmentLayout>(() => {
  const width = trackWidth.value
  const gap = gapPx.value
  const length = explicitSegmentLength.value
  const requestedCount = explicitSegmentCount.value

  if (length !== undefined) {
    if (length < MIN_SEGMENT_LENGTH) return { widths: [] }
    const count = Math.max(0, Math.floor((width + gap) / (length + gap)))
    if (count === 0) return { widths: [] }
    return { widths: distributeSegmentWidths(length, count, gap, width) }
  }

  const requested = requestedCount ?? DEFAULT_SEGMENT_COUNT
  if (requested <= 0) return { widths: [] }

  const maxCount = Math.max(0, Math.floor((width + gap) / (MIN_SEGMENT_LENGTH + gap)))
  const count = Math.min(requested, maxCount)
  if (count === 0) return { widths: [] }

  const available = width - (count - 1) * gap
  const base = Math.floor(available / count)

  return { widths: distributeSegmentWidths(base, count, gap, width) }
})

interface RenderedSegment {
  width: number
  color: string
}

const renderedSegments = computed<RenderedSegment[]>(() => {
  const { widths } = segmentLayout.value
  if (widths.length === 0) return []

  const max = spanMax.value
  const trackPx = trackWidth.value
  const gap = gapPx.value
  const spans = normalizedSpans.value

  if (!(max > 0) || spans.length === 0) {
    return widths.map((width) => ({ width, color: 'transparent' }))
  }

  const spansPx = spans.map((span) => ({
    start: (span.start / max) * trackPx,
    end: (span.end / max) * trackPx,
    color: span.color,
  }))

  let offset = 0

  return widths.map((width) => {
    const start = offset
    const end = offset + width
    let color = 'transparent'

    for (const span of spansPx) {
      const overlap = Math.min(end, span.end) - Math.max(start, span.start)
      if (overlap >= 1 - 1e-9) color = span.color
    }

    offset = end + gap
    return { width, color }
  })
})

interface RenderedContinuousSpan {
  left: number
  width: number
  color: string
}

const continuousSpans = computed<RenderedContinuousSpan[]>(() => {
  const trackPx = trackWidth.value
  const max = spanMax.value
  if (!(max > 0) || trackPx <= 0) return []

  return normalizedSpans.value.flatMap((span) => {
    const start = Math.round((span.start / max) * trackPx)
    const end = Math.round((span.end / max) * trackPx)
    const left = Math.max(0, Math.min(start, end))
    const right = Math.min(trackPx, Math.max(start, end))
    if (!(right > left)) return []
    return [{ left, width: right - left, color: span.color }]
  })
})

const boxClass = computed(() => ['win55-progressbar', props.extraClass].filter(Boolean).join(' '))

const boxStyle = computed<CSSProperties>(() => ({
  width: `${outerWidth.value}px`,
  height: `${outerHeight.value}px`,
  padding: `${paddingPx.value}px`,
  overflow: 'hidden',
  ...(isGeometrylessBox.value
    ? {
        borderWidth: `${STANDARD_BORDER_WIDTH}px`,
        borderStyle: 'solid',
        borderColor: 'transparent',
      }
    : {}),
  ...props.extraStyles,
}))

const trackStyle = computed<CSSProperties>(() => ({
  gap: `${gapPx.value}px`,
}))

const segmentStyle = (segment: RenderedSegment): CSSProperties => ({
  width: `${segment.width}px`,
  backgroundColor: segment.color,
})

const continuousStyle = (span: RenderedContinuousSpan): CSSProperties => ({
  left: `${span.left}px`,
  width: `${span.width}px`,
  backgroundColor: span.color,
})

const measure = () => {
  const el = trackRef.value
  if (!el) return

  measuredWidth.value = el.clientWidth
  measuredHeight.value = el.clientHeight
}

let marqueeFrame = 0
let marqueeLastTime = 0

const marqueeTick = (time: number) => {
  if (!marqueeLastTime) marqueeLastTime = time

  const delta = time - marqueeLastTime
  marqueeLastTime = time

  const width = trackWidth.value
  if (width > 0) {
    marqueePosition.value = (marqueePosition.value + (delta / MARQUEE_STEP_MS) * marqueePitch.value) % width
  }

  marqueeFrame = requestAnimationFrame(marqueeTick)
}

const startMarquee = () => {
  if (marqueeFrame) return
  marqueeLastTime = 0
  marqueeFrame = requestAnimationFrame(marqueeTick)
}

const stopMarquee = () => {
  if (!marqueeFrame) return
  cancelAnimationFrame(marqueeFrame)
  marqueeFrame = 0
}

onMounted(() => {
  measure()
  resizeObserver = new ResizeObserver(measure)

  if (trackRef.value) {
    resizeObserver.observe(trackRef.value)
  }

  if (indeterminate.value) startMarquee()
})

watch(indeterminate, (active) => {
  if (active) {
    startMarquee()
    return
  }

  stopMarquee()
  marqueePosition.value = 0
})

onBeforeUnmount(() => {
  stopMarquee()
  resizeObserver?.disconnect()
})

let warnedMutualExclusion = false

watchEffect(() => {
  if (warnedMutualExclusion) return
  if (props.segmentLength !== undefined && props.segmentCount !== undefined) {
    warnedMutualExclusion = true
    console.warn('[ProgressBar] segmentLength and segmentCount are mutually exclusive; segmentLength wins.')
  }
})
</script>

<template>
  <!-- Box frame; `custom` intentionally falls back to the borderless Box mode. -->
  <Box
    :type="resolvedBoxType"
    :extra-class="boxClass"
    :extra-styles="boxStyle"
  >
    <div
      ref="trackRef"
      class="win55-progressbar-track"
      :style="trackStyle"
      role="progressbar"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuenow="ariaValueNow"
    >
      <template v-if="fillStyle === 'continuous'">
        <div
          v-for="(span, index) in continuousSpans"
          :key="index"
          class="win55-progressbar-fill"
          :style="continuousStyle(span)"
        />
      </template>
      <template v-else>
        <div
          v-for="(segment, index) in renderedSegments"
          :key="index"
          class="win55-progressbar-segment"
          :style="segmentStyle(segment)"
        />
      </template>
    </div>
  </Box>
</template>

<style scoped>
/* Continuous spans are absolutely positioned so array order becomes paint/z order. */
.win55-progressbar-track {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.win55-progressbar-segment {
  flex: none;
}

.win55-progressbar-fill {
  position: absolute;
  top: 0;
  bottom: 0;
}
</style>
