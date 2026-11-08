import { resolveTemplatePath } from '../utils/paths.js';

export const spendingMeterRegistry = {
  name: 'spending-meter',
  displayName: 'SpendingMeter',
  description: 'Sorleed SpendingMeter daily/monthly budget tracking progress bar (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'spending-meter-wrapper',
      source: resolveTemplatePath('components/spending-meter/index.tsx'),
      dest: ['components', 'sorleed', 'spending-meter', 'index.tsx'],
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
      id: 'spending-meter-css',
      source: resolveTemplatePath('styles/spending-meter.css'),
      dest: ['styles', 'sorleed', 'spending-meter.css'],
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
