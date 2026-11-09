import React, { useState } from "react";
import { Input } from "../input";
import { Currency } from "../currency";
import { Switch } from "../switch";
import { Button } from "../button";
import type { ExpenseReceiptUploaderProps, ExpenseReceiptData } from "../types";

export const ExpenseReceiptUploader = React.forwardRef<HTMLDivElement, ExpenseReceiptUploaderProps>(
  (
    {
      title = "Scan & Upload Expense Receipt",
      currency = "USD",
      onSubmitExpense,
      className,
      ...props
    },
    ref,
  ) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [merchant, setMerchant] = useState("Delta Air Lines");
    const [amount, setAmount] = useState<number | string>(340.5);
    const [category, setCategory] = useState("Travel & Lodging");
    const [reimbursable, setReimbursable] = useState(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
      }
    };

    const handleSubmit = () => {
      onSubmitExpense?.({
        fileName: fileName || "receipt.png",
        merchant,
        amount: Number(amount) || 0,
        category,
        reimbursable,
      });
    };

    const classes = ["fc-receipt-uploader", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Expense Receipt Uploader"}
        {...props}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>

        {/* Dropzone */}
        <label className="fc-receipt-uploader__dropzone">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
            aria-label="Upload receipt image or PDF"
          />
          <div style={{ color: "var(--fc-color-primary)", fontWeight: 600 }}>
            {fileName ? `Attached: ${fileName}` : "Click or Drag Receipt Here"}
          </div>
          <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
            JPG, PNG, or PDF up to 10MB
          </span>
        </label>

        {/* OCR extracted fields */}
        <div className="fc-receipt-uploader__fields">
          <Input
            label="Merchant / Vendor"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            onInput={(e) => setMerchant((e.target as HTMLInputElement).value)}
          />
          <Currency
            label="Total Amount"
            value={amount}
            onChange={(val) => setAmount(val)}
            suffix={currency}
          />
          <Input
            label="Expense Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onInput={(e) => setCategory((e.target as HTMLInputElement).value)}
          />

          <div className="fc-receipt-uploader__reimbursable">
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>Reimbursable Expense</div>
              <div style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
                Request reimbursement back to your primary bank account
              </div>
            </div>
            <Switch
              checked={reimbursable}
              onCheckedChange={setReimbursable}
              aria-label="Reimbursable Expense"
            />
          </div>

          <Button variant="primary" onClick={handleSubmit} aria-label="Submit Expense Report">
            Submit Expense
          </Button>
        </div>
      </div>
    );
  },
);

ExpenseReceiptUploader.displayName = "ExpenseReceiptUploader";

export default ExpenseReceiptUploader;
