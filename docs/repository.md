# Repository model

This document records the repository model for Sorleed and the completed
reconciliation of `main`.

## Legal status

The project owner has confirmed that FinCore and Weft were internal development
identities for the same project, and that `fincore-ui` was their own contributor
identity. Neither was launched as a product with users, customers or an existing
user base. Sorleed is the current product identity. There is no customer or user
migration. The source licence is MIT with the notice
`Copyright (c) 2026 Sorleed`.

The historical FinCoreUI repository remains archive-only. It must not be
modified, pushed to, or used as an upstream.

## Repository roles

| Remote / source | Repository | Role |
|---|---|---|
| `origin` | `https://github.com/sorleed/sorleed.git` | Sole active Sorleed repository; currently private. |
| Archive only | `https://github.com/FinCoreUI/fincore.git` | Historical FinCoreUI repository. Not configured as a remote or upstream. |

`docs/foundation-baseline` tracks `origin/docs/foundation-baseline` and is
retained as historical context only.

## Current branch state

- `origin/main` is the default and integration branch and contains the complete
  Sorleed project.
- The reconciliation merge commit is
  `9f5d254cf3fdb44b01231497e6422f46553864e5` (PR #1).
- Both original histories remain reachable from `main`:
  `6667712a94c3bd58af0a8a2c6c5fa0b07141fab3` and
  `96391d2b9fbe9346ad539ff3c7b2891bf547a694`.
- `docs/foundation-baseline` (`f5c4419`) is historical and is not the
  integration branch.
- The root `LICENSE` on `main` is MIT with `Copyright (c) 2026 Sorleed`.
- CI passes on `main` at the merge commit; see
  [`release-readiness.md`](release-readiness.md).

## Rules

- Do not force-push, rewrite history or delete either branch.
- Do not replace the approved root `LICENSE` with a different holder or licence.
- Keep `main` as the default and integration branch.
- Keep the FinCoreUI repository untouched.
- Treat third-party material, including the Contributor Covenant text, under its
  own licence and attribution; do not relicense it as Sorleed-owned.

## Governance and review

- The sole maintainer is `@cephasosayi`, who is also the root `CODEOWNERS` owner.
- Changes should go through pull requests with passing CI.
- Review from another qualified person is preferred when available. When no
  second reviewer is available, the sole maintainer inspects and approves the
  change.
- Branch protection and rulesets are unavailable on the current private
  repository plan. The review policy is documented, not technically enforced.
- `CODEOWNERS` is advisory until branch protection or rulesets are available.
- There is no independent Code of Conduct handler while Sorleed has one
  maintainer.

## Completed `main` reconciliation record

This reviewed, non-destructive transition was completed on 2026-11-04 through
PR #1. The resulting merge commit is
`9f5d254cf3fdb44b01231497e6422f46553864e5`. The steps below are retained as a
historical record; they are not pending work.

1. Create a fresh backup bundle and verify it includes the current branch HEAD.
2. Confirm the working tree is clean and the local branch is up to date.
3. Fetch the Sorleed remote:

   ```sh
   git fetch origin
   ```

4. Create a temporary reconciliation branch from the integration branch:

   ```sh
   git switch -c reconcile/main-license origin/docs/foundation-baseline
   ```

5. Merge the unrelated `main` history:

   ```sh
   git merge --allow-unrelated-histories origin/main
   ```

6. Resolve the `LICENSE` conflict to the approved root text:

   ```text
   MIT License

   Copyright (c) 2026 Sorleed
   ```

7. Run the full validation suite:

   ```sh
   node tokens/check.mjs
   node components/validate-contracts.mjs
   node components/validate-parity.mjs
   node --test components/test/*.test.mjs
   cd cli && npm test
   cd react && npm ci
   cd react && npm test && npm run typecheck && npm run build
   ```

8. Commit the merge and push the temporary branch:

   ```sh
   git push -u origin reconcile/main-license
   ```

9. Open a pull request from `reconcile/main-license` to `main`. Review the diff,
   CI result and LICENSE content before merging:

   ```sh
   gh pr create \
     --repo sorleed/sorleed \
     --base main \
     --head reconcile/main-license \
     --title "chore: reconcile main history and LICENSE" \
     --body "Reconciles the unrelated main root with the full Sorleed project and the approved MIT LICENSE."
   ```

10. Verified: `origin/main` contains the full project, README and approved
    LICENSE.
11. Verified: `main` is the default branch. No force-push or history rewrite was
    used.

## FinCoreUI archive

The old FinCoreUI repository is archive-only and is not connected to the local
codebase. Do not archive, modify or delete it in this phase.

## Related documents

- [`PRODUCT.md`](../PRODUCT.md) — Sorleed product areas and status.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution and review policy.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — community standards.
- [`../SECURITY.md`](../SECURITY.md) — security reporting.
- [`../CODEOWNERS`](../CODEOWNERS) — repository ownership.
- [`components/button.md`](components/button.md) — component references.
- [`release/README.md`](release/README.md) — release preparation.
- [`../website/index.html`](../website/index.html) — documentation site.
- [`../ai/README.md`](../ai/README.md) — AI context layer.
- [`../figma/README.md`](../figma/README.md) — Figma delivery.
- [`release-readiness.md`](release-readiness.md) — remaining release blockers.
