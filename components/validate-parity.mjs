#!/usr/bin/env node
/**
 * Sorleed CLI template parity validation.
 *
 * The CLI copies canonical source files into consumer projects. Every file in
 * cli/templates must be byte-identical to its canonical source, and no
 * canonical template may be missing.
 *
 * Read-only: this script never writes to the repository.
 *
 * Usage:
 *   node components/validate-parity.mjs
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { templateManifest } from "../cli/scripts/copy-templates.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES_DIR = join(ROOT, "cli", "templates");

const PAIRS = templateManifest.map((item) => ({
  template: relative(TEMPLATES_DIR, item.dest),
  canonical: relative(ROOT, item.source),
}));


function walkFiles(directory, base = directory) {
  const files = [];
  if (!existsSync(directory)) return files;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(path, base));
    } else if (entry.isFile()) {
      files.push(relative(base, path));
    }
  }
  return files.sort();
}

const errors = [];

const expectedTemplates = new Set(PAIRS.map((pair) => pair.template));
const actualTemplates = new Set(walkFiles(TEMPLATES_DIR));

for (const template of expectedTemplates) {
  if (!actualTemplates.has(template)) {
    errors.push(`missing CLI template: cli/templates/${template}`);
  }
}
for (const template of actualTemplates) {
  if (!expectedTemplates.has(template)) {
    errors.push(`unexpected CLI template: cli/templates/${template}`);
  }
}

for (const pair of PAIRS) {
  const templatePath = join(TEMPLATES_DIR, pair.template);
  const canonicalPath = join(ROOT, pair.canonical);

  if (!existsSync(templatePath)) {
    // Already reported as a missing template.
    continue;
  }
  if (!existsSync(canonicalPath)) {
    errors.push(`missing canonical source: ${pair.canonical}`);
    continue;
  }

  const template = readFileSync(templatePath);
  const canonical = readFileSync(canonicalPath);

  if (!template.equals(canonical)) {
    errors.push(
      `cli/templates/${pair.template} differs from ${pair.canonical}`,
    );
  }
}

console.log("Sorleed CLI template parity — validation");
console.log(`Templates: ${actualTemplates.size}; canonical pairs: ${PAIRS.length}`);
console.log("");

if (errors.length === 0) {
  console.log(`PASS  ${PAIRS.length} CLI templates are byte-identical to their canonical sources`);
  console.log("");
  console.log("PASSED — every CLI template matches its canonical source.");
} else {
  for (const error of errors) {
    console.log(`FAIL  ${error}`);
  }
  console.log("");
  console.log(`FAILED — ${errors.length} template parity problem(s).`);
  process.exitCode = 1;
}
