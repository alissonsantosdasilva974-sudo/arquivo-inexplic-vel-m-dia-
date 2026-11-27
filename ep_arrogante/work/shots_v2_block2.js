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
    return scene3(T, c, { night: 0.6, actors: [act(1700, () => M3(c, FW + 200, 1700, { t: T, face: -1, hurt: hit, wag: hit ? 0 : 0.6 })),
      act(1690, () => hit ? ballP(c, FW + 120 - bq * 160, Math.sin(bq * Math.PI) * 60 + 10, 1690 - bq * 80, T * 700) : ballP(c, FW + 120 - (1 - inv(44.2, 44.25, T)) * 120, 20, 1690, T * 700))] }, BLUE,
      comic(T, 44.25, 'POF!', 540, 520, { size: 130, fill: '#ff7a45' }) + popIcon(T, 44.9, `<rect x="-140" y="-50" width="280" height="90" rx="18" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="#e8609a">MAVIE</text>`, 540, 400));
  } },
  // 29 — ganiu e se escondeu atrás do banco
  { t0: 46.2, draw(t, T) {
    const run = E.inOut(inv(47.4, 48.4, T)), mX = lerp(FW + 40, FW + 200, run), mD = lerp(1600, 1900, run);
    const c = camOn(FW + 160, 1750, 3.2, 1560, 110, 0);
    return scene3(T, c, { night: 0.6, bench: { X: FW + 160, D: 1780 }, actors: [act(mD, () => M3(c, mX, mD, { t: T, face: 1, hurt: T < 47.4, wag: 0 }))] }, BLUE, comic(T, 46.6, 'CAIM!', 540, 520, { size: 110, fill: '#8fd0f0' }));
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
    const c = camOn(0, 1400, lerp(1.4, 1.5, t / 1.9), 1700, 25, lerp(-60, 60, t / 1.9), 620, 3);
    const ppl = [[-330, 1250, 2], [-200, 1150, 5], [250, 1200, 8], [380, 1300, 11]].map(([X, D, i], k) => act(D, () => onP(c, NPC_IDS[i], X, D, { t: T + k, face: X < 0 ? 0.5 : -0.5, ly: -1, expr: 'surprised' })));
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
    const c = camOn(-40, 1450, 1.9, 2600, 10, 0, 620, Math.sin(T * 0.8) * 2);
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
    const kneel = E.out(inv(82.9, 83.5, T)), c = camOn(150, 1500, 3.6, 2050, 40, 0);
    const fr = () => { const p = PP(c, 30, 0, 1530); return person('freitas', { x: p.x, y: p.y + kneel * 75 * PS * p.k, s: PS * p.k, t: T, face: 0.6, expr: 'sad', mouth: talk(T, [[84.0, 84.8]]), armL: 40, armR: 60, bendL: 90, bendR: 70, handR: 'open', shadow: false }); };
    return scene3(T, c, { actors: [act(1530, fr), act(1460, () => M3(c, 230, 1460, { t: T, face: -1, wag: inv(84.2, 85.0, T) * 0.7 }))] }, SEPIA, popIcon(T, 84.1, bubble('DESCULPA', 360, 58), 540, 380));
  } },
  // 45 — a Mavie lambe a cara dele
  { t0: 85.5, draw(t, T) {
    const lick = Math.max(0, Math.sin(T * 10)), c = camOn(100, 1500, 5.0, 2250, 60, 0);
    const p = PP(c, 30, 0, 1530);
    const fr = person('freitas', { x: p.x, y: p.y + 75 * PS * p.k, s: PS * p.k, t: T, face: 0.5, expr: 'laugh', mouth: 0.6, shadow: false });
    const m = PP(c, 170, 0, 1490);
    const mv = `<g transform="translate(${f2(m.x - lick * 20)} ${f2(m.y - 150 * PS * m.k)}) rotate(-22)">${mavie(0, 0, { t: T, face: -1, s: 0.36 * m.k, wag: 1 })}</g>`;
    return scene3(T, c, { actors: [act(1530, () => fr), act(1490, () => mv)] }, SEPIA, comic(T, 85.8, 'SLURP!', 540, 440, { size: 110, fill: '#ee8aaa' }));
  } },
  // 46 — Saci: "Arrogante."
  { t0: 87.2, xf: 0.35, draw(t, T) {
    const c = camOn(290, 1440, lerp(4.8, 5.2, t / 2.3), 1800, 150, -20, 620, 4);
    const e = exprAt(T, [[87.2, 'happy'], [88.3, 'smug']]);
    return scene3(T, c, { actors: [act(1440, () => S3(c, T, 290, 1440, { id: 'saciSem', face: 0.3, expr: e.expr, squash: e.pop, wink: T > 88.3, armL: 30, armR: 30, bendL: 120, bendR: 120 }))] }, ORANGE);
  } },
  // 47 — os dois riem (câmera em arco)
  { t0: 89.5, draw(t, T) {
    const b = Math.sin(T * 16) * 0.03, c = camOn(140, 1450, 2.4, 1600, 150, lerp(-160, 160, E.inOut(t / 1.8)));
    return scene3(T, c, { actors: [act(1450, () => F3(c, T, 0, 1450, { face: 0.4, expr: 'laugh', mouth: 0.8, squash: b, armR: 120, bendR: 30, handR: 'open' })), act(1451, () => S3(c, T, 290, 1450, { id: 'saciSem', face: -0.4, expr: 'laugh', mouth: 0.8, squash: -b, armL: 120, bendL: 30, handL: 'open' })), act(1400, () => M3(c, 140, 1380, { t: T, face: 1, wag: 1 }))] }, ORANGE, comic(T, 90.2, 'HAHAHA', 540, 500, { size: 100 }));
  } },
  // 48 — Polo apita o fim do jogo (contra-plongée)
  { t0: 91.3, draw(t, T) {
    const c = camOn(680, 1100, 3.0, 1700, 40, 0, 620, -3);
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
