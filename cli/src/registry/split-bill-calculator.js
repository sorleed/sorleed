export default {
  name: "split-bill-calculator",
  description: "Bill splitting and expense calculator with tipping, participant weights, and payment links",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["currency", "avatar", "button"],
  files: [
    {
      type: "css",
      source: "split-bill-calculator.css",
      target: "components/split-bill-calculator.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/split-bill-calculator.tsx",
    },
  ],
};

