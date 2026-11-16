import React, { useEffect, useId, useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import { FeeBreakdown } from "../fee-breakdown";
import { Input } from "../input";
import { Select } from "../select";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import { Tooltip } from "../tooltip";
import { TransferReceipt } from "../transfer-receipt";
import type { FXConversionFlowProps } from "../types";

const BASE_RATES_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
  CAD: 1.38,
};

type FXStatus = "selecting" | "entering-amount" | "reviewing" | "processing" | "success" | "rate-expired";

const IconSwap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m16 3 4 4-4 4" /><path d="M20 7H4" /><path d="m8 21-4-4 4-4" /><path d="M4 17h16" />
  </svg>
);

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" />
  </svg>
);

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

export const FXConversionFlow = React.forwardRef<HTMLDivElement, FXConversionFlowProps>(
  (
    {
      title = "Convert currency",
      accountType: initialAccountType = "personal",
      fromCurrency: initialFrom = "USD",
      toCurrency: initialTo = "EUR",
      currencies = ["USD", "EUR", "GBP", "NGN", "CAD"],
      availableBalance = 25000,
      exchangeRate,
      feePercent = 0.35,
      rateLockSeconds = 45,
      onConvert,
      className,
      ...props
    },
    ref,
  ) => {
    const baseId = useId();
    const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
    const [fromCurrency, setFromCurrency] = useState<string>(initialFrom);
    const [toCurrency, setToCurrency] = useState<string>(initialTo);
    const [amount, setAmount] = useState<string>("1000");
    const [step, setStep] = useState<number>(1);
    const [status, setStatus] = useState<FXStatus>("entering-amount");
    const [secondsLeft, setSecondsLeft] = useState<number>(rateLockSeconds);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [receiptRef, setReceiptRef] = useState<string>("");

    const computedRate =
      exchangeRate ??
      ((BASE_RATES_USD[toCurrency] || 1) / (BASE_RATES_USD[fromCurrency] || 1));

    const parsedAmount = Number(amount) || 0;
    const effectiveFeePct = accountType === "business" ? Math.max(0.2, feePercent - 0.1) : feePercent;
    const fee = (parsedAmount * effectiveFeePct) / 100;
    const netSource = Math.max(0, parsedAmount - fee);
    const convertedAmount = netSource * computedRate;

    useEffect(() => {
      if (status !== "reviewing" && status !== "entering-amount" && status !== "selecting") return;
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (step === 2) {
              setStatus("rate-expired");
              setErrorMessage("Your quoted exchange rate expired. Refresh quote to continue.");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [status, step]);

    const handleRestart = (nextType: "personal" | "business" = accountType) => {
      setAccountType(nextType);
      setStep(1);
      setStatus("entering-amount");
      setSecondsLeft(rateLockSeconds);
      setErrorMessage("");
      setReceiptRef("");
    };

    const handleSwapCurrencies = () => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
      setSecondsLeft(rateLockSeconds);
      setErrorMessage("");
      if (status === "rate-expired") setStatus("entering-amount");
    };

    const handleContinue = () => {
      setErrorMessage("");
      if (fromCurrency === toCurrency) {
        setErrorMessage("Source and target currencies must be different.");
        return;
      }
      if (parsedAmount <= 0) {
        setErrorMessage("Enter an amount greater than zero.");
        return;
      }
      if (parsedAmount > availableBalance) {
        setErrorMessage(
          `Insufficient ${fromCurrency} balance (${availableBalance.toLocaleString()} available).`,
        );
        return;
      }
      setSecondsLeft(rateLockSeconds);
      setStep(2);
      setStatus("reviewing");
    };

    const handleConvert = () => {
      if (secondsLeft <= 0 || status === "rate-expired") {
        setStatus("rate-expired");
        setErrorMessage("Exchange rate expired. Refresh rate lock before converting.");
        return;
      }
      setStatus("processing");
      const refId = `FX-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptRef(refId);
      setStatus("success");
      onConvert?.({
        fromCurrency,
        toCurrency,
        fromAmount: parsedAmount,
        toAmount: convertedAmount,
        fee,
        rate: computedRate,
        reference: refId,
      });
    };

    return (
      <div
        ref={ref}
        className={["fc-fx-flow", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card
          title={
            <div className="fc-fx-flow__header">
              <span>{title}</span>
              <Badge variant={status === "success" ? "success" : secondsLeft > 10 ? "info" : "warning"}>
                {status === "success" ? "Converted" : `Rate lock ${secondsLeft}s`}
              </Badge>
            </div>
          }
          description="Convert balances between wallet currencies with live transparent FX pricing."
          footer={
            <div className="fc-fx-flow__actions">
              {status !== "success" ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => (step === 1 ? handleRestart() : setStep(1))}
                  >
                    <span className="fc-fx-flow__btn-inner">
                      {step === 1 ? <IconRefresh /> : <IconArrowLeft />}
                      {step === 1 ? "Restart" : "Back"}
                    </span>
                  </Button>
                  <div className="fc-fx-flow__actions-right">
                    {status === "rate-expired" ? (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSecondsLeft(rateLockSeconds);
                          setStatus("reviewing");
                          setErrorMessage("");
                        }}
                      >
                        <span className="fc-fx-flow__btn-inner">
                          <IconRefresh /> Refresh quote
                        </span>
                      </Button>
                    ) : null}
                    {step === 1 ? (
                      <Button variant="primary" onClick={handleContinue}>
                        <span className="fc-fx-flow__btn-inner">
                          Continue <IconArrowRight />
                        </span>
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleConvert} disabled={status === "rate-expired"}>
                        <span className="fc-fx-flow__btn-inner">
                          <IconCheck /> Convert
                        </span>
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <span />
                  <Button variant="secondary" onClick={() => handleRestart()}>
                    <span className="fc-fx-flow__btn-inner">
                      <IconRefresh /> New conversion
                    </span>
                  </Button>
                </>
              )}
            </div>
          }
        >
          <div className="fc-fx-flow__stack">
            <div className="fc-fx-flow__top-row">
              <Tabs
                value={accountType}
                onValueChange={(val) => handleRestart(val as "personal" | "business")}
              >
                <TabsList aria-label="FX account tier">
                  <TabsTrigger value="personal">Personal wallet</TabsTrigger>
                  <TabsTrigger value="business">Treasury FX</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <nav aria-label="Conversion steps">
              <ol className="fc-fx-flow__stepper" aria-live="polite">
                {["Currencies & amount", "Review quote", "Receipt"].map((label, idx) => {
                  const s = idx + 1;
                  const isDone = step > s || status === "success";
                  const isActive = !isDone && step === s;
                  return (
                    <li
                      key={label}
                      aria-current={isActive ? "step" : undefined}
                      className={[
                        "fc-fx-flow__step",
                        isActive ? "fc-fx-flow__step--active" : "",
                        isDone ? "fc-fx-flow__step--done" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span className="fc-fx-flow__step-num" aria-hidden="true">
                        {isDone ? "✓" : s}
                      </span>
                      <span className="fc-fx-flow__step-label">{label}</span>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {errorMessage ? (
              <Alert variant="error" title={status === "rate-expired" ? "Rate expired" : "Conversion error"}>
                {errorMessage}
              </Alert>
            ) : null}

            {status === "success" ? (
              <TransferReceipt
                reference={receiptRef}
                amount={convertedAmount.toFixed(2)}
                currency={toCurrency}
                status="success"
                timestamp="Converted instantly"
                recipientName={`${toCurrency} Wallet`}
                recipientBank={`From ${parsedAmount.toFixed(2)} ${fromCurrency}`}
                recipientAccount={`Rate 1 ${fromCurrency} = ${computedRate.toFixed(4)} ${toCurrency}`}
                fee={fee.toFixed(2)}
              />
            ) : null}

            {status !== "success" && step === 1 ? (
              <div className="fc-fx-flow__stack">
                <div className="fc-fx-flow__pair-grid">
                  <Select
                    label="From currency"
                    id={`${baseId}-from`}
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                  <Tooltip content="Swap source & target currencies">
                    <Button
                      variant="secondary"
                      onClick={handleSwapCurrencies}
                      aria-label="Swap currencies"
                    >
                      <span className="fc-fx-flow__btn-inner">
                        <IconSwap /> Swap
                      </span>
                    </Button>
                  </Tooltip>
                  <Select
                    label="To currency"
                    id={`${baseId}-to`}
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="fc-fx-flow__grid-2">
                  <Input
                    label={`Amount to convert (${fromCurrency})`}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    helperText={`Available: ${fromCurrency} ${availableBalance.toLocaleString()}`}
                  />
                  <Input
                    label={`Estimated receive (${toCurrency})`}
                    value={convertedAmount.toFixed(2)}
                    readOnly
                    helperText={`1 ${fromCurrency} = ${computedRate.toFixed(4)} ${toCurrency}`}
                  />
                </div>
              </div>
            ) : null}

            {status !== "success" && step === 2 ? (
              <FeeBreakdown
                currency={fromCurrency}
                fees={[
                  { label: "Source amount", amount: parsedAmount },
                  { label: `Conversion fee (${effectiveFeePct}%)`, amount: fee },
                ]}
                totalFee={fee}
                recipientGets={Number(convertedAmount.toFixed(2))}
                exchangeRateNotice={`1 ${fromCurrency} = ${computedRate.toFixed(4)} ${toCurrency} -> Receive ${toCurrency} ${convertedAmount.toFixed(2)}`}
              />
            ) : null}
          </div>
        </Card>
      </div>
    );
  },
);

FXConversionFlow.displayName = "FXConversionFlow";
export default FXConversionFlow;
