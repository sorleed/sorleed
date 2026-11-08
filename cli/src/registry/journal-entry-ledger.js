export default {
  name: "journal-entry-ledger",
  description: "Double-entry bookkeeping journal table enforcing debit and credit balancing",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "journal-entry-ledger.css",
      target: "components/journal-entry-ledger.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/journal-entry-ledger.tsx",
    },
  ],
};

