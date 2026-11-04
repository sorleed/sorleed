import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(cliRoot, '..');
const templatesDir = path.resolve(cliRoot, 'templates');

// Source -> Template destination map
const templateManifest = [
  // Button
  {
    source: path.resolve(repoRoot, 'react/button/index.tsx'),
    dest: path.resolve(templatesDir, 'components/button/index.tsx')
  },
  {
    source: path.resolve(repoRoot, 'components/button/button.css'),
    dest: path.resolve(templatesDir, 'styles/button.css')
  },
  // Input
  {
    source: path.resolve(repoRoot, 'react/input/index.tsx'),
    dest: path.resolve(templatesDir, 'components/input/index.tsx')
  },
  {
    source: path.resolve(repoRoot, 'components/input/input.css'),
    dest: path.resolve(templatesDir, 'styles/input.css')
  },
  // PasswordInput
  {
    source: path.resolve(repoRoot, 'react/password-input/index.tsx'),
    dest: path.resolve(templatesDir, 'components/password-input/index.tsx')
  },
  {
    source: path.resolve(repoRoot, 'components/password-input/password-input.css'),
    dest: path.resolve(templatesDir, 'styles/password-input.css')
  },
  // PhoneInput
  {
    source: path.resolve(repoRoot, 'react/phone-input/index.tsx'),
    dest: path.resolve(templatesDir, 'components/phone-input/index.tsx')
  },
  {
    source: path.resolve(repoRoot, 'components/phone-input/phone-input.css'),
    dest: path.resolve(templatesDir, 'styles/phone-input.css')
  },
  // Shared types
  {
    source: path.resolve(repoRoot, 'react/types/index.ts'),
    dest: path.resolve(templatesDir, 'components/types/index.ts')
  },
  // Shared tokens CSS
  {
    source: path.resolve(repoRoot, 'tokens/dist/tokens.css'),
    dest: path.resolve(templatesDir, 'styles/tokens.css')
  }
];

export function copyTemplates() {
  console.log('Copying canonical sources into cli/templates/...');
  for (const item of templateManifest) {
    if (!fs.existsSync(item.source)) {
      throw new Error(`Canonical source missing: ${item.source}`);
    }
    const destDir = path.dirname(item.dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(item.source, item.dest);
    console.log(`  ✓ ${path.relative(repoRoot, item.source)} -> ${path.relative(cliRoot, item.dest)}`);
  }
  console.log('Templates packaging complete.');
}

// When executed directly as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  copyTemplates();
}
