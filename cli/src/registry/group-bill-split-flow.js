import { resolveTemplatePath } from '../utils/paths.js';

export const groupBillSplitFlowRegistry = {
  name: 'group-bill-split-flow',
  displayName: 'Group Bill Split Flow',
  description: 'Personal finance P2P bill splitting flow combining SplitBillCalculator, friend selection, and payment request tracking',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'group-bill-split-flow-wrapper',
      source: resolveTemplatePath('components/group-bill-split-flow/index.tsx'),
      dest: ['components', 'sorleed', 'group-bill-split-flow', 'index.tsx'],
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
      id: 'group-bill-split-flow-css',
      source: resolveTemplatePath('styles/group-bill-split-flow.css'),
      dest: ['styles', 'sorleed', 'group-bill-split-flow.css'],
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
