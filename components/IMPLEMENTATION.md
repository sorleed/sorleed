# Implementation guide

**Current status: v0.1 four-component system. Framework-agnostic CSS plus native
HTML is the canonical component layer. A private-alpha React adapter and CLI
also exist but are not published.**

This document records the current architecture, the implemented component APIs,
token ownership, validation and known limitations. Historical stage records are
preserved in [Appendix A](#appendix-a--historical-stage-record) and are not
current guidance.

Companion documents:

- [Component catalogue](./CATALOG.md)
- [Contract-first usage guide](./USAGE-GUIDE.md)
- [Token guide](../tokens/README.md)
- [React private alpha](../react/README.md)
- [CLI private alpha](../cli/README.md)

---

## 1. Architecture

The repository has two layers:

| Layer | Location | Status | Purpose |
|---|---|---|---|
| Canonical component layer | `components/`, `tokens/` | Implemented | Production CSS, native HTML reference markup, tokens and contracts. |
| Adapters and distribution | `react/`, `cli/` | Private alpha | Optional React wrappers and a source-distribution command. Not published. |

The canonical layer is deliberately framework-agnostic:

- production CSS for real HTML elements, using generated component tokens;
- native HTML reference markup with no component JavaScript;
- machine-readable contracts validated against `components/contract.schema.json`;
- zero-dependency Node validators and tests.

The React adapter mirrors the same classes, tokens and state model. The CLI
copies the canonical React sources and styles into a consumer project. Neither
changes the design decisions in the canonical layer.

### Contract-level props vs native API

The contracts use a React-shaped vocabulary for design intent. In the canonical
layer, those props map to native attributes, classes and browser states:

- Button `variant`, `className` and `onClick` map to classes and
  application-owned listeners; `disabled` and `type` map to native attributes.
- Input `value`, `onChange`, `errorMessage` and `className` map to the native
  value, application-owned events and attributes, error presentation and the
  `class` attribute.
- PasswordInput adds a native toggle. Visibility maps to `type="password"` /
  `type="text"`, the button label and `aria-pressed`.
- PhoneInput adds a native country selector. Status reporting is an adapter
  concern; the canonical CSS owns presentation only.

The private-alpha React adapter translates those props. It does not introduce a
different visual contract.

---

## 2. Source layout

| Path | Purpose |
|---|---|
| `components/button/button.css` | Button styles: three variants, native states, additive focus ring, disabled treatment, forced-colors fallback. |
| `components/input/input.css` | Input styles: label, control, field, message row, state precedence, focus overlay, forced-colors fallback. |
| `components/password-input/password-input.css` | PasswordInput styles composing `input.*` and `button.*` tokens. |
| `components/phone-input/phone-input.css` | PhoneInput styles for the country selector, number input and message row. |
| `components/*/*.html` | Native reference markup for each component. |
| `components/*/contract.json` | Machine-readable contracts. |
| `components/contract.schema.json` | Shared contract schema. |
| `components/validate-contracts.mjs` | Contract, token, CSS and documentation validation. |
| `components/validate-parity.mjs` | CLI template parity validation. |
| `components/test/implementation.test.mjs` | Zero-dependency implementation tests. |
| `components/test/browser-smoke.html` | Manual browser fixture. |
| `components/test/BROWSER-TESTING.md` | Manual browser runbook. |
| `react/` | Private-alpha React adapter. |
| `cli/` | Private-alpha source-distribution CLI. |

---

## 3. Component APIs

### Button

| Class | Meaning |
|---|---|
| `.sl-button` | Primary action. Default surface. |
| `.sl-button--primary` | Optional explicit alias for the default. |
| `.sl-button--secondary` | Secondary action. |
| `.sl-button--ghost` | Low-emphasis action with a transparent resting surface. |

- Native `<button>`; always set an explicit `type`.
- Five states: Default, Hover, Active, Focus, Disabled.
- Focus is an additive `::after` overlay, not a sixth state.
- Ghost is transparent at rest and on disabled.
- 22 `--sl-button-*` tokens.

### Input

| Part | Class |
|---|---|
| Wrapper | `.sl-input` |
| Label | `.sl-input__label` |
| Visually hidden label | `.sl-input__label--visually-hidden` |
| Control | `.sl-input__control` |
| Field | `.sl-input__field` |
| Message | `.sl-input__message` |
| Error modifier | `.sl-input__message--error` |

- Supported native types: `text`, `email`, `tel`, `number`, `url`.
- States: Default, Hover, Error, Disabled. Precedence: **Disabled > Error > Hover > Default**.
- Focus is an independent `:focus-visible` overlay using `:has()`.
- Error is keyed to `aria-invalid="true"` and must be accompanied by text.
- 28 `--sl-input-*` tokens.

### PasswordInput

| Part | Class |
|---|---|
| Wrapper | `.sl-password-input` |
| Label | `.sl-password-input__label` |
| Visually hidden label | `.sl-password-input__label--visually-hidden` |
| Control | `.sl-password-input__control` |
| Field | `.sl-password-input__field` |
| Toggle | `.sl-password-input__toggle` |
| Message | `.sl-password-input__message` |
| Error modifier | `.sl-password-input__message--error` |

- The toggle is a native `<button type="button">` with an accessible name and
  `aria-pressed`.
- Visibility changes the input `type` only; the value is preserved exactly.
- `autocomplete="current-password"` for sign-in, `"new-password"` for
  registration.
- 27 `input.*` tokens, 5 `button.*` tokens and 4 primitives: `font.size.xs`,
  `font.line-height.xs`, `space.12`, `space.4`.
- The primitive dependencies are a documented draft limitation. There is no
  `password-input.*` token family.
- Figma reference: **unresolved** (`null`).

### PhoneInput

| Part | Class |
|---|---|
| Wrapper | `.sl-phone-input` |
| Label | `.sl-phone-input__label` |
| Visually hidden label | `.sl-phone-input__label--visually-hidden` |
| Row | `.sl-phone-input__row` |
| Country container | `.sl-phone-input__country` |
| Country label | `.sl-phone-input__country-label` |
| Country selector | `.sl-phone-input__country-select` |
| Control | `.sl-phone-input__control` |
| Field | `.sl-phone-input__field` |
| Message | `.sl-phone-input__message` |
| Error modifier | `.sl-phone-input__message--error` |

- Native country `<select>` and native `type="tel"` input.
- No forced default country and no IP geolocation.
- Calling codes are not unique; show full country names and allow
  disambiguation.
- Three values stay distinct: editing text, optional E.164, validation status.
- `isValid` is format validity only; it never proves the number is active,
  reachable or owned.
- 31 `--sl-phone-input-*` tokens.
- Figma reference: **unresolved** (`null`).

---

## 4. State and focus model

All four components use the same state vocabulary:

```
State: Default, Hover, Error/Active, Disabled
Focus: independent overlay
```

Precedence for field components: **Disabled > Error > Hover > Default**.
Disabled suppresses hover, error and focus treatments. Error suppresses the
hover border. Focus can coexist with Default, Hover and Error, but not Disabled.

Button uses its own five-state model: Default, Hover, Active, Focus, Disabled.
Focus is additive and disabled removes the ring.

No component exposes a `state`, `focused`, `filled`, `showPlaceholder` or
`showHelper` prop/attribute. State is derived from native attributes and
interaction.

---

## 5. Token compliance

| Component | Contract tokens | Consumed | Token layer |
|---|---|---|---|
| Button | 22 | 22 | `--sl-button-*` only |
| Input | 28 | 28 | `--sl-input-*` only |
| PasswordInput | 36 | 36 | 27 `--sl-input-*`, 5 `--sl-button-*`, 4 primitives |
| PhoneInput | 31 | 31 | `--sl-phone-input-*` only |

`components/validate-contracts.mjs` checks:

- every declared dependency exists in `tokens/tokens.json`;
- the source type, alias and resolved value match the contract;
- the generated `--sl-*` variable exists in `tokens/dist/tokens.css`;
- the component CSS consumes exactly the declared variable set;
- no undeclared or unused dependency remains;
- variants, state mappings and geometry reference declared dependencies;
- contrast rows reference known tokens.

The token source contains 229 tokens. Light theme is the only implemented theme.

Implementation-only values, all deliberate and visual rather than tokenised:

| Value | Why |
|---|---|
| `background-color: transparent` on Ghost | No Ghost resting-background token exists. |
| `font-family: inherit` | No font-family token exists. |
| `appearance: none`, `border: 0` on Button | Removes user-agent chrome. |
| `cursor: pointer` / `not-allowed` | Platform affordance. |
| `margin: 0`, `box-sizing: border-box` | Reset and predictable sizing. |
| Visually hidden `1px` utility | Standard accessible hiding technique. |
| ButtonText, Highlight, Canvas | Forced-colors system colours. |
| PasswordInput toggle insets and opacity | Local optical adjustments; documented in the contract. |

---

## 6. Validation and tests

### Commands

```sh
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
node --test components/test/*.test.mjs
cd cli && npm test
cd react && npm test
cd react && npm run typecheck
cd react && npm run build
```

### What each check covers

| Check | Coverage |
|---|---|
| `tokens/check.mjs` | Token structure, contrast pairs and generated CSS currency. |
| `validate-contracts.mjs` | Schema, IDs, canonical paths, token dependencies, CSS parity, states, classes, docs and links. |
| `validate-parity.mjs` | Ten CLI templates byte-identical to canonical sources; missing/extra/different fails. |
| Implementation tests | Protected token hashes, counts, token consumption, CSS rules, native markup, class parity and validators. |
| CLI tests | Add, dry-run, shared files, conflicts, rollback, path traversal, packed tarball and strict TypeScript consumer. |
| React tests | Rendering, state, controlled/uncontrolled behaviour, accessibility, refs and PhoneInput status. |
| React typecheck/build | TypeScript and distribution build. |

The test suite does **not** prove browser rendering, screen-reader behaviour,
cross-browser behaviour or Figma node existence. Those remain manual or
unverified.

### Browser baseline

The approved modern-browser baseline is **Chrome/Edge 105+, Safari 15.4+,
Firefox 121+**. Input, PasswordInput and PhoneInput use `:has()` for focus
overlays and disabled suppression; no fallback is bundled. No browser was run
during the current validation pass. All three baseline browsers remain
**UNVERIFIED**.

---

## 7. Accessibility summary

- Native `<button>`, `<input>` and `<select>` semantics; no `role` imitation.
- Native `disabled` removes controls from interaction and tab order.
- `:focus-visible` keyboard focus is never removed without a visible indicator.
- Labels are associated programmatically; visually hidden labels remain in the
  accessibility tree.
- Error state combines a visible border with `aria-invalid` and text.
- Helper and error text are referenced with `aria-describedby`.
- PasswordInput's toggle has a native button role, an accessible name and
  `aria-pressed`.
- PhoneInput's country selector has an accessible name and exposes full country
  names plus dial codes.
- Forced-colors fallbacks preserve boundaries and focus indicators.

Application responsibilities remain: validation timing, error copy, error
announcement, `aria-invalid`, `aria-describedby`, input type/`autocomplete`,
password policy, country configuration, and choosing when disabled is genuinely
unavailable.

---

## 8. Known limitations

1. **PasswordInput and PhoneInput Figma references are unresolved.** Both
   contracts record `canonical.figma: null` and null variant IDs. Do not invent a
   node ID.
2. **PasswordInput uses four primitive tokens.** No `password-input.*` token
   family exists. The use is limited and documented; do not expand it without a
   token-source change and a new contract version.
3. **PasswordInput has no strength, breach, caps-lock or confirmation feature.**
   Those are application concerns or require a new contract.
4. **PhoneInput has no searchable country picker.** The canonical control is a
   native `<select>`.
5. **PhoneInput format validity is not deliverability.** It cannot prove a number
   is active, reachable or owned.
6. **The React adapter's `international` prop is accepted but unused.**
7. **PhoneInput country option text in the React adapter uses two-letter codes
   and dial codes, not full localised names.**
8. **`readOnly` has no dedicated visual treatment** in Input, PasswordInput or
   PhoneInput.
9. **No dark mode.**
10. **No browser, screen-reader or cross-browser verification is claimed** for
    the current pass.
11. **The React adapter and CLI are private alpha and unpublished.**
12. **No root workspace or CI exists.** Each package is tested from its own
    directory.

---

## Appendix A — Historical stage record

This appendix preserves the implementation history that led to the current
state. It is **historical**, not current guidance. Where it conflicts with the
sections above, the current sections win.

### A.1 Stage 2 origin: no framework

The original Stage 2 implementation was deliberately framework-agnostic. At that
time the repository had no root `package.json`, package manager manifest,
`node_modules`, bundler, test framework or build configuration. Stage 2 delivered:

- production CSS for Button and Input using generated component tokens;
- native HTML reference markup with no JavaScript;
- zero-dependency tests using Node's `node:test` runner.

A future React/Vue/Web Component adapter was expected to wrap the same classes
and token contract without changing the design decisions. That expectation is
now realised by the private-alpha React adapter, and the canonical layer
remains framework-agnostic.

### A.2 Stage 5B: documentation reconciliation

Stage 5B reconciled the Stage 1 README disclaimers, documented the native
HTML/CSS API, and clarified that the contract API was React-shaped while the
implementation was native. It changed documentation and test files only; token,
CSS and HTML files were unchanged.

### A.3 Stage 5C-1: Ghost/Focus Figma correction

Exactly one approved Figma write was performed: the Button Ghost/Focus label
binding `87:34` in variant `87:32` was corrected from `color/content/link`
(`VariableID:82:101`) to `button/ghost/foreground` (`VariableID:82:160`). The
post-write inspection confirmed the target binding, unchanged
text/typography/geometry, 15 variants, 3 properties, 204/204 bindings, 22 unique
`button.*` tokens and all five Ghost labels on their expected tokens. **FC-01 is
resolved.**

### A.4 Stage 5E: test, example and browser-fixture corrections

- The Ghost Disabled contrast row was corrected to measure against
  `color.surface.default` and report **2.56:1 EXEMPT**. Primary and Secondary
  Disabled remain measured against `button.disabled.background` at
  **2.02:1 EXEMPT**.
- The Input filter example terminology was corrected to
  `transaction-filter`, `Filter transactions` and `Filter by description`.
- The static first-paint Input error example no longer uses `role="alert"`.
  A nearby comment documents that an application may add it when inserting the
  error after validation.
- The duplicate inverse error-text advisory was removed; the component-level
  `input-error-text/inverse` advisory remains.
- The validator Markdown check label was corrected to “required sections, links
  and example markers”.
- A dependency-free browser fixture and manual runbook were added.

Historical Chromium measurements from that period recorded Button at 40px high,
10px/16px padding, 6px radius, 14px/500 type and a 2px focus ring at `-2px`
inset; Input at 40px high with a 1px border, 6px radius, 14px/400 type, an 8px
label gap and a 4px helper gap. Those measurements were manual and are not
reproducible from this repository. They are not current verification claims.

### A.5 Preservation notes

- The historical branch was `docs/foundation-baseline`; the Phase 3 baseline
  HEAD was `f03a7a347dc96b994b6700d597b56370c9da10e3`.
- Historical token hashes recorded in earlier versions of this file are
  superseded by the current `--sl-*` token source and generated CSS. The
  implementation test suite now protects the current hashes.
- No staging, commit, push, branch switch, stash or reset was performed during
  the historical stages described here.
- No Figma write was performed after Stage 5C-1.

### A.6 Superseded claims

Earlier versions of this document stated that no React adapter, package or
runtime existed, that only Button and Input were implemented, and that the
remaining foundation guides were deferred. The first two statements are
superseded by the private-alpha React/CLI work and by PasswordInput/PhoneInput.
The foundation guides other than Color System, Design Principles and Token
Architecture remain deferred.
