import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { BiometricAuthPrompt } from "../biometric-auth-prompt";
import { VirtualCardGenerator } from "../virtual-card-generator";
import { SplitBillCalculator } from "../split-bill-calculator";
import { YieldCurveTable } from "../yield-curve-table";
import { DirectDebitMandate } from "../direct-debit-mandate";

// --- BIOMETRIC AUTH PROMPT (RADIX DIALOG) ---
test("BiometricAuthPrompt opens via Radix Dialog, shows amount, and fires authenticate callback", () => {
  let authenticated = false;
  let passcodeRequested = false;

  const { getByRole, getByText } = render(
    <BiometricAuthPrompt
      open={true}
      type="face"
      status="idle"
      amount={450}
      currency="USD"
      onAuthenticate={() => {
        authenticated = true;
      }}
      onUsePasscode={() => {
        passcodeRequested = true;
      }}
    />
  );

  const dialog = getByRole("dialog");
  assert.ok(dialog);
  assert.ok(getByText("Authenticate Transaction"));
  assert.ok(getByText("USD 450"));

  const authBtn = getByRole("button", { name: "Verify with Face ID" });
  fireEvent.click(authBtn);
  assert.equal(authenticated, true);

  const passcodeBtn = getByRole("button", { name: "Use Passcode / PIN instead" });
  fireEvent.click(passcodeBtn);
  assert.equal(passcodeRequested, true);
});

// --- VIRTUAL CARD GENERATOR ---
test("VirtualCardGenerator renders live preview, theme selection, and create callback", () => {
  let createdData = null;

  const { getByRole, getByLabelText } = render(
    <VirtualCardGenerator
      cardholderName="JANE DOE"
      onCreateCard={(data) => {
        createdData = data;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Create Virtual Card" }));

  // Change spending limit
  const slider = getByLabelText("Spending Limit Slider");
  fireEvent.input(slider, { target: { value: "1200" } });

  // Issue card
  const submitBtn = getByRole("button", { name: "Issue Virtual Card" });
  fireEvent.click(submitBtn);

  assert.ok(createdData);
  assert.equal(createdData.cardholderName, "JANE DOE");
  assert.equal(createdData.limit, 1200);
});

// --- SPLIT BILL CALCULATOR ---
test("SplitBillCalculator divides total across participants with tip selector", () => {
  let paymentRequest = null;

  const { getByRole, getAllByText } = render(
    <SplitBillCalculator
      initialBill={100}
      initialParticipants={[
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
      ]}
      onRequestPayment={(req) => {
        paymentRequest = req;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Split Bill Calculator" }));

  // 15% tip on 100 = 115 total / 2 = 57.50
  assert.ok(getAllByText("USD 57.50").length > 0);

  // Select 20% tip (100 + 20 = 120 / 2 = 60.00)
  const tip20Btn = getByRole("radio", { name: "20% Tip" });
  fireEvent.click(tip20Btn);
  assert.ok(getAllByText("USD 60.00").length > 0);

  const sendBtn = getByRole("button", { name: "Send Split Payment Requests" });
  fireEvent.click(sendBtn);
  assert.ok(paymentRequest);
  assert.equal(paymentRequest.perPersonShare, 60);
});

// --- YIELD CURVE TABLE ---
test("YieldCurveTable renders maturity tenors and invest action", () => {
  let selectedTenor = null;

  const { getByRole, getByText } = render(
    <YieldCurveTable
      rates={[
        { tenor: "1 Year", yieldPercent: 5.1, instrument: "T-Bill" },
        { tenor: "10 Year", yieldPercent: 4.25, instrument: "T-Bond" },
      ]}
      onSelectTenor={(rate) => {
        selectedTenor = rate;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Treasury Yield Curve & Maturities" }));
  assert.ok(getByText("5.10%"));
  assert.ok(getByText("4.25%"));

  const investBtn = getByRole("button", { name: "Invest in 1 Year treasury" });
  fireEvent.click(investBtn);
  assert.equal(selectedTenor?.tenor, "1 Year");
});

// --- DIRECT DEBIT MANDATE (RADIX DIALOG) ---
test("DirectDebitMandate displays authorization details and invokes onAuthorize", () => {
  let authorized = false;

  const { getByRole, getByText } = render(
    <DirectDebitMandate
      open={true}
      creditorName="British Gas"
      mandateReference="MNDT-102938"
      bankName="Barclays"
      accountNumberMasked="••••9911"
      frequency="Monthly"
      onAuthorize={() => {
        authorized = true;
      }}
    />
  );

  assert.ok(getByRole("dialog"));
  assert.ok(getByText("Direct Debit Mandate"));
  assert.ok(getByText("MNDT-102938"));
  assert.ok(getByText("Barclays (••••9911)"));

  const authorizeBtn = getByRole("button", { name: "Authorize Direct Debit Mandate" });
  fireEvent.click(authorizeBtn);
  assert.equal(authorized, true);
});
