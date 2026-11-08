import React from "react";
import type { SpendingMeterProps } from "../types";

export const SpendingMeter = React.forwardRef<HTMLDivElement, SpendingMeterProps>(
  (
    {
      title = "Monthly Spending Limit",
      currentSpent = 1200,
      limit = 2000,
      currency = "USD",
      warningThreshold = 80, // %
      dangerThreshold = 100, // %
      className,
      ...props
    },
    ref,
  ) => {
    const rawPercentage = limit > 0 ? (currentSpent / limit) * 100 : 0;
    const clampedPercentage = Math.min(100, Math.max(0, rawPercentage));
    const remaining = Math.max(0, limit - currentSpent);

    let statusStyle = "fc-spending-meter__fill--normal";
    if (rawPercentage >= dangerThreshold) {
      statusStyle = "fc-spending-meter__fill--danger";
    } else if (rawPercentage >= warningThreshold) {
      statusStyle = "fc-spending-meter__fill--warning";
    }

    const classes = ["fc-spending-meter", className].filter(Boolean).join(" ");

    const ariaLabel = typeof title === "string" ? `${title}: ${Math.round(rawPercentage)}% used` : `${Math.round(rawPercentage)}% used`;

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={ariaLabel}
        {...props}
      >
        <div className="fc-spending-meter__header">
          <h4 className="fc-spending-meter__title">{title}</h4>
          <span className="fc-spending-meter__fraction">
            <strong>{currency} {currentSpent.toLocaleString()}</strong> of {currency} {limit.toLocaleString()}
          </span>
        </div>

        <div
          className="fc-spending-meter__track"
          role="progressbar"
          aria-valuenow={currentSpent}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-valuetext={`${Math.round(rawPercentage)}% of budget spent`}
        >
          <div
            className={`fc-spending-meter__fill ${statusStyle}`}
            style={{ width: `${clampedPercentage}%` }}
          />
        </div>

        <div className="fc-spending-meter__footer">
          <span>{Math.round(rawPercentage)}% consumed</span>
          <span>{currency} {remaining.toLocaleString()} remaining</span>
        </div>
      </div>
    );
  },
);

SpendingMeter.displayName = "SpendingMeter";
export default SpendingMeter;
