import { resolveTemplatePath } from '../utils/paths.js';

export const loanCalculatorRegistry = {
  name: 'loan-calculator',
  displayName: 'LoanCalculator',
  description: 'Sorleed LoanCalculator real-time loan EMI calculation slider (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'loan-calculator-wrapper',
      source: resolveTemplatePath('components/loan-calculator/index.tsx'),
      dest: ['components', 'sorleed', 'loan-calculator', 'index.tsx'],
      required: true,
      type: 'component',
      shared: false,
      overwrite: 'prompt'
    },
    {
      id: 'shared-types',
      source: resolveTemplatePath('components/types/index.ts'),
      dest: ['components', 'sorleed', 'types', 'index.ts'],
      required: true,
      type: 'types',
      shared: true,
      sharedKey: 'sorleed-shared-types',
      overwrite: 'skip-if-exists'
    },
    {
      id: 'loan-calculator-css',
      source: resolveTemplatePath('styles/loan-calculator.css'),
      dest: ['styles', 'sorleed', 'loan-calculator.css'],
      required: true,
      type: 'css',
      shared: false,
      overwrite: 'prompt'
    },
    {
      id: 'tokens-css',
      source: resolveTemplatePath('styles/tokens.css'),
      dest: ['styles', 'sorleed', 'tokens.css'],
      required: true,
      type: 'css',
      shared: true,
      sharedKey: 'sorleed-tokens',
      overwrite: 'skip-if-exists'
    }
  ],
  dependencies: {
    peer: ['react >=18.0.0', 'react-dom >=18.0.0'],
    runtime: []
  }
};
