# Sorleed Roadmap

## Vision

Build Sorleed as **UI Infrastructure**: a source-first UI toolkit for designers
and developers building financial products.

Public release, the final copyright-holder statement and package publication
remain pending. See [`docs/release-readiness.md`](docs/release-readiness.md).

Status vocabulary used in this roadmap:

- **Implemented** — canonical CSS, native HTML reference and validated contract
  exist.
- **Private alpha** — working code exists in this repository but is not published
  and may change.
- **Planned** — recorded here; no implementation or contract exists.
- **Deferred** — explicitly outside the current release.

---

# Version 0.1 — Four-Component System Release

Goal: deliver a framework-agnostic, native HTML/CSS component system that
developers can consume today without a framework, package manager or build step,
with an optional private-alpha React adapter and source-distribution CLI.

### Implemented

* Button, Input, PasswordInput and PhoneInput as native HTML/CSS components.
* 229 generated `--sl-*` design tokens and machine-readable contracts for all
  four components.
* Token, contract, implementation and CLI-template parity checks.
* Component catalogue, contract-first usage guide, implementation guide and
  native reference pages.
* Color System, [Design Principles](docs/foundation/principles.md) and Token
  Architecture documentation.
* Runnable transaction-history and payment-form examples.
* Transaction-history proof of concept.

### Private alpha

* `@sorleed/react` 0.1.0-alpha.1 — React wrappers for all four components, with
  tests and typecheck. Not published.
* `@sorleed/cli` 0.1.0-alpha.0 — source-distribution CLI for all four components.
  Not published.

### Deferred

* Card and other planned components.
* Remaining foundation guides: Typography, Spacing, Radius, Sizing, Border,
  Elevation and Motion. Color System, Design Principles and Token Architecture
  are available.
* AI Context Layer.
* Figma Community Library. The PasswordInput and PhoneInput Figma references are
  unresolved and recorded as `null`; no node ID is invented.
* Documentation website.
* Tailwind package and other framework adapters.
* Verified cross-browser and assistive-technology support. Unrun environments
  are not claimed as passing.

---

# Version 0.2 — Core Components

### Planned components

* Badge
* Avatar
* Checkbox
* Radio
* Switch
* Modal
* Tabs
* Tooltip
* Toast

### Documentation improvements

* Component examples
* Best practices
* Accessibility testing

---

# Version 0.3 — Fintech Components

### Planned financial components

* OTP Input
* Currency Input
* PIN Input
* Wallet Card
* Transaction Item
* Account Summary
* Bank Selector

---

# Version 0.4 — Financial Patterns

### Planned user flows

* Authentication
* Onboarding
* Send Money
* Receive Money
* Bill Payments
* Savings
* Loans

---

# Version 1.0

### Ecosystem release

* Full documentation site
* Storybook
* Published React package
* Tailwind package
* Figma Community Library
* AI Context Layer
* Community contributions
