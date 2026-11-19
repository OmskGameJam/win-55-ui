<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, watchEffect, type CSSProperties } from 'vue'
import Box, { type BoxType } from './Box.vue'

export interface ProgressBarSpan {
  /** Start position in the same units as `max`. */
  start: number
  /** End position in the same units as `max`. */
  end: number
  color: string
}

export type ProgressBarValue = number | ProgressBarSpan[]

export type ProgressBarOrientation = 'horizontal' | 'vertical'
export type ProgressBarFillStyle = 'segmented' | 'continuous'
export type ProgressBarBoxType = BoxType | 'custom'

const DEFAULT_SEGMENT_COUNT = 23
const MIN_SEGMENT_LENGTH = 2
const STANDARD_BORDER_WIDTH = 6
const DEFAULT_LENGTH = 384
const DEFAULT_THICKNESS = 36
const MARQUEE_STEP_MS = 60
const MARQUEE_LED_COUNT = 5
const MARQUEE_LED_GAP = 2

const BOX_BORDER_WIDTHS: Record<BoxType, number> = {
  indent: STANDARD_BORDER_WIDTH,
  'indent-dark': STANDARD_BORDER_WIDTH,
  'panel-d-1': STANDARD_BORDER_WIDTH,
  'panel-d-2': STANDARD_BORDER_WIDTH,
  textarea: STANDARD_BORDER_WIDTH,
  'border-groove': STANDARD_BORDER_WIDTH,
  'white-box': STANDARD_BORDER_WIDTH,
  notification: 12,
  none: STANDARD_BORDER_WIDTH,
}

const props = withDefaults(defineProps<{
  value?: ProgressBarValue
  max?: number
  /** Bar flow direction. */
  orientation?: ProgressBarOrientation
  boxType?: ProgressBarBoxType
  /** Inner padding, in visual pixels (multiples of 2 CSS px). */
  padding?: number
  /** Space between segments, in visual pixels (multiples of 2 CSS px). */
  gap?: number
  /** Segment length, in visual pixels (multiples of 2 CSS px). Mutually exclusive with segmentCount. */
  segmentLength?: number
  /** Segment count. Mutually exclusive with segmentLength. */
  segmentCount?: number
  fillStyle?: ProgressBarFillStyle
  /** Outer width in CSS px; defaults to 384 horizontal / 36 vertical. */
  width?: number
  /** Outer height in CSS px; defaults to 36 horizontal / 384 vertical. */
  height?: number
  /** Color for number values and the indeterminate marquee. */
  fillColor?: string
  extraStyles?: CSSProperties
  extraClass?: string
}>(), {
  max: 100,
  orientation: 'horizontal',
  boxType: 'textarea',
  padding: 1,
  gap: 1,
  segmentLength: undefined,
  segmentCount: undefined,
  fillStyle: 'segmented',
  fillColor: '#000080',
  extraStyles: undefined,
  extraClass: undefined,
})

const evenDown = (value: number) => Math.floor(value / 2) * 2
const even = (value: number) => Math.round(value / 2) * 2
const visualPx = (value: number) => Math.max(0, Math.round(value)) * 2

const isVertical = computed(() => props.orientation === 'vertical')
const outerWidth = computed(() => even(props.width ?? (isVertical.value ? DEFAULT_THICKNESS : DEFAULT_LENGTH)))
const outerHeight = computed(() => even(props.height ?? (isVertical.value ? DEFAULT_LENGTH : DEFAULT_THICKNESS)))
const paddingPx = computed(() => visualPx(props.padding))
const gapPx = computed(() => visualPx(props.gap))
const explicitSegmentLength = computed(() => (
  props.segmentLength === undefined ? undefined : visualPx(props.segmentLength)
))
const explicitSegmentCount = computed(() => (
  props.segmentCount === undefined ? undefined : Math.max(0, Math.floor(props.segmentCount))
))

const boxBorderWidth = computed(() => (
  props.boxType === 'custom' ? 0 : BOX_BORDER_WIDTHS[props.boxType]
))

const resolvedBoxType = computed<BoxType>(() => (props.boxType === 'custom' ? 'none' : props.boxType))
const usesInvisibleBorder = computed(() => props.boxType === 'none')

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

const trackLength = computed(() => (isVertical.value ? trackHeight.value : trackWidth.value))
const trackThickness = computed(() => (isVertical.value ? trackWidth.value : trackHeight.value))

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

// Windows' marquee is five "LEDs" long. Each LED is 2/3 of the bar's
// cross-axis thickness with a 2px gap, and the block advances one LED per
// MARQUEE_STEP_MS.
const marqueePitch = computed(() => {
  const led = Math.round((trackThickness.value * 2) / 3)
  return Math.max(1, led + MARQUEE_LED_GAP)
})

// Keep the marquee block an even length. The shared continuous-span renderer
// snaps both edges, and an odd source length would make the visible width
// alternate by 2px as the block moves.
const marqueeBlockLength = computed(() => (
  Math.min(trackLength.value, even(marqueePitch.value * MARQUEE_LED_COUNT))
))

const marqueeSpans = computed<ProgressBarSpan[]>(() => {
  const length = trackLength.value
  const block = marqueeBlockLength.value
  if (length <= 0 || block <= 0) return []

  const start = marqueePosition.value % length
  const end = start + block

  if (end <= length) {
    return [{ start: start / length, end: end / length, color: props.fillColor }]
  }

  const spans: ProgressBarSpan[] = [
    { start: start / length, end: 1, color: props.fillColor },
  ]
  const wrapped = Math.min(length, end - length)
  if (wrapped > 0) {
    spans.push({ start: 0, end: wrapped / length, color: props.fillColor })
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
  lengths: number[]
}

// Spread leftover pixels one at a time so the final segment ends flush with the
// track. This deliberately puts some segments off the 2px grid.
const distributeSegmentLengths = (base: number, count: number, gap: number, availableLength: number): number[] => {
  const remainder = availableLength - base * count - (count - 1) * gap

  return Array.from({ length: count }, (_, index) => (
    base + Math.floor(((index + 1) * remainder) / count) - Math.floor((index * remainder) / count)
  ))
}

const segmentLayout = computed<SegmentLayout>(() => {
  const length = trackLength.value
  const gap = gapPx.value
  const segmentLength = explicitSegmentLength.value
  const requestedCount = explicitSegmentCount.value

  if (segmentLength !== undefined) {
    if (segmentLength < MIN_SEGMENT_LENGTH) return { lengths: [] }
    const count = Math.max(0, Math.floor((length + gap) / (segmentLength + gap)))
    if (count === 0) return { lengths: [] }
    return { lengths: distributeSegmentLengths(segmentLength, count, gap, length) }
  }

  const requested = requestedCount ?? DEFAULT_SEGMENT_COUNT
  if (requested <= 0) return { lengths: [] }

  const maxCount = Math.max(0, Math.floor((length + gap) / (MIN_SEGMENT_LENGTH + gap)))
  const count = Math.min(requested, maxCount)
  if (count === 0) return { lengths: [] }

  const available = length - (count - 1) * gap
  const base = Math.floor(available / count)

  return { lengths: distributeSegmentLengths(base, count, gap, length) }
})

interface RenderedSegment {
  length: number
  color: string
}

const renderedSegments = computed<RenderedSegment[]>(() => {
  const { lengths } = segmentLayout.value
  if (lengths.length === 0) return []

  const max = spanMax.value
  const trackLengthPx = trackLength.value
  const gap = gapPx.value
  const spans = normalizedSpans.value

  if (!(max > 0) || spans.length === 0) {
    return lengths.map((length) => ({ length, color: 'transparent' }))
  }

  const spansPx = spans.map((span) => ({
    start: (span.start / max) * trackLengthPx,
    end: (span.end / max) * trackLengthPx,
    color: span.color,
  }))

  let offset = 0

  return lengths.map((length) => {
    const start = offset
    const end = offset + length
    let color = 'transparent'

    for (const span of spansPx) {
      const overlap = Math.min(end, span.end) - Math.max(start, span.start)
      if (overlap >= 1 - 1e-9) color = span.color
    }

    offset = end + gap
    return { length, color }
  })
})

interface RenderedContinuousSpan {
  offset: number
  length: number
  color: string
}

const continuousSpans = computed<RenderedContinuousSpan[]>(() => {
  const trackLengthPx = trackLength.value
  const max = spanMax.value
  if (!(max > 0) || trackLengthPx <= 0) return []

  return normalizedSpans.value.flatMap((span) => {
    // Continuous spans live on the 2px visual-pixel grid too.
    const start = even((span.start / max) * trackLengthPx)
    const end = even((span.end / max) * trackLengthPx)
    const offset = Math.max(0, Math.min(start, end))
    const limit = Math.min(trackLengthPx, Math.max(start, end))
    if (!(limit > offset)) return []
    return [{ offset, length: limit - offset, color: span.color }]
  })
})

const boxClass = computed(() => ['win55-progressbar', props.extraClass].filter(Boolean).join(' '))

const boxStyle = computed<CSSProperties>(() => ({
  width: `${outerWidth.value}px`,
  height: `${outerHeight.value}px`,
  padding: `${paddingPx.value}px`,
  overflow: 'hidden',
  ...(usesInvisibleBorder.value
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

const segmentStyle = (segment: RenderedSegment): CSSProperties => (
  isVertical.value
    ? { height: `${segment.length}px`, backgroundColor: segment.color }
    : { width: `${segment.length}px`, backgroundColor: segment.color }
)

const continuousStyle = (span: RenderedContinuousSpan): CSSProperties => (
  isVertical.value
    ? { bottom: `${span.offset}px`, height: `${span.length}px`, backgroundColor: span.color }
    : { left: `${span.offset}px`, width: `${span.length}px`, backgroundColor: span.color }
)

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

  const length = trackLength.value
  if (length > 0) {
    marqueePosition.value = (marqueePosition.value + (delta / MARQUEE_STEP_MS) * marqueePitch.value) % length
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
      :class="['win55-progressbar-track', orientation]"
      :style="trackStyle"
      role="progressbar"
      :aria-orientation="orientation"
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

.win55-progressbar-track.horizontal {
  flex-direction: row;
}

.win55-progressbar-track.vertical {
  flex-direction: column-reverse;
}

.win55-progressbar-segment {
  flex: none;
}

.win55-progressbar-fill {
  position: absolute;
}

.win55-progressbar-track.horizontal .win55-progressbar-fill {
  top: 0;
  bottom: 0;
}

.win55-progressbar-track.vertical .win55-progressbar-fill {
  left: 0;
  right: 0;
}
</style>
