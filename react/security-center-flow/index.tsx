import React, { useState } from "react";
import { Alert } from "../alert";
import { Badge } from "../badge";
import { Button } from "../button";
import { DeviceManagementCard } from "../device-management-card";
import { EmptyState } from "../empty-state";
import { SessionTimeoutModal } from "../session-timeout-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs";
import { VirtualCardReveal } from "../virtual-card-reveal";
import type { SecurityCenterFlowProps } from "../types";

export const SecurityCenterFlow = React.forwardRef<HTMLDivElement, SecurityCenterFlowProps>(
  (
    {
      title = "Security Center",
      devices: initialDevices,
      cardNumber,
      cardHolder,
      cardExpiry,
      cardCvv,
      cardBrand = "visa",
      sessionTimeoutSeconds = 60,
      onRevokeDevice,
      onEmergencyLockdown,
      className,
      ...props
    },
    ref,
  ) => {
    const [devices, setDevices] = useState(initialDevices);
    const [timeoutOpen, setTimeoutOpen] = useState(false);
    const [lockedDown, setLockedDown] = useState(false);
    const [confirmingLockdown, setConfirmingLockdown] = useState(false);
    const [locking, setLocking] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRevoke = async (id: string) => {
      await onRevokeDevice?.(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      return true;
    };

    const handleRevokeAllOthers = async () => {
      setDevices((prev) => prev.filter((d) => d.isCurrent));
      return true;
    };

    const handleLockdown = async () => {
      if (locking) return;
      setLocking(true);
      setErrorMessage(null);
      try {
        await onEmergencyLockdown?.();
        setDevices((prev) => prev.filter((d) => d.isCurrent));
        setLockedDown(true);
        setConfirmingLockdown(false);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Unable to activate emergency lockdown. Retry immediately.",
        );
      } finally {
        setLocking(false);
      }
    };

    const classes = ["fc-security-center-flow", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Security Center Flow"}
        {...props}
      >
        <div className="fc-security-center-flow__header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 className="fc-security-center-flow__title">{title}</h2>
            <Badge variant={lockedDown ? "error" : "success"}>
              {lockedDown ? "Lockdown Active" : "Protected"}
            </Badge>
          </div>
          <div className="fc-security-center-flow__header-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTimeoutOpen(true)}
            >
              Test Session Timeout
            </Button>
          </div>
        </div>

        <div aria-live="polite">
          {errorMessage && (
            <Alert variant="error" title="Lockdown Error">
              {errorMessage}
            </Alert>
          )}
          {lockedDown && (
            <Alert variant="error" title="Emergency Account Lockdown Active">
              All other sessions have been terminated and virtual card credentials have been restricted.
            </Alert>
          )}
        </div>

        <Tabs defaultValue="devices">
          <TabsList aria-label="Security sections">
            <TabsTrigger value="devices">Active Devices ({devices.length})</TabsTrigger>
            <TabsTrigger value="card">Virtual Card Credentials</TabsTrigger>
          </TabsList>

          <TabsContent value="devices">
            <div className="fc-security-center-flow__panel">
              {devices.length === 0 ? (
                <EmptyState
                  title="No active device sessions"
                  description="All other sessions have been revoked."
                />
              ) : (
                <DeviceManagementCard
                  devices={devices}
                  onRevokeDevice={handleRevoke}
                  onRevokeAllOthers={handleRevokeAllOthers}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="card">
            <div className="fc-security-center-flow__panel">
              <VirtualCardReveal
                cardNumber={cardNumber}
                cardHolder={cardHolder}
                expiry={cardExpiry}
                cvv={cardCvv}
                brand={cardBrand}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="fc-security-center-flow__lockdown-box">
          <div>
            <h3 className="fc-security-center-flow__lockdown-title">
              Suspect Unauthorized Access?
            </h3>
            <p className="fc-security-center-flow__lockdown-desc">
              Immediately sign out all other devices and freeze exposed virtual card credentials.
            </p>
          </div>
          {confirmingLockdown && !lockedDown ? (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="button"
                variant="ghost"
                disabled={locking}
                onClick={() => setConfirmingLockdown(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={locking}
                onClick={handleLockdown}
              >
                {locking ? "Locking..." : "Confirm Lockdown"}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={lockedDown || locking}
              onClick={() => setConfirmingLockdown(true)}
            >
              {lockedDown ? "Account Locked" : "Trigger Emergency Lockdown"}
            </Button>
          )}
        </div>

        <SessionTimeoutModal
          open={timeoutOpen}
          onOpenChange={setTimeoutOpen}
          countdownSeconds={sessionTimeoutSeconds}
          onExtendSession={() => setTimeoutOpen(false)}
          onLogout={() => setTimeoutOpen(false)}
          onTimeout={() => setTimeoutOpen(false)}
        />
      </div>
    );
  },
);

SecurityCenterFlow.displayName = "SecurityCenterFlow";
export default SecurityCenterFlow;

