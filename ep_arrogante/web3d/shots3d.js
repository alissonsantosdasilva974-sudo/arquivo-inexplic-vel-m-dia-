// Teste do estilo 3D: gancho (0–8 s) e bicicleta (17,5–20,5 s). Câmera em metros, recortes = bonecos do canal.
const POLO3 = o => Object.assign({ hat: 'fedora', pocketNote: true, whistle: true, x: 0, y: 0, s: 1 }, o);
const IVP3 = [[3.8, 7.3]], IVF3 = [[23.3, 25.4]];
const svgP = (T, o) => person('polo', POLO3(Object.assign({ t: T, mouth: lips(T, IVP3) }, o)));
const svgF = (T, o) => person('freitas', Object.assign({ x: 0, y: 0, s: 1, t: T, mouth: lips(T, IVF3) }, o));
const svgS = (T, o) => person(o.id || 'saci', Object.assign({ x: 0, y: 0, s: 1, t: T }, o));
const ease = (t, a, b) => E.inOut(clamp((t - a) / (b - a)));
const PO3 = { x: 6.5, z: -10 }, FR3 = { x: 0, z: -6 };
const SHOTS3 = [
  // 1 — close do Polo, regra na tela, Freitas ao fundo
  { t0: 0, async draw(t, T) {
    const d = 3.3 - 0.4 * ease(t, 0, 1.85);
    camSet(PO3.x - 0.5, 1.55, PO3.z - d, PO3.x + 0.6, 1.35, PO3.z + 4, 40);
    const e = exprAt(T, [[0, 'neutral'], [1.2, 'surprised']]);
    await place('polo', svgP(T, { face: 0.3, expr: e.expr, squash: e.pop, lx: T > 1.2 ? 0.9 : 0.2 }), PO3.x, 0, PO3.z);
    await place('freitas', svgF(T, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }), FR3.x + 1.5, 0, FR3.z + 4);
    await players(T, { bx: 0, bz: 8, only: (x, z) => z > 0 });
    BALL.position.set(FR3.x + 2.2, 0.11, FR3.z + 4.5);
    return { mood: 'orange', over: ruleBanner(T, 0) };
  } },
  // 2 — câmera baixa: o Freitas estica em pulsos
  { t0: 1.85, async draw(t, T) {
    const m = 1 + 0.6 * kf(T, [[1.95, 0], [2.25, 0.45, E.back], [2.6, 0.75, E.back], [3.0, 1, E.back]]);
    camSet(FR3.x + 0.5, 0.25, FR3.z - 5.2 + 0.5 * ease(t, 0, 1.9), FR3.x, 1.6, FR3.z, 46, -4);
    await place('freitas', svgF(T, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }), FR3.x, 0, FR3.z, { k: m });
    BALL.position.set(FR3.x + 0.8, 0.11, FR3.z - 0.6);
    return { mood: 'orange', over: ruleBanner(T, 0) + comic(T, 2.0, 'ESTICA!', 760, 700, { size: 90, fill: '#ff7a45' }) };
  } },
  // 3 — "Eu sou o Polo. Apito os jogos da praça": plano médio, câmera alta, jogo ao fundo
  { t0: 3.8, async draw(t, T) {
    const a = ease(t, 0, 1.6);
    camSet(PO3.x - 1.2 + 0.4 * a, 2.6, PO3.z - 4.2 + 0.6 * a, PO3.x - 0.6, 1.0, PO3.z + 2, 44);
    await place('polo', svgP(T, { face: -0.2, expr: T > 4.6 ? 'happy' : 'neutral', armR: T > 4.55 ? 160 : 20, bendR: T > 4.55 ? 50 : 20, handR: 'open', squash: -0.05 * pulse(T, 4.7, 0.15) }), PO3.x, 0, PO3.z);
    const fx = Math.sin(T * 1.2) * 4, fz = 6 + Math.cos(T * 1.2) * 3;
    await place('freitas', svgF(T, { side: true, face: Math.cos(T * 1.2) > 0 ? -0.8 : 0.8, walk: T * 11, run: 1, expr: 'happy' }), fx, 0, fz);
    await place('saci', svgS(T, { armL: 50, armR: 50, bendL: 40, bendR: 40 }), Math.sin(T * 1.2) * 1.2, 0, 21);
    await players(T, { bx: fx, bz: fz });
    BALL.position.set(fx + 0.35, 0.11 + Math.abs(Math.sin(T * 6)) * 0.15, fz - 0.2);
    return { mood: 'orange', over: comic(T, 4.75, 'PRIII!', 760, 520, { size: 100 }) };
  } },
  // 4 — drone descendo sobre a praça e a cidade
  { t0: 5.4, async draw(t, T) {
    const q = ease(t, 0, 1.2);
    camSet(lerp(-34, -18, q), lerp(42, 16, q), lerp(-46, -30, q), 0, 0, 2, 50);
    const fx = Math.sin(T * 1.2) * 4, fz = 6 + Math.cos(T * 1.2) * 3;
    await place('freitas', svgF(T, { side: true, face: 0.8, walk: T * 11, run: 1 }), fx, 0, fz);
    await place('saci', svgS(T, { armL: 50, armR: 50, bendL: 40, bendR: 40 }), 0.5, 0, 21);
    await place('polo', svgP(T, { face: -0.4 }), PO3.x, 0, PO3.z);
    await place('mavie', mavie(0, 0, { t: T, face: -1, wag: 0.6, s: 0.55 }), WD.FW + 2.5, 0, -2.5, { sw: 0.8 });
    await players(T, { bx: fx, bz: fz });
    BALL.position.set(fx + 0.35, 0.11, fz - 0.2);
    return { mood: 'orange' };
  } },
  // 5 — "vi tudo isso de perto": close girando devagar
  { t0: 6.6, async draw(t, T) {
    const a = -0.5 + 0.35 * ease(t, 0, 1.4), r = 2.8;
    camSet(PO3.x + Math.sin(a) * r, 1.5, PO3.z - Math.cos(a) * r, PO3.x, 1.4, PO3.z, 38, -3);
    await place('polo', svgP(T, { face: Math.sin(T * 2.4) * 0.5, expr: 'smug', lx: Math.sin(T * 2.4), headTilt: Math.sin(T * 2.4) * 6 }), PO3.x, 0, PO3.z);
    BALL.position.set(0, -5, 0);
    return { mood: 'orange' };
  } },
  // ================= resto do episódio (8 s → fim) =================
  // 6 — amigos desde pequenos (lembrança): os dois, crianças, correm atrás da bola e batem as mãos
  { t0: 8.0, async draw(t, T) {
    const run = clamp((T - 8.0) / 1.5), x = lerp(-7, -1.2, E.out(run)), stop = T > 9.5;
    camSet(x + 0.15, 0.8, -8.4 + 0.8 * ease(t, 1.4, 2.7), x + 0.15, 0.5, -4, 44);
    const hi = pulse(T, 9.85, 0.25), meet = E.out(inv(9.5, 9.75, T));
    const kF = { face: stop ? 0.5 : 0.8, side: !stop, walk: stop ? null : T * 13, run: 1, expr: 'laugh', armR: stop ? 120 + hi * 30 : 20, bendR: 0, handR: 'open', mouth: 0, jump: hi * 25 };
    const kS = { id: 'saciKid', face: stop ? -0.5 : 0.8, side: !stop, walk: stop ? null : T * 13 + 1.5, run: 1, expr: 'laugh', armL: stop ? 120 + hi * 30 : 20, bendL: 0, handL: 'open', jump: hi * 25 };
    await place('freitas', person('freitasKid', Object.assign({ x: 0, y: 0, s: 1, t: T }, kF)), x - 0.15 - 0.3 * (1 - meet), 0, -4.1);
    await place('saci', svgS(T, kS), x + 0.45 - 0.2 * meet, 0, -3.9);
    BALL.position.set(stop ? x + 1.3 : x + 1.0 + Math.abs(Math.sin(T * 13)) * 0.1, 0.11 + (stop ? 0 : Math.abs(Math.sin(T * 6.5)) * 0.1), -4.3); BALL.rotation.z = stop ? 0 : -T * 12;
    return { mood: 'sepia', over: flashBorder() + comic(T, 9.85, 'TOCA!', 540, 520, { size: 90 }) };
  } },
  // 7 — corrida com a bola: câmera lateral acompanhando
  { t0: 10.7, async draw(t, T) {
    const x = lerp(-6, 4, t / 1.3);
    camSet(x + 1.5, 0.8, -8.6, x + 1.5, 0.9, -4, 44);
    await place('freitas', svgF(T, { side: true, face: 0.8, walk: T * 12, run: 1, expr: 'happy', tilt: 6 }), x, 0, -4);
    BALL.position.set(x + 0.55 + Math.abs(Math.sin(T * 12)) * 0.1, 0.11 + Math.abs(Math.sin(T * 6)) * 0.12, -3.9); BALL.rotation.z = -T * 14;
    await place('saci', svgS(T, { side: true, face: -0.8, walk: T * 9, run: 1 }), x + 5, 0, -1);
    await players(T, { only: (px, pz) => pz > -2 });
    return { mood: 'orange' };
  } },
  // 8 — por cima do ombro: Freitas chuta, Saci pega
  { t0: 12.0, async draw(t, T) {
    camSet(0.9, 1.9, 13.6, -0.2, 1.0, 21, 40);
    const bp = inv(12.15, 12.6, T), got = E.back(inv(12.52, 12.68, T)), ready = E.out(inv(12.0, 12.3, T)), recoil = pulse(T, 12.62, 0.12);
    await place('freitas', svgF(T, { back: true, armL: 30, armR: 30 }), 0.3, 0, 15);
    // antes: braços abertos esperando; no contato: as duas luvas fecham na bola, na altura do peito
    const oS = got > 0.02 ? { armL: lerp(70, 40, got), armR: lerp(70, 40, got), bendL: lerp(20, -140, got), bendR: lerp(20, -140, got), handL: 'open', handR: 'open' } : { armL: lerp(15, 70, ready), armR: lerp(15, 70, ready), bendL: 20, bendR: 20, handL: 'open', handR: 'open' };
    await place('saci', svgS(T, Object.assign({ expr: got > 0.5 ? 'happy' : 'angry', squash: -0.05 * recoil }, oS)), -0.2, 0, 21 + 0.12 * recoil);
    const hand = { x: -0.2, y: 193 / UPM, z: 20.85 };
    BALL.position.set(lerp(0.2, hand.x, bp), lerp(0.25, hand.y, bp) + Math.sin(bp * Math.PI) * 0.6, lerp(15.4, hand.z, bp));
    if (T > 12.6) BALL.position.set(hand.x, hand.y - 0.03 * recoil, hand.z + 0.12 * recoil);
    await players(T, { only: (px, pz) => pz > 10 && Math.abs(px) > 1.5 });
    return { mood: 'orange', over: comic(T, 12.6, 'PEGOU!', 540, 560, { size: 80, fill: '#5ab0d8' }) };
  } },
  // 9 — Saci, o goleiro
  { t0: 12.9, async draw(t, T) {
    orb(0, 1.3, 21, 2.6 - 0.25 * ease(t, 0, 1.2), 0, 1.1, 40);
    const clap = Math.abs(Math.sin(T * 9));
    await place('saci', svgS(T, { expr: 'happy', armL: 55 + clap * 20, armR: 55 + clap * 20, bendL: 70, bendR: 70, squash: -0.03 * clap }), 0, 0, 21);
    return { mood: 'orange', over: comic(T, 13.5, 'GOLEIRO', 540, 520, { size: 80, fill: '#5ab0d8' }) };
  } },
  // 10 — Freitas, o craque (de lado, inclinado)
  { t0: 14.1, async draw(t, T) {
    orb(0, 1.2, -4, 2.9, -25 + 10 * ease(t, 0, 1.3), 1.25, 40, 5);
    const e = exprAt(T, [[14.1, 'happy'], [14.7, 'smug']]), jug = Math.abs(Math.sin(T * 7));
    await place('freitas', svgF(T, { face: 0.5, expr: e.expr, wink: T > 14.7, squash: e.pop, armR: 30, bendR: 120, holdR: ball(0, -30 - jug * 20, 22, T * 200) }), 0, 0, -4);
    await players(T, { only: (px, pz) => pz > 4 });
    return { mood: 'orange' };
  } },
  // 11 — "mas o craque tinha um problema"
  { t0: 15.4, async draw(t, T) {
    orb(PO3.x, 1.2, PO3.z, 2.9, 15, 2.2, 42);
    const e = exprAt(T, [[15.4, 'neutral'], [16.1, 'worried']]);
    await place('polo', svgP(T, { face: -0.3, expr: e.expr, squash: e.pop, ly: -0.6, armL: 50, bendL: 110, handL: 'point' }), PO3.x, 0, PO3.z);
    return { mood: 'orange', over: popIcon(T, 16.3, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="200" fill="#ff7a45" stroke="${INK}" stroke-width="12" paint-order="stroke">?</text>`, 820, 520) };
  } },
  // 12 — bicicleta: corrida, agacha, salta de costas, tesoura, contato, cai de costas (sem atravessar o chão)
  { t0: 17.5, async draw(t, T) {
    const X = 0, Z = 14, run = Math.min(0, lerp(-2.2, 0, inv(17.5, 17.9, T)));
    const air = inv(18.15, 18.95, T), fall = inv(18.95, 19.3, T), crouch = pulse(T, 18.05, 0.15);
    const ang = T < 18.15 ? 0 : T < 18.95 ? 150 * E.inOut(air) : lerp(150, 270, E.out(fall));
    const lift = T < 18.15 ? 0 : T < 18.95 ? Math.sin(air * Math.PI * 0.9) * 1.1 : lerp(Math.sin(0.9 * Math.PI) * 1.1, 0, E.in(fall));
    const legPh = T < 17.9 ? T * 12 : T < 18.15 ? 0 : Math.PI * 0.5 + E.inOut(air) * Math.PI * 1.6;
    camSet(X - 6.5 + run * 0.3, 0.55 + lift * 0.4, Z - 0.6, X + run * 0.3, 1.2 + lift * 0.5, Z, 44);
    const K = await place('freitas', svgF(T, { side: true, face: -0.8, walk: legPh, run: 1, expr: T < 18.15 ? 'angry' : T < 19.2 ? 'surprised' : 'joy', armFront: T > 18.15 ? 140 : null, armBack: T > 18.15 ? 160 : null, shadow: false }), X, lift, Z + run, { rot: ang, hip: 0.5, ground: true });
    K.m.scale.y = 1 - crouch * 0.18;
    K.root.updateMatrixWorld(true); const foot = K.pivot.localToWorld(new THREE.Vector3(-0.1, -0.5, 0));
    if (T < 18.9) { const q = inv(17.7, 18.9, T); BALL.position.set(lerp(X - 1, foot.x, q), lerp(2.2, foot.y, q) + Math.sin(q * Math.PI) * 1.4, lerp(Z - 6, foot.z, q)); }
    else { const q = inv(18.9, 19.3, T); BALL.position.set(foot.x, foot.y + q * 0.6, lerp(foot.z, Z + 8, q)); }
    BALL.rotation.x = T * 12;
    await players(T, { only: (px, pz) => pz > 15 });
    await place('polo', svgP(T, { face: 0.4, expr: T > 18.9 ? 'surprised' : 'neutral', lx: 1 }), X - 3, 0, Z + 7);
    return { mood: 'orange', over: comic(T, 18.92, 'TUM!', 600, 560, { size: 120 }) };
  } },
  // 13 — a bola estufa a rede; Freitas levanta do chão
  { t0: 19.3, async draw(t, T) {
    const q = inv(19.3, 19.48, T), b = T < 19.48 ? 0 : Math.exp(-(T - 19.48) * 5) * (0.6 + 0.4 * Math.cos((T - 19.48) * 22));
    camSet(1.8, 0.7, 13.6 + 0.5 * ease(t, 0, 1.2), -0.6, 1.0, 22, 50, 3);
    bulgeNet(WORLD.goals.far, b * 1.2, 0.8, 1.2);
    BALL.position.set(lerp(-0.5, 0.8, q), lerp(0.5, 1.2, q) - (T > 19.48 ? Math.min(1, (T - 19.48) * 3) : 0), lerp(16, 22.4 + b * 0.6, q));
    await place('saci', svgS(T, { armL: 160, armR: 160, bendL: 0, bendR: 0, handL: 'open', handR: 'open', expr: 'surprised' }), -1.6, 0, 21.2, { rot: -70, hip: 0.5, ground: true });
    const rise = E.out(inv(19.45, 19.9, T));
    await place('freitas', svgF(T, { expr: 'joy', armL: 150 * rise + 10, armR: 150 * rise + 10, bendL: 10, bendR: 10, handL: 'open', handR: 'open' }), -2.2, 0, 16.6, { rot: lerp(90, 0, rise), hip: 0.5, ground: true });
    await players(T, { mode: 'cheer', only: (px, pz) => pz < 20 && pz > 8 });
    return { mood: 'orange', over: comic(T, 19.5, 'GOL!', 540, 520, { size: 160 }) };
  } },
  // 14 — de costas: abre os braços para a torcida na arquibancada
  { t0: 19.9, async draw(t, T) {
    bulgeNet(WORLD.goals.far, 0);
    const op = E.back(inv(20.0, 20.6, T));
    camSet(4.5, 1.9, 0.5 - 0.6 * ease(t, 0, 1.8), -12, 1.6, -1, 46);
    await place('freitas', svgF(T, { back: true, armL: 20 + op * 85, armR: 20 + op * 85, bendL: 10, bendR: 10, headTilt: Math.sin(T * 1.5) * 5 }), 2, 0, -0.5);
    await crowd(T, 1);
    return { mood: 'orange', over: comic(T, 20.5, 'UHUUU!', 540, 420, { size: 90 }) };
  } },
  // 15 — contraplano: ele olha a torcida, vaidoso
  { t0: 21.7, async draw(t, T) {
    orb(2, 1.25, -0.5, 3.1 - 0.25 * ease(t, 0, 1.5), -70, 1.2, 42, -3);
    await place('freitas', svgF(T, { face: -0.5 + Math.sin(T * 1.5) * 0.5, lx: -0.6 + Math.sin(T * 1.5) * 0.8, ly: -0.6, expr: 'smug', armL: 105, armR: 105, bendL: 0, bendR: 0, handL: 'open', handR: 'open', headTilt: -8 }), 2, 0, -0.5);
    await players(T, { mode: 'look', fx: 2, fz: -0.5, expr: 'happy', only: (px, pz) => pz > 3 });
    return { mood: 'orange' };
  } },
  // 16 — "Eu sou arrogante mesmo. E daí?" (câmera baixa, inclinada)
  { t0: 23.2, async draw(t, T) {
    orb(0, 1.3, -4, 2.8, 5, 0.9, 42, -4);
    const e = exprAt(T, [[23.2, 'smug'], [24.0, 'angry'], [24.4, 'happy'], [25.0, 'laugh']]), shrug = pulse(T, 24.6, 0.35);
    await place('freitas', svgF(T, { face: 0.2, expr: e.expr, squash: e.pop, armL: 40 + 20 * shrug, armR: 40 + 20 * shrug, bendL: 100 * shrug + 10, bendR: 100 * shrug + 10, handL: 'open', handR: 'open', headTilt: -8 + shrug * 10 }), 0, 0, -4);
    return { mood: 'orange', over: popIcon(T, 24.4, bubble('E DAÍ?', 340, 72), 640, 360) };
  } },
  // 17 — reação do Polo
  { t0: 25.0, async draw(t, T) {
    orb(PO3.x, 1.2, PO3.z, 2.8, 25, 1.5, 42);
    await place('polo', svgP(T, { face: -0.6, lx: -1, expr: T > 25.4 ? 'surprised' : 'worried', hatLift: 18 * pulse(T, 25.5, 0.2), mouth: 0 }), PO3.x, 0, PO3.z);
    return { mood: 'orange' };
  } },
  // 18 — cresceu dois centímetros: estica de repente, régua ao lado, câmera vai ao topo da cabeça
  { t0: 26.0, async draw(t, T) {
    const q = E.inOut(inv(27.25, 27.9, T));
    camSet(lerp(1.0, 0.7, q), lerp(1.2, 1.78, q), lerp(-7.6, -5.4, q), lerp(0.3, 0.25, q), lerp(1.0, 1.74, q), -4, lerp(42, 30, q));
    const e = exprAt(T, [[26, 'smug'], [27.05, 'surprised']]);
    const st = 1 + 0.22 * Math.sin(clamp((T - 27.05) / 0.35) * Math.PI) * (T < 27.4 ? 1 : 0);
    const K = await place('freitas', svgF(T, { expr: e.expr }), 0, 0, -4, { k: HGT(T) / 1.75 });
    K.m.scale.set(1 / Math.sqrt(st), st, 1);
    RULER.visible = true; RULER.position.set(0.55, 0, -4.05); RULER.userData.mark.position.y = HGT(T);
    await place('polo', svgP(T, { face: -0.6, expr: T > 27.1 ? 'surprised' : 'neutral', mouth: 0, lx: -1 }), 2.6, 0, -3.6);
    return { mood: 'orange', over: popIcon(T, 27.1, `<rect x="-150" y="-60" width="300" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+2 cm</text>`, 540, 420) + comic(T, 27.05, 'TCHUM!', 760, 640, { size: 80 }) + HUD3(T) };
  } },
  // 19 — Saci riu
  { t0: 28.4, async draw(t, T) {
    orb(0, 1.2, 21, 2.8, 0, 1.3, 42, 6);
    await place('saci', svgS(T, { face: -0.2, expr: 'laugh', mouth: 0.8, squash: 0.04 * Math.sin(T * 22), armL: 30, bendL: 120 }), 0, 0, 21);
    return { mood: 'orange', over: comic(T, 28.5, 'HAHA', 760, 520, { size: 90 }) + HUD3(T) };
  } },
  // 20 — Polo levanta a súmula (câmera alta)
  { t0: 29.1, async draw(t, T) {
    orb(PO3.x, 1.2, PO3.z, 2.2, 10, 3.0, 40);
    const up = E.back(clamp(t / 0.4));
    await place('polo', svgP(T, { face: 0.2, expr: 'neutral', ly: 1, lx: 0.3, armL: 20 + 25 * up, bendL: 40 + 60 * up, holdL: clipboard(-10, 1.1), armR: 20 + 30 * up, bendR: 40 + 60 * up, mouth: 0 }), PO3.x, 0, PO3.z);
    return { mood: 'orange', over: HUD3(T) };
  } },
  // 20b — detalhe: o lápis escreve na súmula (overlay sobre a praça desfocada ao fundo)
  { t0: 29.7, async draw(t, T) {
    orb(PO3.x, 1.0, PO3.z, 5, 30, 2.4, 50);
    const prog = clamp((T - 29.8) / 0.95), px = 330 + prog * 420 + Math.sin(T * 40) * 6, py = 1000 + Math.abs(Math.sin(T * 26)) * -10;
    const card = `<g transform="translate(540 ${f2(990 + Math.sin(T * 2) * 6)}) rotate(-4)"><rect x="-380" y="-470" width="760" height="980" rx="30" fill="#a8703e" stroke="${INK}" stroke-width="12"/><rect x="-330" y="-400" width="660" height="860" fill="#fffaf0" stroke="${INK}" stroke-width="6"/><rect x="-140" y="-500" width="280" height="80" rx="14" fill="#8a8e9a" stroke="${INK}" stroke-width="8"/><text x="0" y="-320" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="58" fill="#c8443c">SÚMULA</text>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M -280 ${-200 + i * 100} H 280" stroke="#b8b0c0" stroke-width="4"/>`).join('')}<text x="-270" y="-120" font-family="Fredoka" font-weight="600" font-size="44" fill="#4a4458">GOL: bicicleta</text><clipPath id="wr"><rect x="-280" y="-80" width="${f2(560 * prog)}" height="90"/></clipPath><text x="-270" y="-18" clip-path="url(#wr)" font-family="Fredoka" font-weight="700" font-size="62" fill="#2a3a8a">FREITAS  +2 cm</text></g>`;
    const pencil = `<g transform="translate(${f2(px)} ${f2(py)}) rotate(-35)"><rect x="-10" y="-190" width="20" height="170" fill="#f2c230" stroke="${INK}" stroke-width="5"/><path d="M -10 -20 L 0 6 L 10 -20 Z" fill="#f4d8b0" stroke="${INK}" stroke-width="4"/><path d="M -3 -2 L 0 6 L 3 -2 Z" fill="${INK}"/><rect x="-10" y="-206" width="20" height="18" fill="#e88aaa" stroke="${INK}" stroke-width="4"/></g>`;
    const handR = `<g transform="translate(${f2(px + 60)} ${f2(py - 60)}) scale(3)">${mitt(0, 0, 30, 30, '#1d1a22', 'fist')}</g><path d="M ${f2(px + 90)} ${f2(py - 40)} L ${f2(px + 420)} ${f2(py + 380)}" stroke="${INK}" stroke-width="96" stroke-linecap="round"/><path d="M ${f2(px + 90)} ${f2(py - 40)} L ${f2(px + 420)} ${f2(py + 380)}" stroke="#ffc928" stroke-width="80" stroke-linecap="round"/>`;
    const handL = `<path d="M -40 1500 L 160 1340" stroke="${INK}" stroke-width="96" stroke-linecap="round"/><path d="M -40 1500 L 160 1340" stroke="#ffc928" stroke-width="80" stroke-linecap="round"/><g transform="translate(190 1310) scale(3)">${mitt(0, 0, -30, 30, '#1d1a22', 'open')}</g>`;
    await players(T);
    return { mood: 'orange', over: `<rect width="1080" height="1920" fill="#2a1a14" opacity="0.3"/>` + card + handL + pencil + handR + comic(T, 29.9, 'RISC RISC', 540, 320, { size: 70, fill: '#fff6e0', life: 1.0 }) };
  } },
  // 21 — semana seguinte: outro gol, chute de lado, bola entra
  { t0: 30.9, async draw(t, T) {
    const run = Math.min(1, (T - 30.9) / 1.45), z = lerp(9, 13, E.inOut(run));
    const k = E.back(inv(32.25, 32.42, T)) - E.in(inv(32.45, 32.8, T)) * 0.8, bp = inv(32.42, 32.95, T);
    camSet(-5.5, 1.1, z + 0.8, 0, 1.0, z + 1.6, 46);
    bulgeNet(WORLD.goals.far, T > 32.95 ? 1.0 * Math.exp(-(T - 32.95) * 5) : 0, 1.6, 0.8);
    await place('freitas', svgF(T, { side: true, face: 0.8, walk: T < 32.25 ? T * 11 : -0.9 + k * 2.2, run: 1, expr: T < 32.4 ? 'angry' : 'smug', tilt: -k * 5 }), 0, 0, z, { k: HGT(T) / 1.75 });
    BALL.position.set(0.1, 0.11 + (T < 32.42 ? 0 : Math.sin(bp * Math.PI) * 0.9), T < 32.42 ? z + 0.55 : lerp(z + 0.55, 22.3, bp)); BALL.rotation.x = T * 12;
    await place('saci', svgS(T, { armL: 160, armR: 160, bendL: 0, bendR: 0, handL: 'open', handR: 'open', expr: 'surprised' }), -1.0 * E.out(inv(32.6, 32.95, T)), 0, 21, { rot: -E.out(inv(32.6, 32.95, T)) * 70, hip: 0.6, ground: true });
    await players(T, { only: (px, pz) => pz > 6 });
    return { mood: 'orange', over: popIcon(T, 31.0, calendar('+7'), 540, 400, 0.9 * clamp(1 - (T - 32.2) * 3)) + comic(T, 32.95, 'GOL!', 640, 560, { size: 130 }) + HUD3(T) };
  } },
  // 22 — "Arrogante!" e cresce mais dez (câmera recua e desce)
  { t0: 33.2, async draw(t, T) {
    const q = E.inOut(inv(34.6, 35.6, T)), k = HGT(T) / 1.75;
    orb(0, lerp(1.3, 1.3, q), -4, lerp(2.8, 4.4, q), 0, lerp(1.0, 0.3, q), 42, 4 - 4 * q);
    const e = exprAt(T, [[33.2, 'angry'], [34.5, 'surprised'], [35.4, 'smug']]);
    await place('freitas', svgF(T, { expr: e.expr, mouth: Math.max(lips(T, [[33.3, 34.4]]), T < 34.4 ? 0.3 : 0), armR: 170, bendR: 10, armL: 20, squash: e.pop - 0.15 * pulse(T, 35.1, 0.2) }), 0, 0, -4, { k });
    return { mood: 'orange', over: comic(T, 33.4, 'ARROGANTE!', 540, 480, { size: 96, fill: '#ff7a45', life: 1.1 }) + popIcon(T, 35.0, `<rect x="-170" y="-60" width="340" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+10 cm</text>`, 540, 420) + HUD3(T) };
  } },
  // 23 — olhava todo mundo de cima (por cima do ombro dele)
  { t0: 36.1, async draw(t, T) {
    camSet(-0.4, 2.6, -5.6, 0.3, 0.6, -1.5, 44);
    await place('freitas', svgF(T, { back: true, headTilt: 10, armL: 15, armR: 15 }), -0.2, 0, -4.2, { k: HGT(T) / 1.75 });
    await place('n1', person(NPC_IDS[1], { x: 0, y: 0, s: 1, t: T, ly: -1, expr: 'worried' }), -0.9, 0, -2.2);
    await place('n2', person(NPC_IDS[4], { x: 0, y: 0, s: 1, t: T + 1, ly: -1, expr: 'sad' }), 0.7, 0, -2.0);
    await place('n3', person(NPC_IDS[9], { x: 0, y: 0, s: 1, t: T + 2, ly: -1, expr: 'surprised' }), 0, 0, -1.2);
    return { mood: 'orange', over: HUD3(T) };
  } },
  // 24 — nem abaixava pra passar na porta do vestiário: TÓIN
  { t0: 38.4, async draw(t, T) {
    const z = Math.max(lerp(-22.5, -26.5, t / 0.9), -26.5) + (T > 39.4 ? 0.35 * E.out(inv(39.4, 39.6, T)) : 0);
    camSet(12.2, 1.4, -24.0, 9, 1.3, -27, 44);
    await place('freitas', svgF(T, { back: T < 39.4, walk: T < 39.3 ? T * 8 : null, expr: T > 39.4 ? 'surprised' : 'smug', tilt: T > 39.4 ? -8 : 0 }), 9, 0, z, { k: HGT(T) / 1.75 });
    return { mood: 'orange', over: comic(T, 39.45, 'TÓIN!', 700, 520, { size: 110 }) + HUD3(T) };
  } },
  // 25 — "Aí veio o pior": vira azul, close com rolagem
  { t0: 40.3, async draw(t, T) {
    orb(PO3.x, 1.2, PO3.z, 2.9 - 0.25 * ease(t, 0, 1.5), 0, 1.4, 42, lerp(0, -6, t / 1.5));
    await place('polo', svgP(T, { expr: 'worried', lx: -0.6, ly: 0.3, mouth: lips(T, [[40.4, 41.4]]) }), PO3.x, 0, PO3.z);
    return { mood: 'blue', over: HUD3(T) };
  } },
  // 26 — chute com raiva (lateral baixa)
  { t0: 41.8, async draw(t, T) {
    const k = E.back(inv(42.0, 42.2, T)) - E.in(inv(42.25, 42.6, T)) * 0.8, bp = inv(42.2, 43.0, T);
    camSet(-0.5 + shake(T, 42.2, 18) / 100, 0.45, -8.8, -0.5, 1.0, -4, 46);
    await place('freitas', svgF(T, { side: true, face: 0.8, walk: -0.9 + k * 2.2, run: 1, expr: 'angry', mouth: 0, tilt: -k * 6 }), -1, 0, -4, { k: HGT(T) / 1.75 });
    BALL.position.set(lerp(-0.4, 9, bp), 0.11 + Math.sin(bp * Math.PI) * 1.2, lerp(-4, 2, bp)); BALL.rotation.z = -T * 20;
    return { mood: 'blue', over: comic(T, 42.2, 'PÁ!', 600, 560, { size: 120, fill: '#ff7a45' }) + HUD3(T) };
  } },
  // 27 — a bola voa (de cima) até a Mavie, perto do banco
  { t0: 43.0, async draw(t, T) {
    const q = inv(43.0, 44.2, T);
    camSet(lerp(3, 9, E.inOut(q)), 3.2, lerp(-3, 1.5, q), lerp(4, 11.5, E.inOut(q)), 0, lerp(1, 6, q), 46);
    BALL.position.set(lerp(1, 12.0, q), 0.11 + Math.sin(q * Math.PI) * 1.6, lerp(-3, 6.4, q));
    await place('mavie', mavie(0, 0, { t: T, face: -1, wag: 0.8, s: 0.55 }), 12.2, 0, 6.6, { sw: 0.8 });
    return { mood: 'blue', over: HUD3(T) };
  } },
  // 28 — POF: acerta a Mavie (câmera na altura dela)
  { t0: 44.2, async draw(t, T) {
    const hit = T > 44.25, bq = inv(44.25, 44.9, T);
    camSet(10.4 + shake(T, 44.25, 16) / 120, 0.5, 3.9, 12.2, 0.3, 6.6, 40);
    await place('mavie', mavie(0, 0, { t: T, face: -1, s: 0.55, hurt: hit ? 1 : 0, knock: hit ? Math.exp(-(T - 44.25) * 3) * Math.cos((T - 44.25) * 9) : 0, hurtStars: hit, wag: hit ? 0 : 0.6 }), 12.2, 0, 6.6, { sw: 0.8 });
    BALL.position.set(hit ? lerp(11.95, 10.9, bq) : lerp(10.2, 11.95, inv(44.2, 44.25, T)), hit ? 0.11 + Math.sin(bq * Math.PI) * 0.5 : 0.3, hit ? lerp(6.6, 7.4, bq) : 6.6);
    return { mood: 'blue', over: comic(T, 44.25, 'POF!', 540, 520, { size: 130, fill: '#ff7a45' }) + popIcon(T, 44.9, `<rect x="-140" y="-50" width="280" height="90" rx="18" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><text y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="#e8609a">MAVIE</text>`, 540, 400) + HUD3(T) };
  } },
  // 29 — ganiu e se escondeu atrás do banco
  { t0: 46.2, async draw(t, T) {
    const run = E.inOut(inv(47.4, 48.4, T));
    camSet(9.2, 1.1, 4.4, 13, 0.4, 6.2, 44);
    await place('mavie', mavie(0, 0, { t: T, face: 1, s: 0.55, hurt: T < 47.4 ? 1 : 0.6, knock: T < 47.4 ? 0.15 * Math.sin(T * 4) : 0 }), lerp(12.2, 14.0, run), 0, lerp(6.6, 6.2, run), { sw: 0.8 });
    BALL.position.set(11, 0.11, 5.6);
    return { mood: 'blue', over: comic(T, 46.6, 'CAIM!', 540, 520, { size: 110, fill: '#8fd0f0' }) + HUD3(T) };
  } },
  // 30 — Saci vê e tira as luvas, uma de cada vez
  { t0: 48.7, async draw(t, T) {
    orb(0, 1.1, 21, T < 49.3 ? 2.7 : 3.1, 0, 1.2, 42);
    const e = exprAt(T, [[48.7, 'surprised'], [49.3, 'angry']]);
    let id = 'saci', o = { expr: e.expr, squash: e.pop, armL: 12, armR: 12, bendL: 20, bendR: 20 };
    const p1 = inv(49.5, 49.85, T), p2 = inv(49.85, 50.15, T), p3 = inv(50.15, 50.45, T), p4 = inv(50.45, 50.7, T);
    if (T >= 49.3) { const u = E.out(inv(49.3, 49.5, T)); o.armL = lerp(12, 35, u); o.bendL = lerp(20, 80, u); o.armR = lerp(12, 30, u); o.bendR = lerp(20, 75, u); o.ly = 1; }
    if (T >= 49.5 && T < 49.85) { o.armR = 30 + p1 * 25; o.bendR = 75 - p1 * 15; }
    if (T >= 49.85) { id = 'saciGL'; o.armR = lerp(55, 30, p2); o.bendR = lerp(60, 75, p2); o.holdR = gloveLoose(150, 1 - p2 * 0.6); }
    if (T >= 50.15) { o.armL = lerp(35, 55, p3); o.bendL = lerp(80, 60, p3); o.holdR = gloveLoose(150, 0.4); }
    if (T >= 50.3) { id = 'saciSem'; o.holdL = gloveLoose(30, p3); }
    if (T >= 50.45) { o.armL = lerp(55, 120, E.back(p4)); o.armR = lerp(30, 110, E.back(p4)); o.bendL = o.bendR = 10; o.handL = o.handR = 'open'; o.holdL = o.holdR = ''; o.expr = 'angry'; }
    await place('saci', svgS(T, Object.assign({ id }, o)), 0, 0, 21);
    const gq = inv(50.5, 51.1, T);
    if (gq > 0) for (const [nm, sx] of [['luvaE', -1], ['luvaD', 1]]) await place(nm, `<g transform="scale(2.2) translate(0 -20)">${mitt(0, 0, -20, 0, GLOVE, 'open')}</g>`, sx * (0.3 + gq * 0.6), Math.max(0, 1.0 * (1 - gq * 1.3)) + (gq > 0.77 ? Math.abs(Math.sin((gq - 0.77) * 13)) * 0.15 * (1 - gq) : 0), 20.6, { rot: sx * gq * 400, hip: 0.05, sw: 0.25 });
    return { mood: 'blue', over: comic(T, 50.95, 'PLOFT', 540, 520, { size: 90 }) + HUD3(T) };
  } },
  // 31 — "Pra que jogar a bola na Mavie?"
  { t0: 51.4, async draw(t, T) {
    orb(0, 1.25, 21, 2.8, 0, 1.15, 42, 6);
    CAM.position.x += shake(T, 51.5, 8) / 200;
    const e = exprAt(T, [[51.4, 'angry'], [52.3, 'sad']]);
    await place('saci', svgS(T, { id: 'saciSem', face: 0.2, expr: e.expr, squash: e.pop, armR: 60, bendR: 40, handR: 'point', headTilt: Math.sin(T * 6) * 3, mouth: lips(T, [[51.5, 52.7]]) }), 0, 0, 21);
    return { mood: 'blue', over: HUD3(T) };
  } },
  // 32 — dá de ombros e cresce mais um metro (câmera desce e recua)
  { t0: 53.1, async draw(t, T) {
    const sh = pulse(T, 53.9, 0.4), q = E.inOut(inv(54.4, 55.6, T)), k = HGT(T) / 1.75;
    orb(0, lerp(1.3, 2.4, q), -4, lerp(3.0, 6.5, q), 0, lerp(1.3, 0.25, q), 44, -4 * q);
    const e = exprAt(T, [[53.1, 'smug'], [54.5, 'surprised'], [55.3, 'smug']]);
    await place('freitas', svgF(T, { expr: e.expr, squash: e.pop, armL: 30 + sh * 20, armR: 30 + sh * 20, bendL: 100 * sh + 10, bendR: 100 * sh + 10, handL: 'open', handR: 'open', headTilt: sh * 8 }), 0, 0, -4, { k });
    await players(T, { mode: 'look', fx: 0, fz: -4, up: true, only: (px, pz) => pz > -1 && pz < 10 });
    return { mood: 'blue', over: popIcon(T, 55.0, `<rect x="-180" y="-60" width="360" height="110" rx="22" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="28" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">+1 METRO</text>`, 540, 340) + HUD3(T) };
  } },
  // 33 — três metros: contra-plongée com gente em volta
  { t0: 55.8, async draw(t, T) {
    orb(0, 2.0, -4, 5.4 - 0.4 * ease(t, 0, 1.9), lerp(-12, 12, ease(t, 0, 1.9)), 0.2, 50, 3);
    await place('freitas', svgF(T, { expr: 'neutral', armL: 10, armR: 10, ly: 1 }), 0, 0, -4, { k: HGT(T) / 1.75 });
    const P = [[-2.2, -3.6, 2], [-1.3, -4.4, 5], [1.4, -4.3, 8], [2.3, -3.4, 11]];
    for (let i = 0; i < P.length; i++) await place('n' + i, person(NPC_IDS[P[i][2]], { x: 0, y: 0, s: 1, t: T + i, face: P[i][0] < 0 ? 0.5 : -0.5, ly: -1, expr: 'surprised' }), P[i][0], 0, P[i][1]);
    return { mood: 'blue', over: popIcon(T, 56.7, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="120" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">3 m</text>`, 540, 420) + HUD3(T) };
  } },
  // 34 — ninguém alcançava (gente pulando)
  { t0: 57.7, async draw(t, T) {
    orb(0, 1.6, -4, 6, 20, 1.6, 50);
    await place('freitas', svgF(T, { expr: 'neutral', ly: 1 }), 0, 0, -4, { k: HGT(T) / 1.75 });
    const P = [[-1.5, -4.2, 2], [1.6, -4.0, 8], [0.9, -3.0, 14]];
    for (let i = 0; i < P.length; i++) await place('n' + i, person(NPC_IDS[P[i][2]], { x: 0, y: 0, s: 1, t: T, face: P[i][0] < 0 ? 0.5 : -0.5, ly: -1, expr: 'worried', armL: 170, armR: 170, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }), P[i][0], Math.abs(Math.sin(T * 7 + i * 1.5)) * 0.35, P[i][1]);
    return { mood: 'blue', over: HUD3(T) };
  } },
  // 35 — ninguém falava com ele: drone alto, todos vão embora
  { t0: 59.2, async draw(t, T) {
    camSet(-4, lerp(14, 20, ease(t, 0, 1.4)), -16, 0, 0, -3, 46);
    await place('freitas', svgF(T, { expr: 'sad', ly: 1 }), 0, 0, -4, { k: HGT(T) / 1.75 });
    await players(T, { mode: 'leave', t, fx: 0, fz: -4, t0: 59 });
    return { mood: 'blue', over: popIcon(T, 59.6, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="84" fill="#fffaf0" stroke="${INK}" stroke-width="10" paint-order="stroke">sozinho</text>`, 540, 420) + HUD3(T) };
  } },
  // 36 — Polo se aproxima (câmera atrás dele)
  { t0: 60.6, async draw(t, T) {
    const z = lerp(-9, -5.6, E.out(clamp(t / 1.8)));
    camSet(0.9, 1.3, z - 2.4, 0.2, 1.6, -3, 46);
    await place('polo', svgP(T, { back: true, walk: t < 1.8 ? T * 8 : null, headTilt: -6, mouth: 0 }), 0.5, 0, z);
    await place('freitas', svgF(T, { face: 0.2, expr: 'sad', ly: 1 }), -0.2, 0, -3.8, { k: HGT(T) / 1.75 });
    return { mood: 'blue', over: HUD3(T) };
  } },
  // 37 — "Freitas, o que você ganhou...?" (de cima, do ponto de vista dele)
  { t0: 62.9, async draw(t, T) {
    camSet(0.3, 4.8, -4.6, 0.5, 1.2, -6.2, 40);
    const e = exprAt(T, [[62.9, 'worried'], [64.5, 'sad']]);
    await place('polo', svgP(T, { face: 0.1, expr: e.expr, squash: e.pop, ly: -1, lx: 0.2, armR: 70, bendR: 60, handR: 'open', mouth: lips(T, [[63.1, 65.8]]) }), 0.5, 0, -6.2);
    return { mood: 'blue', over: popIcon(T, 64.0, bubble('O QUE VOCÊ GANHOU?', 640, 50), 540, 330) + leavesWind(T, 6) + HUD3(T) };
  } },
  // 38 — calado, só o vento (de baixo, ponto de vista do Polo)
  { t0: 66.3, async draw(t, T) {
    camSet(0.8, 0.9, -9.0, -0.2, 2.2 + 0.25 * ease(t, 0, 2.7), -3.8, 46, Math.sin(T * 0.8) * 2);
    await place('freitas', svgF(T, { face: Math.sin(T * 0.7) * 0.3, expr: T > 67.5 ? 'sad' : 'neutral', ly: -0.4, headTilt: Math.sin(T) * 3 }), -0.2, 0, -3.8, { k: HGT(T) / 1.75 });
    return { mood: 'blue', over: leavesWind(T, 18) + comic(T, 67.6, 'FFFUUU...', 540, 380, { size: 70, fill: '#c8d8f0', life: 1.4, rot: 0 }) + HUD3(T) };
  } },
  // 39 — Saci sobe no banco: anda, agacha, pula em arco e pousa no assento
  { t0: 69.0, async draw(t, T) {
    const walk = inv(69.0, 69.7, T), jump = inv(69.85, 70.25, T), crouch = pulse(T, 69.78, 0.1) + 0.6 * pulse(T, 70.3, 0.1);
    camSet(10.6, 1.3, 2.4, 12.6, 1.3, 6.0, 48);
    await place('freitas', svgF(T, { face: -0.4, expr: 'sad', ly: 1, lx: -1 }), 12.35, 0, 6.3, { k: HGT(T) / 1.75 });
    const sx = T < 69.85 ? lerp(11.4, 12.55, walk) : lerp(12.55, 12.95, jump), sy = T < 69.85 ? 0 : 0.49 * E.out(jump) + Math.sin(jump * Math.PI) * 0.35, sz = T < 69.85 ? lerp(4.2, 5.55, walk) : 5.55;
    const K = await place('saci', svgS(T, { id: 'saciSem', side: T < 70.25, face: 0.8, walk: T < 69.7 ? T * 8 : null, expr: 'worried', ly: -1, lx: 1, armFront: jump > 0 && jump < 1 ? 150 : null }), sx, sy, sz);
    K.m.scale.y = 1 - crouch * 0.15;
    return { mood: 'sepia', over: HUD3(T) };
  } },
  // 40 — abraço: de lado, o Saci em cima do banco envolve a perna dele com os dois braços
  { t0: 71.0, async draw(t, T) {
    const arm = E.inOut(inv(71.1, 71.9, T)), squeeze = 0.03 * Math.sin(T * 6) * (T > 71.9 ? 1 : 0);
    camSet(12.65, 1.5, 2.3 + 0.3 * ease(t, 0, 2.9), 12.65, 1.45, 6.0, 46);
    await place('freitas', svgF(T, { face: 0.3, expr: T > 72.4 ? (T > 73.2 ? 'happy' : 'surprised') : 'sad', ly: 1, lx: 0.6 }), 12.5, 0, 6.3, { k: HGT(T) / 1.75 });
    // vista lateral virada para a perna; os dois braços esticam e fecham em volta da coxa
    const K = await place('saci', svgS(T, { id: 'saciSem', side: true, face: 0.8, expr: 'sad', armFront: lerp(10, 82, arm), armBack: lerp(10, 95, arm), headTilt: 10 * arm }), 12.82, 0.49, 5.75);
    K.m.scale.x = 1 + squeeze;
    return { mood: 'sepia', over: (T > 72.4 ? popIcon(T, 72.4, `<path d="M 0 30 C -60 -10 -40 -60 0 -30 C 40 -60 60 -10 0 30 Z" fill="#e86a7a" stroke="${INK}" stroke-width="7"/>`, 540, 560, 1.1) : '') + HUD3(T) };
  } },
  // 41 — "Desce daí, craque. Eu não sei jogar sem você."
  { t0: 73.9, async draw(t, T) {
    camSet(12.4, 1.6, 4.0, 12.95, 1.9, 5.75, 40, -3);
    const e = exprAt(T, [[73.9, 'happy'], [75.2, 'sad']]);
    await place('saci', svgS(T, { id: 'saciSem', face: 0.2, expr: e.expr, squash: e.pop, ly: -1, lx: 0.4, headTilt: -8, tears: T > 75.4 ? 0.4 : 0, mouth: lips(T, [[74.0, 76.3]]) }), 12.95, 0.49, 5.75);
    return { mood: 'sepia', over: popIcon(T, 74.1, bubble('DESCE DAÍ!', 420, 64), 540, 330) + HUD3(T) };
  } },
  // 42 — começa a encolher (câmera sobe junto)
  { t0: 76.9, async draw(t, T) {
    const q = E.inOut(clamp(t / 2.1));
    camSet(10.2, lerp(0.3, 1.4, q), lerp(2.0, 3.2, q), 12.35, lerp(3.0, 1.4, q), 6.3, 50);
    await place('freitas', svgF(T, { expr: 'surprised', ly: -0.3, squash: 0.05 * Math.sin(T * 25) * (T > 77.6 ? 1 : 0) }), 12.35, 0, 6.3, { k: HGT(T) / 1.75 });
    return { mood: 'sepia', over: comic(T, 77.8, 'FIUUU...', 540, 420, { size: 90, life: 1.2 }) + HUD3(T) };
  } },
  // 43 — um metro, dois, até o tamanho de sempre
  { t0: 79.0, async draw(t, T) {
    camSet(10.0, 1.2, 2.4 + 0.5 * ease(t, 0, 3.9), 12.3, 1.0, 6.8, 46);
    const e = exprAt(T, [[79, 'surprised'], [82, 'happy']]);
    await place('freitas', svgF(T, { face: 0.3, expr: e.expr, squash: e.pop }), 12.35, 0, 6.3, { k: HGT(T) / 1.75 });
    await place('saci', svgS(T, { id: 'saciSem', face: -0.5, expr: T > 81 ? 'laugh' : 'happy' }), 12.95, 0.49, 5.75);
    return { mood: 'sepia', over: comic(T, 79.2, '-1 m', 540, 440, { size: 110 }) + comic(T, 79.95, '-2 m', 540, 440, { size: 110 }) + popIcon(T, 82.0, `<text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="#ffd23f" stroke="${INK}" stroke-width="12" paint-order="stroke">1,75 m</text>`, 540, 420) + HUD3(T) };
  } },
  // 44 — ajoelha e pede desculpa (câmera na altura da Mavie)
  { t0: 82.9, async draw(t, T) {
    const kneel = E.out(inv(82.9, 83.5, T));
    camSet(11.6, 0.6, 3.6, 12.95, 0.6, 6.8, 46);
    await place('freitas', kneelSVG(T, kneel, { face: 0.6, expr: 'sad', mouth: talk(T, [[84.0, 84.8]]), armL: 40, armR: 60, bendL: 90, bendR: 70, handR: 'open' }), 12.3, 0, 7.0);
    await place('mavie', mavie(0, 0, { t: T, face: -1, s: 0.55, wag: inv(84.2, 85.0, T) * 0.7 }), 13.6, 0, 6.6, { sw: 0.8 });
    return { mood: 'sepia', over: popIcon(T, 84.1, bubble('DESCULPA', 360, 58), 540, 380) };
  } },
  // 45 — a Mavie lambe a cara dele: close desenhado (overlay), a ponta da língua cai na bochecha
  { t0: 85.5, async draw(t, T) {
    camSet(11.0, 1.0, 4.4, 12.3, 0.95, 6.9, 50);
    const lick = T > 85.6 ? Math.max(0, Math.sin((T - 85.6) * 8)) : 0, s = 3.0, fx0 = 430, fy0 = 2050;
    const fr = person('freitas', { x: fx0, y: fy0, s, t: T, face: 0.45, expr: T > 85.7 ? 'laugh' : 'surprised', mouth: 0.6, headTilt: -4 - lick * 6, armL: 60, armR: 60, bendL: 80, bendR: 80, handL: 'open', handR: 'open', shadow: false });
    const cheekX = fx0 + (0.45 * 24 + 44) * s, cheekY = fy0 + (H2 + 28) * s;
    const k = 2.3, mx = cheekX + 172 * k + 20 * (1 - lick), my = cheekY + 132 * k + 30 * (1 - lick);
    const mv = mavie(mx, my, { t: T, face: -1, s: k, wag: 1, lick: 0.25 + 0.75 * lick });
    const wet = T > 85.8 ? `<ellipse cx="${f2(cheekX)}" cy="${f2(cheekY)}" rx="70" ry="38" fill="#bfe6f6" opacity="0.55"/>` + [0, 1, 2].map(i => `<circle cx="${f2(cheekX + 30 + i * 45 + Math.sin(T * 4 + i) * 10)}" cy="${f2(cheekY - 80 - i * 40 - ((T * 120 + i * 40) % 60))}" r="12" fill="#8fd0f0" stroke="${INK}" stroke-width="4"/>`).join('') : '';
    return { mood: 'sepia', over: `<rect width="1080" height="1920" fill="#3a2a1a" opacity="0.35"/>` + fr + wet + mv + comic(T, 85.8, 'SLURP!', 540, 440, { size: 110, fill: '#ee8aaa' }) + comic(T, 86.4, 'SLURP!', 600, 520, { size: 80, fill: '#ee8aaa', rot: 8 }) };
  } },
  // 46 — Saci: "Arrogante."
  { t0: 87.2, async draw(t, T) {
    camSet(11.0, 1.4, 3.4, 12.95, 1.2, 5.75, 42, 4);
    const e = exprAt(T, [[87.2, 'happy'], [88.3, 'smug']]);
    await place('saci', svgS(T, { id: 'saciSem', face: 0.3, expr: e.expr, squash: e.pop, wink: T > 88.3, armL: 30, armR: 30, bendL: 120, bendR: 120, mouth: lips(T, [[88.4, 89.2]]) }), 12.95, 0, 5.75);
    return { mood: 'orange' };
  } },
  // 47 — os dois riem (câmera em arco), a pelada volta
  { t0: 89.5, async draw(t, T) {
    const a = lerp(-20, 20, ease(t, 0, 1.8));
    orb(12.4, 1.0, 6.5, 3.4, a - 60, 1.3, 46);
    const b = Math.sin(T * 16) * 0.03;
    await place('freitas', svgF(T, { face: 0.4, expr: 'laugh', mouth: 0.8, squash: b, armR: 120, bendR: 30, handR: 'open' }), 12.1, 0, 7.0);
    await place('saci', svgS(T, { id: 'saciSem', face: -0.4, expr: 'laugh', mouth: 0.8, squash: -b, armL: 120, bendL: 30, handL: 'open' }), 12.7, 0, 6.0);
    await place('mavie', mavie(0, 0, { t: T, face: 1, s: 0.5, wag: 1 }), 11.6, 0, 6.3, { sw: 0.7 });
    await players(T);
    return { mood: 'orange', over: comic(T, 90.2, 'HAHAHA', 540, 500, { size: 100 }) };
  } },
  // 48 — Polo apita o fim do jogo (contra-plongée)
  { t0: 91.3, async draw(t, T) {
    orb(PO3.x, 1.6, PO3.z, 2.6, -10, 0.3, 46, -3);
    await place('polo', svgP(T, { expr: 'happy', armR: 150, bendR: 10, handR: 'open', armL: 60, bendL: 90, squash: -0.06 * pulse(T, 91.6, 0.2), mouth: lips(T, [[91.4, 92.4]]) }), PO3.x, 0, PO3.z);
    await players(T, { mode: 'cheer' });
    return { mood: 'orange', over: comic(T, 91.5, 'PRIIIII!', 700, 640, { size: 110, life: 1.2 }) + popIcon(T, 92.2, `<rect x="-210" y="-60" width="420" height="110" rx="22" fill="#fffaf0" stroke="${INK}" stroke-width="8"/><text y="26" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="${INK}">FIM DE JOGO</text>`, 540, 300) };
  } },
  // 49 — pergunta final, mesmo enquadramento do gancho (loop)
  { t0: 93.0, async draw(t, T) {
    camSet(PO3.x - 0.5, 1.55, PO3.z - 3.3, PO3.x + 0.6, 1.35, PO3.z + 4, 40);
    const e = exprAt(T, [[93, 'worried'], [95.5, 'happy']]);
    await place('polo', svgP(T, { face: 0.3, expr: e.expr, squash: e.pop, lx: 0.4, mouth: 0 }), PO3.x, 0, PO3.z);
    await place('freitas', svgF(T, { expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' }), FR3.x + 1.5, 0, FR3.z + 4);
    await players(T, { only: (x, z) => z > 0 });
    const q = T < 95.5 ? popIcon(T, 93.1, `<rect x="-450" y="-110" width="900" height="210" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="${INK}">VOCÊ ABRAÇARIA UM</text><text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#e8503a">AMIGO ARROGANTE?</text>`, 540, 400)
      : popIcon(T, 95.5, `<rect x="-460" y="-100" width="920" height="200" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">COMENTA</text><text y="68" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="3" paint-order="stroke">ABRAÇO ou DEIXO</text>`, 540, 400);
    return { mood: 'orange', over: q };
  } },
];
// Freitas ajoelhado: o desenho dele desce até os joelhos tocarem o chão; as canelas somem para trás
function kneelSVG(T, k, o) {
  const P = CAST2.freitas, d = 62 * k, x0 = 19.6;
  const body = person('freitas', Object.assign({ x: 0, y: d, s: 1, t: T, mouth: 0, shadow: false }, o));
  let legs = '';
  for (const sx of [-1, 1]) { const hx = sx * x0, kx = sx * (x0 + 10 * k), ky = -10; legs += `<path d="M ${hx} ${f2(-110 + d)} L ${f2(kx)} ${ky}" stroke="${OL}" stroke-width="36" stroke-linecap="round"/><path d="M ${hx} ${f2(-110 + d)} L ${f2(lerp(hx, kx, 0.5))} ${f2(lerp(-110 + d, ky, 0.5))}" stroke="${P.bottom}" stroke-width="26" stroke-linecap="round"/><path d="M ${f2(lerp(hx, kx, 0.5))} ${f2(lerp(-110 + d, ky, 0.5))} L ${f2(kx)} ${ky}" stroke="${P.skin}" stroke-width="24" stroke-linecap="round"/><ellipse cx="${f2(kx)}" cy="${ky + 2}" rx="17" ry="13" fill="${P.skin}" stroke="${OL}" stroke-width="5"/>`; }
  const shadow = `<ellipse cx="0" cy="2" rx="70" ry="12" fill="#1b1424" opacity="0.25"/>`;
  return shadow + `<clipPath id="kc"><rect x="-400" y="-900" width="800" height="${f2(900 - 104 + d)}"/></clipPath><g clip-path="url(#kc)">${body}</g>` + legs;
}
// câmera em órbita: alvo (tx,ty,tz), distância, ângulo (graus, 0 = olhando para +z), altura da câmera
function orb(tx, ty, tz, dist, yaw, cy, fov = 42, roll = 0) { const a = yaw * Math.PI / 180; camSet(tx + Math.sin(a) * dist, cy, tz - Math.cos(a) * dist, tx, ty, tz, fov, roll); }
// torcida na arquibancada (lado esquerdo, x negativo)
async function crowd(T, cheer = 1) {
  const r = rng(11);
  for (let k = 0; k < 14; k++) { const tier = k % 3, z = -6 + Math.floor(k / 3) * 3 + r() * 1.5, x = -WD.FW - 2.5 - tier * 2, y = 0.5 * (tier + 1), ph = r() * 6;
    await place('tc' + k, person(NPC_IDS[(k * 7 + 3) % 24], { x: 0, y: 0, s: 1, t: T + ph, face: 0.5, expr: k % 3 ? 'joy' : 'laugh', armL: 150 + Math.sin(T * 8 + ph) * 25 * cheer, armR: 150 - Math.sin(T * 8 + ph) * 25 * cheer, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: Math.abs(Math.sin(T * 7 + ph)) * 22 * cheer, mouth: 0.5 }), x, y, z, { k: 0.95 }); }
}
