# Notice: third-party emoji artwork

The MIT license that covers the win-55-ui repository (see [LICENSE.md](../../../LICENSE.md)
at the repository root) does NOT extend to part of the image files in this
directory (`public/win-55-ui/emoji/*.gif`): the main registry range
(codes `000`-`BA1`) reproduces historical third-party artwork and is excluded
from the project's license, while the custom range (codes `C00` and up) is
original artwork by this project's contributors and IS covered by it. See
the two sections below for the split.

## Main registry (codes `000` - `BA1`)

The bulk of this directory (the codes listed from `000` through `BA1` in
`emoji-registry.csv`) reproduces bitmap emoji artwork originally created for
Japanese mobile carrier pictogram sets from the early 2000s, specifically the
NTT DoCoMo (i-mode) and KDDI (au) emoji sets. Copyright in that original
artwork belongs to NTT DoCoMo, Inc. and/or KDDI Corporation (or their
respective successors/assigns), not to this project. The codes themselves are
not arbitrary IDs assigned by this project - they are the Shift-JIS codes
under which the carriers originally addressed each glyph, reused here as both
the registry's Unicode-to-glyph mapping key and the GIF file name.

## Custom range (codes `C00` and up)

Codes in the `C00`-`FFF` range are later additions covering emoji that have
no equivalent in the historical DoCoMo/KDDI sets. Unlike the main registry,
the GIFs in this range are original artwork drawn by this project's
contributors, and ARE covered by the project's MIT license like the rest of
the codebase - the third-party-artwork exception in
[LICENSE.md](../../../LICENSE.md) does not apply to this range.

## What this means for downstream use

- Do not treat files in the `000`-`BA1` main registry range as covered by
  the project's MIT license. Files in the `C00`+ custom range are covered.
- If you redistribute or build on top of win-55-ui, either exclude the
  `000`-`BA1` range or independently verify the rights situation for the
  specific files you intend to use from it.
- The registry/metadata files (`emoji-registry.csv`, `emoji-categories.json`,
  `emoji-by-category.json`) that map each Unicode emoji to its original
  carrier Shift-JIS code are project-authored mapping data, covered by the
  project's MIT license like the rest of the codebase. That license covers
  the mapping data only, not the artwork it points at - the two have
  independent copyright status even though the Shift-JIS codes double as the
  GIF file names, so treat licensing for the image files themselves
  separately, per the sections above.
