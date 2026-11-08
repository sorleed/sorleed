import { resolveTemplatePath } from '../utils/paths.js';

export const creditScoreGaugeRegistry = {
  name: 'credit-score-gauge',
  displayName: 'CreditScoreGauge',
  description: 'Sorleed CreditScoreGauge radial dial credit health meter (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'credit-score-gauge-wrapper',
      source: resolveTemplatePath('components/credit-score-gauge/index.tsx'),
      dest: ['components', 'sorleed', 'credit-score-gauge', 'index.tsx'],
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
      id: 'credit-score-gauge-css',
      source: resolveTemplatePath('styles/credit-score-gauge.css'),
      dest: ['styles', 'sorleed', 'credit-score-gauge.css'],
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
