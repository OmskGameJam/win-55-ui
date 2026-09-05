import './index.css'
import './scrollbar.css'

// Components
export { default as Balloon } from './components/Balloon.vue'
export { default as BaseDropdown } from './components/BaseDropdown.vue'
export { default as BaseInput } from './components/BaseInput.vue'
export { default as Box } from './components/Box.vue'
export { default as Button } from './components/Button.vue'
export { default as Checkbox } from './components/Checkbox.vue'
export { default as CursorContext } from './components/CursorContext.vue'
export { default as HDivider } from './components/HDivider.vue'
export { default as MenuDropdown } from './components/MenuDropdown.vue'
export { default as RadioButton } from './components/RadioButton.vue'
export { default as RichText } from './components/RichText.vue'
export { default as Titlebar } from './components/Titlebar.vue'
export { default as Tooltip } from './components/Tooltip.vue'
export { default as Typography } from './components/Typography.vue'
export { default as Window } from './components/Window.vue'
export { default as NamedPanel } from './components/NamedPanel.vue'
export { default as EmojiPickerWindow } from './components/EmojiPickerWindow.vue'
export { default as Emoji } from './components/Emoji.vue'

// Directives
export { default as emojiDirective, customEmojiDirective } from './directives/emoji'
export { default as cursorDirective, cursorWeakDirective } from './directives/cursor'

// Helpers
export { typographyStyles } from './helpers/typography'
export { loadSchemeIndex } from './helpers/cursors'
export { provideCursorContext, useCursorContext, CURSOR_CONTEXT_KEY } from './helpers/cursorContext'
export { drawAngledBayerDitherGradient } from './helpers/bayerMatrix'
export { useSineWave } from './helpers/useSineWave'
export { registerGlobalImageErrorHandler } from './helpers/imgErrors'
export {
  getEmojiGifPath,
  getEmojiGifPathFromCode,
  getEmojiRegistry,
  hasEmoji,
  loadEmojiRegistry,
  resetEmojiRegistryCache,
} from './helpers/emoji'
export {
  getSelectionOffset,
  getTextWithCustomEmoji,
  restoreSelectionOffset,
} from './helpers/emojiDom'
export {
  activeTarget,
  closePicker,
  insertEmoji,
  openPicker,
  pickerOpen,
  pickerPosition,
  pickNextButtonIcon,
  registerActiveInput,
} from './helpers/emojiPickerStore'

// Types
export type { BoxType } from './components/Box.vue'
export type { TypographySettings } from './helpers/typography'
export type { CursorEntry, CursorsManifest, SchemeIndex, SchemeInfo } from './helpers/cursors'
export type { CursorContextApi, CursorMode, CursorRole } from './helpers/cursorContext'
export type { RichNode } from './helpers/richText'
export type { EmojiDirectiveBindingValue, EmojiDirectiveOptions } from './directives/emoji'
export type { EmojiRegistry, EmojiRegistryOptions } from './helpers/emoji'
export type { EmojiInsertTarget, PickerPosition } from './helpers/emojiPickerStore'
