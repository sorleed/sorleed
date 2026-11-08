import React from "react";
import type { CreditScoreGaugeProps, CreditScoreBand } from "../types";

export const CreditScoreGauge = React.forwardRef<HTMLDivElement, CreditScoreGaugeProps>(
  (
    {
      score = 720,
      minScore = 300,
      maxScore = 850,
      lastUpdated,
      className,
      ...props
    },
    ref,
  ) => {
    // Determine credit rating band
    const getBand = (val: number): { band: CreditScoreBand; label: string; color: string } => {
      if (val >= 750) return { band: "excellent", label: "Excellent", color: "var(--fc-color-status-success)" };
      if (val >= 670) return { band: "good", label: "Good", color: "var(--fc-blue-600)" };
      if (val >= 580) return { band: "fair", label: "Fair", color: "var(--fc-color-status-warning)" };
      return { band: "poor", label: "Poor", color: "var(--fc-color-status-error)" };
    };

    const rating = getBand(score);

    // Compute stroke percentage on semi-circle (circumference = PI * r)
    // Radius = 90, half perimeter = 3.14159 * 90 ≈ 283
    const radius = 90;
    const arcLength = Math.PI * radius;
    const clampedScore = Math.max(minScore, Math.min(maxScore, score));
    const percentage = (clampedScore - minScore) / (maxScore - minScore);
    const strokeDashoffset = arcLength * (1 - percentage);

    const classes = ["fc-credit-score-gauge", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Credit Score Gauge" {...props}>
        <div className="fc-credit-score-gauge__header">
          <h3 className="fc-credit-score-gauge__title">Credit Score Health</h3>
          <p className="fc-credit-score-gauge__subtitle">FICO & VantageScore 3.0 Model</p>
        </div>

        <div className="fc-credit-score-gauge__dial">
          <svg className="fc-credit-score-gauge__meter-svg" viewBox="0 0 220 220">
            {/* Background semi-circle track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="var(--fc-color-surface-muted)"
              strokeWidth="16"
              strokeDasharray={`${arcLength} ${arcLength * 2}`}
            />
            {/* Active gauge arc */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={rating.color}
              strokeWidth="16"
              strokeDasharray={`${arcLength} ${arcLength * 2}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.8s ease" }}
            />
          </svg>

          <div className="fc-credit-score-gauge__value-container">
            <span className="fc-credit-score-gauge__score">{clampedScore}</span>
            <span className="fc-credit-score-gauge__range">out of {maxScore}</span>
          </div>
        </div>

        <span className={`fc-credit-score-gauge__rating-pill fc-credit-score-gauge__rating-pill--${rating.band}`}>
          {rating.label}
        </span>

        {lastUpdated && (
          <p className="fc-credit-score-gauge__updated">Last updated: {lastUpdated}</p>
        )}
      </div>
    );
  },
);

CreditScoreGauge.displayName = "CreditScoreGauge";
export default CreditScoreGauge;
