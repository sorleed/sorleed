# Release readiness

This is an honest status assessment for the Sorleed private alpha. It is not a
release announcement or a promise of availability.

| Area | Status | Blocker / next action |
|---|---|---|
| Legal ownership and licensing | **Resolved for project code** | The owner confirmed that FinCore and Weft were internal development identities and that `fincore-ui` was their own contributor identity. Neither was a launched product. The root LICENSE is MIT with `Copyright (c) 2026 Sorleed`. Third-party material retains its own terms and attribution. |
| Repository visibility | **Private** | Keep private until the default-branch, governance and validation readiness items are resolved. |
| Documentation | **Ready for private alpha** | `main` contains the README, product docs, component references, release preparation, AI context and a static documentation website. |
| Governance | **Private-alpha ready; public gaps** | Single maintainer `@cephasosayi` and root `CODEOWNERS` are documented. Code of Conduct and Security use documented GitHub routes with explicit single-maintainer limitations. No independent Code of Conduct handler exists. |
| Security reporting | **Interim** | GitHub private vulnerability reporting is unavailable on the current private plan. The documented route is a GitHub contact request with no vulnerability details. Coordinated disclosure target is 90 days. |
| Dependabot | **Alerts enabled; config added** | Dependabot alerts are enabled. Weekly configuration covers `/react`, `/cli` and GitHub Actions; npm and GitHub Actions major updates are ignored pending deliberate review. |
| Organisation 2FA | **Not enabled** | The administrator account's 2FA status could not be verified through the available API. The requirement was left unchanged to avoid locking out the organisation. |
| CI | **Passing; expanded** | Existing jobs cover tokens, contracts, components, CLI, React tests, typecheck and build. The product-completion change adds documentation validation, packed-consumer tests and a Chromium/axe job. |
| Branch protection | **Blocked** | GitHub branch protection/rulesets are unavailable on the current private-repository plan. The interim review policy is documented in `CONTRIBUTING.md`; it is not technically enforced. |
| React package | **Private alpha** | `@sorleed/react` 0.1.0-alpha.1 is private and unpublished. Package metadata declares MIT. |
| CLI package | **Private alpha** | `@sorleed/cli` 0.1.0-alpha.0 is private and unpublished. Package metadata declares MIT. |
| Browser and accessibility testing | **Automated Chromium checks pass** | Headless Chrome with axe-core runs WCAG 2.0/2.1/2.2 A/AA rules across the site, references and examples at mobile and desktop widths. Firefox, WebKit and screen-reader certification are not performed. |
| Figma implementation | **Preparation complete** | DTCG token import, component specs and original SVG evidence are in `figma/`. No published library or `.fig` file. A Figma account with library permission is required to finish externally. |
| AI context implementation | **Implemented** | Versioned context files under `ai/` cover product, installation, components, tokens, accessibility, customisation, tool rules and prompts. |
| Website readiness | **Built; not deployed** | Static site in `website/` with no build step or tracking. No production URL is claimed; deployment instructions are documented. |
| Packed package validation | **Passing** | `npm pack` contents reviewed; packed React and CLI artifacts install and run in a fresh consumer project. |
| FinCoreUI repository archive | **Archive only** | The historical public repository is not configured as a remote or upstream and must not be modified. A notice/archive decision remains separate. |

## Minimum public-release gates

1. **Completed:** reconciled `main` with the full project, README and approved
   LICENSE at `9f5d254`.
2. Verified default branch; branch-protection equivalent documented but not
   technically enforced.
3. Documented Code of Conduct and security reporting routes. Dedicated private
   channels and an independent Code of Conduct handler are still required before
   broad public contribution.
4. **Completed:** CI passing, with consumer, docs and Chromium/axe jobs added.
5. Package publication decision and npm scope ownership. Packed artifacts are
   validated; `private` remains `true` until the owner authorises publication.
6. **Completed for Chromium:** automated browser and axe checks. Firefox, WebKit
   and screen-reader certification remain outstanding.
7. **Completed:** Figma, AI and website status are represented accurately.
8. **Completed:** static website source and deployment instructions.
9. Separately scoped notice/archive decision for the old FinCoreUI repository.
10. A second maintainer or independent Code of Conduct handler before broad
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
