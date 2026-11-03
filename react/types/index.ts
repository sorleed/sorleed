import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant. Defaults to "primary".
   * Maps to fc-button--primary/secondary/ghost classes per contract.
   */
  variant?: ButtonVariant;
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
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

