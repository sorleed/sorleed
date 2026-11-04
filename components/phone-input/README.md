# PhoneInput

**Contract 1.0.0 · Component v0.1 · Implementation: framework-agnostic CSS + native HTML, plus a private-alpha React adapter**

PhoneInput is Sorleed's international phone-number field. It renders a complete
field — label, country selector, number input and helper/error row — using 31
`phone-input.*` component tokens.

The component renders the field and reports what the user typed. It does **not**
validate a number, prove it is reachable, or choose a country from the user's IP
address. Those are application responsibilities.

> **Figma reference unresolved.** No Figma node ID, variant ID or property key is
> asserted by this contract. Do not invent one. `canonical.figma` is `null`.

This guide is the human-readable companion to the canonical machine contract:

- Machine contract: [`contract.json`](./contract.json)
- Component CSS: [phone-input.css](./phone-input.css)
- Native reference markup: [phone-input.html](./phone-input.html)
- Shared schema: [`../contract.schema.json`](../contract.schema.json)
- Token source: [`../../tokens/tokens.json`](../../tokens/tokens.json)
- Generated CSS: [`../../tokens/dist/tokens.css`](../../tokens/dist/tokens.css)
- React adapter (private alpha): [`../../react/phone-input/index.tsx`](../../react/phone-input/index.tsx)
- Figma evidence: **none recorded** — the reference is unresolved

> This repository includes production CSS and native HTML reference markup. The
> React adapter is a private alpha and is not represented as production-ready.

---

## 1. What PhoneInput is

PhoneInput is a full field, not a bare `<input type="tel">`:

```text
PhoneInput
├── Label             14/20, weight 500, phone-input.label.color
├── Row               country selector + number input, 8px gap
│   ├── Country       native <select> with full country names and dial codes
│   └── Control       40px high, 1px INSIDE border, 6px radius, 12px padding-x
│       └── Input     type=tel, phone-input.text / phone-input.placeholder
└── Message           12/16, helper copy or error copy
```

- **Four states:** Default, Hover, Error, Disabled.
- **Independent `Focused` overlay:** shown in Default, Hover and Error;
  suppressed by Disabled.
- **One label slot, one country selector and one helper/error slot:** no flags
  as the only identifier, no custom listbox.
- **One size:** 40px high, 6px radius, 14/20 text, 12/16 message.
- **One default:** none. The component does not force a country.

### Three distinct values

PhoneInput deliberately separates three things that are easy to conflate:

1. **Editing text** — exactly what the user typed, preserved without reformatting.
2. **Normalised value** — an optional E.164 string when the number is valid.
3. **Validation status** — `empty`, `incomplete`, `valid` or `invalid`, plus
   `isValid`.

`isValid` means *format validity only*. It does not mean the number is active,
reachable or owned.

---

## 2. When to use PhoneInput

Use it when:

- collecting an international phone number in a global form;
- the user may travel or use a number from a country other than the form's
  locale;
- the application needs an optional E.164 normalisation when the number is
  valid.

Do not use it:

- with IP geolocation to guess a country;
- with a hardcoded default country for every user;
- to claim deliverability, ownership or SMS reachability;
- as a search field, OTP field, PIN field or currency field.

---

## 3. Anatomy and classes

| Part | Class | Element |
| --- | --- | --- |
| Wrapper | `.sl-phone-input` | `div` |
| Label | `.sl-phone-input__label` | `label` |
| Row | `.sl-phone-input__row` | `div` |
| Country container | `.sl-phone-input__country` | `div` |
| Country label (visually hidden) | `.sl-phone-input__country-label` | `label` |
| Country selector | `.sl-phone-input__country-select` | native `select` |
| Control wrapper | `.sl-phone-input__control` | `div` |
| Number input | `.sl-phone-input__field` | `input type="tel"` |
| Message | `.sl-phone-input__message` | `p` |
| Error message | `.sl-phone-input__message--error` | modifier on the message |

The country selector is a native `<select>` so it is keyboard operable and
familiar. A searchable country picker is **not** implemented; it would need its
own contract and accessibility evidence.

---

## 4. States and precedence

| State | Fill | Border | Text | Message |
| --- | --- | --- | --- | --- |
| Default | `phone-input.background` | `phone-input.border` | `phone-input.text` | `phone-input.helper.color` |
| Hover | `phone-input.background` | `phone-input.border-hover` | `phone-input.text` | `phone-input.helper.color` |
| Error | `phone-input.background` | `phone-input.border-error` | `phone-input.text` | `phone-input.text-error` |
| Disabled | `phone-input.background-disabled` | `phone-input.border-disabled` | `phone-input.text-disabled` | `phone-input.helper.color` |

Precedence is **Disabled > Error > Hover > Default**. Error suppresses the hover
border. Disabled suppresses hover, error and the focus ring. Focus is an
independent overlay, not a fifth state.

The visible error border is keyed to `aria-invalid="true"`, so the visual and
semantic error states cannot drift apart.

---

## 5. Validation and application responsibilities

The component renders the field; it does not own validation.

The application must:

- choose or infer the country explicitly — never from the IP address;
- decide when validation runs (blur or submit, not every keystroke);
- supply `errorMessage`, set `aria-invalid` and connect the message;
- announce new errors once and move focus to the first invalid field;
- explain why a field is disabled rather than relying on the muted fill alone;
- treat a valid format as format validity only.

The React adapter uses `libphonenumber-js` when available. Numbering-plan
validation still cannot prove the number is active, reachable or owned.

---

## 6. Token dependencies

The stylesheet consumes exactly 31 `phone-input.*` component tokens. There are
no primitive or semantic references and no hardcoded values covered by a token.

Groups:

- **Geometry:** `height`, `padding-x`, `padding-y`, `radius`, `border-width`,
  `label-gap`, `helper-gap`, `gap`, `country-width`,
  `country-select-padding-x`, `focus.width`, `focus.offset`.
- **Typography:** `font-size`, `line-height`, `font-weight`,
  `helper.font-size`, `helper.line-height`, `label.font-weight`.
- **Colour:** `background`, `background-disabled`, `border`,
  `border-hover`, `border-error`, `border-disabled`, `text`, `text-disabled`,
  `text-error`, `placeholder`, `label.color`, `helper.color`, `focus.color`.

Load `tokens/dist/tokens.css` before the component stylesheet. The component
stylesheet does not import token CSS automatically.

---

## 7. Accessibility

- The label is programmatically associated with the number input.
- The country selector has its own accessible name and shows full country names
  plus dial codes. Flags are never the only identifier.
- Helper text is connected with `aria-describedby`. Error text is connected with
  `aria-describedby`, and `aria-invalid=true` is set only when an error is
  present.
- Disabled uses the native `disabled` attribute on both controls.
- Keyboard focus must be visible on both controls.
- Error is communicated by a border and text, not colour alone.
- Calling codes are not unique. `+1`, for example, covers several countries, so
  the selector must allow disambiguation.

The repository does not claim browser rendering, screen-reader or cross-browser
verification for this component.

---

## 8. Native HTML and CSS

```html
<div class="sl-phone-input">
  <label class="sl-phone-input__label" for="phone">Phone number</label>
  <div class="sl-phone-input__row">
    <div class="sl-phone-input__country">
      <label class="sl-phone-input__country-label" for="phone-country">
        Country
      </label>
      <select class="sl-phone-input__country-select" id="phone-country">
        <option value="">Select a country</option>
        <option value="GB">United Kingdom (+44)</option>
        <option value="NG">Nigeria (+234)</option>
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

See `phone-input.html` for a runnable reference page with default, error and
disabled examples.

---

## 9. React adapter (private alpha)

```tsx
import { PhoneInput } from "@sorleed/react/phone-input";
import "@sorleed/react/styles/tokens.css";
import "@sorleed/react/styles/phone-input.css";

<PhoneInput
  id="phone"
  label="Phone number"
  helperText="Include your country code."
  onChange={({ e164, isValid, status }) =>
    setPhone({ e164, isValid, status })
  }
/>
```

The adapter is a private alpha. It is not published and is not represented as
production-ready.

| Prop | Type | Notes |
| --- | --- | --- |
| `label` | `string` | Required visible label and accessible name. |
| `hideLabel` | `boolean` | Visually hides the label but keeps it associated. |
| `helperText` | `string` | Shown when there is no error. |
| `errorMessage` | `string` | Replaces helper copy and sets `aria-invalid`. |
| `value` / `defaultValue` | `string` | Controlled / uncontrolled editing value. |
| `country` / `defaultCountry` | `string` | ISO 3166-1 alpha-2 codes. |
| `onCountryChange` | `(country?: string) => void` | Country selector changes. |
| `countries` | `string[]` | Optional ISO country allow-list. |
| `international` | `boolean` | Accepted but currently unused by the adapter. |
| `onChange` | `(result) => void` | Reports editing text, E.164, country, status, `isValid`. |
| `disabled` | `boolean` | Disables both controls. |
| `required` | `boolean` | Sets the native `required` attribute. |
| `readOnly` | `boolean` | Passes through; no dedicated visual state. |

Known adapter limitations:

- `international` is accepted but does not change behaviour.
- Country option text uses two-letter codes and dial codes rather than full
  localised country names.
- `readOnly` has no dedicated visual treatment.
- No searchable country picker.

---

## 10. Examples

### International field with explicit helper

```tsx
<PhoneInput
  id="recipient-phone"
  label="Phone number"
  helperText="Include your country code."
  onChange={({ e164, isValid }) => setPhone({ e164, isValid })}
/>
```

No forced country. The application receives editing text, optional E.164 and
validity status, then decides what to display.

### Explicit default country

```tsx
<PhoneInput
  id="billing-phone"
  label="Billing phone"
  defaultCountry="GB"
  errorMessage={phoneError}
/>
```

The default is explicit application configuration, not IP geolocation.

### Restricted country list

```tsx
<PhoneInput
  id="support-phone"
  label="Support phone"
  countries={["US", "CA"]}
/>
```

The allow-list limits options; the shared `+1` calling code stays visible so the
user can disambiguate.

### Disabled field with an explanation

```tsx
<PhoneInput
  id="account-phone"
  label="Account phone"
  value={accountPhone}
  helperText="Managed by your account administrator."
  disabled
/>
```

---

## 11. Invalid configurations

- Auto-detecting a country from the IP address.
- Hardcoding one default country for every user.
- Treating a calling code as a unique country identifier.
- Relying on flags alone to identify a country.
- Claiming a number is active, reachable or owned from format validation.
- Showing an error on a disabled field.
- Adding success, warning, info, loading or clearable states.
- Inventing a Figma node ID for this component.

---

## 12. Known limitations

- **Figma reference unresolved.** `canonical.figma` is `null`.
- **No parsing in the framework-agnostic contract.** Formatting and validation
  require an adapter.
- **No deliverability guarantee.** Format validity is not reachability.
- **`international` is unused** by the current adapter.
- **Two-letter country option text** in the adapter.
- **Native select only.** No searchable picker.
- **`readOnly` has no visual treatment.**
- **No component-owned validation.**
- **No dark mode.**

---

## Links

- [Contract](./contract.json)
- [Canonical stylesheet](./phone-input.css)
- [Native reference markup](./phone-input.html)
- [React adapter](../../react/phone-input/index.tsx)
- [Token source](../../tokens/tokens.json)
