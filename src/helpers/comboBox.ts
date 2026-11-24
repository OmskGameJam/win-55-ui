/** One row of rich ComboBox data; `key` is the label, `data` is the payload. */
export interface ComboBoxItem<T = unknown> {
  key: string
  data: T
}

/** Slide-out duration in ms. */
export const COMBO_LIST_SLIDE_MS = 160
