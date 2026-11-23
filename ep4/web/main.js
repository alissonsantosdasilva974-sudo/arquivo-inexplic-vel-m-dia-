// Vertical compositor: camera layers + reference-style finish (vignette, grain, whip-blur cuts) + captions.
function _pat() {
  const r = rng(99); let plaster = '', fabric = '', skin = '';
  for (let i = 0; i < 46; i++) plaster += `<ellipse cx="${(r() * 140).toFixed(1)}" cy="${(r() * 140).toFixed(1)}" rx="${(1 + r() * 4).toFixed(1)}" ry="${(0.8 + r() * 2).toFixed(1)}" fill="${r() < 0.6 ? '#2a2233' : '#ffffff'}" opacity="${(0.04 + r() * 0.07).toFixed(3)}"/>`;
  for (let i = 0; i < 8; i++) plaster += `<path d="M ${(r() * 140).toFixed(1)} ${(r() * 140).toFixed(1)} q ${(r() * 20 - 10).toFixed(1)} ${(r() * 10).toFixed(1)} ${(r() * 26 - 13).toFixed(1)} ${(r() * 14).toFixed(1)}" stroke="#2a2233" stroke-width="0.8" fill="none" opacity="0.07"/>`;
  for (let i = 0; i < 24; i++) fabric += `<circle cx="${(r() * 24).toFixed(1)}" cy="${(r() * 24).toFixed(1)}" r="0.55" fill="#2a2233" opacity="0.07"/>`;
  for (let i = 0; i < 30; i++) skin += `<circle cx="${(r() * 60).toFixed(1)}" cy="${(r() * 60).toFixed(1)}" r="${(0.4 + r() * 0.6).toFixed(1)}" fill="#8a4a3a" opacity="0.035"/>`;
  let wood = '', woodV = '';
  for (let i = 0; i < 6; i++) { const y = 6 + i * 11 + r() * 4; wood += `<path d="M 0 ${y.toFixed(1)} C 100 ${(y - 3).toFixed(1)} 200 ${(y + 4).toFixed(1)} 400 ${y.toFixed(1)}" stroke="#3a2010" stroke-width="1.4" fill="none" opacity="0.22"/>`; }
  for (let i = 0; i < 5; i++) { const x = 5 + i * 9 + r() * 3; woodV += `<path d="M ${x.toFixed(1)} 0 C ${(x + 3).toFixed(1)} 60 ${(x - 3).toFixed(1)} 120 ${x.toFixed(1)} 200" stroke="#2a1408" stroke-width="1.2" fill="none" opacity="0.25"/>`; }
  return `
 <pattern id="pPlaster" patternUnits="userSpaceOnUse" width="140" height="140">${plaster}</pattern>
 <pattern id="pFabric" patternUnits="userSpaceOnUse" width="24" height="24"><path d="M 0 0 L 24 24 M -6 18 L 6 30 M 18 -6 L 30 6" stroke="#2a2233" stroke-width="0.7" opacity="0.045"/>${fabric}</pattern>
 <pattern id="pSkin" patternUnits="userSpaceOnUse" width="60" height="60">${skin}</pattern>
 <pattern id="pStripes" patternUnits="userSpaceOnUse" width="60" height="60"><rect width="30" height="60" fill="#ffffff" opacity="0.07"/><circle cx="45" cy="15" r="2.4" fill="#a86a3a" opacity="0.14"/><circle cx="45" cy="45" r="2.4" fill="#a86a3a" opacity="0.14"/></pattern>
 <pattern id="pWood" patternUnits="userSpaceOnUse" width="400" height="70"><rect width="400" height="70" fill="none"/>${wood}<path d="M 0 69 H 400 M 160 0 V 70" stroke="#2a1408" stroke-width="2" opacity="0.3"/></pattern>
 <pattern id="pWoodV" patternUnits="userSpaceOnUse" width="48" height="200">${woodV}</pattern>
 <pattern id="pBrick" patternUnits="userSpaceOnUse" width="56" height="28"><path d="M 0 0 H 56 M 0 14 H 56 M 0 0 V 14 M 28 14 V 28" stroke="#2a1408" stroke-width="1.6" opacity="0.28"/><rect x="3" y="2" width="20" height="4" fill="#ffffff" opacity="0.08"/><rect x="31" y="16" width="20" height="4" fill="#ffffff" opacity="0.08"/></pattern>
 <pattern id="pTile" patternUnits="userSpaceOnUse" width="36" height="22"><path d="M 0 22 Q 9 10 18 22 Q 27 10 36 22" stroke="#2a1408" stroke-width="1.6" fill="none" opacity="0.32"/><path d="M -18 11 Q -9 -1 0 11 Q 9 -1 18 11 Q 27 -1 36 11" stroke="#2a1408" stroke-width="1.6" fill="none" opacity="0.32"/></pattern>
 <pattern id="pAsphalt" patternUnits="userSpaceOnUse" width="140" height="140">${plaster}${plaster.replace(/#2a2233/g, '#000000')}</pattern>
 <pattern id="pFlowers" patternUnits="userSpaceOnUse" width="56" height="56"><g transform="translate(14 14)"><circle r="6" cx="0" cy="-7" fill="#fff6e8"/><circle r="6" cx="7" cy="-2" fill="#fff6e8"/><circle r="6" cx="4" cy="6" fill="#fff6e8"/><circle r="6" cx="-4" cy="6" fill="#fff6e8"/><circle r="6" cx="-7" cy="-2" fill="#fff6e8"/><circle r="4" fill="#f2c230"/></g><g transform="translate(42 40) scale(0.8)"><circle r="6" cx="0" cy="-7" fill="#fff6e8"/><circle r="6" cx="7" cy="-2" fill="#fff6e8"/><circle r="6" cx="4" cy="6" fill="#fff6e8"/><circle r="6" cx="-4" cy="6" fill="#fff6e8"/><circle r="6" cx="-7" cy="-2" fill="#fff6e8"/><circle r="4" fill="#f2c230"/></g></pattern>
 <pattern id="pDots" patternUnits="userSpaceOnUse" width="34" height="34"><circle cx="8" cy="8" r="5" fill="#fff6e8" opacity="0.85"/><circle cx="25" cy="25" r="5" fill="#fff6e8" opacity="0.85"/></pattern>
 <pattern id="pStripeH" patternUnits="userSpaceOnUse" width="40" height="36"><rect y="0" width="40" height="14" fill="#fff6e8" opacity="0.85"/></pattern>
 <pattern id="pDenim" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#4a6fa8"/><path d="M 0 8 L 8 0 M -2 2 L 2 -2 M 6 10 L 10 6" stroke="#3a5a90" stroke-width="1.6"/><circle cx="2" cy="3" r="0.8" fill="#7a9ad0" opacity="0.7"/></pattern>
 <radialGradient id="gPool"><stop offset="0" stop-color="#ffd890" stop-opacity="0.75"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>
 <linearGradient id="gCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0a0" stop-opacity="0.8"/><stop offset="1" stop-color="#ffe0a0" stop-opacity="0.05"/></linearGradient>
 <radialGradient id="gWin"><stop offset="0" stop-color="#ffe2a0" stop-opacity="0.6"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>
 <filter id="fgBlur" x="-0.2" y="-0.2" width="1.4" height="1.4"><feGaussianBlur stdDeviation="9"/></filter>
 <linearGradient id="gAO" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1424" stop-opacity="0"/><stop offset="1" stop-color="#1b1424" stop-opacity="0.22"/></linearGradient>
 <clipPath id="clipHead"><circle cx="0" cy="-322" r="78"/></clipPath>`;
}
const DEFS = `<defs>${_pat()}
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
  const KEY = /^(mentira|mentirinha|ombros\.|torto\.|ótimo|ótimo,|ótimo!|retinho\.|pesa|afunda|afundava|verdade|dobravam|filha|sonho\.|Hoje)$/;
  const spans = c.words.map((w, k) => `<tspan fill="${k === ai ? '#ffd23f' : (KEY.test(w.w) ? '#ff7a45' : '#ffffff')}">${esc(w.w)}</tspan>`).join(' ');
  const plain = c.words.map(w => esc(w.w)).join(' ');
  const len = c.words.map(w => w.w).join(' ').length;
  const fs = Math.min(92, Math.floor(1700 / Math.max(1, len)));  // keep long captions inside ~960 px
  return `<g transform="translate(540 1300) scale(${(0.8 + 0.2 * ap).toFixed(3)})" opacity="${clamp(ap * 1.6).toFixed(3)}">
   <text x="5" y="9" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="#1b1018" opacity="0.5" stroke="#1b1018" stroke-width="18" stroke-linejoin="round" word-spacing="6">${plain}</text>
   <text x="0" y="0" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" stroke="#2a2030" stroke-width="16" stroke-linejoin="round" paint-order="stroke" word-spacing="6">${spans}</text></g>`;
}
function badge() {
  return `<g transform="translate(64 214)" opacity="0.92"><circle r="34" fill="#f4c4a1" stroke="#211c26" stroke-width="5"/><circle cx="-11" cy="-4" r="7" fill="#fff" stroke="#211c26" stroke-width="3"/><circle cx="11" cy="-4" r="7" fill="#fff" stroke="#211c26" stroke-width="3"/><circle cx="-10" cy="-3" r="2.5" fill="#211c26"/><circle cx="12" cy="-3" r="2.5" fill="#211c26"/><path d="M -8 14 Q 0 20 8 14" stroke="#211c26" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M -30 28 Q 0 46 30 28" stroke="#f2c230" stroke-width="10" fill="none"/>
   <text x="46" y="14" font-family="Fredoka" font-weight="700" font-size="44" fill="#ffffff" stroke="#211c26" stroke-width="10" paint-order="stroke" letter-spacing="2">POLO</text></g>`;
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
  if (window.NOBLUR) blur = 0;
  if (blur > 0.5) body = `<filter id="wb" x="-0.1" y="-0.05" width="1.2" height="1.1"><feGaussianBlur stdDeviation="${blur.toFixed(1)} ${(blur * 0.08).toFixed(1)}"/></filter><g filter="url(#wb)" transform="translate(${dx.toFixed(1)} 0)">${body}</g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1920" viewBox="0 0 1080 1920">${DEFS}${body}
   <rect width="1080" height="1920" fill="url(#gGlow)"/>
   <rect width="1080" height="1920" fill="url(#gVig)"/>
   <image href="paper.png" x="0" y="0" width="1080" height="1920" opacity="0.5" style="mix-blend-mode:multiply"/>
   <image href="noise.png" x="${(f * 37) % 7 - 7}" y="${(f * 53) % 9 - 9}" width="1096" height="1936" opacity="0.07" style="mix-blend-mode:overlay"/>
   ${window.LAYER === 'body' ? '' : `${over}${captionSVG(T)}${badge()}${typeof HUD === 'function' ? HUD(T) : ''}`}</svg>`;
  if (window.LAYER === 'overlay') { document.body.style.background = 'transparent'; document.getElementById('stage').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${DEFS}${over}${captionSVG(T)}${badge()}${typeof HUD === 'function' ? HUD(T) : ''}</svg>`; return i; }
  document.getElementById('stage').innerHTML = svg;
  return i;
}
window.renderFrame = renderFrame;
