import "./setup.ts";
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import {
  BankReconciliationMatcher,
  CashFlowForecastCard,
  AuditTrailTimeline,
} from "../index";

test("BankReconciliationMatcher matches bank and ledger entries and invokes onMatch", () => {
  let matchedPair: [string, string] | null = null;
  const { getByText, getByRole } = render(
    <BankReconciliationMatcher
      bankEntries={[
        { id: "b1", date: "2026-11-18", description: "Stripe Payout #104", amount: 4250 },
      ]}
      ledgerEntries={[
        { id: "l1", date: "2026-11-18", description: "AR Settlement - Stripe", amount: 4250 },
      ]}
      onMatch={(bankId, ledgerId) => {
        matchedPair = [bankId, ledgerId];
      }}
    />,
  );

  fireEvent.click(getByText("Stripe Payout #104"));
  fireEvent.click(getByText("AR Settlement - Stripe"));
  assert.ok(getByText("Exact amount match"));

  fireEvent.click(getByRole("button", { name: "Match Selected" }));
  assert.deepEqual(matchedPair, ["b1", "l1"]);
  assert.ok(getByText("1 Matched"));
});

test("CashFlowForecastCard computes runway and switches horizon", () => {
  let activeHorizon = "";
  const { getByText, getByRole } = render(
    <CashFlowForecastCard
      startingCash={500000}
      monthlyBurnRate={50000}
      periods={[
        { label: "Month 1", inflows: 80000, outflows: 60000 },
        { label: "Month 2", inflows: 90000, outflows: 60000 },
      ]}
      onHorizonChange={(h) => {
        activeHorizon = h;
      }}
    />,
  );

  assert.ok(getByText("11 mo runway"));
  const tab30 = getByRole("tab", { name: "30D" });
  fireEvent.mouseDown(tab30);
  fireEvent.click(tab30);
  assert.equal(activeHorizon, "30D");
});

test("AuditTrailTimeline renders immutable events with actor, severity, and 2FA badge", () => {
  const { getByText } = render(
    <AuditTrailTimeline
      events={[
        {
          id: "e1",
          actorName: "Elena Vance",
          actorRole: "Treasury Admin",
          action: "Approved wire transfer",
          resource: "TX-99412",
          timestamp: "2026-11-19 14:22 UTC",
          ipAddress: "10.24.18.4",
          mfaVerified: true,
          severity: "critical",
        },
      ]}
    />,
  );

  assert.ok(getByText("Elena Vance"));
  assert.ok(getByText("CRITICAL"));
  assert.ok(getByText("2FA Verified"));
  assert.ok(getByText("IP 10.24.18.4"));
});
