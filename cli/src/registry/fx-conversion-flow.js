import { resolveTemplatePath } from '../utils/paths.js';

export const fxConversionFlowRegistry = {
  name: 'fx-conversion-flow',
  displayName: 'FX Conversion Flow',
  description: 'Sorleed FXConversionFlow multi-currency conversion workflow component',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'fx-conversion-flow-wrapper',
      source: resolveTemplatePath('components/fx-conversion-flow/index.tsx'),
      dest: ['components', 'sorleed', 'fx-conversion-flow', 'index.tsx'],
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
      id: 'fx-conversion-flow-css',
      source: resolveTemplatePath('styles/fx-conversion-flow.css'),
      dest: ['styles', 'sorleed', 'fx-conversion-flow.css'],
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

