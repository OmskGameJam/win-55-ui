import type { CSSProperties } from 'vue';
export type BoxType = 'indent' | 'indent-dark' | 'panel-d-1' | 'panel-d-2' | 'textarea' | 'border-groove' | 'white-box' | 'notification';
type __VLS_Props = {
    type: BoxType;
    extraStyles?: CSSProperties;
    extraClass?: string;
};
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
