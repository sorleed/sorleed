# Sorleed components

Sorleed's implemented components are **production CSS plus native HTML**. The
canonical component layer ships no JavaScript runtime, package, bundler or build
step. The application owns filtering, validation, error presentation,
submission and focus management.

A private-alpha React adapter (`@sorleed/react`) and source-distribution CLI
(`@sorleed/cli`) also exist. They are not published and are not required to use
the components.

A component is consumed by loading the generated token CSS and the component
stylesheet, then using the native element with the documented classes and
attributes.

## Start here

- [Component catalogue](CATALOG.md) — implemented components, supported APIs and
  unsupported functionality.
- [Contract-first usage guide](USAGE-GUIDE.md) — the repeatable discovery,
  implementation and verification workflow.
- [Implementation guide](IMPLEMENTATION.md) — current architecture, APIs, token
  compliance and verification.

## Quickstart

### 1. Serve the repository root

From the repository root:

```sh
python3 -m http.server 8765
```

Serving the root keeps the relative token and component paths valid.

### 2. Load token CSS before component CSS

For a page at the repository root:

```html
<link rel="stylesheet" href="tokens/dist/tokens.css">
<link rel="stylesheet" href="components/button/button.css">
<link rel="stylesheet" href="components/input/input.css">
<link rel="stylesheet" href="components/password-input/password-input.css">
<link rel="stylesheet" href="components/phone-input/phone-input.css">
```

Load only the component stylesheets you use. If the page is nested, prefix the
paths to match its depth. The
[transaction-history example](../examples/transaction-history/index.html) uses
`../../tokens/...` and `../../components/...`.

The component stylesheets **do not import** token CSS. Loading a component
stylesheet without `tokens/dist/tokens.css` leaves the component variables
undefined. See [tokens/README.md](../tokens/README.md).

### 3. Use the documented native APIs

Use native HTML for the canonical implementation. The React adapter mirrors the
same classes and tokens but is a private alpha.

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

<button class="sl-button sl-button--secondary" type="button">Clear</button>
<button class="sl-button" type="submit">Apply filter</button>
```

- `.sl-button` is Primary by default. Add `.sl-button--secondary` for a quieter
  action. Set an explicit `type` on every button.
- Input is the full `.sl-input` field anatomy. Keep the visible label associated
  with `for`/`id`; never use the placeholder as the label. Use
  `aria-describedby` for helper or error text.
- PasswordInput composes `input.*` and `button.*` tokens. Its toggle is a native
  `<button type="button">` with an accessible name and `aria-pressed`, and the
  entered value is preserved when visibility changes.
- PhoneInput keeps a native country `<select>` and a native `type="tel"` input.
  It never forces a default country and never uses IP geolocation. Calling codes
  are not unique country identifiers.
- Supported Input types are `text`, `email`, `tel`, `number` and `url`.
  Validation, error copy, `aria-invalid` and focus management are application
  responsibilities.
- Set a page font. All components use `font-family: inherit`; no font file or
  font-family token is shipped.

## Verify the setup

Open the existing browser fixture through the same server:

```text
http://127.0.0.1:8765/components/test/browser-smoke.html
```

The page runs native DOM and computed-style checks and should end with
`data-status="pass"` and `0 failed`. The manual keyboard and visual checks are in
[test/BROWSER-TESTING.md](test/BROWSER-TESTING.md).

The approved modern-browser baseline is Chrome/Edge 105+, Safari 15.4+ and
Firefox 121+. Input, PasswordInput and PhoneInput use `:has()` for their focus
overlay and disabled suppression; no fallback is bundled.

## Working examples

[examples/transaction-history](../examples/transaction-history/README.md) is a
runnable financial interface that links the real token and component CSS and
uses the actual `.sl-button` and `.sl-input` markup. Its filtering and layout
are application code.

The [payment-form example](../examples/payment-form/README.md) is a second
runnable composition with inline validation and a review state.

Neither example uses PasswordInput or PhoneInput; use their own reference pages
for those components.

## Component references

| Component | Documentation | Native reference | Machine contract |
|---|---|---|---|
| Button | [button/README.md](button/README.md) | [button/button.html](button/button.html) | [button/contract.json](button/contract.json) |
| Input | [input/README.md](input/README.md) | [input/input.html](input/input.html) | [input/contract.json](input/contract.json) |
| PasswordInput | [password-input/README.md](password-input/README.md) | [password-input/password-input.html](password-input/password-input.html) | [password-input/contract.json](password-input/contract.json) |
| PhoneInput | [phone-input/README.md](phone-input/README.md) | [phone-input/phone-input.html](phone-input/phone-input.html) | [phone-input/contract.json](phone-input/contract.json) |

Also useful:

- [Implementation guide](IMPLEMENTATION.md) — files, APIs, token compliance and
  test results.
- [Browser testing runbook](test/BROWSER-TESTING.md) and
  [fixture](test/browser-smoke.html).
- [Token consumption](../tokens/README.md).

## Copy into an application

Copy `tokens/dist/tokens.css` and the component stylesheets you use, keep the
token file loaded first, and use the native markup above. No package manager,
build command or JavaScript runtime is required.

Alternatively, the private-alpha CLI copies the canonical source files into a
consumer project:

```sh
node cli/bin/sorleed.mjs add button --dir /path/to/consumer
```

The generated token CSS must not be edited by hand; see
[tokens/README.md](../tokens/README.md). The CLI is not published.
