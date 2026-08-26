import { readFileSync } from 'node:fs'
import { parseCurOrIcoBlob, extractCurOrIcoImageBlobs, type CurEntry } from './curFormat.js'

interface RiffChunk {
  id: string
  start: number
  end: number
}

function readChunks(data: Buffer, start: number, end: number): RiffChunk[] {
  const chunks: RiffChunk[] = []
  let i = start

  while (i + 8 <= end) {
    const id = data.toString('ascii', i, i + 4)
    const size = data.readUInt32LE(i + 4)
    const bodyStart = i + 8
    const bodyEnd = Math.min(bodyStart + size, end)
    chunks.push({ id, start: bodyStart, end: bodyEnd })
    i = bodyEnd + (size & 1) // chunks are word-aligned
  }

  return chunks
}

/** Validates the RIFF ACON header and returns the top-level chunk list shared by every other parser in this module. */
function readTopChunks(data: Buffer): RiffChunk[] {
  if (data.toString('ascii', 0, 4) !== 'RIFF' || data.toString('ascii', 8, 12) !== 'ACON') {
    throw new Error('aniFormat: not a RIFF ACON (.ani) file')
  }
  const totalSize = data.readUInt32LE(4)
  const end = Math.min(8 + totalSize, data.length)
  return readChunks(data, 12, end)
}

function findFramIconChunks(data: Buffer, topChunks: RiffChunk[]): RiffChunk[] {
  for (const chunk of topChunks) {
    if (chunk.id !== 'LIST' || data.toString('ascii', chunk.start, chunk.start + 4) !== 'fram') continue
    return readChunks(data, chunk.start + 4, chunk.end).filter((c) => c.id === 'icon')
  }
  return []
}

export interface AniInfo {
  title: string | null
  author: string | null
  frameCount: number
  stepCount: number
}

/** One .ani "icon" chunk per animation frame, each itself a complete ICO/CUR-format blob (AF_ICON flag, which every real-world .ani we've seen sets). */
export function parseAniFrames(data: Buffer): CurEntry[] {
  const topChunks = readTopChunks(data)
  const entries: CurEntry[] = []

  for (const chunk of findFramIconChunks(data, topChunks)) {
    entries.push(...parseCurOrIcoBlob(data.subarray(chunk.start, chunk.end)))
  }

  return entries
}

export function parseAniInfo(data: Buffer): AniInfo {
  const topChunks = readTopChunks(data)

  let title: string | null = null
  let author: string | null = null
  let frameCount = 0
  let stepCount = 0

  for (const chunk of topChunks) {
    if (chunk.id === 'anih') {
      // ANIHEADER: cbSizeOf, cFrames, cSteps, cx, cy, cBitCount, cPlanes, jifRate, flags (9x u32)
      frameCount = data.readUInt32LE(chunk.start + 4)
      stepCount = data.readUInt32LE(chunk.start + 8)
    } else if (chunk.id === 'LIST' && data.toString('ascii', chunk.start, chunk.start + 4) === 'INFO') {
      for (const sub of readChunks(data, chunk.start + 4, chunk.end)) {
        const text = data.toString('latin1', sub.start, sub.end).replace(/\0+$/, '')
        if (sub.id === 'INAM') title = text
        else if (sub.id === 'IART') author = text
      }
    }
  }

  return { title, author, frameCount, stepCount }
}

export interface AniPlayback {
  /** Raw per-unique-frame image blobs, in storage order - index into this with `sequence`. */
  frameBlobs: Buffer[]
  /** Real playback order: one frame index per animation step. Comes from the `seq ` chunk when present (frames can repeat/reorder - cSteps can exceed cFrames), otherwise defaults to playing frameBlobs once in order. */
  sequence: number[]
  /** Per-step delay in GIF centiseconds (1/100s), same length as `sequence`. From the `rate` chunk (jiffies, 1/60s) when present, else the constant jifRate from anih for every step. */
  delaysCs: number[]
}

function jiffiesToCentiseconds(jiffies: number): number {
  return Math.round((jiffies * 100) / 60)
}

/** Reads the true frame order and per-step timing (`seq `/`rate` chunks), not just the raw stored frame list - several sets in src-cursors/ reuse/reorder frames this way (see CLAUDE.md's "Курсоры" section). */
export function parseAniPlayback(data: Buffer): AniPlayback {
  const topChunks = readTopChunks(data)

  let stepCount = 0
  let jifRate = 0
  let rateChunk: RiffChunk | null = null
  let seqChunk: RiffChunk | null = null

  for (const chunk of topChunks) {
    if (chunk.id === 'anih') {
      stepCount = data.readUInt32LE(chunk.start + 8)
      jifRate = data.readUInt32LE(chunk.start + 28)
    } else if (chunk.id === 'rate') {
      rateChunk = chunk
    } else if (chunk.id === 'seq ') {
      seqChunk = chunk
    }
  }

  const frameBlobs = findFramIconChunks(data, topChunks).flatMap((chunk) => extractCurOrIcoImageBlobs(data.subarray(chunk.start, chunk.end)))

  const sequence = seqChunk
    ? Array.from({ length: stepCount }, (_, i) => data.readUInt32LE(seqChunk.start + i * 4))
    : Array.from({ length: stepCount }, (_, i) => i)

  const delaysCs = rateChunk
    ? Array.from({ length: stepCount }, (_, i) => jiffiesToCentiseconds(data.readUInt32LE(rateChunk.start + i * 4)))
    : Array.from({ length: stepCount }, () => jiffiesToCentiseconds(jifRate))

  return { frameBlobs, sequence, delaysCs }
}

export function analyzeAniFile(path: string): CurEntry[] {
  return parseAniFrames(readFileSync(path))
}

export function loadAniPlayback(path: string): AniPlayback {
  return parseAniPlayback(readFileSync(path))
}
