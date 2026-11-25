// Hospital Santa Clara — parte final. Cenas no tempo real da narração (work/words.json).
const SHOTS = [];
const DARK = ['#2a3266', 0.28];
const lantern = (on = 1) => `<g transform="rotate(-90)"><rect x="-12" y="-6" width="24" height="56" rx="6" fill="#5a5e6e" stroke="${OL}" stroke-width="4"/><ellipse cx="0" cy="54" rx="17" ry="9" fill="${on ? '#fff4c0' : '#4a4a52'}" stroke="${OL}" stroke-width="4"/></g>`;
const beam = (x, y, ang, len, on = 1) => on ? `<path d="M ${x} ${y} L ${x + Math.cos(ang - 0.22) * len} ${y + Math.sin(ang - 0.22) * len} L ${x + Math.cos(ang + 0.22) * len} ${y + Math.sin(ang + 0.22) * len} Z" fill="#fff2c0" opacity="0.16"/>` : '';
const DOCTALK = [[11.68, 13.7], [82.7, 85.2]];
const polo = (o) => P_('poloPB', POLO(o));
const doc = (o) => P_('medico', o);
// Polo segurando a lanterna (braço direito para frente)
const poloTorch = (x, s, T, o = {}) => polo(Object.assign({ x, y: GROUND, s, t: T, face: 0.6, expr: 'worried', armR: 95, bendR: -20, holdR: lantern(o.on !== false) }, o));

SHOTS.push(
  // 0 — gancho: close do Polo, garras na fresta da porta, banner
  { t0: 0, draw(t, T) {
    const gap = lerp(360, 60, E.inOut(clamp(t / 1.1)));
    return { cam: push(focus(560, 640, 3.0, 860), t, 1.1, 0.05), layers: [Lr(1, elevatorBack(T) + elevatorDoors(gap + 600, T) + poloTorch(560, 0.62, T, { expr: 'surprised', face: 0.4, mouth: 0.4 }) + clawsGap(675 + gap / 2 + 300, 520, 1.6, T)), Lr(1.05, torch(560, 620, 420, 0.75, 'h0'))], tint: DARK, over: hookBanner(T, 0) };
  } },
  // 1 — as portas batem
  { t0: 1.1, draw(t, T) {
    const gap = lerp(220, 0, E.in(clamp(t / 0.3)));
    const cam = t > 0.3 && t < 0.6 ? shakeCam(focus(675, 620, 1.35), T, 12) : focus(675, 620, 1.35);
    return { cam, layers: [Lr(1, elevatorBack(T) + elevatorDoors(gap, T) + (gap > 20 ? clawsGap(675 + gap / 2, 520, 1.2, T) : '')), Lr(1.05, torch(675, 600, 600, 0.6, 'h1'))], tint: DARK, over: hookBanner(T, 0) + comic(T, 1.4, 'BLAM!', 540, 700) };
  } },
  // 2 — Polo no chão, sem ar
  { t0: 2.0, draw(t, T) {
    const sq = 0.12 * Math.max(0, 1 - t / 0.3);
    return { cam: push(frameG(500, GROUND, 2.1, 1400), t, 1.5), layers: [Lr(1, elevatorBack(T) + elevatorDoors(0, T) + polo({ x: 500, y: GROUND, s: 0.62, t: T, face: 0.3, expr: 'worried', squash: sq, armL: 30, armR: 30, mouth: 0.3 + 0.2 * Math.sin(T * 9) })), Lr(1.05, torch(500, 700, 500, 0.7, 'h2'))], tint: DARK, over: hookBanner(T, 0) };
  } },
  // 3 — ergue a lanterna
  { t0: 3.3, draw(t, T) {
    const a = lerp(20, 95, E.back(clamp(t / 0.5)));
    return { cam: push(focus(520, 650, 2.6, 900), t, 1.4, 0.06), layers: [Lr(1, elevatorBack(T) + polo({ x: 500, y: GROUND, s: 0.62, t: T, face: 0.6, expr: 'worried', armR: a, bendR: -20, holdR: lantern() }) + beam(560, 640, 0, 700)), Lr(1.05, torch(640, 640, 480, 0.75, 'h3'))], tint: DARK };
  } },
  // 4 — o feixe revela o médico
  { t0: 4.7, draw(t, T) {
    const bx = lerp(500, 880, E.inOut(clamp(t / 1.2))) + Math.sin(T * 13) * 6;
    return { cam: dutch(push(frameG(640, GROUND, 1.12, 1460), t, 2.5, 0.1), -4, T), layers: [Lr(1, elevatorBack(T) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.5, expr: 'neutral' }) + poloTorch(360, 0.6, T)), Lr(1.05, torch(bx, 680, 330, 0.9, 'h4')), Lr(1.25, fgPillar(lerp(900, 640, t / 2.5)))], tint: DARK };
  } },
  // 5 — jaleco sujo: a seringa no bolso (pista)
  { t0: 7.2, draw(t, T) {
    const c = lerpCam(focus(880, 700, 2.6, 960), focus(860, 790, 4.2, 960), E.inOut(clamp(t / 2.4)));
    return { cam: c, layers: [Lr(1, elevatorBack(T) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.5, expr: 'neutral' })), Lr(1.05, torch(860, 760, 260, 0.85, 'h5'))], tint: DARK };
  } },
  // 6 — pede silêncio
  { t0: 9.9, draw(t, T) {
    return { cam: push(focus(880, 700, 3.0, 900), t, 1.7, 0.08), layers: [Lr(1, elevatorBack(T) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.3, expr: 'worried', armR: 150, bendR: 40, handR: 'point' })), Lr(1.05, torch(880, 690, 320, 0.85, 'h6'))], tint: DARK, over: comic(T, 10.4, 'SHHH...', 560, 560, { fill: '#e8e4f8', size: 90 }) };
  } },
  // 7 — "Estou preso aqui há anos"
  { t0: 11.6, draw(t, T) {
    return { cam: push(focus(860, 700, 3.4, 880), t, 2.1, 0.06), layers: [Lr(1, elevatorBack(T) + doc({ x: 860, y: GROUND, s: 0.64, t: T, face: -0.6, expr: 'sad', mouth: talk(T, DOCTALK) })), Lr(1.05, torch(860, 690, 300, 0.85, 'h7'))], tint: DARK };
  } },
  // 8 — sussurrou o médico (dois no quadro)
  { t0: 13.7, draw(t, T) {
    return { cam: push(frameG(640, GROUND, 1.12, 1460), t, 2, 0.05), layers: [Lr(1, elevatorBack(T) + poloTorch(400, 0.6, T, { expr: 'surprised' }) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.6, expr: 'sad' })), Lr(1.05, torch(700, 680, 520, 0.8, 'h8'))], tint: DARK };
  } },
  // 9 — a mão do velho vai ao painel
  { t0: 15.6, draw(t, T) {
    return { cam: push(frameG(700, GROUND, 1.1, 1460), t, 1.7, 0.06), layers: [Lr(1, elevatorBack(T) + buttonPanel(1150, 560, 0.7, 0) + doc({ x: 900, y: GROUND, s: 0.64, t: T, face: 0.7, expr: 'neutral', armR: lerp(10, 100, E.inOut(clamp(t / 1.4))), bendR: 0 }) + poloTorch(430, 0.6, T)), Lr(1.05, torch(860, 650, 520, 0.8, 'h9'))], tint: DARK };
  } },
  // 10 — aperta o S (subsolo)
  { t0: 17.3, draw(t, T) {
    const p = E.inOut(clamp(t / 0.6)), lit = t > 0.6 ? 1 : 0;
    const hand = `<g transform="translate(${f2(lerp(1320, 1160, p))} ${f2(lerp(760, 692, p))})"><path d="M 0 0 L 160 60" stroke="${OL}" stroke-width="46" stroke-linecap="round"/><path d="M 0 0 L 160 60" stroke="#eeeadc" stroke-width="34" stroke-linecap="round"/>${mitt(0, 0, 40, 15, '#efc9a8', 'point')}</g>`;
    return { cam: push(focus(1150, 640, 3.0), t, 2, 0.06), layers: [Lr(1, elevatorBack(T) + buttonPanel(1150, 560, 0.7, lit) + hand), Lr(1.05, torch(1150, 640, 380, 0.7, 'h10'))], tint: DARK, over: comic(T, 17.95, 'CLIQUE', 700, 560, { size: 80 }) };
  } },
  // 11 — desce rápido
  { t0: 19.4, draw(t, T) {
    return { cam: shakeCam(push(frameG(640, GROUND, 1.12, 1460), t, 1.7, 0.05), T, 3), layers: [Lr(1, elevatorBack(T) + poloTorch(400, 0.6, T, { expr: 'worried' }) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.3, expr: 'neutral' })), Lr(1.05, torch(640, 660, 560, 0.8, 'h11'))], tint: DARK };
  } },
  // 12 — o teto afunda
  { t0: 21.1, draw(t, T) {
    const dent = t > 1.0 ? Math.min(110, (t - 1.0) * 700) : 0, hit = t > 1.0 && t < 1.6;
    return { cam: shakeCam(push(frameG(640, GROUND, 1.12, 1460), t, 3), T, hit ? 18 : 2), layers: [Lr(1, elevatorBack(T, { dent }) + poloTorch(400, 0.6, T, { expr: dent ? 'surprised' : 'worried', jump: hit ? 20 : 0 }) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.3, expr: 'neutral' })), Lr(1.05, torch(640, 600, 600, 0.75, 'h12'))], tint: DARK, over: comic(T, 22.2, 'BAM!', 540, 420) };
  } },
  // 13 — a criatura em cima da cabine (poço)
  { t0: 24.1, draw(t, T) {
    if (t < 1.0) return { cam: dutch(lerpCam(focus(675, 560, 1.0), focus(675, 470, 1.25), E.inOut(clamp(t))), 6, T), layers: [Lr(0.6, shaftBg(T, 500)), Lr(1, cabinTop(675, 760, 900) + creature(675, 760, 0.62, T))], tint: DARK };
    return { cam: dutch(push(focus(686, 312, 5.0, 900), t - 1, 0.9, 0.08), -5, T), layers: [Lr(0.6, shaftBg(T, 500)), Lr(1, cabinTop(675, 760, 900) + creature(675, 760, 0.62, T))], tint: DARK };
  } },
  // 14 — o alçapão arrancado
  { t0: 26.0, draw(t, T) {
    const pull = E.back(clamp((t - 0.3) / 0.5));
    return { cam: shakeCam(push(focus(640, 600, 1.12), t, 2), T, pull < 1 ? 8 : 2), layers: [Lr(1, elevatorBack(T, { dent: 110, hatch: pull > 0.5 }) + `<g transform="translate(${f2(680 + pull * 60)} ${f2(318 - pull * 320)}) rotate(${f2(pull * 40)})"><rect x="-140" y="-18" width="280" height="34" fill="#5a6078" stroke="${OL}" stroke-width="5"/></g>` + poloTorch(400, 0.6, T, { expr: 'surprised', face: 0.2 }) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.2, expr: 'neutral' })), Lr(1.05, torch(675, 400, 520, 0.7, 'h14'))], tint: DARK, over: comic(T, 26.6, 'KRRAK!', 540, 400) };
  } },
  // 15 — o braço desce atrás do Polo
  { t0: 28.1, draw(t, T) {
    const r = E.inOut(clamp(t / 2.4)), ax = lerp(680, 470, r), ay = lerp(330, 660, r);
    const arm = `<path d="M 680 300 Q 620 ${f2(ay - 120)} ${f2(ax)} ${f2(ay)}" stroke="${OL}" stroke-width="40" fill="none" stroke-linecap="round"/><path d="M 680 300 Q 620 ${f2(ay - 120)} ${f2(ax)} ${f2(ay)}" stroke="#1d1726" stroke-width="26" fill="none" stroke-linecap="round"/><path d="M 676 300 Q 616 ${f2(ay - 124)} ${f2(ax - 6)} ${f2(ay)}" stroke="#8a9ad8" stroke-width="3" fill="none" opacity="0.5"/>` + [-24, -8, 8, 24].map(f => `<path d="M ${f2(ax + f * 0.6)} ${f2(ay)} q ${f2(f * 0.4 - 8)} 34 ${f2(f - 16)} 70" stroke="${OL}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M ${f2(ax + f * 0.6)} ${f2(ay)} q ${f2(f * 0.4 - 8)} 34 ${f2(f - 16)} 70" stroke="#1d1726" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M ${f2(ax + f * 1.6 - 16)} ${f2(ay + 70)} l -3 20" stroke="#d9cfbd" stroke-width="6" stroke-linecap="round"/>`).join('');
    return { cam: dutch(push(focus(480, 610, 2.3, 980), t, 3, 0.1), 7, T), layers: [Lr(1, elevatorBack(T, { dent: 110, hatch: 1 }) + poloTorch(400, 0.6, T, { expr: 'surprised', face: 0.8, armL: 60, bendL: 60, pale: 0.3 }) + arm), Lr(1.05, torch(450, 620, 400, 0.8, 'h15'))], tint: DARK };
  } },
  // 16 — só ele: o médico nem é tocado
  { t0: 31.2, draw(t, T) {
    return { cam: push(focus(860, 690, 2.6, 900), t, 2.4, 0.08), layers: [Lr(1, elevatorBack(T, { dent: 110, hatch: 1 }) + doc({ x: 860, y: GROUND, s: 0.64, t: T, face: -0.7, expr: 'neutral', lx: -1 }) + `<path d="M 680 300 Q 600 500 500 640" stroke="#2b2236" stroke-width="30" fill="none" opacity="0.8"/>`), Lr(1.05, torch(860, 680, 330, 0.85, 'h16'))], tint: DARK };
  } },
  // 17 — desvia e bate no botão de emergência
  { t0: 33.6, draw(t, T) {
    const dodge = E.back(clamp(t / 0.4));
    return { cam: shakeCam(push(frameG(680, GROUND, 1.08, 1460), t, 2.2), T, 4), layers: [Lr(1, elevatorBack(T, { dent: 110, hatch: 1 }) + buttonPanel(1150, 560, 0.7, 1) + poloTorch(lerp(470, 400, dodge), 0.6, T, { expr: 'angry', tilt: -10 * dodge }) + doc({ x: 880, y: GROUND, s: 0.64, t: T, face: -0.3, expr: 'neutral' })), Lr(1.05, torch(600, 650, 600, 0.75, 'h17'))], tint: DARK, over: comic(T, 34.9, 'BIP! BIP!', 600, 520, { size: 80, fill: '#ff7a45' }) };
  } },
  // 18 — força as portas
  { t0: 35.8, draw(t, T) {
    const gap = lerp(0, 300, E.inOut(clamp(t / 2.0)));
    return { cam: push(focus(675, 640, 2.0, 920), t, 2.3), layers: [Lr(1, `<rect x="-600" y="-400" width="2600" height="1800" fill="#2a3444"/>` + elevatorDoors(gap, T) + polo({ x: 675, y: GROUND, s: 0.62, t: T, back: true, armL: 90, armR: 90, bendL: 10, bendR: 10 })), Lr(1.05, torch(675, 620, 520, 0.75, 'h18'))], tint: DARK, over: comic(T, 36.6, 'NNNGH!', 540, 460, { size: 80 }) };
  } },
  // 19 — os dois rolam para fora
  { t0: 38.1, draw(t, T) {
    const p = clamp(t / 2.3), x = lerp(300, 820, p);
    return { cam: push(frameG(x - 80, GROUND, 1.2, 1460), t, 2.3), layers: [Lr(1, morgue(T) + `<rect x="0" y="330" width="320" height="580" fill="#0a0910" stroke="${OL}" stroke-width="8"/>` + `<g transform="translate(${f2(x)} ${GROUND - 60}) rotate(${f2(p * 720)}) translate(${f2(-x)} ${-GROUND + 60})">${polo({ x, y: GROUND, s: 0.55, t: T, expr: 'surprised', shadow: false })}</g>` + doc({ x: x - 200, y: GROUND, s: 0.6, t: T, face: 0.8, expr: 'neutral', walk: T * 7 })), Lr(1.05, torch(x, 650, 600, 0.6, 'h19'))], tint: DARK };
  } },
  // 20 — o elevador despenca no fosso
  { t0: 40.5, draw(t, T) {
    const y = 700 + Math.pow(clamp(t / 2.6), 2) * 2600;
    return { cam: shakeCam(focus(675, 700, 1.0), T, t > 2.2 ? 16 : 4), layers: [Lr(0.6, shaftBg(T, -300)), Lr(1, cabinTop(675, y, 760, 110, 1))], tint: DARK, over: comic(T, 42.6, 'CRASH!', 540, 760) };
  } },
  // 21 — a criatura salta atrás deles
  { t0: 43.1, draw(t, T) {
    const p = clamp(t / 1.6), sq = p < 0.15 ? 0.12 : (p > 0.95 ? 0.15 : -0.08);
    if (t > 1.7) return { cam: dutch(push(focus(900, 610, 2.4, 960), t - 1.7, 1, 0.1), 8, T), layers: [Lr(1, morgue(T) + creature(900, GROUND, 0.5, T, { reach: 0.3 }))], tint: DARK };
    return { cam: dutch(push(frameG(675, GROUND, 1.0, 1640), t, 2.7, 0.08), -6, T), layers: [Lr(1, morgue(T) + `<rect x="0" y="330" width="320" height="580" fill="#0a0910" stroke="${OL}" stroke-width="8"/>` + creature(lerp(160, 900, p), GROUND - Math.sin(p * Math.PI) * 330, 0.5, T, { squash: sq, reach: Math.sin(p * Math.PI) * 0.6 }))], tint: DARK, over: comic(T, 44.0, 'GRRR!', 700, 500, { fill: '#ff5a4a' }) };
  } },
  // 22 — corre pelo necrotério derrubando estantes
  { t0: 45.8, draw(t, T) {
    const ang = E.in(clamp((t - 0.55) / 0.45)) * 90;
    return { cam: push(frameG(600, GROUND, 1.8, 1440), t, 1.8), layers: [Lr(1, morgue(T, { scroll: T * 520 }) + shelf(900 - t * 520, -ang) + polo({ x: 600, y: GROUND, s: 0.6, t: T, side: true, face: 1, walk: T * 11, run: 1, expr: 'surprised' })), Lr(1.3, `<rect x="${f2(1400 - (T * 1600) % 2600)}" y="-200" width="120" height="1500" fill="#0c0f16" filter="url(#fgBlur)" opacity="0.9"/>`), Lr(1.05, torch(700, 700, 600, 0.6, 'h22'))], tint: DARK, over: comic(T, 46.7, 'CRASH!', 760, 560, { size: 90 }) };
  } },
  // 23 — close do rosto correndo
  { t0: 47.6, draw(t, T) {
    return { cam: push(focus(600, 640, 3.1, 860), t, 1.8, 0.05), layers: [Lr(1, morgue(T, { scroll: T * 520 }) + polo({ x: 600, y: GROUND, s: 0.6, t: T, side: true, face: 1, walk: T * 11, run: 1, expr: 'worried', mouth: 0.4 }))], tint: DARK };
  } },
  // 24 — lá atrás, os passos calmos do médico
  { t0: 49.3, draw(t, T) {
    return { cam: dutch(push(frameG(620, GROUND, 1.5, 1440), t, 2.1, 0.08), -3, T), layers: [Lr(1, morgue(T, { scroll: T * 60 }) + shelf(380 - t * 60, -90) + doc({ x: 620, y: GROUND, s: 0.62, t: T, side: true, face: 1, walk: T * 3.5, expr: 'neutral' })), Lr(1.3, fgPillar(1100 - t * 300))], tint: ['#2a3266', 0.34] };
  } },
  // 25 — pés calmos (detalhe) e a criatura na sombra
  { t0: 51.4, draw(t, T) {
    const ey = clamp((t - 0.6) / 0.4);
    return { cam: dutch(push(focus(700, 700, 2.2, 960), t, 2, 0.1), 5, T), layers: [Lr(1, morgue(T, { scroll: T * 60 }) + doc({ x: 620, y: GROUND, s: 0.62, t: T, side: true, face: 1, walk: T * 3.5, expr: 'smug' })), Lr(1.05, torch(620, 700, 300, 0.95, 'h25') + eyesInDark(900, 560, 0.8, T, ey))], tint: ['#2a3266', 0.36] };
  } },
  // 26 — a placa de SAÍDA brilha no fim do corredor
  { t0: 53.3, draw(t, T) {
    const g = 0.6 + 0.4 * Math.sin(T * 6);
    return { cam: lerpCam(focus(675, 640, 1.0), focus(675, 380, 2.4), E.inOut(clamp(t / 2.6))), layers: [Lr(1, exitDoor(T, 0) + exitSign(675, 250, 0.8, g)), Lr(1.05, torch(675, 300, 700, 0.5, 'h26'))], tint: DARK };
  } },
  // 27 — "Saída." Polo corre até a porta
  { t0: 55.9, draw(t, T) {
    const x = lerp(160, 520, clamp(t / 1.3));
    return { cam: push(frameG(560, GROUND, 1.3, 1460), t, 1.3), layers: [Lr(1, exitDoor(T, 0) + polo({ x, y: GROUND, s: 0.6, t: T, side: true, face: 1, walk: T * 11, run: 1, expr: 'happy' }))], tint: DARK };
  } },
  // 28 — abre a porta: a chuva no rosto
  { t0: 57.1, draw(t, T) {
    const op = E.out(clamp(t / 0.5));
    return { cam: push(frameG(620, GROUND, 1.5, 1440), t, 3.1), layers: [Lr(1, exitDoor(T, op, { flash: pulse(t, 0.3, 0.3) }) + polo({ x: 760, y: GROUND, s: 0.62, t: T, back: true, armR: lerp(90, 20, op), armL: 20 }))], tint: ['#2a3266', 0.2], over: comic(T, 58.6, 'SHHHHH', 540, 480, { fill: '#a8c4e8', size: 80 }) };
  } },
  // 29 — se vira para puxar o médico... e congela
  { t0: 60.2, draw(t, T) {
    const fz = t > 1.6;
    return { cam: push(focus(700, 640, fz ? 3.2 : 2.2, 880), t, 3.7, 0.04), layers: [Lr(1, exitDoor(T, 1) + polo({ x: 700, y: GROUND, s: 0.62, t: T, face: -0.6, expr: fz ? 'surprised' : 'worried', pale: fz ? 0.5 : 0, armL: fz ? 20 : 100, bendL: 20 }))], tint: ['#2a3266', 0.2] };
  } },
  // 30 — o médico parado no escuro
  { t0: 63.9, draw(t, T) {
    return { cam: dutch(push(frameG(675, GROUND, 1.4, 1440), t, 2, 0.1), -4, T), layers: [Lr(1, morgue(T) + doc({ x: 675, y: GROUND, s: 0.64, t: T, face: 0, expr: 'neutral' })), Lr(1.05, torch(675, 760, 300, 0.95, 'h30') + underLight(675, 900, 360, 'u30'))], tint: DARK };
  } },
  // 31 — "estava parado no escuro" (mais perto)
  { t0: 65.9, draw(t, T) {
    return { cam: dutch(push(focus(675, 720, 2.8, 960), t, 1.8, 0.1), 4, T), layers: [Lr(1, morgue(T) + doc({ x: 675, y: GROUND, s: 0.64, t: T, face: 0, expr: 'smug' })), Lr(1.05, torch(675, 760, 260, 0.95, 'h31') + underLight(675, 860, 300, 'u31'))], tint: DARK };
  } },
  // 32 — gira a seringa entre os dedos
  { t0: 67.7, draw(t, T) {
    return { cam: push(focus(700, 740, 3.6, 900), t, 2.5, 0.05), layers: [Lr(1, morgue(T) + doc({ x: 675, y: GROUND, s: 0.64, t: T, face: 0, expr: 'smug', noSyringe: 1, armR: 70, bendR: 80, holdR: syringe(20 + Math.sin(T * 3.2) * 28, 0.9) })), Lr(1.05, torch(700, 740, 280, 0.9, 'h32'))], tint: DARK };
  } },
  // 33 — a criatura chega
  { t0: 70.2, draw(t, T) {
    const x = lerp(1500, 940, E.out(clamp(t / 1.5)));
    return { cam: dutch(push(frameG(780, GROUND, 1.0, 1640), t, 1.8, 0.06), -7, T), layers: [Lr(1, morgue(T) + doc({ x: 620, y: GROUND, s: 0.58, t: T, face: 0, expr: 'smug', noSyringe: 1, armR: 70, bendR: 80, holdR: syringe(20 + Math.sin(T * 3.2) * 28, 0.9) }) + creature(x, GROUND + 40, 0.62, T))], tint: DARK };
  } },
  // 34 — e para mansamente atrás dele
  { t0: 72.0, draw(t, T) {
    return { cam: push(frameG(700, GROUND, 1.2, 1500), t, 1.8), layers: [Lr(1, morgue(T) + creature(820, GROUND, 0.5, T, { calm: 1 }) + doc({ x: 640, y: GROUND, s: 0.6, t: T, face: 0.2, expr: 'happy', noSyringe: 1, armR: 70, bendR: 80, holdR: syringe(20 + Math.sin(T * 3.2) * 28, 0.9) }))], tint: DARK };
  } },
  // 35 — como um cão de guarda (o médico afaga a garra)
  { t0: 73.8, draw(t, T) {
    return { cam: push(focus(760, 520, 1.9, 900), t, 2.1, 0.06), layers: [Lr(1, morgue(T) + creature(820, GROUND, 0.5, T, { calm: 1 }) + doc({ x: 640, y: GROUND, s: 0.6, t: T, face: 0.6, expr: 'happy', armR: 150, bendR: -10, handR: 'open' }))], tint: DARK, over: comic(T, 74.5, '♥', 700, 420, { fill: '#ff7a9a', size: 100 }) };
  } },
  // 36 — a porta bate na cara do Polo
  { t0: 75.9, draw(t, T) {
    const op = lerp(1, 0, E.in(clamp(t / 0.35)));
    return { cam: shakeCam(push(frameG(675, GROUND, 1.35, 1450), t, 2.8), T, t > 0.33 && t < 0.6 ? 16 : 0), layers: [Lr(1, exitDoor(T, op, { keyhole: 1 }))], tint: ['#2a3266', 0.24], over: comic(T, 76.3, 'BAM!', 540, 560) };
  } },
  // 37 — uma chave gira
  { t0: 78.7, draw(t, T) {
    const a = E.back(clamp(t / 0.6)) * 90;
    return { cam: focus(675 + 80, 640, 3.6), layers: [Lr(1, exitDoor(T, 0, { keyhole: 1 }) + `<g transform="translate(755 640) rotate(${f2(a)})"><rect x="-6" y="-40" width="12" height="44" fill="#c8a050" stroke="${OL}" stroke-width="3"/><circle cx="0" cy="-48" r="16" fill="#c8a050" stroke="${OL}" stroke-width="4"/></g>`)], tint: ['#2a3266', 0.24], over: comic(T, 79.2, 'CLIC.', 540, 520, { size: 80 }) };
  } },
  // 38 — o médico sorri
  { t0: 79.7, draw(t, T) {
    return { cam: dutch(push(focus(675, 700, 4.2, 900), t, 2.8, 0.1), -5, T), layers: [Lr(1, morgue(T) + doc({ x: 675, y: GROUND, s: 0.64, t: T, face: 0, expr: t > 0.8 ? 'smug' : 'neutral', noSyringe: 1 })), Lr(1.05, torch(675, 720, 260, 0.95, 'h38') + underLight(675, 820, 260, 'u38'))], tint: DARK };
  } },
  // 39 — "Obrigado por trazer..."
  { t0: 82.5, draw(t, T) {
    return { cam: push(frameG(700, GROUND, 1.25, 1480), t, 1.8, 0.05), layers: [Lr(1, morgue(T) + creature(860, GROUND, 0.5, T, { calm: 1 }) + doc({ x: 640, y: GROUND, s: 0.62, t: T, face: 0, expr: 'smug', mouth: talk(T, DOCTALK), noSyringe: 1, armR: 70, bendR: 80, holdR: syringe(10, 0.9) }))], tint: DARK };
  } },
  // 40 — "...um novo paciente."
  { t0: 84.3, draw(t, T) {
    return { cam: dutch(push(focus(675, 690, 4.4, 880), t, 2.1, 0.12), 6, T), layers: [Lr(1, morgue(T) + doc({ x: 675, y: GROUND, s: 0.64, t: T, face: 0, expr: 'smug', mouth: talk(T, DOCTALK), noSyringe: 1 })), Lr(1.05, torch(675, 720, 250, 0.95, 'h40') + underLight(675, 820, 260, 'u40'))], tint: DARK };
  } },
  // 41 — a lanterna se apaga
  { t0: 86.4, draw(t, T) {
    const on = t < 1.0 || (t < 1.3 && Math.floor(t * 20) % 2);
    return { cam: dutch(push(focus(560, 640, 3.0, 860), t, 1.9, 0.08), on ? 3 : 0, T), layers: [Lr(1, exitDoor(T, 0) + poloTorch(560, 0.62, T, { expr: 'surprised', pale: 0.4, on })), Lr(1.05, (on ? torch(560, 620, 360, 0.85, 'h41') : darkBg('#05040a')) + (on ? '' : eyesInDark(600, 600, 0.45, T, clamp((t - 1.3) / 0.3))))], tint: DARK, over: comic(T, 87.4, 'click', 540, 520, { size: 70, fill: '#d0d0e0' }) };
  } },
  // 42 — Hospital Santa Clara (fachada na chuva)
  { t0: 88.3, draw(t, T) {
    return { cam: lerpCam(focus(675, 520, 1.25), focus(675, 560, 0.95), E.inOut(clamp(t / 2.3))), layers: [Lr(1, hospitalFacade(T))], tint: ['#2a3266', 0.2] };
  } },
  // 43 — loop: volta ao close do Polo com o banner + pedido de comentário
  { t0: 90.6, draw(t, T) {
    return { cam: focus(560, 640, 3.0, 860), layers: [Lr(1, elevatorBack(T) + elevatorDoors(960, T) + poloTorch(560, 0.62, T, { expr: 'surprised', face: 0.4 })), Lr(1.05, torch(560, 620, 420, 0.75, 'hz'))], tint: DARK,
      over: hookBanner(T, 90.6) + `<g transform="translate(540 1560)"><text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="62" fill="#ffd23f" stroke="#211c26" stroke-width="12" paint-order="stroke">Comenta: MÉDICO ou CRIATURA?</text></g>` };
  } },
);
