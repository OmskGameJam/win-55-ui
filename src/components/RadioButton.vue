<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  target: unknown
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
  change: [value: unknown]
}>()

const isChecked = computed(() => props.target === props.value)

const handleClick = (e: MouseEvent) => {
  e.preventDefault()
  if (props.disabled) return
  if (!isChecked.value) {
    emit('change', props.value)
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
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      marginBottom: '2px',
    }"
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

    <span v-if="label" :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }">
      {{ label }}
    </span>
  </div>
</template>
