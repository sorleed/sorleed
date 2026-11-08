import { resolveTemplatePath } from '../utils/paths.js';

export const transferReceiptRegistry = {
  name: 'transfer-receipt',
  displayName: 'TransferReceipt',
  description: 'Sorleed TransferReceipt digital proof of payment (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'transfer-receipt-wrapper',
      source: resolveTemplatePath('components/transfer-receipt/index.tsx'),
      dest: ['components', 'sorleed', 'transfer-receipt', 'index.tsx'],
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
      id: 'transfer-receipt-css',
      source: resolveTemplatePath('styles/transfer-receipt.css'),
      dest: ['styles', 'sorleed', 'transfer-receipt.css'],
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

