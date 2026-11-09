import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { InvoiceViewer } from "../invoice-viewer";
import { ExpenseReceiptUploader } from "../expense-receipt-uploader";
import { JournalEntryLedger } from "../journal-entry-ledger";
import { TaxSummaryCard } from "../tax-summary-card";
import { ChartOfAccountsTree } from "../chart-of-accounts-tree";

// --- INVOICE VIEWER ---
test("InvoiceViewer computes line item totals, subtotal, tax and displays status", () => {
  const { getByRole, getByText } = render(
    <InvoiceViewer
      invoiceNumber="INV-2026-001"
      issueDate="2026-11-01"
      dueDate="2026-11-15"
      status="due"
      issuer={{ name: "Acme Cloud Services", taxId: "US-992144" }}
      client={{ name: "TechCorp Global" }}
      items={[
        { description: "Software Architecture Consulting", quantity: 10, unitPrice: 200 },
        { description: "Dedicated API Gateway", quantity: 1, unitPrice: 500 },
      ]}
      currency="USD"
      taxRate={10}
      discount={100}
    />
  );

  assert.ok(getByRole("region", { name: "Invoice INV-2026-001" }));
  assert.ok(getByText("Acme Cloud Services"));
  assert.ok(getByText("DUE"));
  // 10 * 200 = 2000 + 500 = 2500 subtotal. Tax 10% = 250. Discount = 100. Total = 2650
  assert.ok(getByText("USD 2500.00"));
  assert.ok(getByText("USD 2650.00"));
});

// --- EXPENSE RECEIPT UPLOADER ---
test("ExpenseReceiptUploader populates OCR fields and triggers submit", () => {
  let submittedExpense = null;

  const { getByRole, getByLabelText } = render(
    <ExpenseReceiptUploader
      title="Expense Receipt Uploader"
      onSubmitExpense={(data) => {
        submittedExpense = data;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Expense Receipt Uploader" }));

  // Change merchant
  const merchantInput = getByLabelText("Merchant / Vendor");
  fireEvent.input(merchantInput, { target: { value: "Uber Technologies" } });

  const submitBtn = getByRole("button", { name: "Submit Expense Report" });
  fireEvent.click(submitBtn);

  assert.ok(submittedExpense);
  assert.equal(submittedExpense.merchant, "Uber Technologies");
});

// --- JOURNAL ENTRY LEDGER ---
test("JournalEntryLedger checks debit and credit balancing", () => {
  let posted = false;

  const balancedEntries = [
    { accountCode: "1010", accountName: "Cash", debit: 5000, credit: 0 },
    { accountCode: "4010", accountName: "Sales Revenue", debit: 0, credit: 5000 },
  ];

  const { getByRole, getByText } = render(
    <JournalEntryLedger
      title="Journal Entry Ledger"
      entries={balancedEntries}
      onPostEntry={() => {
        posted = true;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Journal Entry Ledger" }));
  assert.ok(getByText("✓ BALANCED"));

  const postBtn = getByRole("button", { name: "Post to General Ledger" });
  assert.equal(postBtn.hasAttribute("disabled"), false);
  fireEvent.click(postBtn);
  assert.equal(posted, true);
});

// --- TAX SUMMARY CARD ---
test("TaxSummaryCard computes taxable net and displays estimated liability", () => {
  const { getByRole, getByText } = render(
    <TaxSummaryCard
      title="Tax Summary Card"
      grossRevenue={200000}
      deductions={40000}
      estimatedTaxLiability={38000}
      currency="USD"
      dueDate="April 15, 2027"
    />
  );

  assert.ok(getByRole("region", { name: "Tax Summary Card" }));
  assert.ok(getByText("USD 200,000"));
  assert.ok(getByText("-USD 40,000"));
  assert.ok(getByText("USD 160,000"));
  assert.ok(getByText("USD 38,000"));
});

// --- CHART OF ACCOUNTS TREE ---
test("ChartOfAccountsTree renders general ledger nodes and selection callback", () => {
  let selected = null;

  const { getByRole, getByText } = render(
    <ChartOfAccountsTree
      onSelectAccount={(acc) => {
        selected = acc;
      }}
    />
  );

  assert.ok(getByRole("region", { name: "Chart of Accounts" }));
  assert.ok(getByRole("tree", { name: "Accounts Tree" }));
  assert.ok(getByText("Operating Cash Account"));

  const cashNode = getByText("Operating Cash Account");
  fireEvent.click(cashNode);
  assert.equal(selected?.code, "1010");
});
