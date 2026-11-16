import { resolveTemplatePath } from '../utils/paths.js';

export const beneficiaryPickerRegistry = {
  name: 'beneficiary-picker',
  displayName: 'Beneficiary Picker',
  description: 'Sorleed Beneficiary Picker component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'beneficiary-picker-wrapper',
      source: resolveTemplatePath('components/beneficiary-picker/index.tsx'),
      dest: ['components', 'sorleed', 'beneficiary-picker', 'index.tsx'],
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
      id: 'beneficiary-picker-css',
      source: resolveTemplatePath('styles/beneficiary-picker.css'),
      dest: ['styles', 'sorleed', 'beneficiary-picker.css'],
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

