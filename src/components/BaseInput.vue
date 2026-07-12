<script setup lang="ts">
import { ref, watch, type CSSProperties, computed, onMounted } from 'vue'
import Box, { type BoxType } from './Box.vue'
import Balloon, { type AnchorRect } from './Balloon.vue'
import { typographyStyles } from '../helpers/typography'
import { getTextWithCustomEmoji, getSelectionOffset, restoreSelectionOffset } from '../helpers/emojiDom'
import { renderCustomEmoji } from '../directives/emoji'
import { getEmojiGifPathFromCode } from '../helpers/emoji'
import { graphemeLength, sliceGraphemes } from '../helpers/graphemes'
import { getCaretClientRect } from '../helpers/caretPosition'
import { searchShortcodes, resolveShortcode, type ShortcodeMatch } from '../helpers/shortcodes'

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
    const isFocused = document.activeElement === el.value
    const offset = isFocused ? getSelectionOffset(el.value) : null

    el.value.innerText = newVal ?? ''

    if (isFocused) {
      restoreSelectionOffset(el.value, offset)
    }
  }
})

const handleInput = () => {
  if (!el.value) return

  let newValue = getTextWithCustomEmoji(el.value)

  if (!props.multiline) {
    newValue = newValue.replace(/\n/g, '')
  }

  /* Apply maxLength if specified, counting graphemes so multi-codepoint emoji count as one */
  if (props.maxLength && graphemeLength(newValue) > props.maxLength) {
    newValue = sliceGraphemes(newValue, props.maxLength)
    el.value.innerText = newValue

    /* Move cursor to end */
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(el.value)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  scheduleHistoryBatchClose()
  emit('update:modelValue', newValue)
  void updateShortcodeTrigger()
}

/*
 * Discord-style `:shortcode:` autocomplete. Never silently auto-converts a
 * fully-typed `:name:` — a closing `:` only resolves if the popup was
 * already open showing that exact query the instant before, so the user
 * always saw it coming. Otherwise, confirmation only happens through an
 * explicit Tab/Space/Enter while the popup is open.
 */
const OPEN_SHORTCODE_PATTERN = /:([A-Za-z0-9_+-]*)$/
const CLOSED_SHORTCODE_PATTERN = /:([A-Za-z0-9_+-]{2,}):$/

const shortcodeOpen = ref(false)
const shortcodeQuery = ref<string | null>(null)
const shortcodeMatches = ref<ShortcodeMatch[]>([])
const selectedMatchIndex = ref(0)
const caretRect = ref<AnchorRect | null>(null)
let shortcodeRequestId = 0

const closeShortcodePopup = () => {
  shortcodeOpen.value = false
  shortcodeQuery.value = null
  shortcodeMatches.value = []
  selectedMatchIndex.value = 0
}

const replaceShortcodeRunWithEmoji = (runLength: number, emojiChar: string) => {
  if (!el.value) return

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return

  const range = selection.getRangeAt(0)
  const textNode = range.startContainer

  if (!(textNode instanceof Text) || !el.value.contains(textNode)) return

  const caretOffset = range.startOffset
  const runStart = caretOffset - runLength

  if (runStart < 0) return

  const value = textNode.nodeValue ?? ''

  beginHistoryEdit()
  textNode.nodeValue = value.slice(0, runStart) + emojiChar + value.slice(caretOffset)
  setCaret(textNode, runStart + emojiChar.length)
  closeHistoryBatch()
  handleInput()
  void renderCustomEmoji(el.value)
}

const confirmSelectedMatch = () => {
  const match = shortcodeMatches.value[selectedMatchIndex.value]

  if (!match || shortcodeQuery.value === null) return

  replaceShortcodeRunWithEmoji(1 + shortcodeQuery.value.length, match.emoji)
  closeShortcodePopup()
}

const updateShortcodeTrigger = async () => {
  if (!el.value) {
    closeShortcodePopup()
    return
  }

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    closeShortcodePopup()
    return
  }

  const range = selection.getRangeAt(0)
  const textNode = range.startContainer

  if (!(textNode instanceof Text) || !el.value.contains(textNode)) {
    closeShortcodePopup()
    return
  }

  const before = (textNode.nodeValue ?? '').slice(0, range.startOffset)
  const previousQuery = shortcodeOpen.value ? shortcodeQuery.value : null
  const closedMatch = CLOSED_SHORTCODE_PATTERN.exec(before)

  if (closedMatch) {
    if (previousQuery === closedMatch[1]) {
      const resolved = await resolveShortcode(closedMatch[1])

      if (resolved) {
        replaceShortcodeRunWithEmoji(closedMatch[0].length, resolved.emoji)
      }
    }

    closeShortcodePopup()
    return
  }

  const openMatch = OPEN_SHORTCODE_PATTERN.exec(before)
  const query = openMatch?.[1] ?? null

  if (query === null || query.length < 2) {
    closeShortcodePopup()
    return
  }

  const rect = getCaretClientRect(el.value)

  if (!rect) {
    closeShortcodePopup()
    return
  }

  const requestId = ++shortcodeRequestId
  const matches = await searchShortcodes(query)

  if (requestId !== shortcodeRequestId || matches.length === 0) {
    if (requestId === shortcodeRequestId) {
      closeShortcodePopup()
    }

    return
  }

  shortcodeQuery.value = query
  shortcodeMatches.value = matches
  selectedMatchIndex.value = 0
  caretRect.value = { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right }
  shortcodeOpen.value = true
}

/*
 * BaseInput implements its own undo/redo stack instead of relying on the
 * browser's native contentEditable history: native undo/redo mutates the
 * emoji-span DOM in an unspecified way (it isn't aware of `data-win55-emoji`
 * atoms), so we intercept `historyUndo`/`historyRedo` and replay full
 * innerHTML + caret snapshots instead.
 */
const HISTORY_COALESCE_MS = 200

interface HistorySnapshot {
  html: string
  caret: number | null
}

const undoStack: HistorySnapshot[] = []
const redoStack: HistorySnapshot[] = []
let openBatchSnapshot: HistorySnapshot | null = null
let coalesceTimer: ReturnType<typeof setTimeout> | null = null

const captureHistorySnapshot = (): HistorySnapshot | null => {
  if (!el.value) return null

  return { html: el.value.innerHTML, caret: getSelectionOffset(el.value) }
}

const restoreHistorySnapshot = (snapshot: HistorySnapshot) => {
  if (!el.value) return

  el.value.innerHTML = snapshot.html
  restoreSelectionOffset(el.value, snapshot.caret, true)
  handleInput()
}

const beginHistoryEdit = () => {
  if (!openBatchSnapshot) {
    openBatchSnapshot = captureHistorySnapshot()
  }

  redoStack.length = 0
}

const closeHistoryBatch = () => {
  if (coalesceTimer !== null) {
    clearTimeout(coalesceTimer)
    coalesceTimer = null
  }

  if (openBatchSnapshot) {
    undoStack.push(openBatchSnapshot)
    openBatchSnapshot = null
  }
}

const scheduleHistoryBatchClose = () => {
  if (coalesceTimer !== null) {
    clearTimeout(coalesceTimer)
  }

  coalesceTimer = setTimeout(closeHistoryBatch, HISTORY_COALESCE_MS)
}

const undoHistory = () => {
  closeHistoryBatch()
  const previous = undoStack.pop()

  if (!previous) return

  const current = captureHistorySnapshot()

  if (current) {
    redoStack.push(current)
  }

  restoreHistorySnapshot(previous)
}

const redoHistory = () => {
  const next = redoStack.pop()

  if (!next) return

  const current = captureHistorySnapshot()

  if (current) {
    undoStack.push(current)
  }

  restoreHistorySnapshot(next)
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
  if (shortcodeOpen.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      selectedMatchIndex.value = (selectedMatchIndex.value + 1) % shortcodeMatches.value.length
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      selectedMatchIndex.value =
        (selectedMatchIndex.value - 1 + shortcodeMatches.value.length) % shortcodeMatches.value.length
      return
    }

    if (e.key === 'Tab' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      confirmSelectedMatch()
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      closeShortcodePopup()
      return
    }
  }

  if (!props.multiline && e.key === 'Enter') {
    e.preventDefault()
  }

  if (e.key === 'Tab') {
    e.preventDefault()
  }
}

const handleBeforeInput = (e: InputEvent) => {
  if (!el.value) return

  if (e.inputType === 'historyUndo' || e.inputType === 'historyRedo') {
    e.preventDefault()

    if (e.inputType === 'historyUndo') {
      undoHistory()
    } else {
      redoHistory()
    }

    return
  }

  beginHistoryEdit()

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

  beginHistoryEdit()

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
  /* A paste is always its own undo step, regardless of adjacent typing */
  closeHistoryBatch()
  void renderCustomEmoji(el.value)
}

const handleBlur = () => {
  /* Don't leave an open batch stranded if focus leaves before the debounce fires */
  closeHistoryBatch()
  closeShortcodePopup()

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

  <Balloon v-if="shortcodeOpen && caretRect" :shown="true" :anchor="caretRect" side="top">
    <template #content>
      <div class="shortcode-suggestions">
        <div
          v-for="(match, index) in shortcodeMatches"
          :key="match.shortcode"
          class="shortcode-suggestion"
          :class="{ 'shortcode-suggestion--selected': index === selectedMatchIndex }"
        >
          <img
            :src="getEmojiGifPathFromCode(match.code)"
            width="15"
            height="15"
            class="shortcode-suggestion-image"
          />
          <span>:{{ match.shortcode }}:</span>
        </div>
      </div>
    </template>
  </Balloon>
</template>
