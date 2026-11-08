# Drawer

Slide-out overlay dialog for focused workflows and sidebars. Canonical sources:
[`components/drawer`](../../components/drawer/README.md) and
[`contract.json`](../../components/drawer/contract.json).

## Import

```tsx
import { Drawer } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/drawer.css";
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled open state |
| native attributes | `HTMLAttributes<HTMLElement>` | — | Standard HTML attributes pass through. |

## Accessibility

- Conforms to WCAG 2.2 AA standards.
- Token contrast verified against standard surfaces.
- Preserves high-contrast / forced-colors indicators.

## Built on Radix UI

`Drawer` is built on `@radix-ui/react-dialog`, providing accessible modal sheet primitives:
- **Focus trapping:** Restricts keyboard navigation inside the open drawer and restores focus on dismissal.
- **Scroll locking:** Prevents body background scrolling while the overlay is visible.
- **Dismissal triggers:** Dismisses on backdrop click, explicit close button, or pressing `Escape`.
- **ARIA conformance:** Automatic `role="dialog"`, `aria-modal="true"`, and label/description associations.
- **Peer dependency:** `@radix-ui/react-dialog >=1.0.0`.

## Tokens

Consumes `--fc-drawer-*` component tokens exclusively.
