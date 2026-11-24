import type { CSSProperties } from 'vue';
import { type TitlebarProps } from './Titlebar.vue';
import type { BoxOverflow } from '../helpers/scroll';
type __VLS_Props = TitlebarProps & {
    extraStyles?: CSSProperties;
    extraClass?: string;
    minWidth?: number;
    minHeight?: number;
    resizable?: boolean;
    resizableHorizontally?: boolean;
    resizableVertically?: boolean;
    faux?: boolean;
    overflow?: BoxOverflow;
    overflowX?: BoxOverflow;
    overflowY?: BoxOverflow;
    forgiveVerticalOverflow?: boolean;
};
type __VLS_PublicProps = __VLS_Props & {
    'x'?: number;
    'y'?: number;
    'width'?: number;
    'height'?: number;
};
declare var __VLS_13: {}, __VLS_18: {};
type __VLS_Slots = {} & {
    'titlebar-buttons'?: (props: typeof __VLS_13) => any;
} & {
    default?: (props: typeof __VLS_18) => any;
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
}>, {
    minHeight: number;
    minWidth: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
