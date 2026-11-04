# Figma delivery

The local preparation is in [`../../figma/`](../../figma/README.md).

## Prepared locally

- `figma/tokens/sorleed.tokens.json` — DTCG token source for a tokens plugin.
- `figma/component-specs.json` — component names, variants, states, anatomy,
  geometry and token references.
- `figma/assets/*.svg` — original visual references for Button, Input,
  PasswordInput and PhoneInput.

## Not prepared

- No `.fig` file is included.
- No Figma Community Library is published.
- No Figma node IDs are invented. Contracts keep `canonical.figma` as `null`
  until a verified reference exists.

## External action required

1. Open Figma with an account that can create a library.
2. Import the token file with a DTCG-compatible plugin.
3. Create the component sets from `component-specs.json` and the SVG references.
4. Publish or export the library.
5. Record verified file and node references, then update the contracts.

Until step 5, the CSS and native HTML remain authoritative.
