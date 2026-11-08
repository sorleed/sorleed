export default {
  name: "expense-receipt-uploader",
  description: "Expense receipt dropzone with OCR extracted fields and reimbursement flag",
  category: "fintech",
  tokens: ["space", "color", "radius", "font", "shadow"],
  dependencies: ["input", "currency", "switch", "button"],
  files: [
    {
      type: "css",
      source: "expense-receipt-uploader.css",
      target: "components/expense-receipt-uploader.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/expense-receipt-uploader.tsx",
    },
  ],
};

