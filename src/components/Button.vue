<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, type CSSProperties } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { cursorWeakDirective } from '../directives/cursor'

// weak: a consumer's plain v-cursor overrides this default.
const vCursor = cursorWeakDirective

const props = withDefaults(defineProps<{
  boxType?: BoxType
  extraStyles?: CSSProperties
  extraClass?: string
  /** Styles for the pressed-offset wrapper inside the bevel. */
  contentStyles?: CSSProperties
  disabled?: boolean
}>(), {
  boxType: 'panel-d-1',
  extraStyles: undefined,
  extraClass: undefined,
  contentStyles: undefined,
  disabled: false,
})

const emit = defineEmits<{
  /** Activation event (mouse released inside the button); no payload, not the native DOM event. */
  click: []
}>()

const isMouseDown = ref(false)
const isInside = ref(false)

const pressed = computed(() => !props.disabled && isMouseDown.value && isInside.value)
const isDisabled = computed(() => props.disabled)

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled || e.button !== 0) return
  isMouseDown.value = true
  isInside.value = true
}

const handleMouseEnter = () => { 
  if (!props.disabled) {
    isInside.value = true 
  }
}

const handleMouseLeave = () => { isInside.value = false }

const handleWindowMouseUp = (e: MouseEvent) => {
  if (props.disabled || e.button !== 0) return
  if (isMouseDown.value && isInside.value) {
    emit('click')
  }
  isMouseDown.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', handleWindowMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleWindowMouseUp)
})

const boxStyle = computed(() => ({
  userSelect: 'none' as const,
  width: 'fit-content',
  paddingBottom: '4px',
  paddingRight: '4px',
  ...props.extraStyles,
}))

const innerStyle = computed(() => ({
  transform: pressed.value ? 'translate(2px, 2px)' : 'translate(0, 0)',
  opacity: isDisabled.value ? 0.5 : 1,
}))

const resolvedBoxType = computed(() => {
  return pressed.value ? 'indent' : props.boxType
})
</script>

<template>
  <Box
    :type="resolvedBoxType"
    :extra-styles="boxStyle"
    :extra-class="extraClass"
    v-cursor="isDisabled ? 'not-allowed' : 'default'"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div :style="[innerStyle, contentStyles]">
      <slot />
    </div>
  </Box>
</template>
