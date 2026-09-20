<script setup lang="ts">
import { ref, watch, type CSSProperties, onMounted } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { typographyStyles } from '../helpers/typography'
import { getTextWithCustomEmoji, getSelectionOffset, restoreSelectionOffset } from '../helpers/emojiDom'
import { graphemeLength, sliceGraphemes, filterGraphemes } from '../helpers/graphemes'
import { passesFilter } from '../helpers/inputFilters'

export interface BaseInputProps {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  boxType?: BoxType
  extraStyles?: CSSProperties
  editorExtraStyles?: CSSProperties
  multiline?: boolean
  wrap?: boolean
  /** A grapheme must match this to be kept. */
  allow?: RegExp
  /** A grapheme matching any part of this is removed. */
  deny?: RegExp
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  placeholder: '',
  disabled: false,
  maxLength: undefined,
  boxType: 'textarea',
  extraStyles: undefined,
  editorExtraStyles: undefined,
  multiline: false,
  wrap: true,
  allow: undefined,
  deny: undefined,
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

const boxRef = ref<InstanceType<typeof Box> | null>(null)
const el = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (el.value && props.modelValue) {
    el.value.innerText = props.modelValue
  }
})

watch(() => props.modelValue, (newVal) => {
  if (!el.value) return

  if (getTextWithCustomEmoji(el.value) !== newVal) {
    const isFocused = document.activeElement === el.value
    const offset = isFocused ? getSelectionOffset(el.value) : null

    el.value.innerText = newVal ?? ''

    if (isFocused) {
      restoreSelectionOffset(el.value, offset)
    }
  }
})

/** Reads the editor DOM, enforces multiline/maxLength and emits `update:modelValue`. */
const syncValue = () => {
  if (!el.value) return

  let newValue = getTextWithCustomEmoji(el.value)

  if (!props.multiline) {
    newValue = newValue.replace(/\n/g, '')
  }

  if (props.allow || props.deny) {
    const caret = document.activeElement === el.value ? getSelectionOffset(el.value) : null
    const filtered = filterGraphemes(
      newValue,
      (g) => g === '\n' || passesFilter(g, props.allow, props.deny),
      caret,
    )

    if (filtered.value !== newValue) {
      newValue = filtered.value
      el.value.innerText = newValue

      if (caret !== null) restoreSelectionOffset(el.value, filtered.caret)
    }
  }

  if (props.maxLength && graphemeLength(newValue) > props.maxLength) {
    newValue = sliceGraphemes(newValue, props.maxLength)
    el.value.innerText = newValue

    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el.value)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  emit('update:modelValue', newValue)
}

const handleInput = () => {
  syncValue()
  emit('input')
}

const handleKeyDown = (e: KeyboardEvent) => {
  emit('keydown', e)

  if (!props.multiline && e.key === 'Enter') {
    e.preventDefault()
  }

  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

const handlePaste = (e: ClipboardEvent) => {
  emit('paste', e)

  if (e.defaultPrevented) return

  e.preventDefault()

  let text = e.clipboardData?.getData('text/plain') ?? ''

  if (!props.multiline) {
    text = text.replace(/\n/g, ' ')
  }

  const selection = window.getSelection()
  const range = selection?.rangeCount ? selection.getRangeAt(0) : null

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
  if (el.value && getTextWithCustomEmoji(el.value) === '') {
    el.value.innerHTML = ''
  }

  emit('blur')
}

const editorStyles = () => ({
  ...typographyStyles({ fontColor: 'black' }),
  minHeight: '100%',
  ...(props.wrap ? {} : { whiteSpace: 'nowrap', width: 'max-content', minWidth: '100%' }),
  ...props.editorExtraStyles,
}) as CSSProperties

defineExpose({ el, boxRef, syncValue })
</script>

<template>
  <div class="baseinput-wrapper">
    <Box ref="boxRef" :type="boxType" overflow="auto" forgive-vertical-overflow :extra-styles="extraStyles">
      <div
        ref="el"
        :contenteditable="!disabled"
        :style="editorStyles()"
        :data-placeholder="placeholder"
        role="textbox"
        :aria-multiline="multiline"
        :aria-disabled="disabled"
        @input="handleInput"
        @keydown="handleKeyDown"
        @beforeinput="emit('beforeinput', $event)"
        @paste="handlePaste"
        @focus="emit('focus')"
        @blur="handleBlur"
      />
    </Box>
    <slot />
  </div>
</template>
