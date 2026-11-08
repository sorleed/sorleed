import "./setup.ts";
import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { AmountDisplay } from "../amount-display/index.tsx";

test("AmountDisplay renders basic value and currency string", () => {
  const { container } = render(
    React.createElement(AmountDisplay, { value: "1,250.00", currency: "$" }),
  );
  const root = container.querySelector(".fc-amount-display");
  assert.ok(root);
  assert.ok(root.classList.contains("fc-amount-display--md"));
  assert.ok(root.classList.contains("fc-amount-display--default"));

  const currencySpan = container.querySelector(".fc-amount-display__currency");
  assert.equal(currencySpan?.textContent, "$");

  const valueSpan = container.querySelector(".fc-amount-display__value");
  assert.equal(valueSpan?.textContent, "1,250.00");
});

test("AmountDisplay formats numeric ISO currencies using formatMoney", () => {
  const { container } = render(
    React.createElement(AmountDisplay, {
      value: 1250.5,
      currency: "USD",
      variant: "positive",
      locale: "en-US",
    }),
  );

  const root = container.querySelector(".fc-amount-display");
  assert.ok(root?.classList.contains("fc-amount-display--positive"));

  const valueSpan = container.querySelector(".fc-amount-display__value");
  // Positive variant automatically applies signDisplay "always" -> "+$ 1,250.50"
  assert.ok(valueSpan?.textContent?.includes("1,250.50"));
  assert.ok(valueSpan?.textContent?.includes("+"));
});

test("AmountDisplay supports size and variant modifiers", () => {
  const { container } = render(
    React.createElement(AmountDisplay, {
      value: "500",
      size: "lg",
      variant: "negative",
    }),
  );
  const root = container.querySelector(".fc-amount-display");
  assert.ok(root?.classList.contains("fc-amount-display--lg"));
  assert.ok(root?.classList.contains("fc-amount-display--negative"));
});
