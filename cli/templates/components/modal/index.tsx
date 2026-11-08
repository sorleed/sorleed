import React, { useEffect } from "react";
import type { ModalProps } from "../types";

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      size = "md",
      children,
      footer,
      className,
      ...props
    },
    ref,
  ) => {
    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && onClose) {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }, [open, onClose]);

    if (!open) return null;

    const modalClasses = ["fc-modal", `fc-modal--${size}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className="fc-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose();
          }
        }}
        data-testid="modal-overlay"
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : undefined}
          className={modalClasses}
          {...props}
        >
          {(title || onClose) && (
            <div className="fc-modal__header">
              {title && <h2 className="fc-modal__title">{title}</h2>}
              {onClose && (
                <button
                  type="button"
                  className="fc-modal__close"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <svg
                    width="16"
                    height="16"
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
          )}

          <div className="fc-modal__body">{children}</div>

          {footer && <div className="fc-modal__footer">{footer}</div>}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";
export default Modal;

