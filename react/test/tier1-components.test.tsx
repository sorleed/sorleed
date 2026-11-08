import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { BalanceCard } from "../balance-card";
import { AccountSummary } from "../account-summary";
import { TransferReceipt } from "../transfer-receipt";
import { CurrencyExchange } from "../currency-exchange";
import { FeeBreakdown } from "../fee-breakdown";
import { Skeleton } from "../skeleton";
import { EmptyState } from "../empty-state";

// --- BALANCECARD SECURITY & PRIVACY ---
test("BalanceCard privacy toggle masks and unmasks sensitive balance", () => {
  let toggledState = false;
  const { getByRole, getByText } = render(
    <BalanceCard
      title="Checking Balance"
      amount="$12,450.00"
      allowToggleVisibility={true}
      onToggleVisibility={(hidden) => { toggledState = hidden; }}
    />
  );

  const toggleBtn = getByRole("button", { name: "Hide balance" });
  assert.ok(toggleBtn);
  assert.equal(getByText("$12,450.00").textContent, "$12,450.00");

  // Click eye button to hide balance
  fireEvent.click(toggleBtn);
  assert.equal(toggledState, true);
  assert.ok(getByText("••••••••"));
  assert.equal(toggleBtn.getAttribute("aria-label"), "Show balance");

  // Click eye button again to restore balance
  fireEvent.click(toggleBtn);
  assert.equal(toggledState, false);
  assert.ok(getByText("$12,450.00"));
});

// --- ACCOUNTSUMMARY SECURITY & PRIVACY ---
test("AccountSummary privacy toggle masks account and routing numbers", () => {
  const { getByRole, getByText, queryByText } = render(
    <AccountSummary
      bankName="Mercury"
      accountName="Acme Corp"
      accountNumber="9876543210"
      routingOrSortCode="123456"
      balance="$50,000.00"
      allowToggleVisibility={true}
    />
  );

  const toggleBtn = getByRole("button", { name: "Hide sensitive details" });
  assert.ok(toggleBtn);
  assert.ok(getByText("9876543210"));

  // Toggle privacy mode on
  fireEvent.click(toggleBtn);
  assert.equal(toggleBtn.getAttribute("aria-label"), "Show sensitive details");
  assert.ok(getByText("••••3210"), "Should display masked account number ending in last 4 digits");
  assert.ok(getByText("••••••••"), "Should display masked balance");
  assert.equal(queryByText("9876543210"), null, "Plain account number must not be exposed");
});

// --- TRANSFERRECEIPT ACCESSIBILITY & SHARING REDACTION ---
test("TransferReceipt renders proof of transfer and supports account redaction for social sharing", () => {
  const { getByRole, getByLabelText, getByText } = render(
    <TransferReceipt
      reference="TRX-98234-912"
      amount={2500}
      currency="USD"
      status="success"
      recipientName="Dr. Sarah Connor"
      recipientBank="JP Morgan Chase"
      recipientAccount="4455667788"
      allowRedaction={true}
    />
  );

  const region = getByRole("region", { name: "Transaction Receipt" });
  assert.ok(region);
  assert.ok(getByText("TRX-98234-912"));
  assert.ok(getByText("4455667788"));

  // Toggle redaction checkbox
  const redactCheckbox = getByLabelText("Redact sensitive account numbers for sharing");
  fireEvent.click(redactCheckbox);
  assert.ok(getByText("44••••88"), "Recipient account should be redacted with leading and trailing digits");
});

// --- CURRENCYEXCHANGE ACCESSIBILITY & SWAP ---
test("CurrencyExchange supports two-way input and currency swap action", () => {
  let swapped = false;
  let baseAmt = "";
  const { getByRole, getByLabelText } = render(
    <CurrencyExchange
      baseCurrency="USD"
      targetCurrency="EUR"
      baseAmount="100"
      targetAmount="92.50"
      exchangeRate={0.925}
      onSwapCurrencies={() => { swapped = true; }}
      onBaseAmountChange={(val) => { baseAmt = val; }}
    />
  );

  const swapBtn = getByRole("button", { name: "Swap USD and EUR" });
  assert.ok(swapBtn);
  fireEvent.click(swapBtn);
  assert.equal(swapped, true, "Clicking swap button must trigger onSwapCurrencies");

  const sendInput = getByLabelText("Send amount in USD");
  fireEvent.input(sendInput, { target: { value: "250" } });
  assert.equal(baseAmt, "250");
});

// --- FEEBREAKDOWN ACCESSIBILITY & TOTALS ---
test("FeeBreakdown clearly calculates total fees and net recipient payout", () => {
  const fees = [
    { label: "Transfer fee", amount: "2.50" },
    { label: "Network clearance", amount: "0.75" },
    { label: "Promotional waiver", amount: "1.00", isDiscount: true }
  ];

  const { getByRole, getByText } = render(
    <FeeBreakdown
      fees={fees}
      currency="USD"
      totalFee="2.25"
      recipientGets="97.75"
    />
  );

  const region = getByRole("region", { name: "Fee Breakdown" });
  assert.ok(region);
  assert.ok(getByText("USD 2.25"));
  assert.ok(getByText("USD 97.75"));
  assert.ok(getByText("-USD 1.00"));
});

// --- SKELETON ACCESSIBILITY ---
test("Skeleton renders accessible aria-busy loading indicator", () => {
  const { getByRole } = render(
    <Skeleton variant="rectangular" width={200} height={40} />
  );
  const skeleton = getByRole("status");
  assert.equal(skeleton.getAttribute("aria-busy"), "true");
  assert.equal(skeleton.getAttribute("aria-label"), "Loading content...");
});

// --- EMPTYSTATE ACCESSIBILITY ---
test("EmptyState renders title, description, and primary call to action", () => {
  let clickedAction = false;
  const { getByRole, getByText } = render(
    <EmptyState
      title="No transactions yet"
      description="Start by adding funds to your balance"
      action={<button onClick={() => { clickedAction = true; }}>Add Money</button>}
    />
  );

  const region = getByRole("region", { name: "Empty State" });
  assert.ok(region);
  assert.ok(getByText("No transactions yet"));
  assert.ok(getByText("Start by adding funds to your balance"));

  const actionBtn = getByText("Add Money");
  fireEvent.click(actionBtn);
  assert.equal(clickedAction, true);
});
