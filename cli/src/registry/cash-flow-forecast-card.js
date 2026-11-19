import { resolveTemplatePath } from '../utils/paths.js';

export const cashFlowForecastCardRegistry = {
  name: 'cash-flow-forecast-card',
  displayName: 'Cash Flow Forecast Card',
  description: 'Treasury runway projection card comparing receivables vs payables with Radix Tabs horizon switcher',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'cash-flow-forecast-card-wrapper',
      source: resolveTemplatePath('components/cash-flow-forecast-card/index.tsx'),
      dest: ['components', 'sorleed', 'cash-flow-forecast-card', 'index.tsx'],
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
      id: 'cash-flow-forecast-card-css',
      source: resolveTemplatePath('styles/cash-flow-forecast-card.css'),
      dest: ['styles', 'sorleed', 'cash-flow-forecast-card.css'],
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
