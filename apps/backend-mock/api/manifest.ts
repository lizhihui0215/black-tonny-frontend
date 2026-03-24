import { defineEventHandler } from 'h3';
import { createManifestFixture } from '~/utils/black-tonny-mock';
import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(() => {
  return useResponseSuccess(createManifestFixture());
});
