import React, { useState, useMemo } from "react";
import type { BankSelectorProps, BankInstitution } from "../types";

export const BankSelector = React.forwardRef<HTMLDivElement, BankSelectorProps>(
  (
    {
      banks = [],
      selectedBankId,
      onSelectBank,
      placeholder = "Search banks...",
      emptyMessage = "No banks found",
      className,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState("");

    const filteredBanks = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return banks;
      return banks.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.code.toLowerCase().includes(q),
      );
    }, [banks, query]);

    const classes = ["fc-bank-selector", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        <div className="fc-bank-selector__search-container">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="fc-bank-selector__search-input"
          />
        </div>

        <ul className="fc-bank-selector__list" role="listbox" aria-label="Banks">
          {filteredBanks.length === 0 ? (
            <li className="fc-bank-selector__empty" role="presentation">
              {emptyMessage}
            </li>
          ) : (
            filteredBanks.map((bank) => {
              const isSelected = bank.id === selectedBankId;
              return (
                <li key={bank.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`fc-bank-selector__item ${isSelected ? "fc-bank-selector__item--selected" : ""}`}
                    onClick={() => onSelectBank?.(bank)}
                  >
                    <div className="fc-bank-selector__item-info">
                      <div className="fc-bank-selector__bank-icon" aria-hidden="true">
                        {bank.logo ? (
                          <img
                            src={bank.logo}
                            alt=""
                            style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
                          />
                        ) : (
                          bank.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="fc-bank-selector__bank-name">{bank.name}</span>
                    </div>
                    <span className="fc-bank-selector__bank-code">{bank.code}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  },
);

BankSelector.displayName = "BankSelector";
export default BankSelector;
