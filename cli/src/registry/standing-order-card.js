import { resolveTemplatePath } from '../utils/paths.js';

export const standingOrderCardRegistry = {
  name: 'standing-order-card',
  displayName: 'Standing Order Card',
  description: 'Sorleed Standing Order Card component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'standing-order-card-wrapper',
      source: resolveTemplatePath('components/standing-order-card/index.tsx'),
      dest: ['components', 'sorleed', 'standing-order-card', 'index.tsx'],
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
      id: 'standing-order-card-css',
      source: resolveTemplatePath('styles/standing-order-card.css'),
      dest: ['styles', 'sorleed', 'standing-order-card.css'],
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

