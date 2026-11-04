import { addCommand } from './commands/add.js';
import { buttonRegistry } from './registry/button.js';
import { inputRegistry } from './registry/input.js';
import { passwordInputRegistry } from './registry/password-input.js';
import { phoneInputRegistry } from './registry/phone-input.js';

const registries = [
  buttonRegistry,
  inputRegistry,
  passwordInputRegistry,
  phoneInputRegistry,
];

const usage = `Sorleed CLI

Usage:
  sorleed list [--json]
  sorleed add <component> [--dir <path>] [--dry-run]

Components: ${registries.map((r) => r.name).join(', ')}

Notes:
  - Button, Input and PasswordInput: no extra runtime dependencies.
  - PhoneInput: requires libphonenumber-js (peer/runtime dependency).
  - Existing files are never overwritten. Re-run with --dry-run to preview.`;

function printList(asJson) {
  if (asJson) {
    const rows = registries.map((r) => ({
      name: r.name,
      displayName: r.displayName,
      description: r.description,
      framework: r.framework,
      language: r.language,
      peerDependencies: r.dependencies.peer,
      runtimeDependencies: r.dependencies.runtime,
      files: r.files.map((f) => ({
        type: f.type,
        destination: Array.isArray(f.dest) ? f.dest.join('/') : f.dest,
        shared: Boolean(f.shared),
      })),
    }));
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  console.log('Available Sorleed components:');
  for (const r of registries) {
    const runtime = r.dependencies.runtime.length > 0 ? r.dependencies.runtime.join(', ') : 'none';
    console.log(`  ${r.name.padEnd(16)} ${r.description}`);
    console.log(`  ${''.padEnd(16)} runtime dependencies: ${runtime}`);
  }
  console.log('');
  console.log('Add one with: sorleed add <component> --dir <path>');
}

export async function run(argv) {
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h' || argv[0] === 'help') {
    console.log(usage);
    return 0;
  }

  if (argv[0] === '--version' || argv[0] === '-v') {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const path = await import('node:path');
    const here = path.dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(await readFile(path.resolve(here, '../package.json'), 'utf8'));
    console.log(pkg.version);
    return 0;
  }

  const command = argv[0];

  if (command === 'list') {
    printList(argv.includes('--json'));
    return 0;
  }

  if (command === 'add') {
    try {
      return await addCommand(argv.slice(1));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return 1;
    }
  }

  console.error(`Error: Unknown command "${command}"`);
  console.error('Run "sorleed --help" for usage.');
  return 1;
}
