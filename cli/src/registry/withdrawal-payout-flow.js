import { resolveTemplatePath } from '../utils/paths.js';

export const withdrawalPayoutFlowRegistry = {
  name: 'withdrawal-payout-flow',
  displayName: 'Withdrawal Payout Flow',
  description: 'Sorleed Withdrawal Payout Flow component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'withdrawal-payout-flow-wrapper',
      source: resolveTemplatePath('components/withdrawal-payout-flow/index.tsx'),
      dest: ['components', 'sorleed', 'withdrawal-payout-flow', 'index.tsx'],
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
      id: 'withdrawal-payout-flow-css',
      source: resolveTemplatePath('styles/withdrawal-payout-flow.css'),
      dest: ['styles', 'sorleed', 'withdrawal-payout-flow.css'],
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

