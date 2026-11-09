import React, { useState } from "react";
import { WalletCard } from "../wallet-card";
import { Input } from "../input";
import { Switch } from "../switch";
import { Button } from "../button";
import type { VirtualCardGeneratorProps } from "../types";

const THEMES = [
  { id: "dark", label: "Midnight Dark", gradient: "linear-gradient(135deg, #09090b, #27272a)" },
  { id: "blue", label: "Ocean Blue", gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)" },
  { id: "purple", label: "Royal Violet", gradient: "linear-gradient(135deg, #4c1d95, #8b5cf6)" },
  { id: "emerald", label: "Emerald Green", gradient: "linear-gradient(135deg, #064e3b, #10b981)" },
  { id: "gold", label: "Titanium Gold", gradient: "linear-gradient(135deg, #78350f, #d97706)" },
];

export const VirtualCardGenerator = React.forwardRef<HTMLDivElement, VirtualCardGeneratorProps>(
  (
    {
      cardholderName = "ALEX MORGAN",
      currency = "USD",
      defaultLimit = 500,
      maxLimit = 10000,
      onCreateCard,
      className,
      ...props
    },
    ref,
  ) => {
    const [name, setName] = useState(cardholderName);
    const [cardLabel, setCardLabel] = useState("Online Subscriptions");
    const [limit, setLimit] = useState(defaultLimit);
    const [singleUse, setSingleUse] = useState(false);
    const [lockToMerchant, setLockToMerchant] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

    const handleCreate = () => {
      onCreateCard?.({
        label: cardLabel,
        cardholderName: name,
        limit,
        singleUse,
        lockToMerchant,
        theme: selectedTheme.id,
      });
    };

    const classes = ["fc-card-generator", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label="Create Virtual Card"
        {...props}
      >
        {/* Live Card Preview */}
        <div className="fc-card-generator__preview-area">
          <div style={{ width: "100%", maxWidth: "340px", borderRadius: "16px", background: selectedTheme.gradient, padding: "2px" }}>
            <WalletCard
              cardHolder={name || "CARDHOLDER"}
              cardNumber="4111222233334444"
              expiry="12/28"
              cvv="888"
              brand="visa"
            />
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="fc-card-generator__config-grid">
          <div className="fc-card-generator__field">
            <span className="fc-card-generator__label">Card Label</span>
            <Input
              label="Card Label"
              hideLabel
              value={cardLabel}
              onChange={(e) => setCardLabel(e.target.value)}
              placeholder="e.g. Netflix, AWS, Travel"
            />
          </div>

          <div className="fc-card-generator__field">
            <span className="fc-card-generator__label">Cardholder Name</span>
            <Input
              label="Cardholder Name"
              hideLabel
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />
          </div>

          {/* Theme selection */}
          <div className="fc-card-generator__field">
            <span className="fc-card-generator__label">Card Visual Theme</span>
            <div className="fc-card-generator__themes" role="radiogroup" aria-label="Card Theme">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`fc-card-generator__theme-pill ${
                    selectedTheme.id === theme.id ? "fc-card-generator__theme-pill--selected" : ""
                  }`}
                  style={{ background: theme.gradient }}
                  onClick={() => setSelectedTheme(theme)}
                  role="radio"
                  aria-checked={selectedTheme.id === theme.id}
                  aria-label={theme.label}
                />
              ))}
            </div>
          </div>

          {/* Spending Limit Slider */}
          <div className="fc-card-generator__field">
            <div className="fc-card-generator__slider-header">
              <span className="fc-card-generator__label">Spending Limit</span>
              <span className="fc-card-generator__slider-value">
                {currency} {limit.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={maxLimit}
              step={50}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onInput={(e) => setLimit(Number((e.target as HTMLInputElement).value))}
              className="fc-card-generator__slider"
              aria-label="Spending Limit Slider"
            />
          </div>

          {/* Security feature switches */}
          <div className="fc-card-generator__switches">
            <div className="fc-card-generator__switch-row">
              <div className="fc-card-generator__switch-info">
                <span className="fc-card-generator__switch-title">Single-Use Card (Burner)</span>
                <span className="fc-card-generator__switch-desc">
                  Card automatically terminates after the first charge.
                </span>
              </div>
              <Switch
                checked={singleUse}
                onCheckedChange={setSingleUse}
                aria-label="Single-Use Card"
              />
            </div>

            <div className="fc-card-generator__switch-row">
              <div className="fc-card-generator__switch-info">
                <span className="fc-card-generator__switch-title">Lock to First Merchant</span>
                <span className="fc-card-generator__switch-desc">
                  Card cannot be used at any other vendor after first swipe.
                </span>
              </div>
              <Switch
                checked={lockToMerchant}
                onCheckedChange={setLockToMerchant}
                aria-label="Lock to First Merchant"
              />
            </div>
          </div>

          <Button variant="primary" onClick={handleCreate} aria-label="Issue Virtual Card">
            Issue Virtual Card Now
          </Button>
        </div>
      </div>
    );
  },
);

VirtualCardGenerator.displayName = "VirtualCardGenerator";

export default VirtualCardGenerator;

