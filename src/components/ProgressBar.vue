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
  /** Inner padding in CSS px; snaps to the 2px grid. */
  padding?: number
  /** Space between segments in CSS px; snaps to the 2px grid. */
  gap?: number
  /** Segment length in CSS px; snaps to the 2px grid. Mutually exclusive with segmentCount. */
  segmentLength?: number
  /** Segment count. Mutually exclusive with segmentLength. */
  segmentCount?: number
  fillStyle?: ProgressBarFillStyle
  /** Outer width in CSS px; snaps up to the 2px grid. Defaults to 384 horizontal / 36 vertical. */
  width?: number
  /** Outer height in CSS px; snaps up to the 2px grid. Defaults to 36 horizontal / 384 vertical. */
  height?: number
  /** Color for number values and the indeterminate marquee. */
  fillColor?: string
  extraStyles?: CSSProperties
  extraClass?: string
}>(), {
  max: 100,
  orientation: 'horizontal',
  boxType: 'textarea',
  padding: 2,
  gap: 2,
  fillStyle: 'segmented',
  fillColor: '#000080',
})

/** Snap to the nearest 2px cell. */
const roundEven = (value: number) => Math.round(value / 2) * 2
/** Snap down to a whole 2px cell. */
const floorEven = (value: number) => Math.floor(value / 2) * 2
/** Snap up to a whole 2px cell. */
const ceilEven = (value: number) => Math.ceil(value / 2) * 2

const isVertical = computed(() => props.orientation === 'vertical')
const outerWidth = computed(() => ceilEven(props.width ?? (isVertical.value ? DEFAULT_THICKNESS : DEFAULT_LENGTH)))
const outerHeight = computed(() => ceilEven(props.height ?? (isVertical.value ? DEFAULT_LENGTH : DEFAULT_THICKNESS)))
const paddingPx = computed(() => Math.max(0, roundEven(props.padding)))
const gapPx = computed(() => Math.max(0, roundEven(props.gap)))
const segmentLengthPx = computed(() => (
  props.segmentLength === undefined ? undefined : Math.max(0, ceilEven(props.segmentLength))
))
const requestedSegmentCount = computed(() => (
  props.segmentCount === undefined ? undefined : Math.max(0, Math.floor(props.segmentCount))
))

const boxBorderWidth = computed(() => (
  props.boxType === 'custom' ? 0 : BOX_BORDER_WIDTHS[props.boxType]
))

const resolvedBoxType = computed<BoxType>(() => (props.boxType === 'custom' ? 'none' : props.boxType))

const trackRef = ref<HTMLDivElement | null>(null)
const measuredWidth = ref(0)
const measuredHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

// Prefer the measured track, but fall back to the geometry implied by the
// props until the first ResizeObserver callback. Both paths snap down to the
// 2px grid so the bar never drifts off it.
const fitTrack = (measured: number, fallback: number) => (
  Math.max(0, floorEven(measured > 0 ? measured : fallback))
)

const trackWidth = computed(() => (
  fitTrack(measuredWidth.value, outerWidth.value - 2 * (boxBorderWidth.value + paddingPx.value))
))

const trackHeight = computed(() => (
  fitTrack(measuredHeight.value, outerHeight.value - 2 * (boxBorderWidth.value + paddingPx.value))
))

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

const ariaValueNow = computed(() => (
  indeterminate.value
    ? undefined
    : determinateSpans.value.reduce((max, span) => Math.max(max, span.end), 0)
))

const marqueePosition = ref(0)

// Windows' marquee is five "LEDs" long. Each LED is 2/3 of the bar's
// cross-axis thickness with a 2px gap, and the block advances one LED per
// MARQUEE_STEP_MS.
const marqueePitch = computed(() => (
  Math.max(1, Math.round((trackThickness.value * 2) / 3) + MARQUEE_LED_GAP)
))

// Keep the marquee block an even length. The continuous renderer snaps both
// edges, and an odd source length would make the visible width alternate by
// 2px as the block moves.
const marqueeBlockLength = computed(() => (
  Math.min(trackLength.value, roundEven(marqueePitch.value * MARQUEE_LED_COUNT))
))

interface PixelSpan {
  start: number
  end: number
  color: string
}

const marqueeSpans = computed<PixelSpan[]>(() => {
  const length = trackLength.value
  const block = marqueeBlockLength.value
  if (length <= 0 || block <= 0) return []

  const start = marqueePosition.value % length
  const end = start + block
  if (end <= length) return [{ start, end, color: props.fillColor }]

  return [
    { start, end: length, color: props.fillColor },
    { start: 0, end: end - length, color: props.fillColor },
  ]
})

// Both renderers consume fill geometry in track pixels. Determinate spans are
// converted from user units here; the marquee already lives in pixels.
const fillSpans = computed<PixelSpan[]>(() => {
  if (indeterminate.value) return marqueeSpans.value

  const length = trackLength.value
  if (!(props.max > 0) || length <= 0) return []

  return determinateSpans.value.map((span) => ({
    start: (span.start / props.max) * length,
    end: (span.end / props.max) * length,
    color: span.color,
  }))
})

const segmentLengths = computed<number[]>(() => {
  const length = trackLength.value
  const gap = gapPx.value
  const explicitLength = segmentLengthPx.value
  let count: number
  let base: number

  if (explicitLength !== undefined) {
    if (explicitLength < MIN_SEGMENT_LENGTH) return []
    count = Math.floor((length + gap) / (explicitLength + gap))
    if (count <= 0) return []
    base = explicitLength
  } else {
    const requested = requestedSegmentCount.value ?? DEFAULT_SEGMENT_COUNT
    if (requested <= 0) return []
    count = Math.min(requested, Math.floor((length + gap) / (MIN_SEGMENT_LENGTH + gap)))
    if (count <= 0) return []
    base = floorEven((length - (count - 1) * gap) / count)
  }

  if (base < MIN_SEGMENT_LENGTH) return []

  // Spread the leftover 2px cells one at a time so the final segment ends flush
  // with the track. Everything the renderer emits stays on the 2px grid.
  const cells = (length - base * count - (count - 1) * gap) / 2
  return Array.from({ length: count }, (_, index) => (
    base + 2 * (Math.floor(((index + 1) * cells) / count) - Math.floor((index * cells) / count))
  ))
})

interface RenderedSegment {
  length: number
  color: string
}

const renderedSegments = computed<RenderedSegment[]>(() => {
  const lengths = segmentLengths.value
  if (lengths.length === 0) return []

  const spans = fillSpans.value
  const gap = gapPx.value
  let offset = 0

  return lengths.map((length) => {
    const start = offset
    const end = start + length
    offset = end + gap

    let color = 'transparent'
    for (const span of spans) {
      // A segment lights up once the fill covers a whole 2px cell of it.
      if (Math.min(end, span.end) - Math.max(start, span.start) >= MIN_SEGMENT_LENGTH - 1e-9) color = span.color
    }

    return { length, color }
  })
})

interface RenderedSpan {
  offset: number
  length: number
  color: string
}

const continuousSpans = computed<RenderedSpan[]>(() => {
  const length = trackLength.value
  if (length <= 0) return []

  return fillSpans.value.flatMap((span) => {
    // Continuous spans live on the 2px visual-pixel grid too.
    const start = roundEven(span.start)
    const end = roundEven(span.end)
    const offset = Math.max(0, Math.min(start, end))
    const limit = Math.min(length, Math.max(start, end))
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
  ...(props.boxType === 'none'
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

const continuousStyle = (span: RenderedSpan): CSSProperties => (
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
  const delta = marqueeLastTime ? time - marqueeLastTime : 0
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
