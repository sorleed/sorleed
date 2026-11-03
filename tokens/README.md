# Tokens

`tokens/dist/tokens.css` is the generated CSS that applications consume. It
defines 229 `--sl-*` custom properties across primitive, semantic and component
layers. All component stylesheets use the `--sl-*` prefix.

## Consuming the generated CSS

1. Serve or copy `tokens/dist/tokens.css`.
2. Load it **before** the component stylesheets:

   ```html
   <link rel="stylesheet" href="tokens/dist/tokens.css">
   <link rel="stylesheet" href="components/button/button.css">
   <link rel="stylesheet" href="components/input/input.css">
   <link rel="stylesheet" href="components/password-input/password-input.css">
   <link rel="stylesheet" href="components/phone-input/phone-input.css">
   ```

3. Do not edit `tokens/dist/tokens.css` by hand.

The component stylesheets do **not** import token CSS automatically. Loading a
component stylesheet without `tokens/dist/tokens.css` leaves its component
variables undefined.

Consuming the existing generated CSS requires **no build command and no package
manager**. Node is only needed when maintaining the token source or regenerating
the CSS.

## Source and maintenance

- `tokens/tokens.json` is the token source of truth.
- `tokens/check.mjs` is the zero-dependency validator and generator.
- `node tokens/check.mjs` validates the source, contrast pairs and generated CSS.
- `node tokens/check.mjs --write` regenerates `tokens/dist/tokens.css` after an
  intentional token-source change. Consumers should not need this command.

Component token families:

| Component | Component tokens |
|---|---|
| Button | 22 `--sl-button-*` |
| Input | 28 `--sl-input-*` |
| PasswordInput | Composes 27 `--sl-input-*`, 5 `--sl-button-*` and 4 primitives |
| PhoneInput | 31 `--sl-phone-input-*` |

PasswordInput's four primitives are `font.size.xs`, `font.line-height.xs`,
`space.12` and `space.4`. This is a documented draft limitation; there is no
`password-input.*` token family.

Application layout should use the documented semantic or primitive variables as
needed. Light theme is the only implemented theme. Do not redefine generated
variables in application CSS; make theme changes at the token source and
revalidate contrast.

## Related

- [Component quickstart](../components/README.md)
- [Component catalogue](../components/CATALOG.md)
- [Implementation guide](../components/IMPLEMENTATION.md)
- [Runnable transaction-history example](../examples/transaction-history/README.md)
- [React private alpha](../react/README.md)
- [CLI private alpha](../cli/README.md)
