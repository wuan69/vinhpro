import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Netlify Function for Local Preview
  app.post('/.netlify/functions/sendTelegram', async (req, res) => {
    try {
      // Load the handler dynamically to simulate Netlify Function environment
      const netlifyFunc = require('./.netlify/functions/sendTelegram.js');
      
      const event = {
        httpMethod: 'POST',
        body: JSON.stringify(req.body)
      };
      
      // Provide a mock context if needed
      const context = {};

      const result = await netlifyFunc.handler(event, context);
      
      res.status(result.statusCode).set(result.headers || {}).send(result.body);
    } catch (error) {
      console.error("Netlify Function Simulation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa', // multi-page app
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Very basic fallback if file doesn't exist
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
