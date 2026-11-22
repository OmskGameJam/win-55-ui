/**
 * Integer layout for the kit's 2px grid.
 *
 * Every rectangle this module emits has edges on integer multiples of `CELL`.
 * Sizes are derived by subtracting snapped edges, never by rounding sizes, so a
 * run of tracks sums to exactly the box it was fitted into and neighbours
 * cannot overlap or leave a seam. Nothing here reads the DOM — callers pass the
 * box from `getBoundingClientRect()`.
 *
 * Modes that fit columns assume the height is unbounded (the container grows
 * downward) and the reverse; only `areas` needs both axes.
 */

export const CELL = 2

export type IntGridMode = 'fill' | 'columns' | 'masonry' | 'areas'

/**
 * Which way items advance. `ltr`/`rtl` are left-to-right / right-to-left,
 * `ttb`/`btt` top-to-bottom / bottom-to-top. Implemented as a mirror of the
 * finished tracks, so a reversed axis anchors to the far edge and the leftover
 * space lands on the near side.
 */
export type IntGridFlow = 'ltr' | 'ttb' | 'rtl' | 'btt'

export interface IntGridRect {
  x: number
  y: number
  w: number
  h: number
  /** 1 is the top row seen on screen, whatever the flow. */
  row: number
  /** 1 is the left column seen on screen, whatever the flow. */
  col: number
  /** Fill-order row: with `btt` the bottom row is 1. */
  flowRow: number
  /** Fill-order column: with `rtl` the right column is 1. */
  flowCol: number
}

const up = (n: number) => Math.ceil(n / CELL) * CELL
const down = (n: number) => Math.floor(n / CELL) * CELL
const near = (n: number) => Math.round(n / CELL) * CELL

/** Mirrors finished tracks inside the box; a reversed flow is never re-laid-out. */
function mirror(rects: IntGridRect[], width: number, height: number, flow?: IntGridFlow) {
  if (flow === 'rtl') for (const r of rects) r.x = width - r.x - r.w
  if (flow === 'btt') for (const r of rects) r.y = height - r.y - r.h
  return rects
}

/** Splits `total` into tracks by `weights`, `gap` px apart. */
function tracks(weights: number[], total: number, gap: number) {
  const n = weights.length
  if (!n) return { starts: [] as number[], sizes: [] as number[] }

  const sum = weights.reduce((a, b) => a + b, 0) || n
  const space = Math.max(0, total - (n - 1) * gap)
  const starts: number[] = []
  let cum = 0

  for (let i = 0; i < n; i++) {
    starts.push(near((space * cum) / sum) + i * gap)
    cum += weights[i]
  }

  // The last track ends exactly on `total`; the rest end where the next begins.
  const sizes = starts.map((start, i) => (i === n - 1 ? total : starts[i + 1] - gap) - start)

  return { starts, sizes }
}

export interface RepeatGridOptions {
  width: number
  count: number
  itemHeight: number
  gap?: number
  /** Fit as many fixed-width items per row as possible; leftover width stays empty. */
  itemWidth?: number
  /** Divide the width into this many columns instead. */
  columns?: number
  flow?: IntGridFlow
  /** Cross-axis box size; a `btt` flow mirrors against it instead of the content height. */
  height?: number
}

/**
 * Uniform grid: fixed item width filling as many columns as fit (`itemWidth`),
 * or a fixed column count dividing the width evenly (`columns`).
 */
export function repeatGrid(o: RepeatGridOptions) {
  const gap = up(o.gap ?? 0)
  const h = up(o.itemHeight)
  const width = down(o.width)
  const flow = o.flow ?? 'ltr'

  let starts: number[]
  let sizes: number[]

  if (o.itemWidth !== undefined) {
    const w = up(o.itemWidth)
    const cols = Math.max(1, Math.floor((width + gap) / (w + gap)))
    starts = Array.from({ length: cols }, (_, i) => i * (w + gap))
    sizes = Array.from({ length: cols }, () => w)
  } else {
    const cols = Math.max(1, o.columns ?? 1)
    ;({ starts, sizes } = tracks(Array(cols).fill(1), width, gap))
  }

  const cols = starts.length
  const rows = Math.ceil(o.count / cols)
  const rects: IntGridRect[] = []

  for (let i = 0; i < o.count; i++) {
    const c = i % cols
    const r = (i - c) / cols
    rects.push({
      x: starts[c],
      y: r * (h + gap),
      w: sizes[c],
      h,
      row: flow === 'btt' ? rows - r : r + 1,
      col: flow === 'rtl' ? cols - c : c + 1,
      flowRow: r + 1,
      flowCol: c + 1,
    })
  }

  const contentHeight = Math.max(0, rows * h + (rows - 1) * gap)
  const mirrorHeight = Math.max(contentHeight, o.height ?? 0)

  return { rects: mirror(rects, width, mirrorHeight, flow), rows, cols, height: contentHeight }
}

export interface MasonryGridOptions {
  /** Fitted axis: column widths for vertical, row widths for horizontal. */
  width: number
  /** Natural cross size of each item, in DOM order. */
  sizes: number[]
  /** Every item's fixed width (vertical) or fixed height (horizontal). */
  itemSize: number
  direction?: 'vertical' | 'horizontal'
  gap?: number
  flow?: IntGridFlow
  /** Cross-axis box size; a `btt` flow mirrors against it instead of the content height. */
  height?: number
}

/** Packs items into the shortest lane: columns when vertical, rows when horizontal. */
export function masonryGrid(o: MasonryGridOptions) {
  const gap = up(o.gap ?? 0)
  const size = up(o.itemSize)
  const width = down(o.width)
  const flow = o.flow ?? 'ltr'
  const vertical = (o.direction ?? 'vertical') === 'vertical'

  if (vertical) {
    const lanes = Math.max(1, Math.floor((width + gap) / (size + gap)))
    const ends = Array<number>(lanes).fill(0)
    const laneLen = Array<number>(lanes).fill(0)
    const rects: IntGridRect[] = []
    const laneOf: number[] = []
    const posOf: number[] = []

    for (const natural of o.sizes) {
      let lane = 0
      for (let i = 1; i < lanes; i++) if (ends[i] < ends[lane]) lane = i
      const h = up(natural)
      const pos = laneLen[lane]++
      laneOf.push(lane)
      posOf.push(pos)
      rects.push({ x: lane * (size + gap), y: ends[lane], w: size, h, row: 0, col: 0, flowRow: 0, flowCol: 0 })
      ends[lane] += h + gap
    }

    // Row counts the item's own column, so a short column's top item still reads as row 1.
    const rows = Math.max(...laneLen)

    rects.forEach((r, i) => {
      const lane = laneOf[i]
      r.row = flow === 'btt' ? laneLen[lane] - posOf[i] : posOf[i] + 1
      r.col = flow === 'rtl' ? lanes - lane : lane + 1
      r.flowRow = posOf[i] + 1
      r.flowCol = lane + 1
    })

    const contentHeight = Math.max(0, Math.max(...ends) - gap)
    const mirrorHeight = Math.max(contentHeight, o.height ?? 0)

    return { rects: mirror(rects, width, mirrorHeight, flow), rows, cols: lanes, height: contentHeight }
  }

  // Horizontal: fixed item height, natural widths, wrap when the row is full.
  const rects: IntGridRect[] = []
  const rowLens: number[] = []
  const rowOf: number[] = []
  const posOf: number[] = []
  let x = 0
  let y = 0
  let row = 0

  for (const natural of o.sizes) {
    const w = up(natural)
    if (x > 0 && x + w > width) {
      x = 0
      y += size + gap
      row++
    }
    const pos = rowLens[row] ?? 0
    rowLens[row] = pos + 1
    rowOf.push(row)
    posOf.push(pos)
    rects.push({ x, y, w, h: size, row: 0, col: 0, flowRow: 0, flowCol: 0 })
    x += w + gap
  }

  const rows = rowLens.length
  const cols = Math.max(0, ...rowLens)

  rects.forEach((r, i) => {
    const at = rowOf[i]
    r.row = flow === 'btt' ? rows - at : at + 1
    r.col = flow === 'rtl' ? rowLens[at] - posOf[i] : posOf[i] + 1
    r.flowRow = at + 1
    r.flowCol = posOf[i] + 1
  })

  const contentHeight = Math.max(0, y + size)
  const mirrorHeight = Math.max(contentHeight, o.height ?? 0)

  return { rects: mirror(rects, width, mirrorHeight, flow), rows, cols, height: contentHeight }
}

export interface AreaGridOptions {
  width: number
  height: number
  /** `grid-template-areas` rows, e.g. `"title title / body side"` (newlines work too). */
  areas: string
  /** Column tracks in `fr`, e.g. `"2fr 1fr"`. */
  columns: string
  /** Row tracks in `fr`, e.g. `"1fr 3fr"`. */
  rows: string
  gap?: number
}

/** Named fields on a fractional grid; names come from `grid-template-areas`. */
export function areaGrid(o: AreaGridOptions) {
  const gap = up(o.gap ?? 0)

  // `parseFloat` reads "2fr" as 2 and "0.5fr" as 0.5 — the unit is the only one
  // this mode accepts, so there is nothing else to parse.
  const cols = tracks(o.columns.trim().split(/\s+/).map(parseFloat), down(o.width), gap)
  const rows = tracks(o.rows.trim().split(/\s+/).map(parseFloat), down(o.height), gap)

  const cells = o.areas
    .replace(/"/g, ' ')
    .split(/[/\n]/)
    .map((row) => row.trim().split(/\s+/).filter(Boolean))

  // A name repeated across several cells spans their bounding box.
  const boxes: Record<string, { r0: number; r1: number; c0: number; c1: number }> = {}

  cells.forEach((row, r) => row.forEach((name, c) => {
    if (name === '.' || rows.starts[r] === undefined || cols.starts[c] === undefined) return
    const box = boxes[name]
    if (!box) {
      boxes[name] = { r0: r, r1: r, c0: c, c1: c }
      return
    }
    box.r0 = Math.min(box.r0, r)
    box.r1 = Math.max(box.r1, r)
    box.c0 = Math.min(box.c0, c)
    box.c1 = Math.max(box.c1, c)
  }))

  const rects: Record<string, IntGridRect> = {}

  for (const [name, b] of Object.entries(boxes)) {
    const x = cols.starts[b.c0]
    const y = rows.starts[b.r0]
    rects[name] = {
      x,
      y,
      w: cols.starts[b.c1] + cols.sizes[b.c1] - x,
      h: rows.starts[b.r1] + rows.sizes[b.r1] - y,
      row: b.r0 + 1,
      col: b.c0 + 1,
      flowRow: b.r0 + 1,
      flowCol: b.c0 + 1,
    }
  }

  return { rects, rows: rows.starts.length, cols: cols.starts.length }
}
