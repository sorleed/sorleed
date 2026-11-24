import { resolveTemplatePath } from '../utils/paths.js';

export const bankReconciliationMatcherRegistry = {
  name: 'bank-reconciliation-matcher',
  displayName: 'Bank Reconciliation Matcher',
  description: 'Two-column bank feed vs general ledger reconciliation matcher with discrepancy detection and unmatch support',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'bank-reconciliation-matcher-wrapper',
      source: resolveTemplatePath('components/bank-reconciliation-matcher/index.tsx'),
      dest: ['components', 'sorleed', 'bank-reconciliation-matcher', 'index.tsx'],
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
      id: 'bank-reconciliation-matcher-css',
      source: resolveTemplatePath('styles/bank-reconciliation-matcher.css'),
      dest: ['styles', 'sorleed', 'bank-reconciliation-matcher.css'],
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

