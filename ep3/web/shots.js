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
  return { cam: { ...focus(PX0, PH - 10, z + 0.08 * E.sine(clamp(u / 3)), 980), r: 0 }, layers: nightSet(u, u, lampLight(720, 940, 1) + polo), tint: NIGHT, over: banner(1) };
}

// ======================= CENAS =======================
// 1 · 0–3,3 s: Polo em close, chapéu na mão, banner do gancho
beat(0, 3.29, ['HOOK'], (t, T, k) => {
  if (k === 'HOOK') return hook(T);
  if (k === 'HOOK2') { const r = hook(T, 4.2); r.cam = { ...focus(PX0 - 40, PH + 40, 4.0, 980), r: 0 }; return r; }
  if (k === 'HOOK3') { const r = hook(T, 2.2); return r; }
  return std(t, T, 'P', { noMan: true, over: banner(1 - clamp((T - 3.0) / 0.25)) });
});
// 2 · "Polo apertou o chapéu, na cidade vazia."
beat(3.29, 7.05, ['P', 'PX', 'STREET'], (t, T, k) => {
  if (k === 'STREET') { const cam = cam3(640, 560, 500, 0); const people = [{ id: 'polo', X: 40, D: 700, s: 0.44, o: { t: T, hat: 'fedora', expr: 'worried', pocketNote: true } }]; return { cam: push(focus(960, 800, 1.3), t, 0.8, 0.05), layers: [...backNight(t), Lr(1, street3D(T, { cam, seed: 7, night: 1, people, crowd: 0, traffic: false })), Lr(1.1, fog(T, 760, 0.6))], tint: NIGHT }; }
  if (k === 'DRONE') { const q = E.inOut(clamp(t / 0.8)); return { cam: focus(960, 720, 1.0), layers: [...backNight(t), Lr(1, street3D(T, { cam: cam3(lerp(3300, 2600, q), 260, 500, 0), seed: 7, night: 1, crowd: 0, traffic: false })), Lr(1.1, fog(T, 700, 0.5))], tint: NIGHT }; }
  return std(t, T, k, { noMan: true });
});
// 3 · "Os passos pararam na frente dele." (6,25–8,56)
beat(7.05, 9.46, ['FEET', 'P'], (t, T, k) => {
  if (k === 'P') return std(t, T, 'P', { noMan: true, polo: { face: 0.6, lx: 1, expr: 'surprised' }, extra: emote('excl', PX0, G - 0.62 * 470, T - 7.9, 0.9) });
  const stop = T > 8.3; const x = stop ? MX0 : lerp(MX0 + 300, MX0, inv(7.05, 8.3, T));
  const man = manP(T, { x, y: G, walk: stop ? null : T * 7, side: true, face: -0.8 });
  const cam = push(focus(k === 'FEET' ? x : MX0, G - 30, 4.2, 1100), t, 0.8, 0.05);
  return { cam, layers: nightSet(T, t, lampLight(720, 940, 1) + man), tint: tintAt(T), over: comic(T, 7.2, 'TAP... TAP...', 540, 520, { size: 90, life: 1.1, fill: '#ffffff' }) + comic(T, 8.4, 'TAP.', 640, 600, { size: 90, life: 0.8, fill: '#ffffff' }) };
});
// 4 · "Um homem de casaco longo, com uma nota de dez dobrada no bolso." (9,46–13,17)
beat(9.46, 13.17, ['LOW', 'W', 'M', 'POCKET'], (t, T, k) => {
  if (k === 'POCKET') return { cam: push(focus(MX0 - 22, G - 0.62 * 1.12 * 214, 7.0, 900), t, 0.7, 0.08), layers: nightSet(T, t, lampLight(720, 940, 1) + manP(T, { face: -0.2 })), tint: tintAt(T), over: comic(T, 12.2, 'R$ 10', 540, 520, { size: 100, life: 1.0, fill: '#ff9a7a' }) };
  return std(t, T, k, { man: { coatNote: true } });
});
// 5 · "Polo sentiu a carteira pesar." (13,17–15,9) — o placar aparece
beat(13.17, 15.9, ['P', 'POVW'], (t, T, k) => {
  if (k === 'POVW') { const drop = E.out(inv(14.4, 14.9, T)); return { cam: push(focus(960, 640, 1.0), t, 0.9, 0.06), layers: [povBg('#22223e'), pov(T, `<g transform="translate(0 ${f2(drop * 60)})">${wallet({ s: 1, light: 0 })}</g>`, { k: 2.2, dy: drop * 60 })], over: comic(T, 14.5, 'PESADA...', 540, 520, { size: 96, life: 0.9, fill: '#ffffff' }) }; }
  return std(t, T, k, { noMan: k === 'PX', polo: { armR: 40, bendR: 60, holdR: wallet({ s: 0.3 }) } });
});
// 6 · "Podia cobrar a nota. Fingir que nada era estranho." (15,9–19,2)
beat(15.9, 19.2, ['LUI', 'P', 'M', 'PX'], S((T, k) => ({ polo: { expr: T < 17 ? 'smug' : 'neutral', lx: k === 'PX' ? -1 : 1 }, extra: k === 'P' ? emote('q', PX0 + 40, G - 0.62 * 470, T - 16.0, 0.9) : '' })));
// 7 · "Mas lembrou do homem de terno, esperando tanto tempo." (19,2–23,0) — lembrança em sépia
const SEPIA = ['#b07a40', 0.42];
beat(19.2, 23.03, ['P', 'MEM', 'MEMC'], (t, T, k) => {
  if (k === 'MEM' || k === 'MEM2') { const man = P_('terno', { x: 820, y: 905, s: 0.66, t: T, face: -0.2, expr: 'smug', hat: k === 'MEM' ? 'fedora' : null }); const c = k === 'MEM' ? push(frameG(820, 905, 1.6, 1430), t, 0.9, 0.06) : push(focus(820, 905 - 0.66 * 1.1 * 310, 3.2, 920), t, 0.9, 0.08); return { cam: c, layers: [...backNight(t), ...sideStreet(T, t, { seed: 5, night: 1, npcs: false, fg: false, extra: lampLight(900, 940, 1) + man })], tint: SEPIA, over: k === 'MEM' ? comic(T, t0of(T) + 0.1, 'ANTES...', 540, 520, { size: 90, life: 0.7, fill: '#ffe2b0' }) : '' }; }
  if (k === 'MEMC') { const H = (T - 19) * 2; return { cam: push(focus(960, 880 - 520, 2.6, 960), t, 0.8, 0.06), layers: [...backNight(t), Lr(0.3, rooftops(t, 1, -3000)), Lr(0.9, `<rect x="-1400" y="880" width="4720" height="1200" fill="#3a3448"/>` + clockTower(960, 880, { hour: H * 30, min: H * 360 }))], tint: SEPIA, over: comic(T, 21.0, 'TIC TAC...', 540, 1040, { size: 90, life: 0.8, fill: '#ffe2b0' }) }; }
  return std(t, T, k, { noMan: true, polo: { face: 0.1, lx: -0.6, ly: 0.5, expr: 'sad' } });
});
function t0of(T) { const i = shotAt(T); return SHOTS[i].t0; }
// 8 · "Então tirou o chapéu e contou tudo." (23,0–25,4)
beat(23.03, 25.38, ['P', 'W', 'M'], S({ polo: { expr: 'neutral' } }));
// 9 · "Toda nota de dez tem dono." (25,4–27,5)
beat(25.38, 27.49, ['POVN'], (t, T, k) => {
  if (k === 'P') return std(t, T, 'P', { polo: { armR: 120, bendR: 30, handR: 'point' } });
  const notes = (k === 'POVN' ? [['PADEIRO', -92, -12], ['MOTORISTA', 0, 0], ['SENHORA', 92, 12]] : [['?', 0, -4]]).map(([n, x, r], i, a) => `<g transform="translate(${x} ${a.length > 1 ? -150 + i * 40 - Math.abs(x) * 0.1 : -60}) rotate(${r})">${noteNamed(n, GLOWN(T), { s: a.length > 1 ? 0.82 : 1.5, fs: a.length > 1 ? 18 : 30 })}</g>`).join('');
  return { cam: push(focus(960, 580, 1.1), t, 0.7, 0.08), layers: [povBg('#262646'), pov(T, notes, { k: 1.55, spread: 250 }), Lr(1.05, dust(T, 500, 300, 900, 600, 24, 8, '#ffe7a0'))] };
});
// 10 · "Quem devolve vira o cobrador. Só sai quando o próximo devolve a dele!" (27,5–32,2)
beat(27.49, 32.24, ['P', 'HATI', 'M', 'PX', 'MEMG'], (t, T, k) => {
  if (k === 'HATI') return { cam: push(focus(960, 600, 1.0), t, 0.7, 0.06), layers: [povBg('#2a2440'), pov(T, `<g transform="rotate(${f2(Math.sin(T * 3) * 5)})">${HAT(0)}</g>`, { k: 2.4 })], over: comic(T, 28.1, 'COBRADOR!', 540, 520, { size: 100, fill: '#ff7a45', life: 0.8 }) };
  if (k === 'MEMG') { const give = E.inOut(inv(30.5, 31.1, T)); const man = P_('terno', { x: 800, y: 905, s: 0.62, t: T, face: -0.4, lx: -1, expr: 'smug', hat: null, armL: lerp(20, 82, give), bendL: 8, holdL: give < 0.8 ? HAT(0) : '' }); const p = P_('polo', { x: 610, y: 905, s: 0.62, t: T, face: 0.5, lx: 1, expr: 'surprised', armR: give >= 0.8 ? 78 : 20, bendR: 15, holdR: give >= 0.8 ? HAT(10) : '' }); return { cam: push(frameG(705, 905, 2.0, 1430), t, 0.8, 0.06), layers: [...backNight(t), ...sideStreet(T, t, { seed: 5, night: 1, npcs: false, fg: false, extra: lampLight(900, 940, 1) + p + man })], tint: SEPIA }; }
  return std(t, T, k, { polo: { armR: 30 + talk(T, POLO_TALK) * 90, bendR: 40, handR: 'open' } });
});
// 11 · "O homem ficou em silêncio." (32,2–34,3)
beat(32.24, 34.32, ['DUT', 'W', 'MX'], S({ man: { expr: 'neutral', ly: 0.3 } , over: '' }));
SHOTS[SHOTS.length - 3].draw = ((f) => (t, T) => { const r = f(t, T); r.over = comic(T, 32.7, '...', 540, 520, { size: 140, life: 1.0, fill: '#ffffff' }); return r; })(SHOTS[SHOTS.length - 3].draw);
// 12 · "Olhou a nota. Olhou a carteira." (34,3–37,9)
beat(34.32, 37.85, ['MX', 'POCKET', 'W', 'M'], (t, T, k) => {
  if (k === 'POCKET') return { cam: push(focus(MX0 - 22, G - 0.62 * 1.12 * 214, 7.0, 900), t, 0.7, 0.08), layers: nightSet(T, t, lampLight(720, 940, 1) + manP(T, { face: -0.2 })), tint: tintAt(T) };
  if (k === 'WAL') return std(t, T, 'P', { polo: { armR: 50, bendR: 60, holdR: wallet({ s: 0.3 }), ly: 0.6, lx: 0.3 } });
  return std(t, T, k === 'MX2' ? 'MX' : k, { man: { ly: k === 'MX' ? 0.8 : 0.4, lx: k === 'MX2' ? -1 : 0.2 } });
});
// 13 · "Perguntou: e se eu não devolver?" (37,9–41,3)
beat(37.85, 41.32, ['DUT', 'MX', 'W', 'DUTP'], (t, T, k) => std(t, T, k, { man: { expr: 'neutral' }, polo: { expr: 'worried' }, over: bubble(T, 38.9, 41.1, 'e se eu não devolver?', k === 'DUTP' || k === 'R' ? 600 : 540, 520, 1) }));
// 14 · "Polo respondeu: aí você fica livre da cidade, mas a nota continua te seguindo!" (41,3–47,4)
beat(41.32, 47.35, ['P', 'PX', 'DRONE', 'FOLLOW', 'P', 'M'], (t, T, k) => {
  if (k === 'DRONE') { const q = E.inOut(clamp(t / 0.9)); return { cam: focus(960, 720, 1.0), layers: [...backNight(t), Lr(1, street3D(T, { cam: cam3(lerp(2400, 3400, q), 260, 500, 0), seed: 7, night: 1, crowd: 0, traffic: false }))], tint: NIGHT, over: comic(T, 43.4, 'LIVRE!', 540, 520, { size: 110, life: 0.8, fill: '#ffd23f' }) }; }
  if (k === 'FOLLOW' || k === 'FOLLOW2') {
    const cam = cam3(640, 560, 500, 0); const D = lerp(600, 1900, inv(44.0, 47.4, T));
    const people = [{ id: 'casaco', X: 60, D, s: 0.48, o: { t: T, back: true, walk: T * 6 } }];
    const pp = P3(cam, 60, 0, D - 160);
    const note = `<g transform="translate(${f2(pp.x + Math.sin(T * 4) * 20)} ${f2(pp.y - 200 + Math.sin(T * 6) * 10)})">${noteNamed('', GLOWN(T), { s: 0.7, rot: Math.sin(T * 3) * 12 })}</g>`;
    return { cam: k === 'FOLLOW' ? focus(960, 760, 1.2) : focus(pp.x, pp.y - 120, 2.6, 900), layers: [...backNight(t), Lr(1, street3D(T, { cam, seed: 7, night: 1, people, crowd: 0, traffic: false }) + note), Lr(1.1, fog(T, 760, 0.5))], tint: NIGHT };
  }
  return std(t, T, k, { polo: { expr: 'neutral', armR: 30 + talk(T, POLO_TALK) * 90, bendR: 40, handR: 'point' } });
});
// 15 · "O homem sorriu, devagar." (47,4–50,9)
beat(47.35, 50.91, ['M', 'W', 'LOWP', 'MX', 'P'], S((T) => ({ man: { expr: 'smug' }, polo: { expr: 'worried' }, extra: '' })));
// 16 · "Disse: eu já sabia. Por isso vim." (50,9–53,5)
beat(50.91, 53.45, ['DUT', 'PX', 'MX'], S({ man: { expr: 'smug' }, polo: { expr: 'surprised' } }));
// 17 · "Tirou a nota do bolso, dobrada em quatro." (53,5–57,8)
beat(53.45, 57.79, ['W', 'PULL', 'UNF', 'UNF2'], (t, T, k) => {
  if (k === 'PULL') { const q = E.inOut(inv(54.6, 55.2, T)); return { cam: push(focus(MX0 - 10, G - 0.62 * 1.12 * 200, 4.8, 900), t, 0.8, 0.06), layers: nightSet(T, t, lampLight(720, 940, 1) + manP(T, { face: -0.2, coatNote: q < 0.5, armR: lerp(10, 150, q < 0.5 ? q * 2 : 2 - q * 2) * 0 + (q < 0.5 ? lerp(10, 160, q * 2) : lerp(160, 62, (q - 0.5) * 2)), bendR: 40, holdR: q >= 0.5 ? FOLD(0.3, 1.1) : '' })), tint: tintAt(T) }; }
  if (k === 'UNF' || k === 'UNF2') { const q = k === 'UNF' ? 0.35 * E.out(clamp(t / 0.8)) : 0.5 + 0.34 * E.out(clamp(t / 0.8)); return { cam: push(focus(960, 600, 1.0), t, 0.8, 0.06), layers: [povBg('#1c1c38'), Lr(1, `<g transform="translate(960 560) scale(3)">${UNFOLD(q, '', 0.3)}</g>`)], over: comic(T, 56.4, 'DOBRADA EM 4', 540, 520, { size: 80, life: 1.3, fill: '#ffffff' }) }; }
  return std(t, T, k, {});
});
// 18 · "E ela tinha o nome do Polo!" (57,8–60,2)
beat(57.79, 60.23, ['NOTE', 'PX'], (t, T, k) => {
  if (k === 'PX') return std(t, T, 'PX', { polo: { expr: 'surprised' }, extra: emote('excl', PX0, G - 0.62 * 470, T - 58.7, 0.9) });
  const rv = E.out(inv(57.9, 58.6, T));
  return { cam: push(focus(960, 600, k === 'NOTE' ? 1.0 : 1.5), t, 0.8, 0.1), layers: [povBg('#1c1c38'), Lr(1, `<g transform="translate(960 560)">${noteNamed('@polo', rv * GLOWN(T) + 0.2, { s: 3.2, rot: -3, fs: 20 })}</g>` + dust(T, 500, 300, 900, 600, 24, 3, '#ffe7a0'))], over: comic(T, 58.4, 'POLO?!', 540, 420, { size: 130, life: 1.4, fill: '#ff7a45' }) };
});
// 19 · "Polo parou. Não entendeu." (60,2–63,1)
beat(60.23, 63.1, ['PX', 'W', 'DUTP', 'PX'], S((T, k) => ({ polo: { expr: T < 61.2 ? 'surprised' : 'worried', mouth: 0 }, extra: k === 'DUTP' ? emote('q', PX0 + 40, G - 0.62 * 470, T - 61.4, 0.9) : '' })));
// 20 · "O homem falou: o dono te mandou me avisar. Ele não quer a nota de volta. Quer você!" (63,1–69,5)
beat(63.1, 69.47, ['M', 'W', 'P', 'LOW', 'MX', 'PX', 'DUT', 'W'], (t, T, k) => std(t, T, k, { man: { expr: T > 67.9 ? 'smug' : 'neutral', armL: T > 68.0 && T < 69.4 ? 75 : 8, bendL: 0, handL: T > 68.0 && T < 69.4 ? 'point' : null }, polo: { expr: T > 66 ? 'surprised' : 'worried' }, over: comic(T, 68.15, 'QUER VOCÊ!', 540, 520, { size: 110, life: 1.3, fill: '#ff7a45' }) }));
// 21 · "A rua escureceu. O relógio da torre parou." (69,5–73,3)
const towerNight = (t, T, z) => { const run = Math.min(T, 71.75); const H = 22 + run * 0.4 + (T > 71.75 ? Math.sin(T * 40) * 0.002 * Math.max(0, 1 - (T - 71.75) * 3) : 0); return { cam: push(focus(960, 880 - (z > 2 ? 560 : 360), z, 960), t, 0.8, 0.06), layers: [...backNight(t), Lr(0.3, rooftops(t, 1, -3000)), Lr(0.9, `<rect x="-1400" y="880" width="4720" height="1200" fill="#2a2638"/>` + clockTower(960, 880, { hour: (H % 12) * 30, min: (H % 1) * 360 + (T < 71.75 ? Math.floor(T * 2) * 6 : 0) }) + darkRect(T))], tint: tintAt(T) }; };
beat(69.47, 73.34, ['W', 'LAMP', 'TOWER', 'TOWERC'], (t, T, k) => {
  if (k === 'TOWER') { const r = towerNight(t, T, 1.3); r.over = comic(T, 71.4, 'TIC... TAC...', 540, 520, { size: 90, life: 0.6, fill: '#ffffff' }); return r; }
  if (k === 'TOWERC') { const r = towerNight(t, T, 2.8); r.over = comic(T, 72.4, 'PAROU.', 540, 1040, { size: 110, life: 0.9, fill: '#ff7a45' }); return r; }
  if (k === 'LAMP') return { cam: push(focus(720, 520, 2.4, 900), t, 0.8, 0.05), layers: nightSet(T, t, lampLight(720, 940, 1.0 - DARK(T) * 0.9)), tint: tintAt(T) };
  return std(t, T, k, { polo: { expr: 'worried', ly: -0.5 } });
});
// 22 · "E o homem entregou a nota na mão de Polo." (73,3–76,0)
beat(73.34, 75.99, ['HAND', 'POVP', 'M'], (t, T, k) => {
  if (k === 'HAND') { const give = E.inOut(inv(73.6, 74.3, T)); return std(t, T, 'W', { man: { armR: lerp(62, 82, give), bendR: lerp(40, 8, give), holdR: T < 74.3 ? FOLD(GLOWN(T), 1.1) : '' } }); }
  if (k === 'POVP') return { cam: push(focus(960, 620, 1.0), t, 0.8, 0.08), layers: [povBg('#141428'), pov(T, noteNamed('@polo', GLOWN(T), { s: 1.6, rot: -4, fs: 20 }), { k: 2.0, spread: 260 }), Lr(1.05, dust(T, 500, 300, 900, 600, 22, 9, '#ffe7a0'))] };
  return std(t, T, k, {});
});
// 23 · pergunta final + painel de comentário (75,99–81,8) → volta ao gancho
beat(75.99, 81.76, ['P', 'MX', 'W', 'PX', 'DUT', 'P'], (t, T, k) => std(t, T, k, {
  man: { expr: 'smug' }, polo: { expr: T > 80.2 ? 'neutral' : 'worried', armR: T > 78.2 && T < 80 ? 110 : 70, handR: T > 78.2 && T < 80 ? 'point' : null },
  over: comic(T, 78.6, 'CONFIA', 300, 1000, { size: 96, life: 1.2, fill: '#7ac0ff', rot: -8 }) + comic(T, 79.2, 'DESCONFIA', 760, 1060, { size: 96, life: 1.0, fill: '#ff7a45', rot: 8 }) + comic(T, 80.4, 'PARTE 4?', 540, 1040, { size: 110, life: 1.2, fill: '#ffd23f' }) }));
// último plano = primeiro quadro (loop)
SHOTS.push({ t0: 81.76, k: 'HOOK', pc: true, draw(t, T) { return hook(T - HOOK_END); } });

// overlay global: painel de comentário nos últimos 5 s
const _comic = comic;
// ---------- placar: notas na carteira ×1 → ×2 (a nota com o nome do Polo) ----------
function HUD(T) {
  let out = commentPanel(T) + luisaCard(T);
  if (T < 14.0 || T > 81.7) return out;
  const n = T >= 74.3 ? 2 : 1, since = T - 74.3;
  const app = E.back(clamp((T - 14.0) / 0.3)) * (1 - clamp((T - 81.4) / 0.3));
  const pop = since > 0 && since < 0.6 ? 1 + 0.35 * Math.sin(clamp(since / 0.6) * Math.PI) : 1;
  let s = `<g transform="translate(905 214) scale(${f2(app * pop)})" opacity="${f2(app)}"><rect x="-118" y="-46" width="236" height="92" rx="46" fill="#1e1820" opacity="0.72"/>`;
  s += `<g transform="translate(-58 6) scale(0.42)">${wallet({ s: 1, light: 0 })}</g><text x="40" y="22" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="${n > 1 ? '#ff6a45' : '#ffffff'}" stroke="#1e1820" stroke-width="10" paint-order="stroke">×${n}</text></g>`;
  if (since > 0 && since < 1.0) s += `<text x="960" y="${f2(300 + since * 70)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="#ff6a45" stroke="#1e1820" stroke-width="10" paint-order="stroke" opacity="${f2(1 - since)}">+1</text>`;
  return out + s;
}
