# win-55-ui — parity & feature checklist

Reference: 98.css component set. Baseline `ccb051e` (0.7.2), 2026-11-16.
Effort: `S` ≤ half day, `M` ~1 day, `L` multi-day.

## Missing controls

- [ ] **Slider** — `input[type=range]`; default + box indicator; vertical variant — `src/components/Slider.vue` — `S–M`
- [ ] **ProgressBar** — solid + segmented — `ProgressBar.vue` — `S`
- [ ] **Tabs** — `role=tablist`/`tab`, arrow keys, multirow; replaces emoji-picker fake tabs (`index.css:242-258`) — `Tabs.vue` — `M`
- [ ] **StatusBar** — fields, sunken 1px field border, resize grip — `StatusBar.vue` — `S`
- [ ] **TreeView** — disclosure triangles, dotted indent guides, keyboard nav — `TreeView.vue` — `M`
- [ ] **TableView** — sunken panel, header, interactive/highlighted rows — `TableView.vue` — `M`
- [ ] **GroupBox** — `fieldset`/`legend` notch, disabled state; `NamedPanel` is not it (`NamedPanel.vue:25-43`) — `S–M`
- [ ] **Native `select` / listbox styling** — incl. multi-select — `index.css` — `S`

## Gaps in existing components

- [ ] **Button `default` variant** — double border, Enter action — `Button.vue` — `S`
- [ ] **Titlebar real buttons** — min/max/restore/help/close, `aria-label`s, `inactive` gradient, disabled maximize (`Titlebar.vue:95-118` is placeholder-only) — `M`
- [ ] **`field-row` / `field-row-stacked`** spacing helpers — `S`
- [ ] **Global link styling** — `:link #0000ee`, `:visited #000080`, focus — `S`
- [ ] **Disabled / read-only field surface** — `field-border-disabled` equivalent — `S`

## Parked — do last

- [ ] **Focus system** — `* { outline: none }` (`index.css:51`) has no replacement; add `:focus-visible` dotted inset rect (Button, Checkbox, Radio, inputs, tabs) — trivial once the control set is settled, deliberately deferred — `S`

## IntGrid — build from scratch (exact integer grid)

- [ ] `src/helpers/intGrid.ts` → `useIntGrid(): { cell, width, height, cols, rows }`, all integer CSS px
- [ ] Snap **absolute edges**, not deltas (`width = snap(startW + dx)`); derive opposite edge so W/N resize stays anchored — `Window.vue:122-153`
- [ ] Snap the **outer border-box**, then `content = outer − border − scrollbar`; never snap content directly (9-patch slices 6/8/12px, `index.css:119-138`)
- [ ] One `ResizeObserver` as source of truth; guard round→write→observe loop; absorb local RO in `Titlebar.vue:60-63`
- [ ] Unify grids: `GRID = 2` (`CursorOverlay.vue:14`), `even()` 2px (`ScrollBar.vue:45`), half-px canvas (`Titlebar.vue:35-36`) — integer CSS px is the layout rule; document 0.5 as canvas-backing-store only
- [ ] Publish `--win55-cell` / `--win55-cols` for CSS-only children
- [ ] Keep content column integral inside scrolling `Box` — `useScrollContainer.ts:45-47` (`28px` + odd outer width)
- [ ] **Halo — root cause found, accepted as design (2026-11-16).** DirectWrite on this machine convolves every glyph with a symmetric 1 device-px filter at all sizes, all DPRs, **all fonts** (Arial and a 1-glyph svg2ttf square too). Ruled out: hinting (`ttfautohint`), `gasp` DOGRAY/GRIDFIT/none, every `head.flags`, `unitsPerEm` 1000–4096, `text-rendering` values, `-webkit-font-smoothing`, `--disable-direct-write`, `--disable-gpu`, `--disable-font-subpixel-positioning`, `--disable-lcd-text`, ClearType gamma 0→1200. Decision: ship the **LCD/colored** edge (matches other machines, reads as a CRT artifact); never gray
- [ ] **Rejected: global font smoothing off** — `SystemParametersInfo(SPI_SETFONTSMOOTHING, 0)` (not a registry write; the cached params don't refresh otherwise) does give true bilevel text — partial pixels 492/660/726/832 → **0/0/0/0**, Arial included. Rejected and reverted: it kills AA for every app on the machine. Per-font bilevel is not reachable from CSS/font data on this Chrome
- [ ] **Never promote the root to a composited layer** — `backface-visibility: hidden` / `translateZ(0)` / `will-change: transform` on `body` disables LCD text page-wide and turns the edge gray. `src/index.css` now carries a warning comment where the property used to be
- [ ] **Halo 2 is layout** — measured 389 text runs on `localhost:5173`: off-grid device X = 0 @dpr 1, 145 @1.25, 12 @1.5, 145 @1.75, 0 @2. Only matters at fractional dpr; independent of halo 1
- [ ] Cell must be `1/dpr` CSS px (one device pixel), not a flat `2px`; `2px` is only a device-grid unit when dpr is an integer
- [ ] `text-shadow: 2px 2px 0` (`typography.ts:83`) → 2.5px / 3.5px device offset at 1.25/1.75; quantize to `round(2*dpr)/dpr`
- [ ] Assert on **x only** — Chrome snaps glyph baselines vertically, so fractional `y` is invisible; fractional `x` is what fringes
- [ ] `clientX` and `getBoundingClientRect()` are fractional; snap layout values only
- [ ] `minWidth`/`minHeight` clamps remain grid-aligned
- [ ] Export types + helper from `src/index.ts`
- [ ] Verify: halo gone at 100% with an unhinted-vs-hinted A/B on the same glyph; no horizontal fringing at 125%/175% scaling; whole-pixel edges after resize/drag; no 9-patch corner seams; no fractional content width in a scrolling `Box`

## Preload wrapper

- [ ] `src/helpers/preload.ts` → `preloadWin55Assets({ scopes, files, concurrency, signal, onProgress, strict })`
- [ ] `useAssetPreload()` → `{ percent, loaded, total, current, done, errors }`
- [ ] DOM event `win55:assets-progress` — `detail = { loaded, total, percent, current, failed }`
- [ ] Scopes: `chrome` (default, ~30 files), `fonts` (48 / 6.5 MB), `cursors` (760 / 475 KB), `emoji` (725 / 414 KB — keep lazy)
- [ ] Count-based `percent` (monotonic); byte progress only from streamed `fetch` + `Content-Length`
- [ ] Dedupe by absolute URL; seed existing caches — `loadCursors` (`cursors.ts:52`), `loadSchemeIndex` (`:67`), `loadEmojiRegistry` (`emoji.ts:75`); invalidate in `resetEmojiRegistryCache` (`:112`)
- [ ] Images via `Image` + `.decode()`; fonts via `document.fonts.load()`
- [ ] Tolerate per-file failure → `failed[]`; opt-in `strict`; SSR no-op; `AbortSignal` for route changes
- [ ] `plugin.js`: emit `win-55-ui/assets.json` from `collectFiles()` (`:63`) + serve from dev middleware
- [ ] `plugin.js`: add `.gif`, `.json`, `.csv` to `MIME_TYPES` (`:10`) — dev serves them with no `Content-Type`
- [ ] Optional: `win55ui({ preload: 'chrome' })` injects `<link rel=preload>`
- [ ] Never default to "everything": 1,570 files / 7.4 MB total

## Suggested order

1. `Window` 2px snap (10-line IntGrid slice, immediate 9-patch win)
2. IntGrid
3. Preload core + asset manifest
4. Controls: ProgressBar, Slider, StatusBar, Tabs
5. TreeView, TableView, GroupBox, native `select`
6. Titlebar buttons, Button `default`, link styling, field surface, `field-row`
7. Parked: focus system
