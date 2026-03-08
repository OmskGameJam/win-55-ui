<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'

export type BoxType =
  | 'indent'
  | 'panel-d-1'
  | 'panel-d-2'
  | 'textarea'
  | 'border-groove'

const props = defineProps<{
  type: BoxType
  extraStyles?: CSSProperties
  extraClass?: string
}>()

const rootRef = ref<HTMLDivElement | null>(null)

const style = computed<CSSProperties>(() => ({
  '--img': `url(/win-55-ui/${props.type}.png)`,
  ...props.extraStyles,
} as CSSProperties))

defineExpose({ el: rootRef })
</script>

<template>
  <div
    ref="rootRef"
    :class="['border-9-base', extraClass ?? '']"
    :style="style"
  >
    <slot />
  </div>
</template>
