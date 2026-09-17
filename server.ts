import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { apiRoutes } from './src/server/routes/api.routes';
import { initializeDatabase } from './src/server/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mount modular REST API routes
  app.use('/api', apiRoutes);

  // Initialize PostgreSQL database & tables
  await initializeDatabase();

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite development middleware enabled.');
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Production static serving enabled.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[INnovateAI] Server running successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[INnovateAI] Failed to start server:', err);
  process.exit(1);
});
