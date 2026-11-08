/**
 * Options for formatting monetary values according to ISO 4217 and financial display standards.
 */
export interface FormatMoneyOptions {
  /**
   * ISO 4217 3-letter currency code (e.g., 'USD', 'EUR', 'GBP', 'NGN') or currency symbol.
   * Default: 'USD'.
   */
  currency?: string;
  /**
   * BCP 47 language tag (e.g., 'en-US', 'de-DE', 'en-GB').
   * Default: 'en-US'.
   */
  locale?: string;
  /**
   * Display style for currency ('symbol', 'code', 'name', 'narrowSymbol').
   * Default: 'symbol'.
   */
  currencyDisplay?: "symbol" | "code" | "name" | "narrowSymbol";
  /**
   * Number of fraction digits. If undefined, defaults to standard currency fraction digits (usually 2).
   */
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  /**
   * Whether to force signed display for positive numbers (e.g., '+ $10.00').
   */
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
}

/**
 * Standard utility for formatting monetary amounts consistently across fintech interfaces.
 * Prevents precision errors and non-standard number formatting.
 *
 * @param amount Number, numeric string, or bigint to format
 * @param options Formatting options adhering to Intl.NumberFormat
 * @returns Formatted currency string
 */
export function formatMoney(
  amount: number | string | bigint,
  options: FormatMoneyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    currencyDisplay = "symbol",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    signDisplay = "auto",
  } = options;

  const numericValue = typeof amount === "string" ? Number.parseFloat(amount) : Number(amount);

  if (Number.isNaN(numericValue)) {
    return `${currency} 0.00`;
  }

  // Handle standard 3-letter ISO code via Intl.NumberFormat
  if (/^[A-Za-z]{3}$/.test(currency)) {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency.toUpperCase(),
        currencyDisplay,
        minimumFractionDigits,
        maximumFractionDigits,
        signDisplay,
      }).format(numericValue);
    } catch {
      // Fallback if currency or locale is unsupported by current runtime
    }
  }

  // Fallback for raw symbols or non-ISO prefixes (e.g. '$', '€', '£')
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
    signDisplay,
  }).format(numericValue);

  return `${currency} ${formattedNumber}`;
}
