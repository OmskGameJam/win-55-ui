export type RichNode = {
    type: 'text';
    value: string;
} | {
    type: 'emoji';
    emoji: string;
    code?: string;
} | {
    type: 'break';
} | {
    type: 'bold' | 'italic' | 'underline' | 'strike';
    children: RichNode[];
} | {
    type: 'color';
    value: string;
    children: RichNode[];
} | {
    type: 'size';
    value: number;
    children: RichNode[];
} | {
    type: 'url';
    href: string;
    children: RichNode[];
};
export interface ShortcodeLookup {
    get(name: string): {
        emoji: string;
        code: string;
    } | undefined;
}
/** Raw unicode emoji -> registry code. */
export type EmojiRegistryLookup = Record<string, string>;
/**
 * Parses a limited BBCode subset plus `:shortcode:` emoji into RichNodes.
 * Unknown or malformed tags pass through as literal text.
 */
export declare function parseRichText(text: string, shortcodes: ShortcodeLookup | null, registry?: EmojiRegistryLookup | null): RichNode[];
