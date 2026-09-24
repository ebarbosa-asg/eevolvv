import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const phrase = /hack the algorithm/gi;
const footnote =
  "Legally. There's no secret setting. The hack is showing up every day with clips worth watching, then turning viewers into people you can reach again.";
const roots = ["app", "components", "lib", "content", "public"];
const textExt = new Set([".ts", ".tsx", ".js", ".mjs", ".jsx", ".md", ".html", ".json"]);
const failures = [];

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!textExt.has(path.extname(entry.name).toLowerCase())) continue;
    if (statSync(full).size > 1_000_000) continue;
    const text = readFileSync(full, "utf8");
    phrase.lastIndex = 0;
    let match;
    while ((match = phrase.exec(text))) {
      const after = text.slice(match.index + match[0].length, match.index + match[0].length + 2);
      if (!after.includes("*") || !text.includes(footnote)) {
        failures.push(`${path.relative(process.cwd(), full)}:${text.slice(0, match.index).split("\n").length}`);
      }
    }
  }
}

for (const rel of roots) walk(path.join(process.cwd(), rel));

if (failures.length) {
  console.error("hack phrase is missing its footnote asterisk:");
  for (const file of failures) console.error(file);
  process.exit(1);
}

console.log("copy:check ok");
