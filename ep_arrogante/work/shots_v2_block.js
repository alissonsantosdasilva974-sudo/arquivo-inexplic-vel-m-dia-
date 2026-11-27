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
    const c = camOn(60, 1300, 2.3, 1500, 60, 0);
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
    const c = camOn(0, 1500, 1.9, 1820, 230, 0);
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
  // 20 — Polo anota na súmula (câmera de cima)
  { t0: 29.1, draw(t, T) {
    const c = camOn(680, 1100, 3.4, 1900, 520, 40);
    const w = Math.sin(T * 14) * 5;
    return scene3(T, c, { actors: [act(1100, () => P3o(c, T, 680, 1100, { face: 0.2, expr: 'neutral', ly: 1, lx: 0.3, armL: 40, bendL: 90, holdL: clipboard(-10, 1.1), armR: 45 + w * 0.5, bendR: 95 }))] }, ORANGE, comic(T, 29.8, 'RISC RISC', 540, 480, { size: 70, fill: '#fff6e0' }));
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
