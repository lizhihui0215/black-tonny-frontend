import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('frontend AI entry docs', () => {
  it('keeps the low-token collaboration entrypoints aligned', () => {
    const agents = readRepoFile('AGENTS.md');
    const toolingReadme = readRepoFile('docs/tooling/README.md');
    const aiCollaborationGuide = readRepoFile(
      'docs/tooling/ai-collaboration-guide.md',
    );

    expect(agents).toContain('## Task Routing And Minimum Read Set');
    expect(agents).toContain('## Low-Token Collaboration Defaults');
    expect(toolingReadme).toContain(
      '[AI 协作低 Token 操作手册](./ai-token-playbook.md)',
    );
    expect(aiCollaborationGuide).toContain(
      '它不展开低 Token 协作的具体操作细则',
    );
    expect(aiCollaborationGuide).toContain(
      '[AI 协作低 Token 操作手册](./ai-token-playbook.md)',
    );
  });

  it('keeps the current auth and mock-login baseline documented', () => {
    const architecture = readRepoFile('ARCHITECTURE.md');
    const loginEvolution = readRepoFile(
      'docs/maintainers/login-evolution-handbook.md',
    );
    const alignmentAudit = readRepoFile('docs/vben-alignment-audit.md');

    expect(architecture).toContain('centralized mock owner provider');
    expect(architecture).toContain('are not gated by a frontend bearer token');
    expect(loginEvolution).toContain('集中式 frontend mock owner provider');
    expect(loginEvolution).toContain('当前仍保留 `frontend access mode`');
    expect(alignmentAudit).toContain(
      '当前业务 `/api/*` 不依赖 frontend bearer token',
    );
  });
});
