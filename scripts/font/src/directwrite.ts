/**
 * Windows-only DirectWrite rasterizer, called directly via Koffi FFI against DirectWrite's COM
 * vtables — no native addon, no build toolchain, just dwrite.dll (present on every Windows
 * install since Vista SP2). This replaced the FreeType-based rasterizer (lv_font_conv) after
 * side-by-side comparison showed DirectWrite's DWRITE_RENDERING_MODE_ALIASED output is
 * genuinely cleaner than any FreeType hinting/interpreter-version combination tested — that's
 * what actual Windows apps like Aseprite render pixel text through (via Skia's DirectWrite
 * backend), and no FreeType configuration reproduced it. See FONTS.md for the full investigation.
 *
 * DirectWrite is a stable, versioned COM ABI (unlike Skia's C++ classes, which have no such
 * guarantee) — that stability is what makes hand-rolled vtable dispatch a reasonable thing to
 * do here at all. GUIDs and method vtable orders below are verified against Microsoft's own
 * win32metadata-derived windows-rs bindings and cross-checked against raw dwrite.h source, not
 * just recalled from memory — getting a COM vtable slot wrong causes silent memory corruption
 * or a crash, not a clean error.
 *
 * Every interface here ultimately derives from IUnknown, whose QueryInterface/AddRef/Release
 * always occupy vtable slots 0-2 *before* an interface's own declared methods start at slot 3.
 * `vtableSlot()` takes the method's 0-based index within the interface's *own* declared method
 * list (matching the order documented per-interface below) and adds that +3 offset itself.
 */

import koffi from 'koffi'
import type { BdfGlyph } from './types.js'

const dwrite = koffi.load('dwrite.dll')

const GUID = koffi.struct('DWRITE_GUID', {
  Data1: 'uint32',
  Data2: 'uint16',
  Data3: 'uint16',
  Data4: koffi.array('uint8', 8),
})

const RECT = koffi.struct('DWRITE_RECT', { left: 'int32', top: 'int32', right: 'int32', bottom: 'int32' })

const DWRITE_GLYPH_OFFSET = koffi.struct('DWRITE_GLYPH_OFFSET', {
  advanceOffset: 'float32',
  ascenderOffset: 'float32',
})

const DWRITE_GLYPH_RUN = koffi.struct('DWRITE_GLYPH_RUN', {
  fontFace: koffi.pointer('void'),
  fontEmSize: 'float32',
  glyphCount: 'uint32',
  glyphIndices: koffi.pointer('uint16'),
  glyphAdvances: koffi.pointer('float32'),
  glyphOffsets: koffi.pointer(DWRITE_GLYPH_OFFSET),
  isSideways: 'int32',
  bidiLevel: 'uint32',
})

// DWRITE_FONT_METRICS field order per dwrite.h — only designUnitsPerEm is actually read.
const DWRITE_FONT_METRICS = koffi.struct('DWRITE_FONT_METRICS', {
  designUnitsPerEm: 'uint16',
  ascent: 'uint16',
  descent: 'uint16',
  lineGap: 'int16',
  capHeight: 'uint16',
  xHeight: 'uint16',
  underlinePosition: 'int16',
  underlineThickness: 'uint16',
  strikethroughPosition: 'int16',
  strikethroughThickness: 'uint16',
})

// DWRITE_GLYPH_METRICS field order per dwrite.h — only advanceWidth is actually read.
const DWRITE_GLYPH_METRICS = koffi.struct('DWRITE_GLYPH_METRICS', {
  leftSideBearing: 'int32',
  advanceWidth: 'uint32',
  rightSideBearing: 'int32',
  topSideBearing: 'int32',
  advanceHeight: 'uint32',
  bottomSideBearing: 'int32',
  verticalOriginY: 'int32',
})

function makeGuid(hex: string): { Data1: number; Data2: number; Data3: number; Data4: number[] } {
  const parts = hex.split('-')
  const data4Hex = parts[3] + parts[4]
  const data4: number[] = []
  for (let i = 0; i < 16; i += 2) data4.push(parseInt(data4Hex.slice(i, i + 2), 16))
  return { Data1: parseInt(parts[0], 16), Data2: parseInt(parts[1], 16), Data3: parseInt(parts[2], 16), Data4: data4 }
}

const IID_IDWriteFactory = makeGuid('b859ee5a-d838-4b5b-a2e8-1adc7d93db48')

function readPtrAt(addr: bigint, byteOffset: number): bigint {
  const buf = koffi.view(addr, byteOffset + 8) as ArrayBuffer
  return new DataView(buf).getBigUint64(byteOffset, true)
}

/** ownIndex = 0-based position within the interface's own declared method list (not counting IUnknown). */
function vtableSlot(interfacePtr: bigint, ownIndex: number): bigint {
  const vtable = readPtrAt(interfacePtr, 0)
  return readPtrAt(vtable, (ownIndex + 3) * 8)
}

function release(interfacePtr: bigint): void {
  koffi.call(vtableSlot(interfacePtr, -1), koffi.proto('uint32', [koffi.pointer('void')]), interfacePtr)
}

function checkHr(hr: number, what: string): void {
  if (hr < 0) throw new Error(`${what} failed: HRESULT 0x${(hr >>> 0).toString(16)}`)
}

const DWriteCreateFactory = dwrite.func('DWriteCreateFactory', 'long', [
  'int',
  koffi.pointer(GUID),
  koffi.out(koffi.pointer('void', 2)),
])

// --- IDWriteFactory (own method indices per verified windows-rs order) ---
const protoCreateFontFileReference = koffi.proto('long', [
  koffi.pointer('void'),
  'wstring',
  koffi.pointer('void'),
  koffi.out(koffi.pointer('void', 2)),
])
const OWN_CreateFontFileReference = 4

const protoCreateFontFace = koffi.proto('long', [
  koffi.pointer('void'),
  'int',
  'uint32',
  koffi.pointer('void'),
  'uint32',
  'int',
  koffi.out(koffi.pointer('void', 2)),
])
const OWN_CreateFontFace = 6

const protoCreateGlyphRunAnalysis = koffi.proto('long', [
  koffi.pointer('void'),
  koffi.pointer(DWRITE_GLYPH_RUN),
  'float32',
  koffi.pointer('void'),
  'int',
  'int',
  'float32',
  'float32',
  koffi.out(koffi.pointer('void', 2)),
])
const OWN_CreateGlyphRunAnalysis = 20

// --- IDWriteFontFace ---
const protoGetMetrics = koffi.proto('void', [koffi.pointer('void'), koffi.pointer(DWRITE_FONT_METRICS)])
const OWN_GetMetrics = 5

// GetDesignGlyphMetrics returns *unhinted* design-space advances - scaled and rounded, these
// come out a pixel wider than the real hinted advance on several common glyphs (verified against
// the old FreeType-produced BDFs' DWIDTH: 'S' 8 vs 7, 'a'/'o'/'g' 7 vs 6). GetGdiCompatibleGlyphMetrics
// is DirectWrite's purpose-built API for grid-fit-aware advances instead - useGdiNatural=false
// selects "GDI Classic" hinting, the older/blockier of its two modes and the better fit for this
// project's Windows-98-era aesthetic goal (useGdiNatural=true is closer to modern ClearType).
const protoGetGdiCompatibleGlyphMetrics = koffi.proto('long', [
  koffi.pointer('void'),
  'float32',
  'float32',
  koffi.pointer('void'),
  'int32',
  koffi.pointer('uint16'),
  'uint32',
  koffi.pointer(DWRITE_GLYPH_METRICS),
  'int32',
])
const OWN_GetGdiCompatibleGlyphMetrics = 14

const protoGetGlyphIndices = koffi.proto('long', [
  koffi.pointer('void'),
  koffi.pointer('uint32'),
  'uint32',
  koffi.pointer('uint16'),
])
const OWN_GetGlyphIndices = 8

// --- IDWriteGlyphRunAnalysis ---
const protoGetAlphaTextureBounds = koffi.proto('long', [koffi.pointer('void'), 'int', koffi.out(koffi.pointer(RECT))])
const OWN_GetAlphaTextureBounds = 0

const protoCreateAlphaTexture = koffi.proto('long', [
  koffi.pointer('void'),
  'int',
  koffi.pointer(RECT),
  koffi.pointer('uint8'),
  'uint32',
])
const OWN_CreateAlphaTexture = 1

const DWRITE_FACTORY_TYPE_SHARED = 0
const DWRITE_FONT_FACE_TYPE_TRUETYPE = 1
const DWRITE_FONT_SIMULATIONS_NONE = 0
const DWRITE_MEASURING_MODE_NATURAL = 0
const DWRITE_RENDERING_MODE_ALIASED = 1
const DWRITE_TEXTURE_ALIASED_1x1 = 0

// Generous headroom above the baseline so any glyph's ascent fits in positive texture-bounds Y
// before we translate back to baseline-relative coordinates ourselves.
const BASELINE_Y_MARGIN = 4096

export interface DWriteFace {
  factory: bigint
  fontFile: bigint
  fontFace: bigint
  pixelSize: number
  designUnitsPerEm: number
}

export function createFace(sourcePath: string, pixelSize: number): DWriteFace {
  const outFactory: [bigint | null] = [null]
  checkHr(DWriteCreateFactory(DWRITE_FACTORY_TYPE_SHARED, IID_IDWriteFactory, outFactory), 'DWriteCreateFactory')
  const factory = outFactory[0]!

  const outFontFile: [bigint | null] = [null]
  checkHr(
    koffi.call(
      vtableSlot(factory, OWN_CreateFontFileReference),
      protoCreateFontFileReference,
      factory,
      sourcePath,
      null,
      outFontFile,
    ),
    'CreateFontFileReference',
  )
  const fontFile = outFontFile[0]!

  const fontFilesBuf = Buffer.alloc(8)
  fontFilesBuf.writeBigUInt64LE(fontFile, 0)

  const outFontFace: [bigint | null] = [null]
  checkHr(
    koffi.call(
      vtableSlot(factory, OWN_CreateFontFace),
      protoCreateFontFace,
      factory,
      DWRITE_FONT_FACE_TYPE_TRUETYPE,
      1,
      fontFilesBuf,
      0,
      DWRITE_FONT_SIMULATIONS_NONE,
      outFontFace,
    ),
    'CreateFontFace',
  )
  const fontFace = outFontFace[0]!

  const metricsBuf = Buffer.alloc(koffi.sizeof(DWRITE_FONT_METRICS))
  koffi.call(vtableSlot(fontFace, OWN_GetMetrics), protoGetMetrics, fontFace, metricsBuf)
  const designUnitsPerEm = metricsBuf.readUInt16LE(0)

  return { factory, fontFile, fontFace, pixelSize, designUnitsPerEm }
}

export function destroyFace(face: DWriteFace): void {
  release(face.fontFace)
  release(face.fontFile)
  release(face.factory)
}

function glyphIndexFor(face: DWriteFace, codepoint: number): number {
  const codepointsBuf = Buffer.alloc(4)
  codepointsBuf.writeUInt32LE(codepoint, 0)
  const glyphIndicesBuf = Buffer.alloc(2)
  checkHr(
    koffi.call(vtableSlot(face.fontFace, OWN_GetGlyphIndices), protoGetGlyphIndices, face.fontFace, codepointsBuf, 1, glyphIndicesBuf),
    'GetGlyphIndices',
  )
  return glyphIndicesBuf.readUInt16LE(0)
}

export function glyphExists(face: DWriteFace, codepoint: number): boolean {
  return glyphIndexFor(face, codepoint) !== 0
}

export interface DWriteGlyphRender {
  x: number
  y: number
  width: number
  height: number
  advance_x: number
  advance_y: number
  pixels: number[][]
  freetype: { advance: { x: number; y: number } }
}

/**
 * Renders one glyph via DWRITE_RENDERING_MODE_ALIASED + DWRITE_TEXTURE_ALIASED_1x1 — DirectWrite's
 * bilevel, hinted, no-antialiasing mode, the closest analog to (and empirically cleaner than)
 * FreeType's FT_LOAD_TARGET_MONO. Return shape mirrors the old FreetypeGlyphRender exactly so
 * rasterize.ts's downstream logic (kerning heuristics, BdfGlyph assembly) didn't need to change.
 */
export function renderGlyph(face: DWriteFace, codepoint: number): DWriteGlyphRender {
  const glyphIndex = glyphIndexFor(face, codepoint)
  if (glyphIndex === 0) throw new Error(`glyph does not exist for codepoint ${codepoint}`)

  const glyphIndexBuf = Buffer.alloc(2)
  glyphIndexBuf.writeUInt16LE(glyphIndex, 0)

  const designMetricsBuf = Buffer.alloc(koffi.sizeof(DWRITE_GLYPH_METRICS))
  checkHr(
    koffi.call(
      vtableSlot(face.fontFace, OWN_GetGdiCompatibleGlyphMetrics),
      protoGetGdiCompatibleGlyphMetrics,
      face.fontFace,
      face.pixelSize,
      1.0,
      null,
      0, // useGdiNatural = false ("GDI Classic")
      glyphIndexBuf,
      1,
      designMetricsBuf,
      0,
    ),
    'GetGdiCompatibleGlyphMetrics',
  )
  const designAdvanceWidth = designMetricsBuf.readUInt32LE(4) // offset of advanceWidth field
  const advanceX = (designAdvanceWidth * face.pixelSize) / face.designUnitsPerEm

  const glyphRun = {
    fontFace: face.fontFace,
    fontEmSize: face.pixelSize,
    glyphCount: 1,
    glyphIndices: glyphIndexBuf,
    glyphAdvances: null,
    glyphOffsets: null,
    isSideways: 0,
    bidiLevel: 0,
  }

  const outAnalysis: [bigint | null] = [null]
  checkHr(
    koffi.call(
      vtableSlot(face.factory, OWN_CreateGlyphRunAnalysis),
      protoCreateGlyphRunAnalysis,
      face.factory,
      glyphRun,
      1.0,
      null,
      DWRITE_RENDERING_MODE_ALIASED,
      DWRITE_MEASURING_MODE_NATURAL,
      0.0,
      BASELINE_Y_MARGIN,
      outAnalysis,
    ),
    'CreateGlyphRunAnalysis',
  )
  const analysis = outAnalysis[0]!

  const outBounds: [{ left: number; top: number; right: number; bottom: number }] = [
    { left: 0, top: 0, right: 0, bottom: 0 },
  ]
  checkHr(
    koffi.call(vtableSlot(analysis, OWN_GetAlphaTextureBounds), protoGetAlphaTextureBounds, analysis, DWRITE_TEXTURE_ALIASED_1x1, outBounds),
    'GetAlphaTextureBounds',
  )
  const bounds = outBounds[0]
  const width = bounds.right - bounds.left
  const height = bounds.bottom - bounds.top

  let pixels: number[][]
  if (width <= 0 || height <= 0) {
    pixels = []
  } else {
    const boundsBuf = Buffer.alloc(16)
    boundsBuf.writeInt32LE(bounds.left, 0)
    boundsBuf.writeInt32LE(bounds.top, 4)
    boundsBuf.writeInt32LE(bounds.right, 8)
    boundsBuf.writeInt32LE(bounds.bottom, 12)

    const alphaBuf = Buffer.alloc(width * height)
    checkHr(
      koffi.call(
        vtableSlot(analysis, OWN_CreateAlphaTexture),
        protoCreateAlphaTexture,
        analysis,
        DWRITE_TEXTURE_ALIASED_1x1,
        boundsBuf,
        alphaBuf,
        alphaBuf.length,
      ),
      'CreateAlphaTexture',
    )

    pixels = []
    for (let y = 0; y < height; y++) {
      const row: number[] = []
      for (let x = 0; x < width; x++) row.push(alphaBuf[y * width + x] ? 255 : 0)
      pixels.push(row)
    }
  }

  release(analysis)

  return {
    x: bounds.left,
    y: BASELINE_Y_MARGIN - bounds.top, // bitmap_top: distance from baseline up to the top row, FreeType convention
    width,
    height,
    advance_x: advanceX,
    advance_y: 0,
    pixels,
    freetype: { advance: { x: Math.round(advanceX), y: 0 } },
  }
}

/** Present only so rasterize.ts's BdfGlyph assembly (which reads `.bitmap`) has a type to import from. */
export type { BdfGlyph }
