export interface ShortcodeEntry {
    emoji: string;
    code: string;
    category: string;
    tags: string[];
    shortcodes: string[];
}
export interface ShortcodeMatch {
    emoji: string;
    code: string;
    shortcode: string;
}
/** Loads and caches `emoji-categories.json`. */
export declare function loadShortcodeIndex(): Promise<ShortcodeEntry[]>;
/**
 * Prefix-matches names first, then tags, skipping duplicates. Returns every
 * match; callers window the result themselves.
 */
export declare function searchShortcodes(prefix: string): Promise<ShortcodeMatch[]>;
/** Exact (not prefix) match, used to resolve a fully-typed `:name:`. */
export declare function resolveShortcode(name: string): Promise<{
    emoji: string;
    code: string;
} | undefined>;
/** Clears the cached index. Useful if a host app swaps the categories URL at runtime. */
export declare function resetShortcodeIndexCache(): void;
