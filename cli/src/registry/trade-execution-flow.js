import { resolveTemplatePath } from '../utils/paths.js';

export const tradeExecutionFlowRegistry = {
  name: 'trade-execution-flow',
  displayName: 'Trade Execution Flow',
  description: 'End-to-end brokerage trade journey combining PerformanceChartCard, OrderEntryTicket, review step, and execution receipt',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'trade-execution-flow-wrapper',
      source: resolveTemplatePath('components/trade-execution-flow/index.tsx'),
      dest: ['components', 'sorleed', 'trade-execution-flow', 'index.tsx'],
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
      id: 'trade-execution-flow-css',
      source: resolveTemplatePath('styles/trade-execution-flow.css'),
      dest: ['styles', 'sorleed', 'trade-execution-flow.css'],
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
