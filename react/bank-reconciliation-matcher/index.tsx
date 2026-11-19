import React, { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import type { BankReconciliationMatcherProps } from "../types";

export const BankReconciliationMatcher = React.forwardRef<
  HTMLDivElement,
  BankReconciliationMatcherProps
>(
  (
    {
      title = "Bank Reconciliation",
      currency = "USD",
      bankEntries,
      ledgerEntries,
      onMatch,
      onUnmatch,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
    const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);
    const [localMatches, setLocalMatches] = useState<Record<string, string>>(() => {
      const initial: Record<string, string> = {};
      for (const entry of bankEntries) {
        if (entry.matchedWithId) {
          initial[entry.id] = entry.matchedWithId;
        }
      }
      return initial;
    });

    const matchedLedgerIds = new Set(Object.values(localMatches));
    const matchedCount = Object.keys(localMatches).length;
    const unmatchedCount = Math.max(0, bankEntries.length - matchedCount);

    const selectedBank = bankEntries.find((b) => b.id === selectedBankId) || null;
    const selectedLedger = ledgerEntries.find((l) => l.id === selectedLedgerId) || null;
    const discrepancy =
      selectedBank && selectedLedger
        ? Math.abs(selectedBank.amount - selectedLedger.amount)
        : null;

    const formatMoney = (val: number) =>
      `${val < 0 ? "-" : ""}${currency} ${Math.abs(val).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const handleMatch = () => {
      if (!selectedBankId || !selectedLedgerId) return;
      setLocalMatches((prev) => ({ ...prev, [selectedBankId]: selectedLedgerId }));
      onMatch?.(selectedBankId, selectedLedgerId);
      setSelectedBankId(null);
      setSelectedLedgerId(null);
    };

    const handleUnmatch = (bankId: string) => {
      const ledgerId = localMatches[bankId];
      if (!ledgerId) return;
      setLocalMatches((prev) => {
        const next = { ...prev };
        delete next[bankId];
        return next;
      });
      onUnmatch?.(bankId, ledgerId);
    };

    const classes = ["fc-bank-reconciliation", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Bank Reconciliation Matcher"}
        {...props}
      >
        <div className="fc-bank-reconciliation__header">
          <h3 className="fc-bank-reconciliation__title">{title}</h3>
          <div className="fc-bank-reconciliation__stats">
            <Badge variant="success">{matchedCount} Matched</Badge>
            <Badge variant={unmatchedCount > 0 ? "warning" : "default"}>
              {unmatchedCount} Unmatched
            </Badge>
          </div>
        </div>

        <div className="fc-bank-reconciliation__grid">
          <div className="fc-bank-reconciliation__column">
            <h4 className="fc-bank-reconciliation__col-title">Bank Statement Feed</h4>
            {bankEntries.map((entry) => {
              const isMatched = Boolean(localMatches[entry.id]);
              const isSelected = selectedBankId === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  className={[
                    "fc-bank-reconciliation__row",
                    isMatched ? "fc-bank-reconciliation__row--matched" : "",
                    isSelected ? "fc-bank-reconciliation__row--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (isMatched) {
                      handleUnmatch(entry.id);
                    } else {
                      setSelectedBankId(isSelected ? null : entry.id);
                    }
                  }}
                >
                  <div>
                    <div className="fc-bank-reconciliation__desc">{entry.description}</div>
                    <div className="fc-bank-reconciliation__meta">
                      {entry.date}
                      {entry.reference ? ` · ${entry.reference}` : ""}
                      {isMatched ? " · Matched (click to unmatch)" : ""}
                    </div>
                  </div>
                  <span className="fc-bank-reconciliation__amount">
                    {formatMoney(entry.amount)}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="fc-bank-reconciliation__column">
            <h4 className="fc-bank-reconciliation__col-title">General Ledger Entries</h4>
            {ledgerEntries.map((entry) => {
              const isMatched = matchedLedgerIds.has(entry.id);
              const isSelected = selectedLedgerId === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  disabled={isMatched}
                  className={[
                    "fc-bank-reconciliation__row",
                    isMatched ? "fc-bank-reconciliation__row--matched" : "",
                    isSelected ? "fc-bank-reconciliation__row--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedLedgerId(isSelected ? null : entry.id)}
                >
                  <div>
                    <div className="fc-bank-reconciliation__desc">{entry.description}</div>
                    <div className="fc-bank-reconciliation__meta">
                      {entry.date}
                      {entry.reference ? ` · ${entry.reference}` : ""}
                    </div>
                  </div>
                  <span className="fc-bank-reconciliation__amount">
                    {formatMoney(entry.amount)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="fc-bank-reconciliation__toolbar">
          <div>
            {discrepancy !== null && discrepancy > 0 ? (
              <span className="fc-bank-reconciliation__discrepancy">
                Discrepancy detected: {formatMoney(discrepancy)}
              </span>
            ) : selectedBank && selectedLedger ? (
              <Badge variant="success">Exact amount match</Badge>
            ) : (
              <span className="fc-bank-reconciliation__meta">
                Select one bank item and one ledger item to match
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="primary"
            disabled={!selectedBankId || !selectedLedgerId}
            onClick={handleMatch}
          >
            Match Selected
          </Button>
        </div>
      </div>
    );
  },
);

BankReconciliationMatcher.displayName = "BankReconciliationMatcher";
export default BankReconciliationMatcher;

