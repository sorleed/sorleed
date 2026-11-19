import React, { useState } from "react";
import { Badge } from "../badge";
import { Tabs, TabsList, TabsTrigger } from "../tabs";
import type { PerformanceChartCardProps, PerformanceTimeframe } from "../types";

const TIMEFRAMES: PerformanceTimeframe[] = ["1D", "1W", "1M", "1Y", "ALL"];

export const PerformanceChartCard = React.forwardRef<HTMLDivElement, PerformanceChartCardProps>(
  (
    {
      symbol,
      name,
      currentPrice,
      timeframe: controlledTimeframe,
      defaultTimeframe = "1M",
      onTimeframeChange,
      returnPercent,
      returnAmount,
      currency = "USD",
      benchmarkName,
      benchmarkReturn,
      dataPoints,
      className,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledTimeframe, setUncontrolledTimeframe] =
      useState<PerformanceTimeframe>(defaultTimeframe);
    const activeTimeframe = controlledTimeframe ?? uncontrolledTimeframe;

    const handleTimeframeChange = (next: string) => {
      const tf = next as PerformanceTimeframe;
      if (controlledTimeframe === undefined) {
        setUncontrolledTimeframe(tf);
      }
      onTimeframeChange?.(tf);
    };

    const isPositive = returnPercent >= 0;
    const tone = isPositive ? "positive" : "negative";

    const width = 320;
    const height = 112;
    const values = dataPoints.map((pt) => pt.value);
    const minVal = values.length > 0 ? Math.min(...values) : 0;
    const maxVal = values.length > 0 ? Math.max(...values) : 1;
    const range = maxVal - minVal || 1;

    const coords = dataPoints.map((pt, idx) => {
      const x = dataPoints.length > 1 ? (idx / (dataPoints.length - 1)) * width : width / 2;
      const y = height - ((pt.value - minVal) / range) * (height - 16) - 8;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const linePath = coords.length > 0 ? `M ${coords.join(" L ")}` : "";
    const areaPath =
      coords.length > 1 ? `${linePath} L ${width},${height} L 0,${height} Z` : "";

    const formatMoney = (val: number) =>
      `${currency} ${Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const classes = ["fc-performance-chart", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={`${symbol} performance chart (${activeTimeframe})`}
        {...props}
      >
        <div className="fc-performance-chart__header">
          <div className="fc-performance-chart__identity">
            <div className="fc-performance-chart__symbol-row">
              <span className="fc-performance-chart__symbol">{symbol}</span>
              <Badge variant={isPositive ? "success" : "error"}>
                {isPositive ? "+" : ""}
                {returnPercent.toFixed(2)}%
              </Badge>
            </div>
            <span className="fc-performance-chart__name">{name}</span>
          </div>

          <Tabs value={activeTimeframe} onValueChange={handleTimeframeChange}>
            <TabsList aria-label="Performance timeframe">
              {TIMEFRAMES.map((tf) => (
                <TabsTrigger key={tf} value={tf}>
                  {tf}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="fc-performance-chart__metrics">
          {currentPrice !== undefined && (
            <span className="fc-performance-chart__price">{formatMoney(currentPrice)}</span>
          )}
          <span className={`fc-performance-chart__return fc-performance-chart__return--${tone}`}>
            {isPositive ? "+" : "-"}
            {formatMoney(returnAmount)} ({activeTimeframe})
          </span>
        </div>

        <div className="fc-performance-chart__canvas">
          <svg
            className="fc-performance-chart__svg"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`${symbol} price series over ${activeTimeframe}`}
          >
            {areaPath && (
              <path
                d={areaPath}
                className={`fc-performance-chart__area--${tone}`}
                opacity="0.45"
              />
            )}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`fc-performance-chart__line--${tone}`}
              />
            )}
          </svg>
        </div>

        <div className="fc-performance-chart__footer">
          <span>
            {dataPoints.length > 0
              ? `${dataPoints[0].label} — ${dataPoints[dataPoints.length - 1].label}`
              : "No data points"}
          </span>
          {benchmarkName && benchmarkReturn !== undefined && (
            <span className="fc-performance-chart__benchmark">
              <span>vs {benchmarkName}:</span>
              <strong>
                {benchmarkReturn >= 0 ? "+" : ""}
                {benchmarkReturn.toFixed(2)}%
              </strong>
            </span>
          )}
        </div>
      </div>
    );
  },
);

PerformanceChartCard.displayName = "PerformanceChartCard";
export default PerformanceChartCard;
