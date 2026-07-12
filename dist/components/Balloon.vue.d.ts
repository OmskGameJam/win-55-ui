type Side = 'top' | 'bottom' | 'left' | 'right';
type Bias = 'left' | 'right' | 'up' | 'down';
export interface AnchorPoint {
    x: number;
    y: number;
}
export interface AnchorRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export type Anchor = AnchorPoint | AnchorRect;
type __VLS_Props = {
    text?: string;
    side?: Side;
    bias?: Bias;
    /** Viewport point or rect to anchor to, instead of the default slot's trigger element. */
    anchor?: Anchor;
};
type __VLS_PublicProps = __VLS_Props & {
    'shown'?: boolean;
};
declare var __VLS_8: {}, __VLS_10: {}, __VLS_15: {};
type __VLS_Slots = {} & {
    content?: (props: typeof __VLS_8) => any;
} & {
    default?: (props: typeof __VLS_10) => any;
} & {
    content?: (props: typeof __VLS_15) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:shown": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:shown"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
