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

- **Status:** Local preparation complete; no published library.
- **Available today:** `figma/tokens/sorleed.tokens.json` (DTCG import),
  `figma/component-specs.json` (variants, states, anatomy and token bindings),
  and original SVG evidence under `figma/assets/`.
- **Not included:** No Figma Community Library, published Figma file, `.fig`
  export or working design-to-code pipeline. Creating the library requires a
  Figma account with library permission. Button and Input retain recorded
  historical evidence; PasswordInput and PhoneInput keep `canonical.figma: null`
  and no node ID is invented.

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

- **Status:** Implemented as a context layer.
- **Available today:** Product overview, installation, component API, token
  conventions, accessibility rules, customisation guidance, AI tool
  instructions, reusable prompts and an agent briefing under `ai/`.
- **Not included:** No hosted AI service, retrieval index, chatbot, telemetry or
  external API. The context files are versioned Markdown derived from the
  contracts and implementation.

### Sorleed Website

The documentation and onboarding experience for learning and using Sorleed.

- **Status:** Implemented as a static site; not deployed by this work.
- **Available today:** `website/` contains overview, getting started, component,
  token, CLI, customisation, accessibility, AI and limitations pages. It uses the
  real token and component stylesheets and has no build step or tracking.
- **Not included:** No production URL is claimed. Deployment instructions are in
  `website/README.md` and `docs/release/website-deployment.md`.

## How the areas relate

Tokens, components, contracts, source distribution and documentation are
connected. Figma preparation consumes the same tokens and contract values but is
not a live design-to-code pipeline. The AI layer and website consume the
contracts and documentation; neither is a hosted service.

```text
CURRENT — PRIVATE ALPHA

  Sorleed Tokens ──► Sorleed UI ──► Native HTML/CSS
   (implemented)     (canonical)     (implemented)
        │                │
        │                ├──► React adapter (private alpha)
        │                └──► Sorleed CLI (private alpha)
        │
        ├──► component contracts (implemented)
        ├──► Sorleed AI context files (implemented)
        └──► Sorleed Website static site (implemented)

FIGMA — PREPARED, NOT PUBLISHED

  Figma token import + component specs + SVG evidence
   (local)  ─ ─ ─ ─►  published library requires a Figma account
```

- **Tokens are the foundation.** Component CSS consumes `--sl-*` tokens rather
  than hard-coded values.
- **Contracts bind tokens and implementation.** Each component contract records
  anatomy, properties, variants, states, token dependencies, accessibility
  expectations, invalid configurations and tests.
- **Sorleed UI is the canonical implementation.** It is the source that adapters
  and tooling follow.
- **Figma remains a design source, not a distribution format.** Local token and
  component preparation exists, but no published library or pipeline is claimed.
  Where historical evidence exists, it informs the contract; where it does not,
  the contract records the gap.
- **CLI distributes source.** It copies the canonical files; it does not create a
  separate implementation.
- **AI and Website consume the same contracts and documentation.** The AI layer
  is versioned Markdown; the website is static HTML, CSS and JavaScript.

## Workflows

### Designer workflow

1. Define the interface intent and states.
2. Map colour, spacing, typography and geometry to semantic and component token
   roles.
3. Review the component contract for anatomy, variants, states and
   accessibility expectations.
4. Use the local Figma preparation in `figma/` as a starting point. Do not
   invent a Figma node or variant reference, and do not assume a published
   library exists.

Tokens, contracts and canonical CSS remain the authoritative references.

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

Start with `ai/agent.md`, then read the component and token context files. The
AI layer derives from the same contracts and documentation rather than inventing
component APIs. It is versioned Markdown, not a hosted service.

## Current status summary

| Area | Status | Available today |
|---|---|---|
| Sorleed UI | Implemented canonical layer; React private alpha | Four components as CSS + native HTML + contracts |
| Sorleed Tokens | Implemented | 229 `--sl-*` tokens, generated CSS, validation |
| Sorleed Figma | Preparation complete | Token import, specs and SVG evidence; no published library |
| Sorleed CLI | Private alpha | Source-distribution CLI with `list` and `add`, unpublished |
| Sorleed AI | Implemented | Versioned context files for AI coding tools |
| Sorleed Website | Implemented | Static documentation site, not deployed by this work |

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

## Project maintenance

Sorleed currently has a single maintainer, `@cephasosayi`, who is also the
repository [`CODEOWNERS`](CODEOWNERS) owner. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the interim review policy and
[`SECURITY.md`](SECURITY.md) for private reporting. There is no independent
Code of Conduct handler while Sorleed has one maintainer.

## Related documents

- [`README.md`](README.md) — project overview and status.
- [`components/CATALOG.md`](components/CATALOG.md) — implemented components.
- [`components/USAGE-GUIDE.md`](components/USAGE-GUIDE.md) — contract-first usage.
- [`components/IMPLEMENTATION.md`](components/IMPLEMENTATION.md) — architecture.
- [`tokens/README.md`](tokens/README.md) — token consumption.
- [`docs/foundation/principles.md`](docs/foundation/principles.md) — principles.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution and review policy.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — community standards.
- [`SECURITY.md`](SECURITY.md) — security reporting.
- [`docs/release-readiness.md`](docs/release-readiness.md) — release status.
