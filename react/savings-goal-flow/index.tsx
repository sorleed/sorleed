import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";
import { Switch } from "../switch";
import type { SavingsGoalFlowProps, SavingsGoalFrequency } from "../types";

const PRESETS = [
  { id: "emergency", label: "Emergency Fund", defaultTarget: 10000 },
  { id: "vacation", label: "Vacation", defaultTarget: 3500 },
  { id: "home", label: "Home Down Payment", defaultTarget: 45000 },
  { id: "custom", label: "Custom Goal", defaultTarget: 5000 },
];

export const SavingsGoalFlow = React.forwardRef<HTMLDivElement, SavingsGoalFlowProps>(
  (
    {
      currency = "USD",
      apyPercent = 4.25,
      defaultGoalName = "Emergency Fund",
      defaultTargetAmount = 10000,
      onCreateGoal,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [category, setCategory] = useState<string>("emergency");
    const [goalName, setGoalName] = useState<string>(defaultGoalName);
    const [targetInput, setTargetInput] = useState<string>(String(defaultTargetAmount));
    const [initialInput, setInitialInput] = useState<string>("500");
    const [monthsInput, setMonthsInput] = useState<string>("12");
    const [frequency, setFrequency] = useState<SavingsGoalFrequency>("monthly");
    const [roundUpsEnabled, setRoundUpsEnabled] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [createdGoalId, setCreatedGoalId] = useState<string | null>(null);

    const targetAmount = Math.max(0, Number(targetInput) || 0);
    const initialDeposit = Math.max(0, Number(initialInput) || 0);
    const targetMonths = Math.max(1, Math.round(Number(monthsInput) || 12));
    const remainingToSave = Math.max(0, targetAmount - initialDeposit);

    const periodsCount =
      frequency === "weekly"
        ? targetMonths * 4
        : frequency === "biweekly"
          ? targetMonths * 2
          : targetMonths;
    const autoSaveAmount =
      periodsCount > 0 ? Math.ceil((remainingToSave / periodsCount) * 100) / 100 : 0;

    const estimatedInterest =
      Math.round(targetAmount * (apyPercent / 100) * (targetMonths / 12) * 0.5 * 100) / 100;

    const formatMoney = (val: number) =>
      `${currency} ${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const canAdvanceStep1 = goalName.trim().length > 0 && targetAmount > 0;

    const handleActivate = async () => {
      if (submitting) return;
      setSubmitting(true);
      setErrorMessage(null);
      try {
        const res = await onCreateGoal?.({
          goalName: goalName.trim(),
          category,
          targetAmount,
          initialDeposit,
          targetMonths,
          frequency,
          autoSaveAmount,
          roundUpsEnabled,
        });
        setCreatedGoalId(res?.goalId || `GOAL-${Date.now().toString().slice(-6)}`);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Could not create savings goal. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    };

    const classes = ["fc-savings-goal-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label="Savings goal setup flow"
        {...props}
      >
        <div className="fc-savings-goal-flow__steps" aria-live="polite">
          <span
            className={`fc-savings-goal-flow__step ${
              step === 1 ? "fc-savings-goal-flow__step--active" : "fc-savings-goal-flow__step--done"
            }`}
          >
            1. Define Goal
          </span>
          <span>→</span>
          <span
            className={`fc-savings-goal-flow__step ${
              step === 2
                ? "fc-savings-goal-flow__step--active"
                : step > 2
                  ? "fc-savings-goal-flow__step--done"
                  : ""
            }`}
          >
            2. Auto-Save Rules
          </span>
          <span>→</span>
          <span
            className={`fc-savings-goal-flow__step ${
              step === 3 ? "fc-savings-goal-flow__step--active" : ""
            }`}
          >
            3. Review &amp; Activate
          </span>
        </div>

        {step === 1 && (
          <div className="fc-savings-goal-flow__card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Create a Savings Goal</h3>
              <Badge variant="success">{apyPercent.toFixed(2)}% APY</Badge>
            </div>

            <div className="fc-savings-goal-flow__presets" role="group" aria-label="Goal presets">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`fc-savings-goal-flow__preset ${
                    category === preset.id ? "fc-savings-goal-flow__preset--active" : ""
                  }`}
                  aria-pressed={category === preset.id}
                  onClick={() => {
                    setCategory(preset.id);
                    setGoalName(preset.label);
                    setTargetInput(String(preset.defaultTarget));
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Input
              label="Goal Name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              onInput={(e) => setGoalName((e.target as HTMLInputElement).value)}
            />

            <div className="fc-savings-goal-flow__grid">
              <Input
                label={`Target Amount (${currency})`}
                type="text"
                inputMode="decimal"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onInput={(e) => setTargetInput((e.target as HTMLInputElement).value)}
              />
              <Input
                label={`Initial Deposit (${currency})`}
                type="text"
                inputMode="decimal"
                value={initialInput}
                onChange={(e) => setInitialInput(e.target.value)}
                onInput={(e) => setInitialInput((e.target as HTMLInputElement).value)}
              />
              <Input
                label="Target Timeline (Months)"
                type="text"
                inputMode="numeric"
                value={monthsInput}
                onChange={(e) => setMonthsInput(e.target.value)}
                onInput={(e) => setMonthsInput((e.target as HTMLInputElement).value)}
              />
            </div>

            <div className="fc-savings-goal-flow__actions">
              <span />
              <Button
                type="button"
                variant="primary"
                disabled={!canAdvanceStep1}
                onClick={() => setStep(2)}
              >
                Continue to Auto-Save
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fc-savings-goal-flow__card">
            <h3 style={{ margin: 0 }}>Automate Your Contributions</h3>

            <div className="fc-savings-goal-flow__presets" role="group" aria-label="Contribution frequency">
              {(["weekly", "biweekly", "monthly"] as SavingsGoalFrequency[]).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`fc-savings-goal-flow__preset ${
                    frequency === freq ? "fc-savings-goal-flow__preset--active" : ""
                  }`}
                  aria-pressed={frequency === freq}
                  onClick={() => setFrequency(freq)}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>

            <div className="fc-savings-goal-flow__summary">
              <div className="fc-savings-goal-flow__row">
                <span>Recommended {frequency} contribution</span>
                <strong>{formatMoney(autoSaveAmount)}</strong>
              </div>
              <div className="fc-savings-goal-flow__row">
                <span>Estimated interest earned ({apyPercent}% APY)</span>
                <strong>+{formatMoney(estimatedInterest)}</strong>
              </div>
            </div>

            <Switch
              checked={roundUpsEnabled}
              onCheckedChange={setRoundUpsEnabled}
              label="Enable spare-change card round-ups into this goal"
            />

            <div className="fc-savings-goal-flow__actions">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" variant="primary" onClick={() => setStep(3)}>
                Review Goal
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fc-savings-goal-flow__card">
            {createdGoalId ? (
              <>
                <Alert variant="success" title="Savings Goal Activated">
                  {goalName} ({createdGoalId}) is live with {formatMoney(autoSaveAmount)} scheduled {frequency}.
                </Alert>
                <div className="fc-savings-goal-flow__actions">
                  <span />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setCreatedGoalId(null);
                      setStep(1);
                    }}
                  >
                    Create Another Goal
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: 0 }}>Review &amp; Activate Goal</h3>
                {errorMessage && (
                  <Alert variant="error" title="Activation Failed">
                    {errorMessage}
                  </Alert>
                )}
                <div className="fc-savings-goal-flow__summary">
                  <div className="fc-savings-goal-flow__row">
                    <span>Goal</span>
                    <strong>{goalName}</strong>
                  </div>
                  <div className="fc-savings-goal-flow__row">
                    <span>Target Amount</span>
                    <strong>{formatMoney(targetAmount)}</strong>
                  </div>
                  <div className="fc-savings-goal-flow__row">
                    <span>Initial Deposit</span>
                    <strong>{formatMoney(initialDeposit)}</strong>
                  </div>
                  <div className="fc-savings-goal-flow__row">
                    <span>Auto-Save Plan</span>
                    <strong>
                      {formatMoney(autoSaveAmount)} / {frequency} ({targetMonths} mo)
                    </strong>
                  </div>
                  <div className="fc-savings-goal-flow__row">
                    <span>Card Round-Ups</span>
                    <strong>{roundUpsEnabled ? "Enabled" : "Off"}</strong>
                  </div>
                </div>
                <div className="fc-savings-goal-flow__actions">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={submitting}
                    onClick={handleActivate}
                  >
                    {submitting ? "Activating..." : "Activate Savings Goal"}
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

SavingsGoalFlow.displayName = "SavingsGoalFlow";
export default SavingsGoalFlow;

