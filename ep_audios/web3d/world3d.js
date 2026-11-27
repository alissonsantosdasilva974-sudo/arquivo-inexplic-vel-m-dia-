// Motor 3D (three.js) no estilo "cenário 3D com acabamento de desenho": toon shading, contorno preto,
// sombras suaves, câmera em perspectiva. Os bonecos continuam sendo o SVG do canal, como recortes (billboards).
const R3 = new THREE.WebGLRenderer({ canvas: document.getElementById('gl'), antialias: true, preserveDrawingBuffer: true });
R3.setSize(1080, 1920, false); R3.setPixelRatio(1);
R3.shadowMap.enabled = true; R3.shadowMap.type = THREE.PCFSoftShadowMap;
R3.outputEncoding = THREE.sRGBEncoding; R3.toneMapping = THREE.NoToneMapping; R3.toneMappingExposure = 1.05;
const SCENE = new THREE.Scene();
const CAM = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.05, 600);
// ---------- materiais toon ----------
const GRAD = (() => { const d = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const MATS = {};
const toon = (c, o = {}) => { const k = c + JSON.stringify(o); if (!MATS[k]) MATS[k] = new THREE.MeshToonMaterial(Object.assign({ color: new THREE.Color(c), gradientMap: GRAD }, o)); return MATS[k]; };
const INKM = new THREE.MeshBasicMaterial({ color: 0x1e1820, side: THREE.BackSide });
// malha com contorno (casco invertido)
function M(geo, color, o = {}) {
  const g = new THREE.Group(), m = new THREE.Mesh(geo, o.mat || toon(color, o.mo));
  m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m);
  if (o.outline !== false) { const h = new THREE.Mesh(geo, INKM); h.scale.setScalar(1 + (o.ol || 0.04)); if (o.olAbs) { const s = o.olAbs; h.scale.set(1 + s / (geo.parameters.width || 1), 1 + s / (geo.parameters.height || 1), 1 + s / (geo.parameters.depth || 1)); } g.add(h); }
  return g;
}
const box = (w, h, d, c, o = {}) => M(new THREE.BoxGeometry(w, h, d), c, Object.assign({ olAbs: 0.05 }, o));
const cyl = (r0, r1, h, c, o = {}) => M(new THREE.CylinderGeometry(r0, r1, h, o.seg || 16), c, Object.assign({ ol: 0.06 }, o));
const sph = (r, c, o = {}) => M(new THREE.SphereGeometry(r, 20, 14), c, Object.assign({ ol: 0.045 }, o));
const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; SCENE.add(o); return o; };
function canvasTex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; }
// ---------- luzes ----------
const HEMI = new THREE.HemisphereLight(0xfff0dc, 0x9a7a6a, 0.6); SCENE.add(HEMI);
const SUN = new THREE.DirectionalLight(0xffd8a8, 1.35); SUN.position.set(-30, 26, -18); SUN.castShadow = true;
SUN.shadow.mapSize.set(2048, 2048); Object.assign(SUN.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 140 }); SUN.shadow.bias = -0.0006; SUN.shadow.radius = 4;
SCENE.add(SUN); SCENE.add(SUN.target);
SCENE.fog = new THREE.Fog(0xf6c89a, 55, 190);
const SKY = canvasTex(8, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#d8705a'); gr.addColorStop(0.55, '#f2a070'); gr.addColorStop(1, '#fde0b0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
SCENE.background = SKY;
// ---------- texturas ----------
const TERRA = canvasTex(1024, 1024, (g, w, h) => { g.fillStyle = '#d9a872'; g.fillRect(0, 0, w, h); const r = rng(3); for (let i = 0; i < 2600; i++) { g.fillStyle = r() < 0.5 ? 'rgba(150,100,60,0.18)' : 'rgba(255,235,200,0.18)'; g.beginPath(); g.ellipse(r() * w, r() * h, 2 + r() * 9, 1 + r() * 4, r() * 3, 0, 7); g.fill(); } for (let i = 0; i < 40; i++) { g.strokeStyle = 'rgba(120,80,50,0.18)'; g.lineWidth = 3; g.beginPath(); const x = r() * w, y = r() * h; g.moveTo(x, y); g.quadraticCurveTo(x + 30, y + 10, x + 60, y - 5); g.stroke(); } }, [6, 12]);
const CALCADA = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#efe6d4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3a3440'; g.lineWidth = 14; for (let i = -2; i < 6; i++) { g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, i * 120 + Math.sin(x / w * Math.PI * 2) * 40); g.stroke(); } }, [1, 1]);
const ASFALTO = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#7e7a86'; g.fillRect(0, 0, w, h); const r = rng(5); for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '40,36,48' : '200,196,206'},0.15)`; g.fillRect(r() * w, r() * h, 2, 2); } }, [4, 4]);
// ---------- construtores ----------
const WD = { FW: 10.5, FL: 22 };
function plane(w, d, mat, x, y, z, rx = -Math.PI / 2) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat); m.rotation.x = rx; m.position.set(x, y, z); m.receiveShadow = true; SCENE.add(m); return m; }
function chalk(x0, z0, x1, z1, w = 0.12) { const L = Math.hypot(x1 - x0, z1 - z0), m = new THREE.Mesh(new THREE.PlaneGeometry(w, L), new THREE.MeshBasicMaterial({ color: 0xfff6e4, transparent: true, opacity: 0.9 })); m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(x1 - x0, z1 - z0); m.position.set((x0 + x1) / 2, 0.012, (z0 + z1) / 2); SCENE.add(m); }
function ipe3(x, z, col, k = 1) {
  const g = new THREE.Group(); g.add(cyl(0.16 * k, 0.24 * k, 3.2 * k, '#6a4a34').translateY(1.6 * k));
  const r = rng(Math.floor(x * 7 + z * 13));
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; g.add(sph((0.9 + r() * 0.5) * k, i % 3 ? col : mix(col, '#ffffff', 0.25)).translateX(Math.cos(a) * 1.1 * k).translateZ(Math.sin(a) * 1.1 * k).translateY((3.6 + r() * 0.8) * k)); }
  g.add(sph(1.3 * k, col).translateY(4.6 * k)); g.userData.sway = r() * 6; return at(g, x, 0, z);
}
function lamp3(x, z) { const g = new THREE.Group(); g.add(cyl(0.07, 0.1, 4.2, '#3a3448').translateY(2.1)); g.add(box(0.5, 0.35, 0.5, '#ffe2a0', { mo: { emissive: new THREE.Color('#ffc870'), emissiveIntensity: 0.4 } }).translateY(4.35)); g.add(cyl(0.05, 0.35, 0.2, '#3a3448').translateY(4.6)); return at(g, x, 0, z); }
function bench3(x, z, ry = 0) { const g = new THREE.Group(); g.add(box(1.8, 0.08, 0.45, '#a46a3a').translateY(0.45)); g.add(box(1.8, 0.35, 0.06, '#a46a3a').translateY(0.75).translateZ(-0.22)); for (const sx of [-0.75, 0.75]) g.add(box(0.08, 0.45, 0.4, '#3a3448').translateX(sx).translateY(0.22)); return at(g, x, 0, z, ry); }
function goal3(z, dir) {
  const g = new THREE.Group(), w = 5, h = 2.1, d = 1.2, c = '#fbf8f0';
  for (const sx of [-w / 2, w / 2]) g.add(cyl(0.06, 0.06, h, c).translateX(sx).translateY(h / 2));
  const bar = cyl(0.06, 0.06, w, c); bar.rotation.z = Math.PI / 2; bar.position.y = h; g.add(bar);
  const netTex = canvasTex(256, 256, (q, W2, H2) => { q.clearRect(0, 0, W2, H2); q.strokeStyle = 'rgba(255,250,240,0.85)'; q.lineWidth = 3; for (let i = 0; i <= 256; i += 16) { q.beginPath(); q.moveTo(i, 0); q.lineTo(i, H2); q.stroke(); q.beginPath(); q.moveTo(0, i); q.lineTo(W2, i); q.stroke(); } }, [6, 3]);
  const nm = new THREE.MeshBasicMaterial({ map: netTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 20, 10), nm); back.position.set(0, h / 2, d); g.add(back); g.userData.net = back; g.userData.base = back.geometry.attributes.position.array.slice();
  for (const sx of [-w / 2, w / 2]) { const s = new THREE.Mesh(new THREE.PlaneGeometry(d, h), nm); s.rotation.y = Math.PI / 2; s.position.set(sx, h / 2, d / 2); g.add(s); }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w, d), nm); top.rotation.x = Math.PI / 2; top.position.set(0, h, d / 2); g.add(top);
  return at(g, 0, 0, z, dir > 0 ? 0 : Math.PI);
}
function bulgeNet(goal, amt, bx = 0, by = 1) { const n = goal.userData.net, p = n.geometry.attributes.position, b = goal.userData.base; for (let i = 0; i < p.count; i++) { const x = b[i * 3], y = b[i * 3 + 1], f = Math.max(0, 1 - ((x - bx) ** 2) / 4 - ((y - (by - 1.05)) ** 2) / 1.5); p.array[i * 3 + 2] = b[i * 3 + 2] + amt * f * 0.9; } p.needsUpdate = true; }
const WINTEX = {};
function facadeTex(col, floors, shop, seed) {
  const k = col + floors + shop + seed; if (WINTEX[k]) return WINTEX[k];
  return WINTEX[k] = canvasTex(256, 64 * floors, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); const r = rng(seed);
    for (let f = 0; f < floors; f++) { const y = h - (f + 1) * 64; g.fillStyle = 'rgba(30,20,40,0.18)'; g.fillRect(0, y + 60, w, 4);
      if (f === 0 && shop) { g.fillStyle = CARC[seed % CARC.length]; g.fillRect(0, y + 4, w, 14); g.fillStyle = '#9fc3d8'; g.fillRect(14, y + 22, w * 0.6, 38); g.fillStyle = '#5a4038'; g.fillRect(w * 0.72, y + 20, 40, 44); continue; }
      for (let i = 0; i < 3; i++) { const x = 18 + i * 80; g.fillStyle = '#f4ead4'; g.fillRect(x - 4, y + 12, 52, 42); g.fillStyle = r() < 0.2 ? '#ffd27a' : '#6a8aa8'; g.fillRect(x, y + 16, 44, 34); g.fillStyle = '#2a2030'; g.fillRect(x + 21, y + 16, 2, 34); if (r() < 0.4) { g.fillStyle = ['#e86a6a', '#f2c230', '#ee8aaa'][i]; g.fillRect(x - 4, y + 52, 52, 6); } } } });
}
function bldg3(x, z, w, d, floors, col, shop, seed, ry = 0) {
  const h = floors * 3, g = new THREE.Group(), tex = facadeTex(col, floors, shop, seed);
  const mats = [toon(col), toon(col), toon(shade(col, 0.15)), toon(col), new THREE.MeshToonMaterial({ map: tex, gradientMap: GRAD }), new THREE.MeshToonMaterial({ map: tex, gradientMap: GRAD })];
  const geo = new THREE.BoxGeometry(w, h, d), m = new THREE.Mesh(geo, mats); m.castShadow = m.receiveShadow = true; m.position.y = h / 2; g.add(m);
  const hull = new THREE.Mesh(geo, INKM); hull.scale.set(1 + 0.08 / w, 1 + 0.08 / h, 1 + 0.08 / d); hull.position.y = h / 2; g.add(hull);
  g.add(box(w + 0.3, 0.35, d + 0.3, shade(col, 0.3)).translateY(h + 0.1));
  if (seed % 3 === 0) g.add(cyl(0.6, 0.6, 1.2, '#5a8ac8').translateY(h + 0.8).translateX(w * 0.2));
  return at(g, x, 0, z, ry);
}
function car3(col) { const g = new THREE.Group(); g.add(box(1.8, 0.7, 4, col).translateY(0.55)); g.add(box(1.6, 0.6, 2, mix(col, '#ffffff', 0.2)).translateY(1.15).translateZ(-0.2)); for (const [sx, sz] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) { const w = cyl(0.33, 0.33, 0.25, '#2a2430'); w.rotation.z = Math.PI / 2; w.position.set(sx, 0.33, sz); g.add(w); } SCENE.add(g); return g; }

// ---------- recortes 2D (bonecos do canal) ----------
const UPM = 230.9;                              // unidades SVG por metro (pessoa s=1 tem 1,75 m)
const VB = { x: -340, y: -760, w: 680, h: 840 };  // caixa do desenho em unidades SVG
const CUTS = {};
function cut(name) {
  if (CUTS[name]) return CUTS[name];
  const c = document.createElement('canvas'); c.width = 680; c.height = 840; const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide });
  const geo = new THREE.PlaneGeometry(VB.w / UPM, VB.h / UPM); geo.translate(0, -(VB.y + VB.h / 2) / -UPM * -1, 0);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true;
  m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
  const pivot = new THREE.Group(); pivot.add(m); const root = new THREE.Group(); root.add(pivot); SCENE.add(root);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24), new THREE.MeshBasicMaterial({ color: 0x1b1424, transparent: true, opacity: 0.28, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; shadow.scale.set(1, 0.55, 1); SCENE.add(shadow);
  return CUTS[name] = { c, g: c.getContext('2d'), tex, m, pivot, root, shadow, last: '' };
}
async function paintCut(K, svgInner) {
  if (svgInner === K.last) return; K.last = svgInner;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="840" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}">${DEFS}${svgInner}</svg>`;
  const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
  K.g.clearRect(0, 0, 680, 840); K.g.drawImage(img, 0, 0); K.tex.needsUpdate = true;
}
// pose um recorte: svg = desenho na origem (pés em 0,0) em escala 1; pos em metros; k = escala; rot = giro no plano da tela (graus) em volta do quadril
async function place(name, svg, x, y, z, o = {}) {
  const K = cut(name); await paintCut(K, svg);
  K.root.visible = K.shadow.visible = true;
  K.root.position.set(x, y, z);
  const k = o.k || 1; K.root.scale.setScalar(k);
  // de frente para a câmera (só em volta do eixo vertical) — igual aos recortes da referência
  const dx = CAM.position.x - x, dz = CAM.position.z - z; K.root.rotation.set(0, Math.atan2(dx, dz), 0);
  const hip = (o.hip || 0.85); K.pivot.position.y = hip; K.m.position.y = -hip; K.pivot.rotation.z = -(o.rot || 0) * Math.PI / 180;
  if (o.ground) {   // nada do corpo passa do chão: mede cabeça e pés do recorte girado
    K.root.updateMatrixWorld(true); let lo = 1e9;
    for (const yy of [0.05, 0.6, 1.2, 1.85]) lo = Math.min(lo, K.m.localToWorld(new THREE.Vector3(0, yy, 0)).y);
    if (lo < 0.12) K.root.position.y += 0.12 - lo;
  }
  K.shadow.position.set(x, 0.02, z); const lift = Math.max(0, y); K.shadow.scale.set(k * (o.sw || 1) / (1 + lift), k * 0.55 * (o.sw || 1) / (1 + lift), 1); K.shadow.material.opacity = 0.28 / (1 + lift * 0.8);
  return K;
}
// ---------- clima (luz por cena) ----------
function mood(name) {
  const P = { orange: { sky: ['#6fa8d8', '#a8c8e0', '#f8c8a0', '#fde8c0'], sun: 0xffe0b8, si: 1.3, hemi: 0.65, fog: 0xf4dcc0, exp: 1.0, cloud: ['#fff6ee', '#f8c8b8'] },
    blue: { sky: ['#0e1236', '#22285a', '#3a3a78', '#5a5a96'], sun: 0x8aa0ff, si: 0.5, hemi: 0.42, fog: 0x2e3264, exp: 1.0, cloud: ['#4a4a80', '#3a3a6a'] },
    sepia: { sky: ['#c8a070', '#dcb888', '#f0d4a8', '#f8e6c4'], sun: 0xffe2b4, si: 1.1, hemi: 0.75, fog: 0xead2ac, exp: 1.0, cloud: ['#fff2dc', '#f0d8b4'] } }[name];
  if (mood.cur === name) return; mood.cur = name;
  SUN.color.setHex(P.sun); SUN.intensity = P.si; HEMI.intensity = P.hemi; SCENE.fog.color.setHex(P.fog); R3.toneMappingExposure = P.exp;
  const g = SKY.image.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512); P.sky.forEach((c, i) => gr.addColorStop([0, 0.35, 0.75, 1][i], c)); g.fillStyle = gr; g.fillRect(0, 0, 8, 512); SKY.needsUpdate = true;
  for (const c of CLOUDS) c.children.forEach((m, i) => { if (m.material && m.material.color) m.material.color.set(i % 2 ? P.cloud[1] : P.cloud[0]); });
  STARS.visible = name === 'blue';
}
// nuvens 3D macias e estrelas
const CLOUDS = [];
(function () { const r = rng(9); for (let i = 0; i < 14; i++) { const g = new THREE.Group(); for (let k = 0; k < 5; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(4 + r() * 4, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })); m.scale.y = 0.55; m.position.set(k * 5 - 10, r() * 2, r() * 3); g.add(m); } g.position.set(-150 + r() * 300, 55 + r() * 30, 80 + r() * 120 * (r() < 0.5 ? 1 : -1)); g.userData.sp = 0.6 + r(); g.userData.x0 = g.position.x; CLOUDS.push(g); SCENE.add(g); } })();
const STARS = (() => { const r = rng(4), p = []; for (let i = 0; i < 500; i++) { const a = r() * Math.PI * 2, e = 0.15 + r() * 1.2; p.push(Math.cos(a) * Math.cos(e) * 300, Math.sin(e) * 300, Math.sin(a) * Math.cos(e) * 300); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); const s = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfff6d8, size: 1.6, fog: false })); s.visible = false; SCENE.add(s); return s; })();
function animateWorld(T) {
  for (const c of CLOUDS) c.position.x = ((c.userData.x0 + 150 + T * c.userData.sp) % 300) - 150;
  for (const tr of WORLD.trees) tr.rotation.z = Math.sin(T * 0.9 + tr.userData.sway) * 0.015;
  for (const c of WORLD.cars) { const L = 120, z = ((c.ph * 7 + T * 9 * c.lane) % L + L) % L - 60; c.g.position.set(c.side * (WD.FW + 16) + c.lane * 2, 0, z); c.g.rotation.y = c.lane > 0 ? 0 : Math.PI; }
}
// ---------- composição: dissolve entre planos, legenda de 1 palavra ----------
const RT = [new THREE.WebGLRenderTarget(1080, 1920, { samples: 4 }), new THREE.WebGLRenderTarget(1080, 1920, { samples: 4 })];
RT.forEach(r => r.texture.encoding = THREE.sRGBEncoding);
const MIXQ = (() => { const m = new THREE.ShaderMaterial({ uniforms: { a: { value: null }, b: { value: null }, k: { value: 0 } }, vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: 'uniform sampler2D a,b;uniform float k;varying vec2 v;void main(){gl_FragColor=mix(texture2D(a,v),texture2D(b,v),k);}' }); const s = new THREE.Scene(); s.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m)); return { s, m, c: new THREE.Camera() }; })();
function caption1(T) {
  for (const c of CAPTIONS) for (const w of c.words) if (T >= w.s - 0.02 && T < (w.e + 0.12)) {
    const ap = E.back(clamp((T - w.s) / 0.1)), key = /áudio|audio|polo|caio|mãe|escuto|pulo|esperando|espero|fim/i.test(w.w);
    const txt = esc(w.w.replace(/^["“]|["”,.]+$/g, '').replace(/[,.]$/, ''));
    return `<g transform="translate(540 1080) scale(${f2(0.7 + 0.3 * ap)})"><text text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="118" fill="${key ? '#ffd23f' : '#ffffff'}" stroke="#141018" stroke-width="22" stroke-linejoin="round" paint-order="stroke">${txt}</text></g>`;
  }
  return '';
}
window.renderFrame = async function (f) {
  const T = f / FPS; let i = 0; for (let j = SHOTS3.length - 1; j >= 0; j--) if (T >= SHOTS3[j].t0) { i = j; break; }
  const sh = SHOTS3[i], t = T - sh.t0, xf = 0.3;
  animateWorld(T);
  const draw = async (S, tt) => { hideCuts(); resetProps(); const r = await S.draw(tt, T); mood(r.mood || 'day'); return r; };
  let over;
  if (i > 0 && t < xf) {
    const p = SHOTS3[i - 1]; await draw(p, T - p.t0); R3.setRenderTarget(RT[0]); R3.render(SCENE, CAM);
    const r = await draw(sh, t); over = r.over; R3.setRenderTarget(RT[1]); R3.render(SCENE, CAM);
    MIXQ.m.uniforms.a.value = RT[0].texture; MIXQ.m.uniforms.b.value = RT[1].texture; MIXQ.m.uniforms.k.value = E.inOut(t / xf);
    R3.setRenderTarget(null); R3.render(MIXQ.s, MIXQ.c);
  } else { const r = await draw(sh, t); over = r.over; R3.setRenderTarget(null); R3.render(SCENE, CAM); }
  document.getElementById('ovl').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><radialGradient id="vg" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient><rect width="1080" height="1920" fill="url(#vg)"/>${over || ''}${typeof HUD3 === "function" ? HUD3(T) : ""}${caption1(T)}${badge()}</svg>`;
  return i;
};
// câmera: posição e alvo (metros), fov
function camSet(px, py, pz, tx, ty, tz, fov = 42, roll = 0) { CAM.position.set(px, py, pz); CAM.fov = fov; CAM.updateProjectionMatrix(); CAM.lookAt(tx, ty, tz); CAM.rotateZ(roll * Math.PI / 180); }
