export const EMOJI_PATTERN = /\p{Extended_Pictographic}|\p{Regional_Indicator}|‍|️|⃣/u

/** True when a single grapheme passes: `allow` must match it (if given) and `deny` must not match any part of it. */
export function passesFilter(grapheme: string, allow?: RegExp, deny?: RegExp): boolean {
  if (allow) {
    allow.lastIndex = 0

    if (!allow.test(grapheme)) return false
  }

  if (deny) {
    deny.lastIndex = 0

    if (deny.test(grapheme)) return false
  }

  return true
}
