import { resolveTemplatePath } from '../utils/paths.js';

export const feeBreakdownRegistry = {
  name: 'fee-breakdown',
  displayName: 'FeeBreakdown',
  description: 'Sorleed FeeBreakdown transparent fee disclosure sheet (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'fee-breakdown-wrapper',
      source: resolveTemplatePath('components/fee-breakdown/index.tsx'),
      dest: ['components', 'sorleed', 'fee-breakdown', 'index.tsx'],
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
      id: 'fee-breakdown-css',
      source: resolveTemplatePath('styles/fee-breakdown.css'),
      dest: ['styles', 'sorleed', 'fee-breakdown.css'],
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

