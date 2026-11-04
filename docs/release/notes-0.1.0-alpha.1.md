# Sorleed 0.1.0-alpha.1 — draft release notes

**Status: private alpha. Not published.**

## Highlights

- Four components: Button, Input, PasswordInput and PhoneInput.
- 229 `--sl-*` design tokens with generated CSS.
- React adapters with TypeScript declarations.
- Source-distribution CLI with conflict protection.
- Documentation website, AI context layer and Figma preparation.

## Packages

| Package | Version | Status |
|---|---|---|
| `@sorleed/react` | 0.1.0-alpha.1 | Private, unpublished |
| `@sorleed/cli` | 0.1.0-alpha.0 | Private, unpublished |

## Supported baseline

- React 18+ and React DOM 18+.
- Node 18+ for tooling.
- Modern browsers for the core HTML/CSS implementation.
- Light theme only.

## Known limitations

- No dark mode.
- No components beyond the four.
- PhoneInput uses a native country select; no searchable picker.
- No screen-reader or cross-browser certification.
- No published Figma Community Library.
- No npm publication.

## Security

The React dependency tree reports zero known vulnerabilities after the `tsup`
and `esbuild` update. Dependabot alerts are enabled.

## Upgrading

This is the first alpha. There is no earlier public release to upgrade from.
