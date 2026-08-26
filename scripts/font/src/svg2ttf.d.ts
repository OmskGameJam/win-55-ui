declare module 'svg2ttf' {
  interface Svg2TtfOptions {
    copyright?: string
    description?: string
    ts?: number
    url?: string
    version?: string
    familyname?: string
    subfamilyname?: string
    fullname?: string
    id?: string
  }

  interface Svg2TtfResult {
    /** Raw TTF bytes. */
    buffer: Uint8Array
  }

  function svg2ttf(svgFontString: string, options?: Svg2TtfOptions): Svg2TtfResult

  export = svg2ttf
}
