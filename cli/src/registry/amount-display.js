import { resolveTemplatePath } from '../utils/paths.js';

export const amountDisplayRegistry = {
  name: 'amount-display',
  displayName: 'Amount Display',
  description: 'Weft Amount Display component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'amount-display-wrapper',
      source: resolveTemplatePath('components/amount-display/index.tsx'),
      dest: ['components', 'sorleed', 'amount-display', 'index.tsx'],
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
      id: 'amount-display-css',
      source: resolveTemplatePath('styles/amount-display.css'),
      dest: ['styles', 'sorleed', 'amount-display.css'],
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

