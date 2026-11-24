import type { BaseInputProps } from './BaseInput.vue';
export type NumberInputVariant = 'plain' | 'updown' | 'touchspin';
type __VLS_Props = Omit<BaseInputProps, 'allow' | 'modelValue'> & {
    /** Numeric **text**, not a number (`formatNumber`). `Slider` is the number-typed control. */
    modelValue: string;
    /** `updown` puts a stacked pair of buttons inside the field; `touchspin` puts one on each side. */
    variant?: NumberInputVariant;
    step?: number;
    min?: number;
    max?: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: () => any;
    beforeinput: (e: InputEvent) => any;
    blur: () => any;
    focus: () => any;
    keydown: (e: KeyboardEvent) => any;
    paste: (e: ClipboardEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onInput?: (() => any) | undefined;
    onBeforeinput?: ((e: InputEvent) => any) | undefined;
    onBlur?: (() => any) | undefined;
    onFocus?: (() => any) | undefined;
    onKeydown?: ((e: KeyboardEvent) => any) | undefined;
    onPaste?: ((e: ClipboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    variant: NumberInputVariant;
    step: number;
    min: number;
    max: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
