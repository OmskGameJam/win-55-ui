// Minimal ambient types for gifenc (^1.0.3), which ships a CJS bundle with no declarations.
// Only the surface scripts/cursors/src/gif.ts uses. Mirrors scripts/font/src/svg2ttf.d.ts -
// gitignored by the repo-wide `*.d.ts` rule, kept via an explicit allowlist entry.
declare module 'gifenc' {
  interface WriteFrameOptions {
    palette?: [number, number, number][]
    transparent?: boolean
    transparentIndex?: number
    delay?: number
    repeat?: number
  }

  interface GifEncoder {
    writeFrame(index: Uint8Array, width: number, height: number, options?: WriteFrameOptions): void
    finish(): void
    bytes(): Uint8Array
  }

  export type GIFEncoderFn = () => GifEncoder
  export const GIFEncoder: GIFEncoderFn
}
