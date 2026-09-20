import type { CSSProperties } from 'vue';
import type { BoxOverflow } from '../helpers/scroll';
export type BoxType = 'indent' | 'indent-dark' | 'panel-d-1' | 'panel-d-2' | 'textarea' | 'border-groove' | 'white-box' | 'notification';
type __VLS_Props = {
    type: BoxType;
    overflow?: BoxOverflow;
    overflowX?: BoxOverflow;
    overflowY?: BoxOverflow;
    forgiveVerticalOverflow?: boolean;
    extraStyles?: CSSProperties;
    extraClass?: string;
};
type __VLS_PublicProps = __VLS_Props & {
    'scrollTop'?: number;
    'scrollLeft'?: number;
};
declare var __VLS_17: {}, __VLS_19: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_17) => any;
} & {
    default?: (props: typeof __VLS_19) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {
    el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
    scrollEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
    verticalBarVisible: import("vue").Ref<boolean, boolean>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:scrollTop": (value: number | undefined) => any;
    "update:scrollLeft": (value: number | undefined) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
    "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
