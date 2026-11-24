// Especial "Hospital Santa Clara" — cenário e objetos, desenhados em coordenadas de tela (1080 x 1920).
// Paleta: azul-noite, cinza azulado, creme velho e vermelho de alarme. NADA verde (chroma key).
const HC = { night: '#0c1022', night2: '#1a2040', wall: '#7d8aa0', wallD: '#4e5870', wallL: '#a8b4c6', floor: '#3a4256', floorD: '#262c3c', tile: '#56607a', cream: '#d8d2c0', red: '#e8323a', redD: '#8a1820', metal: '#9aa2b2', metalD: '#5a6274', glass: '#b8d4ec', ink: '#14101a' };
const OLh = '#14101a';
const L = (d, svg) => ({ d, svg });               // camada em coordenadas de tela
const C = (z = 1, x = 0, y = 0, r = 0) => ({ x, y, z, r }); // câmera de tela (z = zoom em torno do centro)
const shakeC = (T, amt, z = 1) => C(z, Math.sin(T * 61) * amt, Math.cos(T * 47) * amt);
const alarmK = T => 0.5 + 0.5 * Math.sin(T * 9);  // pisca do alarme

function rect(x, y, w, h, fill, o = '') { return `<rect x="${f2(x)}" y="${f2(y)}" width="${f2(w)}" height="${f2(h)}" fill="${fill}" ${o}/>`; }
const fullBg = c => rect(-600, -600, 2280, 3120, c);

// chuva diagonal
function rain(T, n = 90, op = 0.55, seed = 3) {
  const r = rng(seed); let s = `<g stroke="#b4c4e4" stroke-width="3" stroke-linecap="round" opacity="${op}">`;
  for (let i = 0; i < n; i++) { const x0 = r() * 1400 - 200, v = 1800 + r() * 900, y = ((r() * 2400 + T * v) % 2400) - 300, x = x0 - (y + 300) * 0.18; s += `<path d="M ${f2(x)} ${f2(y)} l -11 ${f2(44 + r() * 30)}"/>`; }
  return s + '</g>';
}
// poeira caindo / partículas
function specks(T, x, y, w, h, n, c = '#d8d2c0', seed = 5, fall = 60) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const yy = y + ((r() * h + T * fall * (0.5 + r())) % h); s += `<circle cx="${f2(x + r() * w + Math.sin(T * 2 + i) * 6)}" cy="${f2(yy)}" r="${f2(1.5 + r() * 3)}" fill="${c}" opacity="${f2(0.3 + r() * 0.4)}"/>`; }
  return s;
}

// ---------- FACHADA ----------
function facade(T, o = {}) {
  const ak = o.alarm ? alarmK(T) : 0;
  let s = fullBg(HC.night);
  s += `<radialGradient id="hMoon"><stop offset="0" stop-color="#cdd6f0" stop-opacity="0.5"/><stop offset="1" stop-color="#cdd6f0" stop-opacity="0"/></radialGradient>`;
  s += `<circle cx="860" cy="230" r="230" fill="url(#hMoon)"/><circle cx="860" cy="230" r="62" fill="#dfe4f2" stroke="${OLh}" stroke-width="5"/><circle cx="840" cy="216" r="12" fill="#c4cadc"/>`;
  // nuvens escuras
  for (let i = 0; i < 5; i++) s += `<ellipse cx="${f2(((i * 330 + T * 14) % 1600) - 250)}" cy="${170 + (i % 3) * 70}" rx="230" ry="46" fill="#232a4c" opacity="0.8"/>`;
  // prédio
  s += rect(70, 520, 940, 900, '#4a5068', `stroke="${OLh}" stroke-width="8"`);
  s += rect(70, 520, 940, 900, 'url(#pBrick)', 'opacity="0.6"');
  s += `<path d="M 40 520 L 540 330 L 1040 520 Z" fill="#363a52" stroke="${OLh}" stroke-width="8" stroke-linejoin="round"/>`;
  // cruz vermelha (pintura gasta)
  s += `<g transform="translate(540 440)"><rect x="-16" y="-48" width="32" height="96" fill="${HC.redD}"/><rect x="-48" y="-16" width="96" height="32" fill="${HC.redD}"/></g>`;
  // janelas (algumas quebradas)
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = 130 + c * 220, y = 640 + r * 190, broken = (r * 4 + c) % 3 === 1, lit = o.alarm && (r * 4 + c) === 5;
    s += rect(x, y, 140, 120, lit ? mix('#3a1418', HC.red, ak) : '#1a1e30', `stroke="${OLh}" stroke-width="6"`);
    s += `<path d="M ${x + 70} ${y} V ${y + 120} M ${x} ${y + 60} H ${x + 140}" stroke="${OLh}" stroke-width="5"/>`;
    if (broken) s += `<path d="M ${x + 10} ${y + 10} L ${x + 50} ${y + 50} L ${x + 30} ${y + 70} L ${x + 64} ${y + 110}" stroke="#8a94b0" stroke-width="3" fill="none"/>`;
    if (lit) s += `<circle cx="${x + 70}" cy="${y + 60}" r="${f2(150 + ak * 60)}" fill="${HC.red}" opacity="${f2(0.18 * ak)}"/>`;
  }
  // letreiro (letras apagadas)
  const sign = 'HOSPITAL SANTA CLARA';
  s += rect(150, 560, 780, 70, '#1e2236', `stroke="${OLh}" stroke-width="6" rx="8"`);
  s += `<text x="540" y="612" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="50" letter-spacing="3">` +
    sign.split('').map((ch, i) => `<tspan fill="${[3, 9, 15].includes(i) ? '#4a4e66' : '#e8dcc0'}">${ch === ' ' ? '&#160;' : ch}</tspan>`).join('') + '</text>';
  // porta enferrujada
  const dx = o.doorX ?? 420;
  s += rect(dx - 10, 1110, 260, 310, '#141624', `stroke="${OLh}" stroke-width="7"`);
  s += `<g transform="translate(${dx} 1110) ${o.doorOpen ? `scale(${f2(1 - o.doorOpen * 0.85)} 1)` : ''}">${rect(0, 0, 240, 310, '#8a5a3e', `stroke="${OLh}" stroke-width="7"`)}${rect(20, 20, 200, 120, '#7a4a30')}<circle cx="210" cy="170" r="11" fill="${HC.metal}" stroke="${OLh}" stroke-width="4"/><path d="M 30 200 q 30 30 70 10 M 140 60 q 20 30 50 10" stroke="#5a3020" stroke-width="10" fill="none" opacity="0.7"/></g>`;
  // chão molhado
  s += rect(-200, 1410, 1480, 800, '#1c2034');
  s += `<path d="M -200 1410 H 1280" stroke="${OLh}" stroke-width="8"/>`;
  for (let i = 0; i < 6; i++) s += `<ellipse cx="${120 + i * 180}" cy="${1500 + (i % 2) * 60}" rx="70" ry="10" fill="#4a5478" opacity="0.5"/>`;
  if (o.alarm) s += rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.1 * ak)}"`);
  return s;
}

// ---------- CORREDOR em perspectiva (ponto de fuga) ----------
function corridor(T, o = {}) {
  const vx = o.vx ?? 540, vy = o.vy ?? 700, dark = o.dark || 0, ak = o.alarm ? alarmK(T) : 0;
  const wc = mix(HC.wall, '#1a1e2c', dark), wd = mix(HC.wallD, '#10131e', dark), fl = mix(HC.floor, '#0e1018', dark), ce = mix('#5a6478', '#0c0e16', dark);
  let s = fullBg(wd);
  // fundo
  const bw = 150, bh = 200;
  s += `<path d="M -300 -300 L ${vx - bw} ${vy - bh} L ${vx + bw} ${vy - bh} L 1380 -300 Z" fill="${ce}"/>`;
  s += `<path d="M -300 2300 L ${vx - bw} ${vy + bh} L ${vx + bw} ${vy + bh} L 1380 2300 Z" fill="${fl}"/>`;
  s += `<path d="M -300 -300 L ${vx - bw} ${vy - bh} L ${vx - bw} ${vy + bh} L -300 2300 Z" fill="${wc}"/>`;
  s += `<path d="M 1380 -300 L ${vx + bw} ${vy - bh} L ${vx + bw} ${vy + bh} L 1380 2300 Z" fill="${mix(wc, wd, 0.4)}"/>`;
  s += rect(vx - bw, vy - bh, bw * 2, bh * 2, o.endWall ? mix('#6a7488', '#141824', dark) : mix('#20263a', '#06070c', dark), `stroke="${OLh}" stroke-width="5"`);
  // linhas do piso e faixa de rodapé
  for (let i = -6; i <= 6; i++) s += `<path d="M ${vx + i * 25} ${vy + bh} L ${vx + i * 260} 2300" stroke="${OLh}" stroke-width="2.5" opacity="0.35"/>`;
  for (let k = 1; k < 9; k++) { const p = Math.pow(k / 9, 2.2), y = vy + bh + p * 1700, hw = bw + p * (1380 - bw - vx + 540); s += `<path d="M ${vx - hw} ${f2(y)} H ${vx + hw}" stroke="${OLh}" stroke-width="2" opacity="0.3"/>`; }
  for (const sd of [-1, 1]) s += `<path d="M ${vx + sd * bw} ${vy + bh - 40} L ${vx + sd * 1300} ${vy + bh + 900}" stroke="${mix(HC.cream, '#20242e', dark)}" stroke-width="22" opacity="0.8"/>`;
  // portas laterais
  for (let k = 0; k < 3; k++) for (const sd of [-1, 1]) {
    const p0 = 0.18 + k * 0.28, p1 = p0 + 0.12, X = p => vx + sd * (bw + p * 1200), Yt = p => vy - bh + 40 - p * 900 * 0.4 + p * 260, Yb = p => vy + bh + p * 760;
    s += `<path d="M ${f2(X(p0))} ${f2(Yt(p0))} L ${f2(X(p1))} ${f2(Yt(p1))} L ${f2(X(p1))} ${f2(Yb(p1))} L ${f2(X(p0))} ${f2(Yb(p0))} Z" fill="${mix('#5a4a44', '#100c0e', dark)}" stroke="${OLh}" stroke-width="4"/>`;
  }
  // luzes do teto
  for (let k = 0; k < 4; k++) {
    const p = 0.08 + k * 0.22, y = vy - bh - p * 900, hw = 40 + p * 220, on = !dark && !(o.flicker && Math.sin(T * 23 + k * 7) > 0.6);
    s += `<path d="M ${f2(vx - hw)} ${f2(y)} L ${f2(vx + hw)} ${f2(y)} L ${f2(vx + hw * 0.85)} ${f2(y - 10 - p * 30)} L ${f2(vx - hw * 0.85)} ${f2(y - 10 - p * 30)} Z" fill="${on ? '#f4efd8' : '#3a3e4c'}" stroke="${OLh}" stroke-width="3"/>`;
    if (on) s += `<ellipse cx="${vx}" cy="${f2(y + 40 + p * 300)}" rx="${f2(hw * 2.2)}" ry="${f2(60 + p * 200)}" fill="#fff6d8" opacity="0.08"/>`;
  }
  if (o.debris) s += debris(o.seed || 4, vx, vy + bh, dark);
  if (o.alarm) s += rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.22 * ak)}"`) + `<circle cx="${vx}" cy="${vy - bh - 30}" r="26" fill="${mix(HC.redD, HC.red, ak)}" stroke="${OLh}" stroke-width="5"/>`;
  return s;
}
function debris(seed, vx, fy, dark = 0) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < 26; i++) { const p = 0.1 + r() * 0.9, y = fy + p * p * 1200, x = vx + (r() * 2 - 1) * (180 + p * 800), k = 0.4 + p * 1.4; s += `<path d="M ${f2(x)} ${f2(y)} l ${f2(14 * k)} ${f2(-18 * k)} l ${f2(10 * k)} ${f2(16 * k)} Z" fill="${mix(HC.glass, '#2a3040', dark)}" stroke="${OLh}" stroke-width="2" opacity="0.85"/>`; }
  s += `<g transform="translate(${vx - 330} ${fy + 360}) scale(0.9) rotate(-8)">${gurney(0, 0, 1, { tipped: 1 })}</g>`;
  s += `<g transform="translate(${vx + 280} ${fy + 140}) scale(0.5) rotate(12)">${gurney(0, 0, 1, { tipped: 1 })}</g>`;
  return s;
}

// ---------- OBJETOS ----------
function gurney(x, y, k = 1, o = {}) {
  let s = `<g transform="translate(${x} ${y}) scale(${k})">`;
  if (o.tipped) s += `<g transform="rotate(-78 0 0)">`;
  s += rect(-170, -150, 340, 34, HC.cream, `stroke="${OLh}" stroke-width="6" rx="8"`) + rect(-170, -170, 120, 24, '#ece6d4', `stroke="${OLh}" stroke-width="5" rx="10"`);
  s += `<path d="M -140 -116 L -120 -30 M 140 -116 L 120 -30 M -120 -60 H 120" stroke="${HC.metalD}" stroke-width="10" stroke-linecap="round"/>`;
  for (const wx of [-120, 120]) s += `<circle cx="${wx}" cy="-16" r="16" fill="#2a2e3a" stroke="${OLh}" stroke-width="5"/>`;
  if (o.tipped) s += '</g>';
  return s + '</g>';
}
function wheelchair(x, y, k, ang, flip = 1) {
  let s = `<g transform="translate(${x} ${y}) scale(${k * flip} ${k})">`;
  s += `<path d="M -70 -260 L -70 -120 L 60 -120 L 80 -40" stroke="${HC.metalD}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += rect(-84, -250, 30, 120, '#3a3a4a', `stroke="${OLh}" stroke-width="5" rx="6"`) + rect(-70, -140, 120, 26, '#3a3a4a', `stroke="${OLh}" stroke-width="5" rx="6"`);
  s += `<path d="M -70 -260 l -30 -10" stroke="${OLh}" stroke-width="14" stroke-linecap="round"/>`;
  s += `<g transform="translate(-30 -80) rotate(${f2(ang)})"><circle r="80" fill="none" stroke="${OLh}" stroke-width="12"/><circle r="80" fill="none" stroke="${HC.metal}" stroke-width="6"/>${[0, 45, 90, 135].map(a => `<path d="M ${f2(-78 * Math.cos(a * Math.PI / 180))} ${f2(-78 * Math.sin(a * Math.PI / 180))} L ${f2(78 * Math.cos(a * Math.PI / 180))} ${f2(78 * Math.sin(a * Math.PI / 180))}" stroke="${HC.metal}" stroke-width="3"/>`).join('')}<circle r="10" fill="${HC.metalD}" stroke="${OLh}" stroke-width="4"/></g>`;
  s += `<circle cx="80" cy="-18" r="18" fill="#2a2e3a" stroke="${OLh}" stroke-width="5"/>`;
  return s + '</g>';
}
// monitor cardíaco: linha VERMELHA (não verde)
function monitor(x, y, k, T, on) {
  let s = `<g transform="translate(${x} ${y}) scale(${k})">` + rect(-150, -110, 300, 220, '#2a2e3a', `stroke="${OLh}" stroke-width="8" rx="14"`) + rect(-128, -90, 256, 160, on ? '#140608' : '#0c0d12', `stroke="${OLh}" stroke-width="5" rx="6"`);
  if (on > 0) {
    let d = ''; for (let i = 0; i <= 64; i++) { const u = i / 64, ph = (u * 2 - T * 1.2) % 1, p = ((ph % 1) + 1) % 1; const v = p > 0.42 && p < 0.47 ? -50 : p > 0.47 && p < 0.52 ? 30 : p > 0.52 && p < 0.55 ? -12 : 0; d += `${i ? 'L' : 'M'} ${f2(-120 + u * 240)} ${f2(-10 + v)} `; }
    s += `<path d="${d}" stroke="${HC.red}" stroke-width="5" fill="none" opacity="${f2(on)}" stroke-linejoin="round"/>`;
    s += `<text x="110" y="56" text-anchor="end" font-family="Fredoka" font-weight="700" font-size="36" fill="#ff8a8a" opacity="${f2(on)}">${on > 0.5 ? Math.round(118 + 10 * Math.sin(T * 3)) : ''}</text>`;
    s += `<circle cx="0" cy="0" r="260" fill="${HC.red}" opacity="${f2(0.1 * on)}"/>`;
  }
  s += `<circle cx="120" cy="92" r="7" fill="${on ? HC.red : '#3a3e4a'}"/>`;
  return s + '</g>';
}
function curtain(x, y, w, h, open = 0, T = 0) {
  let s = `<path d="M ${x - 20} ${y} H ${x + w + 20}" stroke="${HC.metalD}" stroke-width="12" stroke-linecap="round"/>`;
  const cw = w * (1 - open * 0.82), n = 7;
  let d = `M ${x} ${y + 10}`; for (let i = 1; i <= n; i++) d += ` Q ${f2(x + cw * (i - 0.5) / n)} ${y + 30} ${f2(x + cw * i / n)} ${y + 10}`;
  d += ` L ${f2(x + cw + Math.sin(T * 3) * 8)} ${y + h}`; for (let i = n - 1; i >= 0; i--) d += ` Q ${f2(x + cw * (i + 0.5) / n + Math.sin(T * 2 + i) * 6)} ${y + h + 20} ${f2(x + cw * i / n)} ${y + h}`;
  s += `<path d="${d} Z" fill="#b6c2d4" stroke="${OLh}" stroke-width="6" stroke-linejoin="round"/>`;
  for (let i = 1; i < n; i++) s += `<path d="M ${f2(x + cw * i / n)} ${y + 20} L ${f2(x + cw * i / n + Math.sin(T * 2 + i) * 6)} ${y + h}" stroke="#8a96aa" stroke-width="4"/>`;
  return s;
}
function glassDoor(x, y, w, h, shut = 1, crack = 0) {
  let s = rect(x - 14, y - 14, w + 28, h + 14, '#2a2e3a', `stroke="${OLh}" stroke-width="6"`);
  const ow = w * (1 - shut);
  s += rect(x + ow, y, w - ow, h, HC.glass, `opacity="0.45" stroke="${OLh}" stroke-width="6"`);
  s += `<path d="M ${x + ow + 30} ${y + 40} l 60 120 M ${x + ow + 60} ${y + 30} l 50 90" stroke="#fff" stroke-width="8" opacity="0.4"/>`;
  s += rect(x + w - 50, y + h * 0.48, 26, 70, HC.metal, `stroke="${OLh}" stroke-width="4" rx="6"`);
  if (crack) s += `<path d="M ${x + w * 0.5} ${y + h * 0.4} l -60 -80 m 60 80 l 70 -50 m -70 50 l -20 110 m 20 -110 l 90 60" stroke="#fff" stroke-width="4" opacity="${f2(crack)}"/>`;
  return s;
}
function grate(x, y, w, k = 1, rot = 0) {
  let s = `<g transform="translate(${x} ${y}) rotate(${f2(rot)}) scale(${k})">` + rect(-w / 2, -40, w, 80, HC.metal, `stroke="${OLh}" stroke-width="6"`);
  for (let i = 1; i < 8; i++) s += `<path d="M ${f2(-w / 2 + i * w / 8)} -34 V 34" stroke="${HC.metalD}" stroke-width="7"/>`;
  return s + '</g>';
}
// criatura: alta, magra, camisola rasgada cinza-azulada, olhos brancos. Silhueta, sem sangue.
function creature(x, y, k, T, o = {}) {
  const sway = Math.sin(T * 3) * 4, run = o.run ? Math.sin(T * 14) : 0, dk = o.dark ?? 0.35;
  const skin = mix('#a8a4b4', '#2a2834', dk), gown = mix('#8e9ab0', '#262a38', dk);
  let s = `<g transform="translate(${x} ${y}) scale(${k * (o.flip ? -1 : 1)} ${k})">`;
  s += `<ellipse cx="0" cy="6" rx="90" ry="14" fill="#000" opacity="0.35"/>`;
  // pernas finas
  for (const sd of [-1, 1]) s += `<path d="M ${sd * 22} -300 L ${f2(sd * 26 + run * sd * 40)} -10" stroke="${OLh}" stroke-width="26" stroke-linecap="round"/><path d="M ${sd * 22} -300 L ${f2(sd * 26 + run * sd * 40)} -10" stroke="${skin}" stroke-width="15" stroke-linecap="round"/>`;
  // camisola rasgada
  s += `<path d="M -60 -620 Q -78 -460 -70 -290 L -52 -250 L -30 -300 L -8 -240 L 14 -296 L 36 -246 L 56 -292 L 72 -280 Q 80 -460 60 -620 Q 0 -640 -60 -620 Z" fill="${gown}" stroke="${OLh}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<path d="M -30 -560 l 16 60 M 24 -520 l -10 70 M -40 -420 l 20 30" stroke="${mix(gown, '#14101a', 0.4)}" stroke-width="5"/>`;
  // braços compridos
  const aa = o.reach ? -60 : 0;
  for (const sd of [-1, 1]) { const hx = sd * (90 + (o.reach ? 120 : 0)) + sway * sd, hy = o.reach ? -560 : -250 + run * sd * 30; s += `<path d="M ${sd * 56} -600 Q ${sd * 100} ${-460 + aa} ${f2(hx)} ${f2(hy)}" stroke="${OLh}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M ${sd * 56} -600 Q ${sd * 100} ${-460 + aa} ${f2(hx)} ${f2(hy)}" stroke="${skin}" stroke-width="13" fill="none" stroke-linecap="round"/>` + [-1, 0, 1].map(f => `<path d="M ${f2(hx)} ${f2(hy)} l ${f2(sd * 10 + f * 12)} 34" stroke="${OLh}" stroke-width="7" stroke-linecap="round"/>`).join(''); }
  // cabeça com cabelo escorrido
  s += `<g transform="translate(${f2(sway)} 0) rotate(${f2(o.tilt ?? 12)} 0 -660)"><ellipse cx="0" cy="-700" rx="54" ry="66" fill="${skin}" stroke="${OLh}" stroke-width="8"/>`;
  s += `<path d="M -60 -700 Q -64 -790 0 -776 Q 64 -790 60 -700 L 64 -560 L 40 -640 L 22 -580 L 0 -650 L -24 -570 L -40 -640 L -66 -570 Z" fill="#14101a"/>`;
  s += `<ellipse cx="-20" cy="-694" rx="11" ry="8" fill="#f4f6ff"/><ellipse cx="20" cy="-694" rx="11" ry="8" fill="#f4f6ff"/>${o.glow ? `<circle cx="0" cy="-694" r="80" fill="#e8ecff" opacity="0.12"/>` : ''}</g>`;
  return s + '</g>';
}
function elevator(x, y, open = 0, T = 0, o = {}) {
  const w = 300, h = 440;
  let s = rect(x - w / 2 - 50, y - h - 120, w + 100, h + 120, '#5a5060', `stroke="${OLh}" stroke-width="8"`);
  s += rect(x - w / 2 - 50, y - h - 120, w + 100, h + 120, 'url(#pPlaster)');
  s += rect(x - 90, y - h - 100, 180, 56, '#1a1014', `stroke="${OLh}" stroke-width="5" rx="6"`) + `<text x="${x}" y="${y - h - 58}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="40" fill="${HC.red}">${o.floor ?? '▼ T'}</text>`;
  s += rect(x - w / 2, y - h, w, h, '#ffe8b0', `stroke="${OLh}" stroke-width="7"`);
  if (open > 0) s += `<radialGradient id="hEl"><stop offset="0" stop-color="#fff4cc" stop-opacity="0.9"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></radialGradient><ellipse cx="${x}" cy="${y - h / 2}" rx="${f2(80 + open * 200)}" ry="${f2(160 + open * 200)}" fill="url(#hEl)"/>` + rect(x - w / 2 + 6, y - h + 6, w - 12, h - 12, '#2a2026', `opacity="${f2(0.85 - open * 0.25)}"`);
  if (o.hand) s += o.hand;
  const dw = (w / 2) * (1 - open);
  for (const sd of [-1, 1]) { const dx = sd < 0 ? x - w / 2 : x + w / 2 - dw; s += rect(dx, y - h, dw, h, HC.metal, `stroke="${OLh}" stroke-width="6"`) + `<path d="M ${f2(dx + dw * 0.3)} ${y - h + 20} V ${y - 20}" stroke="#c4cad6" stroke-width="6" opacity="0.6"/>` + `<path d="M ${f2(dx + 10)} ${y - h + 60} q 20 40 0 90" stroke="#7a5a3a" stroke-width="8" fill="none" opacity="0.6"/>`; }
  s += `<path d="M ${x} ${y - h} V ${y}" stroke="${OLh}" stroke-width="${open > 0.02 ? 0 : 5}"/>`;
  // botão
  const bx = x + w / 2 + 34, lit = o.press ? (Math.sin(T * 20) > 0 ? 1 : 0.3) : 0;
  s += rect(bx - 18, y - h / 2 - 50, 36, 100, '#2a2e3a', `stroke="${OLh}" stroke-width="4" rx="6"`) + `<circle cx="${bx}" cy="${y - h / 2}" r="12" fill="${lit ? mix('#4a1418', '#ffb04a', lit) : '#4a3a30'}" stroke="${OLh}" stroke-width="3"/>`;
  return s;
}
// mão que sai do elevador (luva preta, manga escura)
function grabHand(x, y, k = 1, ext = 1, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})"><path d="M 0 0 L ${f2(-180 * ext)} 0" stroke="${OLh}" stroke-width="56" stroke-linecap="round"/><path d="M 0 0 L ${f2(-180 * ext)} 0" stroke="#2c2a36" stroke-width="42" stroke-linecap="round"/><g transform="translate(${f2(-180 * ext)} 0)"><ellipse cx="-30" cy="0" rx="40" ry="34" fill="#1d1a22" stroke="${OLh}" stroke-width="6"/><path d="M -60 -20 l -24 -10 M -64 0 l -28 0 M -60 18 l -24 10" stroke="#1d1a22" stroke-width="18" stroke-linecap="round"/></g></g>`;
}
// lanterna: cone de luz + escuridão ao redor (sem filtro, só gradiente)
function flashDark(cx, cy, r, op = 0.85) {
  return `<radialGradient id="hFl" cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(r)}" gradientUnits="userSpaceOnUse"><stop offset="0.55" stop-color="#05060c" stop-opacity="0"/><stop offset="1" stop-color="#05060c" stop-opacity="${op}"/></radialGradient>` + rect(-600, -600, 2280, 3120, 'url(#hFl)');
}
function beam(x, y, tx, ty, w = 220, op = 0.35) {
  const a = Math.atan2(ty - y, tx - x), nx = -Math.sin(a), ny = Math.cos(a);
  return `<path d="M ${f2(x)} ${f2(y)} L ${f2(tx + nx * w)} ${f2(ty + ny * w)} L ${f2(tx - nx * w)} ${f2(ty - ny * w)} Z" fill="#fff4c8" opacity="${op}"/><ellipse cx="${f2(tx)}" cy="${f2(ty)}" rx="${f2(w * 0.9)}" ry="${f2(w * 0.9)}" fill="#fff4c8" opacity="${f2(op * 0.7)}"/>`;
}
function flashlightProp(rot = 0) { return `<g transform="rotate(${rot})"><rect x="-14" y="-60" width="28" height="80" rx="6" fill="#3a3e4c" stroke="${OLh}" stroke-width="5"/><rect x="-20" y="-80" width="40" height="26" rx="6" fill="${HC.metal}" stroke="${OLh}" stroke-width="5"/><ellipse cx="0" cy="-82" rx="16" ry="5" fill="#fff4c8"/></g>`; }
// placa na parede
function plaque(x, y, txt, w = 420, fs = 48, c = '#e8dcc0') { return rect(x - w / 2, y - 45, w, 90, '#1e2236', `stroke="${OLh}" stroke-width="6" rx="8"`) + `<text x="${x}" y="${y + 16}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${c}">${txt}</text>`; }
// relógio de parede
function wallClock(x, y, r, T, alarm) {
  const ak = alarm ? alarmK(T) : 0, mA = (T * 2) % 360;
  return `<circle cx="${x}" cy="${y}" r="${r + 18}" fill="#2a2e3a" stroke="${OLh}" stroke-width="8"/><circle cx="${x}" cy="${y}" r="${r}" fill="${mix('#e8e0cc', '#f4a0a0', ak * 0.4)}" stroke="${OLh}" stroke-width="5"/>` +
    Array.from({ length: 12 }, (_, i) => `<path d="M ${f2(x + Math.sin(i * Math.PI / 6) * r * 0.84)} ${f2(y - Math.cos(i * Math.PI / 6) * r * 0.84)} L ${f2(x + Math.sin(i * Math.PI / 6) * r * 0.94)} ${f2(y - Math.cos(i * Math.PI / 6) * r * 0.94)}" stroke="${OLh}" stroke-width="6"/>`).join('') +
    `<path d="M ${x} ${y} L ${x + r * 0.5} ${y}" stroke="${OLh}" stroke-width="14" stroke-linecap="round"/><path d="M ${x} ${y} L ${f2(x + Math.sin(mA * Math.PI / 180) * r * 0.8)} ${f2(y - Math.cos(mA * Math.PI / 180) * r * 0.8)}" stroke="${OLh}" stroke-width="9" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="${HC.red}" stroke="${OLh}" stroke-width="4"/>`;
}
// sirene / campainha de alarme
function alarmBell(x, y, k, T) {
  const ak = alarmK(T), sh = Math.sin(T * 60) * 4;
  return `<g transform="translate(${f2(x + sh)} ${y}) scale(${k})"><circle r="${f2(160 + ak * 80)}" fill="${HC.red}" opacity="${f2(0.25 * ak)}"/><path d="M -80 40 Q -80 -90 0 -90 Q 80 -90 80 40 Z" fill="${mix(HC.redD, HC.red, ak)}" stroke="${OLh}" stroke-width="8"/><rect x="-96" y="36" width="192" height="26" rx="10" fill="#2a2e3a" stroke="${OLh}" stroke-width="6"/><path d="M -40 -50 q 10 -20 30 -20" stroke="#ffb0b0" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    [[-150, -40], [150, -40], [-170, 30], [170, 30]].map(([a, b]) => `<path d="M ${a} ${b} l ${a > 0 ? 40 : -40} ${b > 0 ? 10 : -14}" stroke="#ffd0d0" stroke-width="10" stroke-linecap="round" opacity="${f2(ak)}"/>`).join('') + '</g>';
}
// onomatopeia simples (estilo HQ)
function bang(T, t0, txt, x, y, o = {}) {
  const t = T - t0; if (t < 0 || t > (o.dur || 0.9)) return '';
  const k = E.back(clamp(t / 0.15)) * (o.s || 1), a = 1 - clamp((t - (o.dur || 0.9) + 0.2) / 0.2);
  return `<g transform="translate(${x} ${y}) rotate(${o.rot || -8}) scale(${f2(k)})" opacity="${f2(a)}"><text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${o.fs || 130}" fill="${o.c || '#ffd23f'}" stroke="${OLh}" stroke-width="16" paint-order="stroke" letter-spacing="4">${txt}</text></g>`;
}
