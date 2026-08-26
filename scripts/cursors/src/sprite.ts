import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { srcCursorsDir, publicCursorsDir } from './paths.js'
import { loadCursorsManifest, type RoleEntry } from './manifest.js'
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

/** Loads and renders every frame of one role file, already reduced to the real playback order/timing for an .ani (see aniFormat.ts's parseAniPlayback) - a static .cur is just a single frame. */
function loadRoleFrames(schemeDir: string, filename: string): RoleFrames {
  const path = join(schemeDir, filename)
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
function writeLayerGif(outDir: string, filename: string, width: number, height: number, frames: LayerFrame[], force: boolean): boolean {
  const outPath = join(outDir, filename)
  if (existsSync(outPath) && !force) return false

  const upscaled = frames.map((f) => ({ ...upscale({ width, height, rgba: f.rgba }, SCALE), delayCs: f.delayCs || 10 }))
  const gifFrames: GifFrame[] = upscaled.map((f) => ({ rgba: f.rgba, delayCs: f.delayCs }))
  const bytes = encodeGif(gifFrames, upscaled[0].width, upscaled[0].height)

  mkdirSync(outDir, { recursive: true })
  writeFileSync(outPath, bytes)
  return true
}

/**
 * A reconstructed role's capture flattens invert pixels into opaque black in the color layer
 * (see RoleEntry.reconstructed) - indistinguishable there from a real black outline. In this
 * dataset every reconstructed role that has usesInvert (windows-default's crosshair/text) is a
 * "fully masked" design with no real outline content at all (every other scheme's equivalent
 * crosshair/text role is 100% AND=1 too - see CLAUDE.md), so its entire color layer safely *is*
 * the invert content. Move it there, recolored white, and leave the color layer empty. This
 * would be wrong for a reconstructed role that mixed real outline pixels with invert pixels -
 * nothing in the current 19 sets does.
 */
function reinterpretReconstructedInvert(frames: RoleFrames, entry: RoleEntry): { color: LayerFrame[]; invert: LayerFrame[] } {
  if (!entry.reconstructed || !entry.usesInvert) return { color: frames.color, invert: frames.invert }

  const invert = frames.color.map((f) => ({ rgba: recolorWhite(f.rgba), delayCs: f.delayCs }))
  const color = frames.color.map((f) => ({ rgba: new Uint8ClampedArray(f.rgba.length), delayCs: f.delayCs }))
  return { color, invert }
}

export interface SpriteResult {
  rolesProcessed: number
  layersWritten: number
  /** "scheme/role/layer" skipped because every frame of that layer was fully transparent - e.g. crosshair/text roles have no opaque "normal" layer at all (see CLAUDE.md). */
  layersSkippedEmpty: string[]
  /** "scheme/role/layer" skipped because the file already exists and force wasn't passed - it may have been hand-touched-up, see writeLayerGif. */
  layersSkippedExisting: string[]
}

/**
 * Renders every role in manifest.json to public/win-55-ui/cursors/<scheme>/<role>/{normal,invert}.gif.
 * A layer with no opaque pixels in any frame is skipped rather than written as a blank GIF. An
 * existing output file is left untouched unless force is passed (see writeLayerGif) - this
 * doesn't clean up a file a role no longer produces (e.g. after a source fix moves its content to
 * the other layer), delete it by hand or pass force to fully regenerate.
 */
export function generateSprites(force = false): SpriteResult {
  const manifest = loadCursorsManifest()
  let rolesProcessed = 0
  let layersWritten = 0
  const layersSkippedEmpty: string[] = []
  const layersSkippedExisting: string[] = []

  for (const [schemeSlug, scheme] of Object.entries(manifest)) {
    const schemeDir = join(srcCursorsDir, schemeSlug)

    for (const [role, entry] of Object.entries(scheme.roles)) {
      const frames = loadRoleFrames(schemeDir, entry.file)
      const outDir = join(publicCursorsDir, schemeSlug, role)
      rolesProcessed++

      const { color, invert } = reinterpretReconstructedInvert(frames, entry)

      const colorHasContent = color.some((f) => hasOpaquePixel(f.rgba))
      if (colorHasContent) {
        if (writeLayerGif(outDir, 'normal.gif', frames.width, frames.height, color, force)) layersWritten++
        else layersSkippedExisting.push(`${schemeSlug}/${role}/normal`)
      } else {
        layersSkippedEmpty.push(`${schemeSlug}/${role}/normal`)
      }

      const invertHasContent = invert.some((f) => hasOpaquePixel(f.rgba))
      if (invertHasContent) {
        if (writeLayerGif(outDir, 'invert.gif', frames.width, frames.height, invert, force)) layersWritten++
        else layersSkippedExisting.push(`${schemeSlug}/${role}/invert`)
      } else {
        layersSkippedEmpty.push(`${schemeSlug}/${role}/invert`)
      }
    }
  }

  return { rolesProcessed, layersWritten, layersSkippedEmpty, layersSkippedExisting }
}
