// Especial "Hospital Santa Clara" — cenas. Tudo em coordenadas de tela (1080 x 1920); legenda fica em y≈1300.
// Polo do especial: person('poloPB') — boina, paletó, colete, calça risca de giz. Sem verde.
const SHOTS = [];
const PB = o => P_('poloPB', Object.assign({ s: 1.25 }, o));
const NIGHTT = ['#2a3466', 0.18];
const DARKT = ['#141a3a', 0.35];
const lantern = (r = 18) => flashlightProp(r);

SHOTS.push(
  // 0 — GANCHO: fachada sob chuva, alarme piscando, zoom lento
  { t0: 0, draw(t, T) { return { cam: C(1.12 + 0.05 * t / 3.5, 0, -40), layers: [L(1, facade(T, { alarm: 1 })), L(1.3, rain(T, 110, 0.6))], tint: NIGHTT }; } },
  // 1 — "hoje, às três da manhã": relógio da recepção marcando 3:00
  { t0: 3.47, draw(t, T) { return { cam: C(1 + 0.08 * t / 2.7), layers: [L(1, fullBg('#2a2e44') + rect(-600, -600, 2280, 3120, 'url(#pPlaster)') + wallClock(540, 640, 230, T, 1) + plaque(540, 1000, 'RECEPÇÃO', 460, 52)), L(1, rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.16 * alarmK(T))}"`))] }; } },
  // 2 — alarme disparando no corredor vazio
  { t0: 6.21, draw(t, T) { return { cam: shakeC(T, 3, 1.05), layers: [L(1, corridor(T, { alarm: 1, flicker: 1 })), L(1, alarmBell(540, 320, 1.1, T)), L(1, bang(T, 6.6, 'TRRRIM!', 540, 560, { dur: 2.4, c: '#ff8a7a' }))] }; } },
  // 3 — Polo chuta a porta enferrujada (fachada de perto)
  { t0: 9.69, draw(t, T) {
    const kick = kf(t, [[0, 0], [0.9, 0], [1.1, 1], [1.6, 0.2]]), open = kf(t, [[0, 0], [1.05, 0], [1.4, 1, E.out]]);
    const polo = PB({ x: 380, y: 1400, s: 1.2, t: T, side: true, face: 1, expr: 'angry', walk: kick > 0.5 ? 1.2 : null });
    return { cam: shakeC(T, t > 1.05 && t < 1.4 ? 10 : 0, 1.5), layers: [L(1, facade(T, { doorOpen: open, doorX: 560 })), L(1, polo), L(1.2, rain(T, 90, 0.55)), L(1, bang(T, 10.75, 'PÁ!', 760, 980, { s: 1.2 }))], tint: NIGHTT };
  } },
  // 4 — Polo entra sob a chuva: silhueta na porta, visto de dentro
  { t0: 12.53, draw(t, T) {
    const s = fullBg('#0a0c14') + rect(300, 420, 480, 900, '#2a3458', `stroke="${OLh}" stroke-width="10"`) + `<g transform="translate(0 0)"><clipPath id="hDoor"><rect x="300" y="420" width="480" height="900"/></clipPath><g clip-path="url(#hDoor)">${rect(300, 420, 480, 900, '#3a4878')}${rain(T, 60, 0.7, 8)}</g></g>`;
    return { cam: C(1 + 0.06 * t), layers: [L(1, s), L(1, `<g opacity="0.95">${PB({ x: 540, y: 1300, s: lerp(1.1, 1.35, t / 1.2), t: T, walk: T * 6, expr: 'worried', pale: 0 })}</g>`), L(1, `<path d="M 300 1320 L 40 1900 L 1040 1900 L 780 1320 Z" fill="#3a4878" opacity="0.3"/>`)] };
  } },
  // 5 — corredor destruído; Polo de costas, andando devagar
  { t0: 13.69, draw(t, T) {
    const y = lerp(1500, 1380, t / 3.6);
    return { cam: C(1 + 0.05 * t / 3.6), layers: [L(1, corridor(T, { debris: 1, flicker: 1 })), L(1, PB({ x: 540, y, s: 1.3, t: T, back: true, walk: T * 4 }))], tint: NIGHTT };
  } },
  // 6 — cacos de vidro e maca virada, a lanterna varre o chão
  { t0: 17.27, draw(t, T) {
    const bx = lerp(200, 880, E.inOut(clamp(t / 1.9)));
    const floor = fullBg('#262c3c') + debris(11, 540, 700, 0.2) + gurney(560, 1080, 1.5, { tipped: 1 });
    return { cam: C(1.1), layers: [L(1, floor), L(1, beam(540, 1900, bx, 980, 200, 0.28)), L(1, flashDark(bx, 980, 420, 0.92))] };
  } },
  // 7 — "De repente": Polo para, rosto assustado
  { t0: 19.2, draw(t, T) { return { cam: C(2.1, 0, 190), layers: [L(1, corridor(T, { dark: 0.4 })), L(1, PB({ x: 540, y: 1500, t: T, expr: 'surprised', face: -0.5, lx: -1, armR: 60, bendR: 40, holdR: lantern(30) }))], tint: DARKT }; } },
  // 8 — a cadeira de rodas cruza o corredor sozinha
  { t0: 20.78, draw(t, T) {
    const x = lerp(-200, 1300, t / 3.1);
    return { cam: C(1.05), layers: [L(1, corridor(T, { dark: 0.35, debris: 1, seed: 7 })), L(1, wheelchair(x, 1180, 1.25, t * 260)), L(1, bang(T, 21.3, 'ÍÍÍC...', 540, 520, { dur: 1.6, fs: 100, c: '#cdd6f0', rot: 4 }))], tint: DARKT };
  } },
  // 9 — Polo aponta a lanterna
  { t0: 23.87, draw(t, T) {
    const a = kf(t, [[0, 20], [0.5, 95]]);
    return { cam: C(1.6, -60, 160), layers: [L(1, corridor(T, { dark: 0.6 })), L(1, PB({ x: 420, y: 1460, t: T, side: true, face: 1, expr: 'worried', armR: a, bendR: 0, holdR: lantern(90) })), L(1, beam(560, 990, 1200, 900, 260, 0.3 * clamp(t / 0.5)))], tint: DARKT };
  } },
  // 10 — mas não havia ninguém: corredor vazio no círculo da lanterna
  { t0: 25.25, draw(t, T) { const bx = 540 + Math.sin(t * 2) * 140; return { cam: C(1.15 + 0.05 * t), layers: [L(1, corridor(T, { dark: 0.5, debris: 1, seed: 9 })), L(1, wheelchair(840, 1050, 0.7, 30)), L(1, flashDark(bx, 860, 380, 0.95))] }; } },
  // 11 — ala cirúrgica: portas vaivém, placa
  { t0: 27.43, draw(t, T) {
    const sw = Math.sin(t * 5) * Math.exp(-t * 1.2) * 0.5;
    const s = fullBg('#3a4258') + rect(-600, -600, 2280, 3120, 'url(#pPlaster)') + plaque(540, 360, 'ALA CIRÚRGICA', 640, 64, '#ffb0a0') + rect(240, 520, 600, 700, '#0c0e16', `stroke="${OLh}" stroke-width="8"`) +
      `<g transform="translate(240 520) scale(${f2(1 - Math.abs(sw))} 1)">${rect(0, 0, 300, 700, '#c4c8d4', `stroke="${OLh}" stroke-width="7"`)}${rect(80, 120, 140, 110, HC.glass, `opacity="0.6" stroke="${OLh}" stroke-width="5"`)}</g>` +
      `<g transform="translate(840 520) scale(${f2(-(1 - Math.abs(sw)))} 1)">${rect(0, 0, 300, 700, '#c4c8d4', `stroke="${OLh}" stroke-width="7"`)}${rect(80, 120, 140, 110, HC.glass, `opacity="0.6" stroke="${OLh}" stroke-width="5"`)}</g>` + rect(-600, 1220, 2280, 900, '#262c3c');
    return { cam: C(1 + 0.04 * t), layers: [L(1, s), L(1, PB({ x: 540, y: 1260, s: 1.15, t: T, back: true, walk: T * 4, holdR: lantern(0), armR: 30 }))], tint: DARKT };
  } },
  // 12 — o impossível: Polo olha a sala de cirurgia (luminária, mesa)
  { t0: 29.6, draw(t, T) {
    const s = fullBg('#2e3448') + rect(-600, 1150, 2280, 900, '#20242e') + `<path d="M 540 160 V 360" stroke="${HC.metalD}" stroke-width="16"/><ellipse cx="540" cy="390" rx="220" ry="70" fill="#8a92a6" stroke="${OLh}" stroke-width="8"/>` + [-110, 0, 110].map(d => `<circle cx="${540 + d}" cy="392" r="40" fill="#3a3e4c" stroke="${OLh}" stroke-width="5"/>`).join('') + gurney(540, 1150, 1.7);
    return { cam: C(1.02 + 0.06 * t / 2.5), layers: [L(1, s), L(1, PB({ x: 220, y: 1350, s: 1.1, t: T, face: 0.7, expr: 'worried', lx: 1, holdR: lantern(10), armR: 40 }))], tint: DARKT };
  } },
  // 13 — "sem energia há décadas": quadro de luz morto, teia, poeira
  { t0: 32.1, draw(t, T) {
    const s = fullBg('#2a2e3e') + rect(-600, -600, 2280, 3120, 'url(#pPlaster)') + rect(300, 380, 480, 640, '#5a6070', `stroke="${OLh}" stroke-width="9" rx="12"`) + rect(340, 420, 400, 560, '#3a3e4a', `stroke="${OLh}" stroke-width="6"`) +
      [0, 1, 2, 3].map(i => rect(380 + (i % 2) * 180, 470 + Math.floor(i / 2) * 230, 140, 170, '#22252e', `stroke="${OLh}" stroke-width="5"`) + rect(430 + (i % 2) * 180, 560 + Math.floor(i / 2) * 230, 40, 60, '#8a8e98', `stroke="${OLh}" stroke-width="4"`)).join('') +
      `<path d="M 300 380 l 140 120 M 300 380 l 60 160 M 300 380 l 160 40 M 340 440 q 40 20 30 60" stroke="#e8e6f0" stroke-width="2.5" fill="none" opacity="0.6"/>` + plaque(540, 1110, 'DESLIGADO — 1994', 520, 44, '#ffb0a0');
    return { cam: C(1.05 + 0.1 * t / 2.7), layers: [L(1, s), L(1, specks(T, 200, 200, 700, 1000, 40))], tint: DARKT };
  } },
  // 14 — o monitor cardíaco liga sozinho na parede (linha vermelha)
  { t0: 34.84, draw(t, T) {
    const on = t > 0.7 ? (t < 1.0 ? (Math.sin(t * 60) > 0 ? 1 : 0) : 1) : 0;
    return { cam: C(1 + 0.12 * E.out(clamp(t / 2.8))), layers: [L(1, fullBg('#1e2232') + rect(-600, -600, 2280, 3120, 'url(#pPlaster)') + monitor(540, 700, 1.9, T, on)), L(1, bang(T, 35.6, 'BIP... BIP...', 540, 1080, { dur: 2.0, fs: 90, c: '#ff8a8a', rot: 0 }))] };
  } },
  // 15 — uma sombra passa correndo atrás da cortina
  { t0: 37.72, draw(t, T) {
    const sx = lerp(-200, 1250, clamp((t - 0.4) / 1.2));
    const sh = `<g opacity="0.75">${creature(sx, 1150, 0.95, T, { run: 1, dark: 1 })}</g>`;
    return { cam: C(1.02), layers: [L(1, fullBg('#20263a') + rect(-600, 1150, 2280, 900, '#1a1e28') + sh), L(1, curtain(60, 300, 960, 900, 0, T)), L(1, monitor(900, 220, 0.6, T, 1))], tint: DARKT };
  } },
  // 16 — Polo puxa a cortina com força
  { t0: 40.35, draw(t, T) {
    const open = kf(t, [[0, 0], [1.2, 0], [1.6, 1, E.out]]), pull = kf(t, [[0, 60], [1.2, 70], [1.6, 120]]);
    return { cam: C(1.12, 0, -40), layers: [L(1, fullBg('#20263a') + rect(-600, 1150, 2280, 900, '#1a1e28') + gurney(620, 1150, 1.4)), L(1, curtain(200, 300, 860, 880, open, T)), L(1, PB({ x: 200, y: 1400, t: T, side: true, face: 1, expr: 'angry', armR: pull, bendR: 10, handR: 'fist' }))], tint: DARKT };
  } },
  // 17 — vazio: a cama sem ninguém, Polo olha para trás
  { t0: 42.68, draw(t, T) { return { cam: C(1.2 + 0.05 * t), layers: [L(1, fullBg('#20263a') + rect(-600, 1150, 2280, 900, '#1a1e28') + gurney(540, 1150, 1.8) + monitor(860, 360, 0.7, T, 1)), L(1, curtain(-40, 300, 300, 880, 1, T)), L(1, PB({ x: 260, y: 1420, t: T, face: -0.6, expr: 'worried', lx: -1, holdR: lantern(20), armR: 30 }))], tint: DARKT }; } },
  // 18 — a porta de vidro bate e tranca
  { t0: 44.51, draw(t, T) {
    const shut = kf(t, [[0, 0.1], [0.6, 0.1], [0.75, 1, E.in]]), lock = t > 1.6;
    return { cam: shakeC(T, t > 0.75 && t < 1.0 ? 12 : 0, 1.05), layers: [L(1, fullBg('#1a1e2c') + rect(-600, 1250, 2280, 900, '#141820') + glassDoor(240, 380, 600, 870, shut, t > 0.75 ? 1 : 0) + (lock ? `<g transform="translate(790 820)"><rect x="-34" y="-10" width="68" height="56" rx="8" fill="${HC.metal}" stroke="${OLh}" stroke-width="5"/><path d="M -20 -10 v -24 a 20 20 0 0 1 40 0 v 24" stroke="${OLh}" stroke-width="8" fill="none"/></g>` : '')), L(1, bang(T, 45.27, 'BAM!', 540, 600, { s: 1.3 })), L(1, bang(T, 46.2, 'CLAC', 760, 1000, { fs: 90, c: '#cdd6f0', rot: 6 }))], tint: DARKT };
  } },
  // 19 — as luzes apagam: só a lanterna
  { t0: 47.96, draw(t, T) {
    const off = t > 0.3, fl = t < 0.3 && Math.sin(t * 90) > 0;
    return { cam: C(1.3, 0, -120), layers: [L(1, corridor(T, { dark: off ? 1 : fl ? 0.2 : 0 })), L(1, PB({ x: 540, y: 1420, t: T, expr: 'surprised', ly: -1, holdR: lantern(-10), armR: 70, bendR: 30 })), L(1, off ? flashDark(560, 900, 330, 0.97) : '')] };
  } },
  // 20 — passos pesados no duto de ar: teto e duto, poeira caindo a cada passo
  { t0: 49.04, draw(t, T) {
    const step = Math.floor(t * 2.4), jolt = (t * 2.4) % 1 < 0.15 ? 6 : 0;
    const duct = fullBg('#14161e') + rect(-600, 300, 2280, 340, '#5a6070', `stroke="${OLh}" stroke-width="10"`) + Array.from({ length: 9 }, (_, i) => `<path d="M ${i * 160 - 100} 300 V 640" stroke="${OLh}" stroke-width="6"/>`).join('') + grate(540, 660, 300, 1, Math.sin(T * 30) * jolt * 0.3);
    return { cam: C(1.05, 0, jolt), layers: [L(1, duct), L(1, specks(T, 340, 680, 400, 600, 30, '#a8a4b4', step, 260)), L(1, [0, 1, 2, 3].map(i => bang(T, 49.3 + i * 0.75, 'TUM', 220 + i * 210, 220 + (i % 2) * 60, { dur: 0.5, fs: 80, c: '#cdd6f0', rot: (i % 2 ? 8 : -8) })).join('')), L(1, flashDark(540, 640, 520, 0.85))] };
  } },
  // 21 — bem em cima da cabeça dele: Polo olha para cima, o duto acima
  { t0: 52.42, draw(t, T) {
    const jolt = Math.sin(T * 26) * 6;
    return { cam: C(1.25, 0, -60), layers: [L(1, fullBg('#0e1018') + rect(-600, 120, 2280, 260, '#4a5060', `stroke="${OLh}" stroke-width="8"`) + grate(540, 390, 260, 1, jolt * 0.4)), L(1, PB({ x: 540, y: 1520, s: 1.35, t: T, expr: 'surprised', ly: -1.2, headTilt: -6, holdR: lantern(-150), armR: 150, bendR: 20 })), L(1, beam(620, 980, 560, 380, 160, 0.3)), L(1, flashDark(560, 600, 560, 0.8))] };
  } },
  // 22 — a grade despenca
  { t0: 54.44, draw(t, T) {
    const y = 390 + 1100 * E.in(clamp(t / 0.6)), rot = t * 180;
    return { cam: shakeC(T, t > 0.6 && t < 0.9 ? 14 : 0, 1.1), layers: [L(1, fullBg('#0e1018') + rect(-600, 120, 2280, 260, '#4a5060', `stroke="${OLh}" stroke-width="8"`) + rect(410, 350, 260, 80, '#05060a')), L(1, grate(540, y, 260, 1.1, rot)), L(1, bang(T, 55.05, 'CRASH!', 540, 1000, { s: 1.2 })), L(1, flashDark(540, 700, 620, 0.75))] };
  } },
  // 23 — uma criatura alta, de camisola rasgada (revelação lenta, de baixo para cima)
  { t0: 55.51, draw(t, T) {
    const ty = lerp(260, -160, E.inOut(clamp(t / 3.0)));
    return { cam: C(1.15, 0, ty), layers: [L(1, corridor(T, { dark: 0.85 })), L(1, creature(540, 1500, 1.5, T, { dark: 0.25, glow: 1, tilt: 14 + Math.sin(T * 2) * 4 })), L(1, flashDark(540, 900 + ty, 560, 0.9))] };
  } },
  // 24 — caiu na frente de Polo
  { t0: 58.73, draw(t, T) {
    const land = E.out(clamp(t / 0.35)), y = lerp(500, 1260, land);
    return { cam: shakeC(T, t > 0.3 && t < 0.6 ? 12 : 0, 1.05), layers: [L(1, corridor(T, { dark: 0.8 })), L(1, creature(700, y, 1.0, T, { dark: 0.3, reach: t > 0.6, glow: 1 })), L(1, PB({ x: 260, y: 1340, s: 1.1, t: T, side: true, face: 1, expr: 'surprised', armL: 120, armR: 120, holdR: lantern(80), tilt: -6 })), L(1, flashDark(500, 900, 600, 0.75))] };
  } },
  // 25 — Polo empurra uma maca nela
  { t0: 60.37, draw(t, T) {
    const gx = lerp(420, 760, E.in(clamp(t / 0.7))), cx = 860 + (t > 0.7 ? 80 * E.out(clamp((t - 0.7) / 0.4)) : 0);
    return { cam: C(1.05), layers: [L(1, corridor(T, { dark: 0.8 })), L(1, creature(cx, 1260, 0.95, T, { dark: 0.3, tilt: t > 0.7 ? -20 : 12 })), L(1, gurney(gx, 1300, 1.1)), L(1, PB({ x: gx - 300, y: 1340, s: 1.1, t: T, side: true, face: 1, expr: 'angry', run: 1, walk: T * 10, armR: 90, armL: 90, bendR: 0 })), L(1, bang(T, 61.07, 'POW!', 760, 760)), L(1, flashDark(600, 900, 640, 0.7))] };
  } },
  // 26 — arromba a porta lateral
  { t0: 62.0, draw(t, T) {
    const open = E.out(clamp((t - 0.2) / 0.3));
    return { cam: shakeC(T, t > 0.2 && t < 0.5 ? 10 : 0, 1.2), layers: [L(1, fullBg('#1a1e2c') + rect(-600, 1250, 2280, 900, '#141820') + rect(320, 360, 440, 900, '#05060a', `stroke="${OLh}" stroke-width="8"`) + `<g transform="translate(320 360) scale(${f2(1 - open * 0.8)} 1)">${rect(0, 0, 440, 900, '#7a6a5e', `stroke="${OLh}" stroke-width="7"`)}${plaque(220, 160, 'SAÍDA', 260, 54, '#ffb0a0')}</g>`), L(1, PB({ x: lerp(160, 520, clamp(t / 1)), y: 1400, t: T, side: true, face: 1, run: 1, walk: T * 12, expr: 'angry' })), L(1, bang(T, 62.25, 'BLAM!', 700, 640))] };
  } },
  // 27 — dispara pelo corredor (vista lateral, corrida)
  { t0: 63.02, draw(t, T) {
    const off = (t * 900) % 600;
    let bg = fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820');
    for (let i = -1; i < 4; i++) bg += rect(i * 600 - off, 520, 220, 600, '#3a3036', `stroke="${OLh}" stroke-width="6"`) + rect(i * 600 - off + 320, 380, 160, 40, '#d8d2c0', `opacity="0.4"`);
    return { cam: C(1.15, 0, -60), layers: [L(1, bg), L(1, PB({ x: 540, y: 1300, t: T, side: true, face: 1, run: 1, walk: T * 13, expr: 'surprised' })), L(1, Array.from({ length: 6 }, (_, i) => `<path d="M ${-200 + ((i * 260 + t * 2200) % 1400)} ${700 + i * 90} h -160" stroke="#cdd6f0" stroke-width="6" opacity="0.4" stroke-linecap="round"/>`).join('')), L(1, flashDark(620, 900, 700, 0.7))] };
  } },
  // 28 — beco sem saída: parede no fim do corredor
  { t0: 65.27, draw(t, T) { return { cam: C(1.1 + 0.08 * t / 1.8), layers: [L(1, corridor(T, { dark: 0.7, endWall: 1 })), L(1, PB({ x: 540, y: 1480, s: 1.3, t: T, back: true })), L(1, bang(T, 65.6, '!', 540, 520, { fs: 200 }))], tint: DARKT }; } },
  // 29 — só um elevador velho
  { t0: 67.04, draw(t, T) { return { cam: C(1.15 + 0.08 * t), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(540, 1250, 0, T)), L(1, flashDark(540, 900, 560, 0.8))] }; } },
  // 30 — Polo aperta o botão desesperado
  { t0: 67.93, draw(t, T) {
    const press = Math.sin(t * 14) > 0;
    return { cam: C(1.55, 150, 90), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(380, 1250, 0, T, { press: 1 })), L(1, PB({ x: 760, y: 1400, s: 1.2, t: T, side: true, face: -1, expr: 'worried', armR: press ? 96 : 80, bendR: press ? -6 : 20, handR: 'point' })), L(1, bang(T, 68.4, 'CLIC CLIC CLIC', 540, 420, { dur: 2.6, fs: 70, c: '#ffd23f', rot: -4 }))], tint: DARKT };
  } },
  // 31 — a coisa dobra a esquina correndo na direção dele
  { t0: 71.67, draw(t, T) {
    const k = lerp(0.45, 1.25, E.in(clamp(t / 3.4)));
    return { cam: shakeC(T, 2 + 4 * t / 3.4, 1.05), layers: [L(1, corridor(T, { dark: 0.75, flicker: 1 })), L(1, creature(540, lerp(960, 1500, E.in(clamp(t / 3.4))), k, T, { run: 1, dark: 0.3, glow: 1, reach: t > 2.2 })), L(1, flashDark(540, 1000, 620, 0.75))] };
  } },
  // 32 — quando ele achou que era o fim: rosto de perto, olhos fechados
  { t0: 75.15, draw(t, T) { return { cam: C(2.6, 0, 200), layers: [L(1, fullBg('#1e2232') + elevator(540, 1700, 0, T)), L(1, PB({ x: 540, y: 1560, t: T, expr: 'worried', blink: 1, headTilt: -4 }))], tint: DARKT }; } },
  // 33 — as portas se abrem (luz quente)
  { t0: 77.06, draw(t, T) { const op = E.out(clamp(t / 1.2)); return { cam: C(1.2 + 0.05 * t), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(540, 1250, op, T)), L(1, bang(T, 77.3, 'DING', 540, 380, { fs: 100, c: '#fff4cc', rot: 0 }))] }; } },
  // 34 — uma mão agarra o sobretudo dele
  { t0: 78.62, draw(t, T) {
    const ext = E.back(clamp((t - 0.3) / 0.4));
    return { cam: C(1.35, 0, -60), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(540, 1250, 1, T)), L(1, PB({ x: 640, y: 1320, s: 1.15, t: T, back: true, tilt: t > 0.7 ? -6 : 0 })), L(1, grabHand(470, 1000, 1.1, ext, 180)), L(1, bang(T, 79.0, 'TCHAP!', 760, 640))] };
  } },
  // 35 — puxado para dentro; as portas fecham
  { t0: 81.22, draw(t, T) {
    const pull = E.in(clamp(t / 0.4)), close = E.inOut(clamp((t - 0.4) / 0.7));
    return { cam: C(1.2), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(540, 1250, 1 - close, T, { hand: `<g opacity="${f2(1 - pull)}">${PB({ x: lerp(620, 540, pull), y: 1240, s: lerp(1.1, 0.8, pull), t: T, back: true, tilt: -10 })}</g>` }))] };
  } },
  // 36 — quem estava naquele elevador? portas fechadas, andar descendo
  { t0: 82.46, draw(t, T) {
    const fl = ['T', '-1', '-2', '-3', '?'][Math.min(4, Math.floor(t / 0.7))];
    return { cam: C(1.1 + 0.1 * t / 3), layers: [L(1, fullBg('#1e2232') + rect(-600, 1250, 2280, 900, '#141820') + elevator(540, 1250, 0, T, { floor: '▼ ' + fl })), L(1, `<text x="540" y="${f2(560 + Math.sin(T * 3) * 10)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="300" fill="#ffd23f" stroke="${OLh}" stroke-width="20" paint-order="stroke" opacity="${f2(clamp((t - 1.2) / 0.5))}">?</text>`), L(1, flashDark(540, 900, 600, 0.75))] };
  } },
  // 37 — final: "COMENTE PARTE 2" sobre a fachada (emenda com o gancho)
  { t0: 85.58, xf: 0.4, draw(t, T) {
    const k = E.back(clamp((t - 2.9) / 0.4));
    const card = `<g transform="translate(540 420) scale(${f2(k)})"><rect x="-400" y="-110" width="800" height="220" rx="30" fill="${HC.red}" stroke="${OLh}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="64" fill="#fff">COMENTE</text><text y="78" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="88" fill="#ffd23f" stroke="${OLh}" stroke-width="10" paint-order="stroke">PARTE 2</text></g>`;
    return { cam: C(1.12, 0, -40), layers: [L(1, facade(T, { alarm: 1 })), L(1.3, rain(T, 110, 0.6)), L(1, card)], tint: NIGHTT };
  } },
);

// HUD: relógio "03:00" no canto, avançando com a história
function HUD(T) {
  const m = Math.min(59, Math.floor(T / 89.76 * 13));
  const ak = alarmK(T);
  return `<g transform="translate(870 210)"><rect x="-130" y="-46" width="260" height="92" rx="18" fill="#14101a" opacity="0.8" stroke="${HC.red}" stroke-width="5"/><circle cx="-96" cy="0" r="12" fill="${HC.red}" opacity="${f2(0.4 + 0.6 * ak)}"/><text x="16" y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="#ff8a8a" letter-spacing="4">03:${String(m).padStart(2, '0')}</text></g>`;
}
