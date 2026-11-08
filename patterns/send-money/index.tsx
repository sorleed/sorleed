import React, { useState } from "react";
import { BankSelector } from "../../react/bank-selector";
import { Currency } from "../../react/currency";
import { BalanceCard } from "../../react/balance-card";
import { PinInput } from "../../react/pin-input";
import { Button } from "../../react/button";
import { Toast } from "../../react/toast";
import type { BankInstitution } from "../../react/types";

export interface SendMoneyFlowProps {
  availableBalance?: number;
  currency?: string;
  banks: BankInstitution[];
  onCompleteTransfer?: (details: {
    bank: BankInstitution;
    accountNumber: string;
    amount: number;
    pin: string;
  }) => Promise<void> | void;
}

export const SendMoneyFlow: React.FC<SendMoneyFlowProps> = ({
  availableBalance = 5420.5,
  currency = "USD",
  banks,
  onCompleteTransfer,
}) => {
  const [step, setStep] = useState<"recipient" | "amount" | "pin" | "success">("recipient");
  const [selectedBank, setSelectedBank] = useState<BankInstitution | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNextFromRecipient = () => {
    if (!selectedBank) {
      setErrorMsg("Please choose a destination bank");
      return;
    }
    if (!accountNumber || accountNumber.length < 8) {
      setErrorMsg("Please enter a valid account number");
      return;
    }
    setErrorMsg("");
    setStep("amount");
  };

  const handleNextFromAmount = () => {
    if (!amount || amount <= 0) {
      setErrorMsg("Please enter an amount to send");
      return;
    }
    if (amount > availableBalance) {
      setErrorMsg("Insufficient funds in your account");
      return;
    }
    setErrorMsg("");
    setStep("pin");
  };

  const handlePinComplete = async (enteredPin: string) => {
    setPin(enteredPin);
    setLoading(true);
    try {
      if (onCompleteTransfer && selectedBank) {
        await onCompleteTransfer({
          bank: selectedBank,
          accountNumber,
          amount,
          pin: enteredPin,
        });
      }
      setStep("success");
    } catch {
      setErrorMsg("Failed to authorize transfer. Please check PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "16px" }}>
      {errorMsg && (
        <Toast
          variant="error"
          title="Error"
          description={errorMsg}
          onClose={() => setErrorMsg("")}
          style={{ marginBottom: "16px" }}
        />
      )}

      {step === "recipient" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Recipient Details</h2>
          <BankSelector
            banks={banks}
            selectedBankId={selectedBank?.id}
            onSelectBank={(b) => setSelectedBank(b)}
          />
          <div>
            <label style={{ display: "block", fontSize: "14px", marginBottom: "6px" }}>
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="e.g. 0123456789"
              style={{
                width: "100%",
                height: "40px",
                padding: "0 12px",
                boxSizing: "border-box",
                borderRadius: "6px",
                border: "1px solid #D4D4D8",
              }}
            />
          </div>
          <Button variant="primary" onClick={handleNextFromRecipient}>
            Continue
          </Button>
        </div>
      )}

      {step === "amount" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <BalanceCard balance={availableBalance} currency={currency} title="Available Balance" />
          <h2 style={{ margin: 0, fontSize: "20px" }}>Enter Amount</h2>
          <Currency
            label="Transfer Amount"
            currency={currency}
            value={amount ? String(amount) : ""}
            onChange={(val) => setAmount(Number(val) || 0)}
          />
          <div style={{ display: "flex", gap: "12px" }}>
            <Button variant="secondary" onClick={() => setStep("recipient")}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNextFromAmount} style={{ flex: 1 }}>
              Review & Authorize
            </Button>
          </div>
        </div>
      )}

      {step === "pin" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Enter 4-Digit Security PIN</h2>
          <p style={{ margin: 0, fontSize: "14px", color: "#71717A", textAlign: "center" }}>
            Authorize transfer of {currency} {amount} to {selectedBank?.name}
          </p>
          <PinInput length={4} autoFocus onComplete={handlePinComplete} disabled={loading} />
          {loading && <p style={{ fontSize: "14px", color: "#2563EB" }}>Processing transaction...</p>}
        </div>
      )}

      {step === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              fontSize: "28px",
            }}
          >
            ✓
          </div>
          <h2 style={{ margin: 0 }}>Transfer Successful!</h2>
          <p style={{ margin: 0, color: "#71717A" }}>
            Sent {currency} {amount} to {selectedBank?.name} ({accountNumber})
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setStep("recipient");
              setAmount(0);
              setAccountNumber("");
              setPin("");
            }}
          >
            Send Another
          </Button>
        </div>
      )}
    </div>
  );
};
export default SendMoneyFlow;

