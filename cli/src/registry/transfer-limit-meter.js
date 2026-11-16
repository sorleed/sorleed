import { resolveTemplatePath } from '../utils/paths.js';

export const transferLimitMeterRegistry = {
  name: 'transfer-limit-meter',
  displayName: 'Transfer Limit Meter',
  description: 'Sorleed Transfer Limit Meter component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'transfer-limit-meter-wrapper',
      source: resolveTemplatePath('components/transfer-limit-meter/index.tsx'),
      dest: ['components', 'sorleed', 'transfer-limit-meter', 'index.tsx'],
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
      id: 'transfer-limit-meter-css',
      source: resolveTemplatePath('styles/transfer-limit-meter.css'),
      dest: ['styles', 'sorleed', 'transfer-limit-meter.css'],
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

