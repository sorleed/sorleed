import { resolveTemplatePath } from '../utils/paths.js';

export const tooltipRegistry = {
  name: 'tooltip',
  displayName: 'Tooltip',
  description: 'Weft Tooltip component (Radix UI Tooltip + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'tooltip-wrapper',
      source: resolveTemplatePath('components/tooltip/index.tsx'),
      dest: ['components', 'sorleed', 'tooltip', 'index.tsx'],
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
      id: 'tooltip-css',
      source: resolveTemplatePath('styles/tooltip.css'),
      dest: ['styles', 'sorleed', 'tooltip.css'],
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
    npm: ['@radix-ui/react-tooltip']
  }
};

