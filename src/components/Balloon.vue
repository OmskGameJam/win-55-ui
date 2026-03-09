<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import Box from './Box.vue'

type Side = 'top' | 'bottom' | 'left' | 'right'

const shown = defineModel<boolean>('shown', {
  default: false
})

const props = defineProps<{
  text: string
  side?: Side
}>()

const side = computed(() => props.side ?? 'top')

const tooltipStyle = computed(() => {
  switch (side.value) {
    case 'top':
      return {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
      }

    case 'bottom':
      return {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
      }

    case 'left':
      return {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)'
      }

    case 'right':
      return {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
      }

    default:
      return {}
  }
})

// eslint-disable-next-line vue/return-in-computed-property
const flexDirection = computed<CSSProperties['flexDirection']>(() => {
  switch (side.value) {
    case 'top':
      return 'column'
    case 'bottom':
      return 'column-reverse'
    case 'left':
      return 'row'
    case 'right':
      return 'row-reverse'
  }
})

const tipRotation = computed(() => {
  switch (side.value) {
    case 'top':
      return 'rotate(0deg)'
    case 'bottom':
      return 'rotate(180deg)'
    case 'left':
      return 'rotate(-90deg)'
    case 'right':
      return 'rotate(90deg) scaleX(-1)'
    default:
      return ''
  }
})
</script>

<template>
  <div class="tooltip-wrapper">
    <slot />

    <div
      v-if="shown"
      class="tooltip"
      :style="tooltipStyle"
    >
      <div
        class="tooltip-inner"
        :style="{ flexDirection }"
      >
        <Box type="notification">
          {{ text }}
        </Box>

        <div class="tooltip-tip-box">
          <img
            class="tooltip-tip"
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

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  /* pointer-events: none; */
  z-index: 1000;
}

.tooltip-inner {
  display: flex;
  align-items: center;
}

.tooltip-tip-box {
  width: 28px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: -2px;
  flex-shrink: 0;
}

.tooltip-tip {
  display: block;
}
</style>