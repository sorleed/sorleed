import { resolveTemplatePath } from '../utils/paths.js';

export const virtualCardRevealRegistry = {
  name: 'virtual-card-reveal',
  displayName: 'Virtual Card Reveal',
  description: 'PCI-aware virtual card PAN, expiry, and CVV reveal with auto-remask timer and one-click copy',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'virtual-card-reveal-wrapper',
      source: resolveTemplatePath('components/virtual-card-reveal/index.tsx'),
      dest: ['components', 'sorleed', 'virtual-card-reveal', 'index.tsx'],
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
      id: 'virtual-card-reveal-css',
      source: resolveTemplatePath('styles/virtual-card-reveal.css'),
      dest: ['styles', 'sorleed', 'virtual-card-reveal.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0', '@radix-ui/react-tooltip >=1.0.0']
  }
};

