# The foundry split: separating resource generation from the consumer

Status: **planned, deliberately unscheduled** — revisit around the **1.0 release** (measured at 0.7.2, 2026-11-22).
Scope: `src-font/`, `src-cursors/`, `scripts/`, `paths.config.json` and the artifacts they produce. The separately versioned `src/fun/` demo is already out (see `scripts/fun.js`) and is **not** part of this.

The goal is one thing only: the consumer repo should contain the *product* and the *artifacts it consumes*, and nothing that produces them. Everything in here is a decision aid for when we get to it — no step below is approved for execution yet.

---

## 0. Measured baseline

107 MB tracked in 2107 files. The split is not about tidiness; the volume is entirely on one side.

| Layer | Content | Files | Size |
|---|---|---:|---:|
| **Consumer** | `src/` | 70 | 0.3 MB |
| **Artifacts** | `public/` (of which `public/win-55-ui/font/` is 6.4 MB), `generatedFonts.ts`, `generated-fonts.css` | 1580 | 7.2 MB |
| **Foundry** | `src-font/` | 133 | **98.4 MB** |
| | `src-cursors/` | 195 | 0.4 MB |
| | `scripts/` | 54 | 0.4 MB |
| | `paths.config.json`, `win-55-ui.gpl`, `win-55-cursors.gpl` | 3 | <0.1 MB |

Rules of thumb to keep in mind when reading the rest: **92 % of the repo is foundry, 0.4 % of it by code.** Clone pack today: 63.15 MiB.

### 0.1 `src-font/` is not one concern either

| Group | Files | Size | Nature |
|---|---:|---:|---|
| Vendor vectors — `noto_sans_jp/*.ttf` (8 CJK weights), `liberation_sans/*.ttf` | 13 | ≈47 MB | immutable inputs, read only by `strike` |
| Primary art — `*.bdf` + `fonts.json` | 61 | 44.5 MB | hand-edited masters (`charedit`); BDF is the QA artifact, not scratch — see `FONTS.md` |
| Derived intermediates — `Standard-*[.TofuMaker].ttf` | 48 | 6.4 MB | **pure `build` + `push-fonts` output, committed twice** |

The 48 derived TTFs were verified by SHA-1 against `public/win-55-ui/font/` on 2026-11-22: **48/48 byte-identical, 0 differing**, and the 13 (sources) have no public twin. They are regenerable from the BDF masters with `npm run font -- build-all && push-fonts`, and `build` needs no DirectWrite (only `strike` does), so a fresh clone can always recreate them if the artifacts are ever dropped.

Consequence: a clean `src-font/` is *sources + art only* — 47 MB of vendor vectors that `strike` consumes, plus 44.5 MB of primary art. Neither is needed to build, dev, lint, install or ship the kit.

### 0.2 Two warts found while measuring (independent of this decision)

- **Untracked-worthy:** `scripts/cursors/dist/.tsbuildinfo` is tracked. `.gitignore:17` names only `scripts/font/dist/`; the cursors build output survives only because `.gitignore` line 4 ignores `*.js` globally. Every `npm run cursors:build` rewrites a file in git.
- **The `.gitignore` negation zoo** (`*.js`, `!scripts/*.js`, `!scripts/*.d.ts`, `!scripts/`) exists solely because `scripts/` holds plain JS in a repo that ignores `*.js`. It disappears on its own if `scripts/` leaves.

---

## 1. The seam

Foundry → consumer is the only direction of dependency that exists in code today. Nothing in `src/` reads `src-font/`, `fonts.json` or `src-cursors/`, and no consumer module imports a generator module. The crossings are three, and they are the entire contract:

| # | Crossing | Producer | Consumer side |
|---|---|---|---|
| 1 | `src/helpers/generatedFonts.ts` (`SUPPORTED_FACES`) | `scripts/font/src/register.ts` | `typography.ts`, `StrikeTester.vue` import it |
| 2 | `src/generated-fonts.css` (`@font-face`) | `scripts/font/src/register.ts` | `index.css` `@import './generated-fonts.css'` |
| 3 | `/win-55-ui/{font,cursors,emoji,x-emoji}/*` | `font` `push-fonts` · `cursors` `sprite` · `emoji-cli` | runtime URLs under `publicUrlPrefix` |

That is a two-file + static-URL-space interface. It is worth writing down precisely because it is *already* the interface: the split only makes it enforced instead of incidental.

Not crossings (foundry-internal, move as-is): `paths.config.json`, `src-font/fonts.json`, `src-cursors/{manifest,scheme}.json`.

---

## 2. Candidate shapes

**A. Foundry as a nested checkout — same mechanism as `src/fun/`, dependency inverted.** Recommended.

```
win-55-ui/            consumer; .gitignore has /foundry/
  foundry/            own repo: scripts/, src-font/, src-cursors/, own package.json + tsconfig + tests
  public/...          artifacts, committed
  src/...             consumer, committed
```

`paths.config.json` gains the one thing it is missing: an explicit `consumerRoot` — today `paths.ts` derives the repo root from the compiled file's own depth (`dist → font → scripts → …`), which only works while the generators sit exactly there. The generators then write `consumerRoot/public/…` and `consumerRoot/src/helpers/generatedFonts.ts`; the artifacts get committed here. Consumer clone: 107 → ≈8 MB, and `node_modules` sheds `koffi`, `svg2ttf`, `gifenc`, `opentype.js`, `emojibase-data`. `font:test` moves with its masters, so nothing dangles.

**B. Foundry owns the consumer** — identical, with the nesting reversed and a `--target ../win-55-ui` flag instead of a config key. More explicit, less discoverable, no real advantage.

**C. Artifacts as a published package (`@win55ui/assets`)** — rejected for now. The contract is a *file layout* plus two generated modules, not a stable API: `fonts.json` is still moving, and the consumer must materialize `public/` at dev/build time anyway, so every bump becomes publish → bump → re-vendor. Reconsider only if a second consumer ever appears.

## 3. Why not immediately

Two couplings, both cheap today and expensive once separated:

- `charedit` → `facePipeline` cascades write into `src-font/` **and** `public/` **and** `src/helpers/` in one action (`FONTS.md` describes the cascade in detail). Across two repos that is two commits plus a push/pull for every art fix.
- `font:test` rasterizes live from `src-font/liberation_sans/` instead of frozen fixtures, so a schema or rasterizer change touches masters and tests in the same breath.

Both are fine once `fonts.json` and the pipeline have stopped moving — hence "at 1.0", not "now".

---

## 4. Plan (in order, each step shippable on its own)

- [ ] **Step 0 — cleanup, no decision needed.** `git rm --cached` the 48 derived TTFs and ignore `src-font/*.ttf` while keeping `src-font/{liberation_sans,noto_sans_jp}/*.ttf` as inputs (−6.4 MB, and "src-font is inputs only" becomes true). Untrack `scripts/cursors/dist/.tsbuildinfo`; ignore `scripts/{font,cursors}/dist/` consistently.
- [ ] **Step 1 — draw the boundary in-repo.** `git mv` `scripts/`, `src-font/`, `src-cursors/`, `paths.config.json` (and the two `.gpl` palettes) under `foundry/`; give it its own `package.json`, `tsconfig`, and CI entry point. Enforce the direction: `tsconfig.app.json`/eslint must fail if `src/**` imports from `foundry/**`, and `foundry/**` must not import `src/**`. Only the three crossings of §1 may cross.
- [ ] **Step 2 — split out.** `git subtree split --prefix=foundry` → new repo, add `/foundry/` to `.gitignore` here, ship `paths.config.json`'s `consumerRoot`, and bootstrap it like `scripts/fun.js` does (`npm run foundry:pull` / `foundry:pop` as a *symmetrical* pair — the fun CLI's `init`/`pop`/`pull` logic can be lifted, but the direction differs: the foundry writes into the consumer, the consumer never writes into the foundry).
- [ ] **Step 3 — docs.** `FONTS.md` is 100 % foundry documentation and moves with it; `CLAUDE.md`/`CODEX.md` carry the most `scripts/` paths and need the update; `README.md`'s «Разработка» commands and its `npm run emoji …` example move to the foundry's own README; the `paths.config.json` schema change (new `consumerRoot` key) gets a note in both repos. `AGENTS.md`, `CHECKLIST.md` and `README.md` itself contain no `scripts/`/`src-font/` references today.

## 5. Open questions to settle at 1.0

- Does 1.0 freeze `fonts.json` and the pipeline entry points? If not, stay at Step 1.
- Who owns the 47 MB of vendor vectors — plain blobs (as today) or LFS? They are immutable and only `strike` reads them; LFS would cut 47 MB off every clone but adds a client requirement to the foundry only.
- `release.js` is packaging (`build:lib` + commit `dist/`), not generation → stays consumer-side, probably as the only thing left in `scripts/`.
- `fun.js` is demo plumbing → consumer-side, or moves next to `src/fun/` if the fun repo grows its own CLI.
- `win-55-ui.gpl` / `win-55-cursors.gpl` are referenced by no code (art palettes) → foundry or docs, not consumer.
- Does the consumer still want *any* generator locally (e.g. `emoji-cli.js` touches only `public/win-55-ui/emoji` and has no Windows-only dependency)? Possible exception worth an explicit yes/no rather than an accident of grouping.

## 6. Hazards

- `git clean -xdff` in the consumer deletes `/foundry/` along with any unpushed commits there — same failure mode as `src/fun/`, so the foundry bootstrap needs the same dirty/unpushed guards `scripts/fun.js` already implements.
- Two commits per art change is the intended cost, not a regression to engineer around. Do not "fix" it with a submodule or a vendored copy.
- `public/win-55-ui/font/*.ttf` must stay committed: the demo and the package cannot regenerate them without Windows + `strike`, and `files` in `package.json` ships `public/win-55-ui`.
