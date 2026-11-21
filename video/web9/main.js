// Vertical compositor: camera layers + reference-style finish (vignette, grain, whip-blur cuts) + captions.
const DEFS = `<defs>
 <linearGradient id="gWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="1" stop-color="#2a2233" stop-opacity="0.14"/></linearGradient>
 <radialGradient id="gFace" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#c9a56a" stop-opacity="0.25"/></radialGradient>
 <radialGradient id="gVig" cx="0.5" cy="0.47" r="0.72"><stop offset="0.5" stop-color="#2a1a14" stop-opacity="0"/><stop offset="0.85" stop-color="#2a1a14" stop-opacity="0.28"/><stop offset="1" stop-color="#1a1010" stop-opacity="0.6"/></radialGradient>
 <linearGradient id="gGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2d0" stop-opacity="0.22"/><stop offset="0.45" stop-color="#fff2d0" stop-opacity="0"/></linearGradient>
</defs>`;
function compose(shot, t, T) {
  const r = shot.draw(t, T);
  let s = '';
  for (const L of r.layers) s += `<g transform="${layerT(r.cam, L.d)}">${L.svg}</g>`;
  if (r.tint) s += `<rect width="1080" height="1920" fill="${r.tint[0]}" opacity="${f2(r.tint[1])}" style="mix-blend-mode:multiply"/>`;
  return { s, over: r.over || '' };
}
const shotAt = T => { for (let i = SHOTS.length - 1; i >= 0; i--) if (T >= SHOTS[i].t0) return i; return 0; };
function captionSVG(T) {
  const c = CAPTIONS.find(c => T >= c.s && T < c.e);
  if (!c) return '';
  const ap = E.back(clamp((T - c.s) / 0.12));
  let ai = -1; c.words.forEach((w, k) => { if (T >= w.s - 0.03) ai = k; });
  if (ai >= 0 && T > c.words[ai].e + 0.3) ai = -1;
  const spans = c.words.map((w, k) => `<tspan fill="${k === ai ? '#ffd23f' : '#ffffff'}">${esc(w.w)}</tspan>`).join(' ');
  const plain = c.words.map(w => esc(w.w)).join(' ');
  const fs = 92;
  return `<g transform="translate(540 1530) scale(${(0.8 + 0.2 * ap).toFixed(3)})" opacity="${clamp(ap * 1.6).toFixed(3)}">
   <text x="5" y="9" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="#1b1018" opacity="0.5" stroke="#1b1018" stroke-width="18" stroke-linejoin="round" word-spacing="6">${plain}</text>
   <text x="0" y="0" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" stroke="#2a2030" stroke-width="16" stroke-linejoin="round" paint-order="stroke" word-spacing="6">${spans}</text></g>`;
}
function renderFrame(f) {
  const T = f / FPS;
  const i = shotAt(T), sh = SHOTS[i], t = T - sh.t0;
  let { s: body, over } = compose(sh, t, T);
  if (sh.xf && t < sh.xf && i > 0) {
    const prev = SHOTS[i - 1], a = 1 - E.inOut(t / sh.xf);
    body += `<g opacity="${a.toFixed(3)}">${compose(prev, T - prev.t0, T).s}</g>`;
  }
  // whip-blur on hard cuts (reference style): 4 frames after a cut, 2 before
  let blur = 0, dx = 0;
  if (!sh.xf && i > 0 && t < 4 / FPS) { const k = 1 - t / (4 / FPS); blur = 28 * k; dx = -60 * k; }
  const nx = SHOTS[i + 1];
  if (nx && !nx.xf && nx.t0 - T <= 2 / FPS && nx.t0 - T > 0) { const k = 1 - (nx.t0 - T) / (3 / FPS); blur = 22 * k; dx = 50 * k; }
  if (blur > 0.5) body = `<filter id="wb" x="-0.1" y="-0.05" width="1.2" height="1.1"><feGaussianBlur stdDeviation="${blur.toFixed(1)} ${(blur * 0.08).toFixed(1)}"/></filter><g filter="url(#wb)" transform="translate(${dx.toFixed(1)} 0)">${body}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1920" viewBox="0 0 1080 1920">${DEFS}${body}
   <rect width="1080" height="1920" fill="url(#gGlow)"/>
   <rect width="1080" height="1920" fill="url(#gVig)"/>
   <image href="noise.png" x="${(f * 37) % 7 - 7}" y="${(f * 53) % 9 - 9}" width="1096" height="1936" opacity="0.06" style="mix-blend-mode:overlay"/>
   ${over}${captionSVG(T)}</svg>`;
  document.getElementById('stage').innerHTML = svg;
  return i;
}
window.renderFrame = renderFrame;
