function ruleBanner(T, t0) {
  const p = E.back(clamp((T - t0) / 0.3));
  return `<g transform="translate(540 400) scale(${f2(p)}) rotate(-2)"><rect x="-470" y="-120" width="940" height="230" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/>
   <text y="-40" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">NESTA CIDADE,</text>
   <text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="4" paint-order="stroke">QUEM FICA ARROGANTE</text>
   <g transform="translate(0 150) scale(${f2(1 + 0.08 * Math.sin(T * 8))})"><rect x="-190" y="-58" width="380" height="96" rx="20" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">CRESCE</text></g></g>`;
}
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
    BALL.position.set(fx + 0.35, 0.11, fz - 0.2);
    return { mood: 'orange' };
  } },
  // 5 — "vi tudo isso de perto": close girando devagar
  { t0: 6.6, async draw(t, T) {
    const a = -0.5 + 0.35 * ease(t, 0, 1.4), r = 1.9;
    camSet(PO3.x + Math.sin(a) * r, 1.5, PO3.z - Math.cos(a) * r, PO3.x, 1.4, PO3.z, 38, -3);
    await place('polo', svgP(T, { face: Math.sin(T * 2.4) * 0.5, expr: 'smug', lx: Math.sin(T * 2.4), headTilt: Math.sin(T * 2.4) * 6 }), PO3.x, 0, PO3.z);
    BALL.position.set(0, -5, 0);
    return { mood: 'orange' };
  } },
  // ---- salto no tempo para a bicicleta ----
  { t0: 8.0, async draw(t, T) { camSet(0, 30, -60, 0, 0, 0); return { mood: 'orange' }; } },
  // 12 — bicicleta: corrida, agacha, salta de costas, tesoura, contato, queda (câmera baixa de lado, acompanhando)
  { t0: 17.5, async draw(t, T) {
    const X = 0, Z = 14, run = Math.min(0, lerp(-2.2, 0, inv(17.5, 17.9, T)));
    const air = inv(18.15, 19.0, T), fall = inv(19.0, 19.3, T), crouch = pulse(T, 18.05, 0.15);
    const ang = T < 18.15 ? 0 : T < 19.0 ? 170 * E.inOut(air) : 170 + 30 * E.in(fall);
    const lift = T < 18.15 ? 0 : T < 19.0 ? Math.sin(air * Math.PI * 0.85) * 1.1 : lerp(Math.sin(0.85 * Math.PI) * 1.1, 0, E.in(fall));
    const legPh = T < 17.9 ? T * 12 : T < 18.15 ? 0 : Math.PI * 0.5 + E.inOut(air) * Math.PI * 1.6;
    camSet(X - 6.5 + run * 0.3, 0.55 + lift * 0.4, Z - 0.6, X + run * 0.3, 1.3 + lift * 0.5, Z, 44);
    const K = await place('freitas', svgF(T, { side: true, face: -0.8, walk: legPh, run: 1, expr: T < 18.15 ? 'angry' : T < 19.2 ? 'surprised' : 'joy', armFront: T > 18.15 ? 140 : null, armBack: T > 18.15 ? 160 : null, shadow: false }), X, lift, Z + run, { rot: ang, hip: 0.5 });
    K.m.scale.y = 1 - crouch * 0.18;
    // pé no alto = ponto do pivô girado; a bola chega ali no contato
    K.root.updateMatrixWorld(true); const foot = K.pivot.localToWorld(new THREE.Vector3(-0.1, -0.5, 0));
    if (T < 18.9) { const q = inv(17.7, 18.9, T); BALL.position.set(lerp(X - 1, foot.x, q), lerp(2.2, foot.y, q) + Math.sin(q * Math.PI) * 1.4, lerp(Z - 6, foot.z, q)); }
    else { const q = inv(18.9, 19.3, T); BALL.position.set(foot.x, foot.y + q * 0.6, lerp(foot.z, Z + 8, q)); }
    BALL.rotation.x = T * 12;
    await place('polo', svgP(T, { face: 0.4, expr: T > 18.9 ? 'surprised' : 'neutral', lx: 1 }), X - 3, 0, Z + 7);
    return { mood: 'orange', over: comic(T, 18.92, 'TUM!', 600, 560, { size: 120 }) };
  } },
  // 13 — a bola estufa a rede: câmera baixa, de frente pro gol, torcida atrás
  { t0: 19.3, async draw(t, T) {
    const q = inv(19.3, 19.48, T), b = T < 19.48 ? 0 : Math.exp(-(T - 19.48) * 5) * (0.6 + 0.4 * Math.cos((T - 19.48) * 22));
    camSet(1.8, 0.7, 13.6 + 0.5 * ease(t, 0, 1.2), -0.6, 1.0, 22, 50, 3);
    bulgeNet(WORLD.goals.far, b * 1.2, 0.8, 1.2);
    BALL.position.set(lerp(-0.5, 0.8, q), lerp(0.5, 1.2, q) - (T > 19.48 ? Math.min(1, (T - 19.48) * 3) : 0), lerp(16, 22.4 + b * 0.6, q));
    await place('saci', svgS(T, { tilt: -60, armL: 160, armR: 160, bendL: 0, bendR: 0, handL: 'open', handR: 'open', expr: 'surprised' }), -1.6, 0.25, 21.2, { rot: -50, hip: 0.5 });
    const rise = E.out(inv(19.5, 19.95, T));
    await place('freitas', svgF(T, { expr: 'joy', armL: 150 * rise + 10, armR: 150 * rise + 10, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: rise * 30 }), -2.2, 0, 16.6, { rot: lerp(80, 0, rise), hip: 0.4 });
    return { mood: 'orange', over: comic(T, 19.5, 'GOL!', 540, 520, { size: 160 }) };
  } },
  { t0: 20.6, async draw(t, T) { camSet(0, 30, -60, 0, 0, 0); return { mood: 'orange' }; } },
];
