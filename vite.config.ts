import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'admin-fallback',
      configureServer(server) {
        server.middlewares.use('/admin', (req, res, next) => {
          // If requesting /admin or /admin/, serve the admin index.html
          if (req.url === '/admin' || req.url === '/admin/') {
            const adminHtml = fs.readFileSync(
              path.resolve('public/admin/index.html'),
              'utf-8'
            );
            res.setHeader('Content-Type', 'text/html');
            res.end(adminHtml);
          } else {
            next();
          }
        });
      },
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Handle admin routes for Decap CMS
    fs: {
      allow: ['..']
    },
  },
  // Ensure admin files are copied to dist
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './public/admin/index.html'
      }
    }
  }
});
