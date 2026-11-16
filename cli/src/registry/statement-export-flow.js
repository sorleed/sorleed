import { resolveTemplatePath } from '../utils/paths.js';

export const statementExportFlowRegistry = {
  name: 'statement-export-flow',
  displayName: 'Statement Export Flow',
  description: 'Sorleed StatementExportFlow PDF and CSV statement generation workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'statement-export-flow-wrapper',
      source: resolveTemplatePath('components/statement-export-flow/index.tsx'),
      dest: ['components', 'sorleed', 'statement-export-flow', 'index.tsx'],
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
      id: 'statement-export-flow-css',
      source: resolveTemplatePath('styles/statement-export-flow.css'),
      dest: ['styles', 'sorleed', 'statement-export-flow.css'],
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

