#!/usr/bin/env node
/**
 * Repository documentation and configuration validation.
 *
 * Checks Markdown and HTML links, JSON and YAML syntax, CODEOWNERS syntax,
 * HTML document basics, placeholder markers and stale migration artefacts.
 * Read-only.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
let checks = 0;

const ignoredDirs = new Set(["node_modules", ".git", "dist", ".cache", "coverage"]);

function walk(directory, out = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function fail(message) {
  errors.push(message);
  console.error(`FAIL ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`WARN ${message}`);
}

const files = walk(root);

function isExternal(target) {
  return /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//") || target.startsWith("#") || target === "";
}

function checkLink(sourceFile, target) {
  checks += 1;
  if (isExternal(target)) return;
  const clean = target.split("#")[0].split("?")[0];
  if (!clean) return;
  const resolved = path.resolve(path.dirname(sourceFile), decodeURIComponent(clean));
  if (!existsSync(resolved)) {
    fail(`${path.relative(root, sourceFile)}: broken link -> ${target}`);
  }
}

// Markdown links
for (const file of files.filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    checkLink(file, match[1]);
  }
}

// HTML links and document basics
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const text = readFileSync(file, "utf8");
  // Ignore code samples that contain escaped link markup.
  const withoutCode = text.replace(/<pre[\s\S]*?<\/pre>/gi, "").replace(/<code[\s\S]*?<\/code>/gi, "");
  for (const match of withoutCode.matchAll(/(?:href|src)="([^"]+)"/g)) {
    checkLink(file, match[1]);
  }
  if (!/<html[^>]*\blang=/.test(text)) fail(`${path.relative(root, file)}: missing html lang`);
  if (!/<title>[^<]+<\/title>/.test(text)) fail(`${path.relative(root, file)}: missing title`);
  if (!/<meta[^>]+name="viewport"/.test(text)) fail(`${path.relative(root, file)}: missing viewport meta`);
  if (!/<main\b/.test(text)) fail(`${path.relative(root, file)}: missing main landmark`);
  if (!/<h1\b/.test(text)) fail(`${path.relative(root, file)}: missing h1`);
}

// JSON
for (const file of files.filter((f) => f.endsWith(".json"))) {
  checks += 1;
  try {
    JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${path.relative(root, file)}: invalid JSON (${error.message})`);
  }
}

// YAML
for (const file of files.filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))) {
  checks += 1;
  try {
    YAML.parse(readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${path.relative(root, file)}: invalid YAML (${error.message})`);
  }
}

// CODEOWNERS
const codeowners = path.join(root, "CODEOWNERS");
if (!existsSync(codeowners)) {
  fail("CODEOWNERS: missing");
} else {
  let rules = 0;
  for (const [index, raw] of readFileSync(codeowners, "utf8").split(/\r?\n/).entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2) {
      fail(`CODEOWNERS:${index + 1}: missing owner`);
      continue;
    }
    for (const owner of parts.slice(1)) {
      if (!/^@[A-Za-z0-9_.-]+(\/[A-Za-z0-9_.-]+)?$/.test(owner)) {
        fail(`CODEOWNERS:${index + 1}: invalid owner ${owner}`);
      }
    }
    rules += 1;
  }
  if (rules === 0) fail("CODEOWNERS: no rules");
}

// Placeholders and stale artefacts
if (existsSync(path.join(root, "MIGRATION.md"))) {
  fail("MIGRATION.md: should not exist; use PRODUCT.md");
}

const productFacing = [
  "README.md",
  "PRODUCT.md",
  "ROADMAP.md",
  "CONTRIBUTING.md",
  "CODE_OF_CONDUCT.md",
  "SECURITY.md",
  "website/index.html",
  "website/getting-started.html",
  "website/components.html",
  "website/tokens.html",
  "website/cli.html",
  "website/customisation.html",
  "website/accessibility.html",
  "website/ai.html",
  "website/limitations.html",
];
for (const relative of productFacing) {
  const file = path.join(root, relative);
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8");
  if (/\[INSERT/i.test(text)) fail(`${relative}: unresolved [INSERT] placeholder`);
  if (/\bmigrat(e|ion) from (FinCore|Weft)\b/i.test(text)) {
    fail(`${relative}: stale FinCore/Weft migration narrative`);
  }
}

// Required product surfaces
for (const relative of ["ai/README.md", "figma/README.md", "website/index.html", "CHANGELOG.md"]) {
  if (!existsSync(path.join(root, relative))) fail(`${relative}: missing required surface`);
}

console.log(`\nChecks: ${checks}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0 || warnings.length > 0) {
  if (warnings.length > 0) console.warn("Warnings are non-blocking, but review them.");
}
if (errors.length > 0) {
  console.error("Documentation validation failed.");
  process.exit(1);
}
console.log("Documentation validation passed.");
