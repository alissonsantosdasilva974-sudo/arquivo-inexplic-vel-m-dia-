// Hospital Santa Clara (parte final): elenco e cenários do episódio. Carregado depois de characters2.js / scenes.js.
// Polo com figurino anos 1920 (boina, sobretudo, colete, camisa sem gola) a pedido do usuário. Sem verde em nada.

CAST2.poloPB = Object.assign({}, CAST2.polo, { top: '#3d3946', topD: '#2b2833', topType: 'vest', vest: '#6e5c4e', bottom: '#4a4652', jeans: 0, shoes: '#2e2420', sneakers: 0, coat: 1, seed: 1 });
CAST2.medico = { skin: '#efc9a8', top: '#eeeadc', topD: '#cfc8b2', topType: 'shirt', tie: '#5a5a7a', bottom: '#4a4a56', shoes: '#2a2228', hair: 'sides', hairC: '#ecebe6', stache: '#ecebe6', glasses: '#2e2a36', w: 1.12, seed: 20, labcoat: 1, cracked: 1 };
const POLO = (o) => Object.assign({ hat: 'flatcap', pocketNote: true }, o);

// boina newsboy
function flatcap(dir) {
  const y = H2 - 52;
  return `<g><path d="M -92 ${y + 6} C -100 ${y - 60} -40 ${y - 86} 10 ${y - 82} C 70 ${y - 80} 104 ${y - 46} 96 ${y + 4} Z" fill="#5e5249" stroke="${OL}" stroke-width="${LW}"/>` +
    `<path d="M -60 ${y - 50} Q 0 ${y - 74} 60 ${y - 48} M -76 ${y - 20} Q 0 ${y - 46} 80 ${y - 18}" stroke="#4a4038" stroke-width="4" fill="none"/>` +
    `<path d="M ${dir * 20} ${y + 2} Q ${dir * 90} ${y - 6} ${dir * 128} ${y + 14} Q ${dir * 90} ${y + 26} ${dir * 10} ${y + 18} Z" fill="#4e443c" stroke="${OL}" stroke-width="${LW - 1}"/>` +
    `<circle cx="6" cy="${y - 82}" r="9" fill="#4e443c" stroke="${OL}" stroke-width="4"/></g>`;
}
const _head2 = head2;
head2 = function (P, d, fx, dir, side) {
  let s = _head2(P, d, fx, dir, side);
  if (d.hat === 'flatcap') s += flatcap(side ? dir : (d.face >= 0 ? 1 : -1));
  if (P.cracked) { const sep = side ? 20 : 33, x = fx + sep, y = H2 + 2; s += `<path d="M ${f2(x - 18)} ${y - 16} L ${f2(x - 2)} ${y - 2} L ${f2(x - 10)} ${y + 6} L ${f2(x + 14)} ${y + 18}" stroke="#2e2a36" stroke-width="3" fill="none"/>`; }
  return s;
};
const _torso2 = torso2;
torso2 = function (P, d, k = 1) {
  const r = _torso2(P, d, k);
  if (P.coat) {
    // camisa sem gola + sobretudo aberto (painéis longos) + nota de R$ 10 no bolso do sobretudo
    r.svg += `<path d="M -16 -258 L 0 -214 L 16 -258 Z" fill="#efe9dc" stroke="${OL}" stroke-width="3.5"/><circle cx="0" cy="-232" r="3.5" fill="${OL}"/>`;
    r.svg += `<path d="M -14 -150 Q -34 -128 -48 -146" stroke="#d8b050" stroke-width="3.5" fill="none"/>`;
    for (const sd of [-1, 1]) r.svg += `<path d="M ${sd * 50} -250 Q ${sd * 22} -200 ${sd * 30} -150 L ${sd * 40} -30 L ${sd * 78} -24 Q ${sd * 74} -150 ${sd * 64} -236 Z" fill="${P.top}" stroke="${OL}" stroke-width="${LW - 1}" stroke-linejoin="round"/><path d="M ${sd * 50} -250 L ${sd * 26} -196 L ${sd * 44} -192" fill="${P.topD}" stroke="${OL}" stroke-width="3.5"/>`;
    if (d.pocketNote) r.svg += `<g transform="translate(-54 -112) rotate(-14)"><rect x="-18" y="-12" width="36" height="22" rx="3" fill="#e8907a" stroke="${OL}" stroke-width="3"/><text x="-13" y="2" font-family="Fredoka" font-weight="700" font-size="9" fill="#7a2e22">10</text></g><path d="M -76 -100 L -36 -104" stroke="${OL}" stroke-width="4"/>`;
  }
  if (P.labcoat) {
    r.svg += `<path d="M -46 -250 L -10 -150 L -22 -20 M 46 -250 L 10 -150 L 22 -20" stroke="${OL}" stroke-width="4" fill="none"/>`;
    for (const [x, y, rr] of [[-30, -90, 12], [36, -60, 9], [-14, -190, 7], [40, -150, 10]]) r.svg += `<ellipse cx="${x}" cy="${y}" rx="${rr}" ry="${rr * 0.7}" fill="#b8a678" opacity="0.6"/>`;
    // seringa escondida no bolso (pista)
    if (!d.noSyringe) r.svg += `<g transform="translate(-34 -212) rotate(-12)"><rect x="-4" y="-30" width="8" height="34" rx="2" fill="#dfeaf2" stroke="${OL}" stroke-width="2.5"/><rect x="-7" y="-34" width="14" height="5" fill="#9aa2ae" stroke="${OL}" stroke-width="2"/></g><rect x="-50" y="-200" width="34" height="26" rx="3" fill="${P.top}" stroke="${OL}" stroke-width="3.5"/>`;
  }
  return r;
};

// seringa na mão
const syringe = (rot = 0, k = 1) => `<g transform="rotate(${f2(rot)}) scale(${k})"><rect x="-6" y="-58" width="12" height="62" rx="3" fill="#e2eef6" stroke="${OL}" stroke-width="3.5"/><rect x="-3" y="-40" width="6" height="34" fill="#d06a8a" opacity="0.8"/><rect x="-11" y="-66" width="22" height="8" rx="2" fill="#9aa2ae" stroke="${OL}" stroke-width="3"/><path d="M 0 4 V 30" stroke="#8a8f98" stroke-width="3"/></g>`;

// criatura v2: magra e curvada, costelas, coluna saltada, dedos longos com garras, crânio alongado,
// olhos vermelhos com brilho, boca rasgada com dentes e baba. Luz de recorte fria nas bordas. Sem verde.
function creature(x, y, s, t, o = {}) {
  const br = Math.sin(t * 2.4) * 7, reach = o.reach || 0, calm = o.calm || 0, twitch = calm ? 0 : Math.sin(t * 23) * Math.max(0, Math.sin(t * 1.7)) * 4;
  const C = '#1d1726', C2 = '#2e2440', RIM = '#8a9ad8', BONE = '#d9cfbd', id = 'cr' + Math.round(x) + Math.round(y);
  let g = `<defs><radialGradient id="${id}e"><stop offset="0" stop-color="#ff3a2a" stop-opacity="0.9"/><stop offset="1" stop-color="#ff3a2a" stop-opacity="0"/></radialGradient>
   <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C2}"/><stop offset="0.55" stop-color="${C}"/><stop offset="1" stop-color="#0e0b14"/></linearGradient></defs>`;
  g += `<ellipse cx="0" cy="6" rx="140" ry="18" fill="#000" opacity="0.45"/>`;
  // pernas finas com joelho dobrado para trás
  for (const sd of [-1, 1]) {
    const p = `M ${sd * 40} -300 L ${sd * 74} -150 L ${sd * 40} -70 L ${sd * 66} -4`;
    g += `<path d="${p}" stroke="${OL}" stroke-width="40" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${p}" stroke="${C}" stroke-width="28" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M ${sd * 44} -290 L ${sd * 76} -152" stroke="${RIM}" stroke-width="4" opacity="0.5"/>`;
    for (const f of [-14, 6, 26]) g += `<path d="M ${sd * 66 + f} -4 l ${sd * 10} 10" stroke="${BONE}" stroke-width="6" stroke-linecap="round"/>`;
  }
  // tronco curvado para frente (corcunda), costelas e vértebras
  const hunch = 30 + reach * 20;
  g += `<g transform="translate(0 ${f2(br)}) rotate(${f2(-hunch * 0.25 + twitch * 0.3)} 0 -300)">`;
  g += `<path d="M -70 -300 C -110 -420 -120 -520 -60 -600 C -20 -650 60 -650 96 -590 C 130 -520 110 -410 74 -300 Q 0 -280 -70 -300 Z" fill="url(#${id}b)" stroke="${OL}" stroke-width="${LW}"/>`;
  for (let i = 0; i < 5; i++) { const yy = -560 + i * 46; g += `<path d="M -66 ${yy} Q 0 ${yy + 16 + i * 2} 70 ${yy - 4}" stroke="${C2}" stroke-width="7" fill="none"/><path d="M -60 ${yy + 3} Q 0 ${yy + 18 + i * 2} 64 ${yy}" stroke="${RIM}" stroke-width="2" fill="none" opacity="0.25"/>`; }
  for (let i = 0; i < 6; i++) g += `<circle cx="${f2(92 - i * 3)}" cy="${-600 + i * 50}" r="${9 - i * 0.6}" fill="${C2}" stroke="${OL}" stroke-width="3"/>`;
  g += `<path d="M -100 -420 C -110 -520 -70 -610 -30 -630" stroke="${RIM}" stroke-width="5" fill="none" opacity="0.55"/>`;
  // braços longos e articulados, mãos com 4 dedos e garras
  for (const sd of [-1, 1]) {
    const sw = Math.sin(t * 2.1 + sd) * 16 * (1 - calm);
    const sx = sd * 90, sy = -580, ex = sd * (160 + reach * 150), ey = -410 - reach * 150, hx = sd * (140 + reach * 330) + sw, hy = -170 - reach * 330;
    const p = `M ${sx} ${sy} L ${f2(ex)} ${f2(ey)} L ${f2(hx)} ${f2(hy)}`;
    g += `<path d="${p}" stroke="${OL}" stroke-width="34" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${p}" stroke="${C}" stroke-width="22" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M ${sx} ${sy} L ${f2(ex)} ${f2(ey)}" stroke="${RIM}" stroke-width="3" opacity="0.45"/>`;
    g += `<circle cx="${f2(ex)}" cy="${f2(ey)}" r="15" fill="${C2}" stroke="${OL}" stroke-width="4"/><ellipse cx="${f2(hx)}" cy="${f2(hy)}" rx="22" ry="18" fill="${C}" stroke="${OL}" stroke-width="5"/>`;
    for (const [k, f] of [[0, -24], [1, -8], [2, 8], [3, 24]]) {
      const len = 70 + (k === 1 || k === 2 ? 18 : 0), curl = Math.sin(t * 3 + k) * 6 * (1 - calm);
      const fp = `M ${f2(hx + f * 0.6)} ${f2(hy + 10)} q ${f2(f * 0.4)} ${f2(len * 0.5)} ${f2(f * 0.9 + sd * curl)} ${len}`;
      g += `<path d="${fp}" stroke="${OL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${fp}" stroke="${C}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      g += `<path d="M ${f2(hx + f * 0.6 + f * 0.9 + sd * curl)} ${f2(hy + 10 + len)} l ${f2(sd * 4)} 22" stroke="${BONE}" stroke-width="7" stroke-linecap="round"/>`;
    }
  }
  // cabeça: crânio alongado inclinado para frente
  const hy = -690, hx = 18;
  g += `<g transform="rotate(${f2(Math.sin(t * 1.3) * 6 + twitch)} ${hx} ${hy + 60})">`;
  g += `<path d="M ${hx - 80} ${hy + 30} C ${hx - 96} ${hy - 70} ${hx - 40} ${hy - 140} ${hx + 20} ${hy - 136} C ${hx + 90} ${hy - 130} ${hx + 104} ${hy - 50} ${hx + 84} ${hy + 30} C ${hx + 70} ${hy + 90} ${hx - 66} ${hy + 90} ${hx - 80} ${hy + 30} Z" fill="url(#${id}b)" stroke="${OL}" stroke-width="${LW}"/>`;
  g += `<path d="M ${hx - 84} ${hy - 10} C ${hx - 80} ${hy - 90} ${hx - 30} ${hy - 130} ${hx + 20} ${hy - 132}" stroke="${RIM}" stroke-width="5" fill="none" opacity="0.6"/>`;
  for (let i = 0; i < 5; i++) g += `<path d="M ${hx - 60 + i * 26} ${hy - 120 + Math.abs(i - 2) * 8} q ${-6 + i * 3} -30 ${-14 + i * 6} -46" stroke="#0e0b14" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  const eh = calm ? 4 : 12 + Math.max(0, Math.sin(t * 0.9)) * 4;
  for (const sd of [-1, 1]) {
    const ex = hx + sd * 36, ey = hy - 30;
    g += `<circle cx="${ex}" cy="${ey}" r="46" fill="url(#${id}e)" opacity="${calm ? 0.35 : 0.8}"/>`;
    g += `<path d="M ${ex - 26} ${ey + 2} Q ${ex} ${ey - eh * 2} ${ex + 26} ${ey + 2 - sd * 4} Q ${ex} ${ey + eh} ${ex - 26} ${ey + 2} Z" fill="#ff4030" stroke="${OL}" stroke-width="4"/><ellipse cx="${ex + 2}" cy="${ey}" rx="4" ry="${f2(Math.max(2, eh * 0.7))}" fill="#1a0000"/><circle cx="${ex - 8}" cy="${ey - 4}" r="3" fill="#ffe0d0"/>`;
    g += `<path d="M ${ex - 30} ${ey - 20} L ${ex + 24} ${ey - 10 + sd * 2}" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>`;
  }
  // boca rasgada, dentes irregulares, baba
  const open = calm ? 0.25 : 0.55 + 0.45 * Math.abs(Math.sin(t * 2.6));
  const my = hy + 30, mw = 70, mh = 30 * open;
  g += `<path d="M ${hx - mw} ${my} Q ${hx} ${my + mh * 2.2} ${hx + mw} ${my - 6} Q ${hx} ${my + mh * 0.6} ${hx - mw} ${my} Z" fill="#12020a" stroke="${OL}" stroke-width="5"/>`;
  for (let i = 0; i < 9; i++) { const tx = hx - mw + 12 + i * 14.5, up = i % 2; g += `<path d="M ${f2(tx)} ${f2(my + (up ? 2 : mh * 1.1))} l 6 ${f2(up ? 14 + (i % 3) * 4 : -12 - (i % 3) * 3)} l 6 ${f2(up ? -14 - (i % 3) * 4 : 12 + (i % 3) * 3)} Z" fill="${BONE}" stroke="${OL}" stroke-width="2"/>`; }
  if (!calm) { const dl = 20 + ((t * 40) % 50); g += `<path d="M ${hx + 30} ${my + mh} q 3 ${f2(dl * 0.5)} -2 ${f2(dl)}" stroke="#c8d0e8" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/><circle cx="${hx + 28}" cy="${f2(my + mh + dl)}" r="5" fill="#c8d0e8" opacity="0.7"/>`; }
  g += `</g></g>`;
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(s * (o.flip ? -1 : 1))} ${f2(s * (1 - (o.squash || 0)))})"${o.fade != null ? ` opacity="${f2(o.fade)}"` : ''}>${g}</g>`;
}
// silhueta da criatura com olhos acesos (para aparições no escuro)
const creatureShadow = (x, y, s, t, op = 0.85) => `<g opacity="${op}" style="filter:brightness(0)">${creature(x, y, s, t)}</g>` + `<g transform="translate(${f2(x)} ${f2(y)}) scale(${s})"><circle cx="-18" cy="-720" r="10" fill="#ff4030"/><circle cx="54" cy="-720" r="10" fill="#ff4030"/><circle cx="-18" cy="-720" r="30" fill="#ff4030" opacity="0.25"/><circle cx="54" cy="-720" r="30" fill="#ff4030" opacity="0.25"/></g>`;
// garras pela fresta da porta
const clawsGap = (x, y, k, t) => { let s = ''; for (let i = 0; i < 4; i++) s += `<path d="M ${x} ${y + i * 26 * k} q ${-30 * k} ${8 * k} ${-74 * k} ${(14 + Math.sin(t * 9 + i) * 6) * k}" stroke="${OL}" stroke-width="${16 * k}" fill="none" stroke-linecap="round"/><path d="M ${x} ${y + i * 26 * k} q ${-30 * k} ${8 * k} ${-74 * k} ${(14 + Math.sin(t * 9 + i) * 6) * k}" stroke="#efe6d2" stroke-width="${8 * k}" fill="none" stroke-linecap="round"/>`; return s; };

// ---------- cenários (mundo: chão em y = 900) ----------
const GROUND = 900;
// lanterna: escurece tudo fora de um círculo (camada da frente, coordenadas do mundo)
function torch(cx, cy, r, dark = 0.86, id = 'tq') {
  return `<defs><radialGradient id="${id}" cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(r)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0b0a14" stop-opacity="0"/><stop offset="0.55" stop-color="#0b0a14" stop-opacity="${f2(dark * 0.25)}"/><stop offset="1" stop-color="#0b0a14" stop-opacity="${f2(dark)}"/></radialGradient></defs><rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#${id})"/>`;
}
function elevatorBack(t, o = {}) {
  const dent = o.dent || 0, flick = (Math.floor(t * 14) % 9 === 0) ? 0.45 : 1;
  let s = `<rect x="-600" y="-400" width="2600" height="1800" fill="#1a1826"/>`;
  s += `<rect x="120" y="330" width="1110" height="580" fill="#6a7898" stroke="${OL}" stroke-width="6"/>`;
  for (let i = 0; i < 4; i++) { const x = 150 + i * 270; s += `<rect x="${x}" y="360" width="240" height="520" rx="10" fill="#7d8aa8" stroke="${OL}" stroke-width="4"/><path d="M ${x + 22} 380 V 860" stroke="#a4b0c8" stroke-width="5" opacity="0.6"/><rect x="${x}" y="360" width="240" height="520" rx="10" fill="url(#pPlaster)"/>`; }
  s += `<rect x="120" y="640" width="1110" height="18" fill="#a88a5a" stroke="${OL}" stroke-width="4"/>`; // corrimão
  // teto (afunda)
  s += `<path d="M 120 250 L 1230 250 L 1230 330 L ${860} ${330 + dent} L ${500} ${330 + dent} L 120 330 Z" fill="#4a5068" stroke="${OL}" stroke-width="5"/>`;
  if (o.hatch) s += `<path d="M 520 ${300 + dent} L 840 ${300 + dent} L 820 ${336 + dent} L 540 ${336 + dent} Z" fill="#06050a" stroke="${OL}" stroke-width="6"/>`;
  else s += `<rect x="540" y="${296 + dent * 0.8}" width="280" height="34" fill="#5a6078" stroke="${OL}" stroke-width="5"/>`;
  s += `<rect x="360" y="262" width="640" height="26" rx="12" fill="${mix('#4a4a52', '#fff4d0', flick)}" stroke="${OL}" stroke-width="4"/>`;
  s += `<path d="M 120 910 L 1230 910 L 1500 1300 L -150 1300 Z" fill="#3a3844" stroke="${OL}" stroke-width="5"/>`;
  for (let i = 0; i < 7; i++) s += `<path d="M ${180 + i * 170} 910 L ${120 + i * 210 - 120} 1300" stroke="#2c2a36" stroke-width="4"/>`;
  return s;
}
function buttonPanel(x, y, k, lit = 0) {
  let s = `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-70" y="-190" width="140" height="380" rx="16" fill="#a8acb8" stroke="${OL}" stroke-width="6"/>`;
  ['3', '2', '1', 'T', 'S'].forEach((l, i) => { const on = l === 'S' && lit; s += `<circle cx="0" cy="${-140 + i * 66}" r="24" fill="${on ? '#ffc928' : '#e4e4ea'}" stroke="${OL}" stroke-width="5"/>${on ? `<circle cx="0" cy="${-140 + i * 66}" r="40" fill="#ffc928" opacity="0.3"/>` : ''}<text x="0" y="${-130 + i * 66}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="${OL}">${l}</text>`; });
  s += `<rect x="-40" y="150" width="80" height="30" rx="6" fill="#d8443c" stroke="${OL}" stroke-width="4"/></g>`;
  return s;
}
function elevatorDoors(gap, t) {
  const L = 675 - gap / 2, R = 675 + gap / 2;
  let s = `<rect x="80" y="320" width="${L - 80}" height="600" fill="#9aa2b4" stroke="${OL}" stroke-width="6"/><rect x="${R}" y="320" width="${1270 - R}" height="600" fill="#9aa2b4" stroke="${OL}" stroke-width="6"/>`;
  s += `<rect x="80" y="320" width="${L - 80}" height="600" fill="url(#pPlaster)"/><path d="M ${L - 30} 340 V 900" stroke="#c4cad8" stroke-width="6" opacity="0.6"/>`;
  return s;
}
function shaftBg(t, speed = 0) {
  let s = `<rect x="-800" y="-600" width="3000" height="2400" fill="#141320"/>`;
  for (let i = 0; i < 18; i++) { const y = ((i * 150 + t * speed) % 2700) - 600; s += `<rect x="-800" y="${f2(y)}" width="3000" height="14" fill="#211f30"/>`; }
  for (const x of [470, 880]) s += `<rect x="${x}" y="-600" width="10" height="2400" fill="#5a5a6a"/>`;
  for (let i = 0; i < 10; i++) { const y = ((i * 260 + t * speed * 1.3) % 2600) - 600; s += `<rect x="150" y="${f2(y)}" width="30" height="60" fill="#2e2c3e" stroke="${OL}" stroke-width="3"/><rect x="1170" y="${f2(y + 100)}" width="30" height="60" fill="#2e2c3e" stroke="${OL}" stroke-width="3"/>`; }
  return s;
}
const cabinTop = (x, y, w, dent = 0, hatch = 0) => `<path d="M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + w / 2} ${y + 700} L ${x - w / 2} ${y + 700} Z" fill="#7a7e8e" stroke="${OL}" stroke-width="7"/><path d="M ${x - w / 2} ${y} L ${x + w / 2} ${y} L ${x + w / 2 - 40} ${y - 50} L ${x - w / 2 + 40} ${y - 50} Z" fill="#9a9eae" stroke="${OL}" stroke-width="6"/>` +
  (hatch ? `<path d="M ${x - 90} ${y - 12} L ${x + 90} ${y - 12} L ${x + 76} ${y - 40} L ${x - 76} ${y - 40} Z" fill="#06050a" stroke="${OL}" stroke-width="4"/>` : `<path d="M ${x - 90} ${y - 12} L ${x + 90} ${y - 12} L ${x + 76} ${y - 40} L ${x - 76} ${y - 40} Z" fill="#6a6e7e" stroke="${OL}" stroke-width="4"/>`) +
  `<path d="M ${x} ${y - 50} V ${y - 1200}" stroke="#4a4a56" stroke-width="12"/>`;

// necrotério: corredor lateral com gavetas, macas e estantes
function morgue(t, o = {}) {
  const scroll = o.scroll || 0;
  let s = `<rect x="-1200" y="-400" width="4200" height="2200" fill="#202834"/>`;
  s += `<rect x="-1200" y="260" width="4200" height="640" fill="#46566a"/><rect x="-1200" y="260" width="4200" height="640" fill="url(#pPlaster)"/>`;
  s += `<rect x="-1200" y="700" width="4200" height="200" fill="#3a4858"/>`;
  for (let i = -4; i < 16; i++) {
    const x = ((i * 300 - scroll) % 4500 + 4500) % 4500 - 1200;
    s += `<g transform="translate(${f2(x)} 0)"><rect x="0" y="360" width="250" height="300" fill="#a8b0bc" stroke="${OL}" stroke-width="5"/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) s += `<rect x="${14 + c * 118}" y="${376 + r * 142}" width="104" height="128" rx="6" fill="#c4cad4" stroke="${OL}" stroke-width="3.5"/><rect x="${50 + c * 118}" y="${430 + r * 142}" width="32" height="10" rx="4" fill="#6a707c" stroke="${OL}" stroke-width="2.5"/>`;
    s += `</g>`;
    if (i % 3 === 0) s += `<rect x="${f2(x + 260)}" y="290" width="30" height="8" fill="#e8f0f4"/><ellipse cx="${f2(x + 275)}" cy="330" rx="80" ry="40" fill="#e8f0f4" opacity="0.08"/>`;
  }
  s += `<rect x="-1200" y="900" width="4200" height="500" fill="#2e3440" stroke="${OL}" stroke-width="5"/>`;
  for (let i = -6; i < 30; i++) s += `<path d="M ${f2(((i * 160 - scroll) % 4800 + 4800) % 4800 - 1200)} 900 l -60 500" stroke="#262b36" stroke-width="4"/>`;
  return s;
}
const shelf = (x, ang, k = 1) => `<g transform="translate(${f2(x)} ${f2(GROUND - 14 * clamp(ang / 90))}) rotate(${f2(ang)} ${ang < 0 ? -10 : 164} 0) scale(${k})"><rect x="-10" y="-380" width="14" height="380" fill="#8a909c" stroke="${OL}" stroke-width="4"/><rect x="150" y="-380" width="14" height="380" fill="#8a909c" stroke="${OL}" stroke-width="4"/>${[0, 1, 2, 3].map(i => `<rect x="-14" y="${-370 + i * 110}" width="182" height="14" fill="#a4aab6" stroke="${OL}" stroke-width="4"/><rect x="${10 + i * 20}" y="${-412 + i * 110}" width="40" height="42" rx="4" fill="${['#c8b48e', '#d8d0c0', '#b0a0c8', '#e0a080'][i]}" stroke="${OL}" stroke-width="3"/>`).join('')}</g>`;
function exitSign(x, y, k, glow) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-150" y="-120" width="300" height="240" fill="#ff5a4a" opacity="${f2(0.12 * glow)}"/><rect x="-110" y="-44" width="220" height="88" rx="10" fill="${mix('#7a1c22', '#ff4a3a', glow)}" stroke="${OL}" stroke-width="6"/><text x="0" y="16" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="52" fill="#fff4e8">SAÍDA</text></g>`;
}
// porta de ferro para a chuva
function exitDoor(t, open, o = {}) {
  let s = `<rect x="-1200" y="-400" width="4200" height="2200" fill="#1c2230"/><rect x="-1200" y="260" width="4200" height="640" fill="#3a4658"/><rect x="-1200" y="260" width="4200" height="640" fill="url(#pPlaster)"/>`;
  s += `<rect x="360" y="300" width="630" height="610" fill="#141824" stroke="${OL}" stroke-width="8"/>`;
  const w = 560 * open;
  s += `<rect x="395" y="330" width="${f2(w)}" height="580" fill="#33476a"/>`;
  if (w > 8) { const r = rng(Math.floor(t * 20)); for (let i = 0; i < 40; i++) { const x = 395 + r() * w, y = 330 + ((r() * 580 + t * 900) % 580); s += `<path d="M ${f2(x)} ${f2(y)} l -6 30" stroke="#a8c4e8" stroke-width="3" opacity="0.8"/>`; } s += `<rect x="395" y="330" width="${f2(w)}" height="580" fill="#ffffff" opacity="${f2((o.flash || 0) * 0.5)}"/>`; }
  s += `<rect x="${f2(395 + w)}" y="330" width="${f2(560 - w + 1)}" height="580" fill="#6e7482" stroke="${OL}" stroke-width="6"/>`;
  if (560 - w > 60) s += `<rect x="${f2(395 + w + 20)}" y="600" width="44" height="16" rx="6" fill="#c8a050" stroke="${OL}" stroke-width="3"/><circle cx="${f2(395 + w + 80)}" cy="640" r="${o.keyhole ? 16 : 9}" fill="#1a1a22" stroke="${OL}" stroke-width="3"/>`;
  s += exitSign(675, 250, 0.8, 0.6 + 0.4 * Math.sin(t * 5));
  s += `<rect x="-1200" y="910" width="4200" height="500" fill="#2a303c" stroke="${OL}" stroke-width="5"/>`;
  return s;
}
function hospitalFacade(t) {
  let s = `<rect x="-1200" y="-600" width="4200" height="2600" fill="#141a34"/>`;
  s += `<circle cx="1050" cy="120" r="70" fill="#f0ecd8"/><circle cx="1050" cy="120" r="120" fill="#f0ecd8" opacity="0.1"/>`;
  s += `<rect x="140" y="220" width="1070" height="690" fill="#7a7e98" stroke="${OL}" stroke-width="7"/><rect x="140" y="220" width="1070" height="690" fill="url(#pBrick)"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const lit = (r * 5 + c) % 4 === 1 && Math.floor(t * 2 + c) % 5; s += `<rect x="${190 + c * 205}" y="${300 + r * 170}" width="120" height="110" fill="${lit ? '#ffd27a' : '#252a44'}" stroke="${OL}" stroke-width="5"/><path d="M ${250 + c * 205} 300 v 110" stroke="${OL}" stroke-width="3"/>`; }
  s += `<rect x="300" y="160" width="750" height="80" rx="10" fill="#e8e4d8" stroke="${OL}" stroke-width="6"/><text x="675" y="214" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="46" fill="#9a1c2c">HOSPITAL SANTA CLARA</text>`;
  s += `<rect x="580" y="760" width="190" height="150" fill="#2a2028" stroke="${OL}" stroke-width="6"/>`;
  for (const x of [40, 1310]) { s += `<path d="M ${x} 910 V 640" stroke="${OL}" stroke-width="30"/><path d="M ${x} 910 V 640" stroke="#6a4a3a" stroke-width="20"/>`; for (let j = 0; j < 6; j++) s += `<circle cx="${x + Math.cos(j) * 70}" cy="${600 + Math.sin(j * 2) * 50}" r="62" fill="#d888b8" stroke="${OL}" stroke-width="4"/>`; }
  s += `<rect x="-1200" y="910" width="4200" height="600" fill="#262836" stroke="${OL}" stroke-width="5"/>`;
  const r = rng(Math.floor(t * 20)); for (let i = 0; i < 60; i++) { const x = r() * 1500 - 80, y = ((r() * 1200 + t * 800) % 1300) - 200; s += `<path d="M ${f2(x)} ${f2(y)} l -6 28" stroke="#9ab4dc" stroke-width="3" opacity="0.6"/>`; }
  return s;
}
const darkBg = (c = '#0c0b14') => `<rect x="-2000" y="-2000" width="5000" height="5000" fill="${c}"/>`;
const shakeCam = (c, T, amp) => ({ ...c, x: c.x + Math.sin(T * 61) * amp, y: c.y + Math.cos(T * 47) * amp, r: (c.r || 0) + Math.sin(T * 37) * amp * 0.05 });
// banner do gancho / loop (tela)
const hookBanner = (T, t0) => { const p = E.back(clamp((T - t0) / 0.25)); return `<g transform="translate(540 300) scale(${f2(p)})"><rect x="-470" y="-74" width="940" height="148" rx="30" fill="#b01c2c" stroke="#211c26" stroke-width="10"/><text x="0" y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="64" fill="#fff" stroke="#211c26" stroke-width="10" paint-order="stroke">O MÉDICO ERA O MONSTRO?</text></g>`; };
// boina também nas vistas de costas
const _pb2 = personBack2;
personBack2 = function (P, d, s) { const r = _pb2(P, d, s); return d.hat === 'flatcap' ? r.replace(/<\/g>$/, flatcap(1) + '</g>') : r; };

// câmera de terror: ângulo holandês (inclinação) e respiração lenta
const dutch = (c, deg, T) => ({ ...c, r: deg + Math.sin(T * 0.9) * 0.8 });
// luz de baixo para cima (rosto iluminado por baixo)
const underLight = (x, y, r, id) => `<defs><radialGradient id="${id}" cx="${x}" cy="${y}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb070" stop-opacity="0.35"/><stop offset="1" stop-color="#ffb070" stop-opacity="0"/></radialGradient></defs><rect x="-2000" y="-2000" width="5000" height="5000" fill="url(#${id})"/>`;
// olhos vermelhos no escuro
const eyesInDark = (x, y, k, t, op = 1) => { const bl = (t % 3.1) < 0.12 ? 0.15 : 1; return `<g transform="translate(${x} ${y}) scale(${k})" opacity="${f2(op)}">${[-1, 1].map(sd => `<circle cx="${sd * 34}" cy="0" r="40" fill="#ff3020" opacity="0.18"/><ellipse cx="${sd * 34}" cy="0" rx="16" ry="${f2(9 * bl)}" fill="#ff4030"/>`).join('')}</g>`; };
// pilar escuro desfocado em primeiro plano
const fgPillar = (x) => `<rect x="${f2(x)}" y="-400" width="150" height="2000" fill="#07060c" filter="url(#fgBlur)" opacity="0.92"/>`;
