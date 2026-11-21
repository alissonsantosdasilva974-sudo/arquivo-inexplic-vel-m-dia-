// Vertical 9:16 shots. World is authored in v1 units and scaled by KK; camera helpers work in world units.
const KK = 1.6;
const Lr = (d, svg) => ({ d, svg: `<g transform="scale(${KK})">${svg}</g>` });
// put world point (x,y) at screen (540, sy) with zoom z
const focus = (x, y, z, sy = 960) => ({ x: x * KK - 540, y: y * KK - 960 - (sy - 960) / z, z });
// frame a character standing on groundY so the ground lands at screen y gs
const frameG = (x, groundY, z, gs = 1400, r = 0) => ({ ...focus(x, groundY, z, gs), r });
const lerpCam = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), z: lerp(a.z, b.z, p), r: lerp(a.r || 0, b.r || 0, p) });
const push = (c, t, dur, amt = 0.07) => ({ ...c, z: c.z * (1 + amt * E.sine(clamp(t / dur))) }); // constant slow push-in (reference style)
const talk = (T, iv) => { for (const [a, b] of iv) if (T >= a && T <= b) return 0.25 + 0.55 * Math.abs(Math.sin((T - a) * 17)); return 0; };
const wave = (T, a, b, base = 160, amp = 18) => (T >= a && T <= b) ? base + Math.sin((T - a) * 14) * amp * Math.min(1, (T - a) * 4, (b - T) * 4) : null;
const P_ = (id, o) => person(id, o);

// comic onomatopoeia (orbita-style), drawn in screen space
function comic(T, t0, text, x, y, o = {}) {
  const dt = T - t0, life = o.life || 0.9;
  if (dt < 0 || dt > life) return '';
  const pop = E.back(clamp(dt / 0.16)), out = 1 - E.in(clamp((dt - life + 0.2) / 0.2));
  const wob = Math.sin(dt * 30) * 2 * (1 - clamp(dt / 0.4));
  return `<g transform="translate(${x} ${y}) rotate(${(o.rot || -8) + wob}) scale(${f2(pop * (o.s || 1))})" opacity="${f2(out)}">
   <text text-anchor="middle" y="30" font-family="Fredoka" font-weight="700" font-size="${o.size || 110}" fill="${o.fill || '#ffd23f'}" stroke="#211c26" stroke-width="16" stroke-linejoin="round" paint-order="stroke" letter-spacing="2">${text}</text></g>`;
}

// ---------- clock continuity (same as horizontal cut) ----------
const SPIN_A = 64.94, SPIN_B = 68.3;
function hoursAt(T) {
  let H = 48;
  H += ramp(T, 46.88, 47.2, 0, 5 / 60, E.back);
  H += ramp(T, 52.82, 53.5, 0, 2, E.back);
  H += ramp(T, 56.76, 57.75, 0, 24, E.inOut);
  for (const c of [59.88, 60.40, 60.94]) H += ramp(T, c, c + 0.3, 0, 3, E.back);
  const before = 48 + 5 / 60 + 2 + 24 + 9, target = 9 * 24 + 1;
  H += ramp(T, SPIN_A, SPIN_B, 0, target - before, t => t < 0.85 ? Math.pow(t / 0.85, 2.2) * 0.97 : 0.97 + 0.03 * E.back((t - 0.85) / 0.15));
  return H;
}
function clockAngles(T) {
  const H = hoursAt(T) + 9;
  const jit = (T > 45.3 && T < 46.85) ? Math.sin(T * 60) * 1.6 * pulse(T, 46.1, 0.8) : 0;
  return { hour: (H % 12) * 30, min: (H % 1) * 360 + jit, days: Math.floor(hoursAt(T) / 24), H };
}
const spinSpeed = T => Math.abs(hoursAt(T + 0.02) - hoursAt(T - 0.02)) / 0.04;
function plazaSky(T) {
  const { H } = clockAngles(T); const tod = ((H % 24) + 24) % 24;
  let night = tod < 5 ? 1 : tod < 7 ? 1 - (tod - 5) / 2 : tod < 17 ? 0 : tod < 20 ? (tod - 17) / 3 : 1;
  let dusk = pulse(tod, 18.5, 2) + pulse(tod, 6, 1.2) * 0.6;
  const sp = clamp(spinSpeed(T) / 20); night = lerp(night, 0.45, sp); dusk = lerp(dusk, 0.3, sp);
  return { top: mix(mix('#f0a868', '#151a36', night), '#b85a6a', dusk * 0.6), bot: mix(mix('#f8dcae', '#3a3a6a', night), '#f2a46a', dusk * 0.6), night, sp };
}
const nightTint = T => { const S = plazaSky(T); return S.night > 0.02 ? ['#4a4a8a', S.night * 0.32] : null; };

// ---------- environments ----------
function streetARow(t, o = {}) {
  const base = 900; let s = '';
  s += house(-1150, base, 380, 420, { wall: '#e8c9a0', roof: '#d0704a', windows: 2, shutters: '#7aa06a', seed: 1 });
  s += house(-720, base, 420, 470, { wall: '#9fc3d8', roof: '#d0704a', windows: 2, door: true, doorX: 30, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.7 + 1) * 3, flowers: true, shutters: '#4f7a9a', seed: 2 });
  s += house(-250, base, 380, 430, { wall: '#f2d27a', roof: '#a85a3a', windows: 1, door: true, doorX: 220, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.5 + 2) * 3, seed: 3, cat: true, t });
  s += bakeryFacade(180, base, { t, sign: false, open: o.bakeryOpen || 0 });
  s += house(860, base, 420, 450, { wall: '#a8d4a8', roof: '#d0704a', windows: 2, shutters: '#e8865a', flowers: true, seed: 4 });
  s += house(1320, base, 380, 440, { wall: '#d8c4a8', roof: '#8a5a3a', windows: 1, door: true, doorX: 160, sign: 'JÁ VOLTO', signAng: o.oldAng != null ? o.oldAng : Math.sin(t * 1.3) * 3, dust: 0.35, web: true, seed: 5, doorC: '#6a5a4a' });
  for (let i = 0; i < 7; i++) s += `<g transform="translate(${1500 + (i % 4) * 26 - 10} ${base + 4 - Math.floor(i / 4) * 16}) rotate(${(i * 37) % 30 - 15})"><rect x="-26" y="-9" width="52" height="18" rx="9" fill="#efe8d8" stroke="${INK}" stroke-width="3"/><path d="M -14 -9 v 18 M 10 -9 v 18" stroke="#b6a58a" stroke-width="3"/></g>`;
  s += house(1760, base, 440, 480, { wall: '#e8a8b8', roof: '#a85a3a', windows: 2, door: true, doorX: 155, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.6 + 3) * 3, shutters: '#4f7a9a', seed: 6 });
  s += house(2260, base, 400, 430, { wall: '#c8b8e0', roof: '#d0704a', windows: 2, door: true, doorX: 135, sign: o.signs ? 'JÁ VOLTO' : null, signAng: Math.sin(t * 1.4 + 4) * 3, flowers: true, seed: 7 });
  s += house(2720, base, 420, 460, { wall: '#f2d27a', roof: '#8a5a3a', windows: 2, seed: 8 });
  return s + street(base, { walk: '#e6d6b8', road: '#9a96a0' });
}
const backA = (t, sk) => [Lr(0.04, sky(sk[0], sk[1], { sun: 120, sunX: 1450, id: 'a' })), Lr(0.1, clouds(t, '#fff6ea', 0.85, 3, 40)), Lr(0.3, farTown('#e0b48a', 720, 5) + haze('#f8e6c4', 300, 900, 0.55))];
function streetC(t, base = 880) {
  let s = ''; const r = rng(21); let x = -1400;
  const walls = ['#c8dce8', '#e8d8c0', '#d8e8d0', '#e8c8c8', '#d0d0e8'];
  while (x < 3600) { const w = 300 + r() * 160, h = 380 + r() * 220; s += house(x, base, w, h, { wall: walls[Math.floor(r() * 5)], roof: mix('#5a7a9a', '#9a6a6a', r()), windows: 2, flat: r() < 0.5, glass: '#7a9ab0', shutters: r() < 0.4 ? '#5a7a9a' : null, seed: (x | 0) }); x += w + 40 + r() * 40; }
  s += street(base, { walk: '#d8d4c8', road: '#8a8a92' });
  for (let i = -20; i < 40; i++) s += `<rect x="${i * 220}" y="${base + 250}" width="120" height="14" rx="6" fill="#f4efe0" opacity="0.8"/>`;
  return s;
}
const backC = t => [Lr(0.04, sky('#9cc4dc', '#eaf2ee', { sun: 140, sunX: 400, sunC: '#fffbe8', sunR: 70, id: 'c' })), Lr(0.1, clouds(t, '#ffffff', 0.8, 9, 60)), Lr(0.3, farTown('#aec4d0', 700, 8) + haze('#eaf2ee', 300, 900, 0.6))];
function plazaBack(T, t) {
  const S = plazaSky(T);
  return [Lr(0.04, sky(S.top, S.bot, { id: 'p', stars: S.night, t, moon: S.night > 0.3 ? 120 : null, moonX: 700, sun: S.night < 0.6 ? 120 + S.night * 300 : null, sunX: 1550 })),
    Lr(0.1, clouds(t, mix('#fff6ea', '#4a4a7a', S.night), 0.8, 13, 40)),
    Lr(0.3, farTown(mix('#e0b48a', '#2a2a4a', S.night), 720, 3) + haze(mix('#f8e6c4', '#3a3a6a', S.night), 300, 900, 0.5))];
}
function plazaMid(T, t) {
  const S = plazaSky(T); let s = ''; const r = rng(31); let x = -1500;
  const walls = ['#f2d27a', '#9fc3d8', '#e8a8b8', '#a8d4a8', '#e8c9a0'];
  while (x < 3400) { const w = 330 + r() * 120, h = 360 + r() * 160; s += house(x, 760, w, h, { wall: walls[Math.floor(r() * 5)], roof: r() < 0.5 ? '#d0704a' : '#a85a3a', windows: 2, shutters: r() < 0.5 ? '#4f7a9a' : '#7aa06a', lit: S.night, seed: (x | 0) + 7 }); x += w + 30; }
  s += `<rect x="-1500" y="760" width="4900" height="30" fill="#c8b48e" stroke="${INK}" stroke-width="3"/>`;
  for (const tx of [-500, 150, 1950, 2500]) s += tree(tx, 800, 0.9, t, '#7ab06a');
  return s;
}
const tower = (T, cx, k, o = {}) => { const ca = clockAngles(T); return `<g transform="translate(${cx} 880) scale(${k}) translate(${-cx} -880)">${clockTower(cx, 880, Object.assign({ hour: ca.hour, min: ca.min, day: `${ca.days} DIAS` }, o))}</g>`; };
function rockingChair(x, base, ang) {
  return `<g transform="translate(${x} ${base}) rotate(${f2(ang)} 0 0)"><path d="M -90 -4 Q 0 22 90 -4" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M -90 -4 Q 0 22 90 -4" stroke="#a46a3a" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M -66 0 L -58 -90 M 66 0 L 58 -90" stroke="${INK}" stroke-width="10"/><path d="M -66 0 L -58 -90 M 66 0 L 58 -90" stroke="#a46a3a" stroke-width="5"/>
  <rect x="-80" y="-102" width="160" height="18" rx="6" fill="#b87a4a" stroke="${INK}" stroke-width="4"/>
  <path d="M -66 -100 L -74 -270 Q 0 -296 74 -270 L 66 -100" fill="#b87a4a" stroke="${INK}" stroke-width="5"/>
  <path d="M -40 -116 L -44 -256 M 0 -116 L 0 -264 M 40 -116 L 44 -256" stroke="#8a5a34" stroke-width="6"/></g>`;
}
const poloFist = () => `<g><circle r="16" fill="#1d1a22" stroke="${INK9}" stroke-width="4"/></g>`;

// ---------- shots ----------
const SHOTS = [
  // 1 — hook: forgotten JÁ VOLTO sign
  { t0: 0, draw(t, T) {
    const p = E.inOut(clamp(t / 4));
    const cam = lerpCam(focus(1520, 700, 1.15), focus(1545, 650, 2.5), p);
    const leafX = 1300 + t * 120, leafY = 520 + Math.sin(t * 3) * 30 + t * 40;
    return { cam, layers: [...backA(t, ['#f2b06a', '#f8e2b8']),
      Lr(1, streetARow(t, { oldAng: Math.sin(t * 2.1) * 7 }) + dust(t, 1380, 500, 340, 400, 24, 2) + `<g transform="translate(${f2(leafX)} ${f2(leafY)}) rotate(${f2(t * 200)})"><path d="M -12 0 Q 0 -10 12 0 Q 0 10 -12 0 Z" fill="#d0704a" stroke="${INK}" stroke-width="2.5"/></g>`)] };
  } },
  // 2 — bakery: note, pocket, "já volto!"
  { t0: 4.0, draw(t, T) {
    const walkT = inv(6.85, 7.75, T);
    const px = lerp(660, 1560, E.inOut(walkT));
    const turned = T > 7.7;
    const pocket = E.inOut(inv(6.05, 6.5, T));
    const waveA = wave(T, 7.76, 8.65, 165, 20);
    const polo = P_('polo', { x: px, y: 900, s: 0.62, t: T, face: turned ? -0.6 : (walkT > 0 && walkT < 1 ? 0.7 : -0.45), lx: turned ? -1 : (T < 6.8 ? -0.6 : 0), walk: walkT > 0 && walkT < 1 ? T * 13 : null,
      armR: waveA != null ? waveA : lerp(60, 14, pocket), bendR: waveA != null ? 25 : lerp(70, 40, pocket), holdR: T < 6.4 ? `<g transform="rotate(-20)">${note10()}</g>` : '', expr: turned ? 'happy' : 'happy', mouth: talk(T, [[7.76, 8.3]]) });
    const pad = P_('padeira', { x: 330, y: 900, s: 0.66, t: T, face: 0.5, lx: px > 900 ? 1 : 0.6, expr: 'happy', armL: 30, armR: 40, bendL: 50, bendR: 50 });
    let cam;
    if (T < 5.9) cam = push(frameG(500, 900, 1.5, 1450), t, 1.9, 0.06);
    else if (T < 6.8) cam = push(focus(px + 10, 900 - 0.62 * 170, 4.2, 1000), T - 5.9, 0.9, 0.05);
    else cam = frameG(lerp(700, 1540, E.inOut(inv(6.8, 8.0, T))), 900, 2.15, 1420);
    return { cam, layers: [
      Lr(0.9, bakeryInterior(T, { hour: 270, min: 0, doorOpen: E.out(inv(7.25, 7.8, T)), clockX: 1150, clockY: 170 })),
      Lr(1, pad + counter(-260, 812, 820) + basket(80, 795, 0.9) + basket(420, 798, 0.8) + polo),
    ], over: comic(T, 7.8, 'JÁ VOLTO!', 540, 520, { size: 96, rot: -6, life: 0.85 }) };
  } },
  // 3 — he only went to buy bread
  { t0: 8.7, draw(t, T) {
    const px = 640 + t * 140;
    const bub = E.back(inv(8.95, 9.35, T));
    const polo = P_('polo', { x: px, y: 900, s: 0.62, t: T, face: 0.7, walk: T * 12, armL: 14 + Math.sin(T * 12) * 16, armR: 14 - Math.sin(T * 12) * 16, expr: 'happy' });
    return { cam: frameG(px + 20, 900, 2.3, 1420), layers: [...backA(t, ['#f2b06a', '#f8e2b8']),
      Lr(1, streetARow(T, {}) + polo + thought(px + 70, 560, bub * 0.75, bread({ s: 0.9 }), bub)),
      Lr(1.35, Array.from({ length: 30 }, (_, i) => `<g transform="translate(${i * 150} 990)"><rect x="-6" y="-110" width="12" height="120" fill="#a46a3a" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-90" width="150" height="12" fill="#c08a5a" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-50" width="150" height="12" fill="#c08a5a" stroke="${INK}" stroke-width="3"/></g>`).join(''))] };
  } },
  // 4 — five minutes, then an hour
  { t0: 10.7, draw(t, T) {
    let min = 0; const ticks = [];
    for (let i = 0; i < 5; i++) { min += ramp(T, 11.2 + i * 0.22, 11.32 + i * 0.22, 0, 6, E.back); }
    min += ramp(T, 12.45, 13.35, 0, 360, E.inOut);
    const hour = 240 + min / 12;
    let wall = `<rect x="-400" y="-600" width="2800" height="2400" fill="#f0d8a8"/>`;
    for (let i = 0; i < 40; i++) wall += `<path d="M ${-400 + i * 80} -600 V 1800" stroke="#e0c490" stroke-width="10" opacity="0.5"/>`;
    const beam = lerp(-200, 260, inv(10.7, 13.6, T));
    wall += `<path d="M ${300 + beam} -600 L ${800 + beam} -600 L ${1300 + beam} 1800 L ${700 + beam} 1800 Z" fill="#fff6d8" opacity="0.3"/>`;
    return { cam: push(focus(960, 560, 0.92), t, 2.9, 0.08), layers: [Lr(0.6, wall), Lr(1, clockFace(960, 560, 340, hour, min) + `<path d="M 960 180 L 960 -600" stroke="${INK}" stroke-width="6"/>`)],
      over: [0, 1, 2, 3, 4].map(i => comic(T, 11.2 + i * 0.22, i % 2 ? 'TAC' : 'TIC', i % 2 ? 790 : 290, 1180 + (i % 2) * 40, { size: 80, life: 0.3, rot: i % 2 ? 8 : -8 })).join('') + comic(T, 12.5, 'ZUUUM', 540, 1230, { size: 100, life: 0.85, fill: '#ffffff' }) };
  } },
  // 5 — the baker: "esse aí já era"
  { t0: 13.6, draw(t, T) {
    const look = T < 15.6;
    const shrug = E.back(inv(15.8, 16.25, T)) * (1 - E.inOut(inv(16.8, 17.1, T)) * 0.3);
    const pad = P_('padeira', { x: 820, y: 900, s: 0.66, t: T, face: look ? 0.7 : 0.05, lx: look ? 1 : 0, ly: look ? -0.2 : 0, expr: look ? 'neutral' : 'smug',
      armL: lerp(18, 80, shrug), armR: lerp(18, 80, shrug), bendL: lerp(12, 80, shrug), bendR: lerp(12, 80, shrug), mouth: talk(T, [[15.76, 16.75]]) });
    const punch = 1 + 0.18 * E.out(inv(15.7, 15.9, T));
    return { cam: (c => ({ ...c, z: c.z * punch }))(push(focus(820, 900 - 0.66 * 300, 3.0, 900), t, 3.5, 0.06)), layers: [
      Lr(0.85, bakeryInterior(T, { clock: false, doorOpen: 1 })),
      Lr(1, pad + counter(560, 812, 600) + basket(700, 795, 0.9) + basket(1000, 798, 0.8)),
    ] };
  } },
  // 6 — a street full of "JÁ VOLTO" signs; neighbours nod
  { t0: 17.1, draw(t, T) {
    const nod = T > 19.8 && T < 21.6 ? Math.sin((T - 19.8) * 7) * 5 : 0;
    const people = P_('viz1', { x: 1180 - t * 50, y: 960, s: 0.6, t: T, face: -0.6, walk: T * 10, expr: 'happy', headTilt: nod }) +
      bench(1580, 960, 0.7) + P_('viz3', { x: 1560, y: 950, s: 0.6, t: T, face: -0.3, expr: 'happy', headTilt: -nod, armL: 30, armR: 30, bendL: 60, bendR: 60 }) +
      P_('viz2', { x: 1700, y: 960, s: 0.6, t: T, face: -0.5, expr: 'neutral', headTilt: nod });
    let cam;
    if (T < 19.7) cam = frameG(lerp(-560, 700, E.inOut(inv(17.1, 19.7, T))), 900, 1.15, 1480);
    else cam = push(frameG(1550, 960, 2.0, 1430), T - 19.7, 2.6, 0.06);
    return { cam, layers: [...backA(t, ['#a8cce0', '#f6ecd0']), Lr(1, streetARow(T, { signs: true }) + people)] };
  } },
  // 7 — day 2: mother searching
  { t0: 22.3, xf: 0.4, draw(t, T) {
    const mx = 500 + t * 90;
    const lf = Math.sin(T * 1.9) * 0.7;
    const mae = P_('mae', { x: mx, y: 930, s: 0.66, t: T, face: lf, lx: lf, walk: T * 8, armR: 150, bendR: 95, armL: 10, expr: 'worried' });
    return { cam: push(frameG(mx, 930, 2.25, 1420), t, 3.2, 0.05), layers: [...backC(t), Lr(1, streetC(t) + lamp(300, 930, 1) + bench(820, 935, 0.8) + mae)] };
  } },
  // 8 — the bus passes; Polo masked in the window, waving
  { t0: 25.5, draw(t, T) {
    const bx = kf(T, [[25.5, -1100], [27.2, -260], [31.0, 900]], E.lin);
    const winX = bx + 30 + 2 * 128 + 55, winY = 1000 - 300 + 40 + 50;
    const waveA = wave(T, 28.3, 31, 165, 22);
    const PT = 'translate(55 178) scale(0.36)';
    const pol = P_('polo', { t: T, face: -0.3, expr: 'happy', armR: waveA != null ? waveA : 10, bendR: 30, lx: -1, shadow: false }) + `<path d="M -50 -300 Q -40 -330 0 -332 Q 40 -330 50 -300 L 44 -262 Q 0 -246 -44 -262 Z" fill="#b8dcec" stroke="${INK9}" stroke-width="4"/><path d="M -50 -298 L -76 -318 M 50 -298 L 76 -318" stroke="#e8f4f8" stroke-width="4"/><path d="M -34 -290 H 34 M -32 -276 H 32" stroke="#88b8d0" stroke-width="3"/>`;
    const pass = [P_('viz2', { t: T, face: 0.3, blink: 0.9, shadow: false }), P_('viz1', { t: T, face: -0.3, expr: 'happy', shadow: false }), pol, P_('moca', { t: T, face: 0.4, shadow: false }), ''];
    const busSvg = bus(bx, 1000, { t: T, wheel: T * 400, passengers: pass, driver: P_('motorista', { t: T, face: 0.6, shadow: false }), pT: PT, dT: 'translate(66 178) scale(0.36)' });
    const shocked = T > 28.2;
    const mae = P_('mae', { x: 330, y: 960, s: 0.66, t: T, face: 0.7, lx: 1, expr: shocked ? 'surprised' : 'worried', armL: shocked ? 120 : 10, armR: shocked ? 120 : 150, bendL: shocked ? 80 : 12, bendR: shocked ? 80 : 95 });
    let cam;
    if (T < 27.3) cam = push(frameG(380, 960, 2.0, 1420), t, 1.8, 0.05);
    else cam = focus(winX, winY, lerp(2.2, 3.4, E.out(inv(27.3, 28.0, T))), 860);
    return { cam, layers: [...backC(t), Lr(1, streetC(t, 880) + lamp(1500, 880, 1) + (T < 27.3 ? mae : '') + busSvg + speedLines(bx - 40, 820, 6, 120, 0, 0.6, Math.floor(T * 8)) + (T >= 27.3 ? '' : ''))],
      over: comic(T, 25.75, 'VRUUUM!', 540, 560, { size: 100, life: 1.1, rot: -5, fill: '#ffffff' }) };
  } },
  // 9 — she shouts, runs, raises her arms
  { t0: 31.0, draw(t, T) {
    const bx = 760 + t * 420;
    const run = T > 32.0 && T < 34.7;
    const mx = 380 + 380 * E.inOut(inv(32.0, 34.9, T));
    const arms = T > 32.74 ? (T < 34.9 ? 168 + Math.sin(T * 16) * 10 : lerp(168, 12, E.inOut(inv(34.9, 35.4, T)))) : (T > 31.3 ? 70 : 12);
    const mae = P_('mae', { x: mx, y: 960, s: 0.66, t: T, face: 0.8, lx: 1, walk: run ? T * 20 : null, armL: arms, armR: arms, bendL: 15, bendR: 15, expr: T < 34.6 ? 'surprised' : 'sad', mouth: T > 31.38 && T < 32.1 ? 0.9 : 0, tilt: run ? 8 : 0 });
    const puff = Array.from({ length: 5 }, (_, i) => { const ph = (T * 1.5 + i / 5) % 1; return `<circle cx="${f2(bx - 20 - ph * 200)}" cy="${f2(960 - ph * 40)}" r="${f2(14 + ph * 34)}" fill="#e0dcd6" opacity="${f2(0.6 * (1 - ph))}"/>`; }).join('');
    return { cam: frameG(mx + 160, 960, 1.4, 1440), layers: [...backC(t), Lr(1, streetC(t, 880) + puff + bus(bx, 1000, { t: T, wheel: T * 500, passengers: ['', '', '', '', ''], driver: P_('motorista', { t: T, face: 0.6, shadow: false }), dT: 'translate(66 178) scale(0.36)' }) + mae)],
      over: comic(T, 31.38, 'POLOOO!', 540, 520, { size: 110, life: 0.9, fill: '#ff8a5a' }) + comic(T, 34.3, 'VRUUM...', 640, 640, { size: 80, life: 1.0, fill: '#ffffff', rot: 6 }) };
  } },
  // 10 — driver waves back: "já volto também"
  { t0: 35.5, draw(t, T) {
    const scroll = (T * 900) % 2400;
    let bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#c4d8de"/>`;
    for (let i = 0; i < 8; i++) { const x = ((i * 420 - scroll) % 3000 + 3000) % 3000 - 600; bg += `<rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="${['#aec4d0', '#e8d8c0', '#c8dcc8'][i % 3]}"/>`; }
    bg += speedLines(1700, 500, 12, 300, 0, 0.45, Math.floor(T * 10));
    const waveA = wave(T, 36.3, 39.4, 160, 22);
    const drv = P_('motorista', { x: 985, y: 1100, s: 1.55, t: T, face: -0.5, lx: -1, expr: T > 38.25 ? 'smug' : 'happy', wink: true, armL: waveA != null ? waveA : 12, bendL: 30, mouth: talk(T, [[38.32, 39.15]]), shadow: false });
    const panel = `<path fill-rule="evenodd" d="M -400 -600 H 2400 V 1800 H -400 Z M 470 210 H 1450 Q 1500 210 1500 260 V 900 H 470 Z" fill="#f2c230" stroke="${INK}" stroke-width="6"/><rect x="-400" y="960" width="2800" height="70" fill="#3c8a86" stroke="${INK}" stroke-width="5"/><rect x="455" y="195" width="1060" height="720" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>`;
    return { cam: { ...push(focus(985, 560, 1.15), t, 4, 0.06), r: -3 }, layers: [Lr(0.4, bg), Lr(1, `<rect x="470" y="210" width="1030" height="700" fill="#3a4650"/><rect x="760" y="300" width="420" height="600" rx="30" fill="#4a3434" stroke="${INK}" stroke-width="4"/>` + drv + `<path d="M 470 210 L 760 210 L 470 560 Z" fill="#ffffff" opacity="0.12"/>` + panel)] };
  } },
  // 11 — day 3: a giant clock appears
  { t0: 39.6, xf: 0.4, draw(t, T) {
    const rise = E.back(inv(40.9, 42.1, T));
    const shake = T > 42.0 && T < 42.4 ? Math.sin(T * 90) * 8 * (1 - inv(42.0, 42.4, T)) : 0;
    const surprised = T > 41.6;
    const crowd = [['barnabe', 1120], ['menino', 1230], ['mulher', 1470], ['moca', 1580]].map(([id, x], i) => P_(id, { x, y: 960, s: 0.42, t: T, face: x < 1350 ? 0.6 : -0.6, lx: x < 1350 ? 1 : -1, ly: surprised ? -1 : 0, expr: surprised ? 'surprised' : 'happy', armL: surprised ? 70 : 10, armR: surprised ? 70 : 10, jump: surprised ? 20 * pulse(T, 41.9 + i * 0.07, 0.2) : 0 })).join('');
    const cloud = T > 40.9 ? Array.from({ length: 9 }, (_, i) => { const ph = clamp((T - 40.9) / 1.6); return `<circle cx="${f2(1350 + (i - 4) * 50 * (0.6 + ph))}" cy="${f2(890 - ph * 40 - (i % 3) * 20)}" r="${f2(30 + ph * 40)}" fill="#f4ead4" opacity="${f2(0.85 * (1 - ph))}"/>`; }).join('') : '';
    const c = lerpCam(focus(1350, 760, 1.25), focus(1350, 560, 1.05), E.inOut(inv(40.6, 42.4, T)));
    return { cam: { ...c, y: c.y + shake }, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + tower(T, 1350, 0.8, { rise }) + cloud + crowd)],
      over: comic(T, 42.05, 'BLÉM!', 540, 380, { size: 130, life: 1.0, fill: '#ffd23f', rot: 6 }) };
  } },
  // 12 — nobody knows who put it there
  { t0: 43.1, draw(t, T) {
    const sc = Math.sin(T * 12) * 8;
    const grp = P_('barnabe', { x: 1180, y: 960, s: 0.5, t: T, face: 0.4, expr: 'worried', armL: 150 + sc, bendL: 80, ly: -0.6 }) +
      P_('menino', { x: 1290, y: 960, s: 0.5, t: T, face: -0.2, expr: 'worried', armL: 80, armR: 80, bendL: 70, bendR: 70, ly: -1 }) +
      P_('mulher', { x: 1420, y: 960, s: 0.5, t: T, face: -0.5, expr: 'neutral', armR: 150 - sc, bendR: 80, lx: -1 }) +
      P_('moca', { x: 1530, y: 960, s: 0.5, t: T, face: -0.4, expr: 'worried', armL: 60, armR: 60, bendL: 60, bendR: 60, headTilt: Math.sin(T * 3) * 6 });
    return { cam: push(frameG(1355, 960, 1.55, 1420), t, 1.6, 0.05), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 1350, 0.8)), Lr(1, grp)],
      over: comic(T, 43.4, '???', 540, 560, { size: 120, life: 1.2, fill: '#ffffff' }) };
  } },
  // 13 — the hand only moves when someone says "já volto"
  { t0: 44.7, draw(t, T) {
    const ca = clockAngles(T), S = plazaSky(T);
    const kick = pulse(T, 46.95, 0.25);
    return { cam: (c => ({ ...c, z: c.z + kick * 0.04 }))(push(focus(960, 560, 0.8), t, 3.3, 0.1)), layers: [Lr(0.05, sky(S.top, S.bot, { id: 'p13' })), Lr(0.15, clouds(T, '#fff6ea', 0.8, 13, 0)),
      Lr(1, `<path d="M 960 -360 L 380 120 L 1540 120 Z" fill="#3c6a5a" stroke="${INK}" stroke-width="8"/><rect x="560" y="900" width="800" height="900" fill="#a85a3a" stroke="${INK}" stroke-width="8"/>` + clockFace(960, 560, 390, ca.hour, ca.min, { day: `${ca.days} DIAS`, glow: kick }))],
      over: comic(T, 46.9, 'TÉC!', 540, 1260, { size: 120, life: 0.7 }) };
  } },
  // 14 — Barnabé: clock jumps two hours
  { t0: 48.0, draw(t, T) {
    const after = T > 52.85;
    const bar = P_('barnabe', { x: 600, y: 1000, s: 0.85, t: T, face: after ? 0.5 : 0.15, lx: after ? 1 : 0, ly: after ? -1 : 0, expr: after ? 'surprised' : (T > 50.5 ? 'laugh' : 'happy'),
      armL: (() => { const w = wave(T, 51.3, 52.0, 130, 25); return w != null ? w : 12; })(), bendL: 30, armR: 25, bendR: 30, mouth: talk(T, [[50.6, 50.9], [51.3, 51.85]]), tilt: T > 50.5 && T < 52 ? Math.sin(T * 10) * 3 : 0 });
    let cam;
    if (T > 52.8 && T < 53.7) cam = focus(760, 880 - 720 * 0.6, 2.6);
    else cam = push(frameG(640, 1000, 1.7, 1420), t, 6, 0.08);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { glow: pulse(T, 53.0, 0.4), blur: pulse(T, 53.1, 0.35) })), Lr(1, bar + ripple(720, 640, inv(51.3, 52.2, T)))],
      tint: nightTint(T), over: comic(T, 52.85, 'TÉC TÉC!', 540, 1180, { size: 100, life: 0.8 }) };
  } },
  // 15 — the boy: a whole day goes by
  { t0: 54.3, draw(t, T) {
    const shout = T > 55.8 && T < 56.4;
    const boy = P_('menino', { x: 600, y: 1000, s: 1.15, t: T, face: T > 56.5 ? 0.5 : 0.1, ly: T > 56.5 ? -1 : 0, lx: T > 56.5 ? 1 : 0, expr: shout ? 'laugh' : (T > 56.5 ? 'surprised' : 'happy'),
      armL: shout ? 165 : (T > 56.5 ? 80 : 12), armR: shout ? 165 : (T > 56.5 ? 80 : 12), bendL: 15, bendR: 15, mouth: shout ? 1 : 0, jump: 26 * pulse(T, 56.0, 0.25) });
    const up = E.inOut(inv(56.6, 57.3, T));
    const cam = lerpCam(push(frameG(620, 1000, 1.9, 1420), t, 2.3, 0.06), focus(720, 400, 1.2), up);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { blur: clamp(spinSpeed(T) / 20), glow: pulse(T, 57.2, 0.6) })), Lr(1, lamp(400, 1000, 0.9, plazaSky(T).night) + boy)],
      tint: nightTint(T), over: comic(T, 55.86, 'JÁ VOLTO!', 540, 560, { size: 100, life: 0.6, fill: '#ff8a5a' }) + comic(T, 56.8, 'VUUUSH', 540, 1200, { size: 110, life: 0.9, fill: '#ffffff' }) };
  } },
  // 16 — woman in glasses: three "já volto"
  { t0: 58.0, draw(t, T) {
    const calls = [59.88, 60.40, 60.94];
    let flick = 0; for (const c of calls) flick = Math.max(flick, pulse(T, c + 0.1, 0.18));
    const wom = P_('mulher', { x: 600, y: 1000, s: 0.85, t: T, face: 0.2, expr: 'laugh', mouth: 0.6, armL: 40 + flick * 110, bendL: 30, armR: 30, bendR: 60, tilt: Math.sin(T * 9) * 3 + flick * 4 });
    const kick = calls.reduce((a, c) => a + pulse(T, c + 0.05, 0.12) * 0.06, 0);
    return { cam: (c => ({ ...c, z: c.z * (1 + kick) }))(push(frameG(640, 1000, 1.7, 1420), t, 3.7, 0.08)), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { glow: flick * 0.8 })), Lr(1, bench(560, 1010, 0.9) + wom)],
      tint: nightTint(T), over: calls.map((c, i) => comic(T, c + 0.05, 'TÉC!', [300, 780, 540][i], [1150, 1100, 1220][i], { size: 90, life: 0.45, rot: [-10, 8, -4][i] })).join('') };
  } },
  // 17 — a girl whispers… time goes crazy
  { t0: 61.7, draw(t, T) {
    const sp = clamp(spinSpeed(T) / 30);
    const whisper = T > 63.4 && T < 64.15, after = T > 64.9;
    const moca = P_('moca', { x: 600, y: 1000, s: 0.95, t: T, face: after ? 0.6 : (T < 63.2 ? Math.sin((T - 61.7) * 3) * 0.5 : 0.35), lx: after ? 1 : 0.5, ly: after ? -1 : 0, expr: after ? 'surprised' : 'smug',
      armR: whisper || T < 64.6 ? 150 : 30, bendR: whisper || T < 64.6 ? 110 : 20, armL: 12, mouth: talk(T, [[63.44, 64.05]]) * 0.4 });
    const p = E.inOut(inv(64.9, 66.6, T)), back = E.inOut(inv(67.9, 68.6, T));
    const c0 = push(focus(600, 1000 - 0.95 * 0.95 * 320, 3.0, 900), t, 3.2, 0.08), c1 = focus(760, 880 - 720 * 0.6, 4.2), c2 = focus(700, 700, 1.4);
    let cam = lerpCam(lerpCam(c0, c1, p), c2, back);
    cam.r = Math.sin((T - 64.9) * 2.2) * 7 * p * (1 - back);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { blur: sp, glow: sp * 0.8 })), Lr(1, moca + (whisper ? ripple(680, 690, inv(63.44, 64.1, T), '#f4d6de') : ''))],
      tint: nightTint(T), over: (sp > 0.05 ? speedLines(540, 960, 12, 360, (T * 300) % 360, sp * 0.35, Math.floor(T * 12)) : '') + comic(T, 63.5, 'psiu...', 760, 640, { size: 70, life: 0.7, fill: '#f8c8d8', rot: 8 }) + comic(T, 65.3, 'TIC-TIC-TIC', 540, 1180, { size: 96, life: 2.4, fill: '#ffd23f' }) };
  } },
  // 18 — Polo returns: "já voltei!"
  { t0: 68.6, xf: 0.3, draw(t, T) {
    const walkT = inv(68.9, 71.6, T);
    const px = lerp(250, 700, E.out(walkT));
    const cheer = T > 72.85;
    const polo = P_('polo', { x: px, y: 1000, s: 0.85, t: T, face: walkT < 1 ? 0.7 : 0.1, walk: walkT > 0 && walkT < 0.97 ? T * 11 : null, expr: cheer ? 'joy' : 'happy',
      armR: cheer ? 165 : 40, bendR: cheer ? 10 : 60, armL: cheer ? 165 : 14 + (walkT < 1 ? Math.sin(T * 11) * 14 : 0), bendL: 10, holdR: bread({ s: 0.6, rot: cheer ? -30 : 10 }), mouth: talk(T, [[72.88, 73.35]]), jump: 34 * pulse(T, 73.05, 0.22) });
    return { cam: push(frameG(px, 1000, 2.0, 1420), t, 5.4, 0.06), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 1000, 0.6)), Lr(1, polo)],
      over: comic(T, 72.9, 'JÁ VOLTEI!', 540, 520, { size: 110, life: 1.0, fill: '#ffd23f', rot: -6 }) };
  } },
  // 19 — the bread is hard as stone
  { t0: 74.0, draw(t, T) {
    const stone = E.inOut(inv(74.2, 74.9, T));
    const hit1 = pulse(T, 74.97, 0.12), hit2 = pulse(T, 75.45, 0.12);
    const fistY = kf(T, [[74.0, 260], [74.75, 240], [74.95, 525], [75.15, 300], [75.42, 525], [75.6, 280], [76.1, 260]]);
    const vib = (hit1 + hit2) * Math.sin(T * 120) * 8;
    const bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#f0d4a0"/><circle cx="700" cy="200" r="260" fill="#f8e4b8" opacity="0.7"/><rect x="-600" y="760" width="3200" height="1200" fill="#d8c09a"/>`;
    const fist = `<g transform="translate(980 ${f2(fistY)})"><path d="M 0 -900 L 0 -80" stroke="${INK9}" stroke-width="96" stroke-linecap="round"/><path d="M 0 -900 L 0 -80" stroke="#f2c230" stroke-width="82" stroke-linecap="round"/><rect x="-50" y="-120" width="100" height="34" rx="10" fill="#d9a516" stroke="${INK9}" stroke-width="5"/><path d="M -58 -86 Q -66 10 0 14 Q 66 10 58 -86 Z" fill="#1d1a22" stroke="${INK9}" stroke-width="6"/><path d="M -30 -10 q 10 -12 20 0 M 0 -10 q 10 -12 20 0" stroke="#4a4458" stroke-width="4" fill="none"/></g>`;
    return { cam: push(focus(960, 560, 1.15), t, 2.1, 0.05), layers: [Lr(0.3, bg), Lr(1, `<ellipse cx="960" cy="700" rx="300" ry="46" fill="#1b1424" opacity="0.22"/><g transform="translate(${f2(960 + vib)} 620)">${bread({ s: 4.2, stone, cracks: clamp((T - 74.97) / 0.3) })}</g>` + fist)],
      over: comic(T, 74.97, 'TOC!', 300, 1180, { size: 130, life: 0.45 }) + comic(T, 75.45, 'TOC!', 780, 1140, { size: 130, life: 0.6, rot: 8 }) };
  } },
  // 20 — the baker had retired
  { t0: 76.1, draw(t, T) {
    const rock = Math.sin(T * 2.2) * 5, needle = Math.sin(T * 9) * 10;
    const knit = `<path d="M -6 -6 l 40 -34" stroke="#c9a24a" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="8" r="16" fill="#d0704a" stroke="${INK}" stroke-width="3"/>`;
    const old = rockingChair(700, 900, rock) + `<g transform="rotate(${f2(rock)} 700 900)">${P_('padeira', { x: 700, y: 880, s: 0.62, old: true, t: T, face: 0.25, expr: T > 78.3 ? 'happy' : 'joy', armL: 40 + needle * 0.4, armR: 40 - needle * 0.4, bendL: 80, bendR: 80, holdR: knit, shadow: false })}</g>`;
    const px = lerp(1250, 960, E.out(inv(76.4, 77.6, T)));
    const polo = P_('polo', { x: px, y: 910, s: 0.62, t: T, face: -0.7, lx: -1, walk: T < 77.5 ? T * 11 : null, expr: T > 78.5 ? 'surprised' : 'happy', holdR: bread({ s: 0.45, stone: 1, cracks: 1 }), armR: 30, bendR: 50, armL: 10 });
    const cam = T < 78.3 ? push(frameG(760, 900, 2.3, 1420), t, 2.2, 0.06) : push(frameG(950, 910, 2.6, 1420), T - 78.3, 1.3, 0.05);
    return { cam, layers: [...backA(t, ['#eaa070', '#f8d8a8']), Lr(1, streetARow(T, {}) + old + polo)], tint: ['#e8a070', 0.1] };
  } },
  // 21 — nine days had passed
  { t0: 79.6, draw(t, T) {
    const cx = 1050, cy = 880 - 720 * 0.8;
    const up = E.inOut(inv(79.9, 81.1, T)), push2 = E.inOut(inv(81.3, 81.9, T)), down = E.inOut(inv(82.4, 83.2, T));
    const polo = P_('polo', { x: 980, y: 1000, s: 0.9, t: T, face: 0.25, lx: 0.4, ly: -1, expr: T > 82.3 ? 'surprised' : 'neutral', holdR: bread({ s: 0.5, stone: 1, cracks: 1 }), armR: T > 82.3 ? 70 : 25, bendR: 40, armL: T > 82.3 ? 70 : 12, mouth: T > 82.3 ? 0.8 : 0 });
    const cPolo = frameG(990, 1000, 1.8, 1500), cClock = focus(cx, cy, 2.0), cDay = focus(cx, cy + 0.8 * 150 * 0.35, 4.0);
    const cam = lerpCam(lerpCam(lerpCam(cPolo, cClock, up), cDay, push2), frameG(990, 1000, 2.0, 1450), down);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + tower(T, cx, 0.8, { glow: pulse(T, 81.9, 0.6) })), Lr(1.1, polo)],
      over: comic(T, 82.4, 'O QUÊ?!', 540, 520, { size: 110, life: 1.0, fill: '#ff8a5a' }) };
  } },
  // 22 — CTA: Polo flips the sign to "VOLTO"
  { t0: 83.5, xf: 0.4, draw(t, T) {
    const flip = E.inOut(inv(88.15, 88.6, T));
    const point = T > 87.7 && T < 88.7;
    const waveA = wave(T, 88.7, 89.6, 165, 20);
    const shrug = E.back(inv(84.4, 84.9, T)) * (1 - E.inOut(inv(86.9, 87.4, T)));
    const polo = P_('polo', { x: 470, y: 905, s: 0.7, t: T, face: point ? -0.5 : 0.05, expr: T < 86.9 ? 'smug' : 'happy', lx: point ? -1 : 0,
      armR: waveA != null ? waveA : lerp(25, 80, shrug), bendR: waveA != null ? 25 : lerp(50, 80, shrug), armL: point ? 95 : lerp(12, 80, shrug), bendL: point ? 5 : lerp(12, 80, shrug), holdR: waveA == null ? bread({ s: 0.45, stone: 1, cracks: 1, rot: -20 }) : '' });
    const sign = hangSign(285, 745, 'JÁ VOLTO', Math.sin(T * 1.5) * 2 + pulse(T, 88.6, 0.3) * 6, { w: 176, h: 62, fs: 28, flip, text2: 'VOLTO' });
    return { cam: push(frameG(365, 905, 1.8, 1430), t, 6.1, 0.1), layers: [
      Lr(0.04, sky('#c86a7a', '#f6b07a', { sun: 560, sunX: 1650, sunC: '#ffe0a8', sunR: 110, id: 'e' })), Lr(0.1, clouds(T, '#f8c0a8', 0.85, 5, 40)), Lr(0.3, farTown('#9a5a6a', 760, 5) + haze('#f6b07a', 400, 900, 0.5)),
      Lr(1, bakeryFacade(-200, 900, { t: T, sign: false, night: true }) + sign + polo + lamp(640, 905, 0.9, 1) + dust(T, 0, 400, 800, 500, 16, 9, '#ffe7a0')),
    ], tint: ['#f08a8a', 0.08] };
  } },
];
