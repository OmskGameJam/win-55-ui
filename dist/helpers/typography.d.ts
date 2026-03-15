import type { CSSProperties } from 'vue';
export interface TypographySettings {
    fontSize?: number;
    isBold?: boolean;
    isItalic?: boolean;
    fontColor?: string;
    shorthand?: string;
    fontShadowColor?: string;
}
export declare function typographyStyles(settings: TypographySettings): CSSProperties;
