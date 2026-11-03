# Release readiness

This is an honest status assessment for the Sorleed private alpha. It is not a
release announcement or a promise of availability.

| Area | Status | Blocker / next action |
|---|---|---|
| Legal ownership and licensing | **Blocked** | Confirm the copyright holder, authority to transfer or relicense the FinCoreUI history, and the authoritative `LICENSE`. Do not change either LICENSE before that decision. |
| Repository visibility | **Private** | Keep private until legal, default-branch, governance and validation readiness are resolved. |
| Documentation | **Partly ready** | Default `main` has no README. The repository description, homepage and topics are empty. Align the README/ROADMAP tagline with the official positioning. |
| Governance | **Partly ready** | Code of Conduct and Security policy contain required contact placeholders. Issue and pull-request templates are present. CODEOWNERS requires confirmed maintainer handles. |
| CI | **Ready for first run** | A GitHub Actions workflow will run the token, contract, parity, component, CLI and React checks. The first remote run must be verified. |
| Branch protection | **Blocked** | GitHub branch protection/rulesets are unavailable on the current private-repository plan. Revisit after a plan or visibility decision. |
| React package | **Private alpha** | `@sorleed/react` 0.1.0-alpha.1 is private and unpublished. Package license metadata remains pending legal confirmation. |
| CLI package | **Private alpha** | `@sorleed/cli` 0.1.0-alpha.0 is private and unpublished. |
| Browser and accessibility testing | **Unverified** | No current browser, screen-reader, forced-colours, zoom/reflow, RTL or cross-browser certification. |
| Figma implementation | **Deferred** | Button and Input evidence exists; PasswordInput and PhoneInput references remain `null`. No Figma Community Library is available. |
| AI context implementation | **Deferred** | No AI context files are implemented. Do not describe the AI Context Layer as available. |
| Website readiness | **Deferred** | No documentation website exists. Do not set a website URL until one is real. |
| FinCoreUI repository transition | **Pending** | The old public repository remains active. A notice/archive decision is required after the Sorleed repository is ready. |

## Minimum public-release gates

1. Legal holder and LICENSE decision.
2. Reconciled `main` with a complete README and verified default branch.
3. Repository description, homepage decision and topics.
4. Real Code of Conduct and Security contacts.
5. CI passing on the default branch.
6. Branch protection or an equivalent review policy.
7. Package publication decision and npm scope ownership.
8. Documented browser/accessibility validation, or explicit unverified status.
9. Figma and AI status accurately represented.
10. Old FinCoreUI notice/archive decision.

## Related documents

- [`repository.md`](repository.md) — repository transition and main reconciliation.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow.
- [`../SECURITY.md`](../SECURITY.md) — security reporting.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — community standards.
