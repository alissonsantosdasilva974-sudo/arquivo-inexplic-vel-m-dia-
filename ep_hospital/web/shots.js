// Especial "Hospital Santa Clara" v2 — cenas no padrão do ep. 2 (mundo com chão y=905, Polo s=0.62, câmera focus/frameG/push).
// Polo do especial: person('poloPB') — boina, paletó, colete, calça risca de giz. Sem verde.
const SHOTS = [];
const S6 = 0.62, HEAD = y => y - S6 * 250;                  // centro de cabeça+peito para close
const PB = o => P_('poloPB', Object.assign({ s: S6, t: 0 }, o));
const CR = (x, T, o = {}) => creature(x, o.y ?? GY, o.k ?? 0.5, T, o);  // criatura ~1,5x a altura do Polo
const torch = (r = 0) => `<g transform="scale(0.55)">${flashlightProp(r)}</g>`;
const povBg = c => Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="${c}"/><circle cx="960" cy="560" r="460" fill="${WARM}" opacity="0.1"/>`);
const pov = (T, inner, o = {}) => Lr(1, povHandsPB(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4, only: o.only }));
const CL = (x, z = 2.8, sy = 950) => focus(x, HEAD(GY), z, sy);     // close de cabeça e peito
const MD = (x, z = 2.0) => frameG(x, GY, z, 1250);  // pés acima da legenda                  // plano médio (corpo inteiro)

SHOTS.push(
  // 0 — GANCHO: fachada sob chuva, alarme piscando na janela
  { t0: 0, draw(t, T) { return { cam: push(focus(910, 330, 1.05, 820), t, 3.4, 0.08), layers: exteriorSet(T, t, '', { alarm: 1 }), tint: HN }; } },
  // 1 — o letreiro de perto, uma letra pisca
  { t0: 1.8, draw(t, T) { return { cam: push(focus(910, 90, 2.4, 760), t, 2.1, 0.06), layers: exteriorSet(T, t, '', { alarm: 1, fence: false }), tint: HN }; } },
  // 2 — "às três da manhã": relógio da recepção, alarme vermelho
  { t0: 5.96, draw(t, T) { return { cam: push(focus(540, 380, 2.2, 820), t, 2.7, 0.08), layers: receptionSet(T, t, '') }; } },
  // 3 — "o alarme de emergência disparou": sirene no corredor, tremendo
  { t0: 9.58, draw(t, T) {
    const bell = `<g transform="translate(980 40) scale(0.7)">${alarmBell(0, 0, 1, T)}</g>`;
    return { cam: { ...push(focus(980, 160, 1.9, 800), t, 3.4, 0.06), r: Math.sin(T * 40) * 0.6 }, layers: hallSet(T, t, bell, { alarm: 1, flicker: 1 }), over: comic(T, 9.68, 'TRRRIM!', 540, 380, { life: 2.6, fill: '#ff8a7a' }) };
  } },
  // 4 — Polo chega à porta na chuva (plano médio)
  { t0: 13.4, draw(t, T) {
    const x = lerp(400, 640, E.out(clamp(t / 0.8)));
    return { cam: push(MD(650, 1.9), t, 1.4, 0.05), layers: exteriorSet(T, t, PB({ x, y: GY, t: T, side: true, face: 1, walk: t < 0.8 ? T * 7 : null, expr: 'angry' })), tint: HN };
  } },
  // 5 — o chute: a porta enferrujada voa
  { t0: 14.93, draw(t, T) {
    const kick = clamp(t / 0.2), open = E.out(clamp((t - 0.15) / 0.35));
    const polo = PB({ x: 640, y: GY, t: T, side: true, face: 1, expr: 'angry', walk: 1.3 * kick, tilt: -8 * kick });
    return { cam: { ...push(MD(720, 2.1), t, 1.4, 0.05), x: push(MD(720, 2.1), t, 1.4).x + (t > 0.15 && t < 0.45 ? Math.sin(T * 70) * 14 : 0) }, layers: exteriorSet(T, t, polo, { doorOpen: open }), tint: HN, over: comic(T, 15.01, 'PÁ!', 700, 520, { size: 150 }) };
  } },
  // 6 — "entrou sob a chuva": de dentro, silhueta na porta com a chuva atrás
  { t0: 16.18, draw(t, T) {
    const y = GY, s = lerp(0.55, 0.7, t / 1.2);
    const door = `<g transform="translate(700 ${GY})">${rect(-170, -420, 340, 420, '#3a4878', `stroke="${OLh}" stroke-width="10"`)}<clipPath id="hD2"><rect x="-170" y="-420" width="340" height="420"/></clipPath><g clip-path="url(#hD2)" transform="translate(-500 -900)">${rain(T, 50, 0.8, 8)}</g></g>`;
    return { cam: push(MD(700, 2.2), t, 1.2, 0.06), layers: [...hallSet(T, t, door + PB({ x: 700, y, s, t: T, walk: T * 6, expr: 'worried', armR: 40, bendR: 30, holdR: torch(0) }), { debris: 1, lights: 0, fg: false }), darkLight(540, 900, 640, 0.55)], tint: HD };
  } },
  // 7 — corredor destruído: travelling lateral, Polo andando no meio dos cacos e macas viradas
  { t0: 18.54, draw(t, T) {
    const x = lerp(900, 1350, t / 3.6);
    const polo = PB({ x, y: GY, t: T, side: true, face: 1, walk: T * 5, expr: 'worried', armR: 70, bendR: 10, holdR: torch(90) }) + torchBeam(x + 70, GY - 150, x + 420, GY + 40, 70, 0.3);
    return { cam: push(MD(x + 60, 1.7), t, 3.6, 0.05), layers: [...hallSet(T, t, polo, { debris: 1, lights: 0, fgX: 1100 }), darkLight(560, 1000, 720, 0.5)], tint: HD };
  } },
  // 8 — POV: a lanterna nos cacos de vidro e na maca virada
  { t0: 21.58, draw(t, T) {
    const sweep = Math.sin(t * 1.6) * 60;
    const floorBits = `<g transform="translate(${-40 + sweep} -60)">${gurney(0, 120, 1.3, { tipped: 1 })}<g transform="translate(0 ${-GY - 40}) scale(1.6)">${brokenGlass(-200, 200, 9)}</g></g>`;
    return { cam: push(focus(960, 640, 1.0), t, 1.9, 0.06), layers: [povBg('#20263e'), Lr(1, `<g transform="translate(${960 + sweep * 2} 520)">${floorBits}<ellipse cx="0" cy="60" rx="380" ry="260" fill="#fff4c8" opacity="0.18"/></g>`), pov(T, torch(0), { only: 'R', k: 3.4, dy: 120 }), darkLight(540 + sweep, 760, 600, 0.75)] };
  } },
  // 9 — "De repente": close no Polo, para de andar
  { t0: 24.56, draw(t, T) { return { cam: push(CL(1200, 3.0), t, 1.5, 0.08), layers: [...hallSet(T, t, PB({ x: 1200, y: GY, t: T, face: -0.6, lx: -1, expr: 'surprised', armR: 70, bendR: 30, holdR: torch(40) }) + emote('excl', 1200, GY - S6 * 450, T - 24.72, 0.9), { debris: 1, lights: 0, fg: false }), darkLight(540, 800, 620, 0.45)], tint: HD }; } },
  // 10 — a cadeira de rodas cruza sozinha (perspectiva)
  { t0: 26.5, draw(t, T) {
    const x = lerp(-250, 1350, t / 3.1);
    return { cam: C(1.05), layers: [L(1, corridor(T, { dark: 0.15, debris: 1, seed: 7 })), L(1, wheelchair(x, 1180, 1.25, t * 260)), L(1, `<ellipse cx="540" cy="1200" rx="380" ry="60" fill="url(#gPool)" opacity="0.35"/>`), darkLight(540, 1000, 760, 0.45)], tint: HD, over: comic(T, 27.12, 'ÍÍÍC...', 540, 520, { life: 1.6, fill: '#cdd6f0', rot: 4, size: 96 }) };
  } },
  // 11 — Polo aponta a lanterna (plano médio, lado)
  { t0: 29.49, draw(t, T) {
    const a = kf(t, [[0, 25], [0.45, 92]]);
    const polo = PB({ x: 900, y: GY, t: T, side: true, face: 1, expr: 'worried', armR: a, bendR: 0, holdR: torch(90) });
    return { cam: push(MD(1080, 2.1), t, 1.4, 0.05), layers: [...hallSet(T, t, polo + (t > 0.4 ? torchBeam(985, GY - 175, 1500, GY - 120, 110, 0.32) : ''), { debris: 1, lights: 0, fg: false }), darkLight(560, 900, 680, 0.5)], tint: HD };
  } },
  // 12 — "mas não havia ninguém": POV, corredor vazio no círculo da lanterna
  { t0: 31.38, draw(t, T) { const bx = 540 + Math.sin(t * 2) * 140; return { cam: C(1.12 + 0.05 * t), layers: [L(1, corridor(T, { dark: 0.2, debris: 1, seed: 9 })), L(1, wheelchair(840, 1050, 0.7, 30)), darkLight(bx, 860, 420, 0.85)] }; } },
  // 13 — "ala cirúrgica": portas vaivém balançando, Polo entra de costas
  { t0: 33.8, draw(t, T) {
    const sw = Math.sin(t * 5) * Math.exp(-t * 1.2) * 0.5;
    const doors = `<g transform="translate(600 0)">${rect(-20, GY - 470, 520, 470, '#0c0e16', `stroke="${OLh}" stroke-width="8"`)}<g transform="translate(-10 ${GY - 460}) scale(${f2(1 - Math.abs(sw))} 1)">${rect(0, 0, 250, 460, '#c4c8d4', `stroke="${OLh}" stroke-width="7"`)}${rect(70, 80, 110, 90, HC.glass, `opacity="0.6" stroke="${OLh}" stroke-width="5"`)}</g><g transform="translate(490 ${GY - 460}) scale(${f2(-(1 - Math.abs(sw)))} 1)">${rect(0, 0, 250, 460, '#c4c8d4', `stroke="${OLh}" stroke-width="7"`)}${rect(70, 80, 110, 90, HC.glass, `opacity="0.6" stroke="${OLh}" stroke-width="5"`)}</g>${rect(20, GY - 560, 440, 70, '#1e2236', `stroke="${OLh}" stroke-width="6" rx="8"`)}<text x="240" y="${GY - 511}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="40" fill="#ffb0a0">ALA CIRÚRGICA</text></g>`;
    return { cam: push(MD(840, 1.9), t, 2.1, 0.05), layers: [...hallSet(T, t, doors + PB({ x: 840, y: GY + 40, s: 0.7, t: T, back: true, walk: T * 4, armR: 40, holdR: torch(0) }), { lights: 0, fg: false }), darkLight(540, 860, 700, 0.45)], tint: HD };
  } },
  // 14 — "o impossível aconteceu": sala de cirurgia, Polo de lado olhando
  { t0: 36.1, draw(t, T) { return { cam: push(MD(700, 1.8), t, 2.5, 0.06), layers: [...surgerySet(T, t, PB({ x: 380, y: GY, t: T, face: 0.7, lx: 1, expr: 'worried', armR: 60, bendR: 20, holdR: torch(60) }) + torchBeam(450, GY - 180, 820, GY - 260, 120, 0.25)), darkLight(560, 860, 720, 0.45)], tint: HD }; } },
  // 15 — "sem energia há décadas": quadro de luz morto, teia e poeira
  { t0: 38.84, draw(t, T) {
    const box = `<g transform="translate(540 ${GY - 520})">${rect(-150, -200, 300, 400, '#5a6070', `stroke="${OLh}" stroke-width="9" rx="12"`)}${rect(-124, -174, 248, 348, '#3a3e4a', `stroke="${OLh}" stroke-width="6"`)}${[0, 1, 2, 3].map(i => rect(-104 + (i % 2) * 120, -150 + Math.floor(i / 2) * 160, 90, 130, '#22252e', `stroke="${OLh}" stroke-width="5"`) + rect(-74 + (i % 2) * 120, -100 + Math.floor(i / 2) * 160, 30, 46, '#8a8e98', `stroke="${OLh}" stroke-width="4"`)).join('')}<path d="M -150 -200 l 90 80 M -150 -200 l 40 110 M -150 -200 l 110 26 M -120 -160 q 30 14 20 40" stroke="#e8e6f0" stroke-width="2.5" fill="none" opacity="0.7"/>${rect(-170, 220, 340, 50, '#1e2236', `stroke="${OLh}" stroke-width="5" rx="6"`)}<text y="256" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="30" fill="#ffb0a0">DESLIGADO — 1994</text></g>`;
    return { cam: push(focus(540, GY - 460, 2.4, 900), t, 2.7, 0.1), layers: [...hallSet(T, t, box + dust(T, 340, 100, 400, 700, 30, 4, '#e8e4d8'), { lights: 0, fg: false }), darkLight(540, 820, 700, 0.4)], tint: HD };
  } },
  // 16 — o monitor cardíaco liga sozinho (linha vermelha), close grande
  { t0: 42.02, draw(t, T) {
    const on = t > 0.7 ? (t < 1.0 ? (Math.sin(t * 60) > 0 ? 1 : 0) : 1) : 0;
    return { cam: push(focus(1600, 330, 3.2, 820), t, 2.8, 0.1), layers: surgerySet(T, t, '', { monitor: on, fg: false }), tint: HD, over: comic(T, 42.81, 'BIP... BIP...', 540, 420, { life: 2.0, fill: '#ff8a8a', rot: 0, size: 96 }) };
  } },
  // 17 — Polo vira assustado para o monitor
  { t0: 44.19, draw(t, T) { return { cam: push(CL(900, 3.0), t, 1.0, 0.08), layers: [...surgerySet(T, t, PB({ x: 900, y: GY, t: T, face: 0.8, lx: 1, expr: 'surprised', pale: 0.4, armR: 60, bendR: 20, holdR: torch(60) }) + emote('sweat', 860, GY - S6 * 400, T - 44.32, 0.9), { monitor: 1, fg: false }), L0(rect(-600, -600, 2280, 3120, HC.red, 'opacity="0.1"'))], tint: HD }; } },
  // 18 — uma sombra passa correndo atrás da cortina
  { t0: 46.54, draw(t, T) {
    const sx = lerp(300, 1400, clamp((t - 0.3) / 1.6));
    const shadow = '';
    const cur = `<g transform="translate(0 0)">${curtain(240, 160, 1200, GY - 140, 0, T)}</g>`;
    return { cam: push(MD(840, 1.75), t, 2.6, 0.05), layers: [...surgerySet(T, t, cur + `<g opacity="0.55" filter="none">${CR(sx, T, { run: 1, dark: 1, k: 0.5 }).replace(/fill="#[0-9a-fA-F]{6}"/g, 'fill="#14101a"').replace(/stroke="#[0-9a-fA-F]{6}"/g, 'stroke="#14101a"')}</g>`, { monitor: 1, fg: false }), Lr(1.3, ivStand(300, 1.3))], tint: HD };
  } },
  // 19 — "Polo puxou o pano com força": POV, a mão agarra a cortina e puxa
  { t0: 49.46, draw(t, T) {
    const pull = E.out(clamp((t - 0.9) / 0.4));
    return { cam: push(focus(960, 640, 1.0), t, 2.3, 0.06), layers: [povBg('#2a3050'), Lr(1, `<g transform="translate(${-pull * 900} 0)">${curtain(360, 0, 1300, 1400, 0, T)}</g>`), pov(T, '', { only: 'R', k: 2.2, dy: lerp(0, 40, pull) })], over: comic(T, 49.84, 'FRUSH!', 640, 520, { size: 110 }) };
  } },
  // 20 — "vazio": a cama sem ninguém
  { t0: 51.84, draw(t, T) { return { cam: push(focus(820, GY - 200, 2.0, 1000), t, 1.8, 0.1), layers: [...surgerySet(T, t, curtain(240, 160, 200, GY - 140, 1, T), { monitor: 1, sheet: 1, fg: false }), darkLight(560, 900, 640, 0.45)], tint: HD }; } },
  // 21 — "Nesse exato segundo": Polo de costas, olha para trás
  { t0: 53.22, draw(t, T) { return { cam: push(CL(800, 2.8), t, 1.5, 0.08), layers: [...surgerySet(T, t, PB({ x: 800, y: GY, t: T, face: -0.9, lx: -1.2, expr: 'worried', armR: 50, bendR: 20, holdR: torch(30) }), { monitor: 1, fg: false }), darkLight(540, 820, 640, 0.45)], tint: HD }; } },
  // 22 — a porta de vidro bate e tranca
  { t0: 55.14, draw(t, T) {
    const shut = kf(t, [[0, 0.1], [0.6, 0.1], [0.75, 1, E.in]]), lock = t > 1.6;
    const door = glassDoor(420, GY - 620, 420, 620, shut, t > 0.75 ? 1 : 0) + (lock ? `<g transform="translate(800 ${GY - 300})"><rect x="-34" y="-10" width="68" height="56" rx="8" fill="${HC.metal}" stroke="${OLh}" stroke-width="5"/><path d="M -20 -10 v -24 a 20 20 0 0 1 40 0 v 24" stroke="${OLh}" stroke-width="8" fill="none"/></g>` : '');
    const c = push(focus(640, GY - 320, 2.0, 950), t, 3.4, 0.05);
    return { cam: { ...c, x: c.x + (t > 0.75 && t < 1.0 ? Math.sin(T * 70) * 14 : 0) }, layers: [...hallSet(T, t, door, { lights: 0, fg: false }), darkLight(560, 860, 700, 0.4)], tint: HD, over: comic(T, 55.75, 'BAM!', 540, 480, { size: 160 }) + comic(T, 56.32, 'CLAC', 760, 640, { size: 90, fill: '#cdd6f0', rot: 6 }) };
  } },
  // 23 — as luzes apagam: close no Polo, só a lanterna no rosto
  { t0: 57.76, draw(t, T) {
    const off = t > 0.3, fl = t < 0.3 && Math.sin(t * 90) > 0;
    return { cam: push(CL(800, 2.9), t, 1.1, 0.06), layers: [...hallSet(T, t, PB({ x: 800, y: GY, t: T, expr: 'surprised', ly: -0.5, armR: 70, bendR: 60, holdR: torch(-20) }), { lights: off ? 0 : fl ? 0 : 1, fg: false }), ...(off ? [darkLight(560, 700, 420, 0.92)] : [])] };
  } },
  // 24 — passos pesados no duto: o teto com a grade, poeira caindo a cada passo
  { t0: 59.9, draw(t, T) {
    const jolt = (t * 2.4) % 1 < 0.15 ? 1 : 0;
    const duct = `<g transform="translate(0 0)">${rect(-900, -400, 3800, 260, '#5a6070', `stroke="${OLh}" stroke-width="10"`)}${Array.from({ length: 24 }, (_, i) => `<path d="M ${i * 160 - 900} -400 V -140" stroke="${OLh}" stroke-width="6"/>`).join('')}${grate(800, -120, 240, 1, Math.sin(T * 30) * jolt * 2)}</g>`;
    const c = push(focus(800, -40, 2.2, 700), t, 3.3, 0.05);
    return { cam: { ...c, y: c.y + jolt * 6 }, layers: [...hallSet(T, t, duct + dust(T, 680, -100, 240, 500, 24, Math.floor(t * 2.4), '#c8c4d4'), { lights: 0, fg: false }), darkLight(540, 760, 560, 0.6)],
      over: [0, 1, 2, 3].map(i => comic(T, 60.23 + i * 0.75, 'TUM', 300 + i * 160, 300 + (i % 2) * 60, { life: 0.5, size: 80, fill: '#cdd6f0', rot: i % 2 ? 8 : -8 })).join('') };
  } },
  // 25 — "bem em cima da cabeça dele": Polo olha para cima, a grade logo acima
  { t0: 63.52, draw(t, T) {
    const j = Math.sin(T * 26) * 1.5;
    const duct = `<g transform="translate(0 180)">${rect(-900, -400, 3800, 260, '#5a6070', `stroke="${OLh}" stroke-width="10"`)}${grate(800, -120, 240, 1, j)}</g>`;
    return { cam: push(focus(800, 330, 1.15, 760), t, 2.0, 0.05), layers: [...hallSet(T, t, duct + PB({ x: 800, y: GY, t: T, expr: 'surprised', ly: -1.4, headTilt: -8, armR: 160, bendR: 10, holdR: torch(-170) }) + torchBeam(840, GY - 330, 800, 70, 80, 0.3), { lights: 0, fg: false }), darkLight(540, 900, 760, 0.4)], tint: HD };
  } },
  // 26 — a grade despenca
  { t0: 65.64, draw(t, T) {
    const y = -120 + 1000 * E.in(clamp(t / 0.55)), rot = t * 200;
    const duct = `<g transform="translate(0 180)">${rect(-900, -400, 3800, 260, '#5a6070', `stroke="${OLh}" stroke-width="10"`)}${rect(680, -150, 240, 60, '#05060a')}</g>` + grate(800, y + 180, 240, 1, rot);
    const c = push(focus(760, 330, 1.15, 760), t, 1.0, 0.05);
    return { cam: { ...c, y: c.y + (t > 0.55 && t < 0.85 ? Math.sin(T * 60) * 14 : 0) }, layers: [...hallSet(T, t, duct + PB({ x: 600, y: GY, t: T, side: true, face: 1, expr: 'surprised', tilt: -10, armL: 150, armR: 150 }), { lights: 0, fg: false }), darkLight(540, 900, 760, 0.4)], tint: HD, over: comic(T, 66.3, 'CRASH!', 540, 520, { size: 140 }) };
  } },
  // 27 — "uma criatura alta": revelação de baixo para cima
  { t0: 67.36, draw(t, T) {
    const q = E.inOut(clamp(t / 2.9)), fy = lerp(GY - 60, GY - 330, q);
    return { cam: focus(800, fy, 2.6, 900), layers: [...hallSet(T, t, CR(800, T, { dark: 0.2, glow: 1, tilt: 14 + Math.sin(T * 2) * 4 }), { lights: 0, fg: false }), darkLight(540, 820, 620, 0.6)], tint: HD };
  } },
  // 28 — caiu na frente de Polo (plano médio, os dois)
  { t0: 69.86, draw(t, T) {
    const land = E.out(clamp(t / 0.35)), y = lerp(GY - 350, GY, land);
    const c = push(MD(820, 1.45), t, 1.6, 0.05);
    return { cam: { ...c, y: c.y + (t > 0.3 && t < 0.55 ? Math.sin(T * 60) * 10 : 0) }, layers: [...hallSet(T, t, PB({ x: 600, y: GY, t: T, side: true, face: 1, expr: 'surprised', armL: 120, armR: 110, holdR: torch(80), tilt: -6 }) + CR(980, T, { y, dark: 0.25, reach: t > 0.6, glow: 1, k: 0.52 }), { lights: 0, fg: false }), darkLight(560, 880, 700, 0.45)], tint: HD, over: comic(T, 70.16, 'TÓIM!', 760, 420, { size: 100, fill: '#cdd6f0' }) };
  } },
  // 29 — Polo empurra a maca nela
  { t0: 71.74, draw(t, T) {
    const gx = lerp(820, 1100, E.in(clamp(t / 0.6))), hit = t > 0.6, cx = 1250 + (hit ? 90 * E.out(clamp((t - 0.6) / 0.4)) : 0);
    const sc = PB({ x: gx - 240, y: GY, t: T, side: true, face: 1, expr: 'angry', run: 1, walk: T * 10, armR: 90, armL: 90, bendR: 0 }) + gurney(gx, GY, 0.62) + CR(cx, T, { dark: 0.25, tilt: hit ? -24 : 12, k: 0.52 });
    return { cam: push(MD(1000, 1.45), t, 1.6, 0.05), layers: [...hallSet(T, t, sc, { lights: 0, fg: false }), darkLight(560, 880, 720, 0.45)], tint: HD, over: comic(T, 72.2, 'POW!', 700, 460, { size: 140 }) };
  } },
  // 30 — arromba a porta lateral
  { t0: 73.32, draw(t, T) {
    const x = lerp(1000, 1260, clamp(t / 1.0));
    return { cam: { ...push(MD(1250, 2.0), t, 1.0, 0.05), r: t > 0.2 && t < 0.45 ? Math.sin(T * 60) * 1.2 : 0 }, layers: [...hallSet(T, t, PB({ x, y: GY, t: T, side: true, face: 1, run: 1, walk: T * 12, expr: 'angry', armR: 100, bendR: 0 }), { lights: 0, fg: false, openDoor: '106', openK: E.out(clamp((t - 0.25) / 0.3)) }), darkLight(560, 880, 720, 0.45)], tint: HD, over: comic(T, 73.51, 'BLAM!', 640, 440, { size: 140 }) };
  } },
  // 31 — dispara pelo corredor (travelling, linhas de velocidade)
  { t0: 74.04, draw(t, T) {
    const x = 400 + t * 700;
    const lines = Array.from({ length: 6 }, (_, i) => `<path d="M ${x - 120 - ((i * 90 + t * 900) % 400)} ${GY - 260 + i * 40} h -140" stroke="#cdd6f0" stroke-width="6" opacity="0.45" stroke-linecap="round"/>`).join('');
    return { cam: MD(x + 80, 2.0), layers: [...hallSet(T, t, lines + PB({ x, y: GY, t: T, side: true, face: 1, run: 1, walk: T * 13, expr: 'surprised' }), { lights: 0, fgX: x + 500 }), darkLight(600, 900, 720, 0.45)], tint: HD };
  } },
  // 32 — beco sem saída: parede no fim (perspectiva), Polo de costas
  { t0: 76.6, draw(t, T) { return { cam: C(1.08 + 0.08 * t / 1.8), layers: [L(1, corridor(T, { dark: 0.3, endWall: 1 })), L(1, P_('poloPB', { x: 540, y: 1560, s: 1.6, t: T, back: true })), darkLight(540, 900, 700, 0.5)], tint: HD, over: comic(T, 77.13, '!!!', 540, 400, { size: 160, fill: '#ff5a3c' }) }; } },
  // 33 — só restava um elevador velho
  { t0: 78.18, draw(t, T) { return { cam: push(focus(760, GY - 300, 1.9, 900), t, 1.7, 0.08), layers: [...elevatorSet(T, t, '', { floor: 0 }), darkLight(540, 860, 680, 0.45)], tint: HD }; } },
  // 34 — POV: aperta o botão desesperado
  { t0: 80.14, draw(t, T) {
    const press = Math.sin(t * 14) > 0;
    const panel = `<g transform="translate(1180 560) scale(2.2)">${rect(-30, -100, 60, 200, '#c9a24a', `stroke="${OLh}" stroke-width="5" rx="10"`)}<circle cx="0" cy="-36" r="20" fill="${press ? '#ffb04a' : '#6a2a14'}" stroke="${OLh}" stroke-width="5"/><circle cx="0" cy="36" r="20" fill="#5a3a20" stroke="${OLh}" stroke-width="5"/>${press ? `<circle cx="0" cy="-36" r="60" fill="#ffb04a" opacity="0.25"/>` : ''}</g>`;
    const d = press ? 0 : 70, tx = 1180 + d * 0.55, ty = 481 + d;
    const arm = `<path d="M ${f2(tx + 260)} ${f2(ty + 1500)} L ${f2(tx + 70)} ${f2(ty + 230)}" stroke="${OL}" stroke-width="170" stroke-linecap="round"/><path d="M ${f2(tx + 260)} ${f2(ty + 1500)} L ${f2(tx + 70)} ${f2(ty + 230)}" stroke="#3a3a46" stroke-width="152" stroke-linecap="round"/><g transform="translate(${f2(tx + 70)} ${f2(ty + 230)}) rotate(-8)"><rect x="-80" y="-14" width="160" height="44" rx="14" fill="#f4f1ea" stroke="${OL}" stroke-width="7"/></g><g transform="translate(${f2(tx + 40)} ${f2(ty + 140)})"><ellipse cx="0" cy="0" rx="82" ry="92" fill="#1d1a22" stroke="${OL}" stroke-width="8"/><path d="M -34 -60 L -40 -140" stroke="${OL}" stroke-width="50" stroke-linecap="round"/><path d="M -34 -60 L -40 -140" stroke="#1d1a22" stroke-width="36" stroke-linecap="round"/><path d="M 60 -20 Q 100 -40 90 10" fill="#1d1a22" stroke="${OL}" stroke-width="8"/><ellipse cx="-30" cy="-30" rx="20" ry="11" fill="#fff" opacity="0.2"/></g>`;
    return { cam: push(focus(960, 640, 1.0), t, 1.8, 0.06), layers: [povBg('#4a3a34'), Lr(1, panel), Lr(1, arm)], over: comic(T, 80.21, 'CLIC CLIC CLIC', 540, 360, { life: 1.6, size: 80, rot: -4 }) };
  } },
  // 35 — close no Polo apertando, olha para trás desesperado
  { t0: 80.96, draw(t, T) { const p = Math.sin(t * 14) > 0; return { cam: push(CL(900, 2.7), t, 2.0, 0.08), layers: [...elevatorSet(T, t, PB({ x: 960, y: GY, t: T, face: -0.9, lx: -1.3, expr: 'worried', pale: 0.3, armL: p ? 142 : 134, bendL: 0, handL: 'point' }) + emote('sweat', 930, GY - S6 * 420, T - 81.03, 0.9), { elX: 700, press: 1, pressOn: !p, btnDx: -20, btnDy: 45 }), darkLight(560, 820, 620, 0.45)], tint: HD }; } },
  // 36 — a coisa dobra a esquina correndo na direção dele (perspectiva)
  { t0: 82.34, draw(t, T) {
    const k = lerp(0.45, 1.3, E.in(clamp(t / 3.4)));
    return { cam: { ...C(1.05), x: Math.sin(T * 50) * (2 + 4 * t / 3.4) }, layers: [L(1, corridor(T, { dark: 0.3, flicker: 1 })), L(1, creature(lerp(760, 540, clamp(t / 0.8)), lerp(960, 1500, E.in(clamp(t / 3.4))), k, T, { run: 1, dark: 0.25, glow: 1, reach: t > 2.2 })), darkLight(540, 1000, 700, 0.55)], tint: HD };
  } },
  // 37 — "quando ele achou que era o fim": close, olhos fechados
  { t0: 86.03, draw(t, T) { return { cam: push(CL(760, 3.3, 920), t, 1.9, 0.08), layers: [...elevatorSet(T, t, PB({ x: 760, y: GY, t: T, expr: 'worried', blink: 1, headTilt: -5, pale: 0.4 }), { floor: 0 }), darkLight(540, 760, 560, 0.55)], tint: HD }; } },
  // 38 — as portas se abrem: luz quente invade
  { t0: 88.1, draw(t, T) { const op = E.out(clamp(t / 1.0)); return { cam: push(focus(760, GY - 260, 1.9, 900), t, 1.6, 0.06), layers: elevatorSet(T, t, PB({ x: 760, y: GY + 120, s: 0.7, t: T, back: true }), { open: op, floor: 0, lit: 1 }), over: comic(T, 88.26, 'DING!', 540, 360, { size: 110, fill: '#fff4cc', rot: 0 }) }; } },
  // 39 — de dentro do elevador, uma silhueta escura estica o braço e agarra o sobretudo
  { t0: 89.04, draw(t, T) {
    const ext = E.back(clamp((t - 0.3) / 0.45)), grab = t > 0.75;
    const sh = [845, GY + 60 - 175];
    const pol = PB({ x: 800, y: GY + 60, s: 0.7, t: T, back: true, tilt: grab ? -5 + Math.sin(T * 30) * 2 : 0, armL: grab ? 150 : 10, armR: grab ? 150 : 10, bendL: 20, bendR: 20 });
    return { cam: push(focus(780, GY - 220, 2.3, 950), t, 2.6, 0.06), layers: elevatorSet(T, t, pol + shadowFig(865, GY - 10, 0.62, ext, sh, 'arm'), { open: 1, floor: 0, lit: 1, light: 0, inner: shadowFig(865, GY - 10, 0.62, ext, sh) }), over: comic(T, 89.71, 'TCHAP!', 760, 440, { size: 120 }) };
  } },
  // 40 — a silhueta puxa o Polo de costas para dentro; a grade fecha na frente dos dois e a luz apaga
  { t0: 91.92, draw(t, T) {
    const pull = E.inOut(clamp(t / 0.55)), close = E.inOut(clamp((t - 0.6) / 0.7)), dim = clamp((t - 1.4) / 0.4);
    const px = lerp(800, 770, pull), py = lerp(GY + 60, GY - 20, pull), fl = Math.sin(T * 26);
    const pol = PB({ x: px, y: py, s: lerp(0.7, 0.64, pull), t: T, back: true, tilt: lerp(-6, -16, pull), armL: 135 + fl * 25, armR: 135 - fl * 25, bendL: 30, bendR: 30, walk: close < 0.6 ? T * 9 : null });
    const sc = lerp(0.7, 0.64, pull), sh = [px + 45 * sc / 0.7, py - 175 * sc / 0.7], fx = lerp(865, 840, pull);
    return { cam: push(focus(760, GY - 260, 1.9, 900), t, 1.2, 0.04), layers: [...elevatorSet(T, t, '', { open: 1 - close, floor: 0, lit: 1 - dim, light: 0, inner: shadowFig(fx, GY - 10, 0.62, 1, sh) + pol + shadowFig(fx, GY - 10, 0.62, 1, sh, 'arm') }), L0(rect(-600, -600, 2280, 3120, '#05060c', `opacity="${f2(dim * 0.35)}"`))] };
  } },
  // 41 — quem estava naquele elevador? ponteiro descendo, "?"
  { t0: 94.38, draw(t, T) {
    const fl = Math.min(4, t / 0.7);
    return { cam: push(focus(760, GY - 380, 2.2, 900), t, 3.0, 0.08), layers: [...elevatorSet(T, t, '', { floor: fl }), darkLight(540, 860, 640, 0.5)],
      over: `<text x="540" y="${f2(500 + Math.sin(T * 3) * 10)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="300" fill="#ffd23f" stroke="${OLh}" stroke-width="20" paint-order="stroke" opacity="${f2(clamp((t - 1.2) / 0.5))}">?</text>` };
  } },
  // 42 — final: COMENTE PARTE 2 sobre a fachada (emenda no gancho)
  { t0: 98.04, xf: 0.4, draw(t, T) {
    const k = E.back(clamp((t - 2.9) / 0.4));
    const card = `<g transform="translate(540 420) scale(${f2(k)})"><rect x="-400" y="-110" width="800" height="220" rx="30" fill="${HC.red}" stroke="${OLh}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="64" fill="#fff">COMENTE</text><text y="78" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="88" fill="#ffd23f" stroke="${OLh}" stroke-width="10" paint-order="stroke">PARTE 2</text></g>`;
    return { cam: push(focus(910, 330, 1.05, 820), t, 4.2, 0.02), layers: exteriorSet(T, t, '', { alarm: 1 }), tint: HN, over: card };
  } },
);

// HUD: relógio "03:00" no canto, avançando com a história
function HUD(T) {
  const m = Math.min(59, Math.floor(T / 102.04 * 13));
  const ak = alarmK(T);
  return `<g transform="translate(870 210)"><rect x="-130" y="-46" width="260" height="92" rx="18" fill="#14101a" opacity="0.8" stroke="${HC.red}" stroke-width="5"/><circle cx="-96" cy="0" r="12" fill="${HC.red}" opacity="${f2(0.4 + 0.6 * ak)}"/><text x="16" y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="#ff8a8a" letter-spacing="4">03:${String(m).padStart(2, '0')}</text></g>`;
}

// silhueta escura sem rosto (mistério da parte 2). part: 'body' (dentro da cabine) ou 'arm' (braço até o alvo, por cima do Polo)
function shadowFig(x, y, k, ext, tgt, part = 'body') {
  const sx = x - 60 * k, sy = y - 320 * k, hx = lerp(sx, tgt[0], ext), hy = lerp(sy + 30, tgt[1], ext);
  const ex = (sx + hx) / 2 + 30 * k, ey = Math.min(sy, hy) - 30 * k, c = '#0b0810';
  if (part === 'arm') return `<path d="M ${f2(sx)} ${f2(sy)} Q ${f2(ex)} ${f2(ey)} ${f2(hx)} ${f2(hy)}" stroke="${c}" stroke-width="${f2(46 * k)}" stroke-linecap="round" fill="none"/>` +
    `<g transform="translate(${f2(hx)} ${f2(hy)})"><ellipse rx="${f2(36 * k)}" ry="${f2(30 * k)}" fill="${c}"/>${[-1, 0, 1].map(i => `<path d="M ${f2(16 * k)} ${f2(i * 16 * k)} l ${f2(26 * k)} ${f2(22 * k)}" stroke="${c}" stroke-width="${f2(15 * k)}" stroke-linecap="round"/>`).join('')}</g>`;
  return `<path d="M ${f2(x - 90 * k)} ${f2(y)} C ${f2(x - 110 * k)} ${f2(y - 200 * k)} ${f2(x - 90 * k)} ${f2(y - 340 * k)} ${f2(x - 30 * k)} ${f2(y - 360 * k)} L ${f2(x + 50 * k)} ${f2(y - 350 * k)} C ${f2(x + 100 * k)} ${f2(y - 300 * k)} ${f2(x + 100 * k)} ${f2(y - 160 * k)} ${f2(x + 80 * k)} ${f2(y)} Z" fill="${c}"/><ellipse cx="${f2(x)}" cy="${f2(y - 430 * k)}" rx="${f2(62 * k)}" ry="${f2(74 * k)}" fill="${c}"/>`;
}
