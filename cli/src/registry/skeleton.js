import { resolveTemplatePath } from '../utils/paths.js';

export const skeletonRegistry = {
  name: 'skeleton',
  displayName: 'Skeleton',
  description: 'Sorleed Skeleton shimmer loading placeholders (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'skeleton-wrapper',
      source: resolveTemplatePath('components/skeleton/index.tsx'),
      dest: ['components', 'sorleed', 'skeleton', 'index.tsx'],
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
      id: 'skeleton-css',
      source: resolveTemplatePath('styles/skeleton.css'),
      dest: ['styles', 'sorleed', 'skeleton.css'],
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
