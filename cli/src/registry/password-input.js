import { resolveTemplatePath } from '../utils/paths.js';

export const passwordInputRegistry = {
  name: 'password-input',
  displayName: 'PasswordInput',
  description: 'Sorleed PasswordInput component (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'password-input-wrapper',
      source: resolveTemplatePath('components/password-input/index.tsx'),
      dest: ['components', 'sorleed', 'password-input', 'index.tsx'],
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
      id: 'password-input-css',
      source: resolveTemplatePath('styles/password-input.css'),
      dest: ['styles', 'sorleed', 'password-input.css'],
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
    runtime: []
  }
};
