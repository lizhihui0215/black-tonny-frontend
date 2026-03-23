import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const hanPattern = /[\p{Script=Han}]/u;
const markdownLinkPattern = /\[[^\]]+\]\(([^)#]+)(?:#[^)]+)?\)/g;
const numericPrefixPattern = /^\d{2}-/;
const numericPrefixAllowlist = new Set();
const allowedStatuses = new Set([
  'Source of truth',
  'Working doc',
  'Draft',
  'Reference',
]);
const publicDocs = [
  'README.md',
  'ARCHITECTURE.md',
  'docs/README.md',
  'CONTRIBUTING.md',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.claude/CLAUDE.md',
];
const internalDocExclusions = new Set(['docs/README.md']);
const skipDirs = new Set(['.git', 'node_modules', '.playwright-cli', 'output', 'temp_skills']);
const failures = [];

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) {
        continue;
      }
      walk(path.join(dir, entry.name), results);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

function toRepoPath(absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll(path.sep, '/');
}

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

const markdownFiles = walk(repoRoot);

for (const filePath of markdownFiles) {
  const repoPath = toRepoPath(filePath);
  const baseName = path.basename(filePath);
  const text = fs.readFileSync(filePath, 'utf8');

  if (numericPrefixPattern.test(baseName) && !numericPrefixAllowlist.has(repoPath)) {
    addFailure(repoPath, 'numeric filename prefixes are not allowed');
  }

  markdownLinkPattern.lastIndex = 0;
  for (const match of text.matchAll(markdownLinkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) {
      continue;
    }
    const resolved = path.resolve(path.dirname(filePath), target);
    if (!fs.existsSync(resolved)) {
      addFailure(repoPath, `broken Markdown link target: ${target}`);
    }
  }
}

for (const repoPath of publicDocs) {
  const absolutePath = path.join(repoRoot, repoPath);
  if (!fs.existsSync(absolutePath)) {
    addFailure(repoPath, 'required public doc is missing');
    continue;
  }
  const text = fs.readFileSync(absolutePath, 'utf8');
  if (hanPattern.test(text)) {
    addFailure(repoPath, 'public-facing standard docs and AI entry docs must not contain Chinese characters');
  }
}

const docsReadmePath = path.join(repoRoot, 'docs/README.md');
if (fs.existsSync(docsReadmePath)) {
  const docsReadmeText = fs.readFileSync(docsReadmePath, 'utf8');
  if (!docsReadmeText.includes('## Status Legend')) {
    addFailure('docs/README.md', 'Status Legend section is required');
  }
  const statuses = [...docsReadmeText.matchAll(/Status:\s*`([^`]+)`/g)].map((match) => match[1]);
  for (const status of statuses) {
    if (!allowedStatuses.has(status)) {
      addFailure('docs/README.md', `invalid status value: ${status}`);
    }
  }
}

for (const filePath of markdownFiles) {
  const repoPath = toRepoPath(filePath);
  if (!repoPath.startsWith('docs/')) {
    continue;
  }
  if (internalDocExclusions.has(repoPath)) {
    continue;
  }
  const text = fs.readFileSync(filePath, 'utf8');
  if (!hanPattern.test(text)) {
    addFailure(repoPath, 'internal working docs under docs/ must contain Chinese content');
  }
}

if (failures.length > 0) {
  console.error('Documentation checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Documentation checks passed for ${markdownFiles.length} Markdown files.`);
