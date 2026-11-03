# Repository transition

This document records the repository model for Sorleed and the controlled
procedure for reconciling `main` after legal ownership is confirmed.

## Repository roles

| Remote | Repository | Role |
|---|---|---|
| `origin` | `https://github.com/sorleed/sorleed.git` | Primary Sorleed repository; currently private. |
| `fincore` | `https://github.com/FinCoreUI/fincore.git` | Historical FinCoreUI repository; preserved, not deleted or modified. |

The local branch `docs/foundation-baseline` tracks
`origin/docs/foundation-baseline`.

## Current branch state

- `origin/main` is a separate root commit containing only a `LICENSE` with the
  `sorleed` copyright holder.
- `origin/docs/foundation-baseline` contains the complete Sorleed project and
  its existing commit history.
- The two histories are **unrelated**. They must not be merged or force-replaced
  until the copyright-holder decision is complete.
- The default branch remains `main` for now.

## Rules

- Do not force-push, rewrite history or delete either branch.
- Do not replace either `LICENSE` file without a legal decision.
- Do not change the default branch until `main` has been reconciled and verified.
- Keep the FinCoreUI repository available until a separate archival/notice
  decision is approved.

## Safest `main` reconciliation procedure

This procedure is documented only. It must not be executed until the legal
copyright holder and authoritative `LICENSE` are confirmed.

1. Create a fresh backup bundle and verify it includes the current branch HEAD.
2. Confirm the working tree is clean and the local branch is up to date.
3. Fetch the Sorleed remote:

   ```sh
   git fetch origin
   ```

4. Merge the unrelated `main` history into the integration branch:

   ```sh
   git switch docs/foundation-baseline
   git merge --allow-unrelated-histories origin/main
   ```

5. Resolve the `LICENSE` conflict according to the approved legal decision.
   Do not choose a holder automatically.
6. Run the full validation suite:

   ```sh
   node tokens/check.mjs
   node components/validate-contracts.mjs
   node components/validate-parity.mjs
   node --test components/test/*.test.mjs
   cd cli && npm test
   cd react && npm test && npm run typecheck && npm run build
   ```

7. Commit the merge and push it to the integration branch:

   ```sh
   git push origin docs/foundation-baseline
   ```

8. Fast-forward `main` to the merge commit. `main` is an ancestor of the merge
   commit, so no force is required:

   ```sh
   git push origin docs/foundation-baseline:main
   ```

9. Change the default branch only after verifying the remote `main` tree,
   README, LICENSE and CI result.

## FinCoreUI transition

The old FinCoreUI repository is public and remains active. Do not archive or
modify it during this phase.

After Sorleed is ready for its own visibility decision:

1. Add a notice to the FinCoreUI repository pointing to `sorleed/sorleed`.
2. Confirm whether the old repository should remain as a historical mirror or be
   archived.
3. Archive only with explicit approval.

## Related documents

- [`MIGRATION.md`](../MIGRATION.md) — FinCore/Weft to Sorleed rename.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — contribution workflow.
- [`release-readiness.md`](release-readiness.md) — remaining release blockers.
