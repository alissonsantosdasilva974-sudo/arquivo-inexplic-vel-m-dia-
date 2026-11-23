// Character rig. Local coords: feet centre at (0,0), head top near y=-225. Faces toward `face` (-1 left .. 1 right).
const CH = {
  polo: { scale: 1, seed: 1, skin: '#e0ac69', cloth: '#3c8a86' },
  padeira: { scale: 1.08, seed: 2, skin: '#f1c27d', cloth: '#d46a6a' },
  mae: { scale: 1.05, seed: 3, skin: '#c68642', cloth: '#8a5a9a' },
  motorista: { scale: 1.05, seed: 4, skin: '#f3c9a0', cloth: '#3c5a8a' },
  barnabe: { scale: 1.02, seed: 5, skin: '#eab88a', cloth: '#8a5a34' },
  menino: { scale: 0.72, seed: 6, skin: '#8d5524', cloth: '#4f7a9a' },
  mulher: { scale: 1, seed: 7, skin: '#e0ac69', cloth: '#8a5e4f' },
  moca: { scale: 0.96, seed: 8, skin: '#f3c9a0', cloth: '#e07a96' },
  viz1: { scale: 0.98, seed: 9, skin: '#c68642', cloth: '#c8a03a' },
  viz2: { scale: 1.04, seed: 10, skin: '#f1c27d', cloth: '#6a5a80' },
  viz3: { scale: 0.92, seed: 11, skin: '#8d5524', cloth: '#c8643c' },
  gato: { scale: 1, seed: 12 },
};

function arm(side, ang, len, bodyFill, skin) {
  // side -1 left, 1 right; ang deg, 0 = hanging down, 90 = horizontal outward, 170 = up
  const sx = side * 56, sy = -108;
  const a = ang * Math.PI / 180;
  const ex = sx + side * Math.sin(a) * len * 0.55, ey = sy + Math.cos(a) * len * 0.55;
  const hx = sx + side * Math.sin(a) * len, hy = sy + Math.cos(a) * len;
  const mx = (sx + ex) / 2 + side * 6, my = (sy + ey) / 2;
  const path = `M${f2(sx)} ${f2(sy)} Q${f2(mx)} ${f2(my)} ${f2(hx)} ${f2(hy)}`;
  return {
    svg: `<path d="${path}" stroke="${INK}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
      `<path d="${path}" stroke="${bodyFill}" stroke-width="16" fill="none" stroke-linecap="round"/>` +
      `<circle cx="${f2(hx)}" cy="${f2(hy)}" r="14" fill="${skin}" stroke="${INK}" stroke-width="4"/>`,
    hx, hy
  };
}

function eyes(d, ex) {
  const eyY = -150, big = d.expr === 'surprised' ? 1.25 : 1;
  const bl = Math.max(d.blink, autoBlink(d.t, CH[d.id].seed));
  let s = '';
  for (const k of [-1, 1]) {
    const cx = ex + k * 23;
    const wink = d.expr === 'smug' && k === 1;
    if (d.expr === 'laugh' || d.expr === 'joy' || wink) {
      s += `<path d="M${f2(cx - 11)} ${eyY + 2} Q${f2(cx)} ${eyY - 12} ${f2(cx + 11)} ${eyY + 2}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      continue;
    }
    if (bl > 0.75) { s += `<path d="M${f2(cx - 11)} ${eyY} L${f2(cx + 11)} ${eyY}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; continue; }
    const ry = 16 * big * (1 - bl * 0.9);
    const px = cx + d.lx * 5 + d.face * 3, py = eyY + d.ly * 5;
    s += `<ellipse cx="${f2(cx)}" cy="${eyY}" rx="${f2(13 * big)}" ry="${f2(ry)}" fill="#fbf4e4" stroke="${INK}" stroke-width="3.5"/>` +
      `<circle cx="${f2(px)}" cy="${f2(py)}" r="${f2(7 * big)}" fill="${INK}"/>` +
      `<circle cx="${f2(px + 2.5)}" cy="${f2(py - 3)}" r="2.4" fill="#fff"/>`;
  }
  // brows
  const b = { neutral: [0, 0], happy: [-4, 0], surprised: [-14, 0], worried: [-4, 10], angry: [2, -10], smug: [-6, -6], laugh: [-6, 0], joy: [-8, 0], sad: [0, 12] }[d.expr] || [0, 0];
  for (const k of [-1, 1]) {
    const cx = ex + k * 23, y = eyY - 26 + b[0];
    const tilt = b[1] * k * -1; // inner end up for worried
    s += `<path d="M${f2(cx - 10)} ${f2(y + tilt * (k < 0 ? 0 : 1) * 0.5)} L${f2(cx + 10)} ${f2(y + tilt * (k < 0 ? 1 : 0) * 0.5)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  }
  return s;
}

function mouth(d, ex) {
  const mx = ex * 0.9, my = -114, m = clamp(d.mouth);
  const e = d.expr;
  if (e === 'surprised' || (e === 'o')) return `<ellipse cx="${f2(mx)}" cy="${my + 2}" rx="${f2(7 + m * 3)}" ry="${f2(9 + m * 5)}" fill="#5a1f2b" stroke="${INK}" stroke-width="3.5"/>`;
  if (e === 'laugh' || m > 0.05) {
    const open = e === 'laugh' ? Math.max(m, 0.7) : m;
    return `<path d="M${f2(mx - 16)} ${my - 3} Q${f2(mx)} ${f2(my + 6 + open * 20)} ${f2(mx + 16)} ${my - 3} Z" fill="#5a1f2b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
      (open > 0.4 ? `<path d="M${f2(mx - 8)} ${f2(my + 2 + open * 12)} Q${f2(mx)} ${f2(my - 2 + open * 10)} ${f2(mx + 8)} ${f2(my + 2 + open * 12)}" fill="#d9677a"/>` : '');
  }
  if (e === 'worried' || e === 'sad') return `<path d="M${f2(mx - 11)} ${my + 5} Q${f2(mx)} ${my - 4} ${f2(mx + 11)} ${my + 5}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  if (e === 'neutral' || e === 'angry') return `<path d="M${f2(mx - 9)} ${my} L${f2(mx + 9)} ${my}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  if (e === 'smug') return `<path d="M${f2(mx - 12)} ${my} Q${f2(mx + 2)} ${my + 8} ${f2(mx + 15)} ${my - 6}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  return `<path d="M${f2(mx - 14)} ${my - 3} Q${f2(mx)} ${my + 10} ${f2(mx + 14)} ${my - 3}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
}

const BODY = 'M -70 -22 C -84 -120 -62 -226 0 -226 C 62 -226 84 -120 70 -22 C 64 2 -64 2 -70 -22 Z';

function behind(d, dir) {
  const id = d.id;
  if (id === 'moca') return `<path d="M -86 -150 C -100 -262 100 -262 86 -150 L 98 -56 Q 74 -36 60 -66 L -60 -66 Q -74 -36 -98 -56 Z" fill="#6b3b2a" stroke="${INK}" stroke-width="4"/>`;
  if (id === 'polo') { // scarf tail flutter
    const sw = Math.sin(d.t * 5) * 6 + (d.walk != null ? Math.sin(d.walk) * 8 : 0);
    const sx = -dir * 40;
    return `<path d="M ${sx} -96 Q ${sx - dir * 16} -70 ${sx - dir * (24 + sw)} -40 L ${sx - dir * (6 + sw)} -36 Q ${sx + dir * 2} -66 ${sx + dir * 14} -92 Z" fill="#e0a83a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  }
  return '';
}

function accessories(d, ex, dir) {
  const id = d.id;
  let s = '';
  if (id === 'polo') {
    s += `<path d="M -66 -102 Q 0 -78 66 -102 L 64 -82 Q 0 -58 -64 -82 Z" fill="#e0a83a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<path d="M -58 -184 C -56 -242 56 -242 58 -184 Q 0 -194 -58 -184 Z" fill="#c8643c" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M ${dir * 20} -188 Q ${dir * 70} -196 ${dir * 96} -180 Q ${dir * 60} -174 ${dir * 20} -180 Z" fill="#a44e2c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<circle cx="0" cy="-232" r="7" fill="#a44e2c" stroke="${INK}" stroke-width="3"/>`;
    if (d.mask) s += `<path d="M ${f2(ex - 34)} -132 Q ${f2(ex)} -138 ${f2(ex + 34)} -132 L ${f2(ex + 30)} -102 Q ${f2(ex)} -90 ${f2(ex - 30)} -102 Z" fill="#a9d2e6" stroke="${INK}" stroke-width="3.5"/>` +
      `<path d="M ${f2(ex - 34)} -130 L -62 -142 M ${f2(ex + 34)} -130 L 62 -142" stroke="#e8f3f8" stroke-width="3"/>` +
      `<path d="M ${f2(ex - 22)} -120 L ${f2(ex + 22)} -120 M ${f2(ex - 20)} -110 L ${f2(ex + 20)} -110" stroke="#7fb0c8" stroke-width="2.5"/>`;
  }
  if (id === 'padeira') {
    if (!d.old) {
      s += `<path d="M -50 -96 L 50 -96 L 62 -22 Q 0 -8 -62 -22 Z" fill="#f4e6c8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
      s += `<rect x="-20" y="-70" width="40" height="22" rx="6" fill="#e6d3ad" stroke="${INK}" stroke-width="3"/>`;
      s += `<rect x="-52" y="-212" width="104" height="26" rx="8" fill="#f4e6c8" stroke="${INK}" stroke-width="4"/>`;
      s += `<path d="M -50 -210 C -78 -230 -52 -268 -26 -250 C -18 -284 22 -284 28 -250 C 54 -268 80 -230 50 -210 Z" fill="#fbf4e4" stroke="${INK}" stroke-width="4"/>`;
    } else {
      s += `<path d="M -64 -176 C -64 -238 64 -238 64 -176 Q 0 -196 -64 -176 Z" fill="#e9e6ee" stroke="${INK}" stroke-width="4"/>`;
      s += `<circle cx="0" cy="-236" r="22" fill="#e9e6ee" stroke="${INK}" stroke-width="4"/>`;
      s += `<path d="M -72 -100 Q 0 -60 72 -100 L 76 -60 Q 0 -20 -76 -60 Z" fill="#9b84b8" stroke="${INK}" stroke-width="4"/>`;
      for (const k of [-1, 1]) s += `<circle cx="${f2(ex + k * 23)}" cy="-150" r="18" fill="none" stroke="#c9b27a" stroke-width="4"/>`;
      s += `<path d="M ${f2(ex - 5)} -152 L ${f2(ex + 5)} -152" stroke="#c9b27a" stroke-width="4"/>`;
    }
    for (const k of [-1, 1]) s += `<circle cx="${f2(ex + k * 36)}" cy="-126" r="9" fill="#e07a7a" opacity="0.55"/>`;
  }
  if (id === 'mae') {
    s += `<path d="M -68 -168 C -70 -248 70 -248 68 -168 Q 0 -190 -68 -168 Z" fill="#7a8a4a" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M ${-dir * 62} -176 l ${-dir * 26} -10 l ${-dir * 2} 26 Z" fill="#b0603a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
    s += `<circle cx="${f2(ex - 18)}" cy="-212" r="5" fill="#e0a83a"/><circle cx="${f2(ex + 14)}" cy="-218" r="5" fill="#e0a83a"/>`;
  }
  if (id === 'motorista') {
    s += `<path d="M -60 -182 C -58 -236 58 -236 60 -182 Z" fill="#3c5a8a" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M -62 -184 Q 0 -168 ${dir * 100} -176 L ${dir * 96} -186 Q 0 -196 -62 -194 Z" fill="#24395e" stroke="${INK}" stroke-width="4"/>`;
    s += `<circle cx="0" cy="-208" r="9" fill="#e0a83a" stroke="${INK}" stroke-width="3"/>`;
    s += `<path d="M ${f2(ex - 26)} -124 Q ${f2(ex - 12)} -138 ${f2(ex)} -128 Q ${f2(ex + 12)} -138 ${f2(ex + 26)} -124 Q ${f2(ex)} -118 ${f2(ex - 26)} -124 Z" fill="#5a3a2a" stroke="${INK}" stroke-width="3"/>`;
  }
  if (id === 'barnabe') {
    s += `<path d="M ${f2(ex - 34)} -122 Q ${f2(ex - 16)} -142 ${f2(ex)} -128 Q ${f2(ex + 16)} -142 ${f2(ex + 34)} -122 Q ${f2(ex + 18)} -110 ${f2(ex)} -120 Q ${f2(ex - 18)} -110 ${f2(ex - 34)} -122 Z" fill="#f2efe8" stroke="${INK}" stroke-width="3.5"/>`;
    s += `<ellipse cx="0" cy="-196" rx="104" ry="20" fill="#e6c477" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M -54 -198 C -52 -250 52 -250 54 -198 Z" fill="#e6c477" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M -54 -208 Q 0 -200 54 -208 L 53 -198 Q 0 -190 -53 -198 Z" fill="#c8643c"/>`;
  }
  if (id === 'menino') {
    s += `<path d="M -64 -92 Q 0 -70 64 -92 L 70 -24 Q 0 -6 -70 -24 Z" fill="#e0a83a" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M -40 -60 L 40 -60" stroke="#c8643c" stroke-width="8"/>`;
    s += `<path d="M -58 -184 C -56 -242 56 -242 58 -184 Q 0 -194 -58 -184 Z" fill="#4f7a9a" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M ${-dir * 20} -190 Q ${-dir * 66} -200 ${-dir * 90} -186 Q ${-dir * 56} -178 ${-dir * 20} -182 Z" fill="#3a5f7d" stroke="${INK}" stroke-width="4"/>`;
  }
  if (id === 'mulher') {
    s += `<path d="M -66 -170 C -68 -244 68 -244 66 -170 Q 30 -200 -66 -170 Z" fill="#7a4a30" stroke="${INK}" stroke-width="4"/>`;
    s += `<circle cx="10" cy="-240" r="24" fill="#7a4a30" stroke="${INK}" stroke-width="4"/>`;
    for (const k of [-1, 1]) s += `<circle cx="${f2(ex + k * 24)}" cy="-150" r="21" fill="#ffffff22" stroke="#c8643c" stroke-width="5.5"/>`;
    s += `<path d="M ${f2(ex - 4)} -152 L ${f2(ex + 4)} -152" stroke="#c8643c" stroke-width="5"/>`;
    for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.22; s += `<circle cx="${f2(Math.sin(a) * 52)}" cy="${f2(-98 + Math.cos(a) * 12)}" r="5.5" fill="#f4e6c8" stroke="${INK}" stroke-width="2"/>`; }
  }
  if (id === 'moca') {
    s += `<path d="M -62 -168 C -64 -244 64 -244 62 -168 Q 10 -205 -20 -178 Q -40 -195 -62 -168 Z" fill="#6b3b2a" stroke="${INK}" stroke-width="4"/>`;
    s += `<path d="M 10 -228 l -30 -16 l 0 32 Z M 10 -228 l 30 -16 l 0 32 Z" fill="#e88aa0" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="10" cy="-228" r="7" fill="#d46a86" stroke="${INK}" stroke-width="3"/>`;
  }
  if (id === 'viz1') s += `<path d="M -58 -186 C -70 -236 50 -250 62 -196 Q 0 -200 -58 -186 Z" fill="#7a5b4a" stroke="${INK}" stroke-width="4"/><circle cx="4" cy="-238" r="6" fill="#7a5b4a" stroke="${INK}" stroke-width="3"/>`;
  if (id === 'viz2') s += `<ellipse cx="0" cy="-192" rx="78" ry="13" fill="#2f2a3a" stroke="${INK}" stroke-width="4"/><path d="M -46 -194 C -46 -250 46 -250 46 -194 Z" fill="#2f2a3a" stroke="${INK}" stroke-width="4"/><path d="M -46 -206 L 46 -206" stroke="#c8643c" stroke-width="7"/>`;
  if (id === 'viz3') s += `<path d="M -64 -168 C -66 -240 66 -240 64 -168 Q 0 -192 -64 -168 Z" fill="#2e2a2a" stroke="${INK}" stroke-width="4"/><circle cx="${-dir * 40}" cy="-206" r="13" fill="#e88aa0" stroke="${INK}" stroke-width="3"/><circle cx="${-dir * 40}" cy="-206" r="5" fill="#e0a83a"/>`;
  return s;
}

function char(id, o = {}) {
  const d = Object.assign({ id, x: 0, y: 0, s: 1, face: 0, expr: 'neutral', mouth: 0, blink: 0, lx: 0, ly: 0, armL: 12, armR: 12, walk: null, tilt: 0, squash: 0, jump: 0, t: 0, mask: false, holdR: '', holdL: '', old: false, shadow: true }, o);
  if (id === 'gato') return cat(d);
  const P = CH[id];
  const s = d.s * P.scale;
  const dir = d.face >= 0 ? 1 : -1;
  const ex = d.face * 18;
  const breath = 1 + 0.014 * Math.sin(d.t * 2.4 + P.seed);
  let bob = 0, fl = 0, fr = 0, liftL = 0, liftR = 0;
  if (d.walk != null) {
    bob = -Math.abs(Math.sin(d.walk)) * 9;
    fl = Math.sin(d.walk) * 20; fr = -fl;
    liftL = Math.max(0, Math.sin(d.walk)) * 10; liftR = Math.max(0, -Math.sin(d.walk)) * 10;
  }
  const bodyFill = d.old ? '#7a6a9a' : P.cloth, skin = P.skin;
  const sq = 1 + d.squash, sqx = 1 - d.squash * 0.6;
  let g = '';
  if (d.shadow) g += `<ellipse cx="0" cy="2" rx="${f2(78 - d.jump * 0.15)}" ry="14" fill="#1b1424" opacity="${f2(0.28 - d.jump * 0.001)}"/>`;
  g += `<g transform="translate(0 ${f2(bob - d.jump)})">`;
  g += `<ellipse cx="${f2(-30 + fl)}" cy="${f2(-6 - liftL)}" rx="28" ry="13" fill="#2f2640" stroke="${INK}" stroke-width="4"/>`;
  g += `<ellipse cx="${f2(30 + fr)}" cy="${f2(-6 - liftR)}" rx="28" ry="13" fill="#2f2640" stroke="${INK}" stroke-width="4"/>`;
  g += `<g transform="rotate(${f2(d.tilt)} 0 -10) scale(${f2(sqx * (2 - breath))} ${f2(sq * breath)})">`;
  g += behind(d, dir);
  const aL = arm(-1, d.armL, 74, bodyFill, skin), aR = arm(1, d.armR, 74, bodyFill, skin);
  // arms that point downward/behind are drawn behind the body
  const backL = d.armL < 25, backR = d.armR < 25;
  if (backL) g += aL.svg; if (backR) g += aR.svg;
  g += `<path d="${BODY}" fill="${bodyFill}"/>`;
  g += `<g clip-path="url(#clipBody)"><rect x="-100" y="-240" width="200" height="${id === 'menino' ? 150 : 142}" fill="${skin}"/><path d="M -100 -98 Q 0 ${id === 'padeira' || id === 'mulher' || id === 'moca' ? -66 : -82} 100 -98" fill="${skin}" stroke="${INK}" stroke-width="4"/><path d="${BODY}" fill="url(#gShade)"/></g>`;
  g += `<path d="${BODY}" fill="none" stroke="${INK}" stroke-width="5"/>`;
  g += `<path d="M ${dir * 52} -190 C ${dir * 70} -150 ${dir * 72} -90 ${dir * 62} -40" stroke="#ffffff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.28"/>`;
  g += eyes(d, ex) + mouth(d, ex) + accessories(d, ex, dir);
  if (!backL) g += aL.svg; if (!backR) g += aR.svg;
  if (d.holdR) g += `<g transform="translate(${f2(aR.hx)} ${f2(aR.hy)})">${d.holdR}</g>`;
  if (d.holdL) g += `<g transform="translate(${f2(aL.hx)} ${f2(aL.hy)})">${d.holdL}</g>`;
  if (id === 'barnabe') g += `<path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 14)} 0" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M ${f2(aR.hx)} ${f2(aR.hy)} L ${f2(aR.hx + 14)} 0" stroke="#8a5a34" stroke-width="6" stroke-linecap="round"/><path d="M ${f2(aR.hx - 16)} ${f2(aR.hy - 6)} Q ${f2(aR.hx)} ${f2(aR.hy - 22)} ${f2(aR.hx + 6)} ${f2(aR.hy)}" stroke="#8a5a34" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  g += `</g></g>`;
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(s * (d.flip ? -1 : 1))} ${f2(s)})">${g}</g>`;
}

function cat(d) {
  const tail = Math.sin(d.t * 2) * 14;
  return `<g transform="translate(${f2(d.x)} ${f2(d.y)}) scale(${f2(d.s)})">
  <path d="M 30 -10 Q ${f2(70 + tail)} -30 ${f2(56 + tail)} -70" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M -38 0 C -44 -50 -30 -70 0 -70 C 30 -70 44 -50 38 0 Z" fill="#3b3147" stroke="${INK}" stroke-width="4"/>
  <path d="M -30 -60 L -34 -92 L -10 -72 Z M 30 -60 L 34 -92 L 10 -72 Z" fill="#3b3147" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  ${autoBlink(d.t, 12) > 0.6 ? `<path d="M -20 -50 h 12 M 8 -50 h 12" stroke="#e0a83a" stroke-width="4"/>` : `<ellipse cx="-14" cy="-50" rx="7" ry="8" fill="#e0a83a"/><ellipse cx="14" cy="-50" rx="7" ry="8" fill="#e0a83a"/><path d="M -14 -56 v 12 M 14 -56 v 12" stroke="${INK}" stroke-width="3"/>`}
  </g>`;
}

// Props
function bread(o = {}) {
  const stone = clamp(o.stone || 0);
  const c1 = mix('#d9893f', '#8c8a86', stone), c2 = mix('#b8682a', '#6a6864', stone), c3 = mix('#f2c27a', '#b6b3ad', stone);
  const s = o.s || 1;
  let g = `<g transform="rotate(${f2(o.rot || 0)}) scale(${s})">
  <ellipse cx="0" cy="0" rx="58" ry="26" fill="${c1}" stroke="${INK}" stroke-width="4"/>
  <ellipse cx="-6" cy="-8" rx="40" ry="10" fill="${c3}" opacity="0.6"/>`;
  for (const k of [-30, -8, 14, 36]) g += `<path d="M ${k - 8} -16 Q ${k} -2 ${k + 8} 10" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if (o.cracks) g += `<path d="M -40 -6 l 14 6 l -4 10 l 12 6 M 10 -20 l 6 12 l 14 0 l 6 10" stroke="${INK}" stroke-width="3" fill="none" opacity="${f2(o.cracks)}"/>`;
  return g + '</g>';
}

function note10() {
  return `<g><rect x="-26" y="-14" width="52" height="28" rx="4" fill="#d98a6a" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="0" r="8" fill="none" stroke="#a65a42" stroke-width="2.5"/><text x="-21" y="-3" font-family="Inter Display" font-weight="900" font-size="10" fill="#7a3a2a">10</text></g>`;
}
