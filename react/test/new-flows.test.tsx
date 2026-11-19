import "./setup.ts";
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  TradeExecutionFlow,
  MonthEndCloseFlow,
  SecurityCenterFlow,
} from "../index";

test("TradeExecutionFlow progresses from order entry to review and execution receipt", async () => {
  let executedQty = 0;
  const { getByRole, getByText } = render(
    <TradeExecutionFlow
      symbol="NVDA"
      companyName="NVIDIA Corp."
      currentPrice={140}
      buyingPower={5000}
      returnPercent={6.4}
      returnAmount={8.4}
      dataPoints={[
        { label: "Nov 1", value: 132 },
        { label: "Nov 19", value: 140 },
      ]}
      onExecuteOrder={(order) => {
        executedQty = order.quantity;
        return Promise.resolve({ orderId: "ORD-778899" });
      }}
    />,
  );

  fireEvent.click(getByRole("button", { name: "Place Buy Order" }));
  assert.ok(getByText("Review BUY Order"));

  fireEvent.click(getByRole("button", { name: "Confirm & Execute Trade" }));
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(executedQty, 1);
  assert.ok(getByText("Order Executed"));
  assert.ok(getByText("ORD-778899"));
});

test("MonthEndCloseFlow reconciles entries, reviews runway/audit, and locks period", async () => {
  let closedPeriod = "";
  const { getByRole, getByText } = render(
    <MonthEndCloseFlow
      periodLabel="November 2026"
      bankEntries={[{ id: "b1", date: "2026-11-18", description: "Stripe Payout", amount: 5000 }]}
      ledgerEntries={[{ id: "l1", date: "2026-11-18", description: "AR Settlement", amount: 5000 }]}
      startingCash={400000}
      monthlyBurnRate={40000}
      cashFlowPeriods={[{ label: "Dec", inflows: 60000, outflows: 40000 }]}
      auditEvents={[
        {
          id: "a1",
          actorName: "Elena Vance",
          actorRole: "Controller",
          action: "Verified payroll",
          timestamp: "2026-11-19 10:00 UTC",
          mfaVerified: true,
          severity: "info",
        },
      ]}
      onClosePeriod={(summary) => {
        closedPeriod = summary.periodLabel;
      }}
    />,
  );

  fireEvent.click(getByText("Stripe Payout"));
  fireEvent.click(getByText("AR Settlement"));
  fireEvent.click(getByRole("button", { name: "Match Selected" }));

  fireEvent.click(getByRole("button", { name: "Continue to Runway & Audit" }));
  assert.ok(getByText("Elena Vance"));

  fireEvent.click(getByRole("button", { name: "Proceed to Sign-off" }));
  fireEvent.click(getByRole("button", { name: "Lock & Close November 2026" }));
  await new Promise((r) => setTimeout(r, 10));

  assert.equal(closedPeriod, "November 2026");
  assert.ok(getByText("Period Locked"));
});

test("SecurityCenterFlow triggers emergency lockdown and revokes other sessions", async () => {
  let locked = false;
  const { getByRole, getByText } = render(
    <SecurityCenterFlow
      devices={[
        {
          id: "d1",
          deviceName: "MacBook Pro",
          deviceType: "desktop",
          browser: "Chrome",
          os: "macOS",
          ipAddress: "192.168.1.10",
          location: "London, UK",
          lastActive: "Now",
          isCurrent: true,
        },
        {
          id: "d2",
          deviceName: "Unknown Android",
          deviceType: "mobile",
          browser: "Chrome",
          os: "Android",
          ipAddress: "88.14.22.1",
          location: "Unknown",
          lastActive: "10m ago",
          isCurrent: false,
        },
      ]}
      cardNumber="4532 8920 1029 8841"
      cardHolder="ALEX MORGAN"
      cardExpiry="08/29"
      cardCvv="412"
      onEmergencyLockdown={() => {
        locked = true;
      }}
    />,
  );

  assert.ok(getByText("Protected"));
  fireEvent.click(getByRole("button", { name: "Trigger Emergency Lockdown" }));
  await new Promise((r) => setTimeout(r, 10));

  assert.equal(locked, true);
  assert.ok(getByText("Lockdown Active"));
  assert.ok(getByText("Emergency Account Lockdown Active"));
});
