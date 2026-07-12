/** Counts user-perceived characters (graphemes) instead of UTF-16 code units. */
export declare function graphemeLength(value: string): number;
/** Slices the first `count` graphemes instead of raw UTF-16 code units. */
export declare function sliceGraphemes(value: string, count: number): string;
