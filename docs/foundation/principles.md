# Sorleed Principles

## Status

- Status: Draft
- Applies to: Contributors, design, code, AI tooling

This is the constitution of Sorleed.

Every contributor should be able to read it and know:

How do we make decisions?
What is allowed?
What is not allowed?

I recommend these 8:

## 1. Accessible by Default

Every component must work with:

* Keyboard navigation
* Screen readers
* Focus states
* WCAG contrast

No accessibility retrofitting later.

## 2. Semantic Over Visual

Never build around colors.

Bad:

* Blue Button
* Green Text
* Red Card

Good:

* Primary Action
* Success Feedback
* Critical Alert

Meaning > appearance.

## 3. Themeable by Design

Sorleed ships structure.

Users bring branding.

A bank, crypto app, or insurance company should all use Sorleed without modifying component logic.

## 4. Source Owned

Inspired by shadcn.

The consumer owns component code.

No black boxes.

No locked UI package.

## 5. Consistent Yet Flexible

Consistency comes from:

* Tokens
* States
* Accessibility
* Component anatomy

Flexibility comes from:

* Colors
* Typography
* Branding

## 6. AI Friendly

Every component must contain:

* Documentation
* Anatomy
* Tokens used
* States
* Accessibility notes

This enables AI-assisted generation.

## 7. Fintech First

When uncertain:

Choose the solution that improves:

* Trust
* Clarity
* Data readability
* Transaction confidence

### Fintech Production Guardrails
1. **Zero Ambiguity in Monetary Display:**
   * Monetary figures must always be formatted unambiguously using canonical ISO 4217 currency codes or explicit locale standards (see `formatMoney`).
   * Never truncate financial values or account identifiers with text ellipsis (`text-overflow: ellipsis`) without an explicit expansion pattern.
   * Differentiate debit, credit, fee, and adjustment amounts visually and programmatically via `aria-label` or sign indicators (`+ $10.00` vs `- $10.00`), never by color alone.
2. **Defensive State & Idempotency:**
   * Transactional buttons must provide built-in double-submit guards during pending/loading operations.
   * Form inputs must fail-closed: malformed data preserves explicit `aria-invalid="true"` and associated error messages.
3. **Auditable & Non-Destructive Source:**
   * All distributed code must be clean, transparent, and auditable for security compliance (SOC 2, ISO 27001). Zero proprietary telemetry or closed dependencies.

## 8. Component Driven

Pages are assembled from components.

Components are assembled from tokens.

Never design pages first.

## Supporting Commitments

These are commitments, not additional principles.

* **Trust First** — a commitment within Fintech First.
* **Clarity Over Decoration** — a commitment within Semantic Over Visual.
* **Mobile First** — a cross-cutting design and implementation commitment.

## Relationship to Other Foundations

* [Color System](color-system.md)
* [Token Architecture](token-architecture.md)
