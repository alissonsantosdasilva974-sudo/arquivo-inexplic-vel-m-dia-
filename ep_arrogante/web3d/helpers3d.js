// Auxiliares de overlay (copiados do motor SVG)
const HGT = T => T < 27.0 ? 1.75 : T < 34.9 ? lerp(1.75, 1.77, E.back(inv(27.0, 27.6, T))) : T < 54.4 ? lerp(1.77, 1.87, E.back(inv(34.9, 35.5, T))) :
  T < 77.6 ? kf(T, [[54.5, 1.87], [54.9, 2.3, E.back], [55.3, 2.7, E.back], [55.8, 3.0, E.back]]) : kf(T, [[77.6, 3.0], [79.4, 2.45], [80.2, 2.0], [82.2, 1.75]]);
const leavesWind = (T, n = 14, op = 1) => { let s = ''; const r = rng(31); for (let i = 0; i < n; i++) { const sp = 300 + r() * 300, x = ((r() * 2400 + T * sp) % 2600) - 400, y = 200 + r() * 1300 + Math.sin(T * 3 + i) * 40; s += `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(T * 200 + i * 40)})" d="M -14 0 Q 0 -10 14 0 Q 0 10 -14 0 Z" fill="${['#ee8aaa', '#f2c230', '#d0704a'][i % 3]}" stroke="${INK}" stroke-width="2.5" opacity="${op}"/>`; } return s; };
const flashBorder = () => `<path d="M 0 0 H 1080 V 1920 H 0 Z M 40 60 L 1040 46 L 1030 1870 L 50 1880 Z" fill="#f4e4c4" fill-rule="evenodd"/><path d="M 40 60 L 1040 46 L 1030 1870 L 50 1880 Z" fill="none" stroke="#8a6a4a" stroke-width="6"/>`;
const popIcon = (T, t0, svg, x, y, k = 1) => { const p = E.back(clamp((T - t0) / 0.25)); return p <= 0 ? '' : `<g transform="translate(${x} ${y + Math.sin(T * 3) * 6}) scale(${f2(p * k)})">${svg}</g>`; };
function ruleBanner(T, t0) {
  const p = E.back(clamp((T - t0) / 0.3));
  return `<g transform="translate(540 400) scale(${f2(p)}) rotate(-2)"><rect x="-470" y="-120" width="940" height="230" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/>
   <text y="-40" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">NESTA CIDADE,</text>
   <text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="4" paint-order="stroke">QUEM FICA ARROGANTE</text>
   <g transform="translate(0 150) scale(${f2(1 + 0.08 * Math.sin(T * 8))})"><rect x="-190" y="-58" width="380" height="96" rx="20" fill="#ffd23f" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="${INK}">CRESCE</text></g></g>`;
}
function calendar(txt) { return `<rect x="-90" y="-80" width="180" height="170" rx="16" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><rect x="-90" y="-80" width="180" height="50" rx="14" fill="#e8503a" stroke="${INK}" stroke-width="7"/><text y="50" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="70" fill="${INK}">${txt}</text>`; }
function bubble(txt, w = 520, fs = 54, col = '#fffaf0') { return `<path d="M ${-w / 2} -70 H ${w / 2} Q ${w / 2 + 30} -70 ${w / 2 + 30} -40 V 40 Q ${w / 2 + 30} 70 ${w / 2} 70 H 40 L 0 120 L -10 70 H ${-w / 2} Q ${-w / 2 - 30} 70 ${-w / 2 - 30} 40 V -40 Q ${-w / 2 - 30} -70 ${-w / 2} -70 Z" fill="${col}" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${INK}">${txt}</text>`; }
const shake = (T, t0, a = 14) => { const k = clamp(1 - (T - t0) / 0.35); return T < t0 || k <= 0 ? 0 : Math.sin(T * 90) * a * k; };
// Régua de altura do Freitas (placar do episódio)
function HUD3(T) {
  if (T < 25.8 || T > 83.4) return '';
  const a = clamp(Math.min((T - 25.8) / 0.3, (83.4 - T) / 0.3));
  const h = HGT(T), y0 = 1150, y1 = 560, yy = y => lerp(y0, y1, y / 3.2);
  let s = `<g opacity="${f2(a)}" transform="translate(${f2(1000 + (1 - a) * 80)} 0)"><rect x="-26" y="${y1 - 20}" width="52" height="${y0 - y1 + 40}" rx="14" fill="#fff6e0" stroke="${INK}" stroke-width="6"/>`;
  for (let m = 0; m <= 3; m++) s += `<path d="M -26 ${f2(yy(m))} h 26" stroke="${INK}" stroke-width="5"/><text x="-36" y="${f2(yy(m) + 10)}" text-anchor="end" font-family="Fredoka" font-weight="700" font-size="30" fill="#fff6e0" stroke="${INK}" stroke-width="7" paint-order="stroke">${m}m</text>`;
  s += `<rect x="-18" y="${f2(yy(h))}" width="36" height="${f2(y0 - yy(h))}" rx="10" fill="#e8503a"/>`;
  const lbl = h.toFixed(2).replace('.', ',') + ' m';
  s += `<g transform="translate(-50 ${f2(yy(h))})"><rect x="-170" y="-34" width="170" height="60" rx="14" fill="#ffd23f" stroke="${INK}" stroke-width="6"/><text x="-85" y="10" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="34" fill="${INK}">${lbl}</text></g>`;
  return s + `<text x="0" y="${y0 + 64}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="26" fill="#fff6e0" stroke="${INK}" stroke-width="6" paint-order="stroke">FREITAS</text></g>`;
}
