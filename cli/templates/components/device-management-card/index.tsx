import React, { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Card } from "../card";
import type { DeviceManagementCardProps, DeviceType } from "../types";

const IconLaptop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
  </svg>
);

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
);

const IconTablet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <line x1="12" x2="12.01" y1="18" y2="18" />
  </svg>
);

const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const renderDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case "desktop":
      return <IconLaptop />;
    case "mobile":
      return <IconPhone />;
    case "tablet":
      return <IconTablet />;
    default:
      return <IconGlobe />;
  }
};

export const DeviceManagementCard = React.forwardRef<HTMLDivElement, DeviceManagementCardProps>(
  (
    {
      title = "Connected Devices & Sessions",
      description = "Manage active sessions and devices authorized to access your financial account.",
      devices = [],
      onRevokeDevice,
      onRevokeAllOthers,
      className,
      ...props
    },
    ref,
  ) => {
    const [revokingId, setRevokingId] = useState<string | null>(null);
    const [revokingAll, setRevokingAll] = useState(false);

    const otherDevices = devices.filter((d) => !d.isCurrent);

    const handleRevoke = async (id: string) => {
      setRevokingId(id);
      try {
        await onRevokeDevice?.(id);
      } finally {
        setRevokingId(null);
      }
    };

    const handleRevokeAll = async () => {
      setRevokingAll(true);
      try {
        await onRevokeAllOthers?.();
      } finally {
        setRevokingAll(false);
      }
    };

    return (
      <div
        ref={ref}
        className={["fc-device-card", className].filter(Boolean).join(" ")}
        {...props}
      >
        <Card title={title} description={description}>
          <ul className="fc-device-list" role="list">
            {devices.map((device) => (
              <li
                key={device.id}
                className={`fc-device-item ${device.isCurrent ? "fc-device-item--current" : ""}`}
              >
                <div className="fc-device-item__left">
                  <div className="fc-device-item__icon" aria-hidden="true">
                    {renderDeviceIcon(device.deviceType)}
                  </div>
                  <div className="fc-device-item__info">
                    <div className="fc-device-item__name-row">
                      <span className="fc-device-item__name">{device.deviceName}</span>
                      {device.isCurrent && (
                        <Badge variant="success">Current session</Badge>
                      )}
                    </div>
                    <div className="fc-device-item__meta">
                      <span>{device.browser} · {device.os}</span>
                      <span>•</span>
                      <span>{device.location}</span>
                      <span>•</span>
                      <span>IP: {device.ipAddress}</span>
                      <span>•</span>
                      <span>{device.isCurrent ? "Active now" : device.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className="fc-device-item__right">
                  {!device.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={revokingId === device.id}
                      onClick={() => handleRevoke(device.id)}
                      aria-label={`Revoke access for ${device.deviceName}`}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {otherDevices.length > 0 && (
            <div className="fc-device-card__footer">
              <Button
                variant="secondary"
                size="sm"
                loading={revokingAll}
                onClick={handleRevokeAll}
              >
                Sign out {otherDevices.length} other {otherDevices.length === 1 ? "device" : "devices"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  },
);

DeviceManagementCard.displayName = "DeviceManagementCard";
export default DeviceManagementCard;

