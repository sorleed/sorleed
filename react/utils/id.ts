let counter = 0;

export function generateId(prefix: string): string {
  counter += 1;
  return `sorleed-${prefix}-${counter}-${Date.now().toString(36)}`;
}
