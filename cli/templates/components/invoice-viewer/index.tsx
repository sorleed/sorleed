import React from "react";
import { Badge } from "../badge";
import type { InvoiceViewerProps } from "../types";

export const InvoiceViewer = React.forwardRef<HTMLDivElement, InvoiceViewerProps>(
  (
    {
      invoiceNumber,
      issueDate,
      dueDate,
      status = "due",
      issuer,
      client,
      items = [],
      currency = "USD",
      taxRate = 0,
      discount = 0,
      notes,
      className,
      ...props
    },
    ref,
  ) => {
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discount;

    const statusBadgeVariant =
      status === "paid" ? "success" : status === "overdue" ? "error" : "warning";

    const classes = ["fc-invoice", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={`Invoice ${invoiceNumber}`}
        {...props}
      >
        <div className="fc-invoice__header">
          <div className="fc-invoice__issuer-info">
            <h3>{issuer.name}</h3>
            {issuer.address && <p style={{ margin: "4px 0", color: "var(--fc-color-text-secondary)", fontSize: "13px" }}>{issuer.address}</p>}
            {issuer.taxId && <p style={{ margin: 0, color: "var(--fc-color-text-secondary)", fontSize: "12px" }}>Tax ID / VAT: {issuer.taxId}</p>}
          </div>
          <div className="fc-invoice__meta">
            <span className="fc-invoice__number">INVOICE #{invoiceNumber}</span>
            <div style={{ margin: "4px 0" }}>
              <Badge variant={statusBadgeVariant}>{status.toUpperCase()}</Badge>
            </div>
            <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
              Issued: {issueDate} | Due: {dueDate}
            </span>
          </div>
        </div>

        {/* Client / Billed To */}
        <div className="fc-invoice__parties">
          <div>
            <div className="fc-invoice__party-title">Billed To</div>
            <div style={{ fontWeight: 600 }}>{client.name}</div>
            {client.address && <div style={{ color: "var(--fc-color-text-secondary)" }}>{client.address}</div>}
            {client.email && <div style={{ color: "var(--fc-color-text-secondary)" }}>{client.email}</div>}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="fc-invoice__table-wrap">
          <table className="fc-invoice__table">
            <thead>
              <tr>
                <th className="fc-invoice__th">Description</th>
                <th className="fc-invoice__th fc-invoice__th--right">Qty</th>
                <th className="fc-invoice__th fc-invoice__th--right">Rate</th>
                <th className="fc-invoice__th fc-invoice__th--right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="fc-invoice__td">{item.description}</td>
                  <td className="fc-invoice__td fc-invoice__td--right">{item.quantity}</td>
                  <td className="fc-invoice__td fc-invoice__td--right">
                    {currency} {item.unitPrice.toFixed(2)}
                  </td>
                  <td className="fc-invoice__td fc-invoice__td--right" style={{ fontWeight: 600 }}>
                    {currency} {(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="fc-invoice__summary">
          <div className="fc-invoice__summary-table">
            <div className="fc-invoice__summary-row">
              <span style={{ color: "var(--fc-color-text-secondary)" }}>Subtotal</span>
              <span>
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>
            {taxRate > 0 && (
              <div className="fc-invoice__summary-row">
                <span style={{ color: "var(--fc-color-text-secondary)" }}>Tax / VAT ({taxRate}%)</span>
                <span>
                  {currency} {taxAmount.toFixed(2)}
                </span>
              </div>
            )}
            {discount > 0 && (
              <div className="fc-invoice__summary-row">
                <span style={{ color: "var(--fc-color-text-secondary)" }}>Discount</span>
                <span style={{ color: "var(--fc-color-success, #10b981)" }}>
                  -{currency} {discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="fc-invoice__summary-row fc-invoice__summary-row--total">
              <span>Total Due</span>
              <span>
                {currency} {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {notes && (
          <div style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)", borderTop: "1px solid var(--fc-color-border)", paddingTop: "12px" }}>
            <strong>Payment Notes:</strong> {notes}
          </div>
        )}
      </div>
    );
  },
);

InvoiceViewer.displayName = "InvoiceViewer";

export default InvoiceViewer;
