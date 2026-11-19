import React, { useEffect, useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Button } from "../button";
import type { SessionTimeoutModalProps } from "../types";

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  open,
  onOpenChange,
  countdownSeconds = 60,
  title = "Session Expiring Soon",
  description,
  onExtendSession,
  onTimeout,
  onLogout,
  className,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(countdownSeconds);

  useEffect(() => {
    if (!open) {
      setSecondsLeft(countdownSeconds);
      return;
    }

    setSecondsLeft(countdownSeconds);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdownSeconds, onTimeout]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, secondsLeft / countdownSeconds));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const ringColorClass =
    secondsLeft <= 15
      ? "fc-session-timeout__ring-progress"
      : secondsLeft <= 30
        ? "fc-session-timeout__ring-progress--warning"
        : "fc-session-timeout__ring-progress--info";

  const handleExtend = () => {
    setSecondsLeft(countdownSeconds);
    onExtendSession?.();
    onOpenChange?.(false);
  };

  const handleLogout = () => {
    onLogout?.();
    onOpenChange?.(false);
  };

  const contentClasses = ["fc-session-timeout-modal", className].filter(Boolean).join(" ");

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fc-session-timeout-overlay" />
        <RadixDialog.Content
          className={contentClasses}
          role="alertdialog"
          aria-describedby="session-timeout-desc"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="fc-session-timeout__ring-wrap" aria-hidden="true">
            <svg className="fc-session-timeout__ring-svg" viewBox="0 0 88 88">
              <circle
                className="fc-session-timeout__ring-bg"
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                strokeWidth="6"
              />
              <circle
                className={`fc-session-timeout__ring-progress ${ringColorClass}`}
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="fc-session-timeout__number" aria-live="polite">
              {secondsLeft}
            </span>
          </div>

          <RadixDialog.Title className="fc-session-timeout__title">{title}</RadixDialog.Title>

          <RadixDialog.Description
            id="session-timeout-desc"
            className="fc-session-timeout__description"
          >
            {description ||
              `For your banking security, your session will automatically log out in ${secondsLeft} seconds due to inactivity.`}
          </RadixDialog.Description>

          <div className="fc-session-timeout__notice">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>PCI-DSS Financial Session Inactivity Protection</span>
          </div>

          <div className="fc-session-timeout__actions">
            <Button variant="primary" onClick={handleExtend} autoFocus>
              Stay signed in
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Log out now
            </Button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};

SessionTimeoutModal.displayName = "SessionTimeoutModal";
export default SessionTimeoutModal;

