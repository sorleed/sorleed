import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { FeeBreakdown } from "../fee-breakdown";
import { Input } from "../input";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { TransferReceipt } from "../transfer-receipt";
import type { BillBillerItem, BillPaymentFlowProps } from "../types";

const DEFAULT_BILLERS: BillBillerItem[] = [
  { id: "util-coned", name: "ConEdison Electric", category: "Utilities", accountMask: "•••• 8821", dueDate: "Nov 28", suggestedAmount: 148.4 },
  { id: "saas-aws", name: "Amazon Web Services", category: "Cloud & Infra", accountMask: "INV-4092", dueDate: "Nov 30", suggestedAmount: 1240.0 },
  { id: "tel-verizon", name: "Verizon Business Fiber", category: "Telecom", accountMask: "•••• 3190", dueDate: "Dec 02", suggestedAmount: 219.0 },
];

type BillStatus = "selecting" | "entering-amount" | "reviewing" | "processing" | "success" | "error";

const IconReceipt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 2 11 13" /><path d="m22 2-7 20-4-9-9-4Z" />
  </svg>
);

export const BillPaymentFlow = React.forwardRef<HTMLDivElement, BillPaymentFlowProps>(
  (
    {
      title = "Pay a bill or invoice",
      accountType: initialAccountType = "personal",
      currency: initialCurrency = "USD",
      currencies = ["USD", "EUR", "GBP", "NGN"],
      billers = DEFAULT_BILLERS,
      feeAmount = 1.5,
      onPayBill,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [currency, setCurrency] = useState<string>(initialCurrency);
    const [mode, setMode] = useState<"saved" | "manual">("saved");
    const [selectedBillerId, setSelectedBillerId] = useState<string>(billers[0]?.id || "");
    const [customBillerName, setCustomBillerName] = useState<string>("");
    const [customAccountRef, setCustomAccountRef] = useState<string>("");
    const [invoiceNote, setInvoiceNote] = useState<string>("");
    const [amount, setAmount] = useState<string>(
      billers[0]?.suggestedAmount ? String(billers[0].suggestedAmount) : "148.40",
    );
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<BillStatus>("selecting");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [receiptRef, setReceiptRef] = useState<string>("");

    const selectedBiller = billers.find((b) => b.id === selectedBillerId) || billers[0];
    const billerName = mode === "saved" ? selectedBiller?.name || "" : customBillerName.trim();
    const accountReference = mode === "saved" ? selectedBiller?.accountMask || "" : customAccountRef.trim();

    const parsedAmount = Number(amount) || 0;
    const fee = accountType === "business" ? feeAmount : 0;
    const totalPayable = parsedAmount + fee;

    const resetFlow = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("selecting");
      setErrorMessage("");
      setReceiptRef("");
    };

    const handleContinue = async () => {
      setErrorMessage("");
      if (step === 1) {
        if (!billerName || !accountReference) {
          setStatus("error");
          setErrorMessage("Select a saved biller or enter the payee name and reference.");
          return;
        }
        setStep(2);
        setStatus("entering-amount");
        return;
      }

      if (step === 2) {
        if (parsedAmount <= 0) {
          setStatus("error");
          setErrorMessage("Enter a payment amount greater than zero.");
          return;
        }
        setStep(3);
        setStatus("reviewing");
        return;
      }

      if (step === 3) {
        setStatus("processing");
        const reference = `BIL-${Math.floor(100000 + Math.random() * 900000)}`;
        try {
          const result = await onPayBill?.({
            billerName,
            accountReference,
            currency,
            amount: parsedAmount,
            fee,
            reference,
          });
          if (result === false) {
            setStatus("error");
            setErrorMessage("Biller rejected this reference. Verify the invoice number and try again.");
            return;
          }
          setReceiptRef(reference);
          setStatus("success");
        } catch {
          setStatus("error");
          setErrorMessage("Payment could not be completed. Please try again.");
        }
      }
    };

    const handleBack = () => {
      setErrorMessage("");
      const nextStep = Math.max(1, step - 1);
      setStep(nextStep);
      setStatus(nextStep === 1 ? "selecting" : "entering-amount");
    };

    return (
      <div
        ref={ref}
        className={["fc-bill-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-bill-flow__header">
              <span>{title}</span>
              <Badge variant={status === "success" ? "success" : "info"}>
                {status === "success" ? "Paid" : `${currency} ${totalPayable.toFixed(2)}`}
              </Badge>
            </div>
          }
          description={
            accountType === "business"
              ? "Settle vendor invoices with remittance reference tracking."
              : "Pay utility, telecom, and household bills in seconds."
          }
          footer={
            <div className="fc-bill-flow__actions">
              {status !== "success" ? (
                <>
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1 || status === "processing"}>
                    <span className="fc-bill-flow__btn-inner">
                      <IconArrowLeft /> Back
                    </span>
                  </Button>
                  <div className="fc-bill-flow__actions-right">
                    {step < 3 ? (
                      <Button variant="primary" onClick={handleContinue}>
                        <span className="fc-bill-flow__btn-inner">
                          Continue <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleContinue} disabled={status === "processing"}>
                        <span className="fc-bill-flow__btn-inner">
                          <IconSend /> {status === "processing" ? "Paying..." : "Pay"}
                        </span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => resetFlow()}>
                    New payment
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-bill-flow__stack">
            <div className="fc-bill-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => resetFlow(val as "personal" | "business")}
              >
                <TabsList aria-label="Bill payment profile">
                  <TabsTrigger value="personal">Personal bills</TabsTrigger>
                  <TabsTrigger value="business">Business invoices</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="fc-bill-flow__currency-wrap">
                <Select
                  label="Currency"
                  id={`${baseId}-currency`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={status === "success"}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <nav aria-label="Bill payment steps">
              <ol className="fc-bill-flow__stepper" aria-live="polite">
                {["Select biller", "Amount", "Review & pay"].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "success";
                  const isActive = !isDone && step === s;
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-bill-flow__step",
                        isActive ? "fc-bill-flow__step--active" : "",
                        isDone ? "fc-bill-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-bill-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-bill-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Unable to process bill">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" ? (
              <TransferReceipt
                reference={receiptRef}
                amount={totalPayable.toFixed(2)}
                currency={currency}
                status="success"
                timestamp="Paid just now"
                recipientName={billerName}
                recipientBank={accountType === "business" ? "Vendor Settlement" : "Biller Network"}
                recipientAccount={accountReference}
                fee={fee.toFixed(2)}
                onShare={() => setErrorMessage("")}
              />
            ) : null}

            {status !== "success" && step === 1 ? (
              <div className="fc-bill-flow__stack">
                <RadioGroup
                  label="Payee source"
                  name={`${baseId}-source`}
                  value={mode}
                  onChange={(val) => setMode(val as "saved" | "manual")}
                  options={[
                    { label: "Saved billers", value: "saved" },
                    { label: "Enter new payee / invoice", value: "manual" },
                  ]}
                />

                {mode === "saved" ? (
                  <div className="fc-bill-flow__option-list">
                    {billers.map((b) => {
                      const selected = b.id === selectedBillerId;
                      return (
                        <div
                          key={b.id}
                          className={[
                            "fc-bill-flow__select-row",
                            selected ? "fc-bill-flow__select-row--selected" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <div>
                            <div className="fc-bill-flow__select-title">
                              <IconReceipt />
                              <span>{b.name}</span>
                            </div>
                            <div className="fc-bill-flow__select-meta">
                              {b.category} · {b.accountMask} {b.dueDate ? `· Due ${b.dueDate}` : ""}
                            </div>
                          </div>
                          <div className="fc-bill-flow__select-right">
                            {b.suggestedAmount ? (
                              <Badge variant="info">
                                {currency} {b.suggestedAmount.toFixed(2)}
                              </Badge>
                            ) : null}
                            <Button
                              size="sm"
                              variant={selected ? "primary" : "secondary"}
                              onClick={() => {
                                setSelectedBillerId(b.id);
                                if (b.suggestedAmount) setAmount(String(b.suggestedAmount));
                              }}
                            >
                              {selected ? "Selected" : "Select"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="fc-bill-flow__grid-2">
                    <Input
                      label="Biller or vendor name"
                      value={customBillerName}
                      onChange={(e) => setCustomBillerName(e.target.value)}
                      placeholder="Cloudflare Inc."
                      required
                    />
                    <Input
                      label="Consumer / invoice number"
                      value={customAccountRef}
                      onChange={(e) => setCustomAccountRef(e.target.value)}
                      placeholder="INV-2026-991"
                      required
                    />
                  </div>
                )}
              </div>
            ) : null}

            {status !== "success" && step === 2 ? (
              <div className="fc-bill-flow__stack">
                <div className="fc-bill-flow__grid-2">
                  <Input
                    label={`Payment amount (${currency})`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    helperText={`Paying ${billerName} (${accountReference})`}
                    aria-invalid={status === "error" && parsedAmount <= 0 ? true : undefined}
                  />
                  <Input
                    label={accountType === "business" ? "Invoice / PO memo" : "Payment note (optional)"}
                    value={invoiceNote}
                    onChange={(e) => setInvoiceNote(e.target.value)}
                    placeholder={accountType === "business" ? "Q4 Hosting Settlement" : "November statement"}
                  />
                </div>
                <div className="fc-bill-flow__chips">
                  {["50", "150", "500", "1250"].map((chip) => (
                    <Button key={chip} size="sm" variant="secondary" onClick={() => setAmount(chip)}>
                      {currency} {chip}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}

            {status !== "success" && step === 3 ? (
              <div className="fc-bill-flow__stack">
                <FeeBreakdown
                  currency={currency}
                  fees={[
                    { label: "Bill amount", amount: parsedAmount },
                    {
                      label: accountType === "business" ? "Vendor clearing fee" : "Consumer bill fee",
                      amount: fee,
                    },
                  ]}
                  totalFee={fee}
                  recipientGets={parsedAmount}
                />
                {invoiceNote ? (
                  <Alert variant="info" title="Remittance memo">
                    {invoiceNote}
                  </Alert>
                ) : null}
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

BillPaymentFlow.displayName = "BillPaymentFlow";
export default BillPaymentFlow;
