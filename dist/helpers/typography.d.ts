import type { CSSProperties } from 'vue';
export interface TypographySettings {
    /**
     * A bitmap strike token from `[8, 10, 12, 16, 18, 24]`, rendered at `size × 2`
     * CSS px. Not a CSS px value.
     */
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
