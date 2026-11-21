// Shot list v3 — hook, faster cutting (2.5–3 s), side-view walks, emotion symbols, livelier sets, clearer story beats.
const plazaPigeons = (T, t, fly) => pigeon(1020, 980, t, 3, 0.8, fly) + pigeon(1110, 990, t, 4, 0.8, fly) + pigeon(560, 1000, t, 5, 0.8, fly);

const SHOTS = [];
// H1 — hook: the crazy clock, flash-forward ("Nesta cidade,"); also reused as the loop-back ending
function hookClock(t, T) {
  {
    const ang = T * 2600, day = 9;
    const cam = { ...focus(960, 560, lerp(1.05, 1.25, E.out(clamp(t / 1.3)))), r: Math.sin(t * 5) * 6 };
    return { cam, layers: [Lr(0.05, sky('#3a3a7a', '#f2a46a', { id: 'h1', stars: 0.4, t })), Lr(0.15, clouds(T * 6, '#fff6ea', 0.6, 13, 0)),
      Lr(1, `<path d="M 960 -360 L 380 120 L 1540 120 Z" fill="#3c6a5a" stroke="${INK}" stroke-width="8"/><rect x="560" y="900" width="800" height="900" fill="#a85a3a" stroke="${INK}" stroke-width="8"/><rect x="560" y="900" width="800" height="900" fill="url(#pBrick)"/>` + clockFace(960, 560, 390, ang / 12, ang, { day: `${day} DIAS`, blur: 1, glow: 0.8 }))],
      over: speedLines(540, 960, 14, 380, (T * 500) % 360, 0.4, Math.floor(T * 15)) + (T >= 0 ? comic(T, 0.05, 'TIC-TIC-TIC', 540, 1240, { size: 96, life: 1.25 }) : '') };
  }
}
SHOTS.push(
  { t0: 0, draw(t, T) { return hookClock(t, T); } },
  // H2 — "quem diz já volto": Polo waves at the camera from the bakery door
  { t0: 1.3, draw(t, T) {
    const waveA = wave(T, 1.45, 2.9, 165, 22);
    const polo = P_('polo', { x: 470, y: 905, s: 0.72, t: T, face: 0.05, expr: 'happy', armR: waveA != null ? waveA : 20, bendR: 25, mouth: talk(T, [[1.6, 2.4]]) });
    return { cam: push(frameG(450, 905, 2.5, 1460), t, 1.6, 0.08), layers: [...backA(t, ['#f2b06a', '#f8e2b8']),
      Lr(1, bakeryFacade(-200, 900, { t: T, sign: false }) + hangSign(285, 745, 'JÁ VOLTO', Math.sin(T * 2) * 3, { w: 176, h: 62, fs: 28 }) + polo)] };
  } },
  // H3 — "nunca volta!": snap zoom to the forgotten, dusty sign
  { t0: 2.9, draw(t, T) {
    const p = E.out(clamp(t / 0.35));
    const cam = lerpCam(focus(1545, 690, 1.6), focus(1545, 645, 3.0), p);
    return { cam: { ...cam, r: (1 - p) * -4 }, layers: [...backA(t, ['#e8a868', '#f6dcb0']),
      Lr(1, streetARow(T, { oldAng: Math.sin(T * 2.1) * 7, fly: 3.1 }) + dust(T, 1380, 500, 340, 400, 26, 2))],
      over: '' };
  } },
  // 2a — bakery two-shot: Polo with the note
  { t0: 4.0, draw(t, T) {
    const polo = P_('polo', { x: 660, y: 900, s: 0.62, t: T, face: -0.45, lx: -0.6, armR: 60, bendR: 70, holdR: `<g transform="rotate(-20)">${note10()}</g>`, expr: 'happy' });
    const pad = P_('padeira', { x: 330, y: 900, s: 0.66, t: T, face: 0.5, lx: 0.6, expr: 'happy', armL: 30, armR: 40, bendL: 50, bendR: 50, mouth: talk(T, [[4.3, 4.9]]) * 0.5 });
    return { cam: push(frameG(500, 900, 1.5, 1450), t, 1.9, 0.07), layers: [
      Lr(0.9, bakeryInterior(T, { hour: 270, min: 0, clockX: 1150, clockY: 170 })),
      Lr(1, pad + counter(-260, 812, 820) + basket(80, 795, 0.9) + basket(420, 798, 0.8) + polo)] };
  } },
  // 2b — close: the note goes in the pocket
  { t0: 5.9, draw(t, T) {
    const pocket = E.inOut(inv(6.05, 6.5, T));
    const polo = P_('polo', { x: 660, y: 900, s: 0.62, t: T, face: 0.2, lx: 0.3, ly: 0.6, armR: lerp(60, 14, pocket), bendR: lerp(70, 40, pocket), holdR: T < 6.4 ? `<g transform="rotate(-20)">${note10()}</g>` : '', expr: 'happy' });
    return { cam: push(focus(670, 900 - 0.62 * 170, 4.2, 1000), t, 0.9, 0.05), layers: [Lr(0.9, bakeryInterior(T, { hour: 270, min: 0, clockX: 1150, clockY: 170 })), Lr(1, polo)],
      over: emote('sparkle', 0, 0, -1) };
  } },
  // 2c — walks to the door (side view), turns: "já volto!"
  { t0: 6.8, draw(t, T) {
    const walkT = inv(6.85, 7.7, T);
    const px = lerp(700, 1580, E.inOut(walkT));
    const turned = T > 7.7;
    const waveA = wave(T, 7.76, 8.65, 165, 20);
    const tn = pulse(T, 7.7, 0.1);
    const polo = turned ? P_('polo', { x: px, y: 900, s: 0.62, t: T, face: -0.55, lx: -1, armR: waveA != null ? waveA : 14, bendR: 25, expr: 'happy', mouth: talk(T, [[7.76, 8.3]]), turn: tn })
      : P_('polo', { x: px, y: 900, s: 0.62, t: T, face: 0.8, side: true, walk: T * 13, expr: 'happy', turn: tn });
    return { cam: frameG(px, 900, 2.15, 1420), layers: [
      Lr(0.9, bakeryInterior(T, { hour: 270, min: 0, doorOpen: E.out(inv(7.25, 7.8, T)), clockX: 1150, clockY: 170 })), Lr(1, polo)] };
  } },
  // 3 — he only went to buy bread (side-view walk)
  { t0: 8.7, draw(t, T) {
    const px = 640 + t * 150;
    const bub = E.back(inv(8.95, 9.35, T));
    const polo = P_('polo', { x: px, y: 900, s: 0.62, t: T, face: 0.8, side: true, walk: T * 12, expr: 'happy' });
    return { cam: frameG(px + 20, 900, 2.3, 1420), layers: [...backA(t, ['#f2b06a', '#f8e2b8']),
      Lr(1, streetARow(T, {}) + polo + thought(px + 70, 560, bub * 0.75, bread({ s: 0.9 }), bub)),
      Lr(1.35, Array.from({ length: 30 }, (_, i) => `<g transform="translate(${i * 150} 990)"><rect x="-6" y="-110" width="12" height="120" fill="#a46a3a" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-90" width="150" height="12" fill="#c08a5a" stroke="${INK}" stroke-width="3"/><rect x="-4" y="-50" width="150" height="12" fill="#c08a5a" stroke="${INK}" stroke-width="3"/></g>`).join(''))] };
  } },
  // 4 — five minutes, then an hour
  { t0: 10.7, draw(t, T) {
    let min = 0;
    for (let i = 0; i < 5; i++) min += ramp(T, 11.2 + i * 0.22, 11.32 + i * 0.22, 0, 6, E.back);
    min += ramp(T, 12.45, 13.35, 0, 360, E.inOut);
    let wall = `<rect x="-400" y="-600" width="2800" height="2400" fill="#f0d8a8"/><rect x="-400" y="-600" width="2800" height="2400" fill="url(#pStripes)"/>`;
    const beam = lerp(-200, 260, inv(10.7, 13.6, T));
    wall += `<path d="M ${300 + beam} -600 L ${800 + beam} -600 L ${1300 + beam} 1800 L ${700 + beam} 1800 Z" fill="#fff6d8" opacity="0.3"/>`;
    return { cam: push(focus(960, 560, 0.92), t, 2.9, 0.08), layers: [Lr(0.6, wall), Lr(1, clockFace(960, 560, 340, 240 + min / 12, min) + `<path d="M 960 180 L 960 -600" stroke="${INK}" stroke-width="6"/>`)],
      over: [0, 1, 2, 3, 4].map(i => comic(T, 11.2 + i * 0.22, i % 2 ? 'TAC' : 'TIC', i % 2 ? 790 : 290, 1180 + (i % 2) * 40, { size: 80, life: 0.3, rot: i % 2 ? 8 : -8 })).join('') + comic(T, 12.5, 'ZUUUM', 540, 1230, { size: 100, life: 0.85, fill: '#ffffff' }) };
  } },
  // 5 — the baker: "esse aí já era"
  { t0: 13.6, draw(t, T) {
    const look = T < 15.6;
    const shrug = E.back(inv(15.8, 16.25, T)) * (1 - E.inOut(inv(16.8, 17.1, T)) * 0.3);
    const pad = P_('padeira', { x: 820, y: 900, s: 0.66, t: T, face: look ? 0.7 : 0.05, lx: look ? 1 : 0, ly: look ? -0.2 : 0, expr: look ? 'neutral' : 'smug',
      armL: lerp(18, 80, shrug), armR: lerp(18, 80, shrug), bendL: lerp(12, 80, shrug), bendR: lerp(12, 80, shrug), mouth: talk(T, [[15.76, 16.75]]), squash: -0.02 * shrug });
    const punch = 1 + 0.18 * E.out(inv(15.7, 15.9, T));
    const c = push(focus(820, 900 - 0.66 * 300, 3.0, 900), t, 3.5, 0.06);
    return { cam: { ...c, z: c.z * punch }, layers: [Lr(0.85, bakeryInterior(T, { clock: false, doorOpen: 1 })), Lr(1, pad + counter(560, 812, 600) + basket(700, 795, 0.9) + basket(1000, 798, 0.8) + emote('q', 900, 560, T - 14.3, 0.9))] };
  } },
  // 6a — a street full of "JÁ VOLTO" signs (pan)
  { t0: 17.1, draw(t, T) {
    return { cam: frameG(lerp(-560, 300, E.inOut(inv(17.1, 18.6, T))), 900, 1.2, 1480), layers: [...backA(t, ['#a8cce0', '#f6ecd0']), Lr(1, streetARow(T, { signs: true, walkers: true }))] };
  } },
  // 6b — close on a swinging sign with the cat watching
  { t0: 18.6, draw(t, T) {
    return { cam: push(focus(-240 + 220 + 65, 700, 3.0), t, 1.2, 0.06), layers: [...backA(t, ['#a8cce0', '#f6ecd0']), Lr(1, streetARow(T, { signs: true }))] };
  } },
  // 6c — neighbours nod: everybody has heard it
  { t0: 19.8, draw(t, T) {
    const nod = T > 19.9 && T < 21.8 ? Math.sin((T - 19.8) * 7) * 5 : 0;
    const people = bench(1580, 960, 0.7) + P_('viz3', { x: 1560, y: 950, s: 0.6, t: T, face: -0.3, expr: 'happy', headTilt: -nod, armL: 30, armR: 30, bendL: 60, bendR: 60 }) +
      P_('viz2', { x: 1700, y: 960, s: 0.6, t: T, face: -0.5, expr: 'neutral', headTilt: nod }) + P_('viz1', { x: 1430, y: 960, s: 0.6, t: T, face: 0.5, expr: 'happy', headTilt: nod, mouth: talk(T, [[20.3, 21]]) * 0.5 });
    return { cam: push(frameG(1570, 960, 2.0, 1430), t, 2.5, 0.06), layers: [...backA(t, ['#a8cce0', '#f6ecd0']), Lr(1, streetARow(T, { signs: true }) + people)] };
  } },
  // 7 — day 2: mother searching (side-view walk, sweat)
  { t0: 22.3, xf: 0.4, draw(t, T) {
    const mx = 500 + t * 110;
    const sv = Math.sin(T * 1.9), lookBack = sv > 0.6, tn = clamp(1 - Math.abs(sv - 0.6) * 9);
    const mae = lookBack ? P_('mae', { x: mx, y: 930, s: 0.66, t: T, face: -0.5, lx: -1, armR: 150, bendR: 95, expr: 'worried', turn: tn }) : P_('mae', { x: mx, y: 930, s: 0.66, t: T, face: 0.8, side: true, walk: T * 8, expr: 'worried', turn: tn });
    return { cam: push(frameG(mx, 930, 2.25, 1420), t, 3.2, 0.05), layers: [...backC(t), Lr(1, streetC(t) + walkers(t, 945, 0.4, 41, 3, 3200) + lamp(300, 930, 1) + bench(820, 935, 0.8) + mae + emote('sweat', mx + 50, 930 - 0.66 * 1.05 * 390, (t % 1.6), 1))] };
  } },
  // 8a — she hears the bus
  { t0: 25.5, draw(t, T) {
    const mae = P_('mae', { x: 330, y: 960, s: 0.66, t: T, face: 0.7, lx: 1, expr: T > 26.2 ? 'surprised' : 'worried', armL: 10, armR: 150, bendR: 95 });
    const bx = kf(T, [[25.5, -1100], [27.3, -200]], E.lin);
    return { cam: push(frameG(380, 960, 2.0, 1420), t, 1.8, 0.05), layers: [...backC(t), Lr(1, streetC(t, 880) + lamp(1500, 880, 1) + mae + bus(bx, 1000, { t: T, wheel: T * 400, passengers: ['', '', '', '', ''] }) + emote('excl', 380, 960 - 0.66 * 1.05 * 420, T - 26.2, 1.1))],
      over: comic(T, 25.75, 'VRUUUM!', 540, 560, { size: 100, life: 1.1, rot: -5, fill: '#ffffff' }) };
  } },
  // 8b — Polo in the window, masked, waving
  { t0: 27.3, draw(t, T) {
    const bx = kf(T, [[27.3, -200], [31.0, 900]], E.lin);
    const winX = bx + 30 + 2 * 128 + 55, winY = 1000 - 300 + 40 + 50;
    const waveA = wave(T, 28.3, 31, 165, 22);
    const pol = P_('polo', { t: T, face: -0.3, expr: 'happy', armR: waveA != null ? waveA : 10, bendR: 30, lx: -1, shadow: false }) + `<path d="M -50 -300 Q -40 -330 0 -332 Q 40 -330 50 -300 L 44 -262 Q 0 -246 -44 -262 Z" fill="#b8dcec" stroke="${INK9}" stroke-width="4"/><path d="M -50 -298 L -76 -318 M 50 -298 L 76 -318" stroke="#e8f4f8" stroke-width="4"/><path d="M -34 -290 H 34 M -32 -276 H 32" stroke="#88b8d0" stroke-width="3"/>`;
    const pass = [P_('viz2', { t: T, face: 0.3, blink: 0.9, shadow: false }), P_('viz1', { t: T, face: -0.3, expr: 'happy', shadow: false }), pol, P_('moca', { t: T, face: 0.4, shadow: false }), ''];
    return { cam: focus(winX, winY, lerp(2.4, 3.4, E.out(inv(27.3, 28.0, T))), 860), layers: [...backC(t), Lr(1, streetC(t, 880) + bus(bx, 1000, { t: T, wheel: T * 400, passengers: pass, driver: P_('motorista', { t: T, face: 0.6, shadow: false }), pT: 'translate(55 178) scale(0.36)', dT: 'translate(66 178) scale(0.36)' }) + speedLines(bx - 40, 820, 6, 120, 0, 0.6, Math.floor(T * 8)))] };
  } },
  // 9a — she shouts
  { t0: 31.0, draw(t, T) {
    const mae = P_('mae', { x: 400, y: 960, s: 0.66, t: T, face: 0.6, lx: 1, expr: 'surprised', mouth: T > 31.38 ? 0.9 : 0, armL: T > 31.3 ? 70 : 12, armR: T > 31.3 ? 70 : 12, bendL: 60, bendR: 60, squash: T > 31.38 ? 0.03 : 0 });
    return { cam: push(focus(400, 960 - 0.66 * 1.05 * 320, 3.2, 900), t, 1.7, 0.08), layers: [...backC(t), Lr(1, streetC(t, 880) + mae + emote('shock', 400, 960 - 0.66 * 1.05 * 322 - 80, T - 31.38, 0.66 * 1.05))],
      over: comic(T, 31.38, 'POLOOO!', 540, 520, { size: 120, life: 1.2, fill: '#ff8a5a' }) };
  } },
  // 9b — runs, raises her arms; the bus doesn't stop
  { t0: 32.7, draw(t, T) {
    const bx = 1180 + t * 430;
    const run = T < 34.7;
    const mx = 380 + 380 * E.inOut(inv(32.7, 34.9, T));
    const tn = pulse(T, 34.7, 0.1);
    const mae = run ? P_('mae', { x: mx, y: 960, s: 0.66, t: T, face: 0.8, side: true, run: true, walk: T * 16, armFront: 165 + Math.sin(T * 16) * 10, armBack: 160, expr: 'surprised', mouth: talk(T, [[32.74, 33.4]]) * 0.6, turn: tn })
      : P_('mae', { x: mx, y: 960, s: 0.66, t: T, face: 0.6, lx: 1, armL: lerp(168, 12, E.inOut(inv(34.9, 35.4, T))), armR: lerp(168, 12, E.inOut(inv(34.9, 35.4, T))), expr: 'sad', turn: tn });
    const puff = Array.from({ length: 5 }, (_, i) => { const ph = (T * 1.5 + i / 5) % 1; return `<circle cx="${f2(bx - 20 - ph * 200)}" cy="${f2(960 - ph * 40)}" r="${f2(14 + ph * 34)}" fill="#e0dcd6" opacity="${f2(0.6 * (1 - ph))}"/>`; }).join('');
    return { cam: frameG(mx + 160, 960, 1.4, 1440), layers: [...backC(t), Lr(1, streetC(t, 880) + puff + bus(bx, 1000, { t: T, wheel: T * 500, passengers: ['', '', '', '', ''], driver: P_('motorista', { t: T, face: 0.6, shadow: false }), dT: 'translate(66 178) scale(0.36)' }) + mae + emote('sweat', mx - 40, 960 - 0.66 * 1.05 * 400, (t % 1.2), 1))],
      over: comic(T, 34.3, 'VRUUM...', 640, 640, { size: 80, life: 1.0, fill: '#ffffff', rot: 6 }) };
  } },
  // 10a — driver waves back
  { t0: 35.5, draw(t, T) { return driverShot(t, T, push(focus(985, 560, 1.15), t, 2.7, 0.06)); } },
  // 10b — close: "já volto também" + wink
  { t0: 38.2, draw(t, T) { return driverShot(t, T, push(focus(985, 1100 - 1.55 * 1.05 * 330, 2.2), t, 1.4, 0.06), true); } },
  // 11 — day 3: a giant clock appears
  { t0: 39.6, xf: 0.4, draw(t, T) {
    const rise = E.back(inv(40.9, 42.1, T));
    const shake = T > 42.0 && T < 42.4 ? Math.sin(T * 90) * 8 * (1 - inv(42.0, 42.4, T)) : 0;
    const surprised = T > 41.6;
    const crowd = [['barnabe', 1120], ['menino', 1230], ['mulher', 1470], ['moca', 1580]].map(([id, x], i) => P_(id, { x, y: 960, s: 0.42, t: T, face: x < 1350 ? 0.6 : -0.6, lx: x < 1350 ? 1 : -1, ly: surprised ? -1 : 0, expr: surprised ? 'surprised' : 'happy', armL: surprised ? 70 : 10, armR: surprised ? 70 : 10, jump: surprised ? 20 * pulse(T, 41.9 + i * 0.07, 0.2) : 0 }) + emote('excl', x, 960 - 0.42 * 420, T - 41.65 - i * 0.05, 0.5)).join('');
    const cloud = T > 40.9 ? Array.from({ length: 9 }, (_, i) => { const ph = clamp((T - 40.9) / 1.6); return `<circle cx="${f2(1350 + (i - 4) * 50 * (0.6 + ph))}" cy="${f2(890 - ph * 40 - (i % 3) * 20)}" r="${f2(30 + ph * 40)}" fill="#f4ead4" opacity="${f2(0.85 * (1 - ph))}"/>`; }).join('') : '';
    const c = lerpCam(focus(1350, 760, 1.25), focus(1350, 560, 1.05), E.inOut(inv(40.6, 42.4, T)));
    return { cam: { ...c, y: c.y + shake }, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + tower(T, 1350, 0.8, { rise }) + cloud + crowd + pigeon(1240, 990, t, 3, 0.6, 41.0) + pigeon(1460, 985, t, 4, 0.6, 41.0))],
      over: comic(T, 42.05, 'BLÉM!', 540, 380, { size: 130, life: 1.0, fill: '#ffd23f', rot: 6 }) };
  } },
  // 12 — nobody knows who put it there
  { t0: 43.1, draw(t, T) {
    const sc = Math.sin(T * 12) * 8;
    const grp = P_('barnabe', { x: 1180, y: 960, s: 0.5, t: T, face: 0.4, expr: 'worried', armL: 150 + sc, bendL: 80, ly: -0.6 }) +
      P_('menino', { x: 1290, y: 960, s: 0.5, t: T, face: -0.2, expr: 'worried', armL: 80, armR: 80, bendL: 70, bendR: 70, ly: -1 }) +
      P_('mulher', { x: 1420, y: 960, s: 0.5, t: T, face: -0.5, expr: 'neutral', armR: 150 - sc, bendR: 80, lx: -1 }) +
      P_('moca', { x: 1530, y: 960, s: 0.5, t: T, face: -0.4, expr: 'worried', armL: 60, armR: 60, bendL: 60, bendR: 60, headTilt: Math.sin(T * 3) * 6 });
    const qs = [1180, 1290, 1420, 1530].map((x, i) => emote('q', x + 20, 960 - 0.5 * 430, T - 43.2 - i * 0.1, 0.55)).join('');
    return { cam: push(frameG(1355, 960, 1.55, 1420), t, 1.6, 0.05), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 1350, 0.8)), Lr(1, grp + qs)] };
  } },
  // 13 — the hand only moves when someone says "já volto"
  { t0: 44.7, draw(t, T) {
    const ca = clockAngles(T), S = plazaSky(T);
    const kick = pulse(T, 46.95, 0.25);
    const c = push(focus(960, 560, 0.8), t, 3.3, 0.1);
    return { cam: { ...c, z: c.z + kick * 0.04 }, layers: [Lr(0.05, sky(S.top, S.bot, { id: 'p13' })), Lr(0.15, clouds(T, '#fff6ea', 0.8, 13, 0)),
      Lr(1, `<path d="M 960 -360 L 380 120 L 1540 120 Z" fill="#3c6a5a" stroke="${INK}" stroke-width="8"/><rect x="560" y="900" width="800" height="900" fill="#a85a3a" stroke="${INK}" stroke-width="8"/><rect x="560" y="900" width="800" height="900" fill="url(#pBrick)"/>` + clockFace(960, 560, 390, ca.hour, ca.min, { day: `${ca.days} DIAS`, glow: kick }))],
      over: comic(T, 46.9, 'TÉC!', 540, 1260, { size: 120, life: 0.7 }) };
  } },
  // 14a — Barnabé (medium)
  { t0: 48.0, draw(t, T) { return barnabeShot(t, T, push(frameG(640, 1000, 1.7, 1420), t, 2.5, 0.06)); } },
  // 14b — close: he jokes "já volto"
  { t0: 50.5, draw(t, T) { return barnabeShot(t, T, push(focus(620, 1000 - 0.85 * 1.02 * 320, 3.0, 900), t, 2.3, 0.06)); } },
  // 14c — the clock jumps two hours
  { t0: 52.8, draw(t, T) { return barnabeShot(t, T, focus(760, 880 - 720 * 0.6, lerp(2.4, 2.7, E.out(clamp(t / 0.8))))); } },
  // 14d — Barnabé stunned
  { t0: 53.7, draw(t, T) { return barnabeShot(t, T, push(focus(620, 1000 - 0.85 * 1.02 * 320, 2.7, 900), t, 0.6, 0.05)); } },
  // 15 — the boy: a whole day goes by
  { t0: 54.3, draw(t, T) {
    const shout = T > 55.8 && T < 56.4;
    const boy = P_('menino', { x: 600, y: 1000, s: 1.15, t: T, face: T > 56.5 ? 0.5 : 0.1, ly: T > 56.5 ? -1 : 0, lx: T > 56.5 ? 1 : 0, expr: shout ? 'laugh' : (T > 56.5 ? 'surprised' : 'happy'),
      armL: shout ? 165 : (T > 56.5 ? 80 : 12), armR: shout ? 165 : (T > 56.5 ? 80 : 12), bendL: 15, bendR: 15, mouth: shout ? 1 : 0, jump: 26 * pulse(T, 56.0, 0.25) });
    const up = E.inOut(inv(56.6, 57.3, T));
    const cam = lerpCam(push(frameG(620, 1000, 1.9, 1420), t, 2.3, 0.06), focus(720, 400, 1.2), up);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { blur: clamp(spinSpeed(T) / 20), glow: pulse(T, 57.2, 0.6) })), Lr(1, lamp(400, 1000, 0.9, plazaSky(T).night) + boy + emote('sparkle', 620, 1000 - 1.15 * 0.72 * 400, T - 57.4, 0.8))],
      tint: nightTint(T), over: comic(T, 56.8, 'VUUUSH', 540, 1200, { size: 110, life: 0.9, fill: '#ffffff' }) };
  } },
  // 16 — woman in glasses: three "já volto"
  { t0: 58.0, draw(t, T) {
    const calls = [59.88, 60.40, 60.94];
    let flick = 0; for (const c of calls) flick = Math.max(flick, pulse(T, c + 0.1, 0.18));
    const wom = P_('mulher', { x: 600, y: 1000, s: 0.85, t: T, face: 0.2, expr: 'laugh', mouth: 0.6, armL: 40 + flick * 110, bendL: 30, armR: 30, bendR: 60, tilt: Math.sin(T * 9) * 3 + flick * 4 });
    const kick = calls.reduce((a, c) => a + pulse(T, c + 0.05, 0.12) * 0.06, 0);
    const c = push(frameG(640, 1000, 1.7, 1420), t, 3.7, 0.08);
    return { cam: { ...c, z: c.z * (1 + kick) }, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { glow: flick * 0.8 })), Lr(1, bench(560, 1010, 0.9) + wom + emote('heart', 660, 1000 - 0.85 * 420, (t % 1.4), 0.8))],
      tint: nightTint(T), over: calls.map((c, i) => comic(T, c + 0.05, 'TÉC!', [300, 780, 540][i], [1150, 1100, 1220][i], { size: 90, life: 0.45, rot: [-10, 8, -4][i] })).join('') };
  } },
  // 17a — a girl, medium
  { t0: 61.7, draw(t, T) { return mocaShot(t, T, push(frameG(620, 1000, 1.8, 1420), t, 1.6, 0.06)); } },
  // 17b — close whisper, then time goes crazy (strongest move)
  { t0: 63.3, draw(t, T) {
    const p = E.inOut(inv(64.9, 66.6, T)), back = E.inOut(inv(67.9, 68.6, T));
    const c0 = push(focus(600, 1000 - 0.95 * 0.95 * 320, 3.2, 900), t, 1.6, 0.08), c1 = focus(760, 880 - 720 * 0.6, 4.2), c2 = focus(700, 700, 1.4);
    const cam = lerpCam(lerpCam(c0, c1, p), c2, back);
    cam.r = Math.sin((T - 64.9) * 2.2) * 7 * p * (1 - back);
    return mocaShot(t, T, cam);
  } },
  // 18a — Polo comes back (side-view walk with bread)
  { t0: 68.6, xf: 0.3, draw(t, T) {
    const px = lerp(150, 760, E.out(inv(68.7, 71.6, T)));
    const polo = P_('polo', { x: px, y: 1000, s: 0.85, t: T, face: 0.8, side: true, walk: T * 11, expr: 'happy', holdR: bread({ s: 0.55, rot: 10 }) });
    return { cam: push(frameG(px, 1000, 1.9, 1420), t, 3, 0.05), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 1000, 0.6) + plazaPigeons(T, t, 70.0)), Lr(1, polo)] };
  } },
  // 18b — close: "já voltei!"
  { t0: 71.6, draw(t, T) {
    const cheer = T > 72.85;
    const polo = P_('polo', { x: 760, y: 1000, s: 0.85, t: T, face: 0.1, expr: cheer ? 'joy' : 'happy', armR: cheer ? 165 : 40, bendR: cheer ? 10 : 60, armL: cheer ? 165 : 14, bendL: 10, holdR: bread({ s: 0.6, rot: cheer ? -30 : 10 }), mouth: talk(T, [[72.88, 73.35]]), jump: 34 * pulse(T, 73.05, 0.22) });
    return { cam: push(focus(760, 1000 - 0.85 * 290, 2.8, 960), t, 2.4, 0.08), layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 1000, 0.6)), Lr(1, polo + emote('sparkle', 760, 1000 - 0.85 * 420, T - 72.9, 0.9))] };
  } },
  // 19 — the bread is hard as stone
  { t0: 74.0, draw(t, T) {
    const stone = E.inOut(inv(74.2, 74.9, T));
    const hit1 = pulse(T, 74.97, 0.12), hit2 = pulse(T, 75.45, 0.12);
    const fistY = kf(T, [[74.0, 260], [74.75, 240], [74.95, 525], [75.15, 300], [75.42, 525], [75.6, 280], [76.1, 260]]);
    const vib = (hit1 + hit2) * Math.sin(T * 120) * 8;
    const bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#f0d4a0"/><rect x="-600" y="-800" width="3200" height="2800" fill="url(#pPlaster)"/><circle cx="700" cy="200" r="260" fill="#f8e4b8" opacity="0.7"/><rect x="-600" y="760" width="3200" height="1200" fill="#d8c09a"/><rect x="-600" y="760" width="3200" height="1200" fill="url(#pPlaster)"/>`;
    const fist = `<g transform="translate(980 ${f2(fistY)})"><path d="M 0 -900 L 0 -80" stroke="${INK9}" stroke-width="96" stroke-linecap="round"/><path d="M 0 -900 L 0 -80" stroke="#f2c230" stroke-width="82" stroke-linecap="round"/><rect x="-50" y="-120" width="100" height="34" rx="10" fill="#d9a516" stroke="${INK9}" stroke-width="5"/><path d="M -58 -86 Q -66 10 0 14 Q 66 10 58 -86 Z" fill="#1d1a22" stroke="${INK9}" stroke-width="6"/></g>`;
    const chips = T > 74.97 ? Array.from({ length: 8 }, (_, i) => { const q = clamp((T - 74.97) / 0.7), a = i * 0.8; return `<rect x="${f2(960 + Math.cos(a) * 260 * q)}" y="${f2(600 - Math.sin(a) * 180 * q + q * q * 240)}" width="16" height="12" fill="#8c8a86" stroke="${INK}" stroke-width="2" opacity="${f2(1 - q)}"/>`; }).join('') : '';
    return { cam: push(focus(960, 560, 1.15), t, 2.1, 0.05), layers: [Lr(0.3, bg), Lr(1, `<ellipse cx="960" cy="700" rx="300" ry="46" fill="#1b1424" opacity="0.22"/><g transform="translate(${f2(960 + vib)} 620)">${bread({ s: 4.2, stone, cracks: clamp((T - 74.97) / 0.3) })}</g>` + chips + fist)],
      over: comic(T, 74.97, 'TOC!', 300, 1180, { size: 130, life: 0.45 }) + comic(T, 75.45, 'TOC!', 780, 1140, { size: 130, life: 0.6, rot: 8 }) };
  } },
  // 20a — retirement party: banner, cake, new baker; the old baker rocks
  { t0: 76.1, draw(t, T) { return retireShot(t, T, push(frameG(560, 900, 1.3, 1460), t, 2.2, 0.06)); } },
  // 20b — Polo arrives, shocked
  { t0: 78.3, draw(t, T) { return retireShot(t, T, push(frameG(900, 910, 2.4, 1420), t, 1.3, 0.05)); } },
  // 21 — nine days had passed
  { t0: 79.6, draw(t, T) {
    const cx = 1050, cy = 880 - 720 * 0.8;
    const up = E.inOut(inv(79.9, 81.1, T)), push2 = E.inOut(inv(81.3, 81.9, T)), down = E.inOut(inv(82.4, 83.2, T));
    const polo = P_('polo', { x: 980, y: 1000, s: 0.9, t: T, face: 0.25, lx: 0.4, ly: -1, expr: T > 82.3 ? 'surprised' : 'neutral', holdR: bread({ s: 0.5, stone: 1, cracks: 1 }), armR: T > 82.3 ? 70 : 25, bendR: 40, armL: T > 82.3 ? 70 : 12, mouth: T > 82.3 ? 0.8 : 0 });
    const cPolo = frameG(990, 1000, 1.8, 1500), cClock = focus(cx, cy, 2.0), cDay = focus(cx, cy + 0.8 * 150 * 0.35, 4.0);
    const cam = lerpCam(lerpCam(lerpCam(cPolo, cClock, up), cDay, push2), frameG(990, 1000, 2.0, 1450), down);
    return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(1, plazaGround(880) + tower(T, cx, 0.8, { glow: pulse(T, 81.9, 0.6) }) + leaves(700, 1300, 1000, 9, 40)), Lr(1.1, polo + emote('shock', 980, 1000 - 0.9 * 322 - 80, T - 82.35, 0.9) + emote('sweat', 1040, 1000 - 0.9 * 400, T - 82.6, 0.9))] };
  } },
  // 22a — CTA: Polo by the bakery door, shrug
  { t0: 83.5, xf: 0.4, draw(t, T) { return ctaShot(t, T, push(frameG(380, 905, 1.8, 1430), t, 3.4, 0.07)); } },
  // 22b — closer: flips the sign to "VOLTO", points down to the comments
  { t0: 86.9, draw(t, T) { return ctaShot(t, T, push(frameG(370, 905, 2.05, 1400), t, 2.7, 0.08)); } },
  // 23 — loop: whip back to the spinning clock so the last frame flows into frame 0
  { t0: 89.43, draw(t, T) { return hookClock(0, T - 89.6); } },
);

// ----- shared shot bodies (so a beat can be cut into several camera angles) -----
function driverShot(t, T, cam, close) {
  const scroll = (T * 900) % 2400;
  let bg = `<rect x="-600" y="-800" width="3200" height="2800" fill="#c4d8de"/>`;
  for (let i = 0; i < 8; i++) { const x = ((i * 420 - scroll) % 3000 + 3000) % 3000 - 600; bg += `<rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="${['#aec4d0', '#e8d8c0', '#c8dcc8'][i % 3]}"/><rect x="${f2(x)}" y="${100 + (i % 3) * 60}" width="320" height="1200" fill="url(#pPlaster)"/>`; }
  bg += speedLines(1700, 500, 12, 300, 0, 0.45, Math.floor(T * 10));
  const waveA = wave(T, 36.3, 39.4, 160, 22);
  const drv = P_('motorista', { x: 985, y: 1100, s: 1.55, t: T, face: -0.5, lx: -1, expr: T > 38.25 ? 'smug' : 'happy', wink: true, armL: waveA != null ? waveA : 12, bendL: 30, mouth: talk(T, [[38.32, 39.15]]), shadow: false });
  const panel = `<path fill-rule="evenodd" d="M -400 -600 H 2400 V 1800 H -400 Z M 470 210 H 1450 Q 1500 210 1500 260 V 900 H 470 Z" fill="#f2c230" stroke="${INK}" stroke-width="6"/><rect x="-400" y="960" width="2800" height="70" fill="#3c8a86" stroke="${INK}" stroke-width="5"/><rect x="455" y="195" width="1060" height="720" rx="18" fill="none" stroke="${INK}" stroke-width="10"/>`;
  return { cam: { ...cam, r: -3 }, layers: [Lr(0.4, bg), Lr(1, `<rect x="470" y="210" width="1030" height="700" fill="#3a4650"/><rect x="760" y="300" width="420" height="600" rx="30" fill="#4a3434" stroke="${INK}" stroke-width="4"/>` + drv + `<path d="M 470 210 L 760 210 L 470 560 Z" fill="#ffffff" opacity="0.12"/>` + panel + (close ? emote('sparkle', 985, 1100 - 1.55 * 1.05 * 420, T - 38.35, 1.4) : ''))] };
}
function barnabeShot(t, T, cam) {
  const after = T > 52.85;
  const bar = P_('barnabe', { x: 620, y: 1000, s: 0.85, t: T, face: after ? 0.5 : 0.15, lx: after ? 1 : 0, ly: after ? -1 : 0, expr: after ? 'surprised' : (T > 50.5 ? 'laugh' : 'happy'),
    armL: (() => { const w = wave(T, 51.3, 52.0, 130, 25); return w != null ? w : 12; })(), bendL: 30, armR: 25, bendR: 30, mouth: talk(T, [[50.6, 50.9], [51.3, 51.85]]), tilt: T > 50.5 && T < 52 ? Math.sin(T * 10) * 3 : 0, jump: 14 * pulse(T, 53.85, 0.15) });
  return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { glow: pulse(T, 53.0, 0.4), blur: pulse(T, 53.1, 0.35) }) + plazaPigeons(T, t, 52.9)), Lr(1, bar + ripple(720, 640, inv(51.3, 52.2, T)) + emote('excl', 640, 1000 - 0.85 * 1.02 * 440, T - 53.75, 0.9))],
    tint: nightTint(T), over: comic(T, 52.85, 'TÉC TÉC!', 540, 1180, { size: 100, life: 0.8 }) };
}
function mocaShot(t, T, cam) {
  const sp = clamp(spinSpeed(T) / 30);
  const whisper = T > 63.4 && T < 64.15, after = T > 64.9;
  const moca = P_('moca', { x: 600, y: 1000, s: 0.95, t: T, face: after ? 0.6 : (T < 63.2 ? Math.sin((T - 61.7) * 3) * 0.5 : 0.35), lx: after ? 1 : 0.5, ly: after ? -1 : 0, expr: after ? 'surprised' : 'smug',
    armR: whisper || T < 64.6 ? 150 : 30, bendR: whisper || T < 64.6 ? 110 : 20, armL: 12, mouth: talk(T, [[63.44, 64.05]]) * 0.4 });
  return { cam, layers: [...plazaBack(T, t), Lr(0.7, plazaMid(T, t)), Lr(0.9, plazaGround(880) + tower(T, 760, 0.6, { blur: sp, glow: sp * 0.8 })), Lr(1, moca + (whisper ? ripple(680, 690, inv(63.44, 64.1, T), '#f4d6de') : '') + emote('shock', 600, 1000 - 0.95 * 0.95 * 322 - 80, T - 65.0, 0.9))],
    tint: nightTint(T), over: (sp > 0.05 ? speedLines(540, 960, 12, 360, (T * 300) % 360, sp * 0.35, Math.floor(T * 12)) : '') + comic(T, 63.5, 'psiu...', 760, 640, { size: 70, life: 0.7, fill: '#f8c8d8', rot: 8 }) + comic(T, 65.3, 'TIC-TIC-TIC', 540, 1180, { size: 96, life: 2.4, fill: '#ffd23f' }) };
}
function retireShot(t, T, cam) {
  const rock = Math.sin(T * 2.2) * 5, needle = Math.sin(T * 9) * 10;
  const knit = `<path d="M -6 -6 l 40 -34" stroke="#c9a24a" stroke-width="5" stroke-linecap="round"/><circle cx="14" cy="8" r="16" fill="#d0704a" stroke="${INK}" stroke-width="3"/>`;
  const old = rockingChair(560, 900, rock) + `<g transform="rotate(${f2(rock)} 560 900)">${P_('padeira', { x: 560, y: 880, s: 0.62, old: true, t: T, face: 0.25, expr: T > 78.3 ? 'happy' : 'joy', armL: 40 + needle * 0.4, armR: 40 - needle * 0.4, bendL: 80, bendR: 80, holdR: knit, shadow: false })}</g>`;
  const young = P_('padeiro2', { x: 400, y: 900, s: 0.6, t: T, face: 0.3, expr: 'happy', armR: wave(T, 76.3, 77.6, 150, 18) || 20, bendR: 30 });
  const px = lerp(1250, 900, E.out(inv(76.4, 78.0, T)));
  const arrived = T > 78.0;
  const tn = pulse(T, 78.0, 0.1);
  const polo = arrived ? P_('polo', { x: px, y: 910, s: 0.62, t: T, face: -0.7, lx: -1, expr: T > 78.55 ? 'surprised' : 'happy', holdR: bread({ s: 0.45, stone: 1, cracks: 1 }), armR: 30, bendR: 50, armL: 10, turn: tn })
    : P_('polo', { x: px, y: 910, s: 0.62, t: T, face: -0.8, side: true, walk: T * 11, expr: 'happy', holdR: bread({ s: 0.45, stone: 1, cracks: 1 }), turn: tn });
  return { cam, layers: [...backA(t, ['#eaa070', '#f8d8a8']),
    Lr(1, streetARow(T, { pigeons: false }) + banner(300, 470, 480, 'FELIZ APOSENTADORIA!', T) + leaves(150, 1400, 935, 4, 50) + young + table(780, 900) + cake(780, 830, T) + old + polo + emote('excl', px, 910 - 0.62 * 430, T - 78.55, 0.75) + emote('sweat', px + 40, 910 - 0.62 * 380, T - 78.8, 0.75))],
    tint: ['#e8a070', 0.08] };
}
function table(x, y) { return `<rect x="${x - 80}" y="${y - 70}" width="160" height="14" rx="5" fill="#b87a4a" stroke="${INK}" stroke-width="4"/><path d="M ${x - 66} ${y - 56} V ${y} M ${x + 66} ${y - 56} V ${y}" stroke="${INK}" stroke-width="9"/><path d="M ${x - 66} ${y - 56} V ${y} M ${x + 66} ${y - 56} V ${y}" stroke="#a46a3a" stroke-width="4"/>`; }
function ctaShot(t, T, cam) {
  const flip = E.inOut(inv(88.15, 88.6, T));
  const point = T > 87.7 && T < 88.7;
  const down = T >= 88.75;
  const shrug = E.back(inv(84.4, 84.9, T)) * (1 - E.inOut(inv(86.9, 87.4, T)));
  const polo = P_('polo', { x: 470, y: 905, s: 0.7, t: T, face: point ? -0.5 : 0.05, expr: T < 86.9 ? 'smug' : 'happy', lx: point ? -1 : 0, ly: down ? 0.8 : 0,
    armR: down ? 62 + Math.sin(T * 10) * 6 : lerp(25, 80, shrug), bendR: down ? -18 : lerp(50, 80, shrug), armL: point ? 95 : lerp(12, 80, shrug), bendL: point ? 5 : lerp(12, 80, shrug), holdR: down ? '' : bread({ s: 0.45, stone: 1, cracks: 1, rot: -20 }), handL: point ? 'point' : null, handR: down ? 'point' : null });
  const sign = hangSign(285, 745, 'JÁ VOLTO', Math.sin(T * 1.5) * 2 + pulse(T, 88.6, 0.3) * 6, { w: 176, h: 62, fs: 28, flip, text2: 'VOLTO' });
  const arrow = down ? `<g transform="translate(540 ${f2(1450 + Math.sin(T * 10) * 16)})" opacity="${f2(clamp((T - 88.75) / 0.15))}"><path d="M -34 -40 L 34 -40 L 34 0 L 70 0 L 0 70 L -70 0 L -34 0 Z" fill="#ffd23f" stroke="#211c26" stroke-width="10" stroke-linejoin="round"/></g>` : '';
  return { cam, layers: [
    Lr(0.04, sky('#c86a7a', '#f6b07a', { sun: 560, sunX: 1650, sunC: '#ffe0a8', sunR: 110, id: 'e' })), Lr(0.1, clouds(T, '#f8c0a8', 0.85, 5, 40)), Lr(0.3, farTown('#9a5a6a', 760, 5) + haze('#f6b07a', 400, 900, 0.5)),
    Lr(1, bakeryFacade(-200, 900, { t: T, sign: false, night: true }) + sign + polo + lamp(640, 905, 0.9, 1) + dust(T, 0, 400, 800, 500, 16, 9, '#ffe7a0') + emote('q', 520, 905 - 0.7 * 430, T - 84.5, 0.8))],
    tint: ['#f08a8a', 0.08], over: arrow };
}
