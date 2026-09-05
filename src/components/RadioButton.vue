<script setup lang="ts">
import { computed } from 'vue'
import { cursorWeakDirective } from '../directives/cursor'

// weak: a consumer's plain v-cursor on <RadioButton> overrides this default (see directives/cursor.ts)
const vCursor = cursorWeakDirective

const props = withDefaults(defineProps<{
  modelValue: unknown
  value: unknown
  label?: string
  disabled?: boolean
  name?: string
  checkedIcon?: string
  uncheckedIcon?: string
}>(), {
  label: undefined,
  disabled: false,
  name: undefined,
  checkedIcon: '/win-55-ui/whole-components/radio-checked.png',
  uncheckedIcon: '/win-55-ui/whole-components/radio-unchecked.png',
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const isChecked = computed(() => props.modelValue === props.value)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  if (props.disabled) return
  if (!isChecked.value) {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <div
    :class="['radio-container', { disabled }]"
    :style="{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      marginBottom: '2px',
    }"
    v-cursor="disabled ? 'not-allowed' : 'link'"
    @click="handleClick"
  >
    <div style="display: flex; align-items: center">
      <img v-if="isChecked" draggable="false" :src="checkedIcon" />
      <img v-else draggable="false" :src="uncheckedIcon" />
    </div>

    <input
      type="radio"
      :checked="isChecked"
      :disabled="disabled"
      :value="value"
      :name="name"
      style="display: none"
    />

    <span v-if="label">
      {{ label }}
    </span>
  </div>
</template>
