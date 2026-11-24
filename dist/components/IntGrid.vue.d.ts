import type { CSSProperties } from 'vue';
import { type IntGridFlow, type IntGridMode } from '../helpers/intGrid';
/**
 * Positions direct children in even pixels; owns their position/size and adds no wrapper.
 * `areas` reads both axes, so size it; other modes grow downward. Area names use
 * `data-intgrid-area`.
 */
type __VLS_Props = {
    mode?: IntGridMode;
    itemWidth?: number;
    itemHeight?: number;
    columns?: number;
    gap?: number;
    direction?: 'vertical' | 'horizontal';
    /** Which way items advance; reversed flows anchor to the far edge. */
    flow?: IntGridFlow;
    /** Lay out inside the element's own box height instead of sizing to content. */
    fixedHeight?: boolean;
    areas?: string;
    cols?: string;
    rows?: string;
    extraClass?: string;
    extraStyles?: CSSProperties;
};
declare function layout(): void;
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {
    layout: typeof layout;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    mode: IntGridMode;
    flow: IntGridFlow;
    direction: "vertical" | "horizontal";
    columns: number;
    gap: number;
    itemWidth: number;
    itemHeight: number;
    fixedHeight: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
