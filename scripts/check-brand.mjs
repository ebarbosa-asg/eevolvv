import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const denylistPath = path.join(root, ".github/brand-denylist.txt");
const terms = readFileSync(denylistPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .sort((a, b) => b.length - a.length);

if (terms.length === 0) {
  console.error("brand denylist is empty");
  process.exit(1);
}

const scanRoots = ["src", "app", "components", "lib", "content", "public", ".next/server", ".next/static"];
const skipDir = new Set(["node_modules", ".git", "cache", "trace"]);
const textExt = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".jsx",
  ".html",
  ".md",
  ".json",
  ".css",
  ".txt",
  ".svg",
  ".xml",
  ".yml",
  ".yaml",
]);

const hits = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (skipDir.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile()) continue;
    if (path.resolve(full) === path.resolve(denylistPath)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!textExt.has(ext)) continue;
    const size = statSync(full).size;
    if (size > 2_000_000) continue;
    const text = readFileSync(full, "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      for (const term of terms) {
        if (lower.includes(term.toLowerCase())) {
          hits.push(`${path.relative(root, full)}:${index + 1}: ${term}`);
          break;
        }
      }
    });
  }
}

for (const rel of scanRoots) {
  const dir = path.join(root, rel);
  try {
    if (statSync(dir).isDirectory()) walk(dir);
  } catch {
    // Missing roots are fine. src/ is optional; build output appears after next build.
  }
}

if (hits.length) {
  console.error(`brand:check found ${hits.length} hit(s)`);
  for (const hit of hits) console.error(hit);
  process.exit(1);
}

console.log("brand:check ok");
