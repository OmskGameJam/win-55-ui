<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import Typography from './Typography.vue'
import type { TypographySettings } from '../helpers/typography'

interface Props extends Omit<TypographySettings, 'fontColor'> {
  text?: string
  /** Size, in px, of one checkerboard square. */
  cellSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  text: 'The quick brown fox jumps over the lazy dog',
  cellSize: 2,
})

const typographySettings = computed<TypographySettings>(() => ({
  fontSize: props.fontSize,
  isBold: props.isBold,
  isItalic: props.isItalic,
  shorthand: props.shorthand,
  fontShadowColor: props.fontShadowColor,
  fontName: props.fontName,
  fontColor: '#FFFFFF',
}))

const checkerboardStyle = computed<CSSProperties>(() => ({
  backgroundImage: [
    'linear-gradient(45deg, #800080 25%, transparent 25%, transparent 75%, #800080 75%, #800080)',
    'linear-gradient(45deg, #800080 25%, #FFFF00 25%, #FFFF00 75%, #800080 75%, #800080)',
  ].join(', '),
  backgroundSize: `${props.cellSize * 2}px ${props.cellSize * 2}px`,
  backgroundPosition: `0 0, ${props.cellSize}px ${props.cellSize}px`,
}))
</script>

<template>
  <div class="font-tester" :style="checkerboardStyle">
    <Typography element="span" class="font-tester-text" v-bind="typographySettings">{{ text }}</Typography>
  </div>
</template>

<style scoped>
.font-tester {
  display: inline-block;
  position: relative;
}

.font-tester-text {
  display: block;
  margin: 0;
  padding: 0;
  line-height: 1;
  white-space: nowrap;
}
</style>
