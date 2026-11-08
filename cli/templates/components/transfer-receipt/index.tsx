import React, { useState } from "react";
import type { TransferReceiptProps } from "../types";

export const TransferReceipt = React.forwardRef<HTMLDivElement, TransferReceiptProps>(
  (
    {
      reference,
      amount,
      currency = "USD",
      status = "success",
      timestamp,
      recipientName,
      recipientBank,
      recipientAccount,
      senderName,
      senderAccount,
      fee,
      allowRedaction = true,
      onDownload,
      onShare,
      className,
      ...props
    },
    ref,
  ) => {
    const [isRedacted, setIsRedacted] = useState(false);

    const maskAccount = (acc?: string) => {
      if (!acc) return "";
      if (acc.length <= 4) return "••••";
      return `${acc.slice(0, 2)}••••${acc.slice(-2)}`;
    };

    const statusIcons: Record<string, string> = {
      success: "✓",
      pending: "⏱",
      failed: "✕",
    };

    const classes = ["fc-transfer-receipt", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Transaction Receipt" {...props}>
        <div className="fc-transfer-receipt__header">
          <div className={`fc-transfer-receipt__status-icon fc-transfer-receipt__status-icon--${status}`}>
            {statusIcons[status] || "✓"}
          </div>
          <div className="fc-transfer-receipt__amount">
            {currency} {typeof amount === "number" ? amount.toLocaleString() : amount}
          </div>
          <p className="fc-transfer-receipt__subtitle">
            {status === "success" ? "Transfer Successful" : status === "pending" ? "Processing Transfer" : "Transfer Failed"}
          </p>
        </div>

        <div className="fc-transfer-receipt__list">
          <div className="fc-transfer-receipt__row">
            <span className="fc-transfer-receipt__row-label">Reference</span>
            <span className="fc-transfer-receipt__row-value">{reference}</span>
          </div>

          {timestamp && (
            <div className="fc-transfer-receipt__row">
              <span className="fc-transfer-receipt__row-label">Date & Time</span>
              <span className="fc-transfer-receipt__row-value">{timestamp}</span>
            </div>
          )}

          <div className="fc-transfer-receipt__row">
            <span className="fc-transfer-receipt__row-label">Recipient</span>
            <span className="fc-transfer-receipt__row-value">{recipientName}</span>
          </div>

          <div className="fc-transfer-receipt__row">
            <span className="fc-transfer-receipt__row-label">Bank</span>
            <span className="fc-transfer-receipt__row-value">{recipientBank}</span>
          </div>

          <div className="fc-transfer-receipt__row">
            <span className="fc-transfer-receipt__row-label">Account</span>
            <span className="fc-transfer-receipt__row-value">
              {isRedacted ? maskAccount(recipientAccount) : recipientAccount}
            </span>
          </div>

          {senderName && (
            <div className="fc-transfer-receipt__row">
              <span className="fc-transfer-receipt__row-label">Sender</span>
              <span className="fc-transfer-receipt__row-value">{senderName}</span>
            </div>
          )}

          {senderAccount && (
            <div className="fc-transfer-receipt__row">
              <span className="fc-transfer-receipt__row-label">Sender Account</span>
              <span className="fc-transfer-receipt__row-value">
                {isRedacted ? maskAccount(senderAccount) : senderAccount}
              </span>
            </div>
          )}

          {fee !== undefined && (
            <div className="fc-transfer-receipt__row">
              <span className="fc-transfer-receipt__row-label">Transfer Fee</span>
              <span className="fc-transfer-receipt__row-value">{currency} {fee}</span>
            </div>
          )}
        </div>

        {allowRedaction && (
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer", color: "var(--fc-color-content-secondary)" }}>
            <input
              type="checkbox"
              checked={isRedacted}
              onChange={(e) => setIsRedacted(e.target.checked)}
              aria-label="Redact sensitive account numbers for sharing"
            />
            Redact sensitive account numbers for public sharing
          </label>
        )}

        {(onDownload || onShare) && (
          <div className="fc-transfer-receipt__actions">
            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                style={{
                  flex: 1,
                  height: "36px",
                  borderRadius: "6px",
                  border: "1px solid var(--fc-color-border-subtle)",
                  background: "var(--fc-color-surface-default)",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "13px",
                }}
              >
                Download Receipt
              </button>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                style={{
                  flex: 1,
                  height: "36px",
                  borderRadius: "6px",
                  border: "none",
                  background: "var(--fc-blue-600)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "13px",
                }}
              >
                Share Receipt
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

TransferReceipt.displayName = "TransferReceipt";
export default TransferReceipt;
