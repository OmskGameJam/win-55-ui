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

export function typographyStyles(settings: TypographySettings): CSSProperties {
  // Parse shorthand or derive from individual settings
  const { style, size } = settings.shorthand
    ? parseShorthand(settings.shorthand)
    : {
        style: getStyleString(settings.isBold, settings.isItalic),
        size: findClosestNumber(settings.fontSize ?? 12, SIZES)
      };

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
