# Component Reference

Only these four components exist. Do not invent additional components or props.

## Button

Native `<button>` wrapper. Variants: `primary` (default), `secondary`, `ghost`.

```tsx
import { Button } from "@sorleed/react";

<Button variant="primary" type="button">Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
<Button disabled>Unavailable</Button>
```

Props: all native `ButtonHTMLAttributes<HTMLButtonElement>` plus
`variant?: "primary" | "secondary" | "ghost"`. Default `type` is `button`.

States: default, hover, active, focus-visible, disabled. Disabled wins over all
other states.

## Input

Native `<input>` with a required visible or visually hidden label.

```tsx
import { Input } from "@sorleed/react";

<Input label="Email" type="email" placeholder="you@example.com" />
<Input label="Name" helperText="Enter your full name." />
<Input
  label="Account number"
  value={value}
  onChange={(event) => setValue(event.target.value)}
  errorMessage={error}
/>
```

Props: native `InputHTMLAttributes<HTMLInputElement>` (excluding `type`) plus:

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required accessible label. |
| `hideLabel` | `boolean` | Visually hide the label, keep the accessible name. |
| `helperText` | `string` | Shown when there is no error. |
| `errorMessage` | `string` | Replaces helper text and sets `aria-invalid="true"`. |
| `type` | `"text" \| "email" \| "tel" \| "number" \| "url"` | Other types are out of scope. |
| `id` | `string` | Generated with `useId` when omitted. |

States: default, hover, focus-visible, error, disabled. The application owns
validation timing and error copy.

## PasswordInput

Native password input with a visibility toggle.

```tsx
import { PasswordInput } from "@sorleed/react";

<PasswordInput
  label="Password"
  autoComplete="current-password"
  helperText="Use at least 12 characters."
/>
<PasswordInput label="New password" autoComplete="new-password" />
```

Props: native `InputHTMLAttributes<HTMLInputElement>` (excluding `type`) plus
`label`, `hideLabel`, `helperText`, `errorMessage`, `showPasswordLabel`
(default `"Show password"`), `hidePasswordLabel` (default `"Hide password"`),
`visible`, `defaultVisible` and `onVisibleChange`.

The toggle is a real `<button type="button">` with `aria-pressed`.

## PhoneInput

Phone number field with a native country selector and optional
`libphonenumber-js` validation.

```tsx
import { PhoneInput } from "@sorleed/react/phone-input";

<PhoneInput
  label="Phone number"
  helperText="Include your country code."
  onChange={({ inputValue, e164, country, status, isValid }) => {
    // The application decides what to display.
  }}
/>
```

Props: native input attributes (excluding `type`, `value`, `onChange`) plus:

| Prop | Type | Notes |
|---|---|---|
| `label` | `string` | Required. |
| `hideLabel` | `boolean` | Visually hidden label. |
| `helperText` | `string` | Shown when there is no error. |
| `errorMessage` | `string` | Sets `aria-invalid="true"` and replaces helper text. |
| `value` | `string` | Controlled editing value. |
| `defaultValue` | `string` | Uncontrolled initial value. |
| `country` | `string` | Controlled ISO 3166-1 alpha-2 country. |
| `defaultCountry` | `string` | Uncontrolled initial country. |
| `onCountryChange` | `(country?: string) => void` | Called on selector change. |
| `countries` | `string[]` | ISO allow-list. |
| `international` | `boolean` | Accepted for compatibility; does not change behaviour yet. |
| `onChange` | `(result: PhoneInputChangeResult) => void` | Reports editing value and status. |

`PhoneInputChangeResult`:

```ts
interface PhoneInputChangeResult {
  inputValue: string;
  e164?: string;
  country?: string;
  status: "empty" | "incomplete" | "invalid" | "valid";
  isValid: boolean;
}
```

Country names come from `Intl.DisplayNames` in English, with a two-letter code
fallback. No IP geolocation and no forced default country.

`isValid` means numbering-plan format validity only. It does not prove that a
number is active, reachable or owned.
