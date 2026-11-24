import React, { useEffect, useState } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { Badge } from "../badge";
import { Button } from "../button";
import type { VirtualCardRevealProps } from "../types";

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const VirtualCardReveal = React.forwardRef<HTMLDivElement, VirtualCardRevealProps>(
  (
    {
      cardNumber,
      cardHolder,
      expiry,
      cvv,
      brand = "Visa",
      theme = "dark",
      autoMaskSeconds = 60,
      defaultRevealed = false,
      onAuthenticate,
      onCopy,
      className,
      ...props
    },
    ref,
  ) => {
    const [revealed, setRevealed] = useState(defaultRevealed);
    const [secondsLeft, setSecondsLeft] = useState(autoMaskSeconds);
    const [copiedPan, setCopiedPan] = useState(false);
    const [copiedCvv, setCopiedCvv] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
      if (!revealed) return;
      setSecondsLeft(autoMaskSeconds);

      const timer = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRevealed(false);
            return autoMaskSeconds;
          }
          return s - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [revealed, autoMaskSeconds]);

    const handleToggleReveal = async () => {
      if (revealed) {
        setRevealed(false);
        return;
      }

      if (onAuthenticate) {
        setIsAuthenticating(true);
        try {
          const ok = await onAuthenticate();
          if (ok !== false) {
            setRevealed(true);
          }
        } finally {
          setIsAuthenticating(false);
        }
      } else {
        setRevealed(true);
      }
    };

    const copyText = (type: "pan" | "cvv", text: string) => {
      try {
        if (typeof navigator !== "undefined") {
          navigator.clipboard?.writeText?.(text)?.catch?.(() => {});
        }
      } catch {
        // Ignore clipboard errors in non-secure/restricted contexts
      }
      onCopy?.(type, text);

      if (type === "pan") {
        setCopiedPan(true);
        setTimeout(() => setCopiedPan(false), 2000);
      } else {
        setCopiedCvv(true);
        setTimeout(() => setCopiedCvv(false), 2000);
      }
    };

    const formattedPan = cardNumber.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
    const cleanDigits = cardNumber.replace(/\D/g, "");
    const lastFour = cleanDigits.slice(-4) || "8841";
    const maskedPan = `•••• •••• •••• ${lastFour}`;

    return (
      <div
        ref={ref}
        className={["fc-card-reveal", className].filter(Boolean).join(" ")}
        {...props}
      >
        <div className={`fc-card-reveal__surface fc-card-reveal__surface--${theme}`}>
          <div className="fc-card-reveal__top-row">
            <div className="fc-card-reveal__chip-group">
              <div className="fc-card-reveal__chip" aria-hidden="true" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12a10 10 0 0 1 14 0" />
                <path d="M8.5 15.5a5 5 0 0 1 7 0" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <span className="fc-card-reveal__brand">{brand}</span>
          </div>

          <div className="fc-card-reveal__pan-wrap">
            <span
              className={`fc-card-reveal__pan ${!revealed ? "fc-card-reveal__pan--blurred" : ""}`}
              aria-label={revealed ? `Card number ${formattedPan}` : `Card ending in ${lastFour}`}
            >
              {revealed ? formattedPan : maskedPan}
            </span>

            {revealed && (
              <RadixTooltip.Provider delayDuration={150}>
                <RadixTooltip.Root>
                  <RadixTooltip.Trigger asChild>
                    <button
                      type="button"
                      className="fc-card-reveal__copy-btn"
                      aria-label="Copy card number"
                      onClick={() => copyText("pan", formattedPan.replace(/\s/g, ""))}
                    >
                      {copiedPan ? <IconCheck /> : <IconCopy />}
                    </button>
                  </RadixTooltip.Trigger>
                  <RadixTooltip.Portal>
                    <RadixTooltip.Content className="fc-tooltip" side="top" sideOffset={5}>
                      {copiedPan ? "Copied!" : "Copy card number"}
                      <RadixTooltip.Arrow className="fc-tooltip__arrow" />
                    </RadixTooltip.Content>
                  </RadixTooltip.Portal>
                </RadixTooltip.Root>
              </RadixTooltip.Provider>
            )}
          </div>

          <div className="fc-card-reveal__bottom-row">
            <div className="fc-card-reveal__meta-block">
              <span className="fc-card-reveal__meta-label">Cardholder</span>
              <span className="fc-card-reveal__meta-val">{cardHolder}</span>
            </div>

            <div className="fc-card-reveal__meta-block">
              <span className="fc-card-reveal__meta-label">Expires</span>
              <span className="fc-card-reveal__meta-val">{expiry}</span>
            </div>

            <div className="fc-card-reveal__meta-block">
              <span className="fc-card-reveal__meta-label">CVV</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span
                  className={`fc-card-reveal__meta-val ${!revealed ? "fc-card-reveal__meta-val--blurred" : ""}`}
                >
                  {revealed ? cvv : "•••"}
                </span>
                {revealed && (
                  <button
                    type="button"
                    className="fc-card-reveal__copy-btn"
                    aria-label="Copy CVV"
                    onClick={() => copyText("cvv", cvv)}
                  >
                    {copiedCvv ? <IconCheck /> : <IconCopy />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="fc-card-reveal__toolbar">
          <Button
            variant="secondary"
            size="sm"
            loading={isAuthenticating}
            onClick={handleToggleReveal}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              {revealed ? <IconEyeOff /> : <IconEye />}
              {revealed ? "Hide details" : "Reveal details"}
            </span>
          </Button>

          {revealed && (
            <Badge variant="info">
              Auto-locks in {secondsLeft}s
            </Badge>
          )}
        </div>
      </div>
    );
  },
);

VirtualCardReveal.displayName = "VirtualCardReveal";
export default VirtualCardReveal;

