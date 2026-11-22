// PADRÃO DO CANAL — cenários e helpers do ep. 2 v4 (cidade v3). Copie este arquivo para epN/web/shots.js e troque as cenas de exemplo.
const SHOTS = [];
function plazaSky(T) { return { top: '#f0a868', bot: '#f8dcae', night: 0, sp: 0 }; }
const NIGHT = ['#3a4a8a', 0.22];
const DUSK = ['#a07ab0', 0.14];
const backNight = (t) => [Lr(0.04, sky('#0e1230', '#2e3264', { stars: 1, t, moon: 160, moonX: 1500, id: 'n' })), Lr(0.1, clouds(t * 0.5, '#4a4a7a', 0.45, 7, 60))];
const backDawn = (t) => [Lr(0.04, sky('#f2b07a', '#fbe4c0', { sun: 360, sunX: 600, sunC: '#fff2d0', id: 'm' })), Lr(0.1, clouds(t, '#fff6ea', 0.85, 3, 60))];
const backDay = (t) => [Lr(0.04, sky('#9cc4dc', '#eaf2ee', { sun: 140, sunX: 400, sunC: '#fffbe8', sunR: 70, id: 'c' })), Lr(0.1, clouds(t, '#ffffff', 0.8, 9, 60))];
const backDusk = (t) => [Lr(0.04, sky('#4a3060', '#f2a46a', { sun: 640, sunX: 1650, sunC: '#ffd9a0', sunR: 100, id: 'k' })), Lr(0.1, clouds(t, '#f4b8a0', 0.7, 5, 60))];
const fog = (t, y = 820, op = 0.5) => `<g opacity="${op}">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${f2(((i * 520 + t * 30) % 4200) - 900)}" cy="${y + (i % 3) * 30}" rx="420" ry="60" fill="#c8cce8" opacity="0.35"/>`).join('')}</g>`;
const GLOWN = (T) => 0.6 + 0.4 * Math.sin(T * 5);
// side-view sets
const nightSet = (T, t, extra, o = {}) => [...backNight(t), ...sideStreet(T, t, Object.assign({ seed: 5, night: 1, npcs: false, fg: false, extra }, o)), Lr(1.2, fog(T))];
const duskSet = (T, t, extra) => [...backDusk(t), ...sideStreet(T, t, { seed: 7, closed: 1, npcs: false, cars: false, fg: false, night: 0.3, extra })];
const bakerySetV2 = (T, o = {}) => cityRow(T, { seed: 12, x0: 430, x1: 3000, signs: ['MERCADO', 'BARBEARIA', 'CORREIO', 'FLORES'], bunting: true, shops: 0.8 }) + cityRow(T, { seed: 13, x0: -1500, x1: -230, shops: 0.4 }) + bakeryFacade(-200, 900, Object.assign({ t: T, sign: false }, o));
const morningSet = (T, t, extra, o, so = {}) => [...backDawn(t), ...sideStreet(T, t, Object.assign({ seed: 12, main: (T2) => bakerySetV2(T2, o), extra, fg: false, avoidX: 450 }, so))];
// hook = the town from above at night, with the glowing note floating in front (also the loop-back ending)
const hookNote = (t, T) => ({ cam: { ...focus(960, 700, 1.0 + 0.03 * Math.sin(T)), r: 0 }, layers: [
  ...backNight(1), Lr(1, street3D(1, { cam: cam3(3200, 260, 500, 0), seed: 7, night: 1, crowd: 0, traffic: false })),
  Lr(1.05, `<rect x="-800" y="-800" width="3600" height="3200" fill="#0e1230" opacity="0.35"/><g transform="translate(960 640)">${noteNamed('?', GLOWN(T), { s: 3.3, rot: Math.sin(T * 1.3) * 6, fs: 22 })}</g>` + dust(T, 500, 300, 900, 600, 30, 5, '#ffe7a0'))], tint: ['#3a4a8a', 0.12] });
// POV close-ups with Polo's gloves
const povBg = (c) => Lr(0.3, `<rect x="-800" y="-800" width="3600" height="3200" fill="${c}"/><circle cx="960" cy="560" r="460" fill="#ffd27a" opacity="0.1"/>`);
const pov = (T, inner, o = {}) => Lr(1, povHands(960, 820 + (o.dy || 0), o.k || 2.2, inner, { spread: o.spread || 300, lift: Math.sin(T * 2) * 4 }));


// ---------- CENAS DE EXEMPLO (apagar e escrever as do episódio) ----------
// Cada cena: { t0: início em segundos, xf: (opcional) duração da transição cruzada, draw(t, T) }
// t = tempo dentro da cena, T = tempo global. Retorna { cam, layers, tint?, over? }.
// Polo padrão: hat 'fedora', pocketNote true. Sem verde em nada (chroma key).
const POLO = (o) => Object.assign({ hat: 'fedora', pocketNote: true }, o);
SHOTS.push(
  // 0 — gancho: cidade do alto à noite com o objeto estranho do episódio na frente
  { t0: 0, draw(t, T) { return hookNote(t, T); } },
  // 1 — rua lateral de manhã (5 camadas, gente, carros): Polo anda
  { t0: 2.5, draw(t, T) {
    const px = lerp(500, 1300, t / 3);
    const polo = P_('polo', POLO({ x: px, y: 905, s: 0.62, t: T, face: 0.8, side: true, walk: T * 7, expr: 'neutral' }));
    return { cam: push(frameG(px, 905, 2.0, 1420), t, 2.5, 0.05), layers: morningSet(T, t, polo, {}, { avoidX: px }) };
  } },
  // 2 — rua em perspectiva (cidade v3): Polo na calçada, de costas, olhando a rua
  { t0: 5.0, draw(t, T) {
    const cam = cam3(640, 560, 500, 0), pp = P3(cam, -505, 0, 120);
    const people = [{ id: 'polo', X: -505, D: 120, s: 0.44, o: POLO({ t: T, back: true }) }];
    return { cam: push(focus(pp.x + 200, pp.y - 220, 1.4, 1300), t, 2.5, 0.05), layers: [...backDawn(t), Lr(1, street3D(T, { cam, seed: 12, people, crowd: 18, skyC: '#fbe4c0', clearNear: { g: -1, D: 900 } }))] };
  } },
  // 3 — descida de drone
  { t0: 7.5, xf: 0.35, draw(t, T) { const q = E.inOut(clamp(t / 1.2)); return { cam: focus(960, 720, 1.0), layers: [...backDawn(t), Lr(1, street3D(T, { cam: cam3(lerp(3000, 1300, q), lerp(200, 420, q), 500, 0), seed: 12, crowd: 24, skyC: '#fbe4c0' }))] }; } },
  // 4 — rua lateral à noite (vazia, poste aceso)
  { t0: 10.0, draw(t, T) {
    const polo = P_('polo', POLO({ x: 760, y: 905, s: 0.62, t: T, face: 0.3, expr: 'worried' }));
    return { cam: push(frameG(760, 905, 2.0, 1420), t, 2.5, 0.06), layers: nightSet(T, t, polo + lampLight(640, 940, 1.0)), tint: NIGHT };
  } },
);
// Placar/contador opcional: defina function HUD(T) { return '<svg …>'; } (modelo completo em ep2/web/shots.js).
