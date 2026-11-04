# npm publication

**Do not publish without the owner's explicit authorisation.** This document
describes the prepared process; it does not authorise publication.

## Preconditions

1. `npm audit` is clean in `react/`.
2. The release checklist in [`checklist.md`](checklist.md) passes.
3. The owner confirms npm scope ownership for `@sorleed`.
4. The repository visibility and licence decision is recorded.
5. The version in `package.json` matches the intended release.

## Package metadata

Both packages currently use `"private": true`. That is intentional for the
private alpha. To publish, the owner must change `private` to `false` in the
specific package, review the diff and commit it. Do not flip both packages in a
routine change.

### `@sorleed/react`

```json
{
  "name": "@sorleed/react",
  "version": "0.1.0-alpha.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./phone-input": { "types": "./dist/phone-input.d.ts", "import": "./dist/phone-input.js" },
    "./styles/button.css": "./dist/styles/button.css",
    "./styles/input.css": "./dist/styles/input.css",
    "./styles/password-input.css": "./dist/styles/password-input.css",
    "./styles/phone-input.css": "./dist/styles/phone-input.css",
    "./styles/tokens.css": "./dist/styles/tokens.css"
  }
}
```

The package ships `dist/` and `README.md`. Build before packing:

```sh
cd react
npm ci
npm run build
npm pack --dry-run
```

### `@sorleed/cli`

The CLI ships `bin/`, `src/`, `templates/` and `README.md`. The `prepack` script
copies canonical templates.

```sh
cd cli
npm pack --dry-run
```

## Packed-artifact installation test

```sh
cd react && npm pack
cd ../cli && npm pack
```

Then, in a fresh temporary project:

```sh
npm init -y
npm install /absolute/path/to/sorleed-react-0.1.0-alpha.1.tgz react react-dom
npm install /absolute/path/to/sorleed-cli-0.1.0-alpha.0.tgz
npx sorleed list
```

Do not install from a packed artifact into the repository itself.

## Publication

Only after authorisation:

```sh
cd react
npm publish --access public --tag alpha

cd ../cli
npm publish --access public --tag alpha
```

Use `--tag alpha` for prereleases. Do not use `latest` for an alpha.

## Verification

```sh
npm view @sorleed/react@0.1.0-alpha.1 dist-tags version
npm view @sorleed/cli@0.1.0-alpha.0 dist-tags version
```

Then install from the registry in a fresh project and render a component.

## Rollback

npm does not allow republishing the same version. If a release is faulty:

1. Publish a new patch or prerelease.
2. Deprecate the faulty version with `npm deprecate`.
3. Record the issue in the changelog.
