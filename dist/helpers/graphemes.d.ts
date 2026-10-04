/** Counts user-perceived characters (graphemes) instead of UTF-16 code units. */
export declare function graphemeLength(value: string): number;
/** Slices the first `count` graphemes instead of raw UTF-16 code units. */
export declare function sliceGraphemes(value: string, count: number): string;
/** Keeps the graphemes `keep` accepts; `caret` (a grapheme offset) is shifted by the removals before it. */
export declare function filterGraphemes(value: string, keep: (grapheme: string) => boolean, caret?: number | null): {
    value: string;
    caret: number | null;
};
