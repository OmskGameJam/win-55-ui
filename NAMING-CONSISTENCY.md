# Naming consistency report

Scope: prop, model, event, enum, and exported-type **names** across the 34 kit SFCs in `src/` (the separately versioned `src/fun/` demo is excluded; `BadApple.vue` declares no props).

This document is intentionally naming-only. It does **not** cover behavior, defaults, requiredness, payload/type correctness, units, event coverage, forwarding, or bugs. Those are tracked separately in `SELFCONSISTENCY.md`.

“Rename” means a public-API rename and is therefore breaking.

---

## 1. Naming scorecard

| Area | Verdict | Names in use |
|---|---|---|
| Box skin | **Poor** | `type` (Box), `baseType` (Button), `boxType` (inputs, ProgressBar) |
| Current-value prop | **Mixed** | `modelValue` (editable controls), `value` (ProgressBar, RadioButton, Checkbox) |
| Popup visibility | **Mixed** | `open` (BaseDropdown, StrikeTester), `shown` (Balloon) |
| Display string | **Mixed** | `text`, `label`, `title` |
| Grid/axis vocabulary | **Mixed** | `columns` / `cols`, `direction` / `orientation` / `flow` |
| Fill color | **Mixed** | `rangeColor` (Slider), `fillColor` (ProgressBar) |
| Style overrides | **Mixed** | `extraStyles`, `contentStyles`, `editorExtraStyles` |
| Size props | **Mostly good** | `size`, `fontSize`, `cellSize`, `itemWidth` / `itemHeight` are role-specific; only `sizeMax` is ambiguous |
| Boolean prefixes | **Mixed** | bare (`disabled`), `allow*`, `show*`, `match*`, noun (`placeholderButtons`), negative (`disableAll`) |
| Events | **Mixed** | `update:modelValue`, `scrollTo` / `scrollBy`, `click`, native-name passthroughs |
| Model names | **Good** | `x`, `y`, `width`, `height`, `scrollTop`, `scrollLeft`, `range`, `open` |
| Shared sub-APIs | **Good** | Window/Titlebar, RichText/RichTextNode, Checkbox/RadioButton |
| Exported type names | **Mostly good** | Component-prefixed (`ProgressBar*`, `IntGrid*`, `Cursor*`, `NumberInputVariant`) plus domain types (`BoxType`, `BoxOverflow`, `RichNode`); exception: `ProgressBarBoxType` adds `'custom'` |

---

## 2. Findings

### P1 — Public API ambiguity across components

**N1. One Box skin, three prop names.**
- `Box.vue:20` → `type`
- `Button.vue:10` → `baseType`
- `BaseInput.vue:14` → `boxType` (inherited by `SimpleStringInput`, `NumberInput`, `RichInput`)
- `ProgressBar.vue:45` → `boxType`

`baseType` and `boxType` are synonyms for the same `BoxType`; `type` is a generic synonym scoped to `Box`. Consumers must remember which component uses which spelling.

Rename: `Button.baseType` → `boxType`. Consider letting `Box` accept `boxType` (keeping `type` as the shorthand) so all four accept the same word.

Related value naming: `ProgressBarBoxType = BoxType | 'custom'` (`ProgressBar.vue:17`). `'custom'` is not a box name; it means “no box border”. If the union stays, the type name overpromises. Prefer `'none'`, or a separate `borderless` naming.

**N2. `value` names three unrelated things.**
- `ProgressBar.value` → the indicator value
- `RadioButton.value` → the option’s identity
- `Checkbox.value` → the hidden input’s value

The identifier is the same, the referent is not. Rename the form-control ones:
- `RadioButton.value` → `optionValue`
- `Checkbox.value` → `inputValue`

Keep `ProgressBar.value` as the display value.

**N3. Popup visibility uses two model names.**
- `BaseDropdown` and `StrikeTester` → `open`
- `Balloon` → `shown`

Rename: `Balloon` model `shown` → `open` (and `update:shown` → `update:open`). If an adjective is preferred, use `visible` for all popups, but do not split `open` / `shown`.

### P2 — Synonym drift

**N4. Display strings use `text`, `label`, and `title`.**
- `text`: `Tooltip`, `Balloon`, `FontTester`
- `label`: `NamedPanel`, `Checkbox`, `RadioButton`, `CursorBusyDemoButton`
- `title`: `Window`, `Titlebar`

The split can be defended by role, but it must be explicit:
- `text` = arbitrary content
- `label` = caption associated with a form control
- `title` = window chrome

`NamedPanel.label` is a panel heading rather than a form label; if strict, rename it to `caption` (or `title`, matching `Window`/`Titlebar`). No behavior changes are implied.

**N5. Grid vocabulary mixes `columns`, `cols`, and a `'columns'` mode.**
- `IntGrid.columns?: number` (repeat modes)
- `IntGrid.cols?: string` (areas mode)
- `IntGrid.mode` value `'columns'`
- `IntGrid.areas?: string`

`cols` abbreviates `columns` but names a different concept: the area column names, not the numeric column count. Rename:
- `IntGrid.cols` → `areaColumns`
- keep `columns` as the numeric prop
- keep the mode value `'columns'` only if it cannot be confused with the prop; otherwise use `'fixed-columns'`

**N6. The visual axis has three names.**
- `Slider.orientation`, `ProgressBar.orientation`, `ScrollBar.orientation` → `'horizontal' / 'vertical'`
- `IntGrid.direction` → `'vertical' / 'horizontal'`
- `IntGrid.flow` → `'ltr' / 'rtl' / 'btt' / 'ttb'`

`direction` duplicates `orientation`; `flow` is a separate concept. Rename `IntGrid.direction` → `orientation`, and keep `flow` for reading/fill order.

**N7. Filled-track color has two names.**
- `Slider.rangeColor`
- `ProgressBar.fillColor`

Both name the color of the filled portion. Rename `Slider.rangeColor` → `fillColor` (or use a shared `activeColor` across both).

**N8. Style-override props use three naming patterns.**
- Root overrides: `extraStyles` / `extraClass` (`Box`, `Window`, `Button`, `Slider`, `ProgressBar`, `IntGrid`)
- Inner content: `Button.contentStyles`
- Editor content: `BaseInput.editorExtraStyles` (inherited by `NumberInput`)

`extra*` means “appended to the component’s own styles”; `contentStyles` and `editorExtraStyles` mean “styles for a named inner part”. The two ideas are mixed in one family.

Adopt one convention:
- `extraStyles` / `extraClass` = root element
- `contentStyles` / `contentClass` = the inner content wrapper
- `<part>Styles` = a named part (e.g. `editorStyles`)

Under that rule, `BaseInput.editorExtraStyles` becomes `editorStyles` (or `contentStyles` if the editor is the content wrapper).

### P3 — Polish

**N9. `sizeMax` is ambiguous.**
`Slider.size` is a preset (`'small' / 'medium' / 'large'`); `Slider.sizeMax` is the size of the **high-value** handle, not a maximum size. Rename `sizeMax` → `highSize` (or accept `sizes: [SliderSize, SliderSize]`). Keep `size` for the single-handle preset.

**N10. Boolean names use several prefixes and one negative.**
Patterns in use:
- bare state: `disabled`, `multiline`, `wrap`, `normalized`, `fixedHeight`, `root`
- permission: `allowLinks`, `allowSizes`
- visibility: `showEmojiButton`
- behavior: `matchTriggerWidth`
- noun-only: `placeholderButtons`
- negative/imperative: `disableAll`
- borrowed word: `faux`

Suggested convention:
- bare adjective for state (`disabled`, `visible`)
- `show*` for visibility (`showEmojiButton`, `showPlaceholderButtons`)
- `allow*` for permissions (`allowLinks`, `allowSizes`)
- avoid noun-only booleans (`placeholderButtons` → `showPlaceholderButtons`)
- avoid negatives (`disableAll` → `forceDisabled`, or document it as a scoped override)

`faux` is the only borrowed/non-descriptive flag; if it becomes public-facing documentation, `static` or `embedded` communicates the mode better.

**N11. Event names mix declaration casing and reuse native names.**
- `ScrollBar` declares `scrollTo` / `scrollBy` (`ScrollBar.vue:16–19`) while its consumer listens with `@scroll-to` / `@scroll-by` (`Box.vue:72–73`). Vue accepts this, but the declaration and usage spellings differ. Prefer kebab-case in `defineEmits` (`'scroll-to'`, `'scroll-by'`).
- `Button` emits a custom event named `click` (`Button.vue:24–26`), reusing the native DOM event name for a component-level event. If it is meant to be the standard activation event, document that; otherwise use a distinct name such as `press` or `activate`.
- `update:modelValue` and `update:<model>` are consistent and should stay.

**N12. `ProgressBarBoxType` is named like a `BoxType` but is not one.**
The name says “box type”, but the union includes `'custom'`, which is not a box name. Either rename the member to a real box value (`'none'`), or rename the type to reflect the extra concept (`ProgressBarSkin` / `ProgressBarBorderMode`).

---

## 3. What is already consistent (keep it)

- `Window` ↔ `Titlebar`: `title`, `icon`, `placeholderButtons`, `disabled`, `gradientColorA`, `gradientColorB` match exactly.
- `RichText` ↔ `RichTextNode`: `allowLinks`, `allowSizes` match exactly.
- `Checkbox` ↔ `RadioButton`: `checkedIcon`, `uncheckedIcon`, `label`, `disabled`, `modelValue` match exactly.
- `extraStyles` / `extraClass` are spelled identically wherever the pair exists.
- `orientation` is spelled and valued identically in `Slider`, `ProgressBar`, and `ScrollBar`.
- `min`, `max`, `step` are named identically in `Slider` and `NumberInput`.
- `element` is named identically in `Typography` and `CursorContext`.
- All models follow `update:<model>`; all editable controls use `modelValue`.
- `BoxType` member names (`indent`, `panel-d-1`, `textarea`, …) are used identically wherever a real box is selected.
- Component-owned exported types are consistently component-prefixed (`ProgressBar*`, `IntGrid*`, `Cursor*`, `NumberInputVariant`). Shared domain types (`BoxType`, `BoxOverflow`, `RichNode`) are consistently unprefixed.
- The `update:modelValue` / `update:<name>` split is clean: `update:<name>` for named models, `update:modelValue` for the default model.

---

## 4. Canonical vocabulary

| Concept | Current names | Canonical name |
|---|---|---|
| Box skin | `type` / `baseType` / `boxType` | `boxType` (`Box` may keep `type`) |
| Box-skin value for “no border” | `'custom'` (ProgressBar only) | `'none'`, or a separate `borderless` prop |
| Indicator value | `value` (ProgressBar) | `value` |
| Option identity | `value` (RadioButton) | `optionValue` |
| Hidden input value | `value` (Checkbox) | `inputValue` |
| Popup visibility | `open` / `shown` | `open` |
| Arbitrary content text | `text` / `label` / `title` | `text` |
| Form caption | `label` | `label` |
| Window chrome | `title` | `title` |
| Panel caption | `label` (NamedPanel) | `caption` (optional) |
| Grid column count | `columns` | `columns` |
| Grid area column names | `cols` | `areaColumns` |
| Visual axis | `orientation` / `direction` | `orientation` |
| Reading/fill order | `flow` | `flow` |
| Filled-track color | `rangeColor` / `fillColor` | `fillColor` |
| Root style overrides | `extraStyles` / `extraClass` | `extraStyles` / `extraClass` |
| Inner content overrides | `contentStyles` / `editorExtraStyles` | `contentStyles` / `<part>Styles` |
| High-handle size | `sizeMax` | `highSize` (or `sizes: [SliderSize, SliderSize]`) |
| Visibility boolean | `showEmojiButton` | `show*` |
| Permission boolean | `allowLinks` / `allowSizes` | `allow*` |
| Noun-only boolean | `placeholderButtons` | `showPlaceholderButtons` |
| Negative boolean | `disableAll` | `forceDisabled` (or document as scoped override) |
| Custom click event | `click` | `press` / `activate`, or document native semantics |
| Emitted scroll events | `scrollTo` / `scrollBy` | `scroll-to` / `scroll-by` in `defineEmits` |

---

## 5. Naming-only rename checklist

Ordered by public-API impact. All are breaking unless aliases are kept.

1. `Button.baseType` → `boxType`; optionally add `boxType` alias on `Box`.
2. `Balloon` model `shown` → `open`.
3. `RadioButton.value` → `optionValue`; `Checkbox.value` → `inputValue`.
4. `IntGrid.cols` → `areaColumns`; `IntGrid.direction` → `orientation`.
5. `Slider.rangeColor` → `fillColor`.
6. `BaseInput.editorExtraStyles` → `editorStyles` or `contentStyles`.
7. `Slider.sizeMax` → `highSize` (or `sizes` tuple).
8. `placeholderButtons` → `showPlaceholderButtons`; `disableAll` → `forceDisabled`.
9. `ScrollBar` emits `scrollTo` / `scrollBy` → `'scroll-to'` / `'scroll-by'` declarations.
10. `Button` emit `click` → `press` / `activate`, or document it as the activation event.
11. `NamedPanel.label` → `caption` (only if a strict text/label/title split is wanted).
12. `Window.faux` → `static` / `embedded` (optional clarity).
13. `ProgressBarBoxType` + `'custom'` → keep the BoxType vocabulary (`'none'`) or rename the type to match the extra concept.
