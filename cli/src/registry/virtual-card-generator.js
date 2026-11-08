export default {
  name: "virtual-card-generator",
  description: "Virtual card issuance studio with live preview, limit slider, and merchant lock controls",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["wallet-card", "input", "switch", "button"],
  files: [
    {
      type: "css",
      source: "virtual-card-generator.css",
      target: "components/virtual-card-generator.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/virtual-card-generator.tsx",
    },
  ],
};

