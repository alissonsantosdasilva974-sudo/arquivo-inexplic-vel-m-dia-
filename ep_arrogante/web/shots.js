// Ep. "Nesta cidade, quem fica arrogante cresce" — praça com campinho de terra, fim de tarde.
// Padrão do canal (motor ep2 v4). Sem verde: campo de terra, ipês rosa/amarelo, gol branco.
const SHOTS = [];
const G = 900, S0 = 0.62;
const ORANGE = ['#f0a060', 0.12], BLUE = ['#3a4a8a', 0.22], SEPIA = ['#a87a4a', 0.26];
const POLO = (o) => Object.assign({ hat: 'fedora', pocketNote: true, whistle: true }, o);
// altura do Freitas (m) ao longo do episódio
const HGT = T => T < 27.0 ? 1.75 : T < 34.9 ? lerp(1.75, 1.77, E.back(inv(27.0, 27.6, T))) : T < 54.4 ? lerp(1.77, 1.87, E.back(inv(34.9, 35.5, T))) :
  T < 77.6 ? kf(T, [[54.5, 1.87], [54.9, 2.3, E.back], [55.3, 2.7, E.back], [55.8, 3.0, E.back]]) : kf(T, [[77.6, 3.0], [79.4, 2.45], [80.2, 2.0], [82.2, 1.75]]);
const FS = T => S0 * HGT(T) / 1.75;
const talkF = T => talk(T, [[23.3, 25.4], [33.3, 34.4]]);
const talkS = T => talk(T, [[51.5, 52.7], [74.0, 76.3], [88.4, 89.2]]);
const talkP = T => talk(T, [[3.8, 7.3], [63.1, 65.8], [91.4, 92.4]]);
const FR = (T, o) => person('freitas', Object.assign({ t: T, mouth: talkF(T) }, o));
const SA = (T, o) => person(o.semLuva ? 'saciSem' : 'saci', Object.assign({ t: T, mouth: talkS(T) }, o));
const PO = (T, o) => person('polo', POLO(Object.assign({ t: T, mouth: talkP(T) }, o)));

// ---------- cenário: praça com campinho ----------
function pitchBack(t, o = {}) {
  const night = o.night || 0;
  return [
    Lr(0.04, sky(mix('#e8845a', '#3a3a70', night), mix('#fbd8a0', '#8a7aa8', night), { sun: 600, sunX: 1500, sunC: '#ffe2a8', sunR: 110, id: 'p' })),
    Lr(0.1, clouds(t, mix('#f8c0a0', '#8a80b0', night), 0.75, 5, 80)),
    Lr(0.3, farTown('#d8987a', 780, 5) + haze('#f8d0a8', 400, 900, 0.5)),
    Lr(0.6, ipe(-300, 900, 1.1, t, '#ee8aaa') + ipe(500, 900, 0.95, t, '#f2c230') + ipe(1500, 900, 1.15, t, '#ee8aaa') + ipe(2300, 900, 1.0, t, '#f2c230') + fence(700, 900) + lamp(1000, 900, 0.9, 0.3 + night * 0.7) + lamp(2000, 900, 0.9, 0.3 + night * 0.7)),
  ];
}
function pitchGround(o = {}) {
  let s = `<rect x="-1400" y="${G - 20}" width="4720" height="1400" fill="#d9ab74"/><rect x="-1400" y="${G - 20}" width="4720" height="1400" fill="url(#pPlaster)"/>`;
  s += `<path d="M -1400 ${G - 20} H 3300" stroke="#b8885a" stroke-width="6"/>`;
  s += `<ellipse cx="${o.cx || 960}" cy="${G + 140}" rx="560" ry="70" stroke="#fff6e0" stroke-width="10" fill="none" opacity="0.8"/><path d="M -1400 ${G + 60} H 3300" stroke="#fff6e0" stroke-width="9" opacity="0.7"/>`;
  const r = rng(8); for (let i = 0; i < 60; i++) s += `<ellipse cx="${f2(r() * 4000 - 1200)}" cy="${f2(G + r() * 600)}" rx="${f2(6 + r() * 10)}" ry="3" fill="#a87a4a" opacity="0.35"/>`;
  return s;
}
const pitch = (T, t, mid, o = {}) => [...pitchBack(t, o), Lr(1, pitchGround(o) + (o.goal != null ? goalFront(o.goal, G, 520, 300, o.goalK || 1) : '') + (o.bench != null ? bench(o.bench, G + 10, 1.1) : '') + mid), ...(o.front ? [Lr(1.25, o.front)] : [])];
const leavesWind = (T, n = 14, op = 1) => { let s = ''; const r = rng(31); for (let i = 0; i < n; i++) { const sp = 300 + r() * 300, x = ((r() * 2400 + T * sp) % 2600) - 400, y = 200 + r() * 1300 + Math.sin(T * 3 + i) * 40; s += `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(T * 200 + i * 40)})" d="M -14 0 Q 0 -10 14 0 Q 0 10 -14 0 Z" fill="${['#ee8aaa', '#f2c230', '#d0704a'][i % 3]}" stroke="${INK}" stroke-width="2.5" opacity="${op}"/>`; } return s; };
const flashBorder = () => `<path d="M 0 0 H 1080 V 1920 H 0 Z M 40 60 L 1040 46 L 1030 1870 L 50 1880 Z" fill="#f4e4c4" fill-rule="evenodd"/><path d="M 40 60 L 1040 46 L 1030 1870 L 50 1880 Z" fill="none" stroke="#8a6a4a" stroke-width="6"/>`;
const popIcon = (T, t0, svg, x, y, k = 1) => { const p = E.back(clamp((T - t0) / 0.25)); return p <= 0 ? '' : `<g transform="translate(${x} ${y + Math.sin(T * 3) * 6}) scale(${f2(p * k)})">${svg}</g>`; };
function ruleBanner(T, t0) {
  const p = E.back(clamp((T - t0) / 0.3));
  return `<g transform="translate(540 400) scale(${f2(p)}) rotate(-2)"><rect x="-470" y="-120" width="940" height="230" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/>
   <text y="-40" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">NESTA CIDADE,</text>
   <text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="4" paint-order="stroke">QUEM FICA ARROGANTE</text>
   <g transform="translate(0 150) scale(${f2(1 + 0.08 * Math.sin(T * 8))})"><rect x="-190" y="-58" width="380" height="96" rx="20" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">CRESCE</text></g></g>`;
}
function calendar(txt) { return `<rect x="-90" y="-80" width="180" height="170" rx="16" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><rect x="-90" y="-80" width="180" height="50" rx="14" fill="#e8503a" stroke="${INK}" stroke-width="7"/><text y="50" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="70" fill="${INK}">${txt}</text>`; }
function bubble(txt, w = 520, fs = 54, col = '#fffaf0') { return `<path d="M ${-w / 2} -70 H ${w / 2} Q ${w / 2 + 30} -70 ${w / 2 + 30} -40 V 40 Q ${w / 2 + 30} 70 ${w / 2} 70 H 40 L 0 120 L -10 70 H ${-w / 2} Q ${-w / 2 - 30} 70 ${-w / 2 - 30} 40 V -40 Q ${-w / 2 - 30} -70 ${-w / 2} -70 Z" fill="${col}" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${INK}">${txt}</text>`; }
const shake = (T, t0, a = 14) => { const k = clamp(1 - (T - t0) / 0.35); return T < t0 || k <= 0 ? 0 : Math.sin(T * 90) * a * k; };

// ================= v2: campo em perspectiva, câmera variada =================
const IVF = [[23.3, 25.4], [33.3, 34.4]], IVS = [[51.5, 52.7], [74.0, 76.3], [88.4, 89.2]], IVP = [[3.8, 7.3], [15.5, 17.0], [40.4, 41.4], [63.1, 65.8], [91.4, 92.4]];
const act = (D, svg) => ({ D, svg });
const mulF = T => HGT(T) / 1.75;
const F3 = (c, T, X, D, o = {}, mul) => onP(c, 'freitas', X, D, Object.assign({ t: T, mouth: lips(T, IVF) }, o), 0, mul == null ? mulF(T) : mul);
const S3 = (c, T, X, D, o = {}, Y = 0) => onP(c, o.id || 'saci', X, D, Object.assign({ t: T, mouth: lips(T, IVS) }, o), Y, o.mul || 1);
const P3o = (c, T, X, D, o = {}) => onP(c, 'polo', X, D, POLO(Object.assign({ t: T, mouth: lips(T, IVP) }, o)));
const M3 = (c, X, D, o = {}) => { if (!zOK(c, D)) return ''; const p = PP(c, X, 0, D); return mavie(p.x, p.y, Object.assign({ s: 0.36 * p.k }, o)); };
const dust3 = (c, X, D, T, t0) => { const a = T - t0; if (a < 0 || a > 0.9 || !zOK(c, D)) return ''; const p = PP(c, X, 0, D); let s = ''; for (let i = 0; i < 7; i++) { const ang = Math.PI * (0.1 + i / 7.5); s += `<circle cx="${f2(p.x + Math.cos(ang) * (40 + a * 160) * p.k * (i % 2 ? 1 : -1))}" cy="${f2(p.y - Math.sin(ang) * a * 60 * p.k)}" r="${f2((14 + a * 26) * p.k)}" fill="#e8c898" opacity="${f2(0.7 * (1 - a / 0.9))}"/>`; } return s; };
const flash = (T, t0, x, y) => { const a = (T - t0) / 0.2; if (a < 0 || a > 1) return ''; return `<circle cx="${x}" cy="${y}" r="${f2(60 + a * 140)}" fill="#fff6c8" opacity="${f2(0.9 * (1 - a))}"/>`; };
const glow = (T) => ''; // reservado
// ----- cenas -----
SHOTS.push(
  // 1 — gancho: close do Polo, a regra na tela, Freitas ao fundo
  { t0: 0, draw(t, T) {
    const c = camOn(-60, 900, lerp(4.6, 5.0, E.sine(clamp(t / 1.85))), 1720, 160, 70);
    const e = exprAt(T, [[0, 'neutral'], [1.2, 'surprised']]);
    return scene3(T, c, { actors: [act(900, () => P3o(c, T, -60, 900, { face: 0.3, expr: e.expr, squash: e.pop, lx: T > 1.2 ? 0.9 : 0.2 })), act(1700, () => F3(c, T, 260, 1700, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }))] }, ORANGE, ruleBanner(T, 0));
  } },
  // 2 — contra-plongée: o Freitas estica em pulsos
  { t0: 1.85, draw(t, T) {
    const m = 1 + 0.5 * kf(T, [[1.95, 0], [2.25, 0.45, E.back], [2.6, 0.75, E.back], [3.0, 1, E.back]]);
    const c = camOn(0, 1400, 2.0, 1560, 30, 20, 620, -3);
    return scene3(T, c, { actors: [act(1400, () => F3(c, T, 0, 1400, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open', squash: -0.08 * Math.sin(clamp((T - 1.95) / 1.1) * Math.PI * 3) }, m))] }, ORANGE, ruleBanner(T, 0) + comic(T, 2.0, 'ESTICA!', 760, 700, { size: 90, fill: '#ff7a45' }));
  } },
  // 3 — "Eu sou o Polo. Apito os jogos da praça" (plano médio, câmera alta, jogo ao fundo)
  { t0: 3.8, draw(t, T) {
    const c = camOn(680, 1100, lerp(2.3, 2.6, E.sine(clamp(t / 1.6))), 1560, 300, -120);
    const fx = Math.sin(T * 1.3) * 300, fd = 2500 + Math.cos(T * 1.3) * 200;
    return scene3(T, c, { standsSide: { n: 10, seed: 4 }, actors: [
      act(1100, () => P3o(c, T, 680, 1100, { face: -0.2, expr: T > 4.6 ? 'happy' : 'neutral', armR: T > 4.55 ? 160 : 20, bendR: T > 4.55 ? 50 : 20, handR: 'open', squash: -0.05 * pulse(T, 4.7, 0.15) })),
      act(fd, () => F3(c, T, fx, fd, { side: true, face: Math.cos(T * 1.3) > 0 ? -0.8 : 0.8, walk: T * 11, run: 1, expr: 'happy' })), act(fd - 1, () => ballP(c, fx + 40, Math.abs(Math.sin(T * 6)) * 20, fd - 30, T * 500)),
      act(GD - 60, () => S3(c, T, Math.sin(T * 1.3) * 120, GD - 60, { expr: 'neutral', armL: 50, armR: 50, bendL: 40, bendR: 40 }))] }, ORANGE, comic(T, 4.75, 'PRIII!', 760, 520, { size: 100 }));
  } },
  // 4 — drone: a praça inteira, descendo
  { t0: 5.4, draw(t, T) {
    const q = E.inOut(clamp(t / 1.2));
    const c = camOn(0, 1800, lerp(0.5, 0.62, q), 1500, lerp(1300, 800, q), lerp(-200, 0, q));
    const fx = Math.sin(T * 1.3) * 300, fd = 2400 + Math.cos(T * 1.3) * 200;
    return scene3(T, c, { standsSide: { n: 16, seed: 5, cheer: 0.3 }, bench: { X: FW + 160, D: 1700 }, actors: [
      act(fd, () => F3(c, T, fx, fd, { side: true, face: 0.8, walk: T * 11, run: 1 })), act(fd - 1, () => ballP(c, fx + 40, 0, fd - 30, T * 500)),
      act(GD - 60, () => S3(c, T, 60, GD - 60, { armL: 50, armR: 50, bendL: 40, bendR: 40 })), act(1100, () => P3o(c, T, 680, 1100, { face: -0.4 })), act(1720, () => M3(c, FW + 220, 1720, { t: T, face: -1, wag: 0.5 }))] }, ORANGE);
  } },
  // 5 — "vi tudo isso de perto": close com rolagem, olhar de lado
  { t0: 6.6, draw(t, T) {
    const c = camOn(680, 1100, 5.2, 1780, 150, -10, 620, -4 + t * 2);
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { face: Math.sin(T * 2.4) * 0.5, expr: 'smug', lx: Math.sin(T * 2.4), headTilt: Math.sin(T * 2.4) * 6 }))] }, ORANGE);
  } },
  // 6 — amigos desde pequenos (lembrança)
  { t0: 8.0, xf: 0.3, draw(t, T) {
    const c = camOn(0, 1200, lerp(2.6, 2.9, t / 2.7), 1480, 110, 0);
    const hi = pulse(T, 9.8, 0.3);
    return scene3(T, c, { actors: [
      act(1200, () => F3(c, T, -110, 1200, { face: 0.6, expr: 'laugh', armR: 140 + hi * 25, bendR: 0, handR: 'open', jump: hi * 30, mouth: 0 }, 0.68)),
      act(1201, () => S3(c, T, 110, 1200, { face: -0.6, expr: 'laugh', armL: 140 + hi * 25, bendL: 0, handL: 'open', jump: hi * 30, mouth: 0, mul: 0.68 }, 0)), act(1150, () => ballP(c, 0, Math.abs(Math.sin(T * 5)) * 30, 1150, T * 300))] }, SEPIA, flashBorder() + comic(T, 9.8, 'TOCA!', 540, 520, { size: 90 }));
  } },
  // 7 — corrida com a bola, câmera lateral acompanhando
  { t0: 10.7, draw(t, T) {
    const X = lerp(-400, 300, t / 1.3), c = camOn(X, 1300, 2.2, 1520, 80, 120);
    return scene3(T, c, { actors: [act(1300, () => F3(c, T, X, 1300, { side: true, face: 0.8, walk: T * 12, run: 1, expr: 'happy' })), act(1290, () => ballP(c, X + 70 + Math.abs(Math.sin(T * 12)) * 14, Math.abs(Math.sin(T * 6)) * 18, 1290, T * 700)),
      act(1700, () => S3(c, T, X + 600, 1900, { side: true, face: -0.8, walk: T * 9, run: 1 }))], front: speedLines(X - 300, 1100, 6, 120, 0, 0.5, 3) }, ORANGE);
  } },
  // 8 — por cima do ombro: Freitas chuta, Saci pega
  { t0: 12.0, draw(t, T) {
    const c = camOn(0, 2750, 3.2, 2050, 170, 140);
    const bp = inv(12.15, 12.6, T), bX = lerp(30, -40, bp), bD = lerp(2800, GD - 90, bp), bY = Math.sin(bp * Math.PI) * 70 + bp * 80;
    const dive = E.back(inv(12.4, 12.75, T));
    return scene3(T, c, { actors: [act(2750, () => F3(c, T, 0, 2750, { back: true, armL: 30, armR: 30 })),
      act(GD - 80, () => S3(c, T, -40 * dive, GD - 80, { expr: 'angry', armL: 80 + 70 * dive, armR: 80 + 70 * dive, bendL: 20, bendR: 20, handL: 'open', handR: 'open', jump: dive * 30, tilt: -dive * 12 })),
      act(bD, () => bp < 1 ? ballP(c, bX, bY, bD, T * 800) : '')] }, ORANGE, comic(T, 12.6, 'PEGOU!', 540, 560, { size: 80, fill: '#5ab0d8' }));
  } },
  // 9 — Saci, o goleiro (luvas batendo)
  { t0: 12.9, draw(t, T) {
    const c = camOn(0, GD - 80, lerp(3.0, 3.3, t / 1.2), 1660, 120, 0);
    const clap = Math.abs(Math.sin(T * 9));
    return scene3(T, c, { actors: [act(GD - 80, () => S3(c, T, 0, GD - 80, { expr: 'happy', armL: 55 + clap * 20, armR: 55 + clap * 20, bendL: 70, bendR: 70, squash: -0.03 * clap }))] }, ORANGE, comic(T, 13.5, 'GOLEIRO', 540, 520, { size: 80, fill: '#5ab0d8' }));
  } },
  // 10 — Freitas, o craque (ângulo de lado, inclinado)
  { t0: 14.1, draw(t, T) {
    const c = camOn(0, 1400, 4.4, 1800, 140, -90, 620, 5);
    const e = exprAt(T, [[14.1, 'happy'], [14.7, 'smug']]);
    const jug = Math.abs(Math.sin(T * 7));
    return scene3(T, c, { actors: [act(1400, () => F3(c, T, 0, 1400, { face: 0.5, expr: e.expr, wink: T > 14.7, squash: e.pop, armR: 30, bendR: 120, holdR: ball(0, -30 - jug * 20, 22, T * 200) }))] }, ORANGE);
  } },
  // 11 — "mas o craque tinha um problema" (câmera alta sobre o Polo)
  { t0: 15.4, draw(t, T) {
    const c = camOn(680, 1100, 4.0, 1820, 420, 0);
    const e = exprAt(T, [[15.4, 'neutral'], [16.1, 'worried']]);
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { face: -0.3, expr: e.expr, squash: e.pop, ly: -0.6, armL: 50, bendL: 110, handL: 'point' }))] }, ORANGE, popIcon(T, 16.3, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="200" fill="#ff7a45" stroke="${INK}" stroke-width="12" paint-order="stroke">?</text>`, 820, 520));
  } },
  // 12 — bicicleta: corrida, agacha, salta de costas, tesoura, contato, queda
  { t0: 17.5, draw(t, T) {
    const c = camOn(60, 1300, 3.3, 1620, 70, 0);
    const p = PP(c, 0, 0, 1300), s = PS * p.k;
    const runX = Math.min(0, lerp(-260, 0, inv(17.5, 17.9, T)));
    const crouch = pulse(T, 18.05, 0.15);
    const air = inv(18.15, 19.0, T), fall = inv(19.0, 19.3, T);
    const ang = T < 18.15 ? 0 : T < 19.0 ? 170 * E.inOut(air) : 170 + 30 * E.in(fall);
    const lift = T < 18.15 ? 0 : T < 19.0 ? Math.sin(air * Math.PI * 0.85) * 210 : lerp(Math.sin(0.85 * Math.PI) * 210, 0, E.in(fall)) - fall * 40;
    const legPh = T < 17.9 ? T * 12 : T < 18.15 ? 0 : Math.PI * 0.5 + E.inOut(air) * Math.PI * 1.6;
    const sx = p.x + runX * p.k, hip = 110 * s;
    const body = person('freitas', { x: 0, y: 0, s, t: T, side: true, face: -0.8, walk: legPh, run: 1, expr: T < 18.15 ? 'angry' : T < 19.2 ? 'surprised' : 'joy', armFront: T > 18.15 ? 140 : null, armBack: T > 18.15 ? 160 : null, shadow: false });
    const fr = `<ellipse cx="${f2(sx)}" cy="${f2(p.y)}" rx="${f2(60 * p.k * (1 - lift / 500))}" ry="${f2(10 * p.k)}" fill="#1b1424" opacity="0.22"/><g transform="translate(${f2(sx)} ${f2(p.y - lift * p.k)}) rotate(${f2(ang)} 0 ${f2(-hip)}) scale(1 ${f2(1 - crouch * 0.18)})">${body}</g>`;
    // bola: cruzamento vindo da esquerda até o pé no alto; depois sai para a direita (gol)
    const footX = sx - Math.sin(ang * Math.PI / 180) * hip * 1.05, footY = p.y - lift * p.k - hip + Math.cos(ang * Math.PI / 180) * hip * 1.05;
    let bx, by;
    if (T < 18.9) { const q = inv(17.7, 18.9, T); bx = lerp(-200, footX, q); by = lerp(300, footY, q) - Math.sin(q * Math.PI) * 260; }
    else { const q = inv(18.9, 19.3, T); bx = lerp(footX, 1500, q); by = lerp(footY, footY + 80, q); }
    const out = comic(T, 18.92, 'TUM!', 600, 560, { size: 120 }) + (T > 19.0 ? speedLines(bx - 420 - 80, by, 6, 140, 0, 0.6, 4) : '');
    return scene3(T, c, { goal: false, actors: [act(1300, () => fr + ball(bx, by, 13 * p.k, T * 900) + flash(T, 18.92, footX, footY) + dust3(c, 0, 1300, T, 19.25))] }, ORANGE, out);
  } },
  // 13 — a bola estufa a rede (câmera baixa na frente do gol, Freitas caído em primeiro plano)
  { t0: 19.3, draw(t, T) {
    const c = camOn(0, GD - 520, lerp(1.7, 1.9, t / 0.6), 1640, 90, 0);
    const bp = inv(19.3, 19.48, T), b = T < 19.48 ? 0 : 0.9 * Math.exp(-(T - 19.48) * 5) * (0.6 + 0.4 * Math.cos((T - 19.48) * 22));
    const rise = E.out(inv(19.5, 19.9, T));
    return scene3(T, c, { standsFront: { front: GD + 650, n: 16, seed: 9, cheer: 1 }, goalO: { bulge: b, bx: 60, by: 110 }, actors: [
      act(GD + 30, () => ballP(c, lerp(-120, 60, bp), lerp(60, 110, bp) - (T > 19.48 ? Math.min(100, (T - 19.48) * 300) : 0), lerp(GD - 700, GD + 70 + b * 60, bp), T * 900)),
      act(GD - 700, () => `<g>${F3(c, T, -260, GD - 700, { side: true, face: 0.8, expr: 'joy', tilt: lerp(-70, 0, rise), jump: -20 * (1 - rise) })}</g>`)] }, ORANGE, comic(T, 19.5, 'GOL!', 540, 520, { size: 160 }));
  } },
  // 14 — de costas: Freitas abre os braços para a torcida
  { t0: 19.9, draw(t, T) {
    const c = camOn(0, 1500, 2.8, 2000, 260, 0);
    const op = E.back(inv(20.0, 20.6, T));
    return scene3(T, c, { goal: false, standsFront: { front: 1950, n: 18, seed: 11, cheer: 1 }, actors: [act(1500, () => F3(c, T, 0, 1500, { back: true, armL: 20 + op * 85, armR: 20 + op * 85, bendL: 10, bendR: 10, headTilt: Math.sin(T * 1.5) * 5 }))] }, ORANGE, comic(T, 20.5, 'UHUUU!', 540, 420, { size: 90 }));
  } },
  // 15 — contraplano: ele olha a torcida, vaidoso (a torcida atrás da câmera)
  { t0: 21.7, draw(t, T) {
    const c = camOn(0, 1500, lerp(3.4, 3.8, t / 1.5), 1900, 120, 40, 620, -3);
    return scene3(T, c, { standsSide: { n: 8, seed: 12, cheer: 1 }, actors: [act(1500, () => F3(c, T, 0, 1500, { face: -0.5 + Math.sin(T * 1.5) * 0.5, lx: -0.6 + Math.sin(T * 1.5) * 0.8, ly: -0.6, expr: 'smug', armL: 105, armR: 105, bendL: 0, bendR: 0, handL: 'open', handR: 'open', headTilt: -8 }))] }, ORANGE);
  } },
  // 16 — "Eu sou arrogante mesmo. E daí?"
  { t0: 23.2, draw(t, T) {
    const c = camOn(0, 1400, 5.0, 1800, 90, 0, 620, -4);
    const e = exprAt(T, [[23.2, 'smug'], [24.0, 'angry'], [24.4, 'happy'], [25.0, 'laugh']]);
    const shrug = pulse(T, 24.6, 0.35);
    return scene3(T, c, { actors: [act(1400, () => F3(c, T, 0, 1400, { face: 0.2, expr: e.expr, squash: e.pop, armL: 40 + 20 * shrug, armR: 40 + 20 * shrug, bendL: 100 * shrug + 10, bendR: 100 * shrug + 10, handL: 'open', handR: 'open', headTilt: -8 + shrug * 10 }))] }, ORANGE, popIcon(T, 24.4, bubble('E DAÍ?', 340, 72), 640, 360));
  } },
  // 17 — reação do Polo
  { t0: 25.0, draw(t, T) {
    const c = camOn(680, 1100, 4.8, 1780, 200, 30);
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { face: -0.6, lx: -1, expr: T > 25.4 ? 'surprised' : 'worried', hatLift: 18 * pulse(T, 25.5, 0.2) }))] }, ORANGE);
  } },
  // 18 — cresceu dois centímetros (plano geral, régua)
  { t0: 26.0, draw(t, T) {
    const c = camOn(200, 1300, lerp(1.6, 1.8, t / 2.4), 1560, 180, 0);
    const e = exprAt(T, [[26, 'smug'], [27.05, 'surprised']]);
    return scene3(T, c, { actors: [act(1300, () => F3(c, T, 0, 1300, { expr: e.expr, squash: -0.15 * pulse(T, 27.2, 0.2) })), act(1250, () => P3o(c, T, 450, 1250, { face: -0.6, expr: T > 27.1 ? 'surprised' : 'neutral', mouth: 0 }))] }, ORANGE,
      popIcon(T, 27.1, `<rect x="-150" y="-60" width="300" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+2 cm</text>`, 540, 420));
  } },
  // 19 — Saci riu
  { t0: 28.4, draw(t, T) {
    const c = camOn(0, GD - 80, 4.8, 1800, 140, 0, 620, 6);
    return scene3(T, c, { actors: [act(GD - 80, () => S3(c, T, 0, GD - 80, { face: -0.2, expr: 'laugh', mouth: 0.8, squash: 0.04 * Math.sin(T * 22), armL: 30, bendL: 120 }))] }, ORANGE, comic(T, 28.5, 'HAHA', 760, 520, { size: 90 }));
  } },
  // 20 — Polo levanta a súmula
  { t0: 29.1, draw(t, T) {
    const c = camOn(680, 1100, 3.4, 1900, 520, 40);
    const up = E.back(clamp(t / 0.4));
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { face: 0.2, expr: 'neutral', ly: 1, lx: 0.3, armL: 20 + 25 * up, bendL: 40 + 60 * up, holdL: clipboard(-10, 1.1), armR: 20 + 30 * up, bendR: 40 + 60 * up }))] }, ORANGE);
  } },
  // 20b — detalhe: o lápis escreve na súmula
  { t0: 29.7, draw(t, T) {
    const c = camOn(680, 1100, 3.0, 2300, 600, 40);
    const prog = clamp((T - 29.8) / 0.95);
    const px = 330 + prog * 420 + Math.sin(T * 40) * 6, py = 1000 + Math.abs(Math.sin(T * 26)) * -10;
    const txt = 'FREITAS  +2 cm';
    const card = `<g transform="translate(540 ${f2(990 + Math.sin(T * 2) * 6)}) rotate(-4)">
      <rect x="-380" y="-470" width="760" height="980" rx="30" fill="#a8703e" stroke="${INK}" stroke-width="12"/><rect x="-330" y="-400" width="660" height="860" fill="#fffaf0" stroke="${INK}" stroke-width="6"/>
      <rect x="-140" y="-500" width="280" height="80" rx="14" fill="#8a8e9a" stroke="${INK}" stroke-width="8"/>
      <text x="0" y="-320" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="58" fill="#c8443c">SÚMULA</text>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M -280 ${-200 + i * 100} H 280" stroke="#b8b0c0" stroke-width="4"/>`).join('')}
      <text x="-270" y="-120" font-family="Fredoka" font-weight="600" font-size="44" fill="#4a4458">GOL: bicicleta</text>
      <clipPath id="wr"><rect x="-280" y="-80" width="${f2(560 * prog)}" height="90"/></clipPath>
      <text x="-270" y="-18" clip-path="url(#wr)" font-family="Fredoka" font-weight="700" font-size="62" fill="#2a3a8a">${txt}</text>
      <path d="M -270 10 H ${f2(-270 + 540 * prog)}" stroke="#2a3a8a" stroke-width="4" opacity="${f2(prog > 0.95 ? 1 : 0)}"/></g>`;
    // mão esquerda (luva) segurando a prancheta, mão direita com o lápis
    const pencil = `<g transform="translate(${f2(px)} ${f2(py)}) rotate(-35)"><rect x="-10" y="-190" width="20" height="170" fill="#f2c230" stroke="${INK}" stroke-width="5"/><path d="M -10 -20 L 0 6 L 10 -20 Z" fill="#f4d8b0" stroke="${INK}" stroke-width="4"/><path d="M -3 -2 L 0 6 L 3 -2 Z" fill="${INK}"/><rect x="-10" y="-206" width="20" height="18" fill="#e88aaa" stroke="${INK}" stroke-width="4"/></g>`;
    const handR = `<g transform="translate(${f2(px + 60)} ${f2(py - 60)}) scale(3)">${mitt(0, 0, 30, 30, '#1d1a22', 'fist')}</g><path d="M ${f2(px + 90)} ${f2(py - 40)} L ${f2(px + 420)} ${f2(py + 380)}" stroke="${INK}" stroke-width="96" stroke-linecap="round"/><path d="M ${f2(px + 90)} ${f2(py - 40)} L ${f2(px + 420)} ${f2(py + 380)}" stroke="#ffc928" stroke-width="80" stroke-linecap="round"/>`;
    const handL = `<path d="M -40 1500 L 160 1340" stroke="${INK}" stroke-width="96" stroke-linecap="round"/><path d="M -40 1500 L 160 1340" stroke="#ffc928" stroke-width="80" stroke-linecap="round"/><g transform="translate(190 1310) scale(3)">${mitt(0, 0, -30, 30, '#1d1a22', 'open')}</g>`;
    const sc = scene3(T, c, { actors: [] }, ORANGE);
    sc.over = `<rect width="1080" height="1920" fill="#2a1a14" opacity="0.25"/>` + card + handL + pencil + handR + comic(T, 29.9, 'RISC RISC', 540, 320, { size: 70, fill: '#fff6e0', life: 1.0 });
    return sc;
  } },
  // 21 — semana seguinte: outro gol (vista alta de trás)
  { t0: 30.9, draw(t, T) {
    const c = camOn(0, 2200, 1.2, 1700, 650, 0);
    const kick = pulse(T, 32.35, 0.3), bp = inv(32.4, 32.9, T);
    const dive = E.out(inv(32.5, 32.9, T));
    return scene3(T, c, { actors: [act(2300, () => F3(c, T, 0, 2300, { back: true, armL: 30 + kick * 40, armR: 30 })), act(lerp(2350, GD + 40, bp), () => ballP(c, lerp(0, 160, bp), Math.sin(bp * Math.PI) * 80, lerp(2350, GD + 40, bp), T * 900)),
      act(GD - 60, () => S3(c, T, -dive * 140, GD - 60, { tilt: -dive * 70, armL: 160, armR: 160, bendL: 0, bendR: 0, handL: 'open', handR: 'open', jump: dive * 40, expr: 'surprised' }))], goalO: { bulge: T > 32.9 ? 0.6 * Math.exp(-(T - 32.9) * 5) : 0, bx: 160, by: 60 } }, ORANGE,
      popIcon(T, 31.0, calendar('+7'), 540, 400, 0.9 * clamp(1 - (T - 32.2) * 3)) + comic(T, 32.9, 'GOL!', 640, 560, { size: 130 }));
  } },
  // 22 — "Arrogante!" e cresce mais dez (câmera recua)
  { t0: 33.2, draw(t, T) {
    const c = lerpC(camOn(0, 1400, 4.6, 1800, 80, 0, 620, 4), camOn(0, 1400, 2.4, 1600, 60, 0), E.inOut(inv(34.6, 35.6, T)));
    const e = exprAt(T, [[33.2, 'angry'], [34.5, 'surprised'], [35.4, 'smug']]);
    return scene3(T, c, { actors: [act(1400, () => F3(c, T, 0, 1400, { expr: e.expr, mouth: Math.max(lips(T, IVF), T < 34.4 ? 0.3 : 0), armR: 170, bendR: 10, armL: 20, squash: e.pop - 0.15 * pulse(T, 35.1, 0.2) }))] }, ORANGE,
      comic(T, 33.4, 'ARROGANTE!', 540, 480, { size: 96, fill: '#ff7a45', life: 1.1 }) + popIcon(T, 35.0, `<rect x="-170" y="-60" width="340" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+10 cm</text>`, 540, 420));
  } },
  // 23 — olhava todo mundo de cima (por cima do ombro dele)
  { t0: 36.1, draw(t, T) {
    const c = camOn(0, 1400, 2.6, 2150, 330, -40);
    return scene3(T, c, { actors: [act(1400, () => F3(c, T, 0, 1400, { back: true, headTilt: 10, armL: 15, armR: 15 })),
      act(1750, () => onP(c, NPC_IDS[1], -170, 1750, { t: T, ly: -1, expr: 'worried' })), act(1800, () => onP(c, NPC_IDS[4], 120, 1800, { t: T + 1, ly: -1, expr: 'sad' })), act(1900, () => onP(c, NPC_IDS[9], -20, 1950, { t: T + 2, ly: -1, expr: 'surprised' }))] }, ORANGE);
  } },
);
SHOTS.push(
  // 24 — nem abaixava pra passar na porta (TÓIN)
  { t0: 38.4, draw(t, T) {
    const x = Math.min(lerp(700, 1140, t / 0.9), 1140) - (T > 39.4 ? 30 * E.out(inv(39.4, 39.6, T)) : 0);
    const fr = FR(T, { x, y: G, s: FS(T) * 1.12, face: 0.8, side: true, walk: T < 39.3 ? T * 8 : null, expr: T > 39.4 ? 'surprised' : 'smug', tilt: T > 39.4 ? -8 : 0 });
    return { cam: push(frameG(1060, G, 1.7, 1350), t, 1.9, 0.05), layers: [...pitchBack(t), Lr(1, pitchGround() + doorway(1200, G, 0.8) + fr), Lr(1.05, `<path d="M ${1200 - 101} ${G} V ${G - 277} H ${1200 - 80} V ${G}" fill="#efe2c4" stroke="${INK}" stroke-width="4"/>`)], tint: ORANGE, over: comic(T, 39.45, 'TÓIN!', 700, 520, { size: 110 }) };
  } },
);
SHOTS.push(
  // 25 — "Aí veio o pior" (vira azul, close com rolagem)
  { t0: 40.3, xf: 0.35, draw(t, T) {
    const c = camOn(680, 1100, lerp(4.6, 5.4, E.sine(clamp(t / 1.5))), 1780, 170, 0, 620, lerp(0, -6, t / 1.5));
    return scene3(T, c, { night: 0.6, actors: [act(1100, () => P3o(c, T, 680, 1100, { expr: 'worried', lx: -0.6, ly: 0.3 }))] }, BLUE);
  } },
  // 26 — chute com raiva (lateral baixa)
  { t0: 41.8, draw(t, T) {
    const k = E.back(inv(42.0, 42.2, T)) - E.in(inv(42.25, 42.6, T)) * 0.8;
    const c = camOn(0, 1400, 2.6, 1560, 50, 60);
    c.x += shake(T, 42.2, 18);
    const bp = inv(42.2, 43.0, T);
    return scene3(T, c, { night: 0.6, actors: [act(1400, () => F3(c, T, 0, 1400, { side: true, face: 0.8, walk: -0.9 + k * 2.2, run: 1, expr: 'angry', mouth: 0, tilt: -k * 6 })),
      act(1399, () => ballP(c, lerp(80, 1400, bp), Math.sin(bp * Math.PI) * 140, 1400, T * 1400)), act(1401, () => dust3(c, 60, 1400, T, 42.2))] }, BLUE, comic(T, 42.2, 'PÁ!', 600, 560, { size: 120, fill: '#ff7a45' }));
  } },
  // 27 — a bola voa (vista de cima) em direção à Mavie, perto do banco
  { t0: 43.0, draw(t, T) {
    const q = inv(43.0, 44.2, T), bX = lerp(0, FW + 200, q), bD = lerp(1400, 1700, q);
    const c = camOn(lerp(100, FW + 120, E.inOut(q)), 1600, 1.6, 1500, 700, 0);
    return scene3(T, c, { night: 0.6, bench: { X: FW + 160, D: 1780 }, actors: [act(bD, () => ballP(c, bX, Math.sin(q * Math.PI) * 120 + 20, bD, T * 1200)), act(1700, () => M3(c, FW + 200, 1700, { t: T, face: -1, wag: 0.8 }))] }, BLUE);
  } },
  // 28 — POF: acerta a Mavie (câmera na altura dela)
  { t0: 44.2, draw(t, T) {
    const c = camOn(FW + 200, 1700, 6.0, 1500, 30, -40);
    c.x += shake(T, 44.25, 16);
    const hit = T > 44.25, bq = inv(44.25, 44.9, T);
    return scene3(T, c, { night: 0.6, actors: [act(1700, () => M3(c, FW + 200, 1700, { t: T, face: -1, hurt: hit ? 1 : 0, knock: hit ? Math.exp(-(T - 44.25) * 3) * Math.cos((T - 44.25) * 9) : 0, hurtStars: hit, wag: hit ? 0 : 0.6 })),
      act(1690, () => hit ? ballP(c, FW + 120 - bq * 160, Math.sin(bq * Math.PI) * 60 + 10, 1690 - bq * 80, T * 700) : ballP(c, FW + 120 - (1 - inv(44.2, 44.25, T)) * 120, 20, 1690, T * 700))] }, BLUE,
      comic(T, 44.25, 'POF!', 540, 520, { size: 130, fill: '#ff7a45' }) + popIcon(T, 44.9, `<rect x="-140" y="-50" width="280" height="90" rx="18" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="#e8609a">MAVIE</text>`, 540, 400));
  } },
  // 29 — ganiu e se escondeu atrás do banco
  { t0: 46.2, draw(t, T) {
    const run = E.inOut(inv(47.4, 48.4, T)), mX = lerp(FW + 40, FW + 200, run), mD = lerp(1600, 1900, run);
    const c = camOn(FW + 160, 1750, 3.2, 1560, 110, 0);
    return scene3(T, c, { night: 0.6, bench: { X: FW + 160, D: 1780 }, actors: [act(mD, () => M3(c, mX, mD, { t: T, face: 1, hurt: T < 47.4 ? 1 : 0.6, knock: T < 47.4 ? 0.15 * Math.sin(T * 4) : 0, wag: 0 }))] }, BLUE, comic(T, 46.6, 'CAIM!', 540, 520, { size: 110, fill: '#8fd0f0' }));
  } },
  // 30 — Saci vê (choque) e tira as luvas, uma de cada vez
  { t0: 48.7, draw(t, T) {
    const c = camOn(0, GD - 80, T < 49.3 ? 4.6 : 3.4, T < 49.3 ? 1800 : 1720, 140, 0);
    const e = exprAt(T, [[48.7, 'surprised'], [49.3, 'angry']]);
    let id = 'saci', o = { expr: e.expr, squash: e.pop, armL: 12, armR: 12, bendL: 20, bendR: 20 };
    const p1 = inv(49.5, 49.85, T), p2 = inv(49.85, 50.15, T), p3 = inv(50.15, 50.45, T), p4 = inv(50.45, 50.7, T);
    if (T >= 49.3) { o.armL = lerp(12, 35, E.out(inv(49.3, 49.5, T))); o.bendL = lerp(20, 80, E.out(inv(49.3, 49.5, T))); o.armR = lerp(12, 30, E.out(inv(49.3, 49.5, T))); o.bendR = lerp(20, 75, E.out(inv(49.3, 49.5, T))); o.ly = 1; }
    if (T >= 49.5 && T < 49.85) { o.armR = 30 + p1 * 25; o.bendR = 75 - p1 * 15; }                       // puxa o punho da luva esquerda
    if (T >= 49.85) { id = 'saciGL'; o.armR = lerp(55, 30, p2); o.bendR = lerp(60, 75, p2); o.holdR = gloveLoose(150, 1 - p2 * 0.6); }  // luva esquerda sai, fica na mão direita
    if (T >= 50.15) { o.armL = lerp(35, 55, p3); o.bendL = lerp(80, 60, p3); o.holdR = gloveLoose(150, 0.4); }                             // a mão sem luva puxa a outra
    if (T >= 50.3) { id = 'saciSem'; o.holdL = gloveLoose(30, p3); }
    if (T >= 50.45) { o.armL = lerp(55, 120, E.back(p4)); o.armR = lerp(30, 110, E.back(p4)); o.bendL = o.bendR = 10; o.handL = o.handR = 'open'; o.holdL = o.holdR = ''; o.expr = 'angry'; }
    const g = PP(c, 0, 0, GD - 80), sc = PS * g.k;
    const throwG = (sx, i) => { const q = inv(50.5, 51.1, T); if (q <= 0) return ''; const x = g.x + sx * (120 + q * 170) * sc, yb = g.y - 20 * sc, y = lerp(g.y - 330 * sc, yb, E.in(Math.min(1, q * 1.3))) - (q > 0.77 ? Math.abs(Math.sin((q - 0.77) * 13)) * 40 * sc * (1 - q) : 0); return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(sx * q * 400)}) scale(${f2(sc * 1.4)})">${mitt(0, 0, -20, 0, GLOVE, 'open')}</g>`; };
    return scene3(T, c, { night: 0.6, actors: [act(GD - 80, () => S3(c, T, 0, GD - 80, Object.assign({ id }, o))), act(GD - 200, () => throwG(-1) + throwG(1) + dust3(c, -160, GD - 120, T, 50.95) + dust3(c, 160, GD - 120, T, 51.0))] }, BLUE, comic(T, 50.95, 'PLOFT', 540, 520, { size: 90 }));
  } },
  // 31 — "Pra que jogar a bola na Mavie?"
  { t0: 51.4, draw(t, T) {
    const c = camOn(0, GD - 80, 5.2, 1800, 110, 0, 620, 6);
    c.x += shake(T, 51.5, 8);
    const e = exprAt(T, [[51.4, 'angry'], [52.3, 'sad']]);
    return scene3(T, c, { night: 0.6, actors: [act(GD - 80, () => S3(c, T, 0, GD - 80, { id: 'saciSem', face: 0.2, expr: e.expr, squash: e.pop, armR: 60, bendR: 40, handR: 'point', headTilt: Math.sin(T * 6) * 3 }))] }, BLUE);
  } },
  // 32 — dá de ombros e cresce mais um metro (câmera desce e recua)
  { t0: 53.1, draw(t, T) {
    const sh = pulse(T, 53.9, 0.4);
    const c = lerpC(camOn(0, 1400, 3.4, 1820, 150, 0), camOn(0, 1400, 1.25, 1620, 30, 0, 620, -4), E.inOut(inv(54.4, 55.6, T)));
    const e = exprAt(T, [[53.1, 'smug'], [54.5, 'surprised'], [55.3, 'smug']]);
    return scene3(T, c, { night: 0.6, actors: [act(1400, () => F3(c, T, 0, 1400, { expr: e.expr, squash: e.pop, armL: 30 + sh * 20, armR: 30 + sh * 20, bendL: 100 * sh + 10, bendR: 100 * sh + 10, handL: 'open', handR: 'open', headTilt: sh * 8 }))] }, BLUE,
      popIcon(T, 55.0, `<rect x="-180" y="-60" width="360" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+1 METRO</text>`, 540, 340));
  } },
  // 33 — três metros: contra-plongée, gente pequena em volta
  { t0: 55.8, draw(t, T) {
    const c = camOn(0, 1400, lerp(2.5, 2.7, t / 1.9), 1760, 25, lerp(-60, 60, t / 1.9), 620, 3);
    const ppl = [[-210, 1250, 2], [-120, 1150, 5], [150, 1200, 8], [240, 1300, 11]].map(([X, D, i], k) => act(D, () => onP(c, NPC_IDS[i], X, D, { t: T + k, face: X < 0 ? 0.5 : -0.5, ly: -1, expr: 'surprised' })));
    return scene3(T, c, { night: 0.6, actors: [act(1400, () => F3(c, T, 0, 1400, { expr: 'neutral', armL: 10, armR: 10, ly: 1 })), ...ppl] }, BLUE, popIcon(T, 56.7, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="120" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">3 m</text>`, 540, 420));
  } },
  // 34 — ninguém alcançava
  { t0: 57.7, draw(t, T) {
    const c = camOn(0, 1400, 1.7, 1700, 200, -80);
    const ppl = [[-220, 1300, 2], [200, 1250, 8]].map(([X, D, i], k) => act(D, () => onP(c, NPC_IDS[i], X, D, { t: T, face: X < 0 ? 0.5 : -0.5, ly: -1, expr: 'worried', armL: 170, armR: 170, bendL: 0, bendR: 0, handL: 'open', handR: 'open', jump: Math.abs(Math.sin(T * 7 + k * 1.5)) * 70 })));
    return scene3(T, c, { night: 0.6, actors: [act(1400, () => F3(c, T, 0, 1400, { expr: 'neutral', ly: 1 })), ...ppl] }, BLUE);
  } },
  // 35 — ninguém falava com ele: drone alto, todos se afastam
  { t0: 59.2, draw(t, T) {
    const c = camOn(0, 1500, lerp(0.75, 0.6, t / 1.4), 1450, 1100, 0);
    const ppl = [[-1, 0, 2], [1, 0.2, 8], [-1, 0.6, 5], [1, 0.9, 11], [0.3, 1.3, 14]].map(([dx, dd, i], k) => { const X = dx * (220 + t * 260), D = 1500 + (dd - 0.5) * 400 + (dd - 0.5) * t * 300; return act(D, () => onP(c, NPC_IDS[i], X, D, { t: T, side: true, face: dx > 0 ? 0.8 : -0.8, walk: T * 8 + k })); });
    return scene3(T, c, { night: 0.6, standsSide: { n: 0 }, actors: [act(1500, () => F3(c, T, 0, 1500, { expr: 'sad', ly: 1 })), ...ppl] }, BLUE, popIcon(T, 59.6, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="84" fill="#fffaf0" stroke="${INK}" stroke-width="10" paint-order="stroke">sozinho</text>`, 540, 420));
  } },
  // 36 — Polo se aproxima (câmera atrás dele)
  { t0: 60.6, draw(t, T) {
    const D = lerp(800, 1150, E.out(clamp(t / 1.8))), c = camOn(120, D, 2.6, 1900, 200, 40);
    return scene3(T, c, { night: 0.6, actors: [act(D, () => P3o(c, T, 120, D, { back: true, walk: t < 1.8 ? T * 8 : null, headTilt: -6 })), act(1450, () => F3(c, T, -40, 1450, { face: 0.2, expr: 'sad', ly: 1 }))] }, BLUE);
  } },
  // 37 — "Freitas, o que você ganhou...?" (de cima, do ponto de vista dele)
  { t0: 62.9, draw(t, T) {
    const c = camOn(120, 1150, lerp(3.8, 4.2, t / 3.4), 1850, 640, 0);
    const e = exprAt(T, [[62.9, 'worried'], [64.5, 'sad']]);
    return scene3(T, c, { night: 0.6, actors: [act(1150, () => P3o(c, T, 120, 1150, { face: 0.1, expr: e.expr, squash: e.pop, ly: -1, lx: 0.2, armR: 70, bendR: 60, handR: 'open' }))], front: leavesWind(T, 6) }, BLUE, popIcon(T, 64.0, bubble('O QUE VOCÊ GANHOU?', 640, 50), 540, 330));
  } },
  // 38 — calado, só o vento (de baixo, do ponto de vista do Polo)
  { t0: 66.3, draw(t, T) {
    const c = camOn(-40, 1450, 2.4, 1720, 10, 0, 620, Math.sin(T * 0.8) * 2);
    return scene3(T, c, { night: 0.7, actors: [act(1450, () => F3(c, T, -40, 1450, { face: Math.sin(T * 0.7) * 0.3, expr: T > 67.5 ? 'sad' : 'neutral', ly: -0.4, headTilt: Math.sin(T) * 3 }))], front: leavesWind(T, 18) }, BLUE, comic(T, 67.6, 'FFFUUU...', 540, 380, { size: 70, fill: '#c8d8f0', life: 1.4, rot: 0 }));
  } },
  // 39 — Saci sobe no banco (sépia)
  { t0: 69.0, xf: 0.4, draw(t, T) {
    const up = E.back(inv(69.8, 70.4, T)), c = camOn(-200, 1450, 1.8, 1660, 140, 60);
    return scene3(T, c, { bench: { X: -330, D: 1440 }, actors: [act(1450, () => F3(c, T, -60, 1450, { face: -0.4, expr: 'sad', ly: 1, lx: -1 })), act(1430, () => S3(c, T, lerp(-460, -330, E.inOut(inv(69.0, 69.8, T))), 1430, { id: 'saciSem', side: up < 0.1, face: 0.8, walk: T < 69.8 ? T * 8 : null, expr: 'worried', ly: -1, lx: 1, squash: 0.06 * pulse(T, 70.4, 0.15) }, up * 70))] }, SEPIA);
  } },
  // 40 — abraça a perna dele (de costas, câmera baixa)
  { t0: 71.0, draw(t, T) {
    const arm = lerp(30, 88, E.inOut(inv(71.1, 72.2, T))), c = camOn(-200, 1450, 2.4, 1820, 90, 20);
    const hearts = T > 72.4 ? popIcon(T, 72.4, `<path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#e86a7a" stroke="${INK}" stroke-width="7"/>`, 540, 640, 1.1) : '';
    return scene3(T, c, { bench: { X: -280, D: 1420 }, actors: [act(1450, () => F3(c, T, -180, 1450, { face: -0.2, expr: T > 72.4 ? 'surprised' : 'sad', ly: 1 })), act(1400, () => S3(c, T, -230, 1400, { id: 'saciSem', back: true, armL: arm, armR: arm, bendL: 55, bendR: 55 }, 70))] }, SEPIA, hearts);
  } },
  // 41 — "Desce daí, craque. Eu não sei jogar sem você."
  { t0: 73.9, draw(t, T) {
    const c = camOn(-230, 1400, 5.0, 1860, 60, 0, 620, -3);
    const e = exprAt(T, [[73.9, 'happy'], [75.2, 'sad']]);
    return scene3(T, c, { actors: [act(1400, () => S3(c, T, -230, 1400, { id: 'saciSem', face: 0.2, expr: e.expr, squash: e.pop, ly: -1, lx: 0.4, headTilt: -8, tears: T > 75.4 ? 0.4 : 0 }, 70))] }, SEPIA, popIcon(T, 74.1, bubble('DESCE DAÍ!', 420, 64), 540, 330));
  } },
  // 42 — começa a encolher (câmera sobe junto)
  { t0: 76.9, draw(t, T) {
    const c = lerpC(camOn(0, 1450, 1.4, 1700, 20, 0), camOn(0, 1450, 2.0, 1600, 160, 0), E.inOut(clamp(t / 2.1)));
    return scene3(T, c, { actors: [act(1450, () => F3(c, T, 0, 1450, { expr: 'surprised', ly: -0.3, squash: 0.05 * Math.sin(T * 25) * (T > 77.6 ? 1 : 0) }))] }, SEPIA, comic(T, 77.8, 'FIUUU...', 540, 420, { size: 90, life: 1.2 }));
  } },
  // 43 — um metro, dois, até o tamanho de sempre
  { t0: 79.0, draw(t, T) {
    const c = camOn(120, 1450, lerp(2.0, 2.3, t / 3.9), 1580, 170, 0);
    const e = exprAt(T, [[79, 'surprised'], [82, 'happy']]);
    return scene3(T, c, { actors: [act(1450, () => F3(c, T, 0, 1450, { face: 0.3, expr: e.expr, squash: e.pop })), act(1440, () => S3(c, T, 290, 1440, { id: 'saciSem', face: -0.5, expr: T > 81 ? 'laugh' : 'happy' }))] }, SEPIA,
      comic(T, 79.2, '-1 m', 540, 440, { size: 110 }) + comic(T, 79.95, '-2 m', 540, 440, { size: 110 }) + popIcon(T, 82.0, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">1,75 m</text>`, 540, 420));
  } },
  // 44 — ajoelha e pede desculpa (câmera na altura da Mavie)
  { t0: 82.9, draw(t, T) {
    const kneel = E.out(inv(82.9, 83.5, T)), c = camOn(150, 1500, 3.6, 1620, 40, 0);
    const fr = () => { const p = PP(c, 30, 0, 1530); return person('freitas', { x: p.x, y: p.y + kneel * 75 * PS * p.k, s: PS * p.k, t: T, face: 0.6, expr: 'sad', mouth: talk(T, [[84.0, 84.8]]), armL: 40, armR: 60, bendL: 90, bendR: 70, handR: 'open', shadow: false }) + `<rect x="-400" y="${f2(p.y - 6)}" width="2800" height="2000" fill="#e2b47e"/><rect x="-400" y="${f2(p.y - 6)}" width="2800" height="2000" fill="url(#pPlaster)"/><ellipse cx="${f2(p.x)}" cy="${f2(p.y)}" rx="${f2(80 * p.k)}" ry="${f2(14 * p.k)}" fill="#1b1424" opacity="0.25"/>`; };
    return scene3(T, c, { actors: [act(1530, fr), act(1460, () => M3(c, 230, 1460, { t: T, face: -1, wag: inv(84.2, 85.0, T) * 0.7 }))] }, SEPIA, popIcon(T, 84.1, bubble('DESCULPA', 360, 58), 540, 380));
  } },
  // 45 — a Mavie lambe a cara dele (língua chega no rosto, ele fecha os olhos rindo)
  { t0: 85.5, draw(t, T) {
    const c = camOn(100, 1500, 4.6, 1760, 60, 0);
    const lk = Math.max(0, Math.sin((T - 85.6) * 9)), lick = T > 85.6 ? lk : 0;
    const p = PP(c, 30, 0, 1530), sc = PS * p.k;
    const fr = person('freitas', { x: p.x, y: p.y + 75 * sc, s: sc, t: T, face: 0.45, expr: T > 85.7 ? 'laugh' : 'surprised', mouth: 0.6, headTilt: -6 - lick * 8, shadow: false, armL: 60, armR: 60, bendL: 80, bendR: 80, handL: 'open', handR: 'open' }) + `<rect x="-400" y="${f2(p.y - 6)}" width="2800" height="2000" fill="#e2b47e"/>`;
    // focinho da Mavie encostado na bochecha direita dele
    const cheekX = p.x + 40 * sc, cheekY = p.y + 75 * sc + (H2 + 30) * sc;
    const mk = 0.36 * PP(c, 170, 0, 1490).k, dogX = cheekX + 125 * mk + 40 * sc - lick * 14, dogY = cheekY + 70 * mk;
    const mv = `<g transform="rotate(-18 ${f2(dogX)} ${f2(dogY)})">${mavie(dogX, dogY, { t: T, face: -1, s: mk, wag: 1, lick })}</g>`;
    const wet = T > 85.8 ? `<g opacity="0.8"><ellipse cx="${f2(cheekX + 10 * sc)}" cy="${f2(cheekY)}" rx="${f2(26 * sc)}" ry="${f2(14 * sc)}" fill="#bfe6f6" opacity="0.6"/>${[0, 1, 2].map(i => `<circle cx="${f2(cheekX + (20 + i * 22) * sc * Math.cos(T * 3 + i))}" cy="${f2(cheekY - (30 + i * 18) * sc)}" r="${f2(5 * sc)}" fill="#8fd0f0" stroke="${INK}" stroke-width="2"/>`).join('')}</g>` : '';
    return scene3(T, c, { actors: [act(1530, () => fr + wet), act(1490, () => mv)] }, SEPIA, comic(T, 85.8, 'SLURP!', 540, 440, { size: 110, fill: '#ee8aaa' }) + comic(T, 86.4, 'SLURP!', 600, 520, { size: 80, fill: '#ee8aaa', rot: 8 }));
  } },
  // 46 — Saci: "Arrogante."
  { t0: 87.2, xf: 0.35, draw(t, T) {
    const c = camOn(290, 1440, lerp(4.8, 5.2, t / 2.3), 1800, 150, -20, 620, 4);
    const e = exprAt(T, [[87.2, 'happy'], [88.3, 'smug']]);
    return scene3(T, c, { actors: [act(1440, () => S3(c, T, 290, 1440, { id: 'saciSem', face: 0.3, expr: e.expr, squash: e.pop, wink: T > 88.3, armL: 30, armR: 30, bendL: 120, bendR: 120 }))] }, ORANGE);
  } },
  // 47 — os dois riem (câmera em arco)
  { t0: 89.5, draw(t, T) {
    const b = Math.sin(T * 16) * 0.03, c = camOn(120, 1450, 2.6, 1640, 150, lerp(-50, 50, E.inOut(t / 1.8)));
    return scene3(T, c, { actors: [act(1450, () => F3(c, T, 0, 1450, { face: 0.4, expr: 'laugh', mouth: 0.8, squash: b, armR: 120, bendR: 30, handR: 'open' })), act(1451, () => S3(c, T, 230, 1450, { id: 'saciSem', face: -0.4, expr: 'laugh', mouth: 0.8, squash: -b, armL: 120, bendL: 30, handL: 'open' })), act(1400, () => M3(c, 140, 1380, { t: T, face: 1, wag: 1 }))] }, ORANGE, comic(T, 90.2, 'HAHAHA', 540, 500, { size: 100 }));
  } },
  // 48 — Polo apita o fim do jogo (contra-plongée)
  { t0: 91.3, draw(t, T) {
    const c = camOn(680, 1100, 3.8, 1760, 40, 0, 620, -3);
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { expr: 'happy', armR: 150, bendR: 10, handR: 'open', armL: 60, bendL: 90, squash: -0.06 * pulse(T, 91.6, 0.2) }))] }, ORANGE,
      comic(T, 91.5, 'PRIIIII!', 700, 640, { size: 110, life: 1.2 }) + popIcon(T, 92.2, `<rect x="-210" y="-60" width="420" height="110" rx="22" fill="#fffaf0" stroke="${INK}" stroke-width="8"/><text y="26" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="${INK}">FIM DE JOGO</text>`, 540, 300));
  } },
  // 49 — pergunta final, mesmo enquadramento do gancho (loop)
  { t0: 93.0, draw(t, T) {
    const c = camOn(-60, 900, lerp(4.6, 5.0, E.sine(clamp(t / 5))), 1720, 160, 70);
    const q = T < 95.5 ? popIcon(T, 93.1, `<rect x="-450" y="-110" width="900" height="210" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="${INK}">VOCÊ ABRAÇARIA UM</text><text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#e8503a">AMIGO ARROGANTE?</text>`, 540, 400)
      : popIcon(T, 95.5, `<rect x="-460" y="-100" width="920" height="200" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">COMENTA</text><text y="68" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="3" paint-order="stroke">ABRAÇO ou DEIXO</text>`, 540, 400);
    const e = exprAt(T, [[93, 'worried'], [95.5, 'happy']]);
    return scene3(T, c, { actors: [act(900, () => P3o(c, T, -60, 900, { face: 0.3, expr: e.expr, squash: e.pop, lx: 0.4 })), act(1700, () => F3(c, T, 260, 1700, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }, 1))] }, ORANGE, q);
  } },
);

// Régua de altura do Freitas (placar do episódio)
function HUD(T) {
  if (T < 25.8 || T > 83.4) return '';
  const a = clamp(Math.min((T - 25.8) / 0.3, (83.4 - T) / 0.3));
  const h = HGT(T), y0 = 1150, y1 = 560, yy = y => lerp(y0, y1, y / 3.2);
  let s = `<g opacity="${f2(a)}" transform="translate(${f2(1000 + (1 - a) * 80)} 0)"><rect x="-26" y="${y1 - 20}" width="52" height="${y0 - y1 + 40}" rx="14" fill="#fff6e0" stroke="${INK}" stroke-width="6"/>`;
  for (let m = 0; m <= 3; m++) s += `<path d="M -26 ${f2(yy(m))} h 26" stroke="${INK}" stroke-width="5"/><text x="-36" y="${f2(yy(m) + 10)}" text-anchor="end" font-family="Fredoka" font-weight="700" font-size="30" fill="#fff6e0" stroke="${INK}" stroke-width="7" paint-order="stroke">${m}m</text>`;
  s += `<rect x="-18" y="${f2(yy(h))}" width="36" height="${f2(y0 - yy(h))}" rx="10" fill="#e8503a"/>`;
  const lbl = h.toFixed(2).replace('.', ',') + ' m';
  s += `<g transform="translate(-50 ${f2(yy(h))})"><rect x="-170" y="-34" width="170" height="60" rx="14" fill="#ffd23f" stroke="${INK}" stroke-width="6"/><text x="-85" y="10" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="34" fill="${INK}">${lbl}</text></g>`;
  return s + `<text x="0" y="${y0 + 64}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="26" fill="#fff6e0" stroke="${INK}" stroke-width="6" paint-order="stroke">FREITAS</text></g>`;
}
