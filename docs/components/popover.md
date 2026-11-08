# Popover

Accessible interactive overlay anchored to a trigger. Canonical sources:
[`components/popover`](../../components/popover/README.md) and
[`contract.json`](../../components/popover/contract.json).

## Import

```tsx
import { Popover } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/popover.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `trigger` | `ReactElement` | `—` | Anchor element |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Built on Radix UI

`Popover` is built on `@radix-ui/react-popover`, providing non-modal and modal interactive overlay behaviors:
- **Focus trapping & restoration:** Safely moves focus inside the overlay upon trigger and restores it to the anchor on close.
- **Dismissal mechanisms:** Dismisses cleanly on `Escape` keypress or clicks outside the popover container.
- **Portaling & positioning:** Renders via portals into `document.body` with configurable collision detection.
- **ARIA attributes:** Sets `aria-haspopup="dialog"`, `aria-expanded`, and links `aria-controls`.
- **Peer dependency:** `@radix-ui/react-popover >=1.0.0`.

## Tokens

Consumes `--fc-popover-*` component tokens exclusively.
