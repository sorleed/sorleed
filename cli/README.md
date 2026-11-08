# @sorleed/cli

Source-distribution CLI for Sorleed components.

Instead of installing heavy bundled dependencies, the Sorleed CLI copies canonical, contract-tested component source files directly into your consumer project.

- **Package:** `@sorleed/cli`
- **Release:** `0.1.0-alpha.5`
- **Commands:** `sorleed`, `weft`, `fincore`

---

## 28 Supported Components

You can add any of the 28 Sorleed components directly into your codebase:

```bash
npx @sorleed/cli add <component>
```

| Category | Available Components |
|---|---|
| **Buttons & Actions** | `button` |
| **Form Controls** | `input`, `password-input`, `phone-input`, `select`, `checkbox`, `radio-group`, `textarea`, `switch`, `otp` |
| **Fintech Primitives** | `currency`, `cvv`, `date-picker`, `transaction-item`, `balance-card`, `amount-display`, `status-indicator` |
| **Surfaces & Feedback** | `card`, `alert`, `badge`, `divider` |
| **Overlays & Floating** | `tabs`, `table`, `tooltip`, `popover`, `drawer` |
| **Layout Primitives** | `stack`, `inline`, `container` |

---

## Usage

### 1. Add a Component
```bash
npx @sorleed/cli add balance-card
```

### 2. Preview Installation (Dry Run)
Inspect files and target paths without writing to disk:
```bash
npx @sorleed/cli add transaction-item --dry-run
```

### 3. Specify Target Directory
```bash
npx @sorleed/cli add card --dir ./src/ui
```

---

## Radix UI Peer Dependencies

Components that require complex floating or roving focus behavior (`tabs`, `tooltip`, `popover`, `drawer`) are built on unstyled [Radix UI](https://www.radix-ui.com/) primitives. When adding any of these components, ensure your project installs the corresponding Radix dependency:

| Component | Required Dependency |
|---|---|
| `tabs` | `@radix-ui/react-tabs` |
| `tooltip` | `@radix-ui/react-tooltip` |
| `popover` | `@radix-ui/react-popover` |
| `drawer` | `@radix-ui/react-dialog` |

All other 24 components are 100% native with zero external runtime dependencies.

---

## What Gets Copied

When you add a component:
1. **Component implementation (`.tsx`):** Self-contained, typed React component.
2. **Component styles (`.css`):** Scoped CSS consuming token variables.
3. **Shared Types (`types/index.ts`):** Complete TypeScript definitions.
4. **Token definitions (`tokens.css`):** Canonical design system tokens with dark-theme support.

---

## License

MIT
