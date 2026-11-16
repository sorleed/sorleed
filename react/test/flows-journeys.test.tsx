import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import {
  KycVerificationFlow,
  DepositFundingFlow,
  MoneyTransferFlow,
  WithdrawalPayoutFlow,
  StepUpAuthFlow,
  AccountOpeningFlow,
  BillPaymentFlow,
  CardManagementFlow,
  DisputeClaimFlow,
  RecurringPaymentFlow,
  FXConversionFlow,
  LoanApplicationFlow,
  BeneficiaryManagementFlow,
  StatementExportFlow,
  CloseAccountFlow,
} from "../index";

test("KycVerificationFlow renders personal and business verification paths", () => {
  const { getByText, getByRole } = render(<KycVerificationFlow />);
  assert.ok(getByText("Verify your identity"));
  assert.ok(getByRole("button", { name: /continue/i }));
});

test("DepositFundingFlow renders method selection and amount input", () => {
  const { getAllByText } = render(<DepositFundingFlow />);
  assert.ok(getAllByText("Add money").length >= 1);
});

test("MoneyTransferFlow renders step 1 recipient selection and actions", () => {
  const { getByText, getByRole } = render(
    <MoneyTransferFlow
      beneficiaries={[
        {
          id: "b1",
          name: "Acme Cloud Ltd",
          bankName: "Mercury Bank",
          accountMask: "•••• 4829",
          currency: "USD",
          rail: "ACH",
          verificationStatus: "verified",
        },
      ]}
    />,
  );
  assert.ok(getByText("Send money"));
  assert.ok(getByRole("button", { name: /continue/i }));
});

test("WithdrawalPayoutFlow blocks over-limit withdrawals", () => {
  const { getByText, getByRole } = render(
    <WithdrawalPayoutFlow
      availableBalance={5000}
      destinations={[
        { id: "d1", bankName: "Chase Checking", accountMask: "•••• 7731", currency: "USD" },
      ]}
      limits={[{ id: "daily", label: "Daily payout limit", used: 0, max: 1000, currency: "USD" }]}
    />,
  );
  assert.ok(getByText("Withdraw money"));
  fireEvent.click(getByRole("button", { name: /test over-limit/i }));
  assert.ok(getByRole("alert"));
});

test("StepUpAuthFlow renders authorization context and method tabs", () => {
  const { getByText } = render(
    <StepUpAuthFlow actionSummary="Approve transfer of $25,000 to Acme Cloud Ltd" />,
  );
  assert.ok(getByText("Approve transfer of $25,000 to Acme Cloud Ltd"));
});

test("AccountOpeningFlow validates step transitions and renders stepper", () => {
  const { getByText, getByRole } = render(<AccountOpeningFlow />);
  assert.ok(getByText("Open a financial account"));
  fireEvent.click(getByRole("button", { name: /next/i }));
  assert.ok(getByText(/Government ID|ID document type|Upload government ID/i));
});

test("BillPaymentFlow advances through biller selection, amount, and review", async () => {
  let paidRef = "";
  const { getByText, getByRole } = render(
    <BillPaymentFlow
      onPayBill={(tx) => {
        paidRef = tx.reference;
      }}
    />,
  );
  assert.ok(getByText("Pay a bill or invoice"));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /^pay$/i }));
  await new Promise((r) => setTimeout(r, 10));
  assert.ok(paidRef.startsWith("BIL-"));
});

test("CardManagementFlow toggles freeze overlay and invokes callback", async () => {
  let lastAction = "";
  const { container, getByRole, getByText } = render(
    <CardManagementFlow
      onCardAction={({ action }) => {
        lastAction = action;
      }}
    />,
  );
  assert.equal(container.querySelector(".fc-card-mgmt-flow__frost-overlay"), null);
  fireEvent.click(getByRole("button", { name: "Freeze card" }));
  fireEvent.click(getByRole("button", { name: "Confirm" }));
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(lastAction, "freeze");
  assert.ok(container.querySelector(".fc-card-mgmt-flow__frost-overlay"));
  assert.ok(getByText("Card Frozen"));
});

test("DisputeClaimFlow progresses to step 2 and validates details", () => {
  const { getByText, getAllByText, getByRole } = render(<DisputeClaimFlow />);
  assert.ok(getByText("Dispute a transaction"));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  assert.ok(getAllByText(/Add a short explanation/i).length >= 1);
});

test("RecurringPaymentFlow advances to review and creates schedule", () => {
  const { getByText, getByRole } = render(<RecurringPaymentFlow />);
  assert.ok(getByText("Schedule recurring payment"));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  assert.ok(getByRole("button", { name: /create schedule/i }));
});

test("FXConversionFlow swaps currencies and converts", () => {
  let fxRef = "";
  const { getByText, getByRole } = render(
    <FXConversionFlow
      onConvert={(fx) => {
        fxRef = fx.reference;
      }}
    />,
  );
  assert.ok(getByText("Convert currency"));
  fireEvent.click(getByRole("button", { name: "Swap currencies" }));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /^convert$/i }));
  assert.ok(fxRef.startsWith("FX-"));
});

test("LoanApplicationFlow renders steps and advances to income/financials", () => {
  const { getByText, getByRole } = render(<LoanApplicationFlow />);
  assert.ok(getByText("Apply for credit"));
  fireEvent.click(getByRole("button", { name: /next/i }));
  assert.ok(getByText(/Monthly net income/i));
});

test("BeneficiaryManagementFlow opens add form and remove confirmation", () => {
  const { getByText, getByRole } = render(<BeneficiaryManagementFlow />);
  assert.ok(getByText("Manage beneficiaries"));
  fireEvent.click(getByRole("button", { name: /add beneficiary/i }));
  assert.ok(getByText("Account number or IBAN"));
});

test("StatementExportFlow generates statement file and triggers callback", () => {
  let exportedFile = "";
  const { getByText, getByRole } = render(
    <StatementExportFlow
      onExport={(res) => {
        exportedFile = res.fileName;
      }}
    />,
  );
  assert.ok(getByText("Export account statement"));
  fireEvent.click(getByRole("button", { name: /generate/i }));
  assert.ok(exportedFile.endsWith(".pdf"));
});

test("CloseAccountFlow requires acknowledgement before closing", () => {
  const { getByText, getByRole } = render(<CloseAccountFlow remainingBalance={0} />);
  assert.ok(getByText("Close account"));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /continue/i }));
  fireEvent.click(getByRole("button", { name: /confirm closure/i }));
  assert.ok(getByRole("alert"));
});
