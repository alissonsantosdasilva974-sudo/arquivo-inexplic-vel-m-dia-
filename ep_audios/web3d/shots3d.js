// Ep. "Todo áudio que você pula" — cenas no motor 3D. Câmera com frameCam (enquadramento sem cortar ninguém).
const POLO3 = o => Object.assign({ hat: 'fedora', pocketNote: true, x: 0, y: 0, s: 1 }, o);
const IVP = [[5.3, 11.0], [32.6, 38.3], [54.7, 57.5], [60.2, 64.2]], IVC = [[57.55, 60.2], [91.3, 94.4]], IVL = [[68.85, 73.9], [79.2, 84.2]];
const svgP = (T, o = {}) => person('polo', POLO3(life(T, 1, Object.assign({ t: T, mouth: lips(T, IVP) }, o))));
const svgC = (T, o = {}) => { const s = person('caio', life(T, 2, Object.assign({ x: 0, y: 0, s: 1, t: T, mouth: lips(T, IVC) }, o))); return o.phones ? withPhones(s) : s; };
const svgL = (T, o = {}) => person('lucia', life(T, 3, Object.assign({ x: 0, y: 0, s: 1, t: T, mouth: o.talk ? 0.2 + 0.35 * Math.abs(Math.sin(T * 9) * Math.sin(T * 3.1)) : lips(T, IVL) }, o)));
const ease = (t, a, b) => E.inOut(clamp((t - a) / (b - a)));
const PH = phoneSvg();
const TP = 1.95, TC = 1.68, TL = 1.78;                // topo da cabeça: Polo (com chapéu), Caio, Lúcia
const PP = { x: 1.3, z: 0.9 };                       // Polo ao lado da caixa
const CS = { x: -0.55, z: -0.3 };                    // Caio em frente à caixa
const KS = { x: KX, z: 1.2 };                        // lugar da Lúcia sentada (atrás da mesa)
const sway = (T, k = 1) => Math.sin(T * 1.7) * 6 * k;  // balanço de braço
const floatAud = (T, n, o = {}) => { const L = [], r = rng(o.seed || 5); for (let i = 0; i < n; i++) { const a = r() * 6.28, sp = 0.3 + r() * 0.4, ph = ((T * sp + r()) % 1);
  L.push({ x: (o.x || 0) + Math.cos(a + T * 0.3) * (0.6 + ph * (o.R || 3)), y: (o.y || 1.6) + ph * (o.H || 3), z: (o.z || 2) + Math.sin(a + T * 0.3) * (0.6 + ph * (o.R || 3)) - 0.5, s: 0.32 + r() * 0.2, op: Math.sin(ph * Math.PI), c: i % 3 }); } return L; };
// Lúcia sentada: o tampo da mesa esconde as pernas; a cadeira fica atrás
const seated = (svg) => place('lucia', svg, KS.x, -0.5, KS.z);
const SHOTS3 = [
  // 1 — gancho: noite, a caixa brilhando, câmera baixa subindo e avançando
  { t0: 0, async draw(t, T) {
    const u = ease(t, 0, 3.3); frameCam(BOXP.x, BOXP.z, { raw: 1, top: 2.9, vis: lerp(6.2, 4.6, u), az: lerp(-25, -10, u), el: lerp(-0.6, 0.4, u), fov: 42, dy: -0.4 });
    caixa(0.22 + 0.1 * Math.sin(T * 2), 64, T); audios(floatAud(T, 26, { R: 4, H: 4 }));
    await place('polo', svgP(T, { face: 0.4, expr: 'worried', lx: -1 }), PP.x + 0.5, 0, PP.z - 0.4);
    return { mood: 'night', over: banner(T, 0.15, 'NESTA CIDADE,', 'TODO ÁUDIO QUE VOCÊ PULA', 'FICA ESPERANDO') };
  } },
  // 2 — "esperando por você": plongée sobre a fenda, áudios pulsando
  { t0: 3.34, async draw(t, T) {
    const u = ease(t, 0, 2); camSet(lerp(-1.8, -1.2, u), 3.4, BOXP.z - 3.6, 0, 1.8, BOXP.z, 44, 4);
    caixa(0.1 + 0.05 * Math.sin(T * 6), 64, T); audios(floatAud(T, 10, { R: 1.0, H: 1.6, y: 2.2, z: 2.6 }));
    return { mood: 'night', over: popIcon(T, 3.7, bubble('...por você.', 380, 58), 540, 640) };
  } },
  // 3 — "Eu sou o Polo, o carteiro dos recados": dia, plano americano, Polo acena
  { t0: 5.32, async draw(t, T) {
    const u = ease(t, 0, 2.9); frameCam(PP.x - 0.4, PP.z, { top: TP, size: 'knee', az: lerp(-30, -15, u), el: 0.1, off: -0.25 });
    caixa(0, 30, T);
    const e = exprAt(T, [[5.3, 'happy'], [6.6, 'joy']]);
    const wave = T > 5.5 && T < 7.4;
    await place('polo', svgP(T, { face: -0.15, expr: e.expr, squash: e.pop, armR: wave ? 150 + Math.sin(T * 12) * 18 : 25, bendR: wave ? 25 : 15, handR: 'open', armL: 18 + sway(T, 0.5), jump: T > 6.6 && T < 7.0 ? Math.sin((T - 6.6) / 0.4 * Math.PI) * 18 : 0 }), PP.x, 0, PP.z);
    return { mood: 'day', over: comic(T, 6.7, 'CARTEIRO!', 760, 560, { size: 80, fill: '#ffd23f' }) };
  } },
  // 4 — "Guardo todos eles na caixa da praça": põe o áudio na fenda, drone abre a praça
  { t0: 8.2, async draw(t, T) {
    const q = ease(t, 1.2, 2.94); camSet(lerp(-1.6, -15, q), lerp(1.7, 17, q), lerp(-2.3, -19, q), 0, lerp(1.7, 0.6, q), lerp(1.8, 3, q), lerp(42, 50, q));
    caixa(0, 30, T); const u = ease(t, 0, 1.1);
    audios(u < 1 ? [{ x: lerp(0.9, 0.1, u), y: lerp(1.4, 2.1, u), z: lerp(0.7, 1.3, u), s: 0.4 }] : []);
    await place('polo', svgP(T, { face: -0.6, expr: 'happy', armL: lerp(70, 110, u), bendL: 30, handL: 'open', lx: -1, ly: -0.4 }), PP.x - 0.25, 0, PP.z);
    await place('viz', person('viz2', life(T, 5, { x: 0, y: 0, s: 1, t: T, side: true, face: 0.8, walk: T * 8 })), -9 + t * 1.2, 0, 5.5);
    await place('viz3', person('senhora', life(T, 6, { x: 0, y: 0, s: 1, t: T, side: true, face: -0.8, walk: T * 7 })), 7 - t * 1.0, 0, 6.5);
    return { mood: 'day' };
  } },
  // 5 — "Caio tinha dezesseis anos e muita pressa": travelling lateral, ele corre para a direita da tela
  { t0: 11.14, async draw(t, T) {
    WORLD.cars.forEach(c => c.g.visible = false);
    const x = lerp(-1, 9, ease(t, 0, 3.12)); frameCam(x, ST, { top: TC, size: 'full', az: 180, el: 0.15, off: -0.3 });
    const f = sideFace(1, 0);
    await place('caio', svgC(T, { side: true, face: f, walk: T * 16, run: 1, expr: 'neutral', armR: 70, holdR: PH }), x, 0.16, ST);
    await place('viz', person('senhora', life(T, 7, { x: 0, y: 0, s: 1, t: T, face: sideFace(-1, 0) * 0.6, expr: t > 0.9 ? 'surprised' : 'neutral', lx: -1 })), 5.5, 0.16, ST - 0.7);
    return { mood: 'day', over: popIcon(T, 11.7, calendar('16'), 230, 560, 0.9) + comic(T, 12.9, 'PRESSA!', 780, 600, { size: 90, fill: '#ff7a45' }) };
  } },
  // 6 — "A mãe dele, dona Lúcia, mandava áudio todo dia": cozinha, ela grava, plano médio que se aproxima
  { t0: 14.26, async draw(t, T) {
    const u = ease(t, 0, 3.3); frameCam(KX - 1.6, 1.9, { top: TL, vis: lerp(2.6, 2.0, u), az: lerp(5, 20, u), el: 0.2, off: 0.2 });
    await place('lucia', svgL(T, { face: 0.3, expr: 'happy', talk: 1, armR: 135, bendR: 75, holdR: PH, armL: 40 + 25 * Math.sin(T * 3), bendL: 40, handL: 'open', headTilt: 4 * Math.sin(T * 2) }), KX - 1.6, 0, 1.9);
    audios([{ x: KX - 1.1, y: 1.8 + (t % 1.1) * 0.8, z: 1.8, s: 0.33, op: Math.sin((t % 1.1) / 1.1 * Math.PI) }]);
    return { mood: 'day', over: popIcon(T, 15.0, bubble('DONA LÚCIA', 440, 56, '#ffd23f'), 540, 470) };
  } },
  // 7 — "Três minutos, quatro minutos": no quarto, celular do Caio enchendo
  { t0: 17.56, async draw(t, T) {
    const u = ease(t, 0, 2.4); frameCam(RX + 0.6, 0.8, { top: TC, size: 'knee', az: lerp(20, 32, u), el: 0.25, off: 0.35 });
    await place('caio', svgC(T, { face: -0.3, expr: 'neutral', armR: 100, bendR: 70, holdR: PH, ly: 0.8, lx: 0.4 }), RX + 0.6, 0, 0.8);
    return { mood: 'night', over: phoneUI(T, 17.56, [{ t0: 17.7, dur: '3:12' }, { t0: 18.7, dur: '4:05' }, { t0: 19.3, dur: '3:48' }], { k: 0.62, y: 640 }) };
  } },
  // 8 — "Falava da janta, do tempo, do vizinho": contracampo, gesticula muito
  { t0: 20.0, async draw(t, T) {
    const u = ease(t, 0, 3.4); frameCam(KX - 1.6, 1.9, { top: TL, size: 'knee', az: lerp(25, 10, u), el: -0.2, off: 0.3 });
    const g = Math.floor((T - 20) / 1.15) % 3;
    await place('lucia', svgL(T, { face: -0.25, expr: ['joy', 'happy', 'laugh'][g], talk: 1, armR: 135, bendR: 75, holdR: PH, armL: [120, 70, 150][g] + 12 * Math.sin(T * 5), bendL: [30, 60, 20][g], handL: 'open', headTilt: [6, -5, 8][g] }), KX - 1.6, 0, 1.9);
    return { mood: 'day', over: popIcon(T, 20.3, ICON.janta, 230, 470, 0.9) + popIcon(T, 21.4, ICON.tempo, 540, 400, 0.9) + popIcon(T, 22.3, ICON.vizinho, 850, 470, 0.9) };
  } },
  // 9 — "Caio olhava o tamanho e pensava: Depois eu ouço": plano médio, por cima do ombro → frente
  { t0: 23.46, async draw(t, T) {
    const u = ease(t, 0, 3.4); frameCam(RX + 0.6, 0.8, { top: TC, size: 'med', az: lerp(-15, -5, u), el: 0.05, off: -0.15 });
    const e = exprAt(T, [[23.4, 'neutral'], [24.4, 'worried'], [25.4, 'smug']]);
    await place('caio', svgC(T, { face: 0.15, expr: e.expr, squash: e.pop, armR: 100, bendR: 70, holdR: PH, ly: T < 25.3 ? 0.8 : 0, lx: T < 25.3 ? 0.3 : 0.8, armL: T > 25.4 ? 60 : 15, bendL: 60, handL: 'open', headTilt: T > 25.4 ? -8 : 0 }), RX + 0.6, 0, 0.8);
    return { mood: 'night', over: popIcon(T, 23.9, `<g transform="scale(0.7)">${audioRow(-235, 0, '4:05', 0)}</g>`, 540, 420) + popIcon(T, 25.4, bubble('Depois eu ouço.', 540, 58), 760, 560, 0.85) };
  } },
  // 10 — "Mas o depois nunca chegava": Caio DORMINDO na cama, celular aceso no criado-mudo, dias passando
  { t0: 26.88, async draw(t, T) {
    const u = ease(t, 0, 1.84); camSet(RX + 0.9 - 0.3 * u, 2.3, 1.4 - 0.2 * u, RX - 2.75, 0.7, 1.75, 42, -3);
    ROOM.pl.intensity = 0.4; ROOM.scr.visible = false;
    await place('caio', svgC(T, { face: 0, expr: 'neutral', blink: 1, armL: 10, armR: 10, headTilt: 0, squash: Math.sin(T * 1.6) * 0.012 }), RX - 2.8, -0.12, 1.6, { rot: -90, hip: 0.85 });
    const d = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'][Math.min(4, Math.floor(t / 0.37))];
    const z = (k) => `<text x="${700 + k * 50}" y="${f2(760 - k * 60 - ((T * 40) % 30))}" font-family="Fredoka" font-weight="700" font-size="${50 + k * 14}" fill="#fff6e0" stroke="${INK}" stroke-width="8" paint-order="stroke">z</text>`;
    return { mood: 'night', over: `<g transform="translate(260 470) rotate(${f2(shake(T, 26.88 + Math.floor(t / 0.37) * 0.37, 8))})">${calendar(d)}</g>` + z(0) + z(1) + z(2) };
  } },
  // 11 — "As mensagens ficavam azuis, sem resposta": Lúcia sentada à mesa, olhando o celular
  { t0: 28.72, async draw(t, T) {
    const u = ease(t, 0, 3.9); frameCam(KS.x, KS.z, { top: TL - 0.5, vis: 1.5, az: lerp(-15, -5, u), el: 1.1, off: -0.1 });
    await seated(svgL(T, { face: 0.15, expr: T < 30.8 ? 'neutral' : 'worried', armR: 110, bendR: 80, holdR: PH, ly: 0.8, armL: 60, bendL: 80 }));
    const rows = [{ t0: 28.72, dur: '3:12', read: 1, readAt: 29.9 }, { t0: 28.72, dur: '4:05', read: 1, readAt: 30.1 }, { t0: 28.72, dur: '3:48', read: 1, readAt: 30.3 }, { t0: 28.72, dur: '2:57', read: 1, readAt: 30.5 }];
    return { mood: 'dusk', over: phoneUI(T, 28.72, rows, { k: 0.6, y: 600, rot: -3, foot: T > 31 ? 'sem resposta' : '' }) };
  } },
  // 12 — "Todo dia eu via a caixa encher": contra-plongée, áudios caindo do céu na fenda
  { t0: 32.66, async draw(t, T) {
    const u = ease(t, 0, 2.2); frameCam(0.4, BOXP.z - 0.3, { top: 2.6, vis: 3.6, az: lerp(30, 45, u), el: -0.9, fov: 44 });
    caixa(0, CNT(T), T);
    const L = []; for (let i = 0; i < 6; i++) { const v = ((t * 0.9 + i / 6) % 1); L.push({ x: lerp(-5 + i * 1.5, 0, v), y: lerp(6 + i * 0.3, 2.1, v), z: lerp(-4, 1.4, v), s: 0.38, op: clamp(v * 4) * clamp((1 - v) * 6), c: i % 3 }); }
    audios(L);
    await place('polo', svgP(T, { face: -0.5, expr: 'worried', lx: -0.6, ly: -1, armL: 40, bendL: 90, handL: 'open', headTilt: -6 }), PP.x, 0, PP.z);
    return { mood: 'day' };
  } },
  // 13 — "Eram dezenas de áudios, brilhando lá dentro": Polo espia pela porta entreaberta
  { t0: 34.88, async draw(t, T) {
    const u = ease(t, 0, 3.5); frameCam(0.5, BOXP.z - 0.6, { top: 2.4, vis: lerp(3.4, 2.8, u), az: lerp(-30, -18, u), el: 0.3 });
    caixa(0.32, CNT(T), T);
    await place('polo', svgP(T, { face: -0.5, expr: 'sad', lx: -1, armL: 70, bendL: 40, handL: 'open' }), PP.x + 0.05, 0, PP.z - 0.35);
    return { mood: 'dusk' };
  } },
  // 14 — "Um dia, a mãe mandou uma mensagem curta": sentada, digita devagar
  { t0: 38.38, async draw(t, T) {
    const u = ease(t, 0, 2.9); frameCam(KS.x, KS.z, { top: TL - 0.5, vis: lerp(2.2, 1.6, u), az: lerp(30, 12, u), el: 1.2, off: 0.1 });
    await seated(svgL(T, { face: -0.1, expr: 'sad', armR: 105, bendR: 85, holdR: PH, armL: 95, bendL: 80, ly: 0.9, headTilt: -5 }));
    return { mood: 'dusk' };
  } },
  // 15 — "Tudo bem, filho. Sem pressa."
  { t0: 41.24, async draw(t, T) {
    frameCam(KS.x, KS.z, { top: TL - 0.5, vis: 1.4, az: -6, el: 1.0, off: -0.05 });
    await seated(svgL(T, { face: 0.1, expr: T > 42.5 ? 'sad' : 'neutral', armR: 105, bendR: 85, holdR: PH, ly: 0.9, blink: T > 43.2 && T < 43.5 ? 1 : 0 }));
    return { mood: 'dusk', over: phoneUI(T, 41.24, [{ t0: 41.24, dur: '3:12', read: 1 }, { t0: 41.24, dur: '4:05', read: 1 }, { t0: 41.5, kind: 'text', txt: 'Tudo bem, filho.' }, { t0: 42.5, kind: 'text', txt: 'Sem pressa.' }], { k: 0.58, y: 640, rot: 2 }) };
  } },
  // 16 — "E nunca mais mandou áudio": plano geral alto, ela larga o celular, a luz baixa
  { t0: 43.84, async draw(t, T) {
    const u = ease(t, 0, 1.8); frameCam(KS.x, KS.z - 0.6, { top: 2.2, vis: 3.8, az: 40, el: 2.0 + u * 0.4, fov: 40 });
    await seated(svgL(T, { face: -0.4, expr: 'sad', armR: lerp(105, 15, ease(t, 0.2, 0.7)), bendR: 20, holdR: t < 0.5 ? PH : '', ly: 1, headTilt: -8 }));
    KITCHEN.pl.intensity = lerp(1.25, 0.3, ease(t, 0.7, 1.6));
    return { mood: 'night', over: comic(T, 44.9, 'SILÊNCIO', 540, 430, { size: 84, fill: '#9fd0ff' }) };
  } },
  // 17 — "Na primeira noite, Caio nem reparou": jogando no computador, fone, rindo
  { t0: 45.64, async draw(t, T) {
    const u = ease(t, 0, 2.3); frameCam(RX + 2.1, 1.3, { top: TC, size: 'knee', az: lerp(15, 25, u), el: 0.3, off: 0.2 });
    await place('caio', svgC(T, { face: 0.3, expr: 'laugh', armR: 100 + 8 * Math.sin(T * 9), bendR: 70, holdR: PH, armL: 100 - 8 * Math.sin(T * 9), bendL: 70, phones: 1, jump: Math.abs(Math.sin(T * 5)) * 6 }), RX + 2.1, 0, 1.3);
    return { mood: 'night', over: popIcon(T, 45.8, calendar('1ª'), 830, 470, 0.75) };
  } },
  // 18 — "Na segunda, estranhou o silêncio na casa": Caio na porta da cozinha escura
  { t0: 47.96, async draw(t, T) {
    KITCHEN.pl.intensity = 0.25; KITCHEN.pl2.intensity = 0.3;
    const u = ease(t, 0, 3); frameCam(KX + 2.2, -0.8, { top: TC, size: 'full', az: lerp(30, 45, u), el: 0.4, off: 0.3 });
    await place('caio', svgC(T, { face: -0.5, expr: 'worried', lx: -1, ly: 0.2, headTilt: 6 * Math.sin(T * 0.8), armL: 20, armR: 20 }), KX + 2.2, 0, -0.8);
    return { mood: 'night', over: popIcon(T, 48.1, calendar('2ª'), 830, 470, 0.75) + comic(T, 49.9, '...', 300, 520, { size: 110, fill: '#9fd0ff' }) };
  } },
  // 19 — "Na terceira, ficou olhando o celular": sentado na beira da cama, tela iluminando o rosto
  { t0: 51.0, async draw(t, T) {
    ROOM.pl.intensity = 0.35;
    const u = ease(t, 0, 3.7); frameCam(RX - 1.9, 0.9, { top: TC, vis: lerp(2.2, 1.6, u), az: lerp(25, 10, u), el: 0.2, off: 0.15 });
    await place('caio', svgC(T, { face: -0.1, expr: 'sad', armR: 100, bendR: 70, holdR: phoneSvg(1), ly: 0.85, headTilt: -4 }), RX - 1.9, 0, 0.9);
    return { mood: 'night', over: popIcon(T, 51.1, calendar('3ª'), 830, 470, 0.75) };
  } },
  // 20 — "Ele me procurou na praça, de cabeça baixa": Caio entra de costas pela praça, Polo à frente
  { t0: 54.74, async draw(t, T) {
    const z = lerp(-6, -2.0, ease(t, 0, 2.84)); frameCam(-0.3, z, { top: TC, size: 'full', az: -8, el: 0.6, dk: 1.25, off: -0.2 });
    caixa(0, 47, T);
    await place('caio', svgC(T, { back: true, walk: T * 7, expr: 'sad' }), -0.3, 0, z);
    await place('polo', svgP(T, { face: -0.2, expr: 'neutral', lx: -0.4 }), PP.x, 0, PP.z);
    return { mood: 'night' };
  } },
  // 21 — "Polo, cadê os áudios da minha mãe?": plano/contraplano a dois
  { t0: 57.58, async draw(t, T) {
    frameCam((CS.x + PP.x) / 2, (CS.z + PP.z) / 2, { top: TP, vis: 3.0, az: lerp(16, 8, ease(t, 0, 2.7)), el: 0.1 });
    caixa(0, 47, T);
    await place('caio', svgC(T, { face: 0.6, expr: 'sad', lx: 1, ly: -0.3, armL: 35, armR: 55 + 15 * Math.sin(T * 4), bendR: 50, handR: 'open' }), CS.x, 0, CS.z);
    await place('polo', svgP(T, { face: -0.6, expr: T > 59.4 ? 'sad' : 'worried', lx: -1 }), PP.x, 0, PP.z);
    return { mood: 'night' };
  } },
  // 22 — "Abri a caixa": portas abrem para fora, luz no rosto
  { t0: 60.26, async draw(t, T) {
    const o = ease(t, 0.15, 1.0); frameCam(0.2, BOXP.z - 0.8, { top: 2.4, vis: 3.3, az: lerp(-12, -4, o), el: 0.1, off: 0.3 });
    caixa(o, 47, T); audios(floatAud(T, Math.round(o * 14), { R: 2, H: 2.5, y: 1.4 }));
    await place('polo', svgP(T, { face: -0.6, expr: o > 0.5 ? 'happy' : 'neutral', armL: lerp(100, 40, o), bendL: 20, handL: 'open' }), PP.x + 0.15, 0, PP.z - 0.35);
    return { mood: 'night', over: comic(T, 60.5, 'NHEEC', 790, 470, { size: 80, fill: '#ffd23f' }) };
  } },
  // 23 — "Estavam todos lá, esperando": por cima do ombro do Caio, prateleiras cheias
  { t0: 61.66, async draw(t, T) {
    const u = ease(t, 0, 2.5); camSet(lerp(-1.9, -1.6, u), 2.2, lerp(-3.8, -3.4, u), 0, 1.25, BOXP.z, 44);
    caixa(1, 47, T);
    await place('caio', svgC(T, { back: true, expr: 'sad' }), CS.x - 0.05, 0, CS.z - 0.3);
    return { mood: 'night', over: popIcon(T, 62.7, bubble('esperando...', 470, 56), 680, 470, 0.85) };
  } },
  // 24 — "Caio colocou o fone e começou pelo mais antigo"
  { t0: 64.22, async draw(t, T) {
    const u = ease(t, 0, 3); frameCam(CS.x, CS.z, { top: TC, size: 'knee', az: lerp(-25, -12, u), el: 0.15, off: -0.2 });
    caixa(1, CNT(T), T);
    const on = T > 64.9, v = ease(t, 1.6, 2.9);
    audios([{ x: lerp(0, CS.x, v), y: lerp(1.0, 1.45, v), z: lerp(1.6, CS.z, v), s: 0.33, c: 0, op: 1 - v * 0.6 }]);
    await place('caio', svgC(T, { face: 0.3, expr: v > 0.9 ? 'surprised' : 'sad', phones: on, armL: on ? 30 : 160, armR: on ? 30 : 160, bendL: 40, bendR: 40, handL: 'open', handR: 'open', lx: 0.6 }), CS.x, 0, CS.z);
    return { mood: 'night' };
  } },
  // 25 — lembrança (sépia): "Filho, hoje fiz o bolo que você gosta" — ela tira o bolo e mostra
  { t0: 67.26, async draw(t, T) {
    const u = ease(t, 0, 4.1); frameCam(KX + 0.9, 0.95, { top: TL, size: 'knee', az: lerp(-30, -10, u), el: 0.3, off: -0.3 });
    await place('lucia', svgL(T, { face: -0.3, expr: 'joy', armL: 75 + 8 * Math.sin(T * 3), bendL: 50, handL: 'open', armR: 80, bendR: 45, handR: 'open', headTilt: 5 * Math.sin(T * 1.5) }), KX + 0.9, 0, 0.95);
    return { mood: 'sepia', over: popIcon(T, 69.9, ICON.bolo, 830, 450, 0.85) + `<rect width="1080" height="1920" fill="#c89a5a" opacity="0.16"/>` };
  } },
  // 26 — "Não precisa responder, só come.": bolo em primeiro plano, ela ao fundo sorrindo
  { t0: 71.4, async draw(t, T) {
    const u = ease(t, 0, 2.5); camSet(KX + 0.1 - 0.2 * u, 1.45, -1.7, KX + 0.75, 1.15, 0.9, 40);
    await place('lucia', svgL(T, { face: -0.4, expr: T > 72.6 ? 'laugh' : 'joy', armL: 40 + 10 * Math.sin(T * 3), armR: 40, headTilt: 6 }), KX + 0.9, 0, 0.95);
    return { mood: 'sepia', over: `<rect width="1080" height="1920" fill="#c89a5a" opacity="0.16"/>` + popIcon(T, 72.6, heart(), 820, 470, 2.4) };
  } },
  // 27 — "Ele riu, com os olhos cheios de água"
  { t0: 73.94, async draw(t, T) {
    const u = ease(t, 0, 2.5); frameCam(CS.x, CS.z, { top: TC, size: 'med', az: lerp(15, 5, u), el: 0.05, off: 0.1 });
    caixa(1, CNT(T), T);
    await place('caio', svgC(T, { face: -0.1, expr: T < 75.0 ? 'laugh' : 'happy', tears: clamp((T - 74.5) / 0.6), phones: 1, squash: T < 75 ? Math.sin(T * 20) * 0.02 : 0, armL: 60, bendL: 100, handL: 'open', headTilt: 5 }), CS.x, 0, CS.z);
    return { mood: 'night' };
  } },
  // 28 — "Ouviu um atrás do outro, até o último": órbita, áudios em fila até o ouvido
  { t0: 76.5, async draw(t, T) {
    const q = ease(t, 0, 2.76); frameCam(CS.x + 0.4, CS.z + 0.6, { top: 2.4, vis: 3.2, az: lerp(-50, 20, q), el: 0.6 });
    caixa(1, CNT(T), T);
    const L = []; for (let i = 0; i < 8; i++) { const v = ((t * 1.3 + i / 8) % 1); L.push({ x: lerp(0, CS.x, v), y: lerp(1.2 + (i % 4) * 0.3, 1.45, v) + Math.sin(v * 3) * 0.3, z: lerp(1.6, CS.z, v), s: 0.3, op: clamp((1 - v) * 5), c: i % 3 }); }
    audios(L);
    await place('caio', svgC(T, { face: 0.3, expr: 'sad', tears: 0.6, phones: 1, blink: (T % 2.2) < 0.15 ? 1 : 0 }), CS.x, 0, CS.z);
    return { mood: 'night' };
  } },
  // 29 — último áudio: Lúcia à janela, noite — "eu só queria ouvir a sua voz"
  { t0: 79.26, async draw(t, T) {
    KITCHEN.pl.intensity = 0.4;
    const u = ease(t, 0, 2.6); frameCam(KX - 1.6, 1.9, { top: TL, size: 'knee', az: lerp(25, 12, u), el: 0.2, off: 0.25 });
    await place('lucia', svgL(T, { face: -0.2, expr: 'sad', armL: 40, bendL: 90, armR: 40, bendR: 90, handL: 'open', handR: 'open', ly: -0.2, lx: -0.6 }), KX - 1.6, 0, 1.9);
    return { mood: 'night', over: popIcon(T, 79.4, `<g transform="scale(0.8)">${audioRow(-235, 0, 'ÚLTIMO', 0, 1, (T - 79.4) / 4.8)}</g>`, 540, 430) };
  } },
  // 30 — "Mas tudo bem, eu espero.": plano médio frontal, lágrima
  { t0: 81.9, async draw(t, T) {
    KITCHEN.pl.intensity = 0.4;
    const u = ease(t, 0, 2.3); frameCam(KX - 1.6, 1.9, { top: TL, vis: lerp(1.9, 1.55, u), az: -5, el: 0.05 });
    await place('lucia', svgL(T, { face: 0.05, expr: T > 83.1 ? 'happy' : 'sad', tears: 0.5, armL: 40, bendL: 90, armR: 40, bendR: 90, handL: 'open', handR: 'open' }), KX - 1.6, 0, 1.9);
    return { mood: 'night' };
  } },
  // 31 — "Caio saiu correndo, sem nem se despedir": tira o fone e dispara; Polo acena
  { t0: 84.28, async draw(t, T) {
    const run = T > 84.85, x = run ? CS.x - (T - 84.85) * 4.5 : CS.x;
    frameCam((CS.x + PP.x) / 2 - 0.3, 0.2, { top: TP, size: 'full', az: 0, el: 0.3, dk: 1.35 });
    caixa(1, 0, T);
    await place('caio', run ? svgC(T, { side: true, face: sideFace(-1, 0), walk: T * 18, run: 1, expr: 'worried' }) : svgC(T, { face: 0.2, expr: 'surprised', armL: 150, armR: 150, handL: 'open', handR: 'open', jump: 10 }), x, 0, CS.z);
    await place('polo', svgP(T, { face: -0.6, expr: T < 85.5 ? 'surprised' : 'happy', lx: -1, armR: T > 85.5 ? 150 + Math.sin(T * 12) * 18 : 20, bendR: 30, handR: 'open' }), PP.x, 0, PP.z);
    return { mood: 'night', over: comic(T, 84.95, 'ZUUM!', 280, 520, { size: 96, fill: '#ff7a45' }) };
  } },
  // 32 — correndo pela rua até a casa, amanhecendo (travelling, corre para a direita da tela)
  { t0: 87.02, async draw(t, T) {
    WORLD.cars.forEach(c => c.g.visible = false);
    const x = lerp(1, HOUSE.x - 0.8, ease(t, 0, 1.24)); frameCam(x, ST + 0.3, { top: TC, size: 'full', az: 160, el: 0.2, off: -0.2, dk: 1.1 });
    await place('caio', svgC(T, { side: true, face: sideFace(1, 0), walk: T * 18, run: 1, expr: 'worried' }), x, 0.16, ST + 0.3);
    return { mood: 'dawn' };
  } },
  // 33 — "ela abriu a porta": a porta abre para dentro; Caio parado no degrau
  { t0: 88.26, async draw(t, T) {
    frameCam(HOUSE.x, DOORZ + 1.0, { top: 2.4, vis: 3.3, az: 170, el: 0.4, off: 0.2 });
    WORLD.door.rotation.y = 1.7 * ease(t, 0, 0.55);
    await place('lucia', svgL(T, { face: 0.1, expr: 'surprised', armL: 60, bendL: 60, handL: 'open', squash: pulse(T, 88.7, 0.15) * 0.05 }), HOUSE.x + 0.1, 0.14, DOORZ + 0.1);
    await place('caio', svgC(T, { back: true, expr: 'sad' }), HOUSE.x - 0.2, 0.16, DOORZ + 1.3);
    return { mood: 'dawn' };
  } },
  // 34 — o abraço: por cima do ombro do Caio, os braços dela em volta dele
  { t0: 89.06, async draw(t, T) {
    const u = ease(t, 0, 2.26); frameCam(HOUSE.x, DOORZ + 0.8, { top: TL, vis: lerp(2.3, 1.9, u), az: lerp(165, 190, u), el: 0.15 });
    WORLD.door.rotation.y = 1.7;
    await place('lucia', svgL(T, { face: 0, expr: 'joy', tears: 0.7, blink: 1, armL: 115, armR: 115, bendL: 75, bendR: 75, handL: 'open', handR: 'open', headTilt: 8 }), HOUSE.x + 0.05, 0.16, DOORZ + 0.6);
    await place('caio', svgC(T, { back: true, armL: 95, armR: 95, bendL: 70, bendR: 70, headTilt: -6 }), HOUSE.x - 0.05, 0.16, DOORZ + 0.85);
    return { mood: 'dawn', over: popIcon(T, 89.6, heart(), 540, 430, 2.4) };
  } },
  // 35 — "Mãe, me manda um áudio. Eu ouço até o fim.": dois de lado, abraçados
  { t0: 91.32, async draw(t, T) {
    const u = ease(t, 0, 3.1); frameCam(HOUSE.x, DOORZ + 0.8, { top: TL, vis: lerp(2.4, 2.0, u), az: lerp(200, 185, u), el: 0.1 });
    WORLD.door.rotation.y = 1.7;
    await place('lucia', svgL(T, { face: -0.45, expr: T > 93 ? 'joy' : 'happy', tears: 0.5, lx: -1, armR: 30, armL: 115, bendL: 60, handL: 'open' }), HOUSE.x + 0.35, 0.16, DOORZ + 0.75);
    await place('caio', svgC(T, { face: 0.45, expr: 'happy', lx: 1, armR: 110, bendR: 60, handR: 'open', armL: 30 }), HOUSE.x - 0.33, 0.16, DOORZ + 0.85);
    return { mood: 'dawn', over: T > 93 ? popIcon(T, 93.1, `<g transform="scale(0.8)">${audioRow(-235, 0, 'ATÉ O FIM', 1, 1, 1)}</g>`, 540, 430) : '' };
  } },
  // 36 — pergunta: Polo fecha a caixa vazia e olha para a câmera
  { t0: 94.42, async draw(t, T) {
    const c = ease(t, 0, 1.2); frameCam(PP.x - 0.3, PP.z, { top: TP, size: 'knee', az: lerp(-25, -8, ease(t, 0, 2.6)), el: 0.15, off: -0.2 });
    caixa(1 - c, 0, T);
    await place('polo', svgP(T, { face: 0, expr: t > 1.3 ? 'neutral' : 'happy', armL: 60 * (1 - c) + 12, handL: 'open', lx: 0, ly: 0 }), PP.x, 0, PP.z);
    return { mood: 'day', over: banner(T, 94.5, 'VOCÊ OUVIU O ÚLTIMO', 'ÁUDIO DA SUA MÃE?', null, 400) };
  } },
  // 37 — CTA e volta pro começo (noite, caixa brilhando)
  { t0: 97.1, async draw(t, T) {
    const q = ease(t, 0, 2.2); frameCam(BOXP.x, BOXP.z, { raw: 1, top: 2.9, vis: lerp(4.2, 6.2, q), az: lerp(-5, -25, q), el: lerp(0.6, 0.0, q), fov: 42, dy: -0.4 });
    caixa(0.22, 64, T); audios(floatAud(T, 20, { R: 4, H: 4 }));
    const pa = E.back(clamp((T - 97.2) / 0.3));
    const btn = (x, txt, c, d) => `<g transform="translate(${x} 560) scale(${f2(pa * (1 + 0.06 * Math.sin(T * 8 + d)))})"><rect x="-200" y="-70" width="400" height="130" rx="30" fill="${c}" stroke="${INK}" stroke-width="9"/>${TXT(0, 22, txt, 72)}</g>`;
    return { mood: 'night', over: TXT(540, 400, 'COMENTA:', 64) + btn(300, 'ESCUTO', '#3a8ae8', 0) + btn(780, 'PULO', '#e8503a', 1) };
  } },
];
