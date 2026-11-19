import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { OrderEntryTicketProps, OrderSide, OrderType } from "../types";

export const OrderEntryTicket = React.forwardRef<HTMLDivElement, OrderEntryTicketProps>(
  (
    {
      symbol,
      companyName,
      currentPrice,
      buyingPower,
      availableShares = 0,
      currency = "USD",
      defaultSide = "buy",
      defaultOrderType = "market",
      estimatedFee = 0,
      onSubmitOrder,
      className,
      ...props
    },
    ref,
  ) => {
    const [side, setSide] = useState<OrderSide>(defaultSide);
    const [orderType, setOrderType] = useState<OrderType>(defaultOrderType);
    const [quantityInput, setQuantityInput] = useState<string>("1");
    const [limitPriceInput, setLimitPriceInput] = useState<string>(currentPrice.toFixed(2));
    const [stopPriceInput, setStopPriceInput] = useState<string>(currentPrice.toFixed(2));
    const [submitting, setSubmitting] = useState(false);

    const quantity = Math.max(0, Number(quantityInput) || 0);
    const limitPrice = Number(limitPriceInput) || currentPrice;
    const stopPrice = Number(stopPriceInput) || currentPrice;

    const executionPrice =
      orderType === "limit" ? limitPrice : orderType === "stop" ? stopPrice : currentPrice;
    const subtotal = quantity * executionPrice;
    const estimatedTotal = side === "buy" ? subtotal + estimatedFee : Math.max(0, subtotal - estimatedFee);

    const insufficientFunds = side === "buy" && estimatedTotal > buyingPower;
    const insufficientShares = side === "sell" && quantity > availableShares;
    const isInvalid = quantity <= 0 || insufficientFunds || insufficientShares;

    const formatMoney = (val: number) =>
      `${currency} ${val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (isInvalid || submitting) return;
      setSubmitting(true);
      try {
        await onSubmitOrder?.({
          symbol,
          side,
          orderType,
          quantity,
          limitPrice: orderType === "limit" ? limitPrice : undefined,
          stopPrice: orderType === "stop" ? stopPrice : undefined,
          estimatedTotal,
        });
      } finally {
        setSubmitting(false);
      }
    };

    const classes = ["fc-order-ticket", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={`${symbol} order entry ticket`}
        {...props}
      >
        <div className="fc-order-ticket__header">
          <div>
            <h3 className="fc-order-ticket__symbol">{symbol}</h3>
            {companyName && <p className="fc-order-ticket__company">{companyName}</p>}
          </div>
          <div className="fc-order-ticket__quote">
            <div className="fc-order-ticket__price">{formatMoney(currentPrice)}</div>
            <div className="fc-order-ticket__quote-label">Last Price</div>
          </div>
        </div>

        <Tabs value={side} onValueChange={(v) => setSide(v as OrderSide)}>
          <TabsList aria-label="Order side">
            <TabsTrigger value="buy">Buy {symbol}</TabsTrigger>
            <TabsTrigger value="sell">Sell {symbol}</TabsTrigger>
          </TabsList>
        </Tabs>

        <form className="fc-order-ticket__fields" onSubmit={handleSubmit}>
          <div className="fc-order-ticket__types" role="group" aria-label="Order type">
            {(["market", "limit", "stop"] as OrderType[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`fc-order-ticket__type-btn ${
                  orderType === type ? "fc-order-ticket__type-btn--active" : ""
                }`}
                aria-pressed={orderType === type}
                onClick={() => setOrderType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <Input
            label="Quantity (Shares)"
            type="text"
            inputMode="decimal"
            value={quantityInput}
            onChange={(e) => setQuantityInput(e.target.value)}
            onInput={(e) => setQuantityInput((e.target as HTMLInputElement).value)}
          />

          {orderType === "limit" && (
            <Input
              label={`Limit Price (${currency})`}
              type="text"
              inputMode="decimal"
              value={limitPriceInput}
              onChange={(e) => setLimitPriceInput(e.target.value)}
              onInput={(e) => setLimitPriceInput((e.target as HTMLInputElement).value)}
            />
          )}

          {orderType === "stop" && (
            <Input
              label={`Stop Price (${currency})`}
              type="text"
              inputMode="decimal"
              value={stopPriceInput}
              onChange={(e) => setStopPriceInput(e.target.value)}
              onInput={(e) => setStopPriceInput((e.target as HTMLInputElement).value)}
            />
          )}

          {insufficientFunds && (
            <Alert variant="error" title="Insufficient buying power">
              Available buying power is {formatMoney(buyingPower)}.
            </Alert>
          )}

          {insufficientShares && (
            <Alert variant="error" title="Insufficient shares">
              You have {availableShares} shares of {symbol} available to sell.
            </Alert>
          )}

          <div className="fc-order-ticket__summary">
            <div className="fc-order-ticket__row">
              <span className="fc-order-ticket__row-label">
                {side === "buy" ? "Buying Power" : "Available Shares"}
              </span>
              <Badge variant="default">
                {side === "buy" ? formatMoney(buyingPower) : `${availableShares} sh`}
              </Badge>
            </div>
            <div className="fc-order-ticket__row">
              <span className="fc-order-ticket__row-label">Estimated Fee</span>
              <span>{formatMoney(estimatedFee)}</span>
            </div>
            <div className="fc-order-ticket__row fc-order-ticket__row--total">
              <span>Estimated Total</span>
              <span>{formatMoney(estimatedTotal)}</span>
            </div>
          </div>

          <Button
            type="submit"
            variant={side === "buy" ? "primary" : "secondary"}
            disabled={isInvalid || submitting}
          >
            {submitting
              ? "Submitting..."
              : `Place ${side === "buy" ? "Buy" : "Sell"} Order`}
          </Button>
        </form>
      </div>
    );
  },
);

OrderEntryTicket.displayName = "OrderEntryTicket";
export default OrderEntryTicket;
