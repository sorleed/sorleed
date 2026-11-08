import React from "react";
import type { AssetAllocationProps } from "../types";

const DEFAULT_COLORS = [
  "#2563eb", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#64748b", // slate
];

export const AssetAllocation = React.forwardRef<HTMLDivElement, AssetAllocationProps>(
  (
    {
      title = "Asset Allocation",
      assets = [],
      totalValue,
      currency = "USD",
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-asset-allocation", className].filter(Boolean).join(" ");

    // Calculate sum of percentages or derive if amounts provided
    const totalPercentage = assets.reduce((sum, item) => sum + (item.percentage || 0), 0);

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Asset Allocation"}
        {...props}
      >
        <div className="fc-asset-allocation__header">
          <h3 className="fc-asset-allocation__title">{title}</h3>
          {totalValue !== undefined && (
            <span className="fc-asset-allocation__total">
              Total: {currency} {typeof totalValue === "number" ? totalValue.toLocaleString() : totalValue}
            </span>
          )}
        </div>

        {/* Multi-segmented distribution bar */}
        <div
          className="fc-asset-allocation__bar-track"
          role="progressbar"
          aria-label="Asset distribution"
          aria-valuenow={Math.min(100, Math.round(totalPercentage))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {assets.map((asset, index) => {
            const color = asset.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <div
                key={asset.id || asset.name}
                className="fc-asset-allocation__bar-segment"
                style={{
                  width: `${asset.percentage}%`,
                  backgroundColor: color,
                }}
                title={`${asset.name}: ${asset.percentage}%`}
              />
            );
          })}
        </div>

        {/* Breakdown table / list */}
        <div className="fc-asset-allocation__list" role="list">
          {assets.map((asset, index) => {
            const color = asset.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <div key={asset.id || asset.name} className="fc-asset-allocation__item" role="listitem">
                <div className="fc-asset-allocation__item-left">
                  <span
                    className="fc-asset-allocation__color-dot"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="fc-asset-allocation__item-label">{asset.name}</span>
                </div>
                <div className="fc-asset-allocation__item-right">
                  {asset.amount !== undefined && (
                    <span className="fc-asset-allocation__item-amount">
                      {currency} {typeof asset.amount === "number" ? asset.amount.toLocaleString() : asset.amount}
                    </span>
                  )}
                  <span className="fc-asset-allocation__item-pct">{asset.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

AssetAllocation.displayName = "AssetAllocation";

export default AssetAllocation;

