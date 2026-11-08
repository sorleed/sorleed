import React from "react";
import type { YieldCurveTableProps } from "../types";

export const YieldCurveTable = React.forwardRef<HTMLDivElement, YieldCurveTableProps>(
  (
    {
      title = "Treasury Yield Curve & Maturities",
      asOfDate,
      rates = [
        { tenor: "1 Month", yieldPercent: 5.28, changeBps: 2, instrument: "T-Bill" },
        { tenor: "3 Month", yieldPercent: 5.34, changeBps: -1, instrument: "T-Bill" },
        { tenor: "6 Month", yieldPercent: 5.12, changeBps: 0, instrument: "T-Bill" },
        { tenor: "1 Year", yieldPercent: 4.88, changeBps: -4, instrument: "T-Bill" },
        { tenor: "2 Year", yieldPercent: 4.25, changeBps: -8, instrument: "T-Note" },
        { tenor: "5 Year", yieldPercent: 4.10, changeBps: -5, instrument: "T-Note" },
        { tenor: "10 Year", yieldPercent: 4.20, changeBps: 3, instrument: "T-Bond" },
        { tenor: "30 Year", yieldPercent: 4.45, changeBps: 1, instrument: "T-Bond" },
      ],
      onSelectTenor,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-yield-curve", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Treasury Yield Curve"}
        {...props}
      >
        <div className="fc-yield-curve__header">
          <h3 className="fc-yield-curve__title">{title}</h3>
          {asOfDate && (
            <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
              As of: {asOfDate}
            </span>
          )}
        </div>

        <div className="fc-yield-curve__table-wrap">
          <table className="fc-yield-curve__table" role="table">
            <thead>
              <tr>
                <th className="fc-yield-curve__th">Tenor</th>
                <th className="fc-yield-curve__th">Instrument</th>
                <th className="fc-yield-curve__th">Yield (APY)</th>
                <th className="fc-yield-curve__th">Change</th>
                {onSelectTenor && <th className="fc-yield-curve__th">Action</th>}
              </tr>
            </thead>
            <tbody>
              {rates.map((item) => (
                <tr key={item.tenor}>
                  <td className="fc-yield-curve__td" style={{ fontWeight: 600 }}>
                    {item.tenor}
                  </td>
                  <td className="fc-yield-curve__td">{item.instrument || "Govt Bond"}</td>
                  <td className="fc-yield-curve__td">
                    <span className="fc-yield-curve__rate">{item.yieldPercent.toFixed(2)}%</span>
                  </td>
                  <td className="fc-yield-curve__td">
                    {item.changeBps !== undefined ? (
                      <span
                        style={{
                          color:
                            item.changeBps > 0
                              ? "var(--fc-color-success, #10b981)"
                              : item.changeBps < 0
                              ? "var(--fc-color-danger, #ef4444)"
                              : "inherit",
                          fontWeight: 500,
                        }}
                      >
                        {item.changeBps > 0 ? `+${item.changeBps}` : item.changeBps} bps
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  {onSelectTenor && (
                    <td className="fc-yield-curve__td">
                      <button
                        type="button"
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          backgroundColor: "var(--fc-color-primary)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => onSelectTenor(item)}
                        aria-label={`Invest in ${item.tenor} treasury`}
                      >
                        Invest
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

YieldCurveTable.displayName = "YieldCurveTable";

export default YieldCurveTable;

