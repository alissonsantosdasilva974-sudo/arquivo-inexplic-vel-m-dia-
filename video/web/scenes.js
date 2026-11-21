// Shot definitions. Each draw(t, T) returns { cam:{x,y,z,r}, layers:[{d,svg}], over? }.
// t = seconds since shot start, T = absolute seconds (used for word-synced events).
const Lr = (d, svg) => ({ d, svg });
const talk = (T, iv) => { for (const [a, b] of iv) if (T >= a && T <= b) return 0.25 + 0.55 * Math.abs(Math.sin((T - a) * 17)); return 0; };
const wave = (T, a, b, base = 150, amp = 18) => (T >= a && T <= b) ? base + Math.sin((T - a) * 14) * amp * Math.min(1, (T - a) * 4, (b - T) * 4) : null;

// ---------- global clock / time-of-day for the plaza (continuity across shots 11-21) ----------
const SPIN_A = 64.94, SPIN_B = 68.3;
function hoursAt(T) {
  let H = 48 + 0; // 2 days + 9h after Polo left at 9h (H measured from that moment, +9 for clock face)
  H += ramp(T, 46.88, 47.2, 0, 5 / 60, E.back);
  H += ramp(T, 52.82, 53.5, 0, 2, E.back);
  H += ramp(T, 56.76, 57.75, 0, 24, E.inOut);
  for (const c of [59.88, 60.40, 60.94]) H += ramp(T, c, c + 0.3, 0, 3, E.back);
  const before = 48 + 5 / 60 + 2 + 24 + 9;
  const target = 9 * 24 + 1; // 9 days passed, clock reads 10h
  H += ramp(T, SPIN_A, SPIN_B, 0, target - before, t => t < 0.85 ? Math.pow(t / 0.85, 2.2) * 0.97 : 0.97 + 0.03 * E.back((t - 0.85) / 0.15));
  return H;
}
function clockAngles(T) {
  const H = hoursAt(T) + 9; // wall time
  // tiny "trying to move" jitter before the first jump
  const jit = (T > 45.3 && T < 46.85) ? Math.sin(T * 60) * 1.6 * pulse(T, 46.1, 0.8) : 0;
  return { hour: (H % 12) * 30, min: (H % 1) * 360 + jit, days: Math.floor(hoursAt(T) / 24), H };
}
function spinSpeed(T) { // hours per second, approx
  return Math.abs(hoursAt(T + 0.02) - hoursAt(T - 0.02)) / 0.04;
}
function plazaSky(T) {
  const { H } = clockAngles(T);
  const tod = ((H % 24) + 24) % 24;
  let night = tod < 5 ? 1 : tod < 7 ? 1 - (tod - 5) / 2 : tod < 17 ? 0 : tod < 20 ? (tod - 17) / 3 : 1;
  let dusk = pulse(tod, 18.5, 2) + pulse(tod, 6, 1.2) * 0.6;
  // photosensitivity safety: when time races, flatten toward a mid tone instead of flashing
  const sp = clamp(spinSpeed(T) / 20);
  night = lerp(night, 0.45, sp); dusk = lerp(dusk, 0.3, sp);
  const top = mix(mix('#e8b46a', '#151a36', night), '#b85a6a', dusk * 0.6);
  const bot = mix(mix('#f7e3b5', '#3a3a6a', night), '#f2a46a', dusk * 0.6);
  return { top, bot, night, sp, tod };
}

// ---------- shared environment builders ----------
function streetARow(t, o = {}) {
  const base = 900;
  let s = '';
  s += house(-1150, base, 380, 420, { wall: '#d9b98a', roof: '#a44e2c', windows: 2, shutters: '#7a8a4a', seed: 1 });
  s += house(-720, base, 420, 470, { wall: '#e6c48e', roof: '#c8643c', windows: 2, door: true, doorX: 30, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.7 + 1) * 3, flowers: true, shutters: '#3c5a4a', seed: 2 });
  s += house(-250, base, 380, 430, { wall: '#cfa982', roof: '#8a3a22', windows: 1, door: true, doorX: 220, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.5 + 2) * 3, seed: 3, cat: true, t });
  s += bakeryFacade(180, base, { t, sign: false, open: o.bakeryOpen || 0 });
  s += house(860, base, 420, 450, { wall: '#e9d3a8', roof: '#c8643c', windows: 2, shutters: '#a44e2c', flowers: true, seed: 4 });
  s += house(1320, base, 380, 440, { wall: '#c9b48e', roof: '#7a4a30', windows: 1, door: true, doorX: 160, sign: 'JÁ VOLTO', signAng: o.oldAng != null ? o.oldAng : Math.sin(t * 1.3) * 3, dust: 0.35, web: true, seed: 5, doorC: '#5a4a3a' });
  // newspapers piled at the forgotten door
  for (let i = 0; i < 7; i++) s += `<g transform="translate(${1500 + (i % 4) * 26 - 10} ${base + 4 - Math.floor(i / 4) * 16}) rotate(${(i * 37) % 30 - 15})"><rect x="-26" y="-9" width="52" height="18" rx="9" fill="#efe8d8" stroke="${INK}" stroke-width="3"/><path d="M -14 -9 v 18 M 10 -9 v 18" stroke="#b6a58a" stroke-width="3"/></g>`;
  s += house(1760, base, 440, 480, { wall: '#e6c48e', roof: '#a44e2c', windows: 2, door: true, doorX: 155, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.6 + 3) * 3, shutters: '#3c5a4a', seed: 6 });
  s += house(2260, base, 400, 430, { wall: '#d9b98a', roof: '#c8643c', windows: 2, door: true, doorX: 135, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.4 + 4) * 3, flowers: true, seed: 7 });
  s += house(2720, base, 420, 460, { wall: '#e9d3a8', roof: '#8a3a22', windows: 2, seed: 8 });
  return s + street(base);
}
function backA(t, sk) {
  return [
    Lr(0.04, sky(sk[0], sk[1], { sun: 220, sunX: 1450, id: 'a' })),
    Lr(0.1, clouds(t)),
    Lr(0.22, hills('#c9a56a', '#b8955a', 780)),
    Lr(0.4, farTown('#c89a6a', 760, 5) + haze('#f7e3b5', 400, 900, 0.6)),
  ];
}

function streetC(t, base = 880) {
  let s = '';
  const r = rng(21);
  let x = -1400;
  while (x < 3600) {
    const w = 300 + r() * 160, h = 380 + r() * 220;
    s += house(x, base, w, h, { wall: mix('#b8c4c8', '#d9d0bc', r()), roof: mix('#4f6a7a', '#7a5a5a', r()), windows: 2, flat: r() < 0.5, glass: '#5a7a8e', shutters: r() < 0.4 ? '#4f6a7a' : null, seed: (x | 0) });
    x += w + 40 + r() * 40;
  }
  s += street(base, { walk: '#c4c0b2', road: '#7f7f80' });
  // lane markings
  for (let i = -20; i < 40; i++) s += `<rect x="${i * 220}" y="${base + 250}" width="120" height="14" rx="6" fill="#efe8d8" opacity="0.7"/>`;
  return s;
}
function backC(t) {
  return [
    Lr(0.04, sky('#8fb4c8', '#e6eee8', { sun: 180, sunX: 400, sunC: '#fff8e0', sunR: 70, id: 'c' })),
    Lr(0.1, clouds(t, '#ffffff', 0.7, 9, 90)),
    Lr(0.3, farTown('#9fb2bc', 700, 8) + haze('#e6eee8', 300, 900, 0.6)),
  ];
}

function plazaBack(T, t) {
  const S = plazaSky(T);
  return [
    Lr(0.04, sky(S.top, S.bot, { id: 'p', stars: S.night, t, moon: S.night > 0.3 ? 200 : null, moonX: 500, sun: S.night < 0.6 ? 200 + S.night * 300 : null, sunX: 1550 })),
    Lr(0.1, clouds(t, mix('#fff6e2', '#4a4a7a', S.night), 0.75, 13)),
    Lr(0.3, farTown(mix('#c89a6a', '#2a2a4a', S.night), 720, 3) + haze(mix('#f7e3b5', '#3a3a6a', S.night), 300, 900, 0.55)),
  ];
}
function plazaMid(T, t, o = {}) {
  const S = plazaSky(T);
  const lit = S.night;
  let s = '';
  const r = rng(31); let x = -1500;
  while (x < 3400) {
    const w = 330 + r() * 120, h = 360 + r() * 160;
    s += house(x, 760, w, h, { wall: mix('#e6c48e', '#d9b98a', r()), roof: r() < 0.5 ? '#c8643c' : '#a44e2c', windows: 2, shutters: r() < 0.5 ? '#3c5a4a' : '#7a8a4a', lit, seed: (x | 0) + 7 });
    x += w + 30;
  }
  s += `<rect x="-1500" y="760" width="4900" height="30" fill="#b6a58a" stroke="${INK}" stroke-width="3"/>`;
  for (const tx of [-500, 150, 1950, 2500]) s += tree(tx, 800, 0.9, t);
  return s;
}
function plazaNightTint(T) { const S = plazaSky(T); return S.night > 0.02 ? ['#5a5a9a', S.night * 0.3] : null; }

function rockingChair(x, base, ang) {
  return `<g transform="translate(${x} ${base}) rotate(${f2(ang)} 0 0)"><path d="M -110 -4 Q 0 26 110 -4" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M -110 -4 Q 0 26 110 -4" stroke="#8a5a34" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M -80 0 L -70 -110 M 80 0 L 70 -110" stroke="${INK}" stroke-width="12"/><path d="M -80 0 L -70 -110 M 80 0 L 70 -110" stroke="#8a5a34" stroke-width="6"/>
  <rect x="-96" y="-124" width="192" height="22" rx="6" fill="#a46a3a" stroke="${INK}" stroke-width="4"/>
  <path d="M -80 -120 L -90 -330 Q 0 -360 90 -330 L 80 -120" fill="#a46a3a" stroke="${INK}" stroke-width="5"/>
  <path d="M -50 -140 L -54 -310 M 0 -140 L 0 -320 M 50 -140 L 54 -310" stroke="#7a4a30" stroke-width="7"/></g>`;
}

// ---------- shots ----------
const SHOTS = [
  // 1 — hook: forgotten "JÁ VOLTO" sign
  { t0: 0, draw(t, T) {
    const p = E.inOut(clamp(t / 4));
    const cam = { x: lerp(150, 560, p), y: lerp(40, 270, p), z: lerp(1.0, 2.05, p) };
    const leafX = -200 + t * 700, leafY = 700 + Math.sin(t * 3) * 60 + t * 30;
    return { cam, layers: [
      ...backA(t, ['#f0b46a', '#f7e3b5']),
      Lr(1, streetARow(t, { oldAng: Math.sin(t * 2.1) * 7 * (0.6 + 0.4 * Math.sin(t * 0.7)) }) + dust(t, 1300, 600, 500, 300, 26, 2)),
      Lr(1.5, lamp(1180, 1000, 1.1, 0) + pot(2050, 1000, 1.3, t) + `<g transform="translate(${f2(leafX)} ${f2(leafY)}) rotate(${f2(t * 200)})"><path d="M -18 0 Q 0 -14 18 0 Q 0 14 -18 0 Z" fill="#c8643c" stroke="${INK}" stroke-width="3"/></g>`),
    ] };
  } },
  // 2 — Polo pockets the note, walks to the door, "já volto"
  { t0: 4.0, draw(t, T) {
    const walkT = inv(6.75, 7.7, T);
    const px = lerp(700, 1600, E.inOut(walkT));
    const turned = T > 7.65;
    const armRNote = kf(T, [[4, 70], [5.5, 70], [6.5, 12]]);
    const waveA = wave(T, 7.76, 8.6, 150, 20);
    const polo = char('polo', { x: px, y: 985, s: 1.55, t: T, face: turned ? -0.7 : (walkT > 0 && walkT < 1 ? 0.8 : -0.5), walk: walkT > 0 && walkT < 1 ? T * 14 : null,
      armR: waveA != null ? waveA : armRNote, holdR: T < 6.45 ? note10() : '', armL: 12, expr: turned ? 'happy' : 'happy', mouth: talk(T, [[7.76, 8.3]]), lx: turned ? -1 : 0 });
    const pad = char('padeira', { x: 330, y: 985, s: 1.5, t: T, face: 0.5, lx: px > 900 ? 1 : 0.6, expr: 'happy', armL: 30, armR: 40 });
    const camX = lerp(0, 520, E.inOut(inv(6.6, 8.0, T)));
    return { cam: { x: camX, y: 120, z: 1.12 }, layers: [
      Lr(0.85, bakeryInterior(T, { hour: 270, min: 0, doorOpen: E.out(inv(7.2, 7.8, T)), clockX: 1150, clockY: 170 })),
      Lr(1, pad + polo),
      Lr(1.18, counter(-260, 905, 860) + basket(80, 885, 1) + basket(450, 890, 0.9)),
    ] };
  } },
  // 3 — he only went to buy bread
  { t0: 8.7, draw(t, T) {
    const px = 700 + t * 330;
    const bub = E.back(inv(8.95, 9.35, T));
    const polo = char('polo', { x: px, y: 900, t: T, face: 0.8, walk: T * 13, armL: 20 + Math.sin(T * 13) * 14, armR: 20 - Math.sin(T * 13) * 14, expr: 'happy' });
    return { cam: { x: px - 900, y: 20, z: 1.15 }, layers: [
      ...backA(t, ['#f0b46a', '#f7e3b5']),
      Lr(1, streetARow(T, {}) + polo + thought(px + 150, 560, bub, bread({ s: 0.9 }), bub)),
      Lr(1.45, Array.from({ length: 14 }, (_, i) => `<g transform="translate(${i * 300} 1020)"><rect x="-8" y="-150" width="16" height="160" fill="#8a5a34" stroke="${INK}" stroke-width="3"/><rect x="-6" y="-120" width="300" height="14" fill="#a46a3a" stroke="${INK}" stroke-width="3"/><rect x="-6" y="-70" width="300" height="14" fill="#a46a3a" stroke="${INK}" stroke-width="3"/></g>`).join('')),
    ] };
  } },
  // 4 — five minutes, then an hour
  { t0: 10.7, draw(t, T) {
    let min = 0;
    for (let i = 0; i < 5; i++) min += ramp(T, 11.2 + i * 0.22, 11.32 + i * 0.22, 0, 6, E.back);
    min += ramp(T, 12.45, 13.35, 0, 360, E.inOut);
    const hour = 240 + min / 12;
    const beam = lerp(-200, 260, inv(10.7, 13.6, T));
    const z = lerp(1.0, 1.12, E.inOut(inv(10.7, 13.6, T)));
    let wall = `<rect x="-400" y="-300" width="2800" height="1700" fill="#e6c48e"/><rect x="-400" y="-300" width="2800" height="1700" fill="url(#gWallShade)"/>`;
    for (let i = 0; i < 40; i++) wall += `<path d="M ${-400 + i * 80} -300 V 1400" stroke="#c9a56a" stroke-width="10" opacity="0.35"/>`;
    wall += `<path d="M ${300 + beam} -300 L ${800 + beam} -300 L ${1300 + beam} 1400 L ${700 + beam} 1400 Z" fill="#fff4c8" opacity="0.28"/>`;
    const steam = Array.from({ length: 4 }, (_, i) => { const ph = (T * 0.4 + i / 4) % 1; return `<circle cx="${f2(1500 + Math.sin(ph * 7 + i) * 26)}" cy="${f2(900 - ph * 300)}" r="${f2(16 + ph * 30)}" fill="#fff" opacity="${f2(0.35 * (1 - ph))}"/>`; }).join('');
    return { cam: { x: 0, y: 0, z }, layers: [
      Lr(0.6, wall),
      Lr(1, clockFace(960, 520, 340, hour, min) + `<path d="M 960 140 L 960 -300" stroke="${INK}" stroke-width="6"/>`),
      Lr(1.3, `<rect x="1300" y="900" width="520" height="40" rx="8" fill="#8a5a34" stroke="${INK}" stroke-width="4"/><path d="M 1440 900 L 1460 820 L 1560 820 L 1580 900 Z" fill="#f4e6c8" stroke="${INK}" stroke-width="4"/><path d="M 1580 840 q 30 0 30 26 q 0 20 -24 22" stroke="${INK}" stroke-width="6" fill="none"/>` + steam),
    ] };
  } },
  // 5 — the baker: "esse aí já era"
  { t0: 13.6, draw(t, T) {
    const look = T < 15.6;
    const shrug = E.back(inv(15.8, 16.25, T)) * (1 - E.inOut(inv(16.8, 17.1, T)) * 0.3);
    const pad = char('padeira', { x: 820, y: 1000, s: 1.45, t: T, face: look ? 0.75 : 0.1, lx: look ? 1 : 0, ly: look ? -0.2 : 0, expr: look ? 'neutral' : 'smug',
      armL: lerp(18, 95, shrug), armR: lerp(22, 95, shrug), squash: -0.03 * shrug, mouth: talk(T, [[15.76, 16.75]]) });
    const camX = lerp(-40, 60, E.inOut(inv(13.6, 17.1, T)));
    return { cam: { x: camX, y: 40, z: 1.35 }, layers: [
      Lr(0.8, bakeryInterior(T, { clock: false, doorOpen: 1 }) + `<rect x="1652" y="570" width="156" height="330" fill="#ffe7b0" opacity="${f2(0.5 + 0.1 * Math.sin(T))}"/>`),
      Lr(1, pad),
      Lr(1.2, counter(300, 905, 900) + basket(520, 885, 1) + basket(1140, 890, 0.9)),
    ] };
  } },
  // 6 — nobody found it strange: a street of "JÁ VOLTO" signs
  { t0: 17.1, draw(t, T) {
    const camX = lerp(-760, 1050, E.inOut(inv(17.1, 22.3, T)));
    const nod = T > 19.8 && T < 21.6 ? Math.sin((T - 19.8) * 7) * 5 : 0;
    const v1x = 400 - t * 120, v2x = 1250 + t * 90;
    const people =
      char('viz1', { x: v1x, y: 960, s: 0.85, t: T, face: -0.7, walk: T * 11, expr: 'happy', tilt: nod }) +
      char('viz2', { x: v2x, y: 960, s: 0.85, t: T, face: 0.7, walk: T * 11, expr: 'neutral', tilt: -nod }) +
      bench(-420, 960, 0.9) + char('viz3', { x: -420, y: 950, s: 0.8, t: T, face: 0.3, expr: 'happy', tilt: nod * 1.2, armL: 40, armR: 40 }) +
      char('mulher', { x: 2050, y: 960, s: 0.82, t: T, face: -0.4, expr: 'happy', tilt: nod, lx: -1 });
    return { cam: { x: camX, y: 60, z: 1.05 }, layers: [
      ...backA(t, ['#a8c6d0', '#f4e9c8']),
      Lr(1, streetARow(T, { signs: true }) + people),
      Lr(1.5, lamp(-200, 1060, 1.2) + lamp(1300, 1060, 1.2) + lamp(2700, 1060, 1.2) + pot(600, 1060, 1.4, T)),
    ] };
  } },
  // 7 — day 2: mother searching (cool morning)
  { t0: 22.3, xf: 0.5, draw(t, T) {
    const mx = 500 + t * 170;
    const lookFace = Math.sin(T * 1.9) * 0.75;
    const mae = char('mae', { x: mx, y: 930, s: 1.3, t: T, face: lookFace, walk: T * 9, armR: 158, armL: 15, expr: 'worried', lx: lookFace });
    return { cam: { x: mx - 860, y: 60, z: 1.3 }, layers: [
      ...backC(t),
      Lr(1, streetC(t) + lamp(300, 930, 1) + bench(1200, 935, 0.9) + mae),
      Lr(1.5, pot(-100, 1080, 1.5, T) + pot(1700, 1080, 1.4, T + 2)),
    ] };
  } },
  // 8 — the bus passes; Polo in the window, masked, waving
  { t0: 25.5, draw(t, T) {
    // bus: enters fast, cruises while camera tracks the window
    const bx = kf(T, [[25.5, -1500], [27.2, -420], [31.0, 860]], E.lin);
    const winX = bx + 30 + 2 * 128 + 55; // centre of window 3
    const track = E.inOut(inv(26.9, 27.9, T)) * (1 - E.inOut(inv(30.3, 31.0, T)));
    const z = lerp(1.0, 1.95, track);
    const camX = lerp(0, winX - 960, track), camY = lerp(30, 260, track);
    const waveA = wave(T, 28.4, 31, 150, 22);
    const pol = char('polo', { t: T, face: -0.4, mask: true, expr: 'happy', armR: waveA != null ? waveA : 20, lx: -1 });
    const pass = [char('viz2', { t: T, face: 0.3, expr: 'neutral', blink: 0.9 }), char('viz1', { t: T, face: -0.3, expr: 'happy' }), pol, char('viz3', { t: T, face: 0.5, expr: 'neutral' }), ''];
    const drv = char('motorista', { t: T, face: 0.6, expr: 'neutral' });
    const busSvg = bus(bx, 1000, { t: T, wheel: T * 400, passengers: pass, driver: drv });
    const shocked = T > 28.2;
    const mae = char('mae', { x: 260 - track * 400, y: 1060, s: 1.25, t: T, face: 0.8, lx: 1, expr: shocked ? 'surprised' : 'worried', armL: shocked ? kf(T, [[28.2, 15], [28.6, 120]]) : 15, armR: shocked ? kf(T, [[28.2, 15], [28.6, 120]]) : 158 });
    return { cam: { x: camX, y: camY, z }, layers: [
      ...backC(t),
      Lr(1, streetC(t, 880) + lamp(1500, 880, 1) + busSvg + speedLines(bx - 60, 850, 6, 120, 0, 0.6, Math.floor(T * 8))),
      Lr(1.35, mae),
    ] };
  } },
  // 9 — she shouts, runs, raises her arms; the bus doesn't stop
  { t0: 31.0, draw(t, T) {
    const bx = 700 + t * 520;
    const run = T > 32.0 && T < 34.7;
    const mx = 380 + 520 * E.inOut(inv(32.0, 34.9, T));
    const arms = T > 32.74 ? (T < 34.9 ? 165 + Math.sin(T * 16) * 10 : lerp(165, 20, E.inOut(inv(34.9, 35.4, T)))) : (T > 31.3 ? 60 : 15);
    const mae = char('mae', { x: mx, y: 960, s: 1.25, t: T, face: 0.85, walk: run ? T * 22 : null, armL: arms, armR: arms, expr: T < 34.6 ? 'surprised' : 'sad', mouth: T > 31.38 && T < 32.1 ? 0.9 : talk(T, [[32.74, 33.4]]) * 0.6, lx: 1, tilt: run ? 8 : 0 });
    const pass = ['', '', char('polo', { t: T, face: -0.5, mask: true, expr: 'happy', armR: 150 + Math.sin(T * 14) * 20 }), '', ''];
    const puff = Array.from({ length: 5 }, (_, i) => { const ph = (T * 1.5 + i / 5) % 1; return `<circle cx="${f2(bx - 20 - ph * 200)}" cy="${f2(960 - ph * 40)}" r="${f2(14 + ph * 34)}" fill="#d8d6d0" opacity="${f2(0.5 * (1 - ph))}"/>`; }).join('');
    return { cam: { x: lerp(-60, 160, E.inOut(inv(31, 35.5, T))), y: 20, z: 1.0 }, layers: [
      ...backC(t),
      Lr(1, streetC(t, 880) + puff + bus(bx, 1000, { t: T, wheel: T * 500, passengers: pass, driver: char('motorista', { t: T, face: 0.6 }) }) + mae + ripple(mx + 70, 700, inv(31.38, 32.2, T))),
      Lr(1.5, pot(80, 1100, 1.5, T)),
    ] };
  } },
  // 10 — the driver waves back: "já volto também"
  { t0: 35.5, draw(t, T) {
    const scroll = (T * 900) % 2400;
    let bg = `<rect x="-600" y="-400" width="3200" height="1900" fill="#b8c8cc"/>`;
    for (let i = 0; i < 8; i++) { const x = ((i * 420 - scroll) % 3000 + 3000) % 3000 - 600; bg += `<rect x="${f2(x)}" y="${180 + (i % 3) * 60}" width="320" height="900" fill="${['#9fb2bc', '#c9b48e', '#aebfb8'][i % 3]}" opacity="0.9"/><rect x="${f2(x + 60)}" y="${260 + (i % 3) * 60}" width="80" height="90" fill="#6f8fa6" opacity="0.6"/><rect x="${f2(x + 180)}" y="${260 + (i % 3) * 60}" width="80" height="90" fill="#6f8fa6" opacity="0.6"/>`; }
    bg += speedLines(1800, 500, 12, 300, 0, 0.45, Math.floor(T * 10));
    const waveA = wave(T, 36.3, 39.4, 150, 22);
    const drv = char('motorista', { x: 1000, y: 990, s: 3.0, t: T, face: -0.55, lx: -1, expr: T > 38.25 ? 'smug' : 'happy', armL: waveA != null ? waveA : 20, mouth: talk(T, [[38.32, 39.15]]) });
    const panel = `<path fill-rule="evenodd" d="M -400 -200 H 2400 V 1400 H -400 Z M 470 210 H 1450 Q 1500 210 1500 260 V 900 H 470 Z" fill="#e0a83a" stroke="${INK}" stroke-width="6"/>` +
      `<rect x="-400" y="960" width="2800" height="70" fill="#3c7a7a" stroke="${INK}" stroke-width="5"/>` +
      `<rect x="455" y="195" width="1060" height="720" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>` +
      `<g transform="translate(260 380)"><rect x="-70" y="-90" width="140" height="190" rx="30" fill="#2a2233" stroke="${INK}" stroke-width="5"/><rect x="-56" y="-76" width="112" height="162" rx="22" fill="#cfe0e4"/><path d="M -40 40 L 30 -50" stroke="#fff" stroke-width="10" opacity="0.5"/><path d="M 70 0 H 200" stroke="${INK}" stroke-width="14"/></g>`;
    return { cam: { x: 0, y: 0, z: 1.0, r: -3 + Math.sin(T * 1.2) * 0.6 }, layers: [
      Lr(0.4, bg),
      Lr(1, `<rect x="470" y="210" width="1030" height="700" fill="#2f3a44"/><rect x="520" y="280" width="420" height="560" rx="30" fill="#3a2a2a" stroke="${INK}" stroke-width="4"/>` + drv + `<path d="M 470 210 L 760 210 L 470 560 Z" fill="#ffffff" opacity="0.12"/>` + panel),
    ] };
  } },
  // 11 — day 3: a giant clock appears in the square
  { t0: 39.6, xf: 0.5, draw(t, T) {
    const rise = E.back(inv(40.9, 42.1, T));
    const shake = T > 42.0 && T < 42.4 ? Math.sin(T * 90) * 6 * (1 - inv(42.0, 42.4, T)) : 0;
    const ca = clockAngles(T);
    const cloud = T > 40.9 ? Array.from({ length: 9 }, (_, i) => { const ph = clamp((T - 40.9) / 1.6); return `<circle cx="${f2(1350 + (i - 4) * 70 * (0.6 + ph))}" cy="${f2(880 - ph * 40 - (i % 3) * 20)}" r="${f2(40 + ph * 50)}" fill="#efe2c4" opacity="${f2(0.8 * (1 - ph))}"/>`; }).join('') : '';
    const surprised = T > 41.6;
    const crowd = [['barnabe', 600, 0.6], ['menino', 820, 0.6], ['mulher', 1880, 0.6], ['moca', 2080, 0.6]].map(([id, x, s], i) =>
      char(id, { x, y: 960, s, t: T, face: x < 1350 ? 0.7 : -0.7, lx: x < 1350 ? 1 : -1, ly: surprised ? -1 : 0, expr: surprised ? 'surprised' : 'happy', armL: surprised ? 60 : 15, armR: surprised ? 60 : 15, jump: surprised ? 20 * pulse(T, 41.9 + i * 0.07, 0.2) : 0 })).join('');
    return { cam: { x: 390, y: lerp(120, -40, E.inOut(inv(40.6, 42.4, T))) + shake, z: lerp(1.1, 1.0, E.inOut(inv(39.6, 43.1, T))) }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(1, plazaGround(880) + `<g transform="translate(1350 880) scale(0.8) translate(-1350 -880)">${clockTower(1350, 880, { rise, hour: ca.hour, min: ca.min, day: `${ca.days} DIAS` })}</g>` + cloud + crowd),
      Lr(1.45, tree(-200, 1180, 1.2, t) + bench(2600, 1120, 1.2)),
    ] };
  } },
  // 12 — nobody knows who put it there
  { t0: 43.1, draw(t, T) {
    const ca = clockAngles(T);
    const scratch = Math.sin(T * 12) * 8;
    const grp = char('barnabe', { x: 960, y: 940, t: T, face: 0.5, expr: 'worried', armL: 150 + scratch, armR: 15, ly: -0.6 }) +
      char('menino', { x: 1220, y: 940, t: T, face: -0.3, expr: 'worried', armL: 90, armR: 90, ly: -1 }) +
      char('mulher', { x: 1480, y: 940, t: T, face: -0.6, expr: 'neutral', armR: 150 - scratch, armL: 15, lx: -1 }) +
      char('moca', { x: 1720, y: 940, t: T, face: -0.5, expr: 'worried', armL: 70, armR: 70, tilt: Math.sin(T * 3) * 4 });
    return { cam: { x: 390, y: 80, z: 1.25 }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(0.9, plazaGround(880) + `<g transform="translate(1350 880) scale(0.8) translate(-1350 -880)">${clockTower(1350, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS` })}</g>`),
      Lr(1, grp.replace(/translate\((\d+)/g, (m, a) => m)),
    ] };
  } },
  // 13 — the hand only moves when someone says "já volto"
  { t0: 44.7, draw(t, T) {
    const ca = clockAngles(T);
    const S = plazaSky(T);
    const z = lerp(1.0, 1.12, E.inOut(inv(44.7, 48, T)));
    const kick = pulse(T, 46.95, 0.25);
    return { cam: { x: 0, y: 0, z: z + kick * 0.03 }, layers: [
      Lr(0.05, sky(S.top, S.bot, { id: 'p13' })),
      Lr(0.15, clouds(T, '#fff6e2', 0.7, 13, 200)),
      Lr(1, `<path d="M 960 -260 L 340 140 L 1580 140 Z" fill="#3c5a4a" stroke="${INK}" stroke-width="8"/>` + `<rect x="430" y="900" width="1060" height="400" fill="#8a3a22" stroke="${INK}" stroke-width="8"/>` + clockFace(960, 560, 390, ca.hour, ca.min, { day: `${ca.days} DIAS`, glow: kick })),
    ] };
  } },
  // 14 — Barnabé jokes "já volto": clock jumps two hours
  { t0: 48.0, draw(t, T) {
    const ca = clockAngles(T);
    const after = T > 52.85;
    const bar = char('barnabe', { x: 620, y: 990, s: 1.7, t: T, face: after ? 0.6 : 0.2, lx: after ? 1 : 0, ly: after ? -0.6 : 0, expr: after ? 'surprised' : (T > 50.5 ? 'laugh' : 'happy'),
      armL: (() => { const w = wave(T, 51.3, 52.0, 120, 25); return w != null ? w : 15; })(), armR: 30, mouth: talk(T, [[50.6, 50.9], [51.3, 51.85]]), tilt: T > 50.5 && T < 52 ? Math.sin(T * 10) * 3 : 0 });
    const camX = kf(T, [[48, -60], [52.2, 20], [52.9, 260], [54.3, 280]]);
    return { cam: { x: camX, y: 30, z: 1.2 }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(0.85, plazaGround(880) + `<g transform="translate(1450 880) scale(0.75) translate(-1450 -880)">${clockTower(1450, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS`, glow: pulse(T, 53.0, 0.4), blur: pulse(T, 53.1, 0.35) })}</g>`),
      Lr(1, bar + ripple(720, 660, inv(51.3, 52.2, T))),
      Lr(1.4, pot(150, 1120, 1.5, T) + pot(1900, 1120, 1.4, T + 1)),
    ], tint: plazaNightTint(T) };
  } },
  // 15 — the boy shouts: a whole day goes by
  { t0: 54.3, draw(t, T) {
    const ca = clockAngles(T);
    const shout = T > 55.8 && T < 56.4;
    const boy = char('menino', { x: 760, y: 990, s: 2.1, t: T, face: T > 56.5 ? 0.7 : 0.1, ly: T > 56.5 ? -1 : 0, lx: T > 56.5 ? 1 : 0, expr: shout ? 'laugh' : (T > 56.5 ? 'surprised' : 'happy'),
      armL: shout ? 165 : (T > 56.5 ? 70 : 20), armR: shout ? 165 : (T > 56.5 ? 70 : 20), mouth: shout ? 1 : 0, jump: 26 * pulse(T, 56.0, 0.25) });
    return { cam: { x: kf(T, [[54.3, -80], [56.4, -60], [57.0, 240], [58, 260]]), y: -20, z: 1.15 }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(0.85, plazaGround(880) + `<g transform="translate(1450 880) scale(0.75) translate(-1450 -880)">${clockTower(1450, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS`, blur: clamp(spinSpeed(T) / 20), glow: pulse(T, 57.2, 0.6) })}</g>`),
      Lr(1, lamp(420, 980, 1.1, plazaSky(T).night) + boy + ripple(900, 640, inv(55.86, 56.6, T)) + ripple(620, 640, inv(55.9, 56.6, T))),
    ], tint: plazaNightTint(T) };
  } },
  // 16 — a woman in glasses laughs: three "já volto"
  { t0: 58.0, draw(t, T) {
    const ca = clockAngles(T);
    const calls = [59.88, 60.40, 60.94];
    let flick = 0; for (const c of calls) flick = Math.max(flick, pulse(T, c + 0.1, 0.18));
    const wom = char('mulher', { x: 680, y: 990, s: 1.7, t: T, face: 0.25, expr: 'laugh', mouth: Math.max(talk(T, [[59.88, 60.2], [60.4, 60.7], [60.94, 61.3]]), 0.5),
      armL: 40 + flick * 110, armR: 40, tilt: Math.sin(T * 9) * 3 + flick * 4, squash: -0.03 * flick });
    return { cam: { x: lerp(-20, 180, E.inOut(inv(58, 61.7, T))), y: 20, z: 1.15 }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(0.85, plazaGround(880) + `<g transform="translate(1450 880) scale(0.75) translate(-1450 -880)">${clockTower(1450, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS`, glow: flick * 0.8 })}</g>`),
      Lr(1, bench(560, 1000, 1.3) + wom + calls.map(c => ripple(800, 640, inv(c, c + 0.5, T))).join('')),
    ], tint: plazaNightTint(T) };
  } },
  // 17 — a girl whispers… and time goes crazy (strongest camera move)
  { t0: 61.7, draw(t, T) {
    const ca = clockAngles(T);
    const sp = clamp(spinSpeed(T) / 30);
    const whisper = T > 63.4 && T < 64.15;
    const after = T > 64.9;
    const moca = char('moca', { x: 820, y: 990, s: 1.65, t: T, face: after ? 0.7 : (T < 63.2 ? Math.sin((T - 61.7) * 3) * 0.6 : 0.4), lx: after ? 1 : (T < 63.2 ? Math.sin((T - 61.7) * 3) : 0.6), tilt: T < 63.3 ? Math.sin((T - 61.7) * 2.5) * 4 : 0, ly: after ? -1 : 0, expr: after ? 'surprised' : 'smug',
      armR: whisper || T < 64.6 ? 150 : 40, armL: 15, mouth: talk(T, [[63.44, 64.05]]) * 0.4 });
    const crowd = char('barnabe', { x: 1880, y: 960, s: 0.75, t: T, face: -0.5, ly: -1, expr: after ? 'surprised' : 'neutral', armL: after ? 70 : 15, armR: 30 }) +
      char('menino', { x: 2060, y: 960, s: 0.75, t: T, face: -0.5, ly: -1, expr: after ? 'surprised' : 'happy', armL: after ? 160 : 15, armR: after ? 160 : 15 }) +
      char('mulher', { x: 1040, y: 960, s: 0.75, t: T, face: 0.5, ly: -1, expr: after ? 'surprised' : 'happy', armL: after ? 90 : 15 });
    // camera: medium on girl → huge push to the clock face with a slow roll
    const p = E.inOut(inv(64.9, 66.6, T));
    const back = E.inOut(inv(67.9, 68.6, T));
    const cx = 1450, cy = 880 - 720 * 0.75; // clock centre in world
    const drift = E.inOut(inv(61.7, 64.9, T));
    const cam = { x: lerp(lerp(-200, 40, drift), cx - 960, p) * (1 - back * 0.5), y: lerp(lerp(70, 20, drift), cy - 540, p) * (1 - back * 0.5), z: lerp(lerp(1.15, 1.35, drift), 2.7, p) - back * 0.9, r: Math.sin((T - 64.9) * 2.2) * 6 * p * (1 - back) };
    return { cam, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(1, plazaGround(880) + `<g transform="translate(1450 880) scale(0.75) translate(-1450 -880)">${clockTower(1450, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS`, blur: sp, glow: sp * 0.8 })}</g>` + crowd + moca + (whisper ? ripple(930, 650, inv(63.44, 64.1, T), '#f4d6de') : '')),
    ], tint: plazaNightTint(T), over: sp > 0.05 ? speedLines(960, 540, 10, 260, (T * 300) % 360, sp * 0.35, Math.floor(T * 12)) : '' };
  } },
  // 18 — Polo is back, bread in hand: "já voltei!"
  { t0: 68.6, xf: 0.3, draw(t, T) {
    const ca = clockAngles(T);
    const walkT = inv(68.9, 71.6, T);
    const px = lerp(-150, 760, E.out(walkT));
    const cheer = T > 72.85;
    const polo = char('polo', { x: px, y: 990, s: 1.7, t: T, face: walkT < 1 ? 0.8 : 0.15, walk: walkT > 0 && walkT < 0.97 ? T * 12 : null, expr: cheer ? 'joy' : 'happy',
      armR: cheer ? 160 : 40, armL: cheer ? 160 : 20 + (walkT < 1 ? Math.sin(T * 12) * 12 : 0), holdR: bread({ s: 0.75, rot: cheer ? -30 : 10 }), mouth: talk(T, [[72.88, 73.35]]), jump: 30 * pulse(T, 73.05, 0.22) });
    const watchers = char('barnabe', { x: 1250, y: 940, s: 0.7, t: T, face: -0.6, lx: -1, expr: 'surprised' }) + char('mulher', { x: 1700, y: 940, s: 0.7, t: T, face: -0.6, lx: -1, expr: 'surprised' }) + char('menino', { x: 1500, y: 940, s: 0.7, t: T, face: -0.6, lx: -1, expr: 'surprised' });
    return { cam: { x: lerp(-260, 100, E.inOut(inv(68.6, 72, T))), y: 30, z: 1.1 }, layers: [
      ...plazaBack(T, t),
      Lr(0.7, plazaMid(T, t)),
      Lr(0.85, plazaGround(880) + `<g transform="translate(1450 880) scale(0.75) translate(-1450 -880)">${clockTower(1450, 880, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS` })}</g>` + watchers),
      Lr(1, polo),
      Lr(1.4, pot(1950, 1120, 1.4, T) + tree(-650, 1250, 1.2, T)),
    ] };
  } },
  // 19 — the bread is hard as stone
  { t0: 74.0, draw(t, T) {
    const stone = E.inOut(inv(74.2, 74.9, T));
    const hit1 = pulse(T, 74.97, 0.12), hit2 = pulse(T, 75.45, 0.12);
    const fistY = kf(T, [[74.0, 160], [74.75, 140], [74.95, 525], [75.15, 230], [75.42, 525], [75.6, 180], [76.1, 160]]);
    const vib = (hit1 + hit2) * Math.sin(T * 120) * 8;
    let bg = `<rect x="-600" y="-400" width="3200" height="1900" fill="#e8c890"/><circle cx="400" cy="300" r="260" fill="#f4e0b0" opacity="0.6"/><circle cx="1600" cy="760" r="320" fill="#c9a56a" opacity="0.5"/><rect x="-600" y="760" width="3200" height="800" fill="#cbb48a"/>`;
    const chips = T > 74.97 ? Array.from({ length: 8 }, (_, i) => { const q = clamp((T - 74.97) / 0.7); const a = i * 0.8; return `<rect x="${f2(960 + Math.cos(a) * 260 * q)}" y="${f2(600 - Math.sin(a) * 180 * q + q * q * 240)}" width="16" height="12" fill="#8c8a86" stroke="${INK}" stroke-width="2" opacity="${f2(1 - q)}" transform="rotate(${i * 40} ${f2(960 + Math.cos(a) * 260 * q)} ${f2(600 - Math.sin(a) * 180 * q)})"/>`; }).join('') : '';
    const fist = `<g transform="translate(980 ${f2(fistY)})"><path d="M -20 -600 L -20 -80 M 20 -600 L 20 -80" stroke="${INK}" stroke-width="10"/><rect x="-36" y="-600" width="72" height="560" fill="#3c8a86"/><circle cx="0" cy="-20" r="70" fill="#e0ac69" stroke="${INK}" stroke-width="6"/><path d="M -40 -40 q 20 -14 40 0 q 20 -14 40 0" stroke="${INK}" stroke-width="5" fill="none"/></g>`;
    const impact = (hit1 + hit2) > 0.1 ? `<g opacity="${f2(hit1 + hit2)}">${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4 + 0.3; return `<path d="M ${f2(980 + Math.cos(a) * 160)} ${f2(560 + Math.sin(a) * 100)} L ${f2(980 + Math.cos(a) * 240)} ${f2(560 + Math.sin(a) * 150)}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`; }).join('')}</g>` : '';
    return { cam: { x: 0, y: 0, z: 1.0 + 0.04 * E.inOut(inv(74, 76.1, T)) }, layers: [
      Lr(0.3, bg),
      Lr(1, `<ellipse cx="960" cy="700" rx="330" ry="50" fill="#1b1424" opacity="0.25"/><g transform="translate(${f2(960 + vib)} 620)">${bread({ s: 4.4, stone, cracks: clamp((T - 74.97) / 0.3) })}</g>` + chips + impact + fist),
    ] };
  } },
  // 20 — and the baker had retired
  { t0: 76.1, draw(t, T) {
    const rock = Math.sin(T * 2.2) * 5;
    const needle = Math.sin(T * 9) * 10;
    const knit = `<path d="M -10 -10 l 60 -50" stroke="#c9b27a" stroke-width="6" stroke-linecap="round"/><circle cx="20" cy="10" r="22" fill="#c8643c" stroke="${INK}" stroke-width="3"/><path d="M 4 4 q 16 -10 32 0 M 2 14 q 18 -10 36 0" stroke="#8a3a22" stroke-width="2.5" fill="none"/>`;
    const old = rockingChair(700, 900, rock) + `<g transform="rotate(${f2(rock)} 700 900)">${char('padeira', { x: 700, y: 862, s: 1.2, old: true, t: T, face: 0.2, expr: T > 78.3 ? 'happy' : 'joy', armL: 50 + needle * 0.4, armR: 50 - needle * 0.4, holdR: knit, shadow: false })}</g>`;
    const px = lerp(1800, 1250, E.out(inv(76.4, 77.8, T)));
    const polo = char('polo', { x: px, y: 930, s: 1.3, t: T, face: -0.8, walk: T < 77.7 ? T * 12 : null, lx: -1, expr: T > 78.5 ? 'surprised' : 'happy', holdR: bread({ s: 0.6, stone: 1, cracks: 1 }), armR: 40, armL: 15 });
    const sk = ['#e9a46a', '#f7d9a5'];
    return { cam: { x: lerp(80, 0, E.inOut(inv(76.1, 79.6, T))), y: 90, z: 1.3 }, layers: [
      ...backA(t, sk),
      Lr(1, streetARow(T, {}) + old + polo),
      Lr(1.45, pot(300, 1060, 1.4, T) + lamp(1800, 1080, 1.1)),
    ], tint: ['#e8a070', 0.12] };
  } },
  // 21 — he looks at the square's clock: nine days had passed
  { t0: 79.6, draw(t, T) {
    const ca = clockAngles(T);
    const cx = 1050, base = 900, k = 1.0, cy = base - 720 * k;
    const up = E.inOut(inv(79.9, 81.2, T)), push = E.inOut(inv(81.3, 81.9, T)), down = E.inOut(inv(82.4, 83.3, T));
    const camY = lerp(lerp(160, cy - 540 + 60, up), 180, down);
    const camX = lerp(lerp(-120, cx - 960, up), -60, down);
    const z = lerp(lerp(1.15, 1.6, up) + push * 0.9, 1.25, down);
    const polo = char('polo', { x: 640, y: 1080, s: 1.6, t: T, face: 0.4, lx: 0.6, ly: -1, expr: T > 82.3 ? 'surprised' : 'neutral', holdR: bread({ s: 0.6, stone: 1, cracks: 1 }), armR: T > 82.3 ? 60 : 30, armL: T > 82.3 ? 60 : 15, mouth: T > 82.3 ? 0.8 : 0 });
    const glow = pulse(T, 81.9, 0.6);
    return { cam: { x: camX, y: camY, z }, layers: [
      ...plazaBack(T, t).map(l => l.d < 0.2 ? l : l),
      Lr(0.7, plazaMid(T, t)),
      Lr(1, plazaGround(900) + clockTower(cx, base, { hour: ca.hour, min: ca.min, day: `${ca.days} DIAS`, glow })),
      Lr(1.15, polo),
    ] };
  } },
  // 22 — CTA: Polo flips the bakery sign to "VOLTO"
  { t0: 83.5, xf: 0.4, draw(t, T) {
    const flip = E.inOut(inv(88.15, 88.6, T));
    const point = T > 87.7 && T < 88.2;
    const waveA = wave(T, 88.7, 89.6, 150, 20);
    const shrug = E.back(inv(84.4, 84.9, T)) * (1 - E.inOut(inv(86.9, 87.4, T)));
    const polo = char('polo', { x: 640, y: 905, s: 1.25, t: T, face: T > 87.6 && T < 88.7 ? -0.5 : 0.1, expr: T < 86.9 ? 'smug' : 'happy', lx: T > 87.6 && T < 88.7 ? -1 : 0,
      armR: waveA != null ? waveA : lerp(30, 95, shrug), armL: point || (T > 88.1 && T < 88.7) ? 100 : lerp(15, 95, shrug), holdR: waveA == null ? bread({ s: 0.55, stone: 1, cracks: 1, rot: -20 }) : '', tilt: Math.sin(T * 2) * 2 });
    const sign = hangSign(285, 745, 'JÁ VOLTO', Math.sin(T * 1.5) * 2 + pulse(T, 88.6, 0.3) * 6, { w: 176, h: 62, fs: 28, flip, text2: 'VOLTO' });
    return { cam: { x: lerp(-520, -490, E.inOut(inv(83.5, 89.6, T))), y: lerp(90, 130, t / 6), z: lerp(1.3, 1.5, E.inOut(inv(83.5, 89.6, T))) }, layers: [
      Lr(0.04, sky('#b85a6a', '#f2a46a', { sun: 640, sunX: 1650, sunC: '#ffd9a0', sunR: 110, id: 'e' })),
      Lr(0.1, clouds(T, '#f4b8a0', 0.8, 5)),
      Lr(0.22, hills('#a45a5a', '#8a4a50', 790)),
      Lr(0.4, farTown('#7a4a5a', 760, 5) + haze('#f2a46a', 400, 900, 0.5)),
      Lr(1, `<g>${bakeryFacade(-200, 900, { t: T, sign: false, night: true })}</g>` + sign + polo + dust(T, 0, 300, 1920, 600, 20, 9, '#ffe7a0')),
      Lr(1.4, lamp(1050, 1060, 1.2, 1) + pot(-380, 1060, 1.4, T)),
    ], tint: ['#e88a8a', 0.1] };
  } },
];
