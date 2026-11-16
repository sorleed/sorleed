---
name: sorleed
description: Official AI coding agent skill for Sorleed FinTech UI Infrastructure. Teaches agents how to select, install, and write bug-free code for all 80 financial, banking, wealth, and end-to-end flow components with exact TypeScript props, pure CSS design tokens, WCAG 2.2 AA accessibility, and Radix modal safety.
---

# Sorleed AI Agent Skill

This skill instructs AI coding assistants (Antigravity, Cursor, Claude Code, GitHub Copilot) how to accurately build financial, banking, and wealth interfaces using the **Sorleed Design System**.

## 1. Core Principles for AI Agents

1. **Zero Hallucination of Component Props:**
   - Always reference the exact TypeScript prop definitions. Never guess or substitute props (e.g., use `totalValue` for `<PortfolioSummary />`, NOT `netWorth` or `value`).
2. **Design Tokens First:**
   - Never generate arbitrary inline hex colors, margins, or padding. Always consume `--fc-*` CSS custom properties (e.g., `var(--fc-space-6)`, `var(--fc-color-surface-default)`).
3. **Financial Precision:**
   - Pass numeric financial values as numbers (e.g., `8450290.40`), not undefined or unformatted strings. Let the component format the currency and decimals.
4. **Client Components & SSR Safety:**
   - In Next.js App Router (`/app`), all interactive Sorleed components that manage state (e.g., `<BiometricAuthPrompt />`, `<AccountSummary />`, `<OTP />`, `<PinInput />`) MUST have `"use client";` at the top of the file.

---

## 2. Component Selection Matrix for Financial Flows

When building user flows, select the canonical Sorleed component:

| User Scenario | Recommended Component | CLI Command |
| :--- | :--- | :--- |
| **Two-Factor Auth / Wire Approval** | `<OTP />` | `npx @sorleed/cli add otp` |
| **PIN / Card Unlock / Transaction PIN** | `<PinInput />` | `npx @sorleed/cli add pin-input` |
| **Face ID / Touch ID Authorization** | `<BiometricAuthPrompt />` | `npx @sorleed/cli add biometric-auth-prompt` |
| **SEPA / Direct Debit Setup** | `<DirectDebitMandate />` | `npx @sorleed/cli add direct-debit-mandate` |
| **Bank Account & IBAN Summary** | `<AccountSummary />` | `npx @sorleed/cli add account-summary` |
| **Checking / Savings Balance Card** | `<BalanceCard />` | `npx @sorleed/cli add balance-card` |
| **Virtual Card Visualizer (Flip CVV)** | `<WalletCard />` | `npx @sorleed/cli add wallet-card` |
| **Wealth & Investment Overview** | `<PortfolioSummary />` | `npx @sorleed/cli add portfolio-summary` |
| **Expense & Receipt OCR Scanning** | `<ExpenseReceiptUploader />` | `npx @sorleed/cli add expense-receipt-uploader` |
| **General Ledger / Accounting Hierarchy** | `<ChartOfAccountsTree />` | `npx @sorleed/cli add chart-of-accounts-tree` |
| **Credit Rating / Score Dial** | `<CreditScoreGauge />` | `npx @sorleed/cli add credit-score-gauge` |
| **Loan & Mortgage EMI Calculator** | `<LoanCalculator />` | `npx @sorleed/cli add loan-calculator` |
| **Currency Conversion & FX Swap** | `<CurrencyExchange />` | `npx @sorleed/cli add currency-exchange` |
| **IBAN / Local Account Details** | `<IbanAccountDetails />` | `npx @sorleed/cli add iban-account-details` |
| **Saved Payee / Beneficiary Picker** | `<BeneficiaryPicker />` | `npx @sorleed/cli add beneficiary-picker` |
| **Daily / Monthly Transfer Limit Meter** | `<TransferLimitMeter />` | `npx @sorleed/cli add transfer-limit-meter` |
| **Standing Order Management Card** | `<StandingOrderCard />` | `npx @sorleed/cli add standing-order-card` |
| **KYC / KYB Identity Verification Flow** | `<KycVerificationFlow />` | `npx @sorleed/cli add kyc-verification-flow` |
| **Deposit & Account Funding Flow** | `<DepositFundingFlow />` | `npx @sorleed/cli add deposit-funding-flow` |
| **International / Domestic Money Transfer Flow** | `<MoneyTransferFlow />` | `npx @sorleed/cli add money-transfer-flow` |
| **Bank Withdrawal & Payout Flow** | `<WithdrawalPayoutFlow />` | `npx @sorleed/cli add withdrawal-payout-flow` |
| **Step-Up Authentication Flow** | `<StepUpAuthFlow />` | `npx @sorleed/cli add step-up-auth-flow` |
| **Personal & Business Account Opening Flow** | `<AccountOpeningFlow />` | `npx @sorleed/cli add account-opening-flow` |
| **Utility Bill & Vendor Invoice Payment Flow** | `<BillPaymentFlow />` | `npx @sorleed/cli add bill-payment-flow` |
| **Card Activation, Freeze & Limit Flow** | `<CardManagementFlow />` | `npx @sorleed/cli add card-management-flow` |
| **Transaction Dispute & Chargeback Flow** | `<DisputeClaimFlow />` | `npx @sorleed/cli add dispute-claim-flow` |
| **Recurring Payment / Standing Order Flow** | `<RecurringPaymentFlow />` | `npx @sorleed/cli add recurring-payment-flow` |
| **Multi-Currency FX Conversion Flow** | `<FXConversionFlow />` | `npx @sorleed/cli add fx-conversion-flow` |
| **Personal Loan & Business Credit Flow** | `<LoanApplicationFlow />` | `npx @sorleed/cli add loan-application-flow` |
| **Beneficiary Directory & Whitelist Flow** | `<BeneficiaryManagementFlow />` | `npx @sorleed/cli add beneficiary-management-flow` |
| **PDF / CSV Statement Export Flow** | `<StatementExportFlow />` | `npx @sorleed/cli add statement-export-flow` |
| **Account Closure & Balance Sweep Flow** | `<CloseAccountFlow />` | `npx @sorleed/cli add close-account-flow` |

---

## 3. Canonical Code Recipes

### Recipe A: Portfolio Net Worth Summary with Privacy Toggle
```tsx
"use client";

import React from "react";
import { PortfolioSummary } from "@/components/ui/portfolio-summary";

export function WealthDashboard() {
  return (
    <PortfolioSummary
      totalValue={8450290.40}
      currency="USD"
      returnsValue={42108.90}
      returnsPercentage={0.50}
      investedAmount={7200000.00}
      cashBalance={1250290.40}
      apy={4.85}
      allowToggleVisibility={true}
      defaultHidden={false}
    />
  );
}
```

### Recipe B: Biometric Wire Transfer Authorization Modal
```tsx
"use client";

import React, { useState } from "react";
import { BiometricAuthPrompt } from "@/components/ui/biometric-auth-prompt";

export function TransferScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "authenticating" | "success" | "error">("idle");

  const handleAuth = async () => {
    setStatus("authenticating");
    try {
      // Execute biometric signature...
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <BiometricAuthPrompt
      open={isOpen}
      onOpenChange={setIsOpen}
      type="face"
      status={status}
      title="Authorize High-Value Wire"
      description="Biometric verification required for transfers over $100,000 USD."
      amount={145000.00}
      currency="USD"
      onAuthenticate={handleAuth}
      onUsePasscode={() => console.log("Fallback to PIN")}
    />
  );
}
```

### Recipe C: 6-Digit OTP with Error Handling
```tsx
"use client";

import React, { useState } from "react";
import { OTP } from "@/components/ui/otp";

export function TwoFactorVerification() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleComplete = (completedCode: string) => {
    if (completedCode !== "849201") {
      setError("Invalid verification code. Please check and try again.");
    } else {
      setError(undefined);
    }
  };

  return (
    <OTP
      label="One-Time Verification Code (2FA)"
      length={6}
      value={code}
      onChange={setCode}
      onComplete={handleComplete}
      errorMessage={error}
    />
  );
}
```

---

## 4. Accessibility (WCAG 2.2 AA) Rules
1. Every input must have an accessible label (`label` prop or `aria-label`).
2. High-contrast state rules:
   - Default boundaries must have ≥ 3:1 contrast against adjacent surfaces.
   - Text elements must have ≥ 4.5:1 contrast against background fills.
3. Interactive cards must support full keyboard navigation (`Tab`, `Enter`, `Space`).

---

## 5. Machine-Readable Registry Reference
The complete machine-readable registry of all 80 components is available at:
`https://sorleed.com/registry.json`

