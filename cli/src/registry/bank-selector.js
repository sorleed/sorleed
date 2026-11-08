import { resolveTemplatePath } from '../utils/paths.js';

export const bankSelectorRegistry = {
  name: 'bank-selector',
  displayName: 'BankSelector',
  description: 'Sorleed BankSelector searchable financial institution picker (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'bank-selector-wrapper',
      source: resolveTemplatePath('components/bank-selector/index.tsx'),
      dest: ['components', 'sorleed', 'bank-selector', 'index.tsx'],
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
      id: 'bank-selector-css',
      source: resolveTemplatePath('styles/bank-selector.css'),
      dest: ['styles', 'sorleed', 'bank-selector.css'],
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

