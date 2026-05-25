const http = require('http');
const https = require('https');

const PORT = 3001;
const GROQ_HOST = 'api.groq.com';
const API_KEY = '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';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/v1/messages') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const API_KEY = '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';
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'GROQ_API_KEY not set. See README.' }));
      return;
    }

    // Convert Anthropic-style request to Groq/OpenAI-style
    let parsed;
    try { parsed = JSON.parse(body); } catch(e) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    const groqBody = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4000,
      stream: true,
      messages: [
        { role: 'system', content: parsed.system || '' },
        ...(parsed.messages || []),
      ],
    });

    const options = {
      hostname: GROQ_HOST,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(groqBody),
      },
    };

    const proxyReq = https.request(options, proxyRes => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });

      let buf = '';
      proxyRes.on('data', chunk => {
        buf += chunk.toString();
        const lines = buf.split('\n');
        buf = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            res.write('data: [DONE]\n\n');
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            const text = parsed.choices?.[0]?.delta?.content || '';
            if (text) {
              // Re-emit in Anthropic SSE format so frontend code works unchanged
              res.write(`data: ${JSON.stringify({
                type: 'content_block_delta',
                delta: { type: 'text_delta', text }
              })}\n\n`);
            }
          } catch (_) {}
        }
      });

      proxyRes.on('end', () => res.end());
    });

    proxyReq.on('error', err => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
    });

    proxyReq.write(groqBody);
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  🔍 CodeLens Proxy — Groq Edition');
  console.log('  ──────────────────────────────────');
  console.log(`  ✅ Running at http://localhost:${PORT}`);
  console.log(`  🔑 Groq API Key: ${process.env.GROQ_API_KEY ? '✓ Loaded' : '✗ MISSING — set GROQ_API_KEY'}`);
  console.log(`  🤖 Model: llama-3.3-70b-versatile`);
  console.log('');
});
