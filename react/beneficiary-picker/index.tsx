import React, { useMemo, useState } from "react";
import type { BeneficiaryPickerProps } from "../types";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export const BeneficiaryPicker = React.forwardRef<HTMLDivElement, BeneficiaryPickerProps>(
  (
    {
      title = "Select Recipient",
      beneficiaries,
      selectedId,
      searchable = true,
      onSelect,
      onAddNew,
      className,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState("");
    const [internalSelected, setInternalSelected] = useState<string | undefined>(selectedId);
    const activeId = selectedId !== undefined ? selectedId : internalSelected;

    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return beneficiaries;
      return beneficiaries.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.bankName.toLowerCase().includes(q) ||
          b.rail.toLowerCase().includes(q) ||
          b.accountMask.toLowerCase().includes(q),
      );
    }, [beneficiaries, query]);

    const handleSelect = (b: (typeof beneficiaries)[number]) => {
      if (selectedId === undefined) setInternalSelected(b.id);
      onSelect?.(b);
    };

    return (
      <div
        ref={ref}
        className={["fc-beneficiary-picker", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className="fc-beneficiary-picker__header">
          <h3 className="fc-beneficiary-picker__title">{title}</h3>
          {onAddNew && (
            <button
              type="button"
              className="fc-beneficiary-picker__add-btn"
              onClick={onAddNew}
            >
              + New Recipient
            </button>
          )}
        </div>

        {searchable && (
          <div className="fc-beneficiary-picker__search-wrap">
            <svg
              className="fc-beneficiary-picker__search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className="fc-beneficiary-picker__search"
              placeholder="Search name, bank, or rail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search beneficiaries"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="fc-beneficiary-picker__empty">No matching recipients found.</div>
        ) : (
          <ul className="fc-beneficiary-picker__list" role="listbox" aria-label="Recipients">
            {filtered.map((b) => {
              const isSelected = activeId === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      "fc-beneficiary-picker__item",
                      isSelected ? "fc-beneficiary-picker__item--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSelect(b)}
                  >
                    <div className="fc-beneficiary-picker__left">
                      <span className="fc-beneficiary-picker__avatar" aria-hidden="true">
                        {getInitials(b.name)}
                      </span>
                      <div className="fc-beneficiary-picker__info">
                        <div className="fc-beneficiary-picker__name">{b.name}</div>
                        <div className="fc-beneficiary-picker__meta">
                          {b.bankName} · {b.accountMask}
                          {b.currency ? ` · ${b.currency}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="fc-beneficiary-picker__right">
                      <span className="fc-beneficiary-picker__rail">{b.rail}</span>
                      {b.verificationStatus && (
                        <span
                          className={`fc-beneficiary-picker__status fc-beneficiary-picker__status--${b.verificationStatus}`}
                        >
                          {b.verificationStatus === "verified" ? "CoP Verified" : "Pending Check"}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);

BeneficiaryPicker.displayName = "BeneficiaryPicker";
export default BeneficiaryPicker;

