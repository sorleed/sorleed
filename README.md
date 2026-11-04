# Sorleed

**UI Infrastructure.** A source-first UI toolkit for designers and developers.

Sorleed is currently in **private alpha**. The canonical component layer is
framework-agnostic CSS plus native HTML. React and CLI are private-alpha
adapters and are not published. The AI Context Layer, Figma Community Library
and documentation website are deferred.

Sorleed is being prepared for open-source release under the MIT License. The
repository remains private during alpha. The root licence records
`Copyright (c) 2026 Sorleed`.

Sorleed provides designers and developers with a shared language for building
modern financial experiences. By combining design systems, code, contracts and
documentation, Sorleed helps teams build consistent, accessible and scalable
fintech products faster.

---

## Why Sorleed?

Financial products repeatedly solve the same interface challenges:

* Authentication
* Wallets
* Transfers
* Payments
* KYC Verification
* Transaction Histories
* Account Management

Designers redesign them.

Developers rebuild them.

AI generates them differently every time.

Sorleed exists to create a shared foundation that improves consistency across the entire product development lifecycle.

---

## Core Principles

Sorleed is governed by eight principles. The authoritative definitions and supporting
commitments are maintained in [`docs/foundation/principles.md`](docs/foundation/principles.md).

* Accessible by Default
* Semantic Over Visual
* Themeable by Design
* Source Owned
* Consistent Yet Flexible
* AI Friendly
* Fintech First
* Component Driven

Supporting commitments, including Mobile First, are recorded there rather than as
additional principles.

---

## Current Status

The repository is a **v0.1 component-system milestone**. It distinguishes four
states so nothing is presented as more mature than it is:

| State | Meaning |
|---|---|
| **Implemented** | Canonical CSS, native HTML reference and a machine-readable contract exist and are validated. |
| **Private alpha** | A working adapter or tool exists in this repository but is not published and may change without notice. |
| **Planned** | Recorded in the roadmap; no implementation or contract exists. |
| **Deferred** | Explicitly out of the current release; no date or implementation commitment. |

### Product areas

| Area | Status |
|---|---|
| **Sorleed UI** | Private-alpha React adapter; canonical CSS and native HTML are implemented for four components. |
| **Sorleed Tokens** | Implemented: 229 `--sl-*` tokens, contracts and validation. |
| **Sorleed Figma** | Deferred. Button and Input have recorded evidence; PasswordInput and PhoneInput references remain unresolved. |
| **Sorleed CLI** | Private alpha and unpublished. |
| **Sorleed AI** | Deferred. No AI context files are implemented. |
| **Sorleed Website** | Deferred. Not built. |

### Implemented

- Four components: **Button, Input, PasswordInput and PhoneInput**.
- Framework-agnostic component CSS plus native HTML reference markup.
- 229 generated `--sl-*` design tokens across primitive, semantic and component layers.
- Machine-readable contracts for all four components.
- Contract, token, implementation and CLI-template parity checks.
- Component catalogue, contract-first usage guide, implementation guide and
  native reference pages.
- Color System, Design Principles and Token Architecture documentation.
- Runnable transaction-history and payment-form examples.
- A transaction-history proof of concept.

### Private alpha

- **React adapter** (`@sorleed/react` 0.1.0-alpha.1) — four component wrappers,
  tests and typecheck. Not published.
- **CLI** (`@sorleed/cli` 0.1.0-alpha.0) — source-distribution command that copies
  canonical components and styles into a consumer project. Not published.

Private alpha capabilities are documented in [`react/README.md`](react/README.md)
and [`cli/README.md`](cli/README.md). They are not part of the published package
surface.

### Planned

- Core components: Badge, Avatar, Checkbox, Radio, Switch, Modal, Tabs, Tooltip,
  Toast.
- Fintech components: OTP Input, Currency Input, PIN Input, Wallet Card,
  Transaction Item, Account Summary, Bank Selector.
- Financial patterns such as authentication, onboarding and money movement.

### Deferred

- The AI Context Layer.
- The Figma Community Library.
- The documentation website.
- Tailwind and other framework packages.
- Remaining foundation guides: Typography, Spacing, Radius, Sizing, Border,
  Elevation and Motion. Color System, Design Principles and Token Architecture
  are available.
- Verified cross-browser and assistive-technology support. Only the checks
  recorded in the repository are claimed; unrun environments are not marked as
  passing.
- The Figma reference for PasswordInput and PhoneInput. Both contracts record
  `canonical.figma: null` and do not invent a node ID.

---

## Use Sorleed

Start with the [component consumption guide](components/README.md) and the
[component catalogue](components/CATALOG.md).

The canonical component layer is framework-agnostic CSS with native HTML:

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">
```

No package manager or build step is required to use the CSS directly. The React
adapter and CLI are optional private-alpha capabilities for teams that want a
source-distribution or React authoring workflow.

---

## Repository Structure

```text
sorleed/

├── .github/        # CI, issue and pull-request templates
├── docs/           # foundation, repository history and release readiness
├── figma/
├── ai/
├── tokens/
├── components/
├── react/          # private alpha
├── cli/            # private alpha
├── examples/
├── poc/
├── website/

├── README.md
├── ROADMAP.md
├── CONTRIBUTING.md
├── PRODUCT.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── THIRD_PARTY_NOTICES.md
└── LICENSE
```

---

## Current Roadmap

### Version 0.1

Delivered as the four-component system release described above. Card, the
remaining foundation guides, the AI Context Layer, the Figma Community Library,
the website, Tailwind and verified cross-browser/assistive-technology support are
deferred.

### Version 0.2

* Core Components Expansion

### Version 0.3

* Fintech Components

See [`ROADMAP.md`](ROADMAP.md) for details.

---

## Contributing

We welcome designers, developers, technical writers, and product thinkers.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting contributions.
By participating, you agree to the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
Report security issues according to [`SECURITY.md`](SECURITY.md).

---

## Product Areas

Sorleed is organised into six product areas: UI, Tokens, Figma, CLI, AI and
Website. See [`PRODUCT.md`](PRODUCT.md) for what each area covers, how they
relate and their current status.

## Repository

Sorleed is the sole active brand and development source. `main` is the default
and integration branch and contains the full project. The reconciliation merge
commit is `9f5d254`, with CI passing on it. `docs/foundation-baseline` is
retained as historical context only.

See [`docs/repository.md`](docs/repository.md) for the completed reconciliation
record and [`docs/release-readiness.md`](docs/release-readiness.md) for remaining
release blockers.

---

## License

MIT License. Copyright (c) 2026 Sorleed.

The MIT license covers the project software and documentation. It does not grant
rights to the Sorleed name or logo. Third-party materials retain their own
licenses and attribution; see [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
