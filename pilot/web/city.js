// City kit v2 — a bigger town: varied buildings (shops, sobrados, apartment blocks), a background row and skyline with
// the clock-tower landmark, a one-point-perspective street, an aerial view, and night lighting (lamp cones/pools, lit windows).
// World units are the same as environments.js (ground ≈ y 900 for side views).
const SHOPS = ['PADARIA', 'MERCADO', 'BARBEARIA', 'CORREIO', 'SAPATARIA', 'BAZAR', 'LIVRARIA', 'FLORES', 'RELÓGIOS', 'ARMARINHO'];
const WALLS = ['#f2d27a', '#9fc3d8', '#e8a8b8', '#a8d4e8', '#e8c9a0', '#d8c4e8', '#f0b890', '#c8d8b0', '#e0d0b0'];
const ROOFS = ['#d0704a', '#a85a3a', '#8a5a3a', '#5a6a8a', '#7a4a5a'];

// ---------- lighting ----------
function lampLight(x, groundY, k = 1, op = 1) {
  // warm cone from the lantern + pool on the ground (screen blend so it brightens the night)
  const top = groundY - 440 * k;
  return `<g style="mix-blend-mode:screen" opacity="${f2(op)}">` +
    `<path d="M ${f2(x - 26 * k)} ${f2(top + 20 * k)} L ${f2(x + 26 * k)} ${f2(top + 20 * k)} L ${f2(x + 170 * k)} ${f2(groundY)} L ${f2(x - 170 * k)} ${f2(groundY)} Z" fill="url(#gCone)" opacity="0.55"/>` +
    `<ellipse cx="${f2(x)}" cy="${f2(groundY + 6)}" rx="${f2(200 * k)}" ry="${f2(42 * k)}" fill="url(#gPool)"/>` +
    `<circle cx="${f2(x)}" cy="${f2(top)}" r="${f2(70 * k)}" fill="url(#gPool)"/></g>`;
}
const LIGHT_DEFS = `<radialGradient id="gPool"><stop offset="0" stop-color="#ffd890" stop-opacity="0.75"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="gCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0a0" stop-opacity="0.8"/><stop offset="1" stop-color="#ffe0a0" stop-opacity="0.05"/></linearGradient>` +
  `<radialGradient id="gWin"><stop offset="0" stop-color="#ffe2a0" stop-opacity="0.6"/><stop offset="1" stop-color="#ffe2a0" stop-opacity="0"/></radialGradient>`;

// ---------- building ----------
function bldg(x, base, w, floors, o = {}) {
  const r = rng(o.seed || (x | 0) + 3);
  const fh = 150, gh = o.shop ? 190 : fh, H = gh + (floors - 1) * fh;
  const wall = o.wall || WALLS[Math.floor(r() * WALLS.length)], roof = o.roof || ROOFS[Math.floor(r() * ROOFS.length)];
  const night = o.night || 0, closed = o.closed || 0;
  let s = `<rect x="${x}" y="${base - H}" width="${w}" height="${H + 40}" fill="${wall}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${x}" y="${base - H}" width="${w}" height="${H + 40}" fill="url(#${o.brick ? 'pBrick' : 'pPlaster'})"/>`;
  s += `<rect x="${x}" y="${base - H}" width="${w}" height="${H + 40}" fill="url(#gWallShade)"/>`;
  s += `<rect x="${x}" y="${base - 70}" width="${w}" height="70" fill="url(#gAO)"/>`;
  // floor lines / cornices
  for (let f = 1; f < floors; f++) s += `<rect x="${x - 6}" y="${base - gh - (f - 1) * fh - 8}" width="${w + 12}" height="10" fill="${shade(wall, 0.18)}" stroke="${INK}" stroke-width="2.5"/>`;
  // roof
  if (o.gable) s += `<path d="M ${x - 22} ${base - H + 4} L ${x + w / 2} ${base - H - 110} L ${x + w + 22} ${base - H + 4} Z" fill="${roof}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M ${x - 22} ${base - H + 4} L ${x + w / 2} ${base - H - 110} L ${x + w + 22} ${base - H + 4} Z" fill="url(#pTile)"/>`;
  else s += `<rect x="${x - 14}" y="${base - H - 26}" width="${w + 28}" height="30" fill="${roof}" stroke="${INK}" stroke-width="4"/><rect x="${x + w * 0.15}" y="${base - H - 60}" width="${w * 0.2}" height="36" fill="${shade(wall, 0.25)}" stroke="${INK}" stroke-width="3"/>`;
  // upper windows
  const nw = Math.max(1, Math.round(w / 140));
  for (let f = 1; f < floors; f++) {
    const wy = base - gh - f * fh + 30;
    for (let i = 0; i < nw; i++) {
      const wx = x + (w / nw) * (i + 0.5) - 34, lit = night > 0 && r() < 0.55 && !closed;
      s += `<rect x="${f2(wx - 6)}" y="${wy - 6}" width="80" height="102" rx="4" fill="#f4ead4" stroke="${INK}" stroke-width="3"/>`;
      s += `<rect x="${f2(wx)}" y="${wy}" width="68" height="90" fill="${lit ? '#ffd27a' : mix('#7a9ab0', '#2a3050', night)}" stroke="${INK}" stroke-width="3"/>`;
      if (lit) s += `<circle cx="${f2(wx + 34)}" cy="${wy + 45}" r="90" fill="url(#gWin)" style="mix-blend-mode:screen"/>`;
      s += `<path d="M ${f2(wx + 34)} ${wy} V ${wy + 90} M ${f2(wx)} ${wy + 45} H ${f2(wx + 68)}" stroke="${INK}" stroke-width="2.5"/>`;
      if (closed > 0.5 || (r() < 0.3 && !lit)) { s += `<rect x="${f2(wx - 4)}" y="${wy - 4}" width="76" height="98" fill="${shade(roof, 0.1)}" stroke="${INK}" stroke-width="3"/>`; for (let k = 1; k < 7; k++) s += `<path d="M ${f2(wx)} ${wy - 4 + k * 14} h 68" stroke="${INK}" stroke-width="1.8" opacity="0.5"/>`; }
      if (o.balcony && f === 1) s += `<rect x="${f2(wx - 14)}" y="${wy + 86}" width="96" height="10" fill="#4a4a5a" stroke="${INK}" stroke-width="2.5"/>` + Array.from({ length: 6 }, (_, k) => `<path d="M ${f2(wx - 10 + k * 18)} ${wy + 86} v -30" stroke="#4a4a5a" stroke-width="3"/>`).join('') + `<path d="M ${f2(wx - 14)} ${wy + 56} h 96" stroke="#4a4a5a" stroke-width="4"/>`;
      if (r() < 0.25 && !closed) s += `<rect x="${f2(wx - 10)}" y="${wy + 92}" width="88" height="14" rx="3" fill="#a44e2c" stroke="${INK}" stroke-width="2"/><circle cx="${f2(wx + 10)}" cy="${wy + 90}" r="8" fill="#e88aa0"/><circle cx="${f2(wx + 40)}" cy="${wy + 88}" r="8" fill="#f2c94c"/><circle cx="${f2(wx + 64)}" cy="${wy + 90}" r="8" fill="#e86a4a"/>`;
    }
  }
  // ground floor
  if (o.shop) {
    const awn = o.awning || ['#c8443c', '#3c6a9a', '#7a4a8a', '#d0704a', '#3c8a86'][Math.floor(r() * 5)];
    const sw = w - 40, sx = x + 20, sy = base - 170;
    s += `<rect x="${sx}" y="${sy}" width="${sw * 0.62}" height="130" fill="${closed ? '#5a5260' : (night ? '#ffd890' : '#cfe0e6')}" stroke="${INK}" stroke-width="4"/>`;
    if (!closed) for (let k = 0; k < 4; k++) s += `<rect x="${f2(sx + 14 + k * sw * 0.14)}" y="${sy + 70}" width="${f2(sw * 0.1)}" height="50" rx="6" fill="${['#e86a4a', '#f2c230', '#5ab0d8', '#e88aa0'][(k + (x | 0)) % 4]}" stroke="${INK}" stroke-width="2.5"/>`;
    if (closed) for (let k = 1; k < 9; k++) s += `<path d="M ${sx} ${sy + k * 14} h ${f2(sw * 0.62)}" stroke="${INK}" stroke-width="2" opacity="0.6"/>`;
    s += door(sx + sw * 0.68, base, sw * 0.28, 150, { color: shade(awn, 0.2), glass: true });
    for (let k = 0; k < 8; k++) s += `<path d="M ${f2(x + 6 + k * (w - 12) / 8)} ${base - 196} h ${f2((w - 12) / 8)} v 34 q ${f2(-(w - 12) / 16)} 14 ${f2(-(w - 12) / 8)} 0 Z" fill="${k % 2 ? '#fff4dc' : awn}" stroke="${INK}" stroke-width="2.5"/>`;
    const sign = o.sign || SHOPS[Math.floor(r() * SHOPS.length)];
    s += `<rect x="${x + w * 0.12}" y="${base - gh - 4}" width="${w * 0.76}" height="44" rx="8" fill="${night ? '#2a2a40' : '#3c4a5a'}" stroke="${INK}" stroke-width="3.5"/><text x="${x + w / 2}" y="${base - gh + 28}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${Math.min(30, w * 0.76 / (sign.length * 0.62))}" fill="${night && !closed ? '#ffe7a0' : '#f4e6c8'}" letter-spacing="2">${sign}</text>`;
  } else {
    const wy = base - fh + 30;
    s += door(x + w / 2 - 50, base, 100, 150, { color: shade(wall, 0.4) });
    if (w > 220) for (const k of [-1, 1]) { const wx = x + w / 2 + k * (w * 0.32) - 34; s += `<rect x="${f2(wx)}" y="${wy}" width="68" height="80" fill="${night && !closed && r() < 0.5 ? '#ffd27a' : '#7a9ab0'}" stroke="${INK}" stroke-width="3"/>`; }
  }
  return s;
}

// a full side-view city block row
function cityRow(t, o = {}) {
  const base = o.base || 900, r = rng(o.seed || 5);
  let x = o.x0 != null ? o.x0 : -1400, s = '';
  const x1 = o.x1 != null ? o.x1 : 3400;
  let i = 0;
  while (x < x1) {
    const kind = r(), w = kind < 0.4 ? 300 + r() * 120 : 240 + r() * 120;
    const floors = kind < 0.35 ? 2 : kind < 0.75 ? 3 : 4;
    s += bldg(x, base, w, floors, { seed: (o.seed || 5) * 97 + i, shop: r() < (o.shops == null ? 0.6 : o.shops), sign: o.signs ? o.signs[i % o.signs.length] : null, gable: r() < 0.35 && floors < 4, balcony: r() < 0.4, night: o.night, closed: o.closed, brick: r() < 0.2 });
    x += w + (r() < 0.25 ? 50 : 6); i++;
  }
  s += street(base, { walk: o.night ? '#a8a0a8' : '#e6d6b8', road: o.night ? '#5a5866' : '#9a96a0' });
  // street furniture
  for (let lx = (o.x0 != null ? o.x0 : -1400) + 260; lx < x1; lx += 560) s += lamp(lx, base + 40, 1.0, o.night ? 1 : 0) + (o.night ? lampLight(lx, base + 40, 1.0) : '');
  for (let tx = (o.x0 != null ? o.x0 : -1400) + 520; tx < x1; tx += 1120) if (!o.noTrees) s += tree(tx, base + 40, 0.6, t, o.night ? '#3a5a4a' : '#7ab06a');
  if (o.bunting && !o.closed) for (let bx = -1200; bx < x1; bx += 700) { s += `<path d="M ${bx} ${base - 420} Q ${bx + 350} ${base - 360} ${bx + 700} ${base - 420}" stroke="${INK}" stroke-width="2" fill="none"/>`; for (let k = 0; k < 9; k++) { const u = (k + 0.5) / 9, px = bx + 700 * u, py = base - 420 + 4 * 60 * u * (1 - u); s += `<path d="M ${f2(px - 12)} ${f2(py)} L ${f2(px + 12)} ${f2(py)} L ${f2(px)} ${f2(py + 24)} Z" fill="${['#e86a6a', '#f2c230', '#5ab0d8', '#ee8aaa'][k % 4]}" stroke="${INK}" stroke-width="2"/>`; } }
  if (o.closed) s += leaves(-1200, x1, base + 36, 11, 90);
  return s;
}
// background: a second row of taller buildings + skyline with the clock tower as landmark
function cityBack(t, o = {}) {
  const r = rng(o.seed || 41), night = o.night || 0;
  let s = '', x = -1600;
  const c1 = mix('#e0b48a', '#2a2a4a', night), c2 = mix('#c89a6a', '#22223e', night);
  while (x < 3600) { const w = 160 + r() * 200, h = 300 + r() * 420; s += `<rect x="${f2(x)}" y="${f2(760 - h)}" width="${f2(w)}" height="${f2(h + 300)}" fill="${c1}"/>`; for (let k = 0; k < 10; k++) if (r() < (night ? 0.5 : 0.25)) s += `<rect x="${f2(x + 14 + r() * (w - 40))}" y="${f2(760 - h + 20 + r() * (h - 60))}" width="16" height="20" fill="${night ? '#ffd27a' : '#f4ead4'}" opacity="${night ? 0.9 : 0.5}"/>`; x += w + 10 + r() * 30; }
  const tx = o.towerX != null ? o.towerX : 1400;
  s += `<g fill="${c2}"><rect x="${tx - 40}" y="300" width="80" height="460"/><circle cx="${tx}" cy="290" r="70"/><path d="M ${tx - 90} 240 L ${tx} 150 L ${tx + 90} 240 Z"/></g><circle cx="${tx}" cy="290" r="52" fill="${night ? '#ffe7a0' : '#f4ead4'}" opacity="${night ? 0.85 : 0.6}"/>`;
  return s + haze(mix('#f8e6c4', '#3a3a6a', night), 350, 900, 0.45);
}

// ---------- one-point perspective street ----------
const PV = { x: 960, y: 560, camH: 640 };
function proj(X, Y, D) { const z = 1 + D / 500; return { x: PV.x + X / z, y: PV.y + (PV.camH - Y) / z, k: 1 / z }; }
function quad(a, b, c, d, fill, extra = '') { return `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(b.x)} ${f2(b.y)} L ${f2(c.x)} ${f2(c.y)} L ${f2(d.x)} ${f2(d.y)} Z" fill="${fill}" ${extra}/>`; }
function perspStreet(t, o = {}) {
  PV.camH = o.camH || 640; PV.y = o.vpY || 560;
  const night = o.night || 0, closed = o.closed || 0, r = rng(o.seed || 9);
  const Dmax = 9000, W = 560, R = 420;
  let s = `<rect x="-1400" y="${PV.y}" width="4720" height="1600" fill="${night ? '#4a4856' : '#a8a4ac'}"/>`;
  // road + sidewalks
  s += quad(proj(-R, 0, 0), proj(R, 0, 0), proj(R, 0, Dmax), proj(-R, 0, Dmax), night ? '#3e3c48' : '#8a8690');
  for (const sgn of [-1, 1]) {
    s += quad(proj(sgn * R, 0, 0), proj(sgn * W, 0, 0), proj(sgn * W, 0, Dmax), proj(sgn * R, 0, Dmax), night ? '#7a7480' : '#d6c8ac');
    s += quad(proj(sgn * R, 0, 0), proj(sgn * (R + 14), 0, 0), proj(sgn * (R + 14), 0, Dmax), proj(sgn * R, 0, Dmax), '#6a6470');
  }
  for (let D = 0; D < Dmax; D += 320) s += quad(proj(-8, 0, D), proj(8, 0, D), proj(8, 0, D + 160), proj(-8, 0, D + 160), '#f4efe0', 'opacity="0.75"');
  // buildings on both sides, far to near
  const segs = [];
  for (const sgn of [-1, 1]) { let D = 120; let i = 0; while (D < Dmax) { const len = 380 + r() * 420, H = 300 + Math.floor(r() * 3) * 150; segs.push({ sgn, D, len, H, wall: WALLS[Math.floor(r() * WALLS.length)], shop: r() < 0.55, sign: SHOPS[(i + (sgn > 0 ? 3 : 0)) % SHOPS.length], seed: i }); D += len + (r() < 0.2 ? 120 : 0); i++; } }
  segs.sort((a, b) => b.D - a.D);
  // landmark tower at the end of the street
  if (o.tower !== false) { const p = proj(0, 0, Dmax + 1500), k = p.k; s += `<g transform="translate(${f2(p.x)} ${f2(p.y)}) scale(${f2(k * 1.8)})"><rect x="-60" y="-900" width="120" height="900" fill="${night ? '#5a2a2a' : '#a85a3a'}" stroke="${INK}" stroke-width="10"/><circle cx="0" cy="-960" r="110" fill="#f4ead4" stroke="${INK}" stroke-width="12"/><path d="M 0 -960 L 0 -1040 M 0 -960 L 50 -940" stroke="${INK}" stroke-width="12"/><path d="M -150 -1060 L 0 -1220 L 150 -1060 Z" fill="#3c6a5a" stroke="${INK}" stroke-width="10"/></g>`; }
  for (const b of segs) {
    const X = b.sgn * W, a0 = proj(X, 0, b.D), a1 = proj(X, 0, b.D + b.len), t1 = proj(X, b.H, b.D + b.len), t0 = proj(X, b.H, b.D);
    const lit = night;
    s += quad(a0, a1, t1, t0, mix(b.wall, '#2a2a46', night * 0.55), `stroke="${INK}" stroke-width="${f2(4 * a0.k + 1)}"`);
    // roof edge / cornice
    const c0 = proj(X + b.sgn * 0, b.H + 20, b.D), c1 = proj(X, b.H + 20, b.D + b.len);
    s += quad(t0, t1, c1, c0, shade(b.wall, 0.3), `stroke="${INK}" stroke-width="${f2(3 * a0.k + 1)}"`);
    // front edge (the end face, visible because it faces the camera)
    const e0 = proj(X + b.sgn * 220, 0, b.D), e1 = proj(X + b.sgn * 220, b.H, b.D);
    s += quad(a0, e0, e1, t0, shade(mix(b.wall, '#2a2a46', night * 0.55), 0.12), `stroke="${INK}" stroke-width="${f2(4 * a0.k + 1)}"`);
    // windows per floor
    const floors = Math.round(b.H / 150), nwin = Math.max(1, Math.floor(b.len / 170));
    for (let f = (b.shop ? 1 : 0); f < floors; f++) for (let i = 0; i < nwin; i++) {
      const d0 = b.D + (b.len / nwin) * i + 40, d1 = d0 + (b.len / nwin) - 80, y0 = f * 150 + 40, y1 = y0 + 80;
      const isLit = lit && rng(b.seed * 31 + f * 7 + i + (b.sgn > 0 ? 500 : 0))() < 0.55 && !closed;
      s += quad(proj(X, y0, d0), proj(X, y0, d1), proj(X, y1, d1), proj(X, y1, d0), closed ? shade(b.wall, 0.35) : (isLit ? '#ffd27a' : mix('#7a9ab0', '#2a3050', night)), `stroke="${INK}" stroke-width="${f2(2.5 * proj(X, 0, d0).k + 0.5)}"`);
    }
    if (b.shop) {
      const d0 = b.D + 30, d1 = b.D + b.len - 30;
      s += quad(proj(X, 20, d0), proj(X, 20, d1), proj(X, 120, d1), proj(X, 120, d0), closed ? '#5a5260' : (night ? '#ffd890' : '#cfe0e6'), `stroke="${INK}" stroke-width="${f2(3 * proj(X, 0, d0).k + 0.5)}"`);
      s += quad(proj(X, 130, d0), proj(X, 130, d1), proj(X - b.sgn * 90, 110, d1), proj(X - b.sgn * 90, 110, d0), b.sgn < 0 ? '#c8443c' : '#3c6a9a', `stroke="${INK}" stroke-width="${f2(3 * proj(X, 0, d0).k + 0.5)}"`);
    }
  }
  // lamps along both sidewalks (far to near), with light pools at night
  for (let D = Dmax - 300; D >= 200; D -= 700) for (const sgn of [-1, 1]) {
    const base = proj(sgn * 470, 0, D), top = proj(sgn * 470, 420, D), k = base.k;
    if (night) s += `<g style="mix-blend-mode:screen"><ellipse cx="${f2(base.x)}" cy="${f2(base.y)}" rx="${f2(260 * k)}" ry="${f2(60 * k)}" fill="url(#gPool)"/><circle cx="${f2(top.x)}" cy="${f2(top.y)}" r="${f2(90 * k)}" fill="url(#gPool)"/></g>`;
    s += `<path d="M ${f2(base.x)} ${f2(base.y)} L ${f2(top.x)} ${f2(top.y)}" stroke="#2f2a3a" stroke-width="${f2(16 * k + 1)}"/><rect x="${f2(top.x - 22 * k)}" y="${f2(top.y - 50 * k)}" width="${f2(44 * k)}" height="${f2(50 * k)}" fill="${night ? '#ffe0a0' : '#e9d8a8'}" stroke="${INK}" stroke-width="${f2(3 * k + 0.5)}"/>`;
  }
  if (closed) for (let i = 0; i < 40; i++) { const D = r() * 4000, X = (r() - 0.5) * 800, p = proj(X, 0, D); s += `<path transform="translate(${f2(p.x)} ${f2(p.y)}) rotate(${f2(r() * 360)}) scale(${f2(p.k * 2)})" d="M -10 0 Q 0 -8 10 0 Q 0 8 -10 0 Z" fill="${['#d0704a', '#e0a83a', '#a85a3a'][i % 3]}" stroke="${INK}" stroke-width="2"/>`; }
  return s;
}
// place a character on the perspective street: lateral X, depth D, base scale (at D=0)
function onStreet(id, X, D, s0, o = {}) { const p = proj(X, 0, D); return person(id, Object.assign({ x: p.x, y: p.y, s: s0 * p.k }, o)); }

// ---------- aerial view of the town ----------
function cityAerial(t, o = {}) {
  const night = o.night || 0, closed = o.closed || 0, r = rng(o.seed || 23);
  const P2 = (X, Y, D) => { const z = 1 + D / 900; return { x: 960 + X / z, y: 250 + (2200 - Y) / z * 0.32 + D * 0.03, k: 1 / z }; };
  let s = `<rect x="-1400" y="-800" width="4720" height="3200" fill="${night ? '#2c2a3a' : '#c8b898'}"/>`;
  const boxes = [];
  for (let bz = -1; bz < 8; bz++) for (let bx = -6; bx <= 6; bx++) {
    if (bz === 3 && Math.abs(bx) <= 1) continue; // plaza
    const X0 = bx * 520, D0 = bz * 700;
    for (let k = 0; k < 3; k++) { const w = 120 + r() * 120, d = 140 + r() * 160, h = 120 + Math.floor(r() * 4) * 90; boxes.push({ X: X0 - 180 + k * 150 + r() * 20, D: D0 + r() * 300, w, d, h, wall: WALLS[Math.floor(r() * WALLS.length)], roof: ROOFS[Math.floor(r() * ROOFS.length)] }); }
  }
  boxes.sort((a, b) => b.D - a.D);
  // streets (lighter bands) and plaza
  for (let bz = -1; bz <= 8; bz++) { const a = P2(-4000, 0, bz * 700 - 60), b = P2(4000, 0, bz * 700 - 60), c = P2(4000, 0, bz * 700 + 20), d = P2(-4000, 0, bz * 700 + 20); s += quad(a, b, c, d, night ? '#45424e' : '#9a96a0'); }
  for (let bx = -7; bx <= 7; bx++) { const X = bx * 520 + 260; s += quad(P2(X - 40, 0, -800), P2(X + 40, 0, -800), P2(X + 40, 0, 6000), P2(X - 40, 0, 6000), night ? '#45424e' : '#9a96a0'); }
  s += quad(P2(-700, 0, 2050), P2(700, 0, 2050), P2(700, 0, 2750), P2(-700, 0, 2750), night ? '#5a5462' : '#d6c39a');
  const tower = () => { const p = P2(0, 0, 2400), k = p.k; return `<g transform="translate(${f2(p.x)} ${f2(p.y)}) scale(${f2(k * 0.9)})"><rect x="-50" y="-700" width="100" height="700" fill="#a85a3a" stroke="${INK}" stroke-width="8"/><circle cx="0" cy="-740" r="90" fill="${night ? '#ffe7a0' : '#f4ead4'}" stroke="${INK}" stroke-width="10"/><path d="M -130 -820 L 0 -960 L 130 -820 Z" fill="#3c6a5a" stroke="${INK}" stroke-width="8"/></g>`; };
  let towerDrawn = false;
  for (const b of boxes) {
    if (!towerDrawn && b.D < 2400) { s += tower(); towerDrawn = true; }
    const f0 = P2(b.X, 0, b.D), f1 = P2(b.X + b.w, 0, b.D), f2_ = P2(b.X + b.w, b.h, b.D), f3 = P2(b.X, b.h, b.D);
    const g0 = P2(b.X, b.h, b.D + b.d), g1 = P2(b.X + b.w, b.h, b.D + b.d);
    const sideX = b.X + b.w < 0 ? b.X + b.w : b.X; // show the side facing the centre
    const s0 = P2(sideX, 0, b.D), s1 = P2(sideX, 0, b.D + b.d), s2 = P2(sideX, b.h, b.D + b.d), s3 = P2(sideX, b.h, b.D);
    const wl = mix(b.wall, '#24243e', night * 0.6);
    s += quad(s0, s1, s2, s3, shade(wl, 0.25), `stroke="${INK}" stroke-width="2"`);
    s += quad(f0, f1, f2_, f3, wl, `stroke="${INK}" stroke-width="2.5"`);
    s += quad(f3, f2_, g1, g0, mix(b.roof, '#1c1c30', night * 0.5), `stroke="${INK}" stroke-width="2.5"`);
    const rows = Math.max(1, Math.floor(b.h / 90)), cols = Math.max(1, Math.floor(b.w / 60));
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const lit = night && !closed && r() < 0.5; const a = P2(b.X + 15 + j * (b.w - 20) / cols, 25 + i * 90, b.D), c = P2(b.X + 15 + j * (b.w - 20) / cols + 22, 25 + i * 90 + 34, b.D); s += `<rect x="${f2(a.x)}" y="${f2(c.y)}" width="${f2(c.x - a.x)}" height="${f2(a.y - c.y)}" fill="${lit ? '#ffd27a' : mix('#7a9ab0', '#2a3050', night)}"/>`; }
  }
  if (!towerDrawn) s += tower();
  if (night && !closed) for (let i = 0; i < 70; i++) { const p = P2((r() - 0.5) * 7000, 0, r() * 5600); s += `<circle cx="${f2(p.x)}" cy="${f2(p.y)}" r="${f2(30 * p.k + 6)}" fill="url(#gPool)" style="mix-blend-mode:screen"/>`; }
  return s;
}
