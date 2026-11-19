import React, { useEffect, useState } from "react";
import type { BeneficiaryItem, MoneyTransferFlowProps, TransferRail } from "../types";
import { Card } from "../card";
import { BeneficiaryPicker } from "../beneficiary-picker";
import { Input } from "../input";
import { Select } from "../select";
import { RadioGroup } from "../radio-group";
import { FeeBreakdown } from "../fee-breakdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { BiometricAuthPrompt } from "../biometric-auth-prompt";
import { OTP } from "../otp";
import { PinInput } from "../pin-input";
import { TransferReceipt } from "../transfer-receipt";
import { Badge } from "../badge";
import { Alert } from "../alert";
import { Button } from "../button";
import { formatMoney } from "../utils/format";

const RAIL_META: Record<TransferRail, { label: string; fee: number; eta: string }> = {
  ach: { label: "ACH Standard", fee: 0, eta: "1-2 business days" },
  wire: { label: "Wire / SWIFT", fee: 15, eta: "Same day" },
  sepa_instant: { label: "SEPA Instant", fee: 1.5, eta: "Under 10 seconds" },
};

const QUICK_AMOUNTS = [250, 1000, 5000];

export const MoneyTransferFlow = React.forwardRef<HTMLDivElement, MoneyTransferFlowProps>(
  (
    {
      title = "Send money",
      accountType = "personal",
      stepVariant = "pills",
      senderName = "Operating Account",
      senderAccount = "•••• 9012",
      sourceCurrency: initialSourceCurrency = "USD",
      targetCurrency: initialTargetCurrency = "EUR",
      currencies = ["USD", "EUR", "GBP", "NGN", "CAD"],
      targetCurrencies = ["EUR", "USD", "GBP", "NGN", "CAD"],
      availableBalance = 25000,
      dailyLimit = 15000,
      exchangeRate = 0.92,
      rateLockSeconds = 300,
      beneficiaries: initialBeneficiaries = [],
      onCompleteTransfer,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<0 | 1 | 2>(0);
    const [sent, setSent] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiaryItem[]>(initialBeneficiaries);
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<BeneficiaryItem | undefined>(
      initialBeneficiaries[0],
    );
    const [addingBeneficiary, setAddingBeneficiary] = useState(false);
    const [newBenName, setNewBenName] = useState("");
    const [newBenBank, setNewBenBank] = useState("");
    const [newBenAccount, setNewBenAccount] = useState("");
    const [newBenCurrency, setNewBenCurrency] = useState(initialTargetCurrency);

    const [sourceCurrency, setSourceCurrency] = useState(initialSourceCurrency);
    const [targetCurrency, setTargetCurrency] = useState(initialTargetCurrency);
    const [amountStr, setAmountStr] = useState("1000");
    const [rail, setRail] = useState<TransferRail>("ach");
    const [secondsLeft, setSecondsLeft] = useState(rateLockSeconds);
    const [authTab, setAuthTab] = useState<"passkey" | "otp" | "pin">("passkey");
    const [bioOpen, setBioOpen] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [authenticating, setAuthenticating] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [sharedNotice, setSharedNotice] = useState(false);
    const [reference, setReference] = useState(
      () => `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    );

    useEffect(() => {
      if (step !== 1 && step !== 2) return;
      if (sent) return;
      const timer = setInterval(() => {
        setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }, [step, sent]);

    const effectiveRate = sourceCurrency === targetCurrency ? 1 : exchangeRate;
    const amount = Math.max(0, Number.parseFloat(amountStr) || 0);
    const fee = RAIL_META[rail].fee;
    const recipientGets = Number((Math.max(0, amount - fee) * effectiveRate).toFixed(2));
    const rateExpired = secondsLeft === 0;
    const exceedsBalance = amount + fee > availableBalance;
    const exceedsLimit = amount > dailyLimit;
    const mins = Math.floor(secondsLeft / 60);
    const secs = String(secondsLeft % 60).padStart(2, "0");

    const stepLabels = ["Recipient", "Amount & Rail", "Confirm & Send"];

    const handleSaveNewBeneficiary = () => {
      if (!newBenName.trim() || !newBenBank.trim() || !newBenAccount.trim()) {
        setErrorMsg("Enter recipient name, bank name, and account number.");
        return;
      }
      const created: BeneficiaryItem = {
        id: `ben-${Date.now()}`,
        name: newBenName.trim(),
        bankName: newBenBank.trim(),
        accountMask: newBenAccount.trim(),
        rail: rail.toUpperCase(),
        verificationStatus: "verified",
      };
      setBeneficiaries((prev) => [created, ...prev]);
      setSelectedBeneficiary(created);
      setAddingBeneficiary(false);
      setNewBenName("");
      setNewBenBank("");
      setNewBenAccount("");
      setErrorMsg(null);
    };

    const handleContinueFromAmount = () => {
      if (rateExpired) {
        setErrorMsg("FX rate lock expired. Refresh the quote to continue.");
        return;
      }
      if (amount <= 0) {
        setErrorMsg("Enter a transfer amount greater than zero.");
        return;
      }
      if (exceedsBalance) {
        setErrorMsg("Insufficient balance to cover this transfer and fee.");
        return;
      }
      if (exceedsLimit) {
        setErrorMsg(`Amount exceeds your ${formatMoney(dailyLimit, { currency: sourceCurrency })} daily limit.`);
        return;
      }
      setErrorMsg(null);
      setStep(2);
    };

    const handleFinalizeSend = () => {
      if (!selectedBeneficiary || rateExpired) {
        setErrorMsg("Please refresh your rate quote before sending.");
        return;
      }
      setAuthenticating(true);
      setErrorMsg(null);
      const refCode = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      setTimeout(() => {
        setAuthenticating(false);
        setBioOpen(false);
        setReference(refCode);
        setSent(true);
        onCompleteTransfer?.({
          beneficiary: selectedBeneficiary,
          currency: sourceCurrency,
          amount,
          rail,
          fee,
          reference: refCode,
        });
      }, 250);
    };

    const handleRestart = () => {
      setStep(0);
      setSent(false);
      setSecondsLeft(rateLockSeconds);
      setOtpCode("");
      setPinCode("");
      setErrorMsg(null);
      setSharedNotice(false);
    };

    return (
      <div
        ref={ref}
        className={["fc-transfer-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-transfer-flow__header">
              <span>{title}</span>
              <Badge variant={rateExpired ? "warning" : "info"}>
                {rateExpired
                  ? "Rate expired"
                  : `1 ${sourceCurrency} = ${effectiveRate} ${targetCurrency} · ${mins}:${secs}`}
              </Badge>
            </div>
          }
          description={
            accountType === "business"
              ? `Business treasury (${senderName}) · Available: ${formatMoney(availableBalance, { currency: sourceCurrency })}`
              : `Available balance: ${formatMoney(availableBalance, { currency: sourceCurrency })}`
          }
        >
          <div className="fc-transfer-flow__stack">
            {stepVariant !== "progress" && (
              <nav aria-label="Transfer progress">
                <ol className="fc-transfer-flow__stepper">
                  {stepLabels.map((lbl, idx) => {
                    const isDone = sent || idx < step;
                    const isActive = !sent && idx === step;
                    const cls = [
                      "fc-transfer-flow__step",
                      isDone
                        ? "fc-transfer-flow__step--done"
                        : isActive
                          ? "fc-transfer-flow__step--active"
                          : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <li key={lbl} className={cls} aria-current={isActive ? "step" : undefined}>
                        <span className="fc-transfer-flow__step-num" aria-hidden="true">
                          {isDone ? "✓" : idx + 1}
                        </span>
                        <span className="fc-transfer-flow__step-label">{lbl}</span>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            <div className="fc-transfer-flow__sr" aria-live="polite">
              Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
            </div>

            {errorMsg && (
              <Alert variant="error" title="Check transfer details">
                {errorMsg}
              </Alert>
            )}

            {rateExpired && !sent && (
              <Alert variant="warning" title="Exchange rate quote expired">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span>Refresh the rate quote to continue with the latest rate.</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSecondsLeft(rateLockSeconds);
                      setErrorMsg(null);
                    }}
                  >
                    Refresh quote
                  </Button>
                </div>
              </Alert>
            )}

            {step === 0 && (
              <div className="fc-transfer-flow__stack">
                <BeneficiaryPicker
                  title="Select recipient"
                  searchable
                  beneficiaries={beneficiaries}
                  selectedId={selectedBeneficiary?.id}
                  onSelect={(b) => {
                    setSelectedBeneficiary(b);
                    setErrorMsg(null);
                  }}
                  onAddNew={() => setAddingBeneficiary((v) => !v)}
                />

                {addingBeneficiary && (
                  <Card title="Add new recipient" description="Save recipient bank details for this transfer.">
                    <div className="fc-transfer-flow__stack">
                      <div className="fc-transfer-flow__grid-2">
                        <Input
                          label="Recipient name"
                          placeholder="Global Logistics Ltd"
                          value={newBenName}
                          onChange={(e) => setNewBenName(e.target.value)}
                        />
                        <Input
                          label="Bank name"
                          placeholder="Citibank N.A."
                          value={newBenBank}
                          onChange={(e) => setNewBenBank(e.target.value)}
                        />
                      </div>
                      <div className="fc-transfer-flow__grid-2">
                        <Input
                          label="Account / IBAN"
                          placeholder="•••• 8841"
                          value={newBenAccount}
                          onChange={(e) => setNewBenAccount(e.target.value)}
                        />
                        <Select
                          label="Recipient currency"
                          value={newBenCurrency}
                          onChange={(e) => setNewBenCurrency(e.target.value)}
                        >
                          {currencies.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="fc-transfer-flow__actions-right">
                        <Button variant="ghost" size="sm" onClick={() => setAddingBeneficiary(false)}>
                          Cancel
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleSaveNewBeneficiary}>
                          Save recipient
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="fc-transfer-flow__actions">
                  <Button variant="ghost" onClick={handleRestart}>
                    Restart
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!selectedBeneficiary}
                    onClick={() => {
                      setErrorMsg(null);
                      setStep(1);
                    }}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="fc-transfer-flow__stack">
                <div className="fc-transfer-flow__amount-grid">
                  <Input
                    label="You send"
                    inputMode="decimal"
                    value={amountStr}
                    errorMessage={
                      exceedsBalance
                        ? "Insufficient balance"
                        : exceedsLimit
                          ? "Exceeds daily limit"
                          : undefined
                    }
                    onChange={(e) => {
                      setAmountStr(e.target.value);
                      setErrorMsg(null);
                    }}
                  />
                  <Select
                    label="From"
                    value={sourceCurrency}
                    onChange={(e) => setSourceCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                  <Select
                    label="To"
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                  >
                    {targetCurrencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="fc-transfer-flow__chips">
                  {QUICK_AMOUNTS.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setAmountStr(String(q));
                        setErrorMsg(null);
                      }}
                    >
                      {formatMoney(q, { currency: sourceCurrency })}
                    </Button>
                  ))}
                </div>

                <RadioGroup
                  label="Transfer rail"
                  name="transfer-rail"
                  value={rail}
                  onChange={(val) => setRail(val as TransferRail)}
                  options={[
                    { value: "ach", label: "ACH Standard — Free · 1-2 business days" },
                    { value: "wire", label: "Wire / SWIFT — Same day ($15 fee)" },
                    { value: "sepa_instant", label: "SEPA Instant — Under 10 seconds ($1.50 fee)" },
                  ]}
                />

                <FeeBreakdown
                  currency={sourceCurrency}
                  fees={[
                    { label: "Send amount", amount },
                    { label: `${RAIL_META[rail].label} fee`, amount: fee },
                  ]}
                  totalFee={fee}
                  recipientGets={`${targetCurrency} ${recipientGets.toLocaleString()}`}
                  exchangeRateNotice={`Guaranteed rate: 1 ${sourceCurrency} = ${effectiveRate} ${targetCurrency} · Arrives ${RAIL_META[rail].eta}`}
                />

                <div className="fc-transfer-flow__actions">
                  <Button variant="ghost" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <div className="fc-transfer-flow__actions-right">
                    {rateExpired && (
                      <Button variant="secondary" onClick={() => setSecondsLeft(rateLockSeconds)}>
                        Refresh rate
                      </Button>
                    )}
                    <Button variant="primary" onClick={handleContinueFromAmount}>
                      Continue to confirm
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && !sent && selectedBeneficiary && (
              <div className="fc-transfer-flow__stack">
                <Card
                  title={`Review transfer to ${selectedBeneficiary.name}`}
                  description={`${selectedBeneficiary.bankName} · ${selectedBeneficiary.accountMask} · ${RAIL_META[rail].eta}`}
                >
                  <div className="fc-transfer-flow__summary-grid">
                    <div>
                      <span className="fc-transfer-flow__summary-label">Total debited</span>
                      <span className="fc-transfer-flow__summary-value">
                        {formatMoney(amount + fee, { currency: sourceCurrency })}
                      </span>
                    </div>
                    <div>
                      <span className="fc-transfer-flow__summary-label">Recipient gets</span>
                      <span className="fc-transfer-flow__summary-value">
                        {formatMoney(recipientGets, { currency: targetCurrency })}
                      </span>
                    </div>
                  </div>
                </Card>

                <Tabs
                  value={authTab}
                  onValueChange={(val) => setAuthTab(val as "passkey" | "otp" | "pin")}
                >
                  <TabsList>
                    <TabsTrigger value="passkey">Passkey</TabsTrigger>
                    <TabsTrigger value="otp">Text / App Code</TabsTrigger>
                    <TabsTrigger value="pin">Account PIN</TabsTrigger>
                  </TabsList>

                  <TabsContent value="passkey" className="fc-transfer-flow__tab-panel">
                    <Button
                      variant="primary"
                      loading={authenticating}
                      onClick={() => setBioOpen(true)}
                    >
                      Confirm &amp; Send with Passkey
                    </Button>
                  </TabsContent>

                  <TabsContent value="otp" className="fc-transfer-flow__tab-panel">
                    <OTP
                      label="Enter 6-digit verification code"
                      value={otpCode}
                      onChange={setOtpCode}
                    />
                    <Button
                      variant="primary"
                      loading={authenticating}
                      disabled={otpCode.length < 6}
                      onClick={handleFinalizeSend}
                    >
                      Confirm &amp; Send
                    </Button>
                  </TabsContent>

                  <TabsContent value="pin" className="fc-transfer-flow__tab-panel">
                    <PinInput length={4} value={pinCode} onChange={setPinCode} />
                    <Button
                      variant="primary"
                      loading={authenticating}
                      disabled={pinCode.length < 4}
                      onClick={handleFinalizeSend}
                    >
                      Confirm &amp; Send
                    </Button>
                  </TabsContent>
                </Tabs>

                <BiometricAuthPrompt
                  open={bioOpen}
                  onOpenChange={setBioOpen}
                  type="face"
                  title="Approve transfer"
                  description={`Send ${formatMoney(amount, { currency: sourceCurrency })} to ${selectedBeneficiary.name}`}
                  amount={amount}
                  currency={sourceCurrency}
                  status={authenticating ? "authenticating" : "idle"}
                  onAuthenticate={handleFinalizeSend}
                />

                <div className="fc-transfer-flow__actions">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  {rateExpired && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSecondsLeft(rateLockSeconds);
                        setErrorMsg(null);
                      }}
                    >
                      Refresh quote
                    </Button>
                  )}
                </div>
              </div>
            )}

            {sent && selectedBeneficiary && (
              <div className="fc-transfer-flow__stack">
                <TransferReceipt
                  status="success"
                  amount={amount}
                  currency={sourceCurrency}
                  reference={reference}
                  timestamp="Just now"
                  recipientName={selectedBeneficiary.name}
                  recipientBank={selectedBeneficiary.bankName}
                  recipientAccount={selectedBeneficiary.accountMask}
                  senderName={senderName}
                  senderAccount={senderAccount}
                  onShare={() => setSharedNotice(true)}
                />

                {sharedNotice && (
                  <Alert variant="success" title="Receipt link copied">
                    Shareable receipt details for {reference} are ready.
                  </Alert>
                )}

                <div className="fc-transfer-flow__actions">
                  <Button variant="secondary" onClick={() => setSharedNotice(true)}>
                    Share Receipt
                  </Button>
                  <Button variant="primary" onClick={handleRestart}>
                    Restart
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  },
);

MoneyTransferFlow.displayName = "MoneyTransferFlow";
export default MoneyTransferFlow;
