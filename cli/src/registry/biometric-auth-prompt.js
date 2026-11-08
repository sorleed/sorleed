export default {
  name: "biometric-auth-prompt",
  description: "FaceID, TouchID, and WebAuthn biometric verification dialog powered by Radix Dialog",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["button"],
  peerDependencies: {
    npm: ["@radix-ui/react-dialog"],
  },
  files: [
    {
      type: "css",
      source: "biometric-auth-prompt.css",
      target: "components/biometric-auth-prompt.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/biometric-auth-prompt.tsx",
    },
  ],
};

