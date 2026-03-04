<script setup lang="ts">
import { computed } from 'vue'
import { typographyStyles, type TypographySettings } from '../helpers/typography'

interface Props extends TypographySettings {
  element?: string
}

const props = withDefaults(defineProps<Props>(), {
  element: undefined,
})

const tag = computed(() => props.element ?? 'span')

const styles = computed(() => {
  const s = typographyStyles(props)
  if (!props.element) {
    s.display = 'contents'
  }
  return s
})
</script>

<template>
  <component :is="tag" :style="styles">
    <slot />
  </component>
</template>
