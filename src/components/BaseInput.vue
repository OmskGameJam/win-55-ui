<script setup lang="ts">
import { ref, watch, type CSSProperties, computed, onMounted } from 'vue'
import Box, { type BoxType } from './Box.vue'
import { typographyStyles } from '../helpers/typography'
import { getTextWithCustomEmoji } from '../helpers/emojiDom'

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

  if (getTextWithCustomEmoji(el.value) !== newVal) {
    el.value.innerText = newVal ?? ''
  }
})

const handleInput = () => {
  if (!el.value) return

  let newValue = getTextWithCustomEmoji(el.value)

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

const setCaret = (container: Node, offset: number) => {
  const range = document.createRange()
  const selection = window.getSelection()

  el.value?.focus({ preventScroll: true })
  range.setStart(container, offset)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

const getMaxCaretOffset = (node: Node): number => {
  if (node instanceof Text) {
    return node.nodeValue?.length ?? 0
  }

  return node.childNodes.length
}

const getChildIndex = (node: Node): number => {
  if (!node.parentNode) {
    return 0
  }

  return Array.prototype.indexOf.call(node.parentNode.childNodes, node)
}

const getPreviousCaretNode = (container: Node, offset: number): Node | null => {
  if (container instanceof Text) {
    if (offset > 0) {
      return null
    }

    return container.previousSibling ?? (
      container.parentNode && container.parentNode !== el.value
        ? getPreviousCaretNode(container.parentNode, getChildIndex(container.parentNode))
        : null
    )
  }

  return container.childNodes[offset - 1] ?? (
    container.parentNode && container !== el.value
      ? getPreviousCaretNode(container.parentNode, getChildIndex(container))
      : null
  )
}

const getNextCaretNode = (container: Node, offset: number): Node | null => {
  if (container instanceof Text) {
    if (offset < (container.nodeValue?.length ?? 0)) {
      return null
    }

    return container.nextSibling ?? (
      container.parentNode && container.parentNode !== el.value
        ? getNextCaretNode(container.parentNode, getChildIndex(container.parentNode) + 1)
        : null
    )
  }

  return container.childNodes[offset] ?? (
    container.parentNode && container !== el.value
      ? getNextCaretNode(container.parentNode, getChildIndex(container) + 1)
      : null
  )
}

const findAdjacentEmojiElement = (
  candidate: Node | null,
  direction: 'backward' | 'forward',
): HTMLElement | null => {
  let current = candidate

  while (current) {
    if (current instanceof HTMLElement && current.hasAttribute('data-win55-emoji')) {
      return current
    }

    if (current instanceof Text) {
      if ((current.nodeValue ?? '').length > 0) {
        return null
      }

      current = direction === 'backward' ? current.previousSibling : current.nextSibling
      continue
    }

    if (current.childNodes.length > 0) {
      current = direction === 'backward'
        ? current.childNodes[current.childNodes.length - 1]
        : current.childNodes[0]
      continue
    }

    return null
  }

  return null
}

const selectionContainsCustomEmoji = (range: Range): boolean => {
  const fragment = range.cloneContents()

  if (fragment.querySelector?.('[data-win55-emoji]')) {
    return true
  }

  const startElement = range.startContainer instanceof Element
    ? range.startContainer
    : range.startContainer.parentElement
  const endElement = range.endContainer instanceof Element
    ? range.endContainer
    : range.endContainer.parentElement

  return Boolean(
    startElement?.closest('[data-win55-emoji]') ||
    endElement?.closest('[data-win55-emoji]'),
  )
}

const deleteSelection = (range: Range): void => {
  if (!el.value) return

  const parent = range.startContainer
  const offset = range.startOffset

  range.deleteContents()

  if (parent.isConnected && el.value.contains(parent)) {
    setCaret(parent, Math.min(offset, getMaxCaretOffset(parent)))
  } else {
    setCaret(el.value, el.value.childNodes.length)
  }

  handleInput()
}

const rangeFromStaticRange = (staticRange: StaticRange): Range => {
  const range = document.createRange()
  range.setStart(staticRange.startContainer, staticRange.startOffset)
  range.setEnd(staticRange.endContainer, staticRange.endOffset)

  return range
}

const isCustomEmojiElement = (node: Node | null): node is HTMLElement => {
  return node instanceof HTMLElement && node.hasAttribute('data-win55-emoji')
}

const deleteTextRangeAtEmojiBoundary = (
  range: Range,
  direction: 'backward' | 'forward',
  beforeDelete: () => void,
): boolean => {
  if (
    !el.value ||
    range.collapsed ||
    range.startContainer !== range.endContainer ||
    !(range.startContainer instanceof Text)
  ) {
    return false
  }

  const textNode = range.startContainer
  const textLength = textNode.nodeValue?.length ?? 0

  if (range.startOffset !== 0 || range.endOffset !== textLength) {
    return false
  }

  const adjacentEmoji = direction === 'backward'
    ? textNode.previousSibling
    : textNode.nextSibling

  if (!isCustomEmojiElement(adjacentEmoji) || !textNode.parentNode) {
    return false
  }

  beforeDelete()
  const parent = textNode.parentNode
  const offset = getChildIndex(textNode)
  textNode.remove()
  setCaret(parent, offset)
  handleInput()

  return true
}

const deleteAdjacentEmojiFromPosition = (
  container: Node,
  startOffset: number,
  direction: 'backward' | 'forward',
  beforeDelete: () => void,
): boolean => {
  const candidate = direction === 'backward'
    ? getPreviousCaretNode(container, startOffset)
    : getNextCaretNode(container, startOffset)
  const emojiElement = findAdjacentEmojiElement(candidate, direction)

  if (!emojiElement || !emojiElement.parentNode) {
    return false
  }

  beforeDelete()
  const parent = emojiElement.parentNode
  const offset = getChildIndex(emojiElement)
  emojiElement.remove()
  setCaret(parent, offset)
  handleInput()

  return true
}

const deleteEmojiFromTargetRange = (
  staticRange: StaticRange,
  direction: 'backward' | 'forward',
  beforeDelete: () => void,
): 'deleted' | 'native' | 'none' => {
  if (!el.value || !el.value.contains(staticRange.startContainer)) {
    return 'none'
  }

  const range = rangeFromStaticRange(staticRange)

  if (!range.collapsed) {
    if (selectionContainsCustomEmoji(range)) {
      beforeDelete()
      deleteSelection(range)
      return 'deleted'
    }

    if (deleteTextRangeAtEmojiBoundary(range, direction, beforeDelete)) {
      return 'deleted'
    }

    return getTextWithCustomEmoji(range.cloneContents()) ? 'native' : 'none'
  }

  return deleteAdjacentEmojiFromPosition(
    staticRange.startContainer,
    staticRange.startOffset,
    direction,
    beforeDelete,
  ) ? 'deleted' : 'none'
}

const deleteAdjacentEmoji = (
  direction: 'backward' | 'forward',
  beforeDelete: () => void,
): boolean => {
  if (!el.value) return false

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return false
  }

  const range = selection.getRangeAt(0)

  if (!el.value.contains(range.startContainer)) {
    return false
  }

  if (!selection.isCollapsed) {
    if (!selectionContainsCustomEmoji(range)) {
      return false
    }

    beforeDelete()
    deleteSelection(range)
    return true
  }

  return deleteAdjacentEmojiFromPosition(
    range.startContainer,
    range.startOffset,
    direction,
    beforeDelete,
  )
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.multiline && e.key === 'Enter') {
    e.preventDefault()
  }

  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

const handleBeforeInput = (e: InputEvent) => {
  if (!el.value) return

  if (e.inputType !== 'deleteContentBackward' && e.inputType !== 'deleteContentForward') {
    return
  }

  if (getTextWithCustomEmoji(el.value) === '') {
    e.preventDefault()
    el.value.focus({ preventScroll: true })
    return
  }

  const direction = e.inputType === 'deleteContentBackward' ? 'backward' : 'forward'
  const targetRanges = e.getTargetRanges()

  for (const targetRange of targetRanges) {
    const targetRangeResult = deleteEmojiFromTargetRange(
      targetRange,
      direction,
      () => e.preventDefault(),
    )

    if (targetRangeResult === 'deleted') {
      el.value.focus({ preventScroll: true })
      return
    }

    if (targetRangeResult === 'native') {
      return
    }
  }

  if (deleteAdjacentEmoji(direction, () => e.preventDefault())) {
    el.value.focus({ preventScroll: true })
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
  if (el.value && getTextWithCustomEmoji(el.value) === '') {
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
    @beforeinput="handleBeforeInput"
    @paste="handlePaste"
    @blur="handleBlur"
  />
</template>
