const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const CACHE_DIR = path.resolve(__dirname, 'cache');
const TMDB_BASE = process.env.TMDB_BASE_URL || 'https://image.tmdb.org/t/p';

function safeFilePath(requestPath) {
  // requestPath will be like 'w500/abc.jpg' or 'w300/abc.jpg'
  return path.join(CACHE_DIR, requestPath);
}

app.get('/img/*', async (req, res) => {
  try {
    const imagePath = req.path.replace(/^\/img\//, ''); // e.g. w500/xxx.jpg
    if (!imagePath) {
      return res.status(400).send('Image path required');
    }

    const cacheFile = safeFilePath(imagePath);

    // If cached file exists, stream it
    if (fs.existsSync(cacheFile)) {
      return fs.createReadStream(cacheFile).pipe(res);
    }

    // Ensure directory exists
    const dir = path.dirname(cacheFile);
    fs.mkdirSync(dir, { recursive: true });

    const targetUrl = `${TMDB_BASE}/${imagePath}`;

    const upstream = await fetch(targetUrl);
    if (!upstream.ok) {
      return res.status(upstream.status).send('Upstream error');
    }

    // Stream response to both file and client
    const fileStream = fs.createWriteStream(cacheFile);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    upstream.body.pipe(fileStream);
    upstream.body.pipe(res);
    upstream.body.on('error', (err) => {
      console.error('Stream error:', err);
      try { fs.unlinkSync(cacheFile); } catch(e){}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`Image proxy running on http://localhost:${PORT} — TMDB base: ${TMDB_BASE}`);
});
