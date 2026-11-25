// Especial hospital v2 — cenários no sistema de mundo do motor (chão y=905, Polo s≈0.62), em camadas com parallax.
// Padrão igual ao ep. 2: fundo (d 0.04–0.6), ação (d 1), primeiro plano (d 1.25–1.4). Sem verde.
const GY = 905;
const L0 = svg => ({ d: 0, svg });                // camada fixa na tela (escuridão, chuva de tela)
const WARM = '#ffd27a';
const HN = ['#2a3470', 0.16];                      // tingimento noturno (como NIGHT do ep. 2)
const HD = ['#1e2656', 0.26];                      // tingimento escuro

// poça de luz quente (chão + parede)
function warmPool(x, y = GY, w = 260, op = 0.55) {
  return `<ellipse cx="${x}" cy="${y + 30}" rx="${w}" ry="${w * 0.18}" fill="url(#gPool)" opacity="${op}"/><ellipse cx="${x}" cy="${y - 200}" rx="${w * 0.75}" ry="${w * 0.95}" fill="url(#gPool)" opacity="${f2(op * 0.45)}"/>`;
}
function wallLamp(x, y, on = 1, T = 0, flick = 0) {
  const k = on * (flick ? (Math.sin(T * 23 + x) > 0.75 ? 0.15 : 1) : 1);
  return `<path d="M ${x} ${y - 40} v 20" stroke="${OLh}" stroke-width="6"/><path d="M ${x - 34} ${y - 20} L ${x + 34} ${y - 20} L ${x + 22} ${y + 14} L ${x - 22} ${y + 14} Z" fill="${mix('#4a4450', '#f6d890', k)}" stroke="${OLh}" stroke-width="5" stroke-linejoin="round"/>` +
    (k > 0.3 ? `<path d="M ${x - 22} ${y + 14} L ${x - 120} ${y + 320} L ${x + 120} ${y + 320} L ${x + 22} ${y + 14} Z" fill="url(#gCone)" opacity="${f2(0.35 * k)}"/>` : '');
}
// porta de quarto numerada com visor
function wardDoor(x, n, o = {}) {
  const open = o.open || 0;
  let s = rect(x - 8, GY - 330, 176, 334, '#2a2430', `stroke="${OLh}" stroke-width="6"`);
  s += `<g transform="translate(${x} ${GY - 322}) scale(${f2(1 - open * 0.85)} 1)">${rect(0, 0, 160, 322, o.c || '#8a6a5a', `stroke="${OLh}" stroke-width="6"`)}${rect(0, 0, 160, 322, 'url(#pWoodV)', 'opacity="0.6"')}${rect(44, 40, 72, 70, '#1a1e30', `stroke="${OLh}" stroke-width="5"`)}<path d="M 52 48 l 22 30" stroke="#8a94b0" stroke-width="3"/><circle cx="140" cy="176" r="9" fill="${HC.metal}" stroke="${OLh}" stroke-width="3.5"/>${rect(10, 286, 140, 28, '#5a4440')}</g>`;
  s += rect(x + 40, GY - 382, 80, 40, '#e8dcc0', `stroke="${OLh}" stroke-width="4" rx="6"`) + `<text x="${x + 80}" y="${GY - 351}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="#5a3a3a">${n}</text>`;
  return s;
}
function poster(x, y, rot, c, torn = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M -50 -64 L 50 -64 L 50 ${torn ? 30 : 64} L 30 44 L 14 ${torn ? 26 : 64} L -6 52 L -50 64 Z" fill="${c}" stroke="${OLh}" stroke-width="4"/><circle cx="0" cy="-24" r="20" fill="#fff" opacity="0.7"/><path d="M -6 -24 h 12 M 0 -30 v 12" stroke="${HC.red}" stroke-width="5"/><path d="M -34 10 h 68 M -34 24 h 50" stroke="${OLh}" stroke-width="4" opacity="0.5"/></g>`;
}
function bench(x) {
  return rect(x, GY - 96, 260, 24, '#7a5a40', `stroke="${OLh}" stroke-width="5" rx="6"`) + rect(x, GY - 170, 260, 22, '#7a5a40', `stroke="${OLh}" stroke-width="5" rx="6"`) + `<path d="M ${x + 20} ${GY - 72} V ${GY} M ${x + 240} ${GY - 72} V ${GY} M ${x + 20} ${GY - 148} V ${GY - 96} M ${x + 240} ${GY - 148} V ${GY - 96}" stroke="${HC.metalD}" stroke-width="10"/>`;
}
function ivStand(x, k = 1) {
  return `<g transform="translate(${x} ${GY}) scale(${k})"><path d="M 0 0 V -380 M -40 -380 H 40 M -50 0 L 50 0 M 0 0 L -40 14 M 0 0 L 40 14" stroke="${OLh}" stroke-width="14" stroke-linecap="round"/><path d="M 0 0 V -380 M -40 -380 H 40" stroke="${HC.metal}" stroke-width="7" stroke-linecap="round"/><rect x="-30" y="-372" width="44" height="70" rx="12" fill="#c8d8ec" opacity="0.8" stroke="${OLh}" stroke-width="5"/><path d="M -8 -302 q -10 80 30 140" stroke="#a8b8d0" stroke-width="4" fill="none"/></g>`;
}
function checkerFloor(x0, x1, y0 = GY, y1 = GY + 500, a = '#4a5470', b = '#323a52') {
  let s = rect(x0, y0, x1 - x0, y1 - y0, b);
  for (let r = 0; r < 6; r++) { const ya = y0 + Math.pow(r / 6, 1.3) * (y1 - y0), yb = y0 + Math.pow((r + 1) / 6, 1.3) * (y1 - y0); for (let x = x0 + (r % 2) * 80; x < x1; x += 160) s += rect(x, ya, 80, yb - ya, a); }
  return s + `<path d="M ${x0} ${y0} H ${x1}" stroke="${OLh}" stroke-width="7"/>` + rect(x0, y0, x1 - x0, 60, '#000', 'opacity="0.18"');
}
// parede de corredor: reboco azul-acinzentado em cima, lambri creme embaixo, faixa vermelha
function hallWall(x0, x1, o = {}) {
  let s = rect(x0, -400, x1 - x0, GY + 400, o.wall || '#6a7898') + rect(x0, -400, x1 - x0, GY + 400, 'url(#pPlaster)');
  s += rect(x0, GY - 260, x1 - x0, 260, o.wains || '#d8ccb0') + rect(x0, GY - 260, x1 - x0, 260, 'url(#pWoodV)', 'opacity="0.35"');
  s += rect(x0, GY - 272, x1 - x0, 18, '#8a2a32', `stroke="${OLh}" stroke-width="4"`) + rect(x0, GY - 30, x1 - x0, 30, '#5a4a40');
  // manchas de umidade e rachaduras
  const r = rng(o.seed || 3);
  for (let i = 0; i < 8; i++) { const x = x0 + r() * (x1 - x0), y = 80 + r() * 400; s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(40 + r() * 90)}" ry="${f2(30 + r() * 60)}" fill="#3a405a" opacity="0.25"/><path d="M ${f2(x)} ${f2(y - 20)} l ${f2(r() * 40 - 20)} 40 l ${f2(r() * 30)} 30" stroke="${OLh}" stroke-width="3" fill="none" opacity="0.5"/>`; }
  s += rect(x0, -400, x1 - x0, 150, '#3a4058') + `<path d="M ${x0} -250 H ${x1}" stroke="${OLh}" stroke-width="6"/>`;
  return s;
}
function brokenGlass(x0, x1, seed = 4) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < 22; i++) { const x = x0 + r() * (x1 - x0), y = GY + 20 + r() * 180, k = 0.6 + r() * 1.2; s += `<path d="M ${f2(x)} ${f2(y)} l ${f2(14 * k)} ${f2(-12 * k)} l ${f2(8 * k)} ${f2(14 * k)} Z" fill="#c8e0f4" stroke="${OLh}" stroke-width="2" opacity="0.9"/><circle cx="${f2(x + 6)}" cy="${f2(y - 4)}" r="2" fill="#fff"/>`; }
  return s;
}
const ceilingStrip = (x0, x1, T, on = 1, flick = 0) => Array.from({ length: Math.ceil((x1 - x0) / 420) }, (_, i) => wallLamp(x0 + 210 + i * 420, -170, on, T, flick)).join('');

// ---------- CORREDOR lateral (5 camadas) ----------
function hallSet(T, t, extra, o = {}) {
  const on = o.lights ?? 1, X0 = -900, X1 = 2900;
  let wall = hallWall(X0, X1, { seed: o.seed || 3 });
  wall += [[-300, '104'], [420, '105'], [1180, '106'], [1900, '107']].map(([x, n]) => wardDoor(x, n, { open: o.openDoor === n ? o.openK || 0 : 0 })).join('');
  wall += poster(240, 420, -6, '#e8c4a0') + poster(980, 400, 4, '#c8d0e8') + poster(1680, 430, -3, '#f0d4b0');
  wall += bench(700) + (o.debris ? brokenGlass(X0, X1, o.seed || 4) + `<g transform="translate(1500 ${GY}) rotate(-6)">${gurney(0, 0, 0.6, { tipped: 1 })}</g>` + `<g transform="translate(160 ${GY + 10}) rotate(8)">${gurney(0, 0, 0.55, { tipped: 1 })}</g>` : '');
  if (on) wall += [0, 1, 2, 3, 4].map(i => warmPool(-220 + i * 640, GY, 300, 0.45 * on)).join('');
  const floor = checkerFloor(X0, X1);
  const lamps = ceilingStrip(X0, X1, T, on, o.flicker);
  const fg = o.fg === false ? '' : ivStand(o.fgX ?? 140, 1.25) + `<g transform="translate(${(o.fgX ?? 140) + 1300} 0)">${rect(-60, -400, 120, GY + 900, '#4a5270', `stroke="${OLh}" stroke-width="8"`)}${rect(-60, GY - 260, 120, 260, '#c8bca0')}</g>`;
  const ak = o.alarm ? alarmK(T) : 0;
  return [L(0.5, fullBg('#1a1e30')), Lr(1, floor + wall + lamps + (extra || '')), Lr(1.3, `<g opacity="0.92">${fg}</g>`),
    ...(o.alarm ? [L0(rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.2 * ak)}"`))] : [])];
}

// ---------- FACHADA lateral sob chuva ----------
function exteriorSet(T, t, extra, o = {}) {
  const ak = o.alarm ? alarmK(T) : 0;
  const back = [Lr(0.04, sky('#0e1230', '#2e3264', { stars: 1, t, moon: 170, moonX: 1500, id: 'hs' })), Lr(0.1, clouds(t * 0.5, '#3a3e6a', 0.6, 7, 60)),
    Lr(0.3, farTown('#1e2244', 760, 9)), Lr(0.55, Array.from({ length: 6 }, (_, i) => deadTree(-400 + i * 560, GY - 40, 0.9 + (i % 2) * 0.3)).join(''))];
  let b = rect(-200, 180, 2300, GY - 180, '#5a4a58', `stroke="${OLh}" stroke-width="8"`) + rect(-200, 180, 2300, GY - 180, 'url(#pBrick)', 'opacity="0.7"');
  b += rect(-220, 150, 2340, 40, '#3a3242', `stroke="${OLh}" stroke-width="6"`);
  for (let i = 0; i < 6; i++) for (let r = 0; r < 2; r++) {
    const x = -120 + i * 380, y = 250 + r * 230, lit = o.alarm && i === 3 && r === 0, broken = (i + r) % 3 === 1;
    if (i === 2 && r === 1) continue;
    s2 = '';
    b += rect(x - 10, y - 10, 180, 170, '#c8bca8', `stroke="${OLh}" stroke-width="5"`) + rect(x, y, 160, 150, lit ? mix('#3a1418', HC.red, ak) : '#1a1e34', `stroke="${OLh}" stroke-width="5"`) + `<path d="M ${x + 80} ${y} V ${y + 150} M ${x} ${y + 75} H ${x + 160}" stroke="${OLh}" stroke-width="5"/>`;
    if (broken) b += `<path d="M ${x + 14} ${y + 14} l 40 36 l -18 20 l 44 40" stroke="#8a94b0" stroke-width="3" fill="none"/>`;
    if (lit) b += `<circle cx="${x + 80}" cy="${y + 75}" r="${f2(200 + ak * 80)}" fill="${HC.red}" opacity="${f2(0.2 * ak)}"/>`;
  }
  // marquise, letreiro e porta
  const dx = o.doorX ?? 760;
  b += `<path d="M ${dx - 120} ${GY - 420} L ${dx + 420} ${GY - 420} L ${dx + 460} ${GY - 360} L ${dx - 160} ${GY - 360} Z" fill="#6a2a30" stroke="${OLh}" stroke-width="7" stroke-linejoin="round"/>`;
  b += rect(dx - 200, 40, 700, 100, '#1e2236', `stroke="${OLh}" stroke-width="7" rx="10"`) + `<text x="${dx + 150}" y="108" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="56" letter-spacing="3" fill="#f0e2c0">HOSPITAL SANTA CLARA</text>`;
  b += `<g transform="translate(${dx + 150} 0)"><rect x="-20" y="-40" width="40" height="110" fill="${HC.red}" stroke="${OLh}" stroke-width="5"/><rect x="-55" y="-5" width="110" height="40" fill="${HC.red}" stroke="${OLh}" stroke-width="5"/></g>`;
  b += rect(dx - 10, GY - 360, 320, 362, '#100e16', `stroke="${OLh}" stroke-width="8"`);
  const op = o.doorOpen || 0;
  b += `<g transform="translate(${dx} ${GY - 352}) scale(${f2(1 - op * 0.82)} 1)">${rect(0, 0, 300, 352, '#8a5a3e', `stroke="${OLh}" stroke-width="7"`)}${rect(0, 0, 300, 352, 'url(#pWoodV)', 'opacity="0.5"')}${rect(26, 30, 248, 130, '#7a4a30', `stroke="${OLh}" stroke-width="4"`)}<path d="M 40 210 q 40 40 90 14 M 170 80 q 30 40 70 10 M 20 300 q 60 -20 120 10" stroke="#a8603a" stroke-width="12" fill="none" opacity="0.7"/><circle cx="270" cy="200" r="13" fill="${HC.metal}" stroke="${OLh}" stroke-width="4"/>${rect(10, 236, 280, 20, '#3a3036')}</g>`;
  b += `<path d="M ${dx - 40} ${GY - 120} l 60 -30 l 60 30 M ${dx + 260} ${GY - 120} l 60 -30" stroke="#6a5a4a" stroke-width="10" fill="none"/>`; // tábuas quebradas
  // calçada molhada com reflexos
  let fl = rect(-900, GY, 3800, 600, '#1c2036') + `<path d="M -900 ${GY} H 2900" stroke="${OLh}" stroke-width="8"/>`;
  for (let i = 0; i < 8; i++) fl += `<ellipse cx="${-200 + i * 330}" cy="${GY + 60 + (i % 3) * 50}" rx="110" ry="14" fill="#5a6488" opacity="0.5"/>`;
  fl += `<ellipse cx="${dx + 150}" cy="${GY + 80}" rx="200" ry="20" fill="${HC.red}" opacity="${f2(0.25 * ak)}"/>`;
  const lamp = `<path d="M 200 ${GY} V ${GY - 560} q 0 -40 60 -40 h 40" stroke="${OLh}" stroke-width="22" fill="none"/><path d="M 200 ${GY} V ${GY - 560} q 0 -40 60 -40 h 40" stroke="#3a3e4c" stroke-width="12" fill="none"/><path d="M 280 ${GY - 610} h 60 l -10 24 h -40 Z" fill="${WARM}" stroke="${OLh}" stroke-width="5"/>` + `<path d="M 290 ${GY - 586} L 180 ${GY} L 460 ${GY} L 330 ${GY - 586} Z" fill="url(#gCone)" opacity="0.45"/>` + warmPool(320, GY, 220, 0.6);
  const fence = Array.from({ length: 30 }, (_, i) => `<path d="M ${-800 + i * 130} ${GY + 260} V ${GY - 60}" stroke="${OLh}" stroke-width="16"/><path d="M ${-800 + i * 130} ${GY - 60} l -12 24 h 24 Z" fill="${OLh}"/>`).join('') + `<path d="M -900 ${GY + 40} H 2900 M -900 ${GY + 180} H 2900" stroke="${OLh}" stroke-width="12"/>`;
  return [...back, Lr(1, fl + b + lamp + (extra || '')), Lr(1.35, o.fence === false ? '' : `<g opacity="0.95">${fence}</g>`), L0(rain(T, 120, 0.55)),
    ...(o.alarm ? [L0(rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.1 * ak)}"`))] : [])];
}
var s2;
function deadTree(x, y, k) {
  return `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="#141428" stroke-linecap="round"><path d="M 0 0 V -300" stroke-width="30"/><path d="M 0 -160 L -90 -260 M 0 -220 L 80 -320 M -50 -215 L -70 -300 M 40 -270 L 30 -340 M 0 -300 L -20 -380" stroke-width="14"/></g>`;
}

// ---------- RECEPÇÃO ----------
function receptionSet(T, t, extra, o = {}) {
  let w = hallWall(-900, 2900, { wall: '#5a6688', seed: 8 }) + wallClock(540, 380, 150, T, 1);
  w += rect(-100, 70, 360, 80, '#1e2236', `stroke="${OLh}" stroke-width="6" rx="8"`) + `<text x="80" y="126" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="44" fill="#f0e2c0">RECEPÇÃO</text>`;
  w += `<g transform="translate(980 ${GY})">${rect(0, -420, 220, 420, '#6a6a78', `stroke="${OLh}" stroke-width="6"`)}${[0, 1, 2, 3].map(i => rect(16, -404 + i * 100, 188, 84, '#7a7a88', `stroke="${OLh}" stroke-width="4"`) + rect(90, -370 + i * 100, 40, 14, HC.metal, `stroke="${OLh}" stroke-width="3"`)).join('')}${rect(16, -330, 188, 30, '#e8dcc0', 'opacity="0.0"')}</g>`;
  const counter = rect(120, GY - 230, 860, 230, '#7a5a44', `stroke="${OLh}" stroke-width="8"`) + rect(120, GY - 230, 860, 230, 'url(#pWood)', 'opacity="0.6"') + rect(100, GY - 260, 900, 36, '#9a7a5a', `stroke="${OLh}" stroke-width="7" rx="8"`) + `<g transform="translate(300 ${GY - 260})">${rect(0, -70, 110, 70, '#2a2e3a', `stroke="${OLh}" stroke-width="5"`)}<path d="M 20 -50 h 70 M 20 -30 h 50" stroke="#6a6e7a" stroke-width="5"/></g>` + `<path d="M 700 ${GY - 262} l 120 -10 l 20 8 l -110 12 Z" fill="#e8e0cc" stroke="${OLh}" stroke-width="4"/>`;
  const ak = alarmK(T);
  return [L(0.5, fullBg('#1a1e30')), Lr(1, checkerFloor(-900, 2900) + w + warmPool(540, GY, 360, 0.4) + (extra || '')), Lr(1.3, counter), L0(rect(-600, -600, 2280, 3120, HC.red, `opacity="${f2(0.18 * ak)}"`))];
}

// ---------- ALA CIRÚRGICA ----------
function tileWall(x0, x1, c1 = '#a8b8c8', c2 = '#98a8ba') {
  let s = rect(x0, -400, x1 - x0, GY + 400, c1);
  for (let y = -400; y < GY; y += 60) for (let x = x0 + ((y / 60) % 2 ? 30 : 0); x < x1; x += 60) if (((x + y) / 60) % 3 < 1) s += rect(x, y, 60, 60, c2);
  for (let y = -400; y < GY; y += 60) s += `<path d="M ${x0} ${y} H ${x1}" stroke="#7a8898" stroke-width="2"/>`;
  for (let x = x0; x < x1; x += 60) s += `<path d="M ${x} -400 V ${GY}" stroke="#7a8898" stroke-width="2"/>`;
  return s;
}
function surgeryLamp(x, y, on = 0) {
  return `<path d="M ${x} -400 V ${y - 40}" stroke="${OLh}" stroke-width="18"/><path d="M ${x} -400 V ${y - 40}" stroke="${HC.metal}" stroke-width="9"/><ellipse cx="${x}" cy="${y}" rx="170" ry="54" fill="#8a92a6" stroke="${OLh}" stroke-width="8"/>` + [-90, 0, 90].map(d => `<circle cx="${x + d}" cy="${y + 4}" r="34" fill="${on ? '#fff4cc' : '#3a3e4c'}" stroke="${OLh}" stroke-width="5"/>`).join('') + (on ? `<path d="M ${x - 150} ${y + 30} L ${x - 320} ${GY} L ${x + 320} ${GY} L ${x + 150} ${y + 30} Z" fill="url(#gCone)" opacity="${f2(0.4 * on)}"/>` : '');
}
function instrCart(x) { return `<g transform="translate(${x} ${GY})">${rect(-100, -260, 200, 16, HC.metal, `stroke="${OLh}" stroke-width="5"`)}${rect(-100, -120, 200, 16, HC.metal, `stroke="${OLh}" stroke-width="5"`)}<path d="M -90 -244 V -20 M 90 -244 V -20" stroke="${HC.metalD}" stroke-width="8"/><circle cx="-80" cy="-12" r="12" fill="#2a2e3a" stroke="${OLh}" stroke-width="4"/><circle cx="80" cy="-12" r="12" fill="#2a2e3a" stroke="${OLh}" stroke-width="4"/><path d="M -70 -272 l 50 -6 M -10 -270 l 40 -10 M 40 -272 l 40 -4" stroke="#c8d0dc" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="-130" rx="50" ry="12" fill="#c8d0dc" stroke="${OLh}" stroke-width="3"/></g>`; }
function glassCabinet(x) { return `<g transform="translate(${x} ${GY})">${rect(0, -560, 260, 560, '#c8ccd4', `stroke="${OLh}" stroke-width="7"`)}${rect(20, -540, 100, 340, HC.glass, `opacity="0.5" stroke="${OLh}" stroke-width="5"`)}${rect(140, -540, 100, 340, HC.glass, `opacity="0.5" stroke="${OLh}" stroke-width="5"`)}${[0, 1, 2].map(i => `<path d="M 20 ${-430 + i * 110} H 240" stroke="${OLh}" stroke-width="4"/><rect x="${36 + i * 30}" y="${-470 + i * 110}" width="20" height="38" rx="5" fill="${['#c89a6a', '#e8e0cc', '#a8b8d8'][i]}" stroke="${OLh}" stroke-width="3"/><rect x="${160 + i * 20}" y="${-460 + i * 110}" width="18" height="28" rx="4" fill="#e8c4a0" stroke="${OLh}" stroke-width="3"/>`).join('')}${rect(20, -180, 220, 160, '#b8bcc6', `stroke="${OLh}" stroke-width="5"`)}</g>`; }
function bed(x, o = {}) { return `<g transform="translate(${x} ${GY})">${rect(-230, -210, 460, 60, '#e8e4d8', `stroke="${OLh}" stroke-width="7" rx="16"`)}${rect(-230, -232, 140, 40, '#f4f0e6', `stroke="${OLh}" stroke-width="6" rx="16"`)}${o.sheet ? `<path d="M -80 -214 Q 0 -250 220 -214 L 230 -150 L -80 -150 Z" fill="#c8d4e4" stroke="${OLh}" stroke-width="6"/>` : ''}<path d="M -250 -320 V -150 M 250 -260 V -150" stroke="${HC.metalD}" stroke-width="14" stroke-linecap="round"/><path d="M -200 -150 L -190 -24 M 200 -150 L 190 -24 M -190 -70 H 190" stroke="${HC.metalD}" stroke-width="10"/><circle cx="-190" cy="-14" r="16" fill="#2a2e3a" stroke="${OLh}" stroke-width="5"/><circle cx="190" cy="-14" r="16" fill="#2a2e3a" stroke="${OLh}" stroke-width="5"/></g>`; }
function surgerySet(T, t, extra, o = {}) {
  let w = tileWall(-900, 2900) + rect(-900, -400, 3800, 150, '#3a4058') + glassCabinet(-160) + instrCart(1320) + `<g transform="translate(1600 330)">${monitor(0, 0, 0.75, T, o.monitor || 0)}</g>` + `<path d="M 1600 400 q 30 120 -20 280" stroke="${OLh}" stroke-width="6" fill="none"/>` + bed(o.bedX ?? 820, { sheet: o.sheet }) + surgeryLamp(o.bedX ?? 820, 80, o.lamp || 0) + ivStand(1100, 1);
  const fl = checkerFloor(-900, 2900, GY, GY + 500, '#5a6678', '#46505e');
  const ak = o.alarm ? alarmK(T) : 0;
  return [L(0.5, fullBg('#1a1e30')), Lr(1, fl + w + (o.monitor ? `<circle cx="1600" cy="330" r="380" fill="${HC.red}" opacity="0.12"/>` : '') + warmPool(820, GY, 300, 0.3) + (extra || '')), Lr(1.32, o.fg === false ? '' : `<g opacity="0.95">${ivStand(o.fgX ?? 1700, 1.3)}</g>`)];
}

// ---------- ELEVADOR ANTIGO (pantográfico) ----------
function oldElevator(x, open = 0, T = 0, o = {}) {
  const w = 300, h = 440, y = GY;
  let s = rect(x - w / 2 - 60, y - h - 150, w + 120, h + 150, '#6a5040', `stroke="${OLh}" stroke-width="8"`) + rect(x - w / 2 - 60, y - h - 150, w + 120, h + 150, 'url(#pWood)', 'opacity="0.5"');
  s += `<path d="M ${x - 120} ${y - h - 40} A 120 70 0 0 1 ${x + 120} ${y - h - 40}" fill="#c9a24a" stroke="${OLh}" stroke-width="6"/>` + Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (i / 6); return `<circle cx="${f2(x - Math.cos(a) * 96)}" cy="${f2(y - h - 46 - Math.sin(a) * 50)}" r="7" fill="#5a4020"/>`; }).join('');
  const fa = (o.floor ?? 0) * Math.PI / 4; s += `<path d="M ${x} ${y - h - 42} L ${f2(x - Math.cos(fa) * 84)} ${f2(y - h - 42 - Math.sin(fa) * 44)}" stroke="${HC.red}" stroke-width="6" stroke-linecap="round"/>`;
  s += rect(x - w / 2, y - h, w, h, '#2a1e18', `stroke="${OLh}" stroke-width="7"`);
  s += `<radialGradient id="hEl2"><stop offset="0" stop-color="#fff0c0" stop-opacity="1"/><stop offset="1" stop-color="#ffc870" stop-opacity="0.2"/></radialGradient>`;
  if (open > 0) s += rect(x - w / 2 + 6, y - h + 6, w - 12, h - 12, 'url(#hEl2)', `opacity="${f2(open)}"`) + `<path d="M ${x - w / 2} ${y} L ${x - w / 2 - 160 * open} ${y + 200} L ${x + w / 2 + 160 * open} ${y + 200} L ${x + w / 2} ${y} Z" fill="${WARM}" opacity="${f2(0.3 * open)}"/>`;
  if (o.inner) s += o.inner;
  // grade pantográfica que recolhe
  const gw = w * (1 - open * 0.88);
  s += `<g>${Array.from({ length: 9 }, (_, i) => { const xx = x - w / 2 + (gw / 8) * i; return `<path d="M ${f2(xx)} ${y - h} V ${y}" stroke="#c9a24a" stroke-width="8"/>`; }).join('')}${Array.from({ length: 8 }, (_, i) => { const xa = x - w / 2 + (gw / 8) * i, xb = xa + gw / 8; return `<path d="M ${f2(xa)} ${y - h} L ${f2(xb)} ${y} M ${f2(xb)} ${y - h} L ${f2(xa)} ${y}" stroke="#a8823a" stroke-width="5"/>`; }).join('')}<path d="M ${x - w / 2} ${y - h + 6} H ${f2(x - w / 2 + gw)} M ${x - w / 2} ${y - 6} H ${f2(x - w / 2 + gw)}" stroke="#c9a24a" stroke-width="10"/></g>`;
  const bx = x + w / 2 + 34 + (o.btnDx || 0), by0 = (o.btnDy || 0), lit = o.pressOn !== undefined ? (o.pressOn ? 1 : 0.3) : o.press ? (Math.sin(T * 20) > 0 ? 1 : 0.3) : (o.lit || 0);
  s += rect(bx - 22, y - h / 2 - 70 + by0, 44, 140, '#c9a24a', `stroke="${OLh}" stroke-width="5" rx="8"`) + `<circle cx="${bx}" cy="${y - h / 2 - 22 + by0}" r="14" fill="${lit ? mix('#6a2a14', '#ffb04a', lit) : '#5a3a20'}" stroke="${OLh}" stroke-width="4"/><circle cx="${bx}" cy="${y - h / 2 + 26 + by0}" r="14" fill="#5a3a20" stroke="${OLh}" stroke-width="4"/>`;
  return s;
}
function elevatorSet(T, t, extra, o = {}) {
  let w = hallWall(-900, 2900, { seed: 12, wall: '#5a6280' }) + oldElevator(o.elX ?? 760, o.open || 0, T, o) + poster(260, 420, -8, '#e8c4a0') + `<path d="M 1300 -250 V ${GY}" stroke="${OLh}" stroke-width="10"/>` + rect(1300, -250, 1600, GY + 250, '#2a2e44');
  if (o.light !== 0) w += warmPool(o.elX ?? 760, GY, 260, 0.35 + 0.5 * (o.open || 0));
  return [L(0.5, fullBg('#1a1e30')), Lr(1, checkerFloor(-900, 2900) + w + (extra || '')), Lr(1.3, o.fg === false ? '' : `<g opacity="0.95">${rect(-200, -400, 140, GY + 900, '#3a4060', `stroke="${OLh}" stroke-width="8"`)}</g>`)];
}

// ---------- escuridão com lanterna (camada fixa na tela, mais suave que antes) ----------
function darkLight(cx, cy, r, op = 0.7) { return L0(flashDark(cx, cy, r, op)); }
// cone da lanterna em coordenadas de mundo
function torchBeam(x, y, tx, ty, w = 90, op = 0.32) { return beam(x, y, tx, ty, w, op); }

// mãos em primeira pessoa com manga de paletó (versão do povHands para o Polo do especial)
function povHandsPB(x, y, k, inner, o = {}) {
  const spread = o.spread || 230, lift = o.lift || 0, only = o.only;
  const sleeve = (sx, dirn) => `<path d="M ${sx} ${y + 700} L ${f2(sx + dirn * 40)} ${y + 60}" stroke="${OL}" stroke-width="150" stroke-linecap="round"/><path d="M ${sx} ${y + 700} L ${f2(sx + dirn * 40)} ${y + 60}" stroke="#3a3a46" stroke-width="134" stroke-linecap="round"/><path d="M ${f2(sx + dirn * 6)} ${y + 680} L ${f2(sx + dirn * 44)} ${y + 120}" stroke="#26262f" stroke-width="30" stroke-linecap="round" opacity="0.7"/>` +
    `<rect x="${f2(sx + dirn * 40 - 66)}" y="${y + 34}" width="132" height="40" rx="14" fill="#f4f1ea" stroke="${OL}" stroke-width="7"/>`;
  const glove = (gx, dirn) => `<g transform="translate(${f2(gx)} ${y - lift}) scale(${dirn} 1)"><ellipse cx="0" cy="0" rx="78" ry="70" fill="#1d1a22" stroke="${OL}" stroke-width="8"/><path d="M 40 -30 Q 100 -60 96 -6 Q 92 24 52 18" fill="#1d1a22" stroke="${OL}" stroke-width="8"/><path d="M -50 -20 q 30 -16 60 0 M -50 10 q 30 -16 60 0" stroke="#4a4458" stroke-width="5" fill="none"/><ellipse cx="-28" cy="-34" rx="20" ry="11" fill="#fff" opacity="0.2"/></g>`;
  const Lx = x - spread, Rx = x + spread;
  return (only !== 'R' ? sleeve(Lx - 30, 1) : '') + (only !== 'L' ? sleeve(Rx + 30, -1) : '') + `<g transform="translate(${x} ${y - 40 - lift}) scale(${k})">${inner}</g>` + (only !== 'R' ? glove(Lx + 10, 1) : '') + (only !== 'L' ? glove(Rx - 10, -1) : '');
}
