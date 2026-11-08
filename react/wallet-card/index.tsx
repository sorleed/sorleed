import React, { useState } from "react";
import type { WalletCardProps } from "../types";

export const WalletCard = React.forwardRef<HTMLDivElement, WalletCardProps>(
  (
    {
      brand = "visa",
      cardNumber,
      cardHolder,
      expiry,
      cvv,
      isFlipped: controlledFlipped,
      onFlip,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalFlipped, setInternalFlipped] = useState(false);
    const isControlled = controlledFlipped !== undefined;
    const flipped = isControlled ? controlledFlipped : internalFlipped;

    const handleToggleFlip = () => {
      const next = !flipped;
      if (!isControlled) setInternalFlipped(next);
      onFlip?.(next);
    };

    const formattedNumber = cardNumber
      ? cardNumber.replace(/\s+/g, "").replace(/(\d{4})/g, "$1 ").trim()
      : "•••• •••• •••• ••••";

    return (
      <div className={`fc-wallet-card-container ${className || ""}`} ref={ref} {...props}>
        <div
          className={`fc-wallet-card ${flipped ? "fc-wallet-card--flipped" : ""}`}
          onClick={handleToggleFlip}
          role="button"
          tabIndex={0}
          aria-label={`Virtual card ending in ${cardNumber.slice(-4) || "card"}. Click to flip.`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleFlip();
            }
          }}
        >
          {/* Card Front */}
          <div className="fc-wallet-card__front">
            <div className="fc-wallet-card__top">
              <div className="fc-wallet-card__chip" aria-hidden="true" />
              <div className="fc-wallet-card__brand" aria-label={brand}>
                {brand.toUpperCase()}
              </div>
            </div>

            <div className="fc-wallet-card__number">{formattedNumber}</div>

            <div className="fc-wallet-card__bottom">
              <div className="fc-wallet-card__holder">
                <span className="fc-wallet-card__label">Cardholder</span>
                <span className="fc-wallet-card__name">
                  {(cardHolder || "VALUED CARDHOLDER").toUpperCase()}
                </span>
              </div>
              <div className="fc-wallet-card__expiry">
                <span className="fc-wallet-card__label">Expires</span>
                <span className="fc-wallet-card__expiry-val">{expiry || "MM/YY"}</span>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="fc-wallet-card__back">
            <div className="fc-wallet-card__magnetic-strip" />
            <div className="fc-wallet-card__cvv-row">
              <div className="fc-wallet-card__signature" />
              <div className="fc-wallet-card__cvv" aria-label={`CVV ${cvv}`}>
                {cvv || "•••"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

WalletCard.displayName = "WalletCard";
export default WalletCard;
