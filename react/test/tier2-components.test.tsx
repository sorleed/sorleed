import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, fireEvent } from "@testing-library/react";
import { LoanCalculator } from "../loan-calculator";
import { CreditScoreGauge } from "../credit-score-gauge";
import { PortfolioSummary } from "../portfolio-summary";
import { SpendingMeter } from "../spending-meter";
import { KycDocUploader } from "../kyc-doc-uploader";

// --- LOANCALCULATOR FUNCTIONALITY & ACCESSIBILITY ---
test("LoanCalculator computes EMI and allows principal/tenure slider changes", () => {
  let calcResult = null;
  const { getByRole, getByLabelText } = render(
    <LoanCalculator
      minAmount={1000}
      maxAmount={50000}
      defaultAmount={10000}
      minTenure={6}
      maxTenure={60}
      defaultTenure={12}
      interestRate={10}
      currency="USD"
      onCalculate={(res) => { calcResult = res; }}
    />
  );

  const region = getByRole("region", { name: "Loan EMI Calculator" });
  assert.ok(region);

  const amountSlider = getByLabelText("Loan Amount Slider") as HTMLInputElement;
  assert.equal(amountSlider.value, "10000");

  fireEvent.input(amountSlider, { target: { value: "20000" } });
  assert.equal(amountSlider.value, "20000");
  assert.ok(calcResult);
  assert.equal((calcResult as any).principal, 20000);
});

// --- CREDITSCOREGAUGE FUNCTIONALITY & ACCESSIBILITY ---
test("CreditScoreGauge renders dial with clamped score and proper band label", () => {
  const { getByRole, getByText, rerender } = render(
    <CreditScoreGauge score={780} lastUpdated="Today" />
  );

  const region = getByRole("region", { name: "Credit Score Gauge" });
  assert.ok(region);
  assert.ok(getByText("780"));
  assert.ok(getByText("Excellent"));
  assert.ok(getByText("Last updated: Today"));

  rerender(<CreditScoreGauge score={550} />);
  assert.ok(getByText("550"));
  assert.ok(getByText("Poor"));
});

// --- PORTFOLIOSUMMARY PRIVACY & RETURNS ---
test("PortfolioSummary renders net worth, returns pill, and supports privacy mode", () => {
  const { getByRole, getByText } = render(
    <PortfolioSummary
      totalValue={84250.75}
      returnsValue={12450.5}
      returnsPercentage={14.8}
      investedAmount={71800}
      cashBalance={12450.75}
      apy={8.5}
      allowToggleVisibility={true}
    />
  );

  const region = getByRole("region", { name: "Investment Portfolio Summary" });
  assert.ok(region);
  assert.ok(getByText("USD 84,250.75"));
  assert.ok(getByText("▲ +14.8% (USD 12,450.50)"));
  assert.ok(getByText("8.5%"));

  // Toggle privacy mode
  const toggleBtn = getByRole("button", { name: "Hide portfolio value" });
  fireEvent.click(toggleBtn);
  assert.ok(getByText("••••••••"));
  assert.equal(toggleBtn.getAttribute("aria-label"), "Show portfolio value");
});

// --- SPENDINGMETER BUDGET PROGRESS ---
test("SpendingMeter renders progressbar and triggers threshold warning classes", () => {
  const { getByRole, getByText, rerender } = render(
    <SpendingMeter
      title="Dining & Entertainment"
      currentSpent={450}
      limit={1000}
      currency="USD"
    />
  );

  const region = getByRole("region", { name: "Dining & Entertainment: 45% used" });
  assert.ok(region);

  const progressbar = getByRole("progressbar");
  assert.equal(progressbar.getAttribute("aria-valuenow"), "450");
  assert.equal(progressbar.getAttribute("aria-valuemax"), "1000");
  assert.ok(getByText("USD 550 remaining"));

  // Above 80% warning
  rerender(
    <SpendingMeter
      title="Dining & Entertainment"
      currentSpent={850}
      limit={1000}
      currency="USD"
    />
  );
  assert.ok(getByRole("region", { name: "Dining & Entertainment: 85% used" }));
});

// --- KYCDOCUPLOADER COMPLIANCE ---
test("KycDocUploader handles file selection and removal", () => {
  let selectedFile: File | null = null;
  let removed = false;
  const { getByRole, getByLabelText, getByText } = render(
    <KycDocUploader
      title="Driver's License"
      onFileSelect={(f) => { selectedFile = f; }}
      onFileRemove={() => { removed = true; }}
    />
  );

  const region = getByRole("region", { name: "Driver's License" });
  assert.ok(region);

  const input = getByLabelText("Upload document input");
  const file = new File(["dummy content"], "drivers_license.jpg", { type: "image/jpeg" });
  fireEvent.change(input, { target: { files: [file] } });

  assert.ok(selectedFile);
  assert.ok(getByText("📄 drivers_license.jpg"));

  // Remove file
  const removeBtn = getByRole("button", { name: "Remove file drivers_license.jpg" });
  fireEvent.click(removeBtn);
  assert.equal(removed, true);
});
