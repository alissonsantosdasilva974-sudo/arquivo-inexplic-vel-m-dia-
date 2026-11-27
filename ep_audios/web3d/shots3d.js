// Ep. "Todo áudio que você pula" — cenas no motor 3D (câmera em metros; bonecos do canal como recortes)
const POLO3 = o => Object.assign({ hat: 'fedora', pocketNote: true, x: 0, y: 0, s: 1 }, o);
const IVP = [[5.3, 11.0], [32.6, 38.3], [54.7, 57.5], [60.2, 64.2]], IVC = [[57.55, 60.2], [91.3, 94.4]], IVL = [[68.85, 73.9], [79.2, 84.2]];
const svgP = (T, o = {}) => person('polo', POLO3(Object.assign({ t: T, mouth: lips(T, IVP) }, o)));
const svgC = (T, o = {}) => { const s = person('caio', Object.assign({ x: 0, y: 0, s: 1, t: T, mouth: lips(T, IVC) }, o)); return o.phones ? withPhones(s) : s; };
const svgL = (T, o = {}) => person('lucia', Object.assign({ x: 0, y: 0, s: 1, t: T, mouth: o.talk ? 0.25 + 0.3 * Math.abs(Math.sin(T * 9)) : lips(T, IVL) }, o));
const ease = (t, a, b) => E.inOut(clamp((t - a) / (b - a)));
const PH = phoneSvg();
const PP = { x: 1.25, z: 0.9 };                      // Polo ao lado da caixa
const ST = -20.6;                                    // calçada da casa
// áudios saindo da caixa e flutuando
const floatAud = (T, n, o = {}) => { const L = [], r = rng(o.seed || 5); for (let i = 0; i < n; i++) { const a = r() * 6.28, sp = 0.3 + r() * 0.4, ph = ((T * sp + r()) % 1);
  L.push({ x: (o.x || 0) + Math.cos(a + T * 0.3) * (0.6 + ph * (o.R || 3)), y: (o.y || 1.6) + ph * (o.H || 3), z: (o.z || 2) + Math.sin(a + T * 0.3) * (0.6 + ph * (o.R || 3)) - 0.5, s: 0.32 + r() * 0.2, op: Math.sin(ph * Math.PI), c: i % 3 }); } return L; };
const SHOTS3 = [
  // 1 — gancho: noite, a caixa brilhando com áudios saindo, câmera avançando
  { t0: 0, async draw(t, T) {
    const q = ease(t, 0, 3.3); camSet(-2.5 + 1.5 * q, 1.3 + 0.4 * q, -7 + 2.6 * q, 0, 1.6, 2, 46);
    caixa(0.25 + 0.15 * Math.sin(T * 2), 64, T); audios(floatAud(T, 26, { R: 4, H: 4 }));
    await place('polo', svgP(T, { face: 0.4, expr: 'worried', lx: -1 }), PP.x + 0.6, 0, PP.z - 0.6);
    return { mood: 'night', over: banner(T, 0.15, 'NESTA CIDADE,', 'TODO ÁUDIO QUE VOCÊ PULA', 'FICA ESPERANDO') };
  } },
  // 2 — "esperando por você": close na fenda, áudios pulsando lá dentro
  { t0: 3.34, async draw(t, T) {
    camSet(0.2, 1.9, -1.4 + 0.3 * ease(t, 0, 2), 0, 1.95, 2, 36, -3);
    caixa(0.12 + 0.05 * Math.sin(T * 6), 64, T); audios(floatAud(T, 10, { R: 1.5, H: 1.5, y: 2 }));
    return { mood: 'night', over: popIcon(T, 3.6, bubble('...você.', 300, 60), 540, 600) };
  } },
  // 3 — "Eu sou o Polo, o carteiro dos recados": de dia, Polo acena ao lado da caixa
  { t0: 5.32, async draw(t, T) {
    const a = ease(t, 0, 2.8); camSet(PP.x - 0.8 + 0.6 * a, 1.5, PP.z - 3.8 + 0.5 * a, PP.x - 0.4, 1.25, PP.z + 1, 42);
    caixa(0, 30, T);
    const e = exprAt(T, [[5.3, 'happy'], [6.6, 'joy']]);
    await place('polo', svgP(T, { face: -0.2, expr: e.expr, squash: e.pop, armR: T > 5.5 && T < 7.2 ? 150 + Math.sin(T * 12) * 15 : 20, bendR: 30, handR: 'open' }), PP.x, 0, PP.z);
    return { mood: 'day', over: comic(T, 6.7, 'CARTEIRO!', 760, 560, { size: 80, fill: '#ffd23f' }) };
  } },
  // 4 — "Guardo todos eles na caixa da praça": Polo põe um áudio na fenda, drone sobe
  { t0: 8.2, async draw(t, T) {
    const q = ease(t, 1.1, 2.9); camSet(lerp(-1.2, -14, q), lerp(1.6, 16, q), lerp(-2.6, -18, q), 0, lerp(1.6, 0.5, q), 2, lerp(40, 50, q));
    caixa(0, 30, T); const u = ease(t, 0, 1.0);
    audios(u < 1 ? [{ x: lerp(1.0, 0.1, u), y: lerp(1.3, 1.85, u), z: lerp(0.8, 1.4, u), s: 0.4 }] : []);
    await place('polo', svgP(T, { face: -0.6, expr: 'happy', armL: lerp(60, 100, u), bendL: 30, handL: 'open', lx: -1 }), PP.x - 0.2, 0, PP.z);
    await place('viz', person('viz2', { x: 0, y: 0, s: 1, t: T, side: true, face: 0.8, walk: T * 8 }), -6 + T * 0.4 - 8, 0, -2);
    return { mood: 'day' };
  } },
  // 5 — "Caio tinha dezesseis anos e muita pressa": Caio passa correndo na calçada, celular na mão
  { t0: 11.14, async draw(t, T) {
    const x = lerp(-4, 6, ease(t, 0, 3.1)); camSet(x + 1.5, 1.3, ST + 4.6, x, 1.1, ST, 44); WORLD.cars.forEach(c => c.g.visible = false);
    await place('caio', svgC(T, { side: true, face: -0.8, walk: T * 16, run: 1, expr: 'neutral', armR: 70, holdR: PH }), x, 0, ST);
    await place('viz', person('senhora', { x: 0, y: 0, s: 1, t: T, face: -0.5, expr: 'surprised' }), x - 3 + t * 0.5, 0, ST - 0.6);
    return { mood: 'day', over: popIcon(T, 11.6, calendar('16'), 260, 560, 0.9) + comic(T, 12.9, 'PRESSA!', 760, 600, { size: 90, fill: '#ff7a45' }) };
  } },
  // 6 — "A mãe dele, dona Lúcia, mandava áudio todo dia": cozinha, ela grava falando no celular
  { t0: 14.26, async draw(t, T) {
    const a = ease(t, 0, 3.3); camSet(KX - 1.2 + 0.8 * a, 1.45, -2.4 + 0.4 * a, KX - 0.4, 1.3, 1, 42);
    await place('lucia', svgL(T, { face: 0.3, expr: 'happy', talk: 1, armR: 140, bendR: 70, holdR: PH }), KX - 0.4, 0, 1);
    audios([{ x: KX + 0.4, y: 1.7 + (t % 1.1) * 0.8, z: 1, s: 0.35, op: Math.sin((t % 1.1) / 1.1 * Math.PI) }]);
    return { mood: 'day', over: popIcon(T, 15.0, bubble('DONA LÚCIA', 440, 56, '#ffd23f'), 540, 520) };
  } },
  // 7 — "Três minutos, quatro minutos": o celular do Caio enchendo de áudios longos
  { t0: 17.56, async draw(t, T) {
    camSet(RX - 0.6, 1.3, -2.2, RX - 1.2, 1.0, 1.6, 44);
    await place('caio', svgC(T, { face: 0.4, expr: 'neutral', armR: 100, bendR: 70, holdR: PH }), RX - 1.3, 0, 1.0);
    return { mood: 'night', over: phoneUI(T, 17.56, [{ t0: 17.7, dur: '3:12' }, { t0: 18.7, dur: '4:05' }, { t0: 19.3, dur: '3:48' }], { k: 0.8, y: 860 }) };
  } },
  // 8 — "Falava da janta, do tempo, do vizinho": Lúcia falando, ícones pipocando
  { t0: 20.0, async draw(t, T) {
    camSet(KX + 0.8, 1.3, -2.3, KX + 0.1, 1.35, 1, 40);
    await place('lucia', svgL(T, { face: -0.3, expr: 'joy', talk: 1, armR: 140, bendR: 70, holdR: PH, armL: 70 + 30 * Math.sin(T * 4), handL: 'open' }), KX, 0, 1);
    return { mood: 'day', over: popIcon(T, 20.3, ICON.janta, 250, 560) + popIcon(T, 21.4, ICON.tempo, 540, 470) + popIcon(T, 22.3, ICON.vizinho, 830, 560) };
  } },
  // 9 — "Caio olhava o tamanho e pensava: Depois eu ouço."
  { t0: 23.46, async draw(t, T) {
    camSet(RX - 1.0, 1.5, -1.3 + 0.25 * ease(t, 0, 3), RX - 1.3, 1.3, 1, 38);
    const e = exprAt(T, [[23.4, 'neutral'], [25.3, 'smug']]);
    await place('caio', svgC(T, { face: 0.2, expr: e.expr, squash: e.pop, armR: 100, bendR: 70, holdR: PH, ly: 0.8 }), RX - 1.3, 0, 1.0);
    return { mood: 'night', over: popIcon(T, 23.9, `<g transform="scale(0.7)">${audioRow(-235, 0, '4:05', 0)}</g>`, 540, 520) + popIcon(T, 25.4, bubble('Depois eu ouço.', 560, 58), 540, 760) };
  } },
  // 10 — "Mas o depois nunca chegava": calendário passando, ele deitado jogando
  { t0: 26.88, async draw(t, T) {
    camSet(RX + 0.6, 2.4, -1.8, RX - 1.8, 0.6, 1.6, 46);
    await place('caio', svgC(T, { side: true, face: -0.8, expr: 'happy', armR: 100, bendR: 70, holdR: PH }), RX - 2.2, 0.7, 1.6, { rot: -80, hip: 0.9 });
    const d = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'][Math.min(4, Math.floor(t / 0.37))];
    return { mood: 'night', over: `<g transform="translate(540 520) rotate(${f2(shake(T, 26.88 + Math.floor(t / 0.37) * 0.37, 8))})">${calendar(d)}</g>` };
  } },
  // 11 — "As mensagens ficavam azuis, sem resposta"
  { t0: 28.72, async draw(t, T) {
    camSet(KX - 0.4, 1.3, -2.0, KX - 0.6, 1.2, 1, 40);
    await place('lucia', svgL(T, { face: 0.2, expr: 'worried', armR: 100, bendR: 70, holdR: PH, ly: 0.8 }), KX - 0.6, 0, 1);
    const rows = [{ t0: 28.72, dur: '3:12', read: 1, readAt: 29.9 }, { t0: 28.72, dur: '4:05', read: 1, readAt: 30.1 }, { t0: 28.72, dur: '3:48', read: 1, readAt: 30.3 }, { t0: 28.72, dur: '2:57', read: 1, readAt: 30.5 }];
    return { mood: 'dusk', over: phoneUI(T, 28.72, rows, { k: 0.8, y: 860, rot: -3, foot: T > 31 ? 'sem resposta' : '' }) };
  } },
  // 12 — "Todo dia eu via a caixa encher": Polo vê áudios chegando voando
  { t0: 32.66, async draw(t, T) {
    camSet(-2.2, 1.4, -2.2, 0.2, 1.4, 1.6, 44);
    caixa(0, CNT(T), T);
    const L = []; for (let i = 0; i < 6; i++) { const u = ((t * 0.9 + i / 6) % 1); L.push({ x: lerp(-7 + i, 0, u), y: lerp(4 + i * 0.3, 1.85, u), z: lerp(-6, 1.4, u), s: 0.38, op: clamp(u * 4) * clamp((1 - u) * 6), c: i % 3 }); }
    audios(L);
    await place('polo', svgP(T, { face: -0.6, expr: 'worried', lx: -1, ly: -0.6 }), PP.x, 0, PP.z);
    return { mood: 'day' };
  } },
  // 13 — "Eram dezenas de áudios, brilhando lá dentro": porta entreaberta, dentro cheio
  { t0: 34.88, async draw(t, T) {
    camSet(0.3, 1.3, -1.7 + 0.4 * ease(t, 0, 3.5), 0, 1.2, 2, 44);
    caixa(0.35, CNT(T), T);
    await place('polo', svgP(T, { face: -0.4, expr: 'sad', lx: -1 }), PP.x + 0.1, 0, PP.z - 0.3);
    return { mood: 'dusk' };
  } },
  // 14 — "Um dia, a mãe mandou uma mensagem curta": Lúcia sentada à mesa, digitando
  { t0: 38.38, async draw(t, T) {
    const a = ease(t, 0, 2.9); camSet(KX - 1.6 + 0.6 * a, 1.6, -2.4 + 0.5 * a, KX - 0.9, 1.0, 0.4, 42);
    await place('lucia', svgL(T, { face: 0.4, expr: 'sad', armR: 100, bendR: 80, holdR: PH, armL: 90, bendL: 80, ly: 0.9 }), KX - 1.1, 0, 0.35, { k: 0.95 });
    return { mood: 'dusk' };
  } },
  // 15 — "Tudo bem, filho. Sem pressa."
  { t0: 41.24, async draw(t, T) {
    camSet(KX - 1.1, 1.45, -1.4, KX - 1.1, 1.2, 0.4, 38);
    await place('lucia', svgL(T, { face: 0.2, expr: 'sad', armR: 100, bendR: 80, holdR: PH, ly: 0.9 }), KX - 1.1, 0, 0.35, { k: 0.95 });
    return { mood: 'dusk', over: phoneUI(T, 41.24, [{ t0: 41.24, dur: '3:12', read: 1 }, { t0: 41.24, dur: '4:05', read: 1 }, { t0: 41.5, kind: 'text', txt: 'Tudo bem, filho.' }, { t0: 42.5, kind: 'text', txt: 'Sem pressa.' }], { k: 0.75, y: 820, rot: 2 }) };
  } },
  // 16 — "E nunca mais mandou áudio": ela larga o celular; o placar para
  { t0: 43.84, async draw(t, T) {
    camSet(KX + 1.8, 2.2, -2.6, KX - 0.6, 0.9, 0.6, 44);
    await place('lucia', svgL(T, { face: 0.6, expr: 'sad', armR: 20, ly: 1 }), KX - 1.1, 0, 0.35, { k: 0.95 });
    KITCHEN.pl.intensity = lerp(1.2, 0.35, ease(t, 0.8, 1.6));
    return { mood: 'night', over: comic(T, 44.9, 'SILÊNCIO', 540, 560, { size: 84, fill: '#9fd0ff' }) };
  } },
  // 17 — "Na primeira noite, Caio nem reparou": jogando, rindo
  { t0: 45.64, async draw(t, T) {
    camSet(RX + 0.2, 1.4, -2.0, RX - 1.0, 1.1, 1.2, 42);
    await place('caio', svgC(T, { face: 0.3, expr: 'laugh', armR: 100, bendR: 70, holdR: PH, armL: 100, bendL: 70, phones: 1 }), RX - 1.0, 0, 1.0);
    return { mood: 'night', over: popIcon(T, 45.8, calendar('1ª'), 820, 560, 0.75) };
  } },
  // 18 — "Na segunda, estranhou o silêncio na casa"
  { t0: 47.96, async draw(t, T) {
    const a = ease(t, 0, 3); camSet(KX + 2.6, 1.5, -2.8 + 0.4 * a, KX + 1.6, 1.2, 0.8, 42);
    KITCHEN.pl.intensity = 0.25; KITCHEN.pl2.intensity = 0.25;
    await place('caio', svgC(T, { face: -0.6, expr: 'worried', lx: -1 }), KX + 2.4, 0, -0.6);
    return { mood: 'night', over: popIcon(T, 48.1, calendar('2ª'), 820, 560, 0.75) + comic(T, 49.9, '...', 300, 600, { size: 110, fill: '#9fd0ff' }) };
  } },
  // 19 — "Na terceira, ficou olhando o celular": rosto iluminado, push-in
  { t0: 51.0, async draw(t, T) {
    KITCHEN.pl.intensity = 1.2; KITCHEN.pl2.intensity = 0.5;
    camSet(RX - 1.05, 1.5, -1.8 + 0.5 * ease(t, 0, 3.7), RX - 1.3, 1.3, 1, 38);
    ROOM.pl.intensity = 0.35;
    await place('caio', svgC(T, { face: 0.1, expr: 'sad', armR: 100, bendR: 70, holdR: phoneSvg(1), ly: 0.8 }), RX - 1.3, 0, 1.0);
    return { mood: 'night', over: popIcon(T, 51.1, calendar('3ª'), 820, 560, 0.75) };
  } },
  // 20 — "Ele me procurou na praça, de cabeça baixa": Caio anda pela praça à noite, de costas
  { t0: 54.74, async draw(t, T) {
    ROOM.pl.intensity = 1.1;
    const z = lerp(-6, -2.4, ease(t, 0, 2.8)); camSet(-1.2, 1.7, z - 3.2, 0, 1.0, z + 3, 44);
    caixa(0, 47, T);
    await place('caio', svgC(T, { back: true, walk: T * 7, expr: 'sad' }), -0.4, 0, z);
    await place('polo', svgP(T, { face: -0.3, expr: 'neutral' }), PP.x, 0, PP.z);
    return { mood: 'night' };
  } },
  // 21 — "Polo, cadê os áudios da minha mãe?"
  { t0: 57.58, async draw(t, T) {
    camSet(PP.x + 1.2, 1.5, -1.4, -0.2, 1.4, 0.2, 40);
    caixa(0, 47, T);
    await place('caio', svgC(T, { face: 0.6, expr: 'sad', lx: 1, armL: 40, armR: 40 }), -0.3, 0, -0.2);
    await place('polo', svgP(T, { face: -0.6, expr: 'worried', lx: -1 }), PP.x, 0, PP.z);
    return { mood: 'night' };
  } },
  // 22 — "Abri a caixa": portas abrem, luz
  { t0: 60.26, async draw(t, T) {
    const o = ease(t, 0.15, 1.0); camSet(-0.4, 1.4, -2.6 + 0.3 * o, 0, 1.3, 2, 44);
    caixa(o, 47, T); audios(floatAud(T, Math.round(o * 14), { R: 2, H: 2.5, y: 1.4 }));
    await place('polo', svgP(T, { face: -0.6, expr: 'neutral', armL: 120 * (1 - o) + 40, bendL: 20, handL: 'open' }), PP.x + 0.1, 0, PP.z - 0.2);
    return { mood: 'night', over: comic(T, 60.5, 'NHEEC', 760, 560, { size: 80, fill: '#ffd23f' }) };
  } },
  // 23 — "Estavam todos lá, esperando": close nas prateleiras
  { t0: 61.66, async draw(t, T) {
    camSet(0.1, 1.6 - 0.3 * ease(t, 0, 2.5), -0.6, 0, 1.3, 2.4, 50);
    caixa(1, 47, T);
    return { mood: 'night', over: popIcon(T, 62.7, bubble('esperando...', 470, 56), 540, 560) };
  } },
  // 24 — "Caio colocou o fone e começou pelo mais antigo"
  { t0: 64.22, async draw(t, T) {
    camSet(-0.3, 1.5, -2.8, -0.5, 1.2, 1, 42);
    caixa(1, CNT(T), T);
    const on = T > 64.9; const u = ease(t, 1.6, 2.9);
    audios([{ x: lerp(0, -0.5, u), y: lerp(1.0, 1.75, u), z: lerp(1.6, -0.1, u), s: 0.35, c: 0 }]);
    await place('caio', svgC(T, { face: 0.3, expr: 'sad', phones: on, armL: on ? 40 : 160, armR: on ? 40 : 160, bendL: 40, bendR: 40, handL: 'open', handR: 'open' }), -0.5, 0, -0.2);
    return { mood: 'night' };
  } },
  // 25 — lembrança (sépia): "Filho, hoje fiz o bolo que você gosta"
  { t0: 67.26, async draw(t, T) {
    const a = ease(t, 0, 3.1); camSet(KX - 0.2 + 0.4 * a, 1.4, -2.4 + 0.5 * a, KX + 0.1, 1.0, 0.4, 40);
    await place('lucia', svgL(T, { face: -0.3, expr: 'happy', armL: 60, bendL: 50, handL: 'open', armR: 70, bendR: 40, handR: 'open' }), KX + 0.9, 0, 0.6);
    return { mood: 'sepia', over: popIcon(T, 69.9, ICON.bolo, 840, 520) + `<rect width="1080" height="1920" fill="#c89a5a" opacity="0.14"/>` };
  } },
  // 26 — "Não precisa responder, só come.": close no bolo e no sorriso dela
  { t0: 71.4, async draw(t, T) {
    camSet(KX + 0.6, 1.4, -1.6 + 0.2 * ease(t, 0, 2.5), KX + 0.6, 1.15, 0.6, 40);
    await place('lucia', svgL(T, { face: -0.4, expr: 'joy', armL: 40, armR: 40 }), KX + 0.9, 0, 0.6);
    return { mood: 'sepia', over: `<rect width="1080" height="1920" fill="#c89a5a" opacity="0.14"/>` + popIcon(T, 72.6, heart(), 820, 600, 3) };
  } },
  // 27 — "Ele riu, com os olhos cheios de água"
  { t0: 73.94, async draw(t, T) {
    camSet(-0.5, 1.5, -2.0 + 0.25 * ease(t, 0, 2.5), -0.5, 1.3, 1, 38);
    caixa(1, CNT(T), T);
    await place('caio', svgC(T, { face: 0.1, expr: T < 74.9 ? 'laugh' : 'happy', tears: clamp((T - 74.6) / 0.6), phones: 1 }), -0.5, 0, -0.2);
    return { mood: 'night' };
  } },
  // 28 — "Ouviu um atrás do outro, até o último": áudios em fila até o ouvido, o placar desce
  { t0: 76.5, async draw(t, T) {
    const q = ease(t, 0, 2.7); camSet(lerp(-3, 2, q), 1.6, -2.6, -0.3, 1.3, 0.6, 44);
    caixa(1, CNT(T), T);
    const L = []; for (let i = 0; i < 8; i++) { const u = ((t * 1.3 + i / 8) % 1); L.push({ x: lerp(0, -0.5, u), y: lerp(1.2 + (i % 4) * 0.3, 1.75, u) + Math.sin(u * 3) * 0.3, z: lerp(1.6, -0.15, u), s: 0.3, op: clamp((1 - u) * 5), c: i % 3 }); }
    audios(L);
    await place('caio', svgC(T, { face: 0.3, expr: 'sad', tears: 0.6, phones: 1 }), -0.5, 0, -0.2);
    return { mood: 'night' };
  } },
  // 29 — último áudio: Lúcia à janela, noite — "eu só queria ouvir a sua voz"
  { t0: 79.26, async draw(t, T) {
    camSet(KX - 0.6, 1.45, -1.6 + 0.4 * ease(t, 0, 2.6), KX - 1.5, 1.4, 2.2, 38);
    KITCHEN.pl.intensity = 0.4;
    await place('lucia', svgL(T, { face: -0.2, expr: 'sad', armL: 20, armR: 20, ly: -0.2 }), KX - 1.5, 0, 2.0);
    return { mood: 'night', over: popIcon(T, 79.4, `<g transform="scale(0.8)">${audioRow(-235, 0, 'ÚLTIMO', 0, 1, (T - 79.4) / 4.8)}</g>`, 540, 480) };
  } },
  // 30 — "Mas tudo bem, eu espero."
  { t0: 81.9, async draw(t, T) {
    KITCHEN.pl.intensity = 0.4;
    camSet(KX - 1.35, 1.5, -0.2 + 0.3 * ease(t, 0, 2.3), KX - 1.5, 1.3, 2.2, 38);
    await place('lucia', svgL(T, { face: 0.1, expr: 'sad', tears: 0.4 }), KX - 1.5, 0, 2.0);
    return { mood: 'night' };
  } },
  // 31 — "Caio saiu correndo, sem nem se despedir"
  { t0: 84.28, async draw(t, T) {
    KITCHEN.pl.intensity = 1.2;
    camSet(1.5, 1.5, -3.2, -0.3, 1.2, 0, 44);
    caixa(1, 0, T);
    const x = T < 84.8 ? -0.5 : -0.5 - (T - 84.8) * 6;
    await place('caio', T < 84.8 ? svgC(T, { face: 0.2, expr: 'surprised', phones: 1 }) : svgC(T, { side: true, face: -0.8, walk: T * 18, run: 1, expr: 'worried' }), x, 0, -0.2);
    await place('polo', svgP(T, { face: -0.6, expr: T < 85.4 ? 'surprised' : 'happy', lx: -1, armR: T > 85.4 ? 150 + Math.sin(T * 12) * 15 : 20, bendR: 30, handR: 'open' }), PP.x, 0, PP.z);
    return { mood: 'night', over: comic(T, 84.9, 'ZUUM!', 300, 620, { size: 96, fill: '#ff7a45' }) };
  } },
  // 32 — correndo pela rua até a casa, amanhecendo
  { t0: 87.02, async draw(t, T) {
    const x = lerp(-2, 8, ease(t, 0, 1.24)); camSet(x + 3, 1.4, ST + 5, x, 1.1, ST, 46); WORLD.cars.forEach(c => c.g.visible = false);
    await place('caio', svgC(T, { side: true, face: -0.8, walk: T * 18, run: 1, expr: 'worried' }), x, 0, ST);
    return { mood: 'dawn' };
  } },
  // 33 — "ela abriu a porta"
  { t0: 88.26, async draw(t, T) {
    camSet(HOUSE.x + 1.2, 1.6, ST + 3.6, HOUSE.x, 1.2, -21.4, 42);
    WORLD.door.rotation.y = -1.6 * ease(t, 0, 0.5);
    await place('lucia', svgL(T, { face: -0.2, expr: 'surprised' }), HOUSE.x, 0, -21.2);
    await place('caio', svgC(T, { back: true, expr: 'sad' }), HOUSE.x + 0.5, 0, ST + 0.6);
    return { mood: 'dawn' };
  } },
  // 34 — o abraço
  { t0: 89.06, async draw(t, T) {
    const a = ease(t, 0, 2.2); camSet(HOUSE.x + lerp(2.0, -1.2, a), 1.5, ST + 3.4, HOUSE.x, 1.1, ST, 40);
    WORLD.door.rotation.y = -1.6;
    await place('lucia', svgL(T, { face: 0.2, expr: 'joy', tears: 0.7, armL: 120, armR: 120, bendL: 60, bendR: 60, handL: 'open', handR: 'open' }), HOUSE.x + 0.18, 0, ST + 0.05);
    await place('caio', svgC(T, { face: -0.2, expr: 'happy', tears: 0.7, armL: 110, armR: 110, bendL: 70, bendR: 70, handL: 'open', handR: 'open' }), HOUSE.x - 0.18, 0, ST - 0.05);
    return { mood: 'dawn', over: popIcon(T, 89.4, heart(), 540, 520, 3) };
  } },
  // 35 — "Mãe, me manda um áudio. Eu ouço até o fim."
  { t0: 91.32, async draw(t, T) {
    camSet(HOUSE.x + 0.3, 1.5, ST + 3.0 - 0.4 * ease(t, 0, 3), HOUSE.x, 1.25, ST, 38);
    WORLD.door.rotation.y = -1.6;
    await place('lucia', svgL(T, { face: -0.4, expr: T > 93 ? 'joy' : 'happy', tears: 0.5, lx: -1 }), HOUSE.x + 0.45, 0, ST + 0.1);
    await place('caio', svgC(T, { face: 0.4, expr: 'happy', lx: 1 }), HOUSE.x - 0.45, 0, ST);
    return { mood: 'dawn', over: T > 93 ? popIcon(T, 93.1, `<g transform="scale(0.8)">${audioRow(-235, 0, 'ATÉ O FIM', 1, 1, 1)}</g>`, 540, 520) : '' };
  } },
  // 36 — pergunta: Polo fecha a caixa vazia e olha pra câmera
  { t0: 94.42, async draw(t, T) {
    const c = ease(t, 0, 1.2); camSet(PP.x - 0.9, 1.5, PP.z - 4.0 + 0.5 * ease(t, 0, 2.6), PP.x - 0.6, 1.2, PP.z + 1, 42);
    caixa(1 - c, 0, T);
    await place('polo', svgP(T, { face: 0, expr: 'neutral', armL: 60 * (1 - c) + 10, handL: 'open' }), PP.x, 0, PP.z);
    return { mood: 'day', over: banner(T, 94.5, 'VOCÊ OUVIU O ÚLTIMO', 'ÁUDIO DA SUA MÃE?', null, 440) };
  } },
  // 37 — CTA e volta pro começo (noite, caixa brilhando)
  { t0: 97.1, async draw(t, T) {
    const q = ease(t, 0, 2.2); camSet(-1.0 - 1.5 * q, 1.7 - 0.4 * q, -4.4 - 2.6 * q, 0, 1.6, 2, 46);
    caixa(0.25, 64, T); audios(floatAud(T, 20, { R: 4, H: 4 }));
    const pa = E.back(clamp((T - 97.2) / 0.3));
    const btn = (x, txt, c, d) => `<g transform="translate(${x} 560) scale(${f2(pa * (1 + 0.06 * Math.sin(T * 8 + d)))})"><rect x="-200" y="-70" width="400" height="130" rx="30" fill="${c}" stroke="${INK}" stroke-width="9"/>${TXT(0, 22, txt, 72)}</g>`;
    return { mood: 'night', over: TXT(540, 400, 'COMENTA:', 64) + btn(300, 'ESCUTO', '#3a8ae8', 0) + btn(780, 'PULO', '#e8503a', 1) };
  } },
];
