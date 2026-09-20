export type BoxOverflow = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'

export const SCROLLBAR_THICKNESS = 28

export function isScrollContainer(value: BoxOverflow): boolean {
  return value === 'hidden' || value === 'scroll' || value === 'auto'
}

/** Applies the CSS computed-value rule: `visible`/`clip` on one axis become `auto`/`hidden` when the other axis scrolls. */
export function resolveOverflow(x: BoxOverflow, y: BoxOverflow): { x: BoxOverflow; y: BoxOverflow } {
  if (isScrollContainer(x) === isScrollContainer(y)) return { x, y }
  const promote = (v: BoxOverflow): BoxOverflow => (v === 'clip' ? 'hidden' : v === 'visible' ? 'auto' : v)
  return { x: promote(x), y: promote(y) }
}

/** Rounds to the nearest even integer within `[0, max]`. */
export function snapEven(value: number, max: number): number {
  return Math.min(max, Math.max(0, Math.round(value / 2) * 2))
}
