import React, { useId } from "react";
import type { InputProps } from "../types";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hideLabel = false,
      helperText,
      errorMessage,
      className,
      id: providedId,
      type = "text",
      required,
      disabled,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const helperId = `${id}-helper`;
    const errorId = `${id}-error`;

    const hasError = Boolean(errorMessage);
    const messageText = hasError ? errorMessage : helperText;
    const showMessage = Boolean(messageText);

    const describedByIds = [
      ariaDescribedBy,
      showMessage ? (hasError ? errorId : helperId) : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = ["sl-input", className].filter(Boolean).join(" ");
    const labelClasses = ["sl-input__label", hideLabel ? "sl-input__label--visually-hidden" : ""]
      .filter(Boolean)
      .join(" ");
    const messageClasses = ["sl-input__message", hasError ? "sl-input__message--error" : ""]
      .filter(Boolean)
      .join(" ");

    // Ensure required Sorleed classes are always present
    if (!wrapperClasses.includes("sl-input")) {
      // defensive - className should not remove required classes
    }

    return (
      <div className={wrapperClasses}>
        <label className={labelClasses} htmlFor={id}>
          {label}
        </label>
        <div className="sl-input__control">
          <input
            ref={ref}
            id={id}
            type={type}
            className="sl-input__field"
            required={required}
            disabled={disabled}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={describedByIds || undefined}
            {...props}
          />
        </div>
        {showMessage && (
          <p id={hasError ? errorId : helperId} className={messageClasses}>
            {messageText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
