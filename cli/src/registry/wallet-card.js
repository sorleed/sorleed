import { resolveTemplatePath } from '../utils/paths.js';

export const walletCardRegistry = {
  name: 'wallet-card',
  displayName: 'WalletCard',
  description: 'Sorleed WalletCard virtual debit/credit card visualizer (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'wallet-card-wrapper',
      source: resolveTemplatePath('components/wallet-card/index.tsx'),
      dest: ['components', 'sorleed', 'wallet-card', 'index.tsx'],
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
      id: 'wallet-card-css',
      source: resolveTemplatePath('styles/wallet-card.css'),
      dest: ['styles', 'sorleed', 'wallet-card.css'],
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
