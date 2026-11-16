import React from "react";
import type { StandingOrderCardProps } from "../types";
import { formatMoney } from "../utils/format";

export const StandingOrderCard = React.forwardRef<HTMLDivElement, StandingOrderCardProps>(
  (
    {
      recipient,
      recipientAccount,
      amount,
      currency = "USD",
      frequency,
      nextRunDate,
      fundingAccount,
      reference,
      status = "active",
      onTogglePause,
      onCancel,
      className,
      ...props
    },
    ref,
  ) => {
    const isCancelled = status === "cancelled";
    const isPaused = status === "paused";

    return (
      <div
        ref={ref}
        className={["fc-standing-order", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-standing-order__header">
          <div>
            <h3 className="fc-standing-order__recipient">{recipient}</h3>
            <p className="fc-standing-order__account">{recipientAccount}</p>
          </div>
          <span className={`fc-standing-order__status fc-standing-order__status--${status}`}>
            {status}
          </span>
        </div>

        <div className="fc-standing-order__amount-row">
          <span className="fc-standing-order__amount">
            {formatMoney(amount, { currency })}
          </span>
          <span className="fc-standing-order__frequency">{frequency}</span>
        </div>

        <div className="fc-standing-order__details">
          <div>
            <span className="fc-standing-order__detail-label">Next Execution</span>
            <span className="fc-standing-order__detail-value">{nextRunDate}</span>
          </div>
          <div>
            <span className="fc-standing-order__detail-label">Funding Account</span>
            <span className="fc-standing-order__detail-value">{fundingAccount}</span>
          </div>
          {reference && (
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="fc-standing-order__detail-label">Payment Reference</span>
              <span className="fc-standing-order__detail-value">{reference}</span>
            </div>
          )}
        </div>

        {(onTogglePause || onCancel) && (
          <div className="fc-standing-order__actions">
            {onTogglePause && (
              <button
                type="button"
                className="fc-standing-order__btn"
                disabled={isCancelled}
                onClick={() => onTogglePause(isPaused ? "active" : "paused")}
              >
                {isPaused ? "Resume Order" : "Pause Order"}
              </button>
            )}
            {onCancel && (
              <button
                type="button"
                className="fc-standing-order__btn fc-standing-order__btn--danger"
                disabled={isCancelled}
                onClick={onCancel}
              >
                {isCancelled ? "Cancelled" : "Cancel"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

StandingOrderCard.displayName = "StandingOrderCard";
export default StandingOrderCard;

