<script setup lang="ts">
import { ref, watch, type CSSProperties, computed } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { typographyStyles } from '../helpers/typography'

const props = withDefaults(defineProps<{
  value: string
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
  change: [value: string]
}>()

const internalRef = ref<HTMLDivElement | null>(null)

// Update content when value prop changes externally
watch(() => props.value, (newVal) => {
  if (internalRef.value && internalRef.value.innerText !== newVal) {
    internalRef.value.innerText = newVal
  }
})

const handleInput = () => {
  if (!internalRef.value) return

  let newValue = internalRef.value.innerText || ''

  // Apply maxLength if specified
  if (props.maxLength && newValue.length > props.maxLength) {
    newValue = newValue.slice(0, props.maxLength)
    internalRef.value.innerText = newValue
    // Place cursor at the end
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(internalRef.value)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  emit('change', newValue)
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

  if (!internalRef.value) return

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
  if (internalRef.value && internalRef.value.innerText === '') {
    internalRef.value.innerHTML = ''
  }
}

const combinedStyles = computed<CSSProperties>(() => ({
  ...props.extraStyles,
  ...typographyStyles({ fontColor: 'black' }),
}))

defineExpose({
  el: internalRef,
})
</script>

<template>
  <Box
    ref="internalRef"
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
