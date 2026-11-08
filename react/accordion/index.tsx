import React, { useState } from "react";
import type { AccordionProps } from "../types";

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items = [],
      allowMultiple = false,
      defaultExpanded = [],
      className,
      ...props
    },
    ref,
  ) => {
    const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpanded);

    const toggleItem = (id: string) => {
      if (allowMultiple) {
        setExpandedIds((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        );
      } else {
        setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
      }
    };

    const classes = ["fc-accordion", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {items.map((item, index) => {
          const itemId = item.id || `accordion-item-${index}`;
          const isExpanded = expandedIds.includes(itemId);
          const headerId = `accordion-header-${itemId}`;
          const panelId = `accordion-panel-${itemId}`;

          return (
            <div key={itemId} className="fc-accordion__item">
              <h4 className="fc-accordion__header">
                <button
                  type="button"
                  id={headerId}
                  className="fc-accordion__trigger"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => toggleItem(itemId)}
                >
                  <span>{item.title}</span>
                  <svg
                    className="fc-accordion__icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </h4>
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="fc-accordion__panel"
                hidden={!isExpanded}
              >
                {item.content}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;

