# @sorleed/react

Sorleed React Component Library — production UI components engineered for precision, accessible financial interfaces, and design token fidelity.

- **Package:** `@sorleed/react`
- **Release:** `0.1.0-alpha.8`
- **Peer Dependencies:** `react >=18.0.0`, `react-dom >=18.0.0`
- **Optional Dependencies:** `libphonenumber-js` (for PhoneInput validation)
- **Radix UI Peer Dependencies:** `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-popover`, `@radix-ui/react-dialog` (for overlay/tabbed components)

---

## 28 Implemented Components

Sorleed provides 28 canonical, contract-backed components:

| Category | Components |
|---|---|
| **Buttons & Actions** | `Button` |
| **Form Controls** | `Input`, `PasswordInput`, `PhoneInput`, `Select`, `Checkbox`, `RadioGroup`, `Textarea`, `Switch`, `OTP` |
| **Fintech Primitives** | `Currency`, `CVV`, `DatePicker`, `TransactionItem`, `BalanceCard`, `AmountDisplay`, `StatusIndicator` |
| **Surfaces & Feedback** | `Card`, `Alert`, `Badge`, `Divider` |
| **Overlays & Floating** | `Tabs`, `Table`, `Tooltip`, `Popover`, `Drawer` |
| **Layout Primitives** | `Stack`, `Inline`, `Container` |

---

## Installation

```bash
npm install @sorleed/react
```

### Optional & Peer Dependencies
- **PhoneInput:** For country dialing codes and national validation:
  ```bash
  npm install libphonenumber-js
  ```
- **Radix UI Primitives:** The overlay and tab components (`Tabs`, `Tooltip`, `Popover`, `Drawer`) are built on headless Radix UI primitives for robust WAI-ARIA and keyboard navigation. If using these components, install the required peer packages:
  ```bash
  npm install @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-dialog
  ```

---

## Usage

Import tokens and component styles before using the components:

```tsx
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/button.css";
import "@sorleed/react/styles/input.css";

import { Button, Input, BalanceCard, AmountDisplay } from "@sorleed/react";

export function Dashboard() {
  return (
    <BalanceCard
      title="Checking Account"
      account="•••• 4242"
      amount={<AmountDisplay value="14,250.80" currency="$" variant="positive" />}
      footer={<Button variant="primary">Transfer Funds</Button>}
    />
  );
}
```

---

## Design Tokens & Dark Theme

Sorleed components consume standard `--fc-*` tokens generated from `tokens.json`. Dark theme is supported out of the box by toggling `[data-theme="dark"]` or `.dark` on any root or parent container.

---

## Documentation

Full interactive documentation, live playgrounds, and API specifications are available in the Sorleed repository and documentation portal.
