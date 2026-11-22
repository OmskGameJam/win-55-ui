<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import SimpleStringInput from './SimpleStringInput.vue'
import Button from './Button.vue'
import type { BaseInputProps } from './BaseInput.vue'

export type NumberInputVariant = 'plain' | 'updown' | 'touchspin'

// 24px text line + two 6px 9-patch bevels.
const FIELD_HEIGHT = 36
const BEVEL = 6
const MINI_ICON_SIZE = 10
// Two stacked buttons fill the field height; their width is the icon plus both bevels.
const SPIN_BUTTON_WIDTH = MINI_ICON_SIZE + BEVEL * 2
const SPIN_BUTTON_HEIGHT = FIELD_HEIGHT / 2
const TOUCHSPIN_BUTTON_WIDTH = FIELD_HEIGHT
const TOUCHSPIN_BUTTON_HEIGHT = FIELD_HEIGHT

const NUMBER_ALLOW = /[0-9.-]/

const ICONS = {
  up: '/win-55-ui/mini-buttons/up.png',
  down: '/win-55-ui/mini-buttons/down.png',
  plus: '/win-55-ui/mini-buttons/plus.png',
  minus: '/win-55-ui/mini-buttons/minus.png',
}

const props = withDefaults(defineProps<Omit<BaseInputProps, 'allow'> & {
  /** `updown` puts a stacked pair of buttons inside the field; `touchspin` puts one on each side. */
  variant?: NumberInputVariant
  step?: number
  min?: number
  max?: number
}>(), {
  variant: 'plain',
  step: 1,
  min: undefined,
  max: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: []
  keydown: [e: KeyboardEvent]
  beforeinput: [e: InputEvent]
  paste: [e: ClipboardEvent]
  focus: []
  blur: []
}>()

const inputProps = computed<Partial<BaseInputProps>>(() => ({
  placeholder: props.placeholder,
  disabled: props.disabled,
  maxLength: props.maxLength,
  boxType: props.boxType,
  multiline: props.multiline,
  wrap: props.wrap,
}))

// Exact centering often lands on an odd pixel; bias to the upper-left cell of
// the 2x2 center block so the icon stays on the grid.
const evenDown = (value: number) => Math.floor(value / 2) * 2

const buttonContentWidth = computed(() => (
  props.variant === 'touchspin' ? TOUCHSPIN_BUTTON_WIDTH - BEVEL * 2 : SPIN_BUTTON_WIDTH - BEVEL * 2
))

const buttonContentHeight = computed(() => (
  props.variant === 'touchspin' ? TOUCHSPIN_BUTTON_HEIGHT - BEVEL * 2 : SPIN_BUTTON_HEIGHT - BEVEL * 2
))

const fieldStyles = computed<CSSProperties>(() => {
  if (props.variant === 'updown') {
    return { width: '100%', height: `${FIELD_HEIGHT}px` }
  }

  if (props.variant === 'touchspin') {
    return { height: `${FIELD_HEIGHT}px` }
  }

  return { ...props.extraStyles }
})

const updownRootStyles = computed<CSSProperties>(() => ({
  position: 'relative',
  height: `${FIELD_HEIGHT}px`,
  ...props.extraStyles,
}))

const editorStyles = computed<CSSProperties>(() => {
  if (props.variant !== 'updown') return props.editorExtraStyles ?? {}

  return { paddingRight: `${SPIN_BUTTON_WIDTH}px`, ...props.editorExtraStyles }
})

const rootStyles = computed<CSSProperties>(() => ({
  display: 'flex',
  alignItems: 'stretch',
  height: `${FIELD_HEIGHT}px`,
  ...props.extraStyles,
}))

const buttonStyles = computed(() => ({
  width: `${props.variant === 'touchspin' ? TOUCHSPIN_BUTTON_WIDTH : SPIN_BUTTON_WIDTH}px`,
  height: `${props.variant === 'touchspin' ? TOUCHSPIN_BUTTON_HEIGHT : SPIN_BUTTON_HEIGHT}px`,
  paddingBottom: 0,
  paddingRight: 0,
}))

const buttonContentStyles = {
  position: 'relative',
  width: '100%',
  height: '100%',
}

// The glyphs are padded inside their 10x10 canvases: up ink is at the top,
// down ink at the bottom, plus/minus fill the canvas. Align the ink, not the
// image box, so every edge stays on the 2px grid.
const iconStyles = (name: 'up' | 'down' | 'plus' | 'minus'): CSSProperties => {
  const left = evenDown((buttonContentWidth.value - MINI_ICON_SIZE) / 2)
  const top = props.variant === 'touchspin'
    ? evenDown((buttonContentHeight.value - MINI_ICON_SIZE) / 2)
    : name === 'down'
      ? buttonContentHeight.value - MINI_ICON_SIZE
      : 0

  return {
    position: 'absolute',
    left: `${left}px`,
    top: `${top}px`,
    width: `${MINI_ICON_SIZE}px`,
    height: `${MINI_ICON_SIZE}px`,
    display: 'block',
    imageRendering: 'pixelated',
  }
}

const numericValue = computed(() => {
  const parsed = Number.parseFloat(props.modelValue)
  return Number.isFinite(parsed) ? parsed : 0
})

const clamp = (value: number) => Math.min(
  props.max ?? Infinity,
  Math.max(props.min ?? -Infinity, value),
)

const formatNumber = (value: number) => String(Number(value.toFixed(10)))

const stepBy = (direction: number) => {
  const next = clamp(numericValue.value + props.step * direction)
  emit('update:modelValue', formatNumber(next))
}

const canStep = (direction: number) => {
  if (props.disabled) return false

  return clamp(numericValue.value + props.step * direction) !== numericValue.value
}
</script>

<template>
  <div v-if="variant === 'touchspin'" class="number-input-touchspin" :style="rootStyles">
    <Button
      :extra-styles="buttonStyles"
      :content-styles="buttonContentStyles"
      :disabled="!canStep(-1)"
      aria-label="Decrease"
      @click="stepBy(-1)"
    >
      <img :src="ICONS.minus" alt="" draggable="false" :style="iconStyles('minus')" />
    </Button>
    <SimpleStringInput
      class="number-input-field"
      v-bind="inputProps"
      :model-value="modelValue"
      :allow="NUMBER_ALLOW"
      :extra-styles="fieldStyles"
      :editor-extra-styles="editorStyles"
      @update:model-value="emit('update:modelValue', $event)"
      @input="emit('input')"
      @keydown="emit('keydown', $event)"
      @beforeinput="emit('beforeinput', $event)"
      @paste="emit('paste', $event)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
    <Button
      :extra-styles="buttonStyles"
      :content-styles="buttonContentStyles"
      :disabled="!canStep(1)"
      aria-label="Increase"
      @click="stepBy(1)"
    >
      <img :src="ICONS.plus" alt="" draggable="false" :style="iconStyles('plus')" />
    </Button>
  </div>
  <div v-else-if="variant === 'updown'" class="number-input-updown" :style="updownRootStyles">
    <SimpleStringInput
      v-bind="inputProps"
      :model-value="modelValue"
      :allow="NUMBER_ALLOW"
      :extra-styles="fieldStyles"
      :editor-extra-styles="editorStyles"
      @update:model-value="emit('update:modelValue', $event)"
      @input="emit('input')"
      @keydown="emit('keydown', $event)"
      @beforeinput="emit('beforeinput', $event)"
      @paste="emit('paste', $event)"
      @focus="emit('focus')"
      @blur="emit('blur')"
    />
    <div class="number-input-spin">
      <Button
        :extra-styles="buttonStyles"
        :content-styles="buttonContentStyles"
        :disabled="!canStep(1)"
        aria-label="Increase"
        @click="stepBy(1)"
      >
        <img :src="ICONS.up" alt="" draggable="false" :style="iconStyles('up')" />
      </Button>
      <Button
        :extra-styles="buttonStyles"
        :content-styles="buttonContentStyles"
        :disabled="!canStep(-1)"
        aria-label="Decrease"
        @click="stepBy(-1)"
      >
        <img :src="ICONS.down" alt="" draggable="false" :style="iconStyles('down')" />
      </Button>
    </div>
  </div>
  <SimpleStringInput
    v-else
    v-bind="inputProps"
    :model-value="modelValue"
    :allow="NUMBER_ALLOW"
    :extra-styles="fieldStyles"
    :editor-extra-styles="editorStyles"
    @update:model-value="emit('update:modelValue', $event)"
    @input="emit('input')"
    @keydown="emit('keydown', $event)"
    @beforeinput="emit('beforeinput', $event)"
    @paste="emit('paste', $event)"
    @focus="emit('focus')"
    @blur="emit('blur')"
  />
</template>

<style scoped>
.number-input-touchspin {
  position: relative;
}

.number-input-field {
  flex: 1 1 0%;
  min-width: 0;
}

.number-input-spin {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
</style>
