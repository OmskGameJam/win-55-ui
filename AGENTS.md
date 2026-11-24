# AGENTS.md

## When in doubt, ask

If the task or target is ambiguous, stop and ask a clarifying question. Do not fire off random greps or leave the project boundaries to hunt for context. Asking is cheaper than guessing wrong.

## Comments

- Timeless: never narrate what the code used to do. Describe what it does.
- Describe the file you are in. Do not cross-reference other files unless the reference is load-bearing.
- Terse, max 120 characters per comment line. Docblocks are comments too.
- A docblock must earn its keep: keep edge cases, defaults, and contracts; delete anything the signature already says.
- Assume a competent reader who can read the code.

## Layout: the 2px grid

The kit lays out on a 2 CSS px grid. `CELL = 2` in `src/helpers/intGrid.ts`.

- Every emitted edge — `left`, `top`, `width`, `height` — is an integer multiple of 2.
- Snap **boundaries**, not sizes: accumulate positions, snap each boundary once, derive the size as `nextBoundary - thisBoundary`. Summing snapped sizes drifts; rounding sizes directly breaks tiling.
- Coordinated pairs come from the same boundary pair, so a run of tracks sums to exactly the box it was fitted into — no seam, no overlap, no remainder.
- Snap the **outer border-box** and derive content from it. `* { box-sizing: border-box }` (`index.css:56`), so `width`/`height` models are border-box everywhere.
- Declared item sizes snap **up** (never clip); a container that isn't on the grid snaps **down**, leaving at most 1px dead space on the right/bottom.
- `getBoundingClientRect()` and `clientX/clientY` are fractional — snap the layout value, never feed a raw pointer delta into geometry.
- On resize, snap the moving edge and derive the opposite one, so W/N drags stay anchored on the fixed edge.

### Why it already holds

- Bitmap fonts are on-grid: at the used sizes every glyph advance is an even integer (`Standard-Regular-12`: unitsPerEm 1200, rendered at 24px; 95/95 ASCII glyphs verified). `typography.ts` sets `fontSize`/`lineHeight = size * 2`, so every text line is even too. Text needs no per-run rounding — do not add any.
- The whole `src/` tree contains 7 odd `px` literals and all are invisible: the 1×1 scroll spacer (`Box.vue`), a `5px` demo gap (`App.vue`), and the `15px` emoji *asset* size, which renders at 30px. Keep it that way.

### What breaks it

- `%`, `fr`, `transform: translate(-50%)`, `zoom` on a grid-relevant axis. Use fixed grid-safe insets instead — see the comment at `index.css:230`.
- Promoting the root to a composited layer (`backface-visibility`, `translateZ(0)`, `will-change`) — kills LCD text page-wide (`index.css:115`).
- Treating `cell = 1/dpr` as the layout rule. 9-patch slices are 6px and 12px, both multiples of 2; at 125% a 6px slice is 7.5 device px no matter what. **Integer CSS px is the guarantee**; device-pixel exactness would need per-DPR assets.

## IntGrid

`src/components/IntGrid.vue` + `src/helpers/intGrid.ts`. Modes: `fill`, `columns`, `masonry` (vertical/horizontal), `areas`. Debug page: **Layout & forms → IntGrid** in `App.vue`.

- It positions its **direct element children** absolutely; there is no cell wrapper. It owns their `position`/`left`/`top`/`width`/`height`, so a child must not rely on its own positioning.
- Absolutely positioned children contribute no intrinsic size: an IntGrid inside a `fit-content`/`max-content` parent collapses to the width of its in-flow siblings. Give it an explicit width.
- Modes that fit columns assume unbounded height and grow downward; `areas` is the only mode that reads both axes. `fixed-height` keeps the element's own box height instead of sizing to content.
- Coordinates are published **on the element**, so any child (component or plain element) can style itself:
  - `data-win55-row` / `data-win55-col` — reading order: 1 is the top row / left column, whatever the flow
  - `data-win55-flow-row` / `data-win55-flow-col` — fill order: with `btt` the bottom row is 1, with `rtl` the right column is 1
  - totals on the grid root: `data-win55-rows` / `data-win55-cols`, plus inheriting `--win55-rows` / `--win55-cols`
- `content:` cannot print a bare number, so branch and label with `attr(data-win55-row)`; the custom properties are for `calc()`.

