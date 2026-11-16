import { resolveTemplatePath } from '../utils/paths.js';

export const cardManagementFlowRegistry = {
  name: 'card-management-flow',
  displayName: 'Card Management Flow',
  description: 'Sorleed CardManagementFlow card lifecycle actions component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'card-management-flow-wrapper',
      source: resolveTemplatePath('components/card-management-flow/index.tsx'),
      dest: ['components', 'sorleed', 'card-management-flow', 'index.tsx'],
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
      id: 'card-management-flow-css',
      source: resolveTemplatePath('styles/card-management-flow.css'),
      dest: ['styles', 'sorleed', 'card-management-flow.css'],
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

