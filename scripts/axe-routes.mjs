import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-chromium";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.js"), "utf8");
const base = process.env.AXE_BASE_URL || "http://127.0.0.1:3456";
const routes = ["/", "/proof", "/packages/clip-and-ship", "/packages/clip-and-dominate", "/niches/podcasts"];
const chromeCandidates = [
  process.env.CHROME_PATH,
  "/home/ubuntu/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome",
].filter(Boolean);
const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));

const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const failures = [];
for (const route of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(document, { resultTypes: ["violations"] });
    return result.violations.map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.length }));
  });
  if (violations.length) failures.push({ route, violations });
  else console.log(`axe ok ${route}`);
  await page.close();
}

await browser.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log("axe ok");
