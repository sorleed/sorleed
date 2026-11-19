import "./setup.ts";
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  CreditUtilizationMeter,
  PerformanceChartCard,
  OrderEntryTicket,
} from "../index";

test("CreditUtilizationMeter computes utilization band and renders progressbar", () => {
  const { getByRole, getByText } = render(
    <CreditUtilizationMeter
      creditLimit={10000}
      currentBalance={2400}
      minimumDue={75}
      statementCloseDate="Nov 28"
    />,
  );

  assert.ok(getByText("24%"));
  assert.ok(getByText("Optimal (<30%)"));
  const bar = getByRole("progressbar");
  assert.equal(bar.getAttribute("aria-valuenow"), "24");
  assert.ok(getByText("Nov 28"));
});

test("PerformanceChartCard renders sparkline and switches timeframe", () => {
  let selectedTf = "";
  const { getByText, getByRole } = render(
    <PerformanceChartCard
      symbol="AAPL"
      name="Apple Inc."
      currentPrice={228.5}
      returnPercent={4.25}
      returnAmount={9.32}
      benchmarkName="S&P 500"
      benchmarkReturn={2.1}
      dataPoints={[
        { label: "Nov 1", value: 219 },
        { label: "Nov 10", value: 224 },
        { label: "Nov 19", value: 228.5 },
      ]}
      onTimeframeChange={(tf) => {
        selectedTf = tf;
      }}
    />,
  );

  assert.ok(getByText("AAPL"));
  assert.ok(getByText("+4.25%"));
  assert.ok(getByRole("img"));

  const oneYearTab = getByRole("tab", { name: "1Y" });
  fireEvent.mouseDown(oneYearTab);
  fireEvent.click(oneYearTab);
  assert.equal(selectedTf, "1Y");
});

test("OrderEntryTicket validates buying power and submits order payload", async () => {
  let submitted: { symbol: string; side: string; orderType: string; quantity: number } | null = null;
  const { getByLabelText, getByRole, getByText } = render(
    <OrderEntryTicket
      symbol="MSFT"
      companyName="Microsoft Corp."
      currentPrice={420}
      buyingPower={1000}
      availableShares={5}
      onSubmitOrder={(payload) => {
        submitted = payload;
      }}
    />,
  );

  const qtyInput = getByLabelText("Quantity (Shares)");
  fireEvent.input(qtyInput, { target: { value: "5" } });
  assert.ok(getByText("Insufficient buying power"));

  fireEvent.input(qtyInput, { target: { value: "2" } });
  const submitBtn = getByRole("button", { name: "Place Buy Order" });
  fireEvent.click(submitBtn);

  assert.ok(submitted);
  assert.equal(submitted.symbol, "MSFT");
  assert.equal(submitted.side, "buy");
  assert.equal(submitted.orderType, "market");
  assert.equal(submitted.quantity, 2);
});
