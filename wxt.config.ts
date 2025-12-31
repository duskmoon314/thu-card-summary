import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Tsinghua Card Annual Report',
    description: 'Generate your annual report for Tsinghua University card consumption',
    permissions: ['cookies', 'storage'],
    host_permissions: ['*://card.tsinghua.edu.cn/*'],
  },
});
