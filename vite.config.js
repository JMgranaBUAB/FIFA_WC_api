import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org',
          changeOrigin: true,
          secure: true,
          rewrite: () => '/v4/competitions/WC/matches',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('X-Auth-Token', env.VITE_FOOTBALL_API_KEY || env.API_KEY);
            });
          },
        },
      },
    },
  };
});
