  // 18 — nem abaixava pra passar na porta (TÓIN)
  { t0: 38.4, draw(t, T) {
    const x = Math.min(lerp(700, 1140, t / 0.9), 1140) - (T > 39.4 ? 30 * E.out(inv(39.4, 39.6, T)) : 0);
    const fr = FR(T, { x, y: G, s: FS(T) * 1.12, face: 0.8, side: true, walk: T < 39.3 ? T * 8 : null, expr: T > 39.4 ? 'surprised' : 'smug', tilt: T > 39.4 ? -8 : 0 });
    return { cam: push(frameG(1060, G, 1.7, 1350), t, 1.9, 0.05), layers: [...pitchBack(t), Lr(1, pitchGround() + doorway(1200, G, 0.8) + fr), Lr(1.05, `<path d="M ${1200 - 101} ${G} V ${G - 277} H ${1200 - 80} V ${G}" fill="#efe2c4" stroke="${INK}" stroke-width="4"/>`)], tint: ORANGE, over: comic(T, 39.45, 'TÓIN!', 700, 520, { size: 110 }) };
  } },
