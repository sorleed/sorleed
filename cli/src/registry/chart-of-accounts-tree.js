export default {
  name: "chart-of-accounts-tree",
  description: "Hierarchical general ledger chart of accounts tree (Assets, Liabilities, Equity)",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "chart-of-accounts-tree.css",
      target: "components/chart-of-accounts-tree.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/chart-of-accounts-tree.tsx",
    },
  ],
};

