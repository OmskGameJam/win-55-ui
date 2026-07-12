export function getTextWithCustomEmoji(node: Node): string {
  if (node instanceof Text) {
    return node.nodeValue ?? ''
  }

  if (!(node instanceof Element || node instanceof DocumentFragment)) {
    return Array.from(node.childNodes).map(getTextWithCustomEmoji).join('')
  }

  if (node instanceof Element) {
    const emoji = node.getAttribute('data-win55-emoji')

    if (emoji) {
      return emoji
    }

    if (node.tagName === 'BR') {
      return '\n'
    }
  }

  return Array.from(node.childNodes).map(getTextWithCustomEmoji).join('')
}

export function getSelectionOffset(root: HTMLElement): number | null {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return null
  }

  const range = selection.getRangeAt(0)

  if (!root.contains(range.startContainer)) {
    return null
  }

  const prefixRange = document.createRange()
  prefixRange.selectNodeContents(root)
  prefixRange.setEnd(range.startContainer, range.startOffset)

  return getTextWithCustomEmoji(prefixRange.cloneContents()).length
}

function findCaretPosition(
  node: Node,
  offset: number,
): { node: Node; offset: number; remaining: number } | null {
  if (node instanceof Text) {
    const length = node.nodeValue?.length ?? 0

    if (offset <= length) {
      return { node, offset, remaining: 0 }
    }

    return { node, offset: length, remaining: offset - length }
  }

  if (node instanceof Element) {
    const emoji = node.getAttribute('data-win55-emoji')

    if (emoji) {
      if (offset <= 0) {
        return { node: node.parentNode ?? node, offset: childIndex(node), remaining: 0 }
      }

      if (offset <= emoji.length) {
        return { node: node.parentNode ?? node, offset: childIndex(node) + 1, remaining: 0 }
      }

      return {
        node: node.parentNode ?? node,
        offset: childIndex(node) + 1,
        remaining: offset - emoji.length,
      }
    }
  }

  let remaining = offset
  let lastPosition: { node: Node; offset: number; remaining: number } = {
    node,
    offset: node.childNodes.length,
    remaining,
  }

  for (const child of Array.from(node.childNodes)) {
    const position = findCaretPosition(child, remaining)

    if (position && position.remaining === 0) {
      return position
    }

    if (position) {
      remaining = position.remaining
      lastPosition = position
    }
  }

  return {
    node,
    offset: node.childNodes.length,
    remaining: lastPosition.remaining,
  }
}

function childIndex(node: Node): number {
  if (!node.parentNode) {
    return 0
  }

  return Array.prototype.indexOf.call(node.parentNode.childNodes, node)
}

export function restoreSelectionOffset(
  root: HTMLElement,
  offset: number | null,
  focusRoot = false,
): void {
  if (offset === null || !root.isConnected) {
    return
  }

  const position = findCaretPosition(root, offset)

  if (!position) {
    return
  }

  const range = document.createRange()
  const selection = window.getSelection()

  if (focusRoot) {
    root.focus({ preventScroll: true })
  }

  range.setStart(position.node, position.offset)
  range.collapse(true)
  selection?.removeAllRanges()
  selection?.addRange(range)
}
