# 0.8.0 consistency subset — future-proofing only

Filtered subset of `SELFCONSISTENCY.md` and `NAMING-CONSISTENCY.md`. Both reports
describe the tree at **0.7.2**; this file says which of their findings are worth
spending the one breaking release on.

Nothing here is applied yet. Each item has an ID so it can be ticked, skipped, or
moved to a later release without re-litigating the whole audit.

---

## 0. The filter

0.8.0 is the breaking release; after it the public API should sit still for a
while. So "in" means **the change is still right in two years**, not "the change is
nice":

**In**

1. **Rename** — same type, same default, same meaning, different identifier.
2. **Invisible** — no runtime change: one declaration site for a default, one
   interface for a shared prop set, a type that matches what the code already does.
3. **Wired** — a prop that is already declared (and documented) but silently does
   nothing, made to do exactly what it promises.

**Out**

- New props, events, slots, modes, CSS hooks — even additive ones.
- Anything that changes what an existing prop *means*.
- Structural changes (which element receives overflow, which wrapper owns scroll).

**No aliases, no deprecation shims.** A shim keeps the dual vocabulary alive past
0.8.0, which is the exact thing this release exists to remove. One name per
concept, cut over once.

### 0.1 Deliberate escape hatches — do not "fix" these

These read like inconsistencies to an auditor and are not. Each one is the only way
to express something, and several are named like the hack they are (`faux`,
`forgive`, `hint`, `disableAll`) on purpose.

| Hatch | What it is | Why it stays |
|---|---|---|
| `Window.faux` | window chrome as a static div: no drag, no resize, grey gradient | the only way to get a titlebar-looking container; `faux` is the precise word |
| `Window.minWidth/minHeight` | a **drag floor**, not a mount clamp | a window may open at a size the consumer computed and still refuse to shrink past usability (see §5) |
| `Window.extraStyles` under `faux` | replaces positioning entirely | `faux` means "you own the layout"; injecting `position: absolute` would fight the consumer |
| `Box.type="none"` | a 9-patch-less box that keeps the 6px frame | "no skin, same geometry", so a component can swap skins without relayout |
| `Box.overflow` vs `overflowX/overflowY` | global vs per-axis | per-axis is how `Box` models CSS's `visible`→`auto` promotion (`resolveOverflow`) |
| `Box.forgiveVerticalOverflow` | 4px slack in the scroll measurement (`useScrollContainer.ts:11, 98-105`) | absorbs DOM rounding so a phantom scrollbar does not appear; do not "round it away" |
| `ProgressBar.boxType="custom"` → `frameless` | no frame at all; the bar fills the outer box (T2.10) | distinct from `none`, which keeps the invisible frame; renamed only |
| `ProgressBar.value === undefined` | indeterminate marquee (`:121`) | absence of a value is the API for "unknown", not a missing prop (T4.9) |
| `ProgressBar` `segmentLength` vs `segmentCount` | two ways to size segments; `segmentLength` wins | already warns at runtime (`:373-379`); keep both, document precedence (T4.2) |
| `Typography.fontSize` | bitmap strike token, rendered at 2× CSS px | renaming it to a px-looking name would be worse; documented instead (T4.1) |
| `Typography.element` / `display="contents"` | tag swap / layout opt-out | lets Typography live inside a text run without adding a box |
| `CursorContext` unset `scheme`/`mode`/`disabled` | `undefined` = inherit from the nearest context | a declared default would make nesting impossible (T1.2, T4.6) |
| `CursorContext.root` | scheme + overlay on `<html>` | the only thing that reaches `<Teleport>`-ed content |
| `CursorContext.disableAll` | root-only hard override, beats nested re-enables | the deliberate nuclear option; the negative name is the warning label (see §5) |
| `Balloon.text?` + `#content` slot | plain text **or** rich content | the one reason its `text` is optional where `Tooltip`'s is required |
| `Balloon.anchor` | anchor to an arbitrary viewport point/rect | for popups whose trigger is not a slot child (caret, selection) |
| `BaseDropdown` without `v-model:open` | uncontrolled by default | `defineModel` with a default keeps it usable with no model; binding is opt-in |
| `Checkbox`/`RadioButton` hidden `<input>` | native form participation | survives the prop rename; it is the reason `inputValue` has that name |
| `Slider.fixedValues` | custom discretization that beats `step` | the deliberate alternative to uniform steps; document precedence (T4.3) |
| `Slider.normalized` | range mode where the thumbs cannot cross | a mode, not a validation rule |
| `IntGrid.areas` + `cols`/`rows` (→ `areaColumns`/`areaRows`) | arbitrary `grid-template` strings | the bring-your-own-layout mode; the rename keeps the arbitrary strings |
| `Button.contentStyles` / `BaseInput.contentStyles` | style the inner part only | the reason `extra*` is reserved for the root |
| `ComboBox.data` | `string[]` or `{ key, data }[]` | plain strings are what keep it usable without an item type |
| `NamedPanel.backgroundColorHint` | the line-hider patches the panel border with the colour behind it | there is no way to detect that colour; the hint *is* the API |
| `Emoji` has no `size` prop | intrinsic size from the decoded GIF | the registry GIFs are not all square; a `size` prop would fight the asset |
| `RichInput` closed event surface | owns `keydown`/`paste`/`beforeinput` for shortcodes + emoji | re-emitting would hand one event to two owners; closed is the design (T4.8) |

Everything here survives 0.8.0 with its behaviour intact. Only three rows are
touched, and only in name (T2.3 hidden-input props, T2.4 area columns/rows, T2.10
frameless); T2.9 deletes dead code, not a hatch.

---

## 1. Invisible (no public change, no behaviour change)

### T1.1 — One interface for the titlebar prop set

- `Titlebar.vue:7-14` → `export interface TitlebarProps { title: string; icon?: string; placeholderButtons?: boolean; gradientColorA?: string; gradientColorB?: string; disabled?: boolean }`
  (`placeholderButtons` is renamed by T2.8, `disabled` deleted by T2.9 — do this
  item first and let the later items edit the interface).
- `Window.vue:21-27` → `defineProps<TitlebarProps & { …window-only props… }>()`
- Passing stays explicit (`Window.vue:236-242`) because Window rewrites the
  gradients in `faux` mode.

The six names are currently declared twice; the next titlebar option has to be
added in two places or it silently stops matching. After this the compiler
enforces the match.

### T1.2 — Declare the defaults that currently live in code

| File | Declare via `withDefaults` | Stop doing |
|---|---|---|
| `Window.vue:15-16, 45-46` | `minWidth: 240`, `minHeight: 40` | `props.minWidth ?? 240` locals |
| `Tooltip.vue:7-8, 30-31` | `offsetX: 24`, `offsetY: 24` | `props.offsetX ?? 24` |
| `Balloon.vue:37, 44, 203` | `side: 'top'` | `props.side ?? 'top'`, the `side` computed |
| `Titlebar.vue:12-13, 20-21` | `gradientColorA: '5555ff'`, `gradientColorB: '0000aa'` | `props.gradientColorA \|\| '5555ff'` |

Same values, now visible to tooling and docs, one source instead of two.
Edge case on Titlebar: an explicit `gradient-color-a=""` currently falls back to
the default (`||`), after this it is passed through — treat as acceptable.

**Not** `CursorContext`: `scheme` / `mode` / `disabled` use `undefined` as the
"inherit from the nearest context" sentinel (`CursorContext.vue:58-63`). A
`withDefaults` there would break inheritance. Add a comment saying so (T4.6).

**Not** `Window`'s overflow props: 0.7.3 rewrites that area (see §6), so leave them
alone here instead of coding their current shape into a defaults block.

### T1.3 — `Button` style props typed like every other style prop

- `Button.vue:11` `extraStyles`, `:14` `contentStyles`:
  `Record<string, string | number | undefined>` → `CSSProperties`.
- Add `import type { CSSProperties } from 'vue'`.

`Button` is the only component in the kit that types style overrides this way, and
the looser type is how a typo (`padidng`) survives review. No hatch is lost: Vue's
`CSSProperties` still accepts `--custom-property` keys plus hyphenated CSS keys.

### T1.4 — Emit declarations match how they are listened to

- `ScrollBar.vue:16-19` → `'scroll-to'` / `'scroll-by'`; update the three
  `emit('scrollTo' | 'scrollBy', …)` calls (`:96, :122, :148`).

Vue already accepts `@scroll-to` against a camelCase declaration, so nothing
changes for consumers; the declaration just stops contradicting `Box.vue:72-73`.

---

## 2. Renames (breaking; the reason for 0.8.0)

| # | Old | New | Rule it lands on |
|---|---|---|---|
| T2.1 | `Button.baseType` | `boxType` | one word for a box skin |
| T2.2 | `Balloon` model `shown` | `open` | one word for popup visibility |
| T2.3 | `RadioButton.value` / `Checkbox.value` | `optionValue` / `inputValue` | `value` = displayed value only |
| T2.4 | `IntGrid.cols` / `rows` / `direction` | `areaColumns` / `areaRows` / `orientation` | `orientation` = axis, `flow` = order |
| T2.5 | `Slider.rangeColor` | `fillColor` | same role as `ProgressBar.fillColor` |
| T2.6 | `BaseInput.editorExtraStyles` | `contentStyles` | `extra*` = root, `content*` = inner |
| T2.7 | `Slider.sizeMax` | `highSize` | the prop is a handle size, not a maximum |
| T2.8 | `placeholderButtons` | `showPlaceholderButtons` | `show*` = visibility |
| T2.9 | `Window.disabled` / `Titlebar.disabled` | *(deleted)* | dead prop, not a rename |
| T2.10 | `ProgressBar.boxType: 'custom'` | `'frameless'` | names the mode, not "you supply a box" |

### T2.1 — `Button.baseType` → `boxType`

- `Button.vue:10` (decl), `:17` (default), `:78` (use).
- **Rename the local `boxType` computed (`Button.vue:77-79`) to `resolvedBoxType`** —
  it would otherwise shadow the new prop name.
- Call sites: `Titlebar.vue:98, 105, 113`, `EmojiPickerWindow.vue:91`,
  `StrikeTester.vue:80, 122, 150`, `README.md:90`.

Do **not** add a `boxType` alias to `Box` (as suggested by SELFCONSISTENCY #1).
`Box.type` stays: it is the primitive, and `type` describes the element's own skin.
Everything that *delegates* to a Box uses `boxType`. Two names for one prop is the
drift this release is deleting.

### T2.2 — `Balloon` model `shown` → `open`

- `Balloon.vue:8-10` (model), `:221` (watch), `:251`, `:287` (template).
- `RichInput.vue:895` (`:shown="true"` → `:open="true"`).
- `App.vue:803, 810, 819, 828, 836, 843, 850, 857, 865, 872, 881, 890`.
- `README.md:166, 174` (+ the `v-model:shown` example).

Same boolean, same `false` default, `update:open` now matches `BaseDropdown`.

### T2.3 — `RadioButton.value` → `optionValue`, `Checkbox.value` → `inputValue`

- `RadioButton.vue:10, 28, 34, 62`; `Checkbox.vue:11, 58`.
- Demo/testers: `App.vue:559-578`, `App.vue:619-625` (bound `:value="boxType"`),
  `App.vue:740-758`, `App.vue:987-988`, `StrikeTester.vue:88, 98, 106, 133`.
- Most demo call sites use the static form `value="a"`, which is still the prop —
  a `:value=` grep alone misses them.
- The hidden native `<input>` keeps its `:value` binding — only the prop name moves.

`unknown` stays `unknown` for `optionValue`; `inputValue` stays `string | undefined`.
This leaves exactly one `value` in the kit: the displayed value of a read-only
indicator (`ProgressBar.value`).

### T2.4 — `IntGrid.cols` / `rows` → `areaColumns` / `areaRows`; `direction` → `orientation`

- `IntGrid.vue:22` (`direction` decl + default `:38`), `:27-29` (`areas`, `cols`, `rows`),
  `:97-105` (areas layout), `:129, 149` (masonry), `:188` (watch list).
- `IntGridTester.vue:75, 82, 89, 96` (`direction`), `:103, 120` (area grids, `cols`/`rows`).

`rows` is renamed alongside `cols` — the audit only flagged `cols`, but renaming one
half would leave the area-mode pair asymmetric. `areas` itself keeps its name.

Keep `mode="columns"`: it names the mode, not the prop, and `columns` in
`repeatGrid` genuinely is the column count. Keep `flow` as the reading/fill order.

After this, `orientation` is `'vertical' | 'horizontal'` in `IntGrid`, `Slider`,
`ProgressBar` and `ScrollBar` — one union, one meaning.

### T2.5 — `Slider.rangeColor` → `fillColor`

- `Slider.vue:51` (decl), `:64` (default), `:366` (use). No demo sets it.
- The *default value* is a separate palette question and stays as is — see §5.

### T2.6 — `BaseInput.editorExtraStyles` → `contentStyles`

- `BaseInput.vue:16, 31, 172`; `NumberInput.vue:91, 93`;
  `RichInput.vue:853, 871` (internal computed → rename to `contentPadding`,
  bind `:content-styles`).

Why `contentStyles` and not `editorStyles`: both `BaseInput.vue:168` and
`NumberInput.vue:90` already have a local `editorStyles` computed, and
`Button.contentStyles` already means "styles for the inner content wrapper".
This is the same convention, not a third one.

### T2.7 — `Slider.sizeMax` → `highSize`

- `Slider.vue:48` (decl), `:61` (default), `:81` (use).
- `App.vue:651, 660` (`size-max="large"`).

`size` stays the single-handle preset; `highSize` says which handle it sizes.

### T2.8 — `placeholderButtons` → `showPlaceholderButtons`

- `Titlebar.vue:10, 95`; `Window.vue:24, 239`; `App.vue:774, 783`;
  `README.md:155, 241, 244`.

The current name reads like the collection of buttons, not a switch.

### T2.9 — Delete `Window.disabled` and `Titlebar.disabled`

`Titlebar.disabled` is declared (`Titlebar.vue:11`), forwarded by Window
(`Window.vue:25, 240`), and **never read**: the three placeholder buttons hardcode
`disabled` (`Titlebar.vue:99, 106, 114`). Everywhere else in the kit `disabled`
means "this control does nothing", so the name actively lies here.

Delete the prop from both components, drop it from `TitlebarProps`, and remove it
from `README.md:155, 244`. Behaviour is unchanged: a consumer passing `disabled`
now gets a stray attribute on the root `div`.

Wiring it instead ("honour `disabled` in drag/resize", or "let it re-enable the
fake buttons") is a feature and is listed in §5.

### T2.10 — `ProgressBar` frameless mode: keep the behaviour, fix the name

`'custom'` is a **distinct mode, not a widened `BoxType`**, and the two members are
not interchangeable:

- `'none'` is a real `BoxType`: `.border-9-none` drops the 9-patch
  (`index.css:133-136`) and `boxStyle` **re-adds a 6px transparent border**
  (`ProgressBar.vue:284-290`) so the bar keeps Box's frame inset.
  `BOX_BORDER_WIDTHS.none = 6` (`:37`) matches that and is correct.
- `'custom'` renders `<Box type="none">` but subtracts **0** from the geometry
  (`:93`) and adds no transparent border, so the track occupies the whole outer
  box (minus `padding`). It is the mode for handing the bar to a host element
  that already draws the box.

So nothing about the geometry changes. Only the name does — `'custom'` reads as
"you supply the box", while it means "no frame, fill the box":

- `ProgressBar.vue:17` `BoxType | 'custom'` → `BoxType | 'frameless'`.
- `:93`, `:96` comparisons; `:383` comment.
- `App.vue:148` `'custom'` → `'frameless'`.
- Keep the exported `ProgressBarBoxType` — it names "the values `boxType` accepts",
  and a member that is not a `BoxType` is exactly what it must express. Document
  the member (T4.2).
- **Do not** touch `BOX_BORDER_WIDTHS.none`; the 6 is what makes `none` keep the
  frame that `frameless` drops.

If you would rather not touch the value name at all, skip this item and take only
T4.2 — the two modes then just stay underdocumented.

### T2.11 — `CursorContext.disableAll`: keep it

Not renamed. It is the root-only hard override in §0.1, and `disableAll` is the
"are you sure" label that `forceDisabled` would flatten into an ordinary boolean.
Take the JSDoc from T4.7 instead.

---

## 3. Declared but not wired (tiny, fixes what the prop already promises)

### T3.1 — `NumberInput` forwards `deny`

- `NumberInput.vue:51-58` `inputProps` is missing `deny: props.deny`.

`deny` is inherited through `Omit<BaseInputProps, 'allow'>` (`:28`), so it is
declared, typed, and documented — but declared props are stripped from `$attrs`,
so the regex never reaches `BaseInput` and the consumer sees no filtering and no
warning. One line; existing consumers gain the behaviour they already asked for.

### T3.2 — `SimpleStringInput` keeps `deny`'s flags

- `SimpleStringInput.vue:18-19` builds `new RegExp(source, 'u')`, silently
  discarding `i` / `m` / `s` from the incoming regex.

```ts
const flags = [...new Set([...EMOJI_PATTERN.flags, ...(props.deny?.flags ?? ''), 'u'])].join('')
```

Union of both patterns' flags, `u` always kept. No change when `deny` has no flags.

---

## 4. JSDoc contract notes (no code change)

These are the audit findings whose fix is a written contract, not a rename. They are
cheap and they stop the next contributor from "fixing" deliberate behaviour.

1. **T4.1** `helpers/typography.ts:14` `fontSize` — a bitmap strike token from
   `[8, 10, 12, 16, 18, 24]`, rendered at `size × 2` CSS px (`:77-78`). Applies to
   `Typography` and `FontTester` (`:7`).
2. **T4.2** `ProgressBar.vue:40-53` — `padding` / `gap` snap to the **nearest**
   cell (`roundEven`, `:83-84`), while `segmentLength` / `width` / `height` snap
   **up** (`ceilEven`, `:81-87`). `segmentLength < 2` renders no segments (`:206`).
   `segmentLength` wins over `segmentCount` (`:205`).
   `boxType` needs its own JSDoc: `'none'` keeps Box's 6px frame invisibly
   (`:284-290`, `:37`), the frameless mode drops the frame and fills the outer box
   (`:93`, `:96`) — they are not two spellings of the same thing (T2.10).
3. **T4.3** `Slider.vue:52` `fixedValues` — wins over `step`; `step` is ignored
   while a non-empty `fixedValues` survives the `min`/`max` filter (`:105-112, :132`).
4. **T4.4** `NumberInput.vue:39` `modelValue` — numeric **text**, not a number
   (`formatNumber`, `:148`). `Slider` is the number-typed control.
5. **T4.5** `Button.vue:24-26` `click` — activation event (mouse released inside),
   no payload; not the native DOM event.
6. **T4.6** `CursorContext.vue:56-63` — `undefined` means "inherit", which is why
   these props have no declared defaults (see T1.2).
7. **T4.7** `CursorContext.vue:48-49` `disableAll` — root-only, beats nested
   re-enables; not a synonym for `disabled` (which inherits and can be re-enabled).
8. **T4.8** `RichInput.vue:36-46` — the narrow prop/event surface is deliberate: the
   component owns `keydown` / `beforeinput` / `paste` for the shortcode and emoji
   machinery, so those events are not re-emitted. `BaseInput` is the open one.
9. **T4.9** `ProgressBar.vue:121` — `value` omitted means **indeterminate marquee**,
   not "0". `value: 0` is a determinate empty bar.
10. **T4.10** `helpers/typography.ts:14` + `palette.css:3, 19-22` — `#000080` (Navy)
    is the kit's selected/filled colour (`index.css:204, 260`); `--win55-cga-blue`
    is the interactive accent (`MenuDropdown`, `ComboBox` hover). The two blues in
    `ProgressBar.fillColor` and `Slider.fillColor` are those two roles, not drift.

---

## 5. Deliberately excluded

Each of these is a real finding; none of them belongs in a rename release.

| Finding | Why not now |
|---|---|
| `Window.disabled` should really disable drag/resize | New behaviour + a decision about `faux`. T2.9 removes the misleading prop instead. |
| `Window.minWidth/minHeight` should clamp on mount | It is a drag floor, not a mount clamp (§0.1). |
| `RichInput` should re-emit `input`/`keydown`/`paste`/… | Closed on purpose: it already owns those events for shortcodes/emoji (§0.1, T4.8). Re-emitting would give one event two owners. |
| `CursorContext.disableAll` → `forceDisabled` | Deliberate root-only override; the negative name is the warning label (§0.1, T4.7). |
| Unify the `fillColor` defaults (ProgressBar vs Slider) | Two palette roles: Navy = selected/filled, CGA blue = interactive accent (T4.10). Theme both later by tokenising Navy — additive, not 0.8.0. |
| `MenuDropdown` should declare and forward its props | It works today by root-vnode fallthrough. Declaring them adds API surface; fine for 0.9, not needed to unbreak 0.8.0. |
| `extraClass` on the rest of the kit | Additive prop on ~15 components, and `class` already falls through on every single-root one. |
| `Box` should also accept `boxType` | Two names for one prop, forever. |
| `NamedPanel.label` → `caption` | Would add a fourth word for display text (a panel heading is a group label, not chrome). |
| `Window.faux` → `embedded` / `static` | No clearly better word; `faux` is precise and documented. Renaming would be churn with a new guess. |
| `Typography.fontSize` → `size` / `fontSizeToken` | The ambiguity is the 2× rule, which a name cannot fix. Documented in T4.1; the token is also the natural value for BBCode sizes (`RichTextNode.vue:42`). |
| `IntGrid.mode="columns"` rename | It names the mode, not the prop. `mode="columns"` + `:columns="4"` reads fine. |
| `ProgressBar.boxType` split into `boxType` + `borderless` | The frameless mode is real (T2.10), but a second prop would be a third way to say it and a new API surface. |
| `Button` emit `click` → `press` | `@click` is the idiom users expect; documented in T4.5. |

---

## 6. Order of work, consumers, verification

**Prerequisite:** 0.7.3 is where `Window` moves onto the `Box` scrollbar system.
Land it first; this pass assumes the post-0.7.3 `Window` and does not touch its
overflow props.

**Order** (each step leaves the tree green):

1. T1.1 → T1.4 (invisible; no consumer edits).
2. T3.1 → T3.2 (behaviour fixes).
3. T2.1 → T2.10 (renames; each is mechanical and local; T2.11 is a recorded no-op).
4. T4.1 → T4.10 (JSDoc).
5. `package.json` version → `0.8.0`; README prop lists for Button, Window,
   Balloon, Titlebar, RadioButton, Checkbox (the README is already stale beyond
   these renames — see §7).

**Consumer inventory** for the rename pass (everything that instantiates the kit):

`src/App.vue`, `src/components/Titlebar.vue`, `src/components/StrikeTester.vue`,
`src/components/EmojiPickerWindow.vue`, `src/components/RichInput.vue`,
`src/components/IntGridTester.vue`, `src/components/NumberInput.vue`,
`src/components/SimpleStringInput.vue`, `src/components/ComboBox.vue`, `README.md`.
`src/fun/` declares no props (excluded, gitignored).

**Stale-name sweep** after step 3 — the old-name patterns must return nothing, the
new-name patterns only the expected sites:

```bash
rg -n "base-type|baseType|v-model:shown|:shown=|size-max|sizeMax|range-color|rangeColor" src README.md
rg -n "editor-extra-styles|editorExtraStyles|placeholder-buttons|placeholderButtons" src README.md
rg -n ":cols=|:rows=|:direction=|areaColumns|areaRows|optionValue|inputValue|highSize" src README.md
rg -n "ProgressBarBoxType|box-type=\"custom\"|frameless" src README.md
```

**Verification** (no build required):

```bash
npx vue-tsc --noEmit -p tsconfig.app.json
npm run lint
```

Then a manual pass in `src/App.vue` — the box-type radios (check that `none` keeps
its 6px inset while `frameless` fills the bar), the Balloon grid, the range Slider,
and the RadioButton groups are the places where a typo would still *render*.

---

## 7. Drift the audits missed

- **`ComboBox.vue` post-dates both reports** (11 props, `index.ts:11`). It is not
  covered by any finding here. Before 0.9 it needs one pass of its own: it
  re-declares the input props (`modelValue`, `placeholder`, `disabled`,
  `maxLength`, `boxType`, `extraStyles`) without `multiline` / `wrap` /
  `contentStyles`, and it has `extraStyles` but no `extraClass`.
- **The README documents an older kit**: `BaseInput` is described with
  `extraClass` and a `change` emit it does not have (`README.md:106-107`), same for
  `Checkbox` / `RadioButton` (`:117-118, :129-130`), and `BoxType` is listed
  without `none` (`:55`). That is a docs pass, not part of this subset — but the
  rename step touches those same lines, so do both in one edit.
- **`CursorBusyDemoButton`, `TestDeepMenu`, `ScrollFillTester`, `IntGridTester`,
  `StrikeTester`** are demo components. They are consumers here, not API; do not
  give them props/defaults in the name of consistency.

---

## 8. Frozen vocabulary after 0.8.0

Anything added later has to fit this table; if it does not, it is a 0.9 discussion.

| Concept | Name | Applies to |
|---|---|---|
| Box skin | `boxType` (`Box` keeps `type`) | Button, inputs, ProgressBar, ComboBox |
| Skin without 9-patch art | `'none'` (real `BoxType`, keeps the 6px frame) / `'frameless'` (ProgressBar only, no frame) | everywhere / ProgressBar |
| Style / class override | `extraStyles: CSSProperties` / `extraClass` | root element only |
| Inner content override | `contentStyles` | Button, BaseInput |
| Current display value | `value` | ProgressBar |
| Option identity | `optionValue` | RadioButton |
| Hidden input value | `inputValue` | Checkbox |
| Popup visibility model | `open` / `update:open` | Balloon, BaseDropdown |
| Arbitrary content | `text` | Tooltip, Balloon |
| Form / group caption | `label` | Checkbox, RadioButton, NamedPanel |
| Window chrome | `title` | Window, Titlebar |
| Visual axis | `orientation` (`horizontal` / `vertical`) | Slider, ProgressBar, ScrollBar, IntGrid |
| Reading / fill order | `flow` | IntGrid |
| Column count | `columns` | IntGrid |
| Area column / row names | `areaColumns` / `areaRows` | IntGrid |
| Filled-track colour | `fillColor` | Slider, ProgressBar (defaults differ by palette role, T4.10) |
| Handle size | `size` (single) / `highSize` (high handle) | Slider |
| Visibility boolean | `show*` | `showPlaceholderButtons`, `showEmojiButton` |
| Permission boolean | `allow*` | `allowLinks`, `allowSizes` |
| Disable state | `disabled`; root-wide hard override `disableAll` | all controls; CursorContext |
| Emitted actions | kebab-case in `defineEmits` (`scroll-to`) | all |
