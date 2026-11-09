import React from "react";
import type { JournalEntryLedgerProps } from "../types";

export const JournalEntryLedger = React.forwardRef<HTMLDivElement, JournalEntryLedgerProps>(
  (
    {
      title = "General Journal Entry",
      entryNumber = "JE-2026-089",
      date,
      entries = [],
      currency = "USD",
      onPostEntry,
      className,
      ...props
    },
    ref,
  ) => {
    const totalDebits = entries.reduce((acc, row) => acc + (Number(row.debit) || 0), 0);
    const totalCredits = entries.reduce((acc, row) => acc + (Number(row.credit) || 0), 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001 && totalDebits > 0;

    const classes = ["fc-journal-entry", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Journal Entry Ledger"}
        {...props}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
            <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
              {entryNumber} {date ? `• ${date}` : ""}
            </span>
          </div>
          <span
            className={`fc-journal-entry__status ${
              isBalanced ? "fc-journal-entry__status--balanced" : "fc-journal-entry__status--unbalanced"
            }`}
            style={{ fontWeight: 600, fontSize: "13px" }}
          >
            {isBalanced ? "✓ BALANCED" : "✕ UNBALANCED"}
          </span>
        </div>

        {/* Ledger table */}
        <div className="fc-journal-entry__table-wrap">
          <table className="fc-journal-entry__table">
            <thead>
              <tr>
                <th className="fc-journal-entry__th">Account</th>
                <th className="fc-journal-entry__th">Description</th>
                <th className="fc-journal-entry__th fc-journal-entry__th--right">Debit ({currency})</th>
                <th className="fc-journal-entry__th fc-journal-entry__th--right">Credit ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((row, idx) => (
                <tr key={idx}>
                  <td className="fc-journal-entry__td" style={{ fontWeight: 500 }}>
                    {row.accountCode ? `[${row.accountCode}] ` : ""}
                    {row.accountName}
                  </td>
                  <td className="fc-journal-entry__td" style={{ color: "var(--fc-color-text-secondary)" }}>
                    {row.description || "—"}
                  </td>
                  <td className="fc-journal-entry__td fc-journal-entry__td--right" style={{ fontFamily: "var(--fc-font-mono, monospace)" }}>
                    {row.debit ? Number(row.debit).toFixed(2) : "—"}
                  </td>
                  <td className="fc-journal-entry__td fc-journal-entry__td--right" style={{ fontFamily: "var(--fc-font-mono, monospace)" }}>
                    {row.credit ? Number(row.credit).toFixed(2) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals footer */}
        <div className="fc-journal-entry__footer">
          <span>Totals:</span>
          <div style={{ display: "flex", gap: "24px", fontFamily: "var(--fc-font-mono, monospace)" }}>
            <span>Debits: {currency} {totalDebits.toFixed(2)}</span>
            <span>Credits: {currency} {totalCredits.toFixed(2)}</span>
          </div>
        </div>

        {onPostEntry && (
          <button
            type="button"
            disabled={!isBalanced}
            onClick={onPostEntry}
            style={{
              padding: "10px 16px",
              backgroundColor: isBalanced ? "var(--fc-color-primary)" : "var(--fc-color-border)",
              color: isBalanced ? "white" : "var(--fc-color-text-secondary)",
              border: "none",
              borderRadius: "var(--fc-radius-md)",
              fontWeight: 600,
              cursor: isBalanced ? "pointer" : "not-allowed",
              marginTop: "4px",
            }}
          >
            Post to General Ledger
          </button>
        )}
      </div>
    );
  },
);

JournalEntryLedger.displayName = "JournalEntryLedger";

export default JournalEntryLedger;

