import React, { useState } from "react";
import type { PortfolioSummaryProps } from "../types";

export const PortfolioSummary = React.forwardRef<HTMLDivElement, PortfolioSummaryProps>(
  (
    {
      totalValue,
      currency = "USD",
      returnsValue,
      returnsPercentage,
      investedAmount,
      cashBalance,
      apy,
      allowToggleVisibility = true,
      defaultHidden = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [hidden, setHidden] = useState(defaultHidden);
    const isPositive = returnsPercentage >= 0;

    const formatNum = (val: number | string) =>
      typeof val === "number" ? val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : val;

    const classes = ["fc-portfolio-summary", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Investment Portfolio Summary" {...props}>
        <div className="fc-portfolio-summary__top-row">
          <span className="fc-portfolio-summary__label">Portfolio Net Worth</span>
          {allowToggleVisibility && (
            <button
              type="button"
              className="fc-portfolio-summary__privacy-toggle"
              onClick={() => setHidden(!hidden)}
              aria-label={hidden ? "Show portfolio value" : "Hide portfolio value"}
              aria-pressed={hidden}
            >
              {hidden ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="23" x2="23" y2="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="fc-portfolio-summary__main-val-row">
          <span className="fc-portfolio-summary__total">
            {hidden ? "••••••••" : `${currency} ${formatNum(totalValue)}`}
          </span>

          <span
            className={`fc-portfolio-summary__returns-pill ${
              isPositive ? "fc-portfolio-summary__returns-pill--positive" : "fc-portfolio-summary__returns-pill--negative"
            }`}
          >
            {isPositive ? "▲ +" : "▼ "}
            {Math.abs(returnsPercentage)}%
            {returnsValue !== undefined && !hidden && ` (${currency} ${formatNum(returnsValue)})`}
          </span>
        </div>

        <div className="fc-portfolio-summary__breakdown-grid">
          {investedAmount !== undefined && (
            <div className="fc-portfolio-summary__stat">
              <span className="fc-portfolio-summary__stat-label">Total Invested</span>
              <span className="fc-portfolio-summary__stat-value">
                {hidden ? "••••••" : `${currency} ${formatNum(investedAmount)}`}
              </span>
            </div>
          )}

          {cashBalance !== undefined && (
            <div className="fc-portfolio-summary__stat">
              <span className="fc-portfolio-summary__stat-label">Uninvested Cash</span>
              <span className="fc-portfolio-summary__stat-value">
                {hidden ? "••••••" : `${currency} ${formatNum(cashBalance)}`}
              </span>
            </div>
          )}

          {apy !== undefined && (
            <div className="fc-portfolio-summary__stat">
              <span className="fc-portfolio-summary__stat-label">Est. Annual APY</span>
              <span className="fc-portfolio-summary__stat-value" style={{ color: "var(--fc-color-status-success)" }}>
                {apy}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

PortfolioSummary.displayName = "PortfolioSummary";
export default PortfolioSummary;
