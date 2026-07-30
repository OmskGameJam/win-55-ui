import type { Contour, Point } from './types.js'

interface DirEdge {
  from: Point
  to: Point
  /** Key of the pixel whose exposed side produced this edge, e.g. "3,5". */
  pixel: string
}

function vkey(x: number, y: number): string {
  return `${x},${y}`
}

/**
 * Traces the boundary of a binary region into closed rectilinear polygons.
 *
 * One edge is emitted per exposed pixel side (a side whose neighbor is NOT in the
 * region), oriented so the region is always on the same fixed side of travel. Edges
 * are then linked vertex-to-vertex into loops. This single pass yields BOTH outer
 * (positive signed area) and hole (negative signed area) contours automatically —
 * a hole is just the inward-facing boundary of the ink surrounding it, produced by
 * the exact same per-pixel-side rule, no separate hole-detection pass needed.
 *
 * At a "checkerboard" vertex (two same-region pixels touching only diagonally, with
 * the two other pixels at that corner both outside the region), naively linking any
 * incoming edge to any outgoing edge at that vertex is ambiguous and can produce a
 * single self-crossing loop instead of two loops that merely touch at a point. This
 * is resolved by preferring, at each vertex, the outgoing edge that continues the
 * SAME originating pixel's own boundary — which is also a no-op in the (overwhelmingly
 * common) case where only one candidate exists.
 */
function traceRegionBoundary(inRegion: (col: number, row: number) => boolean, cols: number, rows: number): Contour[] {
  const edgesFrom = new Map<string, DirEdge[]>()

  function addEdge(fromX: number, fromY: number, toX: number, toY: number, pixelCol: number, pixelRow: number) {
    const edge: DirEdge = { from: { x: fromX, y: fromY }, to: { x: toX, y: toY }, pixel: vkey(pixelCol, pixelRow) }
    const key = vkey(fromX, fromY)
    const list = edgesFrom.get(key)
    if (list) list.push(edge)
    else edgesFrom.set(key, [edge])
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!inRegion(col, row)) continue

      if (!inRegion(col, row - 1)) addEdge(col, row, col + 1, row, col, row) // top
      if (!inRegion(col, row + 1)) addEdge(col + 1, row + 1, col, row + 1, col, row) // bottom
      if (!inRegion(col - 1, row)) addEdge(col, row + 1, col, row, col, row) // left
      if (!inRegion(col + 1, row)) addEdge(col + 1, row, col + 1, row + 1, col, row) // right
    }
  }

  const used = new Set<DirEdge>()
  const contours: Contour[] = []

  for (const edgeList of edgesFrom.values()) {
    for (const startEdge of edgeList) {
      if (used.has(startEdge)) continue

      const points: Point[] = []
      let current = startEdge

      while (true) {
        used.add(current)
        points.push(current.from)

        if (current.to.x === startEdge.from.x && current.to.y === startEdge.from.y) break

        const candidates = (edgesFrom.get(vkey(current.to.x, current.to.y)) ?? []).filter((e) => !used.has(e))

        if (candidates.length === 0) {
          throw new Error(`unterminated contour trace at (${current.to.x},${current.to.y}) — malformed region boundary`)
        }

        current = candidates.find((e) => e.pixel === current.pixel) ?? candidates[0]
      }

      contours.push(simplifyCollinear(points))
    }
  }

  return contours
}

/** Collapses runs of collinear points (all boundary segments here are axis-aligned). */
function simplifyCollinear(points: Point[]): Contour {
  const n = points.length
  const result: Point[] = []

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n]
    const curr = points[i]
    const next = points[(i + 1) % n]

    const collinear =
      (prev.x === curr.x && curr.x === next.x) || (prev.y === curr.y && curr.y === next.y)

    if (!collinear) result.push(curr)
  }

  return result.length >= 3 ? result : points
}

/** Shoelace signed area, in the same pixel-grid units as the contour's points (not font units). */
export function signedArea(contour: Contour): number {
  let sum = 0

  for (let i = 0; i < contour.length; i++) {
    const p0 = contour[i]
    const p1 = contour[(i + 1) % contour.length]
    sum += p0.x * p1.y - p1.x * p0.y
  }

  return sum / 2
}

/**
 * Converts a glyph's monochrome bitmap (1 = ink, 0 = background) into closed rectilinear
 * polygon contours in pixel-grid coordinate space (row 0 at the top, matching the bitmap's
 * own row order — callers apply the font-space Y-flip and SCALE when emitting to opentype.js).
 */
export function traceGlyphContours(bitmap: number[][]): Contour[] {
  const rows = bitmap.length
  const cols = rows > 0 ? bitmap[0].length : 0

  const isInk = (col: number, row: number): boolean =>
    row >= 0 && row < rows && col >= 0 && col < cols && bitmap[row][col] !== 0

  return traceRegionBoundary(isInk, cols, rows)
}
