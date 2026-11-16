import { resolveTemplatePath } from '../utils/paths.js';

export const depositFundingFlowRegistry = {
  name: 'deposit-funding-flow',
  displayName: 'Deposit Funding Flow',
  description: 'Sorleed Deposit Funding Flow component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'deposit-funding-flow-wrapper',
      source: resolveTemplatePath('components/deposit-funding-flow/index.tsx'),
      dest: ['components', 'sorleed', 'deposit-funding-flow', 'index.tsx'],
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
      id: 'deposit-funding-flow-css',
      source: resolveTemplatePath('styles/deposit-funding-flow.css'),
      dest: ['styles', 'sorleed', 'deposit-funding-flow.css'],
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

