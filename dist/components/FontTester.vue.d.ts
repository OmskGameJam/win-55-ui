import type { TypographySettings } from '../helpers/typography';
interface Props extends Omit<TypographySettings, 'fontColor'> {
    text?: string;
    /** Size, in px, of one checkerboard square. */
    cellSize?: number;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {
    text: string;
    cellSize: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
