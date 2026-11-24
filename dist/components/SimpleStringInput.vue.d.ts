import { type BaseInputProps } from './BaseInput.vue';
declare var __VLS_15: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_15) => any;
};
declare const __VLS_component: import("vue").DefineComponent<BaseInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: () => any;
    beforeinput: (e: InputEvent) => any;
    blur: () => any;
    focus: () => any;
    keydown: (e: KeyboardEvent) => any;
    paste: (e: ClipboardEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<BaseInputProps> & Readonly<{
    onInput?: (() => any) | undefined;
    onBeforeinput?: ((e: InputEvent) => any) | undefined;
    onBlur?: (() => any) | undefined;
    onFocus?: (() => any) | undefined;
    onKeydown?: ((e: KeyboardEvent) => any) | undefined;
    onPaste?: ((e: ClipboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
