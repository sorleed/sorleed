import { resolveTemplatePath } from '../utils/paths.js';

export const ibanAccountDetailsRegistry = {
  name: 'iban-account-details',
  displayName: 'IBAN Account Details',
  description: 'Sorleed IBAN Account Details component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'iban-account-details-wrapper',
      source: resolveTemplatePath('components/iban-account-details/index.tsx'),
      dest: ['components', 'sorleed', 'iban-account-details', 'index.tsx'],
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
      id: 'iban-account-details-css',
      source: resolveTemplatePath('styles/iban-account-details.css'),
      dest: ['styles', 'sorleed', 'iban-account-details.css'],
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

