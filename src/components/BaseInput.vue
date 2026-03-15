<script setup lang="ts">
import { ref, watch, type CSSProperties, computed, onMounted } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { typographyStyles } from '../helpers/typography'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  boxType?: BoxType
  extraStyles?: CSSProperties
  multiline?: boolean
}>(), {
  placeholder: '',
  disabled: false,
  maxLength: undefined,
  boxType: 'textarea',
  extraStyles: undefined,
  multiline: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const boxRef = ref<InstanceType<typeof Box> | null>(null)
const el = computed(() => boxRef.value?.el ?? null)

/* Initialize default v-model content */
onMounted(() => {
  if (el.value && props.modelValue) {
    el.value.innerText = props.modelValue
  }
})

/* Sync when modelValue changes externally */
watch(() => props.modelValue, (newVal) => {
  if (!el.value) return

  if (el.value.innerText !== newVal) {
    el.value.innerText = newVal ?? ''
  }
})

const handleInput = () => {
  if (!el.value) return

  let newValue = el.value.innerText || ''

  if (!props.multiline) {
    newValue = newValue.replace(/\n/g, '')
  }

  /* Apply maxLength if specified */
  if (props.maxLength && newValue.length > props.maxLength) {
    newValue = newValue.slice(0, props.maxLength)
    el.value.innerText = newValue

    /* Move cursor to end */
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
  if (!props.multiline && e.key === 'Enter') {
    e.preventDefault()
  }

  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()

  let text = e.clipboardData?.getData('text/plain') ?? ''

  if (!props.multiline) {
    text = text.replace(/\n/g, ' ')
  }

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
  overflow: 'auto',
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
    :aria-multiline="multiline"
    :aria-disabled="disabled"
    @input="handleInput"
    @keydown="handleKeyDown"
    @paste="handlePaste"
    @blur="handleBlur"
  />
</template>