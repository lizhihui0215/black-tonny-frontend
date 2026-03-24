import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = path.resolve(import.meta.dirname, '..');
const appSrc = path.join(repoRoot, 'apps/retail-admin/src');
const backendMockDir = path.join(repoRoot, 'apps/backend-mock');
const packagesDir = path.join(repoRoot, 'packages');
const internalDir = path.join(repoRoot, 'internal');
const fixtureDir = path.join(repoRoot, 'apps/backend-mock/fixtures/pages');
const nodeVersionPath = path.join(repoRoot, '.node-version');
const nvmrcPath = path.join(repoRoot, '.nvmrc');

const failures = [];
const allowedDataTestIdFiles = new Set([
  'apps/retail-admin/src/components/date-range-trigger.vue',
  'apps/retail-admin/src/layouts/widgets/ai-assistant-panel.vue',
  'apps/retail-admin/src/layouts/widgets/ai-assistant-sidebar.vue',
  'apps/retail-admin/src/views/_core/authentication/login.vue',
  'apps/retail-admin/src/views/shared/dashboard-shell.vue',
]);
const trackedDebugAssetPatterns = [
  /^local-dashboard-.*\.png$/u,
  /^reference-dashboard.*\.png$/u,
  /^output(?:\/|$)/u,
  /^playwright-report(?:\/|$)/u,
  /^test-results(?:\/|$)/u,
];

function addFailure(message) {
  failures.push(message);
}

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function walk(dir, matcher, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, matcher, results);
      continue;
    }
    if (matcher(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getTrackedPaths(paths) {
  const output = execFileSync(
    'git',
    ['-C', repoRoot, 'ls-files', '--', ...paths],
    { encoding: 'utf8' },
  ).trim();

  if (!output) {
    return [];
  }

  return output.split('\n').filter(Boolean);
}

function getAllTrackedPaths() {
  const output = execFileSync(
    'git',
    ['-C', repoRoot, 'ls-files'],
    { encoding: 'utf8' },
  ).trim();

  if (!output) {
    return [];
  }

  return output.split('\n').filter(Boolean);
}

function readTrimmed(filePath) {
  return read(filePath).trim();
}

if (!fs.existsSync(nodeVersionPath)) {
  addFailure('`.node-version` is required at the repository root.');
}

if (!fs.existsSync(nvmrcPath)) {
  addFailure('`.nvmrc` is required at the repository root to mirror the pinned Node version.');
}

if (fs.existsSync(nodeVersionPath) && fs.existsSync(nvmrcPath)) {
  const nodeVersion = readTrimmed(nodeVersionPath);
  const nvmrcVersion = readTrimmed(nvmrcPath);

  if (!nodeVersion) {
    addFailure('`.node-version` must not be empty.');
  }

  if (!nvmrcVersion) {
    addFailure('`.nvmrc` must not be empty.');
  }

  if (nodeVersion && nvmrcVersion && nodeVersion !== nvmrcVersion) {
    addFailure('`.node-version` and `.nvmrc` must stay aligned.');
  }
}

if (fs.existsSync(path.join(repoRoot, 'apps/retail-admin/public/data'))) {
  addFailure('`apps/retail-admin/public/data` must not exist; move page fixtures to `apps/backend-mock/fixtures/pages`.');
}

if (!fs.existsSync(backendMockDir)) {
  addFailure('`apps/backend-mock` is required for official-style repo-local mock routes.');
}

if (fs.existsSync(path.join(repoRoot, 'tests/e2e/fixtures/pages'))) {
  addFailure('`tests/e2e/fixtures/pages` must not exist; formal business fixtures belong in `apps/backend-mock/fixtures/pages`.');
}

if (fs.existsSync(path.join(appSrc, 'api/contracts'))) {
  addFailure('`apps/retail-admin/src/api/contracts` must not exist; formal mock routes belong in `apps/backend-mock`.');
}

if (fs.existsSync(path.join(appSrc, 'api/core/mock-auth.ts'))) {
  addFailure('`apps/retail-admin/src/api/core/mock-auth.ts` must not exist; auth mock must be served through `apps/backend-mock`.');
}

if (!fs.existsSync(fixtureDir)) {
  addFailure('`apps/backend-mock/fixtures/pages` is required for repo-local dashboard fixtures.');
} else {
  const fixtureManifest = path.join(fixtureDir, 'manifest.json');
  if (!fs.existsSync(fixtureManifest)) {
    addFailure('`apps/backend-mock/fixtures/pages/manifest.json` is missing.');
  }
}

const dashboardMockPath = path.join(appSrc, 'views/dashboard/dashboard.mock.ts');
if (fs.existsSync(dashboardMockPath)) {
  addFailure('`apps/retail-admin/src/views/dashboard/dashboard.mock.ts` must not exist in runtime code.');
}

const appCodeFiles = walk(
  appSrc,
  (filePath) =>
    /\.(css|js|json|mjs|ts|tsx|vue)$/.test(filePath),
);

const forbiddenPatterns = [
  {
    message: 'raw `fetch(` is not allowed in `apps/retail-admin/src`; use the repo request layer.',
    pattern: /\bfetch\s*\(/g,
  },
  {
    message: '`document.querySelector*` is not allowed in `apps/retail-admin/src` runtime code.',
    pattern: /document\.querySelector(All)?\s*\(/g,
  },
  {
    message: '`localStorage` access is not allowed in `apps/retail-admin/src` runtime code.',
    pattern: /localStorage\./g,
  },
  {
    message: '`sessionStorage` access is not allowed in `apps/retail-admin/src` runtime code.',
    pattern: /sessionStorage\./g,
  },
  {
    message: '`!important` is not allowed in `apps/retail-admin/src` styles.',
    pattern: /!important/g,
  },
  {
    message: '`public/data` references are not allowed in `apps/retail-admin/src` runtime code.',
    pattern: /public\/data/g,
  },
];

for (const filePath of appCodeFiles) {
  const repoPath = toRepoPath(filePath);
  const source = read(filePath);

  for (const { message, pattern } of forbiddenPatterns) {
    if (pattern.test(source)) {
      addFailure(`${repoPath}: ${message}`);
    }
  }

  if (/data-testid=/.test(source) && !allowedDataTestIdFiles.has(repoPath)) {
    addFailure(`${repoPath}: data-testid is only allowed in the approved E2E hook files.`);
  }
}

const appMockFiles = walk(
  appSrc,
  (filePath) => /\.mock\.(js|ts|tsx)$/.test(filePath),
);
for (const filePath of appMockFiles) {
  addFailure(`${toRepoPath(filePath)}: runtime app mock files are not allowed under apps/retail-admin/src.`);
}

const sharedFiles = [
  ...walk(packagesDir, (filePath) => /\.(css|html|js|json|mjs|ts|tsx|vue)$/.test(filePath)),
  ...walk(internalDir, (filePath) => /\.(css|html|js|json|mjs|ts|tsx|vue)$/.test(filePath)),
];
const businessLeakPattern = /black-tonny|小黑托昵|dreams|deepseek/iu;
for (const filePath of sharedFiles) {
  if (!fs.statSync(filePath).isFile()) {
    continue;
  }
  const source = read(filePath);
  if (businessLeakPattern.test(source)) {
    addFailure(`${toRepoPath(filePath)}: shared/internal code must stay vendor-neutral and must not contain business brand strings.`);
  }
}

const trackedDebugAssets = getAllTrackedPaths().filter((trackedPath) =>
  trackedDebugAssetPatterns.some((pattern) => pattern.test(trackedPath)),
);
for (const trackedPath of trackedDebugAssets) {
  addFailure(`${trackedPath}: debug screenshots or output directories must not be tracked.`);
}

const trackedEnvFiles = getTrackedPaths(['apps/retail-admin/.env', 'apps/retail-admin/.env.*']);
for (const trackedPath of trackedEnvFiles) {
  addFailure(`${trackedPath}: tracked app env files are not allowed.`);
}

if (failures.length > 0) {
  console.error('Frontend standard checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Frontend standard checks passed.');
