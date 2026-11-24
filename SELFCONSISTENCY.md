# Self-consistency report: prop names & values

Audited: all 34 kit SFCs in `src/` (26 declare props, 7 declare none, plus `App.vue` as the demo shell). The separately versioned `src/fun/` demo is excluded; its `BadApple.vue` declares no props.
Sources: `defineProps` / `withDefaults` / `defineModel` declarations, plus consumer usage in `App.vue` and internal wrappers.

Verification: `npx vue-tsc --noEmit -p tsconfig.app.json` passes. This re-audit covers the modified `src/App.vue` and `src/components/ProgressBar.vue`; the report itself is saved as `SELFCONSISTENCY.md`.

0.8.0 scope decisions are recorded in `CONSISTENCY-0.8.0.md`; this report reflects them — findings that release explicitly excludes are not repeated as open recommendations.

Notation: `name*` = required, `= value` = declared default, `—` = none.

---

## 0. Re-audit of the ProgressBar changes

The touched-up `ProgressBar.vue` now resolves the previous unit inconsistency:

- `padding`, `gap`, `segmentLength`, `width`, and `height` are all **CSS px** (`ProgressBar.vue:46–58`).
- `padding` and `gap` default to `2` CSS px (`ProgressBar.vue:67–68`), matching `IntGrid.gap`'s 2 CSS px default.
- `width` / `height` / `segmentLength` snap **up** to the 2px grid via `ceilEven`; `padding` / `gap` snap to the **nearest** cell via `roundEven` (`ProgressBar.vue:73–87`).
- Segment distribution now stays on the 2px grid; the remainder is spread in whole 2px cells (`ProgressBar.vue:218–225`).
- Span fill now lights a segment once it covers a whole 2px cell (`ProgressBar.vue:247–250`).
- The demo was updated from `:segment-length="7"` (visual px) to `:segment-length="14"` (CSS px) in `App.vue:533–534`.

Remaining ProgressBar-specific item is finding 16 (snap/minimum documentation). `'custom'` stays as-is: it is a real no-frame mode, not a misspelling of a `BoxType`, and `'none'` / `'custom'` are documented separately (see §4).

---

## 1. Inventory

| Component | Props | Models | Emits |
|---|---|---|---|
| **Balloon** | `text?`, `side?` (`top/bottom/left/right`), `bias?` (`left/right/up/down`), `anchor?` | `shown` = `false` | `update:shown` |
| **BaseDropdown** | `matchTriggerWidth?` = `false` | `open` = `false` | `update:open` |
| **BaseInput** | `modelValue*: string`, `placeholder?` = `''`, `disabled?` = `false`, `maxLength?`, `boxType?` = `'textarea'`, `extraStyles?`, `editorExtraStyles?`, `multiline?` = `false`, `wrap?` = `true`, `allow?: RegExp`, `deny?: RegExp` | `modelValue` | `update:modelValue`, `input`, `keydown`, `beforeinput`, `paste`, `focus`, `blur` |
| **Box** | `type*: BoxType`, `overflow?: BoxOverflow`, `overflowX?`, `overflowY?`, `forgiveVerticalOverflow?`, `extraStyles?`, `extraClass?` | `scrollTop`, `scrollLeft` | `update:scrollTop`, `update:scrollLeft` |
| **Button** | `baseType?` = `'panel-d-1'`, `extraStyles?: Record<string, string / number / undefined>`, `extraClass?`, `contentStyles?: Record<...>`, `disabled?` = `false` | — | `click` |
| **Checkbox** | `modelValue*: boolean`, `label?`, `disabled?` = `false`, `value?: string`, `checkedIcon?` = path, `uncheckedIcon?` = path | `modelValue` | `update:modelValue` |
| **CursorBusyDemoButton** | `mode*: 'busy' / 'progress'`, `label*: string` | — | — |
| **CursorContext** | `element?`, `scheme?`, `role?`, `disabled?`, `mode?`, `root?`, `disableAll?` | — | — |
| **Emoji** | `emoji*: string` | — | — |
| **FontTester** | `fontSize?`, `isBold?`, `isItalic?`, `shorthand?`, `fontShadowColor?`, `fontName?`, `text?` = sentence, `cellSize?` = `2` | — | — |
| **IntGrid** | `mode?` = `'fill'`, `itemWidth?` = `64`, `itemHeight?` = `32`, `columns?` = `4`, `gap?` = `2`, `direction?` = `'vertical'`, `flow?` = `'ltr'`, `fixedHeight?` = `false`, `areas?`, `cols?`, `rows?`, `extraClass?`, `extraStyles?` | — | — |
| **NamedPanel** | `label*: string`, `backgroundColorHint?` = `'#CBCBCB'`, `extraStyles?` | — | — |
| **NumberInput** | `modelValue*: string`, `placeholder?` = `''`, `disabled?` = `false`, `maxLength?`, `boxType?` = `'textarea'`, `extraStyles?`, `editorExtraStyles?`, `multiline?` = `false`, `wrap?` = `true`, `deny?`, `variant?` = `'plain'`, `step?` = `1`, `min?`, `max?` | `modelValue` | same 7 as BaseInput |
| **ProgressBar** | `value?: number / ProgressBarSpan[]`, `max?` = `100`, `orientation?` = `'horizontal'`, `boxType?` = `'textarea'` (+ `'custom'`), `padding?` = `2`, `gap?` = `2`, `segmentLength?`, `segmentCount?`, `fillStyle?` = `'segmented'`, `width?`, `height?`, `fillColor?` = `'#000080'`, `extraStyles?`, `extraClass?` | — | — |
| **RadioButton** | `modelValue*: unknown`, `value*: unknown`, `label?`, `disabled?` = `false`, `name?`, `checkedIcon?`, `uncheckedIcon?` | `modelValue` | `update:modelValue` |
| **RichInput** | `modelValue*: string`, `placeholder?` = `''`, `disabled?` = `false`, `maxLength?`, `boxType?` = `'textarea'`, `extraStyles?`, `multiline?` = `false`, `wrap?` = `true`, `showEmojiButton?` = `false` | `modelValue` | `update:modelValue` only |
| **RichText** | `allowLinks?` = `false`, `allowSizes?` = `false` | — | — |
| **RichTextNode** | `node*: RichNode`, `allowLinks?` = `false`, `allowSizes?` = `false` | — | — |
| **ScrollBar** | `orientation*`, `scrollPos*: number`, `viewportSize*`, `contentSize*` | — | `scrollTo`, `scrollBy` |
| **Slider** | `size?` = `'medium'`, `sizeMax?`, `orientation?` = `'horizontal'`, `normalized?` = `false`, `rangeColor?` = CGA blue, `fixedValues?`, `min?` = `0`, `max?` = `100`, `step?` = `1`, `disabled?` = `false`, `extraStyles?`, `extraClass?` | `modelValue` = `0`, `range?` | `update:modelValue`, `update:range` |
| **SimpleStringInput** | exactly `BaseInputProps`, no `withDefaults` | `modelValue` | same 7 as BaseInput |
| **TestDeepMenu** | `level?` = `1`, `maxLevel?` = `50` | — | — |
| **Titlebar** | `title*: string`, `icon?`, `placeholderButtons?`, `disabled?`, `gradientColorA?`, `gradientColorB?` | — | — |
| **Tooltip** | `text*: string`, `offsetX?`, `offsetY?` | — | — |
| **Typography** | `fontSize?`, `isBold?`, `isItalic?`, `fontColor?`, `shorthand?`, `fontShadowColor?`, `fontName?`, `element?`, `display?` = `'inline'` | — | — |
| **Window** | `title*`, `icon?`, `placeholderButtons?`, `disabled?`, `gradientColorA?`, `gradientColorB?`, `faux?`, `extraStyles?`, `extraClass?`, `minWidth?` (eff. `240`), `minHeight?` (eff. `40`), `resizable?`, `resizableHorizontally?`, `resizableVertically?`, `overflowX?`, `overflowY?` | `x` = `100`, `y` = `100`, `width` = `320`, `height` = `220` | `update:x/y/width/height` |

No props: `HDivider`, `MenuDropdown`, `EmojiPickerWindow`, `IntGridTester`, `ScrollFillTester`, `CursorOverlay`, `StrikeTester` (model only).

---

## 2. Consistency scorecard

| Dimension | Verdict | Summary |
|---|---|---|
| Boolean names | **Good** | Almost all positive (`disabled`, `multiline`, `wrap`, `fixedHeight`, `allowLinks`, `allowSizes`). Only `disableAll` is negative, and it is a root-level override. Defaults are consistently `false` where declared. |
| Enum values | **Good** | `orientation` is `'horizontal' / 'vertical'` in `Slider`, `ProgressBar`, `ScrollBar`. `side`, `bias`, `size`, and `mode` are clean unions. |
| Units | **Good** | Every layout length is now CSS px after the ProgressBar fix. Caveat: `Typography.fontSize` is a bitmap-font token rendered at 2× CSS px (finding 16). |
| `modelValue` convention | **Mixed** | All editable controls use `update:modelValue`, but payload types differ (string / number / boolean / unknown), and some use named models instead. |
| Style escape hatches | **Mixed** | `extraStyles` uses two different types (fix in `Button`, T1.3); `extraClass` coverage is uneven but accepted because `class` falls through on single-root components. |
| Box skin naming | **Poor** | Three prop names for one concept (`type`, `baseType`, `boxType`). |
| Default declaration | **Mixed** | 16 of 26 prop-declaring components use `withDefaults`; 10 rely on runtime fallbacks or implicit `false` / truthiness. |
| Event surface | **Mixed** | `SimpleStringInput` mirrors `BaseInput` perfectly; `NumberInput` nearly does; `RichInput` exposes only `update:modelValue`. |
| Wrapper forwarding | **Mixed** | `SimpleStringInput` / `NumberInput` forward explicitly; `MenuDropdown` declares nothing and relies on fallthrough. |
| Shared sub-APIs | **Good** | `RichText` ↔ `RichTextNode` and `Window` ↔ `Titlebar` use identical names. |

---

## 3. Findings

### High impact

**1. The Box skin prop has three names.**
- `Box.vue:20` → `type`
- `Button.vue:10` → `baseType`
- `BaseInput.vue:14` / `RichInput` / `NumberInput` → `boxType`
- `ProgressBar.vue:45` → `boxType`

Consumers must remember `base-type` vs `box-type` vs `type`. Recommended: `boxType` everywhere except `Box`'s own `type`; do not add a `boxType` alias to `Box` — two names for one prop is the drift being removed.

**2. `NumberInput` declares `deny` but drops it.**
It inherits `deny?: RegExp` via `Omit<BaseInputProps, 'allow'>` (`NumberInput.vue:28`), but `inputProps` (`NumberInput.vue:51–58`) never includes `deny`. Declared props are removed from `$attrs`, so the regex never reaches `BaseInput`. A consumer passing `:deny` gets no filtering and no warning. Add `deny: props.deny` to `inputProps` (T3.1).

**3. `RichInput` has a much smaller event surface than its siblings.**
`BaseInput`, `SimpleStringInput`, and `NumberInput` all emit `update:modelValue`, `input`, `keydown`, `beforeinput`, `paste`, `focus`, `blur`. `RichInput.vue:57–59` emits only `update:modelValue`, although it internally handles all the others. This is closed on purpose and documented (T4.8); `RichInput` is not a drop-in `BaseInput` replacement.

**4. `disabled` on `Window` / `Titlebar` does not mean “disabled”.**
`Window.disabled` is only forwarded to `Titlebar` (`Window.vue:240`), and `Titlebar.disabled` only disables the *placeholder* buttons (`Titlebar.vue:95–114`). Dragging and resizing still work (`Window.vue:78–80, 98–101` check only `faux`). Everywhere else (`Button`, `Checkbox`, `RadioButton`, `Slider`, inputs, `CursorContext`) `disabled` disables the whole control. **Resolved:** 0.8.0 deletes the prop from both components (T2.9); wiring it would be new behaviour, not a rename.

**5. `Window.overflowX` / `overflowY` diverge from `BoxOverflow`.**
`Window.vue:33–34` declares `'auto' / 'hidden' / 'scroll' / 'visible'`, omitting `'clip'` from `BoxOverflow` (`scroll.ts:1`). It also applies overflow to an inner `div` (`Window.vue:251–259`) rather than forwarding to `Box`, so `Window` bypasses the kit's custom scrollbar system. Reuse `BoxOverflow` and decide whether `Window` should forward to `Box`.

**Resolved:** `Window` now declares `overflow` / `overflowX` / `overflowY` as `BoxOverflow` and forwards them (plus `forgiveVerticalOverflow`) to an inner `Box type="none"` that owns the body and paints the kit's scrollbars.

### Medium impact

**6. `extraStyles` has two types.**
`extraStyles` is `CSSProperties` almost everywhere, but `Record<string, string / number / undefined>` in `Button` (`Button.vue:11`). Type `Button`'s props as `CSSProperties` (T1.3). `extraClass` exists only on `Window`, `Box`, `Button`, `Slider`, `ProgressBar`, `IntGrid`; that coverage is accepted, because `class` already falls through on every single-root component and adding the prop elsewhere would only duplicate it.

**7. Popup visibility models use two names.**
`BaseDropdown` uses `open` (`BaseDropdown.vue:12`), `Balloon` uses `shown` (`Balloon.vue:8`), and `StrikeTester` uses `open`. Standardize `open` for all popups.

**8. Default values are declared inconsistently.**
- No `withDefaults`, effective fallbacks in code: `Window.minWidth` / `minHeight` (`240` / `40`, `Window.vue:45–46`), `Tooltip.offsetX` / `offsetY` (`24`, `Tooltip.vue:30–31`), `Balloon.side` (`'top'`, `Balloon.vue:44`), `Titlebar.gradientColorA` / `B` (`'5555ff'` / `'0000aa'`).
- `SimpleStringInput` re-declares `BaseInputProps` with no defaults; defaults only exist downstream in `BaseInput`.
- `NumberInput` declares defaults only for its own four props; the inherited BaseInput props are left `undefined` and rely on BaseInput's defaults.

These defaults are invisible to docs/tooling and easy to drift. T1.2 declares the concrete fallbacks. `CursorContext` is the exception: its `undefined` `scheme` / `mode` / `disabled` mean “inherit from the nearest context” and must stay undeclared (T4.6).

**9. `modelValue` payload types are not comparable across controls.**
`NumberInput.modelValue` is a **string** while `Slider.modelValue` is a **number**, yet both expose `min` / `max` / `step`. `Checkbox.modelValue` is `boolean` while `RadioButton.modelValue` / `value` are `unknown`. For a kit, document that `NumberInput` is a text field whose value is numeric text (T4.4).

**10. Emit naming/casing and payloads are inconsistent.**
`ScrollBar` declares camelCase `scrollTo` / `scrollBy` (`ScrollBar.vue:16–19`) while templates use `@scroll-to` / `@scroll-by` (`Box.vue:72–73`). `Button` emits `click: []` with no `MouseEvent` (`Button.vue:24–26`), so `@click="e => ..."` receives `undefined`. `BaseInput.input` also has no payload. 0.8.0 fixes the `ScrollBar` declaration casing (T1.4); `Button.click` keeps its name as the activation event and is documented without a payload (T4.5).

**11. `Slider.fixedValues` and `step` overlap.**
Both can be set; `fixedValues` silently wins (`Slider.vue:105–112, 132`). That is reasonable, but the props do not state precedence or mutual exclusivity. Document the precedence (T4.3).

**12. `Window` duplicates the `Titlebar` prop set.**
`title`, `icon`, `placeholderButtons`, `disabled`, `gradientColorA`, `gradientColorB` are declared twice and wired manually (`Window.vue:21–27, 236–242`). Today they match, but every Titlebar change risks drift. Extract a shared `TitlebarProps` interface (T1.1); T2.8 renames `placeholderButtons`, T2.9 deletes `disabled` from both components.

**13. `MenuDropdown` declares no props.**
It is a thin wrapper around `BaseDropdown` (`MenuDropdown.vue:1–4`), so `matchTriggerWidth` and `v-model:open` are only reachable via attribute/event fallthrough. That works in Vue, but it is undiscoverable and breaks if a second root is ever added. Deferred: explicit forwarding adds API surface and is 0.9 work, not needed for 0.8.0 (see `CONSISTENCY-0.8.0.md` §5).

**14. `SimpleStringInput` recompiles `deny` and drops its flags.**
`SimpleStringInput.vue:18–19` builds `new RegExp(..., 'u')`, discarding any `i` / `m` / `s` flags on the incoming `deny` regex. 0.8.0 preserves the flags (T3.2).

**15. `RichInput` intentionally omits `allow` / `deny` / `editorExtraStyles` (→ `contentStyles`).**
`NumberInput` omits only `allow`; `RichInput` omits all three (`RichInput.vue:36–46`). This is documented as intentional (T4.8): `RichInput` is not a drop-in `BaseInput` replacement.

**16. `Typography.fontSize` is a token, not CSS px — and ProgressBar's snap docs are imprecise.**
- `TypographySettings.fontSize` is a bitmap-font size token from `[8, 10, 12, 16, 18, 24]`, rendered at `size * 2` CSS px (`typography.ts:9, 66, 77–78`). `:font-size="12"` produces 24px CSS. `FontTester` inherits the same prop. The token name stays; document the 2× rule in the JSDoc (T4.1).
- `ProgressBar` says `padding`, `gap`, and `segmentLength` all “snap to the 2px grid”, but the first two snap to the **nearest** cell (`roundEven`) while `segmentLength` snaps **up** (`ceilEven`). Also `segmentLength < 2` silently renders no segments (`ProgressBar.vue:206`), which is not documented. Align the wording and document the minimum (T4.2).

### Low / cosmetic

- `Tooltip` and `Balloon` share `text` but differ in requiredness (`text*` vs `text?` with slot fallback) and positioning API.
- `Checkbox.value` is optional `string`; `RadioButton.value` is required `unknown`. Same concept, different type/requiredness.
- `Typography` has no `extraStyles` / `extraClass`, relying on `class` / `style` fallthrough; acceptable, but different from the rest.
- `Emoji` derives size from the decoded GIF (`Emoji.vue:48–49`) and exposes no `size` prop, unlike `Slider`'s explicit `size`.
- Code style differs in `Tooltip.vue` / `NamedPanel.vue` (semicolons, quoted imports) vs the rest; harmless but noticeable in a consistency audit.
- `ProgressBar.value` is read-only while `Slider` uses a model; correct for a display component but worth documenting.

---

## 4. What is already consistent (keep it)

- `extraStyles` + `extraClass` pair and their merge order are identical in `Box`, `Window`, `Button`, `Slider`, `ProgressBar`, `IntGrid`.
- `disabled` is a `boolean` defaulting to `false` in every control that has it.
- `orientation` is the same `'horizontal' / 'vertical'` union in `Slider`, `ProgressBar`, `ScrollBar`.
- **ProgressBar now uses CSS px for every length prop**, with 2px-grid snapping that matches the rest of the kit; its `gap` default (`2`) now matches `IntGrid.gap` (`2`).
- `allowLinks` / `allowSizes` are identical (name, type, default) in `RichText` and `RichTextNode`.
- `checkedIcon` / `uncheckedIcon` are identical in `Checkbox` and `RadioButton`.
- `title` / `icon` / `placeholderButtons` / `gradientColorA` / `gradientColorB` match exactly between `Window` and `Titlebar` (`disabled` is deleted by T2.9).
- `SimpleStringInput` re-emits every `BaseInput` event one-for-one, including event arguments; `NumberInput` copies all but `deny` (finding 2).
- `update:modelValue` is used consistently for two-way bindings; named models use `update:<name>`.
- `min` / `max` / `step` names are consistent between `Slider` and `NumberInput`.
- `BoxType` string values (`indent`, `panel-d-1`, `textarea`, …) are used consistently wherever a real box is selected.
- `value` is component-local: `ProgressBar.value` is the displayed value, `RadioButton.value` the option identity, `Checkbox.value` the hidden input value. No rename.
- Display text is role-scoped: `text` = free content, `label` = form label / panel caption, `title` = window chrome.
- `IntGrid` uses `columns` for the count, `cols` / `rows` for area-grid strings, `direction` for the visual axis, and `flow` for reading order.
- `Slider.rangeColor` (CGA blue) and `ProgressBar.fillColor` (Navy) are two palette roles, not two spellings of one API.
- `ProgressBar`'s `'custom'` box type is a real no-frame mode: `none` keeps the 6px frame, `custom` drops it.
- `Window.minWidth` / `minHeight` are drag floors, not mount clamps: a window may open at a smaller size and only refuses to shrink past the minimum.

---

## 5. Recommended canonical vocabulary

| Concept | Current names | Recommendation |
|---|---|---|
| Box skin | `type` / `baseType` / `boxType` | `boxType` for all non-`Box` components; `Box` keeps `type` (no alias) (T2.1) |
| Style override | `extraStyles` (2 types) | `extraStyles?: CSSProperties` everywhere (T1.3) |
| Class override | `extraClass` (partial) | keep as-is: `class` falls through on every single-root component |
| Content text | `text` / `label` / `title` | `text` = content, `label` = form label / panel caption, `title` = window chrome |
| Popup visibility | `open` / `shown` | `open` for all popups (T2.2) |
| Component value | `value` (three roles) | component-local; no rename (§4) |
| Spacing | `padding` / `gap` / `segmentLength` | CSS px everywhere (now true for ProgressBar); document nearest-vs-up snapping (T4.2) |
| Font size | `fontSize` token vs CSS px | keep the token; document the 2× rule (T4.1) |
| Disable state | `disabled` / `disableAll` | `disabled` wherever it disables the whole control; keep `disableAll` root-only and documented (T4.7); delete `Window` / `Titlebar` `disabled` (T2.9) |

---

## 6. Suggested fix order

1. **`NumberInput.deny` forwarding** — a real silent data-loss bug (T3.1).
2. **`RichInput` event surface** — document as intentionally closed (T4.8).
3. **Delete the dead `Window` / `Titlebar` `disabled` props** (T2.9).
4. **Standardize `boxType`** (`Button.baseType` first) — largest naming churn but biggest clarity win (T2.1).
5. **Type `Button.extraStyles` as `CSSProperties`** (T1.3); `extraClass` coverage stays as-is.
6. **Declare hidden defaults via `withDefaults`** — `Window` minima, `Tooltip` offsets, `Balloon.side`, `Titlebar` gradients (T1.2).
7. **Extract `TitlebarProps`** (T1.1); forwarding `MenuDropdown` props is 0.9 work.
8. **Fix `ScrollBar` emit declarations** (T1.4) and **polish ProgressBar docs** (T4.2).
