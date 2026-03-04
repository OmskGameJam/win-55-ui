<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Box, { type BoxType } from './Box.vue'
import Typography from './Typography.vue'

const props = withDefaults(defineProps<{
  baseType?: BoxType
  extraStyles?: Record<string, string | number | undefined>
  extraClass?: string
}>(), {
  baseType: 'panel-d-1',
  extraStyles: undefined,
  extraClass: undefined,
})

const emit = defineEmits<{
  click: []
}>()

const isMouseDown = ref(false)
const isInside = ref(false)

const pressed = computed(() => isMouseDown.value && isInside.value)

const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  isMouseDown.value = true
  isInside.value = true
}

const handleMouseEnter = () => { isInside.value = true }
const handleMouseLeave = () => { isInside.value = false }

const handleWindowMouseUp = (e: MouseEvent) => {
  if (e.button !== 0) return
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
  cursor: 'default',
  ...props.extraStyles,
}))

const innerStyle = computed(() => ({
  transform: pressed.value ? 'translate(2px, 2px)' : 'translate(0, 0)',
}))
</script>

<template>
  <Box
    :type="pressed ? 'indent' : baseType"
    :extra-styles="boxStyle"
    :extra-class="extraClass"
    @mousedown="handleMouseDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div :style="innerStyle">
      <Typography font-color="black" :font-size="12" font-shadow-color="#a5a5a5">
        <slot />
      </Typography>
    </div>
  </Box>
</template>
