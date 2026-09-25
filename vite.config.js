import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const buildId = new Date().toISOString();

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
          // Animation library is shared by several lazy routes; keeping it in
          // its own immutable chunk lets repeat visits reuse it from cache
          // without re-downloading it alongside route code.
          motion: ['framer-motion']
        }
      }
    }
  }
});
