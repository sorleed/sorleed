export default {
  name: "repayment-schedule",
  description: "Loan amortization and installment repayment schedule breakdown with pay actions",
  category: "fintech",
  tokens: ["space", "color", "radius", "font"],
  dependencies: [],
  files: [
    {
      type: "css",
      source: "repayment-schedule.css",
      target: "components/repayment-schedule.css",
    },
    {
      type: "react",
      source: "index.tsx",
      target: "components/repayment-schedule.tsx",
    },
  ],
};

