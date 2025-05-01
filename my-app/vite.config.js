import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',  // Use globalThis to polyfill 'global'
  },
   server: {
      watch: {
           usePolling: true,
           interval: 100,
         },
      port: 5173,
      open: true,
    },
});



