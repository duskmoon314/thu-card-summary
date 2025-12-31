import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Tsinghua Card Summary',
    description: 'Generate your annual report for Tsinghua University card consumption',
    permissions: ['cookies', 'storage'],
    host_permissions: ['*://card.tsinghua.edu.cn/*'],
  },
  vite: () => ({
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // Ensure content script is not split into chunks
          manualChunks: undefined,
        },
      },
    },
    optimizeDeps: {
      include: ['antd', 'react', 'react-dom', '@ant-design/cssinjs', 'recharts'],
    },
  }),
});
