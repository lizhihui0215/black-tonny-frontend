import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = path.resolve(import.meta.dirname, '..');
const defaultUpstreamDir = path.resolve(repoRoot, '..', '..', 'vue-vben-admin');
const upstreamDir = process.env.VBEN_UPSTREAM_DIR
  ? path.resolve(process.env.VBEN_UPSTREAM_DIR)
  : defaultUpstreamDir;
const expectedRef = process.env.VBEN_UPSTREAM_REF ?? '3528517fe';

const trackedScopes = ['packages', 'internal'];
const allowedCustomizations = new Map([
  [
    'packages/@core/ui-kit/layout-ui/src/components/layout-sidebar.vue',
    'Stable semantic classes for sidebar layout hooks.',
  ],
  [
    'packages/@core/ui-kit/shadcn-ui/src/components/logo/logo.vue',
    'Stable semantic classes for logo area hooks.',
  ],
  [
    'packages/effects/layouts/src/widgets/user-dropdown/user-dropdown.vue',
    'Stable semantic classes for user dropdown trigger hooks.',
  ],
]);

const failures = [];

function addFailure(message) {
  failures.push(message);
}

function runGit(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
  }).trim();
}

function getTrackedPaths(root) {
  const output = runGit(root, ['ls-files', '--', ...trackedScopes]);
  if (!output) {
    return [];
  }
  return output.split('\n').filter(Boolean).sort();
}

function readBuffer(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath));
}

function compareRepoSnapshots(localRoot, upstreamRoot) {
  const localPaths = new Set(getTrackedPaths(localRoot));
  const upstreamPaths = new Set(getTrackedPaths(upstreamRoot));
  const allPaths = Array.from(new Set([...localPaths, ...upstreamPaths])).sort();
  const diffPaths = [];

  for (const relativePath of allPaths) {
    const hasLocal = localPaths.has(relativePath);
    const hasUpstream = upstreamPaths.has(relativePath);

    if (!hasLocal || !hasUpstream) {
      diffPaths.push(relativePath);
      continue;
    }

    const localBuffer = readBuffer(localRoot, relativePath);
    const upstreamBuffer = readBuffer(upstreamRoot, relativePath);

    if (!localBuffer.equals(upstreamBuffer)) {
      diffPaths.push(relativePath);
    }
  }

  return diffPaths;
}

if (!fs.existsSync(upstreamDir)) {
  addFailure(
    `Upstream clone is missing at \`${upstreamDir}\`. Set \`VBEN_UPSTREAM_DIR\` or clone \`vue-vben-admin\` there.`,
  );
} else {
  try {
    const upstreamHead = runGit(upstreamDir, ['rev-parse', '--short=9', 'HEAD']);
    if (upstreamHead !== expectedRef) {
      addFailure(
        `Upstream clone HEAD is \`${upstreamHead}\`, expected \`${expectedRef}\`. Update the ledger baseline or export \`VBEN_UPSTREAM_REF\` if you intentionally changed the reference snapshot.`,
      );
    }

    const diffPaths = compareRepoSnapshots(repoRoot, upstreamDir);
    const allowedPaths = Array.from(allowedCustomizations.keys()).sort();
    const unexpectedDiffs = diffPaths.filter((relativePath) => !allowedCustomizations.has(relativePath));
    const missingExpectedDiffs = allowedPaths.filter((relativePath) => !diffPaths.includes(relativePath));

    for (const relativePath of unexpectedDiffs) {
      addFailure(
        `${relativePath}: unexpected shared/internal diff versus the local upstream clone. Add it to the ledger only if it is an intentional long-term customization.`,
      );
    }

    for (const relativePath of missingExpectedDiffs) {
      addFailure(
        `${relativePath}: this path no longer differs from upstream. Update the upstream customization ledger and this guardrail so the allowed diff list stays exact.`,
      );
    }

    if (failures.length === 0) {
      console.log('Upstream customization guardrail passed.');
      console.log(`- upstream: ${upstreamDir}`);
      console.log(`- reference: ${expectedRef}`);
      console.log(`- allowed customizations: ${allowedPaths.length}`);
      for (const [relativePath, reason] of allowedCustomizations.entries()) {
        console.log(`  - ${relativePath}: ${reason}`);
      }
    }
  } catch (error) {
    addFailure(`Failed to compare against the upstream clone: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error('Upstream customization checks failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}
