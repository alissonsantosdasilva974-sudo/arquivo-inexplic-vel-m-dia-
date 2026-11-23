// Episódio 3 — "Nota de R$ 10, parte 3": o homem de casaco longo. Padrão do canal (ep. 2 v4), vertical 9:16.
// Ritmo: ~13 planos a cada 10 s. Cada "batida" da narração vira vários planos com enquadramentos diferentes (beat()).
const SHOTS = [];
const NIGHT = ['#3a4a8a', 0.22];
const backNight = (t) => [Lr(0.04, sky('#0e1230', '#2e3264', { stars: 1, t, moon: 160, moonX: 1500, id: 'n' })), Lr(0.1, clouds(t * 0.5, '#4a4a7a', 0.45, 7, 60))];
const fog = (t, y = 820, op = 0.5) => `<g opacity="${op}">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${f2(((i * 520 + t * 30) % 4200) - 900)}" cy="${y + (i % 3) * 30}" rx="420" ry="60" fill="#c8cce8" opacity="0.35"/>`).join('')}</g>`;
const GLOWN = (T) => 0.6 + 0.4 * Math.sin(T * 5);
const povBg = (c) => Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="${c}"/><circle cx="960" cy="560" r="460" fill="#ffd27a" opacity="0.1"/>`);
const pov = (T, inner, o = {}) => Lr(1, povHands(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4 }));

// ---------- escuridão: a rua escurece a partir de 69,5 s ----------
const DARK = (T) => 0.62 * E.inOut(inv(69.5, 70.6, T));
const tintAt = (T) => ['#2a3270', 0.22 + DARK(T) * 0.25];
const darkRect = (T) => DARK(T) > 0 ? `<rect x="-2000" y="-2000" width="6000" height="6000" fill="#05060f" opacity="${f2(DARK(T) * 0.7)}"/>` : '';
const nightSet = (T, t, extra, o = {}) => [...backNight(t), ...sideStreet(T, t, Object.assign({ seed: 5, night: 1, npcs: false, fg: false, extra }, o)), Lr(1.2, fog(T) + darkRect(T))];

// ---------- objetos ----------
const HAT = (r = 0) => fedoraProp(r);
const FOLD = (g = 0, k = 1) => `<g transform="scale(${k}) rotate(-10)">${g > 0 ? `<circle r="${f2(30 + g * 16)}" fill="#ffe7a0" opacity="${f2(0.3 * g)}"/>` : ''}<rect x="-26" y="-18" width="52" height="34" rx="4" fill="#e8907a" stroke="${OL}" stroke-width="4"/><path d="M -26 -1 H 26 M 0 -18 V 16" stroke="#b8604c" stroke-width="3"/><text x="-20" y="-5" font-family="Fredoka" font-weight="700" font-size="11" fill="#7a2e22">10</text></g>`;
// a nota se desdobra em 4 etapas (q 0..1): dobrada → meia → aberta
const UNFOLD = (q, label, g) => q < 0.5 ? `<g transform="scale(${f2(1 + q * 1.2)})">${FOLD(g, 1)}</g>` : `<g transform="scale(${f2(0.4 + (q - 0.5) * 1.2)} ${f2(0.8 + (q - 0.5) * 0.4)})">${noteNamed(q > 0.85 ? label : '', g, { s: 1, fs: 22 })}</g>`;

// ---------- estado do Polo ao longo do episódio ----------
// chapéu: na mão (0–3,9) → põe e aperta (3,9–4,6) → na cabeça → tira (23,1–23,7) → na mão até o fim (igual ao 1º quadro)
const POLO_TALK = [[23.03, 24.52], [25.38, 26.67], [27.49, 28.85], [29.61, 31.42], [41.32, 41.97], [42.55, 46.2]];
const MAN_TALK = [[37.85, 38.34], [39.19, 40.09], [50.91, 51.99], [52.88, 53.45], [63.1, 63.7], [64.17, 65.38], [66.3, 67.39], [68.11, 68.58]];
function poloP(T, o = {}) {
  const on = (T >= 4.3 && T < 23.4);
  const d = { x: PX0, y: G, s: 0.62, t: T, face: 0.5, lx: 1, expr: 'neutral', pocketNote: true, hat: on ? 'fedora' : null, mouth: talk(T, POLO_TALK) };
  if (!on) Object.assign(d, { armL: 34, bendL: 46, holdL: HAT(-12) });
  if (T >= 3.9 && T < 4.7) { const q = inv(3.9, 4.3, T); Object.assign(d, { armL: lerp(34, 168, q), bendL: 30, holdL: T < 4.3 ? HAT(0) : '', hatLift: T >= 4.3 ? Math.abs(Math.sin((T - 4.3) * 14)) * 6 : 0 }); if (T >= 4.3) d.armL = 168; }
  if (T >= 23.1 && T < 23.9) { const q = inv(23.1, 23.4, T); Object.assign(d, { armL: T < 23.4 ? lerp(30, 168, q) : lerp(168, 34, inv(23.4, 23.9, T)), bendL: 30, hatLift: T < 23.4 ? q * 30 : 0, holdL: T >= 23.4 ? HAT(-12) : '' }); }
  if (T >= 74.3) Object.assign(d, { armR: 70, bendR: 20, holdR: noteNamed('@polo', 0.5 + 0.4 * GLOWN(T), { s: 0.42 }) });
  d.headTilt = Math.sin(T * 1.3) * 3; d.tilt = Math.sin(T * 0.9) * 1.6; if (talk(T, MAN_TALK) > 0) d.lx = 1; d.armR = d.armR != null ? d.armR : 8 + Math.sin(T * 1.7) * 6;
  if (T > 13.86 && T < 22) d.expr = 'worried';
  if (T > 57.8) d.expr = 'surprised';
  if (T > 73.3) d.expr = 'worried';
  return P_('polo', Object.assign(d, o));
}
function manP(T, o = {}) {
  const pulled = T >= 55.0, given = T >= 74.3;
  const d = { x: MX0, y: G, s: 0.62, t: T, face: -0.4, lx: -1, expr: T > 46.4 ? 'smug' : 'neutral', coatNote: !pulled, mouth: talk(T, MAN_TALK) };
  d.headTilt = Math.sin(T * 1.1 + 1) * 2.5; d.tilt = Math.sin(T * 0.8 + 2) * 1.2; d.armL = 8 + talk(T, MAN_TALK) * 40 + Math.sin(T * 1.5) * 5;
  if (pulled && !given) Object.assign(d, { armR: 62, bendR: 40, holdR: FOLD(T > 57.8 ? GLOWN(T) : 0.3, 1.1) });
  return P_('casaco', Object.assign(d, o));
}
const PX0 = 600, MX0 = 830, G = 905;
const PH = G - 0.62 * 250, MH = G - 0.62 * 1.12 * 300;

// ---------- enquadramentos padrão ----------
// P/PX: Polo em close (conta como "Polo em close"); M/MX: homem; W: plano dos dois; O: sobre o ombro do Polo; R: sobre o ombro do homem
const MERGE = new Set(['P', 'PX', 'M', 'MX', 'W', 'DUT', 'DUTP', 'LOWP', 'LOW']);
function camFor(k, t) {
  if (k === 'P') return focus(PX0, PH, 3.1, 950);
  if (k === 'PX') return focus(PX0 + 6, PH - 35, 4.3, 900);
  if (k === 'M') return focus(MX0, MH, 3.0, 930);
  if (k === 'MX') return focus(MX0 - 6, MH - 40, 4.2, 900);
  if (k === 'DUT') return { ...focus(MX0, MH, 3.2, 930), r: -6 };
  if (k === 'DUTP') return { ...focus(PX0, PH, 3.3, 950), r: 5 };
  if (k === 'LOWP') return focus(PX0, G - 80, 2.5, 1200);
  if (k === 'LOW') return focus(MX0, G - 80, 2.5, 1200);
  return { ...frameG(715, G, 2.0, 1430), r: 0 };
}
// MOVE: plano longo; a câmera passa de uma âncora para a outra com easing, sempre em movimento, e com leve deriva
function moveCam(keys, t, dur, T, from) {
  // âncoras: 'from' (último enquadramento do plano anterior) em t=0, depois cada enquadramento no meio do seu trecho
  const n = keys.length, d = dur / n;
  const A = (from ? [[0, from]] : []).concat(keys.map((k, i) => [(i + 0.5) * d, k]));
  let c;
  if (t <= A[0][0]) c = camFor(A[0][1]); else if (t >= A[A.length - 1][0]) c = camFor(A[A.length - 1][1]);
  else { let i = 0; while (A[i + 1][0] < t) i++; c = lerpCam({ r: 0, ...camFor(A[i][1]) }, { r: 0, ...camFor(A[i + 1][1]) }, E.inOut((t - A[i][0]) / (A[i + 1][0] - A[i][0]))); }
  return { x: c.x + Math.sin(T * 0.9) * 14, y: c.y + Math.sin(T * 0.7) * 8, z: c.z * (1 + 0.04 * Math.sin(T * 0.5)), r: (c.r || 0) + Math.sin(T * 0.6) * 0.8 };
}
function std(t, T, k, o = {}) {
  if (k.startsWith && k.startsWith('MOVE:')) {
    const keys = k.slice(5).split(','), dur = curDur(T);
    const man = o.noMan ? '' : manP(T, o.man || {}), polo = poloP(T, o.polo || {});
    const sh = SHOTS[shotAt(T)];
    return { cam: moveCam(keys, t, dur, T, sh._from), layers: nightSet(T, t, lampLight(720, 940, 1.0 - DARK(T) * 0.8) + man + polo + (o.extra || '')), tint: tintAt(T), over: o.over || '' };
  }
  const man = o.noMan ? '' : manP(T, o.man || {}), polo = poloP(T, o.polo || {});
  const extra = o.extra || '';
  const lamp = lampLight(720, 940, 1.0 - DARK(T) * 0.8);
  let cam, inner;
  if (k === 'P') { cam = push(focus(PX0, PH, 3.1, 950), t, 0.9, 0.06); inner = man + polo; }
  else if (k === 'PX') { cam = push(focus(PX0 + 6, PH - 35, 4.6, 900), t, 0.9, 0.05); inner = polo; }
  else if (k === 'M') { cam = push(focus(MX0, MH, 3.0, 930), t, 0.9, 0.06); inner = polo + man; }
  else if (k === 'MX') { cam = push(focus(MX0 - 6, MH - 40, 4.4, 900), t, 0.9, 0.05); inner = man; }
  else if (k === 'LOW') { cam = lerpCam(focus(MX0, G - 60, 2.4, 1250), focus(MX0, MH, 2.6, 980), E.inOut(clamp(t / 0.8))); inner = man; }
  else if (k === 'O') {
    cam = push(focus(780, MH + 20, 2.5, 940), t, 0.9, 0.05);
    inner = man + P_('polo', { x: 640, y: 990, s: 0.9, t: T, back: true, hat: (T >= 4.3 && T < 23.4) ? 'fedora' : null, armR: T >= 74.3 ? 60 : 12, holdR: T >= 74.3 ? noteNamed('@polo', 0.7, { s: 0.42 }) : '' });
  } else if (k === 'R') {
    cam = push(focus(650, PH + 20, 2.5, 940), t, 0.9, 0.05);
    inner = polo + P_('casaco', { x: 800, y: 990, s: 0.9, t: T, back: true });
  } else if (k === 'LUI') {
    cam = push(frameG(790, G, 1.7, 1430), t, 0.9, 0.05);
    const lu = P_('luisa', { x: 965, y: G - 10, s: 0.5, t: T, face: -0.5, lx: -1, expr: 'happy', armR: wave(T, T - t, T - t + 5, 160, 20) || 20, bendR: 20 });
    inner = lu + `<g transform="translate(965 ${f2(G - 10 - 0.5 * 0.95 * 560)})"><rect x="-58" y="-26" width="116" height="44" rx="22" fill="#ffffff" stroke="${OL}" stroke-width="4"/><text y="6" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="26" fill="#6a40a8">Luisa</text></g>` + polo + man;
  } else if (k === 'DUT') { cam = { ...push(focus(MX0, MH, 3.2, 930), t, 0.9, 0.06), r: -8 }; inner = polo + man; }
  else if (k === 'DUTP') { cam = { ...push(focus(PX0, PH, 3.3, 950), t, 0.9, 0.06), r: 7 }; inner = man + polo; }
  else if (k === 'LOWP') { cam = lerpCam(focus(PX0, G - 50, 2.3, 1300), focus(PX0, PH, 2.7, 1000), E.inOut(clamp(t / 0.8))); inner = man + polo; }
  else if (k === 'PROF') {
    cam = push(focus(715, PH - 10, 2.6, 950), t, 0.9, 0.05);
    inner = poloP(T, Object.assign({}, o.polo || {}, { x: PX0 + 25, side: true, face: 0.8 })) + (o.noMan ? '' : manP(T, Object.assign({}, o.man || {}, { x: MX0 - 25, side: true, face: -0.8 })));
  } else if (k === 'P3D' || k === 'TOP') {
    const c3 = k === 'TOP' ? cam3(1700, 300, 500, 0) : cam3(640, 560, 500, 0), D = 700;
    const on = (T >= 4.3 && T < 23.4);
    const people = [{ id: 'polo', X: -70, D, s: 0.44, o: { t: T, face: 0.7, lx: 1, hat: on ? 'fedora' : null, pocketNote: true, expr: (o.polo || {}).expr || 'worried', mouth: talk(T, POLO_TALK) } },
      { id: 'casaco', X: 70, D, s: 0.44, o: { t: T, face: -0.7, lx: -1, expr: T > 46.4 ? 'smug' : 'neutral', coatNote: T < 55, mouth: talk(T, MAN_TALK) } }];
    const pp = P3(c3, 0, 0, D);
    return { cam: k === 'TOP' ? push(focus(960, 760, 1.15), t, 0.9, 0.05) : push(focus(pp.x, pp.y - 150, 2.4, 1000), t, 0.9, 0.05), layers: [...backNight(t), Lr(1, street3D(T, { cam: c3, seed: 7, night: 1, people, crowd: 0, traffic: false }) + darkRect(T)), Lr(1.1, fog(T, 760, 0.45))], tint: tintAt(T), over: o.over || '' };
  } else { cam = push(frameG(715, G, 2.0, 1430), t, 0.9, 0.05); inner = polo + man; }
  return { cam, layers: nightSet(T, t, lamp + inner + extra), tint: tintAt(T), over: o.over || '' };
}
// beat: divide [t0,t1] igualmente entre os enquadramentos da lista; fn(t, T, k, i) devolve a cena
const PC = new Set(['P', 'PX', 'POVP', 'HOOK', 'DUTP']);
const XF = new Set(['MEM', 'MEMC', 'MEMG', 'STREET', 'DRONE', 'FOLLOW', 'P3D', 'TOP', 'TOWER', 'LUI']);
function beat(t0, t1, ks, fn) {
  const d = (t1 - t0) / ks.length, groups = [];
  ks.forEach((k, i) => { const g = groups[groups.length - 1]; if (g && MERGE.has(k) && MERGE.has(g.ks[0]) && g.ks.length < 8) g.ks.push(k); else groups.push({ i, ks: [k] }); });
  for (const g of groups) {
    const a = t0 + d * g.i, dur = d * g.ks.length;
    const k = g.ks.length > 1 || MERGE.has(g.ks[0]) ? 'MOVE:' + g.ks.join(',') : g.ks[0];
    const pcf = g.ks.filter(x => PC.has(x)).length / g.ks.length;
    const sh = { t0: +a.toFixed(3), k, pc: pcf, draw(t, T) { const r = fn(t, T, k, g.i); return r; } };
    if ((XF.has(g.ks[0]) || ['MEM','TOWER','STREET','DRONE','FOLLOW'].some(x => g.ks[0].startsWith(x))) && a > 0.5) sh.xf = 0.3;
    const prev = SHOTS[SHOTS.length - 1];
    if (k.startsWith('MOVE:') && prev && prev.k.startsWith('MOVE:') && Math.abs(prev.t0 + prev._dur - a) < 0.01) { sh._from = prev.k.slice(5).split(',').pop(); sh.cont = 1; }
    sh._dur = dur; SHOTS.push(sh);
  }
}
const S = (o = {}) => (t, T, k) => std(t, T, k, typeof o === 'function' ? o(T, k) : o);
const curDur = (T) => { const i = shotAt(T); return SHOTS[i]._dur || 2; };

// ---------- texto em tela ----------
function banner(op = 1) {
  if (op <= 0) return '';
  return `<g transform="translate(540 420)" opacity="${f2(op)}"><rect x="-470" y="-118" width="940" height="236" rx="34" fill="#ffd23f" stroke="#211c26" stroke-width="12"/>` +
    `<text y="-22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#211c26">Nesta cidade, quem avisa</text>` +
    `<text y="62" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#211c26">a verdade <tspan fill="#c8361c">nunca fica sozinho!</tspan></text></g>`;
}
function bubble(T, t0, t1, text, x, y, tail = -1) {
  if (T < t0 || T > t1) return '';
  const pop = E.back(clamp((T - t0) / 0.18)), out = 1 - clamp((T - t1 + 0.15) / 0.15);
  const w = Math.max(420, text.length * 34 + 90);
  return `<g transform="translate(${x} ${y}) scale(${f2(pop)})" opacity="${f2(out)}"><path d="M ${-w / 2} -70 Q ${-w / 2} -110 ${-w / 2 + 40} -110 H ${w / 2 - 40} Q ${w / 2} -110 ${w / 2} -70 V 40 Q ${w / 2} 80 ${w / 2 - 40} 80 H ${tail * 60 + 50} L ${tail * 150} 170 L ${tail * 60 - 30} 80 H ${-w / 2 + 40} Q ${-w / 2} 80 ${-w / 2} 40 Z" fill="#ffffff" stroke="#211c26" stroke-width="10" stroke-linejoin="round"/>` +
    `<text y="0" text-anchor="middle" dominant-baseline="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="#211c26">${text}</text></g>`;
}
function luisaCard(T) {
  const a = clamp((T - 15.95) / 0.2) * (1 - clamp((T - 19.0) / 0.2));
  if (a <= 0) return '';
  const y = 640 + (1 - E.back(clamp((T - 15.95) / 0.35))) * 80;
  return `<g transform="translate(540 ${f2(y)})" opacity="${f2(a)}"><rect x="-480" y="-140" width="960" height="280" rx="36" fill="#ffffff" stroke="#211c26" stroke-width="10"/>` +
    `<g transform="translate(-392 -50)"><circle r="46" fill="#8a5ac8" stroke="#211c26" stroke-width="6"/><text y="16" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="48" fill="#ffffff">L</text></g>` +
    `<text x="-322" y="-66" font-family="Fredoka" font-weight="600" font-size="36" fill="#7a7280">@Lulu_br10 · Luisa</text>` +
    `<text x="-322" y="-6" font-family="Fredoka" font-weight="700" font-size="48" fill="#211c26"><tspan fill="#d0402a">Cobra</tspan> e prvf fala meu nome</text>` +
    `<text x="-322" y="56" font-family="Fredoka" font-weight="700" font-size="48" fill="#211c26">no próximo vídeo! 💜</text>` +
    `<text x="420" y="112" text-anchor="end" font-family="Fredoka" font-weight="700" font-size="34" fill="#d0402a">♥ Polo curtiu</text></g>`;
}
function commentPanel(T) {
  const a = clamp((T - 77.3) / 0.25) * (1 - clamp((T - 81.9) / 0.2));
  if (a <= 0) return '';
  const y = 640 + (1 - E.back(clamp((T - 77.3) / 0.35))) * 80;
  return `<g transform="translate(540 ${f2(y)})" opacity="${f2(a)}"><rect x="-480" y="-130" width="960" height="260" rx="36" fill="#ffffff" stroke="#211c26" stroke-width="10"/>` +
    `<g transform="translate(-388 -40)"><circle r="46" fill="#ffc928" stroke="#211c26" stroke-width="6"/><text y="16" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="44" fill="#211c26">?</text></g>` +
    `<text x="-318" y="-52" font-family="Fredoka" font-weight="700" font-size="58" fill="#211c26">Você confiaria nesse homem?</text>` +
    `<text x="-318" y="30" font-family="Fredoka" font-weight="600" font-size="48" fill="#4a4250">Comenta <tspan fill="#2f78d0" font-weight="700">CONFIA</tspan> ou <tspan fill="#d0402a" font-weight="700">DESCONFIA</tspan>.</text>` +
    `<path d="M -318 78 h 120 M -170 78 h 60" stroke="#c8c2cc" stroke-width="10" stroke-linecap="round"/><text x="420" y="94" text-anchor="end" font-family="Fredoka" font-weight="700" font-size="36" fill="#d0402a">♥ 4</text></g>`;
}

// ---------- gancho (também o último plano: o loop) ----------
// u = tempo local; no quadro 0 e no último quadro u = 0, então os dois quadros são idênticos
const HOOK_END = 82.4;
function hook(u, z = 3.0) {
  const polo = P_('polo', { x: PX0, y: G, s: 0.62, t: u, face: 0.15, expr: 'worried', pocketNote: true, hat: null, armL: 52, bendL: 60, holdL: HAT(-8) });
  return { cam: { ...focus(PX0, PH - 10, z + 0.08 * E.sine(clamp(u / 3)), 980), r: 0 }, layers: nightSet(u, u, lampLight(900, 940, 1) + polo), tint: NIGHT, over: banner(1) };
}


// CENA DE TESTE (4 s): Polo entra andando já no quadro 0, para, vira e se surpreende; banner de abertura (opção A)
function bannerA(T) {
  const pop = E.back(clamp(T / 0.25));
  return `<g transform="translate(540 400) scale(${f2(0.85 + 0.15 * pop)})"><rect x="-480" y="-90" width="960" height="180" rx="30" fill="#ffd23f" stroke="#211c26" stroke-width="12"/>` +
    `<text y="30" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="80" fill="#211c26">A NOTA TEM <tspan fill="#c8361c">SEU NOME</tspan></text></g>`;
}
SHOTS.push({ t0: 0, draw(t, T) {
  const stop = 1.3, walking = T < stop;
  const x = walking ? lerp(380, PX0, E.out(T / stop)) : PX0;
  const sur = T > 1.9;
  const polo = walking ? P_('polo', { x, y: G, s: 0.62, t: T, face: 0.8, side: true, walk: T * 9, hat: null, pocketNote: true, expr: 'neutral' })
    : P_('polo', { x, y: G, s: 0.62, t: T, face: 0.15, lx: 0.3, hat: null, pocketNote: true, expr: sur ? 'surprised' : 'neutral', mouth: sur ? 0.6 : 0, armL: sur ? 150 : 20, bendL: 30, handL: sur ? 'open' : null, armR: sur ? 150 : 20, bendR: 30, handR: sur ? 'open' : null, jump: sur ? Math.max(0, Math.sin((T - 1.9) * 9)) * 18 * Math.max(0, 1 - (T - 1.9) * 2) : 0 });
  const z = lerp(2.4, 3.3, E.inOut(clamp(T / 2.2)));
  const cam = { ...focus(x, PH, z, 960), r: Math.sin(T * 0.8) * 1 };
  return { cam, layers: nightSet(T, T, lampLight(900, 940, 1) + polo, { avoidX: PX0 }), tint: NIGHT, over: bannerA(T) + comic(T, 2.0, '!?', 820, 600, { size: 130, life: 1.4, fill: '#ff7a45' }) };
} });
function HUD() { return ''; }
