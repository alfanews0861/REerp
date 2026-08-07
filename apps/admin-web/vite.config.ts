import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@real-estate-erp/config': path.resolve(__dirname, '../../packages/config/src'),
      '@real-estate-erp/types': path.resolve(__dirname, '../../packages/types/src'),
      '@real-estate-erp/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@real-estate-erp/firebase': path.resolve(__dirname, '../../packages/firebase/src'),
      '@real-estate-erp/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@real-estate-erp/hooks': path.resolve(__dirname, '../../packages/hooks/src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
