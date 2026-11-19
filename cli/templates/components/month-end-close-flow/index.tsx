import React, { useState } from "react";
import { Alert } from "../alert";
import { AuditTrailTimeline } from "../audit-trail-timeline";
import { Badge } from "../badge";
import { BankReconciliationMatcher } from "../bank-reconciliation-matcher";
import { Button } from "../button";
import { CashFlowForecastCard } from "../cash-flow-forecast-card";
import type { MonthEndCloseFlowProps } from "../types";

export const MonthEndCloseFlow = React.forwardRef<HTMLDivElement, MonthEndCloseFlowProps>(
  (
    {
      periodLabel,
      currency = "USD",
      bankEntries,
      ledgerEntries,
      startingCash,
      monthlyBurnRate,
      cashFlowPeriods,
      auditEvents,
      onClosePeriod,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [matchedCount, setMatchedCount] = useState<number>(
      bankEntries.filter((e) => Boolean(e.matchedWithId)).length,
    );
    const [closing, setClosing] = useState(false);
    const [closed, setClosed] = useState(false);

    const handleClosePeriod = async () => {
      if (closing) return;
      setClosing(true);
      try {
        await onClosePeriod?.({ periodLabel, matchedCount });
        setClosed(true);
      } finally {
        setClosing(false);
      }
    };

    const classes = ["fc-month-close-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={`Month-end close flow for ${periodLabel}`}
        {...props}
      >
        <div className="fc-month-close-flow__header">
          <div>
            <h2 className="fc-month-close-flow__title">Month-End Close — {periodLabel}</h2>
            <div className="fc-month-close-flow__steps">
              <span
                className={`fc-month-close-flow__step ${
                  step === 1 ? "fc-month-close-flow__step--active" : "fc-month-close-flow__step--done"
                }`}
              >
                1. Reconcile Bank
              </span>
              <span>→</span>
              <span
                className={`fc-month-close-flow__step ${
                  step === 2
                    ? "fc-month-close-flow__step--active"
                    : step > 2
                      ? "fc-month-close-flow__step--done"
                      : ""
                }`}
              >
                2. Runway &amp; Audit Review
              </span>
              <span>→</span>
              <span
                className={`fc-month-close-flow__step ${
                  step === 3 ? "fc-month-close-flow__step--active" : ""
                }`}
              >
                3. Lock Period
              </span>
            </div>
          </div>
          <Badge variant={closed ? "success" : "info"}>
            {closed ? "Period Locked" : "In Progress"}
          </Badge>
        </div>

        {step === 1 && (
          <>
            <BankReconciliationMatcher
              currency={currency}
              bankEntries={bankEntries}
              ledgerEntries={ledgerEntries}
              onMatch={() => setMatchedCount((c) => c + 1)}
              onUnmatch={() => setMatchedCount((c) => Math.max(0, c - 1))}
            />
            <div className="fc-month-close-flow__actions">
              <span />
              <Button type="button" variant="primary" onClick={() => setStep(2)}>
                Continue to Runway &amp; Audit
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="fc-month-close-flow__review-grid">
              <CashFlowForecastCard
                currency={currency}
                startingCash={startingCash}
                monthlyBurnRate={monthlyBurnRate}
                periods={cashFlowPeriods}
              />
              <AuditTrailTimeline events={auditEvents} />
            </div>
            <div className="fc-month-close-flow__actions">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Back to Reconciliation
              </Button>
              <Button type="button" variant="primary" onClick={() => setStep(3)}>
                Proceed to Sign-off
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="fc-month-close-flow__card">
            {closed ? (
              <Alert variant="success" title={`${periodLabel} Closed & Locked`}>
                All {matchedCount} reconciled entries and audit logs have been sealed for {periodLabel}.
              </Alert>
            ) : (
              <>
                <Alert variant="warning" title="Controller Sign-Off Required">
                  Locking {periodLabel} prevents backdated journal entries. Matched entries: {matchedCount} / {bankEntries.length}.
                </Alert>
                <div className="fc-month-close-flow__actions">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                    Back to Review
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    disabled={closing}
                    onClick={handleClosePeriod}
                  >
                    {closing ? "Locking Period..." : `Lock & Close ${periodLabel}`}
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

MonthEndCloseFlow.displayName = "MonthEndCloseFlow";
export default MonthEndCloseFlow;
