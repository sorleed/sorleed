import React from "react";
import { Avatar } from "../avatar";
import { Badge } from "../badge";
import type { AuditSeverity, AuditTrailTimelineProps } from "../types";

const SEVERITY_VARIANT: Record<AuditSeverity, "info" | "warning" | "error"> = {
  info: "info",
  warning: "warning",
  critical: "error",
};

export const AuditTrailTimeline = React.forwardRef<HTMLDivElement, AuditTrailTimelineProps>(
  (
    {
      title = "Audit Trail",
      description = "Immutable ledger of administrative, treasury, and security actions",
      events,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-audit-timeline", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Audit Trail Timeline"}
        {...props}
      >
        <div className="fc-audit-timeline__header">
          <h3 className="fc-audit-timeline__title">{title}</h3>
          {description && <p className="fc-audit-timeline__desc">{description}</p>}
        </div>

        <ol className="fc-audit-timeline__list">
          {events.map((event) => {
            const severity = event.severity ?? "info";
            return (
              <li key={event.id} className="fc-audit-timeline__item">
                <Avatar name={event.actorName} size="sm" />
                <div className="fc-audit-timeline__body">
                  <div className="fc-audit-timeline__top">
                    <div>
                      <span className="fc-audit-timeline__actor">{event.actorName}</span>
                      <span className="fc-audit-timeline__role">({event.actorRole})</span>
                    </div>
                    <time className="fc-audit-timeline__time">{event.timestamp}</time>
                  </div>

                  <div className="fc-audit-timeline__action">
                    {event.action}
                    {event.resource ? ` — ${event.resource}` : ""}
                  </div>

                  <div className="fc-audit-timeline__tags">
                    <Badge variant={SEVERITY_VARIANT[severity]}>
                      {severity.toUpperCase()}
                    </Badge>
                    {event.mfaVerified && <Badge variant="success">2FA Verified</Badge>}
                    {event.ipAddress && (
                      <span className="fc-audit-timeline__ip">IP {event.ipAddress}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

AuditTrailTimeline.displayName = "AuditTrailTimeline";
export default AuditTrailTimeline;
