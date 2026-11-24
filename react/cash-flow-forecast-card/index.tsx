import React, { useState } from "react";
import { Badge } from "../badge";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { CashFlowForecastCardProps, CashFlowHorizon } from "../types";

const HORIZONS: CashFlowHorizon[] = ["30D", "60D", "90D"];

export const CashFlowForecastCard = React.forwardRef<HTMLDivElement, CashFlowForecastCardProps>(
  (
    {
      title = "Cash Flow Forecast",
      currency = "USD",
      startingCash,
      monthlyBurnRate,
      horizon: controlledHorizon,
      defaultHorizon = "90D",
      onHorizonChange,
      periods,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledHorizon, setUncontrolledHorizon] =
      useState<CashFlowHorizon>(defaultHorizon);
    const activeHorizon = controlledHorizon ?? uncontrolledHorizon;

    const handleHorizonChange = (next: string) => {
      const h = next as CashFlowHorizon;
      if (controlledHorizon === undefined) {
        setUncontrolledHorizon(h);
      }
      onHorizonChange?.(h);
    };

    const totalInflows = periods.reduce((acc, p) => acc + p.inflows, 0);
    const totalOutflows = periods.reduce((acc, p) => acc + p.outflows, 0);
    const endingCash = startingCash + totalInflows - totalOutflows;
    const runwayMonths =
      monthlyBurnRate > 0 ? Math.round((endingCash / monthlyBurnRate) * 10) / 10 : Infinity;

    const maxFlow = Math.max(
      1,
      ...periods.flatMap((p) => [p.inflows, p.outflows]),
    );

    const formatMoney = (val: number) =>
      `${val < 0 ? "-" : ""}${currency} ${Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

    const runwayBadgeVariant =
      runwayMonths === Infinity || runwayMonths >= 12
        ? "success"
        : runwayMonths >= 6
          ? "warning"
          : "error";

    const classes = ["fc-cash-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Cash Flow Forecast"}
        {...props}
      >
        <div className="fc-cash-flow__header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="fc-cash-flow__title">{title}</h3>
            <Badge variant={runwayBadgeVariant}>
              {runwayMonths === Infinity ? "Cash Positive" : `${runwayMonths} mo runway`}
            </Badge>
          </div>
          <Tabs value={activeHorizon} onValueChange={handleHorizonChange}>
            <TabsList aria-label="Forecast horizon">
              {HORIZONS.map((h) => (
                <TabsTrigger key={h} value={h}>
                  {h}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="fc-cash-flow__kpis">
          <div className="fc-cash-flow__kpi">
            <span className="fc-cash-flow__kpi-label">Projected Ending Cash</span>
            <span className="fc-cash-flow__kpi-value">{formatMoney(endingCash)}</span>
          </div>
          <div className="fc-cash-flow__kpi">
            <span className="fc-cash-flow__kpi-label">Expected Receivables</span>
            <span className="fc-cash-flow__kpi-value">+{formatMoney(totalInflows)}</span>
          </div>
          <div className="fc-cash-flow__kpi">
            <span className="fc-cash-flow__kpi-label">Scheduled Payables</span>
            <span className="fc-cash-flow__kpi-value">-{formatMoney(totalOutflows)}</span>
          </div>
        </div>

        <div className="fc-cash-flow__periods">
          {periods.map((period) => {
            const inflowPct = Math.min(100, (period.inflows / maxFlow) * 100);
            const outflowPct = Math.min(100, (period.outflows / maxFlow) * 100);
            const net = period.inflows - period.outflows;
            return (
              <div key={period.label} className="fc-cash-flow__period">
                <div className="fc-cash-flow__period-head">
                  <span className="fc-cash-flow__period-label">{period.label}</span>
                  <span>
                    Net: {net >= 0 ? "+" : ""}
                    {formatMoney(net)}
                  </span>
                </div>
                <div className="fc-cash-flow__bars">
                  <div className="fc-cash-flow__bar-track" title={`Inflows: ${formatMoney(period.inflows)}`}>
                    <div className="fc-cash-flow__bar-inflow" style={{ width: `${inflowPct}%` }} />
                  </div>
                  <div className="fc-cash-flow__bar-track" title={`Outflows: ${formatMoney(period.outflows)}`}>
                    <div className="fc-cash-flow__bar-outflow" style={{ width: `${outflowPct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CashFlowForecastCard.displayName = "CashFlowForecastCard";
export default CashFlowForecastCard;

