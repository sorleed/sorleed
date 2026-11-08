# Contributing to Sorleed

Thank you for your interest in contributing to Sorleed.

Sorleed is an open-source project built to improve how financial products are designed, developed, and implemented with AI.

We welcome contributions from:

* Designers
* Developers
* Product Thinkers
* Technical Writers
* Accessibility Advocates

---

## Ways to Contribute

### Design

* Design Foundations
* Components
* Patterns
* Accessibility Reviews

### Development

* Components
* Documentation
* Tooling
* Testing

### Documentation

* Guides
* Examples
* Tutorials
* AI Context Files

---

## Before Contributing

Please:

1. Check existing issues.
2. Discuss major changes before implementation.
3. Follow the [Sorleed principles](docs/foundation/principles.md).
4. Prioritize accessibility.

---

## Sorleed Principles

All contributions follow the eight principles defined in
[`docs/foundation/principles.md`](docs/foundation/principles.md).

### Contribution Expectations

* Accessibility is reviewed as part of every component change.
* Components use tokens rather than hard-coded values.
* Component documentation covers anatomy, tokens used, states, and accessibility notes.
* Design and implementation work is Mobile First.

Open Collaboration is a community value; see [Community](#community).

---

## Code Standards & Production Principles

Sorleed is production-grade financial infrastructure. Every contribution must satisfy these core engineering standards:

### 1. Token Integrity & Zero Hard-Coding
- **Never hard-code colors, spacing, borders, or typography**. Always map visual and structural styling to design tokens defined in `tokens/`.
- Validate token references with `node tokens/check.mjs`.

### 2. Machine-Readable Contracts
- Every component must have a `components/<component>/contract.json` satisfying `components/schema.json`.
- Changes must pass contract schema and rule validation via `node components/validate-contracts.mjs`.
- Template parity must be maintained between `react/` and `cli/templates/` via `node components/validate-parity.mjs`.

### 3. Fintech Production Guardrails
- **Idempotency & Double-Submit Protection**: Any user-triggerable mutating action (e.g., payment submission, form submission) must defensively guard against rapid repeat clicks or async race conditions (e.g. `Button` enters `aria-busy="true"` and blocks duplicate triggers while `loading`).
- **Zero Ambiguity in Monetary Display**: Monetary values must adhere to ISO 4217, use unambiguous sign placement (`+` / `-`), and never rely on floating-point arithmetic or naive string concatenation. Use the shared utility `formatMoney()`.
- **Defensive State & Explicit Accessibility**: State changes must be reflected in explicit ARIA semantics (`aria-busy`, `aria-disabled`, `aria-live`).
- **Non-Destructive Ownership**: Deprecations must follow semver cycles with upgrade pathways.

### 4. Verification & Testing
Before submitting a PR or pushing changes, verify your branch locally:
```bash
# Token & contract verification
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
node --test components/test/*.test.mjs

# CLI verification
cd cli && npm test && cd ..

# React component library & formatting tests
cd react && npm test && npm run typecheck && npm run build && cd ..
```

---

## Community

Sorleed is built on **Open Collaboration**.

* Be respectful.
* Be constructive.
* Be collaborative.

We are building Sorleed together.
