<script setup lang="ts">
import { ref, watch, type CSSProperties, computed } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { typographyStyles } from '../helpers/typography'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  boxType?: BoxType
  extraStyles?: CSSProperties
}>(), {
  placeholder: '',
  disabled: false,
  maxLength: undefined,
  boxType: 'textarea',
  extraStyles: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const boxRef = ref<InstanceType<typeof Box> | null>(null)
const el = computed(() => boxRef.value?.el ?? null)

// Update content when modelValue prop changes externally
watch(() => props.modelValue, (newVal) => {
  if (el.value && el.value.innerText !== newVal) {
    el.value.innerText = newVal
  }
})

const handleInput = () => {
  if (!el.value) return

  let newValue = el.value.innerText || ''

  // Apply maxLength if specified
  if (props.maxLength && newValue.length > props.maxLength) {
    newValue = newValue.slice(0, props.maxLength)
    el.value.innerText = newValue
    // Place cursor at the end
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el.value)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  emit('update:modelValue', newValue)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
  }
  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''

  if (!el.value) return

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)

  if (range) {
    range.deleteContents()
    const textNode = document.createTextNode(text)
    range.insertNode(textNode)
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  handleInput()
}

const handleBlur = () => {
  if (el.value && el.value.innerText === '') {
    el.value.innerHTML = ''
  }
}

const combinedStyles = computed<CSSProperties>(() => ({
  ...props.extraStyles,
  ...typographyStyles({ fontColor: 'black' }),
}))

defineExpose({ el })
</script>

<template>
  <Box
    ref="boxRef"
    :type="boxType"
    :contenteditable="!disabled"
    :extra-styles="combinedStyles"
    :data-placeholder="placeholder"
    role="textbox"
    aria-multiline="false"
    :aria-disabled="disabled"
    @input="handleInput"
    @keydown="handleKeyDown"
    @paste="handlePaste"
    @blur="handleBlur"
  />
</template>
