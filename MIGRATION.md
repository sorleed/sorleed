# Migration from FinCore/Weft to Sorleed

This is a **breaking alpha rename**. Sorleed replaces the FinCore and Weft public
identities with no compatibility aliases. Update every import, selector,
custom-property reference, executable name and installation path.

Package and contract versions are unchanged by the rename:

- `@sorleed/react` — `0.1.0-alpha.1` (private alpha)
- `@sorleed/cli` — `0.1.0-alpha.0` (private alpha)
- Component contracts — `1.0.0`, component version `0.1.0`

---

## 1. Rename summary

| Area | Before | After |
|---|---|---|
| Product name | FinCore / Weft | **Sorleed** |
| CSS custom properties | `--fc-*` | `--sl-*` |
| CSS classes | `.fc-*` | `.sl-*` |
| React package | `@weft-ui/react` | `@sorleed/react` |
| CLI package | `@weft-ui/cli` | `@sorleed/cli` |
| CLI executable | `weft`, `fincore` | `sorleed` |
| CLI component path | `components/fincore/*` | `components/sorleed/*` |
| CLI style path | `styles/fincore/*` | `styles/sorleed/*` |
| CLI shared keys | `fincore-shared-types`, `fincore-tokens` | `sorleed-shared-types`, `sorleed-tokens` |
| Contract IDs | `fincore.*` / `weft.*` | `sorleed.*` |
| React generated DOM IDs | `fincore-<prefix>-…` | `sorleed-<prefix>-…` |

The old `weft` and `fincore` executables are removed. The old names are not
aliased, re-exported or accepted as fallbacks.

---

## 2. CSS migration

Replace every old custom property and class:

```css
/* Before */
background: var(--fc-button-primary-background);
color: var(--fc-button-primary-foreground);

/* After */
background: var(--sl-button-primary-background);
color: var(--sl-button-primary-foreground);
```

```html
<!-- Before -->
<button class="fc-button fc-button--secondary" type="button">Cancel</button>

<!-- After -->
<button class="sl-button sl-button--secondary" type="button">Cancel</button>
```

There is no automated compatibility layer. Search the consumer project for
`--fc-`, `.fc-` and `fc-` class strings and replace them with the equivalent
`--sl-`, `.sl-` and `sl-` names.

Load `tokens/dist/tokens.css` before the component stylesheets, as before.

---

## 3. React package migration

```tsx
// Before
import { Button, Input } from "@weft-ui/react";

// After
import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";
```

Style import paths:

```tsx
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
import "@sorleed/react/styles/input.css";
import "@sorleed/react/styles/password-input.css";
import "@sorleed/react/styles/phone-input.css";
```

`@sorleed/react` remains private and unpublished. The rename does not make it a
published package.

---

## 4. CLI migration

```sh
# Before
npx weft add button --dir /path/to/consumer
node cli/bin/fincore.mjs add input --dir /path/to/consumer

# After
npx sorleed add button --dir /path/to/consumer
node cli/bin/sorleed.mjs add input --dir /path/to/consumer
```

The CLI now writes:

- `components/sorleed/<component>/index.tsx`
- `components/sorleed/types/index.ts`
- `styles/sorleed/<component>.css`
- `styles/sorleed/tokens.css`

Existing consumer projects that contain `components/fincore/*` or
`styles/fincore/*` are not migrated automatically. Move or reinstall those files
under the new paths, then update imports.

The CLI supports all four components: `button`, `input`, `password-input` and
`phone-input`. It remains private alpha and unpublished.

---

## 5. Contracts and components

- Contract IDs now use `sorleed.<component>`.
- All four implemented components have contracts: Button, Input, PasswordInput
  and PhoneInput.
- PasswordInput and PhoneInput Figma references are unresolved and recorded as
  `canonical.figma: null`. No node ID was invented.
- The Figma file key for existing Button/Input evidence is unchanged.
- Existing verified Button/Input Figma node IDs are unchanged.

---

## 6. What did not change

- The MIT licence text and the existing copyright-holder line in `LICENSE`.
- The existing package versions and contract versions.
- The original FinCoreUI repository and its history. The Sorleed repository is a
  separate addition; see [`docs/repository.md`](docs/repository.md).
- Component behaviour and visual design, except for the rename and the
  documentation/contract corrections recorded in this phase.
- The framework-agnostic canonical CSS plus native HTML architecture.

---

## 7. Migration checklist

1. Replace `--fc-*` custom properties with `--sl-*`.
2. Replace `.fc-*` classes with `.sl-*`.
3. Replace `@weft-ui/react` with `@sorleed/react`.
4. Replace `@weft-ui/cli` with `@sorleed/cli`.
5. Replace `weft` / `fincore` commands with `sorleed`.
6. Move CLI-installed files from `components/fincore/*` and `styles/fincore/*`
   to `components/sorleed/*` and `styles/sorleed/*`.
7. Update contract references from the old IDs to `sorleed.*`.
8. Re-run the token, contract, parity and package checks.
9. Search for any remaining old-brand strings and remove them, except the
   unchanged `LICENSE` line.

---

## 8. Compatibility statement

There are **no compatibility aliases**. A consumer that keeps an old
`--fc-*` reference, `.fc-*` class, package name or executable will not receive
the renamed values or commands. This is intentional for the alpha clean break.

---

## 9. Repository transition

The original FinCoreUI repository is preserved. The Sorleed repository is the
new primary development home, currently private. Remote configuration, branch
roles and the deferred `main` reconciliation procedure are documented in
[`docs/repository.md`](docs/repository.md). Do not merge the unrelated `main`
history or change either LICENSE until legal ownership is confirmed.
