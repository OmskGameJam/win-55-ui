import type { Directive } from 'vue';
import { type EmojiRegistryOptions } from '../helpers/emoji';
export interface EmojiDirectiveOptions extends EmojiRegistryOptions {
    className?: string;
}
export type EmojiDirectiveBindingValue = boolean | EmojiDirectiveOptions | undefined;
declare const emojiDirective: Directive<HTMLElement, EmojiDirectiveBindingValue>;
export declare const customEmojiDirective: import("vue").ObjectDirective<HTMLElement, EmojiDirectiveBindingValue, string, any>;
export default emojiDirective;
