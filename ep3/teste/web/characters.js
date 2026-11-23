// Character rig v9 (Polo design language): big round head, thin body, clean outlines.
// Local coords: feet centre at (0,0); total height ≈ 400; head centre (0,-322), r = 78.
const INK9 = '#211c26';
const HR = 78, HY = -322;

const CAST = {
  polo:     { skin: '#f4c4a1', top: '#f2c230', topD: '#d9a516', topType: 'hoodie', pants: '#3d5a9e', shoes: '#26222c', hands: '#1d1a22', hair: 'bald', seed: 1 },
  padeira:  { skin: '#f1c08f', top: '#d9706e', topD: '#b85352', topType: 'apron', pants: '#5a4a6a', shoes: '#4a3428', hair: 'chef', blush: 1, scale: 1.0, wide: 1.25, seed: 2 },
  padeiraV: { skin: '#f1c08f', top: '#9b84b8', topD: '#7d66a0', topType: 'shawl', pants: '#6a5a7a', shoes: '#4a3428', hair: 'whiteBun', glasses: '#c9a24a', blush: 1, wide: 1.25, seed: 2 },
  mae:      { skin: '#c98b5e', top: '#8a5aa6', topD: '#6e4590', topType: 'dress', pants: '#5a3a6a', shoes: '#3a2a30', hair: 'bun', hairC: '#3a2418', blush: 1, wide: 1.15, seed: 3 },
  motorista:{ skin: '#f3cfae', top: '#3c5a8a', topD: '#2d4670', topType: 'shirt', pants: '#2a3550', shoes: '#1d1a22', hair: 'driverCap', stache: '#5a3a2a', wide: 1.15, seed: 4 },
  barnabe:  { skin: '#eab88a', top: '#8a6a3a', topD: '#6e5228', topType: 'vest', pants: '#5a5a6a', shoes: '#3a2a20', hair: 'whiteSides', stache: '#f4f1ea', hat: 'straw', cane: 1, seed: 5 },
  padeiro2: { skin: '#c98b5e', top: '#f6efe2', topD: '#ddd2bc', topType: 'apron', pants: '#3a3a4a', shoes: '#2a2228', hair: 'chef', seed: 13 },
  menino:   { skin: '#8d5a34', top: '#e86a4a', topD: '#c8503a', topType: 'tee', pants: '#3d5a9e', shoes: '#f4f1ea', hair: 'cap', hairC: '#2a1a14', scale: 0.72, seed: 6 },
  mulher:   { skin: '#e0ac79', top: '#9a6a4f', topD: '#7a4a3a', topType: 'dress', pants: '#5a3a48', shoes: '#5a2a2a', hair: 'curly', hairC: '#6a3a24', glasses: '#c8643c', blush: 1, wide: 1.15, seed: 7 },
  moca:     { skin: '#f5d0b0', top: '#e88aa8', topD: '#cc6a8a', topType: 'tee', pants: '#5a7ab8', shoes: '#f4f1ea', hair: 'long', hairC: '#7a4a2a', bow: '#f2c230', blush: 1, scale: 0.95, seed: 8 },
  viz1:     { skin: '#c98b5e', top: '#7aa0c8', topD: '#5a82ac', topType: 'shirt', pants: '#5a4a3a', shoes: '#2a2228', hair: 'short', hairC: '#1d1a22', seed: 9 },
  viz2:     { skin: '#f1c08f', top: '#c8643c', topD: '#a44e2c', topType: 'tee', pants: '#3a3a4a', shoes: '#2a2228', hair: 'short', hairC: '#8a5a2a', seed: 10 },
  viz3:     { skin: '#8d5a34', top: '#e0a83a', topD: '#c08a20', topType: 'dress', pants: '#6a4a2a', shoes: '#3a2228', hair: 'curly', hairC: '#1d1a22', blush: 1, seed: 11 },
};

function limb(x1, y1, a, b, l1, l2, side) {
  // a: shoulder angle (0 down, 90 out, 180 up), b: elbow bend (deg, toward front/inward)
  const A = a * Math.PI / 180, B = (a - b * side * -1) * Math.PI / 180;
  const ex = x1 + side * Math.sin(A) * l1, ey = y1 + Math.cos(A) * l1;
  const B2 = (a + b) * Math.PI / 180;
  const hx = ex + side * Math.sin(B2) * l2, hy = ey + Math.cos(B2) * l2;
  return { ex, ey, hx, hy };
}


// Hand with pose: 'fist' (default), 'open' (fingers spread, for waving), 'point' (index finger along the forearm)
function hand9(hx, hy, ex, ey, col, pose, hl) {
  const a = Math.atan2(hy - ey, hx - ex), deg = a * 180 / Math.PI;
  let s = `<g transform="translate(${f2(hx)} ${f2(hy)}) rotate(${f2(deg)})">`;
  if (pose === 'open') {
    for (const k of [-32, -10, 12, 34]) s += `<g transform="rotate(${k})"><rect x="6" y="-4.5" width="20" height="9" rx="4.5" fill="${col}" stroke="${INK9}" stroke-width="3.5"/></g>`;
    s += `<g transform="rotate(-80)"><rect x="4" y="-4.5" width="15" height="9" rx="4.5" fill="${col}" stroke="${INK9}" stroke-width="3.5"/></g>`;
  } else if (pose === 'point') {
    s += `<rect x="6" y="-5" width="30" height="10" rx="5" fill="${col}" stroke="${INK9}" stroke-width="3.5"/>`;
  } else {
    s += `<g transform="rotate(-70)"><rect x="4" y="-4.5" width="13" height="9" rx="4.5" fill="${col}" stroke="${INK9}" stroke-width="3.5"/></g>`;
  }
  s += `<circle r="13" fill="${col}" stroke="${INK9}" stroke-width="4"/><circle cx="-3" cy="-5" r="3.5" fill="#ffffff" opacity="${hl}"/>`;
  return s + '</g>';
}

function face9(d, P, fx) {
  const ey = HY - 10, sep = d.sep || 31, er = 19;
  const bl = Math.max(d.blink, autoBlink(d.t, P.seed));
  const e = d.expr;
  let s = '';
  // brows
  const bw = { neutral: [0, 0], happy: [-3, 0], surprised: [-12, 0], worried: [-4, 9], angry: [2, -9], smug: [-2, -5], laugh: [-6, 0], joy: [-8, 0], sad: [0, 10] }[e] || [0, 0];
  for (const k of [-1, 1]) {
    const cx = fx + k * sep, y = ey - 34 + bw[0];
    const inner = bw[1];
    s += `<path d="M ${f2(cx - 16)} ${f2(y + (k < 0 ? 0 : inner * 0.5) + 3)} Q ${f2(cx)} ${f2(y - 7)} ${f2(cx + 16)} ${f2(y + (k < 0 ? inner * 0.5 : 0) + 3)}" stroke="${INK9}" stroke-width="${d.browW || 5}" fill="none" stroke-linecap="round"/>`;
  }
  for (const k of [-1, 1]) {
    const cx = fx + k * sep;
    if (e === 'laugh' || e === 'joy' || (e === 'smug' && k === 1 && d.wink)) {
      s += `<path d="M ${f2(cx - 14)} ${ey + 4} Q ${f2(cx)} ${ey - 14} ${f2(cx + 14)} ${ey + 4}" stroke="${INK9}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      continue;
    }
    const big = e === 'surprised' ? 1.12 : 1;
    const R = er * big;
    s += `<circle cx="${f2(cx)}" cy="${ey}" r="${f2(R)}" fill="#ffffff" stroke="${INK9}" stroke-width="4.5"/>`;
    const pr = e === 'surprised' ? 4.5 : 6;
    const px = cx + d.lx * 8 + d.face * 4, py = ey + d.ly * 8;
    s += `<circle cx="${f2(px)}" cy="${f2(py)}" r="${pr}" fill="${INK9}"/>`;
    // eyelids: blink, smug/sleepy
    const lid = Math.max(bl, e === 'smug' ? 0.42 : 0, e === 'sad' ? 0.25 : 0);
    if (lid > 0.02) {
      const ly = ey - R + 2 * R * lid;
      s += `<path d="M ${f2(cx - R - 1)} ${f2(ey - R - 2)} H ${f2(cx + R + 1)} V ${f2(ly)} Q ${f2(cx)} ${f2(ly + 3)} ${f2(cx - R - 1)} ${f2(ly)} Z" fill="${P.skin}"/>`;
      s += `<path d="M ${f2(cx - R * Math.sqrt(Math.max(0, 1 - Math.pow((ly - ey) / R, 2))))} ${f2(ly)} L ${f2(cx + R * Math.sqrt(Math.max(0, 1 - Math.pow((ly - ey) / R, 2))))} ${f2(ly)}" stroke="${INK9}" stroke-width="4.5" stroke-linecap="round"/>`;
      s += `<circle cx="${f2(cx)}" cy="${ey}" r="${f2(R)}" fill="none" stroke="${INK9}" stroke-width="4.5" clip-path="none"/>`;
    }
  }
  // nose
  s += `<path d="M ${f2(fx + 2 + d.face * 6)} ${HY + 8} q -9 8 0 13 q 5 2 9 -1" stroke="${INK9}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  // mouth
  const mx = fx * 0.95, my = HY + 42, m = clamp(d.mouth);
  if (e === 'surprised' || e === 'o') s += `<ellipse cx="${f2(mx)}" cy="${my + 2}" rx="${f2(8 + m * 3)}" ry="${f2(10 + m * 5)}" fill="#7a2230" stroke="${INK9}" stroke-width="3.5"/>`;
  else if (e === 'laugh' || e === 'joy' || m > 0.05) {
    const op = e === 'laugh' || e === 'joy' ? Math.max(m, 0.75) : m;
    s += `<path d="M ${f2(mx - 18)} ${my - 3} Q ${f2(mx)} ${f2(my + 4 + op * 22)} ${f2(mx + 18)} ${my - 3} Z" fill="#7a2230" stroke="${INK9}" stroke-width="3.5" stroke-linejoin="round"/>`;
    if (op > 0.35) s += `<path d="M ${f2(mx - 15)} ${my - 2} L ${f2(mx + 15)} ${my - 2} L ${f2(mx + 12)} ${my + 4} L ${f2(mx - 12)} ${my + 4} Z" fill="#fff"/>`;
  } else if (e === 'worried' || e === 'sad') s += `<path d="M ${f2(mx - 12)} ${my + 5} Q ${f2(mx)} ${my - 4} ${f2(mx + 12)} ${my + 5}" stroke="${INK9}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else if (e === 'neutral' || e === 'angry') s += `<path d="M ${f2(mx - 10)} ${my} Q ${f2(mx)} ${my - 2} ${f2(mx + 9)} ${my + 1}" stroke="${INK9}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M ${f2(mx - 6)} ${my} l 10 1" stroke="#7a2230" stroke-width="2"/>`;
  else if (e === 'smug') s += `<path d="M ${f2(mx - 12)} ${my} Q ${f2(mx + 2)} ${my + 8} ${f2(mx + 16)} ${my - 7}" stroke="${INK9}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M ${f2(mx - 15)} ${my - 3} Q ${f2(mx)} ${my + 11} ${f2(mx + 15)} ${my - 3}" stroke="${INK9}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if (P.blush) for (const k of [-1, 1]) s += `<ellipse cx="${f2(fx + k * 46)}" cy="${HY + 22}" rx="12" ry="7" fill="#e86a6a" opacity="0.35"/>`;
  if (P.stache) s += `<path d="M ${f2(mx - 26)} ${my - 8} Q ${f2(mx - 12)} ${my - 24} ${f2(mx)} ${my - 13} Q ${f2(mx + 12)} ${my - 24} ${f2(mx + 26)} ${my - 8} Q ${f2(mx)} ${my - 4} ${f2(mx - 26)} ${my - 8} Z" fill="${P.stache}" stroke="${INK9}" stroke-width="3"/>`;
  if (P.glasses) { for (const k of [-1, 1]) s += `<circle cx="${f2(fx + k * sep)}" cy="${ey}" r="25" fill="#ffffff18" stroke="${P.glasses}" stroke-width="5"/>`; s += `<path d="M ${f2(fx - 6)} ${ey - 2} L ${f2(fx + 6)} ${ey - 2}" stroke="${P.glasses}" stroke-width="5"/>`; }
  return s;
}

function hairBack(P, dir) {
  const c = P.hairC || '#3a2418';
  if (P.hair === 'long') return `<path d="M -84 ${HY} C -96 ${HY - 110} 96 ${HY - 110} 84 ${HY} L 90 ${HY + 120} Q 60 ${HY + 140} 40 ${HY + 100} L -40 ${HY + 100} Q -60 ${HY + 140} -90 ${HY + 120} Z" fill="${c}" stroke="${INK9}" stroke-width="4.5"/>`;
  if (P.hair === 'curly') { let s = ''; for (let i = 0; i < 9; i++) { const a = Math.PI * (0.95 + i * 0.14); s += `<circle cx="${f2(Math.cos(a) * 80)}" cy="${f2(HY + Math.sin(a) * 74)}" r="24" fill="${c}" stroke="${INK9}" stroke-width="4"/>`; } return s; }
  if (P.hair === 'bun') return `<circle cx="0" cy="${HY - 86}" r="28" fill="${c}" stroke="${INK9}" stroke-width="4.5"/>`;
  if (P.hair === 'whiteBun') return `<circle cx="0" cy="${HY - 86}" r="28" fill="#eceaf2" stroke="${INK9}" stroke-width="4.5"/>`;
  return '';
}
function hairFront(P, d, dir, fx) {
  const c = P.hairC || '#3a2418';
  switch (P.hair) {
    case 'chef': return `<rect x="-60" y="${HY - 92}" width="120" height="30" rx="8" fill="#f6efe2" stroke="${INK9}" stroke-width="4.5"/><path d="M -58 ${HY - 88} C -96 ${HY - 110} -66 ${HY - 160} -32 ${HY - 138} C -24 ${HY - 182} 26 ${HY - 182} 32 ${HY - 138} C 66 ${HY - 160} 96 ${HY - 110} 58 ${HY - 88} Z" fill="#fffaf0" stroke="${INK9}" stroke-width="4.5"/>`;
    case 'bun': case 'whiteBun': { const cc = P.hair === 'bun' ? c : '#eceaf2'; return `<path d="M -76 ${HY - 14} C -82 ${HY - 96} 82 ${HY - 96} 76 ${HY - 14} Q 30 ${HY - 60} -76 ${HY - 14} Z" fill="${cc}" stroke="${INK9}" stroke-width="4.5"/>`; }
    case 'curly': { let s = `<path d="M -74 ${HY - 20} C -80 ${HY - 96} 80 ${HY - 96} 74 ${HY - 20} Q 0 ${HY - 66} -74 ${HY - 20} Z" fill="${c}" stroke="${INK9}" stroke-width="4.5"/>`; for (let i = 0; i < 5; i++) s += `<circle cx="${-48 + i * 24}" cy="${HY - 66 + Math.abs(i - 2) * 8}" r="18" fill="${c}" stroke="${INK9}" stroke-width="4"/>`; return s; }
    case 'long': return `<path d="M -78 ${HY - 6} C -84 ${HY - 98} 84 ${HY - 98} 78 ${HY - 6} Q 50 ${HY - 70} ${f2(fx + 10)} ${HY - 52} Q -30 ${HY - 40} -78 ${HY - 6} Z" fill="${c}" stroke="${INK9}" stroke-width="4.5"/>` + (P.bow ? `<path d="M 30 ${HY - 78} l -24 -16 l 0 32 Z M 30 ${HY - 78} l 24 -16 l 0 32 Z" fill="${P.bow}" stroke="${INK9}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="30" cy="${HY - 78}" r="7" fill="${P.bow}" stroke="${INK9}" stroke-width="3"/>` : '');
    case 'short': return `<path d="M -78 ${HY - 10} C -84 ${HY - 100} 84 ${HY - 100} 78 ${HY - 10} Q 66 ${HY - 50} ${f2(fx + 30)} ${HY - 54} Q -20 ${HY - 44} -40 ${HY - 60} Q -60 ${HY - 40} -78 ${HY - 10} Z" fill="${c}" stroke="${INK9}" stroke-width="4.5"/>`;
    case 'cap': return `<path d="M -76 ${HY - 22} C -76 ${HY - 100} 76 ${HY - 100} 76 ${HY - 22} Z" fill="#3a6ab8" stroke="${INK9}" stroke-width="4.5"/><path d="M ${dir * 20} ${HY - 26} Q ${dir * 90} ${HY - 34} ${dir * 112} ${HY - 18} Q ${dir * 70} ${HY - 10} ${dir * 20} ${HY - 16} Z" fill="#2a5096" stroke="${INK9}" stroke-width="4.5" stroke-linejoin="round"/><circle cx="0" cy="${HY - 80}" r="7" fill="#2a5096" stroke="${INK9}" stroke-width="3"/>`;
    case 'driverCap': return `<path d="M -74 ${HY - 26} C -74 ${HY - 104} 74 ${HY - 104} 74 ${HY - 26} Z" fill="#3c5a8a" stroke="${INK9}" stroke-width="4.5"/><rect x="-78" y="${HY - 36}" width="156" height="16" rx="6" fill="#24395e" stroke="${INK9}" stroke-width="4"/><path d="M ${dir * 10} ${HY - 22} Q ${dir * 70} ${HY - 18} ${dir * 104} ${HY - 6} L ${dir * 10} ${HY - 10} Z" fill="#1a2a48" stroke="${INK9}" stroke-width="4"/><circle cx="0" cy="${HY - 64}" r="10" fill="#f2c230" stroke="${INK9}" stroke-width="3"/>`;
    case 'whiteSides': return `<path d="M -80 ${HY + 6} Q -94 ${HY - 30} -70 ${HY - 40} Q -66 ${HY - 10} -78 ${HY + 10} Z M 80 ${HY + 6} Q 94 ${HY - 30} 70 ${HY - 40} Q 66 ${HY - 10} 78 ${HY + 10} Z" fill="#f4f1ea" stroke="${INK9}" stroke-width="4"/>` +
      (P.hat === 'straw' ? `<ellipse cx="0" cy="${HY - 52}" rx="122" ry="20" fill="#e8c46a" stroke="${INK9}" stroke-width="4.5"/><path d="M -62 ${HY - 54} C -60 ${HY - 116} 60 ${HY - 116} 62 ${HY - 54} Z" fill="#e8c46a" stroke="${INK9}" stroke-width="4.5"/><path d="M -62 ${HY - 66} Q 0 ${HY - 58} 62 ${HY - 66} L 61 ${HY - 55} Q 0 ${HY - 48} -61 ${HY - 55} Z" fill="#c8643c"/>` : '');
  }
  return '';
}

function torso9(P, d) {
  const w = P.wide || 1;
  const sx = 48 * w, hx = 58 * w;
  const dress = P.topType === 'dress' || P.topType === 'apron' || P.topType === 'shawl';
  const hemY = dress ? -64 : -108, hemX = dress ? 86 * w : hx;
  const path = `M ${-sx} -252 Q ${-sx - 8} -248 ${-sx - 10} -228 L ${-hemX} ${hemY} Q 0 ${hemY + 10} ${hemX} ${hemY} L ${sx + 10} -228 Q ${sx + 8} -248 ${sx} -252 Q 0 -238 ${-sx} -252 Z`;
  let s = '';
  if (P.topType === 'hoodie') s += `<ellipse cx="0" cy="-252" rx="62" ry="22" fill="${P.topD}" stroke="${INK9}" stroke-width="4.5"/>`;
  s += `<path d="${path}" fill="${P.top}" stroke="${INK9}" stroke-width="4.5" stroke-linejoin="round"/>`;
  s += `<path d="${path}" fill="url(#pFabric)"/>`;
  s += `<path d="M ${f2(sx * 0.35)} -244 L ${f2(hemX * 0.55)} ${hemY + 4} L ${hemX} ${hemY} L ${sx + 10} -228 Q ${sx + 8} -248 ${sx} -252 Z" fill="${P.topD}" opacity="0.55"/>`;
  s += `<path d="M ${-sx - 4} -236 Q ${-sx * 0.5} -246 ${-sx * 0.2} -244" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.25" stroke-linecap="round"/>`;
  if (P.topType === 'hoodie') {
    s += `<path d="M -40 -164 L 40 -164 L 50 -126 L -50 -126 Z" fill="${P.topD}" stroke="${INK9}" stroke-width="4" stroke-linejoin="round"/><path d="M -35 -158 L 35 -158 L 43 -131 L -43 -131 Z" fill="none" stroke="#8a6a10" stroke-width="1.8" stroke-dasharray="5 4" opacity="0.7"/>`;
    s += `<path d="M -30 -232 Q -20 -210 -34 -186 M 28 -228 Q 36 -206 26 -182 M -44 -176 Q -30 -168 -20 -178" stroke="${P.topD}" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="0.9"/>`;
    s += `<path d="M -16 -246 L -18 -198 M 16 -246 L 18 -198" stroke="#f6efe2" stroke-width="4" stroke-linecap="round"/><circle cx="-18" cy="-196" r="4" fill="#f6efe2" stroke="${INK9}" stroke-width="2"/><circle cx="18" cy="-196" r="4" fill="#f6efe2" stroke="${INK9}" stroke-width="2"/>`;
    s += `<path d="M ${-hx} -120 Q 0 -110 ${hx} -120 L ${hx} -108 Q 0 -98 ${-hx} -108 Z" fill="${P.topD}" stroke="${INK9}" stroke-width="4"/>`;
    for (let i = -4; i <= 4; i++) s += `<path d="M ${i * 12} -116 v 8" stroke="#8a6a10" stroke-width="1.6" opacity="0.55"/>`;
  }
  if (P.topType === 'apron') s += `<path d="M -40 -200 L 40 -200 L 60 -70 Q 0 -60 -60 -70 Z" fill="#fffaf0" stroke="${INK9}" stroke-width="4"/><rect x="-22" y="-150" width="44" height="26" rx="6" fill="#efe6d2" stroke="${INK9}" stroke-width="3"/><path d="M -40 -200 L -30 -250 M 40 -200 L 30 -250" stroke="#fffaf0" stroke-width="6"/>`;
  if (P.topType === 'shawl') s += `<path d="M ${-sx - 12} -246 Q 0 -196 ${sx + 12} -246 L ${sx + 20} -200 Q 0 -150 ${-sx - 20} -200 Z" fill="${P.topD}" stroke="${INK9}" stroke-width="4"/>`;
  if (P.topType === 'shirt') s += `<path d="M -22 -248 L 0 -222 L 22 -248" fill="#f6efe2" stroke="${INK9}" stroke-width="3.5"/><path d="M 0 -222 V -112" stroke="${INK9}" stroke-width="3" opacity="0.5"/><circle cx="0" cy="-190" r="3.5" fill="${INK9}"/><circle cx="0" cy="-160" r="3.5" fill="${INK9}"/><circle cx="0" cy="-130" r="3.5" fill="${INK9}"/>`;
  if (P.topType === 'vest') s += `<path d="M -22 -248 L 0 -200 L 22 -248" fill="#f6efe2" stroke="${INK9}" stroke-width="3.5"/><circle cx="-8" cy="-170" r="4" fill="#f2c230" stroke="${INK9}" stroke-width="2"/><circle cx="-8" cy="-140" r="4" fill="#f2c230" stroke="${INK9}" stroke-width="2"/>`;
  if (P.topType === 'tee') s += `<path d="M -26 -248 Q 0 -230 26 -248" stroke="${INK9}" stroke-width="3.5" fill="none"/>`;
  return { svg: s, hemY };
}

function person(id, o = {}) {
  const P = CAST[id === 'padeira' && o.old ? 'padeiraV' : id];
  const d = Object.assign({ x: 0, y: 0, s: 1, face: 0, expr: 'neutral', mouth: 0, blink: 0, lx: 0, ly: 0, armL: 8, armR: 8, bendL: 12, bendR: 12, walk: null, tilt: 0, squash: 0, jump: 0, t: 0, holdR: '', holdL: '', shadow: true, headTilt: 0, flip: false }, o);
  const s = d.s * (P.scale || 1);
  const dir = d.face >= 0 ? 1 : -1;
  const fx = d.face * 24;
  const breath = Math.sin(d.t * 2.3 + P.seed) * 2.2;
  let bob = 0, lA = 0, rA = 0;
  if (d.walk != null) { bob = -Math.abs(Math.sin(d.walk)) * 10; lA = Math.sin(d.walk) * 24; rA = -lA; }
  let g = '';
  if (d.shadow) g += `<ellipse cx="0" cy="2" rx="${f2(70 * (1 - d.jump / 400))}" ry="13" fill="#1b1424" opacity="0.22"/>`;
  if (d.mouth > 0.05) d.headTilt += Math.sin(d.t * 11) * 2.5;
  if (d.side) return personSide(P, d, s, g);
  g += `<g transform="translate(0 ${f2(bob - d.jump)}) rotate(${f2(d.tilt)} 0 -100)">`;
  // legs
  const leg = (x, a, side) => {
    const L = P.topType === 'dress' || P.topType === 'apron' || P.topType === 'shawl' ? 60 : 98;
    const top = -12 - L;
    return `<g transform="rotate(${f2(a)} ${x} ${top})"><path d="M ${x} ${top} L ${x} -14" stroke="${INK9}" stroke-width="26" stroke-linecap="round"/><path d="M ${x} ${top} L ${x} -14" stroke="${P.pants}" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M ${x + 4} ${top + 8} L ${x + 4} -24" stroke="${mix(P.pants, '#1b1424', 0.3)}" stroke-width="3" opacity="0.6"/>` +
      `<path d="M ${x - 14 + dir * 4} -2 Q ${x - 14} -24 ${x + dir * 6} -22 Q ${x + dir * 30} -18 ${x + dir * 30} -4 Q ${x + dir * 26} 4 ${x} 4 Q ${x - 16} 4 ${x - 14 + dir * 4} -2 Z" fill="${P.shoes}" stroke="${INK9}" stroke-width="4"/><path d="M ${x - 4} -16 Q ${x + dir * 8} -20 ${x + dir * 18} -14" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.35" stroke-linecap="round"/></g>`;
  };
  g += leg(-20, lA, -1) + leg(20, rA, 1);
  // arms (behind when hanging)
  const armSvg = (side, a, b) => {
    const L = limb(side * 50, -238, a, b, 62, 58, side);
    const p = `M ${side * 50} -238 L ${f2(L.ex)} ${f2(L.ey)} L ${f2(L.hx)} ${f2(L.hy)}`;
    const hand = P.hands || P.skin;
    return { svg: `<path d="${p}" stroke="${INK9}" stroke-width="27" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${p}" stroke="${P.top}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M ${f2(L.ex - 5)} ${f2(L.ey - 3)} l 8 4" stroke="${P.topD}" stroke-width="3" stroke-linecap="round"/>` +
      hand9(L.hx, L.hy, L.ex, L.ey, hand, side < 0 ? (d.handL || (a > 120 ? 'open' : 'fist')) : (d.handR || (a > 120 ? 'open' : 'fist')), P.hands ? 0.25 : 0.3), ...L };
  };
  const aL = armSvg(-1, d.armL, d.bendL), aR = armSvg(1, d.armR, d.bendR);
  g += `<g transform="translate(0 ${f2(breath * 0.4)})">`;
  const T = torso9(P, d);
  g += T.svg;
  g += aL.svg + aR.svg;
  if (d.holdR) g += `<g transform="translate(${f2(aR.hx)} ${f2(aR.hy)})">${d.holdR}</g>`;
  if (d.holdL) g += `<g transform="translate(${f2(aL.hx)} ${f2(aL.hy)})">${d.holdL}</g>`;
  if (P.cane) g += `<path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 10)} 0" stroke="${INK9}" stroke-width="13" stroke-linecap="round"/><path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 10)} 0" stroke="#8a5a34" stroke-width="7" stroke-linecap="round"/><path d="M ${f2(aR.hx - 18)} ${f2(aR.hy - 4)} Q ${f2(aR.hx - 2)} ${f2(aR.hy - 24)} ${f2(aR.hx + 4)} ${f2(aR.hy)}" stroke="#8a5a34" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  g += '</g>';
  // head
  g += `<g transform="translate(0 ${f2(breath)}) rotate(${f2(d.headTilt)} 0 ${HY + 60})">`;
  g += hairBack(P, dir);
  g += `<circle cx="0" cy="${HY}" r="${HR}" fill="${mix(P.skin, '#a85a4a', 0.28)}"/>`;
  g += `<g clip-path="url(#clipHead)"><circle cx="-12" cy="${HY - 12}" r="${HR}" fill="${P.skin}"/><ellipse cx="-30" cy="${HY - 40}" rx="26" ry="16" fill="#ffffff" opacity="0.22" transform="rotate(-30 -30 ${HY - 40})"/><circle cx="0" cy="${HY}" r="${HR}" fill="url(#pSkin)"/></g>`;
  g += `<circle cx="0" cy="${HY}" r="${HR}" fill="none" stroke="${INK9}" stroke-width="5"/>`;
  g += face9(d, P, fx);
  g += hairFront(P, d, dir, fx);
  g += '</g></g>';
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(s * (d.flip ? -1 : 1) * (1 - 0.45 * (d.turn || 0)))} ${f2(s)})">${g}</g>`;
}

// 3/4 side view used for walking/running: knees bend, arms swing, face turned toward travel direction.
function personSide(P, d, s, g) {
  const dir = d.face >= 0 ? 1 : -1;
  const w = d.walk != null ? d.walk : 0, run = d.run ? 1.6 : 1;
  const bob = d.walk != null ? -Math.abs(Math.sin(w)) * 12 * run : 0;
  const dress = P.topType === 'dress' || P.topType === 'apron' || P.topType === 'shawl';
  const hipY = dress ? -76 : -110, th = dress ? 34 : 52, sh = dress ? 30 : 48;
  const legSvg = (ph, back) => {
    const a = Math.sin(ph) * 32 * run, knee = Math.max(0, -Math.cos(ph)) * 48 * run;
    const A = a * Math.PI / 180, K = (a - knee) * Math.PI / 180;
    const kx = dir * Math.sin(A) * th, ky = hipY + Math.cos(A) * th;
    const fx = kx + dir * Math.sin(K) * sh, fy = ky + Math.cos(K) * sh;
    const col = back ? mix(P.pants, '#1b1424', 0.25) : P.pants;
    const pth = `M 0 ${hipY} L ${f2(kx)} ${f2(ky)} L ${f2(fx)} ${f2(fy)}`;
    return `<path d="${pth}" stroke="${INK9}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${pth}" stroke="${col}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M ${f2(fx - dir * 12)} ${f2(fy + 6)} Q ${f2(fx - dir * 12)} ${f2(fy - 12)} ${f2(fx + dir * 6)} ${f2(fy - 10)} Q ${f2(fx + dir * 30)} ${f2(fy - 6)} ${f2(fx + dir * 30)} ${f2(fy + 6)} Q ${f2(fx + dir * 26)} ${f2(fy + 14)} ${f2(fx)} ${f2(fy + 14)} Z" fill="${back ? mix(P.shoes, '#000000', 0.2) : P.shoes}" stroke="${INK9}" stroke-width="4"/>`;
  };
  const armSvg = (ph, back, override) => {
    const a = override != null ? override : -Math.sin(ph) * 30 * run, el = 25 + (d.run ? 50 : 0);
    const A = a * Math.PI / 180, B = (a + el) * Math.PI / 180;
    const sx = dir * 6, sy = -236;
    const ex = sx + dir * Math.sin(A) * 60, ey = sy + Math.cos(A) * 60;
    const hx = ex + dir * Math.sin(B) * 54, hy = ey + Math.cos(B) * 54;
    const col = back ? P.topD : P.top;
    const pth = `M ${sx} ${sy} L ${f2(ex)} ${f2(ey)} L ${f2(hx)} ${f2(hy)}`;
    return { svg: `<path d="${pth}" stroke="${INK9}" stroke-width="27" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${pth}" stroke="${col}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` + hand9(hx, hy, ex, ey, P.hands || P.skin, a > 120 ? 'open' : 'fist', 0.25), hx, hy };
  };
  g += `<g transform="translate(0 ${f2(bob - d.jump)}) rotate(${f2(d.tilt + (d.run ? dir * 7 : dir * 2))} 0 -60)">`;
  const back = armSvg(w + Math.PI, true, d.armBack), front = armSvg(w, false, d.armFront);
  g += back.svg + legSvg(w + Math.PI, true) + legSvg(w, false);
  const T = torso9(P, d);
  g += `<g transform="scale(0.74 1)">${T.svg}</g>`;
  g += front.svg;
  if (d.holdR) g += `<g transform="translate(${f2(front.hx)} ${f2(front.hy)})">${d.holdR}</g>`;
  g += `<g transform="translate(0 ${f2(Math.sin(w * 2) * 2)}) rotate(${f2(d.headTilt)} 0 ${HY + 60})">`;
  g += hairBack(P, dir);
  g += `<circle cx="0" cy="${HY}" r="${HR}" fill="${mix(P.skin, '#a85a4a', 0.28)}"/>`;
  g += `<g clip-path="url(#clipHead)"><circle cx="${-dir * 12}" cy="${HY - 12}" r="${HR}" fill="${P.skin}"/><circle cx="0" cy="${HY}" r="${HR}" fill="url(#pSkin)"/></g>`;
  g += `<circle cx="0" cy="${HY}" r="${HR}" fill="none" stroke="${INK9}" stroke-width="5"/>`;
  g += face9(Object.assign({}, d, { face: dir * 1.2, sep: 20, lx: dir }), P, dir * 27);
  g += hairFront(P, d, dir, dir * 27);
  g += '</g></g>';
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(s * (1 - 0.45 * (d.turn || 0)))} ${f2(s)})">${g}</g>`;
}

// Emotion symbols (reference style). x,y = head top in world units; age = seconds since trigger.
function emote(type, x, y, age, k = 1) {
  if (age < 0 || age > 2.2) return '';
  const pop = E.back(clamp(age / 0.18)), fade = 1 - clamp((age - 1.8) / 0.4);
  const b = Math.sin(age * 8) * 3;
  let s = '';
  if (type === 'sweat') s = `<path d="M 0 ${-30 + age * 18} q -14 22 0 30 q 14 -8 0 -30 Z" fill="#8fd0f0" stroke="${INK9}" stroke-width="3"/><path d="M -3 ${-6 + age * 18} q -3 6 1 9" stroke="#fff" stroke-width="2.5" fill="none"/>`;
  else if (type === 'excl') s = `<g transform="translate(0 ${b})"><path d="M -8 -70 L 8 -70 L 4 -22 L -4 -22 Z" fill="#ff5a3c" stroke="${INK9}" stroke-width="4" stroke-linejoin="round"/><circle cx="0" cy="-6" r="8" fill="#ff5a3c" stroke="${INK9}" stroke-width="4"/></g>`;
  else if (type === 'q') s = `<g transform="translate(0 ${b})"><text y="0" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#ffffff" stroke="${INK9}" stroke-width="10" paint-order="stroke">?</text></g>`;
  else if (type === 'vein') s = `<g transform="rotate(${b * 3}) scale(${1 + Math.sin(age * 14) * 0.08})"><path d="M -18 -6 Q -6 -6 -6 -18 M 6 -18 Q 6 -6 18 -6 M 18 6 Q 6 6 6 18 M -6 18 Q -6 6 -18 6" stroke="#e8343c" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
  else if (type === 'heart') s = `<g transform="translate(0 ${-age * 30})"><path d="M 0 0 C -24 -18 -14 -40 0 -26 C 14 -40 24 -18 0 0 Z" fill="#ff6a8a" stroke="${INK9}" stroke-width="3.5"/></g>`;
  else if (type === 'sparkle') { for (let i = 0; i < 3; i++) { const a = i * 2.1 + age * 2, r = 50 + i * 10; s += `<path transform="translate(${f2(Math.cos(a) * r)} ${f2(Math.sin(a) * r * 0.5 - 20)}) scale(${f2(0.6 + 0.4 * Math.abs(Math.sin(age * 6 + i)))})" d="M 0 -16 L 4 -4 L 16 0 L 4 4 L 0 16 L -4 4 L -16 0 L -4 -4 Z" fill="#ffd23f" stroke="${INK9}" stroke-width="2.5"/>`; } }
  else if (type === 'shock') { for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.1 + i * 0.13); s += `<path d="M ${f2(Math.cos(a) * 95)} ${f2(Math.sin(a) * 95 + 80)} L ${f2(Math.cos(a) * 125)} ${f2(Math.sin(a) * 125 + 80)}" stroke="${INK9}" stroke-width="6" stroke-linecap="round"/>`; } }
  else if (type === 'zzz') s = `<text x="${age * 10}" y="${-age * 20}" font-family="Fredoka" font-weight="700" font-size="40" fill="#ffffff" stroke="${INK9}" stroke-width="7" paint-order="stroke">z z</text>`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(pop * k)})" opacity="${f2(fade)}">${s}</g>`;
}
