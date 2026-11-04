export { Button, default as ButtonDefault } from "./button";
export { Input, default as InputDefault } from "./input";
export { PasswordInput, default as PasswordInputDefault } from "./password-input";

// PhoneInput is intentionally a subpath export:
//   import { PhoneInput } from "@sorleed/react/phone-input";
// It imports the optional peer dependency libphonenumber-js. Exporting it from
// the package root would make that dependency mandatory for every consumer.
export type {
  ButtonProps,
  ButtonVariant,
  InputProps,
  PasswordInputProps,
  PhoneInputProps,
  PhoneInputChangeResult,
  PhoneInputStatus,
} from "./types";
