type __VLS_Props = {
    modelValue: unknown;
    value: unknown;
    label?: string;
    disabled?: boolean;
    name?: string;
    checkedIcon?: string;
    uncheckedIcon?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: unknown) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: unknown) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
    checkedIcon: string;
    uncheckedIcon: string;
    name: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
