export default {
  name: "pagination",
  description: "Accessible pagination controls for ledger histories and multi-page statements",
  category: "navigation",
  tokens: ["space", "color", "radius", "font"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "pagination.css",
      target: "components/pagination.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/pagination.tsx",
    },
  ],
};

