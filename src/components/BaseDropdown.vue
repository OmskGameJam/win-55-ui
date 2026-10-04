<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, inject, provide } from 'vue'
import { DROPDOWN_CONTEXT_KEY, type DropdownNode } from '../helpers/dropdownContext'

const props = withDefaults(defineProps<{
  matchTriggerWidth?: boolean
}>(), {
  matchTriggerWidth: false,
})

// Uncontrolled by default; bind `v-model:open` to drive it (e.g. close on item select).
const open = defineModel<boolean>('open', { default: false })
const position = ref<{ top: number; left: number; width?: number } | null>(null)

const HOVER_OPEN_DELAY_MS = 200

const parent = inject(DROPDOWN_CONTEXT_KEY, null)
const isSubmenu = parent !== null

const children = new Set<DropdownNode>()
let activeChildClose: (() => void) | null = null

provide(DROPDOWN_CONTEXT_KEY, {
  registerChild: (child) => {
    children.add(child)
    return () => children.delete(child)
  },
  claimActive: (close) => {
    if (activeChildClose && activeChildClose !== close) activeChildClose()
    activeChildClose = close
    return () => {
      if (activeChildClose === close) activeChildClose = null
    }
  },
})

const triggerRef = ref<HTMLDivElement | null>(null)
const dropdownRef = ref<HTMLDivElement | null>(null)

const calculatePosition = () => {
  const triggerEl = triggerRef.value
  const dropdownEl = dropdownRef.value
  if (!triggerEl || !dropdownEl) return

  const rect = triggerEl.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const dropdownHeight = dropdownEl.offsetHeight

  let top: number
  let left: number

  if (isSubmenu) {
    const dropdownWidth = dropdownEl.offsetWidth
    top = rect.top + window.scrollY
    left = rect.right + window.scrollX
    if (rect.top + dropdownHeight > viewportHeight) {
      top = Math.max(0, viewportHeight - dropdownHeight) + window.scrollY
    }
    if (rect.right + dropdownWidth > window.innerWidth) {
      left = rect.left + window.scrollX - dropdownWidth
    }
  } else {
    top = rect.bottom + window.scrollY
    left = rect.left + window.scrollX
    if (rect.bottom + dropdownHeight > viewportHeight) {
      top = rect.top + window.scrollY - dropdownHeight
    }
  }

  position.value = {
    top,
    left,
    width: props.matchTriggerWidth ? rect.width : undefined,
  }
}

let releaseActive: (() => void) | null = null

watch(open, async (isOpen) => {
  if (isOpen) {
    releaseActive = parent?.claimActive(() => { open.value = false }) ?? null
    await nextTick()
    calculatePosition()
  } else {
    releaseActive?.()
    releaseActive = null
  }
})

const containsTarget = (node: Node): boolean =>
  !!triggerRef.value?.contains(node)
  || !!dropdownRef.value?.contains(node)
  || [...children].some((child) => child.containsTarget(node))

const unregisterFromParent = parent?.registerChild({ containsTarget })

let hoverTimer: ReturnType<typeof setTimeout> | undefined

const handleTriggerEnter = () => {
  if (!isSubmenu || open.value) return
  hoverTimer = setTimeout(() => { open.value = true }, HOVER_OPEN_DELAY_MS)
}

const handleTriggerLeave = () => clearTimeout(hoverTimer)

const handleResizeScroll = () => {
  if (open.value) calculatePosition()
}

const handleClickOutside = (e: MouseEvent) => {
  if (!open.value) return
  if (containsTarget(e.target as Node)) return
  open.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleResizeScroll)
  window.addEventListener('scroll', handleResizeScroll)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResizeScroll)
  window.removeEventListener('scroll', handleResizeScroll)
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(hoverTimer)
  releaseActive?.()
  unregisterFromParent?.()
})

const toggleOpen = () => {
  open.value = isSubmenu ? true : !open.value
}
</script>

<template>
  <div
    ref="triggerRef"
    :style="{ display: isSubmenu ? 'block' : 'inline-block' }"
    @click.stop="toggleOpen"
    @mouseenter="handleTriggerEnter"
    @mouseleave="handleTriggerLeave"
  >
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
