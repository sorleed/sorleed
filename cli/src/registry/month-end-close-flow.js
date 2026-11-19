import { resolveTemplatePath } from '../utils/paths.js';

export const monthEndCloseFlowRegistry = {
  name: 'month-end-close-flow',
  displayName: 'Month-End Close Flow',
  description: 'End-to-end accounting close workflow combining BankReconciliationMatcher, CashFlowForecastCard, AuditTrailTimeline, and period lock sign-off',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'month-end-close-flow-wrapper',
      source: resolveTemplatePath('components/month-end-close-flow/index.tsx'),
      dest: ['components', 'sorleed', 'month-end-close-flow', 'index.tsx'],
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
      id: 'month-end-close-flow-css',
      source: resolveTemplatePath('styles/month-end-close-flow.css'),
      dest: ['styles', 'sorleed', 'month-end-close-flow.css'],
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
