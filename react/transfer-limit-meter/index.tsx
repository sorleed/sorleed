import React from "react";
import type { TransferLimitMeterProps } from "../types";
import { formatMoney } from "../utils/format";

export const TransferLimitMeter = React.forwardRef<HTMLDivElement, TransferLimitMeterProps>(
  ({ title = "Transfer & Withdrawal Limits", limits, onRequestIncrease, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={["fc-transfer-limit", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-transfer-limit__header">
          <h3 className="fc-transfer-limit__title">{title}</h3>
        </div>

        <div className="fc-transfer-limit__list">
          {limits.map((item) => {
            const currency = item.currency ?? "USD";
            const safeMax = item.max > 0 ? item.max : 1;
            const pct = Math.min(100, Math.max(0, (item.used / safeMax) * 100));
            const remaining = Math.max(0, item.max - item.used);
            const statusClass =
              pct >= 100
                ? "fc-transfer-limit__fill--exceeded"
                : pct >= 80
                  ? "fc-transfer-limit__fill--warning"
                  : "";

            return (
              <div key={item.id} className="fc-transfer-limit__item">
                <div className="fc-transfer-limit__row-top">
                  <div className="fc-transfer-limit__label-group">
                    <span className="fc-transfer-limit__label">{item.label}</span>
                    {item.rail && <span className="fc-transfer-limit__rail">{item.rail}</span>}
                  </div>
                  <span className="fc-transfer-limit__amounts">
                    {formatMoney(item.used, { currency })} /{" "}
                    {formatMoney(item.max, { currency })}
                  </span>
                </div>

                <div
                  className="fc-transfer-limit__track"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label} utilization`}
                >
                  <div
                    className={["fc-transfer-limit__fill", statusClass].filter(Boolean).join(" ")}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="fc-transfer-limit__row-bottom">
                  <span className="fc-transfer-limit__remaining">
                    {formatMoney(remaining, { currency })} remaining
                    {item.resetText ? ` · ${item.resetText}` : ""}
                  </span>
                  {onRequestIncrease && (
                    <button
                      type="button"
                      className="fc-transfer-limit__increase-btn"
                      onClick={() => onRequestIncrease(item.id)}
                    >
                      Request increase
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

TransferLimitMeter.displayName = "TransferLimitMeter";
export default TransferLimitMeter;
