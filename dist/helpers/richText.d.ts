export type RichNode = {
    type: 'text';
    value: string;
} | {
    type: 'emoji';
    emoji: string;
    code: string;
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
/** Raw unicode emoji -> registry code, e.g. the `EmojiRegistry` from helpers/emoji.ts. */
export type EmojiRegistryLookup = Record<string, string>;
/**
 * Parses a limited BBCode subset ([b] [i] [u] [s]/[strike] [color=] [size=]
 * [url]/[url=] [br]) plus `:shortcode:` emoji into a tree of RichNode.
 * Unknown tags and unmatched/malformed brackets pass through as literal
 * text rather than being stripped.
 */
export declare function parseRichText(text: string, shortcodes: ShortcodeLookup | null, registry?: EmojiRegistryLookup | null): RichNode[];
