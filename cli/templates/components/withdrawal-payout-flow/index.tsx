import React, { useState } from "react";
import type { WithdrawalPayoutFlowProps } from "../types";
import { Card } from "../card";
import { Badge } from "../badge";
import { RadioGroup } from "../radio-group";
import { Input } from "../input";
import { Select } from "../select";
import { TransferLimitMeter } from "../transfer-limit-meter";
import { Checkbox } from "../checkbox";
import { Alert } from "../alert";
import { Button } from "../button";
import { formatMoney } from "../utils/format";

export const WithdrawalPayoutFlow = React.forwardRef<HTMLDivElement, WithdrawalPayoutFlowProps>(
  (
    {
      title = "Withdraw money",
      accountType = "personal",
      currency: initialCurrency = "USD",
      currencies = ["USD", "EUR", "GBP", "NGN", "CAD"],
      availableBalance,
      pendingBalance = 0,
      destinations = [],
      limits = [],
      requireConfirmationCheck = true,
      onConfirmWithdrawal,
      className,
      ...props
    },
    ref,
  ) => {
    const [currency, setCurrency] = useState(initialCurrency);
    const [selectedDestId, setSelectedDestId] = useState(destinations[0]?.id ?? "");
    const [amountStr, setAmountStr] = useState("250");
    const [confirmedCheck, setConfirmedCheck] = useState(false);
    const [flowState, setFlowState] = useState<"idle" | "confirming" | "processing" | "success" | "error">(
      "idle",
    );
    const [reference, setReference] = useState("");

    const dest = destinations.find((d) => d.id === selectedDestId) ?? destinations[0];
    const amount = Math.max(0, Number.parseFloat(amountStr) || 0);
    const primaryLimit = limits[0];
    const remainingLimit = primaryLimit ? Math.max(0, primaryLimit.max - primaryLimit.used) : Infinity;

    const exceedsBalance = amount > availableBalance;
    const exceedsLimit = amount > remainingLimit;
    const blocked =
      amount <= 0 ||
      exceedsBalance ||
      exceedsLimit ||
      (requireConfirmationCheck && !confirmedCheck);

    const handleReset = () => {
      setAmountStr("250");
      setConfirmedCheck(false);
      setFlowState("idle");
      setReference("");
    };

    const handleTestOverLimit = () => {
      const target = Math.max(remainingLimit, availableBalance) + 2500;
      setAmountStr(String(Math.round(target)));
      setFlowState("error");
    };

    const handleWithdraw = async () => {
      if (blocked || !dest) return;
      setFlowState("processing");
      const refCode = `WDL-${Math.floor(100000 + Math.random() * 900000)}`;
      if (onConfirmWithdrawal) {
        const res = await onConfirmWithdrawal({
          destination: dest,
          currency,
          amount,
          fee: dest.fee,
          reference: refCode,
        });
        if (res === false) {
          setFlowState("error");
          return;
        }
      }
      setReference(refCode);
      setFlowState("success");
    };

    return (
      <div
        ref={ref}
        className={["fc-withdrawal-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-withdrawal-flow__header">
              <span>{title}</span>
              <div className="fc-withdrawal-flow__balances">
                <Badge variant="success">
                  Available: {formatMoney(availableBalance, { currency })}
                </Badge>
                {pendingBalance > 0 && (
                  <Badge variant="warning">
                    Pending: {formatMoney(pendingBalance, { currency })}
                  </Badge>
                )}
              </div>
            </div>
          }
          description={
            accountType === "business"
              ? "Select a verified corporate account and withdraw within your treasury payout limit."
              : "Select a linked payout destination and withdraw within your daily limit."
          }
        >
          <div className="fc-withdrawal-flow__stack">
            <RadioGroup
              label="Payout destination"
              name="withdrawal-destination"
              value={selectedDestId}
              onChange={(val) => {
                setSelectedDestId(val);
                if (flowState === "success") setFlowState("idle");
              }}
              options={destinations.map((d) => ({
                value: d.id,
                label: `${d.label} (${d.mask}) · ${d.eta} · ${
                  d.fee === 0 ? "Free" : formatMoney(d.fee, { currency })
                }`,
              }))}
            />

            <div className="fc-withdrawal-flow__amount-grid">
              <Input
                label="Amount to withdraw"
                inputMode="decimal"
                value={amountStr}
                errorMessage={
                  exceedsBalance
                    ? `Exceeds available balance (${formatMoney(availableBalance, { currency })}).`
                    : exceedsLimit
                      ? `Exceeds remaining daily limit (${formatMoney(remainingLimit, { currency })}).`
                      : undefined
                }
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  if (flowState === "success") setFlowState("idle");
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

            {(exceedsBalance || exceedsLimit) && (
              <Alert variant="error" title="Withdrawal limit exceeded">
                {exceedsBalance
                  ? `You only have ${formatMoney(availableBalance, { currency })} available right now.`
                  : `This exceeds your remaining daily withdrawal limit of ${formatMoney(remainingLimit, { currency })}.`}
              </Alert>
            )}

            <TransferLimitMeter limits={limits.map((l) => ({ ...l, currency }))} />

            {requireConfirmationCheck && flowState !== "success" && (
              <Checkbox
                label={`I confirm this withdrawal of ${formatMoney(amount, { currency })} to ${dest?.label ?? ""} (${dest?.mask ?? ""})`}
                checked={confirmedCheck}
                onChange={(e) => {
                  setConfirmedCheck(e.target.checked);
                  setFlowState(e.target.checked ? "confirming" : "idle");
                }}
              />
            )}

            {flowState === "success" && dest && (
              <Alert variant="success" title={`Withdrawal submitted · ${reference}`}>
                {formatMoney(amount, { currency })} is on the way to {dest.label} ({dest.mask}). Expected
                arrival: {dest.eta}.
              </Alert>
            )}

            <div className="fc-withdrawal-flow__actions">
              <div className="fc-withdrawal-flow__actions-right">
                <Button variant="ghost" onClick={handleReset} disabled={flowState === "processing"}>
                  Reset
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleTestOverLimit}
                  disabled={flowState === "processing"}
                >
                  Test Over-Limit
                </Button>
              </div>
              <Button
                variant="primary"
                loading={flowState === "processing"}
                disabled={blocked || flowState === "success"}
                onClick={handleWithdraw}
              >
                Withdraw {formatMoney(amount, { currency })}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  },
);

WithdrawalPayoutFlow.displayName = "WithdrawalPayoutFlow";
export default WithdrawalPayoutFlow;
