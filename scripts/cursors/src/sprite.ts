import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { srcCursorsDir, publicCursorsDir, schemeIndexPath } from './paths.js'
import { loadCursorsManifest, type CursorEntry, type CursorsManifest } from './manifest.js'
import { renderDibPixels, extractCurOrIcoImageBlobs } from './curFormat.js'
import { parseAniPlayback } from './aniFormat.js'
import { encodeGif, type GifFrame } from './gif.js'

/** Sprites render at 2x the cursor's native pixel size, matching every other pixel asset in this UI kit. */
const SCALE = 2

interface Rgba {
  width: number
  height: number
  rgba: Uint8ClampedArray
}

function upscale(src: Rgba, scale: number): Rgba {
  const outWidth = src.width * scale
  const outHeight = src.height * scale
  const out = new Uint8ClampedArray(outWidth * outHeight * 4)

  for (let y = 0; y < outHeight; y++) {
    const sy = Math.floor(y / scale)
    for (let x = 0; x < outWidth; x++) {
      const sx = Math.floor(x / scale)
      const si = (sy * src.width + sx) * 4
      const di = (y * outWidth + x) * 4
      out[di] = src.rgba[si]
      out[di + 1] = src.rgba[si + 1]
      out[di + 2] = src.rgba[si + 2]
      out[di + 3] = src.rgba[si + 3]
    }
  }

  return { width: outWidth, height: outHeight, rgba: out }
}

function hasOpaquePixel(rgba: Uint8ClampedArray): boolean {
  for (let i = 3; i < rgba.length; i += 4) {
    if (rgba[i] !== 0) return true
  }
  return false
}

/** Recolors every opaque pixel to solid white (for the invert layer's mix-blend-mode: difference convention) - keeps alpha as-is. */
function recolorWhite(rgba: Uint8ClampedArray): Uint8ClampedArray {
  const out = new Uint8ClampedArray(rgba.length)
  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i + 3] !== 0) {
      out[i] = 255
      out[i + 1] = 255
      out[i + 2] = 255
      out[i + 3] = 255
    }
  }
  return out
}

/**
 * Bakes the AND/XOR (invert) layer into the normal layer as one flat, blend-free frame for native
 * cursor mode, which paints a plain CSS `url()` with no compositing tricks available. Painted
 * bottom to top: a 1px-down-right white drop shadow of the invert pixels (a background-independent
 * stand-in for the screen-invert), then the invert pixels themselves solid black, then the normal
 * layer's real pixels on top.
 */
function compositeNativeFrame(color: Uint8ClampedArray, invert: Uint8ClampedArray | undefined, width: number, height: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(width * height * 4)

  const put = (x: number, y: number, r: number, g: number, b: number): void => {
    if (x < 0 || x >= width || y < 0 || y >= height) return
    const i = (y * width + x) * 4
    out[i] = r
    out[i + 1] = g
    out[i + 2] = b
    out[i + 3] = 255
  }

  if (invert) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (invert[(y * width + x) * 4 + 3] !== 0) put(x + 1, y + 1, 255, 255, 255)
      }
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (invert[(y * width + x) * 4 + 3] !== 0) put(x, y, 0, 0, 0)
      }
    }
  }

  for (let i = 0; i < color.length; i += 4) {
    if (color[i + 3] === 0) continue
    out[i] = color[i]
    out[i + 1] = color[i + 1]
    out[i + 2] = color[i + 2]
    out[i + 3] = 255
  }

  return out
}

interface LayerFrame {
  rgba: Uint8ClampedArray
  delayCs: number
}

interface RoleFrames {
  width: number
  height: number
  color: LayerFrame[]
  invert: LayerFrame[]
}

/** Loads and renders every frame of one cursor file, already reduced to the real playback order/timing for an .ani (see aniFormat.ts's parseAniPlayback) - a static .cur is just a single frame. */
function loadRoleFrames(filename: string): RoleFrames {
  const path = join(srcCursorsDir, filename)
  const data = readFileSync(path)

  if (extname(filename).toLowerCase() !== '.ani') {
    const [blob] = extractCurOrIcoImageBlobs(data)
    const rendered = renderDibPixels(blob)
    return {
      width: rendered.width,
      height: rendered.height,
      color: [{ rgba: rendered.colorRgba, delayCs: 0 }],
      invert: [{ rgba: rendered.invertRgba, delayCs: 0 }],
    }
  }

  const { frameBlobs, sequence, delaysCs } = parseAniPlayback(data)
  const rendered = frameBlobs.map((blob) => renderDibPixels(blob))
  const { width, height } = rendered[0]

  // Coalesce consecutive steps that reuse the same stored frame into one GIF frame with summed
  // delay, instead of duplicating identical image data per step (some sets replay very short
  // frame sets over many steps - see CLAUDE.md's "Курсоры" section).
  const color: LayerFrame[] = []
  const invert: LayerFrame[] = []
  for (let i = 0; i < sequence.length; i++) {
    const frameIdx = sequence[i]
    if (i > 0 && sequence[i - 1] === frameIdx) {
      color[color.length - 1].delayCs += delaysCs[i]
      invert[invert.length - 1].delayCs += delaysCs[i]
      continue
    }
    color.push({ rgba: rendered[frameIdx].colorRgba, delayCs: delaysCs[i] })
    invert.push({ rgba: rendered[frameIdx].invertRgba, delayCs: delaysCs[i] })
  }

  return { width, height, color, invert }
}

/**
 * Sprites are meant to be manually touched up in an image editor after generation (see CLAUDE.md's
 * "Курсоры" section) - like the font pipeline's hand-editable .bdf files, a re-run must not clobber
 * that work silently. Returns false (nothing written) when the file already exists and force is off.
 */
function writeLayerGif(
  outDir: string,
  filename: string,
  width: number,
  height: number,
  frames: LayerFrame[],
  force: boolean,
  scale = SCALE,
): boolean {
  const outPath = join(outDir, filename)
  if (existsSync(outPath) && !force) return false

  const scaled = frames.map((f) => ({ ...upscale({ width, height, rgba: f.rgba }, scale), delayCs: f.delayCs || 10 }))
  const gifFrames: GifFrame[] = scaled.map((f) => ({ rgba: f.rgba, delayCs: f.delayCs }))
  const bytes = encodeGif(gifFrames, scaled[0].width, scaled[0].height)

  mkdirSync(outDir, { recursive: true })
  writeFileSync(outPath, bytes)
  return true
}

/**
 * A reconstructed cursor's capture flattens invert pixels into opaque black in the color layer
 * (see CursorEntry.reconstructed) - indistinguishable there from a real black outline. In this
 * dataset every reconstructed cursor that has usesInvert (windows-default's crosshair/text) is a
 * "fully masked" design with no real outline content at all (every other scheme's equivalent
 * crosshair/text role is 100% AND=1 too - see CLAUDE.md), so its entire color layer safely *is*
 * the invert content. Move it there, recolored white, and leave the color layer empty. This
 * would be wrong for a reconstructed cursor that mixed real outline pixels with invert pixels -
 * nothing in the current 193 does.
 */
function reinterpretReconstructedInvert(frames: RoleFrames, entry: CursorEntry): { color: LayerFrame[]; invert: LayerFrame[] } {
  if (!entry.reconstructed || !entry.usesInvert) return { color: frames.color, invert: frames.invert }

  const invert = frames.color.map((f) => ({ rgba: recolorWhite(f.rgba), delayCs: f.delayCs }))
  const color = frames.color.map((f) => ({ rgba: new Uint8ClampedArray(f.rgba.length), delayCs: f.delayCs }))
  return { color, invert }
}

export interface SpriteResult {
  cursorsProcessed: number
  layersWritten: number
  /** "cursorId/layer" skipped because every frame of that layer was fully transparent - e.g. crosshair/text cursors have no opaque "normal" layer at all (see CLAUDE.md). */
  layersSkippedEmpty: string[]
  /** "cursorId/layer" skipped because the file already exists and force wasn't passed - it may have been hand-touched-up, see writeLayerGif. */
  layersSkippedExisting: string[]
}

/**
 * Publishes manifest.json and scheme.json alongside the rendered sprites - the runtime registry a
 * component resolves scheme/role names against (see src/helpers/cursors.ts). Always overwritten,
 * regardless of `force`: this is generated data, never hand-touched-up at the public path the way a
 * sprite GIF can be.
 *
 * The published manifest.json isn't a byte-for-byte copy of src-cursors/manifest.json - each entry
 * also gets `hasNormal`/`hasInvert`, checked directly against what's actually on disk under
 * public/win-55-ui/cursors/<cursorId>/ (not re-derived from the source .cur/.ani, so a
 * hand-touched-up sprite - added or deleted by hand - is reflected exactly as published, not as
 * originally rendered). CursorOverlay reads these to pick normal/invert without probing with a real
 * image load; a cursor missing a layer (most have no invert; crosshair/text no normal) is a normal
 * case, not an error. native.gif is written for every cursor, so native mode assumes it and needs no
 * flag; `nativeFrameDelays` (ms per native-<i>.gif still) is present only for animated cursors.
 */
function publishRegistry(manifest: CursorsManifest, nativeFrameDelays: Record<string, number[]>): void {
  mkdirSync(publicCursorsDir, { recursive: true })

  const published: Record<string, CursorEntry & { hasNormal: boolean; hasInvert: boolean; nativeFrameDelays?: number[] }> = {}
  for (const [cursorId, entry] of Object.entries(manifest)) {
    const outDir = join(publicCursorsDir, cursorId)
    published[cursorId] = {
      ...entry,
      hasNormal: existsSync(join(outDir, 'normal.gif')),
      hasInvert: existsSync(join(outDir, 'invert.gif')),
      nativeFrameDelays: nativeFrameDelays[cursorId],
    }
  }

  writeFileSync(join(publicCursorsDir, 'manifest.json'), JSON.stringify(published, null, 2) + '\n', 'utf8')
  copyFileSync(schemeIndexPath, join(publicCursorsDir, 'scheme.json'))
}

/**
 * Renders every cursor in manifest.json to public/win-55-ui/cursors/<cursorId>/{normal,invert,native}.gif -
 * one directory per deduped physical cursor, not per scheme/role (see CLAUDE.md's "Курсоры"
 * section). A layer with no opaque pixels in any frame is skipped rather than written as a blank
 * GIF. An existing output file is left untouched unless force is passed (see writeLayerGif) - this
 * doesn't clean up a file a cursor no longer produces (e.g. after a source fix moves its content to
 * the other layer), delete it by hand or pass force to fully regenerate.
 */
export function generateSprites(force = false): SpriteResult {
  const manifest = loadCursorsManifest()
  let cursorsProcessed = 0
  let layersWritten = 0
  const layersSkippedEmpty: string[] = []
  const layersSkippedExisting: string[] = []
  // per-frame native still timing (ms), for cursorIds that got native-<i>.gif frames
  const nativeFrameDelays: Record<string, number[]> = {}

  for (const [cursorId, entry] of Object.entries(manifest)) {
    const frames = loadRoleFrames(entry.file)
    const outDir = join(publicCursorsDir, cursorId)
    cursorsProcessed++

    const { color, invert } = reinterpretReconstructedInvert(frames, entry)

    const colorHasContent = color.some((f) => hasOpaquePixel(f.rgba))
    const invertHasContent = invert.some((f) => hasOpaquePixel(f.rgba))

    if (colorHasContent) {
      if (writeLayerGif(outDir, 'normal.gif', frames.width, frames.height, color, force)) layersWritten++
      else layersSkippedExisting.push(`${cursorId}/normal`)
    } else {
      layersSkippedEmpty.push(`${cursorId}/normal`)
    }

    if (invertHasContent) {
      if (writeLayerGif(outDir, 'invert.gif', frames.width, frames.height, invert, force)) layersWritten++
      else layersSkippedExisting.push(`${cursorId}/invert`)
    } else {
      layersSkippedEmpty.push(`${cursorId}/invert`)
    }

    // native.gif - normal + invert baked into one flat bitmap at 1:1 (not 2x like the layers
    // above), what native cursor mode loads by default. CursorOverlay (immersive) ignores it.
    if (colorHasContent || invertHasContent) {
      const native = color.map((f, i) => ({
        rgba: compositeNativeFrame(f.rgba, invert[i]?.rgba, frames.width, frames.height),
        delayCs: f.delayCs,
      }))
      if (writeLayerGif(outDir, 'native.gif', frames.width, frames.height, native, force, 1)) layersWritten++
      else layersSkippedExisting.push(`${cursorId}/native`)

      // A CSS `cursor: url()` only paints frame 0 of an animated GIF, so native mode animates .ani
      // by swapping the whole url on a timer - it needs each frame as its own still plus the timing.
      if (entry.animated && native.length > 1) {
        nativeFrameDelays[cursorId] = native.map((f) => f.delayCs * 10)
        native.forEach((f, i) => {
          if (writeLayerGif(outDir, `native-${i}.gif`, frames.width, frames.height, [f], force, 1)) layersWritten++
          else layersSkippedExisting.push(`${cursorId}/native-${i}`)
        })
      }
    }
  }

  publishRegistry(manifest, nativeFrameDelays)

  return { cursorsProcessed, layersWritten, layersSkippedEmpty, layersSkippedExisting }
}
