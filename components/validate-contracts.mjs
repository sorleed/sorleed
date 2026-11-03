#!/usr/bin/env node
/**
 * Sorleed component-contract validation.
 *
 * Zero dependencies. Auto-discovers every components/<name>/contract.json,
 * validates it against components/contract.schema.json, checks every token
 * reference against tokens/tokens.json, compares the contract dependency list
 * with the component stylesheet, and verifies documentation links.
 *
 * Read-only: this script never writes to the repository.
 *
 * Usage:
 *   node components/validate-contracts.mjs
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const COMPONENTS_DIR = join(ROOT, "components");
const SCHEMA_PATH = join(COMPONENTS_DIR, "contract.schema.json");
const TOKENS_PATH = join(ROOT, "tokens", "tokens.json");
const CSS_PATH = join(ROOT, "tokens", "dist", "tokens.css");

const errors = [];
const checks = [];

function record(label, problems = []) {
  checks.push({ label, problems });
  errors.push(...problems);
}

function readText(path) {
  if (!existsSync(path)) {
    errors.push(`missing file: ${path.replace(`${ROOT}/`, "")}`);
    return null;
  }
  return readFileSync(path, "utf8");
}

function readJson(path) {
  const text = readText(path);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    errors.push(`invalid JSON in ${path.replace(`${ROOT}/`, "")}: ${error.message}`);
    return null;
  }
}

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function typeMatches(type, value) {
  switch (type) {
    case "object":
      return isObject(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "boolean":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "null":
      return value === null;
    default:
      return true;
  }
}

function jsonPointer(path, key) {
  return `${path}.${key}`;
}

const schema = readJson(SCHEMA_PATH);

/**
 * Validate the JSON Schema subset used by components/contract.schema.json.
 * Supported: $ref (local $defs), anyOf, type, enum, const, pattern, minLength,
 * minItems, minProperties, uniqueItems, minimum, required, properties,
 * additionalProperties (false or schema), and items.
 */
function validate(schemaNode, data, path = "$") {
  const problems = [];

  if (!schemaNode || typeof schemaNode !== "object") {
    return problems;
  }

  if (schemaNode.$ref) {
    const ref = String(schemaNode.$ref);
    if (!ref.startsWith("#/$defs/")) {
      return [`${path}: unsupported $ref ${ref}`];
    }
    const name = ref.slice("#/$defs/".length);
    const target = schema?.$defs?.[name];
    if (!target) {
      return [`${path}: unresolved $ref ${ref}`];
    }
    return validate(target, data, path);
  }

  if (Array.isArray(schemaNode.anyOf)) {
    const matched = schemaNode.anyOf.some(
      (candidate) => validate(candidate, data, path).length === 0,
    );
    if (!matched) {
      return [`${path}: does not match any allowed schema`];
    }
  }

  if (schemaNode.type !== undefined) {
    const types = Array.isArray(schemaNode.type)
      ? schemaNode.type
      : [schemaNode.type];
    if (!types.some((type) => typeMatches(type, data))) {
      return [
        `${path}: expected ${types.join(" | ")}, received ${
          data === null ? "null" : Array.isArray(data) ? "array" : typeof data
        }`,
      ];
    }
  }

  if (schemaNode.const !== undefined && data !== schemaNode.const) {
    problems.push(`${path}: expected const ${JSON.stringify(schemaNode.const)}`);
  }

  if (Array.isArray(schemaNode.enum)) {
    const found = schemaNode.enum.some((value) => value === data);
    if (!found) {
      problems.push(
        `${path}: ${JSON.stringify(data)} is not one of ${schemaNode.enum
          .map((value) => JSON.stringify(value))
          .join(", ")}`,
      );
    }
  }

  if (typeof data === "string") {
    if (schemaNode.minLength !== undefined && data.length < schemaNode.minLength) {
      problems.push(`${path}: shorter than minLength ${schemaNode.minLength}`);
    }
    if (schemaNode.pattern !== undefined) {
      let pattern;
      try {
        pattern = new RegExp(schemaNode.pattern);
      } catch (error) {
        problems.push(`${path}: schema pattern is invalid (${error.message})`);
      }
      if (pattern && !pattern.test(data)) {
        problems.push(`${path}: does not match ${schemaNode.pattern}`);
      }
    }
  }

  if (typeof data === "number" && schemaNode.minimum !== undefined) {
    if (data < schemaNode.minimum) {
      problems.push(`${path}: ${data} is below minimum ${schemaNode.minimum}`);
    }
  }

  if (Array.isArray(data)) {
    if (schemaNode.minItems !== undefined && data.length < schemaNode.minItems) {
      problems.push(`${path}: fewer than minItems ${schemaNode.minItems}`);
    }
    if (schemaNode.uniqueItems === true) {
      const seen = new Set();
      data.forEach((entry, index) => {
        const key = JSON.stringify(entry);
        if (seen.has(key)) {
          problems.push(`${path}[${index}]: duplicate array entry`);
        }
        seen.add(key);
      });
    }
    if (schemaNode.items) {
      data.forEach((entry, index) => {
        problems.push(...validate(schemaNode.items, entry, `${path}[${index}]`));
      });
    }
  }

  if (isObject(data)) {
    if (schemaNode.minProperties !== undefined) {
      const count = Object.keys(data).length;
      if (count < schemaNode.minProperties) {
        problems.push(
          `${path}: fewer than minProperties ${schemaNode.minProperties}`,
        );
      }
    }

    for (const required of schemaNode.required ?? []) {
      if (!Object.hasOwn(data, required)) {
        problems.push(`${path}: missing required property "${required}"`);
      }
    }

    const known = new Set(Object.keys(schemaNode.properties ?? {}));

    for (const [key, child] of Object.entries(schemaNode.properties ?? {})) {
      if (Object.hasOwn(data, key)) {
        problems.push(...validate(child, data[key], jsonPointer(path, key)));
      }
    }

    if (schemaNode.additionalProperties === false) {
      for (const key of Object.keys(data)) {
        if (!known.has(key)) {
          problems.push(`${path}: unexpected property "${key}"`);
        }
      }
    } else if (
      schemaNode.additionalProperties &&
      typeof schemaNode.additionalProperties === "object"
    ) {
      for (const [key, value] of Object.entries(data)) {
        if (known.has(key)) continue;
        problems.push(
          ...validate(
            schemaNode.additionalProperties,
            value,
            jsonPointer(path, key),
          ),
        );
      }
    }
  }

  return problems;
}

// ---------------------------------------------------------------------------
// Token source
// ---------------------------------------------------------------------------

const tokens = new Map();
const order = [];

function walkTokens(node, path, inheritedType) {
  const type = node.$type ?? inheritedType;
  if (Object.hasOwn(node, "$value")) {
    const name = path.join(".");
    tokens.set(name, {
      name,
      value: node.$value,
      type,
      description: node.$description,
    });
    order.push(name);
  }
  for (const [key, child] of Object.entries(node)) {
    if (key === "$value" || key === "$type" || key === "$description") continue;
    walkTokens(child, [...path, key], type);
  }
}

const tokenSource = readJson(TOKENS_PATH);
if (tokenSource) {
  walkTokens(tokenSource, [], undefined);
}

const ALIAS_RE = /^\{([^{}]+)\}$/;

function aliasOf(value) {
  const match = typeof value === "string" ? ALIAS_RE.exec(value) : null;
  return match ? match[1] : null;
}

function resolveToken(name) {
  const chain = [];
  let current = name;
  for (;;) {
    if (chain.includes(current)) {
      return { error: `alias cycle: ${[...chain, current].join(" -> ")}` };
    }
    const token = tokens.get(current);
    if (!token) return { error: `unknown token ${current}` };
    chain.push(current);
    const target = aliasOf(token.value);
    if (!target) {
      return { literal: token.value, type: token.type, chain };
    }
    current = target;
  }
}

function cssVar(name) {
  return `--sl-${name.split(".").join("-")}`;
}

const tokenNames = new Set(tokens.keys());
const tokenFamilies = new Set(
  [...tokenNames].map((name) => name.split(".")[0]),
);
const cssFromSource = new Set([...tokens.keys()].map(cssVar));

const cssText = readText(CSS_PATH);
const cssFromFile = new Set(
  cssText === null ? [] : [...cssText.matchAll(/--sl-[a-z0-9-]+/g)].map((m) => m[0]),
);

// ---------------------------------------------------------------------------
// Contract discovery
// ---------------------------------------------------------------------------

const CONTRACT_EXCLUDES = new Set(["examples", "test", "node_modules"]);

const contractEntries = existsSync(COMPONENTS_DIR)
  ? readdirSync(COMPONENTS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) => !CONTRACT_EXCLUDES.has(entry.name))
      .filter((entry) => existsSync(join(COMPONENTS_DIR, entry.name, "contract.json")))
      .map((entry) => ({
        directory: entry.name,
        path: join(COMPONENTS_DIR, entry.name, "contract.json"),
      }))
      .sort((a, b) => a.directory.localeCompare(b.directory))
  : [];

const EXPECTED = {
  button: { dependencies: 22, variants: 15, properties: 3 },
  input: { dependencies: 28, variants: 4, properties: 10 },
  "password-input": { dependencies: 36, variants: 4, properties: 0 },
  "phone-input": { dependencies: 31, variants: 4, properties: 0 },
};

const EXPECTED_PROPERTIES = {
  button: {
    Variant: {
      type: "VARIANT",
      default: "Primary",
      values: ["Primary", "Secondary", "Ghost"],
    },
    State: {
      type: "VARIANT",
      default: "Default",
      values: ["Default", "Hover", "Active", "Focus", "Disabled"],
    },
    Label: { type: "TEXT", key: "Label#87:16", default: "Button" },
  },
  input: {
    State: {
      type: "VARIANT",
      default: "Default",
      values: ["Default", "Hover", "Error", "Disabled"],
    },
    Label: { type: "TEXT", key: "Label#99:0", default: "Email address" },
    Value: { type: "TEXT", key: "Value#99:5", default: "ada@example.com" },
    Placeholder: {
      type: "TEXT",
      key: "Placeholder#99:10",
      default: "you@example.com",
    },
    Helper: { type: "TEXT", key: "Helper#99:15", default: "We never share this." },
    Focused: { type: "BOOLEAN", key: "Focused#99:20", default: false },
    Filled: { type: "BOOLEAN", key: "Filled#99:25", default: false },
    ShowPlaceholder: {
      type: "BOOLEAN",
      key: "ShowPlaceholder#99:30",
      default: true,
    },
    ShowLabel: { type: "BOOLEAN", key: "ShowLabel#99:35", default: true },
    ShowHelper: { type: "BOOLEAN", key: "ShowHelper#99:40", default: true },
  },
};

const EXPECTED_VARIANT_IDS = {
  button: [
    "87:4",
    "87:6",
    "87:8",
    "87:10",
    "87:13",
    "87:15",
    "87:17",
    "87:19",
    "87:21",
    "87:24",
    "87:26",
    "87:28",
    "87:30",
    "87:32",
    "87:35",
  ],
  input: ["99:2", "99:13", "99:24", "99:35"],
  "password-input": [],
  "phone-input": [],
};

const contracts = [];

if (schema) {
  for (const entry of contractEntries) {
    const contract = readJson(entry.path);
    if (!contract) continue;

    const relative = entry.path.replace(`${ROOT}/`, "");
    const schemaProblems = validate(schema, contract);
    record(`schema: ${relative}`, schemaProblems);
    contracts.push({ ...entry, relative, contract });
  }
}

record(
  "schema: shared contract schema parses",
  schema ? [] : ["components/contract.schema.json could not be parsed"],
);

// ---------------------------------------------------------------------------
// Per-contract invariants
// ---------------------------------------------------------------------------

function extractVarRefs(text) {
  return new Set(
    [...text.matchAll(/var\((--sl-[a-z0-9-]+)/g)].map((match) => match[1]),
  );
}

function extractCssClasses(text) {
  return new Set(
    [...text.matchAll(/\.(sl-[a-z0-9_-]+)/g)].map((match) => match[1]),
  );
}

function extractClassRefs(text) {
  return new Set([...text.matchAll(/\bsl-[a-z0-9_-]+/g)].map((match) => match[0]));
}

function localMarkdownLinks(text) {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((match) => match[1].split("#")[0])
    .filter(
      (target) =>
        target.length > 0 &&
        !/^[a-z][a-z0-9+.-]*:/i.test(target) &&
        !target.startsWith("#"),
    );
}

for (const entry of contracts) {
  const { directory, relative, contract } = entry;
  const problems = [];
  const meta = contract.contract ?? {};
  const id = meta.id;
  const expected = EXPECTED[directory];

  if (!expected) {
    problems.push(
      `${relative}: no validation profile for component directory "${directory}"`,
    );
  }

  const expectedId = `sorleed.${directory}`;
  if (id !== expectedId) {
    problems.push(`${relative}: contract id must be "${expectedId}", found ${JSON.stringify(id)}`);
  }

  if (typeof contract.$schema === "string") {
    const schemaTarget = resolve(dirname(entry.path), contract.$schema);
    if (!existsSync(schemaTarget)) {
      problems.push(
        `${relative}: $schema ${contract.$schema} does not resolve to a file`,
      );
    }
  } else {
    problems.push(`${relative}: missing $schema reference`);
  }

  const canonical = meta.canonical ?? {};
  const figma = canonical.figma;
  const variants = contract.variants ?? [];
  const properties = contract.properties ?? [];
  const codeOnly = contract.codeOnlyProperties ?? [];
  const dependencies = contract.tokens?.dependencies ?? [];
  const stateMapping = contract.tokens?.stateMapping ?? [];

  for (const [field, value] of [
    ["tokens", canonical.tokens],
    ["css", canonical.css],
  ]) {
    if (typeof value !== "string") continue;
    if (!existsSync(join(ROOT, value))) {
      problems.push(`${relative}: canonical.${field} ${value} does not exist`);
    }
  }

  if (figma === null) {
    if (properties.length !== 0) {
      problems.push(
        `${relative}: canonical.figma is null but ${properties.length} design properties are declared`,
      );
    }
    for (const variant of variants) {
      if (variant.figmaNodeId !== null) {
        problems.push(
          `${relative}: canonical.figma is null but variant ${variant.name} declares figmaNodeId ${variant.figmaNodeId}`,
        );
      }
    }
  } else if (figma) {
    if (properties.length === 0) {
      problems.push(
        `${relative}: canonical.figma is present but no design properties are declared`,
      );
    }
    if (figma.variantCount !== variants.length) {
      problems.push(
        `${relative}: figma.variantCount ${figma.variantCount} does not match ${variants.length} contract variants`,
      );
    }
    if (Object.keys(figma.propertyKeys ?? {}).length !== properties.length) {
      problems.push(
        `${relative}: canonical.figma.propertyKeys has ${Object.keys(figma.propertyKeys ?? {}).length} entries for ${properties.length} properties`,
      );
    }
  }

  if (expected) {
    if (variants.length !== expected.variants) {
      problems.push(
        `${relative}: expected ${expected.variants} variants, found ${variants.length}`,
      );
    }
    if (properties.length !== expected.properties) {
      problems.push(
        `${relative}: expected ${expected.properties} design properties, found ${properties.length}`,
      );
    }
    if (dependencies.length !== expected.dependencies) {
      problems.push(
        `${relative}: expected ${expected.dependencies} token dependencies, found ${dependencies.length}`,
      );
    }
  }

  const variantNames = new Set();
  const variantIds = new Set();
  for (const variant of variants) {
    if (variantNames.has(variant.name)) {
      problems.push(`${relative}: duplicate variant name ${variant.name}`);
    }
    variantNames.add(variant.name);
    if (typeof variant.figmaNodeId === "string") {
      if (variantIds.has(variant.figmaNodeId)) {
        problems.push(
          `${relative}: duplicate variant node id ${variant.figmaNodeId}`,
        );
      }
      variantIds.add(variant.figmaNodeId);
    }
  }

  const propertyNames = new Set();
  for (const property of properties) {
    if (propertyNames.has(property.name)) {
      problems.push(`${relative}: duplicate property name ${property.name}`);
    }
    propertyNames.add(property.name);

    const production = property.production ?? {};
    if (property.translation === "derived") {
      if (production.derived !== true) {
        problems.push(
          `${relative}: ${property.name} is derived but production.derived is not true`,
        );
      }
      if (production.prop !== null) {
        problems.push(
          `${relative}: ${property.name} is derived but exposes a production prop`,
        );
      }
    } else if (production.derived === true) {
      problems.push(
        `${relative}: ${property.name} is not marked derived but production.derived is true`,
      );
    }

    if (property.figmaType === "VARIANT") {
      const axis = (contract.stateModel?.axes ?? []).find(
        (candidate) => candidate.name === property.name,
      );
      if (!axis) {
        problems.push(
          `${relative}: VARIANT property ${property.name} has no matching state axis`,
        );
      } else {
        const left = JSON.stringify(property.figmaValues ?? []);
        const right = JSON.stringify(axis.values ?? []);
        if (left !== right) {
          problems.push(
            `${relative}: ${property.name} values ${left} do not match axis values ${right}`,
          );
        }
      }
    }
  }

  if (figma && expected) {
    const expectedProperties = EXPECTED_PROPERTIES[directory] ?? {};
    for (const [name, spec] of Object.entries(expectedProperties)) {
      const property = properties.find((entry) => entry.name === name);
      if (!property) {
        problems.push(`${relative}: missing Figma property ${name}`);
        continue;
      }
      if (property.figmaType !== spec.type) {
        problems.push(
          `${relative}: ${name} must be ${spec.type}, found ${property.figmaType}`,
        );
      }
      if (property.figmaDefault !== spec.default) {
        problems.push(
          `${relative}: ${name} default must be ${JSON.stringify(spec.default)}, found ${JSON.stringify(property.figmaDefault)}`,
        );
      }
      if ("key" in spec && property.figmaKey !== spec.key) {
        problems.push(
          `${relative}: ${name} key must be ${spec.key}, found ${property.figmaKey}`,
        );
      }
      if (
        spec.values &&
        JSON.stringify(property.figmaValues ?? []) !== JSON.stringify(spec.values)
      ) {
        problems.push(
          `${relative}: ${name} values must be ${JSON.stringify(spec.values)}`,
        );
      }
      const expectedKey = property.figmaKey ?? property.name;
      if (figma.propertyKeys[property.name] !== expectedKey) {
        problems.push(
          `${relative}: canonical.figma.propertyKeys.${property.name} must be ${expectedKey}`,
        );
      }
    }

    for (const property of properties) {
      if (!(property.name in expectedProperties)) {
        problems.push(`${relative}: unexpected Figma property ${property.name}`);
      }
    }

    const expectedIds = EXPECTED_VARIANT_IDS[directory] ?? [];
    if (
      variantIds.size !== expectedIds.length ||
      expectedIds.some((nodeId) => !variantIds.has(nodeId))
    ) {
      problems.push(
        `${relative}: variant node ids do not match the verified Figma set (${expectedIds.join(", ")})`,
      );
    }
  }

  const codeOnlyNames = new Set();
  const productionNames = new Set(
    properties
      .map((property) => property.production?.prop)
      .filter((prop) => typeof prop === "string"),
  );
  for (const property of codeOnly) {
    if (codeOnlyNames.has(property.prop)) {
      problems.push(`${relative}: duplicate code-only property ${property.prop}`);
    }
    codeOnlyNames.add(property.prop);
    if (productionNames.has(property.prop)) {
      problems.push(
        `${relative}: property ${property.prop} is declared as both a design mapping and code-only`,
      );
    }
  }

  const allowedPrefixes =
    Array.isArray(contract.tokens?.allowedPrefixes) &&
    contract.tokens.allowedPrefixes.length > 0
      ? contract.tokens.allowedPrefixes
      : [`${directory}.`];

  for (const prefix of allowedPrefixes) {
    if (!prefix.endsWith(".")) {
      problems.push(`${relative}: allowed prefix ${prefix} must end with "."`);
      continue;
    }
    const family = prefix.slice(0, -1);
    if (!tokenFamilies.has(family)) {
      problems.push(
        `${relative}: allowed prefix ${prefix} is not a token family in the token source`,
      );
    }
  }

  const dependencyNames = new Set();
  const dependencyVars = new Set();
  for (const dependency of dependencies) {
    if (dependencyNames.has(dependency.name)) {
      problems.push(`${relative}: duplicate token dependency ${dependency.name}`);
    }
    dependencyNames.add(dependency.name);
    dependencyVars.add(dependency.cssVar);

    if (!allowedPrefixes.some((prefix) => dependency.name.startsWith(prefix))) {
      problems.push(
        `${relative}: dependency ${dependency.name} is not within the allowed prefixes ${allowedPrefixes.join(", ")}`,
      );
    }

    const token = tokens.get(dependency.name);
    if (!token) {
      problems.push(`${relative}: unknown token ${dependency.name}`);
      continue;
    }

    if (token.type !== dependency.type) {
      problems.push(
        `${relative}: ${dependency.name} type ${dependency.type} does not match source type ${token.type}`,
      );
    }

    if (dependency.cssVar !== cssVar(dependency.name)) {
      problems.push(
        `${relative}: ${dependency.name} cssVar ${dependency.cssVar} does not match ${cssVar(dependency.name)}`,
      );
    }

    if (!cssFromSource.has(dependency.cssVar)) {
      problems.push(
        `${relative}: ${dependency.name} cssVar ${dependency.cssVar} is not generated from the token source`,
      );
    }

    if (!cssFromFile.has(dependency.cssVar)) {
      problems.push(
        `${relative}: ${dependency.name} cssVar ${dependency.cssVar} is missing from tokens/dist/tokens.css`,
      );
    }

    const sourceAlias = aliasOf(token.value);
    if (sourceAlias !== dependency.alias) {
      problems.push(
        `${relative}: ${dependency.name} alias ${dependency.alias} does not match source alias ${sourceAlias}`,
      );
    }

    const resolved = resolveToken(dependency.name);
    if (resolved.error) {
      problems.push(`${relative}: ${dependency.name} does not resolve (${resolved.error})`);
    } else if (resolved.literal !== dependency.resolved) {
      problems.push(
        `${relative}: ${dependency.name} resolved ${JSON.stringify(dependency.resolved)} does not match source ${JSON.stringify(resolved.literal)}`,
      );
    }
  }

  for (const variant of variants) {
    for (const name of variant.tokens ?? []) {
      if (!dependencyNames.has(name)) {
        problems.push(
          `${relative}: variant ${variant.name} references ${name}, which is not a declared dependency`,
        );
      }
    }
  }

  const axisValues = new Set(
    (contract.stateModel?.axes ?? []).flatMap((axis) => [
      axis.name,
      ...(axis.values ?? []),
    ]),
  );
  const normalizeState = (value) =>
    String(value)
      .replace(/\([^)]*\)/g, "")
      .split(/[+/,]|\bor\b/)
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean)
      .sort()
      .join("+");
  const unsupportedCombinations = new Set(
    (contract.stateModel?.validCombinations ?? [])
      .filter((entry) => entry.supported === false)
      .map((entry) => normalizeState(entry.combination)),
  );
  const mappedStates = new Set();
  for (const style of stateMapping) {
    if (mappedStates.has(style.state)) {
      problems.push(`${relative}: duplicate state mapping ${style.state}`);
    }
    mappedStates.add(style.state);
    const normalizedState = normalizeState(style.state);
    if (unsupportedCombinations.has(normalizedState)) {
      // A Disabled+Focus mapping is allowed only to suppress the focus ring.
      const suppressesFocus =
        normalizedState.includes("focused") && style.ring === null;
      if (!suppressesFocus) {
        problems.push(
          `${relative}: state mapping ${style.state} corresponds to an unsupported state combination`,
        );
      }
    }
    for (const part of String(style.state).split(/[+/]/)) {
      if (!axisValues.has(part)) {
        problems.push(
          `${relative}: state mapping ${style.state} uses "${part}", which is not a state axis value`,
        );
      }
    }
    for (const field of [
      "background",
      "foreground",
      "border",
      "placeholder",
      "label",
      "helper",
      "ring",
    ]) {
      const value = style[field];
      if (typeof value === "string" && !dependencyNames.has(value)) {
        problems.push(
          `${relative}: state ${style.state} ${field} references ${value}, which is not a declared dependency`,
        );
      }
    }
  }

  for (const variant of variants) {
    if (!mappedStates.has(variant.name)) {
      problems.push(
        `${relative}: variant ${variant.name} has no matching state mapping entry`,
      );
    }
  }

  for (const geometry of contract.anatomy?.geometry ?? []) {
    if (typeof geometry.token === "string" && !dependencyNames.has(geometry.token)) {
      problems.push(
        `${relative}: geometry ${geometry.property} references ${geometry.token}, which is not a declared dependency`,
      );
    }
  }

  for (const row of contract.accessibility?.contrast ?? []) {
    for (const field of ["foreground", "background"]) {
      const name = row[field];
      if (typeof name === "string" && !tokenNames.has(name)) {
        problems.push(
          `${relative}: contrast ${row.role} ${field} references unknown token ${name}`,
        );
      }
    }
  }

  const cssFile = join(COMPONENTS_DIR, directory, `${directory}.css`);
  const componentCss = readText(cssFile);
  if (componentCss !== null) {
    const usedVars = extractVarRefs(componentCss);
    for (const name of usedVars) {
      if (!dependencyVars.has(name)) {
        problems.push(
          `${relative}: ${directory}.css consumes ${name}, which is not a declared dependency`,
        );
      }
    }
    for (const name of dependencyVars) {
      if (!usedVars.has(name)) {
        problems.push(
          `${relative}: dependency ${name} is declared but not consumed by ${directory}.css`,
        );
      }
    }

    const cssClasses = extractCssClasses(componentCss);
    const anatomyText = JSON.stringify(contract.anatomy ?? {});
    const contractClasses = new Set(
      [...anatomyText.matchAll(/\.(sl-[a-z0-9_-]+)/g)].map((match) => match[1]),
    );
    for (const className of contractClasses) {
      if (!cssClasses.has(className)) {
        problems.push(
          `${relative}: contract anatomy class .${className} is not styled by ${directory}.css`,
        );
      }
    }
    const referencedClasses = new Set();
    for (const refFile of [
      join(COMPONENTS_DIR, directory, `${directory}.html`),
      join(ROOT, "react", directory, "index.tsx"),
    ]) {
      if (!existsSync(refFile)) continue;
      const text = readFileSync(refFile, "utf8");
      for (const className of extractClassRefs(text)) {
        referencedClasses.add(className);
      }
    }
    for (const className of cssClasses) {
      if (!referencedClasses.has(className)) {
        problems.push(
          `${relative}: class .${className} is styled but not referenced by the reference HTML or React adapter`,
        );
      }
    }
    for (const className of referencedClasses) {
      if (!cssClasses.has(className)) {
        problems.push(
          `${relative}: class ${className} is referenced but not styled by ${directory}.css`,
        );
      }
    }
  }

  if (id === "sorleed.button") {
    if (dependencyNames.has("button.focus.radius")) {
      problems.push(`${relative}: button.focus.radius does not exist in the token source`);
    }
    if (dependencyNames.has("button.ghost.background")) {
      problems.push(
        `${relative}: button.ghost.background does not exist in the token source`,
      );
    }
    if (codeOnlyNames.has("state")) {
      problems.push(`${relative}: state must not be a code-only prop`);
    }
    if (!codeOnlyNames.has("disabled")) {
      problems.push(`${relative}: disabled must be a code-only prop`);
    }
    if (!codeOnlyNames.has("type")) {
      problems.push(`${relative}: type must be a code-only prop`);
    }

    const state = properties.find((property) => property.name === "State");
    const stateValues = JSON.stringify(state?.figmaValues ?? []);
    if (
      stateValues !==
      JSON.stringify(["Default", "Hover", "Active", "Focus", "Disabled"])
    ) {
      problems.push(
        `${relative}: Button State values must be Default, Hover, Active, Focus, Disabled; found ${stateValues}`,
      );
    }
    if (state?.production?.derived !== true || state?.production?.prop !== null) {
      problems.push(`${relative}: Button State must be derived with no runtime prop`);
    }

    const combination = (name) =>
      (contract.stateModel?.validCombinations ?? []).find(
        (entry) => entry.combination === name,
      );

    for (const name of [
      "Focus + Hover (combined)",
      "Focus + Active (combined)",
      "Disabled + Hover, Active or Focus",
    ]) {
      const entry = combination(name);
      if (!entry) {
        problems.push(`${relative}: missing state combination "${name}"`);
      } else if (entry.supported !== false) {
        problems.push(`${relative}: state combination "${name}" must be unsupported`);
      }
    }

    if (stateMapping.some((entry) => entry.state === "Hover+Focus")) {
      problems.push(`${relative}: Button must not model a combined Hover+Focus state`);
    }

    const conflictText = (contract.stateModel?.conflicts ?? []).join(" ");
    if (!/Focus \+ Hover is not modelled/.test(conflictText)) {
      problems.push(
        `${relative}: Button conflicts must state that Focus + Hover is not modelled`,
      );
    }

    const limitationIds = new Set(
      (contract.limitations ?? []).map((entry) => entry.id),
    );
    for (const required of ["flat-state-axis", "focus-surface"]) {
      if (!limitationIds.has(required)) {
        problems.push(`${relative}: missing limitation ${required}`);
      }
    }

    for (const example of contract.examples?.valid ?? []) {
      if (/\bstate=|variant="danger"|\bloading\b|\bicon=|aria-disabled=/.test(example.code)) {
        problems.push(
          `${relative}: valid example "${example.title}" uses an unsupported Button API`,
        );
      }
    }
  }

  if (id === "sorleed.input") {
    for (const forbidden of [
      "state",
      "focused",
      "filled",
      "showPlaceholder",
      "showHelper",
    ]) {
      if (codeOnlyNames.has(forbidden)) {
        problems.push(`${relative}: ${forbidden} must not be a code-only prop`);
      }
    }
    for (const required of [
      "id",
      "errorMessage",
      "disabled",
      "type",
      "autoComplete",
      "required",
      "onChange",
    ]) {
      if (!codeOnlyNames.has(required)) {
        problems.push(`${relative}: ${required} must be a code-only prop`);
      }
    }

    const state = properties.find((property) => property.name === "State");
    const stateValues = JSON.stringify(state?.figmaValues ?? []);
    if (stateValues !== JSON.stringify(["Default", "Hover", "Error", "Disabled"])) {
      problems.push(
        `${relative}: State values must be Default, Hover, Error, Disabled; found ${stateValues}`,
      );
    }

    const precedence = (contract.stateModel?.precedence ?? []).join(" ");
    if (!/Disabled > Error > Hover > Default/.test(precedence)) {
      problems.push(
        `${relative}: state precedence must state Disabled > Error > Hover > Default`,
      );
    }

    const focused = properties.find((property) => property.name === "Focused");
    if (focused?.figmaType !== "BOOLEAN") {
      problems.push(`${relative}: Focused must be a BOOLEAN overlay, not a State`);
    }
    if (focused?.production?.derived !== true || focused?.production?.prop !== null) {
      problems.push(`${relative}: Focused must be derived with no runtime prop`);
    }

    const combination = (name) =>
      (contract.stateModel?.validCombinations ?? []).find(
        (entry) => entry.combination === name,
      );
    const expectedCombinations = [
      ["Default + Focused", true],
      ["Hover + Focused", true],
      ["Error + Focused", true],
      ["Disabled + Focused", false],
      ["Error + Hover", false],
      ["Disabled + Error", false],
      ["Disabled + Hover", false],
      ["Filled=true + ShowPlaceholder=true", false],
      ["Filled=false + ShowPlaceholder=false", false],
      ["Error + ShowHelper=false", true],
    ];
    for (const [name, supported] of expectedCombinations) {
      const entry = combination(name);
      if (!entry) {
        problems.push(`${relative}: missing state combination "${name}"`);
      } else if (entry.supported !== supported) {
        problems.push(
          `${relative}: state combination "${name}" must be ${supported ? "supported" : "unsupported"}`,
        );
      }
    }

    const styleFor = (name) =>
      stateMapping.find((entry) => entry.state === name);

    for (const name of ["Default+Focused", "Hover+Focused", "Error+Focused"]) {
      if (styleFor(name)?.ring !== "input.focus.color") {
        problems.push(`${relative}: ${name} must render input.focus.color as its ring`);
      }
    }
    if (styleFor("Disabled+Focused")?.ring !== null) {
      problems.push(`${relative}: Disabled+Focused must suppress the focus ring`);
    }

    const helper = properties.find((property) => property.name === "ShowHelper");
    if (!/ignored in Error/i.test(helper?.description ?? "")) {
      problems.push(`${relative}: ShowHelper must be documented as ignored in Error`);
    }

    const filled = properties.find((property) => property.name === "Filled");
    const placeholder = properties.find(
      (property) => property.name === "ShowPlaceholder",
    );
    for (const [name, property] of [
      ["Filled", filled],
      ["ShowPlaceholder", placeholder],
    ]) {
      if (property?.figmaType !== "BOOLEAN") {
        problems.push(`${relative}: ${name} must be a BOOLEAN`);
      }
      if (property?.production?.derived !== true || property?.production?.prop !== null) {
        problems.push(`${relative}: ${name} must be derived with no runtime prop`);
      }
    }

    const limitationIds = new Set(
      (contract.limitations ?? []).map((entry) => entry.id),
    );
    for (const required of [
      "error-hover",
      "disabled-error",
      "disabled-focus",
      "app-owned-validation",
      "inverse-unsupported",
    ]) {
      if (!limitationIds.has(required)) {
        problems.push(`${relative}: missing limitation ${required}`);
      }
    }

    for (const example of contract.examples?.valid ?? []) {
      if (
        /\bstate=|\bfocused\b|\bfilled\b|showPlaceholder|showHelper|type="password"|type="search"|readOnly/.test(
          example.code,
        )
      ) {
        problems.push(
          `${relative}: valid example "${example.title}" uses an unsupported Input API`,
        );
      }
    }
  }

  const statuses = new Set(
    (contract.accessibility?.contrast ?? []).map((row) => row.status),
  );
  if (!statuses.has("pass")) {
    problems.push(`${relative}: contrast matrix has no passing rows`);
  }

  record(`contract invariants: ${relative}`, problems);
}

// ---------------------------------------------------------------------------
// Component documentation
// ---------------------------------------------------------------------------

for (const entry of contracts) {
  const { directory } = entry;
  const problems = [];
  const readmePath = join(COMPONENTS_DIR, directory, "README.md");
  const readmeRelative = readmePath.replace(`${ROOT}/`, "");

  if (!existsSync(readmePath)) {
    problems.push(`${readmeRelative}: missing file`);
  } else {
    const text = readFileSync(readmePath, "utf8");
    if (text.length < 2000) {
      problems.push(`${readmeRelative}: shorter than 2000 characters`);
    }
    if (!text.includes("## ")) {
      problems.push(`${readmeRelative}: has no section headings`);
    }
    if (!/Known limitations/i.test(text)) {
      problems.push(`${readmeRelative}: missing a Known limitations section`);
    }
    if (!text.includes("contract.json")) {
      problems.push(`${readmeRelative}: does not link to contract.json`);
    }
    for (const target of localMarkdownLinks(text)) {
      const resolved = resolve(dirname(readmePath), target);
      if (!existsSync(resolved)) {
        problems.push(`${readmeRelative}: broken local link ${target}`);
      }
    }
  }

  record(`component documentation: components/${directory}/README.md`, problems);
}

// ---------------------------------------------------------------------------
// Cross-contract consistency
// ---------------------------------------------------------------------------

{
  const problems = [];
  if (contracts.length !== Object.keys(EXPECTED).length) {
    problems.push(
      `expected ${Object.keys(EXPECTED).length} contracts, found ${contracts.length}`,
    );
  }
  const versions = new Set(
    contracts.map((entry) => entry.contract.contract?.version),
  );
  if (versions.size > 1) {
    problems.push(`contract versions differ: ${[...versions].join(", ")}`);
  }
  const fileKeys = new Set(
    contracts
      .map((entry) => entry.contract.contract?.canonical?.figma?.fileKey)
      .filter((fileKey) => typeof fileKey === "string"),
  );
  if (fileKeys.size > 1) {
    problems.push(`Figma file keys differ: ${[...fileKeys].join(", ")}`);
  }
  const tokenPaths = new Set(
    contracts.map((entry) => entry.contract.contract?.canonical?.tokens),
  );
  if (tokenPaths.size > 1) {
    problems.push(`canonical token paths differ: ${[...tokenPaths].join(", ")}`);
  }
  const cssPaths = new Set(
    contracts.map((entry) => entry.contract.contract?.canonical?.css),
  );
  if (cssPaths.size > 1) {
    problems.push(`canonical CSS paths differ: ${[...cssPaths].join(", ")}`);
  }
  record("cross-contract consistency", problems);
}

// ---------------------------------------------------------------------------
// Reference scans
// ---------------------------------------------------------------------------

function collectStrings(value, path = "$", out = []) {
  if (typeof value === "string") {
    out.push({ path, value });
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      collectStrings(entry, `${path}[${index}]`, out),
    );
  } else if (isObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, jsonPointer(path, key), out);
    }
  }
  return out;
}

{
  const problems = [];
  for (const entry of contracts) {
    for (const { path, value } of collectStrings(entry.contract)) {
      for (const match of value.matchAll(/--sl-[a-z0-9-]+/g)) {
        if (!cssFromSource.has(match[0])) {
          problems.push(
            `${entry.relative} ${path}: unknown CSS variable ${match[0]}`,
          );
        }
      }
    }
  }
  record("JSON references: every --sl-* variable exists", problems);
}

{
  const problems = [];
  const markdownPaths = [];

  for (const entry of contracts) {
    markdownPaths.push(join(COMPONENTS_DIR, entry.directory, "README.md"));
  }
  const examplesDir = join(COMPONENTS_DIR, "examples");
  if (existsSync(examplesDir)) {
    for (const file of readdirSync(examplesDir)) {
      if (file.endsWith(".md")) markdownPaths.push(join(examplesDir, file));
    }
  }

  const familyPattern = [...tokenFamilies]
    .map((family) => family.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const tokenPattern = new RegExp(
    `\\x60((?:${familyPattern})\\.[a-z0-9][a-z0-9.-]*)\\x60`,
    "g",
  );

  for (const path of markdownPaths) {
    const text = readText(path);
    if (text === null) continue;
    const relative = path.replace(`${ROOT}/`, "");

    for (const match of text.matchAll(/--sl-[a-z0-9-]+/g)) {
      if (!cssFromSource.has(match[0])) {
        problems.push(`${relative}: unknown CSS variable ${match[0]}`);
      }
    }

    for (const match of text.matchAll(tokenPattern)) {
      if (/\.(?:html|css|json|md|tsx|ts|js|mjs)$/.test(match[1])) continue;
      if (!tokenNames.has(match[1])) {
        problems.push(`${relative}: unknown token ${match[1]}`);
      }
    }
  }

  record("Markdown references: every token and CSS variable exists", problems);
}

{
  const problems = [];
  const examplesPath = join(COMPONENTS_DIR, "examples", "financial-form.md");
  const expectations = [
    {
      path: join(COMPONENTS_DIR, "button", "README.md"),
      headings: [
        "## 2. When to use Button",
        "## 5. Variants and states",
        "## 6. Token dependencies",
        "## 7. Accessibility",
        "## 12. Known limitations",
      ],
      minLength: 6000,
    },
    {
      path: join(COMPONENTS_DIR, "input", "README.md"),
      headings: [
        "## 2. When to use Input",
        "## 4. States and precedence",
        "## 5. Validation and application responsibilities",
        "## 6. Token dependencies",
        "## 7. Accessibility",
        "## 12. Known limitations",
      ],
      minLength: 9000,
    },
    {
      path: examplesPath,
      headings: [
        "## 3. Component code",
        "## 4. Why each decision follows the contracts",
        "## 5. Invalid variants of the same screen",
      ],
      minLength: 4000,
      markers: ["ILLUSTRATIVE ONLY", "NOT PRODUCTION CODE"],
    },
  ];

  for (const expectation of expectations) {
    const text = readText(expectation.path);
    if (text === null) continue;
    const relative = expectation.path.replace(`${ROOT}/`, "");
    if (text.length < expectation.minLength) {
      problems.push(
        `${relative}: shorter than the expected ${expectation.minLength} characters`,
      );
    }
    for (const heading of expectation.headings) {
      if (!text.includes(heading)) {
        problems.push(`${relative}: missing heading "${heading}"`);
      }
    }
    for (const marker of expectation.markers ?? []) {
      if (!text.includes(marker)) {
        problems.push(`${relative}: missing marker "${marker}"`);
      }
    }

    for (const target of localMarkdownLinks(text)) {
      const resolved = resolve(dirname(expectation.path), target);
      if (!existsSync(resolved)) {
        problems.push(`${relative}: broken local link ${target}`);
      }
    }
  }

  record(
    "Markdown documentation: required sections, links and example markers",
    problems,
  );
}

{
  const problems = [];
  for (const name of cssFromSource) {
    if (!cssFromFile.has(name)) {
      problems.push(`tokens/dist/tokens.css is missing ${name}`);
    }
  }
  for (const name of cssFromFile) {
    if (!cssFromSource.has(name)) {
      problems.push(`tokens/dist/tokens.css contains unexpected ${name}`);
    }
  }
  record("generated CSS variable set matches the token source", problems);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const failed = checks.filter((entry) => entry.problems.length > 0);
const passed = checks.filter((entry) => entry.problems.length === 0);

console.log("Sorleed component contracts — validation");
console.log(
  `Contracts: ${contracts.map((entry) => entry.relative).join(", ") || "none"}`,
);
console.log(`Tokens: ${tokens.size} parsed; ${cssFromSource.size} CSS variables expected`);
console.log("");

for (const entry of checks) {
  console.log(`${entry.problems.length === 0 ? "PASS" : "FAIL"}  ${entry.label}`);
  for (const problem of entry.problems) {
    console.log(`        ${problem}`);
  }
}

console.log("");
console.log("Summary");
console.log(`  Checks: ${passed.length} passed, ${failed.length} failed`);
console.log(`  Tokens: ${tokenNames.size} available`);
console.log(`  Contracts: ${contracts.length}`);
console.log(
  `  Errors: ${errors.length === 0 ? "0" : `${errors.length} (see above)`}`,
);

if (errors.length > 0) {
  console.log("");
  console.log("FAILED — component contracts need attention.");
  process.exitCode = 1;
} else {
  console.log("");
  console.log("PASSED — contracts parse, match the schema and resolve every token.");
}
