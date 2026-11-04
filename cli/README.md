# Sorleed CLI (Alpha)

**Status: private alpha. `@sorleed/cli` 0.1.0-alpha.0 is not published.**

Source-distribution CLI for Sorleed components. Instead of installing compiled packages, the CLI copies canonical source files from this repository into your consumer project.

## Prerequisites

- Node.js (ESM support)
- A React + TypeScript consumer project (bundler recommended for CSS imports)
- For TypeScript consumers using CSS side-effect imports, you may need ambient type declarations for `*.css` (e.g., `declare module "*.css"`)

## Supported components

- `button` - Sorleed Button (React + TypeScript)
- `input` - Sorleed Input (React + TypeScript)
- `password-input` - Sorleed PasswordInput (React + TypeScript)
- `phone-input` - Sorleed PhoneInput (React + TypeScript)

## Usage

Using `npx` when the private package is available in your environment:

```bash
npx sorleed add button --dir /path/to/consumer
```

Or from the repository:

### Preview only (dry-run)
Add `--dry-run` to inspect what would be copied without writing any files:

```bash
node cli/bin/sorleed.mjs add button --dir /path/to/consumer --dry-run
```

### Installation
Omit `--dry-run` to actually copy files into your consumer project:

```bash
node cli/bin/sorleed.mjs add button --dir /path/to/consumer
node cli/bin/sorleed.mjs add input --dir /path/to/consumer
node cli/bin/sorleed.mjs add password-input --dir /path/to/consumer
node cli/bin/sorleed.mjs add phone-input --dir /path/to/consumer
```

## Installing into a chosen directory

Use `--dir` to specify the consumer project root. Paths are resolved and must stay within the consumer directory.

## What gets copied

Each component copies:
- Component wrapper: `components/sorleed/<component>/index.tsx` (e.g., `password-input/index.tsx`)
- Shared types: `components/sorleed/types/index.ts` (shared across Button, Input, PasswordInput, PhoneInput)
- Component CSS: `styles/sorleed/<component>.css` (e.g., `password-input.css`)
- Tokens CSS: `styles/sorleed/tokens.css` (shared)

## Required CSS imports (order matters)

Import tokens first, then component styles in your app entry point:

```tsx
import "./styles/sorleed/tokens.css";
import "./styles/sorleed/button.css";
// or ./styles/sorleed/input.css
// or ./styles/sorleed/phone-input.css
```

CSS imports require a bundler that supports CSS imports. Tokens must be loaded before component CSS.

## Dependencies

- **Button, Input and PasswordInput**: No extra runtime dependencies (peer deps: `react >=18.0.0`, `react-dom >=18.0.0`)
- **PhoneInput**: Requires `libphonenumber-js` at runtime for phone-number parsing and validation. Install it in your consumer project:
  ```bash
  npm install libphonenumber-js
  ```
  Button, Input and PasswordInput do not require this dependency.
  - Note: `@types/node` is **not** a requirement of PhoneInput or Sorleed. If a consumer project encounters TypeScript errors for `node:*` imports (such as `node:path`), this typically originates from the consumer's own build tooling or Node-based configuration (e.g. `vite.config.ts`); diagnose the consumer's configuration rather than treating it as a PhoneInput requirement.

## Minimal usage examples

### Button
```tsx
import { Button } from "./components/sorleed/button";

<Button variant="primary">Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
```

### Input
```tsx
import { Input } from "./components/sorleed/input";

<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Name" helperText="Enter your full name" />
<Input label="Account Number" errorMessage="This field is required" />
```

> **Note on Input types:** Sorleed `Input` strictly supports the following `type` attributes per its component contract: `"text"`, `"email"`, `"tel"`, `"number"`, and `"url"`. Other input types (such as `password`, `search`, `textarea`, `select`, `checkbox`, `otp`, `currency`, or `pin`) are outside the current Input contract. Use the separate `PasswordInput` component for passwords.

### PasswordInput
```tsx
import { PasswordInput } from "./components/sorleed/password-input";

<PasswordInput
  label="Password"
  autoComplete="current-password"
  helperText="Use at least 12 characters."
/>
<PasswordInput label="New password" autoComplete="new-password" />
```

### PhoneInput
```tsx
import { PhoneInput } from "./components/sorleed/phone-input";

<PhoneInput label="Phone" defaultCountry="US" onChange={(result) => {
  console.log(result.inputValue, result.e164, result.isValid);
}} />
```

## Conflict behaviour and shared-file reuse

- **Shared files** (`components/sorleed/types/index.ts`, `styles/sorleed/tokens.css`) are reused only if their contents are byte-identical to the canonical sources.
- **If identical**: The file is reused (not copied) and reported as `REUSE`.
- **If different**: A conflict is reported and installation is aborted before copying any files. Existing files are never overwritten.
- **Component files**: If any destination exists, installation aborts before copying anything (no partial installs).
- **Repeated installs**: Conflicts are detected and no files are changed.
- **Rollback**: On copy errors, only files created by this operation are removed.

## Conflict resolution

There is currently **no `--force` or `--skip`** option. To resolve conflicts safely:
1. Remove or rename the conflicting files in your consumer project
2. Re-run the CLI installation
3. Or ensure shared files match the canonical sources byte-for-byte

## TypeScript CSS module declarations

If TypeScript reports errors for CSS side-effect imports (e.g., `Cannot find module or type declarations for side-effect import of '*.css'`), add a declaration file in your consumer project:

```ts
// css.d.ts
declare module "*.css" {
  const content: string;
  export default content;
}
```

## Current alpha limitations

- No `--force` or `--skip` flags.
- Supports Button, Input, PasswordInput and PhoneInput.
- Not published; the package and executables are private alpha.
- No browser rendering verification is performed by the CLI.
- Path traversal is rejected; some edge cases may be reported.
- The tool copies files from the repository; it does **not** publish components or overwrite existing files.

## Notes

- Copies from canonical sources in the repository; templates are parity-checked.
- The shared `react/types/index.ts` file includes Button, Input, PasswordInput and PhoneInput types.
- CSS imports require a bundler that supports CSS imports.
- Tokens must be loaded before component CSS.
