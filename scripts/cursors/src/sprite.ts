import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { srcCursorsDir, publicCursorsDir } from './paths.js'
import { loadCursorsManifest } from './manifest.js'
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

function writeLayerGif(outDir: string, filename: string, width: number, height: number, frames: LayerFrame[]): void {
  const upscaled = frames.map((f) => ({ ...upscale({ width, height, rgba: f.rgba }, SCALE), delayCs: f.delayCs || 10 }))
  const gifFrames: GifFrame[] = upscaled.map((f) => ({ rgba: f.rgba, delayCs: f.delayCs }))
  const bytes = encodeGif(gifFrames, upscaled[0].width, upscaled[0].height)

  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, filename), bytes)
}

export interface SpriteResult {
  rolesProcessed: number
  layersWritten: number
  /** "scheme/role/layer" skipped because every frame of that layer was fully transparent - e.g. crosshair/text roles have no opaque "normal" layer at all (see CLAUDE.md). */
  layersSkippedEmpty: string[]
}

/** Renders every role in manifest.json to public/win-55-ui/cursors/<scheme>/<role>/{normal,invert}.gif. A layer with no opaque pixels in any frame is skipped rather than written as a blank GIF. */
export function generateSprites(): SpriteResult {
  const manifest = loadCursorsManifest()
  let rolesProcessed = 0
  let layersWritten = 0
  const layersSkippedEmpty: string[] = []

  for (const [schemeSlug, scheme] of Object.entries(manifest)) {
    const schemeDir = join(srcCursorsDir, schemeSlug)

    for (const [role, entry] of Object.entries(scheme.roles)) {
      const frames = loadRoleFrames(schemeDir, entry.file)
      const outDir = join(publicCursorsDir, schemeSlug, role)
      rolesProcessed++

      const colorHasContent = frames.color.some((f) => hasOpaquePixel(f.rgba))
      if (colorHasContent) {
        writeLayerGif(outDir, 'normal.gif', frames.width, frames.height, frames.color)
        layersWritten++
      } else {
        layersSkippedEmpty.push(`${schemeSlug}/${role}/normal`)
      }

      const invertHasContent = frames.invert.some((f) => hasOpaquePixel(f.rgba))
      if (invertHasContent) {
        writeLayerGif(outDir, 'invert.gif', frames.width, frames.height, frames.invert)
        layersWritten++
      } else {
        layersSkippedEmpty.push(`${schemeSlug}/${role}/invert`)
      }
    }
  }

  return { rolesProcessed, layersWritten, layersSkippedEmpty }
}
