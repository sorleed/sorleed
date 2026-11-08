import React from "react";
import type { CurrencyExchangeProps } from "../types";

export const CurrencyExchange = React.forwardRef<HTMLDivElement, CurrencyExchangeProps>(
  (
    {
      baseCurrency,
      targetCurrency,
      baseAmount = "",
      targetAmount = "",
      exchangeRate,
      availableCurrencies = ["USD", "EUR", "GBP", "NGN", "CAD", "GHS", "KES"],
      onBaseAmountChange,
      onTargetAmountChange,
      onSwapCurrencies,
      onBaseCurrencyChange,
      onTargetCurrencyChange,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-currency-exchange", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Currency Exchange Calculator" {...props}>
        {/* Base Currency Box (You Pay) */}
        <div className="fc-currency-exchange__box">
          <div className="fc-currency-exchange__box-header">
            <span>You Send</span>
          </div>
          <div className="fc-currency-exchange__box-input-row">
            <input
              type="text"
              inputMode="decimal"
              value={baseAmount}
              onChange={(e) => onBaseAmountChange?.(e.target.value)}
              onInput={(e) => onBaseAmountChange?.((e.target as HTMLInputElement).value)}
              placeholder="0.00"
              aria-label={`Send amount in ${baseCurrency}`}
              className="fc-currency-exchange__input"
            />
            <select
              value={baseCurrency}
              onChange={(e) => onBaseCurrencyChange?.(e.target.value)}
              aria-label="Send currency"
              className="fc-currency-exchange__currency-select"
            >
              {availableCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Action */}
        <div className="fc-currency-exchange__swap-divider">
          <button
            type="button"
            className="fc-currency-exchange__swap-button"
            onClick={onSwapCurrencies}
            aria-label={`Swap ${baseCurrency} and ${targetCurrency}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </div>

        {/* Target Currency Box (Recipient Gets) */}
        <div className="fc-currency-exchange__box">
          <div className="fc-currency-exchange__box-header">
            <span>Recipient Gets</span>
          </div>
          <div className="fc-currency-exchange__box-input-row">
            <input
              type="text"
              inputMode="decimal"
              value={targetAmount}
              onChange={(e) => onTargetAmountChange?.(e.target.value)}
              onInput={(e) => onTargetAmountChange?.((e.target as HTMLInputElement).value)}
              placeholder="0.00"
              aria-label={`Recipient receives in ${targetCurrency}`}
              className="fc-currency-exchange__input"
            />
            <select
              value={targetCurrency}
              onChange={(e) => onTargetCurrencyChange?.(e.target.value)}
              aria-label="Recipient currency"
              className="fc-currency-exchange__currency-select"
            >
              {availableCurrencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rate Notice */}
        <div className="fc-currency-exchange__rate-ticker">
          <span>Live Guaranteed Rate</span>
          <span style={{ fontWeight: 600 }}>
            1 {baseCurrency} = {exchangeRate} {targetCurrency}
          </span>
        </div>
      </div>
    );
  },
);

CurrencyExchange.displayName = "CurrencyExchange";
export default CurrencyExchange;
