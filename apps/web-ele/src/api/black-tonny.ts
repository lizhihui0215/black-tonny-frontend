import type {
  BlackTonnyManifest,
  BlackTonnyPageKey,
  BlackTonnyPayload,
} from '#/types/black-tonny';

const MANIFEST_PATH = '/data/manifest.json';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return (await response.json()) as T;
}

function normalizePagePath(path: string) {
  return path.startsWith('/') ? path : `/${path.replace(/^\.\//, '')}`;
}

export async function loadBlackTonnyManifest() {
  return fetchJson<BlackTonnyManifest>(MANIFEST_PATH);
}

export async function loadBlackTonnyPayload(pageKey: BlackTonnyPageKey) {
  const manifest = await loadBlackTonnyManifest();
  const pagePath = manifest.available_pages?.[pageKey];
  if (!pagePath) {
    throw new Error(`Page "${pageKey}" not found in manifest.`);
  }
  const payload = await fetchJson<BlackTonnyPayload>(normalizePagePath(pagePath));
  return {
    manifest,
    payload,
  };
}
