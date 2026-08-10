import type { CSSProperties } from 'vue'
// SUPPORTED_FACES is generated from src-font/fonts.json (`npm run font -- update-register`), not
// hand-maintained - see generatedFonts.ts. Requesting a style/size/fontName combination outside it
// degrades (see resolveSupportedFace below) instead of silently rendering an unstyled system font,
// which is what lets callers (e.g. a BBCode renderer) pass along styles we haven't shipped a
// bitmap strike for yet without needing to know which combinations actually exist.
import { SUPPORTED_FACES } from './generatedFonts'

const SIZES = [10, 12, 14, 16, 24]

const DEFAULT_FONT_NAME = 'Standard'

export interface TypographySettings {
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

/** Degrades an arbitrary requested fontName/style/size down to one we actually have a font for. */
function resolveSupportedFace(fontName: string, style: string, size: number): { fontName: string; style: string; size: number } {
  // An unknown font name has nothing to degrade through — fall back to the one family
  // guaranteed to exist rather than falling through to an unstyled system font.
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
  // Parse shorthand or derive from individual settings
  const { style: requestedStyle, size: requestedSize } = settings.shorthand
    ? parseShorthand(settings.shorthand)
    : {
        style: getStyleString(settings.isBold, settings.isItalic),
        size: findClosestNumber(settings.fontSize ?? 12, SIZES)
      };

  const { fontName, style, size } = resolveSupportedFace(settings.fontName ?? DEFAULT_FONT_NAME, requestedStyle, requestedSize)

  // The TofuMaker companion (see scripts/font/src/tofu.ts) maps every Unicode codepoint to this
  // face's own '?' glyph - placed right after the real face and before any system font, so a
  // codepoint we have no ink for renders as our own pixel-style '?' instead of falling through to
  // a smooth system glyph. Arial/sans stays as a last-resort safety net in case that font itself
  // somehow fails to load, not as the normal fallback path.
  const outStyle: CSSProperties = {
    fontFamily: `${fontName}-${style}-${size}, ${fontName}-${style}-${size}-TofuMaker, Arial, sans`,
    fontSize: `${size * 2}px`,
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
