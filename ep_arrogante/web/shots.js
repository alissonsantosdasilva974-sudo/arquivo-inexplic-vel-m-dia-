// Ep. "Nesta cidade, quem fica arrogante cresce" — praça com campinho de terra, fim de tarde.
// Padrão do canal (motor ep2 v4). Sem verde: campo de terra, ipês rosa/amarelo, gol branco.
const SHOTS = [];
const G = 900, S0 = 0.62;
const ORANGE = ['#f0a060', 0.12], BLUE = ['#3a4a8a', 0.22], SEPIA = ['#a87a4a', 0.26];
const POLO = (o) => Object.assign({ hat: 'fedora', pocketNote: true, whistle: true }, o);
// altura do Freitas (m) ao longo do episódio
const HGT = T => T < 27.0 ? 1.75 : T < 34.9 ? lerp(1.75, 1.77, E.back(inv(27.0, 27.6, T))) : T < 54.4 ? lerp(1.77, 1.87, E.back(inv(34.9, 35.5, T))) :
  T < 77.6 ? lerp(1.87, 3.0, E.back(inv(54.5, 56.0, T))) : kf(T, [[77.6, 3.0], [79.4, 2.45], [80.2, 2.0], [82.2, 1.75]]);
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

SHOTS.push(
  // 1 — gancho: Polo em close + a regra na tela; atrás, o Freitas estica
  { t0: 0, draw(t, T) {
    const s = S0 * lerp(1, 1.5, E.back(inv(1.8, 2.6, T)));
    const fr = FR(T, { x: 1090, y: G, s, expr: T > 1.8 ? 'smug' : 'happy', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open', squash: -0.1 * pulse(T, 2.1, 0.3) });
    const po = PO(T, { x: 820, y: G + 40, s: S0 * 1.1, face: 0.3, expr: T > 1.9 ? 'surprised' : 'neutral', lx: 0.8, ly: -0.6 });
    return { cam: push(focus(950, 690, 1.75, 1080), t, 3.8, 0.06), layers: pitch(T, t, fr + po, { goal: 1450 }), tint: ORANGE, over: ruleBanner(T, 0) + comic(T, 1.8, 'ESTICA!', 820, 700, { size: 80, fill: '#ff7a45' }) };
  } },
  // 2 — "Eu sou o Polo. Apito os jogos da praça"
  { t0: 3.8, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: 0, expr: 'happy', armR: T > 4.6 ? 150 : 20, bendR: 40, handR: 'open' });
    return { cam: push(frameG(960, G, 1.9, 1250), t, 2.3, 0.08), layers: pitch(T, t, po, { goal: 1500 }), tint: ORANGE, over: comic(T, 4.75, 'PRIII!', 700, 560, { size: 100 }) };
  } },
  // 3 — "vi tudo isso de perto" (close, olhos espiando)
  { t0: 6.1, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: Math.sin(T * 2) * 0.6, expr: 'smug', lx: Math.sin(T * 2), headTilt: Math.sin(T * 2) * 5 });
    return { cam: push(focus(960, 700, 3.4, 800), t, 2.0, 0.1), layers: pitch(T, t, po), tint: ORANGE };
  } },
  // 4 — amigos desde pequenos (lembrança em sépia)
  { t0: 8.0, draw(t, T) {
    const hi = pulse(T, 9.8, 0.35);
    const a = FR(T, { x: 860, y: G, s: S0 * 0.7, face: 0.6, expr: 'laugh', armR: 140 + hi * 20, bendR: 0, handR: 'open', mouth: 0 });
    const b = SA(T, { x: 1060, y: G, s: S0 * 0.7, face: -0.6, expr: 'laugh', armL: 140 + hi * 20, bendL: 0, handL: 'open', mouth: 0 });
    return { cam: push(frameG(960, G, 2.0, 1250), t, 2.7, 0.07), layers: pitch(T, t, a + b + ball(960, G - 12, 20)), tint: SEPIA, over: flashBorder() + comic(T, 9.8, 'TOCA!', 540, 520, { size: 90 }) };
  } },
  // 5 — jogavam bola todo fim de tarde (Freitas correndo com a bola)
  { t0: 10.7, draw(t, T) {
    const x = lerp(500, 1500, t / 2.1);
    const fr = FR(T, { x, y: G, s: S0, face: 0.8, side: true, walk: T * 11, run: 1, expr: 'happy' });
    const bx = x + 70 + Math.abs(Math.sin(T * 11)) * 20;
    return { cam: frameG(x, G, 1.6, 1300), layers: pitch(T, t, fr + ball(bx, G - 14 - Math.abs(Math.sin(T * 5.5)) * 30, 20, T * 600), { goal: 1700, front: speedLines(x - 250, 750, 6, 120, 0, 0.6, 3) }), tint: ORANGE };
  } },
  // 6 — Saci era o goleiro
  { t0: 12.8, draw(t, T) {
    const clap = Math.abs(Math.sin(T * 9));
    const sa = SA(T, { x: 960, y: G, s: S0, face: 0, expr: 'happy', armL: 60 + clap * 20, armR: 60 + clap * 20, bendL: 60, bendR: 60, squash: -0.04 * clap });
    return { cam: push(frameG(960, G, 2.1, 1250), t, 1.4, 0.06), layers: pitch(T, t, sa, { goal: 960 }), tint: ORANGE, over: comic(T, 13.6, 'GOLEIRO', 540, 520, { size: 80, fill: '#5ab0d8' }) };
  } },
  // 7 — Freitas, o craque
  { t0: 14.1, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: S0, face: 0.2, expr: 'smug', wink: 1, armR: 30, bendR: 120, holdR: ball(0, -30, 22, T * 100) });
    const st = [0, 1, 2].map(i => `<path transform="translate(${960 + Math.cos(T * 3 + i * 2.1) * 140} ${600 + Math.sin(T * 3 + i * 2.1) * 30}) scale(0.9)" d="M 0 -20 L 6 -6 L 20 -6 L 9 3 L 13 18 L 0 9 L -13 18 L -9 3 L -20 -6 L -6 -6 Z" fill="#ffd23f" stroke="${INK}" stroke-width="4"/>`).join('');
    return { cam: push(focus(960, 720, 2.8, 860), t, 1.3, 0.08), layers: pitch(T, t, fr + st), tint: ORANGE };
  } },
  // 8 — "mas o craque tinha um problema" (Polo desconfiado)
  { t0: 15.4, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: -0.3, expr: 'worried', lx: -1, armL: 50, bendL: 110, handL: 'point' });
    return { cam: push(focus(960, 700, 3.0, 820), t, 2.1, 0.12), layers: pitch(T, t, po), tint: ORANGE, over: popIcon(T, 16.2, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="200" fill="#ff7a45" stroke="${INK}" stroke-width="12" paint-order="stroke">?</text>`, 820, 520) };
  } },
  // 9 — gol de bicicleta
  { t0: 17.5, draw(t, T) {
    const p = inv(17.6, 19.0, T), ang = lerp(0, 200, E.inOut(p)), jy = Math.sin(p * Math.PI) * 220;
    const s = S0;
    const fr = `<g transform="translate(760 ${f2(G - 140 - jy)}) rotate(${f2(-ang)}) translate(0 ${f2(120 * s)})">${FR(T, { x: 0, y: 0, s, expr: 'surprised', armL: 120, armR: 120, bendL: 10, bendR: 10, handL: 'open', handR: 'open', shadow: false })}</g>`;
    const bp = inv(18.9, 19.5, T);
    const bx = T < 18.9 ? 760 : lerp(760, 1460, bp), by = T < 18.9 ? lerp(G - 600, G - 380 - jy, E.in(p)) : lerp(G - 400, G - 180, bp);
    return { cam: push(frameG(880, G, 1.3, 1300), t, 2.4, 0.06), layers: pitch(T, t, `<ellipse cx="760" cy="${G + 4}" rx="70" ry="12" fill="#1b1424" opacity="0.2"/>` + fr + ball(bx, by, 22, T * 900), { goal: 1460 }), tint: ORANGE, over: comic(T, 19.2, 'GOL!', 640, 560, { size: 150 }) };
  } },
  // 10 — parado de braços abertos, olhando a torcida
  { t0: 19.9, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: S0, face: 0, expr: 'smug', armL: 105, armR: 105, bendL: 0, bendR: 0, handL: 'open', handR: 'open', headTilt: -6 });
    let crowd = ''; for (let i = 0; i < 6; i++) crowd += person(NPC_IDS[i * 3], { x: 420 + i * 230, y: G - 150, s: S0 * 0.62, t: T + i, face: 0, expr: 'joy', armL: 150 + Math.sin(T * 9 + i) * 20, armR: 150 + Math.cos(T * 9 + i) * 20, bendL: 0, bendR: 0, jump: Math.abs(Math.sin(T * 6 + i)) * 20 });
    return { cam: push(frameG(960, G, 1.6, 1350), t, 3.3, 0.1), layers: pitch(T, t, crowd + fr), tint: ORANGE, over: comic(T, 21.8, 'UHUUU!', 540, 480, { size: 90 }) };
  } },
  // 11 — "Eu sou arrogante mesmo. E daí?"
  { t0: 23.2, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: S0, face: 0.2, expr: 'smug', armL: 40, armR: 40, bendL: 100, bendR: 100, headTilt: -8 + Math.sin(T * 3) * 3 });
    return { cam: push(focus(960, 690, 3.6, 780), t, 2.8, 0.08), layers: pitch(T, t, fr), tint: ORANGE, over: popIcon(T, 24.4, bubble('E DAÍ?', 340, 72), 640, 360) };
  } },
  // 12 — cresceu dois centímetros
  { t0: 26.0, draw(t, T) {
    const s = FS(T);
    const fr = FR(T, { x: 900, y: G, s, face: 0.1, expr: T > 27 ? 'surprised' : 'smug', squash: -0.12 * pulse(T, 27.2, 0.25) });
    const po = PO(T, { x: 1250, y: G, s: S0, face: -0.6, expr: 'surprised', mouth: 0 });
    return { cam: push(frameG(1050, G, 1.9, 1300), t, 2.4, 0.05), layers: pitch(T, t, fr + po), tint: ORANGE, over: popIcon(T, 27.1, `<rect x="-150" y="-60" width="300" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+2 cm</text>`, 560, 420) };
  } },
  // 13 — Saci riu
  { t0: 28.4, draw(t, T) {
    const sa = SA(T, { x: 960, y: G, s: S0, face: -0.2, expr: 'laugh', mouth: 0.8, squash: 0.03 * Math.sin(T * 20), armL: 30, bendL: 120 });
    return { cam: focus(960, 700, 3.4, 800), layers: pitch(T, t, sa, { goal: 960 }), tint: ORANGE, over: comic(T, 28.5, 'HAHA', 760, 520, { size: 90 }) };
  } },
  // 14 — Polo anota na súmula
  { t0: 29.1, draw(t, T) {
    const w = Math.sin(T * 14) * 5;
    const po = PO(T, { x: 960, y: G, s: S0, face: 0.2, expr: 'neutral', ly: 1, lx: 0.3, armL: 40, bendL: 90, holdL: clipboard(-10, 1.1), armR: 45 + w * 0.5, bendR: 95 });
    return { cam: push(focus(990, 760, 3.0, 860), t, 1.8, 0.08), layers: pitch(T, t, po), tint: ORANGE, over: comic(T, 29.8, 'RISC RISC', 540, 480, { size: 70, fill: '#fff6e0' }) };
  } },
  // 15 — na semana seguinte, mais um gol
  { t0: 30.9, draw(t, T) {
    const kick = pulse(T, 32.4, 0.3);
    const fr = FR(T, { x: 800, y: G, s: FS(T), face: 0.8, side: true, walk: 1.2 * kick, expr: 'angry' });
    const bp = inv(32.4, 33.1, T);
    return { cam: push(frameG(1000, G, 1.5, 1300), t, 2.3, 0.06), layers: pitch(T, t, fr + ball(lerp(860, 1500, bp), G - 14 - Math.sin(bp * Math.PI) * 200, 20, T * 800), { goal: 1550 }), tint: ORANGE,
      over: popIcon(T, 31.0, calendar('+7'), 540, 400, 0.9 * clamp(1 - (T - 32.2) * 3)) + comic(T, 32.7, 'GOL!', 640, 560, { size: 130 }) };
  } },
  // 16 — "Arrogante!", gritou. Cresceu mais dez
  { t0: 33.2, draw(t, T) {
    const s = FS(T);
    const fr = FR(T, { x: 960, y: G, s, face: 0, expr: T < 34.6 ? 'angry' : 'smug', mouth: Math.max(talkF(T), T < 34.4 ? 0.7 : 0), armR: 170, bendR: 10, armL: 20, squash: -0.15 * pulse(T, 35.1, 0.25) });
    return { cam: push(frameG(960, G, 1.55, 1350), t, 2.9, 0.06), layers: pitch(T, t, fr), tint: ORANGE, over: comic(T, 33.4, 'ARROGANTE!', 540, 480, { size: 96, fill: '#ff7a45', life: 1.1 }) + popIcon(T, 35.0, `<rect x="-170" y="-60" width="340" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+10 cm</text>`, 540, 420) };
  } },
  // 17 — olhava todo mundo de cima
  { t0: 36.1, draw(t, T) {
    const fr = FR(T, { x: 900, y: G, s: FS(T) * 1.06, face: 0.3, expr: 'smug', ly: 1, lx: 1, headTilt: 8, armL: 20, armR: 20, bendL: 140, bendR: 140 });
    const a = person(NPC_IDS[1], { x: 1180, y: G, s: S0 * 0.86, t: T, face: -0.6, expr: 'worried', ly: -1 }), b = person(NPC_IDS[4], { x: 1360, y: G, s: S0 * 0.8, t: T + 1, face: -0.6, expr: 'sad', ly: -1 });
    return { cam: push(frameG(1080, G, 1.6, 1350), t, 2.3, 0.06), layers: pitch(T, t, fr + a + b), tint: ORANGE };
  } },
  // 18 — nem abaixava pra passar na porta (TÓIN)
  { t0: 38.4, draw(t, T) {
    const x = Math.min(lerp(700, 1140, t / 0.9), 1140) - (T > 39.4 ? 30 * E.out(inv(39.4, 39.6, T)) : 0);
    const fr = FR(T, { x, y: G, s: FS(T) * 1.12, face: 0.8, side: true, walk: T < 39.3 ? T * 8 : null, expr: T > 39.4 ? 'surprised' : 'smug', tilt: T > 39.4 ? -8 : 0 });
    return { cam: push(frameG(1060, G, 1.7, 1350), t, 1.9, 0.05), layers: [...pitchBack(t), Lr(1, pitchGround() + doorway(1200, G, 0.8) + fr), Lr(1.05, `<path d="M ${1200 - 101} ${G} V ${G - 277} H ${1200 - 80} V ${G}" fill="#efe2c4" stroke="${INK}" stroke-width="4"/>`)], tint: ORANGE, over: comic(T, 39.45, 'TÓIN!', 700, 520, { size: 110 }) };
  } },
  // 19 — "Aí veio o pior" (vira azul)
  { t0: 40.3, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: 0, expr: 'worried', mouth: talk(T, [[40.4, 41.5]]) });
    return { cam: push(focus(960, 700, 3.6, 800), t, 1.6, 0.14), layers: pitch(T, t, po, { night: 0.6 }), tint: BLUE };
  } },
  // 20 — chutou a bola com raiva
  { t0: 41.8, draw(t, T) {
    const k = pulse(T, 42.15, 0.25);
    const fr = FR(T, { x: 700, y: G, s: FS(T), face: 0.8, side: true, walk: 1.3 * k, expr: 'angry', mouth: 0 });
    const bp = inv(42.2, 43.6, T);
    return { cam: { ...push(frameG(900, G, 1.5, 1300), t, 1.8, 0.06), x: push(frameG(900, G, 1.5, 1300), t, 1.8, 0.06).x + shake(T, 42.2) }, layers: pitch(T, t, fr + ball(lerp(760, 1800, bp), G - 14 - Math.sin(bp * Math.PI) * 120, 20, T * 1200), { night: 0.6 }), tint: BLUE, over: comic(T, 42.2, 'PÁ!', 600, 560, { size: 120, fill: '#ff7a45' }) };
  } },
  // 21 — acertou a Mavie, a cachorrinha da praça
  { t0: 43.6, draw(t, T) {
    const hit = T > 44.15;
    const bx = hit ? lerp(1000, 1300, inv(44.15, 44.8, T)) : lerp(500, 1000, inv(43.6, 44.15, T)), by = hit ? G - 100 - Math.sin(inv(44.15, 44.8, T) * Math.PI) * 120 : G - 80;
    const mv = mavie(960, G, { t: T, face: -1, s: 0.75, hurt: hit, wag: hit ? 0 : 0.6 });
    return { cam: { ...push(frameG(980, G, 2.4, 1250), t, 2.6, 0.08), x: frameG(980, G, 2.4, 1250).x + shake(T, 44.2, 18) }, layers: pitch(T, t, mv + ball(bx, by, 20, T * 900), { night: 0.6 }), tint: BLUE,
      over: comic(T, 44.2, 'POF!', 540, 520, { size: 130, fill: '#ff7a45' }) + popIcon(T, 44.9, `<rect x="-140" y="-50" width="280" height="90" rx="18" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="#e8609a">MAVIE</text>`, 540, 400) };
  } },
  // 22 — ganiu e se escondeu atrás do banco
  { t0: 46.2, draw(t, T) {
    const mx = lerp(700, 1080, E.inOut(inv(47.4, 48.5, T)));
    const mv = mavie(mx, G - 6, { t: T, face: 1, s: 0.7, hurt: T < 47.4 });
    return { cam: push(frameG(1000, G, 2.2, 1300), t, 3.0, 0.06), layers: [...pitchBack(t, { night: 0.6 }), Lr(1, pitchGround() + mv), Lr(1.02, bench(1120, G + 14, 1.2))], tint: BLUE, over: comic(T, 46.6, 'CAIM!', 540, 520, { size: 110, fill: '#8fd0f0' }) };
  } },
  // 23 — Saci largou as luvas
  { t0: 49.2, draw(t, T) {
    const off = T > 49.9, gp = inv(49.9, 50.8, T);
    const sa = SA(T, { x: 960, y: G, s: S0, face: 0, expr: 'angry', semLuva: off, armL: off ? 40 : 20, armR: off ? 40 : 20, bendL: 20, bendR: 20 });
    const gl = (sx) => mitt(0, 0, -10, 0, GLOVE, 'open');
    const gloves = off ? `<g transform="translate(${f2(960 - 160 * gp)} ${f2(G - 140 + gp * 130 - Math.sin(gp * Math.PI) * 120)}) rotate(${f2(gp * 300)}) scale(0.9)">${gl()}</g><g transform="translate(${f2(960 + 160 * gp)} ${f2(G - 140 + gp * 130 - Math.sin(gp * Math.PI) * 110)}) rotate(${f2(-gp * 280)}) scale(0.9)">${gl()}</g>` : '';
    return { cam: push(frameG(960, G, 2.0, 1300), t, 2.2, 0.07), layers: pitch(T, t, sa + gloves, { night: 0.6, goal: 960 }), tint: BLUE, over: comic(T, 50.6, 'PLOFT', 540, 520, { size: 90 }) };
  } },
  // 24 — "Pra que jogar a bola na Mavie?"
  { t0: 51.4, draw(t, T) {
    const sa = SA(T, { x: 960, y: G, s: S0, face: 0.2, expr: 'angry', semLuva: 1, armR: 60, bendR: 40, handR: 'point', headTilt: Math.sin(T * 6) * 3 });
    return { cam: { ...push(focus(960, 700, 3.4, 780), t, 1.7, 0.1), x: push(focus(960, 700, 3.4, 780), t, 1.7, 0.1).x + shake(T, 51.5, 8) }, layers: pitch(T, t, sa, { night: 0.6 }), tint: BLUE };
  } },
  // 25 — deu de ombros, cresceu mais um metro
  { t0: 53.1, draw(t, T) {
    const sh = pulse(T, 53.9, 0.4);
    const fr = FR(T, { x: 960, y: G, s: FS(T), face: 0, expr: 'smug', armL: 30 + sh * 20, armR: 30 + sh * 20, bendL: 100 * sh + 10, bendR: 100 * sh + 10, handL: 'open', handR: 'open', headTilt: sh * 8 });
    return { cam: lerpCam(frameG(960, G, 2.0, 1450), frameG(960, G, 1.0, 1550), E.inOut(inv(54.4, 55.6, T))), layers: pitch(T, t, fr, { night: 0.6 }), tint: BLUE,
      over: popIcon(T, 55.0, `<rect x="-180" y="-60" width="360" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+1 METRO</text>`, 540, 340) };
  } },
  // 26 — três metros (geral: gente pequena em volta)
  { t0: 55.8, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: FS(T), face: 0, expr: 'neutral', armL: 10, armR: 10 });
    let ppl = ''; [[620, 2], [760, 5], [1170, 8], [1320, 11]].forEach(([x, i], k) => ppl += person(NPC_IDS[i], { x, y: G + 30, s: S0 * 0.9, t: T + k, face: x < 960 ? 0.5 : -0.5, ly: -1, expr: 'surprised' }));
    return { cam: push(frameG(960, G, 0.95, 1500), t, 1.9, 0.05), layers: pitch(T, t, fr + ppl, { night: 0.6 }), tint: BLUE, over: popIcon(T, 56.7, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="120" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">3 m</text>`, 540, 420) };
  } },
  // 27 — ninguém alcançava (gente pulando)
  { t0: 57.7, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: FS(T), face: 0, expr: 'neutral', ly: -1 });
    let ppl = ''; [[760, 2], [1150, 8]].forEach(([x, i], k) => ppl += person(NPC_IDS[i], { x, y: G + 20, s: S0 * 0.9, t: T, face: x < 960 ? 0.5 : -0.5, ly: -1, expr: 'worried', armL: 170, armR: 170, bendL: 0, bendR: 0, handL: 'open', handR: 'open', jump: Math.abs(Math.sin(T * 7 + k * 1.5)) * 70 }));
    return { cam: push(frameG(960, G, 1.3, 1500), t, 1.5, 0.06), layers: pitch(T, t, fr + ppl, { night: 0.6 }), tint: BLUE };
  } },
  // 28 — ninguém falava com ele (gente indo embora)
  { t0: 59.2, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: FS(T), face: 0, expr: 'sad', ly: 1 });
    let ppl = ''; [[700, 2, -1], [1220, 8, 1]].forEach(([x, i, d], k) => ppl += person(NPC_IDS[i], { x: x + d * t * 240, y: G + 20, s: S0 * 0.9, t: T, face: d * 0.8, side: true, walk: T * 8 }));
    return { cam: push(frameG(960, G, 1.1, 1500), t, 1.4, 0.05), layers: pitch(T, t, fr + ppl, { night: 0.6 }), tint: BLUE, over: popIcon(T, 59.6, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="84" fill="#fffaf0" stroke="${INK}" stroke-width="10" paint-order="stroke">sozinho</text>`, 540, 420) };
  } },
  // 29 — Polo se aproxima e olha pra cima
  { t0: 60.6, draw(t, T) {
    const px = lerp(500, 780, E.out(clamp(t / 1.5)));
    const po = PO(T, { x: px, y: G + 10, s: S0, face: 0.7, side: t < 1.5, walk: t < 1.5 ? T * 8 : null, expr: 'worried', ly: -1, lx: 0.5 });
    const fr = FR(T, { x: 1060, y: G, s: FS(T), face: -0.3, expr: 'sad' });
    return { cam: push(frameG(900, G, 1.0, 1500), t, 2.3, 0.08), layers: pitch(T, t, fr + po, { night: 0.6 }), tint: BLUE };
  } },
  // 30 — "Freitas, o que você ganhou, ficando tão alto?"
  { t0: 62.9, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: 0.4, expr: 'worried', ly: -1, lx: 0.6, headTilt: -10, armR: 70, bendR: 60, handR: 'open' });
    return { cam: push(focus(960, 690, 3.4, 900), t, 3.4, 0.1), layers: pitch(T, t, po + `<g opacity="0.9">${leavesWind(T, 6)}</g>`, { night: 0.6 }), tint: BLUE, over: popIcon(T, 64.0, bubble('O QUE VOCÊ GANHOU?', 640, 50), 540, 330) };
  } },
  // 31 — calado, só o vento (rosto lá no alto)
  { t0: 66.3, draw(t, T) {
    const s = FS(T);
    const fr = FR(T, { x: 960, y: G, s, face: Math.sin(T * 0.8) * 0.3, expr: 'sad', blink: 0, headTilt: Math.sin(T) * 3 });
    return { cam: push(focus(960, G - 300 * s, 2.6, 820), t, 2.7, 0.06), layers: [...pitch(T, t, fr, { night: 0.7 }), Lr(1.3, leavesWind(T, 16))], tint: BLUE, over: comic(T, 67.6, 'FFFUUU...', 540, 380, { size: 70, fill: '#c8d8f0', life: 1.4, rot: 0 }) };
  } },
  // 32 — Saci sobe no banco (lembrança/sépia)
  { t0: 69.0, draw(t, T) {
    const up = E.back(inv(69.8, 70.5, T));
    const fr = FR(T, { x: 1080, y: G, s: FS(T), face: -0.4, expr: 'sad', ly: 1, lx: -1 });
    const sa = SA(T, { x: 800, y: G + 10 - up * 70, s: S0, face: 0.6, expr: 'worried', semLuva: 1, ly: -1, lx: 1, squash: 0.06 * pulse(T, 70.5, 0.15) });
    return { cam: push(frameG(950, G, 1.2, 1500), t, 2.0, 0.05), layers: pitch(T, t, bench(800, G + 18, 1.2) + fr + sa), tint: SEPIA };
  } },
  // 33 — estendeu os braços e abraçou a perna dele
  { t0: 71.0, draw(t, T) {
    const s = FS(T), arm = lerp(30, 85, E.inOut(inv(71.1, 72.2, T)));
    const fr = FR(T, { x: 960, y: G, s, face: 0, expr: T > 72.4 ? 'surprised' : 'sad', ly: 1 });
    const sa = person('saciSem', { x: 900, y: G + 10 - 70, s: S0, t: T, back: true, armL: arm, armR: arm, bendL: 50, bendR: 50 });
    const hearts = T > 72.4 ? popIcon(T, 72.4, `<path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#e86a7a" stroke="${INK}" stroke-width="7"/>`, 540, 700, 1.1) : '';
    return { cam: push(frameG(930, G, 1.55, 1550), t, 2.9, 0.06), layers: pitch(T, t, bench(900, G + 18, 1.2) + fr + sa), tint: SEPIA, over: hearts };
  } },
  // 34 — "Desce daí, craque. Eu não sei jogar sem você."
  { t0: 73.9, draw(t, T) {
    const sa = SA(T, { x: 960, y: G, s: S0, face: 0.2, expr: T < 75.2 ? 'happy' : 'sad', semLuva: 1, ly: -1, lx: 0.4, headTilt: -8 });
    return { cam: push(focus(960, 690, 3.4, 820), t, 3.0, 0.09), layers: pitch(T, t, sa), tint: SEPIA, over: popIcon(T, 74.1, bubble('DESCE DAÍ!', 420, 64), 540, 330) };
  } },
  // 35 — começou a encolher
  { t0: 76.9, draw(t, T) {
    const fr = FR(T, { x: 960, y: G, s: FS(T), face: 0, expr: 'surprised', ly: -0.3, squash: 0.05 * Math.sin(T * 25) * (T > 77.6 ? 1 : 0) });
    return { cam: lerpCam(frameG(960, G, 1.0, 1550), frameG(960, G, 1.4, 1500), E.inOut(clamp(t / 2.1))), layers: pitch(T, t, fr), tint: SEPIA, over: comic(T, 77.8, 'FIUUU...', 540, 420, { size: 90, life: 1.2 }) };
  } },
  // 36 — um metro, dois, até ficar do tamanho de sempre
  { t0: 79.0, draw(t, T) {
    const fr = FR(T, { x: 900, y: G, s: FS(T), face: 0.3, expr: T > 82 ? 'happy' : 'surprised' });
    const sa = SA(T, { x: 1200, y: G, s: S0, face: -0.5, expr: 'happy', semLuva: 1 });
    return { cam: push(frameG(1040, G, 1.5, 1450), t, 3.9, 0.08), layers: pitch(T, t, fr + sa), tint: SEPIA, over: comic(T, 79.2, '-1 m', 540, 440, { size: 110 }) + comic(T, 79.95, '-2 m', 540, 440, { size: 110 }) + popIcon(T, 82.0, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">1,75 m</text>`, 540, 420) };
  } },
  // 37 — ajoelhou e pediu desculpa à Mavie
  { t0: 82.9, draw(t, T) {
    const fr = FR(T, { x: 980, y: G + 120, s: S0, face: 0.6, expr: 'sad', mouth: talk(T, [[84.0, 84.8]]), armL: 40, armR: 60, bendL: 90, bendR: 70, handR: 'open' });
    const ground = `<rect x="-1400" y="${G}" width="4720" height="800" fill="#d9ab74"/><rect x="-1400" y="${G}" width="4720" height="800" fill="url(#pPlaster)"/>`;
    const mv = mavie(1220, G + 40, { t: T, face: -1, s: 0.8, wag: inv(84.2, 85.0, T) * 0.6 });
    return { cam: push(focus(1080, 800, 2.3, 860), t, 2.6, 0.06), layers: [...pitchBack(t), Lr(1, fr), Lr(1.0, ground + mv)], tint: SEPIA, over: popIcon(T, 84.1, bubble('DESCULPA', 360, 58), 540, 380) };
  } },
  // 38 — Mavie lambeu a cara dele
  { t0: 85.5, draw(t, T) {
    const lick = Math.max(0, Math.sin(T * 10));
    const fr = FR(T, { x: 980, y: G + 110, s: S0, face: 0.5, expr: 'laugh', mouth: 0.6 });
    const ground = `<rect x="-1400" y="${G}" width="4720" height="800" fill="#d9ab74"/>`;
    const mv = `<g transform="translate(${f2(1120 - lick * 20)} ${G - 60}) rotate(-20)">${mavie(0, 0, { t: T, face: -1, s: 0.85, wag: 1 })}</g>`;
    return { cam: push(focus(1040, 740, 2.7, 860), t, 1.7, 0.08), layers: [...pitchBack(t), Lr(1, fr), Lr(1.0, ground + mv)], tint: SEPIA, over: comic(T, 85.8, 'SLURP!', 540, 440, { size: 110, fill: '#ee8aaa' }) };
  } },
  // 39 — Saci só disse: "Arrogante."
  { t0: 87.2, draw(t, T) {
    const sa = SA(T, { x: 960, y: G, s: S0, face: 0.3, expr: 'smug', wink: 1, semLuva: 1, armL: 30, armR: 30, bendL: 120, bendR: 120 });
    return { cam: push(focus(960, 700, 3.4, 820), t, 2.3, 0.08), layers: pitch(T, t, sa), tint: ORANGE };
  } },
  // 40 — e os dois riram
  { t0: 89.5, draw(t, T) {
    const b = Math.sin(T * 16) * 0.03;
    const fr = FR(T, { x: 850, y: G, s: S0, face: 0.4, expr: 'laugh', mouth: 0.8, squash: b, armR: 120, bendR: 30, handR: 'open' });
    const sa = SA(T, { x: 1080, y: G, s: S0, face: -0.4, expr: 'laugh', mouth: 0.8, squash: -b, semLuva: 1, armL: 120, bendL: 30, handL: 'open' });
    const mv = mavie(965, G + 40, { t: T, face: 1, s: 0.55, wag: 1 });
    return { cam: push(frameG(965, G, 2.0, 1300), t, 1.8, 0.07), layers: pitch(T, t, fr + sa + mv), tint: ORANGE, over: comic(T, 90.2, 'HAHAHA', 540, 500, { size: 100 }) };
  } },
  // 41 — Polo apita o fim do jogo
  { t0: 91.3, draw(t, T) {
    const po = PO(T, { x: 960, y: G, s: S0, face: 0, expr: 'happy', armR: 150, bendR: 10, handR: 'open', armL: 60, bendL: 90, squash: -0.06 * pulse(T, 91.6, 0.2) });
    return { cam: push(frameG(960, G, 2.0, 1300), t, 1.7, 0.08), layers: pitch(T, t, po, { goal: 1500 }), tint: ORANGE, over: comic(T, 91.5, 'PRIIIII!', 700, 640, { size: 110, life: 1.2 }) + popIcon(T, 92.2, `<rect x="-210" y="-60" width="420" height="110" rx="22" fill="#fffaf0" stroke="${INK}" stroke-width="8"/><text y="26" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="${INK}">FIM DE JOGO</text>`, 540, 300) };
  } },
  // 42 — pergunta final + loop (volta ao close do Polo com a regra)
  { t0: 93.0, draw(t, T) {
    const po = PO(T, { x: 820, y: G + 40, s: S0 * 1.1, face: 0.3, expr: T < 95.5 ? 'worried' : 'happy', lx: 0.6 });
    const fr = FR(T, { x: 1090, y: G, s: S0 * 1.5, face: -0.3, expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' });
    const q = T < 95.5 ? popIcon(T, 93.1, `<rect x="-450" y="-110" width="900" height="210" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="${INK}">VOCÊ ABRAÇARIA UM</text><text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#e8503a">AMIGO ARROGANTE?</text>`, 540, 400)
      : popIcon(T, 95.5, `<rect x="-460" y="-100" width="920" height="200" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">COMENTA</text><text y="68" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="3" paint-order="stroke">ABRAÇO ou DEIXO</text>`, 540, 400);
    return { cam: push(focus(950, 690, 1.75, 1080), t, 5.0, 0.06), layers: pitch(T, t, fr + po, { goal: 1450 }), tint: ORANGE, over: q };
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
