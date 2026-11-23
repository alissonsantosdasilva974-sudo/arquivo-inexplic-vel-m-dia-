// FLUIDEZ (ep. 4): atuação a cada palavra, câmera sempre em movimento, punch-ins e entradas/saídas com movimento.
// Não altera o rig: só calcula opções para person() e câmeras para os SHOTS.
const WORDS = CAPTIONS.flatMap(c => c.words);
const wordBeats = (a, b) => WORDS.filter(w => w.s >= a && w.s < b).map(w => w.s);
const WS = (word, a = 0, b = 999) => { const w = WORDS.find(w => w.s >= a && w.s < b && w.w.toLowerCase().replace(/[^a-zà-ú]/g, '') === word); return w ? w.s : null; };
// repertório de gestos (braço livre); L espelha
const GEST = [
  { arm: 70, bend: 75, hand: 'open' }, { arm: 112, bend: 35, hand: 'open' }, { arm: 55, bend: 105, hand: 'point' },
  { arm: 92, bend: 18, hand: 'open' }, { arm: 35, bend: 60, hand: 'fist' }, { arm: 130, bend: 55, hand: 'open' },
];
const REST = { arm: 10, bend: 14, hand: 'fist' };
// act: pose base + respiração de peso + gesto por palavra nos intervalos de fala
function act(T, base, o = {}) {
  const sd = o.seed || 1, d = Object.assign({ t: T }, base);
  d.x = (base.x || 0) + Math.sin(T * 1.25 + sd) * 4 * (base.s || 0.62) / 0.62;
  d.headTilt = (base.headTilt || 0) + Math.sin(T * 1.6 + sd * 2) * 2.5;
  if (base.lx == null) d.lx = Math.sin(T * 0.6 + sd) * 0.35;
  if (base.ly == null) d.ly = Math.sin(T * 0.9 + sd * 3) * 0.15;
  const iv = o.talk || [];
  if (iv.length) d.mouth = Math.max(base.mouth || 0, talk(T, iv));
  const arms = o.arms || 'R';
  for (const [a, b] of iv) {
    if (T < a - 0.1 || T > b + 0.35) continue;
    const beats = wordBeats(a, b); let i = -1; beats.forEach((s, j) => { if (T >= s - 0.07) i = j; });
    let cur = REST, prev = REST, p = 1;
    if (i >= 0) { cur = GEST[(i * 2 + sd) % GEST.length]; prev = i > 0 ? GEST[((i - 1) * 2 + sd) % GEST.length] : REST; p = E.back(clamp((T - (beats[i] - 0.07)) / 0.17)); }
    if (T > b + 0.05) { prev = cur; cur = REST; p = E.inOut(clamp((T - b - 0.05) / 0.3)); }
    const set = (side, g0, g1) => { d['arm' + side] = lerp(g0.arm, g1.arm, p); d['bend' + side] = lerp(g0.bend, g1.bend, p); d['hand' + side] = p > 0.5 ? g1.hand : g0.hand; };
    if (arms === 'R' || arms === 'both') set('R', prev, cur);
    if (arms === 'L' || arms === 'both') set('L', prev, cur);
    if (i >= 0) { const nod = pulse(T, beats[i] + 0.06, 0.14); d.headTilt += 5 * nod * (i % 2 ? 1 : -1); d.squash = (base.squash || 0) - 0.025 * nod; }
  }
  return d;
}
// figurantes sempre vivos
const jiggle = (T, sd = 1, amp = 1) => ({ jump: Math.abs(Math.sin(T * 7 + sd)) * 5 * amp, headTilt: Math.sin(T * 3 + sd) * 5 * amp, armL: 14 + Math.sin(T * 4 + sd) * 12 * amp, armR: 14 + Math.sin(T * 4.4 + sd * 2) * 12 * amp, bendL: 30, bendR: 30 });
// passantes andando de lado (fundo vivo)
function passersby(T, sd, n, y, s, x0 = -300, x1 = 2300) {
  const r = rng(sd); let out = '';
  for (let i = 0; i < n; i++) { const dir = r() < 0.5 ? 1 : -1, sp = 70 + r() * 60, ph = r() * (x1 - x0); const x = x0 + (((ph + dir * T * sp) % (x1 - x0)) + (x1 - x0)) % (x1 - x0); out += person(NPC_IDS[(sd * 3 + i * 5) % 24], { x, y, s, t: T, side: true, face: dir, walk: T * 8 + i, expr: 'neutral' }); }
  return out;
}
// câmera por keyframes: [t, x, y, z, r, sy] em mundo (como focus); easeInOut entre chaves + tremor de mão
function cam(t, keys, o = {}) {
  const comp = (k, def) => kf(t, keys.map(q => [q[0], q[k] != null ? q[k] : def]), o.ease || E.inOut);
  const c = focus(comp(1), comp(2), comp(3), comp(5, 960));
  c.r = comp(4, 0);
  const hh = o.hand == null ? 1 : o.hand;
  c.x += (Math.sin(t * 1.9) * 2.2 + Math.sin(t * 3.7 + 1) * 1.1) * hh; c.y += (Math.sin(t * 2.3 + 2) * 2 + Math.sin(t * 4.1) * 0.9) * hh;
  return c;
}
// punch-in nas palavras-chave: sobe rápido e acomoda
function punch(c, T, times, amt = 0.08) {
  let k = 0; for (const tk of times) { if (tk == null) continue; const dt = T - tk; if (dt < 0) continue; k += dt < 0.07 ? E.out(dt / 0.07) : Math.exp(-(dt - 0.07) / 0.22); }
  return { ...c, z: c.z * (1 + amt * Math.min(1.4, k)) };
}
// entrada/saída com movimento em cada corte (match move)
function cutMove(c, t, d) {
  const zin = 1 + 0.12 * (1 - E.out(clamp(t / 0.32)));
  const zout = 1 + 0.1 * E.in(clamp((t - (d - 0.16)) / 0.16));
  return { ...c, z: c.z * zin * zout, r: (c.r || 0) + 1.2 * (1 - E.out(clamp(t / 0.32))) };
}
// migalhas/poeira caindo
function crumbs(T, t0, x, y, n = 10, c = '#d8a860') {
  const dt = T - t0; if (dt < 0 || dt > 1.2) return ''; const r = rng(Math.round(t0 * 100)); let s = '';
  for (let i = 0; i < n; i++) { const vx = (r() - 0.5) * 160, vy = -60 - r() * 120; s += `<circle cx="${f2(x + vx * dt)}" cy="${f2(y + vy * dt + 420 * dt * dt)}" r="${f2(3 + r() * 4)}" fill="${c}" stroke="${INK}" stroke-width="1.5" opacity="${f2(1 - dt / 1.2)}"/>`; }
  return s;
}
// aplica cutMove a todos os SHOTS (chamado no fim do shots.js)
function applyCutMoves(total) {
  SHOTS.forEach((s, i) => { const f = s.draw, d = (SHOTS[i + 1] ? SHOTS[i + 1].t0 : total) - s.t0; s.draw = function (t, T) { const r = f.call(s, t, T); if (!s.still) r.cam = cutMove(r.cam, t, d); return r; }; });
}
// "Peso nos ombros" natural: em vez de dobrar o tronco inteiro no quadril (dobradiça), distribui a curva:
// quadril compensa para trás (tilt), tronco curva (lean menor), cabeça volta quase reta (olhos nivelados),
// ombros descem (squash leve) e o olhar cai. L = graus "de roteiro" (0..44), dir = +1 olhando p/ direita, −1 p/ esquerda.
function slump(L, dir = 1) {
  const k = clamp(L / 44);
  return { lean: dir * L * 0.85, tilt: -dir * L * 0.12, headTilt: -dir * L * 0.22, squash: -0.06 * k, ly: 0.35 * k };
}
// PS = P_ com o lean convertido em postura curvada (somado ao que a cena já define)
function PS(id, o = {}) {
  if (!o.lean) return P_(id, o);
  const L = Math.abs(o.lean), sl = slump(L, Math.sign(o.lean));
  return P_(id, Object.assign({}, o, { lean: sl.lean, tilt: (o.tilt || 0) + sl.tilt, headTilt: (o.headTilt || 0) + sl.headTilt, squash: (o.squash || 0) + sl.squash, ly: o.ly != null ? o.ly : sl.ly }));
}
