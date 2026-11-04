# Repository transition

This document records the repository model for Sorleed and the controlled
procedure for reconciling `main`.

## Legal status

The project owner has confirmed that FinCore was their original project and that
`fincore-ui` was their own contributor identity. Sorleed is the renamed and
continuing project. The intended source licence is MIT with the notice
`Copyright (c) 2026 Sorleed`.

The historical FinCoreUI repository remains archive-only. It must not be
modified, pushed to, or used as an upstream.

## Repository roles

| Remote / source | Repository | Role |
|---|---|---|
| `origin` | `https://github.com/sorleed/sorleed.git` | Sole active Sorleed repository; currently private. |
| Archive only | `https://github.com/FinCoreUI/fincore.git` | Historical FinCoreUI repository. Not configured as a remote or upstream. |

The local branch `docs/foundation-baseline` tracks
`origin/docs/foundation-baseline`.

## Current branch state

- `origin/main` is a separate root commit containing only a `LICENSE`.
- `origin/docs/foundation-baseline` contains the complete Sorleed project and
  its existing commit history.
- The two histories are **unrelated**.
- The default branch remains `main` until the reviewed transition is complete.
- The local root `LICENSE` is MIT with `Copyright (c) 2026 Sorleed`. The remote
  `main` LICENSE must be reconciled to the same approved text.

## Rules

- Do not force-push, rewrite history or delete either branch.
- Do not replace the approved root `LICENSE` with a different holder or licence.
- Do not change the default branch until `main` has been reconciled and verified.
- Keep the FinCoreUI repository untouched.
- Treat third-party material, including the Contributor Covenant text, under its
  own licence and attribution; do not relicense it as Sorleed-owned.

## Safest `main` reconciliation procedure

This is a reviewed, non-destructive transition. Do not bypass branch protection
or force-push.

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

10. After the PR is merged, verify `origin/main` contains the full project,
    README and approved LICENSE.
11. Confirm `main` is the default branch. No force-push or history rewrite is
    required.

## FinCoreUI transition

The old FinCoreUI repository is archive-only and is not connected to the local
codebase. Do not archive, modify or delete it in this phase.

## Related documents

- [`MIGRATION.md`](../MIGRATION.md) — historical FinCore/Weft rename.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow.
- [`release-readiness.md`](release-readiness.md) — remaining release blockers.
