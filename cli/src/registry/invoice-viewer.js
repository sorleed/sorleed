export default {
  name: "invoice-viewer",
  description: "Commercial invoice document with line-items, tax calculations, and status badges",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["badge"],
  files: [
    {
      type: "css",
      source: "invoice-viewer.css",
      target: "components/invoice-viewer.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/invoice-viewer.tsx",
    },
  ],
};

