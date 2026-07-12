/**
 * Returns the on-screen (viewport) rect of the collapsed caret inside `root`,
 * or null if there's no collapsed selection inside it. Works by briefly
 * inserting a zero-width marker at the caret, measuring it, and removing it
 * again — collapsed ranges/carets don't reliably report a client rect on
 * their own in every browser.
 */
export declare function getCaretClientRect(root: HTMLElement): DOMRect | null;
