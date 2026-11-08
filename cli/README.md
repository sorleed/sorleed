# @sorleed/cli

Source-distribution CLI for Sorleed fintech, banking, and accounting UI components.

Instead of heavy packaged runtimes, the Sorleed CLI installs clean, accessible TypeScript and CSS source files directly into your codebase (shadcn-style).

- **Package:** `@sorleed/cli`
- **Release:** `0.1.0-alpha.9`
- **License:** MIT
- **Homepage:** [https://sorleed.dev](https://sorleed.dev)
- **Repository:** [https://github.com/sorleed/sorleed](https://github.com/sorleed/sorleed)
- **Commands:** `sorleed`, `weft`, `fincore`

---

## 50+ Financial Components Available

Add any component directly to your project:

```bash
npx @sorleed/cli add <component>
```

| Category | Available Components |
| :--- | :--- |
| **Banking & Payments** | `balance-card`, `wallet-card`, `account-summary`, `transfer-receipt`, `currency-exchange`, `fee-breakdown`, `bank-selector`, `pin-input` |
| **Security & Privacy** | `password-input`, `biometric-auth-prompt`, `card-controls`, `virtual-card-generator`, `cvv` |
| **Lending & Credit** | `loan-calculator`, `credit-score-gauge`, `repayment-schedule` |
| **Wealth & Investment** | `portfolio-summary`, `asset-allocation`, `yield-curve-table` |
| **Accounting & Invoicing** | `invoice-viewer`, `expense-receipt-uploader`, `journal-entry-ledger`, `tax-summary-card`, `chart-of-accounts-tree` |
| **Compliance & Verification**| `kyc-doc-uploader`, `direct-debit-mandate`, `split-bill-calculator` |
| **Forms & Primitives** | `button`, `input`, `phone-input`, `currency`, `date-picker`, `select`, `checkbox`, `radio-group`, `switch`, `otp`, `textarea` |
| **Surfaces & Feedback** | `card`, `alert`, `badge`, `divider`, `skeleton`, `empty-state`, `modal`, `drawer`, `toast`, `tabs`, `table`, `pagination`, `accordion` |

---

## CLI Usage

### 1. Add a Component
```bash
npx @sorleed/cli add balance-card
```

### 2. Preview Installation (Dry Run)
Inspect destination files and dependencies without writing to disk:
```bash
npx @sorleed/cli add invoice-viewer --dry-run
```

### 3. Custom Output Directory
Specify where component sources should be placed:
```bash
npx @sorleed/cli add wallet-card --dir ./src/components/ui
```

---

## License

MIT © [Sorleed](https://github.com/sorleed/sorleed)
