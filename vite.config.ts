import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@realestate-erp/types': path.resolve(__dirname, './packages/types/src/index.ts'),
      '@realestate-erp/config': path.resolve(__dirname, './packages/config/src/index.ts'),
      '@realestate-erp/utils': path.resolve(__dirname, './packages/utils/src/index.ts'),
      '@realestate-erp/firebase': path.resolve(__dirname, './packages/firebase/src/index.ts'),
      '@realestate-erp/services': path.resolve(__dirname, './packages/services/src/index.ts'),
      '@realestate-erp/ui': path.resolve(__dirname, './packages/ui/src/index.ts'),
      '@realestate-erp/hooks': path.resolve(__dirname, './packages/hooks/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
