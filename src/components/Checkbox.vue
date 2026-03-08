<script setup lang="ts">
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
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      marginBottom: '2px',
    }"
    @click="toggleCheckbox"
  >
    <div style="display: flex; align-items: center">
      <img v-if="modelValue" draggable="false" :src="checkedIcon" />
      <img v-else draggable="false" :src="uncheckedIcon" />
    </div>

    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :value="value"
      style="display: none"
    />

    <span v-if="label" :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }">
      {{ label }}
    </span>
  </div>
</template>
