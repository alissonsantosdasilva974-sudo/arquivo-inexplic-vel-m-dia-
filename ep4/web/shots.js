// PADRÃO DO CANAL — cenários e helpers do ep. 2 v4 (cidade v3). Copie este arquivo para epN/web/shots.js e troque as cenas de exemplo.
const SHOTS = [];
function plazaSky(T) { return { top: '#f0a868', bot: '#f8dcae', night: 0, sp: 0 }; }
const NIGHT = ['#3a4a8a', 0.22];
const DUSK = ['#a07ab0', 0.14];
const backNight = (t) => [Lr(0.04, sky('#0e1230', '#2e3264', { stars: 1, t, moon: 160, moonX: 1500, id: 'n' })), Lr(0.1, clouds(t * 0.5, '#4a4a7a', 0.45, 7, 60))];
const backDawn = (t) => [Lr(0.04, sky('#f2b07a', '#fbe4c0', { sun: 360, sunX: 600, sunC: '#fff2d0', id: 'm' })), Lr(0.1, clouds(t, '#fff6ea', 0.85, 3, 60))];
const backDay = (t) => [Lr(0.04, sky('#9cc4dc', '#eaf2ee', { sun: 140, sunX: 400, sunC: '#fffbe8', sunR: 70, id: 'c' })), Lr(0.1, clouds(t, '#ffffff', 0.8, 9, 60))];
const backDusk = (t) => [Lr(0.04, sky('#4a3060', '#f2a46a', { sun: 640, sunX: 1650, sunC: '#ffd9a0', sunR: 100, id: 'k' })), Lr(0.1, clouds(t, '#f4b8a0', 0.7, 5, 60))];
const fog = (t, y = 820, op = 0.5) => `<g opacity="${op}">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${f2(((i * 520 + t * 30) % 4200) - 900)}" cy="${y + (i % 3) * 30}" rx="420" ry="60" fill="#c8cce8" opacity="0.35"/>`).join('')}</g>`;
const GLOWN = (T) => 0.6 + 0.4 * Math.sin(T * 5);
// side-view sets
const nightSet = (T, t, extra, o = {}) => [...backNight(t), ...sideStreet(T, t, Object.assign({ seed: 5, night: 1, npcs: false, fg: false, extra }, o)), Lr(1.2, fog(T))];
const duskSet = (T, t, extra) => [...backDusk(t), ...sideStreet(T, t, { seed: 7, closed: 1, npcs: false, cars: false, fg: false, night: 0.3, extra })];
const bakerySetV2 = (T, o = {}) => cityRow(T, { seed: 12, x0: 430, x1: 3000, signs: ['MERCADO', 'BARBEARIA', 'CORREIO', 'FLORES'], bunting: true, shops: 0.8 }) + cityRow(T, { seed: 13, x0: -1500, x1: -230, shops: 0.4 }) + bakeryFacade(-200, 900, Object.assign({ t: T, sign: false }, o));
const morningSet = (T, t, extra, o, so = {}) => [...backDawn(t), ...sideStreet(T, t, Object.assign({ seed: 12, main: (T2) => bakerySetV2(T2, o), extra, fg: false, avoidX: 450 }, so))];
// hook = the town from above at night, with the glowing note floating in front (also the loop-back ending)
const hookNote = (t, T) => ({ cam: { ...focus(960, 700, 1.0 + 0.03 * Math.sin(T)), r: 0 }, layers: [
  ...backNight(1), Lr(1, street3D(1, { cam: cam3(3200, 260, 500, 0), seed: 7, night: 1, crowd: 0, traffic: false })),
  Lr(1.05, `<rect x="-800" y="-800" width="3600" height="3200" fill="#0e1230" opacity="0.35"/><g transform="translate(960 640)">${noteNamed('?', GLOWN(T), { s: 3.3, rot: Math.sin(T * 1.3) * 6, fs: 22 })}</g>` + dust(T, 500, 300, 900, 600, 30, 5, '#ffe7a0'))], tint: ['#3a4a8a', 0.12] });
// POV close-ups with Polo's gloves
const povBg = (c) => Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="${c}"/><circle cx="960" cy="560" r="460" fill="#ffd27a" opacity="0.1"/>`);
const pov = (T, inner, o = {}) => Lr(1, povHands(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4 }));


// ---------- CENAS DE EXEMPLO (apagar e escrever as do episódio) ----------

// =====================================================================================
// EP. 4 — "Nessa cidade, toda mentira pesa nos ombros"  (21 cenas, tempos medidos no áudio real de 113,36 s)
// Mecânica central: o `lean` (curva da coluna) do Seu Antônio sobe de 12° a 44° e volta a 0° no fim (antonioLean em cast4.js).
// Luz: dia cômico (01–10) → noite chuvosa (11–16) → manhã ensolarada (17–21). O fim (Antônio reto, Polo sorrindo) emenda na cena 01.
// =====================================================================================
const POLO = (o) => Object.assign({ hat: 'fedora', pocketNote: true }, o);
const I = (T, a, b) => inv(a, b, T);
const GY = 934;                                   // chão da calçada (sideStreet)
const OF_X = -200;                                // fachada da oficina: x −200..500, porta 270..380
const WARM = ['#ffe2b0', 0.1];
// Seu Antônio: o lean sempre cai PARA A FRENTE (sentido do olhar). face>0 olha p/ direita.
const ANT = (T, o = {}) => { const fc = o.face != null ? o.face : -1, L = o.lean != null ? o.lean : antonioLean(T); return P_('antonio', Object.assign({ t: T, three4: fc, flip: false }, o, { lean: L * (fc > 0 ? 1 : -1), face: undefined })); };
const plainDay = (T, t, extra, so = {}) => [...backDay(t), ...sideStreet(T, t, Object.assign({ seed: 12, npcs: false, fg: false, extra }, so))];
const workshopSet = (T, o = {}) => cityRow(T, { seed: 14, x0: 520, x1: 3000, signs: ['MERCADO', 'BARBEARIA', 'CORREIO', 'FLORES'], bunting: !o.night, shops: 0.7, night: o.night ? 1 : 0 }) + cityRow(T, { seed: 15, x0: -1500, x1: -230, shops: 0.4, night: o.night ? 1 : 0 }) + workshopFacade(OF_X, 900, Object.assign({ t: T }, o));
const dayShop = (T, t, extra, o = {}, so = {}) => [...backDay(t), ...sideStreet(T, t, Object.assign({ seed: 12, npcs: false, fg: false, extra, main: (T2) => workshopSet(T2, o) }, so))];
const nightShop = (T, t, extra, o = {}, so = {}) => [...backNight(t), ...sideStreet(T, t, Object.assign({ seed: 5, night: 1, npcs: false, cars: false, fg: false, extra, main: (T2) => workshopSet(T2, Object.assign({ night: 1 }, o)) }, so)), Lr(1.2, fog(T, 820, 0.35))];
const rainScreen = (t, op = 0.5, n = 90) => { const r = rng(5); let s = `<g opacity="${op}" stroke="#d8e6ff" stroke-width="3" stroke-linecap="round">`; for (let i = 0; i < n; i++) { const x0 = r() * 1300 - 100, sp = 1500 + r() * 900, y = (((r() + t * sp / 2200) % 1) * 2200) - 200, len = 70 + r() * 80; s += `<path d="M ${f2(x0 + y * 0.2)} ${f2(y)} l ${f2(-len * 0.2)} ${f2(len)}"/>`; } return s + '</g>'; };
const lookAt = (x, y) => ({ lx: x, ly: y });
const folk = (id, x, o = {}) => P_(id, Object.assign({ x, y: GY, s: 0.62, t: o.T || 0, face: 0 }, o));

// ---------- DIA CÔMICO ----------
SHOTS.push(
  // 01 (0.00) gancho: morador conta uma mentira, balão "Foi trânsito!" e o pescoço/ombros afundam na hora
  { t0: 0, draw(t, T) {
    const lean = lerp(0, 18, E.out(I(t, 0.35, 0.85)));
    const m = P_('morador', { x: 700, y: GY, s: 0.62, t: T, three4: 1, lean, expr: t < 0.4 ? 'happy' : 'worried', mouth: talk(T, [[0.05, 0.9]]), armR: 60, bendR: 90, handR: 'open', headTilt: lean * 0.3 });
    const l = P_('viz2', { x: 920, y: GY, s: 0.62, t: T, three4: -1, expr: 'neutral', armL: 70, bendL: 120, armR: 70, bendR: 120, lx: -1 });
    const ex = m + l + speech(730, GY - 0.62 * 470, 'Foi trânsito!', { w: 300, h: 84, k: 0.8, ap: I(t, 0.12, 0.4) * (1 - I(t, 2.4, 2.8)) }) + emote('sweat', 790, GY - 0.62 * 400, t - 0.5, 0.8);
    return { cam: push(frameG(830, GY, 1.7, 1450), t, 3, 0.05), layers: [...plainDay(T, t, ex), Lr(1.45, fgLeaves(T, 1))] };
  } },
  // 02 (3.08) Polo caminha apontando os moradores tortos; depois corte interno em "Uma mentira grande" (5.7)
  { t0: 3.08, draw(t, T) {
    const tortos = (z) => (z ? [['viz1', 900, 16, -1], ['mulher', 1040, 26, 1], ['senhora', 1160, 11, -1]] : [['viz1', 800, 14, -1], ['mulher', 1080, 22, 1], ['viz3', 1400, 30, -1], ['senhora', 560, 9, 1]]).map(([id, x, ln, f], i) => P_(id, { x, y: GY, s: 0.62, t: T, three4: f, lean: ln * f, expr: i % 2 ? 'sad' : 'worried', armL: 10 + i * 3, armR: 14 })).join('');
    if (t < 2.62) {
      const px = lerp(300, 1250, E.inOut(t / 2.62));
      const polo = P_('polo', POLO({ x: px, y: GY, s: 0.62, t: T, three4: 1, walk: T * 8, armR: 95, bendR: 12, handR: 'point', expr: 'thinking' }));
      return { cam: frameG(px + 140, GY, 1.55, 1440), layers: plainDay(T, t, tortos(0) + polo, { avoidX: px }) };
    }
    const polo = P_('polo', POLO({ x: 800, y: GY, s: 0.7, t: T, three4: 1, armR: 100, bendR: 10, handR: 'point', expr: 'thinking', lean: 4 }));
    return { cam: push(frameG(930, GY, 1.9, 1440), t - 2.62, 2.8, 0.06), layers: [...plainDay(T, t, tortos(1) + polo), Lr(1.45, fgPole(160))] };
  } },
  // 03 (8.50) close rápido: Polo ergue a sobrancelha observando a postura da cidade
  { t0: 8.5, draw(t, T) {
    const polo = P_('polo', POLO({ x: 780, y: GY, s: 0.75, t: T, three4: 1, lean: 5, expr: 'thinking', mouth: talk(T, [[8.8, 12.2]]), armR: 30, bendR: 60, handR: 'open' }));
    const bg = P_('viz1', { x: 1020, y: GY, s: 0.62, t: T, three4: -1, lean: -26, expr: 'sad' });
    return { cam: push(focus(900, GY - 0.75 * 320, 2.3, 800), t, 3.9, 0.08), layers: plainDay(T, t, polo + bg, {}) };
  } },
  // 04 (12.45) padaria: "Esse pão saiu agora!" e o ombro afunda no balcão
  { t0: 12.45, draw(t, T) {
    const lean = lerp(0, 24, E.inOut(I(T, 14.9, 16.4)));
    const bk = P_('padeiro2', { x: 830, y: 900, s: 0.66, t: T, three4: -1, lean: -lean, expr: T < 14.9 ? 'happy' : 'shy', mouth: talk(T, [[13.0, 15.0]]), armL: 70, bendL: 40, holdL: bagBread(), armR: 20, bendR: 30 });
    const c = push(focus(790, 900 - 0.66 * 300, 2.3, 900), t, 4.7, 0.05);
    const ex = bk + counter(520, 812, 700) + basket(700, 795, 0.9) + basket(1030, 798, 0.8) + speech(780, 900 - 0.66 * 480, 'Saiu agora!', { w: 290, h: 80, k: 0.8, ap: I(T, 13.1, 13.35) * (1 - I(T, 15.0, 15.3)) }) + emote('sweat', 940, 900 - 0.66 * 400, T - 15.1, 0.8);
    return { cam: c, layers: [Lr(0.85, bakeryInterior(T, { clock: false, doorOpen: 1 })), Lr(1, ex)] };
  } },
  // 05 (17.14) praça: prefeito de lado, seguranças o seguram de pé
  { t0: 17.14, draw(t, T) {
    const fy = 880 - 176, lean = lerp(30, 38, E.inOut(I(t, 0.5, 2.5)));
    const pf = P_('prefeito', { x: 1000, y: fy, s: 0.66, t: T, three4: 1, lean, expr: 'worried', mouth: talk(T, [[17.8, 19.4]]), armL: 25, bendL: 20, armR: 25, bendR: 20 });
    const sg = (x, f, i) => P_('seguranca', { x, y: fy, s: 0.66, t: T, three4: f, expr: 'angry', armL: f > 0 ? 18 : 62, bendL: 30, armR: f > 0 ? 62 : 18, bendR: 30, jump: Math.abs(Math.sin(T * 9 + i)) * 2 });
    const crowd = [0, 1, 2, 3, 4].map(i => P_(NPC_IDS[(i * 5 + 2) % 24], { x: 640 + i * 190, y: 960, s: 0.5, t: T, back: true, expr: 'happy' })).join('');
    const ex = palanque(1000, 880, T) + sg(800, 1, 0) + pf + sg(1200, -1, 1) + mic(1130, fy - 0.66 * 290) + speech(1010, fy - 0.66 * 500, 'Vou arrumar a rua!', { w: 380, h: 84, k: 0.8, ap: I(T, 17.8, 18.05) * (1 - I(T, 19.3, 19.6)) }) + crowd;
    const bgl = [...backDay(t), Lr(0.12, hillsSkyline(t, 0) + haze('#e4ecee', 380, 760, 0.55)), Lr(0.3, rooftops(t, 0, -3000) + haze('#e4ecee', 300, 800, 0.4)), Lr(0.75, cityRow(T, { base: 760, seed: 21, signs: ['LIVRARIA', 'BAZAR', 'RELÓGIOS', 'SAPATARIA'], shops: 0.7, noTrees: true }) + walkers(T, 800, 0.46, 61, 7, 4200)), Lr(0.9, plazaGround(880))];
    return { cam: push(focus(1000, 580, 1.65, 960), t, 4.5, 0.05), layers: [...bgl, Lr(1, ex)] };
  } },
  // 06 (21.71) Joãozinho sai da escola andando como um "?" (rastreio); colegas riem ao fundo
  { t0: 21.71, draw(t, T) {
    const x = lerp(260, 1500, E.inOut(t / 5.9)), tr = lerp(1.0, 0.1, 0);
    const jo = P_('menino', { x, y: GY, s: 1.25, t: T, three4: 1, lean: 45, walk: T * 7, expr: 'sad', armL: 12, armR: 12 });
    const kids = [['moca', 140, 0], ['viz2', 330, 1]].map(([id, kx, i]) => P_(id, { x: kx + Math.min(0, 0), y: GY, s: 0.6, t: T, three4: 1, expr: 'laugh', mouth: 0.7, jump: Math.abs(Math.sin(T * 10 + i * 2)) * 14, armL: 40 + Math.sin(T * 9) * 20, bendL: 40 })).join('');
    const ex = jo + kids + emote('q', x + 150, GY - 1.25 * 280, T - 25.0, 0.8);
    const main = (T2) => schoolFacade(-540, 900, T2) + cityRow(T2, { seed: 16, x0: 300, x1: 3200, shops: 0.5, bunting: true }) + cityRow(T2, { seed: 17, x0: -1700, x1: -560, shops: 0.3 });
    return { cam: frameG(x + 40, GY, 1.7, 1440), layers: [...backDay(t), ...sideStreet(T, t, { seed: 12, npcs: false, cars: false, fg: false, extra: ex, main })] };
  } },
  // 07 (27.60) apresentação do Seu Antônio limpando uma ferramenta na oficina
  { t0: 27.6, draw(t, T) {
    const ant = ANT(T, { x: 330, y: GY, s: 0.7, face: 1, expr: 'happy', mouth: talk(T, [[28.3, 29.7], [30.4, 31.8], [32.2, 33.4]]), armR: 70 + Math.sin(T * 6) * 8, bendR: 70, holdR: wrench(), armL: 60, bendL: 80, holdL: rag(), handL: 'fist' });
    return { cam: push(frameG(290, GY, 1.4, 1440), t, 6, 0.12), layers: dayShop(T, t, ant, {}, { avoidX: 330 }) };
  } },
  // 08 (33.61) montagem de 3 dias: cada semana mais curvado varrendo a entrada
  { t0: 33.61, draw(t, T) {
    const k = T < 35.55 ? 0 : T < 37.5 ? 1 : 2, L = [15, 24, 32][k], tt = t - [0, 1.94, 3.89][k];
    const ant = ANT(T, { x: [420, 360, 330][k], y: GY, s: [0.62, 0.7, 0.8][k], face: 1, lean: L, expr: ['happy', 'neutral', 'tired'][k], armR: 40 + Math.sin(T * 7) * 22, bendR: 25, holdR: broom(), armL: 25, bendL: 40 });
    const z = [1.5, 1.9, 2.5][k], dust2 = dust(T, 360, 700, 300, 240, 10, 3 + k, '#d8c8a8');
    const label = `<g transform="translate(540 400)"><text text-anchor="middle" ${FNT} font-size="72" fill="#fff" stroke="${INK}" stroke-width="16" paint-order="stroke" transform="rotate(-4)" opacity="${f2(E.back(clamp(tt / 0.25)))}">SEMANA ${k + 1}</text></g>`;
    return { cam: { ...frameG([420, 380, 360][k], GY, z, 1440), z: z * (1 + 0.04 * clamp(tt / 1.9)) }, layers: dayShop(T, t, ant + dust2, {}, { avoidX: 400 }), over: label };
  } },
  // 09 (39.44) over-the-shoulder: Polo pergunta, Antônio "Tô ótimo!" e o tronco afunda mais um degrau (corte interno em 46.42)
  { t0: 39.44, draw(t, T) {
    const polo = P_('polo', POLO({ x: 310, y: GY + 10, s: 0.8, t: T, three4: 1, expr: 'thinking', mouth: talk(T, [[41.4, 43.3]]), armR: 20, bendR: 20 }));
    const ant = polo + ANT(T, { x: 580, y: GY, s: 0.66, face: -1, expr: T < 44.4 ? 'neutral' : 'happy', mouth: talk(T, [[44.5, 46.2]]), armL: 14, armR: 14 });
    const bal = speech(400, GY - 0.8 * 500, 'Tá tudo bem, Seu Antônio?', { w: 440, h: 84, k: 0.6, fs: 30, ap: I(T, 41.45, 41.7) * (1 - I(T, 43.3, 43.6)) }) + speech(590, GY - 0.66 * 520, 'Tô ótimo, Polo!', { w: 360, h: 80, k: 0.62, ap: I(T, 44.5, 44.75) * (1 - I(T, 46.2, 46.5)) });
    const c = T < 46.42 ? push(focus(440, GY - 0.7 * 220, 1.75, 1000), t, 7, 0.05) : push(focus(560, GY - 0.66 * 260, 3.2, 980), T - 46.42, 2.1, 0.05);
    return { cam: c, layers: dayShop(T, t, ant + bal + (T > 46.42 ? emote('sweat', 640, GY - 0.66 * 360, T - 46.5, 0.8) : ''), {}, { avoidX: 560 }) };
  } },
  // 10 (48.55) vizinhos cochichando olhando a oficina; carros passam direto
  { t0: 48.55, draw(t, T) {
    const wh = (id, x, f, i) => P_(id, { x, y: GY, s: 0.62, t: T, three4: f, expr: 'smug', lx: f, armR: 150, bendR: 120, handR: 'open', armL: 12, mouth: 0.1, lean: 3 * f });
    const ex = wh('mulher', 700, -1) + wh('viz3', 800, 1) + wh('senhora', 1150, -1) + wh('viz1', 1250, 1) + P_('polo', POLO({ x: 1650, y: GY, s: 0.55, t: T, three4: -1, expr: 'thinking' })) + carSide(lerp(-800, 3000, ((t * 0.28) % 1)), 900 + 300, '#c8443c', { s: 0.8, dir: 1, wheel: T * 600 });
    return { cam: lerpCam(frameG(620, GY, 1.3, 1440), frameG(1000, GY, 1.3, 1440), E.inOut(t / 7.8)), layers: dayShop(T, t, ex, {}, { cars: false }) };
  } },
);

// ---------- NOITE CHUVOSA ----------
SHOTS.push(
  // 11 (56.34) rua em perspectiva: Polo de costas sob chuva fina, luz quente de poste, poças
  { t0: 56.34, xf: 0.4, draw(t, T) {
    const cam = cam3(640, 560, 500, 0), D = lerp(40, 800, E.inOut(t / 4.0));
    const people = [{ id: 'polo', X: -430, D, s: 0.44, o: POLO({ t: T, back: true, walk: T * 7 }) }];
    const pp = P3(cam, -430, 0, D);
    const pools = [[640, 1560, 240], [260, 1700, 200], [860, 1740, 180]].map(([x, y, r]) => puddle(x, y, r, T)).join('');
    return { cam: focus(pp.x + 80, pp.y - 200, 1.5, 1100), layers: [...backNight(t), Lr(1, street3D(T, { cam, seed: 5, night: 1, people, crowd: 0, traffic: false, parked: false, skyC: '#2a2e5a', clearNear: { g: -1, D: 900 } }))], tint: NIGHT, over: pools + rainScreen(T, 0.55) };
  } },
  // 12 (60.37) porta da oficina encostada: feixe de luz quente; Polo espia (poste desfocado em primeiro plano)
  { t0: 60.37, draw(t, T) {
    const lean = -lerp(0, 12, E.inOut(I(t, 0.4, 2.0)));
    const polo = P_('polo', POLO({ x: 520, y: GY, s: 0.8, t: T, three4: -1, lean, expr: 'thinking', lx: -1 }));
    const beam = `<path d="M 300 700 L 372 700 L 700 946 L 120 946 Z" fill="url(#gCone)" opacity="0.55"/><path d="M 322 706 h 14 v 194 h -14 Z" fill="#fff2b8" opacity="0.95"/>`;
    const ex = beam + polo + lampLight(120, 940, 1.0);
    return { cam: push(focus(390, GY - 0.8 * 250, 1.85, 940), t, 4.1, 0.06), layers: [...nightShop(T, t, ex, { open: 0.14, inLight: 0.55 }), Lr(1.45, fgPole(150))], tint: NIGHT, over: rainScreen(T, 0.5) };
  } },
);

// ---------- INTERIOR DA OFICINA À NOITE ----------
const NIGHT_IN = ['#3a3470', 0.18];
SHOTS.push(
  // 13 (64.45) interior: Antônio ao telefone numa oficina vazia, luz única; a câmera abre em "A oficina vazia"
  { t0: 64.45, draw(t, T) {
    const ant = ANT(T, { x: 900, y: 900, s: 0.66, face: -1, expr: 'happy', mouth: talk(T, [[64.9, 66.2], [66.7, 69.2]]), armL: 150, bendL: 125, holdL: phoneHand(), handL: 'fist', armR: 14, bendR: 20 });
    const ex = bench4(1250, 780, 520) + plate(1480, 770, 0.9) + ant;
    const c = lerpCam(push(focus(830, 900 - 0.66 * 240, 2.2, 950), t, 4.5, 0.04), { ...focus(900, 760, 1.15, 980) }, E.inOut(I(T, 69.2, 70.5)));
    return { cam: c, layers: [Lr(0.9, workshopInterior(T, { night: 1 })), Lr(1, ex), Lr(1.03, `<rect x="-800" y="-600" width="3600" height="2600" fill="#0e0a20" opacity="0.22"/>`)] , tint: NIGHT_IN };
  } },
  // 14 (71.23) prato simples na bancada (foco) → inserto: tela do celular, chamada com a filha de beca
  { t0: 71.23, draw(t, T) {
    if (T < 73.53) {
      const c = push(focus(1480, 700, 3.4, 900), t, 2.3, 0.1);
      return { cam: c, layers: [Lr(0.9, workshopInterior(T, { night: 1 })), Lr(1, bench4(1250, 780, 520) + plate(1480, 770, 1.0)), Lr(1.03, `<rect x="-800" y="-600" width="3600" height="2600" fill="#0e0a20" opacity="0.2"/>`)], tint: NIGHT_IN };
    }
    const ph = phoneScreen(0, 0, 1.0, T, { mouth: talk(T, [[75.95, 77.1]]) * 0 + 0.35 * Math.abs(Math.sin(T * 6)), expr: 'happy' });
    return { cam: push(focus(960, 640, 1.0), T - 73.53, 3.8, 0.05), layers: [povBg('#1c1838'), pov(T, ph, { k: 1.55, spread: 320, dy: 40 }), Lr(1.05, dust(T, 500, 300, 900, 600, 14, 9, '#ffe7a0'))], tint: NIGHT_IN };
  } },
  // 15 (77.31) close dramático em Antônio; a cada "tô ótimo" os ombros descem mais um nível (música corta seco)
  { t0: 77.31, draw(t, T) {
    const L = antonioLean(T), hx = Math.sin(L * Math.PI / 180) * 210 * 0.9;
    const ant = ANT(T, { x: 860, y: 900, s: 0.9, face: -1, expr: T < 83.3 ? 'happy' : 'tired', mouth: talk(T, [[77.4, 78.8], [79.1, 79.9], [80.0, 81.8], [81.9, 83.1], [83.4, 85.3]]), armL: 14, armR: 14 });
    const c = push(focus(800 - hx * 0.6, 900 - 0.9 * 250, 2.6, 980), t, 8.4, 0.05);
    return { cam: c, layers: [Lr(0.9, workshopInterior(T, { night: 1 })), Lr(1, ant), Lr(1.03, `<rect x="-800" y="-600" width="3600" height="2600" fill="#0e0a20" opacity="${f2(0.2 + 0.1 * I(T, 79, 85))}"/>`)], tint: NIGHT_IN };
  } },
  // 16 (85.74) Polo na porta: arregala os olhos, entende tudo, fecha a expressão decidida
  { t0: 85.74, draw(t, T) {
    const dec = T >= 87.7;
    const polo = P_('polo', POLO({ x: 620, y: GY, s: 1.0, t: T, three4: -1, lean: -4, expr: dec ? 'determined' : 'scared', mouth: 0, lx: -1 }));
    const glow = `<rect x="-200" y="0" width="900" height="1100" fill="url(#gCone)" opacity="0.28" transform="rotate(-70 300 500)"/>`;
    return { cam: push(focus(640, GY - 1.0 * 300, 3.1, 900), t, 4.5, 0.07), layers: [...nightShop(T, t, glow + polo, { open: 0.14, inLight: 0.5 })], tint: NIGHT, over: rainScreen(T, 0.45) + (dec ? '' : '') };
  } },
);

// ---------- MANHÃ ENSOLARADA ----------
SHOTS.push(
  // 17 (90.26) três cortes de 2 s: Polo conta a verdade na padaria, no salão e na praça
  { t0: 90.26, draw(t, T) {
    const k = T < 92.25 ? 0 : T < 94.25 ? 1 : 2, tt = T - [90.26, 92.25, 94.25][k];
    const gest = (o = {}) => POLO(Object.assign({ y: GY, s: 0.7, t: T, three4: 1, expr: 'happy', mouth: 0.5 + 0.4 * Math.abs(Math.sin(T * 9)), armR: 80 + Math.sin(T * 8) * 25, bendR: 40, handR: 'open' }, o));
    if (k === 0) {
      const ex = P_('polo', gest({ x: 520, y: 900 })) + P_('padeiro2', { x: 900, y: 900, s: 0.66, t: T, three4: -1, expr: 'surprised', armL: 40, bendL: 60 }) + counter(760, 812, 700) + emote('excl', 930, 900 - 0.66 * 430, tt - 0.5, 0.8);
      return { cam: push(focus(710, 650, 1.7, 980), tt, 2, 0.05), layers: [Lr(0.85, bakeryInterior(T, { clock: false, doorOpen: 1 })), Lr(1, ex)], tint: WARM };
    }
    if (k === 1) {
      const ex = salonChair(1040, 900) + P_('polo', gest({ x: 520, y: 900 })) + P_('mulher', { x: 930, y: 900, s: 0.66, t: T, three4: -1, expr: 'surprised', armL: 70, bendL: 90 }) + emote('excl', 960, 900 - 0.66 * 440, tt - 0.5, 0.8);
      return { cam: push(focus(740, 650, 1.7, 980), tt, 2, 0.05), layers: [Lr(0.85, salonInterior(T)), Lr(1, ex)], tint: WARM };
    }
    const ex = P_('polo', gest({ x: 620 })) + ['viz1', 'viz3', 'senhora'].map((id, i) => P_(id, { x: 900 + i * 180, y: GY, s: 0.62, t: T, three4: -1, expr: 'surprised', armL: 40 + i * 10, bendL: 60 })).join('') + emote('excl', 1000, GY - 0.62 * 430, tt - 0.5, 0.8);
    return { cam: push(focus(850, GY - 200, 1.5, 1000), tt, 2, 0.05), layers: plainDay(T, t, ex, {}), tint: WARM };
  } },
  // 18 (96.24) plano aéreo: fila de carros coloridos dobra a esquina até a Oficina do Antônio
  { t0: 96.24, draw(t, T) {
    const cam = cam3(lerp(2900, 2300, E.inOut(t / 3.9)), 300, 500, 0), cols = ['#c8443c', '#3c6aa8', '#f2c230', '#e8e4dc', '#e07a3a', '#8a5aa8', '#4aa8c8', '#ee8aaa'];
    const mc = []; for (let i = 0; i < 16; i++) mc.push({ X: 190, D: 420 + i * 300 + t * 24, col: cols[i % cols.length], brake: i % 3 !== 0, type: i % 4 === 1 ? 'van' : 'sedan' });
    for (let i = 0; i < 6; i++) mc.push({ X: -190, D: 700 + i * 760 + t * 140, col: cols[(i + 3) % cols.length] });
    const pin = (() => { const p = P3(cam, 190, 0, 5400); return `<g transform="translate(${f2(p.x)} ${f2(p.y - 40)})"><path d="M 0 0 L -14 -34 A 34 34 0 1 1 14 -34 Z" fill="#c8443c" stroke="${INK}" stroke-width="5"/><circle cx="0" cy="-66" r="12" fill="#fff"/></g>`; })();
    return { cam: focus(960, 720, 1.0), layers: [...backDawn(t), Lr(1, street3D(T, { cam, seed: 12, movingCars: mc, crowd: 8, traffic: false, parked: false, skyC: '#fbe4c0' }) + pin)] };
  } },
  // 19 (100.11) entrada da oficina: Polo chega sorrindo e pergunta; Antônio ainda curvado
  { t0: 100.11, draw(t, T) {
    const polo = P_('polo', POLO({ x: 250, y: GY, s: 0.7, t: T, three4: 1, expr: 'happy', mouth: talk(T, [[102.1, 104.3]]), armR: 20, bendR: 20, lean: -2 }));
    const ant = ANT(T, { x: 520, y: GY, s: 0.66, face: -1, expr: 'neutral', lean: 38, armL: 14, armR: 14 });
    const fila = [['#c8443c', 760], ['#3c6aa8', 1160], ['#f2c230', 1560]].map(([c, x]) => carSide(x, 1160, c, { s: 0.8 })).join('');
    return { cam: push(frameG(390, GY, 1.6, 1440), t, 4.2, 0.05), layers: dayShop(T, t, ant + polo + fila, { gateUp: 0.85, inside: '#6a5a4a' }, { cars: false }), tint: WARM };
  } },
  // 20 (104.37) close lento: olha a oficina cheia, respira fundo e o tronco endireita até lean 0
  { t0: 104.37, draw(t, T) {
    const L = antonioLean(T), hx = Math.sin(L * Math.PI / 180) * 210 * 0.9, look = kf(T, [[104.4, 0], [105.0, 0.8], [106.4, 0.8], [107.2, 0]]);
    const ant = ANT(T, { x: 800, y: 900, s: 0.9, face: -1, expr: T < 106.3 ? 'neutral' : 'happy', lx: -look, ly: -0.1 * look, mouth: T > 110.5 ? 0.3 : 0, armL: 14, armR: 14 });
    const cars = carSide(420, 1010, '#c8443c', { s: 1.25 }) + carSide(1500, 1010, '#3c6aa8', { s: 1.25 });
    const wl = [Lr(0.9, workshopInterior(T, { night: 0, bulb: 0 })), Lr(1, cars + ant + (T > 110.4 ? emote('sparkle', 1000, 900 - 0.9 * 420, T - 110.4, 0.9) : ''))];
    return { cam: push(focus(800 - hx * 0.9, 900 - 0.9 * 270, 2.7, 980), t, 7.2, 0.05), layers: wl, tint: WARM };
  } },
  // 21 (111.53) fechamento quente: Antônio reto, Polo sorrindo tímido; folhas em primeiro plano. SEM letreiro (a pedido).
  { t0: 111.53, draw(t, T) {
    const ant = ANT(T, { x: 580, y: GY, s: 0.7, face: -1, lean: 0, expr: 'happy', mouth: talk(T, [[111.73, 112.84]]), armL: 14, armR: 14 });
    const polo = P_('polo', POLO({ x: 300, y: GY, s: 0.7, t: T, three4: 1, expr: 'shy', armR: 20, bendR: 20 }));
    return { cam: push(frameG(440, GY, 1.6, 1440), t, 1.8, 0.04), layers: [...dayShop(T, t, ant + polo, { gateUp: 0.85, inside: '#6a5a4a' }, { cars: false }), Lr(1.45, fgLeaves(T, -1))], tint: WARM };
  } },
);
