  // 42 — pergunta final + loop (volta ao close do Polo com a regra)
  { t0: 93.0, draw(t, T) {
    const po = PO(T, { x: 820, y: G + 40, s: S0 * 1.1, face: 0.3, expr: T < 95.5 ? 'worried' : 'happy', lx: 0.6 });
    const fr = FR(T, { x: 1090, y: G, s: S0 * 1.5, face: -0.3, expr: 'smug', armL: 100, armR: 100, bendL: 0, bendR: 0, handL: 'open', handR: 'open' });
    const q = T < 95.5 ? popIcon(T, 93.1, `<rect x="-450" y="-110" width="900" height="210" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="60" fill="${INK}">VOCÊ ABRAÇARIA UM</text><text y="60" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="66" fill="#e8503a">AMIGO ARROGANTE?</text>`, 540, 400)
      : popIcon(T, 95.5, `<rect x="-460" y="-100" width="920" height="200" rx="28" fill="#fff6e0" stroke="${INK}" stroke-width="10"/><text y="-12" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="${INK}">COMENTA</text><text y="68" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="74" fill="#e8503a" stroke="${INK}" stroke-width="3" paint-order="stroke">ABRAÇO ou DEIXO</text>`, 540, 400);
    return { cam: push(focus(950, 690, 1.75, 1080), t, 5.0, 0.06), layers: pitch(T, t, fr + po, { goal: 1450 }), tint: ORANGE, over: q };
  } },