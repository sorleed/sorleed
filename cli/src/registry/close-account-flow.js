import { resolveTemplatePath } from '../utils/paths.js';

export const closeAccountFlowRegistry = {
  name: 'close-account-flow',
  displayName: 'Close Account Flow',
  description: 'Sorleed CloseAccountFlow offboarding and remaining balance sweep workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'close-account-flow-wrapper',
      source: resolveTemplatePath('components/close-account-flow/index.tsx'),
      dest: ['components', 'sorleed', 'close-account-flow', 'index.tsx'],
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
      id: 'close-account-flow-css',
      source: resolveTemplatePath('styles/close-account-flow.css'),
      dest: ['styles', 'sorleed', 'close-account-flow.css'],
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

