/**
 * Firefox-only crutches (contenteditable caret-placement workarounds around
 * custom-emoji atoms) must not run in other browsers, where the extra empty
 * text nodes / manual arrow-key handling they involve are unnecessary and,
 * in Chrome's case, interfere with native OS emoji-panel input.
 */
export declare function isFirefox(): boolean;
