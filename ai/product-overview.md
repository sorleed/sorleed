# Sorleed Product Overview

## Identity

**Sorleed — UI Infrastructure. A source-first UI toolkit for designers and
developers.**

Sorleed ships the source, not a locked runtime. Consumers can copy canonical
component source, keep their own CSS, and customise without a build step for the
core HTML/CSS implementation.

## Product areas

| Area | What exists now |
|---|---|
| **Sorleed UI** | Four components: Button, Input, PasswordInput, PhoneInput. |
| **Sorleed Tokens** | 229 `--sl-*` custom properties generated from `tokens/tokens.json`. |
| **Sorleed Figma** | Delivery preparation: token import, component specifications and SVG evidence. No Figma Community Library. |
| **Sorleed CLI** | `@sorleed/cli` copies canonical component source, types and CSS into a consumer project. |
| **Sorleed AI** | This context layer. |
| **Sorleed Website** | Static documentation site under `website/`. |

## Current status

- Private alpha.
- Four canonical components and four React adapters.
- Light theme only.
- `@sorleed/react` and `@sorleed/cli` are private and unpublished.
- No public release, no npm publication and no Figma Community Library.
- MIT licensed. Copyright (c) 2026 Sorleed.

## Design principles

1. **Source first.** The consumer owns the copied source.
2. **Contract first.** Behaviour, states and token dependencies are recorded
   before implementation.
3. **Accessible by default.** Native elements, visible focus, programmatic
   labels and error associations.
4. **No invented states.** A component exposes only the states its contract
   defines.
5. **Honest limits.** Unimplemented areas are documented, not simulated.

## Related

- [`../PRODUCT.md`](../PRODUCT.md)
- [`../README.md`](../README.md)
- [`../ROADMAP.md`](../ROADMAP.md)
