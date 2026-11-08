import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { CardControls } from "../card-controls";
import { RepaymentSchedule } from "../repayment-schedule";
import { AssetAllocation } from "../asset-allocation";
import { Pagination } from "../pagination";
import { Accordion } from "../accordion";

// --- CARDCONTROLS FUNCTIONALITY & ACCESSIBILITY ---
test("CardControls renders toggles and triggers change events", () => {
  let toggled = null;
  const controls = [
    { id: "online", label: "Online Payments", description: "Allow internet transactions", enabled: true },
    { id: "atm", label: "ATM Withdrawals", description: "Cash withdrawals at ATMs", enabled: false },
    { id: "intl", label: "International Use", enabled: false, disabled: true },
  ];

  const { getByRole, getByText } = render(
    <CardControls
      controls={controls}
      onToggleControl={(id, enabled) => {
        toggled = { id, enabled };
      }}
    />
  );

  const region = getByRole("region", { name: "Card Security & Features" });
  assert.ok(region);
  assert.ok(getByText("Online Payments"));
  assert.ok(getByText("ATM Withdrawals"));

  const atmSwitch = getByRole("switch", { name: "ATM Withdrawals" });
  assert.equal(atmSwitch.getAttribute("aria-checked"), "false");

  fireEvent.click(atmSwitch);
  assert.deepEqual(toggled, { id: "atm", enabled: true });
});

// --- REPAYMENTSCHEDULE FUNCTIONALITY & ACCESSIBILITY ---
test("RepaymentSchedule renders installments table and pay action", () => {
  let paidInstallment = null;
  const installments = [
    { installmentNumber: 1, dueDate: "2026-12-01", amount: 250, status: "paid" as const },
    { installmentNumber: 2, dueDate: "2027-01-01", amount: 250, status: "due" as const },
    { installmentNumber: 3, dueDate: "2027-02-01", amount: 250, status: "upcoming" as const },
  ];

  const { getByRole, getByText } = render(
    <RepaymentSchedule
      installments={installments}
      currency="USD"
      onPayInstallment={(num) => {
        paidInstallment = num;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Loan Repayment Schedule" }));
  assert.ok(getByRole("table"));
  assert.ok(getByText("PAID"));
  assert.ok(getByText("DUE"));

  const payBtn = getByRole("button", { name: "Pay installment 2" });
  fireEvent.click(payBtn);
  assert.equal(paidInstallment, 2);
});

// --- ASSETALLOCATION FUNCTIONALITY & ACCESSIBILITY ---
test("AssetAllocation renders distribution progressbar and item breakdown", () => {
  const assets = [
    { name: "US Equities", percentage: 50, amount: 50000, color: "#2563eb" },
    { name: "Bonds", percentage: 30, amount: 30000, color: "#10b981" },
    { name: "Crypto", percentage: 20, amount: 20000, color: "#f59e0b" },
  ];

  const { getByRole, getByText } = render(
    <AssetAllocation assets={assets} totalValue={100000} currency="USD" />
  );

  assert.ok(getByRole("region", { name: "Asset Allocation" }));
  const progressBar = getByRole("progressbar");
  assert.equal(progressBar.getAttribute("aria-valuenow"), "100");
  assert.ok(getByText("US Equities"));
  assert.ok(getByText("50%"));
  assert.ok(getByText("Total: USD 100,000"));
});

// --- PAGINATION FUNCTIONALITY & ACCESSIBILITY ---
test("Pagination handles page navigation and aria-current", () => {
  let selectedPage = null;
  const { getByRole } = render(
    <Pagination
      currentPage={3}
      totalPages={10}
      onPageChange={(page) => {
        selectedPage = page;
      }}
    />
  );

  assert.ok(getByRole("navigation", { name: "Pagination Navigation" }));

  const prevBtn = getByRole("button", { name: "Previous page" });
  fireEvent.click(prevBtn);
  assert.equal(selectedPage, 2);

  const nextBtn = getByRole("button", { name: "Next page" });
  fireEvent.click(nextBtn);
  assert.equal(selectedPage, 4);

  const page3Btn = getByRole("button", { name: "Page 3" });
  assert.equal(page3Btn.getAttribute("aria-current"), "page");
});

// --- ACCORDION FUNCTIONALITY & ACCESSIBILITY ---
test("Accordion expands and collapses sections with aria-expanded", () => {
  const items = [
    { id: "faq-1", title: "What is APR vs APY?", content: "APR reflects the annual interest rate without compounding." },
    { id: "faq-2", title: "Are funds FDIC insured?", content: "Yes, up to $250,000 per depositor." },
  ];

  const { getByRole, getByText } = render(<Accordion items={items} />);

  const trigger1 = getByRole("button", { name: "What is APR vs APY?" });
  assert.equal(trigger1.getAttribute("aria-expanded"), "false");

  const panel1 = getByText("APR reflects the annual interest rate without compounding.");
  assert.equal(panel1.hasAttribute("hidden"), true);

  fireEvent.click(trigger1);
  assert.equal(trigger1.getAttribute("aria-expanded"), "true");
  assert.equal(panel1.hasAttribute("hidden"), false);
});
