# Token Conventions

## Source of truth

- `tokens/tokens.json` — primitive, semantic and component token source.
- `tokens/dist/tokens.css` — generated CSS, consumed by applications.
- `tokens/check.mjs` — zero-dependency validator and generator.

Regenerate after an intentional source change:

```bash
node tokens/check.mjs --write
```

Never edit `tokens/dist/tokens.css` by hand.

## Scale

229 `--sl-*` custom properties. Light theme only.

## Layers

1. **Primitive palette** — raw palette values such as `neutral`, `blue`,
   `green`, `amber`, `red`, `purple`, `orange`, plus `white` and `black`.
2. **Semantic roles** — names such as `color.surface.default`,
   `color.content.primary`, `color.border.control` and
   `color.feedback.error-foreground`.
3. **Component tokens** — `button.*`, `input.*` and `phone-input.*`. Component
   CSS consumes only these.

Aliases flow downward: component → semantic → primitive. Component styles must
not consume raw palette values.

## Naming

- Groups are dot-separated: `color.surface.default`.
- State or role suffixes are hyphenated: `color.border.control-hover`,
  `input.background-disabled`.
- CSS variables use the `--sl-` prefix and hyphens:
  `--sl-input-background-disabled`.

## Component families

| Family | Count |
|---|---|
| `--sl-button-*` | 22 |
| `--sl-input-*` | 28 |
| `--sl-phone-input-*` | 31 |

PasswordInput composes `input.*` and `button.*` tokens; there is no separate
`password-input.*` family.

## Customisation

Consumers can remap semantic roles at the token layer. They must not invent new
component token names in application CSS.

```css
:root {
  --sl-color-brand-600: #0f766e;
  --sl-color-border-focus: #0f766e;
}
```

Keep the alias chain intact and re-run contrast validation after any change.

## Rules

- Do not hardcode a value when a token exists.
- Do not consume primitive or semantic tokens from component CSS.
- Do not add `success`, `warning`, `info` or `loading` component tokens that the
  contract does not define.
- Do not simulate dark mode by inverting values.
