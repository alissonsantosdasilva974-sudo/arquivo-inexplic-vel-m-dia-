// Episode 2 v2 — "Quem devolve a nota vira o cobrador". Bigger town (city.js), perspective/aerial/over-the-shoulder shots,
// real night lighting, fixed hand-offs (bus driver, lady, suitcase). Vertical 9:16.
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
const nightSet = (T, t, extra, o = {}) => [...backNight(t), Lr(0.6, cityBack(t, { night: 1, seed: 41 })), Lr(1, cityRow(T, Object.assign({ night: 1, seed: 5, shops: 0.5 }, o)) + extra), Lr(1.2, fog(T))];
const duskSet = (T, t, extra) => [...backDusk(t), Lr(0.6, cityBack(t, { night: 0.35, seed: 43 })), Lr(1, cityRow(T, { closed: 1, seed: 7, noTrees: false }) + extra)];
const bakerySetV2 = (T, o = {}) => cityRow(T, { seed: 12, x0: 430, x1: 3000, signs: ['MERCADO', 'BARBEARIA', 'CORREIO', 'FLORES'], bunting: true, shops: 0.8 }) + cityRow(T, { seed: 13, x0: -1500, x1: -230, shops: 0.4 }) + bakeryFacade(-200, 900, Object.assign({ t: T, sign: false }, o));
const morningSet = (T, t, extra, o) => [...backDawn(t), Lr(0.6, cityBack(t, { seed: 44 })), Lr(1, bakerySetV2(T, o) + extra)];
const plazaSetV2 = (T, t, cx, extra, k = 0.6) => [...plazaBack(T, t), Lr(0.6, cityBack(t, { seed: 45, towerX: -2000 })), Lr(0.75, cityRow(T, { base: 760, seed: 21, signs: ['LIVRARIA', 'BAZAR', 'RELÓGIOS', 'SAPATARIA'], shops: 0.7, noTrees: true })), Lr(0.9, plazaGround(880) + towerEp2(T, cx, k)), Lr(1, extra)];
const towerEp2 = (T, cx, k, o = {}) => {
  const run = Math.max(0, T - 56.58);
  const min = 120 + run * 90, hour = 210 + run * 7.5;
  return `<g transform="translate(${cx} 880) scale(${k}) translate(${-cx} -880)">${clockTower(cx, 880, Object.assign({ hour, min }, o))}</g>`;
};
function road(t) {
  let s = `<rect x="-1400" y="700" width="4720" height="1200" fill="#c89a5a"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M -1400 ${720 + i * i * 9} H 3300" stroke="#a87a42" stroke-width="${2 + i}" opacity="0.5"/>`;
  s += `<path d="M 900 700 L 1020 700 L 1900 1900 L 20 1900 Z" fill="#8a8690"/><path d="M 960 700 L 960 1900" stroke="#f4efe0" stroke-width="10" stroke-dasharray="40 50" opacity="0.8"/>`;
  for (let i = 0; i < 10; i++) { const q = i / 9, x = lerp(880, -300, q * q), y = lerp(705, 1500, q * q), h = lerp(20, 160, q * q); s += `<rect x="${f2(x)}" y="${f2(y - h)}" width="${f2(4 + q * 12)}" height="${f2(h)}" fill="#6a4a2a"/><rect x="${f2(1920 - x)}" y="${f2(y - h)}" width="${f2(4 + q * 12)}" height="${f2(h)}" fill="#6a4a2a"/>`; }
  return s;
}
// hook = the town from above at night, with the glowing note floating in front (also the loop-back ending)
const hookNote = (t, T) => ({ cam: { ...focus(960, 700, 1.0 + 0.03 * Math.sin(T)), r: 0 }, layers: [
  Lr(1, cityAerial(1, { night: 1 })),
  Lr(1.05, `<rect x="-800" y="-800" width="3600" height="3200" fill="#0e1230" opacity="0.35"/><g transform="translate(960 640)">${noteNamed('?', GLOWN(T), { s: 3.3, rot: Math.sin(T * 1.3) * 6, fs: 22 })}</g>` + dust(T, 500, 300, 900, 600, 30, 5, '#ffe7a0'))], tint: ['#3a4a8a', 0.12] });
// POV close-ups with Polo's gloves
const povBg = (c) => Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="${c}"/><circle cx="960" cy="560" r="460" fill="#ffd27a" opacity="0.1"/>`);
const pov = (T, inner, o = {}) => Lr(1, povHands(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4 }));

SHOTS.push(
  // 0 — hook
  { t0: 0, draw(t, T) { return hookNote(t, T); } },
  // 1 — over the shoulder of the man: Polo holds out the note
  { t0: 1.22, draw(t, T) {
    const polo = P_('polo', { x: 640, y: 905, s: 0.62, t: T, face: 0.3, lx: 1, expr: 'neutral', armR: 82, bendR: 8, holdR: noteNamed('', 0, { s: 0.45 }), pocketNote: false });
    const man = P_('terno', { x: 860, y: 960, s: 0.9, t: T, back: true, face: -1 });
    return { cam: push(focus(720, 905 - 0.62 * 220, 2.6, 980), t, 1.1, 0.06), layers: nightSet(T, t, polo + man), tint: NIGHT };
  } },
  // 2 — low-angle reveal of the man in the suit
  { t0: 2.3, draw(t, T) {
    const man = P_('terno', { x: 820, y: 905, s: 0.66, t: T, face: -0.3, lx: -1, expr: 'smug' });
    const c = lerpCam(focus(820, 905 - 0.66 * 1.1 * 120, 2.6, 1180), focus(820, 905 - 0.66 * 1.1 * 330, 2.3, 980), E.inOut(clamp(t / 1.4)));
    return { cam: c, layers: nightSet(T, t, man + lampLight(700, 940, 1.0)), tint: NIGHT, over: comic(T, 2.7, 'COBRADOR!', 540, 520, { size: 100, fill: '#ff7a45', life: 1.1 }) };
  } },
  // 3 — two-shot under the lamp: Polo extends the R$10 note
  { t0: 3.9, draw(t, T) {
    const ext = E.out(inv(4.1, 4.9, T));
    const polo = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, expr: 'neutral', armR: lerp(30, 82, ext), bendR: 8, holdR: noteNamed('', 0, { s: 0.4 }) });
    const man = P_('terno', { x: 810, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'neutral' });
    return { cam: push(frameG(710, 905, 2.0, 1430), t, 1.9, 0.06), layers: nightSet(T, t, polo + man), tint: NIGHT };
  } },
  // 4 — close: the man takes the note (hands meet)
  { t0: 5.8, draw(t, T) {
    const take = E.inOut(inv(6.0, 6.7, T));
    const polo = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.5, armR: 82, bendR: 8, holdR: take < 0.55 ? noteNamed('', 0, { s: 0.4 }) : '' });
    const man = P_('terno', { x: 810, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', armL: lerp(15, 80, take), bendL: 8, holdL: take >= 0.55 ? noteNamed('', 0, { s: 0.4 }) : '' });
    return { cam: push(focus(712, 905 - 0.62 * 250, 2.7, 960), t, 1.4, 0.05), layers: nightSet(T, t, polo + man), tint: NIGHT };
  } },
  // 5 — he takes off his hat
  { t0: 7.2, draw(t, T) {
    const lift = E.back(inv(7.4, 8.1, T));
    const man = P_('terno', { x: 820, y: 905, s: 0.66, t: T, face: -0.2, expr: 'smug', hat: lift > 0.3 ? null : 'fedora', hatLift: lift * 40, armR: lerp(15, 165, lift), bendR: lerp(10, 50, lift), holdR: lift > 0.3 ? fedoraProp(-10) : '' });
    return { cam: push(focus(820, 905 - 0.66 * 1.1 * 300, 2.8, 900), t, 1.4, 0.05), layers: nightSet(T, t, man + lampLight(700, 940, 1.0)), tint: NIGHT };
  } },
  // 6 — he hands Polo the hat and the wallet
  { t0: 8.6, draw(t, T) {
    const give = E.inOut(inv(8.9, 10.0, T));
    const man = P_('terno', { x: 800, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', hat: null, armL: lerp(20, 82, give), bendL: 8, armR: lerp(20, 72, give), bendR: 30, holdL: give < 0.8 ? fedoraProp(0) : '', holdR: give < 0.8 ? wallet({ s: 0.3 }) : '' });
    const polo = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, expr: give > 0.6 ? 'surprised' : 'neutral', armR: give >= 0.8 ? 78 : 20, bendR: 15, armL: give >= 0.8 ? 60 : 12, bendL: 40, holdR: give >= 0.8 ? fedoraProp(10) : '', holdL: give >= 0.8 ? wallet({ s: 0.3 }) : '' });
    return { cam: push(frameG(705, 905, 2.0, 1430), t, 1.7, 0.06), layers: nightSet(T, t, polo + man), tint: NIGHT };
  } },
  // 7 — close: Polo, astonished
  { t0: 10.3, draw(t, T) {
    const polo = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.2, expr: 'surprised', armR: 75, bendR: 20, armL: 60, bendL: 40, holdR: fedoraProp(10), holdL: wallet({ s: 0.3 }) });
    return { cam: push(focus(610, 905 - 0.62 * 250, 3.2, 950), t, 1.4, 0.07), layers: nightSet(T, t, polo + emote('excl', 610, 905 - 0.62 * 440, T - 10.45, 0.9)), tint: NIGHT };
  } },
  // 8 — perspective: the man walks slowly away down the dark street; Polo watches from the foreground
  { t0: 11.7, draw(t, T) {
    const D = lerp(500, 3200, E.inOut(clamp(t / 2.9)));
    return { cam: focus(960, 720, 1.0), layers: [...backNight(t), Lr(1, perspStreet(T, { night: 1 }) + onStreet('terno', 60, D, 0.9, { t: T, back: true, walk: T * 5, hat: null }) + onStreet('polo', -260, 60, 0.95, { t: T, back: true, armR: 40, bendR: 40, holdR: fedoraProp(0), armL: 30, bendL: 50, holdL: wallet({ s: 0.3 }) })), Lr(1.1, fog(T, 760, 0.55))], tint: NIGHT };
  } },
  // 9 — Polo puts the hat on
  { t0: 14.6, draw(t, T) {
    const on = E.out(inv(15.4, 16.1, T));
    const polo = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.1, expr: on > 0.9 ? 'smug' : 'neutral', hat: on > 0.15 ? 'fedora' : null, hatLift: (1 - on) * 70, armR: on > 0.15 ? lerp(170, 30, inv(16.0, 16.5, T)) : lerp(60, 170, inv(15.0, 15.4, T)), bendR: 30, holdR: on <= 0.15 ? fedoraProp(0) : '', armL: 30, bendL: 50, holdL: wallet({ s: 0.3 }) });
    return { cam: push(focus(610, 905 - 0.62 * 280, 3.0, 940), t, 2.4, 0.06), layers: nightSet(T, t, polo + lampLight(470, 940, 1.0) + emote('sparkle', 610, 905 - 0.62 * 470, T - 16.1, 0.9)), tint: NIGHT };
  } },
  // 10 — POV: the wallet opens in Polo's gloves
  { t0: 17.0, draw(t, T) {
    const op = E.back(inv(17.3, 18.2, T));
    return { cam: push(focus(960, 640, 1.0), t, 2.5, 0.06), layers: [povBg('#262646'), pov(T, wallet({ s: 1, open: op, n: 4, labels: ['', '', '', ''] }))] };
  } },
  // 11 — POV: the names glow in the corners (big and legible)
  { t0: 19.5, draw(t, T) {
    const g = E.out(inv(19.6, 20.2, T)) * GLOWN(T);
    const notes = [['PADEIRO', -92, -12], ['MOTORISTA', 0, 0], ['SENHORA', 92, 12]].map(([n, x, r], i) => `<g transform="translate(${x} ${-150 + i * 40 - Math.abs(x) * 0.1}) rotate(${r})">${noteNamed(n, g, { s: 0.82, fs: 18 })}</g>`).join('');
    return { cam: push(focus(960, 560, 1.15), t, 1.9, 0.08), layers: [povBg('#262646'), pov(T, notes, { k: 1.55, spread: 250 }), Lr(1.05, dust(T, 500, 300, 900, 600, 26, 8, '#ffe7a0'))] };
  } },
  // 12 — POV: the first note says "PADEIRO"
  { t0: 21.4, draw(t, T) { return { cam: push(focus(960, 600, 1.0), t, 2.2, 0.08), layers: [povBg('#262646'), pov(T, noteNamed('PADEIRO', GLOWN(T), { s: 1.6, rot: -4, fs: 17 }), { k: 2.0, spread: 260 }), Lr(1.05, dust(T, 500, 300, 900, 600, 22, 9, '#ffe7a0'))] }; } },
  // 13 — morning: the town from above
  { t0: 23.6, xf: 0.35, draw(t, T) { return { cam: push(focus(960, 700, 1.0), t, 1.2, 0.05), layers: [Lr(0.04, sky('#f2b07a', '#fbe4c0', { sun: 300, sunX: 600, id: 'am' })), Lr(1, cityAerial(1, {}))] }; } },
  // 14 — Polo knocks at the bakery on the busy shopping street
  { t0: 24.6, draw(t, T) {
    const knock = (T > 24.8 && T < 25.5) ? Math.abs(Math.sin((T - 24.8) * 18)) : 0;
    const polo = P_('polo', { x: 520, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral', armL: 70 + knock * 25, bendL: 70, armR: 20 });
    return { cam: push(frameG(400, 905, 1.8, 1440), t, 1.2, 0.06), layers: morningSet(T, t, polo + walkers(T, 935, 0.42, 51, 3, 3200)), over: comic(T, 24.82, 'TOC TOC!', 540, 560, { size: 100, life: 0.9 }) };
  } },
  // 15 — the baker opens the door and goes pale
  { t0: 25.8, draw(t, T) {
    const open = E.out(inv(26.1, 26.6, T)), pale = E.inOut(inv(27.0, 27.6, T));
    const bak = P_('padeiro2', { x: 300, y: 900, s: 0.62, t: T, face: 0.5, lx: 1, expr: pale > 0.3 ? 'surprised' : 'neutral', pale, armL: 10, armR: 30 });
    const polo = P_('polo', { x: 540, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral' });
    return { cam: push(frameG(420, 905, 2.0, 1430), t, 2.6, 0.06), layers: morningSet(T, t, (open > 0.3 ? bak : '') + polo + emote('sweat', 340, 900 - 0.62 * 400, T - 27.3, 0.8), { open }) };
  } },
  // 16 — over Polo's shoulder: the note passes hand to hand
  { t0: 28.4, draw(t, T) {
    const give = E.inOut(inv(28.7, 29.5, T));
    const polo = P_('polo', { x: 560, y: 980, s: 0.9, t: T, back: true, hat: 'fedora', armR: lerp(20, 78, give), bendR: 8, holdR: give < 0.7 ? noteNamed('PADEIRO', 0.7, { s: 0.42 }) : '' });
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.4, lx: 1, expr: 'surprised', pale: 1, armR: lerp(15, 80, give), bendR: 8, holdR: give >= 0.7 ? noteNamed('PADEIRO', 0.7, { s: 0.42 }) : '' });
    return { cam: push(focus(420, 900 - 0.62 * 220, 2.6, 900), t, 1.5, 0.05), layers: morningSet(T, t, bak + polo, { open: 1 }) };
  } },
  // 17 — the baker cries with relief
  { t0: 29.9, draw(t, T) {
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.2, expr: 'joy', mouth: 0.7, tears: 1, pale: 1 - E.inOut(inv(30.1, 31.0, T)), armL: 60, bendL: 90, armR: 70, bendR: 80, holdR: noteNamed('PADEIRO', 0.5, { s: 0.42 }) });
    return { cam: push(focus(330, 900 - 0.62 * 290, 3.2, 920), t, 2.2, 0.07), layers: morningSet(T, t, bak, { open: 1 }) };
  } },
  // 18 — "faz trinta anos que eu tento ir embora!"
  { t0: 32.1, draw(t, T) {
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.3, expr: 'happy', mouth: talk(T, [[32.36, 32.7], [33.18, 35.2]]), armL: 40 + Math.sin(T * 6) * 30, bendL: 60, armR: 130 + Math.sin(T * 5) * 20, bendR: 40, handR: 'open' });
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral' });
    return { cam: push(frameG(440, 905, 2.1, 1430), t, 3.4, 0.06), layers: morningSet(T, t, bak + polo, { open: 1 }), over: comic(T, 33.4, '30 ANOS!', 540, 520, { size: 110, life: 1.4, fill: '#ffd23f' }) };
  } },
  // 19 — he grabs his (full-size) suitcase and runs off; Polo steps aside, the camera follows him
  { t0: 35.5, draw(t, T) {
    const run = T > 36.4;
    const bx = run ? lerp(330, 2300, E.in(inv(36.4, 38.6, T)) * 0.6 + inv(36.4, 38.6, T) * 0.4) : 330;
    const case_ = suitcase({ s: 0.85 });
    const bak = run ? P_('padeiro2', { x: bx, y: lerp(900, 960, inv(36.4, 36.9, T)), s: 0.62, t: T, face: 0.8, side: true, run: true, walk: T * 16, expr: 'joy', holdR: case_ })
      : P_('padeiro2', { x: bx, y: 900, s: 0.62, t: T, face: 0.3, expr: 'joy', armR: 25, bendR: 10, holdR: case_ });
    const step = E.inOut(inv(36.1, 36.6, T));
    const polo = P_('polo', { x: lerp(560, 480, step), y: lerp(905, 880, step), s: 0.62, t: T, face: run ? 0.5 : -0.4, lx: 1, hat: 'fedora', expr: 'surprised' });
    const camX = run ? lerp(440, bx, inv(36.6, 37.2, T)) : 440;
    return { cam: frameG(camX, 930, 1.7, 1440), layers: morningSet(T, t, polo + pigeon(900, 934, t, 3, 0.9, 36.7) + pigeon(1100, 934, t, 4, 0.9, 36.8) + bak + emote('heart', bx, 960 - 0.62 * 430, (t % 1.2), 0.8), { open: 1 }) };
  } },
  // 20 — Polo walks to the bus stop on the avenue
  { t0: 38.6, xf: 0.3, draw(t, T) {
    const px = 60 + t * 110;
    return { cam: push(frameG(px + 60, 930, 2.0, 1420), t, 2.2, 0.05), layers: [...backDay(t), Lr(0.3, farTown('#aec4d0', 700, 8) + haze('#eaf2ee', 300, 900, 0.6)), Lr(1, streetC(t) + walkers(t, 945, 0.4, 61, 3, 3200) + P_('polo', { x: px, y: 930, s: 0.62, t: T, face: 0.8, side: true, walk: T * 11, hat: 'fedora', expr: 'neutral' }))] };
  } },
  // 21 — the driver takes the note and laughs out loud
  { t0: 40.8, draw(t, T) { return driverEp2(t, T, push(focus(985, 1100 - 1.55 * 1.05 * 330, 2.0), t, 2.4, 0.06)); } },
  // 22a — "Soltou o volante": inside the cab, his hands let go of the wheel
  { t0: 43.2, draw(t, T) {
    const off = E.out(inv(43.55, 44.0, T));
    const hand = (x, y) => `<g transform="translate(${x} ${y})"><path d="M 0 400 L 0 0" stroke="${INK}" stroke-width="110" stroke-linecap="round"/><path d="M 0 400 L 0 0" stroke="#3c5a8a" stroke-width="94" stroke-linecap="round"/><g transform="translate(0 -40) scale(3.2)">${mitt(0, 0, 0, 20, '#f3cfae', 'fist')}</g></g>`;
    const inside = `<rect x="-800" y="-800" width="3600" height="3200" fill="#3a4650"/><rect x="300" y="80" width="1320" height="560" rx="40" fill="#bfe0ea" stroke="${INK}" stroke-width="12"/><rect x="300" y="80" width="1320" height="560" rx="40" fill="url(#pPlaster)" opacity="0.4"/>` + `<g transform="translate(0 0)">${streetC(t * 0, 880).slice(0, 0)}</g><rect x="300" y="520" width="1320" height="120" fill="#8a8690"/><path d="M 960 520 L 960 640" stroke="#f4efe0" stroke-width="10"/><rect x="200" y="640" width="1520" height="900" fill="#2a2630" stroke="${INK}" stroke-width="10"/>`;
    return { cam: push(focus(960, 700, 1.0), t, 1.3, 0.05), layers: [Lr(1, inside + steeringWheel(960, 860, 1.6, Math.sin(T * 3) * 4) + hand(lerp(770, 640, off), lerp(880, 1180, off)) + hand(lerp(1150, 1280, off), lerp(880, 1180, off)))], over: comic(T, 43.6, 'TCHAU!', 540, 520, { size: 100, life: 1.0, fill: '#ffffff' }) };
  } },
  // 22b — "abriu a porta": the folding door opens
  { t0: 44.5, draw(t, T) {
    const door = E.out(inv(44.7, 45.1, T));
    return { cam: push(focus(200 + 475, 1000 - 150, 2.2), t, 0.9, 0.05), layers: [...backDay(t), Lr(0.3, farTown('#aec4d0', 700, 8)), Lr(1, streetC(t * 0, 880) + bus(200, 1000, { t: 0, wheel: 0, door, passengers: [P_('viz2', { t: T, face: 0.3, shadow: false }), P_('senhora', { t: T, face: -0.3, shadow: false }), P_('viz1', { t: T, face: 0.3, shadow: false }), P_('moca', { t: T, face: 0.4, shadow: false })], driver: P_('motorista', { t: T, face: 0.6, expr: 'laugh', mouth: 0.6, shadow: false }), pT: 'translate(55 178) scale(0.36)', dT: 'translate(66 178) scale(0.36)' }))] };
  } },
  // 22c — "e foi embora a pé!": wide — he steps down and walks off along the sidewalk, waving; the whole bus in frame
  { t0: 45.4, draw(t, T) {
    const dx = lerp(820, 1260, inv(45.5, 46.5, T));
    const drv = P_('motorista', { x: dx, y: 1010, s: 0.62, t: T, face: 0.8, side: true, walk: T * 10, expr: 'happy', armFront: 160 + Math.sin(T * 12) * 14 });
    return { cam: frameG(780, 1010, 0.95, 1460), layers: [...backDay(t), Lr(0.3, farTown('#aec4d0', 700, 8) + haze('#eaf2ee', 300, 900, 0.6)), Lr(1, streetC(t * 0, 880) + bus(200, 1000, { t: 0, wheel: 0, door: 1, emptySeat: true, passengers: [P_('viz2', { t: T, face: 0.3, shadow: false, expr: 'surprised' }), P_('senhora', { t: T, face: 0.5, shadow: false, expr: 'surprised' }), P_('viz1', { t: T, face: 0.5, shadow: false, expr: 'surprised' }), P_('moca', { t: T, face: 0.6, shadow: false, expr: 'surprised' })], pT: 'translate(55 178) scale(0.36)' }) + drv)] };
  } },
  // 23 — the bus drives on by itself: empty driver's seat, passengers panicking; the driver waves from the sidewalk
  { t0: 46.5, draw(t, T) {
    const bx = kf(T, [[46.5, 200], [49.7, 1500]], E.in);
    const pass = ['viz2', 'senhora', 'viz1', 'moca'].map((id, i) => P_(id, { t: T, face: (i % 2 ? -0.3 : 0.3), expr: 'surprised', mouth: 0.8, shadow: false, armL: 160, armR: 160 }));
    const drv = P_('motorista', { x: 640, y: 1010, s: 0.62, t: T, face: 0.3, expr: 'laugh', mouth: 0.5, armR: wave(T, 46.6, 49.6, 160, 20) || 20, bendR: 25 });
    return { cam: frameG(lerp(780, 1300, inv(46.5, 49.7, T)), 1010, 1.05, 1460), layers: [...backDay(t), Lr(0.3, farTown('#aec4d0', 700, 8) + haze('#eaf2ee', 300, 900, 0.6)), Lr(1, streetC(t, 880) + bus(bx, 1000, { t: T, wheel: T * 400, passengers: pass, emptySeat: true, door: 1, pT: 'translate(55 178) scale(0.36)' }) + speedLines(bx - 40, 820, 6, 120, 0, 0.6, Math.floor(T * 8)) + drv)],
      over: comic(T, 47.2, 'SOCORRO!', 540, 520, { size: 100, life: 1.6, fill: '#ff7a45' }) };
  } },
  // 24 — the square (stopped clock): the dog growls at Polo; the note goes from his hand to hers
  { t0: 49.7, xf: 0.3, draw(t, T) {
    const reach = E.inOut(inv(50.3, 50.9, T)), pass = T > 51.05;
    const polo = P_('polo', { x: 1200, y: 1000, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', armL: lerp(20, 82, reach) - (pass ? E.inOut(inv(51.2, 51.7, T)) * 60 : 0), bendL: 8, holdL: pass ? '' : noteNamed('SENHORA', 0.6, { s: 0.42 }) });
    const lady = P_('senhora', { x: 1000, y: 1000, s: 0.62, t: T, face: 0.5, lx: 1, expr: pass ? 'happy' : 'neutral', armR: lerp(20, 82, reach), bendR: 8, holdR: pass ? noteNamed('SENHORA', 0.6, { s: 0.42 }) : '' });
    return { cam: push(frameG(1100, 1000, 1.8, 1430), t, 2.4, 0.06), layers: plazaSetV2(T, t, 1100, lady + dog(1090, 1012, { t: T, growl: 1, s: 0.48, face: 1 }) + polo + emote('sparkle', 1000, 1000 - 0.62 * 440, T - 51.3, 0.7)) };
  } },
  // 25 — the dog stops growling and wags its tail
  { t0: 52.1, draw(t, T) {
    const calm = E.inOut(inv(53.2, 53.8, T));
    return { cam: push(focus(1100, 960, 3.8), t, 2.9, 0.06), layers: plazaSetV2(T, t, 1100, dog(1090, 1012, { t: T, growl: 1 - calm, wag: calm, s: 0.6, face: 1 }) + emote('heart', 1150, 920, T - 54.0, 0.6) + emote('vein', 1150, 925, T < 53.2 ? T - 52.2 : -1, 0.45)), over: comic(T, 52.6, 'GRRR...', 540, 560, { size: 90, life: 0.9, fill: '#ffffff' }) };
  } },
  // 26 — low angle: even the tower clock starts moving again
  { t0: 55.0, draw(t, T) {
    const c = push(focus(1100, 880 - 720 * 0.6 + 60, 1.8, 1100), t, 2.8, 0.08);
    return { cam: c, layers: plazaSetV2(T, t, 1100, pigeon(980, 980, t, 3, 0.6, 56.6) + pigeon(1230, 985, t, 4, 0.6, 56.6)), over: comic(T, 56.6, 'TIC TAC!', 540, 560, { size: 110, life: 1.2 }) };
  } },
  // 27 — but then Polo looks at the wallet
  { t0: 57.8, draw(t, T) {
    const polo = P_('polo', { x: 1100, y: 1000, s: 0.62, t: T, face: 0.2, ly: 0.8, hat: 'fedora', expr: T > 59.5 ? 'worried' : 'neutral', armL: 55, bendL: 70, holdL: wallet({ s: 0.32, light: 0.3 }) });
    return { cam: push(focus(1100, 1000 - 0.62 * 240, 3.0, 960), t, 2.7, 0.06), layers: plazaSetV2(T, t, 1100, polo) };
  } },
  // 28 — POV: it was getting light. Very light (floats up in his gloves).
  { t0: 60.5, draw(t, T) {
    const lt = E.inOut(inv(60.8, 62.6, T));
    return { cam: push(focus(960, 620, 1.0), t, 2.9, 0.06), layers: [povBg('#efd4a0'), pov(T, `<g transform="translate(0 ${f2(-lt * 90 + Math.sin(T * 3) * 10 * lt)}) rotate(${f2(Math.sin(T * 3) * 8 * lt)})">${wallet({ s: 1, light: lt })}</g>`, { k: 2.2 })], over: comic(T, 62.3, 'LEVE...', 540, 520, { size: 100, life: 1.0, fill: '#ffffff' }) };
  } },
  // 29 — POV: only one note left
  { t0: 63.4, draw(t, T) { return { cam: push(focus(960, 620, 1.0), t, 2.1, 0.06), layers: [povBg('#262646'), pov(T, wallet({ s: 1, open: E.back(inv(63.6, 64.4, T)), n: 1, labels: [''], light: 1 }), { k: 2.2 })] }; } },
  // 30 — it didn't have anybody from town's name
  { t0: 65.5, draw(t, T) {
    const polo = P_('polo', { x: 1100, y: 1000, s: 0.62, t: T, face: 0.2, ly: 0.6, hat: 'fedora', expr: 'worried', armL: 60, bendL: 60, holdL: noteNamed('', 0.3, { s: 0.45 }) });
    return { cam: push(focus(1100, 1000 - 0.62 * 250, 3.0, 960), t, 2.7, 0.06), layers: plazaSetV2(T, t, 1100, polo + emote('q', 1140, 1000 - 0.62 * 470, T - 66.2, 0.9)) };
  } },
  // 31 — POV: it had the suited man's mark!
  { t0: 68.2, draw(t, T) {
    const rv = E.out(inv(68.5, 69.6, T));
    return { cam: push(focus(960, 600, 1.0), t, 2.6, 0.12), layers: [povBg('#1c1c38'), pov(T, noteNamed('@hat', rv * GLOWN(T) + 0.2, { s: 1.6, rot: -3 }), { k: 2.0, spread: 260 }), Lr(1.05, dust(T, 500, 300, 900, 600, 24, 3, '#ffe7a0'))], over: comic(T, 69.6, '!!!', 540, 400, { size: 140, life: 1.1, fill: '#ff7a45' }) };
  } },
  // 32 — perspective: Polo runs toward camera down the empty night street
  { t0: 70.8, xf: 0.25, draw(t, T) {
    const D = lerp(2600, 250, E.inOut(clamp(t / 2.6)));
    return { cam: focus(960, 720, 1.0), layers: [...backNight(t), Lr(1, perspStreet(T, { night: 1 }) + onStreet('polo', 40, D, 0.95, { t: T, walk: T * 16, hat: 'fedora', expr: 'worried', armL: 40 + Math.sin(T * 16) * 30, armR: 40 - Math.sin(T * 16) * 30 })), Lr(1.1, fog(T, 760, 0.5))], tint: NIGHT };
  } },
  // 33 — perspective: the man waits, standing on the corner, under the lamp (camera pushes in)
  { t0: 73.4, draw(t, T) {
    return { cam: lerpCam(focus(960, 720, 1.0), focus(1025, 660, 2.8), E.inOut(clamp(t / 2.6))), layers: [...backNight(t), Lr(1, perspStreet(T, { night: 1 }) + onStreet('terno', 300, 1800, 0.95, { t: T, face: -0.3, expr: 'smug', hat: null })), Lr(1.1, fog(T, 760, 0.6))], tint: NIGHT };
  } },
  // 34 — over Polo's shoulder: he holds out the last note
  { t0: 76.0, draw(t, T) {
    const ext = E.out(inv(76.3, 77.0, T));
    const polo = P_('polo', { x: 640, y: 990, s: 0.9, t: T, back: true, hat: 'fedora', armR: lerp(20, 78, ext), bendR: 8, holdR: noteNamed('@hat', 0.8, { s: 0.42 }) });
    const man = P_('terno', { x: 860, y: 905, s: 0.62, t: T, face: -0.3, lx: -1, expr: 'smug', hat: null });
    return { cam: push(focus(780, 905 - 0.62 * 240, 2.5, 940), t, 2.1, 0.05), layers: nightSet(T, t, man + lampLight(900, 940, 1.0) + polo), tint: NIGHT };
  } },
  // 35 — he smiles: "esperei muito tempo por você." (lit by the lamp)
  { t0: 78.1, draw(t, T) {
    const man = P_('terno', { x: 860, y: 905, s: 0.62, t: T, face: -0.2, expr: 'smug', hat: null, mouth: talk(T, [[79.92, 81.32]]) * 0.6 });
    return { cam: push(focus(860, 905 - 0.62 * 1.1 * 310, 3.4, 920), t, 4.0, 0.1), layers: nightSet(T, t, man + lampLight(900, 940, 1.1)), tint: NIGHT };
  } },
  // 36 — he takes the note and vanishes for good
  { t0: 82.1, draw(t, T) {
    const take = E.inOut(inv(82.5, 83.2, T)), fade = 1 - E.inOut(inv(84.0, 84.8, T));
    const man = P_('terno', { x: 860, y: 905, s: 0.62, t: T, face: -0.4, expr: 'smug', hat: null, armL: lerp(15, 80, take), bendL: 8, holdL: take > 0.55 ? noteNamed('@hat', 0.8, { s: 0.42 }) : '', fade });
    const polo = P_('polo', { x: 660, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, hat: 'fedora', expr: fade < 0.6 ? 'surprised' : 'worried', armR: take < 0.55 ? 82 : 20, bendR: 8, holdR: take < 0.55 ? noteNamed('@hat', 0.8, { s: 0.42 }) : '' });
    const sparks = fade < 1 ? Array.from({ length: 16 }, (_, i) => { const q = 1 - fade, a = i * 0.9; return `<circle cx="${f2(860 + Math.cos(a) * 120 * q)}" cy="${f2(780 - Math.sin(a) * 140 * q - q * 60)}" r="${f2(5 * (1 - q) + 1)}" fill="#ffe7a0" opacity="${f2(1 - q)}"/>`; }).join('') : '';
    return { cam: push(frameG(760, 905, 2.0, 1430), t, 3.0, 0.06), layers: nightSet(T, t, polo + man + sparks + lampLight(900, 940, 1.0)), tint: NIGHT };
  } },
  // 37 — high angle: Polo alone, wearing the hat, in an empty town
  { t0: 85.1, xf: 0.4, draw(t, T) {
    const c = lerpCam(focus(960, 900, 1.6), focus(960, 760, 1.0), E.inOut(clamp(t / 3.9)));
    return { cam: c, layers: [...backDusk(t), Lr(1, perspStreet(T, { closed: 1, night: 0.3, camH: 1100, vpY: 420, tower: true }) + onStreet('polo', 0, 600, 0.95, { t: T, hat: 'fedora', expr: 'sad' }))], tint: DUSK };
  } },
  // 38 — then he hears footsteps on the road
  { t0: 89.0, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: T > 89.6 ? -0.7 : 0.1, lx: T > 89.6 ? -1 : 0, hat: 'fedora', expr: T > 89.6 ? 'surprised' : 'sad', turn: pulse(T, 89.6, 0.1) });
    return { cam: push(focus(760, 905 - 0.62 * 270, 2.8, 940), t, 2.3, 0.06), layers: duskSet(T, t, polo + emote('excl', 760, 905 - 0.62 * 470, T - 89.7, 0.9)), tint: DUSK, over: comic(T, 89.75, 'TAP... TAP...', 540, 540, { size: 90, life: 1.5, fill: '#ffffff' }) };
  } },
  // 39 — someone is coming along the road (town skyline behind)
  { t0: 91.3, draw(t, T) {
    const q = E.inOut(clamp(t / 1.7));
    const fig = P_('vulto', { x: 960, y: lerp(760, 900, q), s: lerp(0.18, 0.4, q), t: T, face: 0, walk: T * 7, expr: 'neutral' });
    return { cam: focus(960, 720, 1.2), layers: [...backDusk(t), Lr(0.5, cityBack(t, { night: 0.4, seed: 47, towerX: 1300 })), Lr(1, road(t) + fig)], tint: DUSK };
  } },
  // 40 — close: a R$10 note, folded in the pocket
  { t0: 93.0, draw(t, T) {
    const fig = P_('vulto', { x: 960, y: 1080, s: 1.4, t: T, face: 0, expr: 'neutral', armL: 10, armR: 10 });
    const fold = `<g transform="translate(990 ${1080 - 1.4 * 190})" opacity="0.95"><g transform="rotate(-12) scale(0.55)">${noteNamed('', GLOWN(T), { s: 1 })}</g></g>`;
    return { cam: push(focus(990, 1080 - 1.4 * 180, 2.4), t, 1.8, 0.08), layers: [...backDusk(t), Lr(0.5, cityBack(t, { night: 0.4, seed: 47 })), Lr(1, road(t) + fig + fold)], tint: DUSK };
  } },
  // 41 — Polo tightens his hat and smiles
  { t0: 94.8, draw(t, T) {
    const adj = (T > 95.4 && T < 96.4) ? 1 : 0;
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.05, hat: 'fedora', hatLift: adj ? Math.abs(Math.sin((T - 95.4) * 6)) * 6 : 0, expr: T > 96.4 ? 'smug' : 'neutral', wink: true, armR: adj ? 165 : 20, bendR: 40 });
    return { cam: push(focus(760, 905 - 0.62 * 300, 3.4, 920), t, 2.8, 0.08), layers: duskSet(T, t, polo + emote('sparkle', 760, 905 - 0.62 * 480, T - 96.6, 0.9)), tint: DUSK };
  } },
  // 42 — "Você cobrava a nota ou avisava a verdade?"
  { t0: 97.6, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.0, hat: 'fedora', expr: T < 99.0 ? 'smug' : 'neutral', armR: 80, bendR: 20, holdR: noteNamed('', 0.6, { s: 0.42 }), armL: T > 99.2 ? 100 : 20, bendL: 40, handL: T > 99.2 ? 'open' : null });
    return { cam: push(frameG(760, 905, 2.1, 1400), t, 3.1, 0.07), layers: duskSet(T, t, polo + emote('q', 820, 905 - 0.62 * 470, T - 99.0, 0.9)), tint: DUSK };
  } },
  // 43 — "Comenta COBRA ou AVISA."
  { t0: 100.7, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: T < 101.6 ? -0.4 : 0.4, lx: T < 101.6 ? -1 : 1, hat: 'fedora', expr: 'happy', armL: T < 101.6 ? 110 : 20, armR: T >= 101.6 ? 110 : 20, bendL: 0, bendR: 0, handL: 'point', handR: 'point' });
    return { cam: push(frameG(760, 905, 2.0, 1400), t, 2.1, 0.06), layers: duskSet(T, t, polo), tint: DUSK,
      over: comic(T, 101.3, 'COBRA', 300, 560, { size: 110, life: 1.6, fill: '#ff7a45', rot: -8 }) + comic(T, 101.85, 'AVISA', 780, 620, { size: 110, life: 1.2, fill: '#7ac0ff', rot: 8 }) };
  } },
  // 44 — "Você decide a parte 3."
  { t0: 102.8, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.0, hat: 'fedora', expr: 'smug', wink: true, armR: 62, bendR: -18, handR: 'point', ly: 0.8 });
    const arrow = `<g transform="translate(540 ${f2(1450 + Math.sin(T * 10) * 16)})" opacity="${f2(clamp((T - 103.1) / 0.15))}"><path d="M -34 -40 L 34 -40 L 34 0 L 70 0 L 0 70 L -70 0 L -34 0 Z" fill="#ffd23f" stroke="#211c26" stroke-width="10" stroke-linejoin="round"/></g>`;
    return { cam: push(focus(760, 905 - 0.62 * 280, 2.8, 940), t, 1.7, 0.08), layers: duskSet(T, t, polo), tint: DUSK, over: comic(T, 103.3, 'PARTE 3?', 540, 540, { size: 120, life: 1.4, fill: '#ffd23f' }) + arrow };
  } },
  // 45 — "E lembra:" → loops back into the hook
  { t0: 104.55, draw(t, T) { return hookNote(0, T - 105.2); } },
);

function driverEp2(t, T, cam) {
  let bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#c4d8de"/>`;
  for (let i = 0; i < 8; i++) { const x = i * 420 - 600; bg += `<rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="${['#aec4d0', '#e8d8c0', '#d0c8e0'][i % 3]}"/><rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="url(#pPlaster)"/>`; }
  const take = E.inOut(inv(41.4, 41.9, T));
  const laugh = T > 42.3;
  const drv = P_('motorista', { x: 985, y: 1100, s: 1.55, t: T, face: -0.3, expr: laugh ? 'laugh' : 'neutral', mouth: laugh ? 0.8 : 0, armL: lerp(12, 80, take), bendL: 30, holdL: take > 0.4 ? noteNamed('MOTORISTA', 0.6, { s: 0.42 }) : '', shadow: false, tilt: laugh ? Math.sin(T * 14) * 3 : 0 });
  const panel = `<path fill-rule="evenodd" d="M -400 -600 H 2400 V 1800 H -400 Z M 470 210 H 1450 Q 1500 210 1500 260 V 900 H 470 Z" fill="#f2c230" stroke="${INK}" stroke-width="6"/><rect x="-400" y="960" width="2800" height="70" fill="#3c8a86" stroke="${INK}" stroke-width="5"/><rect x="455" y="195" width="1060" height="720" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>`;
  return { cam, layers: [Lr(0.4, bg), Lr(1, `<rect x="470" y="210" width="1030" height="700" fill="#3a4650"/><rect x="760" y="300" width="420" height="600" rx="30" fill="#4a3434" stroke="${INK}" stroke-width="4"/>` + drv + panel)],
    over: comic(T, 42.36, 'HA HA HA!', 540, 520, { size: 110, life: 1.0, fill: '#ffd23f' }) };
}

// ---------- HUD: wallet note counter (placar) 4 → 3 → 2 → 1 → 0 ----------
const NOTE_DROPS = [29.5, 41.9, 51.05, 83.2];   // baker, driver, lady, the man
function HUD(T) {
  if (T < 19.6 || T > 86.2) return '';
  let n = 4; for (const d of NOTE_DROPS) if (T >= d) n--;
  const last = NOTE_DROPS.filter(d => T >= d).pop();
  const since = last != null ? T - last : 99;
  const app = E.back(clamp((T - 19.6) / 0.3)) * (1 - clamp((T - 85.7) / 0.5));
  const pop = since < 0.6 ? 1 + 0.35 * Math.sin(clamp(since / 0.6) * Math.PI) : 1;
  const col = n <= 1 ? '#ff6a45' : '#ffffff';
  let s = `<g transform="translate(905 214) scale(${f2(app * pop)})" opacity="${f2(app)}">`;
  s += `<rect x="-118" y="-46" width="236" height="92" rx="46" fill="#1e1820" opacity="0.72"/>`;
  s += `<g transform="translate(-58 6) scale(0.42)">${wallet({ s: 1, light: 1 - n / 4 })}</g>`;
  s += `<text x="40" y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="${col}" stroke="#1e1820" stroke-width="10" paint-order="stroke">×${n}</text></g>`;
  if (since < 1.0) { const q = since; s += `<text x="${f2(960)}" y="${f2(300 + q * 70)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="#ff6a45" stroke="#1e1820" stroke-width="10" paint-order="stroke" opacity="${f2(1 - q)}">-1</text>`; }
  return s;
}
