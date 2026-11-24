/** Matches any unicode emoji-ish grapheme, including ones absent from the registry CSV. */
export declare const EMOJI_DETECTION_PATTERN: string;
export interface EmojiRegistry {
    [emoji: string]: string;
}
export interface EmojiRegistryOptions {
    basePath?: string;
    registryUrl?: string;
}
/** Loads and caches the registry CSV. */
export declare function loadEmojiRegistry(options?: EmojiRegistryOptions): Promise<EmojiRegistry>;
/** Clears the cache so a different registry URL can be used. */
export declare function resetEmojiRegistryCache(): void;
export declare function getEmojiGifPath(emoji: string, options?: EmojiRegistryOptions): Promise<string | null>;
export declare function getEmojiGifPathFromCode(code: string, options?: Pick<EmojiRegistryOptions, 'basePath'>): string;
export declare function getEmojiRegistry(options?: EmojiRegistryOptions): Promise<EmojiRegistry>;
export declare function hasEmoji(emoji: string, options?: EmojiRegistryOptions): Promise<boolean>;
