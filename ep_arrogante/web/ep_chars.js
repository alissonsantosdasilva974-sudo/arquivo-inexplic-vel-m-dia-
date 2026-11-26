// Ep. "Quem fica arrogante cresce" — elenco novo no mesmo rig do canal (characters2.js).
// Freitas (craque, linha), Saci (goleiro), Mavie (cachorrinha). Uniformes lisos: só cor e número, sem escudo/marca.
const GLOVE = '#f6a83a';
Object.assign(CAST2, {
  freitas: { skin: '#e2a878', top: '#e8503a', topD: '#c23a28', topType: 'tee', num: '10', numC: '#fff6e8', collar: '#fff6e8', bottom: '#f4f1ea', shorts: 1, socks: '#e8503a', shoes: '#2a2228', cleats: 1, hair: 'straight', hairC: '#1d1a22', w: 1.02, seed: 21 },
  saci:    { skin: '#9a6038', top: '#5a4ab8', topD: '#40329a', topType: 'keeper', num: '1', numC: '#f6a83a', collar: '#f6a83a', bottom: '#2a2a3a', shoes: '#2a2228', cleats: 1, hands: GLOVE, hair: 'cloud', hairC: '#1d1a22', w: 1.0, seed: 22 },
});
CAST2.saciSem = Object.assign({}, CAST2.saci, { hands: CAST2.saci.skin, seed: 23 });

// --- extras no torso: número, gola, apito do Polo ---
const _torso2 = torso2;
torso2 = function (P, d, k) {
  const r = _torso2(P, d, k);
  if (P.num) {
    r.svg += `<path d="M -28 -244 Q 0 -218 28 -244" stroke="${P.collar}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    r.svg += `<text x="0" y="-150" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="${P.numC}" stroke="${OL}" stroke-width="5" paint-order="stroke">${P.num}</text>`;
  }
  if (d.whistle) r.svg += `<path d="M -30 -246 Q -20 -214 -6 -196 M 30 -246 Q 20 -214 6 -196" stroke="#c8443c" stroke-width="5" fill="none"/>` +
    `<g transform="translate(0 -186)"><rect x="-16" y="-10" width="34" height="20" rx="9" fill="#d8dce4" stroke="${OL}" stroke-width="4"/><rect x="14" y="-6" width="14" height="10" rx="3" fill="#b8bcc8" stroke="${OL}" stroke-width="3"/><circle cx="-4" cy="-3" r="4" fill="#fff" opacity="0.7"/></g>`;
  return r;
};
// --- meiões e chuteiras (vista de frente) ---
const _legs2 = legs2;
legs2 = function (P, lA, rA, dir, fb) {
  let s = _legs2(P, lA, rA, dir, fb);
  if (fb) for (const x of [-24 * (P.w || 1) * 0.8, 24 * (P.w || 1) * 0.8]) {
    if (P.socks) s += `<path d="M ${f2(x)} -66 L ${f2(x)} -26" stroke="${OL}" stroke-width="34" stroke-linecap="butt"/><path d="M ${f2(x)} -64 L ${f2(x)} -26" stroke="${P.socks}" stroke-width="23"/><path d="M ${f2(x)} -58 L ${f2(x)} -50" stroke="#fff6e8" stroke-width="23"/>`;
    if (P.cleats) s += `<path d="M ${f2(x - 14)} 8 v 6 M ${f2(x)} 9 v 6 M ${f2(x + 14)} 8 v 6" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return s;
};
// --- cabelo liso com franja (Freitas) ---
const _hairFront2 = hairFront2;
hairFront2 = function (P, d, dir, fx) {
  if (P.hair !== 'straight') return _hairFront2(P, d, dir, fx);
  const c = P.hairC, hl = lite(c, 0.35);
  return `<path d="M -88 ${H2 + 6} C -96 ${H2 - 116} 96 ${H2 - 116} 88 ${H2 + 6} Q 80 ${H2 - 40} 60 ${H2 - 50} Q ${f2(fx + 20)} ${H2 - 30} ${f2(fx - 10)} ${H2 - 52} Q -30 ${H2 - 36} -50 ${H2 - 54} Q -70 ${H2 - 30} -88 ${H2 + 6} Z" fill="${c}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>` +
    `<path d="M -44 ${H2 - 74} Q 0 ${H2 - 92} 44 ${H2 - 76}" stroke="${hl}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
};
const _hairBack2 = hairBack2;
hairBack2 = function (P, dir) { return P.hair === 'straight' ? '' : _hairBack2(P, dir); };
// --- luvas de goleiro maiores ---
const _mitt = mitt;
mitt = function (hx, hy, ex, ey, col, pose) {
  const s = _mitt(hx, hy, ex, ey, col, pose);
  if (col !== GLOVE) return s;
  return `<g transform="translate(${f2(hx)} ${f2(hy)}) scale(1.4) translate(${f2(-hx)} ${f2(-hy)})">${s}<g transform="translate(${f2(hx)} ${f2(hy)})"><path d="M -12 6 h 22" stroke="#fff6e8" stroke-width="5" stroke-linecap="round"/></g></g>`;
};

// --- Mavie: cachorrinha creme com orelha caramelo e laço rosa ---
function mavie(x, y, o = {}) {
  let s = dog(x, y, Object.assign({ s: 0.62 }, o));
  s = s.replace(/#b8763e/g, '#f6ecd8').replace(/#a8683a/g, '#e8dcc4').replace(/#7a4626/g, '#c8844a').replace(/#e8c49a/g, '#fffaf0').replace(/#c8443c/g, '#e8609a');
  if (o.hurt) s += `<g transform="translate(${f2(x + (o.face < 0 ? -40 : 40) * (o.s || 0.62) * 1.6)} ${f2(y - 120 * (o.s || 0.62))})">${starBurst(o.t || 0)}</g>`;
  return s;
}
function starBurst(t) {
  let s = '';
  for (let i = 0; i < 3; i++) { const a = t * 4 + i * 2.1; s += `<path transform="translate(${f2(Math.cos(a) * 34)} ${f2(Math.sin(a) * 12 - 20)}) scale(0.5)" d="M 0 -20 L 6 -6 L 20 -6 L 9 3 L 13 18 L 0 9 L -13 18 L -9 3 L -20 -6 L -6 -6 Z" fill="#ffd23f" stroke="${OL}" stroke-width="4"/>`; }
  return s;
}
// --- objetos ---
function ball(x, y, r = 22, rot = 0) {
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><circle r="${r}" fill="#fbf8f0" stroke="${OL}" stroke-width="4.5"/>` +
    `<path transform="scale(${r / 22})" d="M 0 -8 L 7.6 -2.5 L 4.7 6.5 L -4.7 6.5 L -7.6 -2.5 Z" fill="${OL}"/>` +
    [0, 72, 144, 216, 288].map(a => `<path transform="scale(${r / 22}) rotate(${a})" d="M 0 -8 L 0 -15 M -6 -20 L 6 -20" stroke="${OL}" stroke-width="3"/>`).join('') + `<circle cx="${-r * 0.35}" cy="${-r * 0.4}" r="${r * 0.22}" fill="#fff" opacity="0.6"/></g>`;
}
function clipboard(rot = 0, k = 1) {
  return `<g transform="rotate(${rot}) scale(${k})"><rect x="-34" y="-46" width="68" height="92" rx="6" fill="#a8703e" stroke="${OL}" stroke-width="4"/><rect x="-27" y="-36" width="54" height="76" fill="#fffaf0" stroke="${OL}" stroke-width="2.5"/><rect x="-14" y="-52" width="28" height="12" rx="3" fill="#8a8e9a" stroke="${OL}" stroke-width="3"/>` +
    `<text x="0" y="-20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="10" fill="#c8443c">SÚMULA</text>` + [0, 1, 2, 3].map(i => `<path d="M -20 ${-6 + i * 11} H 20" stroke="#8a8090" stroke-width="2"/>`).join('') + `</g>`;
}
function goalFront(x, base, w = 520, h = 300, k = 1) {
  let s = `<g transform="translate(${x} ${base}) scale(${k})"><rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" fill="#fff8ea" opacity="0.18"/>`;
  for (let i = 1; i < 14; i++) s += `<path d="M ${-w / 2 + i * w / 14} ${-h} V 0" stroke="#fff8ea" stroke-width="2" opacity="0.6"/>`;
  for (let i = 1; i < 8; i++) s += `<path d="M ${-w / 2} ${-h + i * h / 8} H ${w / 2}" stroke="#fff8ea" stroke-width="2" opacity="0.6"/>`;
  s += `<path d="M ${-w / 2} 0 V ${-h} H ${w / 2} V 0" stroke="${OL}" stroke-width="20" fill="none" stroke-linejoin="round"/><path d="M ${-w / 2} 0 V ${-h} H ${w / 2} V 0" stroke="#fbf8f0" stroke-width="11" fill="none" stroke-linejoin="round"/>`;
  return s + '</g>';
}
function doorway(x, base, k = 1) {
  // portinha do vestiário da praça (parede azul, batente creme)
  return `<g transform="translate(${x} ${base}) scale(${k})"><rect x="-700" y="-520" width="1400" height="520" fill="#9fc3d8" stroke="${OL}" stroke-width="5"/><rect x="-700" y="-520" width="1400" height="520" fill="url(#pPlaster)"/>` +
    `<rect x="-110" y="-330" width="220" height="330" fill="#3a2a30" stroke="${OL}" stroke-width="5"/><path d="M -126 0 V -346 H 126 V 0" stroke="#efe2c4" stroke-width="26" fill="none"/><path d="M -126 0 V -346 H 126 V 0" stroke="${OL}" stroke-width="4" fill="none"/>` +
    `<rect x="-90" y="-450" width="180" height="56" rx="8" fill="#f2c230" stroke="${OL}" stroke-width="4"/><text x="0" y="-412" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="30" fill="${OL}">VESTIÁRIO</text></g>`;
}
function ipe(x, base, k, t, c) { return tree(x, base, k, t, c); }
function fence(y0, y1) {
  let s = `<g opacity="0.75"><rect x="-1400" y="${y0}" width="4720" height="${y1 - y0}" fill="none"/>`;
  for (let x = -1400; x < 3300; x += 36) s += `<path d="M ${x} ${y0} L ${x + 36} ${y1} M ${x + 36} ${y0} L ${x} ${y1}" stroke="#6a6478" stroke-width="2.5" opacity="0.5"/>`;
  for (let x = -1400; x < 3300; x += 300) s += `<path d="M ${x} ${y0 - 10} V ${y1}" stroke="#4a4458" stroke-width="10"/>`;
  return s + `<path d="M -1400 ${y0} H 3300" stroke="#4a4458" stroke-width="8"/></g>`;
}
