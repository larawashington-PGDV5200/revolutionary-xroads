import { cpSync } from 'node:fs';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [
    {
      name: 'copy-data',
      apply: 'build',
      closeBundle() {
        cpSync('data', 'dist/data', { recursive: true });
      },
    },
  ],
  build: { chunkSizeWarningLimit: 2000 },
  server: { open: true },
});
