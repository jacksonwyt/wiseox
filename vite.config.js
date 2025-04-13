import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        caseStudies: resolve(__dirname, 'case-studies.html'),
      },
    },
    outDir: 'dist', // Ensure output directory is 'dist'
  },
  // Proxy API requests to the Vercel dev server (usually port 3000)
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
