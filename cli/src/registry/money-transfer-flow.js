import { resolveTemplatePath } from '../utils/paths.js';

export const moneyTransferFlowRegistry = {
  name: 'money-transfer-flow',
  displayName: 'Money Transfer Flow',
  description: 'Sorleed Money Transfer Flow component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'money-transfer-flow-wrapper',
      source: resolveTemplatePath('components/money-transfer-flow/index.tsx'),
      dest: ['components', 'sorleed', 'money-transfer-flow', 'index.tsx'],
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
      id: 'money-transfer-flow-css',
      source: resolveTemplatePath('styles/money-transfer-flow.css'),
      dest: ['styles', 'sorleed', 'money-transfer-flow.css'],
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

