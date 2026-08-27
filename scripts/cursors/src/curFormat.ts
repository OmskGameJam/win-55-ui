import { readFileSync } from 'node:fs'

/**
 * Parses the .cur/.ico container format (ICONDIR + ICONDIRENTRY + embedded DIB), and the
 * classic AND/XOR mask raster-op cursors rely on for hardware cursor rendering. See the
 * "Курсоры" section of CLAUDE.md for why "usesInvert" matters downstream (CSS/canvas can't
 * reproduce screen-XOR - a role that needs it can't be flattened to a plain PNG/CSS cursor
 * losslessly, it has to be rendered as a separate mix-blend-mode layer).
 */

export interface DibImageInfo {
  /** 'png' entries (modern high-res icons) have no AND/XOR mask - transparency is plain alpha. */
  format: 'dib' | 'png'
  width: number
  height: number
  /** XOR image bit depth: 1 (mono), 4/8 (indexed color), 24, or 32 (real alpha, no AND/XOR trick). */
  bitcount: number
  /** True if any AND=1 pixel has a non-black XOR value - the screen-XOR "invert" raster op. */
  usesInvert: boolean
  invertPixels: number
  /** Invert pixels whose XOR color isn't pure white - mix-blend-mode: difference only reproduces bitwise XOR at white/black, so these can't be flattened the same way. More likely conversion garbage than intentional. */
  nonWhiteInvertPixels: number
  /** AND=1 pixel count (transparent-or-invert), across the whole image. */
  maskedPixels: number
  totalPixels: number
}

export interface CurEntry extends DibImageInfo {
  /** Cursor hotspot, in pixels. Only meaningful for idType=2 (cursor) files - null for idType=1 (icon). */
  hotspotX: number | null
  hotspotY: number | null
}

export interface RenderedFrame {
  width: number
  height: number
  /** RGBA, top-down, row-major, straight (non-premultiplied) alpha. Opaque wherever AND=0 (or always, for a real-alpha 32bpp source); fully transparent wherever AND=1 - both plain-transparent and invert pixels are punched out here, since neither belongs in a flat color layer. */
  colorRgba: Uint8ClampedArray
  /** RGBA, opaque white wherever the pixel is a genuine invert pixel (AND=1, XOR non-black); fully transparent everywhere else. All-transparent for a real-alpha 32bpp source - there's no AND/XOR data left to recover invert pixels from (see CursorEntry.reconstructed). */
  invertRgba: Uint8ClampedArray
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

function paletteEntry(data: Buffer, offset: number): [number, number, number] {
  const b = data[offset]
  const g = data[offset + 1]
  const r = data[offset + 2]
  return [r, g, b]
}

interface DibLayout {
  format: 'dib' | 'png'
  width: number
  height: number
  bitcount: number
  /** False for 32bpp (real alpha, no raster-op) and for a PNG-embedded frame. */
  hasMask: boolean
  getXorRgb(x: number, y: number): [number, number, number]
  getAlpha(x: number, y: number): number
  getAndBit(x: number, y: number): number
}

/** Parses the BITMAPINFOHEADER + optional palette + XOR/AND data shared by parseDibImage and renderDibPixels, so the fiddly bit-unpacking only lives in one place. */
function decodeDibLayout(data: Buffer): DibLayout {
  if (data.subarray(0, 8).equals(PNG_MAGIC)) {
    return {
      format: 'png',
      width: 0,
      height: 0,
      bitcount: 32,
      hasMask: false,
      getXorRgb: () => [0, 0, 0],
      getAlpha: () => 0,
      getAndBit: () => 0,
    }
  }

  const biWidth = data.readInt32LE(4)
  const biHeightX2 = data.readInt32LE(8)
  const biBitCount = data.readUInt16LE(14)

  const width = biWidth
  const height = Math.trunc(biHeightX2 / 2)
  const bitcount = biBitCount

  let pos = 40
  let palette: [number, number, number][] = []
  if (bitcount <= 8) {
    const numColors = 1 << bitcount
    palette = Array.from({ length: numColors }, (_, i) => paletteEntry(data, pos + i * 4))
    pos += numColors * 4
  }

  const xorStride = Math.ceil((width * bitcount) / 32) * 4
  const xorData = data.subarray(pos, pos + xorStride * height)
  pos += xorStride * height

  const andStride = Math.ceil(width / 32) * 4
  const andData = data.subarray(pos, pos + andStride * height)

  function getXorRgb(x: number, y: number): [number, number, number] {
    const row = height - 1 - y // DIB rows are stored bottom-up
    switch (bitcount) {
      case 1: {
        const byteIdx = row * xorStride + (x >> 3)
        const bit = 7 - (x & 7)
        const idx = (xorData[byteIdx] >> bit) & 1
        return palette[idx] ?? (idx === 0 ? [0, 0, 0] : [255, 255, 255])
      }
      case 4: {
        const byteIdx = row * xorStride + (x >> 1)
        const byteVal = xorData[byteIdx]
        const idx = x % 2 === 0 ? byteVal >> 4 : byteVal & 0x0f
        return palette[idx]
      }
      case 8: {
        const byteIdx = row * xorStride + x
        return palette[xorData[byteIdx]]
      }
      case 24: {
        const byteIdx = row * xorStride + x * 3
        return [xorData[byteIdx + 2], xorData[byteIdx + 1], xorData[byteIdx]]
      }
      case 32: {
        const byteIdx = row * xorStride + x * 4
        return [xorData[byteIdx + 2], xorData[byteIdx + 1], xorData[byteIdx]]
      }
      default:
        throw new Error(`curFormat: unsupported XOR bit depth ${bitcount}`)
    }
  }

  function getAlpha(x: number, y: number): number {
    if (bitcount !== 32) return 255
    const row = height - 1 - y
    const byteIdx = row * xorStride + x * 4
    return xorData[byteIdx + 3]
  }

  function getAndBit(x: number, y: number): number {
    const row = height - 1 - y
    const byteIdx = row * andStride + (x >> 3)
    const bit = 7 - (x & 7)
    return (andData[byteIdx] >> bit) & 1
  }

  return { format: 'dib', width, height, bitcount, hasMask: bitcount < 32, getXorRgb, getAlpha, getAndBit }
}

/**
 * Walks every pixel of one embedded ICO/CUR image to count invert usage, without allocating
 * pixel buffers - the cheap path used by discover, which only needs the aggregate counts.
 */
export function parseDibImage(data: Buffer): DibImageInfo {
  const layout = decodeDibLayout(data)
  let invertPixels = 0
  let nonWhiteInvertPixels = 0
  let maskedPixels = 0

  if (layout.hasMask) {
    for (let y = 0; y < layout.height; y++) {
      for (let x = 0; x < layout.width; x++) {
        if (layout.getAndBit(x, y) === 1) {
          maskedPixels++
          const [r, g, b] = layout.getXorRgb(x, y)
          if (r !== 0 || g !== 0 || b !== 0) {
            invertPixels++
            if (r !== 255 || g !== 255 || b !== 255) nonWhiteInvertPixels++
          }
        }
      }
    }
  }

  return {
    format: layout.format,
    width: layout.width,
    height: layout.height,
    bitcount: layout.bitcount,
    usesInvert: invertPixels > 0,
    invertPixels,
    nonWhiteInvertPixels,
    maskedPixels,
    totalPixels: layout.width * layout.height,
  }
}

/** Renders one embedded ICO/CUR image into separate color and invert RGBA buffers - the pixel data sprite generation needs, as opposed to parseDibImage's aggregate-only counts. Throws on a PNG-embedded frame (none of the current src-cursors/ files use one). */
export function renderDibPixels(data: Buffer): RenderedFrame {
  const layout = decodeDibLayout(data)
  if (layout.format === 'png') throw new Error('curFormat: PNG-embedded cursor frames are not supported')

  const { width, height, hasMask } = layout
  const colorRgba = new Uint8ClampedArray(width * height * 4)
  const invertRgba = new Uint8ClampedArray(width * height * 4)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4

      if (!hasMask) {
        // Real-alpha 32bpp source: no AND/XOR trick to separate, invertRgba stays transparent.
        const [r, g, b] = layout.getXorRgb(x, y)
        colorRgba[pi] = r
        colorRgba[pi + 1] = g
        colorRgba[pi + 2] = b
        colorRgba[pi + 3] = layout.getAlpha(x, y)
        continue
      }

      if (layout.getAndBit(x, y) === 0) {
        const [r, g, b] = layout.getXorRgb(x, y)
        colorRgba[pi] = r
        colorRgba[pi + 1] = g
        colorRgba[pi + 2] = b
        colorRgba[pi + 3] = 255
      } else {
        const [r, g, b] = layout.getXorRgb(x, y)
        if (r !== 0 || g !== 0 || b !== 0) {
          invertRgba[pi] = 255
          invertRgba[pi + 1] = 255
          invertRgba[pi + 2] = 255
          invertRgba[pi + 3] = 255
        }
      }
    }
  }

  return { width, height, colorRgba, invertRgba }
}

/** Parses a standalone .cur/.ico file, or an already-extracted frame blob in the same layout (e.g. from an .ani "icon" chunk). */
export function parseCurOrIcoBlob(data: Buffer): CurEntry[] {
  const idType = data.readUInt16LE(2)
  const idCount = data.readUInt16LE(4)
  const entries: CurEntry[] = []

  for (let i = 0; i < idCount; i++) {
    const off = 6 + i * 16
    const p1 = data.readUInt16LE(off + 4) // wPlanes (icon) / xHotspot (cursor)
    const p2 = data.readUInt16LE(off + 6) // wBitCount (icon) / yHotspot (cursor)
    const bytesInRes = data.readUInt32LE(off + 8)
    const imageOffset = data.readUInt32LE(off + 12)

    const img = parseDibImage(data.subarray(imageOffset, imageOffset + bytesInRes))
    entries.push({ ...img, hotspotX: idType === 2 ? p1 : null, hotspotY: idType === 2 ? p2 : null })
  }

  return entries
}

/** Same entry format as parseCurOrIcoBlob, but returns the raw per-entry image bytes instead of parsed stats - what renderDibPixels needs. */
export function extractCurOrIcoImageBlobs(data: Buffer): Buffer[] {
  const idCount = data.readUInt16LE(4)
  const blobs: Buffer[] = []

  for (let i = 0; i < idCount; i++) {
    const off = 6 + i * 16
    const bytesInRes = data.readUInt32LE(off + 8)
    const imageOffset = data.readUInt32LE(off + 12)
    blobs.push(data.subarray(imageOffset, imageOffset + bytesInRes))
  }

  return blobs
}

export function analyzeCurFile(path: string): CurEntry[] {
  return parseCurOrIcoBlob(readFileSync(path))
}
