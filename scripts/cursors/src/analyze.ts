import { extname } from 'node:path'
import { analyzeCurFile } from './curFormat.js'
import { analyzeAniFile } from './aniFormat.js'

export interface RoleMetadata {
  animated: boolean
  usesInvert: boolean
  frameCount: number
  invertFrames: number
  /** Distinct XOR bit depths seen across frames - usually one value, but nothing guarantees an .ani can't mix them. */
  bitcounts: number[]
  width: number
  height: number
  hotspotX: number | null
  hotspotY: number | null
  /** Frames with a non-white invert pixel - see DibImageInfo.nonWhiteInvertPixels. */
  suspiciousInvertFrames: number
}

/** Parses a .cur or .ani role file and reduces its frame(s) down to one metadata summary. Dimensions/hotspot are read from the first frame - real-world cursor animations don't vary these frame to frame. */
export function analyzeRoleFile(path: string): RoleMetadata {
  const animated = extname(path).toLowerCase() === '.ani'
  const entries = animated ? analyzeAniFile(path) : analyzeCurFile(path)

  if (entries.length === 0) throw new Error(`analyze: ${path} has no image entries`)

  const first = entries[0]
  const invertFrames = entries.filter((e) => e.usesInvert).length
  const suspiciousInvertFrames = entries.filter((e) => e.nonWhiteInvertPixels > 0).length
  const bitcounts = [...new Set(entries.map((e) => e.bitcount))].sort((a, b) => a - b)

  return {
    animated,
    usesInvert: invertFrames > 0,
    frameCount: entries.length,
    invertFrames,
    bitcounts,
    width: first.width,
    height: first.height,
    hotspotX: first.hotspotX,
    hotspotY: first.hotspotY,
    suspiciousInvertFrames,
  }
}
