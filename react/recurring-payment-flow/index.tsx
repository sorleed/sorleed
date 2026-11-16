import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { BeneficiaryPicker } from "../beneficiary-picker";
import { Button } from "../button";
import { Card } from "../card";
import { Input } from "../input";
import { Select } from "../select";
import { StandingOrderCard } from "../standing-order-card";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { BeneficiaryItem, RecurringFrequency, RecurringPaymentFlowProps } from "../types";

const DEFAULT_BENEFICIARIES: BeneficiaryItem[] = [
  { id: "ben-rent", name: "Oakwood Properties LLC", bankName: "Chase Bank", accountMask: "•••• 2291", currency: "USD", rail: "ACH", verificationStatus: "verified" },
  { id: "ben-payroll", name: "Rippling Payroll Clearing", bankName: "Silicon Valley Bank", accountMask: "•••• 9044", currency: "USD", rail: "ACH", verificationStatus: "verified" },
  { id: "ben-studio", name: "Linear Software Inc.", bankName: "Mercury", accountMask: "•••• 1180", currency: "USD", rail: "ACH", verificationStatus: "verified" },
];

type RecurringStatus = "configuring" | "reviewing" | "success" | "error";

const IconRepeat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />
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

export const RecurringPaymentFlow = React.forwardRef<HTMLDivElement, RecurringPaymentFlowProps>(
  (
    {
      title = "Schedule recurring payment",
      accountType: initialAccountType = "personal",
      currency: initialCurrency = "USD",
      currencies = ["USD", "EUR", "GBP", "NGN"],
      fundingAccount = "Checking •••• 4410",
      beneficiaries = DEFAULT_BENEFICIARIES,
      onCreateSchedule,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [currency, setCurrency] = useState<string>(initialCurrency);
    const [selectedBenId, setSelectedBenId] = useState<string>(beneficiaries[0]?.id || "");
    const [amount, setAmount] = useState<string>("1250");
    const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
    const [startDate, setStartDate] = useState<string>("2026-12-01");
    const [endDate, setEndDate] = useState<string>("");
    const [referenceNote, setReferenceNote] = useState<string>("Monthly retainer");
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<RecurringStatus>("configuring");
    const [orderStatus, setOrderStatus] = useState<"active" | "paused" | "cancelled">("active");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const selectedPayee = beneficiaries.find((b) => b.id === selectedBenId) || beneficiaries[0];
    const parsedAmount = Number(amount) || 0;

    const handleReset = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("configuring");
      setOrderStatus("active");
      setErrorMessage("");
    };

    const handleContinue = () => {
      setErrorMessage("");
      if (!selectedPayee) {
        setStatus("error");
        setErrorMessage("Select a payee for the standing order.");
        return;
      }
      if (parsedAmount <= 0 || !startDate.trim()) {
        setStatus("error");
        setErrorMessage("Enter a valid recurring amount and start date (YYYY-MM-DD).");
        return;
      }
      if (endDate.trim() && endDate < startDate) {
        setStatus("error");
        setErrorMessage("End date cannot be earlier than the start date.");
        return;
      }
      setStep(2);
      setStatus("reviewing");
    };

    const handleCreate = () => {
      if (!selectedPayee) return;
      const scheduleId = `SCH-${Math.floor(100000 + Math.random() * 900000)}`;
      setStatus("success");
      onCreateSchedule?.({
        payee: selectedPayee.name,
        account: selectedPayee.accountMask,
        amount: parsedAmount,
        currency,
        frequency,
        startDate,
        endDate: endDate || undefined,
        scheduleId,
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-recurring-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-recurring-flow__header">
              <span>{title}</span>
              <Badge variant={status === "success" ? "success" : "info"}>
                {status === "success" ? "Active" : frequency}
              </Badge>
            </div>
          }
          description={
            accountType === "business"
              ? "Automate recurring supplier, payroll, or rent standing orders."
              : "Set up automatic rent, savings, or family allowance transfers."
          }
          footer={
            <div className="fc-recurring-flow__actions">
              {status !== "success" ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => (step === 1 ? handleReset() : setStep(1))}
                  >
                    {step === 1 ? (
                      "Cancel"
                    ) : (
                      <span className="fc-recurring-flow__btn-inner">
                        <IconArrowLeft /> Back
                      </span>
                    )}
                  </Button>
                  {step === 1 ? (
                    <Button variant="primary" onClick={handleContinue}>
                      <span className="fc-recurring-flow__btn-inner">
                        Continue <IconArrowRight />
                      </span>
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleCreate}>
                      <span className="fc-recurring-flow__btn-inner">
                        <IconRepeat /> Create Schedule
                      </span>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => handleReset()}>
                    New standing order
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-recurring-flow__stack">
            <div className="fc-recurring-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => handleReset(val as "personal" | "business")}
              >
                <TabsList aria-label="Standing order profile">
                  <TabsTrigger value="personal">Personal order</TabsTrigger>
                  <TabsTrigger value="business">Business order</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="fc-recurring-flow__currency-wrap">
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

            <nav aria-label="Recurring payment steps">
              <ol className="fc-recurring-flow__stepper" aria-live="polite">
                {["Schedule details", "Review & confirm"].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "success";
                  const isActive = !isDone && step === s;
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-recurring-flow__step",
                        isActive ? "fc-recurring-flow__step--active" : "",
                        isDone ? "fc-recurring-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-recurring-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-recurring-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Check schedule settings">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" && selectedPayee ? (
              <div className="fc-recurring-flow__stack">
                <Alert variant="success" title="Standing order active">
                  Your {frequency} payment of {currency} {parsedAmount.toFixed(2)} to {selectedPayee.name} starts on{" "}
                  {startDate}.
                </Alert>
                <StandingOrderCard
                  recipient={selectedPayee.name}
                  recipientAccount={selectedPayee.accountMask}
                  amount={parsedAmount}
                  currency={currency}
                  frequency={frequency}
                  nextRunDate={startDate}
                  fundingAccount={fundingAccount}
                  reference={referenceNote}
                  status={orderStatus}
                  onTogglePause={() => setOrderStatus((prev) => (prev === "active" ? "paused" : "active"))}
                  onCancel={() => setOrderStatus("cancelled")}
                />
              </div>
            ) : null}

            {status !== "success" && step === 1 ? (
              <div className="fc-recurring-flow__stack">
                <BeneficiaryPicker
                  title="Select payee"
                  beneficiaries={beneficiaries}
                  selectedId={selectedBenId}
                  searchable={false}
                  onSelect={(ben) => setSelectedBenId(ben.id)}
                />
                <div className="fc-recurring-flow__grid-2">
                  <Input
                    label={`Amount (${currency})`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                  <Select
                    label="Frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </Select>
                  <Input
                    label="Start date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    required
                  />
                  <Input
                    label="End date (optional)"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <Input
                  label="Reference shown on statement"
                  value={referenceNote}
                  onChange={(e) => setReferenceNote(e.target.value)}
                  placeholder="Rent / Invoice memo"
                />
              </div>
            ) : null}

            {status !== "success" && step === 2 && selectedPayee ? (
              <div className="fc-recurring-flow__summary-box">
                <div className="fc-recurring-flow__summary-row">
                  <span>Payee</span>
                  <strong>{selectedPayee.name} ({selectedPayee.accountMask})</strong>
                </div>
                <div className="fc-recurring-flow__summary-row">
                  <span>Funding account</span>
                  <strong>{fundingAccount}</strong>
                </div>
                <div className="fc-recurring-flow__summary-row">
                  <span>Amount & cadence</span>
                  <strong>{currency} {parsedAmount.toFixed(2)} · {frequency}</strong>
                </div>
                <div className="fc-recurring-flow__summary-row">
                  <span>Schedule window</span>
                  <strong>{startDate}{endDate ? ` -> ${endDate}` : " (until cancelled)"}</strong>
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

RecurringPaymentFlow.displayName = "RecurringPaymentFlow";
export default RecurringPaymentFlow;
