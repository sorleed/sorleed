# Release readiness

This is an honest status assessment for the Sorleed private alpha. It is not a
release announcement or a promise of availability.

| Area | Status | Blocker / next action |
|---|---|---|
| Legal ownership and licensing | **Resolved for project code** | The owner confirmed that FinCore and Weft were internal development identities and that `fincore-ui` was their own contributor identity. Neither was a launched product. The root LICENSE is MIT with `Copyright (c) 2026 Sorleed`. Third-party material retains its own terms and attribution. |
| Repository visibility | **Private** | Keep private until the default-branch, governance and validation readiness items are resolved. |
| Documentation | **Ready for private alpha** | `main` contains the full project, README and documentation. The documentation website remains deferred. |
| Governance | **Private-alpha ready; public gaps** | Single maintainer `@cephasosayi` and root `CODEOWNERS` are documented. Code of Conduct and Security use documented GitHub routes with explicit single-maintainer limitations. No independent Code of Conduct handler exists. |
| Security reporting | **Interim** | GitHub private vulnerability reporting is unavailable on the current private plan. The documented route is a GitHub contact request with no vulnerability details. Coordinated disclosure target is 90 days. |
| Dependabot | **Alerts enabled; config added** | Dependabot alerts are enabled. Weekly configuration covers `/react`, `/cli` and GitHub Actions; npm and GitHub Actions major updates are ignored pending deliberate review. |
| Organisation 2FA | **Not enabled** | The administrator account's 2FA status could not be verified through the available API. The requirement was left unchanged to avoid locking out the organisation. |
| CI | **Passing** | GitHub Actions passes on `main` at merge commit `1f42b4c` (run `41812629136`) for tokens, contracts, components, CLI, React tests, typecheck and build. |
| Branch protection | **Blocked** | GitHub branch protection/rulesets are unavailable on the current private-repository plan. The interim review policy is documented in `CONTRIBUTING.md`; it is not technically enforced. |
| React package | **Private alpha** | `@sorleed/react` 0.1.0-alpha.1 is private and unpublished. Package metadata declares MIT. |
| CLI package | **Private alpha** | `@sorleed/cli` 0.1.0-alpha.0 is private and unpublished. Package metadata declares MIT. |
| Browser and accessibility testing | **Unverified** | No current browser, screen-reader, forced-colours, zoom/reflow, RTL or cross-browser certification. |
| Figma implementation | **Deferred** | Button and Input evidence exists; PasswordInput and PhoneInput references remain `null`. No Figma Community Library is available. Figma assets require a separate licensing decision. |
| AI context implementation | **Deferred** | No AI context files are implemented. Do not describe the AI Context Layer as available. |
| Website readiness | **Deferred** | No documentation website exists. Do not set a website URL until one is real. |
| FinCoreUI repository archive | **Archive only** | The historical public repository is not configured as a remote or upstream and must not be modified. A notice/archive decision remains separate. |

## Minimum public-release gates

1. **Completed:** reconciled `main` with the full project, README and approved
   LICENSE at `9f5d254`.
2. Verified default branch; branch-protection equivalent documented but not
   technically enforced.
3. Documented Code of Conduct and security reporting routes. Dedicated private
   channels and an independent Code of Conduct handler are still required before
   broad public contribution.
4. **Completed:** CI passing on `main` at `1f42b4c` (run `41812629136`).
5. Package publication decision and npm scope ownership.
6. Documented browser/accessibility validation, or explicit unverified status.
7. Figma and AI status accurately represented.
8. Separately scoped notice/archive decision for the old FinCoreUI repository.
9. A second maintainer or independent Code of Conduct handler before broad
   public contribution.

## Licensing notes

- Project source code and original documentation are MIT with
  `Copyright (c) 2026 Sorleed`.
- Third-party material retains its own licence and attribution. In particular,
  `CODE_OF_CONDUCT.md` is adapted from Contributor Covenant and is not
  relicensed as Sorleed-owned.
- The Sorleed name and logo remain subject to separate trademark rights.
- No incorporation or registered-company status is claimed.

## Related documents

- [`repository.md`](repository.md) — repository model and completed reconciliation.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution and review policy.
- [`../SECURITY.md`](../SECURITY.md) — security reporting.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — community standards.
- [`../CODEOWNERS`](../CODEOWNERS) — repository ownership.
- [`../THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md) — third-party attribution.
