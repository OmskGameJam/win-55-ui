import type { CSSProperties } from 'vue';
export interface TypographySettings {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    fontColor?: string;
    shorthand?: string;
    fontShadowColor?: string;
    /** Which font family to use — an entry in SUPPORTED_FACES. Defaults to "Standard". */
    fontName?: string;
}
export declare function typographyStyles(settings: TypographySettings): CSSProperties;
