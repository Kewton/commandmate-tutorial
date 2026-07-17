import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { greet } from './greet.js';

const here = dirname(fileURLToPath(import.meta.url));

// CommandMate proxies external apps by path prefix, so the page must not
// assume it is served from the site root. Everything here is relative.
const PORT = Number(process.env.PORT ?? 4173);

const server = createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const template = await readFile(join(here, 'public', 'index.html'), 'utf8');
  const html = template.replace('{{GREETING}}', greet('CommandMate'));

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Tutorial app listening on http://localhost:${PORT}`);
});
