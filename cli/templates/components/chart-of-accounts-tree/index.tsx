import React, { useState } from "react";
import type { ChartOfAccountsTreeProps, ChartAccountNode } from "../types";

export const ChartOfAccountsTree = React.forwardRef<HTMLDivElement, ChartOfAccountsTreeProps>(
  (
    {
      title = "Chart of Accounts",
      currency = "USD",
      accounts = [
        {
          code: "1000",
          name: "Assets",
          balance: 245000,
          children: [
            { code: "1010", name: "Operating Cash Account", balance: 180000 },
            { code: "1020", name: "Accounts Receivable", balance: 65000 },
          ],
        },
        {
          code: "2000",
          name: "Liabilities",
          balance: 45000,
          children: [
            { code: "2010", name: "Accounts Payable", balance: 35000 },
            { code: "2020", name: "Accrued Payroll", balance: 10000 },
          ],
        },
        {
          code: "3000",
          name: "Equity",
          balance: 200000,
          children: [
            { code: "3010", name: "Retained Earnings", balance: 200000 },
          ],
        },
      ],
      onSelectAccount,
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedCodes, setExpandedCodes] = useState<string[]>(["1000", "2000", "3000"]);

    const toggleExpand = (code: string) => {
      setExpandedCodes((prev) =>
        prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
      );
    };

    const renderNode = (node: ChartAccountNode, depth = 0) => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedCodes.includes(node.code);

      return (
        <React.Fragment key={node.code}>
          <div
            className="fc-chart-accounts__item"
            style={{ paddingLeft: `${depth * 20 + 8}px` }}
            onClick={() => onSelectAccount?.(node)}
            role="treeitem"
            aria-expanded={hasChildren ? isExpanded : undefined}
            tabIndex={0}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(node.code);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 4px",
                    marginRight: "4px",
                    color: "var(--fc-color-text-secondary)",
                  }}
                  aria-label={isExpanded ? `Collapse ${node.name}` : `Expand ${node.name}`}
                >
                  {isExpanded ? "▼" : "▶"}
                </button>
              )}
              <span className="fc-chart-accounts__code">{node.code}</span>
              <span style={{ fontWeight: depth === 0 ? 600 : 400 }}>{node.name}</span>
            </div>
            <span className="fc-chart-accounts__balance">
              {currency} {typeof node.balance === "number" ? node.balance.toLocaleString() : node.balance}
            </span>
          </div>

          {hasChildren && isExpanded && (
            <div role="group">
              {node.children!.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </React.Fragment>
      );
    };

    const classes = ["fc-chart-accounts", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Chart of Accounts"}
        {...props}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>{title}</h3>
          <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
            General Ledger Hierarchy
          </span>
        </div>

        <div className="fc-chart-accounts__list" role="tree" aria-label="Accounts Tree">
          {accounts.map((acc) => renderNode(acc, 0))}
        </div>
      </div>
    );
  },
);

ChartOfAccountsTree.displayName = "ChartOfAccountsTree";

export default ChartOfAccountsTree;

