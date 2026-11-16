import { resolveTemplatePath } from '../utils/paths.js';

export const billPaymentFlowRegistry = {
  name: 'bill-payment-flow',
  displayName: 'Bill Payment Flow',
  description: 'Sorleed BillPaymentFlow personal bills and business invoice settlement component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'bill-payment-flow-wrapper',
      source: resolveTemplatePath('components/bill-payment-flow/index.tsx'),
      dest: ['components', 'sorleed', 'bill-payment-flow', 'index.tsx'],
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
      id: 'bill-payment-flow-css',
      source: resolveTemplatePath('styles/bill-payment-flow.css'),
      dest: ['styles', 'sorleed', 'bill-payment-flow.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0']
  }
};

