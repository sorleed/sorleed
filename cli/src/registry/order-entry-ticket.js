import { resolveTemplatePath } from '../utils/paths.js';

export const orderEntryTicketRegistry = {
  name: 'order-entry-ticket',
  displayName: 'Order Entry Ticket',
  description: 'Brokerage buy/sell order entry ticket supporting market, limit, and stop orders with buying power validation',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'order-entry-ticket-wrapper',
      source: resolveTemplatePath('components/order-entry-ticket/index.tsx'),
      dest: ['components', 'sorleed', 'order-entry-ticket', 'index.tsx'],
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
      id: 'order-entry-ticket-css',
      source: resolveTemplatePath('styles/order-entry-ticket.css'),
      dest: ['styles', 'sorleed', 'order-entry-ticket.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0', '@radix-ui/react-tabs >=1.0.0']
  }
};

