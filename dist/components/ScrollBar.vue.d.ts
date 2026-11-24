type __VLS_Props = {
    orientation: 'vertical' | 'horizontal';
    scrollPos: number;
    viewportSize: number;
    contentSize: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "scroll-to": (pos: number) => any;
    "scroll-by": (delta: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onScroll-to"?: ((pos: number) => any) | undefined;
    "onScroll-by"?: ((delta: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
