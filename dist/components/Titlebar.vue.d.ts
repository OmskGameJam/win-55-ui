export interface TitlebarProps {
    title: string;
    icon?: string;
    showPlaceholderButtons?: boolean;
    gradientColorA?: string;
    gradientColorB?: string;
}
declare var __VLS_4: {};
type __VLS_Slots = {} & {
    buttons?: (props: typeof __VLS_4) => any;
};
declare const __VLS_component: import("vue").DefineComponent<TitlebarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<TitlebarProps> & Readonly<{}>, {
    gradientColorA: string;
    gradientColorB: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
