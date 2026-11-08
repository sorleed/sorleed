import { test } from "node:test";
import assert from "node:assert/strict";
import { formatMoney } from "../utils/format";

test("formatMoney formats standard ISO USD currency", () => {
  const result = formatMoney(1250.5, { currency: "USD", locale: "en-US" });
  assert.equal(result, "$1,250.50");
});

test("formatMoney formats EUR with German locale", () => {
  const result = formatMoney(1250.5, { currency: "EUR", locale: "de-DE" });
  // In German locale: 1.250,50 €
  assert.match(result, /1\.250,50/);
});

test("formatMoney supports signDisplay for positive credit transactions", () => {
  const result = formatMoney(450, { currency: "USD", signDisplay: "always" });
  assert.match(result, /^\+\$450\.00/);
});

test("formatMoney gracefully handles numeric string and NaN input", () => {
  assert.equal(formatMoney("1000.25"), "$1,000.25");
  assert.equal(formatMoney("invalid-number"), "USD 0.00");
});

test("formatMoney handles custom symbol prefixes gracefully", () => {
  const result = formatMoney(50, { currency: "₦" });
  assert.equal(result, "₦ 50.00");
});
