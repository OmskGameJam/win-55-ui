export interface TypographySettings {
  type: 'basic' | 'bigger' | 'title'
  colorHex?: string
  colorShadow?: string
}

export function typographyStyles(settings: TypographySettings): React.CSSProperties {
  return {
    fontFamily: "'YourTTFFont', monospace",
    fontSize: '16px',
    transform: 'scale(2)',
    transformOrigin: 'top left',
    imageRendering: 'pixelated',
    display: 'inline-block',
  }
}