import React, { useState } from "react";
import type { BalanceCardProps } from "../types";

export const BalanceCard = React.forwardRef<HTMLDivElement, BalanceCardProps>(
  (
    {
      title,
      account,
      amount,
      footer,
      allowToggleVisibility = false,
      defaultHidden = false,
      isHidden: controlledHidden,
      onToggleVisibility,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledHidden !== undefined;
    const [internalHidden, setInternalHidden] = useState(defaultHidden);
    const hidden = isControlled ? controlledHidden : internalHidden;

    const handleToggle = () => {
      const next = !hidden;
      if (!isControlled) {
        setInternalHidden(next);
      }
      onToggleVisibility?.(next);
    };

    return (
      <div
        ref={ref}
        className={["fc-balance-card", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-balance-card__header fc-balance-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="fc-balance-card__title fc-balance-card-title">{title}</span>
            {allowToggleVisibility && (
              <button
                type="button"
                className="fc-balance-card__privacy-toggle"
                onClick={handleToggle}
                aria-label={hidden ? "Show balance" : "Hide balance"}
                aria-pressed={hidden}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  color: "inherit",
                  opacity: 0.7,
                }}
              >
                {hidden ? (
                  /* Eye closed / strike icon */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye open icon */
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            )}
          </div>
          {account && (
            <span className="fc-balance-card__account fc-balance-card-account">
              {account}
            </span>
          )}
        </div>

        <div className="fc-balance-card__amount fc-balance-card-amount">
          {hidden ? (
            <span aria-label="Balance hidden" style={{ letterSpacing: "2px" }}>
              ••••••••
            </span>
          ) : (
            amount
          )}
        </div>

        {footer && (
          <div className="fc-balance-card__footer fc-balance-card-footer">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

BalanceCard.displayName = "BalanceCard";
export default BalanceCard;
