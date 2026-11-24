import { getSelectionOffset, restoreSelectionOffset } from './emojiDom'

/**
 * Viewport rect of the collapsed caret inside `root`, or null when there is
 * none. A temporary zero-width marker makes it measurable.
 */
export function getCaretClientRect(root: HTMLElement): DOMRect | null {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return null
  }

  const range = selection.getRangeAt(0)

  if (!root.contains(range.startContainer)) {
    return null
  }

  const offset = getSelectionOffset(root)
  const markerRange = range.cloneRange()
  markerRange.collapse(true)

  const marker = document.createElement('span')
  marker.textContent = String.fromCharCode(0x200b) // zero-width space
  markerRange.insertNode(marker)

  const rect = marker.getBoundingClientRect()
  const parent = marker.parentNode

  marker.remove()
  parent?.normalize()
  restoreSelectionOffset(root, offset)

  return rect
}
