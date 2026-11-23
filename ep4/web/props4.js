// Objetos de cena do ep. 4. Tudo desenhado por código, sem verde.
const FNT = 'font-family="Fredoka" font-weight="700"';
// balão de fala: (x,y) = ponta do rabinho; w x h do balão acima
function speech(x, y, text, o = {}) {
  const w = o.w || 300, h = o.h || 90, k = o.k || 1, ap = o.ap == null ? 1 : o.ap, dir = o.dir || 1;
  if (ap <= 0) return '';
  const pop = E.back(clamp(ap));
  return `<g transform="translate(${f2(x)} ${f2(y)}) scale(${f2(k * pop)})" opacity="${f2(clamp(ap * 3))}">
   <path d="M ${-w / 2} ${-h - 34} h ${w} a 26 26 0 0 1 26 26 v ${h - 52} a 26 26 0 0 1 -26 26 h ${-(w / 2 - 30 * dir) + (dir > 0 ? 0 : 0)} l ${-26 * dir} 34 l ${2 * dir} -34 h ${-(w / 2 + 30 * dir)} a 26 26 0 0 1 -26 -26 v ${-(h - 52)} a 26 26 0 0 1 26 -26 Z" fill="${o.fill || '#fffdf6'}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
   <text x="0" y="${-h / 2 - 14 + (o.fs || 36) * 0.35}" text-anchor="middle" ${FNT} font-size="${o.fs || 36}" fill="${o.col || '#2a2233'}">${esc(text)}</text></g>`;
}
// folha desfocada em primeiro plano (profundidade)
const fgLeaves = (t, side = 1, c = '#d8923a') => `<g filter="url(#fgBlur)" transform="translate(${side > 0 ? 1500 : 160} 140)">` + [0, 1, 2, 3].map(i => `<g transform="rotate(${f2(Math.sin(t * 1.4 + i) * 6 + i * 38 - 40)} 0 0) translate(${i * 70 * side} ${i * 40})"><path d="M 0 0 Q 90 -60 220 0 Q 90 60 0 0 Z" fill="${i % 2 ? c : '#e8b04a'}" stroke="#7a4a1e" stroke-width="5"/><path d="M 0 0 L 200 0" stroke="#7a4a1e" stroke-width="4"/></g>`).join('') + `</g>`;
// poste desfocado
const fgPole = (x = 140) => `<g filter="url(#fgBlur)"><path d="M ${x} 1700 V -400" stroke="#2a2630" stroke-width="80"/><rect x="${x - 70}" y="420" width="140" height="80" rx="14" fill="#3a3440"/></g>`;
// chuva: linhas inclinadas animadas (tela do mundo, camada Lr 1.3)
function rain(t, op = 0.5, n = 150, w = 3400, h = 2200) {
  const r = rng(77); let s = `<g opacity="${op}" stroke="#cfe0ff" stroke-width="2.4" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) { const x0 = r() * w - 400, sp = 900 + r() * 500, ph = r(), y = ((ph + t * sp / h) % 1) * h - 200, len = 40 + r() * 50; s += `<path d="M ${f2(x0 + y * 0.18)} ${f2(y)} l ${f2(-len * 0.18)} ${f2(len)}"/>`; }
  return s + '</g>';
}
// poça refletindo a luz do poste
const puddle = (x, y, rx, t = 0, c = '#ffd890') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${f2(rx * 0.16)}" fill="#1c2244" stroke="${INK}" stroke-width="2" opacity="0.8"/><ellipse cx="${x}" cy="${y}" rx="${f2(rx * 0.55)}" ry="${f2(rx * 0.07)}" fill="${c}" opacity="0.55"/>` + [0, 1].map(i => { const p = ((t * 0.9 + i * 0.5) % 1); return `<ellipse cx="${f2(x + (i ? 30 : -34) * rx / 90)}" cy="${y}" rx="${f2(4 + p * 22)}" ry="${f2(1 + p * 4)}" fill="none" stroke="#e8f0ff" stroke-width="1.6" opacity="${f2(0.6 * (1 - p))}"/>`; }).join('');
// fachada da oficina (dia/noite). open 0..1 = porta de pedestre entreaberta
function workshopFacade(x, base, o = {}) {
  const w = 700, h = 420, night = o.night || 0, t = o.t || 0;
  let s = `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="#c9b8a0" stroke="${INK}" stroke-width="4"/><rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#pBrick)"/>`;
  s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#gWallShade)"/>`;
  s += `<rect x="${x - 16}" y="${base - h - 26}" width="${w + 32}" height="30" fill="#6a5a4a" stroke="${INK}" stroke-width="4"/>`;
  // letreiro
  const sy = base - h + 26;
  s += `<rect x="${x + 60}" y="${sy}" width="${w - 120}" height="96" rx="12" fill="#c8443c" stroke="${INK}" stroke-width="5"/><rect x="${x + 72}" y="${sy + 10}" width="${w - 144}" height="76" rx="8" fill="none" stroke="#fff3d6" stroke-width="3"/>`;
  s += `<text x="${x + w / 2}" y="${sy + 63}" text-anchor="middle" ${FNT} font-size="${o.sign2 ? 44 : 46}" fill="#fff3d6" letter-spacing="3">OFICINA DO ANTÔNIO</text>`;
  // portão de enrolar (aberto na parte de cima quando busy) e janela
  const gx = x + 50, gy = base - 250, gw = 360, gh = 250, up = o.gateUp == null ? 0.0 : o.gateUp;
  s += `<rect x="${gx - 10}" y="${gy - 10}" width="${gw + 20}" height="${gh + 10}" fill="#4a4458" stroke="${INK}" stroke-width="4"/>`;
  s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="${o.inside || '#3a2a20'}"/>`;
  if (o.inLight) s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="#ffd27a" opacity="${f2(o.inLight)}"/>`;
  const gh2 = gh * (1 - up);
  for (let i = 0; i < Math.ceil(gh2 / 26); i++) s += `<rect x="${gx}" y="${gy + i * 26}" width="${gw}" height="${Math.min(26, gh2 - i * 26)}" fill="${i % 2 ? '#8a8a9a' : '#9c9cac'}" stroke="${INK}" stroke-width="2.5"/>`;
  // porta de pedestre
  s += door(x + 470, base, 110, 220, { color: '#4a6a9a', glass: true, open: o.open || 0, inside: '#ffcf70', sign: null });
  // janela
  s += windowBox(x + 600, base - 340, 70, 90, { glass: night ? '#ffd27a' : '#8aaac0', lit: night });
  // pneus + placa
  for (let i = 0; i < 3; i++) s += `<g transform="translate(${x + 24 + (i % 2) * 6} ${base - 20 - i * 34})"><ellipse rx="52" ry="16" fill="#1e1c26" stroke="${INK}" stroke-width="3"/><ellipse rx="26" ry="7" fill="#5a586a"/></g>`;
  return s;
}
// interior da oficina (mundo 3600x1900 como bakeryInterior)
function workshopInterior(t, o = {}) {
  const night = o.night || 0, bulb = o.bulb == null ? 1 : o.bulb;
  let s = `<rect x="-800" y="-400" width="3600" height="1900" fill="${night ? '#3a3248' : '#c9b8a0'}"/><rect x="-800" y="-400" width="3600" height="1900" fill="url(#pBrick)"/>`;
  s += `<rect x="-800" y="-400" width="3600" height="1900" fill="url(#gWallShade)"/>`;
  // quadro de ferramentas
  s += `<rect x="150" y="150" width="520" height="340" fill="#7a5a3a" stroke="${INK}" stroke-width="5"/><rect x="150" y="150" width="520" height="340" fill="url(#pWood)"/>`;
  const tools = [['#c8c8d4', 0], ['#e8b03a', 1], ['#c8443c', 2], ['#8a8aa0', 3], ['#e8b03a', 4], ['#c8c8d4', 5]];
  tools.forEach(([c, i]) => { const x = 190 + i * 78; s += `<path d="M ${x} 190 v 150" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M ${x} 190 v 150" stroke="${c}" stroke-width="9" stroke-linecap="round"/><circle cx="${x}" cy="${i % 2 ? 360 : 200}" r="${i % 2 ? 22 : 16}" fill="${c}" stroke="${INK}" stroke-width="4"/>`; });
  // calendário/pôster
  s += `<rect x="900" y="170" width="190" height="250" fill="#fff4dc" stroke="${INK}" stroke-width="4"/><rect x="900" y="170" width="190" height="56" fill="#c8443c" stroke="${INK}" stroke-width="4"/><text x="995" y="212" text-anchor="middle" ${FNT} font-size="34" fill="#fff">OFICINA</text>`;
  s += `<path d="M 920 280 h 150 M 920 320 h 150 M 920 360 h 110" stroke="#b6a58a" stroke-width="6"/>`;
  // piso de concreto + mancha de óleo
  s += `<rect x="-800" y="900" width="3600" height="600" fill="${night ? '#4a4658' : '#9a96a0'}"/><rect x="-800" y="900" width="3600" height="600" fill="url(#pAsphalt)"/><rect x="-800" y="900" width="3600" height="30" fill="#1b1424" opacity="0.3"/>`;
  s += `<ellipse cx="1180" cy="1040" rx="170" ry="26" fill="#1b1424" opacity="0.28"/>`;
  // pneus empilhados e latas
  for (let i = 0; i < 4; i++) s += `<g transform="translate(1620 ${880 - i * 40})"><ellipse rx="70" ry="22" fill="#1e1c26" stroke="${INK}" stroke-width="4"/><ellipse rx="34" ry="9" fill="#5a586a"/></g>`;
  // lâmpada pendurada, luz forte sozinha (cena noturna) — balança de leve
  if (o.bulb !== 0) { const sw = Math.sin(t * 1.6) * 5; s += `<g transform="translate(560 -400) rotate(${f2(sw)} 0 0)"><path d="M 0 0 V 480" stroke="${INK}" stroke-width="4"/><path d="M -46 530 L 46 530 L 28 480 L -28 480 Z" fill="#5a586a" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="546" r="20" fill="#fff2b8" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="560" r="${f2(300 * bulb)}" fill="#ffd27a" opacity="${night ? 0.14 : 0.05}"/></g>`; }
  return s;
}
// bancada de trabalho
function bench4(x, y, w = 520) {
  return `<rect x="${x}" y="${y}" width="${w}" height="280" fill="#7a4a30" stroke="${INK}" stroke-width="5"/><rect x="${x}" y="${y}" width="${w}" height="280" fill="url(#pWoodV)"/><rect x="${x - 20}" y="${y - 24}" width="${w + 40}" height="30" rx="6" fill="#a8703e" stroke="${INK}" stroke-width="5"/><rect x="${x + 30}" y="${y + 40}" width="${w - 60}" height="190" rx="8" fill="none" stroke="${INK}" stroke-width="3" opacity="0.4"/>`;
}
// prato simples: arroz + ovo (sem verde)
const plate = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="8" rx="110" ry="24" fill="#1b1424" opacity="0.2"/><ellipse cx="0" cy="0" rx="104" ry="30" fill="#f6f2ea" stroke="${INK}" stroke-width="5"/><ellipse cx="0" cy="-2" rx="76" ry="20" fill="#ece6da" stroke="${INK}" stroke-width="2.5"/><path d="M -50 -6 q 24 -34 54 -14 q 28 -6 36 12 q -34 12 -90 2 Z" fill="#fffdf6" stroke="${INK}" stroke-width="3"/><ellipse cx="-8" cy="-16" rx="16" ry="9" fill="#f2b230" stroke="${INK}" stroke-width="2.5"/><path d="M 26 -12 q 20 -8 36 0" stroke="#8a4a2a" stroke-width="7" stroke-linecap="round"/></g>`;
// celular visto de frente: tela com a filha de capelo (graduação)
function phoneScreen(x, y, k = 1, t = 0, o = {}) {
  const w = 230, h = 440;
  const girl = person('filha', { x: 0, y: 150, s: 0.74, t, face: 0, expr: o.expr || 'happy', mouth: o.mouth == null ? 0.3 : o.mouth, shadow: false, armR: 130, bendR: 60, handR: 'open' });
  return `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${o.rot || 0}) scale(${k})">
   <rect x="${-w / 2 - 14}" y="${-h / 2 - 16}" width="${w + 28}" height="${h + 32}" rx="34" fill="#1e1c26" stroke="${INK}" stroke-width="6"/>
   <clipPath id="phclip"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22"/></clipPath>
   <g clip-path="url(#phclip)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#ffe0b8"/><rect x="${-w / 2}" y="40" width="${w}" height="220" fill="#d8a878"/>
   <path d="M ${-w / 2} -60 h ${w}" stroke="#fff" stroke-width="4" opacity="0.5"/>
   <g transform="translate(0 -52) scale(1.0)">${girl}${gradCap(0, -132)}</g></g>
   <rect x="-34" y="${-h / 2 - 6}" width="68" height="10" rx="5" fill="#0e0c12"/>
   <text x="0" y="${h / 2 - 20}" text-anchor="middle" ${FNT} font-size="22" fill="#fff" stroke="${INK}" stroke-width="5" paint-order="stroke">Filha ♥ ao vivo</text></g>`;
}
function gradCap(x, y) { return `<g transform="translate(${x} ${y})"><path d="M -62 0 L 0 -22 L 62 0 L 0 22 Z" fill="#2a2a3a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M -34 14 v 24 q 34 14 68 0 v -24" fill="#2a2a3a" stroke="${INK}" stroke-width="4"/><path d="M 0 0 L 52 6 v 40" stroke="#f2c230" stroke-width="4" fill="none"/><circle cx="52" cy="48" r="7" fill="#f2c230" stroke="${INK}" stroke-width="2.5"/></g>`; }
// celular pequeno na mão (de lado)
const phoneHand = () => `<g transform="rotate(-8)"><rect x="-14" y="-52" width="28" height="56" rx="7" fill="#1e1c26" stroke="${INK}" stroke-width="3.5"/><rect x="-10" y="-46" width="20" height="40" rx="3" fill="#ffe0b8"/></g>`;
const broom = () => `<g><path d="M 0 -150 L 4 40" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M 0 -150 L 4 40" stroke="#a46a3a" stroke-width="7" stroke-linecap="round"/><path d="M -30 40 L 38 40 L 54 100 L -46 100 Z" fill="#e8c46a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M -20 50 L -28 98 M 0 50 V 100 M 20 50 L 30 98" stroke="#a8803a" stroke-width="3"/></g>`;
const rag = () => `<g transform="rotate(14)"><path d="M -26 -14 q 26 -18 52 0 q 8 24 -6 36 q -22 8 -42 0 q -14 -12 -4 -36 Z" fill="#e86a4a" stroke="${INK}" stroke-width="4"/></g>`;
const wrench = () => `<g transform="rotate(20)"><path d="M 0 -4 L 0 -90" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M 0 -4 L 0 -90" stroke="#c8c8d4" stroke-width="9" stroke-linecap="round"/><circle cx="0" cy="-98" r="18" fill="#c8c8d4" stroke="${INK}" stroke-width="4"/><path d="M -8 -118 l 8 12 l 8 -12" stroke="${INK}" stroke-width="4" fill="#3a2a20"/></g>`;
const mic = (x, y) => `<g transform="translate(${x} ${y})"><path d="M 0 0 V 150" stroke="${INK}" stroke-width="12"/><path d="M 0 0 V 150" stroke="#8a8a9a" stroke-width="6"/><ellipse cx="0" cy="-8" rx="22" ry="28" fill="#3a3a4a" stroke="${INK}" stroke-width="5"/><path d="M -16 -8 h 32 M -14 -20 h 28 M -14 4 h 28" stroke="#9a9aaa" stroke-width="3"/></g>`;
const bagBread = () => `<g transform="rotate(-8)"><path d="M -30 -44 L 30 -44 L 36 28 L -36 28 Z" fill="#f0d8a8" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M -30 -44 l 8 -10 l 14 10 l 14 -10 l 14 10 l 8 -10" fill="#f0d8a8" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><g transform="translate(0 -52) scale(0.5)">${bread({ s: 1 })}</g></g>`;
// palanque da praça
function palanque(x, base, t) {
  return `<g><rect x="${x - 360}" y="${base - 170}" width="720" height="170" fill="#a46a3a" stroke="${INK}" stroke-width="5"/><rect x="${x - 360}" y="${base - 170}" width="720" height="170" fill="url(#pWoodV)"/>
  <rect x="${x - 380}" y="${base - 190}" width="760" height="28" rx="6" fill="#c9935a" stroke="${INK}" stroke-width="5"/>
  <path d="M ${x - 360} ${base - 170} h 720" stroke="${INK}" stroke-width="3"/>
  <rect x="${x - 300}" y="${base - 740}" width="600" height="110" rx="10" fill="#3a4a7a" stroke="${INK}" stroke-width="5"/><text x="${x}" y="${base - 664}" text-anchor="middle" ${FNT} font-size="54" fill="#f2c230" letter-spacing="4">PREFEITURA</text>
  <path d="M ${x - 330} ${base - 190} V ${base - 630} M ${x + 330} ${base - 190} V ${base - 630}" stroke="${INK}" stroke-width="10"/>
  <path d="M ${x - 330} ${base - 630} Q ${x} ${base - 590 + Math.sin(t * 2) * 8} ${x + 330} ${base - 630}" stroke="${INK}" stroke-width="4" fill="none"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M ${x - 330 + i * 94} ${base - 626 + Math.sin(i) * 4} l 30 0 l -15 34 Z" fill="${['#c8443c', '#f2c230', '#4f72b8'][i % 3]}" stroke="${INK}" stroke-width="2.5"/>`).join('')}</g>`;
}
// escola
function schoolFacade(x, base, t) {
  const w = 760, h = 420;
  let s = `<rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="#f0d27a" stroke="${INK}" stroke-width="4"/><rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#pPlaster)"/><rect x="${x}" y="${base - h}" width="${w}" height="${h + 40}" fill="url(#gWallShade)"/>`;
  s += `<path d="M ${x - 30} ${base - h + 6} L ${x + w / 2} ${base - h - 130} L ${x + w + 30} ${base - h + 6} Z" fill="#c8643c" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<rect x="${x + 190}" y="${base - h + 24}" width="380" height="74" rx="10" fill="#3a4a7a" stroke="${INK}" stroke-width="5"/><text x="${x + w / 2}" y="${base - h + 76}" text-anchor="middle" ${FNT} font-size="46" fill="#fff4d0" letter-spacing="6">ESCOLA</text>`;
  for (const wx of [60, 190, 470, 600]) s += windowBox(x + wx, base - h + 140, 90, 110, { glass: '#8aaac0' });
  s += door(x + w / 2 - 70, base, 140, 200, { color: '#4a6a9a', glass: true, open: 1, inside: '#6a4a30' });
  s += `<path d="M ${x + w / 2 - 20} ${base - 330} v 40" stroke="${INK}" stroke-width="4"/><circle cx="${x + w / 2}" cy="${base - 280}" r="36" fill="#fff4d0" stroke="${INK}" stroke-width="5"/><path d="M ${x + w / 2} ${base - 280} V ${base - 304} M ${x + w / 2} ${base - 280} L ${x + w / 2 + 16} ${base - 270}" stroke="${INK}" stroke-width="4"/>`;
  return s;
}
// salão de beleza (interior simples)
function salonInterior(t) {
  let s = `<rect x="-800" y="-400" width="3600" height="1900" fill="#f2c4cc"/><rect x="-800" y="-400" width="3600" height="1900" fill="url(#pDots)" opacity="0.25"/><rect x="-800" y="-400" width="3600" height="1900" fill="url(#gWallShade)"/>`;
  for (const mx of [250, 700, 1150]) s += `<rect x="${mx}" y="120" width="300" height="380" rx="150" fill="#cfe6ee" stroke="${INK}" stroke-width="6"/><path d="M ${mx + 50} 180 L ${mx + 130} 120" stroke="#fff" stroke-width="10" opacity="0.6"/><rect x="${mx - 12}" y="108" width="324" height="404" rx="162" fill="none" stroke="#c9935a" stroke-width="12"/>`;
  s += `<rect x="-800" y="900" width="3600" height="600" fill="#e8dcc8"/>` + Array.from({ length: 40 }, (_, i) => `<path d="M ${-800 + i * 100} 900 v 600" stroke="${INK}" stroke-width="2" opacity="0.1"/>`).join('') + `<rect x="-800" y="900" width="3600" height="28" fill="#1b1424" opacity="0.25"/>`;
  s += `<text x="700" y="60" text-anchor="middle" ${FNT} font-size="64" fill="#a8326a" stroke="#fff" stroke-width="10" paint-order="stroke" letter-spacing="6">SALÃO</text>`;
  return s;
}
function salonChair(x, y) { return `<g transform="translate(${x} ${y})"><rect x="-70" y="-120" width="140" height="120" rx="20" fill="#c8443c" stroke="${INK}" stroke-width="5"/><rect x="-60" y="-260" width="120" height="150" rx="24" fill="#c8443c" stroke="${INK}" stroke-width="5"/><path d="M 0 0 V 50 M -50 50 h 100" stroke="${INK}" stroke-width="12"/></g>`; }
// portinhas de carro de fila (trânsito parado na rua da oficina)

// POV com as mãos do Seu Antônio (mangas azuis + mãos marrons): é ele quem segura o celular. Deriva do povHands do rig sem alterá-lo.
function povHandsAnt(x, y, k, inner, o = {}) {
  return povHands(x, y, k, inner, o).replace(/#ffc928/g, '#5a7ab0').replace(/#e0a514/g, '#3f5e90').replace(/#1d1a22/g, '#b9784c').replace(/#4a4458/g, '#8a5230');
}
const povAnt = (T, inner, o = {}) => Lr(1, povHandsAnt(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4 }));
