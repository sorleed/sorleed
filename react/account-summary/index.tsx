import React, { useState } from "react";
import type { AccountSummaryProps } from "../types";

export const AccountSummary = React.forwardRef<HTMLDivElement, AccountSummaryProps>(
  (
    {
      bankName,
      accountName,
      accountNumber,
      accountType = "Checking Account",
      routingOrSortCode,
      iban,
      balance,
      allowToggleVisibility = true,
      defaultHidden = false,
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [hidden, setHidden] = useState(defaultHidden);

    const handleCopy = (field: string, value: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(value).catch(() => {});
      }
      setCopiedField(field);
      onCopy?.(field, value);
      setTimeout(() => setCopiedField(null), 2000);
    };

    const classes = ["fc-account-summary", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <div className="fc-account-summary__header">
          <div className="fc-account-summary__bank-details">
            <h3 className="fc-account-summary__bank-name">{bankName}</h3>
            <span className="fc-account-summary__account-type">{accountType}</span>
          </div>
          {allowToggleVisibility && (
            <button
              type="button"
              className="fc-account-summary__privacy-toggle"
              onClick={() => setHidden(!hidden)}
              aria-label={hidden ? "Show sensitive details" : "Hide sensitive details"}
              aria-pressed={hidden}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "inline-flex",
                alignItems: "center",
                color: "var(--fc-color-content-muted)",
              }}
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

        <div className="fc-account-summary__grid">
          <div className="fc-account-summary__field">
            <span className="fc-account-summary__field-label">Account Name</span>
            <div className="fc-account-summary__field-value-row">
              <span className="fc-account-summary__field-value">{accountName}</span>
            </div>
          </div>

          <div className="fc-account-summary__field">
            <span className="fc-account-summary__field-label">Account Number</span>
            <div className="fc-account-summary__field-value-row">
              <span className="fc-account-summary__field-value">
                {hidden ? `••••${accountNumber.slice(-4)}` : accountNumber}
              </span>
              <button
                type="button"
                className="fc-account-summary__copy-btn"
                onClick={() => handleCopy("accountNumber", accountNumber)}
                aria-label={`Copy account number ${accountNumber}`}
              >
                {copiedField === "accountNumber" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {routingOrSortCode && (
            <div className="fc-account-summary__field">
              <span className="fc-account-summary__field-label">Sort / Routing Code</span>
              <div className="fc-account-summary__field-value-row">
                <span className="fc-account-summary__field-value">
                  {hidden ? `••-••-${routingOrSortCode.slice(-2)}` : routingOrSortCode}
                </span>
                <button
                  type="button"
                  className="fc-account-summary__copy-btn"
                  onClick={() => handleCopy("routingOrSortCode", routingOrSortCode)}
                  aria-label={`Copy sort code ${routingOrSortCode}`}
                >
                  {copiedField === "routingOrSortCode" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {iban && (
            <div className="fc-account-summary__field">
              <span className="fc-account-summary__field-label">IBAN</span>
              <div className="fc-account-summary__field-value-row">
                <span className="fc-account-summary__field-value">
                  {hidden ? `${iban.slice(0, 4)}••••••••${iban.slice(-4)}` : iban}
                </span>
                <button
                  type="button"
                  className="fc-account-summary__copy-btn"
                  onClick={() => handleCopy("iban", iban)}
                  aria-label={`Copy IBAN ${iban}`}
                >
                  {copiedField === "iban" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {balance !== undefined && (
            <div className="fc-account-summary__field">
              <span className="fc-account-summary__field-label">Available Balance</span>
              <div className="fc-account-summary__field-value-row">
                <span className="fc-account-summary__field-value" style={{ fontWeight: 600 }}>
                  {hidden ? "••••••••" : balance}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

AccountSummary.displayName = "AccountSummary";
export default AccountSummary;
