import { resolveTemplatePath } from '../utils/paths.js';

export const accountSummaryRegistry = {
  name: 'account-summary',
  displayName: 'AccountSummary',
  description: 'Sorleed AccountSummary bank account overview component (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'account-summary-wrapper',
      source: resolveTemplatePath('components/account-summary/index.tsx'),
      dest: ['components', 'sorleed', 'account-summary', 'index.tsx'],
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
      id: 'account-summary-css',
      source: resolveTemplatePath('styles/account-summary.css'),
      dest: ['styles', 'sorleed', 'account-summary.css'],
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
