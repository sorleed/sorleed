# Installation and Setup

## Option 1 — React package (`@sorleed/react`)

The package is private alpha and unpublished. When it is available to your
environment, install it beside React 18 or newer:

```bash
npm install @sorleed/react react react-dom
# optional, only for PhoneInput
npm install libphonenumber-js
```

Import the components and the generated CSS:

```tsx
import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
import "@sorleed/react/styles/input.css";
import "@sorleed/react/styles/password-input.css";
import "@sorleed/react/styles/phone-input.css";
```

Tokens must load before component styles. All five stylesheets are exported by
the package.

Supported baseline: React 18+, React DOM 18+, Node 18+ for tooling. The package
is ESM.

## Option 2 — CLI source distribution (`@sorleed/cli`)

```bash
npx sorleed list
npx sorleed add button --dir ./my-app
npx sorleed add input --dir ./my-app
npx sorleed add password-input --dir ./my-app
npx sorleed add phone-input --dir ./my-app
```

Each component copies:

```text
components/sorleed/<component>/index.tsx
components/sorleed/types/index.ts    (shared)
styles/sorleed/<component>.css
styles/sorleed/tokens.css            (shared)
```

Existing files are never overwritten. Use `--dry-run` to preview.

For PhoneInput, install `libphonenumber-js` in the consumer project.

## Option 3 — plain HTML and CSS

Copy the token CSS and the component CSS, then use the canonical markup from
`components/<component>/<component>.html`:

```html
<link rel="stylesheet" href="styles/sorleed/tokens.css">
<link rel="stylesheet" href="styles/sorleed/button.css">
<link rel="stylesheet" href="styles/sorleed/input.css">
```

No build step and no package manager are required for the core HTML/CSS usage.

## CSS order

1. `tokens.css`
2. component stylesheets

Component stylesheets do not import tokens automatically. Loading a component
sheet without the token sheet leaves its variables undefined.
