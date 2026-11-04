# Contributing to Sorleed

Thank you for your interest in contributing to Sorleed.

Sorleed is a source-first UI toolkit for designers and developers building
financial products. The project is currently in **private alpha**. The canonical
component layer is framework-agnostic CSS plus native HTML; the React adapter
and CLI are private alpha and unpublished.

We welcome contributions from:

* Designers
* Developers
* Product Thinkers
* Technical Writers
* Accessibility Advocates

By participating, you agree to follow the
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

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

AI context work is **deferred**; do not add AI context files without an approved
scope and contract.

---

## Before Contributing

Please:

1. Check existing issues.
2. Discuss major changes before implementation.
3. Follow the [Sorleed principles](docs/foundation/principles.md).
4. Prioritize accessibility.
5. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
6. Report security issues according to [`SECURITY.md`](SECURITY.md), not in a
   public issue.

---

## Repository Workflow

- Sorleed is developed at `sorleed/sorleed` and is currently private.
- While the repository is private, external contributions are limited to
  invited collaborators.
- The default and integration branch is `main`. The full project and the
  approved LICENSE are on `main`.
- `docs/foundation-baseline` is retained as historical context; it is not the
  integration branch.
- The historical FinCoreUI repository is archive-only. It is not configured as
  a remote or upstream and must not be modified.
- Do not change the default branch, rewrite history, force-push, or replace the
  root `LICENSE` without explicit approval.
- See [`docs/repository.md`](docs/repository.md) for the branch model and
  repository history.

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
cd react && npm test && npm run typecheck && npm run build
cd cli && npm test
```

The CI workflow runs these same checks on pushes to `main` and on pull requests.
It also still runs on the retained historical `docs/foundation-baseline` branch.

### Component changes

- Update the canonical CSS, native HTML reference and contract together.
- Keep declared token dependencies equal to the CSS variables actually consumed.
- Regenerate `tokens/dist/tokens.css` with `node tokens/check.mjs --write` after
  an intentional token-source change.
- Regenerate CLI templates from canonical sources; parity is enforced.
- Do not claim browser rendering, screen-reader, cross-browser or Figma-node
  verification that was not actually performed.

### Pull requests

- Keep changes focused and explain the user-facing or contract impact.
- Include tests and documentation for changed behaviour.
- Do not change `LICENSE` without explicit approval.
- Do not include secrets, machine-specific paths or unrelated cleanup.
- Report any validation command that could not be run.

---

## Security

Do not report security vulnerabilities in public issues. Follow
[`SECURITY.md`](SECURITY.md).

---

## Community

Sorleed is built on **Open Collaboration**.

* Be respectful.
* Be constructive.
* Be collaborative.

We are building Sorleed together.
