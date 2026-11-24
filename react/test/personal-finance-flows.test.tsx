import "./setup.ts";
import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {
  SavingsGoalFlow,
  BudgetSetupFlow,
  GroupBillSplitFlow,
} from "../index";

test("SavingsGoalFlow configures goal, auto-save frequency, and activates goal", async () => {
  let createdGoal: { goalName: string; targetAmount: number; frequency: string } | null = null;
  const { getByRole, getByText } = render(
    <SavingsGoalFlow
      onCreateGoal={(goal) => {
        createdGoal = goal;
        return Promise.resolve({ goalId: "GOAL-123456" });
      }}
    />,
  );

  fireEvent.click(getByRole("button", { name: "Vacation" }));
  fireEvent.click(getByRole("button", { name: "Continue to Auto-Save" }));
  fireEvent.click(getByRole("button", { name: "Biweekly" }));
  fireEvent.click(getByRole("button", { name: "Review Goal" }));
  fireEvent.click(getByRole("button", { name: "Activate Savings Goal" }));

  await waitFor(() => {
    assert.ok(getByText("Savings Goal Activated"));
  });
  assert.ok(createdGoal);
  assert.equal(createdGoal.goalName, "Vacation");
  assert.equal(createdGoal.targetAmount, 3500);
  assert.equal(createdGoal.frequency, "biweekly");
});

test("BudgetSetupFlow validates income cap and saves monthly budget", async () => {
  let savedBudget: { monthlyIncome: number; overspendAlerts: boolean } | null = null;
  const { getByLabelText, getByRole, getByText } = render(
    <BudgetSetupFlow
      defaultIncome={4000}
      onSaveBudget={(budget) => {
        savedBudget = budget;
      }}
    />,
  );

  const incomeInput = getByLabelText("Monthly Take-Home Income (USD)");
  fireEvent.input(incomeInput, { target: { value: "1000" } });
  assert.ok(getByText("Allocations exceed monthly income"));

  fireEvent.input(incomeInput, { target: { value: "5000" } });
  fireEvent.click(getByRole("button", { name: "Continue to Alerts & Save" }));
  fireEvent.click(getByRole("button", { name: "Save Monthly Budget" }));

  await waitFor(() => {
    assert.ok(getByText("Monthly Budget Saved"));
  });
  assert.ok(savedBudget);
  assert.equal(savedBudget.monthlyIncome, 5000);
  assert.equal(savedBudget.overspendAlerts, true);
});

test("GroupBillSplitFlow selects friends, dispatches payment requests, and tracks paid state", async () => {
  let sentCount = 0;
  const { getByRole, getByText } = render(
    <GroupBillSplitFlow
      defaultTotal={150}
      contacts={[
        { id: "c1", name: "Maya Lin", handle: "@mayalin" },
        { id: "c2", name: "Devon Brooks", handle: "@devonb" },
      ]}
      onSendRequests={(payload) => {
        sentCount = payload.participants.length;
      }}
    />,
  );

  fireEvent.click(getByRole("button", { name: "Continue to Friends" }));
  fireEvent.click(getByRole("button", { name: "Send 2 Payment Requests" }));

  await waitFor(() => {
    assert.ok(getByText("Payment Requests Sent"));
  });
  assert.equal(sentCount, 2);
});
