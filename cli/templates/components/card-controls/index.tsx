import React from "react";
import { Switch } from "../switch";
import type { CardControlsProps } from "../types";

export const CardControls = React.forwardRef<HTMLDivElement, CardControlsProps>(
  (
    {
      title = "Card Security & Features",
      subtitle = "Manage permissions and limits for this card",
      controls = [],
      onToggleControl,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = ["fc-card-controls", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        className={classes}
        role="region"
        aria-label={typeof title === "string" ? title : "Card Controls"}
        {...props}
      >
        <div className="fc-card-controls__header">
          <div>
            <h3 className="fc-card-controls__title">{title}</h3>
            {subtitle && <p className="fc-card-controls__subtitle">{subtitle}</p>}
          </div>
        </div>

        <div className="fc-card-controls__list" role="list">
          {controls.map((item) => (
            <div key={item.id} className="fc-card-controls__item" role="listitem">
              <div className="fc-card-controls__item-info">
                <span className="fc-card-controls__item-label">{item.label}</span>
                {item.description && (
                  <span className="fc-card-controls__item-desc">{item.description}</span>
                )}
              </div>
              <Switch
                checked={item.enabled}
                disabled={item.disabled}
                aria-label={item.label}
                onCheckedChange={(checked) => onToggleControl?.(item.id, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);

CardControls.displayName = "CardControls";

export default CardControls;
