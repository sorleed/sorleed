import { resolveTemplatePath } from '../utils/paths.js';

export const savingsGoalFlowRegistry = {
  name: 'savings-goal-flow',
  displayName: 'Savings Goal Flow',
  description: 'Personal finance savings goal & pot creation journey with auto-save frequency, APY projection, and round-ups',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'savings-goal-flow-wrapper',
      source: resolveTemplatePath('components/savings-goal-flow/index.tsx'),
      dest: ['components', 'sorleed', 'savings-goal-flow', 'index.tsx'],
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
      id: 'savings-goal-flow-css',
      source: resolveTemplatePath('styles/savings-goal-flow.css'),
      dest: ['styles', 'sorleed', 'savings-goal-flow.css'],
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

