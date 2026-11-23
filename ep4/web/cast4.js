// Elenco e objetos do ep. 4 ("Toda mentira pesa nos ombros"). O rig (characters2.js) NÃO é alterado: só acrescentamos personagens ao CAST2.
// Sem verde em nenhum personagem ou objeto (chroma key).
Object.assign(CAST2, {
  antonio:  { skin: '#b9784c', top: '#5a7ab0', topD: '#3f5e90', topType: 'shirt', apron: 0, bottom: '#2f3d5e', shoes: '#2a2228', hair: 'sides', hairC: '#9a98a4', stache: '#8e8c98', w: 1.12, seed: 21 },
  prefeito: { skin: '#e9c7a8', top: '#3a4a7a', topD: '#28365e', topType: 'shirt', tie: '#f2c230', bottom: '#3a4a7a', shoes: '#121016', hair: 'short', hairC: '#6a6a76', hatDefault: 'none', w: 1.2, scale: 1.08, seed: 22 },
  seguranca:{ skin: '#8d5a34', top: '#1e1e2c', topD: '#12121c', topType: 'shirt', tie: '#1e1e2c', bottom: '#1e1e2c', shoes: '#0c0a10', hair: 'short', hairC: '#0e0c12', hatDefault: 'none', w: 1.22, scale: 1.14, seed: 23 },
  filha:    { skin: '#c98b5e', top: '#e86a8a', topD: '#c24a6a', topType: 'tee', bottom: '#4f72b8', shoes: '#f4f1ea', hair: 'long', hairC: '#2a1810', bow: '#f2c230', blush: 1, ear: '#e86a8a', scale: 0.95, w: 1.0, seed: 24 },
  morador:  { skin: '#e0ac79', top: '#d0704a', topD: '#a8502e', topType: 'tee', pattern: 'pStripeH', bottom: '#3a3a4a', shoes: '#2a2228', hair: 'short', hairC: '#3a2418', w: 1.12, seed: 25 },
});
// espinha torta: lean (graus) do Seu Antônio ao longo da história — mecânica visual central
const LEAN = {
  // [T, lean] — degraus acompanham a narração
  keys: [[0, 0], [27.6, 12], [33.6, 15], [35.5, 24], [37.5, 32], [39.4, 32], [46.4, 32], [47.0, 37], [64.4, 30], [77.3, 30], [78.9, 30], [79.6, 36], [81.8, 38], [83.3, 41], [84.6, 44], [85.7, 44], [100, 38], [104.4, 38]],
};
function antonioLean(T) {
  if (T < 106.0) return kf(T, LEAN.keys.map(k => [k[0], k[1]]), E.inOut);
  // "respirou fundo… ficou retinho": endireita suave de 38 até 0
  return ramp(T, 106.0, 111.0, 38, 0, E.inOut);
}
