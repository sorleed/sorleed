# PasswordInput

Sorleed PasswordInput is a password field with a visible label, a masked native
input, a show/hide toggle and a helper or error row. It is implemented as
framework-agnostic CSS plus native HTML reference markup, with a private-alpha
React adapter.

The canonical stylesheet is `components/password-input/password-input.css`. It
composes the existing `input.*` and `button.*` component tokens plus four
documented primitive tokens. It does not introduce a `password-input.*` token
family.

## 1. What it is

- A native `<input>` whose `type` switches between `password` and `text`.
- A native `<button type="button">` toggle with `aria-pressed` and a text label.
- A label that can be visually hidden without losing its programmatic
  association.
- A helper row that becomes an error row when `errorMessage` is supplied.
- A field that preserves the exact entered value when visibility changes.

It is not a password-strength meter, breach checker, caps-lock warning,
confirmation field, OTP field, PIN field or general text field.

## 2. When to use PasswordInput

Use it when:

- collecting a password or passphrase for sign-in, registration or account
  security;
- the user may need to reveal the value to avoid typing errors;
- the form needs a visible label, helper copy and an application-owned error.

Do not use it:

- for non-secret text, search, OTP, PIN or currency entry;
- to add strength, breach or caps-lock features that this contract does not
  define;
- as a replacement for a dedicated confirmation-password flow.

## 3. Anatomy

```
.sl-password-input
  .sl-password-input__label
  .sl-password-input__control
    .sl-password-input__field      (input type=password or text)
    .sl-password-input__toggle     (button type=button)
  .sl-password-input__message      (helper or error)
```

The label is associated with the input through `for`/`id`. The toggle is a
native button; it is never a `div` or `span`. The message row carries either
helper copy or error copy, never both.

## 4. States and precedence

| State | Field | Message | Toggle |
| --- | --- | --- | --- |
| Default | `input.background`, `input.border`, `input.text` | `input.helper.color` | Ghost button tokens |
| Hover | `input.border-hover` | unchanged | `button.ghost.background-hover` |
| Error | `input.border-error`, `input.text` | `input.text-error` | unchanged |
| Disabled | `input.background-disabled`, `input.border-disabled`, `input.text-disabled` | helper colour | disabled, 0.5 opacity |

Precedence is **Disabled > Error > Hover > Default**. Error suppresses the
hover border. Disabled suppresses hover, error and the focus ring. Focus is an
independent overlay, not a fifth state.

Visibility is independent of state:

- `Visible=false`: input `type=password`, toggle label `Show password`,
  `aria-pressed=false`.
- `Visible=true`: input `type=text`, toggle label `Hide password`,
  `aria-pressed=true`.

## 5. Validation and application responsibilities

The component renders the value; it does not own password policy. The
application must:

- decide when validation runs (blur or submit, not every keystroke);
- supply `errorMessage`, set `aria-invalid`, and connect the message;
- announce new errors once and move focus to the first invalid field;
- choose `autoComplete="current-password"` for sign-in and
  `autoComplete="new-password"` for registration;
- provide a visible required indication when `required` is set;
- never log, persist or transmit the entered password outside the form flow.

## 6. Token dependencies

The stylesheet consumes 36 variables:

- 27 `input.*` component tokens for the field, label, focus ring, helper and
  states;
- 5 `button.*` component tokens for the Ghost toggle (foreground, hover and
  active backgrounds, focus colour and width);
- 4 primitives: `font.size.xs`, `font.line-height.xs`, `space.12` and
  `space.4`.

The primitive use is a **draft limitation**. There is no `password-input.*`
token family yet. Do not add one without a token-source change and a new
contract version.

Load `tokens/dist/tokens.css` before the component stylesheet. The component
stylesheet does not import token CSS automatically.

## 7. Accessibility

- Every field has a programmatic label. `hideLabel` renders the label visually
  hidden, never absent.
- The toggle has a native button role, an accessible name and `aria-pressed`
  matching the visibility state.
- Helper text is connected with `aria-describedby`. Error text is connected
  with `aria-describedby`, and `aria-invalid=true` is set only when an error is
  present.
- Disabled uses the native `disabled` attribute on both controls; the toggle is
  removed from the tab order.
- Keyboard focus must be visible on both the input and the toggle.
- Error is communicated by a border and text, not colour alone.

The repository does not claim browser rendering, screen-reader or cross-browser
verification for this component. The browser baseline for the focus overlay and
`:has()`-based disabled suppression is Chrome/Edge 105+, Safari 15.4+ and
Firefox 121+; no fallback is bundled.

## 8. Native HTML and CSS

```html
<div class="sl-password-input">
  <label class="sl-password-input__label" for="password">Password</label>
  <div class="sl-password-input__control">
    <input
      class="sl-password-input__field"
      id="password"
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

The application toggles the input `type`, the button label and `aria-pressed`.
See `password-input.html` for a runnable reference page.

## 9. React adapter (private alpha)

```tsx
import { PasswordInput } from "@sorleed/react/password-input";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/password-input.css";

<PasswordInput
  id="password"
  label="Password"
  autoComplete="current-password"
  helperText="Use at least 12 characters."
/>
```

The adapter is a private alpha. It is not published and is not represented as
production-ready. It supports controlled and uncontrolled visibility,
`onVisibleChange`, `errorMessage`, `helperText`, `disabled`, `required` and
forwarded refs. It defaults `autoComplete` to `current-password`; override it
for registration.

## 10. Examples

### Error after failed validation

```tsx
<PasswordInput
  id="password"
  label="Password"
  autoComplete="current-password"
  errorMessage="Enter your password."
/>
```

`errorMessage` replaces helper copy and sets `aria-invalid=true`.

### Controlled visibility

```tsx
<PasswordInput
  id="password"
  label="Password"
  visible={showPassword}
  onVisibleChange={setShowPassword}
/>
```

The parent owns visibility; the toggle reports the requested next state.

### Disabled field with an explanation

```tsx
<PasswordInput
  id="account-password"
  label="Account password"
  helperText="Managed by your account administrator."
  disabled
/>
```

## 11. Invalid configurations

- A `div` or `span` used as the toggle.
- An icon-only toggle with no accessible name.
- A red border with no error text.
- An error presented on a disabled field.
- Trimming or reformatting the value when visibility changes.
- A strength meter or breach check embedded in the field.
- `current-password` on a registration form.

## 12. Known limitations

- **Figma reference unresolved.** No node ID or variant ID is asserted.
- **Primitive token use.** Four primitives are consumed because no
  `password-input.*` family exists.
- **No strength, breach, caps-lock or confirmation behaviour.**
- **No component-owned validation.**
- **ReadOnly has no dedicated visual treatment.**
- **`autoComplete` defaults to `current-password`.** Override it for
  registration.
- **Text toggle only.** There is no icon slot.
- **No dark mode.**
- **Browser baseline.** The focus overlay and disabled suppression use
  `:has()`; older browsers may not render them.

## Links

- [Contract](./contract.json)
- [Canonical stylesheet](./password-input.css)
- [Native reference markup](./password-input.html)
- [Input contract](../input/contract.json)
- [Button contract](../button/contract.json)
- [Token source](../../tokens/tokens.json)
