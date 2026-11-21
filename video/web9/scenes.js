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
  if (y > 900) y = y - 680; x = clamp(x, 260, 780);
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
  s += street(base, { walk: '#e6d6b8', road: '#9a96a0' });
  if (o.pigeons !== false) for (const [px, sd] of [[520, 3], [610, 4], [1180, 5], [2080, 6], [-420, 7]]) s += pigeon(px, base + 34, t, sd, 0.9, o.fly);
  if (o.walkers) s += walkers(t, base + 30, 0.42, 17, 5, 3600);
  return s;
}
const backA = (t, sk) => [Lr(0.04, sky(sk[0], sk[1], { sun: 120, sunX: 1450, id: 'a' })), Lr(0.1, clouds(t, '#fff6ea', 0.85, 3, 40)), Lr(0.3, farTown('#e0b48a', 720, 5) + haze('#f8e6c4', 300, 900, 0.55))];
function streetC(t, base = 880) {
  let s = ''; const r = rng(21); let x = -1400;
  const walls = ['#c8dce8', '#e8d8c0', '#d8e8d0', '#e8c8c8', '#d0d0e8'];
  while (x < 3600) { const w = 300 + r() * 160, h = 380 + r() * 220; s += house(x, base, w, h, { wall: walls[Math.floor(r() * 5)], roof: mix('#5a7a9a', '#9a6a6a', r()), windows: 2, flat: r() < 0.5, glass: '#7a9ab0', shutters: r() < 0.4 ? '#5a7a9a' : null, seed: (x | 0) }); x += w + 40 + r() * 40; }
  s += street(base, { walk: '#d8d4c8', road: '#8a8a92' });
  s += busStop(240, base + 40) + fruitStall(1000, base + 40, t);
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
  s += walkers(t, 800, 0.3, 23, 6, 3800);
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


function busStop(x, base) {
  return `<g><rect x="${x - 120}" y="${base - 300}" width="12" height="300" fill="#5a6a7a" stroke="${INK}" stroke-width="3"/><rect x="${x + 110}" y="${base - 300}" width="12" height="300" fill="#5a6a7a" stroke="${INK}" stroke-width="3"/>
  <path d="M ${x - 140} ${base - 300} L ${x + 140} ${base - 300} L ${x + 130} ${base - 330} L ${x - 130} ${base - 330} Z" fill="#3c8a86" stroke="${INK}" stroke-width="4"/>
  <rect x="${x - 100}" y="${base - 280}" width="200" height="150" rx="6" fill="#cfe6ee" stroke="${INK}" stroke-width="3" opacity="0.75"/><path d="M ${x - 90} ${base - 160} L ${x - 30} ${base - 270}" stroke="#fff" stroke-width="6" opacity="0.5"/>
  <rect x="${x - 100}" y="${base - 70}" width="200" height="14" rx="4" fill="#a46a3a" stroke="${INK}" stroke-width="3"/><path d="M ${x - 84} ${base - 56} V ${base} M ${x + 84} ${base - 56} V ${base}" stroke="${INK}" stroke-width="6"/>
  <rect x="${x + 150}" y="${base - 380}" width="10" height="380" fill="#4a4a5a" stroke="${INK}" stroke-width="3"/><rect x="${x + 120}" y="${base - 440}" width="70" height="70" rx="35" fill="#f2c230" stroke="${INK}" stroke-width="4"/>
  <text x="${x + 155}" y="${base - 396}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="#211c26">PONTO</text></g>`;
}
function fruitStall(x, base, t) {
  let s = `<rect x="${x - 120}" y="${base - 120}" width="240" height="120" fill="#b87a4a" stroke="${INK}" stroke-width="4"/><rect x="${x - 120}" y="${base - 120}" width="240" height="120" fill="url(#pWoodV)"/>`;
  s += `<path d="M ${x - 130} ${base - 120} V ${base - 300} M ${x + 130} ${base - 120} V ${base - 300}" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M ${x - 150 + i * 50} ${base - 300} h 50 v 40 q -25 18 -50 0 Z" fill="${i % 2 ? '#fff4dc' : '#e86a4a'}" stroke="${INK}" stroke-width="3"/>`;
  const fr = [['#e86a4a', 0], ['#f2c230', 1], ['#7ab06a', 2], ['#f08a3a', 3]];
  fr.forEach(([c, k]) => { for (let j = 0; j < 4; j++) s += `<circle cx="${x - 95 + k * 60 + (j % 2) * 18}" cy="${base - 128 - Math.floor(j / 2) * 16}" r="11" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`; });
  return s;
}
