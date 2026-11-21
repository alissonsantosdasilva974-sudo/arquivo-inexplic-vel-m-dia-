// Episode 2 — "Quem devolve a nota vira o cobrador". Vertical 9:16, same engine/look as "Já volto" v5.
const SHOTS = [];
// day plaza for this episode (no time-travel sky)
function plazaSky(T) { return { top: '#f0a868', bot: '#f8dcae', night: 0, sp: 0 }; }
const NIGHT = ['#3a4a8a', 0.42];
const backNight = (t) => [Lr(0.04, sky('#141a3c', '#3a3e70', { stars: 0.9, t, moon: 160, moonX: 1500, id: 'n' })), Lr(0.1, clouds(t * 0.5, '#5a5a8a', 0.5, 7, 60)), Lr(0.3, farTown('#2a2a4a', 720, 5) + haze('#5a6090', 300, 900, 0.5))];
const fog = (t, y = 820, op = 0.55) => `<g opacity="${op}">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${f2(((i * 520 + t * 30) % 4200) - 900)}" cy="${y + (i % 3) * 30}" rx="420" ry="60" fill="#c8cce8" opacity="0.35"/>`).join('')}</g>`;
const nightLamps = (lit = 1) => [ -600, 300, 1150, 2000, 2850 ].map(x => lamp(x, 940, 1.15, lit)).join('');
const backDawn = (t) => [Lr(0.04, sky('#f2b07a', '#fbe4c0', { sun: 360, sunX: 600, sunC: '#fff2d0', id: 'm' })), Lr(0.1, clouds(t, '#fff6ea', 0.85, 3, 60)), Lr(0.3, farTown('#e0b48a', 720, 5) + haze('#f8e6c4', 300, 900, 0.55))];
const backDusk = (t) => [Lr(0.04, sky('#5a3a6a', '#f2a46a', { sun: 640, sunX: 1650, sunC: '#ffd9a0', sunR: 100, id: 'k' })), Lr(0.1, clouds(t, '#f4b8a0', 0.7, 5, 60)), Lr(0.3, farTown('#5a3a5a', 760, 5) + haze('#f2a46a', 400, 900, 0.5))];
const bakerySet = (T, o = {}) => street(900, { walk: '#e6d6b8', road: '#9a96a0' }) + house(440, 900, 420, 450, { wall: '#a8d4e8', roof: '#d0704a', windows: 2, shutters: '#e8865a', flowers: true, seed: 4 }) + house(900, 900, 400, 430, { wall: '#e8a8b8', roof: '#a85a3a', windows: 2, door: true, doorX: 135, seed: 6 }) + bakeryFacade(-200, 900, Object.assign({ t: T, sign: false }, o));
const towerEp2 = (T, cx, k, o = {}) => {
  const run = Math.max(0, T - 56.58);
  const min = 120 + run * 90, hour = 210 + run * 7.5;
  return `<g transform="translate(${cx} 880) scale(${k}) translate(${-cx} -880)">${clockTower(cx, 880, Object.assign({ hour, min }, o))}</g>`;
};
const GLOWN = (T) => 0.6 + 0.4 * Math.sin(T * 5);
function road(t) {
  let s = `<rect x="-1400" y="700" width="4720" height="1200" fill="#c89a5a"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M -1400 ${720 + i * i * 9} H 3300" stroke="#a87a42" stroke-width="${2 + i}" opacity="0.5"/>`;
  s += `<path d="M 900 700 L 1020 700 L 1900 1900 L 20 1900 Z" fill="#8a8690"/><path d="M 960 700 L 960 1900" stroke="#f4efe0" stroke-width="10" stroke-dasharray="40 50" opacity="0.8"/>`;
  for (let i = 0; i < 10; i++) { const q = i / 9, x = lerp(880, -300, q * q), y = lerp(705, 1500, q * q), h = lerp(20, 160, q * q); s += `<rect x="${f2(x)}" y="${f2(y - h)}" width="${f2(4 + q * 12)}" height="${f2(h)}" fill="#6a4a2a"/><rect x="${f2(1920 - x)}" y="${f2(y - h)}" width="${f2(4 + q * 12)}" height="${f2(h)}" fill="#6a4a2a"/>`; }
  return s;
}
const hookNote = (t, T) => {
  const rot = Math.sin(T * 1.3) * 6;
  return { cam: { ...focus(960, 600, 1.0 + 0.04 * Math.sin(T)), r: 0 }, layers: [
    Lr(0.2, `<rect x="-800" y="-800" width="3600" height="3200" fill="#1e2244"/>` + Array.from({ length: 7 }, (_, i) => `<circle cx="${300 + i * 280}" cy="${400 + (i % 3) * 200}" r="${120 + (i % 2) * 60}" fill="#ffd27a" opacity="0.10"/>`).join('')),
    Lr(1, `<g transform="translate(960 600)">${noteNamed('?', GLOWN(T), { s: 3.3, rot, fs: 22 })}</g>` + dust(T, 500, 300, 900, 600, 30, 5, '#ffe7a0'))],
    over: '' };
};

SHOTS.push(
  // 0 — hook: the glowing note ("Nesta cidade,")
  { t0: 0, draw(t, T) { return hookNote(t, T); } },
  // 1 — Polo holds out the note (night)
  { t0: 1.22, draw(t, T) {
    const polo = P_('polo', { x: 560, y: 905, s: 0.66, t: T, face: 0.4, lx: 1, expr: 'neutral', armR: 80, bendR: 10, holdR: noteNamed('', 0, { s: 0.45 }) });
    return { cam: push(focus(600, 905 - 0.66 * 230, 3.0, 940), t, 1.1, 0.06), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 2 — reveal: the man in the suit (low angle)
  { t0: 2.3, draw(t, T) {
    const man = P_('terno', { x: 820, y: 905, s: 0.66, t: T, face: -0.3, lx: -1, expr: 'smug' });
    const c = lerpCam(focus(820, 905 - 0.66 * 1.1 * 120, 2.6, 1100), focus(820, 905 - 0.66 * 1.1 * 300, 2.4, 900), E.inOut(clamp(t / 1.4)));
    return { cam: c, layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + man), Lr(1.2, fog(T))], tint: NIGHT,
      over: comic(T, 2.7, 'COBRADOR!', 540, 520, { size: 100, fill: '#ff7a45', life: 1.1 }) };
  } },
  // 3 — two-shot: Polo extends the R$10 note
  { t0: 3.9, draw(t, T) {
    const ext = E.out(inv(4.1, 4.9, T));
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, expr: 'neutral', armR: lerp(30, 85, ext), bendR: 10, holdR: noteNamed('', 0, { s: 0.4 }) });
    const man = P_('terno', { x: 860, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'neutral' });
    return { cam: push(frameG(710, 905, 2.0, 1430), t, 1.9, 0.06), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 4 — close: the man takes the note
  { t0: 5.8, draw(t, T) {
    const take = E.inOut(inv(6.0, 6.7, T));
    const polo = P_('polo', { x: 600, y: 905, s: 0.62, t: T, face: 0.5, armR: 85, bendR: 10, holdR: take < 0.5 ? noteNamed('', 0, { s: 0.4 }) : '' });
    const man = P_('terno', { x: 820, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', armL: lerp(15, 80, take), bendL: 10, holdL: take >= 0.5 ? noteNamed('', 0, { s: 0.4 }) : '' });
    return { cam: push(focus(720, 905 - 0.62 * 270, 2.7, 960), t, 1.4, 0.05), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man)], tint: NIGHT };
  } },
  // 5 — he takes off his hat
  { t0: 7.2, draw(t, T) {
    const lift = E.back(inv(7.4, 8.1, T));
    const man = P_('terno', { x: 820, y: 905, s: 0.66, t: T, face: -0.2, expr: 'smug', hat: lift > 0.3 ? null : 'fedora', hatLift: lift * 40, armR: lerp(15, 165, lift), bendR: lerp(10, 50, lift), holdR: lift > 0.3 ? fedoraProp(-10) : '' });
    return { cam: push(focus(820, 905 - 0.66 * 1.1 * 300, 2.8, 900), t, 1.4, 0.05), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + man), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 6 — he hands Polo the hat and the wallet
  { t0: 8.6, draw(t, T) {
    const give = E.inOut(inv(8.9, 10.0, T));
    const man = P_('terno', { x: 820, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', hat: null, armL: lerp(20, 80, give), bendL: 10, armR: lerp(20, 70, give), bendR: 40, holdL: give < 0.8 ? fedoraProp(0) : '', holdR: give < 0.8 ? wallet({ s: 0.3 }) : '' });
    const polo = P_('polo', { x: 590, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, expr: give > 0.6 ? 'surprised' : 'neutral', armR: give >= 0.8 ? 75 : 20, bendR: 20, armL: give >= 0.8 ? 60 : 12, bendL: 40, holdR: give >= 0.8 ? fedoraProp(10) : '', holdL: give >= 0.8 ? wallet({ s: 0.3 }) : '' });
    return { cam: push(frameG(705, 905, 2.0, 1430), t, 1.7, 0.06), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 7 — close: Polo, astonished, with the hat and the wallet
  { t0: 10.3, draw(t, T) {
    const polo = P_('polo', { x: 600, y: 905, s: 0.62, t: T, face: 0.2, expr: 'surprised', armR: 75, bendR: 20, armL: 60, bendL: 40, holdR: fedoraProp(10), holdL: wallet({ s: 0.3 }) });
    return { cam: push(focus(600, 905 - 0.62 * 250, 3.2, 950), t, 1.4, 0.07), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + emote('excl', 600, 905 - 0.62 * 440, T - 10.45, 0.9))], tint: NIGHT };
  } },
  // 8 — the man walks away slowly down the dark street
  { t0: 11.7, draw(t, T) {
    const mx = 900 + t * 70;
    const man = P_('terno', { x: mx, y: 905, s: 0.62, t: T, face: 0.8, side: true, walk: T * 5, expr: 'neutral', hat: null });
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: 0.6, lx: 1, expr: 'worried', armR: 60, bendR: 30, holdR: fedoraProp(10), holdL: wallet({ s: 0.3 }), armL: 40, bendL: 50 });
    return { cam: frameG(lerp(700, 950, E.inOut(clamp(t / 2.9))), 905, 1.35, 1450), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man), Lr(1.2, fog(T, 840, 0.75))], tint: NIGHT };
  } },
  // 9 — Polo puts the hat on
  { t0: 14.6, draw(t, T) {
    const on = E.out(inv(15.4, 16.1, T));
    const polo = P_('polo', { x: 600, y: 905, s: 0.62, t: T, face: 0.1, expr: on > 0.9 ? 'smug' : 'neutral', hat: on > 0.15 ? 'fedora' : null, hatLift: (1 - on) * 70, armR: on > 0.15 ? lerp(170, 30, inv(16.0, 16.5, T)) : lerp(60, 170, inv(15.0, 15.4, T)), bendR: 30, holdR: on <= 0.15 ? fedoraProp(0) : '', armL: 30, bendL: 50, holdL: wallet({ s: 0.3 }) });
    return { cam: push(focus(600, 905 - 0.62 * 280, 3.0, 940), t, 2.4, 0.06), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + emote('sparkle', 600, 905 - 0.62 * 470, T - 16.1, 0.9))], tint: NIGHT };
  } },
  // 10 — insert: the wallet opens, notes fan out
  { t0: 17.0, draw(t, T) {
    const op = E.back(inv(17.3, 18.2, T));
    return { cam: push(focus(960, 600, 1.4), t, 2.5, 0.06), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#2a2a4a"/><circle cx="960" cy="560" r="420" fill="#ffd27a" opacity="0.12"/>`),
      Lr(1, `<g transform="translate(960 700)">${wallet({ s: 2.4, open: op, n: 5, labels: ['', '', '', '', ''], glow: 0 })}</g>`)] };
  } },
  // 11 — macro: names glowing in the corner
  { t0: 19.5, draw(t, T) {
    const g = E.out(inv(19.6, 20.2, T)) * GLOWN(T);
    return { cam: push(focus(960, 560, 1.25), t, 1.9, 0.08), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#262646"/>`),
      Lr(1, `<g transform="translate(960 700)">${wallet({ s: 2.4, open: 1, n: 5, labels: ['PADEIRO', 'MOTORISTA', 'SENHORA', '•••', '•••'], glow: g })}</g>` + dust(T, 500, 300, 900, 600, 26, 8, '#ffe7a0'))],
      over: emote('sparkle', 0, 0, -1) };
  } },
  // 12 — the first note: "PADEIRO"
  { t0: 21.4, draw(t, T) {
    return { cam: push(focus(960, 600, 1.0), t, 2.2, 0.08), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#262646"/>`),
      Lr(1, `<g transform="translate(960 620)">${noteNamed('PADEIRO', GLOWN(T), { s: 3.4, rot: -4, fs: 15 })}</g>` + dust(T, 500, 300, 900, 600, 22, 9, '#ffe7a0'))] };
  } },
  // 13 — morning: Polo knocks at the bakery
  { t0: 23.6, xf: 0.35, draw(t, T) {
    const knock = (T > 24.8 && T < 25.5) ? Math.abs(Math.sin((T - 24.8) * 18)) : 0;
    const polo = P_('polo', { x: 520, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral', armL: 70 + knock * 25, bendL: 70, armR: 20 });
    return { cam: push(frameG(400, 905, 2.0, 1430), t, 2.2, 0.06), layers: [...backDawn(t), Lr(1, bakerySet(T, {  }) + polo)],
      over: comic(T, 24.82, 'TOC TOC!', 540, 560, { size: 100, life: 0.9 }) };
  } },
  // 14 — the baker opens the door and goes pale
  { t0: 25.8, draw(t, T) {
    const open = E.out(inv(26.1, 26.6, T)), pale = E.inOut(inv(27.0, 27.6, T));
    const bak = P_('padeiro2', { x: 300, y: 900, s: 0.62, t: T, face: 0.5, lx: 1, expr: pale > 0.3 ? 'surprised' : 'neutral', pale, armL: 10, armR: 30 });
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral' });
    return { cam: push(frameG(420, 905, 2.0, 1430), t, 2.6, 0.06), layers: [...backDawn(t), Lr(1, bakerySet(T, { open }) + (open > 0.3 ? bak : '') + polo + emote('sweat', 340, 900 - 0.62 * 400, T - 27.3, 0.8))] };
  } },
  // 15 — close: Polo hands over the note
  { t0: 28.4, draw(t, T) {
    const give = E.inOut(inv(28.8, 29.6, T));
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: -0.6, hat: 'fedora', armL: lerp(20, 80, give), bendL: 10, holdL: noteNamed('PADEIRO', 0.7, { s: 0.42 }) });
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.5, lx: 1, expr: 'surprised', pale: 1 });
    return { cam: push(focus(445, 900 - 0.62 * 200, 3.4, 960), t, 1.5, 0.05), layers: [...backDawn(t), Lr(1, bakerySet(T, { open: 1 }) + bak + polo)] };
  } },
  // 16 — the baker cries with relief
  { t0: 29.9, draw(t, T) {
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.2, expr: 'joy', mouth: 0.7, tears: 1, pale: 1 - E.inOut(inv(30.1, 31.0, T)), armL: 60, bendL: 90, armR: 70, bendR: 80, holdR: noteNamed('PADEIRO', 0.5, { s: 0.42 }) });
    return { cam: push(focus(330, 900 - 0.62 * 290, 3.2, 920), t, 2.2, 0.07), layers: [...backDawn(t), Lr(1, bakerySet(T, { open: 1 }) + bak)] };
  } },
  // 17 — "faz trinta anos que eu tento ir embora!"
  { t0: 32.1, draw(t, T) {
    const bak = P_('padeiro2', { x: 330, y: 900, s: 0.62, t: T, face: 0.3, expr: 'happy', mouth: talk(T, [[32.36, 32.7], [33.18, 35.2]]), armL: 40 + Math.sin(T * 6) * 30, bendL: 60, armR: 130 + Math.sin(T * 5) * 20, bendR: 40, handR: 'open' });
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', expr: 'neutral' });
    return { cam: push(frameG(440, 905, 2.1, 1430), t, 3.4, 0.06), layers: [...backDawn(t), Lr(1, bakerySet(T, { open: 1 }) + bak + polo)],
      over: comic(T, 33.4, '30 ANOS!', 540, 520, { size: 110, life: 1.4, fill: '#ffd23f' }) };
  } },
  // 18 — he grabs his suitcase and runs off, happy
  { t0: 35.5, draw(t, T) {
    const run = T > 36.4;
    const bx = run ? lerp(330, 1500, E.in(inv(36.4, 38.6, T))) : 330;
    const bak = run ? P_('padeiro2', { x: bx, y: 900, s: 0.62, t: T, face: 0.8, side: true, run: true, walk: T * 16, expr: 'joy', holdR: suitcase({ s: 0.32 }) })
      : P_('padeiro2', { x: bx, y: 900, s: 0.62, t: T, face: 0.3, expr: 'joy', armR: 30, bendR: 20, holdR: suitcase({ s: 0.32 }) });
    const polo = P_('polo', { x: 560, y: 905, s: 0.62, t: T, face: 0.4, lx: 1, hat: 'fedora', expr: 'surprised' });
    return { cam: frameG(lerp(440, 760, E.inOut(inv(36.4, 38.6, T))), 905, 1.8, 1440), layers: [...backDawn(t), Lr(1, bakerySet(T, { open: 1 }) + pigeon(700, 934, t, 3, 0.9, 36.6) + pigeon(900, 934, t, 4, 0.9, 36.6) + polo + bak + emote('heart', bx, 900 - 0.62 * 430, (t % 1.2), 0.8))] };
  } },
  // 19 — Polo walks to the bus stop
  { t0: 38.6, xf: 0.3, draw(t, T) {
    const px = 60 + t * 110;
    const polo = P_('polo', { x: px, y: 930, s: 0.62, t: T, face: 0.8, side: true, walk: T * 11, hat: 'fedora', expr: 'neutral' });
    return { cam: push(frameG(px + 60, 930, 2.0, 1420), t, 2.2, 0.05), layers: [...backC(t), Lr(1, streetC(t) + polo)] };
  } },
  // 20 — the driver takes the note and laughs out loud
  { t0: 40.8, draw(t, T) { return driverEp2(t, T, push(focus(985, 1100 - 1.55 * 1.05 * 330, 2.0), t, 2.4, 0.06)); } },
  // 21 — he lets go of the wheel, opens the door and walks away
  { t0: 43.2, draw(t, T) {
    const bx = 200;
    const out = T > 44.9;
    const dx = out ? lerp(bx + 760, bx + 1300, inv(45.0, 46.5, T)) : bx + 760;
    const drv = out ? P_('motorista', { x: dx, y: 1000, s: 0.62, t: T, face: 0.8, side: true, walk: T * 10, expr: 'happy' }) : '';
    const inDrv = out ? '' : P_('motorista', { t: T, face: 0.6, expr: 'laugh', mouth: 0.7, shadow: false, armL: 150, bendL: 30 });
    return { cam: push(frameG(bx + 640, 1000, 1.45, 1440), t, 3.3, 0.05), layers: [...backC(t), Lr(1, streetC(t, 880) + bus(bx, 1000, { t: T * 0, wheel: 0, passengers: [P_('viz2', { t: T, face: 0.3, shadow: false }), P_('senhora', { t: T, face: -0.3, shadow: false }), P_('viz1', { t: T, face: 0.3, shadow: false }), P_('moca', { t: T, face: 0.4, shadow: false }), ''], driver: inDrv, pT: 'translate(55 178) scale(0.36)', dT: 'translate(66 178) scale(0.36)' }) + drv)],
      over: comic(T, 43.6, 'TCHAU!', 540, 520, { size: 100, life: 1.0, fill: '#ffffff' }) };
  } },
  // 22 — the bus drives on by itself, full of people
  { t0: 46.5, draw(t, T) {
    const bx = kf(T, [[46.5, -300], [49.7, 1200]], E.in);
    const pass = ['viz2', 'senhora', 'viz1', 'moca', 'mulher'].map((id, i) => P_(id, { t: T, face: (i % 2 ? -0.3 : 0.3), expr: 'surprised', mouth: 0.8, shadow: false, armL: 160, armR: 160 }));
    return { cam: frameG(bx + 420, 1000, 1.4, 1440), layers: [...backC(t), Lr(1, streetC(t, 880) + bus(bx, 1000, { t: T, wheel: T * 400, passengers: pass, driver: '', pT: 'translate(55 178) scale(0.36)' }) + speedLines(bx - 40, 820, 6, 120, 0, 0.6, Math.floor(T * 8)))],
      over: comic(T, 47.2, 'SOCORRO!', 540, 520, { size: 100, life: 1.6, fill: '#ff7a45' }) };
  } },
  // 23 — the square: the lady (and her dog) gets hers
  { t0: 49.7, xf: 0.3, draw(t, T) {
    const give = E.inOut(inv(50.6, 51.4, T));
    const polo = P_('polo', { x: 1240, y: 1000, s: 0.62, t: T, face: -0.6, lx: -1, hat: 'fedora', armL: lerp(20, 80, give), bendL: 10, holdL: give < 0.9 ? noteNamed('SENHORA', 0.6, { s: 0.42 }) : '' });
    const lady = P_('senhora', { x: 1000, y: 1000, s: 0.62, t: T, face: 0.5, lx: 1, expr: give > 0.9 ? 'happy' : 'neutral', armR: lerp(20, 70, give), bendR: 20, holdR: give >= 0.9 ? noteNamed('SENHORA', 0.6, { s: 0.42 }) : '' });
    return { cam: push(frameG(1110, 1000, 1.9, 1430), t, 2.4, 0.06), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + towerEp2(T, 1120, 0.6)), Lr(1, lady + dog(860, 1000, { t: T, growl: 1, s: 0.5 }) + polo)] };
  } },
  // 24 — the dog stops growling and wags its tail
  { t0: 52.1, draw(t, T) {
    const calm = E.inOut(inv(53.2, 53.8, T));
    return { cam: push(focus(870, 950, 4.0), t, 2.9, 0.06), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + dog(860, 1000, { t: T, growl: 1 - calm, wag: calm, s: 0.62 }) + emote('heart', 900, 920, T - 54.0, 0.6) + emote('vein', 900, 925, T < 53.2 ? T - 52.2 : -1, 0.45))],
      over: comic(T, 52.6, 'GRRR...', 540, 560, { size: 90, life: 0.9, fill: '#ffffff' }) };
  } },
  // 25 — even the tower clock starts moving again
  { t0: 55.0, draw(t, T) {
    const c = push(focus(1120, 880 - 720 * 0.6, 1.9), t, 2.8, 0.08);
    return { cam: c, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + towerEp2(T, 1120, 0.6, { glow: pulse(T, 56.7, 0.5) }) + pigeon(1000, 980, t, 3, 0.6, 56.6) + pigeon(1250, 985, t, 4, 0.6, 56.6))],
      over: comic(T, 56.6, 'TIC TAC!', 540, 560, { size: 110, life: 1.2 }) };
  } },
  // 26 — but then Polo looks at the wallet
  { t0: 57.8, draw(t, T) {
    const polo = P_('polo', { x: 600, y: 1000, s: 0.62, t: T, face: 0.2, ly: 0.8, hat: 'fedora', expr: T > 59.5 ? 'worried' : 'neutral', armL: 55, bendL: 70, holdL: wallet({ s: 0.32, light: 0.3 }) });
    return { cam: push(focus(600, 1000 - 0.62 * 240, 3.0, 960), t, 2.7, 0.06), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + polo)] };
  } },
  // 27 — it was getting light. Very light.
  { t0: 60.5, draw(t, T) {
    const lt = E.inOut(inv(60.8, 62.6, T)), fl = Math.sin(T * 3) * 30 * lt;
    return { cam: push(focus(960, 600, 1.3), t, 2.9, 0.06), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#f0d4a0"/><rect x="-800" y="-800" width="3600" height="3200" fill="url(#pPlaster)"/>`),
      Lr(1, `<g transform="translate(960 ${f2(700 - lt * 120 + fl * 0.3)}) rotate(${f2(fl * 0.3)})">${wallet({ s: 2.6, light: lt })}</g>` + Array.from({ length: 4 }, (_, i) => { const ph = ((T * 0.6 + i / 4) % 1) * lt; return `<path d="M ${880 + i * 50} ${f2(860 - ph * 260)} q 10 10 0 20 q -10 10 0 20" stroke="#ffffff" stroke-width="5" fill="none" opacity="${f2(lt * (1 - ph))}"/>`; }).join(''))],
      over: comic(T, 62.3, 'LEVE...', 540, 520, { size: 100, life: 1.0, fill: '#ffffff' }) };
  } },
  // 28 — only one note left
  { t0: 63.4, draw(t, T) {
    return { cam: push(focus(960, 620, 1.3), t, 2.1, 0.06), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#262646"/>`), Lr(1, `<g transform="translate(960 720)">${wallet({ s: 2.6, open: E.back(inv(63.6, 64.4, T)), n: 1, labels: [''], light: 1 })}</g>`)] };
  } },
  // 29 — it didn't have anybody from town's name
  { t0: 65.5, draw(t, T) {
    const polo = P_('polo', { x: 600, y: 1000, s: 0.62, t: T, face: 0.2, ly: 0.6, hat: 'fedora', expr: 'worried', armL: 60, bendL: 60, holdL: noteNamed('', 0.3, { s: 0.45 }) });
    return { cam: push(focus(600, 1000 - 0.62 * 250, 3.0, 960), t, 2.7, 0.06), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + polo + emote('q', 640, 1000 - 0.62 * 470, T - 66.2, 0.9))] };
  } },
  // 30 — it had the suited man's name!
  { t0: 68.2, draw(t, T) {
    const rv = E.out(inv(68.5, 69.6, T));
    return { cam: push(focus(960, 600, 1.0), t, 2.6, 0.12), layers: [Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="#1c1c38"/>`), Lr(1, `<g transform="translate(960 620)">${noteNamed('@hat', rv * GLOWN(T) + 0.2, { s: 3.4, rot: -3 })}</g>` + dust(T, 500, 300, 900, 600, 24, 3, '#ffe7a0'))],
      over: comic(T, 69.6, '!!!', 540, 1000, { size: 140, life: 1.1, fill: '#ff7a45' }) };
  } },
  // 31 — Polo runs after him down the empty street
  { t0: 70.8, xf: 0.25, draw(t, T) {
    const px = 300 + t * 300;
    const polo = P_('polo', { x: px, y: 905, s: 0.62, t: T, face: 0.8, side: true, run: true, walk: T * 16, hat: 'fedora', expr: 'worried' });
    return { cam: frameG(px + 80, 905, 1.9, 1430), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + emote('sweat', px - 40, 905 - 0.62 * 400, t % 1.1, 0.8)), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 32 — the man waits, standing on the corner
  { t0: 73.4, draw(t, T) {
    const man = P_('terno', { x: 2000, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', hat: null });
    return { cam: push(frameG(2000, 905, 1.9, 1430), t, 2.6, 0.08), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + man + `<ellipse cx="2000" cy="905" rx="150" ry="40" fill="#ffe7a0" opacity="0.18"/>`), Lr(1.2, fog(T, 840, 0.8))], tint: NIGHT };
  } },
  // 33 — Polo holds out the last note
  { t0: 76.0, draw(t, T) {
    const ext = E.out(inv(76.3, 77.0, T));
    const polo = P_('polo', { x: 1780, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, hat: 'fedora', expr: 'worried', armR: lerp(30, 85, ext), bendR: 10, holdR: noteNamed('@hat', 0.8, { s: 0.42 }) });
    const man = P_('terno', { x: 2000, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', hat: null });
    return { cam: push(focus(1890, 905 - 0.62 * 200, 3.0, 960), t, 2.1, 0.05), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 34 — he smiles: "esperei muito tempo por você."
  { t0: 78.1, draw(t, T) {
    const man = P_('terno', { x: 2000, y: 905, s: 0.62, t: T, face: -0.2, expr: 'smug', hat: null, mouth: talk(T, [[79.92, 81.32]]) * 0.6 });
    return { cam: push(focus(2000, 905 - 0.62 * 1.1 * 310, 3.4, 920), t, 4.0, 0.1), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + man), Lr(1.2, fog(T, 840, 0.6))], tint: NIGHT };
  } },
  // 35 — he takes the note and vanishes for good
  { t0: 82.1, draw(t, T) {
    const take = E.inOut(inv(82.5, 83.2, T)), fade = 1 - E.inOut(inv(84.0, 84.8, T));
    const man = P_('terno', { x: 2000, y: 905, s: 0.62, t: T, face: -0.4, expr: 'smug', hat: null, armL: lerp(15, 80, take), bendL: 10, holdL: take > 0.5 ? noteNamed('@hat', 0.8, { s: 0.42 }) : '', fade });
    const polo = P_('polo', { x: 1780, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, hat: 'fedora', expr: fade < 0.6 ? 'surprised' : 'worried', armR: take < 0.5 ? 85 : 20, bendR: 10, holdR: take < 0.5 ? noteNamed('@hat', 0.8, { s: 0.42 }) : '' });
    const sparks = fade < 1 ? Array.from({ length: 16 }, (_, i) => { const q = 1 - fade, a = i * 0.9; return `<circle cx="${f2(2000 + Math.cos(a) * 120 * q)}" cy="${f2(780 - Math.sin(a) * 140 * q - q * 60)}" r="${f2(5 * (1 - q) + 1)}" fill="#ffe7a0" opacity="${f2(1 - q)}"/>`; }).join('') : '';
    return { cam: push(frameG(1890, 905, 2.0, 1430), t, 3.0, 0.06), layers: [...backNight(t), Lr(1, streetARow(T, { pigeons: false }) + nightLamps() + polo + man + sparks), Lr(1.2, fog(T))], tint: NIGHT };
  } },
  // 36 — Polo alone, wearing the hat, in an empty town
  { t0: 85.1, xf: 0.4, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.1, hat: 'fedora', expr: 'sad' });
    const c = lerpCam(frameG(760, 905, 2.2, 1430), frameG(760, 905, 1.1, 1500), E.inOut(clamp(t / 3.9)));
    return { cam: c, layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + leaves(-600, 2600, 935, 7, 60) + polo)], tint: ['#a07ab0', 0.15] };
  } },
  // 37 — then he hears footsteps on the road
  { t0: 89.0, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: T > 89.6 ? -0.7 : 0.1, lx: T > 89.6 ? -1 : 0, hat: 'fedora', expr: T > 89.6 ? 'surprised' : 'sad', turn: pulse(T, 89.6, 0.1) });
    return { cam: push(focus(760, 905 - 0.62 * 270, 2.8, 940), t, 2.3, 0.06), layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + polo + emote('excl', 760, 905 - 0.62 * 470, T - 89.7, 0.9))], tint: ['#a07ab0', 0.15],
      over: comic(T, 89.75, 'TAP... TAP...', 540, 540, { size: 90, life: 1.5, fill: '#ffffff' }) };
  } },
  // 38 — someone is coming along the road
  { t0: 91.3, draw(t, T) {
    const q = E.inOut(clamp(t / 1.7));
    const fig = P_('vulto', { x: 960, y: lerp(760, 900, q), s: lerp(0.18, 0.4, q), t: T, face: 0, walk: T * 7, expr: 'neutral' });
    return { cam: focus(960, 720, 1.2), layers: [...backDusk(t), Lr(1, road(t) + fig)], tint: ['#a07ab0', 0.12] };
  } },
  // 39 — close: a R$10 note, folded in the pocket
  { t0: 93.0, draw(t, T) {
    const fig = P_('vulto', { x: 960, y: 1080, s: 1.4, t: T, face: 0, expr: 'neutral', armL: 10, armR: 10 });
    const fold = `<g transform="translate(990 ${1080 - 1.4 * 190})" opacity="0.95"><g transform="rotate(-12) scale(0.55)">${noteNamed('', GLOWN(T), { s: 1 })}</g></g>`;
    return { cam: push(focus(990, 1080 - 1.4 * 180, 2.4), t, 1.8, 0.08), layers: [...backDusk(t), Lr(1, road(t) + fig + fold)], tint: ['#a07ab0', 0.12] };
  } },
  // 40 — Polo tightens his hat and smiles
  { t0: 94.8, draw(t, T) {
    const adj = (T > 95.4 && T < 96.4) ? 1 : 0;
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.05, hat: 'fedora', hatLift: adj ? Math.abs(Math.sin((T - 95.4) * 6)) * 6 : 0, expr: T > 96.4 ? 'smug' : 'neutral', wink: true, armR: adj ? 165 : 20, bendR: 40 });
    return { cam: push(focus(760, 905 - 0.62 * 300, 3.4, 920), t, 2.8, 0.08), layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + polo + emote('sparkle', 760, 905 - 0.62 * 480, T - 96.6, 0.9))], tint: ['#a07ab0', 0.15] };
  } },
  // 41 — "Você cobrava a nota ou avisava a verdade?"
  { t0: 97.6, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.0, hat: 'fedora', expr: T < 99.0 ? 'smug' : 'neutral', armR: 80, bendR: 20, holdR: noteNamed('', 0.6, { s: 0.42 }), armL: T > 99.2 ? 100 : 20, bendL: 40, handL: T > 99.2 ? 'open' : null });
    return { cam: push(frameG(760, 905, 2.1, 1400), t, 3.1, 0.07), layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + polo + emote('q', 820, 905 - 0.62 * 470, T - 99.0, 0.9))], tint: ['#a07ab0', 0.15] };
  } },
  // 42 — "Comenta COBRA ou AVISA."
  { t0: 100.7, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: T < 101.6 ? -0.4 : 0.4, lx: T < 101.6 ? -1 : 1, hat: 'fedora', expr: 'happy', armL: T < 101.6 ? 110 : 20, armR: T >= 101.6 ? 110 : 20, bendL: 0, bendR: 0, handL: 'point', handR: 'point' });
    return { cam: push(frameG(760, 905, 2.0, 1400), t, 2.1, 0.06), layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + polo)], tint: ['#a07ab0', 0.15],
      over: comic(T, 101.3, 'COBRA', 300, 560, { size: 110, life: 1.6, fill: '#ff7a45', rot: -8 }) + comic(T, 101.85, 'AVISA', 780, 620, { size: 110, life: 1.2, fill: '#7ac0ff', rot: 8 }) };
  } },
  // 43 — "Você decide a parte 3."
  { t0: 102.8, draw(t, T) {
    const polo = P_('polo', { x: 760, y: 905, s: 0.62, t: T, face: 0.0, hat: 'fedora', expr: 'smug', wink: true, armR: 62, bendR: -18, handR: 'point', ly: 0.8 });
    const arrow = `<g transform="translate(540 ${f2(1450 + Math.sin(T * 10) * 16)})" opacity="${f2(clamp((T - 103.1) / 0.15))}"><path d="M -34 -40 L 34 -40 L 34 0 L 70 0 L 0 70 L -70 0 L -34 0 Z" fill="#ffd23f" stroke="#211c26" stroke-width="10" stroke-linejoin="round"/></g>`;
    return { cam: push(focus(760, 905 - 0.62 * 280, 2.8, 940), t, 1.7, 0.08), layers: [...backDusk(t), Lr(1, streetARow(T, { pigeons: false }) + polo)], tint: ['#a07ab0', 0.15],
      over: comic(T, 103.3, 'PARTE 3?', 540, 540, { size: 120, life: 1.4, fill: '#ffd23f' }) + arrow };
  } },
  // 44 — "E lembra:" → loops back into the glowing note
  { t0: 104.55, draw(t, T) { return hookNote(0, T - 105.2); } },
);

function driverEp2(t, T, cam) {
  const scroll = 0;
  let bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#c4d8de"/>`;
  for (let i = 0; i < 8; i++) { const x = i * 420 - 600; bg += `<rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="${['#aec4d0', '#e8d8c0', '#d0c8e0'][i % 3]}"/><rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="url(#pPlaster)"/>`; }
  const take = E.inOut(inv(41.4, 41.9, T));
  const laugh = T > 42.3;
  const drv = P_('motorista', { x: 985, y: 1100, s: 1.55, t: T, face: -0.3, expr: laugh ? 'laugh' : 'neutral', mouth: laugh ? 0.8 : 0, armL: lerp(12, 80, take), bendL: 30, holdL: take > 0.4 ? noteNamed('MOTORISTA', 0.6, { s: 0.42 }) : '', shadow: false, tilt: laugh ? Math.sin(T * 14) * 3 : 0 });
  const panel = `<path fill-rule="evenodd" d="M -400 -600 H 2400 V 1800 H -400 Z M 470 210 H 1450 Q 1500 210 1500 260 V 900 H 470 Z" fill="#f2c230" stroke="${INK}" stroke-width="6"/><rect x="-400" y="960" width="2800" height="70" fill="#3c8a86" stroke="${INK}" stroke-width="5"/><rect x="455" y="195" width="1060" height="720" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>`;
  return { cam, layers: [Lr(0.4, bg), Lr(1, `<rect x="470" y="210" width="1030" height="700" fill="#3a4650"/><rect x="760" y="300" width="420" height="600" rx="30" fill="#4a3434" stroke="${INK}" stroke-width="4"/>` + drv + panel)],
    over: comic(T, 42.36, 'HA HA HA!', 540, 520, { size: 110, life: 1.0, fill: '#ffd23f' }) };
}
