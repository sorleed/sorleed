import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";
import { SpendingMeter } from "../spending-meter";
import { Switch } from "../switch";
import type { BudgetCategoryItem, BudgetSetupFlowProps } from "../types";

const DEFAULT_CATEGORIES: BudgetCategoryItem[] = [
  { id: "housing", name: "Housing & Utilities", limit: 1800, currentSpent: 1650 },
  { id: "groceries", name: "Groceries & Dining", limit: 700, currentSpent: 410 },
  { id: "transport", name: "Transport & Transit", limit: 300, currentSpent: 190 },
  { id: "lifestyle", name: "Subscriptions & Lifestyle", limit: 400, currentSpent: 280 },
];

export const BudgetSetupFlow = React.forwardRef<HTMLDivElement, BudgetSetupFlowProps>(
  (
    {
      currency = "USD",
      defaultIncome = 4500,
      initialCategories = DEFAULT_CATEGORIES,
      onSaveBudget,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [incomeInput, setIncomeInput] = useState<string>(String(defaultIncome));
    const [categories, setCategories] = useState<BudgetCategoryItem[]>(initialCategories);
    const [overspendAlerts, setOverspendAlerts] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [saved, setSaved] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const monthlyIncome = Math.max(0, Number(incomeInput) || 0);
    const totalAllocated = categories.reduce((sum, c) => sum + c.limit, 0);
    const unallocated = monthlyIncome - totalAllocated;
    const isOverBudget = unallocated < 0;

    const formatMoney = (val: number) =>
      `${val < 0 ? "-" : ""}${currency} ${Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

    const updateCategoryLimit = (id: string, raw: string) => {
      const nextVal = Math.max(0, Number(raw) || 0);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, limit: nextVal } : c)),
      );
    };

    const handleSave = async () => {
      if (submitting || isOverBudget) return;
      setSubmitting(true);
      setErrorMessage(null);
      try {
        await onSaveBudget?.({
          monthlyIncome,
          categories,
          overspendAlerts,
          warningThresholdPercent: 80,
        });
        setSaved(true);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to save monthly budget. Please retry.",
        );
      } finally {
        setSubmitting(false);
      }
    };

    const classes = ["fc-budget-setup-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label="Monthly budget setup flow"
        {...props}
      >
        <div className="fc-budget-setup-flow__header" aria-live="polite">
          <h2 className="fc-budget-setup-flow__title">Monthly Budget Setup</h2>
          <Badge variant={saved ? "success" : isOverBudget ? "error" : "info"}>
            {saved
              ? "Budget Active"
              : isOverBudget
                ? "Over Income"
                : `${formatMoney(unallocated)} Unallocated`}
          </Badge>
        </div>

        {step === 1 && (
          <div className="fc-budget-setup-flow__card">
            <Input
              label={`Monthly Take-Home Income (${currency})`}
              type="text"
              inputMode="decimal"
              value={incomeInput}
              onChange={(e) => setIncomeInput(e.target.value)}
              onInput={(e) => setIncomeInput((e.target as HTMLInputElement).value)}
            />

            <div className="fc-budget-setup-flow__kpis">
              <div className="fc-budget-setup-flow__kpi">
                <span className="fc-budget-setup-flow__kpi-label">Total Allocated</span>
                <span className="fc-budget-setup-flow__kpi-value">{formatMoney(totalAllocated)}</span>
              </div>
              <div className="fc-budget-setup-flow__kpi">
                <span className="fc-budget-setup-flow__kpi-label">Remaining / Savings</span>
                <span className="fc-budget-setup-flow__kpi-value">{formatMoney(unallocated)}</span>
              </div>
            </div>

            {isOverBudget && (
              <Alert variant="error" title="Allocations exceed monthly income">
                Reduce category limits by {formatMoney(Math.abs(unallocated))} to stay within income.
              </Alert>
            )}

            <div className="fc-budget-setup-flow__categories">
              {categories.map((cat) => (
                <div key={cat.id} className="fc-budget-setup-flow__cat-row">
                  <SpendingMeter
                    title={cat.name}
                    currentSpent={cat.currentSpent ?? 0}
                    limit={Math.max(1, cat.limit)}
                    currency={currency}
                  />
                  <Input
                    label={`${cat.name} Limit`}
                    type="text"
                    inputMode="decimal"
                    value={String(cat.limit)}
                    onChange={(e) => updateCategoryLimit(cat.id, e.target.value)}
                    onInput={(e) =>
                      updateCategoryLimit(cat.id, (e.target as HTMLInputElement).value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="fc-budget-setup-flow__actions">
              <span />
              <Button
                type="button"
                variant="primary"
                disabled={isOverBudget || monthlyIncome <= 0}
                onClick={() => setStep(2)}
              >
                Continue to Alerts &amp; Save
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fc-budget-setup-flow__card">
            {saved ? (
              <>
                <Alert variant="success" title="Monthly Budget Saved">
                  Your {formatMoney(totalAllocated)} budget across {categories.length} categories is active.
                </Alert>
                <div className="fc-budget-setup-flow__actions">
                  <span />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setSaved(false);
                      setStep(1);
                    }}
                  >
                    Edit Budget
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: 0 }}>Spend Alerts &amp; Confirmation</h3>
                {errorMessage && (
                  <Alert variant="error" title="Save Failed">
                    {errorMessage}
                  </Alert>
                )}
                <Switch
                  checked={overspendAlerts}
                  onCheckedChange={setOverspendAlerts}
                  label="Notify me when any category reaches 80% of its monthly limit"
                />
                <div className="fc-budget-setup-flow__actions">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Back to Categories
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={submitting || isOverBudget}
                    onClick={handleSave}
                  >
                    {submitting ? "Saving..." : "Save Monthly Budget"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

BudgetSetupFlow.displayName = "BudgetSetupFlow";
export default BudgetSetupFlow;
