import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api/streamix-api': {
        target: 'https://upnshare.com',
        changeOrigin: true,
        // The rewrite adds /api/v1, so endpoints should NOT include it
        rewrite: (path) => path.replace(/^\/api\/streamix-api/, '/api/v1'),
        headers: {
          'api-token': 'f6335d071b5b4ed82bace91d'
        }
      }
    }
  }
});
