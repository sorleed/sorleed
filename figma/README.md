# Sorleed Figma delivery

This directory contains the local preparation for a Sorleed Figma library. It is
**not** a published Figma Community Library and it does **not** claim a
Figma-to-code pipeline.

## What is prepared

| Path | Contents |
|---|---|
| `tokens/sorleed.tokens.json` | The token source in DTCG format, ready for a tokens plugin import. |
| `component-specs.json` | Component names, variants, states, anatomy, geometry and token references. |
| `assets/*.svg` | Original visual evidence for Button, Input, PasswordInput and PhoneInput. |

The specifications mirror the code contracts:

- `components/button/contract.json`
- `components/input/contract.json`
- `components/password-input/contract.json`
- `components/phone-input/contract.json`

## Component names

Use the same names as the code:

- `Button` with `Variant = Primary | Secondary | Ghost`
- `Input` with `State = Default | Error | Disabled`
- `PasswordInput` with `State = Default | Error | Disabled` and `Visible = false | true`
- `PhoneInput` with `State = Default | Error | Disabled`

Focus is an additive ring. Do not create a `State=Focus` variant.

## Token import

1. Open Figma.
2. Install a DTCG-compatible token plugin (for example Tokens Studio).
3. Import `figma/tokens/sorleed.tokens.json`.
4. Export the token set as Figma variables.
5. Bind component fills, strokes, radius, spacing and typography to those
   variables.

The token file uses `$type` and `$value` with `{group.token}` aliases. Keep the
alias chain; do not flatten primitives into component tokens.

## Build the components

1. Create a page named `Foundations` for colour, type, spacing, radius and
   elevation samples.
2. Create a page named `Components`.
3. Build each component as a component set with the variants and states in
   `component-specs.json`.
4. Use auto layout for the row and control anatomy.
5. Add a focus ring as a separate stroke layer, not as a state variant.
6. Use the SVG files in `assets/` only as visual references; the token bindings
   and auto layout are the deliverable.

## Export and reference

When the library is published or exported:

1. Record the Figma file URL or library URL.
2. Record verified node IDs for each component set.
3. Add those references to the contracts, replacing `null` only with verified
   values.
4. Do not invent node IDs or variant IDs.

## Licensing

- The SVGs in `assets/` are original Sorleed assets created for this repository.
- No font file is bundled. The SVGs use a system font stack.
- No third-party icon set is included.
- If you add a font or icon set to the Figma library, record its licence in
  `THIRD_PARTY_NOTICES.md` and confirm the licence permits the intended use.

## External action still required

Creating or publishing the Figma library requires a Figma account with
permission to create a library. That action cannot be performed from this
repository. Everything else that can be prepared locally is in this directory.
