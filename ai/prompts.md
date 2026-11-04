# Reusable Prompts

## Build a form with Sorleed

> Use only Sorleed's Button, Input, PasswordInput and PhoneInput. Read
> `ai/components.md` and the matching contract before writing code. Load
> `tokens.css` before the component stylesheets. Every input needs a label and
> every error must use `errorMessage`. Do not add components that do not exist.

## Add a phone field

> Use `PhoneInput` from `@sorleed/react`. Do not detect the country from the IP
> address. Use an explicit `defaultCountry` only when the product requires it.
> Treat `isValid` as format validity, not deliverability. Install
> `libphonenumber-js` in the consumer project.

## Theme Sorleed

> Override semantic `--sl-color-*` roles in the application theme layer. Do not
> edit generated token CSS. Do not consume primitive tokens from component CSS.
> Re-check text, boundary, focus and error contrast after the change.

## Audit an implementation

> Check that only implemented components are used, that labels and error
> associations exist, that token CSS loads first, and that no invented props,
> states or tokens appear. Report each finding with the file and line.

## Extend Sorleed

> Propose a new contract before implementation. Include anatomy, props, state
> model, token dependencies, accessibility requirements, tests and limitations.
> Do not add a component merely to increase the count.
