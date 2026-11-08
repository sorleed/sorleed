import React from "react";
import type { RepaymentScheduleProps } from "../types";

export const RepaymentSchedule = React.forwardRef<HTMLDivElement, RepaymentScheduleProps>(
  (
    {
      title = "Loan Repayment Schedule",
      subtitle,
      currency = "USD",
      installments = [],
      onPayInstallment,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-repayment-schedule", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label={typeof title === "string" ? title : "Repayment Schedule"} {...props}>
        <div className="fc-repayment-schedule__header">
          <h3 className="fc-repayment-schedule__title">{title}</h3>
          {subtitle && <span className="fc-repayment-schedule__subtitle">{subtitle}</span>}
        </div>

        <div className="fc-repayment-schedule__table-wrap">
          <table className="fc-repayment-schedule__table">
            <thead>
              <tr>
                <th className="fc-repayment-schedule__th">#</th>
                <th className="fc-repayment-schedule__th">Due Date</th>
                <th className="fc-repayment-schedule__th">Amount</th>
                <th className="fc-repayment-schedule__th">Status</th>
                <th className="fc-repayment-schedule__th">Action</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((item) => (
                <tr key={item.installmentNumber}>
                  <td className="fc-repayment-schedule__td" style={{ fontFamily: "monospace" }}>
                    {item.installmentNumber}
                  </td>
                  <td className="fc-repayment-schedule__td">{item.dueDate}</td>
                  <td className="fc-repayment-schedule__td" style={{ fontWeight: 600 }}>
                    {currency} {typeof item.amount === "number" ? item.amount.toLocaleString() : item.amount}
                  </td>
                  <td className="fc-repayment-schedule__td">
                    <span className={`fc-repayment-schedule__status-pill fc-repayment-schedule__status-pill--${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="fc-repayment-schedule__td">
                    {item.status === "due" && onPayInstallment ? (
                      <button
                        type="button"
                        className="fc-repayment-schedule__pay-btn"
                        onClick={() => onPayInstallment(item.installmentNumber)}
                        aria-label={`Pay installment ${item.installmentNumber}`}
                      >
                        Pay
                      </button>
                    ) : item.status === "paid" ? (
                      <span style={{ color: "var(--fc-color-status-success)", fontSize: "12px" }}>✓ Paid</span>
                    ) : (
                      <span style={{ color: "var(--fc-color-content-muted)", fontSize: "12px" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

RepaymentSchedule.displayName = "RepaymentSchedule";
export default RepaymentSchedule;

