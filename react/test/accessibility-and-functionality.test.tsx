import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { Avatar } from "../avatar";
import { Modal } from "../modal";
import { Toast } from "../toast";
import { PinInput } from "../pin-input";
import { BankSelector } from "../bank-selector";
import { WalletCard } from "../wallet-card";
import { AccountSummary } from "../account-summary";

// --- AVATAR A11Y & FUNCTIONALITY ---
test("Avatar a11y: provides accessible name and aria-label", () => {
  const { getByLabelText } = render(
    <Avatar name="Kelechi Nnamdi" status="online" />
  );
  const avatar = getByLabelText("Kelechi Nnamdi");
  assert.ok(avatar);
  assert.equal(avatar.getAttribute("aria-label"), "Kelechi Nnamdi");

  // Status role and description
  const statusEl = avatar.querySelector(".fc-avatar__status");
  assert.ok(statusEl);
  assert.equal(statusEl?.getAttribute("role"), "status");
  assert.equal(statusEl?.getAttribute("aria-label"), "Status: online");
});

test("Avatar initials calculation handles edge cases", () => {
  const { getByText, rerender } = render(<Avatar name="Ada" />);
  assert.equal(getByText("AD").textContent, "AD");

  rerender(<Avatar name="Ada Lovelace" />);
  assert.equal(getByText("AL").textContent, "AL");

  rerender(<Avatar name="   Grace    Brewster    Hopper   " />);
  assert.equal(getByText("GH").textContent, "GH");
});

// --- MODAL A11Y & FUNCTIONALITY ---
test("Modal a11y: role='dialog', aria-modal='true', and Escape key handler", () => {
  let closed = false;
  const { getByRole, getByLabelText } = render(
    <Modal open={true} title="Transfer Confirmation" onClose={() => { closed = true; }}>
      <p>Sending 500 USD to John</p>
    </Modal>
  );

  const dialog = getByRole("dialog");
  assert.equal(dialog.getAttribute("aria-modal"), "true");
  assert.equal(dialog.getAttribute("aria-label"), "Transfer Confirmation");

  // Close button has accessible label
  const closeBtn = getByLabelText("Close dialog");
  assert.ok(closeBtn);
  assert.equal(closeBtn.tagName, "BUTTON");

  // Pressing Escape calls onClose
  fireEvent.keyDown(document, { key: "Escape" });
  assert.equal(closed, true, "Escape key should trigger onClose");
});

test("Modal overlay click triggers onClose", () => {
  let closed = false;
  const { getByTestId } = render(
    <Modal open={true} title="Dialog" onClose={() => { closed = true; }}>
      <p>Body</p>
    </Modal>
  );

  const overlay = getByTestId("modal-overlay");
  fireEvent.click(overlay);
  assert.equal(closed, true, "Clicking backdrop overlay should trigger onClose");
});

// --- TOAST A11Y & FUNCTIONALITY ---
test("Toast a11y: error variant uses role='alert', other variants use role='status'", () => {
  const { getByRole, rerender } = render(
    <Toast variant="error" title="Transaction Failed" description="Insufficient funds" />
  );
  const alertToast = getByRole("alert");
  assert.equal(alertToast.getAttribute("aria-live"), "assertive");

  rerender(
    <Toast variant="success" title="Payment Sent" description="Receipt #4819" />
  );
  const statusToast = getByRole("status");
  assert.equal(statusToast.getAttribute("aria-live"), "polite");
});

test("Toast close button is keyboard accessible and calls onClose", () => {
  let dismissed = false;
  const { getByLabelText } = render(
    <Toast title="Notice" onClose={() => { dismissed = true; }} />
  );
  const closeBtn = getByLabelText("Dismiss notification");
  fireEvent.click(closeBtn);
  assert.equal(dismissed, true);
});

// --- PIN INPUT A11Y & FUNCTIONALITY ---
test("PinInput a11y: role='group', inputMode='numeric', cell labels and auto-advance", () => {
  let pinVal = "";
  let completePin = "";
  const { getByRole } = render(
    <PinInput
      length={4}
      onChange={(v) => { pinVal = v; }}
      onComplete={(v) => { completePin = v; }}
    />
  );

  const group = getByRole("group", { name: "PIN Input" });
  assert.ok(group);

  // type=password inputs:
  const inputs = group.querySelectorAll("input[type='password']") as NodeListOf<HTMLInputElement>;
  assert.equal(inputs.length, 4);

  // Each cell has aria-label and numeric inputMode
  inputs.forEach((input, idx) => {
    assert.equal(input.getAttribute("aria-label"), `Digit ${idx + 1} of 4`);
    assert.equal(input.getAttribute("inputmode"), "numeric");
  });

  // Entering a digit triggers onChange and advances
  fireEvent.input(inputs[0], { target: { value: "7" } });
  assert.equal(pinVal, "7");

  // Non-numeric input is rejected
  fireEvent.input(inputs[1], { target: { value: "a" } });
  assert.equal(inputs[1].value, "");
});

// --- BANK SELECTOR A11Y & FUNCTIONALITY ---
test("BankSelector a11y: role='listbox', options, search filter, and selection", () => {
  const banks = [
    { id: "zenith", name: "Zenith Bank", code: "057" },
    { id: "gtb", name: "Guaranty Trust Bank", code: "058" },
    { id: "access", name: "Access Bank", code: "044" }
  ];

  let selected = null;
  const { getByRole, getAllByRole, getByLabelText } = render(
    <BankSelector
      banks={banks}
      placeholder="Select institution"
      onSelectBank={(b) => { selected = b; }}
    />
  );

  const listbox = getByRole("listbox", { name: "Banks" });
  assert.ok(listbox);

  const searchInput = getByLabelText("Select institution");
  assert.ok(searchInput);

  // Initial list count
  let options = getAllByRole("option");
  assert.equal(options.length, 3);

  // Filter list
  fireEvent.input(searchInput, { target: { value: "guaranty" } });
  options = getAllByRole("option");
  assert.equal(options.length, 1);
  assert.ok(options[0].textContent?.includes("Guaranty Trust Bank"));

  // Select
  fireEvent.click(options[0]);
  assert.deepEqual(selected, banks[1]);
});

// --- WALLET CARD A11Y & FUNCTIONALITY ---
test("WalletCard a11y: interactive card flip with keyboard (Enter/Space)", () => {
  let flipped = false;
  const { getByRole } = render(
    <WalletCard
      cardNumber="5399830012345678"
      cardHolder="Amara Okafor"
      expiry="09/27"
      cvv="412"
      onFlip={(f) => { flipped = f; }}
    />
  );

  const cardBtn = getByRole("button");
  assert.ok(cardBtn.getAttribute("aria-label")?.includes("ending in 5678"));

  // Flip with Space
  fireEvent.keyDown(cardBtn, { key: " " });
  assert.equal(flipped, true);

  // Flip with Enter
  fireEvent.keyDown(cardBtn, { key: "Enter" });
  assert.equal(flipped, false);
});

// --- ACCOUNT SUMMARY A11Y & FUNCTIONALITY ---
test("AccountSummary a11y: copy buttons with accessible labels and feedback", () => {
  let copied = { field: "", val: "" };
  const { getByLabelText } = render(
    <AccountSummary
      bankName="Standard Chartered"
      accountName="Chidi Mokeme"
      accountNumber="0011223344"
      routingOrSortCode="080123"
      onCopy={(field, val) => { copied = { field, val }; }}
    />
  );

  const copyAccBtn = getByLabelText("Copy account number 0011223344");
  assert.ok(copyAccBtn);
  fireEvent.click(copyAccBtn);
  assert.deepEqual(copied, { field: "accountNumber", val: "0011223344" });
  assert.equal(copyAccBtn.textContent, "Copied");

  const copySortBtn = getByLabelText("Copy sort code 080123");
  assert.ok(copySortBtn);
  fireEvent.click(copySortBtn);
  assert.deepEqual(copied, { field: "routingOrSortCode", val: "080123" });
});
