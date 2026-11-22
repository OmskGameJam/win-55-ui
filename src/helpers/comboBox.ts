/** One row of rich ComboBox data; `key` is the label, `data` is the payload. */
export interface ComboBoxItem<T = unknown> {
  key: string
  data: T
}

/** Duration of the list's slide-out transition, in ms. Tweak for feel. */
export const COMBO_LIST_SLIDE_MS = 160
