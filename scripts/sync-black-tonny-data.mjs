import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const targetRoot = path.resolve(
  process.cwd(),
  'apps/retail-admin/public',
);
const sourceRoot = process.env.BLACK_TONNY_SOURCE_ROOT
  ? path.resolve(process.env.BLACK_TONNY_SOURCE_ROOT)
  : path.resolve(process.cwd(), '../Black-Tonny/site/dashboard');

const sourceDataDir = path.join(sourceRoot, 'data');
const targetDataDir = path.join(targetRoot, 'data');
const targetExportsDir = path.join(targetRoot, 'exports');

const manifestPath = path.join(sourceDataDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Manifest not found: ${manifestPath}`);
}

fs.mkdirSync(targetDataDir, { recursive: true });
fs.mkdirSync(targetExportsDir, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function copyFile(relativePath, fromDir, toDir) {
  const sourcePath = path.join(fromDir, relativePath);
  if (!fs.existsSync(sourcePath)) {
    return;
  }
  const targetPath = path.join(toDir, path.basename(relativePath));
  fs.copyFileSync(sourcePath, targetPath);
}

fs.copyFileSync(manifestPath, path.join(targetDataDir, 'manifest.json'));

for (const relativePath of Object.values(manifest.available_pages ?? {})) {
  if (typeof relativePath === 'string') {
    copyFile(relativePath, sourceRoot, targetDataDir);
  }
}

for (const relativePath of Object.values(manifest.available_exports ?? {})) {
  if (typeof relativePath === 'string') {
    copyFile(relativePath, sourceRoot, targetExportsDir);
  }
}

console.log(
  JSON.stringify(
    {
      ok: true,
      sourceRoot,
      targetDataDir,
      targetExportsDir,
    },
    null,
    2,
  ),
);
