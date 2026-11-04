# Accessibility Rules

These rules describe what the implementation supports. Do not claim more.

## All components

- Use native elements. Button uses `<button>`, Input and PasswordInput use
  `<input>`, PhoneInput uses `<select>` and `<input type="tel">`.
- Keep a programmatic label. `hideLabel` hides it visually, never semantically.
- Show a visible focus indicator. The focus ring is an additive overlay, not a
  fifth state.
- Do not remove focus outlines without providing the Sorleed focus overlay.
- Disabled is the final state. It suppresses hover, focus and error treatment.
- Never communicate error by colour alone. Render a message.
- Do not present an error on a disabled control.

## Input and PasswordInput

- `errorMessage` sets `aria-invalid="true"` and is connected through
  `aria-describedby`.
- `helperText` is connected through `aria-describedby` when there is no error.
- The label is associated with the input through `for`/`id`.
- PasswordInput's toggle is a `<button type="button">` with `aria-pressed` and
  an accessible name that changes between show and hide.

## PhoneInput

- The number input has a label association.
- The country selector has its own accessible name and is a native select.
- Each option exposes a country name and dial code.
- `errorMessage` sets `aria-invalid` and is connected through
  `aria-describedby`.
- Do not use flags alone to identify a country.
- Do not rely on a calling code as a unique country identifier.
- No keyboard trap and no custom listbox.

## Contrast

Token validation checks text, boundary, focus and error pairs. Disabled text is
exempt from WCAG 1.4.3 and 1.4.11 because the control is inactive.

## What has not been certified

- No screen-reader certification.
- No formal cross-browser certification.
- No forced-colours manual certification beyond the stylesheet rules.
- No automated browser test result is a substitute for assistive-technology
  testing with real users.
