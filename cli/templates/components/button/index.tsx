import React, { type MouseEvent } from "react";
import type { ButtonProps } from "../types";

const variantClassMap = {
  primary: "fc-button--primary",
  secondary: "fc-button--secondary",
  ghost: "fc-button--ghost",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, className, type = "button", children, disabled, onClick, ...props }, ref) => {
    const isInteractiveDisabled = disabled || loading;

    const classes = [
      "fc-button",
      variantClassMap[variant],
      size !== "md" ? `fc-button--${size}` : "",
      loading ? "fc-button--loading" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (isInteractiveDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isInteractiveDisabled}
        aria-busy={loading ? "true" : undefined}
        aria-disabled={isInteractiveDisabled ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
