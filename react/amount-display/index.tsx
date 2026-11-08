import React from "react";
import type { AmountDisplayProps } from "../types";
import { formatMoney } from "../utils/format";

export const AmountDisplay = React.forwardRef<HTMLSpanElement, AmountDisplayProps>(
  (
    {
      value,
      currency,
      size = "md",
      variant = "default",
      locale,
      signDisplay,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = [
      "fc-amount-display",
      `fc-amount-display--${size}`,
      `fc-amount-display--${variant}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // If a numeric or parseable value is provided along with a string currency code,
    // optionally leverage formatMoney for standardized monetary formatting
    let displayCurrency = currency;
    let displayValue = value;

    if (typeof value === "number" && typeof currency === "string" && /^[A-Z]{3}$/.test(currency)) {
      const formatted = formatMoney(value, {
        currency,
        locale,
        signDisplay: signDisplay ?? (variant === "positive" ? "always" : "auto"),
      });
      // formatMoney outputs e.g. "$ 1,250.00" or "+$ 1,250.00" or "USD 1,250.00"
      displayCurrency = undefined;
      displayValue = formatted;
    }

    return (
      <span ref={ref} className={classes} {...props}>
        {displayCurrency && (
          <span className="fc-amount-display__currency fc-amount-display-currency">
            {displayCurrency}
          </span>
        )}
        <span className="fc-amount-display__value fc-amount-display-value">
          {displayValue}
        </span>
      </span>
    );
  },
);

AmountDisplay.displayName = "AmountDisplay";

export default AmountDisplay;

