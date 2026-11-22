// City kit v3 (pilot) — deeper, denser Brazilian town.
//  • street3D(): true one-point perspective street with box buildings (street face + end face + roof), facade details
//    (platibanda, cornices, windows w/ frames, AC units, balconies, awnings, signs, stains), parked & moving cars, trees,
//    poles with sagging wires, sidewalk tiles, crosswalk, cast shadows, distance haze, skyline; day or night.
//    Camera height can go very high (drone shot) — roofs, water tanks and antennas become visible.
//  • sideStreet(): 5-layer side view (hills+skyline → rooftops w/ church & water tanks → tall 2nd row → detailed main row
//    → blurred foreground), with wires, cars, street furniture and window life.
const C3 = { sky: '#cfe3ee', night: 0 };
const PAL3 = ['#f2d27a', '#9fc3d8', '#e8a8b8', '#a8d4e8', '#e8c9a0', '#d8c4e8', '#f0b890', '#e6dcc4', '#c9b8e0', '#f4c4a0', '#b8cce0'];
const SHOP3 = ['PADARIA', 'MERCADO', 'BARBEARIA', 'CORREIO', 'FARMÁCIA', 'BAZAR', 'LIVRARIA', 'FLORES', 'RELÓGIOS', 'ARMARINHO', 'SORVETES', 'LANCHES', 'ÓTICA', 'CHAVEIRO'];
const CARC = ['#c8443c', '#3c6aa8', '#f2c230', '#e8e4dc', '#2a2a34', '#e07a3a', '#8a5aa8', '#5a8ac8'];

// ---------- projection ----------
function cam3(h = 640, vy = 560, f = 500, x = 0) { return { h, vy, f, x }; }
function P3(c, X, Y, D) { const z = 1 + Math.max(D, -c.f * 0.9) / c.f; return { x: 960 + (X - c.x) / z, y: c.vy + (c.h - Y) / z, k: 1 / z }; }
const Q3 = (a, b, c, d, fill, ex = '') => `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(b.x)} ${f2(b.y)} L ${f2(c.x)} ${f2(c.y)} L ${f2(d.x)} ${f2(d.y)} Z" fill="${fill}" ${ex}/>`;
const hazeC = (col, D, Dmax, sky, amt = 0.65) => mix(col, sky, clamp(D / Dmax) * amt);
const sw3 = (k, w = 4) => `stroke="${INK}" stroke-width="${f2(Math.max(0.6, w * k))}" stroke-linejoin="round"`;

// ---------- sprites placed in perspective ----------
const CAR_TYPES = ['sedan', 'hatch', 'van', 'pickup', 'taxi', 'kombi'];
function carRear(x, y, k, col, night = 0, o = {}) { return carView(x, y, k, col, night, Object.assign({ front: false }, o)); }
function carView(x, y, k, col, night = 0, o = {}) {
  const s = k * (o.s || 1), type = o.type || 'sedan', front = !!o.front;
  if (type === 'taxi') col = '#f2c230';
  const tall = type === 'van' || type === 'kombi' ? 1.35 : 1, wide = type === 'pickup' || type === 'van' ? 1.08 : type === 'hatch' ? 0.94 : 1;
  const W2 = 140 * wide, bodyH = 100 * (type === 'van' ? 1.5 : type === 'kombi' ? 1.45 : 1), cabT = type === 'pickup' ? 0.75 : 1;
  const glass = night ? '#2a3050' : '#9cc4d8';
  let g = `<ellipse cx="0" cy="4" rx="${f2(W2 + 10)}" ry="22" fill="#1b1424" opacity="0.3"/>`;
  g += `<path d="M ${-W2} -10 L ${-W2} ${-bodyH + 10} Q ${-W2 + 4} ${-bodyH - 10} ${-W2 + 28} ${-bodyH - 12} L ${W2 - 28} ${-bodyH - 12} Q ${W2 - 4} ${-bodyH - 10} ${W2} ${-bodyH + 10} L ${W2} -10 Q ${W2} 4 ${W2 - 16} 4 L ${-W2 + 16} 4 Q ${-W2} 4 ${-W2} -10 Z" fill="${col}" stroke="${INK}" stroke-width="7"/>`;
  if (type === 'kombi') g += `<path d="M ${-W2} ${-bodyH * 0.55} L ${W2} ${-bodyH * 0.55} L ${W2} ${-bodyH - 12} L ${-W2} ${-bodyH - 12} Z" fill="#f4f0e4" stroke="${INK}" stroke-width="6"/>`;
  if (type !== 'van' && type !== 'kombi') {
    const cw = (W2 - 40) * cabT, ch = 74;
    g += `<path d="M ${-cw} ${-bodyH - 12} L ${-cw + 22} ${-bodyH - 12 - ch} Q ${-cw + 28} ${-bodyH - 22 - ch} ${-cw + 40} ${-bodyH - 22 - ch} L ${cw - 40} ${-bodyH - 22 - ch} Q ${cw - 28} ${-bodyH - 22 - ch} ${cw - 22} ${-bodyH - 12 - ch} L ${cw} ${-bodyH - 12} Z" fill="${shade(col, 0.1)}" stroke="${INK}" stroke-width="7"/>`;
    g += `<path d="M ${-cw + 16} ${-bodyH - 18} L ${-cw + 32} ${-bodyH - 6 - ch} L ${cw - 32} ${-bodyH - 6 - ch} L ${cw - 16} ${-bodyH - 18} Z" fill="${glass}" stroke="${INK}" stroke-width="5"/>`;
    g += `<path d="M ${-cw + 30} ${-bodyH - 30} L ${-cw + 60} ${-bodyH - ch + 4}" stroke="#fff" stroke-width="6" opacity="${night ? 0.1 : 0.35}"/>`;
    if (type === 'taxi') g += `<rect x="-30" y="${-bodyH - 52 - ch}" width="60" height="26" rx="6" fill="#f4f0e4" stroke="${INK}" stroke-width="4"/><text x="0" y="${-bodyH - 33 - ch}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="17" fill="${INK}">TÁXI</text>`;
    if (type === 'pickup' && !front) g += `<rect x="${-W2 + 10}" y="${-bodyH - 4}" width="${W2 * 2 - 20}" height="16" fill="${shade(col, 0.3)}"/>`;
  } else {
    g += `<path d="M ${-W2 + 18} ${-bodyH * 0.92} L ${W2 - 18} ${-bodyH * 0.92} L ${W2 - 18} ${-bodyH * 0.62} L ${-W2 + 18} ${-bodyH * 0.62} Z" fill="${glass}" stroke="${INK}" stroke-width="5"/>`;
  }
  if (front) {
    g += `<rect x="${-W2 + 12}" y="${-bodyH * 0.55}" width="54" height="30" rx="10" fill="${night ? '#fff6d0' : '#f4efe0'}" stroke="${INK}" stroke-width="4"/><rect x="${W2 - 66}" y="${-bodyH * 0.55}" width="54" height="30" rx="10" fill="${night ? '#fff6d0' : '#f4efe0'}" stroke="${INK}" stroke-width="4"/>`;
    if (night) g += `<g style="mix-blend-mode:screen"><ellipse cx="${-W2 + 39}" cy="${-bodyH * 0.45}" rx="60" ry="40" fill="#fff2c0" opacity="0.45"/><ellipse cx="${W2 - 39}" cy="${-bodyH * 0.45}" rx="60" ry="40" fill="#fff2c0" opacity="0.45"/><ellipse cx="0" cy="40" rx="${W2 + 40}" ry="50" fill="#fff2c0" opacity="0.25"/></g>`;
    g += `<rect x="-60" y="${-bodyH * 0.5}" width="120" height="30" rx="8" fill="${shade(col, 0.35)}" stroke="${INK}" stroke-width="4"/>` + Array.from({ length: 5 }, (_, i) => `<path d="M ${-50 + i * 25} ${-bodyH * 0.5 + 6} v 18" stroke="${INK}" stroke-width="3"/>`).join('');
  } else {
    g += `<rect x="${-W2 + 12}" y="${-bodyH * 0.72}" width="44" height="22" rx="6" fill="${night || o.brake ? '#ff4a3a' : '#c83a2a'}" stroke="${INK}" stroke-width="4"/><rect x="${W2 - 56}" y="${-bodyH * 0.72}" width="44" height="22" rx="6" fill="${night || o.brake ? '#ff4a3a' : '#c83a2a'}" stroke="${INK}" stroke-width="4"/>`;
    if (night) g += `<circle cx="${-W2 + 34}" cy="${-bodyH * 0.62}" r="34" fill="#ff5a4a" opacity="0.3"/><circle cx="${W2 - 34}" cy="${-bodyH * 0.62}" r="34" fill="#ff5a4a" opacity="0.3"/>`;
  }
  g += `<rect x="-40" y="${-bodyH * 0.38}" width="80" height="24" rx="4" fill="#f4f0e4" stroke="${INK}" stroke-width="4"/><text x="0" y="${-bodyH * 0.38 + 18}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="15" fill="${INK}">${['ABC1D23', 'POL0A10', 'BRA2E19', 'RIO4K77', 'SPX9B01'][Math.abs((col.charCodeAt(2) || 1) + (type.length * 3)) % 5]}</text>`;
  g += `<rect x="${-W2 + 10}" y="-8" width="40" height="22" rx="6" fill="#1e1a22"/><rect x="${W2 - 50}" y="-8" width="40" height="22" rx="6" fill="#1e1a22"/>`;
  g += `<path d="M ${-W2 + 20} ${-bodyH * 0.25} L ${W2 - 20} ${-bodyH * 0.25}" stroke="${shade(col, 0.3)}" stroke-width="5"/>`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(s)})">${g}</g>`;
}
function treeP(x, y, k, t, night = 0, seed = 1) {
  const sw = Math.sin(t * 0.8 + seed) * 3, c = night ? '#2a4a3e' : mix('#6aa05a', '#8ab86a', (seed % 5) / 5);
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})"><ellipse cx="0" cy="4" rx="90" ry="18" fill="#1b1424" opacity="0.25"/>
   <path d="M -14 0 Q -8 -150 -12 -260 L 12 -260 Q 8 -150 14 0 Z" fill="#6a4a34" stroke="${INK}" stroke-width="6"/>
   <g transform="rotate(${f2(sw)} 0 -260)"><circle cx="-70" cy="-300" r="86" fill="${shade(c, 0.12)}" stroke="${INK}" stroke-width="6"/><circle cx="72" cy="-310" r="90" fill="${shade(c, 0.08)}" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-390" r="108" fill="${c}" stroke="${INK}" stroke-width="6"/><circle cx="-36" cy="-420" r="40" fill="#fff" opacity="0.13"/></g></g>`;
}
function poleP(x, yBase, yTop, k, night) {
  return `<path d="M ${f2(x)} ${f2(yBase)} L ${f2(x)} ${f2(yTop)}" stroke="#3a3440" stroke-width="${f2(16 * k + 1)}" stroke-linecap="round"/>` +
    `<path d="M ${f2(x - 40 * k)} ${f2(yTop + 14 * k)} L ${f2(x + 40 * k)} ${f2(yTop + 14 * k)}" stroke="#3a3440" stroke-width="${f2(10 * k + 0.8)}"/>` +
    `<rect x="${f2(x - 18 * k)}" y="${f2(yTop + 30 * k)}" width="${f2(36 * k)}" height="${f2(46 * k)}" rx="${f2(6 * k)}" fill="${night ? '#ffe0a0' : '#e8dcc0'}" stroke="${INK}" stroke-width="${f2(3 * k + 0.4)}"/>` +
    (night ? `<circle cx="${f2(x)}" cy="${f2(yTop + 54 * k)}" r="${f2(110 * k)}" fill="url(#gPool)" style="mix-blend-mode:screen"/>` : '');
}

// ---------- the perspective street ----------
function street3D(t, o = {}) {
  const c = o.cam || cam3(o.camH || 640, o.vpY || 560);
  const night = o.night || 0, closed = o.closed || 0, r = rng(o.seed || 7);
  const sky = night ? '#2a2e5a' : (o.skyC || '#dfe9ec');
  const Dmax = 8000, R = 440, W = 620, curb = 16;
  let s = '';
  // ground plane
  s += Q3(P3(c, -4000, 0, -400), P3(c, 4000, 0, -400), P3(c, 4000, 0, Dmax + 3000), P3(c, -4000, 0, Dmax + 3000), night ? '#3c3a48' : '#b8b0a0');
  s += Q3(P3(c, -R, 0, -400), P3(c, R, 0, -400), P3(c, R, 0, Dmax), P3(c, -R, 0, Dmax), night ? '#34323e' : '#8c8894');
  for (let D = -300; D < Dmax; D += 260) s += Q3(P3(c, -R, 0, D), P3(c, R, 0, D), P3(c, R, 0, D + 6), P3(c, -R, 0, D + 6), '#000', 'opacity="0.05"');
  for (const g of [-1, 1]) {
    s += Q3(P3(c, g * R, 0, -400), P3(c, g * W, 0, -400), P3(c, g * W, 0, Dmax), P3(c, g * R, 0, Dmax), night ? '#6e6874' : '#d8ccb4');
    for (let D = -300; D < Dmax; D += 180) s += Q3(P3(c, g * R, 0, D), P3(c, g * W, 0, D), P3(c, g * W, 0, D + 5), P3(c, g * R, 0, D + 5), INK, 'opacity="0.12"');
    s += Q3(P3(c, g * R, 0, -400), P3(c, g * (R + curb), 0, -400), P3(c, g * (R + curb), 0, Dmax), P3(c, g * R, 0, Dmax), '#6a6470');
  }
  for (let D = -300; D < Dmax; D += 340) s += Q3(P3(c, -9, 0, D), P3(c, 9, 0, D), P3(c, 9, 0, D + 170), P3(c, -9, 0, D + 170), '#f4efe0', 'opacity="0.8"');
  // crosswalk
  { const D0 = o.crossD || 900; for (let i = -6; i <= 6; i++) s += Q3(P3(c, i * 66 - 22, 0, D0), P3(c, i * 66 + 22, 0, D0), P3(c, i * 66 + 22, 0, D0 + 220), P3(c, i * 66 - 22, 0, D0 + 220), '#f4efe0', 'opacity="0.85"'); }
  // far skyline (behind everything)
  { const b = P3(c, 0, 0, Dmax + 2600); let sk = `<g opacity="${night ? 0.95 : 0.8}">`; const rs = rng(91);
    for (let i = -12; i <= 12; i++) { const X = i * 700 + rs() * 200, H = 600 + rs() * 1600, a = P3(c, X, 0, Dmax + 2600), tp = P3(c, X, H, Dmax + 2600), wpx = 500 * b.k; sk += `<rect x="${f2(a.x - wpx / 2)}" y="${f2(tp.y)}" width="${f2(wpx)}" height="${f2(a.y - tp.y)}" fill="${night ? '#22244a' : '#b4c4cc'}"/>`; if (night) for (let k = 0; k < 6; k++) sk += `<rect x="${f2(a.x - wpx / 2 + rs() * wpx)}" y="${f2(tp.y + rs() * (a.y - tp.y))}" width="${f2(14 * b.k * 3)}" height="${f2(18 * b.k * 3)}" fill="#ffd27a"/>`; }
    const tw = P3(c, 0, 0, Dmax + 2200), tk = tw.k; sk += `<g transform="translate(${f2(tw.x)} ${f2(tw.y)}) scale(${f2(tk * 2.2)})"><rect x="-70" y="-1100" width="140" height="1100" fill="${night ? '#4a2430' : '#a86a4a'}" stroke="${INK}" stroke-width="12"/><circle cx="0" cy="-1160" r="130" fill="${night ? '#ffe7a0' : '#f4ead4'}" stroke="${INK}" stroke-width="14"/><path d="M 0 -1160 L 0 -1250 M 0 -1160 L 60 -1130" stroke="${INK}" stroke-width="14"/><path d="M -180 -1270 L 0 -1460 L 180 -1270 Z" fill="#3c4a6a" stroke="${INK}" stroke-width="12"/></g>`;
    s += sk + `</g>`; }
  // buildings
  const blds = [];
  const drawBack = () => { if (c.h < 900) return ''; let q = ''; back.sort((a, b) => (b.D - a.D) || (Math.abs(b.X0) - Math.abs(a.X0))); for (const b of back) q += backBlock(c, b, night, closed, sky, Dmax); return q; };
  for (const g of [-1, 1]) { let D = -260, i = 0; while (D < Dmax) { const len = 360 + r() * 520, fl = r() < 0.2 ? 2 : r() < 0.5 ? 3 : r() < 0.78 ? 5 : r() < 0.93 ? 7 : 10; blds.push({ g, D, len, H: fl * 150 + (r() < 0.5 ? 60 : 0), fl, depth: 400 + r() * 300, wall: PAL3[Math.floor(r() * PAL3.length)], shop: r() < 0.7, sign: SHOP3[Math.floor(r() * SHOP3.length)], awn: CARC[Math.floor(r() * CARC.length)], seed: Math.floor(r() * 1e6), tank: r() < 0.5, ant: r() < 0.3 }); D += len + (r() < 0.15 ? 160 : 0); i++; } }
  // back rows of blocks behind the street-front row (simple boxes; give density from above)
  const back = [];
  for (const g of [-1, 1]) for (let row = 1; row <= 3; row++) { let D = -200; const X0 = W + row * 1250; while (D < Dmax) { const len = 380 + r() * 600, fl = 2 + Math.floor(r() * (row === 1 ? 6 : 9)); back.push({ g, D, len, X0, X1: X0 + 700 + r() * 300, H: fl * 150, wall: PAL3[Math.floor(r() * PAL3.length)], roof: ['#c8643c', '#a85a3a', '#8a8a96', '#b89a7a', '#6a7a9a'][Math.floor(r() * 5)], tank: r() < 0.5, seed: Math.floor(r() * 1e6) }); D += len + 60 + (r() < 0.2 ? 400 : 0); } }
  blds.sort((a, b) => b.D - a.D);
  // sprites (trees, cars, poles, people) collected with depth so they interleave correctly with buildings of the opposite side
  const items = [];
  const pole = [];
  for (const g of [-1, 1]) for (let D = -200; D < Dmax; D += 720) pole.push({ g, D });
  for (const p of pole) items.push({ D: p.D, draw: () => { const b = P3(c, p.g * (R + 40), 0, p.D), tp = P3(c, p.g * (R + 40), 520, p.D); return poleP(b.x, b.y, tp.y, b.k, night); } });
  for (const g of [-1, 1]) for (let D = 200 + (g > 0 ? 360 : 0); D < Dmax; D += 720) items.push({ D, draw: () => { const b = P3(c, g * (R + 120), 0, D); return treeP(b.x, b.y, b.k * 0.62, t, night, Math.floor(D) + g); } });
  { const rc = rng((o.seed || 7) + 5); for (const g of [-1, 1]) for (let D = 100; D < Dmax; D += 420 + rc() * 600) if (rc() < 0.75) { const col = CARC[Math.floor(rc() * CARC.length)], type = CAR_TYPES[Math.floor(rc() * CAR_TYPES.length)], fr = rc() < 0.5; items.push({ D, draw: () => { const b = P3(c, g * (R - 110), 0, D); return carView(b.x, b.y, b.k * 0.62, col, night, { type, front: fr }); } }); } }
  if (o.traffic !== false && !closed) { const rt = rng((o.seed || 7) + 31); for (let i = 0; i < (o.traffic || 7); i++) { const away = i % 2 === 0, col = CARC[Math.floor(rt() * CARC.length)], type = CAR_TYPES[Math.floor(rt() * CAR_TYPES.length)], sp = 380 + rt() * 260, D0 = rt() * 7000; const D = away ? ((D0 + t * sp) % 7200) + 150 : 7350 - ((D0 + t * sp) % 7200); items.push({ D, draw: () => { const b = P3(c, away ? 175 : -175, 0, D); return carView(b.x, b.y, b.k * 0.62, col, night, { type, front: !away }); } }); } }
  for (const mc of (o.movingCars || [])) items.push({ D: mc.D, draw: () => { const b = P3(c, mc.X, 0, mc.D); return carView(b.x, b.y, b.k * 0.62, mc.col, night, { brake: mc.brake, type: mc.type || 'sedan', front: !!mc.front }); } });
  for (const pp of (o.people || [])) items.push({ D: pp.D, draw: () => { const b = P3(c, pp.X, 0, pp.D); return person(pp.id, Object.assign({ x: b.x, y: b.y, s: (pp.s || 0.44) * b.k }, pp.o)); } });
  if (!closed) { const rp = rng((o.seed || 7) + 9); for (let i = 0; i < (o.crowd == null ? 34 : o.crowd); i++) { const g = rp() < 0.5 ? -1 : 1, D0 = 300 + rp() * 5000, sp = (rp() < 0.5 ? 1 : -1) * (60 + rp() * 60), id = NPC_IDS[i % NPC_IDS.length]; const D = ((D0 + t * sp) % 5400 + 5400) % 5400 + 200, X = g * (R + 50 + rp() * 100); items.push({ D, draw: () => { const b = P3(c, X, 0, D); return person(id, { x: b.x, y: b.y, s: 0.44 * b.k, t, back: sp > 0, walk: t * 8 + i, face: 0 }); } }); } }
  if (!closed && (o.crowd == null || o.crowd > 0)) {
    const D0 = (o.crossD || 900) + 110, ids = ['npc3', 'npc8', 'npc15'];
    for (let i = 0; i < 3; i++) { const ph = ((t * 0.12 + i / 3) % 1), X = lerp(-R - 60, R + 60, ph) * (i % 2 ? -1 : 1); items.push({ D: D0 + i * 30, draw: () => { const b = P3(c, X, 0, D0 + i * 30); return person(ids[i], { x: b.x, y: b.y, s: 0.44 * b.k, t, side: true, face: i % 2 ? -0.8 : 0.8, walk: t * 8 + i }); } }); }
    const rq = rng((o.seed || 7) + 13);
    for (let i = 0; i < 12; i++) { const g = rq() < 0.5 ? -1 : 1, D = 600 + rq() * 3500, X = g * (W - 50), id = NPC_IDS[(i * 5 + 2) % NPC_IDS.length]; items.push({ D, draw: () => { const b = P3(c, X, 0, D); return person(id, { x: b.x, y: b.y, s: 0.44 * b.k, t, face: g > 0 ? 0.9 : -0.9, lx: g, expr: 'happy' }); } }); }
  }
  if (!closed && (o.crowd == null || o.crowd > 0)) { const rg = rng((o.seed || 7) + 17); for (let i = 0; i < 5; i++) { const g = rg() < 0.5 ? -1 : 1, D = 500 + rg() * 3000, X = g * (R + 120 + rg() * 60); for (const [dx, f, id] of [[-45, 0.7, NPC_IDS[(i * 3) % 24]], [45, -0.7, NPC_IDS[(i * 3 + 7) % 24]]]) items.push({ D: D + (dx > 0 ? 1 : 0), draw: () => { const b = P3(c, X + dx, 0, D); return person(id, { x: b.x, y: b.y, s: 0.44 * b.k, t, face: f, expr: 'happy', mouth: Math.max(0, Math.sin(t * 9 + i + dx)) * 0.5, armR: 30 + Math.sin(t * 3 + i) * 20, bendR: 40 }); } }); } }
  // painter: far→near, buildings and items merged by D
  s += drawBack();
  const all = blds.map(b => ({ D: b.D + b.len, b })).concat(items.map(it => ({ D: it.D, it }))).sort((a, b) => b.D - a.D);
  const wires = [];
  for (const e of all) {
    if (e.it) { s += e.it.draw(); continue; }
    s += building3D(c, e.b, R, W, night, closed, sky, Dmax, t);
  }
  // wires between successive poles (drawn after, they sit above the street)
  for (const g of [-1, 1]) { const ps = pole.filter(p => p.g === g).sort((a, b) => a.D - b.D); for (let i = 0; i < ps.length - 1; i++) for (const dy of [0, 26]) { const a = P3(c, g * (R + 40), 500 - dy, ps[i].D), b = P3(c, g * (R + 40), 500 - dy, ps[i + 1].D), m = P3(c, g * (R + 40), 470 - dy, (ps[i].D + ps[i + 1].D) / 2); s += `<path d="M ${f2(a.x)} ${f2(a.y)} Q ${f2(m.x)} ${f2(m.y + 30 * m.k)} ${f2(b.x)} ${f2(b.y)}" stroke="#2a2630" stroke-width="${f2(2.4 * a.k + 0.6)}" fill="none" opacity="0.85"/>`; } }
  for (let D = 400; D < Dmax; D += 1440) { const a = P3(c, -(R + 40), 500, D), b = P3(c, R + 40, 480, D + 300), m = P3(c, 0, 430, D + 150); s += `<path d="M ${f2(a.x)} ${f2(a.y)} Q ${f2(m.x)} ${f2(m.y)} ${f2(b.x)} ${f2(b.y)}" stroke="#2a2630" stroke-width="${f2(2.2 * a.k + 0.6)}" fill="none" opacity="0.8"/>`; }
  // atmospheric haze toward the vanishing point
  const vp = P3(c, 0, 0, Dmax);
  s += `<radialGradient id="hz3" cx="${f2(vp.x / 1920)}" cy="${f2(vp.y / 1080)}" r="0.35"><stop offset="0" stop-color="${sky}" stop-opacity="${night ? 0.35 : 0.55}"/><stop offset="1" stop-color="${sky}" stop-opacity="0"/></radialGradient><rect x="-1400" y="-800" width="4720" height="3200" fill="url(#hz3)"/>`;
  return s;
}

function building3D(c, b, R, W, night, closed, sky, Dmax, t) {
  const g = b.g, X = g * W, X2 = g * (W + b.depth), D0 = b.D, D1 = b.D + b.len, H = b.H;
  const lit = g > 0 ? 1 : 0;                       // sun from the left: right-hand facades lit, left in shade
  const base = night ? mix(b.wall, '#262848', 0.55) : mix(b.wall, '#5a5070', lit ? 0 : 0.22);
  const wall = hazeC(base, D0, Dmax, sky, night ? 0.4 : 0.6);
  const endW = hazeC(shade(base, 0.14), D0, Dmax, sky, night ? 0.4 : 0.6);
  const k0 = P3(c, X, 0, D0).k;
  let s = '';
  // cast shadow of left-hand buildings onto the street (day)
  if (!night && g < 0) { const L = Math.min(R + 200, H * 0.5); s += Q3(P3(c, X, 0, D0 + 40), P3(c, X, 0, D1), P3(c, -R - 16 + Math.max(0, 200 - L) * 0 + L * 0.4 - 60, 0, D1 + 80), P3(c, -R - 16 + L * 0.4 - 60, 0, D0 + 120), '#2a2440', 'opacity="0.16"'); }
  // roof (visible when camera is above)
  if (c.h > H) { s += Q3(P3(c, X, H, D0), P3(c, X2, H, D0), P3(c, X2, H, D1), P3(c, X, H, D1), hazeC(night ? '#3a3448' : ['#a89a90', '#c8643c', '#8a8a96', '#b89a7a'][b.seed % 4], D0, Dmax, sky, 0.6), sw3(k0, 3));
    const rr = rng(b.seed + 3);
    if (b.tank) { const tx = X + g * b.depth * (0.3 + rr() * 0.4), td = D0 + b.len * (0.3 + rr() * 0.4); s += box3D(c, tx - 60, tx + 60, td - 60, td + 60, H, H + 130, hazeC('#5a8ac8', D0, Dmax, sky, 0.6), k0); }
    if (b.ant) { const a = P3(c, X + g * 80, H, D0 + 80), tp = P3(c, X + g * 80, H + 260, D0 + 80); s += `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(tp.x)} ${f2(tp.y)} M ${f2(tp.x - 30 * a.k)} ${f2(tp.y + 40 * a.k)} L ${f2(tp.x + 30 * a.k)} ${f2(tp.y + 40 * a.k)}" stroke="#3a3440" stroke-width="${f2(4 * a.k + 0.6)}"/>`; }
  }
  // end face (facing the camera)
  if (D0 > -c.f * 0.6) s += Q3(P3(c, X, 0, D0), P3(c, X2, 0, D0), P3(c, X2, H, D0), P3(c, X, H, D0), endW, sw3(k0));
  // street face
  s += Q3(P3(c, X, 0, D0), P3(c, X, 0, D1), P3(c, X, H, D1), P3(c, X, H, D0), wall, sw3(k0));
  // platibanda band + cornice
  s += Q3(P3(c, X, H - 50, D0), P3(c, X, H - 50, D1), P3(c, X, H, D1), P3(c, X, H, D0), hazeC(shade(base, 0.2), D0, Dmax, sky, 0.6), sw3(k0, 2.5));
  for (let f = 1; f < b.fl; f++) { const y = f * 150; s += Q3(P3(c, X, y - 6, D0), P3(c, X, y - 6, D1), P3(c, X, y + 6, D1), P3(c, X, y + 6, D0), hazeC(shade(base, 0.25), D0, Dmax, sky, 0.6), ''); }
  // windows
  const nw = Math.max(1, Math.floor(b.len / 170)), rr = rng(b.seed);
  for (let f = (b.shop ? 1 : 0); f < b.fl; f++) for (let i = 0; i < nw; i++) {
    const d0 = D0 + (b.len / nw) * i + 36, d1 = d0 + b.len / nw - 72, y0 = f * 150 + 34, y1 = y0 + 86;
    const isLit = night && !closed && rr() < 0.55;
    const k = P3(c, X, 0, d0).k;
    s += Q3(P3(c, X, y0 - 8, d0 - 8), P3(c, X, y0 - 8, d1 + 8), P3(c, X, y1 + 8, d1 + 8), P3(c, X, y1 + 8, d0 - 8), hazeC('#f4ead4', d0, Dmax, sky, 0.6), sw3(k, 2.5));
    s += Q3(P3(c, X, y0, d0), P3(c, X, y0, d1), P3(c, X, y1, d1), P3(c, X, y1, d0), closed ? shade(base, 0.35) : (isLit ? '#ffd27a' : hazeC(night ? '#2a3050' : '#7a9ab0', d0, Dmax, sky, 0.5)), sw3(k, 2.2));
    s += Q3(P3(c, X, y0 + 43, d0), P3(c, X, y0 + 43, d1), P3(c, X, y0 + 46, d1), P3(c, X, y0 + 46, d0), INK, 'opacity="0.5"');
    s += Q3(P3(c, X, y1 + 8, d0 - 14), P3(c, X, y1 + 8, d1 + 14), P3(c, X - g * 26, y1 + 2, d1 + 14), P3(c, X - g * 26, y1 + 2, d0 - 14), hazeC('#f4ead4', d0, Dmax, sky, 0.6), sw3(k, 1.8));
    if (b.seed % 2 === 0 && k > 0.12) for (const [u0, u1] of [[d0 - 36, d0 - 8], [d1 + 8, d1 + 36]]) s += Q3(P3(c, X, y0 - 6, u0), P3(c, X, y0 - 6, u1), P3(c, X, y1 + 6, u1), P3(c, X, y1 + 6, u0), hazeC(['#3c6aa8', '#a8503a', '#8a5aa8', '#4a4458'][b.seed % 4], d0, Dmax, sky, 0.6), sw3(k, 1.6));
    if (!closed && rr() < 0.25 && k > 0.15) { for (let q = 0; q < 3; q++) { const pm = P3(c, X - g * 14, y1 + 18, d0 + (d1 - d0) * (q + 0.5) / 3); s += `<circle cx="${f2(pm.x)}" cy="${f2(pm.y)}" r="${f2(14 * k)}" fill="${['#e86a6a', '#f2c230', '#ee8aaa'][q]}" stroke="${INK}" stroke-width="${f2(1.5 * k + 0.3)}"/>`; } }
    if (!closed && rr() < 0.12 && k > 0.18) { const m = P3(c, X, y0 + 50, (d0 + d1) / 2); s += `<circle cx="${f2(m.x)}" cy="${f2(m.y - 8 * k)}" r="${f2(16 * k)}" fill="${['#f1c08f', '#c98b5e', '#8d5a34'][b.seed % 3]}" stroke="${INK}" stroke-width="${f2(2 * k + 0.3)}"/><path d="M ${f2(m.x - 18 * k)} ${f2(m.y + 30 * k)} Q ${f2(m.x)} ${f2(m.y + 4 * k)} ${f2(m.x + 18 * k)} ${f2(m.y + 30 * k)} Z" fill="${CARC[b.seed % CARC.length]}"/>`; }
    if (f >= 1 && b.fl >= 3 && rr() < 0.2) { const a1 = P3(c, X - g * 50, y0 - 8, d0 - 20), a2 = P3(c, X - g * 50, y0 - 8, d1 + 20), a3 = P3(c, X - g * 50, y0 + 30, d1 + 20), a4 = P3(c, X - g * 50, y0 + 30, d0 - 20); s += Q3(P3(c, X, y0 - 8, d0 - 20), P3(c, X, y0 - 8, d1 + 20), a2, a1, hazeC('#c8c0b4', d0, Dmax, sky, 0.6), sw3(k, 2)); for (let q = 0; q <= 5; q++) { const u = d0 - 20 + (d1 - d0 + 40) * q / 5, pa = P3(c, X - g * 50, y0 - 8, u), pb = P3(c, X - g * 50, y0 + 30, u); s += `<path d="M ${f2(pa.x)} ${f2(pa.y)} L ${f2(pb.x)} ${f2(pb.y)}" stroke="#4a4458" stroke-width="${f2(2.5 * k + 0.4)}"/>`; } s += `<path d="M ${f2(a4.x)} ${f2(a4.y)} L ${f2(a3.x)} ${f2(a3.y)}" stroke="#4a4458" stroke-width="${f2(3.5 * k + 0.5)}"/>`; }
    if (!closed && !isLit && rr() < 0.3) s += Q3(P3(c, X, y0, d0), P3(c, X, y0, (d0 + d1) / 2), P3(c, X, y1, (d0 + d1) / 2), P3(c, X, y1, d0), hazeC(shade(b.awn, 0.1), d0, Dmax, sky, 0.6), sw3(k, 2));
    if (isLit && rr() < 0.25) { const m = P3(c, X, y0 + 20, (d0 + d1) / 2); s += `<ellipse cx="${f2(m.x)}" cy="${f2(m.y + 30 * k)}" rx="${f2(14 * k)}" ry="${f2(26 * k)}" fill="#2a2030" opacity="0.6"/>`; }
    if (f >= 1 && rr() < 0.18) s += box3D(c, X + g * 0, X - g * 60, d0 + 10, d0 + 90, y0 - 50, y0 - 6, hazeC('#e8e4dc', d0, Dmax, sky, 0.6), k);           // AC unit
    if (f >= 1 && rr() < 0.15) { const a = P3(c, X - g * 80, y1 + 10, d0), bq = P3(c, X - g * 80, y1 + 10, d1); s += `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(bq.x)} ${f2(bq.y)}" stroke="#4a4458" stroke-width="${f2(5 * k + 0.6)}"/>`; for (let q = 0; q < 4; q++) { const u = d0 + (d1 - d0) * (q + 0.5) / 4, pa = P3(c, X - g * 80, y1 + 10, u), pb = P3(c, X - g * 80, y1 - 26, u); s += `<path d="M ${f2(pa.x)} ${f2(pa.y)} L ${f2(pb.x)} ${f2(pb.y)}" stroke="${['#e86a6a', '#5ab0d8', '#f2c230', '#f4f0e4'][q]}" stroke-width="${f2(14 * k)}"/>`; } }   // varal
  }
  // pilasters at the building's ends + facade tile base
  for (const u of [D0, D1 - 30]) { const kk = P3(c, X, 0, u).k; s += Q3(P3(c, X, 0, u), P3(c, X, 0, u + 30), P3(c, X, H - 50, u + 30), P3(c, X, H - 50, u), hazeC(lite(base, 0.15), u, Dmax, sky, 0.6), sw3(kk, 2)); }
  s += Q3(P3(c, X, 0, D0), P3(c, X, 0, D1), P3(c, X, 14, D1), P3(c, X, 14, D0), hazeC(shade(base, 0.4), D0, Dmax, sky, 0.6), '');
  // cornice brackets under the platibanda
  for (let u = D0 + 40; u < D1 - 20; u += 70) { const kk = P3(c, X, 0, u).k; if (kk < 0.2) break; s += Q3(P3(c, X, H - 62, u), P3(c, X, H - 62, u + 18), P3(c, X, H - 50, u + 18), P3(c, X, H - 50, u), hazeC(shade(base, 0.3), u, Dmax, sky, 0.6), ''); }
  // clay-tile roof edge on low houses
  if (b.fl <= 3 && (b.seed % 3 === 0)) { const kk = P3(c, X, 0, D0).k; s += Q3(P3(c, X, H, D0), P3(c, X, H, D1), P3(c, X - g * 120, H + 70, D1), P3(c, X - g * 120, H + 70, D0), hazeC('#c8643c', D0, Dmax, sky, 0.6), sw3(kk, 3)); for (let u = D0; u < D1; u += 40) { const pa = P3(c, X, H, u), pb = P3(c, X - g * 120, H + 70, u); s += `<path d="M ${f2(pa.x)} ${f2(pa.y)} L ${f2(pb.x)} ${f2(pb.y)}" stroke="#8a3a22" stroke-width="${f2(2 * kk + 0.4)}" opacity="0.6"/>`; } }
  // posters / graffiti low on the wall
  if (!b.shop && rr() < 0.6) { const u = D0 + b.len * 0.6, kk = P3(c, X, 0, u).k; s += Q3(P3(c, X, 30, u), P3(c, X, 30, u + 70), P3(c, X, 120, u + 70), P3(c, X, 120, u), hazeC(['#f2c230', '#e86a6a', '#5ab0d8', '#f4f0e4'][b.seed % 4], u, Dmax, sky, 0.6), sw3(kk, 1.5)); }
  // door for residential buildings
  if (!b.shop) { const u0 = D0 + b.len * 0.18, u1 = u0 + 110, kk = P3(c, X, 0, u0).k; s += Q3(P3(c, X, 0, u0 - 10), P3(c, X, 0, u1 + 10), P3(c, X, 230, u1 + 10), P3(c, X, 230, u0 - 10), hazeC('#f4ead4', u0, Dmax, sky, 0.6), sw3(kk, 2.5)); s += Q3(P3(c, X, 0, u0), P3(c, X, 0, u1), P3(c, X, 220, u1), P3(c, X, 220, u0), hazeC(shade(b.awn, 0.45), u0, Dmax, sky, 0.6), sw3(kk, 2.5)); }
  // stains / weathering
  for (let i = 0; i < 3; i++) { const u = D0 + rr() * b.len, v = rr() * H * 0.8, k = P3(c, X, 0, u).k; s += Q3(P3(c, X, v, u), P3(c, X, v, u + 90), P3(c, X, v + 60, u + 90), P3(c, X, v + 60, u), INK, 'opacity="0.05"'); }
  // ground floor shop: window, door, awning, sign
  if (b.shop) {
    const d0 = D0 + 30, d1 = D1 - 30, k = P3(c, X, 0, d0).k;
    s += Q3(P3(c, X, 14, d0), P3(c, X, 14, d0 + (d1 - d0) * 0.68), P3(c, X, 118, d0 + (d1 - d0) * 0.68), P3(c, X, 118, d0), closed ? '#5a5260' : (night ? '#ffd890' : hazeC('#cfe0e6', d0, Dmax, sky, 0.5)), sw3(k, 3));
    if (closed) for (let q = 1; q < 8; q++) s += Q3(P3(c, X, 14 + q * 13, d0), P3(c, X, 14 + q * 13, d0 + (d1 - d0) * 0.68), P3(c, X, 16 + q * 13, d0 + (d1 - d0) * 0.68), P3(c, X, 16 + q * 13, d0), INK, 'opacity="0.5"');
    s += Q3(P3(c, X, 0, d0 + (d1 - d0) * 0.74), P3(c, X, 0, d1), P3(c, X, 128, d1), P3(c, X, 128, d0 + (d1 - d0) * 0.74), hazeC(shade(b.awn, 0.35), d0, Dmax, sky, 0.6), sw3(k, 3));
    if (!closed) { const nst = Math.max(2, Math.floor((d1 - d0) / 70)); for (let q = 0; q < nst; q++) { const u0 = d0 + (d1 - d0) * q / nst, u1 = d0 + (d1 - d0) * (q + 1) / nst; s += Q3(P3(c, X, 142, u0), P3(c, X, 142, u1), P3(c, X - g * 110, 112, u1), P3(c, X - g * 110, 112, u0), hazeC(q % 2 ? '#f4ead4' : b.awn, u0, Dmax, sky, 0.6), sw3(k, 2)); } }
    const sa = P3(c, X, 150, d0), sb = P3(c, X, 150, d1), sc = P3(c, X, 196, d1), sd = P3(c, X, 196, d0);
    s += Q3(sa, sb, sc, sd, night ? '#2a2a40' : hazeC('#3c4a5a', d0, Dmax, sky, 0.5), sw3(k, 2.5));
    if (k > 0.22) { const m = P3(c, X, 173, (d0 + d1) / 2), len = Math.hypot(sb.x - sa.x, sb.y - sa.y), ang = Math.atan2(sb.y - sa.y, sb.x - sa.x) * 180 / Math.PI, fs = Math.min(Math.abs(sd.y - sa.y) * 0.7, len / (b.sign.length * 0.62)); s += `<text transform="translate(${f2(m.x)} ${f2(m.y)}) rotate(${f2(ang)}) scale(1 ${f2(Math.max(0.3, Math.cos(ang * Math.PI / 180) * 0.4 + 0.6))})" text-anchor="middle" dominant-baseline="middle" font-family="Fredoka" font-weight="700" font-size="${f2(fs)}" fill="${night && !closed ? '#ffe7a0' : '#f4e6c8'}">${b.sign}</text>`; }
  }
  if (b.shop && b.seed % 4 === 1) { const u = D0 + 20, kk = P3(c, X, 0, u).k; if (kk > 0.12) { s += Q3(P3(c, X, 230, u), P3(c, X - g * 90, 230, u), P3(c, X - g * 90, 460, u), P3(c, X, 460, u), night ? '#ff6a8a' : hazeC(b.awn, u, Dmax, sky, 0.6), sw3(kk, 2.5)); if (night) { const m = P3(c, X - g * 45, 345, u); s += `<circle cx="${f2(m.x)}" cy="${f2(m.y)}" r="${f2(140 * kk)}" fill="#ff6a8a" opacity="0.18"/>`; } } }
  return s;
}
function box3D(c, x0, x1, d0, d1, y0, y1, col, k) {
  const L = Math.min(x0, x1), Rr = Math.max(x0, x1);
  const faceX = Math.abs(L) < Math.abs(Rr) ? L : Rr;  // the face toward the street centre
  let s = Q3(P3(c, L, y0, d0), P3(c, Rr, y0, d0), P3(c, Rr, y1, d0), P3(c, L, y1, d0), shade(col, 0.15), sw3(k, 2.5));
  s += Q3(P3(c, faceX, y0, d0), P3(c, faceX, y0, d1), P3(c, faceX, y1, d1), P3(c, faceX, y1, d0), col, sw3(k, 2.5));
  if (c.h > y1) s += Q3(P3(c, L, y1, d0), P3(c, Rr, y1, d0), P3(c, Rr, y1, d1), P3(c, L, y1, d1), lite(col, 0.2), sw3(k, 2.5));
  return s;
}

// ---------- side view, 5 depth layers ----------
function hillsSkyline(t, night = 0) {
  const r = rng(301); let s = '';
  s += `<path d="M -1500 640 C -900 420 -400 520 200 440 C 800 360 1300 520 2000 430 C 2600 360 3100 480 3600 420 L 3600 1400 L -1500 1400 Z" fill="${night ? '#252848' : '#b8c8b0'}"/>`;
  let x = -1500; while (x < 3600) { const w = 90 + r() * 150, h = 120 + r() * 360; s += `<rect x="${f2(x)}" y="${f2(700 - h)}" width="${f2(w)}" height="${f2(h + 300)}" fill="${night ? '#2c2e54' : '#c4d2d8'}"/>`; if (night) for (let k = 0; k < 4; k++) s += `<rect x="${f2(x + 10 + r() * (w - 20))}" y="${f2(700 - h + 10 + r() * (h - 20))}" width="10" height="12" fill="#ffd27a" opacity="0.85"/>`; x += w + r() * 20; }
  return s;
}
function rooftops(t, night = 0, towerX = 1300) {
  const r = rng(302); let s = '', x = -1500;
  const col = night ? '#30325a' : '#d6c6b4', dark = night ? '#262848' : '#b8a898';
  while (x < 3600) {
    const w = 160 + r() * 220, h = 360 + r() * 300;
    if (Math.abs(x - towerX) < 260) { x += 280; continue; }
    if (r() < 0.12) { // church
      s += `<rect x="${f2(x)}" y="${f2(760 - h)}" width="${f2(w)}" height="${f2(h + 300)}" fill="${col}" stroke="${INK}" stroke-width="3" opacity="0.9"/><rect x="${f2(x + w / 2 - 40)}" y="${f2(760 - h - 260)}" width="80" height="260" fill="${col}" stroke="${INK}" stroke-width="3"/><path d="M ${f2(x + w / 2 - 56)} ${f2(760 - h - 260)} L ${f2(x + w / 2)} ${f2(760 - h - 380)} L ${f2(x + w / 2 + 56)} ${f2(760 - h - 260)} Z" fill="${dark}" stroke="${INK}" stroke-width="3"/><path d="M ${f2(x + w / 2)} ${f2(760 - h - 380)} v -50 M ${f2(x + w / 2 - 16)} ${f2(760 - h - 412)} h 32" stroke="${INK}" stroke-width="5"/>`;
    } else {
      s += `<rect x="${f2(x)}" y="${f2(760 - h)}" width="${f2(w)}" height="${f2(h + 300)}" fill="${col}" stroke="${INK}" stroke-width="3" opacity="0.92"/>`;
      if (r() < 0.45) s += `<rect x="${f2(x + w * 0.2)}" y="${f2(760 - h - 70)}" width="60" height="70" fill="${night ? '#3a4a7a' : '#7aa0c8'}" stroke="${INK}" stroke-width="3"/>`;
      if (r() < 0.3) s += `<path d="M ${f2(x + w * 0.7)} ${f2(760 - h)} v -110 M ${f2(x + w * 0.7 - 24)} ${f2(760 - h - 90)} h 48" stroke="${INK}" stroke-width="3"/>`;
      for (let k = 0; k < 8; k++) { const lit = night && r() < 0.5; s += `<rect x="${f2(x + 14 + (k % 4) * (w - 28) / 4)}" y="${f2(760 - h + 30 + Math.floor(k / 4) * 90)}" width="${f2((w - 28) / 4 - 14)}" height="40" fill="${lit ? '#ffd27a' : dark}" opacity="${lit ? 0.95 : 0.6}"/>`; }
    }
    x += w + 8 + r() * 30;
  }
  // clock tower landmark
  s += `<g transform="translate(${towerX} 760)"><rect x="-60" y="-860" width="120" height="860" fill="${night ? '#4a2430' : '#b07a5a'}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-900" r="96" fill="${night ? '#ffe7a0' : '#f4ead4'}" stroke="${INK}" stroke-width="6"/><path d="M 0 -900 L 0 -960 M 0 -900 L 40 -880" stroke="${INK}" stroke-width="7"/><path d="M -130 -990 L 0 -1130 L 130 -990 Z" fill="#3c4a6a" stroke="${INK}" stroke-width="5"/></g>`;
  return s;
}
function wiresSide(x0, x1, base, step = 560, t = 0) {
  let s = '';
  for (let x = x0; x < x1; x += step) for (const dy of [0, 24, 46]) s += `<path d="M ${x} ${base - 420 + dy} Q ${x + step / 2} ${base - 380 + dy + Math.sin(t * 0.7 + x) * 3} ${x + step} ${base - 420 + dy}" stroke="#2a2630" stroke-width="2.6" fill="none" opacity="0.85"/>`;
  return s;
}
function carSide(x, y, col, o = {}) {
  const k = o.s || 1, dir = o.dir || 1, wr = o.wheel || 0;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k * dir)} ${f2(k)})"><ellipse cx="0" cy="4" rx="190" ry="16" fill="#1b1424" opacity="0.28"/>
   <path d="M -180 -24 L -180 -76 Q -176 -96 -150 -100 L -100 -104 L -60 -160 Q -50 -170 -30 -170 L 80 -170 Q 104 -170 118 -150 L 150 -104 L 170 -100 Q 186 -96 186 -76 L 186 -24 Q 186 -6 170 -6 L -166 -6 Q -180 -6 -180 -24 Z" fill="${col}" stroke="${INK}" stroke-width="6"/>
   <path d="M -88 -108 L -54 -154 L 0 -154 L 0 -108 Z M 14 -108 L 14 -154 L 82 -154 Q 98 -154 106 -142 L 130 -108 Z" fill="${o.night ? '#2a3050' : '#9cc4d8'}" stroke="${INK}" stroke-width="5"/>
   <path d="M -176 -64 L 182 -64" stroke="${shade(col, 0.3)}" stroke-width="5"/><rect x="170" y="-90" width="18" height="18" rx="4" fill="#fff4c8" stroke="${INK}" stroke-width="3"/><rect x="-184" y="-90" width="14" height="18" rx="3" fill="#c83a2a" stroke="${INK}" stroke-width="3"/>
   ${[-110, 112].map(wx => `<g transform="translate(${wx} -10)"><circle r="40" fill="#1e1a22" stroke="${INK}" stroke-width="5"/><circle r="20" fill="#b6b3ad"/><g transform="rotate(${f2(wr)})"><path d="M -16 0 H 16 M 0 -16 V 16" stroke="${INK}" stroke-width="5"/></g></g>`).join('')}</g>`;
}
function bancaSide(x, base) { return `<g><rect x="${x - 110}" y="${base - 200}" width="220" height="200" fill="#3c6aa8" stroke="${INK}" stroke-width="4"/><path d="M ${x - 130} ${base - 200} L ${x + 130} ${base - 200} L ${x + 110} ${base - 236} L ${x - 110} ${base - 236} Z" fill="#c8443c" stroke="${INK}" stroke-width="4"/><text x="${x}" y="${base - 210}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="24" fill="#fff">BANCA</text>${Array.from({ length: 6 }, (_, i) => `<rect x="${x - 96 + (i % 3) * 66}" y="${base - 186 + Math.floor(i / 3) * 70}" width="54" height="60" fill="${['#f2c230', '#e86a6a', '#f4f0e4', '#5ab0d8', '#ee8aaa', '#e07a3a'][i]}" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g>`; }
function orelhao(x, base) { return `<g><path d="M ${x} ${base} V ${base - 150}" stroke="#4a4458" stroke-width="10"/><path d="M ${x - 70} ${base - 140} Q ${x - 76} ${base - 270} ${x} ${base - 276} Q ${x + 76} ${base - 270} ${x + 70} ${base - 140} Z" fill="#f2a43a" stroke="${INK}" stroke-width="4"/><rect x="${x - 22}" y="${base - 230}" width="44" height="60" rx="6" fill="#4a4458"/></g>`; }
function lixeira(x, base) { return `<g><rect x="${x - 26}" y="${base - 90}" width="52" height="90" rx="8" fill="#e07a3a" stroke="${INK}" stroke-width="4"/><path d="M ${x} ${base - 90} V ${base - 130}" stroke="#4a4458" stroke-width="6"/></g>`; }
function streetSign(x, base, txt) { return `<g><path d="M ${x} ${base} V ${base - 330}" stroke="#4a4458" stroke-width="9"/><rect x="${x - 10}" y="${base - 350}" width="230" height="46" rx="6" fill="#3c6aa8" stroke="${INK}" stroke-width="4"/><text x="${x + 105}" y="${base - 318}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="24" fill="#fff">${txt}</text></g>`; }

function sideStreet(T, t, o = {}) {
  const night = o.night || 0, closed = o.closed || 0, base = 900;
  const L = [];
  L.push(Lr(0.12, hillsSkyline(t, night) + haze(night ? '#2e3264' : '#e4ecee', 380, 760, 0.6)));
  L.push(Lr(0.3, rooftops(t, night, o.towerX != null ? o.towerX : 1300) + haze(night ? '#2e3264' : '#e4ecee', 300, 800, 0.45)));
  L.push(Lr(0.6, cityRow(T, { base: 820, seed: (o.seed || 5) + 40, shops: 0.2, night, closed, noTrees: true }) + haze(night ? '#2e3264' : '#e8eef0', 200, 900, 0.32)));
  let main = (o.main ? o.main(T) : cityRow(T, { seed: o.seed || 5, night, closed, signs: o.signs, bunting: !night && !closed, shops: 0.75 }));
  main += wiresSide(-1400 + 260, 3400, base + 40, 560, t);
  if (!closed) main += carSide(-200, base + 130, '#3c6aa8', { s: 0.75, night }) + carSide(1500, base + 130, '#e8e4dc', { s: 0.75, night }) + carSide(2650, base + 130, '#c8443c', { s: 0.75, night });
  main += bancaSide(2000, base + 40) + orelhao(1180, base + 40) + lixeira(1420, base + 40) + streetSign(-560, base + 40, o.streetName || 'R. DO RELÓGIO');
  if (o.movingCar != null) main += carSide(o.movingCar, base + 260, '#f2c230', { s: 0.8, dir: 1, wheel: T * 600, night });
  if (!closed) { const rn = rng((o.seed || 5) + 77); for (let i = 0; i < 9; i++) { const x = -1200 + i * 520 + rn() * 200; if (o.avoidX != null && Math.abs(x - o.avoidX) < 480) continue; main += person(NPC_IDS[(i * 7 + 3) % 24], { x, y: base + 34, s: 0.5, t, face: rn() < 0.5 ? -0.7 : 0.7, expr: 'happy', mouth: Math.max(0, Math.sin(t * 8 + i)) * 0.4, armR: 20 + Math.sin(t * 2 + i) * 15, bendR: 40 }); } main += walkers(T, base + 44, 0.5, (o.seed || 5) + 3, 6, 4200); }
  main += (o.extra || '');
  L.push(Lr(1, main));
  // foreground: blurred pole, car roof, plant
  const fg = `<g filter="url(#fgBlur)"><path d="M ${o.fgX || 120} 1600 V -400" stroke="#2a2630" stroke-width="70"/><rect x="${(o.fgX || 120) - 60}" y="460" width="120" height="70" rx="12" fill="#3a3440"/>` +
    carSide(1500, 1520, '#5a8ac8', { s: 1.9, night }) + `<g transform="translate(2300 1420) scale(2.2)">${pot(0, 0, 1, t)}</g></g>`;
  L.push(Lr(1.45, fg));
  return L;
}

function backBlock(c, b, night, closed, sky, Dmax) {
  const g = b.g, Xa = g * b.X0, Xb = g * b.X1, D0 = b.D, D1 = b.D + b.len, H = b.H, k = P3(c, Xa, 0, D0).k;
  const wall = hazeC(night ? mix(b.wall, '#262848', 0.55) : b.wall, D0, Dmax, sky, 0.7);
  let s = '';
  s += Q3(P3(c, Xa, 0, D0), P3(c, Xb, 0, D0), P3(c, Xb, H, D0), P3(c, Xa, H, D0), shade(wall, 0.15), sw3(k, 3));
  s += Q3(P3(c, Xa, 0, D0), P3(c, Xa, 0, D1), P3(c, Xa, H, D1), P3(c, Xa, H, D0), wall, sw3(k, 3));
  s += Q3(P3(c, Xa, H, D0), P3(c, Xb, H, D0), P3(c, Xb, H, D1), P3(c, Xa, H, D1), hazeC(night ? '#3a3448' : b.roof, D0, Dmax, sky, 0.7), sw3(k, 3));
  const rr = rng(b.seed), fl = Math.round(H / 150), nw = Math.max(1, Math.floor(b.len / 200));
  for (let f = 0; f < fl; f++) for (let i = 0; i < nw; i++) { const d0 = D0 + (b.len / nw) * i + 40, d1 = d0 + b.len / nw - 80, y0 = f * 150 + 40; const lit = night && !closed && rr() < 0.5; s += Q3(P3(c, Xa, y0, d0), P3(c, Xa, y0, d1), P3(c, Xa, y0 + 80, d1), P3(c, Xa, y0 + 80, d0), lit ? '#ffd27a' : hazeC(night ? '#2a3050' : '#8aa4b8', d0, Dmax, sky, 0.6), ''); }
  if (b.tank) { const tx = Xa + g * 200, td = D0 + b.len * 0.4; s += box3D(c, tx - 60, tx + 60, td - 60, td + 60, H, H + 120, hazeC('#5a8ac8', D0, Dmax, sky, 0.6), k); }
  return s;
}
