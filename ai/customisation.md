# Source-First Customisation

Sorleed assumes the consumer owns the code.

## React package

Import the exported CSS and override semantic token roles in the consumer's
theme layer:

```css
:root {
  --sl-color-border-focus: #0f766e;
  --sl-color-content-primary: #111827;
}
```

Do not edit files inside `node_modules`.

## CLI source distribution

The CLI copies source into the consumer project. Once copied, the consumer may
edit those files. That is the intended workflow.

```bash
npx sorleed add button --dir ./my-app
```

Re-running the CLI will detect byte differences and abort rather than overwrite.
Resolve conflicts deliberately.

## Plain HTML and CSS

Copy `tokens/dist/tokens.css` and the component stylesheet. Use the canonical
markup as the starting point. Keep the `sl-` classes so the documented states
continue to work.

## What may be customised

- Copy, labels, helper text, placeholders and error messages.
- Field width and responsive layout through the surrounding container.
- Semantic colour roles, spacing, radius and typography through tokens.
- Component source after it has been copied into the consumer project.

## What must not be done

- Do not consume primitive or semantic tokens directly from component CSS.
- Do not add states or variants the contract does not define.
- Do not simulate dark mode by inverting values.
- Do not force a default country for every user.
- Do not claim phone-number deliverability from format validation.
