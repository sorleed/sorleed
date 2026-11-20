import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const componentsDir = resolve(root, 'components');
const distStyles = resolve(__dirname, '../dist/styles');

mkdirSync(distStyles, { recursive: true });

let count = 0;
for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const cssFile = resolve(componentsDir, entry.name, `${entry.name}.css`);
  if (existsSync(cssFile)) {
    copyFileSync(cssFile, resolve(distStyles, `${entry.name}.css`));
    count++;
  }
}

copyFileSync(resolve(root, 'tokens/dist/tokens.css'), resolve(distStyles, 'tokens.css'));

console.log(`Copied ${count} component/flow stylesheets + tokens.css to dist/styles/`);
