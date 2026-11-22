<script setup lang="ts">
import { computed } from 'vue'
import BaseInput, { type BaseInputProps } from './BaseInput.vue'
import { EMOJI_PATTERN } from '../helpers/inputFilters'

const props = defineProps<BaseInputProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: []
  keydown: [e: KeyboardEvent]
  beforeinput: [e: InputEvent]
  paste: [e: ClipboardEvent]
  focus: []
  blur: []
}>()

const denyPattern = computed(() =>
  props.deny ? new RegExp(`${EMOJI_PATTERN.source}|${props.deny.source}`, 'u') : EMOJI_PATTERN)
</script>

<template>
  <BaseInput
    v-bind="props"
    :deny="denyPattern"
    @update:model-value="emit('update:modelValue', $event)"
    @input="emit('input')"
    @keydown="emit('keydown', $event)"
    @beforeinput="emit('beforeinput', $event)"
    @paste="emit('paste', $event)"
    @focus="emit('focus')"
    @blur="emit('blur')"
  >
    <slot />
  </BaseInput>
</template>
