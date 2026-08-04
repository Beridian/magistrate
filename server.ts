import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI theme card generation
  app.post('/api/generate-themes', async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic || typeof topic !== 'string') {
        return res.status(400).json({ error: 'Topic is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return fallback if key is missing
        return res.json({
          themes: [
            { text: `${topic} Secret`, category: topic, hint: 'Key concept' },
            { text: `${topic} Landmark`, category: topic, hint: 'Famous spot' },
            { text: `${topic} Artifact`, category: topic, hint: 'Important item' },
          ],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate 5 fun, distinct party game secret word theme cards for the topic "${topic}".
Output ONLY valid JSON in this exact structure without markdown code blocks:
{
  "themes": [
    {"text": "Item or Concept Name", "category": "${topic}", "hint": "Short 3-5 word hint"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return res.json(parsed);
    } catch (err) {
      console.error('Error generating themes:', err);
      // Fallback
      return res.json({
        themes: [
          { text: `${req.body.topic || 'Secret'} Alpha`, category: req.body.topic || 'Custom', hint: 'Special theme' },
          { text: `${req.body.topic || 'Secret'} Beta`, category: req.body.topic || 'Custom', hint: 'Unique concept' },
        ],
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
