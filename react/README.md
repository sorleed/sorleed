# @sorleed/react

Sorleed React Component Library — precision financial, banking, investment, and accounting UI components built for accessible, secure applications with full design token fidelity.

- **Package:** `@sorleed/react`
- **Release:** `0.1.0-alpha.9`
- **License:** MIT
- **Homepage:** [https://sorleed.com](https://sorleed.com)
- **Repository:** [https://github.com/sorleed/sorleed](https://github.com/sorleed/sorleed)
- **Peer Dependencies:** `react >=18.0.0`, `react-dom >=18.0.0`
- **Optional Dependencies:** `libphonenumber-js` (for national telephone formatting & validation)
- **Radix UI Peer Dependencies:** `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@radix-ui/react-popover`, `@radix-ui/react-dialog` (for overlay/tabbed components)

---

## 50+ Specialized Financial Components

Sorleed provides a comprehensive component system spanning retail banking, wealth management, lending, corporate treasury, and SME accounting:

| Category | Components |
| :--- | :--- |
| **Retail Banking & Payments** | `BalanceCard`, `WalletCard`, `AccountSummary`, `TransferReceipt`, `CurrencyExchange`, `FeeBreakdown`, `BankSelector`, `PinInput` |
| **Security & Privacy** | `PasswordInput`, `BiometricAuthPrompt`, `CardControls`, `VirtualCardGenerator`, `CVV` |
| **Lending & Credit** | `LoanCalculator`, `CreditScoreGauge`, `RepaymentSchedule` |
| **Wealth & Investment** | `PortfolioSummary`, `AssetAllocation`, `YieldCurveTable` |
| **Accounting & Invoicing** | `InvoiceViewer`, `ExpenseReceiptUploader`, `JournalEntryLedger`, `TaxSummaryCard`, `ChartOfAccountsTree` |
| **Compliance & Verification** | `KycDocUploader`, `DirectDebitMandate`, `SplitBillCalculator` |
| **Form & Input Controls** | `Input`, `PhoneInput`, `Currency`, `DatePicker`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `OTP`, `Textarea` |
| **Data & Navigation** | `Table`, `Tabs`, `Pagination`, `Accordion`, `StatusIndicator`, `SpendingMeter` |
| **Surfaces & Feedback** | `Button`, `Card`, `Badge`, `Alert`, `Modal`, `Drawer`, `Toast`, `Tooltip`, `Popover`, `Divider`, `Skeleton`, `EmptyState`, `Avatar` |
| **Layout** | `Stack`, `Inline`, `Container` |

---

## Security & Privacy Guardrails

Financial interfaces require strict defense-in-depth:
- **Shoulder-Surfing Defense**: Native balance and account masking (`••••••••`) with accessible eye-toggle buttons (`BalanceCard`, `PortfolioSummary`, `AccountSummary`).
- **Social Receipt Redaction**: Built-in account masking (`01••••89`) on `TransferReceipt` for public proof-of-payment sharing.
- **Card Security & Burner Cards**: Self-serve card freeze toggles (`CardControls`) and single-use burner cards (`VirtualCardGenerator`).
- **Accounting Validation**: Real-time double-entry balancing enforcement ($\sum \text{Debit} = \sum \text{Credit}$) on `JournalEntryLedger`.

---

## Installation

```bash
npm install @sorleed/react
```

### Optional & Peer Dependencies
```bash
# For telephone dialing code validation
npm install libphonenumber-js

# For dialog, tab, and tooltip floating primitives
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-popover
```

---

## Usage Example

```tsx
import React from "react";
import { BalanceCard, InvoiceViewer, WalletCard } from "@sorleed/react";
import "@sorleed/react/styles/tokens.css";

export function FinancialDashboard() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <BalanceCard
        balance={142850.75}
        currency="USD"
        accountName="Treasury Reserve Account"
        accountNumber="4092817263"
        allowToggleVisibility
      />
    </div>
  );
}
```

---

## License

MIT © [Sorleed](https://github.com/sorleed/sorleed)
