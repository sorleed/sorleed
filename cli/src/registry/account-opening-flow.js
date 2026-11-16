import { resolveTemplatePath } from '../utils/paths.js';

export const accountOpeningFlowRegistry = {
  name: 'account-opening-flow',
  displayName: 'Account Opening Flow',
  description: 'Sorleed AccountOpeningFlow multi-step Personal & Business onboarding component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'account-opening-flow-wrapper',
      source: resolveTemplatePath('components/account-opening-flow/index.tsx'),
      dest: ['components', 'sorleed', 'account-opening-flow', 'index.tsx'],
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
      id: 'account-opening-flow-css',
      source: resolveTemplatePath('styles/account-opening-flow.css'),
      dest: ['styles', 'sorleed', 'account-opening-flow.css'],
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

