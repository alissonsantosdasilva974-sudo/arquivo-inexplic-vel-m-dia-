// Campinho em perspectiva real (projeção P3 do city2.js) com câmera 3D livre: altura, distância, lente e rolagem.
// Convenção: tudo num único Lr(1) com cam = VIEW (zoom 0.625 → 1 unidade = 1 px; x de tela = x - 420).
const VIEW = { ...focus(960, 960, 0.625), r: 0 };
const PS = 0.43;                         // escala de pessoa com k = 1 (1,75 m ≈ 175 unidades)
const FW = 560, GD = 3400, GW = 230, GH = 205;   // meia-largura do campo, linha do gol, gol
// câmera que enquadra um ponto do chão (X, D) com escala k, pés na tela em feetY, altura do olho h
function camOn(X, D, k, feetY, h = 170, xOff = 0, f = 620, r = 0) {
  return { x: X + xOff, h, f, vy: feetY - h * k, d: D - f * (1 / k - 1), r };
}
const lerpC = (a, b, p) => ({ x: lerp(a.x, b.x, p), h: lerp(a.h, b.h, p), f: lerp(a.f, b.f, p), vy: lerp(a.vy, b.vy, p), d: lerp(a.d, b.d, p), r: lerp(a.r || 0, b.r || 0, p) });
const PP = (c, X, Y, D) => P3(c, X, Y, D - c.d);
const zOK = (c, D) => D - c.d > -c.f * 0.86;
function quadC(c, a, b, cc, d, fill, ex = '') { return Q3(PP(c, ...a), PP(c, ...b), PP(c, ...cc), PP(c, ...d), fill, ex); }
function lineC(c, a, b, w = 9, col = '#fff6e0', op = 0.85) {
  const dn = c.d - c.f * 0.85; if (a[2] < dn && b[2] < dn) return '';
  const cl = p => p[2] >= dn ? p : [p[0], p[1], dn];
  const A = PP(c, ...cl(a)), B = PP(c, ...cl(b));
  return `<path d="M ${f2(A.x)} ${f2(A.y)} L ${f2(B.x)} ${f2(B.y)}" stroke="${col}" stroke-width="${f2(Math.max(1.5, w * Math.min(A.k, B.k) * 1.4))}" stroke-linecap="round" opacity="${op}"/>`;
}
function ipeP(c, X, D, t, col, sz = 1) { if (!zOK(c, D)) return ''; const p = PP(c, X, 0, D); return `<g transform="translate(${f2(p.x)} ${f2(p.y)}) scale(${f2(p.k * 1.1 * sz)})">${tree(0, 0, 1, t, col)}</g>`; }
function skyP(c, night = 0) {
  const top = mix('#e07a5a', '#2e3466', night), bot = mix('#fcd8a0', '#8a7aa8', night), hz = c.vy;
  return `<linearGradient id="skp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>` +
    `<rect x="-400" y="${f2(Math.min(-200, hz - 1600))}" width="2700" height="${f2(Math.max(400, hz + 2000))}" fill="url(#skp)"/>` +
    `<circle cx="${f2(1500 - c.x * 0.05)}" cy="${f2(hz - 260)}" r="110" fill="#ffe2a8" opacity="${f2(0.9 - night * 0.7)}"/><circle cx="${f2(1500 - c.x * 0.05)}" cy="${f2(hz - 260)}" r="230" fill="#ffe2a8" opacity="0.15"/>`;
}
// pessoa no chão do campo (ou num degrau Y) com escala pela distância
function onP(c, id, X, D, o = {}, Y = 0, mul = 1) { if (!zOK(c, D)) return ''; const p = PP(c, X, Y, D); return person(id, Object.assign({ x: p.x, y: p.y, s: PS * p.k * mul, shadow: Y === 0 }, o)); }
function ballP(c, X, Y, D, rot = 0) { if (!zOK(c, D)) return ''; const g = PP(c, X, 0, D), p = PP(c, X, Y + 11, D); return `<ellipse cx="${f2(g.x)}" cy="${f2(g.y)}" rx="${f2(14 * g.k)}" ry="${f2(4 * g.k)}" fill="#1b1424" opacity="${f2(0.25 / (1 + Y / 120))}"/>` + ball(p.x, p.y, Math.max(2, 13 * p.k), rot); }
// gol 3D com rede que estufa (bulge 0..1 no ponto bx,by)
function goal3D(c, X0, D0, o = {}) {
  const depth = 110, s = [], b = o.bulge || 0;
  const pt = (x, y, d) => PP(c, X0 + x, y, D0 + d);
  let g = '';
  const net = (x, y, d) => { const dx = (x - (o.bx || 0)) / GW, dy = (y - (o.by || 100)) / GH, w = Math.max(0, 1 - dx * dx - dy * dy) * b; return pt(x, y, d + w * 90); };
  // fundo da rede
  for (let i = 0; i <= 12; i++) { const x = -GW + i * GW / 6, A = net(x, 0, depth), B = net(x, GH * 0.75, depth); g += `<path d="M ${f2(A.x)} ${f2(A.y)} L ${f2(B.x)} ${f2(B.y)}" stroke="#fff8ea" stroke-width="${f2(1.6 * A.k + 0.6)}" opacity="0.55"/>`; }
  for (let j = 0; j <= 6; j++) { let d = ''; for (let i = 0; i <= 12; i++) { const P = net(-GW + i * GW / 6, j * GH * 0.75 / 6, depth); d += (i ? ' L ' : 'M ') + f2(P.x) + ' ' + f2(P.y); } g += `<path d="${d}" stroke="#fff8ea" stroke-width="1.6" fill="none" opacity="0.55"/>`; }
  // laterais e teto da rede
  for (const sx of [-1, 1]) for (let j = 0; j <= 4; j++) { const A = pt(sx * GW, GH * j / 4, 0), B = pt(sx * GW, GH * 0.75 * j / 4, depth); g += `<path d="M ${f2(A.x)} ${f2(A.y)} L ${f2(B.x)} ${f2(B.y)}" stroke="#fff8ea" stroke-width="1.5" opacity="0.5"/>`; }
  for (let i = 0; i <= 12; i++) { const x = -GW + i * GW / 6, A = pt(x, GH, 0), B = net(x, GH * 0.75, depth); g += `<path d="M ${f2(A.x)} ${f2(A.y)} L ${f2(B.x)} ${f2(B.y)}" stroke="#fff8ea" stroke-width="1.5" opacity="0.5"/>`; }
  // traves
  const L0 = pt(-GW, 0, 0), L1 = pt(-GW, GH, 0), R1 = pt(GW, GH, 0), R0 = pt(GW, 0, 0), w = Math.max(3, 11 * L0.k);
  const fr = `M ${f2(L0.x)} ${f2(L0.y)} L ${f2(L1.x)} ${f2(L1.y)} L ${f2(R1.x)} ${f2(R1.y)} L ${f2(R0.x)} ${f2(R0.y)}`;
  g += `<path d="${fr}" stroke="${INK}" stroke-width="${f2(w + 6)}" fill="none" stroke-linejoin="round"/><path d="${fr}" stroke="#fbf8f0" stroke-width="${f2(w)}" fill="none" stroke-linejoin="round"/>`;
  return g;
}
// arquibancada lateral (ao longo de D, no lado X negativo) ou frontal (ao longo de X, numa profundidade D)
function stands(c, T, o = {}) {
  let s = ''; const tiers = 3, rows = [];
  for (let i = tiers - 1; i >= 0; i--) {
    if (o.front) {
      const D0 = o.front + i * 120, Y0 = i * 60, Y1 = (i + 1) * 60;
      s += quadC(c, [-1100, Y1, D0], [1100, Y1, D0], [1100, Y1, D0 + 120], [-1100, Y1, D0 + 120], mix('#c8bca8', '#ffffff', 0.1 * i), `stroke="${INK}" stroke-width="2"`);
      s += quadC(c, [-1100, Y0, D0], [1100, Y0, D0], [1100, Y1, D0], [-1100, Y1, D0], '#a89a88', `stroke="${INK}" stroke-width="2"`);
      rows.push({ i, Y: Y1, D: D0 + 50 });
    } else {
      const X0 = -FW - 220 - i * 130, Y0 = i * 60, Y1 = (i + 1) * 60;
      s += quadC(c, [X0, Y1, 0], [X0 - 130, Y1, 0], [X0 - 130, Y1, 4200], [X0, Y1, 4200], mix('#c8bca8', '#ffffff', 0.1 * i));
      s += quadC(c, [X0, Y0, 0], [X0, Y1, 0], [X0, Y1, 4200], [X0, Y0, 4200], '#a89a88', `stroke="${INK}" stroke-width="2"`);
      rows.push({ i, Y: Y1, X: X0 - 60 });
    }
  }
  // torcida (de trás pra frente)
  const n = o.n || 0, r = rng(o.seed || 3), ppl = [];
  for (let k = 0; k < n; k++) {
    const row = rows[k % rows.length], id = NPC_IDS[(k * 7 + 3) % 24], ph = r() * 6, cheer = o.cheer || 0;
    const X = o.front ? -900 + ((k * 397) % 1800) + r() * 60 : row.X, D = o.front ? row.D : 300 + ((k * 733) % 3600);
    const j = cheer * Math.abs(Math.sin(T * (6 + r() * 3) + ph)) * 26;
    const arm = 150 + Math.sin(T * 8 + ph) * 25 * cheer;
    const flag = r() < 0.3 ? `<g transform="translate(0 -40)"><path d="M 0 0 V -110" stroke="${INK}" stroke-width="6"/><path d="M 0 -110 L ${f2(70 + Math.sin(T * 9 + ph) * 8)} -90 L 0 -66 Z" fill="${['#e8503a', '#f2c230', '#5ab0d8', '#ee8aaa'][k % 4]}" stroke="${INK}" stroke-width="4"/></g>` : '';
    ppl.push({ D, s: () => onP(c, id, X, D, { t: T + ph, face: o.front ? (Math.sin(ph) * 0.3) : 0.8, lx: o.lookX != null ? o.lookX : 0, expr: cheer > 0.5 ? (k % 3 ? 'joy' : 'laugh') : (o.expr || 'happy'), armL: cheer > 0.3 ? arm : 10, armR: cheer > 0.3 ? 300 - arm : 10, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: j, holdR: flag, mouth: cheer * 0.6 }, row.Y, 0.95) });
  }
  ppl.sort((a, b) => b.D - a.D); for (const p of ppl) s += p.s();
  return s;
}
function fenceP(c, side = 1) {
  let s = '';
  const X = side * (FW + 260);
  for (let D = 4400; D >= 0; D -= 400) { const a = PP(c, X, 0, D), b = PP(c, X, 320, D); if (!zOK(c, D)) continue; s += `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(b.x)} ${f2(b.y)}" stroke="#4a4458" stroke-width="${f2(Math.max(2, 9 * a.k))}"/>`; }
  s += quadC(c, [X, 0, Math.max(0, c.d - c.f * 0.8)], [X, 320, Math.max(0, c.d - c.f * 0.8)], [X, 320, 4400], [X, 0, 4400], 'url(#pMesh)', 'opacity="0.55"');
  s += lineC(c, [X, 320, Math.max(0, c.d - c.f * 0.8)], [X, 320, 4400], 7, '#4a4458', 1);
  return s;
}
const MESH = `<pattern id="pMesh" patternUnits="userSpaceOnUse" width="26" height="26"><path d="M 0 0 L 26 26 M 26 0 L 0 26" stroke="#5a5468" stroke-width="2"/></pattern>`;
// cena completa: c = câmera, o.actors = [{D, svg: () => ''}]
function pitchScene(T, c, o = {}) {
  const night = o.night || 0;
  let s = MESH + skyP(c, night);
  s += `<g transform="translate(${f2(-c.x * 0.04)} 0)">${farTown(mix('#d89a7a', '#4a4a78', night), c.vy + 6, 5)}</g>`;
  s += `<rect x="-400" y="${f2(c.vy - 200)}" width="2700" height="260" fill="${mix('#f8d0a8', '#6a6a98', night)}" opacity="0.35"/>`;
  // ipês distantes (atrás do gol e da cerca)
  const far = [];
  for (let i = 0; i < 9; i++) far.push({ D: 4500 + (i % 3) * 300, X: -1500 + i * 380 });
  for (let i = 0; i < 6; i++) far.push({ D: 600 + i * 700, X: FW + 520 + (i % 2) * 260 });
  far.sort((a, b) => b.D - a.D);
  for (const tr of far) s += ipeP(c, tr.X, tr.D, T, (tr.X + tr.D) % 3 < 1.5 ? '#ee8aaa' : '#f2c230', 1.3);
  // chão de terra
  const dn = c.d - c.f * 0.85;
  s += quadC(c, [-5000, 0, dn], [5000, 0, dn], [5000, 0, 9000], [-5000, 0, 9000], mix('#d9ab74', '#8a7a8a', night * 0.5));
  s += quadC(c, [-FW - 60, 0, Math.max(dn, -300)], [FW + 60, 0, Math.max(dn, -300)], [FW + 60, 0, GD + 400], [-FW - 60, 0, GD + 400], mix('#e2b47e', '#948494', night * 0.5));
  // marcas de chuteira / manchas
  const r = rng(12); for (let i = 0; i < 70; i++) { const X = (r() - 0.5) * 2 * FW, D = r() * GD; if (D < dn + 50) continue; const p = PP(c, X, 0, D); s += `<ellipse cx="${f2(p.x)}" cy="${f2(p.y)}" rx="${f2(16 * p.k)}" ry="${f2(4 * p.k)}" fill="#a87a4a" opacity="0.3"/>`; }
  // linhas de cal
  s += lineC(c, [-FW, 0, -300], [-FW, 0, GD]) + lineC(c, [FW, 0, -300], [FW, 0, GD]) + lineC(c, [-FW, 0, GD], [FW, 0, GD]) + lineC(c, [-FW, 0, 1700], [FW, 0, 1700]);
  s += lineC(c, [-420, 0, GD], [-420, 0, GD - 480]) + lineC(c, [420, 0, GD], [420, 0, GD - 480]) + lineC(c, [-420, 0, GD - 480], [420, 0, GD - 480]);
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, b = (i + 1) / 36 * Math.PI * 2; s += lineC(c, [Math.cos(a) * 250, 0, 1700 + Math.sin(a) * 250], [Math.cos(b) * 250, 0, 1700 + Math.sin(b) * 250], 8); }
  // itens por profundidade
  const items = (o.actors || []).slice();
  if (o.fence !== false) items.push({ D: 4400, svg: () => fenceP(c, 1) });
  if (o.standsSide) items.push({ D: 4300, svg: () => stands(c, T, Object.assign({ n: 0 }, o.standsSide)) });
  if (o.standsFront) items.push({ D: o.standsFront.front + 300, svg: () => stands(c, T, o.standsFront) });
  if (o.goal !== false) items.push({ D: GD + 60, svg: () => goal3D(c, 0, GD, o.goalO || {}) });
  if (o.bench) items.push({ D: o.bench.D, svg: () => { if (!zOK(c, o.bench.D)) return ''; const p = PP(c, o.bench.X, 0, o.bench.D); return `<g transform="translate(${f2(p.x)} ${f2(p.y)}) scale(${f2(p.k * 0.9)})">${bench(0, 0, 1)}</g>`; } });
  items.sort((a, b) => b.D - a.D);
  for (const it of items) s += it.svg();
  if (o.front) s += o.front;
  return s;
}
const scene3 = (T, c, o, tint, over) => ({ cam: { ...VIEW, r: c.r || 0 }, layers: [{ d: 1, svg: `<g transform="scale(${KK})">${pitchScene(T, c, o)}</g>` }], tint, over });
