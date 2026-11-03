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

## Code Standards

### Naming

- The product, packages, CSS classes and tokens use **Sorleed**.
- CSS custom properties use the `--sl-*` prefix.
- CSS classes use the `.sl-*` prefix.
- Contract IDs use `sorleed.<component>`.
- Do not add compatibility aliases for the former FinCore or Weft names.

### Current checks

Run the checks relevant to your change from the repository root:

```sh
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
node --test components/test/*.test.mjs
```

For React or CLI changes, also run the package suites:

```sh
cd react && npm test && npm run typecheck
cd cli && npm test
```

### Component changes

- Update the canonical CSS, native HTML reference and contract together.
- Keep declared token dependencies equal to the CSS variables actually consumed.
- Regenerate `tokens/dist/tokens.css` with `node tokens/check.mjs --write` after
  an intentional token-source change.
- Regenerate CLI templates from canonical sources; parity is enforced.
- Do not claim browser rendering, screen-reader, cross-browser or Figma-node
  verification that was not actually performed.

---

## Community

Sorleed is built on **Open Collaboration**.

* Be respectful.
* Be constructive.
* Be collaborative.

We are building Sorleed together.
