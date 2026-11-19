import { resolveTemplatePath } from '../utils/paths.js';

export const securityCenterFlowRegistry = {
  name: 'security-center-flow',
  displayName: 'Security Center Flow',
  description: 'End-to-end account security hub combining DeviceManagementCard, VirtualCardReveal, SessionTimeoutModal, and emergency lockdown',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'security-center-flow-wrapper',
      source: resolveTemplatePath('components/security-center-flow/index.tsx'),
      dest: ['components', 'sorleed', 'security-center-flow', 'index.tsx'],
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
      id: 'security-center-flow-css',
      source: resolveTemplatePath('styles/security-center-flow.css'),
      dest: ['styles', 'sorleed', 'security-center-flow.css'],
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
    peer: [
      'react >=18.0.0',
      'react-dom >=18.0.0',
      '@radix-ui/react-dialog >=1.0.0',
      '@radix-ui/react-tabs >=1.0.0',
      '@radix-ui/react-tooltip >=1.0.0'
    ]
  }
};
