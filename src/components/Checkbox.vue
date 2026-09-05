<script setup lang="ts">
import { cursorWeakDirective } from '../directives/cursor'

// weak: a consumer's plain v-cursor on <Checkbox> overrides this default (see directives/cursor.ts)
const vCursor = cursorWeakDirective

const props = withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
  value?: string
  checkedIcon?: string
  uncheckedIcon?: string
}>(), {
  label: undefined,
  disabled: false,
  value: undefined,
  checkedIcon: '/win-55-ui/whole-components/checkbox-checked.png',
  uncheckedIcon: '/win-55-ui/whole-components/checkbox-unchecked.png',
})

const emit = defineEmits<{
  'update:modelValue': [checked: boolean]
}>()

const toggleCheckbox = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    :class="['checkbox-container', { disabled }]"
    :style="{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      marginBottom: '2px',
    }"
    v-cursor="disabled ? 'not-allowed' : 'link'"
    @click="toggleCheckbox"
  >
    <div style="display: flex; align-items: center">
      <img 
        draggable="false" 
        :src="modelValue ? checkedIcon : uncheckedIcon"
        :alt="modelValue ? 'checked' : 'unchecked'"
      />
    </div>

    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :value="value"
      style="display: none"
    />

    <span v-if="label">
      {{ label }}
    </span>
  </div>
</template>