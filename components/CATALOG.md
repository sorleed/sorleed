# Sorleed component catalogue

This is the canonical list of **implemented** Sorleed components. It documents
only what the current contracts and CSS support. Do not treat planned components
as available.

| Component | Status | Contract | CSS | Native reference | Runnable example |
|---|---|---|---|---|---|
| Button | Implemented | [`sorleed.button` 1.0.0](./button/contract.json) | [`button.css`](./button/button.css) | [`button.html`](./button/button.html) | [Payment form](../examples/payment-form/README.md), [transaction history](../examples/transaction-history/README.md) |
| Input | Implemented | [`sorleed.input` 1.0.0](./input/contract.json) | [`input.css`](./input/input.css) | [`input.html`](./input/input.html) | [Payment form](../examples/payment-form/README.md), [transaction history](../examples/transaction-history/README.md) |
| PasswordInput | Implemented | [`sorleed.password-input` 1.0.0](./password-input/contract.json) | [`password-input.css`](./password-input/password-input.css) | [`password-input.html`](./password-input/password-input.html) | No runnable example; reference page only |
| PhoneInput | Implemented | [`sorleed.phone-input` 1.0.0](./phone-input/contract.json) | [`phone-input.css`](./phone-input/phone-input.css) | [`phone-input.html`](./phone-input/phone-input.html) | No runnable example; reference page only |

All four components are framework-agnostic CSS plus native HTML. A
private-alpha React adapter and CLI also exist, but they are not published and
are not required to use the components. Load
[`tokens/dist/tokens.css`](../tokens/dist/tokens.css) before the component CSS;
the component stylesheets do not import it. See the
[usage guide](./USAGE-GUIDE.md) and [token guide](../tokens/README.md).

## Button

**Purpose:** the action control for a form, dialog, panel or review step. One
text label only; no icons, badges or nested controls.

### Public API

| Need | Native markup |
|---|---|
| Primary (default) | `<button class="sl-button" type="submit">Review payment</button>` |
| Optional explicit primary alias | `<button class="sl-button sl-button--primary" type="button">Continue</button>` |
| Secondary | `<button class="sl-button sl-button--secondary" type="button">Cancel</button>` |
| Ghost (low emphasis, supported light surfaces) | `<button class="sl-button sl-button--ghost" type="button">View details</button>` |
| Disabled | Add the native `disabled` attribute. |

- Always set an explicit `type` (`button`, `submit` or `reset`).
- Use one Primary per decision group; pair it with Secondary or Ghost.
- Variants are CSS classes. State is browser-derived; there is no `variant`,
  `state`, `focused` or `filled` runtime prop.
- Public modifiers are only `.sl-button`, `.sl-button--primary`,
  `.sl-button--secondary` and `.sl-button--ghost`.

### States and styles

- Figma documents five states: Default, Hover, Active, Focus and Disabled.
- Production derives `disabled > active > hover > default`; the focus ring is an
  additive `:focus-visible` overlay, suppressed when disabled.
- The component consumes 22 `--sl-button-*` component tokens from
  `tokens/dist/tokens.css`. No other token layer is used by the component.
- Required stylesheet order: token CSS, then `button/button.css`.

### Accessibility and ownership

**Sorleed provides:** native `<button>` styling, 40px height, 6px radius, 16px
horizontal padding, focus ring, disabled treatment, forced-colors fallback and
the documented variant classes.

**The application provides:** the visible label, explicit `type`, click or
form-submit handling, loading/status messaging outside the button, navigation
links (use a link, not a button), validation, and any layout width.

Do not use Button for navigation, icon-only actions, loading spinners, danger
styling, toggles, `aria-pressed`, or Ghost on inverse/dark surfaces. No icon,
loading, size, danger or full-width variant exists. Do not use
`role="button"` on a non-button element.

Links: [canonical contract](./button/contract.json),
[human documentation](./button/README.md),
[implementation guide](./IMPLEMENTATION.md),
[native reference](./button/button.html),
[browser runbook](./test/BROWSER-TESTING.md).

## Input

**Purpose:** a complete single-line text field — persistent label, native
control and one helper/error row. It renders state; it does not validate, format,
mask, submit or announce errors by itself.

### Public API and anatomy

```html
<div class="sl-input">
  <label class="sl-input__label" for="recipient-name">Recipient name</label>
  <div class="sl-input__control">
    <input
      class="sl-input__field"
      id="recipient-name"
      name="recipientName"
      type="text"
      autocomplete="name"
      aria-describedby="recipient-name-message"
    >
  </div>
  <p class="sl-input__message" id="recipient-name-message">
    Use a fictional recipient name.
  </p>
</div>
```

| Class / attribute | Meaning |
|---|---|
| `.sl-input` | Field wrapper. |
| `.sl-input__label` | Persistent visible label; keep `for`/`id`. |
| `.sl-input__label--visually-hidden` | Visually hides the label while keeping it accessible. |
| `.sl-input__control` | Positioning context for the focus overlay. |
| `.sl-input__field` | The native `<input>`. |
| `.sl-input__message` | Helper text. |
| `.sl-input__message--error` | Error text; place in the same row as the helper. |
| `aria-invalid="true"` | Application-owned error flag; drives the error border. |
| `aria-describedby` | Points at the helper or error message. |

Supported single-line types are `text`, `email`, `tel`, `number` and `url`.
Supply `inputmode`, `autocomplete`, `name`, `required` and constraints where
appropriate.

### States and styles

- Figma states: Default, Hover, Error, Disabled.
- Error is rendered only when the application sets `aria-invalid="true"` and
  supplies an error message. The message is required; never use a red border
  alone.
- Disabled uses the native `disabled` attribute and wins over Error, Hover and
  Focus. Clear or withhold error presentation while disabled.
- Focus is an independent `:focus-visible` overlay, suppressed when disabled.
- Input consumes 28 `--sl-input-*` component tokens from
  `tokens/dist/tokens.css`. Required stylesheet order: token CSS, then
  `input/input.css`.
- Input uses `:has()` for the focus overlay and disabled suppression. The
  documented baseline is Chrome/Edge 105+, Safari 15.4+ and Firefox 121+; no
  fallback is bundled.

### Accessibility and ownership

**Sorleed provides:** the field anatomy, label and helper layout, native input
styling, error border keyed to `aria-invalid`, focus overlay, disabled treatment
and forced-colors fallback.

**The application provides:** the label copy, value, placeholder hint, helper
and error copy, `aria-invalid`, `aria-describedby`/error association, validation
timing, error announcement, `type`, `inputmode`, `autocomplete`, `name`,
`required`, formatting and submission. Validate on blur or submit, not on every
keystroke, and move focus to the first invalid field.

Do not use Input for password, search, textarea, select, OTP, currency, PIN or
read-only fields. Do not use it on inverse/dark surfaces. Do not hide the label
without an accessible name. Do not invent `state`, `focused`, `filled`,
`showPlaceholder` or `showHelper` props/attributes. Do not put icons, clear
buttons, password reveals or inline actions inside the field.

Links: [canonical contract](./input/contract.json),
[human documentation](./input/README.md),
[implementation guide](./IMPLEMENTATION.md),
[native reference](./input/input.html),
[browser runbook](./test/BROWSER-TESTING.md).

## PasswordInput

**Purpose:** a password field with a persistent label, masked native input, a
native show/hide button and one helper/error row. It changes the input `type`
only; it never formats, trims or logs the entered value.

### Public API and anatomy

```html
<div class="sl-password-input">
  <label class="sl-password-input__label" for="password">Password</label>
  <div class="sl-password-input__control">
    <input
      class="sl-password-input__field"
      id="password"
      name="password"
      type="password"
      autocomplete="current-password"
      aria-describedby="password-helper"
    >
    <button
      type="button"
      class="sl-password-input__toggle"
      aria-label="Show password"
      aria-pressed="false"
    >Show password</button>
  </div>
  <p class="sl-password-input__message" id="password-helper">
    Use at least 12 characters.
  </p>
</div>
```

| Class / attribute | Meaning |
|---|---|
| `.sl-password-input` | Field wrapper. |
| `.sl-password-input__label` | Persistent visible label; keep `for`/`id`. |
| `.sl-password-input__label--visually-hidden` | Visually hides the label while keeping it accessible. |
| `.sl-password-input__control` | Positioning context for the field and toggle. |
| `.sl-password-input__field` | The native password input. |
| `.sl-password-input__toggle` | Native `<button type="button">` with an accessible name and `aria-pressed`. |
| `.sl-password-input__message` | Helper text. |
| `.sl-password-input__message--error` | Error text; pair with `aria-invalid="true"`. |

- The toggle is never a `div` or `span`.
- Visibility is independent of state: masked uses `type="password"` and
  `aria-pressed="false"`; revealed uses `type="text"` and `aria-pressed="true"`.
- `autoComplete` should be `current-password` for sign-in and `new-password` for
  registration.
- Password strength, breach checks, caps-lock warnings and confirmation fields
  are **not** part of this component.

### States and styles

- States: Default, Hover, Error, Disabled. Focus is an independent overlay.
- Precedence: **Disabled > Error > Hover > Default**.
- PasswordInput composes 27 `input.*` tokens, 5 `button.*` tokens and 4
  primitives (`font.size.xs`, `font.line-height.xs`, `space.12`, `space.4`).
- The four primitive dependencies are a documented draft limitation. There is no
  `password-input.*` token family.
- Figma reference: **unresolved**. `canonical.figma` is `null`; no node ID or
  variant ID is asserted.

Links: [canonical contract](./password-input/contract.json),
[human documentation](./password-input/README.md),
[native reference](./password-input/password-input.html).

## PhoneInput

**Purpose:** an international phone field with a persistent label, a native
country selector, a native `type="tel"` input and one helper/error row. It
separates editing text, an optional E.164 value and validation status.

### Public API and anatomy

```html
<div class="sl-phone-input">
  <label class="sl-phone-input__label" for="phone">Phone number</label>
  <div class="sl-phone-input__row">
    <div class="sl-phone-input__country">
      <label class="sl-phone-input__country-label" for="phone-country">Country</label>
      <select class="sl-phone-input__country-select" id="phone-country">
        <option value="">Select a country</option>
        <option value="GB">United Kingdom (+44)</option>
        <option value="US">United States (+1)</option>
      </select>
    </div>
    <div class="sl-phone-input__control">
      <input
        class="sl-phone-input__field"
        id="phone"
        name="phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        aria-describedby="phone-helper"
      >
    </div>
  </div>
  <p class="sl-phone-input__message" id="phone-helper">
    Include your country code.
  </p>
</div>
```

| Class / attribute | Meaning |
|---|---|
| `.sl-phone-input` | Field wrapper. |
| `.sl-phone-input__label` | Persistent visible label; keep `for`/`id`. |
| `.sl-phone-input__label--visually-hidden` | Visually hides the label while keeping it accessible. |
| `.sl-phone-input__row` | Country selector plus number input. |
| `.sl-phone-input__country` | Country selector container. |
| `.sl-phone-input__country-label` | Label for the country selector. |
| `.sl-phone-input__country-select` | Native country `<select>` with full names and dial codes. |
| `.sl-phone-input__control` | Number input container. |
| `.sl-phone-input__field` | Native `type="tel"` input. |
| `.sl-phone-input__message` | Helper text. |
| `.sl-phone-input__message--error` | Error text; pair with `aria-invalid="true"`. |

- No default country is forced, and IP geolocation is forbidden.
- Calling codes are not unique; show full country names and allow
  disambiguation.
- `isValid` means format validity only. It never proves the number is active,
  reachable or owned.
- A searchable country picker is **not** implemented; the canonical control is a
  native `<select>`.

### States and styles

- States: Default, Hover, Error, Disabled. Focus is an independent overlay.
- Precedence: **Disabled > Error > Hover > Default**.
- PhoneInput consumes exactly 31 `phone-input.*` component tokens and no other
  token layer.
- Figma reference: **unresolved**. `canonical.figma` is `null`; no node ID or
  variant ID is asserted.

Links: [canonical contract](./phone-input/contract.json),
[human documentation](./phone-input/README.md),
[native reference](./phone-input/phone-input.html).

## Not implemented

The following are planned, deferred or illustrative only and must not be
presented as available: Card, Badge, Transaction Item, Select, Search Input,
Textarea, OTP Input, Currency Input, PIN Input, Checkbox, Radio, Switch, Modal,
Tabs, Tooltip and Toast.

There is no published package. A private-alpha React adapter and CLI exist in
this repository but are not part of the published surface.

## Next step

Use the [contract-first usage guide](./USAGE-GUIDE.md) before writing a new
interface. If a required variant or state is not in this catalogue, stop and
propose a contract change rather than inventing one.
