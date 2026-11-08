import { resolveTemplatePath } from '../utils/paths.js';

export const pinInputRegistry = {
  name: 'pin-input',
  displayName: 'PinInput',
  description: 'Sorleed PinInput transaction authorization component (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'pin-input-wrapper',
      source: resolveTemplatePath('components/pin-input/index.tsx'),
      dest: ['components', 'sorleed', 'pin-input', 'index.tsx'],
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
      id: 'pin-input-css',
      source: resolveTemplatePath('styles/pin-input.css'),
      dest: ['styles', 'sorleed', 'pin-input.css'],
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

