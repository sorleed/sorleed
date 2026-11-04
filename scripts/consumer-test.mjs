#!/usr/bin/env node
/**
 * Fresh-consumer installation test.
 *
 * Packs @sorleed/react and @sorleed/cli, installs the tarballs into temporary
 * projects, renders the components, typechecks the public API and exercises the
 * CLI. This validates the published artifact shape, not the repository's own
 * node_modules.
 *
 * Requires network access to install react, react-dom and TypeScript.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = mkdtempSync(path.join(tmpdir(), "sorleed-consumer-"));

function run(command, args, cwd, options = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: options.quiet ? ["ignore", "pipe", "pipe"] : "inherit",
    env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
  });
}

function pack(packageDir, destination) {
  const output = run("npm", ["pack", "--pack-destination", destination], packageDir, { quiet: true });
  const name = output.trim().split(/\r?\n/).filter(Boolean).pop();
  const tarball = path.join(destination, name);
  if (!existsSync(tarball)) throw new Error(`npm pack did not produce ${tarball}`);
  return tarball;
}

function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFile(file) {
  assert(existsSync(file), `Expected file: ${file}`);
}

function main() {
  console.log(`Workspace: ${workspace}`);

  const packDir = path.join(workspace, "packs");
  mkdirSync(packDir, { recursive: true });

  console.log("\n[1/6] Building and packing @sorleed/react");
  const reactDir = path.join(root, "react");
  if (!existsSync(path.join(reactDir, "node_modules", ".bin", "tsup"))) {
    console.log("Installing React build dependencies");
    run("npm", ["ci", "--no-audit", "--no-fund"], reactDir);
  }
  run("npm", ["run", "build"], reactDir);
  const reactTarball = pack(path.join(root, "react"), packDir);
  console.log(`Packed: ${path.basename(reactTarball)}`);

  console.log("\n[2/6] Building and packing @sorleed/cli");
  const cliTarball = pack(path.join(root, "cli"), packDir);
  console.log(`Packed: ${path.basename(cliTarball)}`);

  console.log("\n[3/6] Installing packed React package into a fresh project");
  const reactConsumer = path.join(workspace, "react-consumer");
  mkdirSync(reactConsumer, { recursive: true });
  writeJson(path.join(reactConsumer, "package.json"), {
    name: "sorleed-react-consumer",
    private: true,
    type: "module",
  });
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      reactTarball,
      "react@18.3.1",
      "react-dom@18.3.1",
      "libphonenumber-js@1.13.15",
      "typescript@5.6.3",
      "@types/react@18.3.12",
      "@types/react-dom@18.3.1",
    ],
    reactConsumer,
  );

  const packageRoot = path.join(reactConsumer, "node_modules", "@sorleed", "react");
  for (const asset of ["index.js", "phone-input.js", "index.d.ts", "phone-input.d.ts"]) {
    assertFile(path.join(packageRoot, "dist", asset));
  }
  for (const css of ["tokens", "button", "input", "password-input", "phone-input"]) {
    assertFile(path.join(packageRoot, "dist", "styles", `${css}.css`));
  }

  writeFileSync(
    path.join(reactConsumer, "render.mjs"),
    `import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";

const html = renderToStaticMarkup(
  React.createElement(
    "main",
    null,
    React.createElement(Button, { variant: "primary" }, "Continue"),
    React.createElement(Input, { label: "Email", type: "email", helperText: "Help" }),
    React.createElement(PasswordInput, { label: "Password", defaultVisible: true }),
    React.createElement(PhoneInput, { label: "Phone", defaultCountry: "GB" }),
  ),
);

for (const cls of ["sl-button", "sl-input", "sl-password-input", "sl-phone-input"]) {
  if (!html.includes(cls)) {
    console.error("Missing rendered class:", cls);
    process.exit(1);
  }
}
if (!html.includes("United Kingdom")) {
  console.error("Expected a full country name in the PhoneInput selector");
  process.exit(1);
}
console.log("React consumer render OK");
`,
  );
  run("node", ["render.mjs"], reactConsumer);

  writeFileSync(
    path.join(reactConsumer, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
  );
  mkdirSync(path.join(reactConsumer, "src"), { recursive: true });
  writeFileSync(
    path.join(reactConsumer, "src", "app.tsx"),
    `import { Button, Input, PasswordInput } from "@sorleed/react";
import { PhoneInput } from "@sorleed/react/phone-input";
import type { ButtonProps, PhoneInputChangeResult } from "@sorleed/react";

export function App() {
  const variant: ButtonProps["variant"] = "primary";
  const onChange = (result: PhoneInputChangeResult) => {
    void result.e164;
    void result.isValid;
  };
  return (
    <form>
      <Button variant={variant}>Continue</Button>
      <Input label="Email" type="email" />
      <PasswordInput label="Password" />
      <PhoneInput label="Phone" onChange={onChange} />
    </form>
  );
}
`,
  );
  run("npx", ["tsc", "--noEmit"], reactConsumer);

  console.log("\n[4/6] Installing packed CLI into a fresh project");
  const cliConsumer = path.join(workspace, "cli-consumer");
  mkdirSync(cliConsumer, { recursive: true });
  writeJson(path.join(cliConsumer, "package.json"), {
    name: "sorleed-cli-consumer",
    private: true,
    type: "module",
  });
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      cliTarball,
      "react@18.3.1",
      "react-dom@18.3.1",
      "libphonenumber-js@1.13.15",
      "typescript@5.6.3",
      "@types/react@18.3.12",
      "@types/react-dom@18.3.1",
    ],
    cliConsumer,
  );

  const listOutput = run("npx", ["sorleed", "list"], cliConsumer, { quiet: true });
  for (const name of ["button", "input", "password-input", "phone-input"]) {
    assert(listOutput.includes(name), `CLI list did not mention ${name}`);
  }
  const jsonOutput = run("npx", ["sorleed", "list", "--json"], cliConsumer, { quiet: true });
  const rows = JSON.parse(jsonOutput);
  assert(rows.length === 4, `Expected 4 components, got ${rows.length}`);

  for (const component of ["button", "input", "password-input", "phone-input"]) {
    run("npx", ["sorleed", "add", component, "--dir", cliConsumer], cliConsumer);
    assertFile(path.join(cliConsumer, "components", "sorleed", component, "index.tsx"));
    assertFile(path.join(cliConsumer, "styles", "sorleed", `${component}.css`));
  }
  assertFile(path.join(cliConsumer, "components", "sorleed", "types", "index.ts"));
  assertFile(path.join(cliConsumer, "styles", "sorleed", "tokens.css"));

  let conflictFailed = false;
  try {
    execFileSync("npx", ["sorleed", "add", "button", "--dir", cliConsumer], {
      cwd: cliConsumer,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    conflictFailed = true;
    assert(error.status !== 0, "Conflict should exit non-zero");
  }
  assert(conflictFailed, "Expected a re-install conflict to exit non-zero");

  console.log("\n[5/6] Typechecking CLI-copied source as a consumer");
  writeFileSync(
    path.join(cliConsumer, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
        include: ["components"],
      },
      null,
      2,
    ),
  );
  run("npx", ["tsc", "--noEmit"], cliConsumer);

  console.log("\n[6/6] Verifying copied source matches the canonical files");
  const pairs = [
    ["components/sorleed/button/index.tsx", "react/button/index.tsx"],
    ["components/sorleed/input/index.tsx", "react/input/index.tsx"],
    ["components/sorleed/password-input/index.tsx", "react/password-input/index.tsx"],
    ["components/sorleed/phone-input/index.tsx", "react/phone-input/index.tsx"],
    ["components/sorleed/types/index.ts", "react/types/index.ts"],
  ];
  for (const [copied, canonical] of pairs) {
    const a = readFileSync(path.join(cliConsumer, copied));
    const b = readFileSync(path.join(root, canonical));
    assert(a.equals(b), `Copied source differs from canonical: ${copied}`);
  }
}

let failed = false;
try {
  main();
} catch (error) {
  failed = true;
  console.error("\nConsumer test failed:");
  console.error(error && error.message ? error.message : error);
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

if (failed) process.exit(1);
console.log("\nConsumer test passed.");
