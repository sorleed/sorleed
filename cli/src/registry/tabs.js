import { resolveTemplatePath } from '../utils/paths.js';

export const tabsRegistry = {
  name: 'tabs',
  displayName: 'Tabs',
  description: 'Weft Tabs component (Radix UI Tabs + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'tabs-wrapper',
      source: resolveTemplatePath('components/tabs/index.tsx'),
      dest: ['components', 'sorleed', 'tabs', 'index.tsx'],
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
      id: 'tabs-css',
      source: resolveTemplatePath('styles/tabs.css'),
      dest: ['styles', 'sorleed', 'tabs.css'],
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
    npm: ['@radix-ui/react-tabs >=1.0.0']
  }
};

