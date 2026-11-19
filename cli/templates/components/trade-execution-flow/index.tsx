import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { OrderEntryTicket } from "../order-entry-ticket";
import { PerformanceChartCard } from "../performance-chart-card";
import type { OrderSubmissionPayload, TradeExecutionFlowProps } from "../types";

export const TradeExecutionFlow = React.forwardRef<HTMLDivElement, TradeExecutionFlowProps>(
  (
    {
      symbol,
      companyName,
      currentPrice,
      buyingPower,
      availableShares = 0,
      currency = "USD",
      returnPercent,
      returnAmount,
      benchmarkName,
      benchmarkReturn,
      dataPoints,
      estimatedFee = 0,
      onExecuteOrder,
      className,
      ...props
    },
    ref,
  ) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [pendingOrder, setPendingOrder] = useState<OrderSubmissionPayload | null>(null);
    const [orderId, setOrderId] = useState<string>("");
    const [executing, setExecuting] = useState(false);

    const formatMoney = (val: number) =>
      `${currency} ${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const handleTicketSubmit = (payload: OrderSubmissionPayload) => {
      setPendingOrder(payload);
      setStep(2);
    };

    const handleConfirmExecution = async () => {
      if (!pendingOrder || executing) return;
      setExecuting(true);
      try {
        const res = await onExecuteOrder?.(pendingOrder);
        setOrderId(res?.orderId || `ORD-${Date.now().toString().slice(-6)}`);
        setStep(3);
      } finally {
        setExecuting(false);
      }
    };

    const classes = ["fc-trade-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={`${symbol} trade execution flow`}
        {...props}
      >
        <div className="fc-trade-flow__steps" aria-label="Trade steps">
          <span
            className={`fc-trade-flow__step ${
              step === 1 ? "fc-trade-flow__step--active" : "fc-trade-flow__step--done"
            }`}
          >
            1. Configure Order
          </span>
          <span>→</span>
          <span
            className={`fc-trade-flow__step ${
              step === 2
                ? "fc-trade-flow__step--active"
                : step > 2
                  ? "fc-trade-flow__step--done"
                  : ""
            }`}
          >
            2. Review &amp; Confirm
          </span>
          <span>→</span>
          <span
            className={`fc-trade-flow__step ${
              step === 3 ? "fc-trade-flow__step--active" : ""
            }`}
          >
            3. Execution Receipt
          </span>
        </div>

        {step === 1 && (
          <div className="fc-trade-flow__grid">
            <PerformanceChartCard
              symbol={symbol}
              name={companyName}
              currentPrice={currentPrice}
              returnPercent={returnPercent}
              returnAmount={returnAmount}
              currency={currency}
              benchmarkName={benchmarkName}
              benchmarkReturn={benchmarkReturn}
              dataPoints={dataPoints}
            />
            <OrderEntryTicket
              symbol={symbol}
              companyName={companyName}
              currentPrice={currentPrice}
              buyingPower={buyingPower}
              availableShares={availableShares}
              currency={currency}
              estimatedFee={estimatedFee}
              onSubmitOrder={handleTicketSubmit}
            />
          </div>
        )}

        {step === 2 && pendingOrder && (
          <div className="fc-trade-flow__card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Review {pendingOrder.side.toUpperCase()} Order</h3>
              <Badge variant="info">{pendingOrder.orderType.toUpperCase()}</Badge>
            </div>
            <div className="fc-trade-flow__summary">
              <div className="fc-trade-flow__row">
                <span>Instrument</span>
                <strong>{pendingOrder.symbol} ({companyName})</strong>
              </div>
              <div className="fc-trade-flow__row">
                <span>Quantity</span>
                <strong>{pendingOrder.quantity} shares</strong>
              </div>
              <div className="fc-trade-flow__row">
                <span>Estimated Total</span>
                <strong>{formatMoney(pendingOrder.estimatedTotal)}</strong>
              </div>
            </div>
            <Alert variant="info" title="Best Execution Notice">
              Market orders execute immediately at the prevailing NBBO price.
            </Alert>
            <div className="fc-trade-flow__actions">
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Edit Order
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={executing}
                onClick={handleConfirmExecution}
              >
                {executing ? "Executing..." : "Confirm & Execute Trade"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && pendingOrder && (
          <div className="fc-trade-flow__card">
            <Alert variant="success" title="Order Executed">
              Order {orderId} for {pendingOrder.quantity} shares of {pendingOrder.symbol} has been filled.
            </Alert>
            <div className="fc-trade-flow__summary">
              <div className="fc-trade-flow__row">
                <span>Order Reference</span>
                <strong>{orderId}</strong>
              </div>
              <div className="fc-trade-flow__row">
                <span>Side / Type</span>
                <strong>
                  {pendingOrder.side.toUpperCase()} · {pendingOrder.orderType.toUpperCase()}
                </strong>
              </div>
              <div className="fc-trade-flow__row">
                <span>Settled Total</span>
                <strong>{formatMoney(pendingOrder.estimatedTotal)}</strong>
              </div>
            </div>
            <div className="fc-trade-flow__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPendingOrder(null);
                  setStep(1);
                }}
              >
                Place Another Order
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

TradeExecutionFlow.displayName = "TradeExecutionFlow";
export default TradeExecutionFlow;
