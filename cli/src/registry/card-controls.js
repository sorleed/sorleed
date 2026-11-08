export default {
  name: "card-controls",
  description: "Card security and feature toggles (online payments, ATM, freeze card, international use)",
  category: "fintech",
  tokens: ["space", "color", "radius", "font"],
  dependencies: ["switch"],
  files: [
    {
      type: "css",
      source: "card-controls.css",
      target: "components/card-controls.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/card-controls.tsx",
    },
  ],
};

