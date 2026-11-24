import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { Input } from "../input";
import { KycDocUploader } from "../kyc-doc-uploader";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { LoanApplicationFlowProps } from "../types";

type LoanStatus = "applying" | "uploading" | "reviewing-offer" | "accepted" | "rejected" | "error";

const IconArrowLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
  </svg>
);

export const LoanApplicationFlow = React.forwardRef<HTMLDivElement, LoanApplicationFlowProps>(
  (
    {
      title = "Apply for credit",
      accountType: initialAccountType = "personal",
      currency: initialCurrency = "USD",
      currencies = ["USD", "EUR", "GBP", "NGN"],
      onAcceptOffer,
      onDeclineOffer,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [currency, setCurrency] = useState<string>(initialCurrency);
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<LoanStatus>("applying");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [amount, setAmount] = useState<string>("15000");
    const [termMonths, setTermMonths] = useState<string>("24");
    const [purpose, setPurpose] = useState<string>("debt_consolidation");

    const [monthlyIncome, setMonthlyIncome] = useState<string>("6800");
    const [employmentType, setEmploymentType] = useState<string>("full_time");
    const [annualRevenue, setAnnualRevenue] = useState<string>("420000");
    const [operatingYears, setOperatingYears] = useState<string>("4");

    const [docFile, setDocFile] = useState<string>("");
    const [consentChecked, setConsentChecked] = useState<boolean>(false);
    const [applicationId, setApplicationId] = useState<string>("");
    const [uploaderKey, setUploaderKey] = useState<number>(0);

    const principal = Number(amount) || 0;
    const months = Number(termMonths) || 24;
    const aprPercent = accountType === "business" ? 9.4 : 11.2;
    const monthlyRate = aprPercent / 100 / 12;
    const monthlyPayment =
      principal > 0
        ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
        : 0;

    const restartFlow = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("applying");
      setErrorMessage("");
      setDocFile("");
      setConsentChecked(false);
      setApplicationId("");
      setUploaderKey((k) => k + 1);
    };

    const handleNext = () => {
      setErrorMessage("");
      if (step === 1) {
        if (principal < 500 || principal > 250000) {
          setStatus("error");
          setErrorMessage(`Loan amount must be between ${currency} 500 and ${currency} 250,000.`);
          return;
        }
        setStep(2);
        setStatus("applying");
        return;
      }

      if (step === 2) {
        if (accountType === "personal" && (Number(monthlyIncome) || 0) <= 0) {
          setStatus("error");
          setErrorMessage("Enter your monthly net income.");
          return;
        }
        if (accountType === "business" && (Number(annualRevenue) || 0) <= 0) {
          setStatus("error");
          setErrorMessage("Enter annual company revenue.");
          return;
        }
        setStep(3);
        setStatus("uploading");
        return;
      }

      if (step === 3) {
        if (!docFile) {
          setStatus("error");
          setErrorMessage(
            accountType === "personal"
              ? "Upload a recent payslip or bank statement."
              : "Upload latest company financials or tax return.",
          );
          return;
        }
        setStep(4);
        setStatus("reviewing-offer");
      }
    };

    const handleBack = () => {
      setErrorMessage("");
      const prev = Math.max(1, step - 1);
      setStep(prev);
      setStatus(prev === 3 ? "uploading" : "applying");
    };

    const handleAccept = () => {
      if (!consentChecked) {
        setStatus("error");
        setErrorMessage("Accept the credit agreement summary before accepting the offer.");
        return;
      }
      const id = `LN-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationId(id);
      setStatus("accepted");
      onAcceptOffer?.({
        accountType,
        amount: principal,
        currency,
        purpose,
        termMonths: months,
        aprPercent,
        monthlyPayment: Number(monthlyPayment.toFixed(2)),
        applicationId: id,
      });
    };

    const handleDecline = () => {
      setStatus("rejected");
      onDeclineOffer?.();
    };

    const headerBadgeVariant =
      status === "accepted" ? "success" : status === "rejected" ? "warning" : "info";
    const headerBadgeText =
      status === "accepted"
        ? `Approved · ${applicationId}`
        : status === "rejected"
          ? "Declined"
          : `${aprPercent}% APR`;

    return (
      <div
        ref={ref}
        className={["fc-loan-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-loan-flow__header">
              <span>{title}</span>
              <Badge variant={headerBadgeVariant}>{headerBadgeText}</Badge>
            </div>
          }
          description="Get a tailored personal or business credit offer in 4 clear steps."
          footer={
            <div className="fc-loan-flow__actions">
              {status !== "accepted" && status !== "rejected" ? (
                <>
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                    <span className="fc-loan-flow__btn-inner">
                      <IconArrowLeft /> Back
                    </span>
                  </Button>
                  <div className="fc-loan-flow__actions-right">
                    {step < 4 ? (
                      <Button variant="primary" onClick={handleNext}>
                        <span className="fc-loan-flow__btn-inner">
                          Next <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <>
                        <Button variant="secondary" onClick={handleDecline}>
                          <span className="fc-loan-flow__btn-inner">
                            <IconX /> Decline
                          </span>
                        </Button>
                        <Button variant="primary" onClick={handleAccept}>
                          <span className="fc-loan-flow__btn-inner">
                            <IconCheck /> Accept Offer
                          </span>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => restartFlow()}>
                    <span className="fc-loan-flow__btn-inner">
                      <IconRefresh /> Restart
                    </span>
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-loan-flow__stack">
            <div className="fc-loan-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => restartFlow(val as "personal" | "business")}
              >
                <TabsList aria-label="Borrower type">
                  <TabsTrigger value="personal">Personal loan</TabsTrigger>
                  <TabsTrigger value="business">Business credit</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="fc-loan-flow__currency-wrap">
                <Select
                  label="Currency"
                  id={`${baseId}-currency`}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={status === "accepted" || status === "rejected"}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <nav aria-label="Loan application steps">
              <ol className="fc-loan-flow__stepper" aria-live="polite">
                {[
                  "Amount & purpose",
                  accountType === "personal" ? "Income" : "Financials",
                  "Documents",
                  "Offer review",
                ].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "accepted";
                  const isActive = !isDone && step === s && status !== "rejected";
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-loan-flow__step",
                        isActive ? "fc-loan-flow__step--active" : "",
                        isDone ? "fc-loan-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-loan-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-loan-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Check application details">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "accepted" ? (
              <Alert variant="success" title={`Offer accepted (${applicationId})`}>
                Disbursement of {currency} {principal.toLocaleString()} is scheduled within 1 business day. First monthly payment:{" "}
                {currency} {monthlyPayment.toFixed(2)}.
              </Alert>
            ) : status === "rejected" ? (
              <Alert variant="warning" title="Offer declined">
                You have declined this loan offer with no impact to your credit profile.
              </Alert>
            ) : null}

            {status !== "accepted" && status !== "rejected" && step === 1 ? (
              <div className="fc-loan-flow__grid-2">
                <Input
                  label={`Requested amount (${currency})`}
                  type="text" inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  helperText="Min 500 · Max 250,000"
                />
                <Select
                  label="Repayment term"
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                </Select>
                <Select
                  label="Loan purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <option value="debt_consolidation">
                    {accountType === "business" ? "Working capital" : "Debt consolidation"}
                  </option>
                  <option value="equipment">
                    {accountType === "business" ? "Equipment / inventory" : "Home improvement"}
                  </option>
                  <option value="expansion">
                    {accountType === "business" ? "Business expansion" : "Major purchase"}
                  </option>
                </Select>
              </div>
            ) : null}

            {status !== "accepted" && status !== "rejected" && step === 2 ? (
              <div className="fc-loan-flow__grid-2">
                {accountType === "personal" ? (
                  <>
                    <Input
                      label={`Monthly net income (${currency})`}
                      type="text" inputMode="decimal"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      required
                    />
                    <Select
                      label="Employment status"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                    >
                      <option value="full_time">Full-time salaried</option>
                      <option value="self_employed">Self-employed / contractor</option>
                      <option value="retired">Retired</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <Input
                      label={`Annual company revenue (${currency})`}
                      type="text" inputMode="decimal"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(e.target.value)}
                      required
                    />
                    <Input
                      label="Years in operation"
                      type="text" inputMode="decimal"
                      value={operatingYears}
                      onChange={(e) => setOperatingYears(e.target.value)}
                    />
                  </>
                )}
              </div>
            ) : null}

            {status !== "accepted" && status !== "rejected" && step === 3 ? (
              <KycDocUploader
                key={`loan-${uploaderKey}`}
                title={
                  accountType === "personal"
                    ? "Upload recent income verification"
                    : "Upload company P&L or 3-month bank statement"
                }
                description="Accepted formats: PDF, PNG, JPG up to 10MB."
                onFileSelect={(file) => setDocFile(file.name)}
                onFileRemove={() => setDocFile("")}
              />
            ) : null}

            {status !== "accepted" && status !== "rejected" && step === 4 ? (
              <div className="fc-loan-flow__stack">
                <div className="fc-loan-flow__summary-box">
                  <div className="fc-loan-flow__summary-row">
                    <span>Approved principal</span>
                    <strong>{currency} {principal.toLocaleString()}</strong>
                  </div>
                  <div className="fc-loan-flow__summary-row">
                    <span>Fixed APR & term</span>
                    <strong>{aprPercent}% APR · {months} months</strong>
                  </div>
                  <div className="fc-loan-flow__summary-row">
                    <span>Estimated monthly payment</span>
                    <strong>{currency} {monthlyPayment.toFixed(2)} / mo</strong>
                  </div>
                </div>
                <Checkbox
                  label="I have reviewed the loan rate, monthly installment, and repayment terms."
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

LoanApplicationFlow.displayName = "LoanApplicationFlow";
export default LoanApplicationFlow;
