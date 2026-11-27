// Overlays SVG do episódio "Áudios"
const TXT = (x, y, s, fs, fill = '#fff6e0', o = '') => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${fill}" stroke="${INK}" stroke-width="${Math.round(fs / 7)}" paint-order="stroke" ${o}>${s}</text>`;
const popIcon = (T, t0, svg, x, y, k = 1) => { const p = E.back(clamp((T - t0) / 0.25)); return p <= 0 ? '' : `<g transform="translate(${x} ${y + Math.sin(T * 3) * 6}) scale(${f2(p * k)})">${svg}</g>`; };
const shake = (T, t0, a = 14) => { const k = clamp(1 - (T - t0) / 0.35); return T < t0 || k <= 0 ? 0 : Math.sin(T * 90) * a * k; };
function bubble(txt, w = 520, fs = 54, col = '#fffaf0') { return `<path d="M ${-w / 2} -70 H ${w / 2} Q ${w / 2 + 30} -70 ${w / 2 + 30} -40 V 40 Q ${w / 2 + 30} 70 ${w / 2} 70 H 40 L 0 120 L -10 70 H ${-w / 2} Q ${-w / 2 - 30} 70 ${-w / 2 - 30} 40 V -40 Q ${-w / 2 - 30} -70 ${-w / 2} -70 Z" fill="${col}" stroke="${INK}" stroke-width="8"/><text y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${fs}" fill="${INK}">${txt}</text>`; }
function banner(T, t0, l1, l2, l3, y = 420) {
  const p = E.back(clamp((T - t0) / 0.3));
  return `<g transform="translate(540 ${y}) scale(${f2(p)}) rotate(-2)"><rect x="-480" y="-120" width="960" height="${l3 ? 250 : 200}" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/>
   ${TXT(0, -40, l1, 54, INK, 'stroke-width="0"')}${TXT(0, 50, l2, 70, '#e8503a')}${l3 ? `<g transform="translate(0 150) scale(${f2(1 + 0.06 * Math.sin(T * 8))})"><rect x="-260" y="-56" width="520" height="94" rx="20" fill="#ffd23f" stroke="${INK}" stroke-width="8"/>${TXT(0, 18, l3, 62, INK, 'stroke-width="0"')}</g>` : ''}</g>`;
}
const heart = (c = '#e8503a') => `<path d="M 0 14 C -30 -8 -18 -30 0 -16 C 18 -30 30 -8 0 14 Z" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
// bolha de áudio no celular
function audioRow(x, y, dur, read, k = 1, playing = -1) {
  let w = ''; for (let i = 0; i < 16; i++) { const h = 10 + Math.abs(Math.sin(i * 1.7 + 0.4)) * 34; w += `<rect x="${110 + i * 15}" y="${-h / 2}" width="8" height="${h}" rx="4" fill="${playing >= 0 && i / 16 < playing ? '#e8503a' : '#5a5068'}"/>`; }
  const tick = read ? '#3a8ae8' : '#9a94a4';
  return `<g transform="translate(${x} ${y}) scale(${f2(k)})"><rect x="0" y="-52" width="470" height="104" rx="30" fill="#ffffff" stroke="${INK}" stroke-width="5"/>
   <circle cx="58" cy="0" r="32" fill="#ffd23f" stroke="${INK}" stroke-width="4"/><path d="M 48 -16 L 48 16 L 74 0 Z" fill="${INK}"/>${w}
   <text x="360" y="44" font-family="Fredoka" font-weight="600" font-size="24" fill="#5a5068">${dur}</text>
   <path d="M 410 30 l 9 9 l 17 -19 M 424 30 l 9 9 l 17 -19" stroke="${tick}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
}
function textRow(x, y, txt, k = 1) { return `<g transform="translate(${x} ${y}) scale(${f2(k)})"><rect x="0" y="-52" width="${Math.max(260, txt.length * 23 + 60)}" height="104" rx="30" fill="#ffffff" stroke="${INK}" stroke-width="5"/><text x="30" y="14" font-family="Fredoka" font-weight="600" font-size="40" fill="${INK}">${esc(txt)}</text></g>`; }
// celular grande na tela: rows = [{t0, kind:'audio'|'text', dur, txt, read}]
function phoneUI(T, t0, rows, o = {}) {
  const p = E.back(clamp((T - t0) / 0.3)), y = o.y || 820;
  let s = `<g transform="translate(540 ${y}) scale(${f2(p * (o.k || 1))}) rotate(${o.rot || 3})"><rect x="-330" y="-560" width="660" height="1120" rx="70" fill="#2a2436" stroke="${INK}" stroke-width="10"/>
   <rect x="-300" y="-520" width="600" height="1040" rx="44" fill="#eae4f2"/><rect x="-300" y="-520" width="600" height="120" rx="44" fill="#5a7ad0"/><rect x="-300" y="-440" width="600" height="40" fill="#5a7ad0"/>
   <circle cx="-230" cy="-460" r="34" fill="#c98b5e" stroke="${INK}" stroke-width="4"/><path d="M -262 -470 Q -230 -520 -198 -470" fill="#3a2018"/>
   <text x="-180" y="-446" font-family="Fredoka" font-weight="700" font-size="44" fill="#fff">Mãe</text><g transform="translate(-60 -462) scale(0.8)">${heart()}</g>`;
  const vis = rows.filter(r => T >= r.t0).slice(-(o.max || 6));
  vis.forEach((r, i) => { const a = E.back(clamp((T - r.t0) / 0.25)), yy = -330 + i * 140;
    s += r.kind === 'text' ? textRow(-280, yy, r.txt, a) : audioRow(-280, yy, r.dur, r.read && T > (r.readAt || r.t0 + 0.5), a, r.play != null ? r.play : -1); });
  if (o.foot) s += TXT(0, 470, o.foot, 40, '#e8503a');
  return s + '</g>';
}
// placar: áudios não ouvidos na caixa
function CNT(T) { return T < 17.3 ? 0 : T < 44 ? Math.round(lerp(2, 47, E.inOut(inv(17.3, 44, T)))) : T < 66 ? 47 : T < 84 ? Math.round(lerp(47, 0, E.inOut(inv(66, 83.5, T)))) : 0; }
function HUD3(T) {
  if (T < 15.6 || T > 86.5) return '';
  const a = clamp(Math.min((T - 15.6) / 0.3, (86.5 - T) / 0.3)), n = CNT(T), bump = pulse(T, Math.floor(T * 3) / 3, 0.1) * (n % 2 ? 0.06 : 0);
  return `<g opacity="${f2(a)}" transform="translate(${f2(870 + (1 - a) * 120)} 330)"><rect x="-170" y="-60" width="340" height="150" rx="26" fill="#fff6e0" stroke="${INK}" stroke-width="7" transform="rotate(2)"/>
   <text x="0" y="-16" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="${INK}">NÃO OUVIDOS</text>
   <g transform="translate(-92 44)"><circle r="34" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><path d="M -10 -16 L -10 16 L 16 0 Z" fill="${INK}"/></g>
   <g transform="translate(40 66) scale(${f2(1 + bump)})">${TXT(0, 0, n, 84, n ? '#e8503a' : '#3a8ae8')}</g></g>`;
}
function calendar(txt) { return `<rect x="-110" y="-90" width="220" height="190" rx="16" fill="#fffaf0" stroke="${INK}" stroke-width="7"/><rect x="-110" y="-90" width="220" height="56" rx="14" fill="#e8503a" stroke="${INK}" stroke-width="7"/>${TXT(0, 60, txt, 64, INK, 'stroke-width="0"')}`; }
// ícones dos assuntos da mãe
const ICON = {
  janta: `<circle r="70" fill="#fff6e0" stroke="${INK}" stroke-width="7"/><ellipse cx="0" cy="10" rx="54" ry="30" fill="#e8503a" stroke="${INK}" stroke-width="6"/><path d="M -20 -30 q 10 -20 0 -36 M 10 -30 q 10 -20 0 -36" stroke="#9a94a4" stroke-width="6" fill="none"/>`,
  tempo: `<circle r="70" fill="#9fd0f0" stroke="${INK}" stroke-width="7"/><circle cx="-14" cy="-10" r="28" fill="#ffd23f" stroke="${INK}" stroke-width="5"/><path d="M -10 30 q 0 -30 30 -26 q 10 -24 34 -6 q 20 4 12 32 Z" fill="#fff" stroke="${INK}" stroke-width="5"/>`,
  vizinho: `<circle r="70" fill="#f2d27a" stroke="${INK}" stroke-width="7"/><path d="M -40 40 V -4 L 0 -38 L 40 -4 V 40 Z" fill="#e8a8b8" stroke="${INK}" stroke-width="6"/><rect x="-10" y="10" width="20" height="30" fill="#7a4a8a" stroke="${INK}" stroke-width="4"/>`,
  bolo: `<circle r="70" fill="#fff0f4" stroke="${INK}" stroke-width="7"/><rect x="-44" y="-10" width="88" height="44" rx="8" fill="#8a4a2a" stroke="${INK}" stroke-width="6"/><path d="M -44 -6 q 22 16 44 0 q 22 16 44 0 v -10 h -88 Z" fill="#fff0f4" stroke="${INK}" stroke-width="5"/><circle cy="-30" r="10" fill="#e8503a" stroke="${INK}" stroke-width="4"/>`,
};
