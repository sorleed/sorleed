import React from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button } from "../button";
import type { BiometricAuthPromptProps } from "../types";

export const BiometricAuthPrompt: React.FC<BiometricAuthPromptProps> = ({
  open,
  onOpenChange,
  type = "face",
  status = "idle",
  title = "Authenticate Transaction",
  description = "Confirm with biometric verification to authorize this transfer",
  amount,
  currency = "USD",
  onAuthenticate,
  onUsePasscode,
  className,
}) => {
  const contentClasses = ["fc-biometric-prompt", className].filter(Boolean).join(" ");

  const renderIcon = () => {
    if (status === "success") {
      return (
        <svg className="fc-biometric-prompt__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    }
    if (status === "error") {
      return (
        <svg className="fc-biometric-prompt__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    }
    if (type === "touch") {
      // Fingerprint icon
      return (
        <svg className="fc-biometric-prompt__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 12c0-3 2.5-5.5 5.5-5.5" />
          <path d="M12 2a10 10 0 0 0-7.1 17" />
          <path d="M7 12a5 5 0 0 1 5-5" />
          <path d="M12 20a8 8 0 0 0 7.8-6.2" />
          <path d="M16 12a4 4 0 0 0-4-4" />
          <path d="M12 16a4 4 0 0 1-4-4" />
        </svg>
      );
    }
    // Face ID icon
    return (
      <svg className="fc-biometric-prompt__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m18-6h-4a2 2 0 0 0-2 2v4m-12 10H5a2 2 0 0 1-2-2v-4m18 6h-4a2 2 0 0 1-2-2v-4" />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
        <path d="M10 15c.5.8 1.4 1.2 2 1.2s1.5-.4 2-1.2" />
      </svg>
    );
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fc-biometric-overlay" />
        <RadixDialog.Content className={contentClasses} aria-describedby="fc-biometric-desc">
          <div
            className={`fc-biometric-prompt__icon-wrapper fc-biometric-prompt__icon-wrapper--${status}`}
          >
            {renderIcon()}
          </div>

          <RadixDialog.Title asChild>
            <h3 className="fc-biometric-prompt__title">{title}</h3>
          </RadixDialog.Title>

          <RadixDialog.Description asChild>
            <p id="fc-biometric-desc" className="fc-biometric-prompt__desc">
              {status === "error"
                ? "Biometric verification failed. Please try again or use your passcode."
                : description}
            </p>
          </RadixDialog.Description>

          {amount !== undefined && (
            <div className="fc-biometric-prompt__amount-badge">
              {currency} {typeof amount === "number" ? amount.toLocaleString() : amount}
            </div>
          )}

          <div className="fc-biometric-prompt__actions">
            {status !== "success" && (
              <Button
                variant="primary"
                onClick={onAuthenticate}
                loading={status === "authenticating"}
                aria-label={type === "face" ? "Verify with Face ID" : "Verify with Fingerprint"}
              >
                {status === "error" ? "Retry Biometrics" : type === "face" ? "Scan Face ID" : "Scan Fingerprint"}
              </Button>
            )}

            {onUsePasscode && (
              <button
                type="button"
                className="fc-biometric-prompt__btn-fallback"
                onClick={onUsePasscode}
              >
                Use Passcode / PIN instead
              </button>
            )}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

BiometricAuthPrompt.displayName = "BiometricAuthPrompt";

export default BiometricAuthPrompt;

