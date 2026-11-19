import { resolveTemplatePath } from '../utils/paths.js';

export const sessionTimeoutModalRegistry = {
  name: 'session-timeout-modal',
  displayName: 'Session Timeout Modal',
  description: 'PCI/banking inactivity session warning modal with SVG countdown ring and Radix Dialog',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'session-timeout-modal-wrapper',
      source: resolveTemplatePath('components/session-timeout-modal/index.tsx'),
      dest: ['components', 'sorleed', 'session-timeout-modal', 'index.tsx'],
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
      id: 'session-timeout-modal-css',
      source: resolveTemplatePath('styles/session-timeout-modal.css'),
      dest: ['styles', 'sorleed', 'session-timeout-modal.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0', '@radix-ui/react-dialog >=1.0.0']
  }
};
