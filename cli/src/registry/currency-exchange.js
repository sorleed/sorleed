import { resolveTemplatePath } from '../utils/paths.js';

export const currencyExchangeRegistry = {
  name: 'currency-exchange',
  displayName: 'CurrencyExchange',
  description: 'Sorleed CurrencyExchange two-way currency converter (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'currency-exchange-wrapper',
      source: resolveTemplatePath('components/currency-exchange/index.tsx'),
      dest: ['components', 'sorleed', 'currency-exchange', 'index.tsx'],
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
      id: 'currency-exchange-css',
      source: resolveTemplatePath('styles/currency-exchange.css'),
      dest: ['styles', 'sorleed', 'currency-exchange.css'],
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

