<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'

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

const style = computed<CSSProperties>(() => ({
  '--img': `url(/public/win-55-ui/${props.type}.png)`,
  ...props.extraStyles,
} as CSSProperties))
</script>

<template>
  <div
    :class="['border-9-base', extraClass ?? '']"
    :style="style"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
