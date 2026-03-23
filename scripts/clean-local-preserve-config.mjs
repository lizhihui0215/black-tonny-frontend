import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = path.resolve(import.meta.dirname, '..');
const apply = process.argv.includes('--apply');

const removableDirNames = new Set([
  'node_modules',
  'dist',
  'dist-ssr',
  '.turbo',
  '.nitro',
  '.output',
  '.cache',
  'coverage',
  'playwright-report',
  'test-results',
  'output',
  'dev-dist',
]);

const removableFilePatterns = [
  /^dist\.(zip|tar|war)$/u,
  /^.+-dist\.(zip|tar|war)$/u,
  /^local-dashboard-.*\.png$/u,
  /^reference-dashboard.*\.png$/u,
  /^npm-debug\.log.*$/u,
  /^pnpm-debug\.log.*$/u,
  /^yarn-debug\.log.*$/u,
  /^yarn-error\.log.*$/u,
  /^lerna-debug\.log.*$/u,
];

const skipDirNames = new Set([
  '.git',
  '.idea',
  '.vscode',
  'docs',
  'temp_skills',
]);

const trackedPaths = new Set(
  execFileSync('git', ['-C', repoRoot, 'ls-files'], { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean),
);

const candidates = [];

function toRepoPath(targetPath) {
  return path.relative(repoRoot, targetPath).replaceAll(path.sep, '/');
}

function isTracked(targetPath) {
  const repoPath = toRepoPath(targetPath);
  if (trackedPaths.has(repoPath)) {
    return true;
  }

  for (const trackedPath of trackedPaths) {
    if (trackedPath.startsWith(`${repoPath}/`)) {
      return true;
    }
  }

  return false;
}

function matchesRemovableFile(name) {
  return removableFilePatterns.some((pattern) => pattern.test(name));
}

async function scan(currentDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const repoPath = toRepoPath(fullPath);

    if (entry.isDirectory()) {
      if (skipDirNames.has(entry.name)) {
        continue;
      }

      if (removableDirNames.has(entry.name)) {
        if (!isTracked(fullPath)) {
          candidates.push({ path: fullPath, repoPath, type: 'dir' });
        }
        continue;
      }

      await scan(fullPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!matchesRemovableFile(entry.name)) {
      continue;
    }

    if (isTracked(fullPath)) {
      continue;
    }

    candidates.push({ path: fullPath, repoPath, type: 'file' });
  }
}

async function removeCandidate(candidate) {
  await fs.rm(candidate.path, { force: true, recursive: true });
}

async function main() {
  await scan(repoRoot);

  const sorted = candidates.sort((a, b) => a.repoPath.localeCompare(b.repoPath));

  if (sorted.length === 0) {
    console.log('No removable local artifacts found.');
    return;
  }

  console.log(
    `${apply ? 'Applying' : 'Planned'} local cleanup for ${sorted.length} removable artifacts:\n`,
  );

  for (const candidate of sorted) {
    console.log(`- [${candidate.type}] ${candidate.repoPath}`);
  }

  if (!apply) {
    console.log(
      '\nDry run only. Re-run with `--apply` to remove these local artifacts while preserving tracked files and configuration.',
    );
    return;
  }

  for (const candidate of sorted) {
    await removeCandidate(candidate);
  }

  console.log('\nLocal cleanup complete. Tracked files and repository configuration were preserved.');
}

main().catch((error) => {
  console.error(`Local cleanup failed: ${error.message}`);
  process.exit(1);
});
