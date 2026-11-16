import { resolveTemplatePath } from '../utils/paths.js';

export const kycVerificationFlowRegistry = {
  name: 'kyc-verification-flow',
  displayName: 'KYC Verification Flow',
  description: 'Sorleed KYC/KYB Verification Flow component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'kyc-verification-flow-wrapper',
      source: resolveTemplatePath('components/kyc-verification-flow/index.tsx'),
      dest: ['components', 'sorleed', 'kyc-verification-flow', 'index.tsx'],
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
      id: 'kyc-verification-flow-css',
      source: resolveTemplatePath('styles/kyc-verification-flow.css'),
      dest: ['styles', 'sorleed', 'kyc-verification-flow.css'],
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

