<script setup lang="ts">
import { computed, type CSSProperties, useSlots, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import Box from './Box.vue'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Bias = 'left' | 'right' | 'up' | 'down'

const shown = defineModel<boolean>('shown', {
  default: false
})

export interface AnchorPoint {
  x: number
  y: number
}

export interface AnchorRect {
  top: number
  bottom: number
  left: number
  right: number
}

export type Anchor = AnchorPoint | AnchorRect

function isAnchorRect(anchor: Anchor): anchor is AnchorRect {
  return 'top' in anchor
}

/** A plain point has no edges of its own, so top/bottom/left/right all collapse to it. */
function normalizeAnchor(anchor: Anchor): AnchorRect {
  return isAnchorRect(anchor) ? anchor : { top: anchor.y, bottom: anchor.y, left: anchor.x, right: anchor.x }
}

const props = defineProps<{
  text?: string
  side?: Side
  bias?: Bias
  /** Viewport point or rect to anchor to, instead of the default slot's trigger element. */
  anchor?: Anchor
}>()

const slots = useSlots()
const side = computed(() => props.side ?? 'top')
const bias = computed(() => props.bias)

/* In anchor mode, the requested side can flip to avoid viewport overflow;
   everything else (tip rotation, bias, layout direction) reacts to whichever
   side is actually in effect. */
const resolvedAnchorSide = ref<Side>(side.value)
const activeSide = computed(() => (props.anchor ? resolvedAnchorSide.value : side.value))

const balloonStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  switch (side.value) {
    case 'top':
      style.bottom = '100%'
      style.left = '50%'
      style.transform = 'translateX(-50%)'
      break

    case 'bottom':
      style.top = '100%'
      style.left = '50%'
      style.transform = 'translateX(-50%)'
      break

    case 'left':
      style.right = '100%'
      style.top = '50%'
      style.transform = 'translateY(-50%)'
      break

    case 'right':
      style.left = '100%'
      style.top = '50%'
      style.transform = 'translateY(-50%)'
      break
  }

  return style
})

// eslint-disable-next-line vue/return-in-computed-property
const flexDirection = computed<CSSProperties['flexDirection']>(() => {
  switch (activeSide.value) {
    case 'top': return 'column'
    case 'bottom': return 'column-reverse'
    case 'left': return 'row'
    case 'right': return 'row-reverse'
  }
})

const tipRotation = computed(() => {
  let rotation = ''
  let flip = false

  switch (activeSide.value) {
    case 'top':
      rotation = 'rotate(0deg)'
      if (bias.value === 'right') flip = true
      break
    case 'bottom':
      rotation = 'rotate(180deg)'
      if (bias.value === 'left') flip = true
      break
    case 'left':
      rotation = 'rotate(-90deg)'
      break
    case 'right':
      rotation = 'rotate(90deg)'
      flip = true
      break
  }

  return flip ? `${rotation} scaleX(-1)` : rotation
})
const boxBiasStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  if (!bias.value) return {}

  if (activeSide.value === 'top' || activeSide.value === 'bottom') {
    if (bias.value === 'left') style.transform = `translateX(calc(-50% + 28px))`
    if (bias.value === 'right') style.transform = `translateX(calc(50% - 28px))`
  }

  if (activeSide.value === 'left' || activeSide.value === 'right') {
    if (bias.value === 'up') style.transform = `translateY(calc(-50% + 28px))`
    if (bias.value === 'down') style.transform = `translateY(calc(50% - 28px))`
  }


  return style
})

/* --- anchor mode: JS-computed viewport position, Teleported to body --- */
const VIEWPORT_MARGIN = 8

const anchoredRef = ref<HTMLDivElement | null>(null)
const anchoredPosition = ref<{ top: number; left: number } | null>(null)

const OPPOSITE_SIDE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
const PERPENDICULAR_SIDES: Record<Side, [Side, Side]> = {
  top: ['left', 'right'],
  bottom: ['left', 'right'],
  left: ['top', 'bottom'],
  right: ['top', 'bottom'],
}

function fitsOnSide(
  side: Side,
  anchor: AnchorRect,
  rect: DOMRect,
  viewportWidth: number,
  viewportHeight: number,
): boolean {
  switch (side) {
    case 'top': return anchor.top - rect.height >= VIEWPORT_MARGIN
    case 'bottom': return anchor.bottom + rect.height <= viewportHeight - VIEWPORT_MARGIN
    case 'left': return anchor.left - rect.width >= VIEWPORT_MARGIN
    case 'right': return anchor.right + rect.width <= viewportWidth - VIEWPORT_MARGIN
  }
}

function calculateAnchoredPosition() {
  const balloonEl = anchoredRef.value

  if (!props.anchor || !balloonEl) return

  const anchor = normalizeAnchor(props.anchor)
  const rect = balloonEl.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const requestedSide = props.side ?? 'top'

  /* Try the requested side, then its opposite, then the two perpendicular
     sides. First one that fits wins; if none do, give up and use the
     requested side anyway rather than clamping/repositioning to force a fit. */
  const candidates: Side[] = [
    requestedSide,
    OPPOSITE_SIDE[requestedSide],
    ...PERPENDICULAR_SIDES[requestedSide],
  ]
  const resolved = candidates.find((candidate) =>
    fitsOnSide(candidate, anchor, rect, viewportWidth, viewportHeight)) ?? requestedSide

  const centerX = (anchor.left + anchor.right) / 2
  const centerY = (anchor.top + anchor.bottom) / 2
  let top: number
  let left: number

  /* Each side anchors to the matching edge of the rect (e.g. flipping to
     "bottom" anchors to the rect's bottom edge, not its top), so the balloon
     never overlaps the thing it's pointing at. */
  if (resolved === 'top' || resolved === 'bottom') {
    top = resolved === 'top' ? anchor.top - rect.height : anchor.bottom
    left = centerX - rect.width / 2
  } else {
    left = resolved === 'left' ? anchor.left - rect.width : anchor.right
    top = centerY - rect.height / 2
  }

  resolvedAnchorSide.value = resolved
  anchoredPosition.value = { top, left }
}

watch(
  [() => props.anchor, shown],
  async ([anchor, isShown]) => {
    if (!anchor || !isShown) return

    await nextTick()
    calculateAnchoredPosition()
  },
  { deep: true, immediate: true },
)

const handleWindowChange = () => {
  if (props.anchor && shown.value) {
    calculateAnchoredPosition()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowChange)
  window.addEventListener('scroll', handleWindowChange, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowChange)
  window.removeEventListener('scroll', handleWindowChange, true)
})
</script>

<template>
  <Teleport v-if="anchor" to="body">
    <div
      v-if="shown"
      ref="anchoredRef"
      class="balloon-anchored"
      :style="{
        top: (anchoredPosition?.top ?? 0) + 'px',
        left: (anchoredPosition?.left ?? 0) + 'px',
      }"
    >
      <div class="balloon-inner" :style="{ flexDirection }">
        <div class="balloon-box-wrapper" :style="boxBiasStyle">
          <Box type="notification" :extra-styles="{ whiteSpace: 'pre' }">
            <template v-if="slots.content">
              <slot name="content" />
            </template>
            <template v-else>
              {{ text }}
            </template>
          </Box>
        </div>

        <div class="balloon-tip-box">
          <img
            class="balloon-tip"
            src="/win-55-ui/balloon-tip.png"
            :style="{ transform: tipRotation }"
            width="18"
            height="28"
          />
        </div>
      </div>
    </div>
  </Teleport>

  <div v-else class="balloon-wrapper">
    <slot />

    <div v-if="shown" class="balloon" :style="balloonStyle">
      <div class="balloon-inner" :style="{ flexDirection }">

        <!-- Wrap the Box to apply bias translation -->
        <div class="balloon-box-wrapper" :style="boxBiasStyle">
          <Box type="notification" :extra-styles="{  whiteSpace: 'pre' }">
            <template v-if="slots.content">
              <slot name="content" />
            </template>
            <template v-else>
              {{ text }}
            </template>
          </Box>
        </div>

        <div class="balloon-tip-box">
          <img
            class="balloon-tip"
            src="/win-55-ui/balloon-tip.png"
            :style="{ transform: tipRotation }"
            width="18"
            height="28"
          />
        </div>
      </div>
    </div>
  </div>
</template>
