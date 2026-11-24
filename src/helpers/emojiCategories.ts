const BY_CATEGORY_URL = '/win-55-ui/emoji/emoji-by-category.json'

export interface CategoryEmoji {
  emoji: string
  code: string
  shortcodes: string[]
}

export interface CategoryGroup {
  category: string
  emojis: CategoryEmoji[]
}

let indexPromise: Promise<CategoryGroup[]> | null = null

/** Loads and caches `emoji-by-category.json`. */
export async function loadEmojiCategories(): Promise<CategoryGroup[]> {
  if (!indexPromise) {
    indexPromise = fetch(BY_CATEGORY_URL).then((response) => {
      if (!response.ok) {
        throw new Error(
          `Could not load emoji categories from ${BY_CATEGORY_URL}: ${response.status} ${response.statusText}`,
        )
      }

      return response.json() as Promise<CategoryGroup[]>
    })
  }

  return indexPromise
}

/** Clears the cache for a new categories URL. */
export function resetEmojiCategoriesCache(): void {
  indexPromise = null
}
