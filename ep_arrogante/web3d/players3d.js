// Pelada de fundo: 8 jogadores com rotas de verdade (atacar, recompor, acompanhar a bola).
// A vista do desenho vem do sentido do movimento em relação à câmera: lateral, de costas (indo embora) ou de frente (vindo).
(function () {
  const skins = ['#f1c08f', '#c98b5e', '#8d5a34', '#e0ac79', '#f5d0b0', '#a86a44', '#d9a27a', '#6a4028'];
  const hairs = ['short', 'cloud', 'curlyShort', 'straight', 'short', 'cloud', 'straight', 'curlyShort'];
  const hc = ['#1d1a22', '#3a2018', '#1d1a22', '#6a3a24', '#8a5a2a', '#1d1a22', '#3a2018', '#1d1a22'];
  for (let i = 0; i < 8; i++) {
    const A = i < 4 || i === 7, top = i === 7 ? '#f2a43a' : A ? '#e8503a' : '#5ab0d8';
    CAST2['jog' + i] = { skin: skins[i], top, topD: shade(top, 0.2), topType: 'tee', num: String(i === 7 ? 1 : A ? 4 + i : i - 2), numC: '#fff6e8', collar: '#fff6e8', bottom: A ? '#f4f1ea' : '#2a3a6a', shorts: 1, socks: top, shoes: '#2a2228', cleats: 1, hair: hairs[i], hairC: hc[i], w: 0.95 + (i % 3) * 0.05, scale: 0.94 + (i % 4) * 0.03, seed: 40 + i };
  }
})();
// rotas (x, z) em laço, velocidade de corrida em m/s
const ROUTES = [
  [[-6, -6], [-4, 8], [-7, 16], [-3, 4]],          // 0 vermelho, ponta esquerda: sobe e desce pela lateral
  [[3, -2], [2, 12], [6, 17], [4, 2]],             // 1 vermelho, meia: ataca pelo meio
  [[-2, -12], [-1, -2], [3, -9], [-3, -14]],       // 2 vermelho, zagueiro: fica atrás
  [[7, 4], [8, 14], [2, 18], [6, 8]],              // 3 vermelho, atacante
  [[-4, 14], [-6, 4], [-2, 10], [-5, 18]],         // 4 azul, zagueiro: recua
  [[4, 10], [1, -2], [5, 6], [6, 16]],             // 5 azul, meia
  [[0, 2], [-5, -8], [3, -12], [5, -2]],           // 6 azul, atacante: contra-ataque
];
const SPD = [5.2, 4.6, 3.4, 5.6, 4.2, 4.8, 5.0];
function routePos(i, T) {
  const P = ROUTES[i], segs = P.map((p, k) => { const q = P[(k + 1) % P.length]; return { p, q, L: Math.hypot(q[0] - p[0], q[1] - p[1]) }; });
  const tot = segs.reduce((a, s) => a + s.L, 0); let d = ((T * SPD[i] + i * 7.3) % tot + tot) % tot;
  for (const s of segs) { if (d <= s.L) { const u = d / s.L; return { x: lerp(s.p[0], s.q[0], u), z: lerp(s.p[1], s.q[1], u), vx: (s.q[0] - s.p[0]) / s.L, vz: (s.q[1] - s.p[1]) / s.L }; } d -= s.L; }
  return { x: P[0][0], z: P[0][1], vx: 0, vz: 1 };
}
// vista a partir da direção do movimento vista pela câmera
function viewFor(x, z, vx, vz) {
  const f = new THREE.Vector3(); CAM.getWorldDirection(f); f.y = 0; f.normalize();
  const r = new THREE.Vector3(-f.z, 0, f.x);           // direita da tela
  const sx = vx * r.x + vz * r.z, sz = vx * f.x + vz * f.z;
  if (Math.abs(sx) > Math.abs(sz) * 0.55) return { side: true, face: sx > 0 ? 0.8 : -0.8 };
  return sz > 0 ? { back: true } : { face: 0 };
}
// mode: 'play' | 'cheer' | 'look' | 'leave'
async function players(T, o = {}) {
  const mode = o.mode || 'play';
  for (let i = 0; i < 8; i++) {
    if (o.skip && o.skip.includes(i)) continue;
    let x, z, opt;
    if (i === 7) {                                        // goleiro do time vermelho, no gol de baixo, acompanha a bola de lado
      x = Math.sin(T * 0.8) * 1.2; z = -21.2;
      opt = mode === 'cheer' ? { expr: 'joy', armL: 150, armR: 150, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: Math.abs(Math.sin(T * 7)) * 25 } : { armL: 50, armR: 50, bendL: 40, bendR: 40, expr: 'neutral', lx: Math.cos(T * 0.8) };
    } else {
      const p = routePos(i, mode === 'play' ? T : (o.t0 || T)); x = p.x; z = p.z;
      if (mode === 'play') opt = Object.assign(viewFor(x, z, p.vx, p.vz), { walk: T * (9 + SPD[i]) + i, run: 1, tilt: 0, expr: i % 3 ? 'happy' : 'neutral' });
      else if (mode === 'cheer') { const win = i < 4; opt = { expr: win ? 'joy' : 'sad', armL: win ? 150 + Math.sin(T * 9 + i) * 20 : 10, armR: win ? 150 : 10, bendL: 10, bendR: 10, handL: 'open', handR: 'open', jump: win ? Math.abs(Math.sin(T * 7 + i)) * 30 : 0, ly: win ? 0 : 1 }; }
      else if (mode === 'look') { const fx = o.fx || 0, fz = o.fz || 0; opt = { face: x < fx ? 0.5 : -0.5, lx: x < fx ? 1 : -1, ly: o.up ? -1 : 0, expr: o.expr || 'worried' }; }
      else if (mode === 'leave') { const a = Math.atan2(z - (o.fz || 0), x - (o.fx || 0)), d = (o.t || 0) * 3.5; x += Math.cos(a) * d; z += Math.sin(a) * d; opt = Object.assign(viewFor(x, z, Math.cos(a), Math.sin(a)), { walk: T * 8 + i, expr: 'neutral' }); }
    }
    if (o.only && !o.only(x, z)) continue;
    await place('jog' + i, person('jog' + i, Object.assign({ x: 0, y: 0, s: 1, t: T + i }, opt)), x, 0, z);
  }
}
