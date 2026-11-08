import React from "react";
import type { ToastProps } from "../types";

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      variant = "info",
      title,
      description,
      onClose,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "fc-toast",
      `fc-toast--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role={variant === "error" ? "alert" : "status"}
        aria-live={variant === "error" ? "assertive" : "polite"}
        className={classes}
        {...props}
      >
        <div className="fc-toast__content">
          {title && <h4 className="fc-toast__title">{title}</h4>}
          {description && <p className="fc-toast__description">{description}</p>}
          {children}
        </div>

        {onClose && (
          <button
            type="button"
            className="fc-toast__close"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";
export default Toast;

