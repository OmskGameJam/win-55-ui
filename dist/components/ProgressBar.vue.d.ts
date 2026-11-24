import { type CSSProperties } from 'vue';
import { type BoxType } from './Box.vue';
export interface ProgressBarSpan {
    start: number;
    end: number;
    color: string;
}
export type ProgressBarValue = number | ProgressBarSpan[];
export type ProgressBarOrientation = 'horizontal' | 'vertical';
export type ProgressBarFillStyle = 'segmented' | 'continuous';
export type ProgressBarBoxType = BoxType | 'custom';
type __VLS_Props = {
    /**
     * Determinate value in `max` units, or spans for a multi-coloured bar.
     * Omitted means indeterminate marquee, not "0"; `value: 0` is a determinate
     * empty bar.
     */
    value?: ProgressBarValue;
    max?: number;
    orientation?: ProgressBarOrientation;
    /**
     * `'none'` keeps Box's 6px frame invisibly; `'custom'` drops the frame and
     * fills the outer box. They are different geometry modes, not spellings of
     * the same thing.
     */
    boxType?: ProgressBarBoxType;
    /** Inner padding in CSS px; snaps to the **nearest** 2px cell. */
    padding?: number;
    /** Space between segments in CSS px; snaps to the **nearest** 2px cell. */
    gap?: number;
    /**
     * Segment length in CSS px; snaps **up** to the 2px grid. Wins over
     * `segmentCount` when both are set. Values below 2 render no segments.
     */
    segmentLength?: number;
    /** Segment count; ignored when a valid `segmentLength` is present. */
    segmentCount?: number;
    fillStyle?: ProgressBarFillStyle;
    /** Outer width in CSS px; snaps **up** to the 2px grid. Defaults to 384 horizontal / 36 vertical. */
    width?: number;
    /** Outer height in CSS px; snaps **up** to the 2px grid. Defaults to 36 horizontal / 384 vertical. */
    height?: number;
    /** Color for number values and the indeterminate marquee. */
    fillColor?: string;
    extraStyles?: CSSProperties;
    extraClass?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    orientation: ProgressBarOrientation;
    padding: number;
    gap: number;
    boxType: ProgressBarBoxType;
    max: number;
    fillStyle: ProgressBarFillStyle;
    fillColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
