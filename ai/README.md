# Sorleed AI Context Layer

This directory contains the implemented AI context files for Sorleed. They are
written for AI coding assistants, design tooling and humans who need a compact,
accurate description of what exists.

Sorleed is **UI Infrastructure. A source-first UI toolkit for designers and
developers.** It is not a hosted service and it does not require a runtime
dependency for the core components.

## Files

| File | Purpose |
|---|---|
| [`product-overview.md`](product-overview.md) | Identity, product areas and current status. |
| [`installation.md`](installation.md) | React package, CLI and CSS setup. |
| [`components.md`](components.md) | The four implemented components and their APIs. |
| [`tokens.md`](tokens.md) | Token architecture, naming and customisation. |
| [`accessibility.md`](accessibility.md) | Required semantics and interaction rules. |
| [`customisation.md`](customisation.md) | Source-first customisation and theming. |
| [`instructions.md`](instructions.md) | Rules AI tools must follow. |
| [`prompts.md`](prompts.md) | Reusable prompts for common tasks. |
| [`agent.md`](agent.md) | Compact agent briefing. |

## Authority

The canonical sources of truth remain:

1. `components/*/contract.json` for component behaviour and tokens.
2. `components/*/*.css` and `components/*/*.html` for canonical markup and styles.
3. `react/**` for the implemented React adapters.
4. `tokens/tokens.json` and `tokens/dist/tokens.css` for tokens.
5. `cli/**` for the source-distribution CLI.

If an AI context file disagrees with those sources, the sources win and the
context file should be corrected.

## What is not implemented

Do not describe the following as available:

- Dark mode or any inverse theme.
- Additional components beyond Button, Input, PasswordInput and PhoneInput.
- A searchable country picker.
- Figma-to-code synchronisation or a Figma Community Library.
- A hosted documentation service, analytics or SaaS dashboard.
- Published npm packages. The packages are private alpha and unpublished.
- Claims that a phone number is active, reachable or owned.
