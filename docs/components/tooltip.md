# Tooltip

Contextual floating hint triggered on hover or focus. Canonical sources:
[`components/tooltip`](../../components/tooltip/README.md) and
[`contract.json`](../../components/tooltip/contract.json).

## Import

```tsx
import { Tooltip } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/tooltip.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `ReactNode` | `—` | Tooltip label content |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Built on Radix UI

`Tooltip` is built on `@radix-ui/react-tooltip`, ensuring robust accessibility and collision management:
- **Hover & Focus timing:** Controlled display delays preventing accidental flashes while moving the pointer.
- **Escape dismissal:** Pressing `Escape` immediately dismisses the active tooltip without shifting focus.
- **Collision avoidance:** Automatically repositions or flips when rendered near viewport boundaries.
- **ARIA attributes:** Adds `role="tooltip"` and links to the anchor element via `aria-describedby`.
- **Peer dependency:** `@radix-ui/react-tooltip >=1.0.0`.

## Tokens

Consumes `--fc-tooltip-*` component tokens exclusively.
