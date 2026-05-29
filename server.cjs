const fs = require('fs');
const http = require('http');
const path = require('path');

function loadEnv(filePath) {
  const envFile = fs.readFileSync(filePath, 'utf8');
  envFile.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] = value;
  });
}

loadEnv(path.join(__dirname, '.env'));

const API_KEY = process.env.API_KEY || process.env.VITE_FOOTBALL_API_KEY;
const distDir = path.join(__dirname, 'dist');

if (!API_KEY) {
  console.error('API_KEY no encontrada en .env');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/api/wc-matches') {
      const upstream = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      });

      const body = await upstream.text();

      res.writeHead(upstream.status, {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
      });

      res.end(body);
      return;
    }

    const safeUrl = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(distDir, safeUrl);
    const normalizedPath = path.normalize(filePath);

    if (!normalizedPath.startsWith(distDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    if (!fs.existsSync(normalizedPath)) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const stat = fs.statSync(normalizedPath);
    if (stat.isDirectory()) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(normalizedPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(normalizedPath).pipe(res);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Servidor de React + proxy escuchando en http://localhost:${PORT}`);
});
