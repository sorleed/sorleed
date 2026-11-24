import { resolveTemplatePath } from '../utils/paths.js';

export const auditTrailTimelineRegistry = {
  name: 'audit-trail-timeline',
  displayName: 'Audit Trail Timeline',
  description: 'Immutable financial and administrative event timeline with actor avatar, severity badge, 2FA verification, and IP metadata',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'audit-trail-timeline-wrapper',
      source: resolveTemplatePath('components/audit-trail-timeline/index.tsx'),
      dest: ['components', 'sorleed', 'audit-trail-timeline', 'index.tsx'],
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
      id: 'audit-trail-timeline-css',
      source: resolveTemplatePath('styles/audit-trail-timeline.css'),
      dest: ['styles', 'sorleed', 'audit-trail-timeline.css'],
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

