export default {
  name: "direct-debit-mandate",
  description: "Direct debit recurring billing authorization modal powered by Radix Dialog",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["button"],
  peerDependencies: {
    npm: ["@radix-ui/react-dialog"],
  },
  files: [
    {
      type: "css",
      source: "direct-debit-mandate.css",
      target: "components/direct-debit-mandate.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/direct-debit-mandate.tsx",
    },
  ],
};

