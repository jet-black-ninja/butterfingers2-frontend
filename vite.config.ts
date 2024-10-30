import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false,
      }, // Correct usage of environment variable
    },
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
