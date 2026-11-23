import { cpSync } from 'node:fs';
import { defineConfig } from 'vite';

// web/data/ is written by the rx-pipeline notebooks. Dev serves it at /data/...;
// the build copies it to dist/data/ so the same fetch('data/...') paths work on GitHub Pages.
export default defineConfig({
  base: './',            // relative paths: works at /revolutionary-xroads/ on Pages
  publicDir: false,      // no public/ folder; data/ is handled below
  plugins: [
    {
      name: 'copy-data',
      apply: 'build',
      closeBundle() {
        cpSync('data', 'dist/data', { recursive: true });
      },
    },
  ],
  build: { chunkSizeWarningLimit: 2000 },  // deck.gl alone is ~600 kB; expected
  server: { open: true },
});
