# Pull request

## Summary

<!-- What changed, and why? -->

## Change type

- [ ] Documentation
- [ ] Governance or repository workflow
- [ ] Tokens
- [ ] Component contract, CSS or reference markup
- [ ] React package
- [ ] CLI
- [ ] Examples or POC
- [ ] CI or tooling

## Affected areas

<!-- Components, packages, docs or workflows affected. -->

## Validation

- [ ] `node tokens/check.mjs`
- [ ] `node components/validate-contracts.mjs`
- [ ] `node components/validate-parity.mjs`
- [ ] `node --test components/test/*.test.mjs`
- [ ] `cd cli && npm test`
- [ ] `cd react && npm test`
- [ ] `cd react && npm run typecheck`
- [ ] `cd react && npm run build`
- [ ] `git diff --check`

## Checklist

- [ ] The change is scoped and does not include unrelated cleanup.
- [ ] Component, token and contract changes are documented together.
- [ ] Accessibility impact is described.
- [ ] No secrets, credentials, machine-specific paths or personal data are included.
- [ ] `LICENSE` is unchanged unless explicitly approved.
- [ ] Limitations and unverified behavior are stated honestly.
