// Frame compositor. renderFrame(f) is a pure function of the absolute frame number.
const DEFS = `<defs>
 <linearGradient id="gBodyA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4e4260"/><stop offset="0.6" stop-color="#3b3147"/><stop offset="1" stop-color="#2a2233"/></linearGradient>
 <linearGradient id="gBodyB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#55465e"/><stop offset="0.6" stop-color="#40334a"/><stop offset="1" stop-color="#2c2236"/></linearGradient>
 <linearGradient id="gWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="1" stop-color="#2a2233" stop-opacity="0.18"/></linearGradient>
 <radialGradient id="gFace" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#c9a56a" stop-opacity="0.25"/></radialGradient>
 <clipPath id="clipBody"><path d="M -70 -22 C -84 -120 -62 -226 0 -226 C 62 -226 84 -120 70 -22 C 64 2 -64 2 -70 -22 Z"/></clipPath>
 <linearGradient id="gShade" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a2233" stop-opacity="0.32"/></linearGradient>
 <radialGradient id="gVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#1b1424" stop-opacity="0"/><stop offset="1" stop-color="#1b1424" stop-opacity="0.55"/></radialGradient>
</defs>`;

function compose(shot, t, T) {
  const r = shot.draw(t, T);
  let s = '';
  for (const L of r.layers) s += `<g transform="${layerT(r.cam, L.d)}">${L.svg}</g>`;
  if (r.over) s += r.over;
  if (r.tint) s += `<rect width="1920" height="1080" fill="${r.tint[0]}" opacity="${f2(r.tint[1])}" style="mix-blend-mode:multiply"/>`;
  return s;
}

function captionSVG(T) {
  const c = CAPTIONS.find(c => T >= c.s && T < c.e);
  if (!c) return '';
  const ap = E.back(clamp((T - c.s) / 0.14));
  let ai = -1; c.words.forEach((w, k) => { if (T >= w.s - 0.03) ai = k; });
  if (ai >= 0 && T > c.words[ai].e + 0.35) ai = -1;
  const spans = c.words.map((w, k) => {
    const active = k === ai;
    return `<tspan fill="${active ? '#ffd23f' : '#ffffff'}">${esc(w.w)}</tspan>`;
  }).join(' ');
  return `<g transform="translate(960 990) scale(${(0.86 + 0.14 * ap).toFixed(3)})" opacity="${clamp(ap * 1.5).toFixed(3)}">
   <text x="4" y="6" text-anchor="middle" font-family="Inter Display, Inter, sans-serif" font-weight="900" font-size="66" fill="#1b1424" opacity="0.45" stroke="#1b1424" stroke-width="14" stroke-linejoin="round" word-spacing="14">${c.words.map(w => esc(w.w)).join(' ')}</text>
   <text x="0" y="0" text-anchor="middle" font-family="Inter Display, Inter, sans-serif" font-weight="900" font-size="66" stroke="#2a2233" stroke-width="13" stroke-linejoin="round" paint-order="stroke" letter-spacing="0.5" word-spacing="14">${spans}</text></g>`;
}

function shotAt(T) {
  for (let i = SHOTS.length - 1; i >= 0; i--) if (T >= SHOTS[i].t0) return i;
  return 0;
}

function renderFrame(f) {
  const T = f / FPS;
  const i = shotAt(T), sh = SHOTS[i];
  const t = T - sh.t0;
  let body = compose(sh, t, T);
  // optional crossfade from previous shot
  if (sh.xf && t < sh.xf && i > 0) {
    const prev = SHOTS[i - 1];
    const a = 1 - E.inOut(t / sh.xf);
    body += `<g opacity="${a.toFixed(3)}">${compose(prev, T - prev.t0, T)}</g>`;
  }
  // fade at very end / start
  let fade = 0;
  // no fade-in: frame 0 must already show the hook
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">${DEFS}${body}<rect width="1920" height="1080" fill="url(#gVig)"/>${window.NOCAP ? '' : captionSVG(T)}${fade > 0 ? `<rect width="1920" height="1080" fill="#000" opacity="${fade.toFixed(3)}"/>` : ''}</svg>`;
  document.getElementById('stage').innerHTML = svg;
  return i;
}
window.renderFrame = renderFrame;

// test hook: ?sheet=1 renders a character sheet
if (location.search.includes('sheet')) {
  const ids = ['polo', 'padeira', 'mae', 'motorista', 'barnabe', 'menino', 'mulher', 'moca', 'viz1', 'viz2', 'viz3'];
  const ex = ['happy', 'surprised', 'worried', 'smug', 'laugh', 'neutral', 'joy', 'angry', 'happy', 'neutral', 'happy'];
  let s = `<rect width="1920" height="1080" fill="#e9d3a8"/>`;
  ids.forEach((id, i) => { const x = 150 + (i % 6) * 320, y = i < 6 ? 480 : 980; s += char(id, { x, y, face: (i % 3 - 1) * 0.6, expr: ex[i], t: 1, armR: i * 15, mask: id === 'polo' && false }); });
  s += char('padeira', { x: 1800, y: 980, old: true, expr: 'happy', t: 1, s: 0.9 });
  s += char('polo', { x: 1760, y: 480, mask: true, face: 0.3, t: 1, armR: 150, s: 0.8 });
  s += `<g transform="translate(1500 900)">${bread({ stone: 1, cracks: 1 })}</g>`;
  document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${DEFS}${s}</svg>`;
}
