# Contract-first component usage

Use this workflow whenever a developer or AI agent adds Sorleed components to an
interface. The goal is to consume the existing classes and tokens, not to
recreate or extend the components.

## 1. Find the component in the catalogue

Start with [CATALOG.md](./CATALOG.md). It lists the **implemented** components,
their supported variants/states and their canonical files. If a component or
state is not listed, it is not available. Do not invent it.

## 2. Inspect the canonical contract and implementation

Read the contract first, then the native reference markup and CSS:

| Component | Contract | Native reference | CSS | Documentation |
|---|---|---|---|---|
| Button | [`button/contract.json`](./button/contract.json) | [`button/button.html`](./button/button.html) | [`button/button.css`](./button/button.css) | [`button/README.md`](./button/README.md) |
| Input | [`input/contract.json`](./input/contract.json) | [`input/input.html`](./input/input.html) | [`input/input.css`](./input/input.css) | [`input/README.md`](./input/README.md) |
| PasswordInput | [`password-input/contract.json`](./password-input/contract.json) | [`password-input/password-input.html`](./password-input/password-input.html) | [`password-input/password-input.css`](./password-input/password-input.css) | [`password-input/README.md`](./password-input/README.md) |
| PhoneInput | [`phone-input/contract.json`](./phone-input/contract.json) | [`phone-input/phone-input.html`](./phone-input/phone-input.html) | [`phone-input/phone-input.css`](./phone-input/phone-input.css) | [`phone-input/README.md`](./phone-input/README.md) |

Also read [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) for the current architecture
and native API, and [`contract.schema.json`](./contract.schema.json) for the
schema. The TypeScript/React fragments in `examples/financial-form.md` are
contract-shaped pseudocode, not exported code; the separate private-alpha React
adapter is documented in [`../react/README.md`](../react/README.md).

## 3. Confirm states, markup and stylesheet dependencies

Load the generated token CSS before the component CSS:

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">
<link rel="stylesheet" href="components/input/input.css">
<link rel="stylesheet" href="components/password-input/password-input.css">
<link rel="stylesheet" href="components/phone-input/phone-input.css">
```

Adjust the paths for the page's depth. The component CSS does not import token
CSS. Set a page font because the components use `font-family: inherit`.
Sorleed ships no font file or font-family token.

The component stylesheets consume only their documented component tokens:
`--sl-button-*`, `--sl-input-*`, `--sl-phone-input-*`, and — for PasswordInput —
the same `--sl-input-*` and `--sl-button-*` families plus four primitives. There
is no `--sl-password-input-*` family. Do not create or redefine `--sl-*` tokens
in application CSS.

## 4. Reuse the existing API

### Button

```html
<button class="sl-button sl-button--secondary" type="button">Clear</button>
<button class="sl-button" type="submit">Review payment</button>
```

- `.sl-button` is Primary by default; `.sl-button--secondary` is the quieter
  alternative. `.sl-button--ghost` exists for low-emphasis actions on supported
  light surfaces. `.sl-button--primary` is an optional explicit primary alias.
- Always set an explicit native `type`.
- Use one Primary per decision group.
- Native `disabled` is the disabled API. There is no `state`, `variant`,
  `loading` or icon prop.

### Input

```html
<div class="sl-input">
  <label class="sl-input__label" for="filter">Description</label>
  <div class="sl-input__control">
    <input
      class="sl-input__field"
      id="filter"
      name="filter"
      type="text"
      autocomplete="off"
      aria-describedby="filter-help"
    >
  </div>
  <p class="sl-input__message" id="filter-help">
    Matches description text only.
  </p>
</div>
```

For an application-owned error, keep the same field anatomy, set
`aria-invalid="true"`, replace the helper copy with the error text and add
`.sl-input__message--error`:

```html
<div class="sl-input">
  <label class="sl-input__label" for="filter">Description</label>
  <div class="sl-input__control">
    <input
      class="sl-input__field"
      id="filter"
      name="filter"
      type="text"
      aria-invalid="true"
      aria-describedby="filter-error"
    >
  </div>
  <p class="sl-input__message sl-input__message--error" id="filter-error">
    Enter a description before applying the filter.
  </p>
</div>
```

- Use a persistent `.sl-input__label`; the placeholder is never the label.
- Use `aria-describedby` for helper or error text.
- The application sets `aria-invalid`, supplies the error text and associates it.
- Validate on blur or submit, not on every keystroke.
- Supported single-line types are `text`, `email`, `tel`, `number` and `url`.
- Password, search, textarea, select, OTP, currency, PIN and read-only fields are
  not Input; use a future contract, not a workaround that pretends otherwise.

### PasswordInput

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

- The toggle is a native `<button type="button">` with an accessible name and
  `aria-pressed`; it is never a `div` or `span`.
- Toggling visibility changes the input `type` and the button label/state. It
  must not change, trim or reformat the value.
- Use `autocomplete="current-password"` for sign-in and
  `autocomplete="new-password"` for registration.
- Password policy, strength, breach checks, caps-lock warnings and confirmation
  flows are application responsibilities. They are not part of this component.
- Figma reference: unresolved (`null`). Do not invent a node ID.

### PhoneInput

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

- Never force a default country and never use IP geolocation.
- Calling codes are not unique. Show full country names and allow
  disambiguation.
- Distinguish editing text, an optional E.164 value and validation status.
  `isValid` means format validity only; it does not prove the number is active,
  reachable or owned.
- A searchable country picker is not implemented; use the native `<select>`.
- Figma reference: unresolved (`null`). Do not invent a node ID.

## 5. Keep application behaviour outside the component

Sorleed's canonical component layer provides CSS and native markup. It does
**not** provide JavaScript runtime, event handlers, filtering, validation,
formatting, masking, focus management, review state, loading state, errors or
submission. The private-alpha React adapter and CLI are documented separately
and are not published.

The application owns:

- layout and responsive presentation around the components;
- values, labels, helper and error copy;
- `aria-invalid`, `aria-describedby`, focus movement and error announcements;
- click, submit, reset, filtering and review behaviour;
- application-specific messages and status regions;
- any data, API or payment service. None is connected in the examples.

If the UI needs a state the component does not support, stop and propose a
contract change, or use page-owned layout/content around the existing component.
Do not fake a component state with a new class or token.

## 6. Run the checks and test the interface

From the repository root:

```sh
node components/validate-contracts.mjs
node components/validate-parity.mjs
node tokens/check.mjs
node --test components/test/implementation.test.mjs
```

Then serve the root and verify in a browser:

```sh
python3 -m http.server 8765
```

Useful checks:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
http://127.0.0.1:8765/components/button/button.html
http://127.0.0.1:8765/components/input/input.html
http://127.0.0.1:8765/components/password-input/password-input.html
http://127.0.0.1:8765/components/phone-input/phone-input.html
```

The browser fixture should end with `data-status="pass"` and `0 failed`; its
manual checks are in [`test/BROWSER-TESTING.md`](./test/BROWSER-TESTING.md).
Test the actual composition at the target widths, including keyboard order,
focus, invalid submission, empty/reset states and any review flow.

## Runnable examples

- [Transaction history](../examples/transaction-history/README.md) — table/list
  filtering, empty state, one Primary and one secondary Clear.
- [Payment form](../examples/payment-form/README.md) — validation, review and
  reset with the same Button and Input APIs.

Both examples link the real token and component stylesheets. They do not copy
component CSS or introduce a framework.

## Do not

- Do not invent variants such as danger, success, loading, icon-only, link, size
  or full-width variants.
- Do not invent props or attributes such as `variant`, `state`, `focused`,
  `filled`, `showPlaceholder` or `showHelper`.
- Do not invent `sl-` classes, `--sl-*` tokens, component state selectors or
  framework wrappers.
- Do not copy component CSS into an application or override component state
  rules.
- Do not claim the private-alpha React adapter or CLI is published or
  production-ready.
- Do not use unsupported input types, inverse/dark surfaces, or an error border
  without explanatory text.
- Do not introduce a package manager, bundler or runtime into the canonical
  component layer unless a separate architectural decision explicitly approves
  it.

If a required capability is missing, document the gap and propose a contract
change. Existing APIs are the source of truth.
