import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

export default defineConfig(async () => {
  return {
    application: {
      nitroMock: false,
    },
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
    },
  };
});
