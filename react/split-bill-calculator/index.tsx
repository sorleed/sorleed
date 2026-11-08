import React, { useState } from "react";
import { Currency } from "../currency";
import { Avatar } from "../avatar";
import { Button } from "../button";
import type { SplitBillCalculatorProps } from "../types";

const TIP_OPTIONS = [0, 10, 15, 20];

export const SplitBillCalculator = React.forwardRef<HTMLDivElement, SplitBillCalculatorProps>(
  (
    {
      initialBill = 120,
      currency = "USD",
      initialParticipants = [
        { id: "1", name: "You" },
        { id: "2", name: "Sarah" },
        { id: "3", name: "David" },
      ],
      onRequestPayment,
      className,
      ...props
    },
    ref,
  ) => {
    const [billAmount, setBillAmount] = useState<number>(initialBill);
    const [tipPercent, setTipPercent] = useState<number>(15);
    const [participants, setParticipants] = useState(initialParticipants);

    const tipAmount = (billAmount * tipPercent) / 100;
    const totalAmount = billAmount + tipAmount;
    const perPersonShare = participants.length > 0 ? totalAmount / participants.length : 0;

    const classes = ["fc-split-bill", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label="Split Bill Calculator"
        {...props}
      >
        <div className="fc-split-bill__header">
          <h3 className="fc-split-bill__title">Split Bill</h3>
          <span style={{ fontSize: "12px", color: "var(--fc-color-text-secondary)" }}>
            {participants.length} People
          </span>
        </div>

        {/* Hero per-person breakdown */}
        <div className="fc-split-bill__hero-total">
          <div className="fc-split-bill__hero-label">Each Person Pays</div>
          <div className="fc-split-bill__hero-amount">
            {currency} {perPersonShare.toFixed(2)}
          </div>
        </div>

        {/* Total Bill Input */}
        <div>
          <Currency
            label="Total Bill Amount"
            value={billAmount}
            onChange={(val) => setBillAmount(Number(val) || 0)}
            suffix={currency}
          />
        </div>

        {/* Tip Selector */}
        <div>
          <span style={{ fontSize: "14px", fontWeight: 600, display: "block", marginBottom: "8px" }}>
            Add Tip ({tipPercent}%)
          </span>
          <div className="fc-split-bill__tips" role="radiogroup" aria-label="Tip Percentage">
            {TIP_OPTIONS.map((tip) => (
              <button
                key={tip}
                type="button"
                className={`fc-split-bill__tip-btn ${
                  tipPercent === tip ? "fc-split-bill__tip-btn--selected" : ""
                }`}
                onClick={() => setTipPercent(tip)}
                role="radio"
                aria-checked={tipPercent === tip}
                aria-label={`${tip}% Tip`}
              >
                {tip === 0 ? "No Tip" : `${tip}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Participants list */}
        <div className="fc-split-bill__participants" role="list" aria-label="Bill Participants">
          {participants.map((person) => (
            <div key={person.id} className="fc-split-bill__participant-row" role="listitem">
              <div className="fc-split-bill__participant-info">
                <Avatar name={person.name} size="sm" />
                <span className="fc-split-bill__participant-name">{person.name}</span>
              </div>
              <span className="fc-split-bill__participant-share">
                {currency} {perPersonShare.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {onRequestPayment && (
          <Button
            variant="primary"
            onClick={() =>
              onRequestPayment({
                totalAmount,
                perPersonShare,
                participants,
              })
            }
          >
            Send Split Payment Requests
          </Button>
        )}
      </div>
    );
  },
);

SplitBillCalculator.displayName = "SplitBillCalculator";

export default SplitBillCalculator;

