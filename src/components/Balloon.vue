<script setup lang="ts">
import { computed, type CSSProperties, useSlots } from 'vue'
import Box from './Box.vue'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Bias = 'left' | 'right' | 'up' | 'down'

const shown = defineModel<boolean>('shown', {
  default: false
})

const props = defineProps<{
  text?: string
  side?: Side
  bias?: Bias
}>()

const slots = useSlots()
const side = computed(() => props.side ?? 'top')
const bias = computed(() => props.bias)

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
  switch (side.value) {
    case 'top': return 'column'
    case 'bottom': return 'column-reverse'
    case 'left': return 'row'
    case 'right': return 'row-reverse'
  }
})

const tipRotation = computed(() => {
  let rotation = ''
  let flip = false

  switch (side.value) {
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

  if (side.value === 'top' || side.value === 'bottom') {
    if (bias.value === 'left') style.transform = `translateX(calc(-50% + 28px))`
    if (bias.value === 'right') style.transform = `translateX(calc(50% - 28px))`
  }

  if (side.value === 'left' || side.value === 'right') {
    if (bias.value === 'up') style.transform = `translateY(calc(-50% + 28px))`
    if (bias.value === 'down') style.transform = `translateY(calc(50% - 28px))`
  }


  return style
})

</script>

<template>
  <div class="balloon-wrapper">
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