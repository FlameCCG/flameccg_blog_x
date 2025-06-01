import { fileURLToPath, URL } from 'node:url';

import { ConfigEnv, defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import type { EnvMeta } from './env.d';
const envDir: string = './';
// https://vite.dev/config/
export default defineConfig((config: ConfigEnv) => {
  const env: EnvMeta = loadEnv(config.mode, envDir) as EnvMeta;
  console.log(env.VITE_SERVER_URL);
  const wsUrl = env.VITE_SERVER_URL.replace('http', 'ws').replace('https', 'wss');
  console.log(wsUrl);
  return {
    plugins: [vue(), vueDevTools()],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/var.less";',
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 80,
      proxy: {
        '/api': {
          target: env.VITE_SERVER_URL,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_SERVER_URL,
        },
        '/ws': {
          target: wsUrl,
          rewrite: (path) => path.replace('/ws', ''),
          ws: true,
        },
      },
    },
  };
});
