import { readFile, writeFile, readdir } from 'node:fs/promises';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';
import { gzip as gzipCallback } from 'node:zlib';
import { promisify } from 'node:util';

const gzip = promisify(gzipCallback);
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary' };

async function compressDirectory(directory) {
 for (const entry of await readdir(directory, { withFileTypes: true })) {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) await compressDirectory(path);
  else if (types[extname(path)]) {
   const bytes = await readFile(path);
   if (bytes.length < 1024) continue;
   const compressed = await gzip(bytes, { level: 9 });
   if (compressed.length < bytes.length * .9) await writeFile(path + '.gz', compressed);
  }
 }
}

// Built-in gzip keeps original public assets untouched. Hosts must serve matching
// sidecars with Content-Encoding: gzip (or enable equivalent dynamic compression).
export function assetCompression() {
 let outputDirectory, building;
 return {
  name: 'portfolio-asset-compression',
  configResolved(config) {
   outputDirectory = resolve(config.root, config.build.outDir);
   building = config.command === 'build';
  },
  async closeBundle() { if (building) await compressDirectory(outputDirectory); },
  configurePreviewServer(server) {
   server.middlewares.use(async (request, response, next) => {
    if (!['GET', 'HEAD'].includes(request.method) || request.headers.range) return next();
    const acceptsGzip = request.headers['accept-encoding']?.split(',').some((part) =>
     part.trim().split(';')[0] === 'gzip' && !/;\s*q=0(?:\.0*)?(?:\s|$)/.test(part));
    if (!acceptsGzip) return next();
    let path;
    try { path = decodeURIComponent((request.url || '').split('?')[0]); } catch { return next(); }
    if (path === '/') path = '/index.html';
    const file = resolve(outputDirectory, '.' + path);
    const inside = relative(outputDirectory, file);
    if (inside.startsWith('..') || isAbsolute(inside)) return next();
    const type = types[extname(file)];
    if (!type) return next();
    try {
     const bytes = await readFile(file + '.gz');
     response.setHeader('Content-Type', type);
     response.setHeader('Content-Encoding', 'gzip');
     response.setHeader('Vary', 'Accept-Encoding');
     response.setHeader('Content-Length', bytes.length);
     response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch { next(); } // Non-compressible or missing assets use Vite's normal handling.
   });
  },
 };
}
