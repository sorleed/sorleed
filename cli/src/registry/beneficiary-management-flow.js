import { resolveTemplatePath } from '../utils/paths.js';

export const beneficiaryManagementFlowRegistry = {
  name: 'beneficiary-management-flow',
  displayName: 'Beneficiary Management Flow',
  description: 'Sorleed BeneficiaryManagementFlow payee address book and OTP whitelisting workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'beneficiary-management-flow-wrapper',
      source: resolveTemplatePath('components/beneficiary-management-flow/index.tsx'),
      dest: ['components', 'sorleed', 'beneficiary-management-flow', 'index.tsx'],
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
      id: 'beneficiary-management-flow-css',
      source: resolveTemplatePath('styles/beneficiary-management-flow.css'),
      dest: ['styles', 'sorleed', 'beneficiary-management-flow.css'],
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

