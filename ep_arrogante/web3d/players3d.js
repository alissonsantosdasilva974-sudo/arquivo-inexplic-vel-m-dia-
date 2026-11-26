// Pelada de fundo: 8 jogadores (dois times de camisa lisa, só cor e número). Sem verde, sem escudo.
(function () {
  const skins = ['#f1c08f', '#c98b5e', '#8d5a34', '#e0ac79', '#f5d0b0', '#a86a44', '#d9a27a', '#6a4028'];
  const hairs = ['short', 'cloud', 'curlyShort', 'straight', 'short', 'cloud', 'straight', 'curlyShort'];
  const hc = ['#1d1a22', '#3a2018', '#1d1a22', '#6a3a24', '#8a5a2a', '#1d1a22', '#3a2018', '#1d1a22'];
  for (let i = 0; i < 8; i++) {
    const A = i < 4, top = i === 7 ? '#f2a43a' : A ? '#e8503a' : '#5ab0d8';
    CAST2['jog' + i] = { skin: skins[i], top, topD: shade(top, 0.2), topType: 'tee', num: String(A ? 4 + i : i === 7 ? 1 : i - 2), numC: '#fff6e8', collar: '#fff6e8', bottom: A ? '#f4f1ea' : '#2a3a6a', shorts: 1, socks: top, shoes: '#2a2228', cleats: 1, hair: hairs[i], hairC: hc[i], w: 0.95 + (i % 3) * 0.05, scale: 0.94 + (i % 4) * 0.03, seed: 40 + i };
  }
})();
// posições: jogo correndo atrás da bola (bx,bz); mode: 'play' | 'cheer' | 'look' | 'leave' | 'stop'
async function players(T, o = {}) {
  const mode = o.mode || 'play', bx = o.bx != null ? o.bx : Math.sin(T * 0.9) * 5, bz = o.bz != null ? o.bz : 4 + Math.cos(T * 0.7) * 8;
  for (let i = 0; i < 8; i++) {
    if (o.skip && o.skip.includes(i)) continue;
    const ph = i * 0.8, home = [[-6, -8], [4, -4], [-3, 2], [7, 6], [-5, 10], [3, 12], [6, -12], [0, -21.3]][i];
    let x = lerp(home[0], bx + Math.sin(ph) * 3, i === 7 ? 0.15 : 0.45) + Math.sin(T * 1.3 + ph) * 1.2, z = lerp(home[1], bz + Math.cos(ph) * 3, i === 7 ? 0 : 0.45) + Math.cos(T * 1.1 + ph) * 1.0;
    if (i === 7) { x = clamp(bx * 0.3, -2, 2); z = -21.3; }
    let opt = { t: T + i, side: true, face: Math.cos(T * 1.3 + ph) > 0 ? 0.8 : -0.8, walk: T * 10 + i, run: 1, expr: i % 2 ? 'happy' : 'neutral' };
    if (i === 7) opt = { t: T, armL: 50, armR: 50, bendL: 40, bendR: 40, expr: 'neutral' };
    if (mode === 'cheer') opt = { t: T + i, expr: i < 4 ? 'joy' : 'sad', armL: i < 4 ? 150 + Math.sin(T * 9 + i) * 20 : 10, armR: i < 4 ? 150 : 10, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: i < 4 ? Math.abs(Math.sin(T * 7 + i)) * 30 : 0 };
    if (mode === 'look' || mode === 'stop') { x = home[0] * 0.8; z = home[1] * 0.6 + (o.cz || 0); opt = { t: T + i, face: x < (o.fx || 0) ? 0.5 : -0.5, lx: x < (o.fx || 0) ? 1 : -1, ly: mode === 'look' ? -1 : 0, expr: 'worried' }; }
    if (mode === 'leave') { const a = Math.atan2(home[1], home[0]); x = Math.cos(a) * (6 + (o.t || 0) * 5); z = Math.sin(a) * (6 + (o.t || 0) * 5); opt = { t: T + i, side: true, face: Math.cos(a) > 0 ? 0.8 : -0.8, walk: T * 8 + i }; }
    if (o.only && !o.only(x, z)) continue;
    await place('jog' + i, person('jog' + i, Object.assign({ x: 0, y: 0, s: 1 }, opt)), x, 0, z);
  }
}
