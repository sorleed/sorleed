import React from "react";
import type { FeeBreakdownProps } from "../types";

export const FeeBreakdown = React.forwardRef<HTMLDivElement, FeeBreakdownProps>(
  (
    {
      fees = [],
      currency = "USD",
      totalFee,
      recipientGets,
      exchangeRateNotice,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-fee-breakdown", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Fee Breakdown" {...props}>
        <div className="fc-fee-breakdown__list">
          {fees.map((fee, idx) => (
            <div
              key={idx}
              className={`fc-fee-breakdown__item ${fee.isDiscount ? "fc-fee-breakdown__item--discount" : ""}`}
            >
              <span>{fee.label}</span>
              <span>
                {fee.isDiscount ? "-" : ""}
                {currency} {fee.amount}
              </span>
            </div>
          ))}
        </div>

        <div className="fc-fee-breakdown__divider" />

        <div className="fc-fee-breakdown__total-row">
          <span>Total Fees</span>
          <span>{currency} {totalFee}</span>
        </div>

        {recipientGets !== undefined && (
          <div className="fc-fee-breakdown__recipient-gets">
            <span>Recipient Gets</span>
            <span>{currency} {recipientGets}</span>
          </div>
        )}

        {exchangeRateNotice && (
          <p className="fc-fee-breakdown__notice">{exchangeRateNotice}</p>
        )}
      </div>
    );
  },
);

FeeBreakdown.displayName = "FeeBreakdown";
export default FeeBreakdown;
