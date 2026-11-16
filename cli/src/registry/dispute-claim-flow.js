import { resolveTemplatePath } from '../utils/paths.js';

export const disputeClaimFlowRegistry = {
  name: 'dispute-claim-flow',
  displayName: 'Dispute Claim Flow',
  description: 'Sorleed DisputeClaimFlow chargeback and transaction dispute workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'dispute-claim-flow-wrapper',
      source: resolveTemplatePath('components/dispute-claim-flow/index.tsx'),
      dest: ['components', 'sorleed', 'dispute-claim-flow', 'index.tsx'],
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
      id: 'dispute-claim-flow-css',
      source: resolveTemplatePath('styles/dispute-claim-flow.css'),
      dest: ['styles', 'sorleed', 'dispute-claim-flow.css'],
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

