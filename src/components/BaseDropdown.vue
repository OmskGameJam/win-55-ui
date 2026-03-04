<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  matchTriggerWidth?: boolean
}>(), {
  matchTriggerWidth: false,
})

const open = ref(false)
const position = ref<{ top: number; left: number; width?: number } | null>(null)

const triggerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)

const calculatePosition = () => {
  const triggerEl = triggerRef.value
  const dropdownEl = dropdownRef.value
  if (!triggerEl || !dropdownEl) return

  const rect = triggerEl.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = dropdownEl.offsetHeight

  let top = rect.bottom + window.scrollY
  const left = rect.left + window.scrollX

  const wouldOverflow = rect.bottom + dropdownHeight > viewportHeight

  if (wouldOverflow) {
    top = rect.top + window.scrollY - dropdownHeight
  }

  position.value = {
    top,
    left,
    width: props.matchTriggerWidth ? rect.width : undefined,
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    calculatePosition()
  }
})

const handleResizeScroll = () => {
  if (open.value) calculatePosition()
}

onMounted(() => {
  window.addEventListener('resize', handleResizeScroll)
  window.addEventListener('scroll', handleResizeScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeScroll)
  window.removeEventListener('scroll', handleResizeScroll)
})

const toggleOpen = () => {
  open.value = !open.value
}
</script>

<template>
  <div ref="triggerRef" style="display: inline-block" @click="toggleOpen">
    <slot name="trigger" />
  </div>

  <Teleport to="body">
    <div
      v-if="open"
      ref="dropdownRef"
      :style="{
        position: 'absolute',
        top: (position?.top ?? 0) + 'px',
        left: (position?.left ?? 0) + 'px',
        width: matchTriggerWidth ? (position?.width ?? 'auto') + 'px' : 'auto',
      }"
    >
      <slot name="items" />
    </div>
  </Teleport>
</template>
