import type { CSSProperties } from 'vue'
// Generated; unsupported combinations degrade rather than falling back to a system font.
import { SUPPORTED_FACES } from './generatedFonts'

const SIZES = [8, 10, 12, 16, 18, 24]

const DEFAULT_FONT_NAME = 'Standard'

export interface TypographySettings {
  /**
   * A bitmap strike token from `[8, 10, 12, 16, 18, 24]`, rendered at `size × 2`
   * CSS px. Not a CSS px value.
   */
  fontSize?: number,
  isBold?: boolean,
  isItalic?: boolean,
  fontColor?: string,
  shorthand?: string,
  fontShadowColor?: string,
  /** Which font family to use — an entry in SUPPORTED_FACES. Defaults to "Standard". */
  fontName?: string,
}

const STYLE_FALLBACKS: Record<string, string[]> = {
  BoldItalic: ['BoldItalic', 'Bold', 'Italic', 'Regular'],
  Bold: ['Bold', 'Regular'],
  Italic: ['Italic', 'Regular'],
  Regular: ['Regular'],
}

function sizesForStyle(fontName: string, style: string): number[] {
  return SUPPORTED_FACES.filter((face) => face.fontName === fontName && face.style === style).map((face) => face.size)
}

function resolveSupportedFace(fontName: string, style: string, size: number): { fontName: string; style: string; size: number } {
  // An unknown font name has nothing to degrade through; use the guaranteed family.
  const resolvedFontName = SUPPORTED_FACES.some((face) => face.fontName === fontName) ? fontName : DEFAULT_FONT_NAME

  const fallbackChain = STYLE_FALLBACKS[style] ?? ['Regular']

  for (const candidateStyle of fallbackChain) {
    if (sizesForStyle(resolvedFontName, candidateStyle).includes(size)) {
      return { fontName: resolvedFontName, style: candidateStyle, size }
    }
  }

  for (const candidateStyle of fallbackChain) {
    const sizes = sizesForStyle(resolvedFontName, candidateStyle)

    if (sizes.length > 0) {
      return { fontName: resolvedFontName, style: candidateStyle, size: findClosestNumber(size, sizes) }
    }
  }

  return { fontName: resolvedFontName, style: 'Regular', size }
}

export function typographyStyles(settings: TypographySettings): CSSProperties {
  const { style: requestedStyle, size: requestedSize } = settings.shorthand
    ? parseShorthand(settings.shorthand)
    : {
        style: getStyleString(settings.isBold, settings.isItalic),
        size: findClosestNumber(settings.fontSize ?? 12, SIZES)
      };

  const { fontName, style, size } = resolveSupportedFace(settings.fontName ?? DEFAULT_FONT_NAME, requestedStyle, requestedSize)

  // TofuMaker maps every codepoint to this face's '?' glyph, placed before any system font.
  const outStyle: CSSProperties = {
    fontFamily: `${fontName}-${style}-${size}, ${fontName}-${style}-${size}-TofuMaker`,
    fontSize: `${size * 2}px`,
    lineHeight: `${size * 2}px`,
    color: settings.fontColor,
  };

  if (settings.fontShadowColor) {
    outStyle.textShadow = `2px 2px 0 ${settings.fontShadowColor}`;
  }

  return outStyle;
}

function getStyleString(isBold?: boolean, isItalic?: boolean): string {
  if (isBold && isItalic) return 'BoldItalic';
  if (isBold) return 'Bold';
  if (isItalic) return 'Italic';
  return 'Regular';
}

function parseShorthand(shorthand: string): { style: string; size: number } {
  const match = shorthand.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid shorthand format: ${shorthand}`);
  }

  const style = match[1];
  const size = parseInt(match[2], 10);

  return { style, size };
}

function findClosestNumber(target: number, numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error("Array cannot be empty");
  }

  return numbers.reduce((closest, current) => {
    const currentDiff = Math.abs(current - target);
    const closestDiff = Math.abs(closest - target);

    return currentDiff < closestDiff ? current : closest;
  });
}
