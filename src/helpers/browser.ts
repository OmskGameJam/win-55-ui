/** Firefox needs its contenteditable caret workarounds; Chrome's native emoji input hates them. */
export function isFirefox(): boolean {
  return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
}
