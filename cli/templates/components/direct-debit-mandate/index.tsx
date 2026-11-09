import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button } from "../button";
import type { DirectDebitMandateProps } from "../types";

export const DirectDebitMandate: React.FC<DirectDebitMandateProps> = ({
  open,
  onOpenChange,
  creditorName = "Acme Utilities Ltd",
  creditorId = "GB12ZZZ000000",
  mandateReference = "MNDT-98745612",
  accountHolderName,
  bankName,
  accountNumberMasked = "••••5678",
  frequency = "Monthly",
  maxAmount,
  currency = "USD",
  onAuthorize,
  onCancel,
  className,
}) => {
  const contentClasses = ["fc-mandate-dialog", className].filter(Boolean).join(" ");

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fc-mandate-overlay" />
        <RadixDialog.Content className={contentClasses} aria-describedby="fc-mandate-desc">
          <div className="fc-mandate__header">
            <div className="fc-mandate__icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div>
              <RadixDialog.Title asChild>
                <h3 className="fc-mandate__title">Direct Debit Mandate</h3>
              </RadixDialog.Title>
              <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
                Authorizing {creditorName}
              </span>
            </div>
          </div>

          <RadixDialog.Description asChild>
            <p id="fc-mandate-desc" style={{ margin: 0, fontSize: "13px", color: "var(--fc-color-text-secondary)" }}>
              By confirming, you authorize {creditorName} to send instructions to your bank to debit your account in accordance with the Direct Debit Guarantee.
            </p>
          </RadixDialog.Description>

          <div className="fc-mandate__details-box">
            <div className="fc-mandate__row">
              <span className="fc-mandate__row-label">Mandate Reference</span>
              <span className="fc-mandate__row-value">{mandateReference}</span>
            </div>
            <div className="fc-mandate__row">
              <span className="fc-mandate__row-label">Creditor ID</span>
              <span className="fc-mandate__row-value">{creditorId}</span>
            </div>
            {accountHolderName && (
              <div className="fc-mandate__row">
                <span className="fc-mandate__row-label">Account Holder</span>
                <span className="fc-mandate__row-value">{accountHolderName}</span>
              </div>
            )}
            <div className="fc-mandate__row">
              <span className="fc-mandate__row-label">Debited Account</span>
              <span className="fc-mandate__row-value">
                {bankName ? `${bankName} (${accountNumberMasked})` : accountNumberMasked}
              </span>
            </div>
            <div className="fc-mandate__row">
              <span className="fc-mandate__row-label">Frequency</span>
              <span className="fc-mandate__row-value">{frequency}</span>
            </div>
            {maxAmount !== undefined && (
              <div className="fc-mandate__row">
                <span className="fc-mandate__row-label">Max Limit</span>
                <span className="fc-mandate__row-value">
                  {currency} {typeof maxAmount === "number" ? maxAmount.toLocaleString() : maxAmount}
                </span>
              </div>
            )}
          </div>

          <p className="fc-mandate__guarantee-text">
            Protected by the Direct Debit Guarantee. You can cancel this mandate at any time directly from your banking portal.
          </p>

          <div className="fc-mandate__actions">
            <Button
              variant="secondary"
              onClick={() => {
                onCancel?.();
                onOpenChange?.(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onAuthorize?.()}
              aria-label="Authorize Direct Debit Mandate"
            >
              Authorize Mandate
            </Button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

DirectDebitMandate.displayName = "DirectDebitMandate";

export default DirectDebitMandate;

