import { type CSSProperties } from 'vue';
import { type BoxType } from './Box.vue';
type __VLS_Props = {
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    boxType?: BoxType;
    extraStyles?: CSSProperties;
    multiline?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {
    el: import("vue").ComputedRef<HTMLDivElement | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    extraStyles: CSSProperties;
    disabled: boolean;
    placeholder: string;
    maxLength: number;
    boxType: BoxType;
    multiline: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
