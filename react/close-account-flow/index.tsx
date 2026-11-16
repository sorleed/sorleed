import React, { useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { Checkbox } from "../checkbox";
import { RadioGroup } from "../radio-group";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { Textarea } from "../textarea";
import type { CloseAccountFlowProps } from "../types";

const DEFAULT_DESTINATIONS = [
  { id: "dest-chase", label: "Chase External Checking", mask: "•••• 7731" },
  { id: "dest-mercury", label: "Mercury Operating Account", mask: "•••• 4829" },
];

type CloseStatus = "selecting-reason" | "confirming" | "processing" | "success" | "error";

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

const IconShieldAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="M12 8v4" /><path d="M12 16h.01" />
  </svg>
);

const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export const CloseAccountFlow = React.forwardRef<HTMLDivElement, CloseAccountFlowProps>(
  (
    {
      title = "Close account",
      accountType: initialAccountType = "personal",
      accountName = "Primary USD Checking •••• 4410",
      currency = "USD",
      remainingBalance: initialRemainingBalance = 420.5,
      destinations = DEFAULT_DESTINATIONS,
      onConfirmClose,
      onCancel,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<CloseStatus>("selecting-reason");
    const [reason, setReason] = useState<string>("no_longer_needed");
    const [feedback, setFeedback] = useState<string>("");
    const [destinationId, setDestinationId] = useState<string>(destinations[0]?.id || "");
    const [sweepBalance, setSweepBalance] = useState<boolean>(true);
    const [ackPermanent, setAckPermanent] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [closureRef, setClosureRef] = useState<string>("");

    const remainingBalance = initialRemainingBalance;
    const selectedDest = destinations.find((d) => d.id === destinationId) || destinations[0];

    const resetFlow = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("selecting-reason");
      setAckPermanent(false);
      setErrorMessage("");
      setClosureRef("");
    };

    const handleContinue = () => {
      setErrorMessage("");
      if (step === 1) {
        setStep(2);
        setStatus("confirming");
        return;
      }

      if (step === 2) {
        if (remainingBalance > 0 && (!sweepBalance || !selectedDest)) {
          setStatus("error");
          setErrorMessage(
            `Balance remaining (${currency} ${remainingBalance.toFixed(2)}). Authorize the final balance sweep to a linked bank before closing.`,
          );
          return;
        }
        setStep(3);
        setStatus("confirming");
      }
    };

    const handleBack = () => {
      setErrorMessage("");
      const prev = Math.max(1, step - 1);
      setStep(prev);
      setStatus(prev === 1 ? "selecting-reason" : "confirming");
    };

    const handleSubmitClosure = () => {
      setErrorMessage("");
      if (remainingBalance > 0 && !sweepBalance) {
        setStatus("error");
        setErrorMessage(
          `Remaining balance of ${currency} ${remainingBalance.toFixed(2)} must be transferred out before account closure.`,
        );
        return;
      }
      if (!ackPermanent) {
        setStatus("error");
        setErrorMessage("Acknowledge that closing this account is permanent.");
        return;
      }
      setStatus("processing");
      const refId = `CLS-${Math.floor(100000 + Math.random() * 900000)}`;
      setClosureRef(refId);
      setStatus("success");
      onConfirmClose?.({
        reason,
        feedback: feedback || undefined,
        destinationId: remainingBalance > 0 ? selectedDest?.id : undefined,
        reference: refId,
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-close-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-close-flow__header">
              <span>{title}</span>
              <Badge variant={status === "success" ? "success" : remainingBalance > 0 ? "warning" : "success"}>
                {status === "success"
                  ? `Closed · ${closureRef}`
                  : `Balance: ${currency} ${remainingBalance.toFixed(2)}`}
              </Badge>
            </div>
          }
          description={`Permanent closure workflow for ${accountName}.`}
          footer={
            <div className="fc-close-flow__actions">
              {status !== "success" ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => (step === 1 ? onCancel?.() ?? resetFlow() : handleBack())}
                  >
                    <span className="fc-close-flow__btn-inner">
                      {step === 1 ? <IconX /> : <IconArrowLeft />}
                      {step === 1 ? "Cancel" : "Back"}
                    </span>
                  </Button>
                  <div className="fc-close-flow__actions-right">
                    {step < 3 ? (
                      <Button variant="primary" onClick={handleContinue}>
                        <span className="fc-close-flow__btn-inner">
                          Continue <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleSubmitClosure}>
                        <span className="fc-close-flow__btn-inner">
                          <IconShieldAlert /> Confirm Closure
                        </span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => resetFlow()}>
                    Done
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-close-flow__stack">
            <div className="fc-close-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => resetFlow(val as "personal" | "business")}
              >
                <TabsList aria-label="Closure profile">
                  <TabsTrigger value="personal">Personal account</TabsTrigger>
                  <TabsTrigger value="business">Business entity</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <nav aria-label="Account closure steps">
              <ol className="fc-close-flow__stepper" aria-live="polite">
                {["Reason", "Final balance", "Review & close"].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "success";
                  const isActive = !isDone && step === s;
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-close-flow__step",
                        isActive ? "fc-close-flow__step--active" : "",
                        isDone ? "fc-close-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-close-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-close-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {status === "error" && errorMessage ? (
              <Alert variant="error" title="Cannot close account yet">
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" ? (
              <Alert variant="success" title={`Account closed (${closureRef})`}>
                {accountName} has been scheduled for permanent closure.{" "}
                {remainingBalance > 0 && selectedDest
                  ? `Your final balance of ${currency} ${remainingBalance.toFixed(2)} is on its way to ${selectedDest.label} (${selectedDest.mask}).`
                  : "Zero balance confirmed."}
              </Alert>
            ) : null}

            {status !== "success" && step === 1 ? (
              <div className="fc-close-flow__stack">
                <RadioGroup
                  label="Why are you closing this account?"
                  name={`${baseId}-reason`}
                  value={reason}
                  onChange={setReason}
                  options={[
                    { label: "I no longer need this account", value: "no_longer_needed" },
                    {
                      label: accountType === "business" ? "Consolidating business entities" : "Switching to another bank",
                      value: "consolidating",
                    },
                    { label: "Fees or missing features", value: "fees_features" },
                  ]}
                />
                <Textarea
                  label="Additional feedback (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us anything we could improve..."
                />
              </div>
            ) : null}

            {status !== "success" && step === 2 ? (
              <div className="fc-close-flow__stack">
                <Alert variant={remainingBalance > 0 ? "warning" : "info"} title="Final balance settlement">
                  {remainingBalance > 0
                    ? `${currency} ${remainingBalance.toFixed(2)} remains in ${accountName}. Select where to sweep the remaining funds.`
                    : "Balance is 0.00. No final transfer is required."}
                </Alert>

                {remainingBalance > 0 ? (
                  <>
                    <Select
                      label="Destination bank account"
                      id={`${baseId}-dest`}
                      value={destinationId}
                      onChange={(e) => setDestinationId(e.target.value)}
                    >
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.label} ({dest.mask})
                        </option>
                      ))}
                    </Select>
                    <Checkbox
                      label={`Sweep ${currency} ${remainingBalance.toFixed(2)} to ${selectedDest?.label} (${selectedDest?.mask}) upon closure`}
                      checked={sweepBalance}
                      onChange={(e) => setSweepBalance(e.target.checked)}
                    />
                  </>
                ) : null}
              </div>
            ) : null}

            {status !== "success" && step === 3 ? (
              <div className="fc-close-flow__stack">
                <div className="fc-close-flow__summary-box">
                  <div className="fc-close-flow__summary-row">
                    <span>Account</span>
                    <strong>{accountName}</strong>
                  </div>
                  <div className="fc-close-flow__summary-row">
                    <span>Closure reason</span>
                    <strong>{reason.replace(/_/g, " ")}</strong>
                  </div>
                  <div className="fc-close-flow__summary-row">
                    <span>Final balance sweep</span>
                    <strong>
                      {remainingBalance > 0 && selectedDest
                        ? `${currency} ${remainingBalance.toFixed(2)} -> ${selectedDest.label} (${selectedDest.mask})`
                        : `${currency} 0.00`}
                    </strong>
                  </div>
                </div>
                <Checkbox
                  label="I understand closure cancels all associated virtual cards, active mandates, and IBAN details permanently."
                  checked={ackPermanent}
                  onChange={(e) => setAckPermanent(e.target.checked)}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

CloseAccountFlow.displayName = "CloseAccountFlow";
export default CloseAccountFlow;
