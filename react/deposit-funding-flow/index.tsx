import React, { useState } from "react";
import type { DepositFundingFlowProps, DepositMethod } from "../types";
import { Card } from "../card";
import { RadioGroup } from "../radio-group";
import { Input } from "../input";
import { Select } from "../select";
import { BankSelector } from "../bank-selector";
import { IbanAccountDetails } from "../iban-account-details";
import { FeeBreakdown } from "../fee-breakdown";
import { Badge } from "../badge";
import { Alert } from "../alert";
import { Button } from "../button";
import { formatMoney } from "../utils/format";

const METHOD_META: Record<DepositMethod, { label: string; eta: string }> = {
  open_banking: { label: "Bank Link (ACH)", eta: "1-2 business days" },
  card: { label: "Debit Card", eta: "Instant" },
  wire: { label: "Wire / IBAN", eta: "Same day" },
};

export const DepositFundingFlow = React.forwardRef<HTMLDivElement, DepositFundingFlowProps>(
  (
    {
      title = "Add money",
      accountType = "personal",
      currency: initialCurrency = "USD",
      currencies = ["USD", "EUR", "GBP", "NGN", "CAD"],
      availableBalance = 12450,
      quickAmounts = [100, 500, 1000],
      banks = [
        { id: "chase", name: "JPMorgan Chase", code: "CHASUS33" },
        { id: "bofa", name: "Bank of America", code: "BOFAUS3N" },
        { id: "mercury", name: "Mercury", code: "MERYUS33" },
      ],
      wireDetails,
      instantFeePercent = 1.5,
      simulateError = null,
      onConfirmDeposit,
      className,
      ...props
    },
    ref,
  ) => {
    const [currency, setCurrency] = useState(initialCurrency);
    const [method, setMethod] = useState<DepositMethod>("open_banking");
    const [amountStr, setAmountStr] = useState("500");
    const [selectedBankId, setSelectedBankId] = useState<string>(banks[0]?.id ?? "");
    const [flowState, setFlowState] = useState<
      "entering" | "confirming" | "processing" | "success" | "error"
    >("entering");
    const [errorText, setErrorText] = useState<string | null>(null);
    const [reference, setReference] = useState<string>("");

    const amount = Math.max(0, Number.parseFloat(amountStr) || 0);
    const fee = method === "card" ? Number(((amount * instantFeePercent) / 100).toFixed(2)) : 0;
    const netCredit = Math.max(0, amount - fee);

    const handleReset = () => {
      setFlowState("entering");
      setErrorText(null);
      setReference("");
    };

    const handleContinueToConfirm = () => {
      if (amount <= 0) {
        setFlowState("error");
        setErrorText("Enter an amount greater than zero.");
        return;
      }
      setErrorText(null);
      setFlowState("confirming");
    };

    const handleConfirmAddMoney = async () => {
      setFlowState("processing");
      setErrorText(null);
      const refCode = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;

      if (simulateError === "insufficient_funds") {
        setFlowState("error");
        setErrorText("Insufficient funds in your linked bank account.");
        return;
      }
      if (simulateError === "card_declined") {
        setFlowState("error");
        setErrorText("Your debit card was declined by the issuing bank. Try another method.");
        return;
      }

      if (onConfirmDeposit) {
        const res = await onConfirmDeposit({
          method,
          currency,
          amount,
          fee,
          reference: refCode,
          bankId: method === "open_banking" ? selectedBankId : undefined,
        });
        if (res === false) {
          setFlowState("error");
          setErrorText("We couldn't complete this deposit. Please check your payment method.");
          return;
        }
      }

      setReference(refCode);
      setFlowState("success");
    };

    return (
      <div
        ref={ref}
        className={["fc-deposit-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-deposit-flow__header-row">
              <span>{title}</span>
              <Badge variant="default">
                Balance: {formatMoney(availableBalance, { currency })}
              </Badge>
            </div>
          }
          description={
            accountType === "business"
              ? "Fund your business treasury wallet using your preferred rail."
              : "Choose a funding method and currency to add money to your account."
          }
        >
          <div className="fc-deposit-flow__stack">
            <RadioGroup
              label="Funding method"
              name="deposit-method"
              value={method}
              onChange={(val) => {
                setMethod(val as DepositMethod);
                handleReset();
              }}
              options={[
                { value: "open_banking", label: "Bank Link (Free · 1-2 business days)" },
                { value: "card", label: `Debit Card (Instant · ${instantFeePercent}% fee)` },
                { value: "wire", label: "Wire / IBAN (Same day)" },
              ]}
            />

            {method === "wire" ? (
              <IbanAccountDetails
                accountHolder={wireDetails?.accountHolder ?? "Sorleed Treasury Account"}
                currency={wireDetails?.currency ?? currency}
                railBadge={wireDetails?.railBadge ?? "ACH & Wire"}
                bankName={wireDetails?.bankName ?? "JPMorgan Chase Bank, N.A."}
                bankAddress={wireDetails?.bankAddress ?? "New York, NY"}
                fields={
                  wireDetails?.fields ?? [
                    { label: "Account Number", value: "004829104821", sensitive: true },
                    { label: "ABA Routing", value: "021000021" },
                  ]
                }
              />
            ) : flowState === "success" ? (
              <div className="fc-deposit-flow__stack">
                <Alert variant="success" title={`Deposit confirmed · ${reference}`}>
                  {formatMoney(amount, { currency })} via {METHOD_META[method].label}. Estimated arrival:{" "}
                  {METHOD_META[method].eta}.
                </Alert>
                <div className="fc-deposit-flow__actions">
                  <Button variant="secondary" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            ) : flowState === "confirming" || flowState === "processing" ? (
              <div className="fc-deposit-flow__stack">
                <Card
                  title="Confirm your deposit"
                  description="Review method, fees, and arrival window."
                >
                  <div className="fc-deposit-flow__summary-grid">
                    <div>
                      <span className="fc-deposit-flow__summary-label">Method</span>
                      <span className="fc-deposit-flow__summary-value">{METHOD_META[method].label}</span>
                    </div>
                    <div>
                      <span className="fc-deposit-flow__summary-label">Estimated arrival</span>
                      <span className="fc-deposit-flow__summary-value">{METHOD_META[method].eta}</span>
                    </div>
                    <div>
                      <span className="fc-deposit-flow__summary-label">Deposit amount</span>
                      <span className="fc-deposit-flow__summary-value">
                        {formatMoney(amount, { currency })}
                      </span>
                    </div>
                    <div>
                      <span className="fc-deposit-flow__summary-label">You get</span>
                      <span className="fc-deposit-flow__summary-value">
                        {formatMoney(netCredit, { currency })} (Fee: {formatMoney(fee, { currency })})
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="fc-deposit-flow__actions">
                  <Button
                    variant="ghost"
                    disabled={flowState === "processing"}
                    onClick={() => setFlowState("entering")}
                  >
                    Change method
                  </Button>
                  <Button
                    variant="primary"
                    loading={flowState === "processing"}
                    onClick={handleConfirmAddMoney}
                  >
                    Add money ({formatMoney(amount, { currency })})
                  </Button>
                </div>
              </div>
            ) : (
              <div className="fc-deposit-flow__stack">
                <div className="fc-deposit-flow__amount-grid">
                  <Input
                    label="Deposit amount"
                    inputMode="decimal"
                    value={amountStr}
                    errorMessage={flowState === "error" && amount <= 0 ? errorText ?? undefined : undefined}
                    onChange={(e) => {
                      setAmountStr(e.target.value);
                      if (flowState === "error") setFlowState("entering");
                    }}
                  />
                  <Select
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="fc-deposit-flow__chips">
                  {quickAmounts.map((q) => (
                    <Button
                      key={q}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setAmountStr(String(q));
                        setErrorText(null);
                      }}
                    >
                      +{formatMoney(q, { currency })}
                    </Button>
                  ))}
                </div>

                {method === "open_banking" && (
                  <BankSelector
                    banks={banks}
                    selectedBankId={selectedBankId}
                    onSelectBank={(b) => setSelectedBankId(b.id)}
                  />
                )}

                <FeeBreakdown
                  currency={currency}
                  fees={[{ label: `${METHOD_META[method].label} fee`, amount: fee }]}
                  totalFee={fee}
                  recipientGets={formatMoney(netCredit, { currency })}
                  exchangeRateNotice={`Estimated arrival: ${METHOD_META[method].eta}`}
                />

                {flowState === "error" && errorText && (
                  <Alert variant="error" title="Deposit could not be completed">
                    {errorText}
                  </Alert>
                )}

                <div className="fc-deposit-flow__actions">
                  <Button variant="ghost" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button variant="primary" disabled={amount <= 0} onClick={handleContinueToConfirm}>
                    Add money
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

DepositFundingFlow.displayName = "DepositFundingFlow";
export default DepositFundingFlow;
