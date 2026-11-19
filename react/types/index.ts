export type ComponentSize = "sm" | "md" | "lg";

import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the button is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Visual variant. Defaults to "primary".
   * Maps to fc-button--primary/secondary/ghost classes per contract.
   */
  variant?: ButtonVariant;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true
   * and an accessible name is otherwise provided.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Input type. Constrained to types supported by the contract (text, email, tel, number, url).
   * Password/search/textarea/select/OTP/currency/PIN are out of scope per contract.
   */
  type?: "text" | "email" | "tel" | "number" | "url";
  /**
   * Optional id for label/input/aria association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override. Combined with auto-generated ids.
   */
  "aria-describedby"?: string;
}

export type PhoneInputStatus = "empty" | "incomplete" | "invalid" | "valid";

export interface PhoneInputChangeResult {
  inputValue: string;
  e164?: string;
  country?: string;
  status: PhoneInputStatus;
  isValid: boolean;
}

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label: string;
  hideLabel?: boolean;
  helperText?: string;
  errorMessage?: string;
  value?: string;
  defaultValue?: string;
  country?: string;
  defaultCountry?: string;
  onCountryChange?: (country: string | undefined) => void;
  countries?: string[];
  international?: boolean;
  onChange?: (result: PhoneInputChangeResult) => void;
  id?: string;
  className?: string;
  "aria-describedby"?: string;
}

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets aria-invalid="true".
   */
  errorMessage?: string;
  /**
   * Accessible label for the toggle button when password is hidden.
   * Defaults to "Show password".
   */
  showPasswordLabel?: string;
  /**
   * Accessible label for the toggle button when password is visible.
   * Defaults to "Hide password".
   */
  hidePasswordLabel?: string;
  /**
   * Whether password visibility is currently showing (controlled).
   */
  visible?: boolean;
  /**
   * Default visibility state on initial render (uncontrolled).
   * Defaults to false.
   */
  defaultVisible?: boolean;
  /**
   * Callback fired when visibility toggle is clicked.
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the select is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true
   * and an accessible name is otherwise provided.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional id for label/select/aria association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override. Combined with auto-generated ids.
   */
  "aria-describedby"?: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
  id?: string;
  helperText?: string;
}

export interface RadioGroupProps {
  /**
   * Accessible group label / legend.
   */
  label: string;
  /**
   * Visually hide the group legend while keeping it accessible.
   */
  hideLabel?: boolean;
  /**
   * Shared name attribute for mutual exclusion across the group.
   */
  name: string;
  /**
   * Available choices.
   */
  options: RadioOption[];
  /**
   * Controlled selected value.
   */
  value?: string;
  /**
   * Default selected value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Change callback when an option is selected.
   */
  onChange?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets aria-invalid.
   */
  errorMessage?: string;
  /**
   * Whether the whole group is disabled.
   */
  disabled?: boolean;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Optional id for the group. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the textarea is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label content.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. When provided, replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Resize behavior: "none" | "vertical" | "horizontal" | "both". Defaults to "vertical".
   */
  resize?: TextareaResize;
  /**
   * Optional id for element associations. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface OTPProps {
  /**
   * Accessible label for the OTP input group.
   */
  label: string;
  /**
   * Visually hide the label while keeping it accessible.
   */
  hideLabel?: boolean;
  /**
   * Number of OTP digit cells. Defaults to 6.
   */
  length?: number;
  /**
   * Controlled code value.
   */
  value?: string;
  /**
   * Default code value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Callback fired on any digit change.
   */
  onChange?: (value: string) => void;
  /**
   * Callback fired when all digit cells have been filled.
   */
  onComplete?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Whether the whole input is disabled.
   */
  disabled?: boolean;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Optional group id. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface CurrencyProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "prefix" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Label content. Required for accessible name unless hideLabel is true.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Currency symbol or prefix (e.g. "$", "€", "£").
   * Defaults to "$". Pass null or empty string to hide.
   */
  prefix?: string | null;
  /**
   * Currency code or suffix (e.g. "USD", "EUR").
   */
  suffix?: string | null;
  /**
   * Controlled value.
   */
  value?: string | number;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: string | number;
  /**
   * Change handler receiving the updated string value.
   */
  onChange?: (value: string) => void;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface CVVProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the input is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label for the CVV input.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Expected length of the CVV code (e.g. 3 or 4). Defaults to 4.
   */
  maxLength?: number;
  /**
   * Controlled value.
   */
  value?: string;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: string;
  /**
   * Change handler receiving the updated string value.
   */
  onChange?: (value: string) => void;
  /**
   * Whether to display an interactive visibility toggle button.
   * Defaults to false.
   */
  showToggle?: boolean;
  /**
   * Controlled visibility of the security code.
   */
  visible?: boolean;
  /**
   * Default visibility state on initial render (uncontrolled).
   * Defaults to false.
   */
  defaultVisible?: boolean;
  /**
   * Callback fired when visibility toggle is clicked.
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Accessible label for toggle button when code is masked. Defaults to "Show CVV".
   */
  showCVVLabel?: string;
  /**
   * Accessible label for toggle button when code is visible. Defaults to "Hide CVV".
   */
  hideCVVLabel?: string;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Size variant. Defaults to "md".
   */
  size?: ComponentSize;
  /**
   * Whether the date-picker is in a loading state. Sets aria-busy="true".
   */
  loading?: boolean;
  /**
   * Accessible label for the date input.
   */
  label: string;
  /**
   * Visually hide the label while keeping it programmatically associated.
   */
  hideLabel?: boolean;
  /**
   * Helper text shown when there is no error.
   */
  helperText?: string;
  /**
   * Error message. Replaces helper text and sets error state.
   */
  errorMessage?: string;
  /**
   * Earliest acceptable date string (YYYY-MM-DD).
   */
  min?: string;
  /**
   * Latest acceptable date string (YYYY-MM-DD).
   */
  max?: string;
  /**
   * Optional id for label/input association. Generated if omitted.
   */
  id?: string;
  /**
   * Optional aria-describedby override.
   */
  "aria-describedby"?: string;
}


/**
 * Props for the Card component.
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Optional title rendered in the card header.
   */
  title?: React.ReactNode;
  /**
   * Optional description text rendered below the title in the header.
   */
  description?: React.ReactNode;
  /**
   * Optional custom footer content.
   */
  footer?: React.ReactNode;
  /**
   * Main card body content.
   */
  children?: React.ReactNode;
  /**
   * Additional className to attach to the card root.
   */
  className?: string;
}

export type AlertVariant = "info" | "success" | "warning" | "error";

/**
 * Props for the Alert component.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /**
   * Semantic variant of the alert.
   * @default "info"
   */
  variant?: AlertVariant;
  /**
   * Optional bold heading above the alert message.
   */
  title?: React.ReactNode;
  /**
   * Alert body message or content.
   */
  children?: React.ReactNode;
  /**
   * Accessible ARIA role. Defaults to 'alert' for warning/error, 'status' for info/success.
   */
  role?: "alert" | "status";
  /**
   * Additional className.
   */
  className?: string;
}

/**
 * Props for Tabs component (powered by Radix UI Tabs primitive).
 */
export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
  className?: string;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props for Table component.
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  className?: string;
}

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

/**
 * Props for Badge component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Props for Switch component.
 */
export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * Props for Tooltip component (powered by Radix UI Tooltip primitive).
 */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

/**
 * Props for Popover component (powered by Radix UI Popover primitive).
 */
export interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * Props for Drawer component (powered by Radix UI Dialog primitive).
 */
export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export type DividerOrientation = "horizontal" | "vertical";

/**
 * Props for Divider component.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation;
  className?: string;
}

/**
 * Props for TransactionItem component.
 */
export interface TransactionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  amount?: React.ReactNode;
  icon?: React.ReactNode;
  trail?: React.ReactNode;
  className?: string;
}

/**
 * Props for BalanceCard component.
 */
export interface BalanceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  account?: React.ReactNode;
  amount: React.ReactNode;
  footer?: React.ReactNode;
  allowToggleVisibility?: boolean;
  defaultHidden?: boolean;
  isHidden?: boolean;
  onToggleVisibility?: (hidden: boolean) => void;
  className?: string;
}

export type AmountDisplaySize = "sm" | "md" | "lg";
export type AmountDisplayVariant = "positive" | "negative" | "default";

/**
 * Props for AmountDisplay component.
 */
export interface AmountDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: React.ReactNode | number;
  currency?: React.ReactNode;
  size?: AmountDisplaySize;
  variant?: AmountDisplayVariant;
  locale?: string;
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
  className?: string;
}

export type StatusIndicatorStatus = "success" | "warning" | "error" | "info" | "neutral";
export type StatusIndicatorSize = "sm" | "md" | "lg";

/**
 * Props for StatusIndicator component.
 */
export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusIndicatorStatus;
  size?: StatusIndicatorSize;
  label?: React.ReactNode;
  className?: string;
}

export type LayoutGap = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Props for Stack component (vertical layout primitive).
 */
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: LayoutGap;
  className?: string;
  as?: React.ElementType;
}

/**
 * Props for Inline component (horizontal layout primitive).
 */
export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: LayoutGap;
  className?: string;
  as?: React.ElementType;
}

export type ContainerSize = "sm" | "md" | "lg";

/**
 * Props for Container component (max-width container primitive).
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  className?: string;
  as?: React.ElementType;
}

/* ==========================================================================
   v0.2 & v0.3 Components
   ========================================================================== */

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  size?: ModalSize;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: ToastVariant;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  length?: 4 | 6;
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  autoFocus?: boolean;
}

export interface BankInstitution {
  id: string;
  name: string;
  code: string;
  logo?: string;
}

export interface BankSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  banks: BankInstitution[];
  selectedBankId?: string;
  onSelectBank?: (bank: BankInstitution) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export interface WalletCardProps extends React.HTMLAttributes<HTMLDivElement> {
  brand?: "visa" | "mastercard" | "verve" | "amex" | string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

export interface AccountSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> {
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType?: string;
  routingOrSortCode?: string;
  iban?: string;
  balance?: string | number;
  allowToggleVisibility?: boolean;
  defaultHidden?: boolean;
  onCopy?: (field: string, value: string) => void;
}

export type TransferReceiptStatus = "success" | "pending" | "failed";

export interface TransferReceiptProps extends React.HTMLAttributes<HTMLDivElement> {
  reference: string;
  amount: number | string;
  currency?: string;
  status?: TransferReceiptStatus;
  timestamp?: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  senderName?: string;
  senderAccount?: string;
  fee?: number | string;
  allowRedaction?: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}

export interface CurrencyExchangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  baseCurrency: string;
  targetCurrency: string;
  baseAmount?: number | string;
  targetAmount?: number | string;
  exchangeRate: number;
  availableCurrencies?: string[];
  onBaseAmountChange?: (val: string) => void;
  onTargetAmountChange?: (val: string) => void;
  onSwapCurrencies?: () => void;
  onBaseCurrencyChange?: (curr: string) => void;
  onTargetCurrencyChange?: (curr: string) => void;
}

export interface FeeItem {
  label: string;
  amount: number | string;
  isDiscount?: boolean;
}

export interface FeeBreakdownProps extends React.HTMLAttributes<HTMLDivElement> {
  fees: FeeItem[];
  currency?: string;
  totalFee: number | string;
  recipientGets?: number | string;
  exchangeRateNotice?: string;
}

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/* ==========================================================================
   Tier 2 Components (Lending, Credit, Wealth & Compliance)
   ========================================================================== */

export interface LoanCalculationResult {
  principal: number;
  tenureMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
}

export interface LoanCalculatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onCalculate"> {
  minAmount?: number;
  maxAmount?: number;
  stepAmount?: number;
  defaultAmount?: number;
  minTenure?: number;
  maxTenure?: number;
  defaultTenure?: number;
  interestRate?: number;
  currency?: string;
  onCalculate?: (result: LoanCalculationResult) => void;
}

export type CreditScoreBand = "excellent" | "good" | "fair" | "poor";

export interface CreditScoreGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
  minScore?: number;
  maxScore?: number;
  lastUpdated?: string;
}

export interface PortfolioSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  totalValue: number;
  currency?: string;
  returnsValue?: number;
  returnsPercentage: number;
  investedAmount?: number;
  cashBalance?: number;
  apy?: number;
  allowToggleVisibility?: boolean;
  defaultHidden?: boolean;
}

export interface SpendingMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  currentSpent: number;
  limit: number;
  currency?: string;
  warningThreshold?: number;
  dangerThreshold?: number;
}

export interface KycDocUploaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  acceptedFormats?: string;
  maxSizeMb?: number;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
}

export interface CardControlItem {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
  disabled?: boolean;
}

export interface CardControlsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  controls?: CardControlItem[];
  onToggleControl?: (id: string, enabled: boolean) => void;
}

export interface RepaymentInstallment {
  installmentNumber: number;
  dueDate: string;
  amount: number | string;
  principal?: number | string;
  interest?: number | string;
  status: "paid" | "due" | "overdue" | "upcoming";
}

export interface RepaymentScheduleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  currency?: string;
  installments?: RepaymentInstallment[];
  onPayInstallment?: (installmentNumber: number) => void;
}

export interface AssetItem {
  id?: string;
  name: string;
  percentage: number;
  amount?: number | string;
  color?: string;
}

export interface AssetAllocationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  assets?: AssetItem[];
  totalValue?: number | string;
  currency?: string;
}

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showPrevNext?: boolean;
}

export interface AccordionItem {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

export type BiometricAuthType = "face" | "touch";
export type BiometricStatus = "idle" | "authenticating" | "success" | "error";

export interface BiometricAuthPromptProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: BiometricAuthType;
  status?: BiometricStatus;
  title?: React.ReactNode;
  description?: React.ReactNode;
  amount?: number | string;
  currency?: string;
  onAuthenticate?: () => void;
  onUsePasscode?: () => void;
  className?: string;
}

export interface VirtualCardCreationData {
  label: string;
  cardholderName: string;
  limit: number;
  singleUse: boolean;
  lockToMerchant: boolean;
  theme: string;
}

export interface VirtualCardGeneratorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  cardholderName?: string;
  currency?: string;
  defaultLimit?: number;
  maxLimit?: number;
  onCreateCard?: (data: VirtualCardCreationData) => void;
}

export interface BillParticipant {
  id: string;
  name: string;
  shareAmount?: number;
}

export interface SplitBillPaymentRequest {
  totalAmount: number;
  perPersonShare: number;
  participants: BillParticipant[];
}

export interface SplitBillCalculatorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  initialBill?: number;
  currency?: string;
  initialParticipants?: BillParticipant[];
  onRequestPayment?: (data: SplitBillPaymentRequest) => void;
}

export interface TreasuryRateItem {
  tenor: string;
  yieldPercent: number;
  changeBps?: number;
  instrument?: string;
}

export interface YieldCurveTableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  asOfDate?: string;
  rates?: TreasuryRateItem[];
  onSelectTenor?: (rate: TreasuryRateItem) => void;
}

export interface DirectDebitMandateProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  creditorName?: string;
  creditorId?: string;
  mandateReference?: string;
  accountHolderName?: string;
  bankName?: string;
  accountNumberMasked?: string;
  frequency?: string;
  maxAmount?: number | string;
  currency?: string;
  onAuthorize?: () => void;
  onCancel?: () => void;
  className?: string;
}

export interface InvoiceParty {
  name: string;
  address?: string;
  email?: string;
  taxId?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceViewerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status?: "paid" | "due" | "overdue";
  issuer: InvoiceParty;
  client: InvoiceParty;
  items: InvoiceItem[];
  currency?: string;
  taxRate?: number;
  discount?: number;
  notes?: string;
}

export interface ExpenseReceiptData {
  fileName: string;
  merchant: string;
  amount: number;
  category: string;
  reimbursable: boolean;
}

export interface ExpenseReceiptUploaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  currency?: string;
  onSubmitExpense?: (data: ExpenseReceiptData) => void;
}

export interface JournalEntryRow {
  accountCode?: string;
  accountName: string;
  description?: string;
  debit?: number | string;
  credit?: number | string;
}

export interface JournalEntryLedgerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  entryNumber?: string;
  date?: string;
  entries?: JournalEntryRow[];
  currency?: string;
  onPostEntry?: () => void;
}

export interface TaxSummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  jurisdiction?: string;
  currency?: string;
  grossRevenue?: number;
  deductions?: number;
  taxableIncome?: number;
  estimatedTaxLiability?: number;
  dueDate?: string;
  taxRatePercent?: number;
}

export interface ChartAccountNode {
  code: string;
  name: string;
  balance: number | string;
  children?: ChartAccountNode[];
}

export interface ChartOfAccountsTreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  currency?: string;
  accounts?: ChartAccountNode[];
  onSelectAccount?: (account: ChartAccountNode) => void;
}

export interface IbanAccountField {
  label: string;
  value: string;
  copyable?: boolean;
  sensitive?: boolean;
}

export interface IbanAccountDetailsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onCopy"> {
  title?: React.ReactNode;
  accountHolder: string;
  currency?: string;
  railBadge?: string;
  bankName?: string;
  bankAddress?: string;
  fields: IbanAccountField[];
  onCopy?: (label: string, value: string) => void;
}

export interface BeneficiaryItem {
  id: string;
  name: string;
  bankName: string;
  accountMask: string;
  rail: string;
  currency?: string;
  verificationStatus?: "verified" | "pending";
}

export interface BeneficiaryPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  title?: React.ReactNode;
  beneficiaries: BeneficiaryItem[];
  selectedId?: string;
  searchable?: boolean;
  onSelect?: (beneficiary: BeneficiaryItem) => void;
  onAddNew?: () => void;
}

export interface TransferLimitItem {
  id: string;
  label: string;
  rail?: string;
  used: number;
  max: number;
  currency?: string;
  resetText?: string;
}

export interface TransferLimitMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  limits: TransferLimitItem[];
  onRequestIncrease?: (limitId: string) => void;
}

export type StandingOrderStatus = "active" | "paused" | "cancelled";

export interface StandingOrderCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  recipient: string;
  recipientAccount: string;
  amount: number;
  currency?: string;
  frequency: string;
  nextRunDate: string;
  fundingAccount: string;
  reference?: string;
  status?: StandingOrderStatus;
  onTogglePause?: (nextStatus: "active" | "paused") => void;
  onCancel?: () => void;
}

/* --- Flows & End-to-End Journeys --- */

export type FlowStepVariant = "pills" | "numbered" | "progress";
export type KycVerificationStep = "details" | "verify" | "complete" | "profile" | "document" | "liveness" | "review";
export type KycReviewOutcome = "verified" | "manual_review";
export type KycDocType = "passport" | "national_id" | "drivers_license";
export type KycPersonalMethod = "document_selfie" | "bank_id" | "passkey_id";
export type KycBusinessMethod = "upload_bundle" | "invite_director" | "registry_bank";

export interface KycVerificationFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "individual" | "business";
  allowAccountTypeSwitch?: boolean;
  stepVariant?: FlowStepVariant;
  defaultPersonalMethod?: KycPersonalMethod;
  defaultBusinessMethod?: KycBusinessMethod;
  initialCountry?: string;
  countries?: string[];
  estimatedTimeText?: string;
  onComplete?: (payload: {
    country: string;
    accountType: "individual" | "business";
    verificationMethod: KycPersonalMethod | KycBusinessMethod;
    fullName: string;
    taxId: string;
    address: string;
    dobOrIncorporationDate?: string;
    documentType?: KycDocType;
    documentFileName?: string;
    secondaryDocumentFileName?: string;
    beneficialOwnerName?: string;
    beneficialOwnerEmail?: string;
    beneficialOwnerOwnership?: string;
    biometricVerified: boolean;
    outcome: KycReviewOutcome;
  }) => void;
}

export type DepositMethod = "card" | "open_banking" | "wire";

export interface DepositFundingFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  currencies?: string[];
  availableBalance?: number;
  quickAmounts?: number[];
  banks?: BankInstitution[];
  wireDetails?: IbanAccountDetailsProps;
  instantFeePercent?: number;
  simulateError?: "insufficient_funds" | "card_declined" | null;
  onConfirmDeposit?: (payload: {
    method: DepositMethod;
    currency: string;
    amount: number;
    fee: number;
    reference: string;
    bankId?: string;
  }) => Promise<boolean> | boolean | void;
}

export type TransferRail = "ach" | "wire" | "sepa_instant";

export interface MoneyTransferFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  stepVariant?: FlowStepVariant;
  senderName?: string;
  senderAccount?: string;
  sourceCurrency?: string;
  targetCurrency?: string;
  currencies?: string[];
  targetCurrencies?: string[];
  availableBalance?: number;
  dailyLimit?: number;
  exchangeRate?: number;
  rateLockSeconds?: number;
  beneficiaries: BeneficiaryItem[];
  onCompleteTransfer?: (payload: {
    beneficiary: BeneficiaryItem;
    currency: string;
    amount: number;
    rail: TransferRail;
    fee: number;
    reference: string;
  }) => void;
}

export interface WithdrawalDestination {
  id: string;
  label: string;
  mask: string;
  type: "bank" | "debit_card";
  eta: string;
  fee: number;
}

export interface WithdrawalPayoutFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  currencies?: string[];
  availableBalance: number;
  pendingBalance?: number;
  destinations: WithdrawalDestination[];
  limits: TransferLimitItem[];
  requireConfirmationCheck?: boolean;
  onConfirmWithdrawal?: (payload: {
    destination: WithdrawalDestination;
    currency: string;
    amount: number;
    fee: number;
    reference: string;
  }) => Promise<boolean> | boolean | void;
}

export type StepUpFactor = "biometric" | "otp" | "pin";

export interface StepUpAuthFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  actionSummary: string;
  amount?: number;
  currency?: string;
  recipient?: string;
  defaultFactor?: StepUpFactor;
  maxAttempts?: number;
  onVerify?: (payload: { factor: StepUpFactor; code?: string }) => Promise<boolean> | boolean;
  onResendCode?: () => void;
  onCancel?: () => void;
}

export interface AccountOpeningFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "individual" | "business";
  initialCurrency?: string;
  currencies?: string[];
  countries?: string[];
  onComplete?: (payload: {
    accountType: "individual" | "business";
    name: string;
    country: string;
    currency: string;
    accountNumber: string;
    status: "created" | "manual_review";
  }) => void;
}

export interface BillBillerItem {
  id: string;
  name: string;
  category: string;
  accountMask: string;
  dueDate?: string;
  suggestedAmount?: number;
}

export interface BillPaymentFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  currencies?: string[];
  billers?: BillBillerItem[];
  feeAmount?: number;
  onPayBill?: (payload: {
    billerName: string;
    accountReference: string;
    currency: string;
    amount: number;
    fee: number;
    reference: string;
  }) => Promise<boolean> | boolean | void;
}

export type ManagedCardStatus = "inactive" | "active" | "frozen" | "replacing";

export interface CardManagementFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  brand?: "visa" | "mastercard" | "verve" | "amex" | string;
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  currency?: string;
  initialStatus?: ManagedCardStatus;
  dailyLimit?: number;
  monthlyLimit?: number;
  usedToday?: number;
  onCardAction?: (payload: {
    action: "activate" | "freeze" | "unfreeze" | "set_limit" | "replace";
    limit?: number;
    reason?: string;
  }) => Promise<boolean> | boolean | void;
}

export interface DisputeTransactionItem {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  currency?: string;
  cardMask?: string;
}

export interface DisputeClaimFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  transactions?: DisputeTransactionItem[];
  onSubmitClaim?: (payload: {
    transaction: DisputeTransactionItem;
    reason: string;
    notes: string;
    evidenceFileName?: string;
    claimId: string;
  }) => void;
}

export type RecurringFrequency = "weekly" | "biweekly" | "monthly" | "quarterly";

export interface RecurringPaymentFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  currencies?: string[];
  fundingAccount?: string;
  beneficiaries?: BeneficiaryItem[];
  onCreateSchedule?: (payload: {
    payee: string;
    account: string;
    amount: number;
    currency: string;
    frequency: RecurringFrequency;
    startDate: string;
    endDate?: string;
    scheduleId: string;
  }) => void;
}

export interface FXConversionFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  fromCurrency?: string;
  toCurrency?: string;
  currencies?: string[];
  availableBalance?: number;
  exchangeRate?: number;
  feePercent?: number;
  rateLockSeconds?: number;
  onConvert?: (payload: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    fee: number;
    rate: number;
    reference: string;
  }) => void;
}

export interface LoanApplicationFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currency?: string;
  currencies?: string[];
  onAcceptOffer?: (payload: {
    accountType: "personal" | "business";
    amount: number;
    currency: string;
    purpose: string;
    termMonths: number;
    aprPercent: number;
    monthlyPayment: number;
    applicationId: string;
  }) => void;
  onDeclineOffer?: () => void;
}

export interface BeneficiaryManagementFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  currencies?: string[];
  initialBeneficiaries?: BeneficiaryItem[];
  requireVerifyCode?: boolean;
  onSaveBeneficiary?: (beneficiary: BeneficiaryItem) => void;
  onRemoveBeneficiary?: (beneficiaryId: string) => void;
}

export interface StatementAccountOption {
  id: string;
  label: string;
  mask: string;
  currency: string;
}

export interface StatementExportFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  accounts?: StatementAccountOption[];
  defaultEmail?: string;
  onExport?: (payload: {
    accountId: string;
    dateRange: string;
    format: "pdf" | "csv";
    delivery: "download" | "email";
    email?: string;
    fileName: string;
  }) => void;
}

export interface CloseAccountFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  accountType?: "personal" | "business";
  accountName?: string;
  currency?: string;
  remainingBalance?: number;
  destinations?: { id: string; label: string; mask: string }[];
  onConfirmClose?: (payload: {
    reason: string;
    feedback?: string;
    destinationId?: string;
    reference: string;
  }) => void;
  onCancel?: () => void;
}

/* --- Security & Protection Components --- */

export interface SessionTimeoutModalProps {
  /**
   * Whether the inactivity dialog is open.
   */
  open: boolean;
  /**
   * Controlled open state change callback.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Total warning countdown seconds before forced logout. Defaults to 60.
   */
  countdownSeconds?: number;
  /**
   * Title shown in the modal header. Defaults to "Session Expiring Soon".
   */
  title?: string;
  /**
   * Description shown under the title.
   */
  description?: string;
  /**
   * Callback fired when the user chooses to stay signed in / extend their session.
   */
  onExtendSession?: () => void;
  /**
   * Callback fired when countdown reaches 0 and the user is timed out.
   */
  onTimeout?: () => void;
  /**
   * Callback fired when the user explicitly clicks "Log out now".
   */
  onLogout?: () => void;
  /**
   * Optional custom className.
   */
  className?: string;
}

export type VirtualCardTheme = "dark" | "gradient" | "emerald" | "platinum";
export type VirtualCardBrand = "visa" | "mastercard" | "amex" | string;

export interface VirtualCardRevealProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onCopy"> {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  brand?: VirtualCardBrand;
  currency?: string;
  autoMaskSeconds?: number;
  defaultRevealed?: boolean;
  theme?: VirtualCardTheme;
  onAuthenticate?: () => Promise<boolean> | boolean | void;
  onCopy?: (field: "pan" | "cvv" | "expiry", value: string) => void;
}

export type DeviceType = "desktop" | "mobile" | "tablet" | "browser";

export interface DeviceSessionItem {
  id: string;
  deviceName: string;
  deviceType: DeviceType;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface DeviceManagementCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: string;
  devices: DeviceSessionItem[];
  onRevokeDevice?: (deviceId: string) => Promise<boolean> | void;
  onRevokeAllOthers?: () => Promise<boolean> | void;
}

export interface CreditUtilizationMeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  creditLimit: number;
  currentBalance: number;
  currency?: string;
  statementCloseDate?: string;
  minimumDue?: number;
  utilizationPercent?: number;
  optimalThreshold?: number;
  warningThreshold?: number;
}

export type PerformanceTimeframe = "1D" | "1W" | "1M" | "1Y" | "ALL";

export interface PerformanceDataPoint {
  label: string;
  value: number;
}

export interface PerformanceChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  symbol: string;
  name: string;
  currentPrice?: number;
  timeframe?: PerformanceTimeframe;
  defaultTimeframe?: PerformanceTimeframe;
  onTimeframeChange?: (timeframe: PerformanceTimeframe) => void;
  returnPercent: number;
  returnAmount: number;
  currency?: string;
  benchmarkName?: string;
  benchmarkReturn?: number;
  dataPoints: PerformanceDataPoint[];
}

export type OrderSide = "buy" | "sell";
export type OrderType = "market" | "limit" | "stop";

export interface OrderSubmissionPayload {
  symbol: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  limitPrice?: number;
  stopPrice?: number;
  estimatedTotal: number;
}

export interface OrderEntryTicketProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  symbol: string;
  companyName?: string;
  currentPrice: number;
  buyingPower: number;
  availableShares?: number;
  currency?: string;
  defaultSide?: OrderSide;
  defaultOrderType?: OrderType;
  estimatedFee?: number;
  onSubmitOrder?: (order: OrderSubmissionPayload) => Promise<void> | void;
}

export interface ReconciliationEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  reference?: string;
  matchedWithId?: string;
}

export interface BankReconciliationMatcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  currency?: string;
  bankEntries: ReconciliationEntry[];
  ledgerEntries: ReconciliationEntry[];
  onMatch?: (bankEntryId: string, ledgerEntryId: string) => void;
  onUnmatch?: (bankEntryId: string, ledgerEntryId: string) => void;
}

export type CashFlowHorizon = "30D" | "60D" | "90D";

export interface CashFlowPeriod {
  label: string;
  inflows: number;
  outflows: number;
}

export interface CashFlowForecastCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  currency?: string;
  startingCash: number;
  monthlyBurnRate: number;
  horizon?: CashFlowHorizon;
  defaultHorizon?: CashFlowHorizon;
  onHorizonChange?: (horizon: CashFlowHorizon) => void;
  periods: CashFlowPeriod[];
}

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditTrailEvent {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource?: string;
  timestamp: string;
  ipAddress?: string;
  mfaVerified?: boolean;
  severity?: AuditSeverity;
}

export interface AuditTrailTimelineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: string;
  events: AuditTrailEvent[];
}

export interface TradeExecutionFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  symbol: string;
  companyName: string;
  currentPrice: number;
  buyingPower: number;
  availableShares?: number;
  currency?: string;
  returnPercent: number;
  returnAmount: number;
  benchmarkName?: string;
  benchmarkReturn?: number;
  dataPoints: PerformanceDataPoint[];
  estimatedFee?: number;
  onExecuteOrder?: (order: OrderSubmissionPayload) => Promise<{ orderId?: string } | void> | void;
}

export interface MonthEndCloseFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  periodLabel: string;
  currency?: string;
  bankEntries: ReconciliationEntry[];
  ledgerEntries: ReconciliationEntry[];
  startingCash: number;
  monthlyBurnRate: number;
  cashFlowPeriods: CashFlowPeriod[];
  auditEvents: AuditTrailEvent[];
  onClosePeriod?: (summary: { periodLabel: string; matchedCount: number }) => Promise<void> | void;
}

export interface SecurityCenterFlowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  devices: DeviceSessionItem[];
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
  cardBrand?: VirtualCardBrand;
  sessionTimeoutSeconds?: number;
  onRevokeDevice?: (deviceId: string) => Promise<boolean> | void;
  onEmergencyLockdown?: () => Promise<void> | void;
}









