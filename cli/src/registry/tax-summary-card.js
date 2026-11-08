export default {
  name: "tax-summary-card",
  description: "Tax compliance breakdown displaying gross income, deductions, taxable net, and liability",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "tax-summary-card.css",
      target: "components/tax-summary-card.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/tax-summary-card.tsx",
    },
  ],
};

