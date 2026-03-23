import { beforeEach } from 'vitest';

class MemoryStorage implements Storage {
  private readonly store = new Map<string, string>();

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): null | string {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): null | string {
    return [...this.store.keys()][index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value));
  }
}

function hasUsableStorage(
  value: Partial<Storage> | undefined,
): value is Storage {
  return Boolean(
    value &&
      typeof value.getItem === 'function' &&
      typeof value.setItem === 'function' &&
      typeof value.removeItem === 'function' &&
      typeof value.clear === 'function' &&
      typeof value.key === 'function',
  );
}

function installStorage(name: 'localStorage' | 'sessionStorage') {
  const current = globalThis[name] as Partial<Storage> | undefined;
  if (hasUsableStorage(current)) {
    return current;
  }

  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: storage,
    writable: true,
  });

  if (typeof window !== 'undefined') {
    Object.defineProperty(window, name, {
      configurable: true,
      value: storage,
      writable: true,
    });
  }

  return storage;
}

const localStorageMock = installStorage('localStorage');
const sessionStorageMock = installStorage('sessionStorage');

beforeEach(() => {
  localStorageMock.clear();
  sessionStorageMock.clear();
});
