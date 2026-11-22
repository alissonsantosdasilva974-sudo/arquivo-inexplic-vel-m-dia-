// Pilot: city v3 — drone descent, 5-layer side street (day/night), perspective street (day/night).
const SHOTS = [];
function plazaSky(T) { return { top: '#f0a868', bot: '#f8dcae', night: 0, sp: 0 }; }
const skyDay = (t) => [Lr(0.03, sky('#8cbcd8', '#eef2ea', { sun: 160, sunX: 450, sunC: '#fffbe8', sunR: 80, id: 'pd' })), Lr(0.08, clouds(t, '#ffffff', 0.85, 9, 40))];
const skyNight = (t) => [Lr(0.03, sky('#0e1230', '#2e3264', { stars: 1, t, moon: 160, moonX: 1500, id: 'pn' })), Lr(0.08, clouds(t * 0.5, '#4a4a7a', 0.45, 7, 40))];
const P3s = (cam, X, D, s0) => { const p = P3(cam, X, 0, D); return { x: p.x, y: p.y, s: s0 * p.k * 1.6 }; };
SHOTS.push(
  // A — drone descent from above the town into the street
  { t0: 0, draw(t, T) {
    const q = E.inOut(clamp(t / 3.4));
    const cam = cam3(lerp(3800, 640, q), lerp(120, 560, E.out(q)), 500, 0);
    const movD = 2600 - t * 380;
    return { cam: focus(960, 720, 1.0), layers: [...skyDay(t), Lr(1, street3D(T, { cam, seed: 7, movingCars: [{ X: 170, D: movD, col: '#f2c230' }, { X: -170, D: 1200 + t * 300, col: '#3c6aa8' }], crowd: 16 }))] };
  } },
  // B — the bakery street, side view, 5 depth layers (morning); Polo walks
  { t0: 3.5, xf: 0.3, draw(t, T) {
    const px = 380 + t * 120;
    const polo = P_('polo', { x: px, y: 930, s: 0.62, t: T, face: 0.8, side: true, walk: T * 11, hat: 'fedora', pocketNote: true });
    const main = (T2) => cityRow(T2, { seed: 12, x0: 430, x1: 3400, signs: ['MERCADO', 'BARBEARIA', 'FARMÁCIA', 'CORREIO', 'SORVETES'], bunting: true, shops: 0.85 }) + cityRow(T2, { seed: 13, x0: -1500, x1: -230, shops: 0.5 }) + bakeryFacade(-200, 900, { t: T2, sign: false });
    return { cam: push(frameG(px + 80, 930, 1.35, 1450), t, 3.5, 0.05), layers: [...skyDay(t), ...sideStreet(T, t, { seed: 12, main, movingCar: -900 + t * 700, extra: walkers(T, 945, 0.42, 51, 3, 3200) + polo, fgX: px + 520 })] };
  } },
  // C — perspective street, morning: crowd, a car driving off, Polo from behind in the foreground
  { t0: 7.0, draw(t, T) {
    const cam = cam3(640, 560, 500, 0);
    const people = [{ id: 'polo', X: -120, D: lerp(-60, 260, t / 3.5), s: 1.45, o: { t: T, back: true, walk: T * 9, hat: 'fedora' } }];
    return { cam: push(focus(960, 720, 1.0), t, 3.5, 0.05), layers: [...skyDay(t), Lr(1, street3D(T, { cam, seed: 7, people, movingCars: [{ X: 170, D: 900 + t * 520, col: '#c8443c' }], crowd: 18 }))] };
  } },
  // D — the same street at night: the man in the suit waits under a lamp
  { t0: 10.5, xf: 0.5, draw(t, T) {
    const cam = cam3(640, 560, 500, 0);
    const people = [{ id: 'terno', X: 330, D: 1800, s: 0.5, o: { t: T, face: -0.3, expr: 'smug', hat: 'fedora' } }, { id: 'polo', X: -150, D: 120, s: 1.45, o: { t: T, back: true, hat: 'fedora' } }];
    return { cam: lerpCam(focus(960, 720, 1.0), focus(1020, 660, 1.8), E.inOut(clamp(t / 3))), layers: [...skyNight(t), Lr(1, street3D(T, { cam, seed: 7, night: 1, people, crowd: 0 }))], tint: ['#3a4a8a', 0.15] };
  } },
  // E — the bakery street at night, side view, 5 layers
  { t0: 13.5, xf: 0.4, draw(t, T) {
    const main = (T2) => cityRow(T2, { seed: 12, x0: 430, x1: 3400, signs: ['MERCADO', 'BARBEARIA', 'FARMÁCIA', 'CORREIO', 'SORVETES'], night: 1, shops: 0.85 }) + cityRow(T2, { seed: 13, x0: -1500, x1: -230, night: 1, shops: 0.5 }) + bakeryFacade(-200, 900, { t: T2, sign: false, night: true }) + lampLight(560, 940, 1.1);
    const man = P_('terno', { x: 760, y: 930, s: 0.62, t: T, face: -0.3, lx: -1, expr: 'smug' });
    return { cam: push(frameG(700, 930, 1.3, 1450), t, 2.5, 0.06), layers: [...skyNight(t), ...sideStreet(T, t, { seed: 12, night: 1, main, extra: man, fgX: 1180 })], tint: ['#3a4a8a', 0.15] };
  } },
);
