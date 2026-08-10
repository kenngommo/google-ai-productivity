import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { exec } from 'child_process'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'scraper-api',
      configureServer(server) {
        server.middlewares.use('/api/scrape', (_req, res, _next) => {
          const nodePath = "C:\\Users\\AreteEPM\\AppData\\Local\\Programs\\Python\\Python314\\Lib\\site-packages\\playwright\\driver\\node.exe";
          const scriptPath = path.resolve(process.cwd(), 'scripts/scrape-shopee-real.cjs');
          
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          
          console.log(`[API] Triggering scraper: ${scriptPath}`);
          
          exec(`"${nodePath}" "${scriptPath}"`, (error, stdout, _stderr) => {
            if (error) {
              console.error(`[API] Scraper failed: ${error.message}`);
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: error.message }));
              return;
            }
            console.log(`[API] Scraper finished successfully.`);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, output: stdout }));
          });
        });
      }
    }
  ],
  base: './',
  server: {
    watch: {
      ignored: ['**/scripts/chrome_temp_profile/**', '**/scripts/**']
    }
  }
})
