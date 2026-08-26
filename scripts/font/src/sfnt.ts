/**
 * Minimal sfnt (TrueType/OpenType container) table injector. svg2ttf writes real glyf/loca
 * TrueType output but has no concept of a `gasp` table, so we splice one in ourselves after the
 * fact — this is a small, generic binary-format operation (rebuild the table directory with one
 * extra entry, recompute offsets/checksums), independent of gasp specifically.
 */

const SFNT_HEADER_SIZE = 12
const TABLE_RECORD_SIZE = 16

interface SfntTableRecord {
  tag: string
  checksum: number
  data: Uint8Array
}

function calcChecksum(data: Uint8Array): number {
  let sum = 0
  const words = Math.floor(data.length / 4)

  for (let i = 0; i < words; i++) {
    const word = (data[i * 4] << 24) | (data[i * 4 + 1] << 16) | (data[i * 4 + 2] << 8) | data[i * 4 + 3]
    sum = (sum + word) >>> 0
  }

  const leftover = data.length - words * 4
  if (leftover > 0) {
    let tail = 0
    for (let i = 0; i < 4; i++) {
      tail = (tail << 8) | (i < leftover ? data[words * 4 + i] : 0)
    }
    sum = (sum + (tail >>> 0)) >>> 0
  }

  return sum
}

function readSfntTables(buffer: ArrayBuffer): SfntTableRecord[] {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  const numTables = view.getUint16(4)

  const records: SfntTableRecord[] = []
  for (let i = 0; i < numTables; i++) {
    const rec = SFNT_HEADER_SIZE + i * TABLE_RECORD_SIZE
    const tag = String.fromCharCode(bytes[rec], bytes[rec + 1], bytes[rec + 2], bytes[rec + 3])
    const offset = view.getUint32(rec + 8)
    const length = view.getUint32(rec + 12)
    records.push({ tag, checksum: view.getUint32(rec + 4), data: bytes.slice(offset, offset + length) })
  }

  return records
}

/** Rebuilds a valid sfnt binary from a table set, recomputing the directory, padding, and the head checksum. */
function writeSfnt(tables: SfntTableRecord[]): ArrayBuffer {
  const sorted = [...tables].sort((a, b) => (a.tag < b.tag ? -1 : a.tag > b.tag ? 1 : 0))

  const headerSize = SFNT_HEADER_SIZE + TABLE_RECORD_SIZE * sorted.length
  let offset = headerSize
  const placed = sorted.map((t) => {
    const paddedLength = Math.ceil(t.data.length / 4) * 4
    const entry = { ...t, offset, paddedLength }
    offset += paddedLength
    return entry
  })

  const totalSize = offset
  const out = new Uint8Array(totalSize)
  const view = new DataView(out.buffer)

  const entrySelector = Math.floor(Math.log2(sorted.length))
  const searchRange = 2 ** entrySelector * TABLE_RECORD_SIZE
  const rangeShift = sorted.length * TABLE_RECORD_SIZE - searchRange

  view.setUint32(0, 0x00010000)
  view.setUint16(4, sorted.length)
  view.setUint16(6, searchRange)
  view.setUint16(8, entrySelector)
  view.setUint16(10, rangeShift)

  let headOffset = -1
  placed.forEach((t, i) => {
    const rec = SFNT_HEADER_SIZE + i * TABLE_RECORD_SIZE
    for (let c = 0; c < 4; c++) out[rec + c] = t.tag.charCodeAt(c)
    view.setUint32(rec + 4, t.checksum)
    view.setUint32(rec + 8, t.offset)
    view.setUint32(rec + 12, t.data.length)
    out.set(t.data, t.offset)
    if (t.tag === 'head') headOffset = t.offset
  })

  if (headOffset < 0) throw new Error("sfnt table set has no 'head' table — can't compute the font checksum")

  // The head table's checkSumAdjustment field (offset 8 within it) must be zero while computing
  // the whole-file checksum, then set to CHECKSUM_ADJUSTMENT_CONSTANT - fileChecksum.
  view.setUint32(headOffset + 8, 0)
  const fileChecksum = calcChecksum(out)
  view.setUint32(headOffset + 8, (0xb1b0afba - fileChecksum) >>> 0)

  return out.buffer
}

/** Adds a new table to an existing sfnt binary. Throws if a table with the same tag already exists. */
export function insertSfntTable(buffer: ArrayBuffer, tag: string, data: Uint8Array): ArrayBuffer {
  if (tag.length !== 4) throw new Error(`sfnt table tag must be exactly 4 characters, got "${tag}"`)

  const tables = readSfntTables(buffer)
  if (tables.some((t) => t.tag === tag)) throw new Error(`sfnt already has a '${tag}' table`)

  tables.push({ tag, checksum: calcChecksum(data), data })
  return writeSfnt(tables)
}

/** Returns a table's raw bytes, or undefined if the sfnt binary has no table with that tag. */
export function getSfntTable(buffer: ArrayBuffer, tag: string): Uint8Array | undefined {
  return readSfntTables(buffer).find((t) => t.tag === tag)?.data
}

/** Replaces an existing table's bytes in place. Throws if no table with that tag exists. */
export function replaceSfntTable(buffer: ArrayBuffer, tag: string, data: Uint8Array): ArrayBuffer {
  const tables = readSfntTables(buffer)
  const index = tables.findIndex((t) => t.tag === tag)
  if (index < 0) throw new Error(`sfnt has no '${tag}' table to replace`)

  tables[index] = { tag, checksum: calcChecksum(data), data }
  return writeSfnt(tables)
}

export interface GaspRange {
  /** Ranges apply up to and including this ppem (pixels-per-em); the last range should be 0xffff. */
  maxPpem: number
  /** Bitwise OR of GASP_* behavior flags. */
  behavior: number
}

export const GASP_GRIDFIT = 0x0001
export const GASP_DOGRAY = 0x0002
export const GASP_SYMMETRIC_GRIDFIT = 0x0004
export const GASP_SYMMETRIC_SMOOTHING = 0x0008

/** Builds a `gasp` table (version 0) from a list of ppem ranges, sorted ascending by spec. */
export function buildGaspTable(ranges: GaspRange[]): Uint8Array {
  if (ranges.length === 0) throw new Error('gasp table needs at least one range')

  const sorted = [...ranges].sort((a, b) => a.maxPpem - b.maxPpem)
  const data = new Uint8Array(4 + sorted.length * 4)
  const view = new DataView(data.buffer)

  view.setUint16(0, 0) // version
  view.setUint16(2, sorted.length)
  sorted.forEach((r, i) => {
    view.setUint16(4 + i * 4, r.maxPpem)
    view.setUint16(4 + i * 4 + 2, r.behavior)
  })

  return data
}
