export default {
  name: "accordion",
  description: "Collapsible disclosure panels for compliance terms, fee FAQs, and transaction audits",
  category: "core",
  tokens: ["space", "color", "radius", "font"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "accordion.css",
      target: "components/accordion.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/accordion.tsx",
    },
  ],
};

