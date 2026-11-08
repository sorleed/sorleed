import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { Avatar } from "../avatar";
import { Modal } from "../modal";
import { Toast } from "../toast";
import { PinInput } from "../pin-input";
import { BankSelector } from "../bank-selector";
import { WalletCard } from "../wallet-card";
import { AccountSummary } from "../account-summary";

test("Avatar renders initials fallback and status indicator", () => {
  const html = renderToString(<Avatar name="Ada Lovelace" status="online" size="lg" />);
  assert.ok(html.includes("fc-avatar--lg"), "Should include lg class");
  assert.ok(html.includes("AL"), "Should render initials AL");
  assert.ok(html.includes("fc-avatar__status--online"), "Should render online badge");
});

test("Modal renders title, content and footer markup when open", () => {
  const html = renderToString(
    <Modal open title="Confirm Transfer" footer={<button>Confirm</button>}>
      <p>Are you sure?</p>
    </Modal>,
  );
  assert.ok(html.includes("Confirm Transfer"), "Should render title");
  assert.ok(html.includes("Are you sure?"), "Should render content");
  assert.ok(html.includes("Confirm"), "Should render footer");
});

test("Modal renders nothing when open is false", () => {
  const html = renderToString(
    <Modal open={false} title="Hidden">
      <p>Hidden content</p>
    </Modal>,
  );
  assert.equal(html, "");
});

test("Toast renders notification with variant class and role", () => {
  const html = renderToString(
    <Toast variant="success" title="Payment Received" description="$50.00 from John" />,
  );
  assert.ok(html.includes("fc-toast--success"), "Should have success variant class");
  assert.ok(html.includes('role="status"'), "Should have accessible status role");
  assert.ok(html.includes("Payment Received"), "Should render title");
});

test("PinInput renders exact count of cells with password masking", () => {
  const html = renderToString(<PinInput length={4} defaultValue="12" />);
  assert.ok(html.includes('aria-label="Digit 1 of 4"'));
  assert.ok(html.includes('aria-label="Digit 4 of 4"'));
  assert.ok(html.includes('type="password"'));
});

test("BankSelector renders bank list options", () => {
  const banks = [
    { id: "1", name: "Chase Bank", code: "021000021" },
    { id: "2", name: "Bank of America", code: "026009593" },
  ];
  const html = renderToString(<BankSelector banks={banks} selectedBankId="1" />);
  assert.ok(html.includes("Chase Bank"));
  assert.ok(html.includes("Bank of America"));
  assert.ok(html.includes('aria-selected="true"'));
});

test("WalletCard renders cardholder, masked number, expiry and CVV", () => {
  const html = renderToString(
    <WalletCard
      brand="visa"
      cardNumber="4111222233334444"
      cardHolder="Satoshi Nakamoto"
      expiry="12/28"
      cvv="789"
    />,
  );
  assert.ok(html.includes("4111 2222 3333 4444"));
  assert.ok(html.includes("SATOSHI NAKAMOTO"));
  assert.ok(html.includes("12/28"));
  assert.ok(html.includes("789"));
});

test("AccountSummary renders bank details and copy triggers", () => {
  const html = renderToString(
    <AccountSummary
      bankName="Mercury Bank"
      accountName="Sorleed Inc"
      accountNumber="987654321"
      routingOrSortCode="123456"
      iban="GB33BUKB20201555555555"
    />,
  );
  assert.ok(html.includes("Mercury Bank"));
  assert.ok(html.includes("Sorleed Inc"));
  assert.ok(html.includes("987654321"));
  assert.ok(html.includes("GB33BUKB20201555555555"));
  assert.ok(html.includes("Copy"));
});
