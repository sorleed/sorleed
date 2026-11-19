import { resolveTemplatePath } from '../utils/paths.js';

export const deviceManagementCardRegistry = {
  name: 'device-management-card',
  displayName: 'Device Management Card',
  description: 'Active sessions and trusted devices list with IP/location metadata and single or bulk revocation',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'device-management-card-wrapper',
      source: resolveTemplatePath('components/device-management-card/index.tsx'),
      dest: ['components', 'sorleed', 'device-management-card', 'index.tsx'],
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
      id: 'device-management-card-css',
      source: resolveTemplatePath('styles/device-management-card.css'),
      dest: ['styles', 'sorleed', 'device-management-card.css'],
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
