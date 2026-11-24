import { type CSSProperties } from 'vue';
type SliderSize = 'small' | 'medium' | 'large';
type SliderOrientation = 'horizontal' | 'vertical';
type __VLS_Props = {
    size?: SliderSize;
    sizeMax?: SliderSize;
    orientation?: SliderOrientation;
    normalized?: boolean;
    rangeColor?: string;
    /**
     * Explicit discrete values. When a non-empty list survives the `min`/`max`
     * filter it wins over `step`; `step` is ignored entirely.
     */
    fixedValues?: readonly number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    extraStyles?: CSSProperties;
    extraClass?: string;
};
type __VLS_PublicProps = __VLS_Props & {
    modelValue?: number;
    'range'?: [number, number];
};
declare const _default: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: number) => any;
    "update:range": (value: [number, number] | undefined) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
    "onUpdate:range"?: ((value: [number, number] | undefined) => any) | undefined;
}>, {
    orientation: SliderOrientation;
    size: SliderSize;
    extraStyles: CSSProperties;
    extraClass: string;
    disabled: boolean;
    step: number;
    min: number;
    max: number;
    sizeMax: SliderSize;
    normalized: boolean;
    rangeColor: string;
    fixedValues: readonly number[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
