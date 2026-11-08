import { resolveTemplatePath } from '../utils/paths.js';

export const statusIndicatorRegistry = {
  name: 'status-indicator',
  displayName: 'Status Indicator',
  description: 'Weft Status Indicator component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'status-indicator-wrapper',
      source: resolveTemplatePath('components/status-indicator/index.tsx'),
      dest: ['components', 'sorleed', 'status-indicator', 'index.tsx'],
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
      id: 'status-indicator-css',
      source: resolveTemplatePath('styles/status-indicator.css'),
      dest: ['styles', 'sorleed', 'status-indicator.css'],
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

