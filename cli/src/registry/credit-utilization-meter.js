import { resolveTemplatePath } from '../utils/paths.js';

export const creditUtilizationMeterRegistry = {
  name: 'credit-utilization-meter',
  displayName: 'Credit Utilization Meter',
  description: 'Revolving credit limit utilization bar with FICO risk bands, available credit, and statement close metadata',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'credit-utilization-meter-wrapper',
      source: resolveTemplatePath('components/credit-utilization-meter/index.tsx'),
      dest: ['components', 'sorleed', 'credit-utilization-meter', 'index.tsx'],
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
      id: 'credit-utilization-meter-css',
      source: resolveTemplatePath('styles/credit-utilization-meter.css'),
      dest: ['styles', 'sorleed', 'credit-utilization-meter.css'],
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
