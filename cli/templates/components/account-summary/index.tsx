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
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

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
              <span className="fc-account-summary__field-value">{accountNumber}</span>
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
                <span className="fc-account-summary__field-value">{routingOrSortCode}</span>
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
                <span className="fc-account-summary__field-value">{iban}</span>
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
        </div>
      </div>
    );
  },
);

AccountSummary.displayName = "AccountSummary";
export default AccountSummary;
