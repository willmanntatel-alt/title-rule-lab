import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = new Map([['/', ['index.html','text/html; charset=utf-8']], ['/index.html',['index.html','text/html; charset=utf-8']], ['/styles.css',['styles.css','text/css; charset=utf-8']], ['/app.mjs',['app.mjs','text/javascript; charset=utf-8']], ['/measurement.mjs',['measurement.mjs','text/javascript; charset=utf-8']], ['/devpost/app-map.html',['devpost/app-map.html','text/html; charset=utf-8']]]);
http.createServer({maxHeaderSize:65536}, async(req,res) => {
  if (req.method !== 'GET' || req.headers.host !== '127.0.0.1:5034') {res.writeHead(403); res.end('Forbidden'); return;}
  if (req.url.length > 60000) {res.writeHead(413);res.end('Report too large');return;}
  if (req.url.startsWith('/export?')) {
    try {
      const raw = new URL(req.url, 'http://127.0.0.1:5034').searchParams.get('report');
      if (!raw || Buffer.byteLength(raw) > 24000) throw new Error('Invalid report');
      const data = JSON.parse(raw);
      if (data.schema !== 'title-rule-lab/v1' || typeof data.title !== 'string' || data.title.length > 2000) throw new Error('Invalid report');
      res.writeHead(200, {'Content-Type':'application/json; charset=utf-8', 'Content-Disposition':'attachment; filename="title-rule-review.json"', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
      res.end(raw);
    } catch {res.writeHead(400);res.end('Invalid report');}
    return;
  }
  const item = files.get(req.url);
  if (!item) {res.writeHead(404); res.end('Not found'); return;}
  try {const body=await readFile(new URL(item[0],import.meta.url)); res.writeHead(200, {'Content-Type':item[1], 'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"}); res.end(body);}
  catch {res.writeHead(404);res.end('Not found');}
}).listen(5034,'127.0.0.1',()=>console.log('Title Rule Lab: http://127.0.0.1:5034'));
