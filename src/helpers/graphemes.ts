const segmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null

function segmentGraphemes(value: string): string[] {
  if (segmenter) {
    return Array.from(segmenter.segment(value), (s) => s.segment)
  }

  return Array.from(value)
}

/** Counts user-perceived characters (graphemes) instead of UTF-16 code units. */
export function graphemeLength(value: string): number {
  return segmentGraphemes(value).length
}

/** Slices the first `count` graphemes instead of raw UTF-16 code units. */
export function sliceGraphemes(value: string, count: number): string {
  return segmentGraphemes(value).slice(0, count).join('')
}
