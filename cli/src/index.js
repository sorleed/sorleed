import { addCommand } from './commands/add.js';

export async function run(argv) {
  if (argv.length === 0) {
    console.log('Sorleed CLI');
    console.log('Usage: sorleed add <component> [--dir <path>] [--dry-run]');
    console.log('Components: button, input, password-input, phone-input');
    console.log('');
    console.log('Notes:');
    console.log('  - Button, Input and PasswordInput: no extra runtime dependencies');
    console.log('  - PhoneInput: requires libphonenumber-js (peer/runtime dependency)');
    return 0;
  }
  
  const command = argv[0];
  
  if (command === 'add') {
    try {
      return await addCommand(argv.slice(1));
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return 1;
    }
  }
  
  console.error(`Error: Unknown command "${command}"`);
  console.error('Usage: sorleed add <component> [--dir <path>] [--dry-run]');
  return 1;
}
