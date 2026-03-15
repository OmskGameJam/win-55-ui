type __VLS_Props = {
    modelValue: boolean;
    label?: string;
    disabled?: boolean;
    value?: string;
    checkedIcon?: string;
    uncheckedIcon?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (checked: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((checked: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
    value: string;
    checkedIcon: string;
    uncheckedIcon: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
