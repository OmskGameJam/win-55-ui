const CSS_ANCHOR = '/* font-cli: new @font-face blocks are inserted above this line */'
const SUPPORTED_FACES_ANCHOR = '  // font-cli: new entries are inserted above this line'

export interface RegistrationPlan {
  cssFamilyName: string
  publicTtfFilename: string
  cssBlock: string
  supportedFacesEntry: string
}

/**
 * Pure computation — no filesystem access. `fontName` drives BOTH the physical TTF filename
 * and the CSS font-family string, which are always identical: `{fontName}-{style}-{size}`
 * (e.g. `Standard-Regular-12`), matching `public/win-55-ui/font/Standard-Regular-12.ttf`.
 */
export function computeRegistrationPlan(style: string, size: number, fontName = 'Standard'): RegistrationPlan {
  const cssFamilyName = `${fontName}-${style}-${size}`
  const publicTtfFilename = `${cssFamilyName}.ttf`

  const cssBlock = [
    '@font-face {',
    `  font-family: "${cssFamilyName}";`,
    `  src: url("/win-55-ui/font/${publicTtfFilename}")`,
    '}',
  ].join('\n')

  const supportedFacesEntry = `  { fontName: '${fontName}', style: '${style}', size: ${size} },`

  return { cssFamilyName, publicTtfFilename, cssBlock, supportedFacesEntry }
}

export function insertFontFace(cssText: string, cssBlock: string): string {
  if (!cssText.includes(CSS_ANCHOR)) {
    throw new Error(`anchor comment not found in index.css — expected: ${CSS_ANCHOR}`)
  }
  return cssText.replace(CSS_ANCHOR, `${cssBlock}\n\n${CSS_ANCHOR}`)
}

export function insertSupportedFace(tsText: string, entryLine: string): string {
  if (!tsText.includes(SUPPORTED_FACES_ANCHOR)) {
    throw new Error(`anchor comment not found in typography.ts — expected: ${SUPPORTED_FACES_ANCHOR.trim()}`)
  }
  return tsText.replace(SUPPORTED_FACES_ANCHOR, `${entryLine}\n${SUPPORTED_FACES_ANCHOR}`)
}

/** Best-effort check against the literal `const SIZES = [...]` line, for a print-only reminder. */
export function isSizeRegistered(typographyTsText: string, size: number): boolean {
  const match = typographyTsText.match(/const SIZES\s*=\s*\[([^\]]*)\]/)
  if (!match) return false
  return match[1]
    .split(',')
    .map((s) => Number(s.trim()))
    .includes(size)
}
