const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let parsedUrl = decodeURI(req.url.split('?')[0]);
  if (parsedUrl === '/' || parsedUrl === '\\' || parsedUrl === '') {
    parsedUrl = 'index.html';
  }

  const cleanRelative = parsedUrl.replace(/^[\/\\]+/, '').replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.resolve(ROOT, cleanRelative);

  console.log(`[REQ] ${req.method} ${req.url} -> ${filePath}`);

  // Prevent directory traversal
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    console.warn(`[403] Traversal denied for: ${filePath}`);
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.warn(`[404] Not found: ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      return res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="background:#091410;color:#F3F7F5;font-family:sans-serif;padding:3rem;text-align:center;"><h1>404 Not Found</h1><p>The requested page or asset does not exist.</p><p><a href="/" style="color:#6EE7B7;">Return to Home Sanctuary</a></p></body></html>');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Aetheria Pharmacy Web Application is LIVE`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
