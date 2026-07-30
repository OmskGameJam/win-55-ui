/**
 * svg2ttf's cmap writer always builds a format 4 subtable (for legacy (0,3)/(3,1) lookups)
 * alongside format 12 (full Unicode range). Format 4's idRangeOffset field is a fixed 16-bit byte
 * offset, and svg2ttf's encoder never uses the idDelta shortcut — it always routes through a
 * glyphIndexArray, so that field overflows once a font has enough BMP segments/glyphs (exactly
 * what happens once a strike gets fallback-merged into the thousands of glyphs). The result is a
 * corrupted format 4 subtable that OTS (the sanitizer Chrome and Firefox run on any downloaded
 * `@font-face` font) rejects outright — taking down the *entire* cmap table, not just that one
 * subtable, so the whole font fails to load.
 *
 * Format 12 is a strict superset of format 4 (BMP + astral) and every browser this kit targets
 * supports it, so the fix is to strip format 4 out of the cmap table entirely rather than try to
 * patch its encoding.
 */

interface CmapSubtableHeader {
  platformID: number
  encodingID: number
  offset: number
}

function view(data: Uint8Array): DataView {
  return new DataView(data.buffer, data.byteOffset, data.byteLength)
}

function readHeaders(data: Uint8Array): { version: number; headers: CmapSubtableHeader[] } {
  const v = view(data)
  const version = v.getUint16(0)
  const numTables = v.getUint16(2)

  const headers: CmapSubtableHeader[] = []
  for (let i = 0; i < numTables; i++) {
    const rec = 4 + i * 8
    headers.push({ platformID: v.getUint16(rec), encodingID: v.getUint16(rec + 2), offset: v.getUint32(rec + 4) })
  }

  return { version, headers }
}

function subtableFormat(data: Uint8Array, offset: number): number {
  return view(data).getUint16(offset)
}

// Formats 8/10/12/13 use a 4-byte length field (after a 2-byte format-minor field); everything
// else (0, 2, 4, 6, ...) uses a 2-byte length field directly after the format.
function subtableLength(data: Uint8Array, offset: number, format: number): number {
  const isLongForm = format === 8 || format === 10 || format === 12 || format === 13
  return isLongForm ? view(data).getUint32(offset + 4) : view(data).getUint16(offset + 2)
}

/** Removes format 4 subtables from a cmap table, keeping the rest byte-identical. */
export function stripCmapFormat4(cmapData: Uint8Array): Uint8Array {
  const { version, headers } = readHeaders(cmapData)
  const kept = headers.filter((h) => subtableFormat(cmapData, h.offset) !== 4)

  if (kept.length === headers.length) return cmapData // nothing to strip
  if (kept.length === 0) throw new Error('stripCmapFormat4 would remove every subtable — refusing to build an empty cmap')

  // Headers can share one physical subtable (e.g. (0,4) and (3,10) both pointing at the same
  // format-12 blob) — dedupe by original offset so that sharing survives the rebuild.
  const blobsByOldOffset = new Map<number, Uint8Array>()
  for (const h of kept) {
    if (!blobsByOldOffset.has(h.offset)) {
      const format = subtableFormat(cmapData, h.offset)
      const length = subtableLength(cmapData, h.offset, format)
      blobsByOldOffset.set(h.offset, cmapData.slice(h.offset, h.offset + length))
    }
  }

  const directorySize = 4 + kept.length * 8
  let cursor = directorySize
  const newOffsetByOldOffset = new Map<number, number>()
  for (const [oldOffset, blob] of blobsByOldOffset) {
    newOffsetByOldOffset.set(oldOffset, cursor)
    cursor += blob.length
  }

  const out = new Uint8Array(cursor)
  const outView = view(out)
  outView.setUint16(0, version)
  outView.setUint16(2, kept.length)

  kept.forEach((h, i) => {
    const rec = 4 + i * 8
    outView.setUint16(rec, h.platformID)
    outView.setUint16(rec + 2, h.encodingID)
    outView.setUint32(rec + 4, newOffsetByOldOffset.get(h.offset)!)
  })

  for (const [oldOffset, blob] of blobsByOldOffset) {
    out.set(blob, newOffsetByOldOffset.get(oldOffset)!)
  }

  return out
}
