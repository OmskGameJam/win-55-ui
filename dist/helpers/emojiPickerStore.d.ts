export interface EmojiInsertTarget {
    insertEmoji(emoji: string): void;
}
export interface PickerPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const pickerOpen: import("vue").Ref<boolean, boolean>;
export declare const pickerPosition: import("vue").Ref<{
    x: number;
    y: number;
    width: number;
    height: number;
}, PickerPosition | {
    x: number;
    y: number;
    width: number;
    height: number;
}>;
export declare const activeTarget: import("vue").ShallowRef<EmojiInsertTarget | null, EmojiInsertTarget | null>;
export declare function registerActiveInput(target: EmojiInsertTarget): void;
export declare function openPicker(): void;
export declare function closePicker(): void;
export declare function insertEmoji(emoji: string): void;
export declare function pickNextButtonIcon(codes: string[]): string;
