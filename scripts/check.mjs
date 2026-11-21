import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx|css|html|md)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const filesToScan = [
  path.join(root, 'index.html'),
  path.join(root, 'DESIGN.md'),
  ...walk(path.join(root, 'src'))
];

let failures = 0;

function check(label, ok, detail) {
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${label}: ${detail}`);
  if (!ok) failures += 1;
}

// 1. R-02 em dash check
const emDashHits = [];
for (const file of filesToScan) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('\u2014') || content.includes(' -- ')) {
    emDashHits.push(path.relative(root, file));
  }
}
check(
  'R-02 Em dash check',
  emDashHits.length === 0,
  emDashHits.length === 0 ? `0 em dashes across ${filesToScan.length} files` : `Found in: ${emDashHits.join(', ')}`
);

// 2. HTML viewport & base document check
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
check(
  'R-39 Viewport zoom allowed',
  !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?/i.test(html),
  'viewport meta allows zooming'
);

// 3. Copy hygiene check on src/data/portfolio.ts
const copyText = fs.readFileSync(path.join(root, 'src/data/portfolio.ts'), 'utf8');
const forbiddenCopy = [
  'AI Powered', 'Next Generation', 'Revolutionary', 'Seamless', 'Cutting Edge',
  'Get Started', 'Learn More', 'Try Now', 'John Doe', 'johndoe@example.com'
];
const copyHits = forbiddenCopy.filter((term) => new RegExp(`\\b${term}\\b`, 'i').test(copyText));
check(
  'R-15/R-16/R-38 Copy hygiene',
  copyHits.length === 0,
  copyHits.length === 0 ? 'No forbidden buzzwords, generic CTAs, or fake personas' : `Found: ${copyHits.join(', ')}`
);

// 4. R-24 section anchor check across TSX components
const allTsx = walk(path.join(root, 'src'))
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');
const ids = new Set([...allTsx.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
const anchors = [...allTsx.matchAll(/href:\s*'#([^']+)'|href="#([^"]+)"/g)].map((m) => m[1] || m[2]);
const brokenAnchors = anchors.filter((id) => !ids.has(id));
check(
  'R-24 Anchor destinations',
  brokenAnchors.length === 0,
  brokenAnchors.length === 0 ? `All ${anchors.length} section anchors resolve` : `Broken: ${brokenAnchors.join(', ')}`
);

process.exit(failures > 0 ? 1 : 0);
