type __VLS_Props = {
    orientation: 'vertical' | 'horizontal';
    scrollPos: number;
    viewportSize: number;
    contentSize: number;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    scrollTo: (pos: number) => any;
    scrollBy: (delta: number) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onScrollTo?: ((pos: number) => any) | undefined;
    onScrollBy?: ((delta: number) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
