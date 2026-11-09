export default {
  name: "yield-curve-table",
  description: "Treasury bond yield curve and maturities schedule table with action triggers",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "yield-curve-table.css",
      target: "components/yield-curve-table.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/yield-curve-table.tsx",
    },
  ],
};

