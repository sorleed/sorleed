export default {
  name: "asset-allocation",
  description: "Wealth & investment asset distribution breakdown bar and portfolio allocation list",
  category: "fintech",
  tokens: ["space", "color", "radius", "font"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "asset-allocation.css",
      target: "components/asset-allocation.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/asset-allocation.tsx",
    },
  ],
};

