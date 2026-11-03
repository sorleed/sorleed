# FinCore component catalogue

This is the canonical list of **implemented** FinCore components. It documents
only what the current contracts and CSS support. Do not treat planned components
as available.

| Component | Status | Contract | CSS | Native reference | Runnable example |
|---|---|---|---|---|---|
| Button | Implemented | [`fincore.button` 1.0.0](./button/contract.json) | [`button.css`](./button/button.css) | [`button.html`](./button/button.html) | [Payment form](../examples/payment-form/README.md), [transaction history](../examples/transaction-history/README.md) |
| Input | Implemented | [`fincore.input` 1.0.0](./input/contract.json) | [`input.css`](./input/input.css) | [`input.html`](./input/input.html) | [Payment form](../examples/payment-form/README.md), [transaction history](../examples/transaction-history/README.md) |

Both components are framework-agnostic CSS plus native HTML. There is no React,
Vue, Web Component, JavaScript runtime or package export. Load
[`tokens/dist/tokens.css`](../tokens/dist/tokens.css) before the component CSS;
the component stylesheets do not import it. See the
[usage guide](./USAGE-GUIDE.md) and [token guide](../tokens/README.md).

## Button

**Purpose:** the action control for a form, dialog, panel or review step. One
text label only; no icons, badges or nested controls.

### Public API

| Need | Native markup |
|---|---|
| Primary (default) | `<button class="fc-button" type="submit">Review payment</button>` |
| Optional explicit primary alias | `<button class="fc-button fc-button--primary" type="button">Continue</button>` |
| Secondary | `<button class="fc-button fc-button--secondary" type="button">Cancel</button>` |
| Ghost (low emphasis, supported light surfaces) | `<button class="fc-button fc-button--ghost" type="button">View details</button>` |
| Disabled | Add the native `disabled` attribute. |

- Always set an explicit `type` (`button`, `submit` or `reset`).
- Use one Primary per decision group; pair it with Secondary or Ghost.
- Variants are CSS classes. State is browser-derived; there is no `variant`,
  `state`, `focused` or `filled` runtime prop.
- Public modifiers are only `.fc-button`, `.fc-button--primary`,
  `.fc-button--secondary` and `.fc-button--ghost`.

### States and styles

- Figma documents five states: Default, Hover, Active, Focus and Disabled.
- Production derives `disabled > active > hover > default`; the focus ring is an
  additive `:focus-visible` overlay, suppressed when disabled.
- The component consumes 22 `--fc-button-*` component tokens from
  `tokens/dist/tokens.css`. No other token layer is used by the component.
- Required stylesheet order: token CSS, then `button/button.css`.

### Accessibility and ownership

**FinCore provides:** native `<button>` styling, 40px height, 6px radius, 16px
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
<div class="fc-input">
  <label class="fc-input__label" for="recipient-name">Recipient name</label>
  <div class="fc-input__control">
    <input
      class="fc-input__field"
      id="recipient-name"
      name="recipientName"
      type="text"
      autocomplete="name"
      aria-describedby="recipient-name-message"
    >
  </div>
  <p class="fc-input__message" id="recipient-name-message">
    Use a fictional recipient name.
  </p>
</div>
```

| Class / attribute | Meaning |
|---|---|
| `.fc-input` | Field wrapper. |
| `.fc-input__label` | Persistent visible label; keep `for`/`id`. |
| `.fc-input__label--visually-hidden` | Visually hides the label while keeping it accessible. |
| `.fc-input__control` | Positioning context for the focus overlay. |
| `.fc-input__field` | The native `<input>`. |
| `.fc-input__message` | Helper text. |
| `.fc-input__message--error` | Error text; place in the same row as the helper. |
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
- Input consumes 28 `--fc-input-*` component tokens from
  `tokens/dist/tokens.css`. Required stylesheet order: token CSS, then
  `input/input.css`.
- Input uses `:has()` for the focus overlay and disabled suppression. The
  documented baseline is Chrome/Edge 105+, Safari 15.4+ and Firefox 121+; no
  fallback is bundled.

### Accessibility and ownership

**FinCore provides:** the field anatomy, label and helper layout, native input
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

## Not implemented

The following are planned or illustrative only and must not be presented as
available: Card, Badge, Transaction Item, Select, Password Input, Search Input,
Textarea, OTP Input, Currency Input, PIN Input, Checkbox, Radio, Switch, Modal,
Tabs, Tooltip and Toast. There is no component runtime or package.

## Next step

Use the [contract-first usage guide](./USAGE-GUIDE.md) before writing a new
interface. If a required variant or state is not in this catalogue, stop and
propose a contract change rather than inventing one.
