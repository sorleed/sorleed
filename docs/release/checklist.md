# Release checklist

Run every item before a public alpha release.

## Repository

- [ ] `main` is clean and synchronised with `origin/main`.
- [ ] Backups exist for the release commit.
- [ ] `npm audit` in `react/` reports zero vulnerabilities.
- [ ] Dependabot has no unresolved high or critical alerts.
- [ ] `LICENSE` is unchanged MIT with `Copyright (c) 2026 Sorleed`.
- [ ] No FinCore/Weft migration narrative is present.

## Validation

- [ ] `node tokens/check.mjs`
- [ ] `node components/validate-contracts.mjs`
- [ ] `node components/validate-parity.mjs`
- [ ] `node --test components/test/*.test.mjs`
- [ ] `cd cli && npm test`
- [ ] `cd react && npm test && npm run typecheck && npm run build`
- [ ] YAML and JSON validation passes.
- [ ] Markdown links resolve.
- [ ] `git diff --check` is clean.
- [ ] `npm pack --dry-run` contents reviewed for both packages.
- [ ] Packed artifacts install and render in a fresh consumer project.

## Accessibility and browser

- [ ] Automated browser checks pass.
- [ ] Keyboard focus is visible on every control.
- [ ] Labels and error associations are present.
- [ ] Contrast report passes.
- [ ] Known limitations are documented; untested browsers are not claimed.

## Documentation

- [ ] README, PRODUCT and docs match the implementation.
- [ ] CHANGELOG has the release entry.
- [ ] Component references are current.
- [ ] Website links and content are current.
- [ ] AI context files match the implementation.
- [ ] Figma delivery notes state what is and is not available.

## Authorisation

- [ ] Owner authorises publication.
- [ ] npm scope ownership is confirmed.
- [ ] `private` is removed from the package being published.
- [ ] The correct dist-tag is chosen.
- [ ] Repository visibility decision is deliberate.
