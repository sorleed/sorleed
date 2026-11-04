# Sorleed CLI — Alpha Tester Guide

**Status: private alpha. `@sorleed/cli` 0.1.0-alpha.0 is not published.**

This guide is based on the current implementation and documentation.

## What this is
Sorleed CLI is a source-distribution tool. It copies canonical component files into your consumer project.

## Prerequisites
- Node.js with ESM support
- A React + TypeScript consumer project (bundler recommended for CSS imports)
- For TypeScript CSS side-effect imports, you may need `declare module "*.css"` in a `.d.ts` file

## Supported components
- `button` - Sorleed Button (React + TypeScript)
- `input` - Sorleed Input (React + TypeScript)
- `password-input` - Sorleed PasswordInput (React + TypeScript)
- `phone-input` - Sorleed PhoneInput (React + TypeScript)

## Getting started

Using `npx` (from installed package):
```bash
npx sorleed add button --dir /path/to/your-app
```

Or from the repository:

### Preview only — no files copied
Add `--dry-run` to see what would be copied without writing anything:

```bash
node cli/bin/sorleed.mjs add button --dir /path/to/your-app --dry-run
```

### Install — copies files
Omit `--dry-run` to perform the actual file copy:

```bash
node cli/bin/sorleed.mjs add button --dir /path/to/your-app
node cli/bin/sorleed.mjs add input --dir /path/to/your-app
node cli/bin/sorleed.mjs add password-input --dir /path/to/your-app
node cli/bin/sorleed.mjs add phone-input --dir /path/to/your-app
```

Use `--dir` to target your consumer project root. Paths are resolved and must stay within the consumer directory.

## What gets copied
Each component copies:
- `components/sorleed/<component>/index.tsx` (button/input/password-input/phone-input)
- `components/sorleed/types/index.ts` (shared across all four components; contains types for all supported components)
- `styles/sorleed/<component>.css` (button/input/password-input/phone-input)
- `styles/sorleed/tokens.css` (shared)

## Dependencies
- **Button, Input and PasswordInput**: No extra runtime dependencies (peer deps: `react >=18.0.0`, `react-dom >=18.0.0`)
- **PhoneInput**: Requires `libphonenumber-js` at runtime for phone-number parsing and validation. Install it in your consumer project:
  ```bash
  npm install libphonenumber-js
  ```
  Button, Input and PasswordInput do not require this dependency.
  - Note: `@types/node` is **not** a requirement of PhoneInput or Sorleed. If a consumer project encounters TypeScript errors for `node:*` imports (such as `node:path`), this typically originates from the consumer's own build tooling or Node-based configuration (e.g. `vite.config.ts`); diagnose the consumer's configuration rather than treating it as a PhoneInput requirement.

## CSS imports (order matters)
Import tokens first, then component styles:

```tsx
import "./styles/sorleed/tokens.css";
import "./styles/sorleed/button.css";
import "./styles/sorleed/input.css";
import "./styles/sorleed/password-input.css";
import "./styles/sorleed/phone-input.css";
```

## Usage examples

### Button
```tsx
import { Button } from "./components/sorleed/button";

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>
<Button onClick={() => {}}>Click</Button>
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

## TypeScript CSS module declarations
If you see errors like `Cannot find module or type declarations for side-effect import of '*.css'`, add:

```ts
// css.d.ts
declare module "*.css" {
  const content: string;
  export default content;
}
```

## Conflict behavior & shared-file reuse
- **Shared files** (`types/index.ts`, `tokens.css`) are reused only if byte-identical to canonical sources. If identical, reported as `REUSE`. If different, installation aborts before copying any files.
- **Component files**: If any destination exists, installation aborts before copying anything.
- **Repeated installs**: Conflicts are detected, no files are changed.
- **Rollback**: On copy errors, only files created by this operation are removed.
- **No overwrite**: Existing files are never silently overwritten.

## Conflict resolution
There is currently **no `--force` or `--skip`** option. To resolve:
1. Remove or rename conflicting files in your consumer project
2. Re-run the CLI installation
3. Or ensure shared files match canonical sources byte-for-byte

## Alpha limitations
- Not published; private alpha only
- No `--force` or `--skip` flags
- Supports Button, Input, PasswordInput and PhoneInput
- CLI does not verify browser rendering
- Path traversal is rejected; some edge cases may be reported
- Tool copies from repository files - it does **not** publish components or overwrite existing files

## Testing checklist for alpha testers
1. [ ] Run dry-run (`--dry-run`) and verify output shows no files written
2. [ ] Install one or more components into a test project (omit `--dry-run`)
3. [ ] Install in different orders to verify shared file reuse
4. [ ] Test repeated install (should report conflicts, no changes)
5. [ ] Install PhoneInput and add `libphonenumber-js` dependency
6. [ ] Install PasswordInput and verify the toggle is a native button and preserves the value
7. [ ] Import tokens first, then component CSS
8. [ ] Use components in React + TypeScript app, run `tsc --noEmit`
9. [ ] Build with your bundler (e.g., Vite) to verify CSS/tokens load
10. [ ] Report any conflicts, errors, or unexpected behavior

## Reporting issues
Please report: CLI command used, consumer project structure, error messages, Node/npm versions, and whether files were modified/overwritten.
