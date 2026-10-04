import { type CSSProperties } from 'vue';
import { type BoxType } from './Box.vue';
export interface BaseInputProps {
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    boxType?: BoxType;
    extraStyles?: CSSProperties;
    editorExtraStyles?: CSSProperties;
    multiline?: boolean;
    wrap?: boolean;
    /** A grapheme must match this to be kept. */
    allow?: RegExp;
    /** A grapheme matching any part of this is removed. */
    deny?: RegExp;
}
declare var __VLS_6: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_6) => any;
};
declare const __VLS_component: import("vue").DefineComponent<BaseInputProps, {
    el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
    boxRef: import("vue").Ref<({
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: {
            readonly type: BoxType;
            readonly overflow?: import("../index.ts").BoxOverflow | undefined;
            readonly overflowX?: import("../index.ts").BoxOverflow | undefined;
            readonly overflowY?: import("../index.ts").BoxOverflow | undefined;
            readonly forgiveVerticalOverflow?: boolean | undefined;
            readonly extraStyles?: CSSProperties | undefined;
            readonly extraClass?: string | undefined;
            readonly scrollTop?: number | undefined;
            readonly scrollLeft?: number | undefined;
            readonly "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
            readonly "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
        $attrs: import("vue").Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot<any> | undefined;
        }>;
        $root: import("vue").ComponentPublicInstance | null;
        $parent: import("vue").ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "update:scrollTop", value: number | undefined) => void) & ((event: "update:scrollLeft", value: number | undefined) => void);
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<{
            type: BoxType;
            overflow?: import("../index.ts").BoxOverflow;
            overflowX?: import("../index.ts").BoxOverflow;
            overflowY?: import("../index.ts").BoxOverflow;
            forgiveVerticalOverflow?: boolean;
            extraStyles?: CSSProperties;
            extraClass?: string;
        } & {
            scrollTop?: number;
            scrollLeft?: number;
        }> & Readonly<{
            "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
            "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
        }>, {
            el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
            scrollEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
            verticalBarVisible: import("vue").Ref<boolean, boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            "update:scrollTop": (value: number | undefined) => any;
            "update:scrollLeft": (value: number | undefined) => any;
        }, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        type: BoxType;
        overflow?: import("../index.ts").BoxOverflow;
        overflowX?: import("../index.ts").BoxOverflow;
        overflowY?: import("../index.ts").BoxOverflow;
        forgiveVerticalOverflow?: boolean;
        extraStyles?: CSSProperties;
        extraClass?: string;
    } & {
        scrollTop?: number;
        scrollLeft?: number;
    }> & Readonly<{
        "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
        "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
    }>, "el" | "scrollEl" | "verticalBarVisible"> & import("vue").ShallowUnwrapRef<{
        el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
        scrollEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
        verticalBarVisible: import("vue").Ref<boolean, boolean>;
    }> & {} & import("vue").ComponentCustomProperties & {} & {
        $slots: {
            default?: (props: {}) => any;
        } & {
            default?: (props: {}) => any;
        };
    }) | null, ({
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: {
            readonly type: BoxType;
            readonly overflow?: import("../index.ts").BoxOverflow | undefined;
            readonly overflowX?: import("../index.ts").BoxOverflow | undefined;
            readonly overflowY?: import("../index.ts").BoxOverflow | undefined;
            readonly forgiveVerticalOverflow?: boolean | undefined;
            readonly extraStyles?: CSSProperties | undefined;
            readonly extraClass?: string | undefined;
            readonly scrollTop?: number | undefined;
            readonly scrollLeft?: number | undefined;
            readonly "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
            readonly "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
        } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps;
        $attrs: import("vue").Attrs;
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: import("vue").Slot<any> | undefined;
        }>;
        $root: import("vue").ComponentPublicInstance | null;
        $parent: import("vue").ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "update:scrollTop", value: number | undefined) => void) & ((event: "update:scrollLeft", value: number | undefined) => void);
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<{
            type: BoxType;
            overflow?: import("../index.ts").BoxOverflow;
            overflowX?: import("../index.ts").BoxOverflow;
            overflowY?: import("../index.ts").BoxOverflow;
            forgiveVerticalOverflow?: boolean;
            extraStyles?: CSSProperties;
            extraClass?: string;
        } & {
            scrollTop?: number;
            scrollLeft?: number;
        }> & Readonly<{
            "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
            "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
        }>, {
            el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
            scrollEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
            verticalBarVisible: import("vue").Ref<boolean, boolean>;
        }, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
            "update:scrollTop": (value: number | undefined) => any;
            "update:scrollLeft": (value: number | undefined) => any;
        }, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import("@vue/reactivity").OnCleanup]) => any : (...args: [any, any, import("@vue/reactivity").OnCleanup]) => any, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
    } & Readonly<{}> & Omit<Readonly<{
        type: BoxType;
        overflow?: import("../index.ts").BoxOverflow;
        overflowX?: import("../index.ts").BoxOverflow;
        overflowY?: import("../index.ts").BoxOverflow;
        forgiveVerticalOverflow?: boolean;
        extraStyles?: CSSProperties;
        extraClass?: string;
    } & {
        scrollTop?: number;
        scrollLeft?: number;
    }> & Readonly<{
        "onUpdate:scrollTop"?: ((value: number | undefined) => any) | undefined;
        "onUpdate:scrollLeft"?: ((value: number | undefined) => any) | undefined;
    }>, "el" | "scrollEl" | "verticalBarVisible"> & import("vue").ShallowUnwrapRef<{
        el: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
        scrollEl: import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>;
        verticalBarVisible: import("vue").Ref<boolean, boolean>;
    }> & {} & import("vue").ComponentCustomProperties & {} & {
        $slots: {
            default?: (props: {}) => any;
        } & {
            default?: (props: {}) => any;
        };
    }) | null>;
    syncValue: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    input: () => any;
    beforeinput: (e: InputEvent) => any;
    blur: () => any;
    focus: () => any;
    keydown: (e: KeyboardEvent) => any;
    paste: (e: ClipboardEvent) => any;
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<BaseInputProps> & Readonly<{
    onInput?: (() => any) | undefined;
    onBeforeinput?: ((e: InputEvent) => any) | undefined;
    onBlur?: (() => any) | undefined;
    onFocus?: (() => any) | undefined;
    onKeydown?: ((e: KeyboardEvent) => any) | undefined;
    onPaste?: ((e: ClipboardEvent) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    extraStyles: CSSProperties;
    wrap: boolean;
    disabled: boolean;
    placeholder: string;
    maxLength: number;
    boxType: BoxType;
    editorExtraStyles: CSSProperties;
    multiline: boolean;
    allow: RegExp;
    deny: RegExp;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
