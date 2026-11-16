import { resolveTemplatePath } from '../utils/paths.js';

export const recurringPaymentFlowRegistry = {
  name: 'recurring-payment-flow',
  displayName: 'Recurring Payment Flow',
  description: 'Sorleed RecurringPaymentFlow standing order configuration workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'recurring-payment-flow-wrapper',
      source: resolveTemplatePath('components/recurring-payment-flow/index.tsx'),
      dest: ['components', 'sorleed', 'recurring-payment-flow', 'index.tsx'],
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
      id: 'recurring-payment-flow-css',
      source: resolveTemplatePath('styles/recurring-payment-flow.css'),
      dest: ['styles', 'sorleed', 'recurring-payment-flow.css'],
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

