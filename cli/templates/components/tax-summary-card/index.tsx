import React from "react";
import type { TaxSummaryCardProps } from "../types";

export const TaxSummaryCard = React.forwardRef<HTMLDivElement, TaxSummaryCardProps>(
  (
    {
      title = "Tax Year 2026 Summary",
      jurisdiction = "United States (Federal & State)",
      currency = "USD",
      grossRevenue = 150000,
      deductions = 32000,
      taxableIncome,
      estimatedTaxLiability = 28500,
      dueDate = "April 15, 2027",
      taxRatePercent = 24.1,
      className,
      ...props
    },
    ref,
  ) => {
    const computedTaxable = taxableIncome !== undefined ? taxableIncome : grossRevenue - deductions;
    const classes = ["fc-tax-summary", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Tax Summary Card"}
        {...props}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
          <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
            {jurisdiction}
          </span>
        </div>

        {/* Financial metrics */}
        <div className="fc-tax-summary__grid">
          <div className="fc-tax-summary__metric">
            <span className="fc-tax-summary__metric-label">Gross Income</span>
            <span className="fc-tax-summary__metric-val">
              {currency} {grossRevenue.toLocaleString()}
            </span>
          </div>

          <div className="fc-tax-summary__metric">
            <span className="fc-tax-summary__metric-label">Deductions</span>
            <span className="fc-tax-summary__metric-val" style={{ color: "var(--fc-color-success, #10b981)" }}>
              -{currency} {deductions.toLocaleString()}
            </span>
          </div>

          <div className="fc-tax-summary__metric">
            <span className="fc-tax-summary__metric-label">Taxable Net</span>
            <span className="fc-tax-summary__metric-val">
              {currency} {computedTaxable.toLocaleString()}
            </span>
          </div>

          <div className="fc-tax-summary__metric">
            <span className="fc-tax-summary__metric-label">Effective Rate</span>
            <span className="fc-tax-summary__metric-val">{taxRatePercent}%</span>
          </div>
        </div>

        {/* Highlighted Tax Due Box */}
        <div className="fc-tax-summary__liability">
          <div>
            <div style={{ fontSize: "12px", textTransform: "uppercase", color: "var(--fc-color-text-secondary)", fontWeight: 600 }}>
              Estimated Tax Liability
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fc-color-danger, #ef4444)", fontFamily: "var(--fc-font-mono, monospace)" }}>
              {currency} {estimatedTaxLiability.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>Filing Deadline</span>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{dueDate}</div>
          </div>
        </div>
      </div>
    );
  },
);

TaxSummaryCard.displayName = "TaxSummaryCard";

export default TaxSummaryCard;

