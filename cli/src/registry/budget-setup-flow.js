import { resolveTemplatePath } from '../utils/paths.js';

export const budgetSetupFlowRegistry = {
  name: 'budget-setup-flow',
  displayName: 'Budget Setup Flow',
  description: 'Personal finance monthly budget builder with income cap validation, SpendingMeter previews, and overspend alert toggles',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'budget-setup-flow-wrapper',
      source: resolveTemplatePath('components/budget-setup-flow/index.tsx'),
      dest: ['components', 'sorleed', 'budget-setup-flow', 'index.tsx'],
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
      id: 'budget-setup-flow-css',
      source: resolveTemplatePath('styles/budget-setup-flow.css'),
      dest: ['styles', 'sorleed', 'budget-setup-flow.css'],
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
