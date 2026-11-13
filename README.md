# Sorleed UI Infrastructure

An open-source, source-first financial UI infrastructure, design system, and React component toolkit for fintech, banking, wealth, and accounting interfaces.

**[Documentation & Live Playground →](https://sorleed.com)** · **[Component Reference →](https://sorleed.com/components/balance-card)** · **[AI Agent Skill →](https://sorleed.com/docs#ai-skill)**

Sorleed provides designers, developers, and AI coding agents with a shared, token-driven foundation for building accessible, predictable financial products with zero runtime lock-in.

---

## Why Sorleed?

Financial products repeatedly solve the same high-stakes interface challenges:

* Authentication, 2FA OTP, PIN & Biometrics
* Balances, Wallets, Cards & Transfers
* Currency Exchange, Lending & Yield
* Double-Entry Bookkeeping, Invoices & Tax Summaries
* KYC Verification & Compliance

Designers redesign them. Developers rebuild them. AI generates them inconsistently.

[Sorleed UI Infrastructure](https://sorleed.com) establishes a single canonical source of truth combining WCAG 2.1 AA CSS components, TypeScript React adapters, generated `--fc-*` design tokens, and machine-readable AI agent skills.

---

## Quick Start

### Option 1: Copy Source-Owned Components via CLI (Recommended)

Install any component directly into your codebase with its CSS, TypeScript definitions, design tokens, and official AI Agent Skill (`.agent/skills/sorleed/SKILL.md` and `.gemini/skills/sorleed/SKILL.md`):

```bash
npx @sorleed/cli add balance-card
```

### Option 2: Install the React Package

```bash
npm install @sorleed/react@alpha
```

```tsx
import { BalanceCard } from '@sorleed/react';
import '@sorleed/react/styles/tokens.css';
import '@sorleed/react/styles/balance-card.css';

export function TreasuryOverview() {
  return (
    <BalanceCard
      title="Primary Checking"
      account="•••• 9012"
      amount="$42,850.75"
    />
  );
}
```

---

## What's Included (`v0.1.0-alpha.11`)

- **61 Production Components** across Core Primitives, Banking & Payments, Lending & Wealth, and Double-Entry Accounting:
  - **Core & Form Primitives:** `Button`, `Input`, `PasswordInput`, `PhoneInput`, `Select`, `Checkbox`, `RadioGroup`, `Textarea`, `Switch`, `Card`, `Alert`, `Tabs`, `Table`, `Badge`, `Tooltip`, `Popover`, `Drawer`, `Modal`, `Toast`, `Accordion`, `Pagination`, `Skeleton`, `EmptyState`, `Avatar`, `Divider`, `Stack`, `Inline`, `Container`
  - **Financial & Banking:** `BalanceCard`, `WalletCard`, `TransactionItem`, `AmountDisplay`, `Currency`, `CurrencyExchange`, `OTP`, `PinInput`, `CVV`, `DatePicker`, `BankSelector`, `CardControls`, `TransferReceipt`, `BiometricAuthPrompt`, `VirtualCardGenerator`, `DirectDebitMandate`, `StatusIndicator`
  - **Lending, Credit & Wealth:** `LoanCalculator`, `RepaymentSchedule`, `CreditScoreGauge`, `PortfolioSummary`, `AssetAllocation`, `YieldCurveTable`, `SpendingMeter`, `SplitBillCalculator`, `FeeBreakdown`, `KycDocUploader`
  - **Accounting & Bookkeeping:** `InvoiceViewer`, `ExpenseReceiptUploader`, `JournalEntryLedger`, `TaxSummaryCard`, `ChartOfAccountsTree`
- **708 Generated Design Tokens (`--fc-*`)** with automated WCAG 2.1 AA contrast validation (`tokens/check.mjs`).
- **AI Agent Skill & Registry:** [`skills/sorleed/SKILL.md`](skills/sorleed/SKILL.md) and [`registry.json`](registry.json) for Google Antigravity, Gemini CLI, Claude Code, and Cursor.
- **Interactive Documentation:** Full live component playground at [https://sorleed.com](https://sorleed.com).

---

## AI Agent Integration

Install the official Sorleed skill so AI coding agents use exact TypeScript props, `--fc-*` tokens, and financial guardrails:

```bash
# Google Antigravity & Gemini CLI
curl -s https://sorleed.com/skills/SKILL.md -o .gemini/skills/sorleed/SKILL.md

# Claude Code / Agent Skill Engine
curl -s https://sorleed.com/skills/SKILL.md -o .agent/skills/sorleed/SKILL.md
```

Or read [`https://sorleed.com/llms.txt`](https://sorleed.com/llms.txt) and [`https://sorleed.com/registry.json`](https://sorleed.com/registry.json).

---

## Architecture & Radix UI Primitives

Most Sorleed components (`Button`, `Input`, `Card`, `Alert`, `Table`, `Badge`, `Switch`, and financial primitives) are native HTML/CSS implementations without external runtime dependencies.

For complex floating overlays and accessible keyboard interactions, Sorleed uses unstyled [Radix UI](https://www.radix-ui.com/) headless primitives styled exclusively with Sorleed `--fc-*` tokens:

- **Tabs:** `@radix-ui/react-tabs`
- **Tooltip:** `@radix-ui/react-tooltip`
- **Popover:** `@radix-ui/react-popover`
- **Drawer / Dialog:** `@radix-ui/react-dialog`

```bash
npm install @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-dialog
```

---

## Verification

Run token, contract, template parity, TypeScript, and CLI checks locally:

```bash
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
npm --prefix react run typecheck
npm --prefix cli test
```

---

## Repository Structure

```text
sorleed/
├── cli/          # @sorleed/cli source-first installer & templates
├── components/   # Canonical CSS, HTML reference markup & JSON contracts
├── react/        # @sorleed/react TypeScript component adapters & dist
├── skills/       # Official AI Agent Skill (SKILL.md)
├── tokens/       # Three-layer design token source & WCAG AA checker
├── website/      # Production documentation & interactive playground (sorleed.com)
├── registry.json # Machine-readable component & prop registry
└── LICENSE       # MIT License
```

---

## Contributing

We welcome designers, developers, technical writers, and product thinkers.
Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting contributions.

---

## License

MIT License — see [LICENSE](LICENSE).
