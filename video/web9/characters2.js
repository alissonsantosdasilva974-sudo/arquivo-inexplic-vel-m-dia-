// Character rig v2 — chunky, rounded "orbita-like" design language: barrel/pear bodies, puffy limbs,
// mitten hands with fingers, bulb noses, heavy eyelids, volumetric hair, patterned clothes, thick outlines.
// Same API as person() v1 so all shots keep working. Loaded after characters.js and overrides person/personSide.
const OL = '#1e1820';          // outline
const LW = 6;                  // outline width
const H2 = -320, HR2 = 84;     // head centre / radius

const CAST2 = {
  polo:     { skin: '#f4c4a1', top: '#f2c230', topD: '#d29a12', topType: 'hoodie', bottom: '#3d5a9e', shoes: '#26222c', hands: '#1d1a22', hair: 'bald', poloFace: 1, w: 1.0, seed: 1 },
  padeira:  { skin: '#f1c08f', top: '#e0787a', topD: '#c05a5e', topType: 'dress', pattern: 'pDots', apron: 1, bottom: '#e0787a', shoes: '#7a3a2a', hair: 'chef', hairC: '#5a3424', blush: 1, ear: '#f2c230', w: 1.28, seed: 2 },
  padeiraV: { skin: '#f1c08f', top: '#9b84c8', topD: '#7a62aa', topType: 'dress', pattern: 'pFlowers', bottom: '#9b84c8', shoes: '#8a5a8a', hair: 'cloud', hairC: '#e8e4f2', bun: 1, glasses: '#c9a24a', blush: 1, ear: '#f2c230', w: 1.3, seed: 2 },
  mae:      { skin: '#c98b5e', top: '#7b52b8', topD: '#5e3c98', topType: 'dress', pattern: 'pFlowers', bottom: '#7b52b8', shoes: '#e07a9a', hair: 'cloud', hairC: '#3a2018', bun: 1, blush: 1, ear: '#f2c230', w: 1.22, seed: 3 },
  motorista:{ skin: '#f3cfae', top: '#3c5a8a', topD: '#2a426c', topType: 'shirt', tie: '#c8443c', bottom: '#28324c', shoes: '#1d1a22', hair: 'driverCap', stache: '#4a2a1a', w: 1.18, seed: 4 },
  barnabe:  { skin: '#eab88a', top: '#f4efe2', topD: '#d6cfbe', topType: 'vest', vest: '#8a6a3a', bottom: '#5a5a6a', shoes: '#3a2a20', hair: 'sides', stache: '#f6f3ec', hat: 'straw', cane: 1, w: 1.12, seed: 5 },
  menino:   { skin: '#8d5a34', top: '#e86a4a', topD: '#c24a32', topType: 'tee', pattern: 'pStripeH', bottom: '#3d5a9e', shorts: 1, shoes: '#f4f1ea', hair: 'cap', hairC: '#1e1410', scale: 0.74, w: 1.0, seed: 6 },
  mulher:   { skin: '#e0ac79', top: '#3f9a6e', topD: '#2c7a52', topType: 'dress', pattern: 'pDots', bottom: '#3f9a6e', shoes: '#c8443c', hair: 'cloud', hairC: '#6a3a24', glasses: '#d0604a', blush: 1, ear: '#f2c230', w: 1.18, seed: 7 },
  moca:     { skin: '#f5d0b0', top: '#ee8aaa', topD: '#d06a8c', topType: 'tee', bottom: '#4f72b8', shoes: '#f4f1ea', hair: 'long', hairC: '#7a4426', bow: '#f2c230', blush: 1, ear: '#ee8aaa', scale: 0.95, w: 1.0, seed: 8 },
  viz1:     { skin: '#c98b5e', top: '#6a9ad0', topD: '#4c7ab0', topType: 'shirt', bottom: '#5a4a3a', shoes: '#2a2228', hair: 'short', hairC: '#1d1a22', w: 1.1, seed: 9 },
  viz2:     { skin: '#f1c08f', top: '#d0704a', topD: '#a8502e', topType: 'tee', pattern: 'pStripeH', bottom: '#3a3a4a', shoes: '#2a2228', hair: 'short', hairC: '#8a5a2a', w: 1.15, seed: 10 },
  viz3:     { skin: '#8d5a34', top: '#e8b03a', topD: '#c08a1e', topType: 'dress', pattern: 'pFlowers', bottom: '#e8b03a', shoes: '#6a3a28', hair: 'cloud', hairC: '#1d1a22', blush: 1, ear: '#e86a6a', w: 1.2, seed: 11 },
  padeiro2: { skin: '#c98b5e', top: '#f6efe2', topD: '#dcd2bc', topType: 'shirt', apron: 1, bottom: '#3a3a4a', shoes: '#2a2228', hair: 'chef', hairC: '#1d1a22', w: 1.08, seed: 13 },
};
const shade = (c, k = 0.22) => mix(c, '#2a1a2a', k);
const lite = (c, k = 0.25) => mix(c, '#ffffff', k);

// ---------- hands ----------
function mitt(hx, hy, ex, ey, col, pose) {
  const deg = Math.atan2(hy - ey, hx - ex) * 180 / Math.PI;
  let s = `<g transform="translate(${f2(hx)} ${f2(hy)}) rotate(${f2(deg)})">`;
  const fing = (rot, len, w = 11) => `<g transform="rotate(${rot})"><rect x="4" y="${-w / 2}" width="${len}" height="${w}" rx="${w / 2}" fill="${col}" stroke="${OL}" stroke-width="4"/></g>`;
  if (pose === 'open') { s += fing(-34, 24) + fing(-11, 27) + fing(12, 26) + fing(34, 22) + fing(-88, 19); }
  else if (pose === 'point') { s += fing(0, 34) + fing(-80, 16); s += `<path d="M 6 10 q 12 6 16 0" stroke="${OL}" stroke-width="3.5" fill="${col}"/>`; }
  else { s += fing(-75, 17); }
  s += `<ellipse cx="2" cy="0" rx="17" ry="16" fill="${col}" stroke="${OL}" stroke-width="${LW - 1}"/>`;
  if (pose !== 'open' && pose !== 'point') s += `<path d="M 10 -8 q 6 8 0 16" stroke="${shade(col, 0.35)}" stroke-width="3" fill="none"/>`;
  return s + `<circle cx="-4" cy="-6" r="4" fill="#fff" opacity="0.28"/></g>`;
}

// ---------- head ----------
function head2(P, d, fx, dir, side) {
  let s = '';
  const sk = P.skin, skD = shade(sk, 0.18);
  // hair behind
  s += hairBack2(P, dir);
  // ears
  if (!P.poloFace) for (const k of (side ? [-dir] : [-1, 1])) {
    const ex = side ? -dir * 66 : k * 80;
    s += `<ellipse cx="${ex}" cy="${H2 + 10}" rx="15" ry="18" fill="${sk}" stroke="${OL}" stroke-width="${LW - 1}"/><path d="M ${ex - k * 2} ${H2 + 2} q ${-k * 6} 8 0 16" stroke="${skD}" stroke-width="4" fill="none"/>`;
    if (P.ear) s += `<circle cx="${ex}" cy="${H2 + 34}" r="7" fill="${P.ear}" stroke="${OL}" stroke-width="3"/>`;
  }
  // skull: slightly wider at the cheeks for the non-Polo cast
  const skull = P.poloFace ? `M 0 ${H2 - HR2} A ${HR2} ${HR2} 0 1 1 0 ${H2 + HR2} A ${HR2} ${HR2} 0 1 1 0 ${H2 - HR2} Z`
    : `M 0 ${H2 - 84} C 56 ${H2 - 84} 84 ${H2 - 46} 84 ${H2 + 2} C 84 ${H2 + 58} 50 ${H2 + 84} 0 ${H2 + 84} C -50 ${H2 + 84} -84 ${H2 + 58} -84 ${H2 + 2} C -84 ${H2 - 46} -56 ${H2 - 84} 0 ${H2 - 84} Z`;
  s += `<path d="${skull}" fill="${skD}"/>`;
  s += `<clipPath id="ck${P.seed}${side ? 's' : ''}"><path d="${skull}"/></clipPath><g clip-path="url(#ck${P.seed}${side ? 's' : ''})"><circle cx="${-dir * 14 - 6}" cy="${H2 - 14}" r="${HR2 + 2}" fill="${sk}"/><ellipse cx="-30" cy="${H2 - 44}" rx="28" ry="16" fill="#fff" opacity="0.22" transform="rotate(-28 -30 ${H2 - 44})"/><rect x="-100" y="${H2 - 100}" width="200" height="200" fill="url(#pSkin)"/></g>`;
  s += `<path d="${skull}" fill="none" stroke="${OL}" stroke-width="${LW}"/>`;
  s += P.poloFace ? poloFace2(P, d, fx) : face2(P, d, fx, dir, side);
  s += hairFront2(P, d, dir, fx);
  return s;
}

function lidPath(cx, cy, rx, ry, lid, col) {
  if (lid <= 0.02) return '';
  const ly = cy - ry + 2 * ry * lid;
  const half = rx * Math.sqrt(Math.max(0, 1 - Math.pow((ly - cy) / ry, 2)));
  return `<path d="M ${f2(cx - rx - 2)} ${f2(cy - ry - 3)} H ${f2(cx + rx + 2)} V ${f2(ly)} Q ${f2(cx)} ${f2(ly + 4)} ${f2(cx - rx - 2)} ${f2(ly)} Z" fill="${col}"/>` +
    `<path d="M ${f2(cx - half - 2)} ${f2(ly)} Q ${f2(cx)} ${f2(ly + 4)} ${f2(cx + half + 2)} ${f2(ly)}" stroke="${OL}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
}

function face2(P, d, fx, dir, side) {
  const e = d.expr, sk = P.skin, skD = shade(sk, 0.2);
  const ey = H2 - 8, sep = side ? 18 : 30, rx = 15, ry = 17;
  const bl = Math.max(d.blink, autoBlink(d.t, P.seed));
  let s = '';
  const baseLid = { neutral: 0.34, happy: 0.38, smug: 0.5, worried: 0.18, sad: 0.42, angry: 0.4, surprised: 0, joy: 0, laugh: 0 }[e] ?? 0.3;
  const bw = { neutral: [0, 0], happy: [-2, 0], surprised: [-14, 0], worried: [-4, 10], angry: [3, -10], smug: [-1, -6], laugh: [-6, 0], joy: [-8, 0], sad: [0, 10] }[e] || [0, 0];
  const browC = P.hair === 'cloud' || P.hair === 'long' || P.hair === 'short' || P.hair === 'cap' ? (P.hairC || OL) : OL;
  for (const k of [-1, 1]) {
    const cx = fx + k * sep;
    const y = ey - 30 + bw[0], inner = bw[1];
    s += `<path d="M ${f2(cx - 15)} ${f2(y + (k < 0 ? 0 : inner * 0.5) + 2)} Q ${f2(cx)} ${f2(y - 7)} ${f2(cx + 15)} ${f2(y + (k < 0 ? inner * 0.5 : 0) + 2)}" stroke="${browC}" stroke-width="7.5" fill="none" stroke-linecap="round"/>`;
    if (e === 'laugh' || e === 'joy' || (e === 'smug' && d.wink && k === 1)) {
      s += `<path d="M ${f2(cx - 14)} ${ey + 4} Q ${f2(cx)} ${ey - 12} ${f2(cx + 14)} ${ey + 4}" stroke="${OL}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      continue;
    }
    const big = e === 'surprised' ? 1.15 : 1;
    s += `<ellipse cx="${f2(cx)}" cy="${ey}" rx="${f2(rx * big)}" ry="${f2(ry * big)}" fill="#fffdf6" stroke="${OL}" stroke-width="4.5"/>`;
    const px = cx + d.lx * 6 + (side ? dir * 5 : d.face * 3), py = ey + 2 + d.ly * 6;
    s += `<circle cx="${f2(px)}" cy="${f2(py)}" r="${e === 'surprised' ? 4.5 : 6.5}" fill="${OL}"/><circle cx="${f2(px + 2)}" cy="${f2(py - 2.5)}" r="2" fill="#fff"/>`;
    s += lidPath(cx, ey, rx * big, ry * big, Math.max(bl, baseLid), skD);
    if (e === 'happy') s += `<path d="M ${f2(cx - 12)} ${ey + 14} Q ${f2(cx)} ${ey + 8} ${f2(cx + 12)} ${ey + 14}" stroke="${skD}" stroke-width="4" fill="none"/>`;
  }
  if (P.glasses) { for (const k of [-1, 1]) s += `<circle cx="${f2(fx + k * sep)}" cy="${ey}" r="25" fill="#ffffff22" stroke="${P.glasses}" stroke-width="6"/>`; s += `<path d="M ${f2(fx - 6)} ${ey - 2} L ${f2(fx + 6)} ${ey - 2}" stroke="${P.glasses}" stroke-width="6"/>`; }
  // bulb nose
  const nx = fx + (side ? dir * 30 : d.face * 6), ny = H2 + 22;
  s += `<ellipse cx="${f2(nx)}" cy="${ny}" rx="15" ry="13" fill="${shade(sk, 0.12)}" stroke="${OL}" stroke-width="${LW - 1}"/><circle cx="${f2(nx - 4)}" cy="${ny - 5}" r="4" fill="#fff" opacity="0.4"/>`;
  // cheeks
  if (P.blush || e === 'laugh' || e === 'joy') for (const k of [-1, 1]) s += `<ellipse cx="${f2(fx + k * 44)}" cy="${H2 + 28}" rx="15" ry="9" fill="#e85a5a" opacity="0.32"/>`;
  // mouth with lips
  const mx = fx * 0.9 + (side ? dir * 18 : 0), my = H2 + 52, m = clamp(d.mouth);
  const lip = shade(sk, 0.32);
  if (e === 'surprised' || e === 'o') s += `<ellipse cx="${f2(mx)}" cy="${my}" rx="${f2(10 + m * 3)}" ry="${f2(12 + m * 5)}" fill="#6a1c28" stroke="${OL}" stroke-width="4.5"/><ellipse cx="${f2(mx)}" cy="${my + 6}" rx="6" ry="4" fill="#e0606a"/>`;
  else if (e === 'laugh' || e === 'joy' || m > 0.05) {
    const op = e === 'laugh' || e === 'joy' ? Math.max(m, 0.75) : m;
    s += `<path d="M ${f2(mx - 22)} ${my - 6} Q ${f2(mx)} ${f2(my + 4 + op * 26)} ${f2(mx + 22)} ${my - 6} Q ${f2(mx)} ${my - 2} ${f2(mx - 22)} ${my - 6} Z" fill="#6a1c28" stroke="${OL}" stroke-width="4.5" stroke-linejoin="round"/>`;
    if (op > 0.3) s += `<path d="M ${f2(mx - 17)} ${my - 4} Q ${f2(mx)} ${my} ${f2(mx + 17)} ${my - 4} L ${f2(mx + 14)} ${my + 4} Q ${f2(mx)} ${my + 7} ${f2(mx - 14)} ${my + 4} Z" fill="#fff"/><ellipse cx="${f2(mx)}" cy="${f2(my + op * 16)}" rx="9" ry="5" fill="#e0606a"/>`;
  } else if (e === 'worried' || e === 'sad') s += `<path d="M ${f2(mx - 15)} ${my + 6} Q ${f2(mx)} ${my - 6} ${f2(mx + 15)} ${my + 6}" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M ${f2(mx - 8)} ${my + 6} q 8 4 16 0" stroke="${lip}" stroke-width="4" fill="none"/>`;
  else if (e === 'smug') s += `<path d="M ${f2(mx - 16)} ${my} Q ${f2(mx + 2)} ${my + 10} ${f2(mx + 20)} ${my - 8}" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M ${f2(mx - 8)} ${my + 7} q 8 5 16 -1" stroke="${lip}" stroke-width="4" fill="none"/>`;
  else if (e === 'neutral' || e === 'angry') s += `<path d="M ${f2(mx - 13)} ${my} Q ${f2(mx)} ${my - 3} ${f2(mx + 13)} ${my}" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M ${f2(mx - 8)} ${my + 6} q 8 4 16 0" stroke="${lip}" stroke-width="4" fill="none"/>`;
  else s += `<path d="M ${f2(mx - 19)} ${my - 4} Q ${f2(mx)} ${my + 14} ${f2(mx + 19)} ${my - 4}" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M ${f2(mx - 10)} ${my + 10} q 10 5 20 0" stroke="${lip}" stroke-width="4" fill="none"/>`;
  if (P.stache) s += `<path d="M ${f2(mx - 34)} ${my - 6} Q ${f2(mx - 18)} ${my - 30} ${f2(mx)} ${my - 15} Q ${f2(mx + 18)} ${my - 30} ${f2(mx + 34)} ${my - 6} Q ${f2(mx + 16)} ${my - 2} ${f2(mx)} ${my - 9} Q ${f2(mx - 16)} ${my - 2} ${f2(mx - 34)} ${my - 6} Z" fill="${P.stache}" stroke="${OL}" stroke-width="4.5"/>`;
  return s;
}

// Polo keeps the user's design: big round white eyes, tiny pupils, small curl nose, small mouth.
function poloFace2(P, d, fx) {
  const fdd = Object.assign({}, d, { sep: d.sep || 33 });
  const old = HY; // v1 face uses HY (-322); same placement works on the r=84 head
  return face9(fdd, CAST.polo, fx);
}

function hairBack2(P, dir) {
  const c = P.hairC || '#3a2018';
  if (P.hair === 'long') return `<path d="M -92 ${H2 - 4} C -106 ${H2 - 124} 106 ${H2 - 124} 92 ${H2 - 4} C 104 ${H2 + 60} 108 ${H2 + 120} 86 ${H2 + 140} Q 50 ${H2 + 150} 40 ${H2 + 110} L -40 ${H2 + 110} Q -50 ${H2 + 150} -86 ${H2 + 140} C -108 ${H2 + 120} -104 ${H2 + 60} -92 ${H2 - 4} Z" fill="${c}" stroke="${OL}" stroke-width="${LW}"/><path d="M 60 ${H2 + 20} q 16 50 8 100" stroke="${lite(c, 0.2)}" stroke-width="6" fill="none" opacity="0.6"/>`;
  if (P.hair === 'cloud') {
    let s = ''; const big = P.bun ? 0.8 : 1.12;
    for (let i = 0; i < 11; i++) { const a = Math.PI * (0.92 + i * 0.116); s += `<circle cx="${f2(Math.cos(a) * 92 * big)}" cy="${f2(H2 + Math.sin(a) * 86 * big + 6)}" r="${f2(30 * big)}" fill="${c}" stroke="${OL}" stroke-width="${LW}"/>`; }
    if (P.bun) s += `<circle cx="0" cy="${H2 - 104}" r="40" fill="${c}" stroke="${OL}" stroke-width="${LW}"/><path d="M -22 ${H2 - 118} q 14 -16 32 -8" stroke="${lite(c, 0.35)}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    return s;
  }
  return '';
}
function hairFront2(P, d, dir, fx) {
  const c = P.hairC || '#3a2018', hl = lite(c, 0.35);
  switch (P.hair) {
    case 'cloud': {
      let s = `<path d="M -84 ${H2 - 6} C -90 ${H2 - 104} 90 ${H2 - 104} 84 ${H2 - 6} Q 50 ${H2 - 52} 10 ${H2 - 48} Q -40 ${H2 - 44} -84 ${H2 - 6} Z" fill="${c}" stroke="${OL}" stroke-width="${LW}"/>`;
      for (let i = 0; i < 6; i++) s += `<circle cx="${-60 + i * 24}" cy="${H2 - 70 + Math.abs(i - 2.5) * 7}" r="21" fill="${c}" stroke="${OL}" stroke-width="${LW - 1}"/>`;
      for (let i = 0; i < 4; i++) s += `<path d="M ${-56 + i * 30} ${H2 - 80 + Math.abs(i - 1.5) * 6} q 8 -8 16 -2" stroke="${hl}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      return s;
    }
    case 'long': return `<path d="M -86 ${H2 + 4} C -92 ${H2 - 108} 92 ${H2 - 108} 86 ${H2 + 4} Q 56 ${H2 - 70} ${f2(fx + 14)} ${H2 - 58} Q -34 ${H2 - 46} -86 ${H2 + 4} Z" fill="${c}" stroke="${OL}" stroke-width="${LW}"/><path d="M -40 ${H2 - 80} q 26 -14 56 -6" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      (P.bow ? `<path d="M 34 ${H2 - 86} l -28 -18 l 0 36 Z M 34 ${H2 - 86} l 28 -18 l 0 36 Z" fill="${P.bow}" stroke="${OL}" stroke-width="4.5" stroke-linejoin="round"/><circle cx="34" cy="${H2 - 86}" r="9" fill="${P.bow}" stroke="${OL}" stroke-width="4"/>` : '');
    case 'short': return `<path d="M -86 ${H2 - 2} C -92 ${H2 - 110} 92 ${H2 - 110} 86 ${H2 - 2} Q 74 ${H2 - 46} ${f2(fx + 36)} ${H2 - 58} Q -12 ${H2 - 46} -38 ${H2 - 66} Q -62 ${H2 - 40} -86 ${H2 - 2} Z" fill="${c}" stroke="${OL}" stroke-width="${LW}"/><path d="M -30 ${H2 - 88} q 30 -10 60 0" stroke="${hl}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    case 'chef': return `<path d="M -70 ${H2 - 30} Q -74 ${H2 - 60} -60 ${H2 - 62} L 60 ${H2 - 62} Q 74 ${H2 - 60} 70 ${H2 - 30} Q 0 ${H2 - 46} -70 ${H2 - 30} Z" fill="${c}" stroke="${OL}" stroke-width="${LW - 1}"/>` +
      `<rect x="-68" y="${H2 - 100}" width="136" height="40" rx="10" fill="#f6efe2" stroke="${OL}" stroke-width="${LW}"/><path d="M -66 ${H2 - 96} C -112 ${H2 - 120} -76 ${H2 - 184} -36 ${H2 - 158} C -26 ${H2 - 208} 30 ${H2 - 208} 38 ${H2 - 158} C 76 ${H2 - 184} 112 ${H2 - 120} 66 ${H2 - 96} Z" fill="#fffbf2" stroke="${OL}" stroke-width="${LW}"/><path d="M -30 ${H2 - 150} q -6 22 4 44 M 20 ${H2 - 160} q 6 26 -2 52" stroke="#e6dcc8" stroke-width="5" fill="none"/>`;
    case 'cap': return `<path d="M -84 ${H2 - 18} C -84 ${H2 - 112} 84 ${H2 - 112} 84 ${H2 - 18} Z" fill="#3a6ab8" stroke="${OL}" stroke-width="${LW}"/><path d="M -40 ${H2 - 96} q 30 -12 64 0" stroke="#6a9ae0" stroke-width="6" fill="none"/><path d="M ${dir * 20} ${H2 - 22} Q ${dir * 100} ${H2 - 30} ${dir * 124} ${H2 - 12} Q ${dir * 80} ${H2 - 2} ${dir * 20} ${H2 - 10} Z" fill="#2a5096" stroke="${OL}" stroke-width="${LW - 1}" stroke-linejoin="round"/><circle cx="0" cy="${H2 - 92}" r="8" fill="#2a5096" stroke="${OL}" stroke-width="4"/>`;
    case 'driverCap': return `<g transform="translate(0 -26)"><path d="M -82 ${H2 - 24} C -82 ${H2 - 116} 82 ${H2 - 116} 82 ${H2 - 24} Z" fill="#3c5a8a" stroke="${OL}" stroke-width="${LW}"/><rect x="-86" y="${H2 - 38}" width="172" height="20" rx="8" fill="#1e2e4e" stroke="${OL}" stroke-width="${LW - 1}"/><path d="M ${dir * 6} ${H2 - 20} Q ${dir * 76} ${H2 - 16} ${dir * 114} ${H2 - 2} L ${dir * 6} ${H2 - 6} Z" fill="#14203a" stroke="${OL}" stroke-width="${LW - 1}"/><circle cx="0" cy="${H2 - 70}" r="12" fill="#f2c230" stroke="${OL}" stroke-width="4"/></g>`;
    case 'sides': return `<path d="M -86 ${H2 + 16} Q -104 ${H2 - 28} -76 ${H2 - 44} Q -70 ${H2 - 6} -82 ${H2 + 22} Z M 86 ${H2 + 16} Q 104 ${H2 - 28} 76 ${H2 - 44} Q 70 ${H2 - 6} 82 ${H2 + 22} Z" fill="#f6f3ec" stroke="${OL}" stroke-width="${LW - 1}"/>` +
      (P.hat === 'straw' ? `<ellipse cx="0" cy="${H2 - 56}" rx="134" ry="24" fill="#e8c46a" stroke="${OL}" stroke-width="${LW}"/><path d="M -68 ${H2 - 58} C -66 ${H2 - 128} 66 ${H2 - 128} 68 ${H2 - 58} Z" fill="#e8c46a" stroke="${OL}" stroke-width="${LW}"/><path d="M -68 ${H2 - 72} Q 0 ${H2 - 62} 68 ${H2 - 72} L 67 ${H2 - 58} Q 0 ${H2 - 50} -67 ${H2 - 58} Z" fill="#c8443c"/><path d="M -40 ${H2 - 104} q 30 -12 60 -2" stroke="#fff2c0" stroke-width="6" fill="none"/>` : '');
  }
  return '';
}

// ---------- body ----------
function bodyPath(P, k = 1) {
  const w = (P.w || 1) * k;
  const dress = P.topType === 'dress';
  const sh = 46 * w, wa = 54 * w, hip = (dress ? 76 : 60) * w, hem = dress ? -46 : -104;
  return { d: `M ${-sh} -246 C ${-sh - 22} -244 ${-wa - 6} -214 ${-wa} -176 C ${-wa + 2} -150 ${-hip - 4} -120 ${-hip} ${hem - 16} Q ${-hip} ${hem} ${-hip + 16} ${hem} Q 0 ${hem + 12} ${hip - 16} ${hem} Q ${hip} ${hem} ${hip} ${hem - 16} C ${hip + 4} -120 ${wa - 2} -150 ${wa} -176 C ${wa + 6} -214 ${sh + 22} -244 ${sh} -246 Q 0 -232 ${-sh} -246 Z`, hem, hip, wa, sh };
}
function torso2(P, d, k = 1) {
  const B = bodyPath(P, k);
  const id = `cb${P.seed}${k < 1 ? 's' : ''}`;
  let s = `<clipPath id="${id}"><path d="${B.d}"/></clipPath>`;
  if (P.topType === 'hoodie') s += `<path d="M -66 -250 Q 0 -206 66 -250 Q 74 -272 46 -282 Q 0 -262 -46 -282 Q -74 -272 -66 -250 Z" fill="${P.topD}" stroke="${OL}" stroke-width="${LW - 1}"/>`;
  s += `<path d="${B.d}" fill="${P.top}"/>`;
  s += `<g clip-path="url(#${id})">`;
  if (P.pattern) s += `<rect x="-140" y="-260" width="280" height="260" fill="url(#${P.pattern})"/>`;
  if (P.topType === 'vest') s += `<path d="M -90 -260 L -14 -260 L 0 -200 L 14 -260 L 90 -260 L 90 0 L -90 0 Z" fill="${P.vest}"/><path d="M -14 -260 L 0 -200 L 14 -260" stroke="${OL}" stroke-width="4" fill="none"/><circle cx="-10" cy="-170" r="5" fill="#f2c230" stroke="${OL}" stroke-width="2.5"/><circle cx="-10" cy="-140" r="5" fill="#f2c230" stroke="${OL}" stroke-width="2.5"/>`;
  if (P.apron) s += `<path d="M -48 -200 Q 0 -196 48 -200 L 62 -30 Q 0 -20 -62 -30 Z" fill="#fffaf0" stroke="${OL}" stroke-width="4.5"/><rect x="-26" y="-150" width="52" height="30" rx="8" fill="#efe6d2" stroke="${OL}" stroke-width="3.5"/><path d="M -44 -200 L -34 -246 M 44 -200 L 34 -246" stroke="#fffaf0" stroke-width="8"/>`;
  // volume shading: right side darker, left rim light, waist crease
  s += `<path d="M 10 -260 C 40 -220 50 -140 34 0 L 140 0 L 140 -260 Z" fill="${P.topD}" opacity="0.45"/>`;
  s += `<path d="M -50 -236 Q -60 -190 -54 -150" stroke="#fff" stroke-width="8" fill="none" opacity="0.18" stroke-linecap="round"/>`;
  s += `<rect x="-140" y="-260" width="280" height="260" fill="url(#pFabric)"/>`;
  s += '</g>';
  s += `<path d="${B.d}" fill="none" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  if (P.topType === 'hoodie') {
    s += `<path d="M -40 -168 L 40 -168 L 52 -124 L -52 -124 Z" fill="${P.topD}" stroke="${OL}" stroke-width="${LW - 1}" stroke-linejoin="round"/><path d="M -34 -161 L 34 -161 L 44 -130 L -44 -130 Z" fill="none" stroke="#8a6a10" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>`;
    s += `<path d="M -18 -244 Q -22 -220 -20 -196 M 18 -244 Q 22 -220 20 -196" stroke="#f6efe2" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-20" cy="-193" r="5" fill="#f6efe2" stroke="${OL}" stroke-width="2.5"/><circle cx="20" cy="-193" r="5" fill="#f6efe2" stroke="${OL}" stroke-width="2.5"/>`;
    s += `<path d="M ${-B.hip + 6} -118 Q 0 -104 ${B.hip - 6} -118" stroke="${OL}" stroke-width="4" fill="none"/>`;
  }
  if (P.topType === 'shirt') s += `<path d="M -26 -244 L 0 -214 L 26 -244" fill="#fff" stroke="${OL}" stroke-width="4"/>` + (P.tie ? `<path d="M -7 -214 L 7 -214 L 10 -150 L 0 -136 L -10 -150 Z" fill="${P.tie}" stroke="${OL}" stroke-width="3.5"/>` : `<circle cx="0" cy="-190" r="4" fill="${OL}"/><circle cx="0" cy="-160" r="4" fill="${OL}"/>`) + `<rect x="18" y="-200" width="22" height="18" rx="3" fill="none" stroke="${OL}" stroke-width="3" opacity="0.6"/>`;
  if (P.topType === 'tee' || P.topType === 'dress') s += `<path d="M -28 -244 Q 0 -222 28 -244" stroke="${OL}" stroke-width="4.5" fill="none"/>`;
  if (P.topType === 'dress') s += `<path d="M ${-B.wa} -176 Q 0 -162 ${B.wa} -176" stroke="${shade(P.top, 0.35)}" stroke-width="5" fill="none"/>`;
  return { svg: s, B };
}

function limb2(P, side, a, b, shortSleeve, pose, holdSvg, dir) {
  // shoulder angle a (0 down, 90 out, 180 up); elbow bend b
  const sx = side * 46 * (P.w || 1), sy = -228;
  const A = a * Math.PI / 180, B2 = (a + b) * Math.PI / 180;
  const ex = sx + side * Math.sin(A) * 58, ey = sy + Math.cos(A) * 58;
  const hx = ex + side * Math.sin(B2) * 52, hy = ey + Math.cos(B2) * 52;
  const sl = P.top, slD = P.topD;
  let s = '';
  if (shortSleeve) {
    s += `<path d="M ${f2(ex)} ${f2(ey)} L ${f2(hx)} ${f2(hy)}" stroke="${OL}" stroke-width="32" stroke-linecap="round"/><path d="M ${f2(ex)} ${f2(ey)} L ${f2(hx)} ${f2(hy)}" stroke="${P.skin}" stroke-width="21" stroke-linecap="round"/>`;
    s += `<path d="M ${sx} ${sy} L ${f2(ex)} ${f2(ey)}" stroke="${OL}" stroke-width="44" stroke-linecap="round"/><path d="M ${sx} ${sy} L ${f2(ex)} ${f2(ey)}" stroke="${sl}" stroke-width="32" stroke-linecap="round"/>`;
  } else {
    const p = `M ${sx} ${sy} L ${f2(ex)} ${f2(ey)} L ${f2(hx)} ${f2(hy)}`;
    s += `<path d="${p}" stroke="${OL}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${p}" stroke="${sl}" stroke-width="28" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="M ${f2(sx + side * 4)} ${sy + 6} L ${f2(ex + side * 5)} ${f2(ey)}" stroke="${slD}" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`;
    s += `<circle cx="${f2(hx - (hx - ex) * 0.28)}" cy="${f2(hy - (hy - ey) * 0.28)}" r="16" fill="${slD}" stroke="${OL}" stroke-width="4"/>`;
  }
  s += mitt(hx, hy, ex, ey, P.hands || P.skin, pose);
  if (holdSvg) s += `<g transform="translate(${f2(hx)} ${f2(hy)})">${holdSvg}</g>`;
  return { svg: s, hx, hy, ex, ey };
}

function legs2(P, lA, rA, dir) {
  const dress = P.topType === 'dress';
  const top = dress ? -60 : -110, L = -10 - top;
  let s = '';
  for (const [x, a] of [[-24 * (P.w || 1) * 0.8, lA], [24 * (P.w || 1) * 0.8, rA]]) {
    const showSkin = dress || P.shorts;
    s += `<g transform="rotate(${f2(a)} ${f2(x)} ${top})">`;
    s += `<path d="M ${f2(x)} ${top} L ${f2(x)} -16" stroke="${OL}" stroke-width="34" stroke-linecap="round"/><path d="M ${f2(x)} ${top} L ${f2(x)} -16" stroke="${showSkin ? P.skin : P.bottom}" stroke-width="22" stroke-linecap="round"/>`;
    if (P.shorts) s += `<path d="M ${f2(x)} ${top} L ${f2(x)} ${top + L * 0.45}" stroke="${OL}" stroke-width="36" stroke-linecap="round"/><path d="M ${f2(x)} ${top} L ${f2(x)} ${top + L * 0.45}" stroke="${P.bottom}" stroke-width="26" stroke-linecap="round"/>`;
    else if (!dress) s += `<path d="M ${f2(x + 5)} ${top + 10} L ${f2(x + 5)} -26" stroke="${shade(P.bottom, 0.3)}" stroke-width="4" opacity="0.6"/>`;
    s += `<path d="M ${f2(x - 18 + dir * 4)} 0 Q ${f2(x - 20)} -28 ${f2(x + dir * 6)} -26 Q ${f2(x + dir * 36)} -22 ${f2(x + dir * 36)} -4 Q ${f2(x + dir * 32)} 6 ${f2(x)} 6 Q ${f2(x - 20)} 6 ${f2(x - 18 + dir * 4)} 0 Z" fill="${P.shoes}" stroke="${OL}" stroke-width="${LW - 1}"/><path d="M ${f2(x - 6)} -18 Q ${f2(x + dir * 10)} -22 ${f2(x + dir * 22)} -15" stroke="#fff" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>`;
    s += '</g>';
  }
  return s;
}

function person(id, o = {}) {
  const key = id === 'padeira' && o.old ? 'padeiraV' : id;
  const P = CAST2[key] || CAST2.viz1;
  const d = Object.assign({ x: 0, y: 0, s: 1, face: 0, expr: 'neutral', mouth: 0, blink: 0, lx: 0, ly: 0, armL: 8, armR: 8, bendL: 12, bendR: 12, walk: null, tilt: 0, squash: 0, jump: 0, t: 0, holdR: '', holdL: '', shadow: true, headTilt: 0, flip: false }, o);
  if (d.mouth > 0.05) d.headTilt += Math.sin(d.t * 11) * 2.5;
  const s = d.s * (P.scale || 1);
  if (d.side) return personSide2(P, d, s);
  const dir = d.face >= 0 ? 1 : -1, fx = d.face * 24;
  const breath = Math.sin(d.t * 2.3 + P.seed) * 2.2;
  let bob = 0, lA = 0, rA = 0;
  if (d.walk != null) { bob = -Math.abs(Math.sin(d.walk)) * 10; lA = Math.sin(d.walk) * 20; rA = -lA; }
  const shortS = P.topType === 'tee' || P.topType === 'dress';
  const poseOf = (a, h) => h || (a > 120 ? 'open' : 'fist');
  let g = '';
  if (d.shadow) g += `<ellipse cx="0" cy="4" rx="${f2(84 * (P.w || 1) * (1 - d.jump / 400))}" ry="15" fill="#1b1424" opacity="0.24"/>`;
  g += `<g transform="translate(0 ${f2(bob - d.jump)}) rotate(${f2(d.tilt)} 0 -100) scale(${f2(1 - d.squash * 0.5)} ${f2(1 + d.squash)})">`;
  g += legs2(P, lA, rA, dir);
  const aL = limb2(P, -1, d.armL, d.bendL, shortS, poseOf(d.armL, d.handL), d.holdL, dir);
  const aR = limb2(P, 1, d.armR, d.bendR, shortS, poseOf(d.armR, d.handR), d.holdR, dir);
  g += `<g transform="translate(0 ${f2(breath * 0.4)})">`;
  const backL = d.armL < 20 && !d.holdL, backR = d.armR < 20 && !d.holdR;
  if (backL) g += aL.svg; if (backR) g += aR.svg;
  g += torso2(P, d).svg;
  if (!backL) g += aL.svg; if (!backR) g += aR.svg;
  if (P.cane) g += `<path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 12)} 0" stroke="${OL}" stroke-width="15" stroke-linecap="round"/><path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 12)} 0" stroke="#8a5a34" stroke-width="8" stroke-linecap="round"/>`;
  g += '</g>';
  g += `<g transform="translate(0 ${f2(breath)}) rotate(${f2(d.headTilt)} 0 ${H2 + 70})">${head2(P, d, fx, dir, false)}</g>`;
  g += '</g>';
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(s * (d.flip ? -1 : 1) * (1 - 0.45 * (d.turn || 0)))} ${f2(s)})">${g}</g>`;
}

function personSide2(P, d, s) {
  const dir = d.face >= 0 ? 1 : -1;
  const w = d.walk != null ? d.walk : 0, run = d.run ? 1.6 : 1;
  const bob = d.walk != null ? -Math.abs(Math.sin(w)) * 12 * run : 0;
  const dress = P.topType === 'dress';
  const hipY = dress ? -70 : -110, th = dress ? 30 : 52, sh = dress ? 30 : 48;
  const legSvg = (ph, back) => {
    const a = Math.sin(ph) * 32 * run, knee = Math.max(0, -Math.cos(ph)) * 48 * run;
    const A = a * Math.PI / 180, K = (a - knee) * Math.PI / 180;
    const kx = dir * Math.sin(A) * th, ky = hipY + Math.cos(A) * th;
    const fx = kx + dir * Math.sin(K) * sh, fy = ky + Math.cos(K) * sh;
    const col0 = dress || P.shorts ? P.skin : P.bottom, col = back ? shade(col0, 0.18) : col0;
    const p = `M 0 ${hipY} L ${f2(kx)} ${f2(ky)} L ${f2(fx)} ${f2(fy)}`;
    return `<path d="${p}" stroke="${OL}" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${p}" stroke="${col}" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M ${f2(fx - dir * 14)} ${f2(fy + 6)} Q ${f2(fx - dir * 14)} ${f2(fy - 14)} ${f2(fx + dir * 6)} ${f2(fy - 12)} Q ${f2(fx + dir * 36)} ${f2(fy - 8)} ${f2(fx + dir * 36)} ${f2(fy + 6)} Q ${f2(fx + dir * 30)} ${f2(fy + 16)} ${f2(fx)} ${f2(fy + 16)} Z" fill="${back ? shade(P.shoes, 0.2) : P.shoes}" stroke="${OL}" stroke-width="${LW - 1}"/>`;
  };
  const shortS = P.topType === 'tee' || P.topType === 'dress';
  const arm = (ph, back, override) => {
    const a = override != null ? override : -Math.sin(ph) * 30 * run, el = 25 + (d.run ? 50 : 0);
    const L = limb2(Object.assign({}, P, { w: 0.15, top: back ? P.topD : P.top }), dir, a, el, shortS, a > 120 ? 'open' : 'fist', back ? '' : d.holdR, dir);
    return L;
  };
  let g = '';
  if (d.shadow) g += `<ellipse cx="0" cy="4" rx="${f2(70 * (P.w || 1))}" ry="14" fill="#1b1424" opacity="0.24"/>`;
  g += `<g transform="translate(0 ${f2(bob - d.jump)}) rotate(${f2(d.tilt + (d.run ? dir * 7 : dir * 2))} 0 -60)">`;
  const back = arm(w + Math.PI, true, d.armBack), front = arm(w, false, d.armFront);
  g += back.svg + legSvg(w + Math.PI, true) + legSvg(w, false);
  g += `<g transform="scale(0.8 1)">${torso2(P, d, 1).svg}</g>`;
  g += front.svg;
  g += `<g transform="translate(0 ${f2(Math.sin(w * 2) * 2)}) rotate(${f2(d.headTilt)} 0 ${H2 + 70})">${head2(P, Object.assign({}, d, { lx: dir }), dir * 26, dir, true)}</g>`;
  g += '</g>';
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(s * (1 - 0.45 * (d.turn || 0)))} ${f2(s)})">${g}</g>`;
}
