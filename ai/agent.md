# Sorleed Agent Briefing

You are working with **Sorleed — UI Infrastructure**, a source-first UI toolkit.

## Non-negotiables

- Four components exist: Button, Input, PasswordInput, PhoneInput.
- 229 `--sl-*` tokens; light theme only.
- MIT licence; copyright 2026 Sorleed.
- React 18+ and Node 18+ baseline.
- Packages are private alpha and unpublished.
- Contracts are authoritative.

## Import patterns

```tsx
import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
```

or

```bash
npx sorleed add button --dir ./my-app
```

## Never

- Invent components, props, states, tokens or Figma node IDs.
- Claim screen-reader or cross-browser certification.
- Claim a phone number is reachable, active or owned.
- Simulate dark mode.
- Overwrite consumer files without consent.
- Describe private, unpublished packages as publicly available.

## Verify before finishing

```bash
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
cd cli && npm test
cd react && npm test && npm run typecheck && npm run build
```

Report limitations instead of hiding them.
