<script setup lang="ts">
withDefaults(defineProps<{
  checked: boolean
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
  change: [checked: boolean]
}>()

const toggleCheckbox = (checked: boolean, disabled: boolean) => {
  if (disabled) return
  emit('change', !checked)
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
    @click="toggleCheckbox(checked, disabled)"
  >
    <div style="display: flex; align-items: center">
      <img v-if="checked" draggable="false" :src="checkedIcon" />
      <img v-else draggable="false" :src="uncheckedIcon" />
    </div>

    <input
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      :value="value"
      style="display: none"
    />

    <span v-if="label" :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }">
      {{ label }}
    </span>
  </div>
</template>
