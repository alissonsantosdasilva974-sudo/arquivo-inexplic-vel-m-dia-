// Environment kit. All functions return SVG strings in world coords (1920x1080 frame at camera 0).
const FONT = `font-family="Inter Display, Inter, sans-serif" font-weight="900"`;

function skyColors(p) {
  // p: 0 day gold, 1 night, 2 cool morning, 3 dusk
  const keys = {
    day: ['#f2c27a', '#f7e3b5'], night: ['#151a36', '#3a3a6a'], cool: ['#8fb4c8', '#dfe9e6'], dusk: ['#c86a7a', '#f2b47a'], noon: ['#9cc4d6', '#f4e9c8'],
  };
  return keys[p] || keys.day;
}
function sky(top, bot, o = {}) {
  let s = `<rect x="-1400" y="-800" width="4720" height="2400" fill="${top}"/>`;
  s += `<linearGradient id="skyg${o.id || ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient>`;
  s += `<rect x="-1400" y="-300" width="4720" height="1300" fill="url(#skyg${o.id || ''})"/>`;
  if (o.sun != null) s += `<circle cx="${o.sunX || 1500}" cy="${o.sun}" r="${o.sunR || 90}" fill="${o.sunC || '#fff1c8'}" opacity="0.95"/><circle cx="${o.sunX || 1500}" cy="${o.sun}" r="${(o.sunR || 90) * 2}" fill="${o.sunC || '#fff1c8'}" opacity="0.18"/>`;
  if (o.moon != null) s += `<circle cx="${o.moonX || 400}" cy="${o.moon}" r="60" fill="#f4ecd2"/><circle cx="${(o.moonX || 400) + 24}" cy="${o.moon - 14}" r="54" fill="${top}"/>`;
  if (o.stars) { const r = rng(77); for (let i = 0; i < 90; i++) { const x = r() * 3600 - 800, y = r() * 700 - 200; s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(1.5 + r() * 2.5)}" fill="#fff8e0" opacity="${f2(o.stars * (0.4 + 0.6 * Math.abs(Math.sin((o.t || 0) * 2 + i))))}"/>`; } }
  return s;
}
function clouds(t, color = '#fff6e2', op = 0.8, seed = 3, y0 = 120) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < 7; i++) {
    const x = ((r() * 3600 + t * (12 + r() * 10)) % 3600) - 900, y = y0 + r() * 220, k = 0.6 + r() * 0.8;
    s += `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k)})" opacity="${op}"><ellipse cx="0" cy="0" rx="120" ry="34" fill="${color}"/><ellipse cx="-50" cy="-18" rx="60" ry="40" fill="${color}"/><ellipse cx="40" cy="-26" rx="70" ry="48" fill="${color}"/></g>`;
  }
  return s;
}
function hills(c1, c2, base = 760) {
  return `<path d="M -1400 ${base} C -900 ${base - 220} -500 ${base - 120} 0 ${base - 190} C 500 ${base - 260} 900 ${base - 100} 1400 ${base - 200} C 1900 ${base - 290} 2500 ${base - 140} 3300 ${base - 210} L 3300 1600 L -1400 1600 Z" fill="${c1}"/>` +
    `<path d="M -1400 ${base + 40} C -700 ${base - 90} -200 ${base - 30} 500 ${base - 100} C 1100 ${base - 160} 1700 ${base - 20} 2400 ${base - 110} L 3300 ${base - 60} L 3300 1600 L -1400 1600 Z" fill="${c2}"/>`;
}
function farTown(color, base = 720, seed = 5) {
  const r = rng(seed); let s = `<g fill="${color}">`;
  let x = -1300;
  while (x < 3200) {
    const w = 90 + r() * 140, h = 90 + r() * 200;
    s += `<rect x="${f2(x)}" y="${f2(base - h)}" width="${f2(w)}" height="${f2(h + 400)}"/>`;
    s += `<path d="M ${f2(x - 8)} ${f2(base - h)} L ${f2(x + w / 2)} ${f2(base - h - 40 - r() * 30)} L ${f2(x + w + 8)} ${f2(base - h)} Z"/>`;
    if (r() < 0.2) s += `<rect x="${f2(x + w * 0.3)}" y="${f2(base - h - 120)}" width="24" height="90"/>`;
    x += w + 10 + r() * 40;
  }
  return s + '</g>';
}
function haze(color, y0 = 300, y1 = 900, op = 0.5) {
  return `<linearGradient id="hz${y0}${y1}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset="1" stop-color="${color}" stop-opacity="${op}"/></linearGradient><rect x="-1400" y="${y0}" width="4720" height="${y1 - y0}" fill="url(#hz${y0}${y1})"/>`;
}

function hangSign(x, y, text, ang = 0, o = {}) {
  const w = o.w || 190, h = o.h || 64, fs = o.fs || 30;
  const dust = o.dust ? `<rect x="${-w / 2}" y="20" width="${w}" height="${h}" rx="10" fill="#9a8a70" opacity="${o.dust}"/>` : '';
  const fl = o.flip || 0, sx = Math.cos(fl * Math.PI);
  if (fl >= 0.5 && o.text2) text = o.text2;
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(ang)})">
   <path d="M 0 0 L ${f2((-w / 2 + 16) * Math.abs(sx))} 22 M 0 0 L ${f2((w / 2 - 16) * Math.abs(sx))} 22" stroke="${INK}" stroke-width="3"/>
   <circle cx="0" cy="0" r="5" fill="${INK}"/>
   <g transform="scale(${Math.max(0.02, Math.abs(sx)).toFixed(3)} 1)">
   <rect x="${-w / 2}" y="20" width="${w}" height="${h}" rx="10" fill="${o.bg || '#c9935a'}" stroke="${INK}" stroke-width="4"/>
   <rect x="${-w / 2 + 7}" y="27" width="${w - 14}" height="${h - 14}" rx="6" fill="none" stroke="${o.trim || '#8a5a34'}" stroke-width="2.5"/>
   <text x="0" y="${20 + h / 2 + fs * 0.36}" text-anchor="middle" ${FONT} font-size="${fs}" fill="${o.fg || '#2a2233'}" letter-spacing="1">${text}</text>
   ${dust}</g>
   ${o.web ? `<path d="M ${w / 2 - 4} 22 l -40 0 M ${w / 2 - 4} 22 l 0 40 M ${w / 2 - 4} 22 l -32 30 M ${w / 2 - 30} 22 q 4 12 26 12 M ${w / 2 - 18} 22 q 2 8 14 8" stroke="#f4f0e6" stroke-width="1.8" fill="none" opacity="0.85"/>` : ''}
  </g>`;
}

function windowBox(x, y, w, h, o = {}) {
  const glass = o.glass || '#6f8fa6', lit = o.lit || 0;
  let s = `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="6" fill="${o.frame || '#efe2c4'}" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mix(glass, '#ffd27a', lit)}" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="12" fill="#1b1424" opacity="0.18"/><rect x="${x}" y="${y}" width="10" height="${h}" fill="#1b1424" opacity="0.12"/>`;
  s += `<path d="M ${x + w / 2} ${y} V ${y + h} M ${x} ${y + h / 2} H ${x + w}" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${x - 16}" y="${y + h + 8}" width="${w + 32}" height="10" rx="3" fill="#f4ead4" stroke="${INK}" stroke-width="2.5"/>`;
  s += `<path d="M ${x + 8} ${y + h * 0.4} L ${x + w * 0.35} ${y + 8}" stroke="#ffffff" stroke-width="5" opacity="0.35"/>`;
  if (o.shutters) for (const k of [-1, 1]) { const sx = k < 0 ? x - 10 - w * 0.42 : x + w + 10; s += `<rect x="${sx}" y="${y - 10}" width="${w * 0.42}" height="${h + 20}" rx="4" fill="${o.shutters}" stroke="${INK}" stroke-width="3"/>`; for (let i = 1; i < 6; i++) s += `<path d="M ${sx + 5} ${y - 10 + (h + 20) * i / 6} h ${w * 0.42 - 10}" stroke="${INK}" stroke-width="2" opacity="0.5"/>`; }
  if (o.flowers) { s += `<rect x="${x - 16}" y="${y + h + 8}" width="${w + 32}" height="24" rx="4" fill="#a44e2c" stroke="${INK}" stroke-width="3"/>`; for (let i = 0; i < 5; i++) { const fx = x - 6 + i * (w + 12) / 4; s += `<circle cx="${fx}" cy="${y + h + 4}" r="12" fill="#7a8a4a" stroke="${INK}" stroke-width="2.5"/><circle cx="${fx + 3}" cy="${y + h - 2}" r="6" fill="${i % 2 ? '#e88aa0' : '#f2c94c'}"/>`; } }
  if (o.cat) s += char('gato', { x: x + w * 0.3, y: y + h + 4, s: 0.6, t: o.t || 0 });
  return s;
}

function door(x, base, w, h, o = {}) {
  let s = `<rect x="${x - 12}" y="${base - h - 12}" width="${w + 24}" height="${h + 12}" rx="8" fill="${o.frame || '#efe2c4'}" stroke="${INK}" stroke-width="3"/>`;
  if (o.open) s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${o.inside || '#3a2a20'}"/>`;
  const dw = w * (1 - (o.open || 0) * 0.85);
  s += `<path d="M ${x} ${base} V ${base - h + 30} Q ${x + w / 2} ${base - h - 18} ${x + w} ${base - h + 30} V ${base}" fill="none" stroke="none"/>`;
  s += `<rect x="${x}" y="${base - h}" width="${dw}" height="${h}" rx="6" fill="${o.color || '#7a4a30'}" stroke="${INK}" stroke-width="4"/><rect x="${x}" y="${base - h}" width="${dw}" height="${h}" rx="6" fill="url(#pWoodV)"/><rect x="${x + dw - 14}" y="${base - h + 4}" width="10" height="${h - 8}" fill="#1b1424" opacity="0.15"/>`;
  s += `<rect x="${x + dw * 0.15}" y="${base - h + 20}" width="${dw * 0.7}" height="${h * 0.3}" rx="4" fill="${o.glass ? '#e9c98a' : 'none'}" stroke="${INK}" stroke-width="3" opacity="0.9"/>`;
  s += `<rect x="${x + dw * 0.15}" y="${base - h * 0.5}" width="${dw * 0.7}" height="${h * 0.38}" rx="4" fill="none" stroke="${INK}" stroke-width="3" opacity="0.5"/>`;
  s += `<circle cx="${x + dw - 16}" cy="${base - h * 0.48}" r="6" fill="#e0a83a" stroke="${INK}" stroke-width="2.5"/>`;
  if (o.sign) s += hangSign(x + w / 2, base - h * 0.66, o.sign, o.signAng || 0, { w: 176, h: 58, fs: 26, flip: o.signFlip, dust: o.dust, web: o.web });
  return s;
}

function house(x, base, w, h, o = {}) {
  const wall = o.wall || '#e9d3a8', roof = o.roof || '#c8643c';
  let s = `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="${wall}" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#${o.brick ? 'pBrick' : 'pPlaster'})"/>`;
  s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#gWallShade)"/>`;
  s += `<rect x="${x}" y="${base - 70}" width="${w}" height="70" fill="url(#gAO)"/>`;
  s += `<rect x="${x}" y="${base - h}" width="${w}" height="34" fill="#2a2233" opacity="0.12"/>`;
  // texture specks
  const r = rng(o.seed || (x | 0)); for (let i = 0; i < 10; i++) s += `<ellipse cx="${f2(x + r() * w)}" cy="${f2(base - r() * h)}" rx="${f2(10 + r() * 20)}" ry="${f2(4 + r() * 6)}" fill="${INK}" opacity="0.05"/>`;
  if (o.flat) s += `<rect x="${x - 14}" y="${base - h - 22}" width="${w + 28}" height="26" fill="${roof}" stroke="${INK}" stroke-width="4"/>`;
  else s += `<path d="M ${x - 26} ${base - h + 4} L ${x + w / 2} ${base - h - (o.roofH || 110)} L ${x + w + 26} ${base - h + 4} Z" fill="${roof}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path d="M ${x - 26} ${base - h + 4} L ${x + w / 2} ${base - h - (o.roofH || 110)} L ${x + w + 26} ${base - h + 4} Z" fill="url(#pTile)"/>` + `<path d="M ${x + w / 2} ${base - h - (o.roofH || 110)} L ${x + w + 26} ${base - h + 4} L ${x + w / 2 + 40} ${base - h + 4} Z" fill="#2a2233" opacity="0.12"/>` +
    `<path d="M ${x - 26} ${base - h + 4} L ${x + w + 26} ${base - h + 4}" stroke="${INK}" stroke-width="4"/>` +
    Array.from({ length: 4 }, (_, i) => `<path d="M ${x + w * (0.15 + i * 0.22)} ${base - h - 4} l 0 ${-(o.roofH || 110) * (0.5 - Math.abs(0.4 - i * 0.25)) * 0.7}" stroke="${INK}" stroke-width="2" opacity="0.25"/>`).join('');
  if (o.chimney) s += `<rect x="${x + w * 0.7}" y="${base - h - (o.roofH || 110) * 0.9}" width="34" height="70" fill="#a44e2c" stroke="${INK}" stroke-width="4"/>`;
  const nw = o.windows == null ? 2 : o.windows;
  for (let i = 0; i < nw; i++) {
    const wx = x + w * (i + 0.5) / nw - 40;
    s += windowBox(wx, base - h + 40, 80, 90, { shutters: o.shutters, flowers: o.flowers && i === 0, glass: o.glass, lit: o.lit, cat: o.cat && i === nw - 1, t: o.t });
  }
  if (o.door) s += door(x + (o.doorX != null ? o.doorX : w / 2 - 65), base, 130, Math.min(230, h * 0.55), { color: o.doorC, sign: o.sign, signAng: o.signAng, dust: o.dust, web: o.web, open: o.open });
  return s;
}

function bakeryFacade(x, base, o = {}) {
  const w = 620, h = 480;
  let s = house(x, base, w, h, { wall: '#f1dcb0', roof: '#a44e2c', windows: 0, roofH: 140, chimney: true, seed: 99 });
  // smoke
  const t = o.t || 0;
  for (let i = 0; i < 5; i++) { const ph = ((t * 0.35 + i / 5) % 1); s += `<circle cx="${f2(x + w * 0.7 + 17 + Math.sin(ph * 6 + i) * 18)}" cy="${f2(base - h - 140 - ph * 220)}" r="${f2(18 + ph * 40)}" fill="#efe6da" opacity="${f2(0.5 * (1 - ph))}"/>`; }
  // sign board
  s += `<rect x="${x + 110}" y="${base - h + 26}" width="${w - 220}" height="84" rx="12" fill="#3c5a4a" stroke="${INK}" stroke-width="5"/>`;
  s += `<text x="${x + w / 2}" y="${base - h + 86}" text-anchor="middle" ${FONT} font-size="56" fill="#f4e6c8" letter-spacing="6">PADARIA</text>`;
  // awning
  const aw = base - h + 140;
  for (let i = 0; i < 10; i++) s += `<path d="M ${x - 20 + i * (w + 40) / 10} ${aw} h ${(w + 40) / 10} v 80 q ${-(w + 40) / 20} 26 ${-(w + 40) / 10} 0 Z" fill="${i % 2 ? '#f4e6c8' : '#c8643c'}" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${x - 26}" y="${aw - 12}" width="${w + 52}" height="16" rx="4" fill="#8a3a22" stroke="${INK}" stroke-width="3"/>`;
  // display window
  const wx = x + 40, wy = base - 250, ww = 300, wh = 190;
  s += `<rect x="${wx - 12}" y="${wy - 12}" width="${ww + 24}" height="${wh + 24}" rx="8" fill="#7a4a30" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="${o.night ? '#f2b45a' : '#e9c98a'}" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${wx}" y="${wy + wh * 0.55}" width="${ww}" height="10" fill="#8a5a34"/>`;
  for (let i = 0; i < 4; i++) s += `<g transform="translate(${wx + 45 + i * 70} ${wy + wh * 0.5})">${bread({ s: 0.6 })}</g>`;
  for (let i = 0; i < 3; i++) s += `<g transform="translate(${wx + 70 + i * 80} ${wy + wh * 0.88})">${bread({ s: 0.55, rot: -8 })}</g>`;
  s += `<path d="M ${wx + 20} ${wy + 70} L ${wx + 90} ${wy + 10}" stroke="#fff" stroke-width="8" opacity="0.3"/>`;
  // door
  s += door(x + 410, base, 150, 250, { color: '#3c5a4a', glass: true, sign: o.sign === false ? null : (o.sign || 'JÁ VOLTO'), signAng: o.signAng || 0, open: o.open, inside: '#5a3a24' });
  // step & plants
  s += `<rect x="${x + 390}" y="${base - 6}" width="190" height="18" fill="#b6a58a" stroke="${INK}" stroke-width="3"/>`;
  s += pot(x + 360, base, 0.9, t) + pot(x + 600, base, 0.8, t + 1);
  return s;
}

function pot(x, base, k = 1, t = 0) {
  const sw = Math.sin(t * 1.3) * 3;
  return `<g transform="translate(${x} ${base}) scale(${k})"><path d="M -30 -50 L 30 -50 L 22 0 L -22 0 Z" fill="#c8643c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <g transform="rotate(${f2(sw)} 0 -50)"><ellipse cx="-18" cy="-80" rx="20" ry="34" fill="#6a7a3e" stroke="${INK}" stroke-width="3.5" transform="rotate(-20 -18 -80)"/><ellipse cx="16" cy="-86" rx="20" ry="38" fill="#7a8a4a" stroke="${INK}" stroke-width="3.5" transform="rotate(18 16 -86)"/><ellipse cx="0" cy="-100" rx="16" ry="34" fill="#8a9a56" stroke="${INK}" stroke-width="3.5"/></g></g>`;
}
function tree(x, base, k = 1, t = 0, c = '#6a7a3e') {
  const sw = Math.sin(t * 0.9 + x) * 2.5;
  return `<g transform="translate(${x} ${base}) scale(${k})"><path d="M -18 0 Q -10 -120 -16 -220 L 16 -220 Q 10 -120 18 0 Z" fill="#6a4a34" stroke="${INK}" stroke-width="4"/>
  <g transform="rotate(${f2(sw)} 0 -220)"><circle cx="-70" cy="-260" r="80" fill="${c}" stroke="${INK}" stroke-width="4"/><circle cx="70" cy="-270" r="84" fill="${c}" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-340" r="100" fill="${mix(c, '#c8d08a', 0.2)}" stroke="${INK}" stroke-width="4"/><circle cx="-30" cy="-370" r="34" fill="#ffffff" opacity="0.12"/></g></g>`;
}
function lamp(x, base, k = 1, lit = 0) {
  return `<g transform="translate(${x} ${base}) scale(${k})"><rect x="-8" y="-380" width="16" height="380" fill="#2f2a3a" stroke="${INK}" stroke-width="3"/><rect x="-22" y="-20" width="44" height="20" fill="#2f2a3a"/>
  <path d="M -30 -380 L 30 -380 L 22 -440 L -22 -440 Z" fill="${mix('#e9d8a8', '#ffd27a', lit)}" stroke="${INK}" stroke-width="4"/><path d="M -36 -440 L 36 -440 L 0 -470 Z" fill="#2f2a3a" stroke="${INK}" stroke-width="3"/>
  ${lit > 0 ? `<circle cx="0" cy="-410" r="120" fill="#ffd27a" opacity="${f2(lit * 0.25)}"/>` : ''}</g>`;
}
function bench(x, base, k = 1) {
  return `<g transform="translate(${x} ${base}) scale(${k})"><rect x="-120" y="-70" width="240" height="18" rx="5" fill="#a46a3a" stroke="${INK}" stroke-width="3.5"/><rect x="-120" y="-120" width="240" height="16" rx="5" fill="#a46a3a" stroke="${INK}" stroke-width="3.5"/><rect x="-120" y="-98" width="240" height="16" rx="5" fill="#a46a3a" stroke="${INK}" stroke-width="3.5"/><path d="M -100 -52 V 0 M 100 -52 V 0" stroke="${INK}" stroke-width="9"/></g>`;
}
function street(base, o = {}) {
  let s = `<rect x="-1400" y="${base}" width="4720" height="46" fill="${o.walk || '#d9c7a4'}" stroke="${INK}" stroke-width="3"/>`;
  for (let x = -1400; x < 3300; x += 90) s += `<path d="M ${x} ${base} v 46" stroke="${INK}" stroke-width="2" opacity="0.2"/>`;
  s += `<rect x="-1400" y="${base}" width="4720" height="46" fill="url(#pPlaster)"/>`;
  s += `<rect x="-1400" y="${base + 46}" width="4720" height="16" fill="#b6a58a" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="-1400" y="${base + 62}" width="4720" height="800" fill="url(#pAsphalt)"/>`;
  s += `<rect x="-1400" y="${base + 62}" width="4720" height="800" fill="${o.road || '#9a8f80'}"/>`;
  const r = rng(11);
  for (let i = 0; i < 160; i++) { const x = r() * 4700 - 1400, y = base + 70 + r() * 360; s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(22 + r() * 12)}" ry="${f2(8 + (y - base) * 0.03)}" fill="${INK}" opacity="0.08"/>`; }
  return s;
}

function bus(x, base, o = {}) {
  const t = o.t || 0, L = 820, Hh = 300, wr = o.wheel || 0;
  const bounce = Math.sin(t * 9) * 2;
  let s = `<g transform="translate(${f2(x)} ${f2(base + bounce)})">`;
  s += `<ellipse cx="${L / 2}" cy="6" rx="${L / 2 + 30}" ry="20" fill="#1b1424" opacity="0.25"/>`;
  s += `<path d="M 0 -60 L 0 -${Hh - 30} Q 0 -${Hh} 30 -${Hh} L ${L - 90} -${Hh} Q ${L - 20} -${Hh} ${L} -${Hh - 70} L ${L} -60 Q ${L} -40 ${L - 20} -40 L 20 -40 Q 0 -40 0 -60 Z" fill="#e0a83a" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="0" y="-150" width="${L}" height="34" fill="#3c7a7a" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="20" y="-${Hh - 12}" width="${L - 130}" height="8" rx="4" fill="#f4e6c8" opacity="0.6"/>`;
  // windows
  const nw = 3;
  for (let i = 0; i < nw; i++) {
    const wx = 30 + i * 128;
    s += `<rect x="${wx}" y="-${Hh - 40}" width="110" height="100" rx="10" fill="#bfd6dc" stroke="${INK}" stroke-width="4"/>`;
    if (o.passengers && o.passengers[i]) s += `<svg x="${wx}" y="-${Hh - 40}" width="110" height="100" overflow="hidden"><g transform="${o.pT || 'translate(55 150) scale(0.5)'}">${o.passengers[i]}</g></svg>`;
    s += `<path d="M ${wx + 10} -${Hh - 120} L ${wx + 60} -${Hh - 50}" stroke="#fff" stroke-width="6" opacity="0.35"/>`;
  }
  // folding front door (o.door 0..1 opens)
  { const dx = 420, dw = 110, dt = -(Hh - 40), db = -42, op = clamp(o.door || 0);
    s += `<rect x="${dx}" y="${dt}" width="${dw}" height="${db - dt}" rx="6" fill="#2a2630" stroke="${INK}" stroke-width="4"/>`;
    if (op > 0.02) s += `<rect x="${dx + 8}" y="${dt + 10}" width="${dw - 16}" height="${db - dt - 14}" fill="#4a4250"/><rect x="${dx + 10}" y="${db - 30}" width="${dw - 20}" height="12" fill="#8a8690" stroke="${INK}" stroke-width="2"/>`;
    const pw = dw / 2 * (1 - op * 0.82);
    for (const side of [0, 1]) { const px = side ? dx + dw - pw : dx; s += `<rect x="${f2(px)}" y="${dt}" width="${f2(pw)}" height="${db - dt}" rx="5" fill="#bfd6dc" stroke="${INK}" stroke-width="4"/><path d="M ${f2(px + pw / 2)} ${dt} V ${db}" stroke="${INK}" stroke-width="3" opacity="${f2(1 - op)}"/><rect x="${f2(px)}" y="${(dt + db) / 2 - 6}" width="${f2(pw)}" height="12" fill="#e0a83a" stroke="${INK}" stroke-width="2"/>`; } }
  // driver window
  s += `<path d="M ${L - 140} -${Hh - 40} L ${L - 60} -${Hh - 40} Q ${L - 10} -${Hh - 60} ${L - 8} -${Hh - 110} L ${L - 8} -${Hh - 140} L ${L - 140} -${Hh - 140} Z" fill="#bfd6dc" stroke="${INK}" stroke-width="4"/>`;
  if (o.emptySeat) s += `<rect x="${L - 120}" y="-${Hh - 80}" width="60" height="70" rx="10" fill="#6a4a3a" stroke="${INK}" stroke-width="3"/><circle cx="${L - 50}" cy="-${Hh - 120}" r="24" fill="none" stroke="#2a2a34" stroke-width="8"/>`;
  if (o.driver) s += `<svg x="${L - 140}" y="-${Hh - 40}" width="132" height="100" overflow="hidden"><g transform="${o.dT || 'translate(66 150) scale(0.5)'}">${o.driver}</g></svg>`;
  // destination sign
  s += `<rect x="${L - 250}" y="-${Hh + 0}" width="170" height="36" rx="6" fill="#2a2233" stroke="${INK}" stroke-width="3" transform="translate(0 6)"/>`;
  s += `<text x="${L - 165}" y="-${Hh - 32}" text-anchor="middle" ${FONT} font-size="24" fill="#f2c94c" letter-spacing="2">CENTRO</text>`;
  // door
  s += `<rect x="${L - 150}" y="-${Hh - 160}" width="0" height="0"/>`;
  s += `<circle cx="${L - 10}" cy="-80" r="14" fill="#fff4c8" stroke="${INK}" stroke-width="3"/>`;
  s += `<rect x="${L - 30}" y="-58" width="34" height="16" rx="4" fill="#5a5a5a" stroke="${INK}" stroke-width="3"/>`;
  // wheels
  for (const wx of [150, L - 170]) {
    s += `<circle cx="${wx}" cy="-40" r="56" fill="#2a2233" stroke="${INK}" stroke-width="4"/><circle cx="${wx}" cy="-40" r="28" fill="#b6b3ad" stroke="${INK}" stroke-width="3"/>`;
    s += `<g transform="rotate(${f2(wr)} ${wx} -40)"><path d="M ${wx - 22} -40 H ${wx + 22} M ${wx} -62 V -18" stroke="${INK}" stroke-width="5"/></g>`;
  }
  return s + '</g>';
}

// Giant clock face
function clockFace(cx, cy, R, hourA, minA, o = {}) {
  let s = `<g transform="translate(${cx} ${cy})">`;
  if (o.glow) s += `<circle r="${R * 1.6}" fill="#ffe7a0" opacity="${f2(o.glow * 0.35)}"/>`;
  s += `<circle r="${R + 26}" fill="#b8862e" stroke="${INK}" stroke-width="6"/>`;
  s += `<circle r="${R + 10}" fill="#e0a83a" stroke="${INK}" stroke-width="4"/>`;
  s += `<circle r="${R}" fill="#fbf1d6" stroke="${INK}" stroke-width="5"/>`;
  s += `<circle r="${R}" fill="url(#gFace)"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0;
    const r1 = R * (big ? 0.84 : 0.9), r2 = R * 0.95;
    s += `<path d="M ${f2(Math.sin(a) * r1)} ${f2(-Math.cos(a) * r1)} L ${f2(Math.sin(a) * r2)} ${f2(-Math.cos(a) * r2)}" stroke="${INK}" stroke-width="${big ? R * 0.03 : R * 0.012}" stroke-linecap="round"/>`;
  }
  const nums = ['XII', 'III', 'VI', 'IX'];
  nums.forEach((n, i) => { const a = i * Math.PI / 2; s += `<text x="${f2(Math.sin(a) * R * 0.68)}" y="${f2(-Math.cos(a) * R * 0.68 + R * 0.07)}" text-anchor="middle" font-family="DejaVu Serif" font-weight="bold" font-size="${f2(R * 0.2)}" fill="${INK}">${n}</text>`; });
  if (o.day != null) {
    s += `<rect x="${f2(-R * 0.24)}" y="${f2(R * 0.22)}" width="${f2(R * 0.48)}" height="${f2(R * 0.26)}" rx="${f2(R * 0.04)}" fill="#2a2233" stroke="#b8862e" stroke-width="${f2(R * 0.02)}"/>`;
    s += `<text x="0" y="${f2(R * 0.42)}" text-anchor="middle" ${FONT} font-size="${f2(R * 0.17)}" fill="#f2c94c">${o.day}</text>`;
  }
  const hand = (a, len, w, c) => `<g transform="rotate(${f2(a)})"><path d="M ${-w} ${R * 0.12} L ${-w * 0.6} ${-len} L 0 ${-len - w * 2} L ${w * 0.6} ${-len} L ${w} ${R * 0.12} Z" fill="${c}" stroke="${INK}" stroke-width="${f2(R * 0.012)}" stroke-linejoin="round"/></g>`;
  s += hand(hourA, R * 0.5, R * 0.05, '#2a2233');
  s += hand(minA, R * 0.78, R * 0.035, '#a44e2c');
  s += `<circle r="${f2(R * 0.06)}" fill="#e0a83a" stroke="${INK}" stroke-width="${f2(R * 0.015)}"/>`;
  if (o.blur) s += `<circle r="${R * 0.8}" fill="none" stroke="#a44e2c" stroke-width="${R * 0.04}" opacity="${f2(o.blur * 0.4)}" stroke-dasharray="${R * 0.6} ${R * 0.4}" transform="rotate(${f2(minA)})"/>`;
  return s + '</g>';
}

function clockTower(cx, base, o = {}) {
  // o.rise 0..1, hour/min angles
  const H = 760, R = 150;
  const rise = o.rise == null ? 1 : o.rise;
  let s = `<clipPath id="ctw${cx}"><rect x="${cx - 1000}" y="${base - 3000}" width="2000" height="3000"/></clipPath><g clip-path="url(#ctw${cx})"><g transform="translate(0 ${f2((1 - rise) * (H + 200))})">`;
  s += `<rect x="${cx - 160}" y="${base - 90}" width="320" height="90" fill="#b6a58a" stroke="${INK}" stroke-width="5"/>`;
  s += `<rect x="${cx - 130}" y="${base - 130}" width="260" height="44" fill="#c9b994" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M ${cx - 70} ${base - 130} L ${cx - 54} ${base - H + R + 40} L ${cx + 54} ${base - H + R + 40} L ${cx + 70} ${base - 130} Z" fill="#8a3a22" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M ${cx - 70} ${base - 130} L ${cx - 54} ${base - H + R + 40} L ${cx + 54} ${base - H + R + 40} L ${cx + 70} ${base - 130} Z" fill="url(#pBrick)"/>`;
  s += `<path d="M ${cx - 70} ${base - 130} L ${cx - 54} ${base - H + R + 40} L ${cx - 30} ${base - H + R + 40} L ${cx - 40} ${base - 130} Z" fill="#ffffff" opacity="0.14"/><path d="M ${cx + 30} ${base - 130} L ${cx + 26} ${base - H + R + 40} L ${cx + 54} ${base - H + R + 40} L ${cx + 70} ${base - 130} Z" fill="#1b1424" opacity="0.18"/>`;
  s += `<rect x="${cx - 160}" y="${base - 90}" width="320" height="90" fill="url(#pBrick)"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${cx - 62 + i * 2}" y="${base - 200 - i * 120}" width="${124 - i * 4}" height="12" fill="#e0a83a" stroke="${INK}" stroke-width="3"/>`;
  s += `<path d="M ${cx - R - 40} ${base - H - R + 40} L ${cx} ${base - H - R - 110} L ${cx + R + 40} ${base - H - R + 40} Z" fill="#3c5a4a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<circle cx="${cx}" cy="${base - H - R - 116}" r="14" fill="#e0a83a" stroke="${INK}" stroke-width="4"/>`;
  s += clockFace(cx, base - H + 40 - R * 0.0, R, o.hour || 0, o.min || 0, { day: o.day, glow: o.glow, blur: o.blur });
  s += '</g></g>';
  return s;
}

function plazaGround(base) {
  let s = `<rect x="-1400" y="${base}" width="4720" height="900" fill="#d6c39a"/>`;
  s += `<rect x="-1400" y="${base}" width="4720" height="900" fill="url(#pPlaster)"/>`;
  for (let i = 0; i < 14; i++) { const y = base + Math.pow(i, 1.5) * 12; s += `<path d="M -1400 ${f2(y)} H 3300" stroke="${INK}" stroke-width="2" opacity="0.12"/>`; }
  for (let i = -20; i < 40; i++) s += `<path d="M ${960 + i * 80} ${base} L ${960 + i * 260} ${base + 900}" stroke="${INK}" stroke-width="2" opacity="0.1"/>`;
  return s;
}

// Bakery interior kit
function bakeryInterior(t, o = {}) {
  let s = `<rect x="-800" y="-400" width="3600" height="1900" fill="#e6c48e"/>`;
  s += `<rect x="-800" y="-400" width="3600" height="1900" fill="url(#pStripes)"/>`;
  s += `<rect x="-800" y="-400" width="3600" height="1900" fill="url(#gWallShade)"/>`;
  // tiled lower wall
  s += `<rect x="-800" y="640" width="3600" height="400" fill="#c9a56a"/>`;
  for (let x = -800; x < 2800; x += 60) s += `<path d="M ${x} 640 V 1040" stroke="${INK}" stroke-width="2" opacity="0.12"/>`;
  // shelves with bread
  for (const [sx, sy] of [[-260, 240], [-260, 420], [260, 240], [260, 420]]) {
    s += `<rect x="${sx}" y="${sy}" width="440" height="18" fill="#8a5a34" stroke="${INK}" stroke-width="3"/>`;
    for (let i = 0; i < 5; i++) s += `<g transform="translate(${sx + 50 + i * 85} ${sy - 18})">${bread({ s: 0.62, rot: (i % 2 ? 6 : -4) })}</g>`;
  }
  // oven
  const fl = 0.75 + 0.25 * Math.sin(t * 7) * Math.sin(t * 3.1);
  s += `<path d="M 820 640 L 820 330 Q 1010 140 1200 330 L 1200 640 Z" fill="#a44e2c" stroke="${INK}" stroke-width="5"/>`;
  s += `<path d="M 880 640 L 880 400 Q 1010 270 1140 400 L 1140 640 Z" fill="#2a1a1a" stroke="${INK}" stroke-width="4"/>`;
  s += `<ellipse cx="1010" cy="600" rx="${f2(110 * fl)}" ry="${f2(60 * fl)}" fill="#f2a43a" opacity="0.9"/><ellipse cx="1010" cy="610" rx="${f2(70 * fl)}" ry="${f2(36 * fl)}" fill="#ffe08a"/>`;
  s += `<circle cx="1010" cy="520" r="260" fill="#ffb24a" opacity="${f2(0.12 * fl)}"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M ${830 + i * 64} 340 l 0 0" />`;
  // wall clock (small)
  if (o.clock !== false) s += `<g>${clockFace(o.clockX || 1450, o.clockY || 260, 70, o.hour || 300, o.min || 0)}</g>`;
  // window
  s += windowBox(1340, 400, 200, 170, { glass: '#bfe0e8', lit: 0 });
  // door
  s += door(1640, 900, 180, 330, { color: '#3c5a4a', glass: true, open: o.doorOpen || 0, inside: '#f2d9a0', sign: null });
  // hanging lamp
  s += `<path d="M 600 -400 V 120" stroke="${INK}" stroke-width="4"/><path d="M 550 120 L 650 120 L 620 80 L 580 80 Z" fill="#3c5a4a" stroke="${INK}" stroke-width="4"/><circle cx="600" cy="140" r="18" fill="#ffe08a"/><circle cx="600" cy="160" r="160" fill="#ffd27a" opacity="0.15"/>`;
  // floor
  s += `<rect x="-800" y="900" width="3600" height="400" fill="#8a5a34"/><rect x="-800" y="900" width="3600" height="400" fill="url(#pWood)"/><rect x="-800" y="900" width="3600" height="40" fill="#1b1424" opacity="0.22"/>`;
  for (let i = 0; i < 30; i++) s += `<path d="M ${-800 + i * 140} 900 L ${-1200 + i * 200} 1300" stroke="${INK}" stroke-width="2" opacity="0.15"/>`;
  return s;
}
function counter(x, y, w) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="300" fill="#7a4a30" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="300" fill="url(#pWoodV)"/><rect x="${x}" y="${y}" width="${w}" height="26" fill="#1b1424" opacity="0.25"/>`;
  s += `<rect x="${x - 20}" y="${y - 26}" width="${w + 40}" height="30" rx="6" fill="#c9935a" stroke="${INK}" stroke-width="5"/>`;
  for (let i = 0; i < Math.floor(w / 180); i++) s += `<rect x="${x + 30 + i * 180}" y="${y + 40}" width="140" height="200" rx="8" fill="none" stroke="${INK}" stroke-width="3" opacity="0.4"/>`;
  return s;
}
function basket(x, y, k = 1) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><g transform="translate(-40 -36)">${bread({ s: 0.7, rot: -18 })}</g><g transform="translate(36 -40)">${bread({ s: 0.7, rot: 14 })}</g><g transform="translate(0 -52)">${bread({ s: 0.7 })}</g>
  <path d="M -100 -30 L 100 -30 L 80 30 L -80 30 Z" fill="#c9935a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M -90 -10 H 90 M -84 10 H 84" stroke="#8a5a34" stroke-width="4"/></g>`;
}
function dust(t, x0, y0, w, h, n = 24, seed = 4, c = '#fff4d0') {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const bx = r() * w, by = r() * h, sp = 6 + r() * 14, ph = r() * 6;
    const x = x0 + (bx + Math.sin(t * 0.6 + ph) * 20 + t * sp) % w, y = y0 + (by - t * sp * 0.5 + h * 10) % h;
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(1.5 + r() * 2.5)}" fill="${c}" opacity="${f2(0.3 + 0.4 * Math.abs(Math.sin(t + ph)))}"/>`;
  }
  return s;
}
function thought(x, y, k, content, op = 1) {
  return `<g transform="translate(${x} ${y}) scale(${f2(k)})" opacity="${f2(op)}"><circle cx="-80" cy="90" r="10" fill="#fbf4e4" stroke="${INK}" stroke-width="3"/><circle cx="-50" cy="60" r="16" fill="#fbf4e4" stroke="${INK}" stroke-width="3"/>
  <path d="M -60 0 C -80 -60 -20 -80 0 -60 C 20 -95 90 -80 80 -30 C 120 -10 100 50 50 40 C 30 70 -40 60 -40 30 C -90 40 -90 0 -60 0 Z" fill="#fbf4e4" stroke="${INK}" stroke-width="4"/>
  <g transform="translate(10 -10)">${content}</g></g>`;
}
function speedLines(x, y, n, len, ang, op, seed = 1) {
  const r = rng(seed); let s = `<g transform="translate(${x} ${y}) rotate(${ang})" opacity="${f2(op)}">`;
  for (let i = 0; i < n; i++) { const yy = (r() - 0.5) * 300, l = len * (0.5 + r()); s += `<path d="M ${f2(-r() * 100)} ${f2(yy)} h ${f2(-l)}" stroke="#fbf4e4" stroke-width="5" stroke-linecap="round"/>`; }
  return s + '</g>';
}
// radial "voice" ripple to show who is saying "já volto" without text
function ripple(x, y, p, c = '#fbf4e4') {
  if (p <= 0 || p >= 1) return '';
  let s = '';
  for (let i = 0; i < 3; i++) { const q = clamp(p * 1.4 - i * 0.18); if (q <= 0 || q >= 1) continue; s += `<path d="M ${x} ${y - 40 - q * 50} A ${40 + q * 50} ${40 + q * 50} 0 0 1 ${x + 40 + q * 50} ${y}" stroke="${c}" stroke-width="${f2(8 * (1 - q))}" fill="none" stroke-linecap="round" opacity="${f2(1 - q)}"/>`; }
  return s;
}

function pigeon(x, y, t, seed = 1, k = 1, fly = null) {
  const r = rng(seed); const ph = r() * 6;
  let dx = 0, dy = 0, wing = 0;
  if (fly != null && t > fly) { const a = t - fly; dx = a * 260 * (seed % 2 ? 1 : -1); dy = -a * 220 - a * a * 40; wing = Math.sin(a * 40) * 40; }
  const peck = fly != null && t > fly ? 0 : Math.max(0, Math.sin(t * 5 + ph)) * 10;
  const dir = seed % 2 ? 1 : -1;
  return `<g transform="translate(${f2(x + dx)} ${f2(y + dy)}) scale(${f2(k * dir)} ${f2(k)})">
   <ellipse cx="0" cy="-18" rx="22" ry="14" fill="#8a8f9e" stroke="${INK}" stroke-width="3"/>
   <path d="M -6 -26 Q -26 ${f2(-30 - wing)} -30 -14 Q -14 -12 -6 -18 Z" fill="#6e7384" stroke="${INK}" stroke-width="3"/>
   <path d="M -20 -16 L -32 -22 L -30 -10 Z" fill="#5a5f70" stroke="${INK}" stroke-width="2.5"/>
   <g transform="rotate(${f2(peck * 3)} 14 -24)"><circle cx="18" cy="-30" r="9" fill="#7a8090" stroke="${INK}" stroke-width="3"/><circle cx="21" cy="-32" r="2" fill="${INK}"/><path d="M 26 -30 l 7 2 l -7 2 Z" fill="#e0a83a"/></g>
   ${fly != null && t > fly ? '' : `<path d="M -2 -6 v 6 M 6 -6 v 6" stroke="#e07a5a" stroke-width="3"/>`}</g>`;
}
function walkers(t, y, k, seed, n = 4, span = 3000, avoid = null) {
  const r = rng(seed); let s = '';
  const ids = typeof NPC_IDS !== 'undefined' ? NPC_IDS.filter((_, i) => (i + seed) % 3 === 0) : ['viz1', 'viz2', 'viz3', 'moca', 'motorista', 'mulher'];
  for (let i = 0; i < n; i++) {
    const sp = (40 + r() * 50) * (r() < 0.5 ? 1 : -1), x0 = r() * span - 600;
    const x = ((x0 + t * sp) % span + span) % span - 600;
    const fade = avoid == null ? 1 : clamp((Math.abs(x - avoid) - 200) / 140);
    if (fade <= 0.01) continue;
    s += person(ids[i % ids.length], { x, y, s: k, t, face: sp > 0 ? 0.8 : -0.8, side: true, walk: t * 9 + i, shadow: true, fade: fade < 1 ? fade : undefined });
  }
  return s;
}
function leaves(x0, x1, y, seed = 4, n = 30) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + r() * (x1 - x0), yy = y - r() * 14, c = ['#d0704a', '#e0a83a', '#a85a3a', '#c8b04a'][i % 4]; s += `<path transform="translate(${f2(x)} ${f2(yy)}) rotate(${f2(r() * 360)})" d="M -10 0 Q 0 -8 10 0 Q 0 8 -10 0 Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`; }
  return s;
}
function banner(x, y, w, text, t) {
  const sag = 26;
  let s = `<path d="M ${x} ${y} Q ${x + w / 2} ${y + sag * 2} ${x + w} ${y}" stroke="${INK}" stroke-width="3" fill="none"/>`;
  s += `<path d="M ${x} ${y + 6} Q ${x + w / 2} ${y + sag * 2 + 6} ${x + w} ${y + 6} L ${x + w} ${y + 62} Q ${x + w / 2} ${y + sag * 2 + 62} ${x} ${y + 62} Z" fill="#fff4dc" stroke="${INK}" stroke-width="4"/>`;
  s += `<path id="bnr${x}" d="M ${x + 20} ${y + 48} Q ${x + w / 2} ${y + sag * 2 + 48} ${x + w - 20} ${y + 48}" fill="none"/>`;
  s += `<text font-family="Fredoka" font-weight="700" font-size="30" fill="#d0503a" letter-spacing="0.5"><textPath href="#bnr${x}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`;
  for (let i = 0; i < 9; i++) { const u = (i + 0.5) / 9, bx = x + w * u, by = y + 4 * sag * u * (1 - u) * 2 + 64; s += `<path d="M ${f2(bx - 14)} ${f2(by)} L ${f2(bx + 14)} ${f2(by)} L ${f2(bx)} ${f2(by + 28 + Math.sin(t * 3 + i) * 2)} Z" fill="${['#e86a6a', '#f2c230', '#5ab0d8', '#7ab06a'][i % 4]}" stroke="${INK}" stroke-width="2.5"/>`; }
  return s;
}
function cake(x, y, t) {
  let s = `<rect x="${x - 50}" y="${y - 54}" width="100" height="54" rx="8" fill="#f6e0c8" stroke="${INK}" stroke-width="4"/><path d="M ${x - 50} ${y - 40} q 12 14 25 0 q 12 14 25 0 q 12 14 25 0 q 12 14 25 0" fill="#e88aa8" stroke="${INK}" stroke-width="3"/>`;
  for (const k of [-24, 0, 24]) { const fl = 1 + Math.sin(t * 20 + k) * 0.2; s += `<rect x="${x + k - 4}" y="${y - 84}" width="8" height="30" fill="#5ab0d8" stroke="${INK}" stroke-width="2"/><ellipse cx="${x + k}" cy="${y - 92}" rx="${f2(5 * fl)}" ry="${f2(9 * fl)}" fill="#ffb03a"/>`; }
  return s + `<rect x="${x - 64}" y="${y - 4}" width="128" height="10" rx="5" fill="#e8e0d8" stroke="${INK}" stroke-width="3"/>`;
}
