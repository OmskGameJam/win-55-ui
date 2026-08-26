import { createRequire } from 'node:module'
import type { GIFEncoderFn } from 'gifenc'

// gifenc ships only a CJS bundle without an "exports" field, and Node's static named-export
// detection for it fails at runtime ("does not provide an export named 'GIFEncoder'") even
// though `require('gifenc').GIFEncoder` works fine - route through createRequire to sidestep
// the ESM/CJS interop analysis entirely. Types still come from gifenc.d.ts via the type-only
// import above, which is erased at compile time and never touches this at runtime.
const require = createRequire(import.meta.url)
const GIFEncoder: GIFEncoderFn = require('gifenc').GIFEncoder

export interface GifFrame {
  /** RGBA, straight alpha, width*height*4 bytes. Alpha is treated as binary - 0 is transparent, anything else is opaque. */
  rgba: Uint8ClampedArray
  delayCs: number
}

/**
 * Encodes an exact (non-quantized) indexed-color GIF: every distinct opaque color across all
 * frames gets its own palette slot, no approximation. Our source cursors are already small
 * palettes (mono/4bpp/reconstructed-mono, see CLAUDE.md's "Курсоры" section) - quantization
 * would be lossy for no reason. Throws past 255 distinct colors rather than silently degrading;
 * nothing in src-cursors/ hits that today.
 */
export function encodeGif(frames: GifFrame[], width: number, height: number): Buffer {
  const colorKey = (r: number, g: number, b: number) => (r << 16) | (g << 8) | b
  const colors = new Map<number, [number, number, number]>()

  for (const frame of frames) {
    for (let i = 0; i < frame.rgba.length; i += 4) {
      if (frame.rgba[i + 3] === 0) continue
      const key = colorKey(frame.rgba[i], frame.rgba[i + 1], frame.rgba[i + 2])
      if (!colors.has(key)) colors.set(key, [frame.rgba[i], frame.rgba[i + 1], frame.rgba[i + 2]])
    }
  }

  if (colors.size > 255) throw new Error(`gif: ${colors.size} distinct opaque colors exceeds the 255 exact-palette limit`)

  const TRANSPARENT_INDEX = 0
  const palette: [number, number, number][] = [[0, 0, 0]] // index 0 reserved for transparent - its RGB value is never displayed
  const indexByColor = new Map<number, number>()
  for (const [key, rgb] of colors) {
    indexByColor.set(key, palette.length)
    palette.push(rgb)
  }

  const encoder = GIFEncoder()

  frames.forEach((frame, i) => {
    const indexed = new Uint8Array(width * height)
    for (let p = 0; p < width * height; p++) {
      const o = p * 4
      indexed[p] = frame.rgba[o + 3] === 0 ? TRANSPARENT_INDEX : indexByColor.get(colorKey(frame.rgba[o], frame.rgba[o + 1], frame.rgba[o + 2]))!
    }

    encoder.writeFrame(indexed, width, height, {
      palette: i === 0 ? palette : undefined,
      transparent: true,
      transparentIndex: TRANSPARENT_INDEX,
      delay: frame.delayCs * 10, // gifenc's `delay` is milliseconds, and divides by 10 internally to get GIF centiseconds
      repeat: 0, // loop forever - a live cursor animation shouldn't stop
    })
  })

  encoder.finish()
  return Buffer.from(encoder.bytes())
}
