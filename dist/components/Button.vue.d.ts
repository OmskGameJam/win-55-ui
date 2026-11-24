import { type CSSProperties } from 'vue';
import { type BoxType } from './Box.vue';
type __VLS_Props = {
    boxType?: BoxType;
    extraStyles?: CSSProperties;
    extraClass?: string;
    /** Styles for the pressed-offset wrapper inside the bevel. */
    contentStyles?: CSSProperties;
    disabled?: boolean;
};
declare var __VLS_11: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_11) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: (() => any) | undefined;
}>, {
    extraStyles: CSSProperties;
    extraClass: string;
    disabled: boolean;
    boxType: BoxType;
    contentStyles: CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
