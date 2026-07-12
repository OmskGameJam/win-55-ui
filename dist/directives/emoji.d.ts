import type { Directive } from 'vue';
import { type EmojiRegistryOptions } from '../helpers/emoji';
export interface EmojiDirectiveOptions extends EmojiRegistryOptions {
    className?: string;
}
export type EmojiDirectiveBindingValue = boolean | EmojiDirectiveOptions | undefined;
export declare const FALLBACK_EMOJI_PALETTE: readonly ["#000000", "#020202", "#2E2E2E", "#700000", "#007000", "#000070", "#700070", "#007070", "#BB0202", "#F72E2E", "#BB7E02", "#02BB02", "#2EF72E", "#F7F22E", "#0202BB", "#2E2EF7", "#BB02BB", "#F72EF7", "#02BBBB", "#2EF7F7", "#8F8F8F", "#C4C4C4", "#D7D7D7", "#FFC4C4", "#C4FFC4", "#FFFFC4", "#C4C4FF", "#FFC4FF", "#C4FFFF", "#FAFAFA", "#FFFFFF", "#000000"];
/**
 * Renders custom emoji inside `el` once, without requiring the `v-emoji`
 * directive to be bound to it. Useful for components that need to trigger
 * emoji conversion imperatively (e.g. right after a paste).
 */
export declare function renderCustomEmoji(el: HTMLElement, options?: EmojiDirectiveOptions): Promise<void>;
declare const emojiDirective: Directive<HTMLElement, EmojiDirectiveBindingValue>;
export declare const customEmojiDirective: import("vue").ObjectDirective<HTMLElement, EmojiDirectiveBindingValue, string, any>;
export default emojiDirective;
