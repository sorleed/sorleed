import React, { useState } from "react";
import type { IbanAccountDetailsProps } from "../types";

export const IbanAccountDetails = React.forwardRef<HTMLDivElement, IbanAccountDetailsProps>(
  (
    {
      title = "Receiving Account Details",
      accountHolder,
      currency = "EUR",
      railBadge = "SEPA Instant",
      bankName,
      bankAddress,
      fields,
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
    const [revealedMap, setRevealedMap] = useState<Record<string, boolean>>({});

    const handleCopy = async (label: string, value: string) => {
      try {
        if (typeof navigator !== "undefined") {
          await navigator.clipboard?.writeText?.(value);
        }
      } catch {
        // Clipboard write may be unavailable in non-secure contexts
      }
      setCopiedLabel(label);
      onCopy?.(label, value);
      setTimeout(() => {
        setCopiedLabel((prev) => (prev === label ? null : prev));
      }, 1800);
    };

    const toggleReveal = (label: string) => {
      setRevealedMap((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const maskValue = (val: string) => {
      if (val.length <= 4) return "••••";
      return `${"•".repeat(Math.max(4, val.length - 4))}${val.slice(-4)}`;
    };

    return (
      <div
        ref={ref}
        className={["fc-iban-details", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-iban-details__header">
          <div>
            <h3 className="fc-iban-details__title">{title}</h3>
            <p className="fc-iban-details__subtitle">Beneficiary: {accountHolder}</p>
          </div>
          <div className="fc-iban-details__badges">
            {currency && <span className="fc-iban-details__badge">{currency}</span>}
            {railBadge && <span className="fc-iban-details__badge">{railBadge}</span>}
          </div>
        </div>

        <ul className="fc-iban-details__list">
          {fields.map((field) => {
            const isSensitive = Boolean(field.sensitive);
            const isRevealed = Boolean(revealedMap[field.label]);
            const displayVal = isSensitive && !isRevealed ? maskValue(field.value) : field.value;
            const isCopied = copiedLabel === field.label;

            return (
              <li key={field.label} className="fc-iban-details__row">
                <div className="fc-iban-details__field">
                  <span className="fc-iban-details__label">{field.label}</span>
                  <span className="fc-iban-details__value">{displayVal}</span>
                </div>
                <div className="fc-iban-details__actions">
                  {isSensitive && (
                    <button
                      type="button"
                      className="fc-iban-details__btn"
                      onClick={() => toggleReveal(field.label)}
                      aria-label={isRevealed ? `Hide ${field.label}` : `Show ${field.label}`}
                      aria-pressed={isRevealed}
                    >
                      {isRevealed ? "Hide" : "Show"}
                    </button>
                  )}
                  {field.copyable !== false && (
                    <button
                      type="button"
                      className={[
                        "fc-iban-details__btn",
                        isCopied ? "fc-iban-details__btn--copied" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleCopy(field.label, field.value)}
                      aria-label={`Copy ${field.label}`}
                    >
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {(bankName || bankAddress) && (
          <div className="fc-iban-details__footer">
            <span>{bankName}</span>
            {bankAddress && <span>{bankAddress}</span>}
          </div>
        )}
      </div>
    );
  },
);

IbanAccountDetails.displayName = "IbanAccountDetails";
export default IbanAccountDetails;

