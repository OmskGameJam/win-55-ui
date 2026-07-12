import type { CSSProperties } from 'vue'

const SIZES = [10, 12, 14, 16, 24]

export interface TypographySettings {
  fontSize?: number,
  isBold?: boolean,
  isItalic?: boolean,
  fontColor?: string,
  shorthand?: string,
  fontShadowColor?: string,
}

/*
 * The registry of font faces actually declared via @font-face in index.css.
 * Requesting a style/size combination outside this list degrades instead of
 * silently rendering an unstyled system font under a made-up family name —
 * this is what lets callers (e.g. a BBCode renderer) pass along styles we
 * haven't shipped a bitmap strike for yet (isItalic, unlisted sizes, ...)
 * without needing to know which combinations exist. Keep in sync with the
 * @font-face declarations in index.css.
 */
const SUPPORTED_FACES: ReadonlyArray<{ style: string; size: number }> = [
  { style: 'Regular', size: 12 },
  { style: 'Bold', size: 12 },
  { style: 'Regular', size: 24 },
]

const STYLE_FALLBACKS: Record<string, string[]> = {
  BoldItalic: ['BoldItalic', 'Bold', 'Italic', 'Regular'],
  Bold: ['Bold', 'Regular'],
  Italic: ['Italic', 'Regular'],
  Regular: ['Regular'],
}

function sizesForStyle(style: string): number[] {
  return SUPPORTED_FACES.filter((face) => face.style === style).map((face) => face.size)
}

/** Degrades an arbitrary requested style/size down to one we actually have a font for. */
function resolveSupportedFace(style: string, size: number): { style: string; size: number } {
  const fallbackChain = STYLE_FALLBACKS[style] ?? ['Regular']

  for (const candidateStyle of fallbackChain) {
    if (sizesForStyle(candidateStyle).includes(size)) {
      return { style: candidateStyle, size }
    }
  }

  for (const candidateStyle of fallbackChain) {
    const sizes = sizesForStyle(candidateStyle)

    if (sizes.length > 0) {
      return { style: candidateStyle, size: findClosestNumber(size, sizes) }
    }
  }

  return { style: 'Regular', size }
}

export function typographyStyles(settings: TypographySettings): CSSProperties {
  // Parse shorthand or derive from individual settings
  const { style: requestedStyle, size: requestedSize } = settings.shorthand
    ? parseShorthand(settings.shorthand)
    : {
        style: getStyleString(settings.isBold, settings.isItalic),
        size: findClosestNumber(settings.fontSize ?? 12, SIZES)
      };

  const { style, size } = resolveSupportedFace(requestedStyle, requestedSize)

  const outStyle: CSSProperties = {
    fontFamily: `${style}${size}, Arial, sans`,
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
