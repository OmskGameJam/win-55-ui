# win-55-ui — parity & feature checklist

Reference: 98.css component set. Baseline `ccb051e` (0.7.2), 2026-11-16.
Effort: `S` ≤ half day, `M` ~1 day, `L` multi-day.

## Missing controls

- [x] **Slider** — `input[type=range]`; default + box indicator; vertical variant — `src/components/Slider.vue` — `S–M`
- [x] **ProgressBar** — solid + segmented — `ProgressBar.vue` — `S`
- [ ] **Tabs** — `role=tablist`/`tab`, multirow; 
- [ ] **TreeView** — disclosure triangles, dotted indent guides, keyboard nav — `TreeView.vue` — `M`
- [x] **Native `select` / listbox styling** — incl. multi-select — `index.css` — `S`
- [ ] **TableView** — sunken panel, header, interactive/highlighted rows — `TableView.vue` — `M`. Dubious?
- [ ] **StatusBar** — fields, sunken 1px field border, resize grip — `StatusBar.vue` — `S`. Dubious?

Entries marked "Dubious?" denote components that would rather be authored or implemented in a separate extended kit.

## Parked — do last

- [ ] **Focus system** — `* { outline: none }` (`index.css:51`) has no replacement; add `:focus-visible` dotted inset rect (Button, Checkbox, Radio, inputs, tabs) — trivial once the control set is settled, deliberately deferred — `S`

## Deferred ideas

- [ ] **MagicSlider** — slider with programmatic thumbs and ranges; displays current values of all provided thumbs and range highlights; messages back drag deltas

## Slider polish

- [ ] Visible focus treatment for slider handles — depends on the parked focus system — `S`
- [ ] Per-handle accessible names for range sliders (`label` / `aria-label`) — `S`
