export interface EmojiRegistry {
    [emoji: string]: string;
}
export interface EmojiRegistryOptions {
    basePath?: string;
    registryUrl?: string;
}
/**
 * Loads the emoji registry from the public two-column CSV at runtime.
 * The result is cached so the browser only fetches and parses it once.
 */
export declare function loadEmojiRegistry(options?: EmojiRegistryOptions): Promise<EmojiRegistry>;
/**
 * Clears the cached registry. Useful if a host app swaps the CSV URL at runtime.
 */
export declare function resetEmojiRegistryCache(): void;
/**
 * Returns the full path to an emoji GIF file in the public directory.
 */
export declare function getEmojiGifPath(emoji: string, options?: EmojiRegistryOptions): Promise<string | null>;
/**
 * Returns a GIF path for a known registry code without loading the CSV.
 */
export declare function getEmojiGifPathFromCode(code: string, options?: Pick<EmojiRegistryOptions, 'basePath'>): string;
/**
 * Returns the entire emoji registry object.
 */
export declare function getEmojiRegistry(options?: EmojiRegistryOptions): Promise<EmojiRegistry>;
/**
 * Checks if an emoji exists in the registry.
 */
export declare function hasEmoji(emoji: string, options?: EmojiRegistryOptions): Promise<boolean>;
