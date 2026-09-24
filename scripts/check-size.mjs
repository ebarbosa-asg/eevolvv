import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const limit = 170 * 1024;
const nextDir = path.join(process.cwd(), ".next");
const files = new Set();

function add(rel) {
  if (!rel || rel.startsWith("static/css")) return;
  const normalized = rel.replace(/^\//, "");
  const full = path.join(nextDir, normalized);
  if (existsSync(full) && statSync(full).isFile() && full.endsWith(".js")) files.add(full);
}

function readJson(rel) {
  const full = path.join(nextDir, rel);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

const appManifest = readJson("app-build-manifest.json");
const buildManifest = readJson("build-manifest.json");

if (appManifest?.pages) {
  const page = appManifest.pages["/page"] || appManifest.pages["/"] || [];
  for (const file of page) add(file);
}
if (buildManifest?.rootMainFiles) {
  for (const file of buildManifest.rootMainFiles) add(`static/${file}`.replace("static/static/", "static/"));
  for (const file of buildManifest.rootMainFiles) add(file);
  for (const file of buildManifest.rootMainFiles) {
    if (file.startsWith("static/")) add(file);
    else add(path.posix.join("static", file));
  }
}

if (files.size === 0) {
  console.error("size:check found no home JS. Run next build first.");
  process.exit(1);
}

let total = 0;
for (const file of files) {
  const gzip = gzipSync(readFileSync(file), { level: 9 }).length;
  total += gzip;
}

const kb = (total / 1024).toFixed(1);
console.log(`home initial JS ${kb}KB gzip across ${files.size} files (limit 170KB)`);
for (const file of files) console.log(`  ${path.relative(process.cwd(), file)}`);
if (total > limit) {
  console.error("size:check failed");
  process.exit(1);
}
console.log("size:check ok");
