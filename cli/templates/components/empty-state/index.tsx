import React from "react";
import type { EmptyStateProps } from "../types";

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      title,
      description,
      icon,
      action,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-empty-state", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Empty State" {...props}>
        {icon && <div className="fc-empty-state__icon">{icon}</div>}
        <h3 className="fc-empty-state__title">{title}</h3>
        {description && <p className="fc-empty-state__description">{description}</p>}
        {children}
        {action && <div className="fc-empty-state__action">{action}</div>}
      </div>
    );
  },
);

EmptyState.displayName = "EmptyState";
export default EmptyState;
