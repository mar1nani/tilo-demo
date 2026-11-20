// Xtream-style demo API for Tilo Player reviewers. One function, routed by vercel.json.
const D = require('./data')
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' }
const json = (res, obj, code = 200) => { res.writeHead(code, { 'Content-Type': 'application/json', ...CORS }); res.end(JSON.stringify(obj)) }
const now = String(Math.floor(Date.now() / 1000))

async function servePlaylist(url, res) {
  try {
    const r = await fetch(url, { redirect: 'follow' })
    if (!r.ok) throw new Error('upstream ' + r.status)
    const base = r.url || url
    const text = await r.text()
    const abs = (u) => { try { return new URL(u, base).href } catch (e) { return u } }
    const out = text.split(/\r?\n/).map((line) => {
      if (!line.trim()) return line
      if (line[0] !== '#') return abs(line.trim())
      return line.replace(/URI="([^"]+)"/g, (m, u) => 'URI="' + abs(u) + '"')
    }).join('\n')
    res.writeHead(200, { 'Content-Type': 'application/vnd.apple.mpegurl', 'Cache-Control': 'no-store', ...CORS }); res.end(out)
  } catch (e) { res.writeHead(502, CORS); res.end('Upstream error') }
}

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return }
  const q = new URL(req.url, 'http://x').searchParams
  const x = q.get('x')
  const user = q.get('username') || q.get('u'), pass = q.get('password') || q.get('p')
  if (user !== D.USER || pass !== D.PASS) {
    if (x === 'api') return json(res, { user_info: { auth: 0 } })
    res.writeHead(401, CORS); res.end('Unauthorized'); return
  }
  if (x === 'stream') {
    const kind = q.get('kind'), id = parseInt(String(q.get('f')).split('.')[0], 10)
    let url = null
    if (kind === 'movie') { const m = D.MOVIES.find((v) => v.id === id); url = m && m.url }
    else if (kind === 'live') { const c = D.CHANNELS.find((v) => v.id === id); url = c && c.url }
    else for (const s of Object.keys(D.SERIES.seasons)) { const e = D.SERIES.seasons[s].find((v) => v.id === id); if (e) url = e.url }
    if (!url) { res.writeHead(404, CORS); res.end('Not found'); return }
    if (kind === 'live') return servePlaylist(url, res)   // HLS: serve the playlist ourselves with full addresses (a redirect would make some players look for the segments on this server)
    res.writeHead(302, { Location: url, ...CORS }); res.end(); return
  }
  const a = q.get('action')
  if (!a) return json(res, { user_info: { auth: 1, status: 'Active', username: D.USER, exp_date: null, is_trial: '0', active_cons: '0', max_connections: '5' }, server_info: { url: 'demo', server_protocol: 'https' } })
  if (a === 'get_vod_categories') return json(res, D.VOD_CATS)
  if (a === 'get_series_categories') return json(res, D.SERIES_CATS)
  if (a === 'get_live_categories') return json(res, D.LIVE_CATS)
  if (a === 'get_vod_streams') return json(res, D.MOVIES.map((m, i) => ({ num: i + 1, name: m.name + ' (' + m.year + ')', stream_type: 'movie', stream_id: m.id, stream_icon: '', rating: m.rating, added: now, category_id: '1', container_extension: m.ext })))
  if (a === 'get_live_streams') return json(res, D.CHANNELS.map((c, i) => ({ num: i + 1, name: c.name, stream_type: 'live', stream_id: c.id, stream_icon: '', epg_channel_id: '', added: now, category_id: '1' })))
  if (a === 'get_series') return json(res, [{ num: 1, name: D.SERIES.name, series_id: D.SERIES.id, cover: '', plot: D.SERIES.plot, releaseDate: D.SERIES.year + '-01-01', rating_5based: D.SERIES.rating5, last_modified: now, category_id: '1' }])
  if (a === 'get_vod_info') { const m = D.MOVIES.find((v) => v.id === parseInt(q.get('vod_id'), 10)) || D.MOVIES[0]; return json(res, { info: { plot: m.plot, cast: m.cast, director: m.director, genre: m.genre, releasedate: m.year + '-01-01', rating: m.rating, duration: m.dur } }) }
  if (a === 'get_series_info') {
    const eps = {}
    for (const s of Object.keys(D.SERIES.seasons)) eps[s] = D.SERIES.seasons[s].map((e, i) => ({ id: String(e.id), episode_num: i + 1, title: e.title, container_extension: 'mp4', season: Number(s), info: { plot: 'Open film shown as an episode. ' + 'Creative Commons Attribution 3.0, (c) Blender Foundation', duration: '10:00' } }))
    return json(res, { info: { plot: D.SERIES.plot, cast: D.SERIES.cast, genre: D.SERIES.genre, releaseDate: D.SERIES.year + '-01-01', rating: '7.0' }, episodes: eps })
  }
  return json(res, [])
}
