import React from "react";
import { Badge } from "../badge";
import type { CreditUtilizationMeterProps } from "../types";

export const CreditUtilizationMeter = React.forwardRef<HTMLDivElement, CreditUtilizationMeterProps>(
  (
    {
      title = "Credit Utilization",
      creditLimit,
      currentBalance,
      currency = "USD",
      statementCloseDate,
      minimumDue,
      utilizationPercent,
      optimalThreshold = 30,
      warningThreshold = 50,
      className,
      ...props
    },
    ref,
  ) => {
    const computedPercent =
      utilizationPercent !== undefined
        ? utilizationPercent
        : creditLimit > 0
          ? (currentBalance / creditLimit) * 100
          : 0;
    const clampedPercent = Math.min(100, Math.max(0, computedPercent));
    const roundedPercent = Math.round(computedPercent * 10) / 10;
    const availableCredit = Math.max(0, creditLimit - currentBalance);

    let band: "optimal" | "moderate" | "high" = "optimal";
    let badgeVariant: "success" | "warning" | "error" = "success";
    let bandLabel = "Optimal (<30%)";

    if (computedPercent >= warningThreshold) {
      band = "high";
      badgeVariant = "error";
      bandLabel = "High Utilization";
    } else if (computedPercent >= optimalThreshold) {
      band = "moderate";
      badgeVariant = "warning";
      bandLabel = "Moderate (30–49%)";
    }

    const formatMoney = (amount: number) =>
      `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const classes = ["fc-credit-utilization", className].filter(Boolean).join(" ");
    const regionLabel =
      typeof title === "string"
        ? `${title}: ${roundedPercent}% utilized`
        : `Credit utilization: ${roundedPercent}%`;

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={regionLabel}
        {...props}
      >
        <div className="fc-credit-utilization__header">
          <div>
            <h3 className="fc-credit-utilization__title">{title}</h3>
            <p className="fc-credit-utilization__subtitle">
              Keep utilization below {optimalThreshold}% to protect your credit score
            </p>
          </div>
          <Badge variant={badgeVariant}>{bandLabel}</Badge>
        </div>

        <div className="fc-credit-utilization__hero">
          <span className={`fc-credit-utilization__percent fc-credit-utilization__percent--${band}`}>
            {roundedPercent}%
          </span>
          <span className="fc-credit-utilization__balance">
            <strong>{formatMoney(currentBalance)}</strong> / {formatMoney(creditLimit)}
          </span>
        </div>

        <div className="fc-credit-utilization__bar-wrap">
          <div
            className="fc-credit-utilization__track"
            role="progressbar"
            aria-valuenow={Math.round(clampedPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${roundedPercent}% of credit limit used`}
          >
            <div
              className={`fc-credit-utilization__fill fc-credit-utilization__fill--${band}`}
              style={{ width: `${clampedPercent}%` }}
            />
          </div>
          <div className="fc-credit-utilization__bands">
            <span>0% Optimal</span>
            <span>{optimalThreshold}%</span>
            <span>{warningThreshold}%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="fc-credit-utilization__meta-grid">
          <div className="fc-credit-utilization__stat">
            <span className="fc-credit-utilization__stat-label">Available Credit</span>
            <span className="fc-credit-utilization__stat-value">{formatMoney(availableCredit)}</span>
          </div>
          {minimumDue !== undefined && (
            <div className="fc-credit-utilization__stat">
              <span className="fc-credit-utilization__stat-label">Minimum Due</span>
              <span className="fc-credit-utilization__stat-value">{formatMoney(minimumDue)}</span>
            </div>
          )}
          {statementCloseDate && (
            <div className="fc-credit-utilization__stat">
              <span className="fc-credit-utilization__stat-label">Statement Closes</span>
              <span className="fc-credit-utilization__stat-value">{statementCloseDate}</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

CreditUtilizationMeter.displayName = "CreditUtilizationMeter";
export default CreditUtilizationMeter;
