# Naming consistency report

Scope: prop, model, event, enum, and exported-type **names** across the 34 kit SFCs in `src/` (the separately versioned `src/fun/` demo is excluded; `BadApple.vue` declares no props).

This document is intentionally naming-only. It does **not** cover behavior, defaults, requiredness, payload/type correctness, units, event coverage, forwarding, or bugs. Those are tracked separately in `SELFCONSISTENCY.md`.

“Rename” means a public-API rename and is therefore breaking.

---

## 1. Naming scorecard

| Area | Verdict | Names in use |
|---|---|---|
| Box skin | **Poor** | `type` (Box), `baseType` (Button), `boxType` (inputs, ProgressBar) |
| Current-value prop | **Good** | `modelValue` (editable controls), `value` (read-only ProgressBar) |
| Popup visibility | **Mixed** | `open` (BaseDropdown, StrikeTester), `shown` (Balloon) |
| Display string | **Good** | `text` (arbitrary content), `label` (form caption), `title` (window chrome) |
| Style overrides | **Mixed** | `extraStyles`, `contentStyles`, `editorExtraStyles` |
| Size props | **Good** | `size`, `fontSize`, `cellSize`, `itemWidth` / `itemHeight`, `sizeMax` are role-specific |
| Boolean prefixes | **Mixed** | bare (`disabled`), `allow*`, `show*`, `match*`, noun (`placeholderButtons`), negative (`disableAll`) |
| Events | **Mixed** | `update:modelValue`, `scrollTo` / `scrollBy`, `click`, native-name passthroughs |
| Model names | **Good** | `x`, `y`, `width`, `height`, `scrollTop`, `scrollLeft`, `range`, `open` |
| Shared sub-APIs | **Good** | Window/Titlebar, RichText/RichTextNode, Checkbox/RadioButton |
| Exported type names | **Good** | Component-prefixed (`ProgressBar*`, `IntGrid*`, `Cursor*`, `NumberInputVariant`) plus domain types (`BoxType`, `BoxOverflow`, `RichNode`) |

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

**N2. Popup visibility uses two model names.**
- `BaseDropdown` and `StrikeTester` → `open`
- `Balloon` → `shown`

Rename: `Balloon` model `shown` → `open` (and `update:shown` → `update:open`). If an adjective is preferred, use `visible` for all popups, but do not split `open` / `shown`.

### P2 — Synonym drift

**N3. Style-override props use three naming patterns.**
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

**N4. Boolean names use several prefixes and one negative.**
Patterns in use:
- bare state: `disabled`, `multiline`, `wrap`, `normalized`, `fixedHeight`, `root`
- permission: `allowLinks`, `allowSizes`
- visibility: `showEmojiButton`
- behavior: `matchTriggerWidth`
- noun-only: `placeholderButtons`
- negative/imperative: `disableAll`

Suggested convention:
- bare adjective for state (`disabled`, `visible`)
- `show*` for visibility (`showEmojiButton`, `showPlaceholderButtons`)
- `allow*` for permissions (`allowLinks`, `allowSizes`)
- avoid noun-only booleans (`placeholderButtons` → `showPlaceholderButtons`)
- avoid negatives (`disableAll` → `forceDisabled`, or document it as a scoped override)

**N5. Event names mix declaration casing and reuse native names.**
- `ScrollBar` declares `scrollTo` / `scrollBy` (`ScrollBar.vue:16–19`) while its consumer listens with `@scroll-to` / `@scroll-by` (`Box.vue:72–73`). Vue accepts this, but the declaration and usage spellings differ. Prefer kebab-case in `defineEmits` (`'scroll-to'`, `'scroll-by'`).
- `Button` emits a custom event named `click` (`Button.vue:24–26`), reusing the native DOM event name for a component-level event. If it is meant to be the standard activation event, document that; otherwise use a distinct name such as `press` or `activate`.
- `update:modelValue` and `update:<model>` are consistent and should stay.

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
| Indicator value | `value` (ProgressBar) | `value` |
| Popup visibility | `open` / `shown` | `open` |
| Arbitrary content text | `text` | `text` |
| Form caption | `label` | `label` |
| Window chrome | `title` | `title` |
| Grid column count | `columns` | `columns` |
| Reading/fill order | `flow` | `flow` |
| Root style overrides | `extraStyles` / `extraClass` | `extraStyles` / `extraClass` |
| Inner content overrides | `contentStyles` / `editorExtraStyles` | `contentStyles` / `<part>Styles` |
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
3. `BaseInput.editorExtraStyles` → `editorStyles` or `contentStyles`.
4. `placeholderButtons` → `showPlaceholderButtons`; `disableAll` → `forceDisabled`.
5. `ScrollBar` emits `scrollTo` / `scrollBy` → `'scroll-to'` / `'scroll-by'` declarations.
6. `Button` emit `click` → `press` / `activate`, or document it as the activation event.
