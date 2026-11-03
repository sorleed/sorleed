import React from "react";
import type { ButtonProps } from "../types";

const variantClassMap = {
  primary: "sl-button--primary",
  secondary: "sl-button--secondary",
  ghost: "sl-button--ghost",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, type = "button", children, ...props }, ref) => {
    const classes = [
      "sl-button",
      variantClassMap[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
