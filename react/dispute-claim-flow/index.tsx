import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { KycDocUploader } from "../kyc-doc-uploader";
import { RadioGroup } from "../radio-group";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { Textarea } from "../textarea";
import type { DisputeClaimFlowProps, DisputeTransactionItem } from "../types";

const DEFAULT_TRANSACTIONS: DisputeTransactionItem[] = [
  { id: "tx-1", merchant: "Skyline Airlines", date: "Nov 11, 2026", amount: 642.0, currency: "USD", cardMask: "•••• 8841" },
  { id: "tx-2", merchant: "Unknown Digital Charge", date: "Nov 10, 2026", amount: 189.5, currency: "USD", cardMask: "•••• 8841" },
  { id: "tx-3", merchant: "Metro SaaS Billing", date: "Nov 08, 2026", amount: 399.0, currency: "USD", cardMask: "•••• 3914" },
];

type ClaimStatus = "selecting" | "choosing-reason" | "uploading" | "reviewing" | "submitted" | "error";

const IconShieldAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" />
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

const IconRotate = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
  </svg>
);

export const DisputeClaimFlow = React.forwardRef<HTMLDivElement, DisputeClaimFlowProps>(
  (
    {
      title = "Dispute a transaction",
      accountType: initialAccountType = "personal",
      currency = "USD",
      transactions = DEFAULT_TRANSACTIONS,
      onSubmitClaim,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<ClaimStatus>("selecting");
    const [selectedTxId, setSelectedTxId] = useState<string>(transactions[0]?.id || "");
    const [reason, setReason] = useState<string>("unrecognized");
    const [notes, setNotes] = useState<string>("");
    const [evidenceFile, setEvidenceFile] = useState<string>("");
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [claimId, setClaimId] = useState<string>("");
    const [uploaderKey, setUploaderKey] = useState<number>(0);

    const selectedTx = transactions.find((t) => t.id === selectedTxId) || transactions[0];

    const restartFlow = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("selecting");
      setNotes("");
      setEvidenceFile("");
      setConfirmed(false);
      setErrorMessage("");
      setClaimId("");
      setUploaderKey((k) => k + 1);
    };

    const handleContinue = () => {
      setErrorMessage("");
      if (step === 1) {
        if (!selectedTx) {
          setStatus("error");
          setErrorMessage("Select the transaction you want to dispute.");
          return;
        }
        setStep(2);
        setStatus("choosing-reason");
        return;
      }

      if (step === 2) {
        if (!notes.trim()) {
          setStatus("error");
          setErrorMessage("Add a short explanation of what happened so our disputes team can review.");
          return;
        }
        setStep(3);
        setStatus("uploading");
        return;
      }

      if (step === 3) {
        setStep(4);
        setStatus("reviewing");
      }
    };

    const handleBack = () => {
      setErrorMessage("");
      const prev = Math.max(1, step - 1);
      setStep(prev);
      setStatus(prev === 1 ? "selecting" : prev === 2 ? "choosing-reason" : "uploading");
    };

    const handleSubmit = () => {
      setErrorMessage("");
      if (!confirmed) {
        setStatus("error");
        setErrorMessage("Confirm your dispute declaration before submitting.");
        return;
      }
      if (!selectedTx) return;
      const generatedId = `DSP-${Math.floor(100000 + Math.random() * 900000)}`;
      setClaimId(generatedId);
      setStatus("submitted");
      onSubmitClaim?.({
        transaction: selectedTx,
        reason,
        notes,
        evidenceFileName: evidenceFile || undefined,
        claimId: generatedId,
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-dispute-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-dispute-flow__header">
              <span>{title}</span>
              <Badge variant={status === "submitted" ? "success" : "info"}>
                {status === "submitted" ? `Claim ${claimId}` : `Step ${step}/4`}
              </Badge>
            </div>
          }
          description="Report an unrecognized charge, duplicate billing, or undelivered order."
          footer={
            <div className="fc-dispute-flow__actions">
              {status !== "submitted" ? (
                <>
                  <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                    <span className="fc-dispute-flow__btn-inner">
                      <IconArrowLeft /> Back
                    </span>
                  </Button>
                  <div className="fc-dispute-flow__actions-right">
                    {step < 4 ? (
                      <Button variant="primary" onClick={handleContinue}>
                        <span className="fc-dispute-flow__btn-inner">
                          Continue <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleSubmit}>
                        <span className="fc-dispute-flow__btn-inner">
                          <IconShieldAlert /> Submit Claim
                        </span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => restartFlow()}>
                    <span className="fc-dispute-flow__btn-inner">
                      <IconRotate /> Restart
                    </span>
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-dispute-flow__stack">
            <Tabs
              value={accountType}
              onValueChange={(val) => restartFlow(val as "personal" | "business")}
            >
              <TabsList aria-label="Dispute account type">
                <TabsTrigger value="personal">Personal card</TabsTrigger>
                <TabsTrigger value="business">Business card</TabsTrigger>
              </TabsList>
            </Tabs>

            <nav aria-label="Dispute claim steps">
              <ol className="fc-dispute-flow__stepper" aria-live="polite">
                {["Transaction", "Reason", "Evidence", "Review"].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "submitted";
                  const isActive = !isDone && step === s;
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-dispute-flow__step",
                        isActive ? "fc-dispute-flow__step--active" : "",
                        isDone ? "fc-dispute-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-dispute-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-dispute-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Missing information">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "submitted" && selectedTx ? (
              <Alert variant="success" title={`Dispute submitted (${claimId})`}>
                We filed your claim for {(selectedTx.currency || currency)} {selectedTx.amount.toFixed(2)} at{" "}
                {selectedTx.merchant}. Updates will appear in your activity feed within 24 hours.
              </Alert>
            ) : null}

            {status !== "submitted" && step === 1 ? (
              <div className="fc-dispute-flow__option-list">
                {transactions.map((tx) => {
                  const isSelected = tx.id === selectedTxId;
                  return (
                    <div
                      key={tx.id}
                      className={[
                        "fc-dispute-flow__select-row",
                        isSelected ? "fc-dispute-flow__select-row--selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div>
                        <div className="fc-dispute-flow__select-title">
                          <IconShieldAlert />
                          <span>{tx.merchant}</span>
                        </div>
                        <div className="fc-dispute-flow__select-meta">
                          {tx.date} {tx.cardMask ? `· ${tx.cardMask}` : ""}
                        </div>
                      </div>
                      <div className="fc-dispute-flow__select-right">
                        <Badge variant="default">
                          {(tx.currency || currency)} {tx.amount.toFixed(2)}
                        </Badge>
                        <Button
                          size="sm"
                          variant={isSelected ? "primary" : "secondary"}
                          onClick={() => setSelectedTxId(tx.id)}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {status !== "submitted" && step === 2 ? (
              <div className="fc-dispute-flow__stack">
                <RadioGroup
                  label="Reason for dispute"
                  name={`${baseId}-reason`}
                  value={reason}
                  onChange={setReason}
                  options={[
                    { label: "I do not recognize this charge", value: "unrecognized" },
                    { label: "Charged twice (duplicate transaction)", value: "duplicate" },
                    { label: "Goods or services were not delivered", value: "not_received" },
                    { label: "Cancelled subscription still billed", value: "cancelled" },
                  ]}
                />
                <Textarea
                  label="Details of the issue"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe when you noticed the charge or any contact made with the merchant..."
                  required
                  errorMessage={status === "error" && !notes.trim() ? errorMessage : undefined}
                />
              </div>
            ) : null}

            {status !== "submitted" && step === 3 ? (
              <div className="fc-dispute-flow__stack">
                <KycDocUploader
                  key={`ev-${uploaderKey}`}
                  title="Upload supporting evidence (optional)"
                  description="Attach receipts, cancellation emails, or delivery tracking screenshots."
                  onFileSelect={(file) => setEvidenceFile(file.name)}
                  onFileRemove={() => setEvidenceFile("")}
                />
              </div>
            ) : null}

            {status !== "submitted" && step === 4 && selectedTx ? (
              <div className="fc-dispute-flow__stack">
                <div className="fc-dispute-flow__summary-box">
                  <div className="fc-dispute-flow__summary-row">
                    <span>Merchant</span>
                    <strong>{selectedTx.merchant}</strong>
                  </div>
                  <div className="fc-dispute-flow__summary-row">
                    <span>Disputed amount</span>
                    <strong>{(selectedTx.currency || currency)} {selectedTx.amount.toFixed(2)}</strong>
                  </div>
                  <div className="fc-dispute-flow__summary-row">
                    <span>Reason</span>
                    <strong>{reason.replace("_", " ")}</strong>
                  </div>
                  <div className="fc-dispute-flow__summary-row">
                    <span>Evidence file</span>
                    <strong>{evidenceFile || "None attached"}</strong>
                  </div>
                </div>
                <Checkbox
                  label="I confirm this dispute claim is accurate and I have not received a refund from the merchant."
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

DisputeClaimFlow.displayName = "DisputeClaimFlow";
export default DisputeClaimFlow;
