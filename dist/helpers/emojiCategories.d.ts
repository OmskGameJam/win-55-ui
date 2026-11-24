export interface CategoryEmoji {
    emoji: string;
    code: string;
    shortcodes: string[];
}
export interface CategoryGroup {
    category: string;
    emojis: CategoryEmoji[];
}
/** Loads and caches `emoji-by-category.json`. */
export declare function loadEmojiCategories(): Promise<CategoryGroup[]>;
/** Clears the cache for a new categories URL. */
export declare function resetEmojiCategoriesCache(): void;
