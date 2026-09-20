<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const LINE_STEP = 32
const REPEAT_DELAY = 500
const REPEAT_INTERVAL = 50
const MIN_THUMB = 28

const props = defineProps<{
  orientation: 'vertical' | 'horizontal'
  scrollPos: number
  viewportSize: number
  contentSize: number
}>()

const emit = defineEmits<{
  scrollTo: [pos: number]
  scrollBy: [delta: number]
}>()

const isVertical = computed(() => props.orientation === 'vertical')
const startName = computed(() => (isVertical.value ? 'up' : 'left'))
const endName = computed(() => (isVertical.value ? 'down' : 'right'))
const buttonSrc = (name: string, pressed: boolean) =>
  `/win-55-ui/whole-components/scrollbar-buttons/btn-${name}${pressed ? '-pressed' : ''}.png`

const trackRef = ref<HTMLDivElement | null>(null)
const trackLen = ref(0)
let resizeObserver: ResizeObserver | null = null

function measureTrack() {
  const el = trackRef.value
  if (el) trackLen.value = isVertical.value ? el.offsetHeight : el.offsetWidth
}

onMounted(() => {
  measureTrack()
  resizeObserver = new ResizeObserver(measureTrack)
  if (trackRef.value) resizeObserver.observe(trackRef.value)
})

const maxScroll = computed(() => props.contentSize - props.viewportSize)
const enabled = computed(() => maxScroll.value > 0)

const even = (v: number) => Math.round(v / 2) * 2

const thumbLen = computed(() => {
  if (!enabled.value) return 0
  const ideal = even((trackLen.value * props.viewportSize) / props.contentSize)
  return Math.min(trackLen.value, Math.max(MIN_THUMB, ideal))
})

const thumbPos = computed(() => {
  const range = trackLen.value - thumbLen.value
  if (!enabled.value || range <= 0) return 0
  return Math.min(range, Math.max(0, even((props.scrollPos / maxScroll.value) * range)))
})

const showNubs = computed(() => thumbLen.value > 50)

const thumbStyle = computed(() =>
  isVertical.value
    ? { height: `${thumbLen.value}px`, transform: `translateY(${thumbPos.value}px)` }
    : { width: `${thumbLen.value}px`, transform: `translateX(${thumbPos.value}px)` },
)

let repeatTimer = 0

function stopRepeat() {
  clearTimeout(repeatTimer)
}

function startRepeat(action: () => void) {
  stopRepeat()
  action()
  repeatTimer = window.setTimeout(function tick() {
    action()
    repeatTimer = window.setTimeout(tick, REPEAT_INTERVAL)
  }, REPEAT_DELAY)
}

onBeforeUnmount(() => {
  stopRepeat()
  resizeObserver?.disconnect()
})

const pressed = ref<'start' | 'end' | null>(null)

function onArrowDown(e: PointerEvent, side: 'start' | 'end') {
  if (e.button !== 0) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  pressed.value = side
  startRepeat(() => emit('scrollBy', side === 'start' ? -LINE_STEP : LINE_STEP))
}

function onArrowUp() {
  pressed.value = null
  stopRepeat()
}

const clientAlong = (e: PointerEvent) => (isVertical.value ? e.clientY : e.clientX)

let trackPointer = 0
let trackHeld = false

function alongTrack(e: PointerEvent): number {
  const el = trackRef.value!
  const rect = el.getBoundingClientRect()
  return isVertical.value ? e.clientY - rect.top : e.clientX - rect.left
}

function onTrackDown(e: PointerEvent) {
  if (e.button !== 0 || !enabled.value) return
  trackRef.value!.setPointerCapture(e.pointerId)
  trackHeld = true
  trackPointer = alongTrack(e)
  startRepeat(() => {
    const page = Math.max(2, props.viewportSize - LINE_STEP)
    if (trackPointer < thumbPos.value) emit('scrollBy', -page)
    else if (trackPointer > thumbPos.value + thumbLen.value) emit('scrollBy', page)
  })
}

function onTrackMove(e: PointerEvent) {
  if (trackHeld) trackPointer = alongTrack(e)
}

function onTrackUp() {
  trackHeld = false
  stopRepeat()
}

let drag: { start: number; startScroll: number } | null = null

function onThumbDown(e: PointerEvent) {
  if (e.button !== 0) return
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  drag = { start: clientAlong(e), startScroll: props.scrollPos }
}

function onThumbMove(e: PointerEvent) {
  if (!drag) return
  const range = trackLen.value - thumbLen.value
  if (range <= 0) return
  emit('scrollTo', drag.startScroll + ((clientAlong(e) - drag.start) * maxScroll.value) / range)
}

function onThumbUp() {
  drag = null
}
</script>

<template>
  <div :class="['win55-scrollbar', orientation]" aria-hidden="true">
    <div
      class="sb-button"
      @pointerdown="onArrowDown($event, 'start')"
      @pointerup="onArrowUp"
      @pointercancel="onArrowUp"
    >
      <img :src="buttonSrc(startName, false)" v-show="pressed !== 'start'" draggable="false" />
      <img :src="buttonSrc(startName, true)" v-show="pressed === 'start'" draggable="false" />
    </div>
    <div
      ref="trackRef"
      class="sb-track"
      @pointerdown="onTrackDown"
      @pointermove="onTrackMove"
      @pointerup="onTrackUp"
      @pointercancel="onTrackUp"
    >
      <div
        v-if="enabled"
        class="sb-thumb"
        :style="thumbStyle"
        @pointerdown.stop="onThumbDown"
        @pointermove="onThumbMove"
        @pointerup="onThumbUp"
        @pointercancel="onThumbUp"
      >
        <div v-if="showNubs" class="sb-nubs" />
      </div>
    </div>
    <div
      class="sb-button"
      @pointerdown="onArrowDown($event, 'end')"
      @pointerup="onArrowUp"
      @pointercancel="onArrowUp"
    >
      <img :src="buttonSrc(endName, false)" v-show="pressed !== 'end'" draggable="false" />
      <img :src="buttonSrc(endName, true)" v-show="pressed === 'end'" draggable="false" />
    </div>
  </div>
</template>

<style scoped>
.win55-scrollbar {
  display: flex;
  user-select: none;
  touch-action: none;
}

.win55-scrollbar.vertical {
  flex-direction: column;
  width: 28px;
}

.win55-scrollbar.horizontal {
  flex-direction: row;
  height: 28px;
}

.sb-button {
  flex: none;
  width: 28px;
  height: 28px;
}

.sb-button img {
  display: block;
  width: 28px;
  height: 28px;
  image-rendering: pixelated;
}

.sb-track {
  flex: 1;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  position: relative;
  border: 6px solid transparent;
  border-image: url(/win-55-ui/indent-dark.png) 6 fill repeat;
  image-rendering: pixelated;
}

.sb-thumb {
  position: absolute;
  top: -6px;
  left: -6px;
  box-sizing: border-box;
  border: 8px solid transparent;
  image-rendering: pixelated;
}

.sb-nubs {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  image-rendering: pixelated;
}

.vertical .sb-nubs {
  width: 14px;
  height: 18px;
  margin: -9px 0 0 -7px;
  background: url(/win-55-ui/scrollbar-thumb-nub-v.png) repeat-y;
}

.horizontal .sb-nubs {
  width: 18px;
  height: 14px;
  margin: -7px 0 0 -9px;
  background: url(/win-55-ui/scrollbar-thumb-nub-h.png) repeat-x;
}

.vertical .sb-thumb {
  width: calc(100% + 12px);
  border-image: url(/win-55-ui/scroll-thumb-v.png) 8 fill repeat;
}

.horizontal .sb-thumb {
  height: calc(100% + 12px);
  border-image: url(/win-55-ui/scroll-thumb-h.png) 8 fill repeat;
}
</style>
