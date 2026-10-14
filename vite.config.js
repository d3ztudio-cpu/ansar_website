import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const versionFile = join(process.cwd(), 'dist', 'version.json');
let buildId;
try {
  buildId = JSON.parse(readFileSync(versionFile, 'utf8')).buildId || new Date().toISOString();
} catch {
  buildId = new Date().toISOString();
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId)
  },
  plugins: [
    react(),
    {
      name: 'app-version-file',
      generateBundle() {
        // Write version.json to disk so the build-id heuristic in main.jsx can
        // read it back during development. The emitted copy goes to dist/.
        try {
          writeFileSync(versionFile, JSON.stringify({ buildId }));
        } catch {}
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ buildId })
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Firestore powers public content. Authentication is imported only
          // by the private admin/quiz paths and is intentionally left out of
          // this initial public chunk.
          firebase: ['firebase/app', 'firebase/firestore'],
        }
      }
    }
  }
});
