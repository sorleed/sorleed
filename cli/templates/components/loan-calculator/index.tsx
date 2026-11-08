import React, { useState } from "react";
import type { LoanCalculatorProps } from "../types";

export const LoanCalculator = React.forwardRef<HTMLDivElement, LoanCalculatorProps>(
  (
    {
      minAmount = 1000,
      maxAmount = 50000,
      stepAmount = 500,
      defaultAmount = 10000,
      minTenure = 6,
      maxTenure = 60,
      defaultTenure = 24,
      interestRate = 12, // annual percentage
      currency = "USD",
      onCalculate,
      className,
      ...props
    },
    ref,
  ) => {
    const [amount, setAmount] = useState(defaultAmount);
    const [tenure, setTenure] = useState(defaultTenure);

    // Calculate Monthly Installment (EMI) using standard amortization formula
    // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyRate = interestRate / 12 / 100;
    const factor = Math.pow(1 + monthlyRate, tenure);
    const monthlyPayment = monthlyRate > 0
      ? (amount * monthlyRate * factor) / (factor - 1)
      : amount / tenure;

    const totalRepayment = monthlyPayment * tenure;
    const totalInterest = totalRepayment - amount;

    const handleAmountChange = (val: number) => {
      setAmount(val);
      onCalculate?.({
        principal: val,
        tenureMonths: tenure,
        monthlyPayment: Math.round(monthlyPayment),
        totalRepayment: Math.round(totalRepayment),
        totalInterest: Math.round(totalInterest),
      });
    };

    const handleTenureChange = (val: number) => {
      setTenure(val);
      onCalculate?.({
        principal: amount,
        tenureMonths: val,
        monthlyPayment: Math.round(monthlyPayment),
        totalRepayment: Math.round(totalRepayment),
        totalInterest: Math.round(totalInterest),
      });
    };

    const classes = ["fc-loan-calculator", className].filter(Boolean).join(" ");

    return (
      <div ref={ref} className={classes} role="region" aria-label="Loan EMI Calculator" {...props}>
        <div className="fc-loan-calculator__header">
          <h3 className="fc-loan-calculator__title">Loan & Credit Calculator</h3>
          <p className="fc-loan-calculator__subtitle">
            Estimate your monthly repayment at {interestRate}% fixed APR
          </p>
        </div>

        <div className="fc-loan-calculator__controls">
          {/* Amount slider */}
          <div className="fc-loan-calculator__control-group">
            <div className="fc-loan-calculator__label-row">
              <span className="fc-loan-calculator__label">Loan Amount</span>
              <span className="fc-loan-calculator__value">{currency} {amount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={minAmount}
              max={maxAmount}
              step={stepAmount}
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              onInput={(e) => handleAmountChange(Number((e.target as HTMLInputElement).value))}
              aria-label="Loan Amount Slider"
              className="fc-loan-calculator__slider"
            />
          </div>

          {/* Tenure slider */}
          <div className="fc-loan-calculator__control-group">
            <div className="fc-loan-calculator__label-row">
              <span className="fc-loan-calculator__label">Tenure (Duration)</span>
              <span className="fc-loan-calculator__value">{tenure} Months ({Math.round((tenure / 12) * 10) / 10} yrs)</span>
            </div>
            <input
              type="range"
              min={minTenure}
              max={maxTenure}
              step={1}
              value={tenure}
              onChange={(e) => handleTenureChange(Number(e.target.value))}
              onInput={(e) => handleTenureChange(Number((e.target as HTMLInputElement).value))}
              aria-label="Loan Tenure in Months"
              className="fc-loan-calculator__slider"
            />
          </div>
        </div>

        <div className="fc-loan-calculator__summary-card">
          <div className="fc-loan-calculator__emi-row">
            <span className="fc-loan-calculator__emi-label">Monthly Repayment</span>
            <span className="fc-loan-calculator__emi-amount">
              {currency} {Math.round(monthlyPayment).toLocaleString()}/mo
            </span>
          </div>

          <div className="fc-loan-calculator__stats-grid">
            <div>
              Total Interest: <strong>{currency} {Math.round(totalInterest).toLocaleString()}</strong>
            </div>
            <div>
              Total Repayment: <strong>{currency} {Math.round(totalRepayment).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

LoanCalculator.displayName = "LoanCalculator";
export default LoanCalculator;
