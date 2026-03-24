import { defineEventHandler, getRouterParam, setHeader } from 'h3';

import { readExportFixture } from '~/utils/black-tonny-mock';
import { notFoundResponse } from '~/utils/response';

export default defineEventHandler((event) => {
  const fileName = getRouterParam(event, 'fileName') ?? '';
  const exportFixture = readExportFixture(fileName);

  if (!exportFixture) {
    return notFoundResponse(event, `Export fixture "${fileName}" not found.`);
  }

  setHeader(event, 'Cache-Control', 'no-store');
  setHeader(
    event,
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodeURIComponent(exportFixture.fileName)}`,
  );
  setHeader(event, 'Content-Type', exportFixture.contentType);
  setHeader(event, 'X-Content-Type-Options', 'nosniff');

  return exportFixture.content;
});
