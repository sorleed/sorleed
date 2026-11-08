import { resolveTemplatePath } from '../utils/paths.js';

export const kycDocUploaderRegistry = {
  name: 'kyc-doc-uploader',
  displayName: 'KycDocUploader',
  description: 'Sorleed KycDocUploader identity document verification dropzone (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'kyc-doc-uploader-wrapper',
      source: resolveTemplatePath('components/kyc-doc-uploader/index.tsx'),
      dest: ['components', 'sorleed', 'kyc-doc-uploader', 'index.tsx'],
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
      id: 'kyc-doc-uploader-css',
      source: resolveTemplatePath('styles/kyc-doc-uploader.css'),
      dest: ['styles', 'sorleed', 'kyc-doc-uploader.css'],
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
