import React, { useState } from "react";
import type { StepUpAuthFlowProps, StepUpFactor } from "../types";
import { Card } from "../card";
import { Badge } from "../badge";
import { Alert } from "../alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { BiometricAuthPrompt } from "../biometric-auth-prompt";
import { OTP } from "../otp";
import { PinInput } from "../pin-input";
import { Button } from "../button";
import { formatMoney } from "../utils/format";

export const StepUpAuthFlow = React.forwardRef<HTMLDivElement, StepUpAuthFlowProps>(
  (
    {
      title = "Confirm it's you",
      actionSummary,
      amount,
      currency = "USD",
      recipient,
      defaultFactor = "biometric",
      maxAttempts = 3,
      onVerify,
      onResendCode,
      onCancel,
      className,
      ...props
    },
    ref,
  ) => {
    const [factor, setFactor] = useState<StepUpFactor>(defaultFactor);
    const [otpCode, setOtpCode] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [bioOpen, setBioOpen] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [flowState, setFlowState] = useState<"idle" | "verifying" | "success" | "error" | "locked">(
      "idle",
    );
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [resentNotice, setResentNotice] = useState(false);

    const lockedOut = flowState === "locked" || attempts >= maxAttempts;

    const handleReset = () => {
      setAttempts(0);
      setOtpCode("");
      setPinCode("");
      setFlowState("idle");
      setStatusMessage(null);
      setResentNotice(false);
    };

    const handleResend = () => {
      setResentNotice(true);
      setStatusMessage(null);
      onResendCode?.();
    };

    const submitVerification = async (code?: string) => {
      if (lockedOut) return;
      setFlowState("verifying");
      setStatusMessage(null);
      setResentNotice(false);

      if (onVerify) {
        const ok = await onVerify({ factor, code });
        if (!ok) {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= maxAttempts) {
            setFlowState("locked");
            setStatusMessage("Too many failed attempts. Verification is temporarily locked.");
          } else {
            setFlowState("error");
            setStatusMessage(
              `Verification code didn't match. ${maxAttempts - next} ${maxAttempts - next === 1 ? "attempt" : "attempts"} left.`,
            );
          }
          return;
        }
      }
      setBioOpen(false);
      setFlowState("success");
    };

    return (
      <div
        ref={ref}
        className={["fc-stepup-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-stepup-flow__header">
              <span>{title}</span>
              <Badge variant={lockedOut ? "error" : attempts > 0 ? "warning" : "info"}>
                {lockedOut
                  ? "Locked"
                  : `${Math.max(0, maxAttempts - attempts)}/${maxAttempts} tries left`}
              </Badge>
            </div>
          }
        >
          <div className="fc-stepup-flow__stack">
            <Alert variant="info" title="Action to approve">
              {actionSummary}
              {amount !== undefined ? ` of ${formatMoney(amount, { currency })}` : ""}
              {recipient ? ` to ${recipient}` : ""}
            </Alert>

            {flowState === "success" ? (
              <div className="fc-stepup-flow__stack">
                <Alert variant="success" title="Approved">
                  Identity confirmed. Your request is proceeding now.
                </Alert>
                <div className="fc-stepup-flow__actions">
                  <Button variant="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Tabs
                  value={factor}
                  onValueChange={(val) => {
                    setFactor(val as StepUpFactor);
                    setStatusMessage(null);
                    setResentNotice(false);
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="biometric" disabled={lockedOut}>
                      Face / Touch ID
                    </TabsTrigger>
                    <TabsTrigger value="otp" disabled={lockedOut}>
                      Text / App Code
                    </TabsTrigger>
                    <TabsTrigger value="pin" disabled={lockedOut}>
                      Account PIN
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="biometric">
                    <div className="fc-stepup-flow__tab-panel">
                      <Alert variant="info" title="Passkey approval">
                        Approve quickly using your device biometrics or passkey.
                      </Alert>
                      <Button
                        variant="primary"
                        disabled={lockedOut}
                        loading={flowState === "verifying"}
                        onClick={() => setBioOpen(true)}
                      >
                        Approve with Passkey
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="otp">
                    <div className="fc-stepup-flow__tab-panel">
                      <OTP
                        label="Enter the 6-digit code sent to your phone"
                        length={6}
                        value={otpCode}
                        disabled={lockedOut}
                        errorMessage={flowState === "error" ? statusMessage ?? undefined : undefined}
                        onChange={setOtpCode}
                        onComplete={(val) => submitVerification(val)}
                      />
                      <div className="fc-stepup-flow__actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={lockedOut}
                          onClick={handleResend}
                        >
                          Resend code
                        </Button>
                        <Button
                          variant="primary"
                          disabled={lockedOut || otpCode.length < 6}
                          loading={flowState === "verifying"}
                          onClick={() => submitVerification(otpCode)}
                        >
                          Approve
                        </Button>
                      </div>
                      {resentNotice && (
                        <Alert variant="info" title="Code sent">
                          A fresh 6-digit code has been sent to your registered device.
                        </Alert>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pin">
                    <div className="fc-stepup-flow__tab-panel">
                      <PinInput
                        length={4}
                        value={pinCode}
                        disabled={lockedOut}
                        error={flowState === "error" || lockedOut}
                        onChange={setPinCode}
                        onComplete={(val) => submitVerification(val)}
                      />
                      <div className="fc-stepup-flow__actions">
                        <span />
                        <Button
                          variant="primary"
                          disabled={lockedOut || pinCode.length < 4}
                          loading={flowState === "verifying"}
                          onClick={() => submitVerification(pinCode)}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {(flowState === "error" || flowState === "locked") && statusMessage && (
                  <Alert variant="error" title={lockedOut ? "Verification locked" : "Incorrect code"}>
                    {statusMessage}
                  </Alert>
                )}

                <BiometricAuthPrompt
                  open={bioOpen}
                  onOpenChange={setBioOpen}
                  type="face"
                  title="Approve action"
                  description={`${actionSummary}${amount !== undefined ? ` (${formatMoney(amount, { currency })})` : ""}`}
                  amount={amount}
                  currency={currency}
                  onAuthenticate={() => submitVerification()}
                  onUsePasscode={() => {
                    setBioOpen(false);
                    setFactor("pin");
                  }}
                />

                <div className="fc-stepup-flow__actions">
                  <Button variant="ghost" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  },
);

StepUpAuthFlow.displayName = "StepUpAuthFlow";
export default StepUpAuthFlow;
