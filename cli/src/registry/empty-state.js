import { resolveTemplatePath } from '../utils/paths.js';

export const emptyStateRegistry = {
  name: 'empty-state',
  displayName: 'EmptyState',
  description: 'Sorleed EmptyState zero-data placeholder (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'empty-state-wrapper',
      source: resolveTemplatePath('components/empty-state/index.tsx'),
      dest: ['components', 'sorleed', 'empty-state', 'index.tsx'],
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
      id: 'empty-state-css',
      source: resolveTemplatePath('styles/empty-state.css'),
      dest: ['styles', 'sorleed', 'empty-state.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0'],
    runtime: []
  }
};

