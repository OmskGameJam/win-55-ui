import type { CSSProperties } from 'vue';
type __VLS_Props = {
    extraStyles?: CSSProperties;
    extraClass?: string;
    minWidth?: number;
    minHeight?: number;
    resizable?: boolean;
    resizableHorizontally?: boolean;
    resizableVertically?: boolean;
    title: string;
    icon?: string;
    placeholderButtons?: boolean;
    disabled?: boolean;
    gradientColorA?: string;
    gradientColorB?: string;
    faux?: boolean;
    overflowX?: 'auto' | 'hidden' | 'scroll' | 'visible';
    overflowY?: 'auto' | 'hidden' | 'scroll' | 'visible';
};
type __VLS_PublicProps = __VLS_Props & {
    'x'?: number;
    'y'?: number;
    'width'?: number;
    'height'?: number;
};
declare var __VLS_13: {}, __VLS_15: {};
type __VLS_Slots = {} & {
    'titlebar-buttons'?: (props: typeof __VLS_13) => any;
} & {
    default?: (props: typeof __VLS_15) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:x": (value: number) => any;
    "update:y": (value: number) => any;
    "update:width": (value: number) => any;
    "update:height": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:x"?: ((value: number) => any) | undefined;
    "onUpdate:y"?: ((value: number) => any) | undefined;
    "onUpdate:width"?: ((value: number) => any) | undefined;
    "onUpdate:height"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
