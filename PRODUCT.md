# Sorleed Product Areas

Sorleed is a new, source-first UI infrastructure project for designers and
developers building financial products. It is currently in **private alpha**.

Sorleed is organised into six product areas. Each area has a different job, and
none is presented as more mature than it is. This document explains what each
area covers, how they relate, the workflows they support and their current
status.

## Purpose

Financial products repeatedly rebuild the same interfaces: authentication,
wallets, transfers, payments, KYC verification, transaction histories and
account management. Sorleed provides a shared, source-owned foundation so that
design and implementation can use the same tokens, contracts and component
source instead of diverging.

Sorleed is not a compiled component library that hides its source. The canonical
component layer is framework-agnostic CSS plus native HTML, with machine-readable
contracts. React and CLI are optional adapters over that source.

## Status vocabulary

| Status | Meaning |
|---|---|
| **Implemented** | Canonical CSS, native HTML reference and a validated contract exist. |
| **Private alpha** | Working code exists in this repository but is not published and may change without notice. |
| **Planned** | Recorded in the roadmap; no implementation or contract exists. |
| **Deferred** | Explicitly outside the current release; no date or implementation commitment. |

## The six areas

### Sorleed UI

Reusable interface components and implementation patterns for product designers
and developers.

- **Status:** Implemented canonical layer; private-alpha React adapter.
- **Available today:** Button, Input, PasswordInput and PhoneInput as
  framework-agnostic CSS with native HTML reference markup and machine-readable
  contracts.
- **Not included:** The remaining planned components (Badge, Avatar, Checkbox,
  Radio, Switch, Modal, Tabs, Tooltip, Toast) and the planned fintech
  components. Verified cross-browser and assistive-technology support is not
  claimed.

### Sorleed Tokens

Design foundations, token architecture, semantic roles, component tokens and
generated CSS.

- **Status:** Implemented.
- **Available today:** 229 `--sl-*` tokens across primitive, semantic and
  component layers, a token source, generated CSS, a validator and contrast
  checks. Component contracts declare the tokens they consume.
- **Not included:** The remaining foundation guides (Typography, Spacing,
  Radius, Sizing, Border, Elevation and Motion) are deferred. Color System,
  Design Principles and Token Architecture are available.

### Sorleed Figma

The intended design-library experience and the relationship between Figma
assets and implementation.

- **Status:** Deferred. There is no Figma library, export or working
  design-to-code pipeline in this release.
- **Recorded evidence only:** Button and Input contracts contain verified Figma
  file, page, node and variant evidence from earlier design work. That evidence
  documents past verification; it does not make a Figma library available.
- **Not included:** No Figma Community Library, published Figma file or export
  is included. PasswordInput and PhoneInput have no verified Figma reference;
  their contracts record `canonical.figma: null` and do not invent a node ID.

### Sorleed CLI

Command-line tooling for discovering and distributing component source code.

- **Status:** Private alpha, unpublished.
- **Available today:** `@sorleed/cli` `0.1.0-alpha.0` copies canonical component
  source and styles for all four implemented components into a consumer project.
- **Not included:** It is not published to npm. It does not install compiled
  packages or provide a runtime.

### Sorleed AI

AI context, instructions and supporting resources for AI-assisted
implementation.

- **Status:** Deferred.
- **Available today:** Nothing is implemented as an AI capability. The `ai/`
  directory contains only a README stating that the AI Context Layer is
  deferred.
- **Not included:** No `agent.md`, design-principles context, coding guidelines
  or prompt set exists. Do not describe an AI Context Layer as available.

### Sorleed Website

The documentation and onboarding experience for learning and using Sorleed.

- **Status:** Deferred.
- **Available today:** Documentation lives in the repository as Markdown:
  component catalogue, contract-first usage guide, implementation guide, token
  guide, foundation documents and examples.
- **Not included:** No documentation website is built or deployed.

## How the areas relate

Only the token and component layers are currently connected. Figma, AI and the
website are intended future surfaces and are not part of the working pipeline.

```text
CURRENT — PRIVATE ALPHA

  Sorleed Tokens ──► Sorleed UI ──► Native HTML/CSS
   (implemented)     (canonical)     (implemented)
        │                │
        │                ├──► React adapter (private alpha)
        │                └──► Sorleed CLI (private alpha)
        │
        └──► component contracts (implemented)


INTENDED — NOT IMPLEMENTED

  Sorleed Figma  ─ ─ ─ ─► design evidence ─ ─ ─ ─► contracts and tokens
   (deferred)             (historical only)

  Sorleed AI     ─ ─ ─ ─► consumes contracts and documentation
   (deferred)

  Sorleed Website ─ ─ ─ ─► publishes documentation and onboarding
   (deferred)
```

- **Tokens are the foundation.** Component CSS consumes `--sl-*` tokens rather
  than hard-coded values.
- **Contracts bind tokens and implementation.** Each component contract records
  anatomy, properties, variants, states, token dependencies, accessibility
  expectations, invalid configurations and tests.
- **Sorleed UI is the canonical implementation.** It is the source that adapters
  and tooling follow.
- **Figma is an intended design source, not a current distribution format.**
  Where historical evidence exists, it informs the contract; where it does not,
  the contract records the gap. No Figma library is currently available.
- **CLI distributes source.** It copies the canonical files; it does not create a
  separate implementation.
- **AI and Website are future surfaces.** They would consume the same contracts
  and documentation; neither is implemented.

## Workflows

### Designer workflow

1. Define the interface intent and states.
2. Map colour, spacing, typography and geometry to semantic and component token
   roles.
3. Review the component contract for anatomy, variants, states and
   accessibility expectations.
4. Treat Figma as an intended design source. Do not invent a Figma node or
   variant reference, and do not assume a Figma library exists.

Today, Figma is deferred, so tokens, contracts and canonical CSS are the
authoritative references.

### Developer workflow

1. Choose a component from the catalogue.
2. Load `tokens/dist/tokens.css` before the component stylesheet.
3. Use the documented native HTML structure and `.sl-*` classes.
4. Optionally use the private-alpha React adapter or CLI for a source
   distribution workflow.
5. Run the token, contract, parity and package checks relevant to the change.

No package manager or build step is required to consume the canonical CSS
directly.

### AI-assisted workflow

This workflow is **deferred**. When an AI context layer exists, it should derive
from the same contracts and documentation rather than inventing component APIs.
Until then, AI-assisted work should use the component catalogue, usage guide,
implementation guide and contracts directly.

## Current status summary

| Area | Status | Available today |
|---|---|---|
| Sorleed UI | Implemented canonical layer; React private alpha | Four components as CSS + native HTML + contracts |
| Sorleed Tokens | Implemented | 229 `--sl-*` tokens, generated CSS, validation |
| Sorleed Figma | Deferred | Historical Button/Input evidence only; no library or export |
| Sorleed CLI | Private alpha | Source-distribution CLI, unpublished |
| Sorleed AI | Deferred | No AI context files |
| Sorleed Website | Deferred | Repository Markdown only |

## Source-first model

Sorleed keeps the source visible and owned by the consuming team:

- **Design assets** describe intent.
- **Tokens** encode foundations and semantic roles.
- **Contracts** record the component API, states, token dependencies and
  accessibility expectations.
- **Canonical CSS and native HTML** are the implementation source.
- **Adapters and tools** derive from the canonical source rather than replacing
  it.
- **Documentation** explains the same source, not a separate product.

This is why Sorleed can be consumed without a package manager or build step, and
why the React adapter and CLI are optional rather than required.

## Related documents

- [`README.md`](README.md) — project overview and status.
- [`components/CATALOG.md`](components/CATALOG.md) — implemented components.
- [`components/USAGE-GUIDE.md`](components/USAGE-GUIDE.md) — contract-first usage.
- [`components/IMPLEMENTATION.md`](components/IMPLEMENTATION.md) — architecture.
- [`tokens/README.md`](tokens/README.md) — token consumption.
- [`docs/foundation/principles.md`](docs/foundation/principles.md) — principles.
- [`docs/release-readiness.md`](docs/release-readiness.md) — release status.
