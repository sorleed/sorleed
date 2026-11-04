# Sorleed React Components (Alpha)

- Package: `@sorleed/react`
- Version: `0.1.0-alpha.1`
- Status: Private alpha; not published
- Peer dependencies: `react >=18.0.0`, `react-dom >=18.0.0`
- Optional: `libphonenumber-js >=1.10.0` (for full PhoneInput validation/inference)

This package is an optional adapter over the canonical framework-agnostic CSS
and native HTML in `components/`. It mirrors the same classes and tokens. It is
not required to use Sorleed.

## Contract sources

| Component | Contract |
|---|---|
| Button | [`components/button/contract.json`](../components/button/contract.json) |
| Input | [`components/input/contract.json`](../components/input/contract.json) |
| PasswordInput | [`components/password-input/contract.json`](../components/password-input/contract.json) |
| PhoneInput | [`components/phone-input/contract.json`](../components/phone-input/contract.json) |

## Installation

This package is private and not published. Install from a local build/tarball or from the repository as appropriate for your environment.

## Imports

```tsx
import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";
```

### Button
```tsx
<Button variant="primary">Review transfer</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
```
Props follow the current `Button` implementation (see `react/types`). Uses a real `<button>` element with `type="button"` by default.

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  helperText="We'll email a receipt."
/>

<Input
  label="Amount"
  type="number"
  errorMessage="Enter a valid amount."
/>
```
Builds label/control/message anatomy, associates label via `htmlFor`/`id`, sets `aria-invalid="true"` on error and replaces helper text with error message.

### PasswordInput
```tsx
<PasswordInput
  label="Account password"
  placeholder="Enter your password"
  helperText="Must be at least 12 characters."
/>

<PasswordInput
  label="Current password"
  errorMessage="Incorrect password."
/>
```
Provides accessible label/control/message anatomy, password visibility toggling with accessible button names (`showPasswordLabel` / `hidePasswordLabel`), value preservation when toggling, and support for controlled/uncontrolled visibility (`visible`, `defaultVisible`, `onVisibleChange`).

### PhoneInput
```tsx
<PhoneInput
  label="Phone number"
  onChange={(result) => {
    // result.inputValue: editable text
    // result.e164: E.164 only when valid/parseable as provided
    // result.status: "empty" | "incomplete" | "invalid" | "valid"
    // result.isValid: boolean
    // result.country: selected/inferred country code if available
  }}
/>
```

Notes on PhoneInput semantics:
- `inputValue` is the editable text (preserved exactly as typed).
- `e164` is only present when the number is valid/parseable according to the implementation; validity does not imply the number is active, reachable, or owned.
- `status` distinguishes `empty`, `incomplete`, `invalid`, and `valid`.
- No country is hard-coded as default. Country can be set via `country` (controlled) or `defaultCountry`; inference from international numbers follows library behavior. Shared calling codes (e.g., +1) may be ambiguous.
- `libphonenumber-js` is an optional peer for the package as a whole, but it is **required to import `@sorleed/react/phone-input`**, which imports it directly. The package root does not import PhoneInput, so Button, Input and PasswordInput work without it.

## CSS

Load token CSS before component CSS where required. CSS must be imported explicitly (components do not auto-load styles).

Package export paths (from `react/package.json`):
- `@sorleed/react/styles/tokens.css`
- `@sorleed/react/styles/button.css`
- `@sorleed/react/styles/input.css`
- `@sorleed/react/styles/password-input.css`
- `@sorleed/react/styles/phone-input.css`

Example for Button, Input and PasswordInput:
```tsx
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
import "@sorleed/react/styles/input.css";
import "@sorleed/react/styles/password-input.css";
import { Button, Input, PasswordInput } from "@sorleed/react";
```

Example for PhoneInput:
```tsx
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/phone-input.css";
import { PhoneInput } from "@sorleed/react/phone-input";
```

CSS imports require a bundler or environment that supports CSS imports (e.g., Vite, webpack, Next.js). In Node ESM without a loader, CSS imports may error; this is a consumer/environment configuration issue, not necessarily a package defect.

## Supported versions
- React `>=18.0.0`, React DOM `>=18.0.0`

## Alpha limitations
- Package is private (not published to npm).
- PhoneInput requires `libphonenumber-js`; import it from the `@sorleed/react/phone-input` subpath.
- The repository includes automated browser and accessibility checks; they are evidence, not certification.
- API is alpha and may change.
- No automatic CSS injection.
- PasswordInput and PhoneInput have no verified Figma reference; their contracts record `canonical.figma: null`.

## Local checks

```sh
npm test
npm run typecheck
npm run build
```

Run these from `react/`. The repository has no root workspace; this package is
tested independently.
