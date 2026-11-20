// Demo catalogue for Tilo Player reviewers: open-licence films and public test streams only. No copyrighted content.
// Films: Blender Foundation open movies (Creative Commons Attribution 3.0, (c) Blender Foundation | www.blender.org).
const BBB = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'
const ED = 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4'
const SINTEL = 'https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4'
exports.USER = 'demo'
exports.PASS = 'demo'
exports.VOD_CATS = [{ category_id: '1', category_name: '|EN| Open films', parent_id: 0 }]
exports.SERIES_CATS = [{ category_id: '1', category_name: '|EN| Open series', parent_id: 0 }]
exports.LIVE_CATS = [{ category_id: '1', category_name: '|EN| Test channels', parent_id: 0 }]
const CC = 'Creative Commons Attribution 3.0, (c) Blender Foundation | www.blender.org'
exports.MOVIES = [
  { id: 101, name: 'Big Buck Bunny', year: 2008, rating: '7.2', url: BBB, ext: 'mp4', plot: 'A giant rabbit takes revenge on three bullying rodents. Open film. ' + CC, genre: 'Animation', cast: 'Blender Foundation', director: 'Sacha Goedegebure', dur: '09:56' },
  { id: 102, name: 'Elephants Dream', year: 2006, rating: '6.1', url: ED, ext: 'mp4', plot: 'Two men explore a strange machine world. Open film. ' + CC, genre: 'Animation', cast: 'Blender Foundation', director: 'Bassam Kurdali', dur: '10:53' },
  { id: 103, name: 'Sintel', year: 2010, rating: '7.5', url: SINTEL, ext: 'mp4', plot: 'A young woman searches for her lost dragon. Open film. ' + CC, genre: 'Animation, Fantasy', cast: 'Blender Foundation', director: 'Colin Levy', dur: '14:48' }
]
exports.SERIES = {
  id: 201, name: 'Open Shorts', year: 2010, rating5: '3.5', plot: 'A small demo series built from open Blender films, to show seasons and episodes. ' + CC, genre: 'Animation', cast: 'Blender Foundation',
  seasons: { 1: [{ id: 2011, title: 'Big Buck Bunny', url: BBB }, { id: 2012, title: 'Elephants Dream', url: ED }], 2: [{ id: 2021, title: 'Sintel', url: SINTEL }] }
}
exports.CHANNELS = [
  { id: 301, name: 'Test Channel 1 (HLS demo)', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { id: 302, name: 'Test Channel 2 (Apple HLS sample)', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8' }
]
