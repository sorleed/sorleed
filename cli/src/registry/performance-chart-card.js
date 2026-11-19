import { resolveTemplatePath } from '../utils/paths.js';

export const performanceChartCardRegistry = {
  name: 'performance-chart-card',
  displayName: 'Performance Chart Card',
  description: 'Investment performance sparkline card with Radix Tabs timeframe switcher and benchmark comparison',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'performance-chart-card-wrapper',
      source: resolveTemplatePath('components/performance-chart-card/index.tsx'),
      dest: ['components', 'sorleed', 'performance-chart-card', 'index.tsx'],
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
      id: 'performance-chart-card-css',
      source: resolveTemplatePath('styles/performance-chart-card.css'),
      dest: ['styles', 'sorleed', 'performance-chart-card.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0', '@radix-ui/react-tabs >=1.0.0']
  }
};
