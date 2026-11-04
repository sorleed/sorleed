# Versioning

Sorleed uses semantic versioning with prerelease identifiers.

## Current versions

| Package | Version | Status |
|---|---|---|
| `@sorleed/react` | `0.1.0-alpha.1` | Private, unpublished |
| `@sorleed/cli` | `0.1.0-alpha.0` | Private, unpublished |

## Rules

- `0.x` is alpha. Breaking changes may occur in a minor release.
- Patch releases fix behaviour without changing the public API.
- Minor releases add components, props or tokens.
- Major releases are reserved for the first stable API.
- Component contracts carry their own `version`. A breaking contract change
  requires a contract version bump and a changelog entry.
- Token removals or semantic renames are breaking changes.

## Pre-release identifiers

Use `-alpha.N` for alpha builds and `-beta.N` for beta builds. Do not publish a
prerelease with a `latest` dist-tag.

## Tagging

When publication is authorised:

```sh
git tag -a v0.1.0-alpha.1 -m "Sorleed 0.1.0-alpha.1"
git push origin v0.1.0-alpha.1
```

Do not create tags as part of a routine documentation or CI change.
