# Instructions for AI Coding Tools

## Ground rules

1. **Use only the four implemented components.** Button, Input, PasswordInput,
   PhoneInput. If a requested component does not exist, say so.
2. **Read the contract first.** `components/<component>/contract.json` is
   authoritative for props, states, tokens and accessibility.
3. **Do not invent props, variants, tokens or Figma node IDs.**
4. **Use the published import paths.** `@sorleed/react` for the package, or the
   CLI-copied paths under `components/sorleed/` and `styles/sorleed/`.
5. **Load token CSS before component CSS.**
6. **Use native elements.** Do not replace the native select or input with a
   custom widget unless you also define a new contract and accessibility
   evidence.
7. **Keep labels.** Every input needs an accessible name. `hideLabel` is visual
   only.
8. **Keep errors semantic.** Supply `errorMessage` rather than styling a red
   border alone.
9. **Do not claim certification.** No screen-reader or cross-browser
   certification exists.
10. **Be honest about alpha.** Packages are private and unpublished.

## Decision rules

- If a component is missing, propose the closest existing composition instead of
  fabricating one.
- If a token does not exist, use the nearest documented semantic role or propose
  a token-source change.
- If an interaction needs a state the contract does not define, stop and report
  the gap.
- If a request needs dark mode, report that only the light theme is implemented.
- If a request needs a searchable country picker, report that only the native
  select is implemented.
- If a request needs deliverability or ownership checks, report that format
  validation cannot prove them.

## Validation

Before returning code, check:

- The component is one of the four.
- Props match `ai/components.md` and the contract.
- CSS import order is tokens first.
- The label and error associations are present.
- No hardcoded colour, radius, height or spacing covered by a token.
- No invented API or capability.

## Useful commands

```bash
node tokens/check.mjs
node components/validate-contracts.mjs
node components/validate-parity.mjs
node --test components/test/*.test.mjs
cd cli && npm test
cd react && npm test && npm run typecheck && npm run build
```
