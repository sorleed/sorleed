import { resolveTemplatePath } from '../utils/paths.js';

export const portfolioSummaryRegistry = {
  name: 'portfolio-summary',
  displayName: 'PortfolioSummary',
  description: 'Sorleed PortfolioSummary investment net worth card (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'portfolio-summary-wrapper',
      source: resolveTemplatePath('components/portfolio-summary/index.tsx'),
      dest: ['components', 'sorleed', 'portfolio-summary', 'index.tsx'],
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
      id: 'portfolio-summary-css',
      source: resolveTemplatePath('styles/portfolio-summary.css'),
      dest: ['styles', 'sorleed', 'portfolio-summary.css'],
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
