// Local test runner (not used on Vercel): node dev-server.js 8091
const http = require('http'), handler = require('./api/xtream')
const route = (u) => { const p = new URL(u, 'http://x'); let m
  if (p.pathname === '/player_api.php' || p.pathname === '/get.php') return '/api/xtream?x=api&' + p.searchParams
  if ((m = /^\/(movie|series|live)\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(p.pathname))) return `/api/xtream?x=stream&kind=${m[1]}&u=${m[2]}&p=${m[3]}&f=${m[4]}`
  return '/api/xtream?x=none' }
http.createServer((req, res) => { req.url = route(req.url); handler(req, res) }).listen(Number(process.argv[2] || 8091), () => console.log('demo on', process.argv[2] || 8091))
