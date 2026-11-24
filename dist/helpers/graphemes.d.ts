export declare function graphemeLength(value: string): number;
export declare function sliceGraphemes(value: string, count: number): string;
/** Keeps accepted graphemes; `caret` is shifted by removals before it. */
export declare function filterGraphemes(value: string, keep: (grapheme: string) => boolean, caret?: number | null): {
    value: string;
    caret: number | null;
};
