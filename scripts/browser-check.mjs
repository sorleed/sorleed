#!/usr/bin/env node
/**
 * Real browser and accessibility check.
 *
 * Serves the repository over HTTP, opens the documentation site and component
 * references in headless Chrome, runs axe-core against WCAG 2.x rules and
 * checks responsive overflow, landmarks, headings and focus visibility.
 *
 * Chromium only. Firefox and WebKit are not installed in this environment; the
 * report states that explicitly rather than claiming coverage.
 */

import http from "node:http";
import { createReadStream, existsSync, statSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function startServer() {
  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath === "/favicon.ico" || urlPath === "/favicon.svg") {
        res.writeHead(204);
        res.end();
        return;
      }
      let filePath = path.join(root, urlPath);
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      if (!existsSync(filePath)) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "content-type": contentTypes[ext] || "application/octet-stream" });
      createReadStream(filePath).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("Server error");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    try {
      return execFileSync("which", [name], { encoding: "utf8" }).trim();
    } catch {
      // continue
    }
  }
  throw new Error("Chrome or Chromium was not found. Set CHROME_PATH.");
}

const pages = [
  ["Overview", "website/index.html"],
  ["Getting started", "website/getting-started.html"],
  ["Components", "website/components.html"],
  ["Tokens", "website/tokens.html"],
  ["CLI", "website/cli.html"],
  ["Customisation", "website/customisation.html"],
  ["Accessibility", "website/accessibility.html"],
  ["AI", "website/ai.html"],
  ["Limitations", "website/limitations.html"],
  ["Button reference", "components/button/button.html"],
  ["Input reference", "components/input/input.html"],
  ["PasswordInput reference", "components/password-input/password-input.html"],
  ["PhoneInput reference", "components/phone-input/phone-input.html"],
  ["Payment form example", "examples/payment-form/index.html"],
  ["Transaction history example", "examples/transaction-history/index.html"],
];

const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1280, height: 900 },
];

const axeSource = readFileSync(
  path.join(root, "node_modules", "axe-core", "axe.min.js"),
  "utf8",
);

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
  console.error(`  FAIL ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`  WARN ${message}`);
}

async function checkPage(browser, origin, label, file, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleErrors = [];
  const failedResponses = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  const url = `${origin}/${file}`;
  await page.goto(url, { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(150);

  const structure = await page.evaluate(() => {
    const main = document.querySelector("main");
    const h1 = document.querySelector("h1");
    const skip = document.querySelector(".skip-link");
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return {
      hasMain: Boolean(main),
      hasH1: Boolean(h1),
      hasSkip: Boolean(skip),
      overflow,
      title: document.title,
    };
  });

  if (!structure.hasMain) fail(`${label} (${viewport.name}): missing <main>`);
  if (!structure.hasH1) fail(`${label} (${viewport.name}): missing <h1>`);
  const isWebsite = file.startsWith("website/");
  if (isWebsite && !structure.hasSkip) warn(`${label} (${viewport.name}): no skip link`);
  if (structure.overflow) fail(`${label} (${viewport.name}): horizontal overflow at ${viewport.width}px`);
  if (failedResponses.length) fail(`${label} (${viewport.name}): failed requests: ${failedResponses.join(" | ")}`);
  if (consoleErrors.length) fail(`${label} (${viewport.name}): console errors: ${consoleErrors.join(" | ")}`);

  // Focus visibility: the first Tab should reach the skip link and reveal it.
  if (isWebsite && structure.hasSkip) {
    await page.keyboard.press("Tab");
    const focusState = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return { ok: false, reason: "no active element" };
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        ok: rect.top >= 0 && rect.bottom <= window.innerHeight,
        reason: `${el.tagName}.${el.className} top=${Math.round(rect.top)}`,
        outline: style.outlineStyle,
      };
    });
    if (!focusState.ok) fail(`${label} (${viewport.name}): first Tab target not visible (${focusState.reason})`);
  }

  await page.addScriptTag({ content: axeSource });
  const axeResults = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
      },
    });
  });

  for (const violation of axeResults.violations) {
    const targets = violation.nodes.map((node) => node.target.join(" ")).slice(0, 4).join("; ");
    const message = `${label} (${viewport.name}) axe ${violation.impact}: ${violation.id} — ${violation.help} [${targets}]`;
    if (violation.impact === "serious" || violation.impact === "critical") {
      fail(message);
    } else {
      warn(message);
    }
  }

  await page.close();
}

async function main() {
  const { server, origin } = await startServer();
  const executablePath = findChrome();
  console.log(`Chrome: ${executablePath}`);
  console.log(`Server: ${origin}`);
  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    for (const viewport of viewports) {
      console.log(`\nViewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      for (const [label, file] of pages) {
        await checkPage(browser, origin, label, file, viewport);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log("\nBrowser coverage: Chromium (headless Chrome). Firefox and WebKit were not run.");
  console.log(`Axe rules: WCAG 2.0 A/AA, 2.1 A/AA, 2.2 AA.`);
  console.log(`Serious/critical failures: ${failures.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (failures.length > 0) {
    console.error("\nBrowser check failed.");
    process.exit(1);
  }
  console.log("\nBrowser check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
