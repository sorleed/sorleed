import { resolveTemplatePath } from '../utils/paths.js';

export const phoneInputRegistry = {
  name: 'phone-input',
  displayName: 'PhoneInput',
  description: 'Sorleed PhoneInput component (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'phone-input-wrapper',
      source: resolveTemplatePath('components/phone-input/index.tsx'),
      dest: ['components', 'sorleed', 'phone-input', 'index.tsx'],
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
      id: 'phone-input-css',
      source: resolveTemplatePath('styles/phone-input.css'),
      dest: ['styles', 'sorleed', 'phone-input.css'],
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
    runtime: ['libphonenumber-js >=1.10.0']
  }
};
