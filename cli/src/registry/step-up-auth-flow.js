import { resolveTemplatePath } from '../utils/paths.js';

export const stepUpAuthFlowRegistry = {
  name: 'step-up-auth-flow',
  displayName: 'Step-Up Auth Flow',
  description: 'Sorleed Step-Up Auth Flow component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'step-up-auth-flow-wrapper',
      source: resolveTemplatePath('components/step-up-auth-flow/index.tsx'),
      dest: ['components', 'sorleed', 'step-up-auth-flow', 'index.tsx'],
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
      id: 'step-up-auth-flow-css',
      source: resolveTemplatePath('styles/step-up-auth-flow.css'),
      dest: ['styles', 'sorleed', 'step-up-auth-flow.css'],
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

