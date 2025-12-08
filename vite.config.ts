import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For GitHub Pages, use repository name as base path
    // Set to empty string for custom domain or root deployment
    const base = process.env.GITHUB_PAGES === 'true' ? '/beliarg/' : '/';
    
    return {
      base,
      plugins: [
        react(),
        {
          name: 'copy-404',
          closeBundle() {
            // Copy 404.html to dist for GitHub Pages SPA routing
            try {
              copyFileSync(
                path.resolve(__dirname, '404.html'),
                path.resolve(__dirname, 'dist/404.html')
              );
            } catch (e) {
              console.warn('Could not copy 404.html:', e);
            }
          }
        }
      ],
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
          },
        },
        copyPublicDir: true,
        outDir: 'dist',
      },
      publicDir: 'public'
    };
});
