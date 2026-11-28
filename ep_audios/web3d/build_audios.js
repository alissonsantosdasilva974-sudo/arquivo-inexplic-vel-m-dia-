// ============ Ep. "Áudios" — cenário 3D detalhado ============
// Praça da caixa dos recados, rua da dona Lúcia (casas térreas com telhado de telha), quarto do Caio e cozinha.
// Paleta sem verde (chroma key): folhagem em vinho/magenta/lilás, ipês rosa e amarelo.
function hideCuts() { for (const k in CUTS) { CUTS[k].root.visible = false; CUTS[k].shadow.visible = false; } }
const WORLD = { trees: [], cars: [], lamps: [], glows: [], water: null };
const BOXP = { x: 0, z: 2 };                    // caixa dos recados (frente virada para -z)
const HOUSE = { x: 9, z: -25 };                 // casa da dona Lúcia (fachada em z = -22)
const DOORZ = -22;                              // plano da porta da casa
const ST = -19.75;                               // calçada em frente às casas
const RX = 200, KX = 300;                       // sets do quarto e da cozinha
const G = () => new THREE.Group();
const add = (p, o, x = 0, y = 0, z = 0, ry = 0) => { o.position.set(x, y, z); if (ry) o.rotation.y = ry; p.add(o); return o; };
const tmat = (map, o = {}) => new THREE.MeshToonMaterial(Object.assign({ map, gradientMap: GRAD }, o));
function texBox(w, h, d, map, side = '#ccc', o = {}) { const g = G(); const mats = [toon(side), toon(side), toon(side), toon(side), tmat(map), tmat(map)]; const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m); if (o.outline !== false) { const hl = new THREE.Mesh(m.geometry, INKM); hl.scale.set(1 + 0.05 / w, 1 + 0.05 / h, 1 + 0.05 / d); g.add(hl); } return g; }
// ---------- texturas ----------
const TEX = {};
TEX.tiles = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b8503a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) for (let c = 0; c < 9; c++) { const x = c * 32 - (r % 2) * 16, y = r * 32; const gr = g.createLinearGradient(x, y, x + 32, y); gr.addColorStop(0, '#9a3a2a'); gr.addColorStop(0.5, '#d2684a'); gr.addColorStop(1, '#9a3a2a'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, y + 32); g.quadraticCurveTo(x + 16, y - 6, x + 32, y + 32); g.fill(); g.strokeStyle = 'rgba(40,16,16,0.5)'; g.lineWidth = 2; g.stroke(); } }, [3, 2]);
TEX.wood = canvasTex(256, 64, (g, w, h) => { g.fillStyle = '#b8763e'; g.fillRect(0, 0, w, h); const r = rng(8); for (let i = 0; i < 26; i++) { g.strokeStyle = `rgba(90,44,20,${0.15 + r() * 0.2})`; g.lineWidth = 1 + r() * 2; g.beginPath(); const y = r() * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + r() * 8 - 4, w * 0.6, y + r() * 8 - 4, w, y); g.stroke(); } });
TEX.floor = canvasTex(512, 512, (g, w, h) => { const r = rng(4); for (let i = 0; i < 8; i++) { const o = (i % 2) * 128; for (let j = -1; j < 3; j++) { g.fillStyle = ['#b07a4a', '#a46e40', '#bc8654', '#a87244'][Math.floor(r() * 4)]; g.fillRect(j * 256 + o, i * 64, 256, 64); g.strokeStyle = 'rgba(50,24,12,0.55)'; g.lineWidth = 3; g.strokeRect(j * 256 + o, i * 64, 256, 64); for (let k = 0; k < 4; k++) { g.strokeStyle = 'rgba(80,40,20,0.18)'; g.lineWidth = 1.5; g.beginPath(); const y = i * 64 + 8 + r() * 48; g.moveTo(j * 256 + o, y); g.lineTo(j * 256 + o + 256, y + r() * 6 - 3); g.stroke(); } } } }, [2, 2]);
TEX.wallpaper = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#9fb4e0'; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { g.fillStyle = '#8aa2d4'; g.fillRect(x, 0, 14, h); } g.fillStyle = 'rgba(255,255,255,0.5)'; for (let y = 16; y < h; y += 48) for (let x = 23; x < w; x += 64) { g.beginPath(); g.arc(x, y + (x % 128 ? 24 : 0), 4, 0, 7); g.fill(); } }, [4, 2]);
TEX.kitchenWall = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f6dc90'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(200,150,60,0.25)'; g.lineWidth = 2; for (let y = 0; y < h; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } }, [4, 2]);
TEX.backsplash = canvasTex(256, 128, (g, w, h) => { for (let y = 0; y < h; y += 32) for (let x = 0; x < w; x += 32) { g.fillStyle = (x / 32 + y / 32) % 2 ? '#ffffff' : '#a8c8f0'; g.fillRect(x, y, 32, 32); g.fillStyle = '#3a6ac0'; g.beginPath(); g.arc(x + 16, y + 16, 5, 0, 7); g.fill(); g.strokeStyle = '#c8c4d0'; g.lineWidth = 2; g.strokeRect(x, y, 32, 32); } }, [6, 1]);
TEX.checker = canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#f6ecd8' : '#d8506a'; g.fillRect(i * 32, j * 32, 32, 32); } g.strokeStyle = 'rgba(80,30,40,0.25)'; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } }, [5, 5]);
TEX.cloth = canvasTex(128, 128, (g, w, h) => { g.fillStyle = '#fff6e8'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(232,80,58,0.55)'; for (let i = 0; i < 8; i += 2) { g.fillRect(i * 16, 0, 16, h); g.fillRect(0, i * 16, w, 16); } }, [3, 3]);
TEX.blanket = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#e8503a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2a43a'; for (let i = 0; i < 8; i++) g.fillRect(0, i * 32 + 8, w, 6); g.fillStyle = '#fff6e0'; for (let i = 0; i < 8; i++) g.fillRect(i * 32 + 12, 0, 4, h); }, [1, 1]);
TEX.rug = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7b52b8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f2c230'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28); g.strokeStyle = '#ee8aaa'; g.lineWidth = 6; g.strokeRect(34, 34, w - 68, h - 68); g.fillStyle = '#f2c230'; for (let i = 0; i < 5; i++) { g.save(); g.translate(w / 2, h / 2); g.rotate(i * Math.PI / 5 * 2); g.beginPath(); g.ellipse(0, -40, 14, 34, 0, 0, 7); g.fill(); g.restore(); } });
TEX.plaster = {};
function plasterTex(col) { if (TEX.plaster[col]) return TEX.plaster[col]; return TEX.plaster[col] = canvasTex(256, 256, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); const r = rng(col.length * 13); for (let i = 0; i < 900; i++) { g.fillStyle = r() < 0.5 ? 'rgba(80,50,60,0.06)' : 'rgba(255,255,255,0.08)'; g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(70,40,40,0.12)'; g.fillRect(0, h - 30, w, 30); }, [2, 2]); }
TEX.books = canvasTex(256, 64, (g, w, h) => { const r = rng(6); let x = 0; while (x < w) { const bw = 8 + r() * 14, bh = 40 + r() * 22; g.fillStyle = ['#e8503a', '#3a6ac0', '#f2c230', '#7b52b8', '#ee8aaa', '#f4f1ea', '#2a2a3a', '#e07a3a'][Math.floor(r() * 8)]; g.fillRect(x, h - bh, bw, bh); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x + 2, h - bh + 6, bw - 4, 3); g.strokeStyle = '#1e1820'; g.lineWidth = 1.5; g.strokeRect(x, h - bh, bw, bh); x += bw + 1; } });
TEX.curtain = (c1, c2) => canvasTex(128, 256, (g, w, h) => { for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, c2); gr.addColorStop(0.5, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(x, 0, 16, h); } });
TEX.sidewalk = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d8cfc0'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(90,80,90,0.35)'; g.lineWidth = 3; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } const r = rng(2); for (let i = 0; i < 300; i++) { g.fillStyle = 'rgba(90,80,90,0.1)'; g.fillRect(r() * w, r() * h, 2, 2); } }, [30, 1]);
TEX.glass = canvasTex(64, 64, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#cfe6ff'); gr.addColorStop(0.45, '#8ab4e0'); gr.addColorStop(0.5, '#e8f4ff'); gr.addColorStop(0.6, '#8ab4e0'); gr.addColorStop(1, '#6a94c8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const GLASSM = tmat(TEX.glass);
const LITM = new THREE.MeshBasicMaterial({ color: 0xffd890 });
// ---------- peças ----------
const flowerCols = ['#ee8aaa', '#f2c230', '#e8503a', '#b88ae0', '#fff6e0', '#f2a43a'];
function shrub(r = 0.5, seed = 1, cols = ['#8a2a4a', '#a8365a', '#6a2a48']) { const g = G(), q = rng(seed); for (let i = 0; i < 6; i++) { const s = sph(r * (0.5 + q() * 0.4), cols[i % cols.length], { ol: 0.06 }); s.position.set((q() - 0.5) * r * 1.4, r * (0.45 + q() * 0.4), (q() - 0.5) * r * 1.2); g.add(s); } for (let i = 0; i < 9; i++) { const f = sph(0.05 + q() * 0.03, flowerCols[Math.floor(q() * flowerCols.length)], { outline: false, cast: false }); f.position.set((q() - 0.5) * r * 1.5, r * (0.6 + q() * 0.6), -r * 0.55 + (q() - 0.5) * r); g.add(f); } return g; }
function pot(seed = 1) { const g = G(); g.add(cyl(0.14, 0.1, 0.22, '#c8643c').translateY(0.11)); const s = shrub(0.22, seed, ['#a8365a', '#d0457a']); s.position.y = 0.16; g.add(s); return g; }
function bench(x, z, ry = 0) {   // banco de praça: ripas de madeira e pés de ferro fundido
  const g = G(), wood = tmat(TEX.wood), IR = '#2e2a38';
  for (let i = 0; i < 4; i++) add(g, M(new THREE.BoxGeometry(1.9, 0.045, 0.1), '#b8763e', { mat: wood, ol: 0.06 }), 0, 0.46, -0.16 + i * 0.12);
  for (let i = 0; i < 3; i++) { const s = add(g, M(new THREE.BoxGeometry(1.9, 0.1, 0.035), '#b8763e', { mat: wood, ol: 0.06 }), 0, 0.62 + i * 0.13, -0.27 - i * 0.025); s.rotation.x = -0.18; }
  for (const sx of [-0.85, 0.85]) {
    add(g, box(0.06, 0.46, 0.06, IR), sx, 0.23, 0.18); add(g, box(0.06, 0.95, 0.06, IR), sx, 0.47, -0.25).rotation.x = -0.12;
    add(g, box(0.06, 0.05, 0.5, IR), sx, 0.42, -0.02); const arm = add(g, box(0.07, 0.05, 0.42, IR), sx, 0.68, 0.0); arm.rotation.x = 0.05; add(g, sph(0.045, IR), sx, 0.68, 0.22);
    add(g, box(0.16, 0.03, 0.12, IR), sx, 0.015, 0.18); add(g, box(0.16, 0.03, 0.12, IR), sx, 0.015, -0.3);
  }
  return at(g, x, 0, z, ry);
}
function lampPost(x, z) {
  const g = G(), IR = '#2e2a38';
  add(g, cyl(0.16, 0.2, 0.35, IR), 0, 0.17); add(g, cyl(0.07, 0.09, 3.6, IR), 0, 2.1); for (const y of [0.6, 1.2, 3.6]) add(g, cyl(0.1, 0.1, 0.06, IR), 0, y);
  add(g, cyl(0.04, 0.16, 0.2, IR), 0, 3.95); const lan = add(g, M(new THREE.CylinderGeometry(0.17, 0.12, 0.42, 6), '#ffe2a0', { mat: new THREE.MeshToonMaterial({ color: '#ffe2a0', emissive: new THREE.Color('#ffc870'), emissiveIntensity: 0.3, gradientMap: GRAD }) }), 0, 4.26);
  add(g, cyl(0.02, 0.26, 0.18, IR), 0, 4.55); add(g, sph(0.05, IR), 0, 4.68);
  const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); gl.scale.setScalar(2.2); gl.position.y = 4.26; g.add(gl); WORLD.glows.push(gl);
  WORLD.lamps.push(lan); return at(g, x, 0, z);
}
function trashBin(x, z) { const g = G(); g.add(cyl(0.22, 0.18, 0.75, '#e07a3a', { seg: 12 }).translateY(0.5)); g.add(cyl(0.24, 0.24, 0.06, '#2e2a38').translateY(0.88)); g.add(cyl(0.04, 0.04, 0.5, '#2e2a38').translateY(0.25)); return at(g, x, 0, z); }
function flowerBed(x, z, w, d, seed) { const g = G(); g.add(box(w, 0.25, d, '#d8cfc0').translateY(0.125)); g.add(M(new THREE.BoxGeometry(w - 0.16, 0.05, d - 0.16), '#6a4030', { outline: false, mat: tmat(TERRA) }).translateY(0.26)); const q = rng(seed); for (let i = 0; i < Math.round(w * d * 1.4); i++) { const s = shrub(0.28 + q() * 0.15, seed * 7 + i, q() < 0.5 ? ['#8a2a4a', '#a8365a'] : ['#6a3a7a', '#8a4a9a']); s.position.set((q() - 0.5) * (w - 0.6), 0.25, (q() - 0.5) * (d - 0.6)); g.add(s); } return at(g, x, 0, z); }
function bunting(x0, z0, x1, z1, y = 4.4) { const n = 18, cols = ['#e8503a', '#f2c230', '#3a6ac0', '#ee8aaa', '#fff6e0', '#7b52b8']; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, sag = Math.sin(u * Math.PI) * 0.8; const m = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.17, 0, 0), new THREE.Vector3(0.17, 0, 0), new THREE.Vector3(0, -0.34, 0)]), new THREE.MeshBasicMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide })); m.position.set(lerp(x0, x1, u), y - sag, lerp(z0, z1, u)); m.rotation.y = Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2; SCENE.add(m); }
  const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push(new THREE.Vector3(lerp(x0, x1, u), y - Math.sin(u * Math.PI) * 0.8, lerp(z0, z1, u))); } SCENE.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x2e2a38 }))); }
// janela com moldura, vidro, peitoril e venezianas (na face +z do grupo)
function windowW(w = 1.0, h = 1.1, o = {}) {
  const g = G(), FR = o.frame || '#fff6e0';
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), o.lit ? LITM : GLASSM); gl.position.z = 0.01; g.add(gl);
  add(g, box(w + 0.14, 0.08, 0.1, FR), 0, h / 2 + 0.04, 0.04); add(g, box(w + 0.24, 0.07, 0.22, FR), 0, -h / 2 - 0.04, 0.1);
  for (const sx of [-1, 1]) add(g, box(0.07, h, 0.1, FR), sx * (w / 2 + 0.035), 0, 0.04);
  add(g, box(0.04, h, 0.06, FR), 0, 0, 0.04); add(g, box(w, 0.04, 0.06, FR), 0, h * 0.1, 0.04);
  if (o.shutter) for (const sx of [-1, 1]) { const s = add(g, box(w / 2, h + 0.04, 0.05, o.shutter), sx * (w * 0.75 + 0.08), 0, 0.05); for (let k = 0; k < 6; k++) add(s, box(w / 2 - 0.06, 0.02, 0.03, shade(o.shutter, 0.2), { outline: false }), 0, -h / 2 + 0.1 + k * h / 6.2, 0.03); }
  if (o.pot) { const p = pot(o.seed || 3); p.scale.setScalar(0.8); add(g, p, -w * 0.22, -h / 2 - 0.02, 0.14); const p2 = pot((o.seed || 3) + 1); p2.scale.setScalar(0.7); add(g, p2, w * 0.25, -h / 2 - 0.02, 0.14); }
  if (o.lit) g.userData.lit = gl;
  return g;
}
// telhado de duas águas com telhas (cumeeira paralela a x)
function gableRoof(w, d, h, col = '#b8503a') {
  const g = G(), L = Math.hypot(d / 2, h), ang = Math.atan2(h, d / 2);
  for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.08, L + 0.3), tmat(TEX.tiles)); p.castShadow = p.receiveShadow = true; p.position.set(0, h / 2, s * d / 4); p.rotation.x = s * ang; g.add(p); const hl = new THREE.Mesh(p.geometry, INKM); hl.scale.set(1.01, 1.4, 1.01); hl.position.copy(p.position); hl.rotation.copy(p.rotation); g.add(hl); }
  add(g, cyl(0.07, 0.07, w + 0.5, '#8a3a2a'), 0, h + 0.03, 0).rotation.z = Math.PI / 2;
  const tri = new THREE.Shape(); tri.moveTo(-d / 2, 0); tri.lineTo(d / 2, 0); tri.lineTo(0, h); tri.lineTo(-d / 2, 0);
  for (const s of [-1, 1]) { const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), toon(col, { side: THREE.DoubleSide })); m.rotation.y = Math.PI / 2; m.position.x = s * w / 2; g.add(m); }
  return g;
}
// casa térrea brasileira: fachada rebocada, muro baixo com portão, telhado de telha, janelas, luminária, número
function house(x, z, w, col, seed, o = {}) {
  const g = G(), D = 6, H = 3.1, q = rng(seed);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, H, D), [toon(col), toon(col), toon(shade(col, 0.1)), toon(col), tmat(plasterTex(col)), toon(col)]); body.position.y = H / 2; body.castShadow = body.receiveShadow = true; g.add(body);
  const hl = new THREE.Mesh(body.geometry, INKM); hl.scale.set(1 + 0.06 / w, 1 + 0.06 / H, 1 + 0.06 / D); hl.position.y = H / 2; g.add(hl);
  add(g, box(w + 0.1, 0.25, 0.12, shade(col, 0.18)), 0, 0.12, D / 2 + 0.02);               // rodapé
  add(g, box(w + 0.2, 0.16, 0.2, lite(col, 0.5)), 0, H - 0.08, D / 2 + 0.06);                 // cornija
  const roof = gableRoof(w, D, 1.6, col); roof.position.y = H; g.add(roof);
  add(g, box(w + 0.5, 0.1, 0.12, '#9a9aa8'), 0, H + 0.05, D / 2 + 0.25);                    // calha
  const dx = o.doorX != null ? o.doorX : (q() < 0.5 ? -w * 0.25 : w * 0.25);
  // porta (com dobradiça à esquerda, abre para dentro)
  const doorCol = o.doorCol || ['#7a4a8a', '#3a6ac0', '#a8365a', '#6a4a3a'][Math.floor(q() * 4)];
  const frame = G(); add(frame, box(1.22, 0.14, 0.18, '#fff6e0'), 0, 2.27, 0); for (const sx of [-0.58, 0.58]) add(frame, box(0.1, 2.3, 0.18, '#fff6e0'), sx, 1.15, 0); add(g, frame, dx, 0, D / 2 + 0.02);
  const step = add(g, box(1.5, 0.14, 0.5, '#c8bcae'), dx, 0.07, D / 2 + 0.25);
  const piv = G(); piv.position.set(dx - 0.53, 0, D / 2 - 0.02); const dr = box(1.06, 2.2, 0.07, doorCol); dr.position.set(0.53, 1.1, 0); piv.add(dr);
  for (const yy of [0.55, 1.5]) add(piv, box(0.8, 0.6, 0.02, shade(doorCol, 0.15), { outline: false }), 0.53, yy, 0.045);
  add(piv, sph(0.045, '#f2c230'), 0.95, 1.05, 0.08); g.add(piv);
  const dark = add(g, M(new THREE.PlaneGeometry(1.06, 2.2), '#000', { outline: false, mat: new THREE.MeshBasicMaterial({ color: o.warm ? 0xffc27a : 0x3a2a34 }) }), dx, 1.1, D / 2 - 0.25);
  add(g, box(0.2, 0.14, 0.04, '#fff6e0'), dx + 0.8, 2.1, D / 2 + 0.03);
  const num = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.22), new THREE.MeshBasicMaterial({ map: canvasTex(128, 80, (c, W2, H2) => { c.fillStyle = '#3a6ac0'; c.fillRect(0, 0, W2, H2); c.strokeStyle = '#fff'; c.lineWidth = 6; c.strokeRect(6, 6, W2 - 12, H2 - 12); c.fillStyle = '#fff'; c.font = 'bold 50px Fredoka, sans-serif'; c.textAlign = 'center'; c.fillText(String(o.num || (100 + Math.floor(q() * 800))), W2 / 2, 60); }) })); num.position.set(dx + 0.8, 1.75, D / 2 + 0.02); g.add(num);
  const lampW = add(g, box(0.16, 0.24, 0.14, '#ffe2a0', { mo: { emissive: new THREE.Color('#ffc870'), emissiveIntensity: 0.3 } }), dx - 0.85, 2.0, D / 2 + 0.08); WORLD.lamps.push(lampW);
  // janelas
  const winXs = o.wins || (w > 6 ? [-dx * 0.2 - Math.sign(dx) * 1.6 * 0.6, -Math.sign(dx) * (w / 2 - 1.0)] : [-Math.sign(dx) * w * 0.25]);
  for (const wx of winXs) { const wn = windowW(1.0, 1.1, { shutter: ['#3a6ac0', '#a8365a', '#7b52b8', '#e07a3a', '#6a4a3a'][Math.floor(q() * 5)], pot: q() < 0.7, seed: seed + wx * 3, lit: o.warm }); add(g, wn, wx, 1.65, D / 2 + 0.02); if (o.warm) WORLD.lamps.push(wn); }
  // muro baixo, portão e calçada da frente
  const WL = lite(col, 0.25), wz = D / 2 + 1.5;
  for (const [a, b] of [[-w / 2, dx - 0.75], [dx + 0.75, w / 2]]) if (b - a > 0.2) { add(g, box(b - a, 0.9, 0.2, WL), (a + b) / 2, 0.45, wz); add(g, box(b - a + 0.06, 0.08, 0.26, shade(WL, 0.2)), (a + b) / 2, 0.92, wz); }
  for (const sx of [dx - 0.75, dx + 0.75]) add(g, box(0.26, 1.3, 0.26, WL), sx, 0.65, wz);
  const gate = G(); for (let k = 0; k < 7; k++) add(gate, box(0.03, 0.9, 0.03, '#2e2a38', { outline: false }), -0.6 + k * 0.2, 0.55, 0); add(gate, box(1.26, 0.05, 0.05, '#2e2a38'), 0, 1.0, 0); add(gate, box(1.26, 0.05, 0.05, '#2e2a38'), 0, 0.12, 0); add(g, gate, dx, 0, wz); g.userData.gate = gate;
  if (o.doorX == null && q() < 0.6) { const s = shrub(0.45, seed + 9); add(g, s, -dx * 0.6, 0, D / 2 + 0.7); }
  if (q() < 0.4) add(g, box(0.7, 0.4, 0.35, '#e8e4dc'), w * 0.3, 2.6, D / 2 + 0.2);       // ar-condicionado
  if (q() < 0.35) { const ch = add(g, box(0.4, 1.0, 0.4, lite(col, 0.1)), w * 0.3 * (q() < 0.5 ? -1 : 1), H + 1.2, -0.5); }
  at(g, x, 0, z);
  return { g, piv, gate, dark };
}
function car(col) { const g = G(); const b = add(g, box(1.8, 0.62, 4.1, col), 0, 0.55); add(g, box(1.62, 0.6, 2.1, lite(col, 0.15)), 0, 1.15, -0.25);
  for (const sz of [0.78, -1.28]) add(g, M(new THREE.BoxGeometry(1.5, 0.48, 0.02), '#9fc3d8', { mat: GLASSM, outline: false }), 0, 1.15, sz).rotation.x = sz > 0 ? -0.3 : 0.3;
  for (const sx of [-0.82, 0.82]) add(g, M(new THREE.BoxGeometry(0.02, 0.44, 1.8), '#9fc3d8', { mat: GLASSM, outline: false }), sx, 1.15, -0.25);
  for (const [sx, sz] of [[-0.86, 1.3], [0.86, 1.3], [-0.86, -1.3], [0.86, -1.3]]) { const w = cyl(0.34, 0.34, 0.26, '#2a2430'); w.rotation.z = Math.PI / 2; w.position.set(sx, 0.34, sz); g.add(w); const hb = cyl(0.16, 0.16, 0.27, '#c8c4d0', { outline: false }); hb.rotation.z = Math.PI / 2; hb.position.set(sx, 0.34, sz); g.add(hb); }
  for (const sx of [-0.6, 0.6]) { add(g, box(0.3, 0.14, 0.05, '#fff6d0', { mo: { emissive: new THREE.Color('#fff0a0'), emissiveIntensity: 0.6 } }), sx, 0.62, 2.06); add(g, box(0.3, 0.12, 0.05, '#e8503a'), sx, 0.62, -2.06); }
  add(g, box(1.85, 0.12, 0.12, '#c8c4d0'), 0, 0.32, 2.08); add(g, box(1.85, 0.12, 0.12, '#c8c4d0'), 0, 0.32, -2.08);
  SCENE.add(g); return g; }
// ---------- áudios voando ----------
const audioTex = (col) => canvasTex(256, 96, (g, w, h) => { g.fillStyle = '#1e1820'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 44); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(12, 12, w - 24, h - 24, 36); g.fill();
  g.fillStyle = '#1e1820'; g.beginPath(); g.moveTo(42, 30); g.lineTo(42, 66); g.lineTo(70, 48); g.fill(); for (let i = 0; i < 14; i++) { const hh = 8 + Math.abs(Math.sin(i * 1.7)) * 30; g.fillRect(90 + i * 10, 48 - hh / 2, 5, hh); } });
const ATEX = [audioTex('#ffd23f'), audioTex('#fff6e0'), audioTex('#9fd0ff')];
const GLOW = canvasTex(128, 128, (g, w, h) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,230,150,0.9)'); r.addColorStop(1, 'rgba(255,200,100,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
const AUD = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ATEX[i % 3], transparent: true, depthWrite: false })); const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); SCENE.add(gl); SCENE.add(sp); AUD.push({ sp, gl }); }
function audios(list) { AUD.forEach((a, i) => { const o = list[i]; a.sp.visible = a.gl.visible = !!o; if (!o) return; const s = o.s || 0.5; a.sp.position.set(o.x, o.y, o.z); a.sp.scale.set(s * 2.6, s, 1); a.sp.material.opacity = o.op == null ? 1 : o.op; if (o.c != null) a.sp.material.map = ATEX[o.c]; a.gl.position.set(o.x, o.y, o.z); a.gl.scale.setScalar(s * 3.2); a.gl.material.opacity = 0.7 * (o.op == null ? 1 : o.op); }); }
// ---------- caixa dos recados (portas abrem para FORA, em direção a -z) ----------
const CAIXA = (() => {
  const g = G(), W = 1.5, H = 2.0, D = 0.9, C = '#c8443c', CD = '#8a2a28', IN = '#4a2a34', GOLD = '#f2c230';
  add(g, box(W, H, 0.08, IN), 0, H / 2 + 0.25, D / 2);
  for (const sx of [-1, 1]) { add(g, box(0.08, H, D, C), sx * W / 2, H / 2 + 0.25, 0); for (let k = 0; k < 4; k++) add(g, sph(0.025, GOLD, { outline: false }), sx * (W / 2 + 0.045), 0.45 + k * 0.55, -0.3); }
  add(g, box(W + 0.12, 0.14, D + 0.12, CD), 0, 0.2, 0);                                       // base
  add(g, box(W + 0.16, 0.1, D + 0.16, CD), 0, H + 0.3, 0);                                    // cornija
  const rf = gableRoof(W + 0.1, D + 0.3, 0.45, C); rf.scale.set(1, 1, 1); rf.position.y = H + 0.35; g.add(rf); rf.traverse(m => { if (m.material && m.material.map === TEX.tiles) { m.material = toon('#8a2a28'); } });
  for (const sx of [-0.6, 0.6]) for (const sz of [-0.32, 0.32]) add(g, cyl(0.05, 0.07, 0.14, '#2e2a38'), sx, 0.07, sz);
  for (let k = 1; k < 4; k++) add(g, box(W - 0.1, 0.05, D - 0.12, '#6a4048'), 0, 0.27 + k * H / 4, 0.02);
  const doors = [];
  for (const sx of [-1, 1]) { const piv = G(); piv.position.set(sx * W / 2, 0.27, -D / 2 - 0.02);
    const d = box(W / 2, H - 0.04, 0.07, C); d.position.set(-sx * W / 4, (H - 0.04) / 2, 0); piv.add(d);
    add(piv, box(W / 2 - 0.16, H * 0.36, 0.02, CD, { outline: false }), -sx * W / 4, H * 0.27, -0.045); add(piv, box(W / 2 - 0.16, H * 0.36, 0.02, CD, { outline: false }), -sx * W / 4, H * 0.7, -0.045);
    add(piv, sph(0.05, GOLD), -sx * (W / 2 - 0.1), H / 2, -0.07);
    for (const yy of [0.25, H - 0.3]) add(piv, box(0.04, 0.16, 0.05, GOLD, { outline: false }), 0, yy, -0.04);
    g.add(piv); doors.push({ piv, sx }); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.4), new THREE.MeshBasicMaterial({ map: canvasTex(512, 136, (q, w, h) => { q.fillStyle = '#ffd23f'; q.fillRect(0, 0, w, h); q.strokeStyle = '#1e1820'; q.lineWidth = 12; q.strokeRect(6, 6, w - 12, h - 12); q.fillStyle = '#1e1820'; q.font = 'bold 84px Fredoka, sans-serif'; q.textAlign = 'center'; q.fillText('RECADOS', w / 2 + 30, 100);
    q.strokeStyle = '#1e1820'; q.lineWidth = 7; q.strokeRect(34, 36, 76, 56); q.beginPath(); q.moveTo(34, 36); q.lineTo(72, 70); q.lineTo(110, 36); q.stroke(); }) }));
  sign.position.set(0, H + 0.62, -D / 2 - 0.2); g.add(sign);
  const slotF = add(g, box(1.0, 0.16, 0.06, GOLD), 0, H + 0.1, -D / 2 - 0.08);
  const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.06), new THREE.MeshBasicMaterial({ color: 0xffd27a })); slot.position.set(0, H + 0.1, -D / 2 - 0.115); g.add(slot);
  const orbs = [], r = rng(12), cols = [0xffd27a, 0xfff0c0, 0x9fd0ff, 0xffb070];
  for (let k = 0; k < 4; k++) for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.075 + r() * 0.03, 12, 8), new THREE.MeshBasicMaterial({ color: cols[(i + k) % 4] }));
    m.position.set(-0.6 + (i % 8) * 0.17 + r() * 0.03, 0.38 + k * H / 4 + (i < 8 ? 0 : 0.17), -0.15 + (i < 8 ? 0.15 : -0.1)); m.visible = false; g.add(m); orbs.push(m); }
  const light = new THREE.PointLight(0xffd890, 0, 6, 2); light.position.set(0, 1.2, -0.6); g.add(light);
  at(g, BOXP.x, 0, BOXP.z, 0);
  return { g, doors, orbs, light, slot };
})();
function caixa(open = 0, fill = 0, T = 0) {
  CAIXA.doors.forEach(d => d.piv.rotation.y = -d.sx * open * 1.85);
  const n = Math.round(fill); CAIXA.orbs.forEach((m, i) => { m.visible = i < n; m.scale.setScalar(1 + 0.15 * Math.sin(T * 4 + i)); });
  CAIXA.light.intensity = (0.3 + open * 2.4) * Math.min(1, n / 20 + 0.2);
  CAIXA.slot.material.color.setHex(n > 0 ? 0xffd27a : 0x2a2030);
}
// ---------- praça + rua + casas ----------
(function build() {
  plane(400, 400, new THREE.MeshToonMaterial({ map: ASFALTO, gradientMap: GRAD }), 0, 0, 0);
  plane(36, 32, new THREE.MeshToonMaterial({ map: CALCADA, gradientMap: GRAD }), 0, 0.004, 4).material.map.repeat.set(12, 10);
  for (const [x0, z0, x1, z1] of [[-18, -12, 18, -12], [-18, 20, 18, 20], [-18, -12, -18, 20], [18, -12, 18, 20]]) { const L = Math.hypot(x1 - x0, z1 - z0); const c = box(x1 === x0 ? 0.3 : L, 0.15, x1 === x0 ? L : 0.3, '#c8bcae'); at(c, (x0 + x1) / 2, 0.075, (z0 + z1) / 2); }
  flowerBed(-8.5, 7.5, 4.5, 3.2, 11); flowerBed(8.5, 7.5, 4.5, 3.2, 12); flowerBed(-8.5, -4.5, 4, 2.6, 13); flowerBed(8.5, -4.5, 4, 2.6, 14);
  for (const [x, z, c] of [[-8.5, 7.5, '#ee8aaa'], [8.5, 7.5, '#f2c230'], [-8.5, -4.5, '#f2c230'], [8.5, -4.5, '#ee8aaa']]) WORLD.trees.push(ipe3(x, z, c, 1.0));
  for (const x of [-15, 15]) for (const z of [-8, 2, 12]) WORLD.trees.push(ipe3(x, z + 2, z % 4 ? '#f2c230' : '#ee8aaa', 0.9));
  bench(-2.7, 0.4, Math.PI); bench(2.9, 0.4, Math.PI); bench(-4.8, 9.2, 0); bench(4.8, 9.2, 0); bench(-12.2, 3, Math.PI / 2); bench(12.2, 3, -Math.PI / 2);
  for (const [x, z] of [[-4.6, -1.8], [4.6, -1.8], [-6.5, 14], [6.5, 14], [-12, -6], [12, -6], [-12, 12], [12, 12]]) lampPost(x, z);
  bunting(-4.6, -1.8, 4.6, -1.8); bunting(-12, -6, -4.6, -1.8, 4.2); bunting(4.6, -1.8, 12, -6, 4.2);
  trashBin(4.0, -0.9); trashBin(-6.2, 9.4);
  // chafariz com água
  { const f = G(); add(f, cyl(2.4, 2.6, 0.55, '#d8cfc0', { seg: 24 }), 0, 0.27); add(f, cyl(2.5, 2.5, 0.08, '#efe6d4', { seg: 24 }), 0, 0.58); const wt = add(f, M(new THREE.CircleGeometry(2.2, 32), '#7ab8e0', { outline: false, mat: new THREE.MeshToonMaterial({ color: '#7ab8e0', gradientMap: GRAD }) }), 0, 0.5); wt.rotation.x = -Math.PI / 2;
    add(f, cyl(0.3, 0.45, 1.2, '#d8cfc0'), 0, 1.1); add(f, cyl(0.9, 0.5, 0.25, '#d8cfc0', { seg: 20 }), 0, 1.75); add(f, cyl(0.25, 0.3, 0.6, '#d8cfc0'), 0, 2.1); add(f, sph(0.22, '#d8cfc0'), 0, 2.5);
    const jet = add(f, M(new THREE.ConeGeometry(0.5, 1.0, 16, 1, true), '#cfe6ff', { outline: false, cast: false, mat: new THREE.MeshBasicMaterial({ color: 0xcfe6ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide }) }), 0, 1.35); jet.rotation.x = Math.PI; WORLD.water = jet;
    at(f, 0, 0, 13); }
  // banca de jornal detalhada
  { const b = G(); add(b, box(2.6, 2.3, 1.8, '#3c6aa8'), 0, 1.15); add(b, box(3.0, 0.15, 2.3, '#c8443c'), 0, 2.4); const aw = add(b, box(3.0, 0.06, 0.9, '#f2c230'), 0, 2.2, -1.25); aw.rotation.x = 0.35;
    for (let i = 0; i < 6; i++) add(b, box(0.32, 0.42, 0.03, ['#e8503a', '#f2c230', '#ee8aaa', '#fff6e0', '#7b52b8', '#e07a3a'][i]), -1.0 + i * 0.4, 1.4, -0.92);
    for (let i = 0; i < 6; i++) add(b, box(0.32, 0.42, 0.03, ['#fff6e0', '#3a6ac0', '#e8503a', '#f2c230', '#ee8aaa', '#c8443c'][i]), -1.0 + i * 0.4, 0.85, -0.92);
    const sg = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.4), new THREE.MeshBasicMaterial({ map: canvasTex(512, 96, (c, w, h) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8443c'; c.font = 'bold 64px Fredoka, sans-serif'; c.textAlign = 'center'; c.fillText('BANCA', w / 2, 72); }) })); sg.position.set(0, 2.62, -1.16); b.add(sg);
    at(b, 12, 0, -3); }
  // carrinho de pipoca
  { const p = G(); add(p, box(1.0, 0.8, 0.6, '#e8503a'), 0, 0.75); add(p, box(0.9, 0.7, 0.5, '#fff6e0', { mo: { transparent: true, opacity: 0.7 } }), 0, 1.5); for (let i = 0; i < 14; i++) add(p, sph(0.05, '#fff2c4', { outline: false }), -0.3 + (i % 7) * 0.1, 1.3 + Math.floor(i / 7) * 0.08, 0); add(p, cyl(0.02, 0.5, 0.25, '#e8503a'), 0, 2.0); for (const sx of [-0.45, 0.45]) { const w = cyl(0.22, 0.22, 0.06, '#2e2a38'); w.rotation.z = Math.PI / 2; w.position.set(sx, 0.22, 0); p.add(w); } at(p, -6, 0, -1.2, 0.4); }
  // rua da frente (z = -16), faixa, guias, faixa de pedestre, bueiro
  for (let x = -60; x < 60; x += 4) { const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.16), new THREE.MeshBasicMaterial({ color: 0xfff2c4 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, -16); SCENE.add(m); }
  for (let i = 0; i < 7; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5.5), new THREE.MeshBasicMaterial({ color: 0xfaf4e4 })); m.rotation.x = -Math.PI / 2; m.position.set(-2 + i * 0.9, 0.012, -16); SCENE.add(m); }
  { const sw = new THREE.Mesh(new THREE.PlaneGeometry(120, 2.8), tmat(TEX.sidewalk)); sw.rotation.x = -Math.PI / 2; sw.position.set(0, 0.16, -20.4); sw.receiveShadow = true; SCENE.add(sw); const sb = box(120, 0.16, 2.8, '#d8cfc0', { outline: false }); at(sb, 0, 0.07, -20.4); at(box(120, 0.18, 0.2, '#b8ac9e'), 0, 0.09, -18.95); }
  at(cyl(0.35, 0.35, 0.02, '#4a4458', { outline: false, seg: 20 }), 4, 0.015, -14.5);
  { const s = G(); add(s, cyl(0.04, 0.04, 2.6, '#7a7484'), 0, 1.3); const pl = add(s, M(new THREE.PlaneGeometry(1.0, 0.28), '#3a6ac0', { outline: false, mat: new THREE.MeshBasicMaterial({ map: canvasTex(256, 72, (c, w, h) => { c.fillStyle = '#3a6ac0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 5; c.strokeRect(5, 5, w - 10, h - 10); c.fillStyle = '#fff'; c.font = 'bold 40px Fredoka, sans-serif'; c.textAlign = 'center'; c.fillText('R. DAS FLORES', w / 2, 50); }), side: THREE.DoubleSide }) }), 0, 2.5); at(s, 3.2, 0, -19.3); }
  // casas térreas da rua (a da dona Lúcia no meio)
  const LU = house(HOUSE.x, HOUSE.z, 7, '#e8a8b8', 77, { doorX: 0, doorCol: '#7a4a8a', num: 214, warm: true, wins: [-2.3, 2.3] }); WORLD.door = LU.piv; WORLD.lucia = LU; LU.gate.rotation.y = 0; LU.gate.visible = false;
  const r = rng(77);
  { let x = HOUSE.x + 3.5 + 0.4; while (x < 60) { const w = 6 + r() * 2.5; house(x + w / 2, HOUSE.z, w, PAL3[Math.floor(r() * PAL3.length)], Math.floor(r() * 1e4)); x += w + 0.4; } }
  { let x = HOUSE.x - 3.5 - 0.4; while (x > -60) { const w = 6 + r() * 2.5; house(x - w / 2, HOUSE.z, w, PAL3[Math.floor(r() * PAL3.length)], Math.floor(r() * 1e4)); x -= w + 0.4; } }
  for (let i = -5; i <= 5; i++) if (Math.abs(i * 10 - HOUSE.x) > 4) lampPost(i * 10 + 3, -19.2);
  // prédios ao fundo da praça e laterais
  { let x = -60; while (x < 60) { const w = 6 + r() * 5, fl = 3 + Math.floor(r() * 6); bldg3(x + w / 2, 30, w, 8, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.6, Math.floor(r() * 1e5), Math.PI); x += w + 0.3; } }
  for (const s of [-1, 1]) { let z = -12; while (z < 26) { const w = 6 + r() * 5, fl = 2 + Math.floor(r() * 5); bldg3(s * 26, z + w / 2, 8, w, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.6, Math.floor(r() * 1e5), s > 0 ? -Math.PI / 2 : Math.PI / 2); z += w + 0.3; } }
  { let x = -60; while (x < 60) { const w = 7 + r() * 6, fl = 4 + Math.floor(r() * 5); bldg3(x + w / 2, -40, w, 8, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.6, Math.floor(r() * 1e5), 0); x += w + 0.3; } }
  for (let i = 0; i < 6; i++) WORLD.cars.push({ g: car(CARC[(i * 3) % CARC.length]), lane: i % 2 ? 1 : -1, ph: i * 31 });
  // carro estacionado
  { const c = car('#5a8ac8'); c.position.set(-4, 0, -18.1); c.rotation.y = Math.PI / 2; }
})();
// ---------- quarto do Caio ----------
const ROOM = (() => {
  const g = G(), WP = tmat(TEX.wallpaper);
  const fl = add(g, new THREE.Mesh(new THREE.PlaneGeometry(7, 7), tmat(TEX.floor)), 0, 0, 0); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true;
  const ceil = add(g, new THREE.Mesh(new THREE.PlaneGeometry(7, 7), toon('#f4f0f8')), 0, 3, 0); ceil.rotation.x = Math.PI / 2;
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 3), WP); m.position.set(x, 1.5, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m); add(g, box(w, 0.12, 0.04, '#fff6e0'), x, 0.06, z).rotation.y = ry; add(g, box(w, 0.06, 0.04, '#fff6e0'), x, 2.95, z).rotation.y = ry; };
  wall(7, 0, 3, Math.PI); wall(7, -3.5, 0, Math.PI / 2); wall(7, 3.5, 0, -Math.PI / 2);
  // janela com cortina e céu
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.25), new THREE.MeshBasicMaterial({ color: 0x22285a })); win.position.set(0.9, 1.75, 2.98); win.rotation.y = Math.PI; g.add(win);
  const wf = windowW(1.6, 1.25, { frame: '#fff6e0' }); wf.rotation.y = Math.PI; wf.position.set(0.9, 1.75, 2.99); wf.children[0].visible = false; g.add(wf);
  const ct = TEX.curtain('#f2c230', '#d8a818'); for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 2.0), tmat(ct, { side: THREE.DoubleSide })); c.position.set(0.9 + sx * 1.05, 1.7, 2.9); g.add(c); } add(g, cyl(0.025, 0.025, 2.9, '#6a4a3a'), 0.9, 2.72, 2.9).rotation.z = Math.PI / 2;
  // pôsteres e quadro de cortiça
  const poster = (x, y, w, h, draw) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: canvasTex(128, Math.round(128 * h / w), draw) })); p.position.set(x, y, 2.97); p.rotation.y = Math.PI; g.add(p); add(g, box(w + 0.05, h + 0.05, 0.02, '#1e1820', { outline: false }), x, y, 2.985); };
  poster(-1.6, 1.95, 0.75, 1.0, (q, w, h) => { q.fillStyle = '#e8503a'; q.fillRect(0, 0, w, h); q.fillStyle = '#f2c230'; q.beginPath(); q.arc(64, 70, 40, 0, 7); q.fill(); q.fillStyle = '#1e1820'; q.font = 'bold 26px Fredoka'; q.textAlign = 'center'; q.fillText('ROCK', 64, 150); });
  poster(-2.6, 1.7, 0.5, 0.65, (q, w, h) => { q.fillStyle = '#3a6ac0'; q.fillRect(0, 0, w, h); q.fillStyle = '#fff6e0'; for (let i = 0; i < 5; i++) { q.beginPath(); q.arc(20 + i * 22, 40 + (i % 2) * 30, 8, 0, 7); q.fill(); } q.fillStyle = '#ee8aaa'; q.fillRect(14, 110, 100, 30); });
  // foto da mãe com o Caio (porta-retrato na escrivaninha)
  // cama com cabeceira, colchão, travesseiro e cobertor
  const bed = G(); add(bed, box(1.35, 0.32, 2.3, '#8a5a3a'), 0, 0.2); add(bed, box(1.25, 0.2, 2.2, '#f4f0f8'), 0, 0.46); add(bed, box(1.4, 1.0, 0.1, '#8a5a3a'), 0, 0.55, 1.18); add(bed, box(1.4, 0.55, 0.1, '#8a5a3a'), 0, 0.3, -1.18);
  add(bed, box(0.75, 0.16, 0.42, '#fff6e0'), 0, 0.64, 0.88);
  const blanket = add(bed, texBox(1.32, 0.12, 1.5, TEX.blanket, '#c8443c'), 0, 0.6, -0.3); bed.userData.blanket = blanket;
  bed.position.set(-2.75, 0, 1.75); g.add(bed);
  // criado-mudo com abajur
  const ns = add(g, box(0.5, 0.55, 0.45, '#c8a070'), -1.75, 0.28, 2.65); add(g, sph(0.03, '#f2c230'), -1.75, 0.35, 2.42);
  add(g, cyl(0.08, 0.1, 0.05, '#2e2a38'), -1.75, 0.58, 2.65); add(g, cyl(0.015, 0.015, 0.3, '#2e2a38'), -1.75, 0.73, 2.65); add(g, cyl(0.1, 0.18, 0.2, '#ee8aaa', { mo: { emissive: new THREE.Color('#ffb0c0'), emissiveIntensity: 0.4 } }), -1.75, 0.95, 2.65);
  // escrivaninha com monitor, cadeira, livros
  add(g, box(1.7, 0.07, 0.75, '#c8a070'), 2.4, 0.78, 2.4); for (const sx of [1.62, 3.18]) add(g, box(0.06, 0.78, 0.65, '#8a6a4a'), sx, 0.39, 2.4);
  add(g, box(0.75, 0.45, 0.04, '#2a2436'), 2.4, 1.15, 2.6); const scr = add(g, box(0.68, 0.38, 0.02, '#5a7ad0', { outline: false, mo: { emissive: new THREE.Color('#5a7ad0'), emissiveIntensity: 0.5 } }), 2.4, 1.15, 2.57); add(g, box(0.06, 0.2, 0.06, '#2a2436'), 2.4, 0.9, 2.62); add(g, box(0.5, 0.02, 0.18, '#3a3448'), 2.4, 0.82, 2.25);
  { const ph = G(); add(ph, box(0.22, 0.28, 0.03, '#f2c230'), 0, 0, 0); const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.22), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (q, w, h) => { q.fillStyle = '#9fd0f0'; q.fillRect(0, 0, w, h); q.fillStyle = '#c98b5e'; q.beginPath(); q.arc(22, 40, 11, 0, 7); q.fill(); q.beginPath(); q.arc(44, 46, 9, 0, 7); q.fill(); q.fillStyle = '#3a2018'; q.beginPath(); q.arc(22, 32, 12, Math.PI, 0); q.fill(); q.fillStyle = '#c8506a'; q.fillRect(10, 52, 24, 28); q.fillStyle = '#5a7ad0'; q.fillRect(35, 56, 20, 24); }) })); pic.position.z = -0.02; pic.rotation.y = Math.PI; ph.add(pic); ph.rotation.y = Math.PI - 0.4; ph.position.set(1.85, 0.96, 2.4); g.add(ph); }
  { const chair = G(); add(chair, box(0.5, 0.07, 0.5, '#e8503a'), 0, 0.48); add(chair, box(0.5, 0.55, 0.06, '#e8503a'), 0, 0.8, -0.25); add(chair, cyl(0.03, 0.03, 0.45, '#2e2a38'), 0, 0.24); add(chair, box(0.5, 0.03, 0.06, '#2e2a38'), 0, 0.03); add(chair, box(0.06, 0.03, 0.5, '#2e2a38'), 0, 0.03); chair.position.set(2.3, 0, 1.6); chair.rotation.y = 0.3; g.add(chair); }
  // estante de livros
  { const sh = G(); add(sh, box(1.2, 1.9, 0.35, '#c8a070'), 0, 0.95); for (let k = 0; k < 4; k++) { add(sh, box(1.12, 0.04, 0.32, '#a88050', { outline: false }), 0, 0.2 + k * 0.45, -0.02); const bk = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.3), new THREE.MeshBasicMaterial({ map: TEX.books })); bk.position.set(0, 0.38 + k * 0.45, -0.18); bk.rotation.y = Math.PI; sh.add(bk); }
    sh.position.set(3.3, 0, 0.2); sh.rotation.y = -Math.PI / 2; g.add(sh); }
  // tapete, roupa no chão, mochila, luminária de teto
  const rug = add(g, new THREE.Mesh(new THREE.CircleGeometry(1.2, 32), tmat(TEX.rug)), -0.3, 0.01, 0.5); rug.rotation.x = -Math.PI / 2;
  add(g, box(0.5, 0.06, 0.35, '#5a7ad0', { outline: false }), 0.6, 0.03, -0.2).rotation.y = 0.5;
  { const bp = G(); add(bp, box(0.45, 0.55, 0.25, '#f2a43a'), 0, 0.28); add(bp, box(0.35, 0.2, 0.06, '#e07a3a'), 0, 0.2, -0.15); bp.position.set(1.2, 0, 2.6); g.add(bp); }
  add(g, cyl(0.35, 0.35, 0.08, '#fff6e0', { mo: { emissive: new THREE.Color('#fff0d0'), emissiveIntensity: 0.4 } }), 0, 2.94, 0.5);
  // porta (parede direita) com moldura
  add(g, box(0.06, 2.15, 1.0, '#7a4a8a'), 3.46, 1.08, -1.4); add(g, box(0.08, 0.12, 1.25, '#fff6e0'), 3.45, 2.2, -1.4); add(g, sph(0.04, '#f2c230'), 3.4, 1.05, -1.0);
  const pl = new THREE.PointLight(0xffd8a0, 1.1, 10, 1.5); pl.position.set(1.2, 2.2, 0.6); g.add(pl);
  const pl2 = new THREE.PointLight(0x9fb8ff, 0.55, 14, 1); pl2.position.set(0, 2.6, -2.5); g.add(pl2);
  const pl3 = new THREE.PointLight(0xffb0c0, 0.4, 4, 2); pl3.position.set(-1.75, 1.1, 2.4); g.add(pl3);
  at(g, RX, 0, 0);
  return { g, win, pl, pl2, bed, scr };
})();
// ---------- cozinha da dona Lúcia ----------
const KITCHEN = (() => {
  const g = G(), WALLM = tmat(TEX.kitchenWall);
  const fl = add(g, new THREE.Mesh(new THREE.PlaneGeometry(8, 8), tmat(TEX.checker)), 0, 0, 0); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true;
  const ceil = add(g, new THREE.Mesh(new THREE.PlaneGeometry(8, 8), toon('#fff6e8')), 0, 3, 0); ceil.rotation.x = Math.PI / 2;
  const wall = (w, x, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 3), WALLM); m.position.set(x, 1.5, z); m.rotation.y = ry; m.receiveShadow = true; g.add(m); add(g, box(w, 0.12, 0.04, '#e8d4a8'), x, 0.06, z).rotation.y = ry; };
  wall(8, 0, 3, Math.PI); wall(8, -4, 0, Math.PI / 2); wall(8, 4, 0, -Math.PI / 2);
  const bs = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.7), tmat(TEX.backsplash)); bs.position.set(-0.8, 1.3, 2.97); bs.rotation.y = Math.PI; g.add(bs);
  // janela sobre a pia, com cortina de babado
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.0), new THREE.MeshBasicMaterial({ color: 0x9fd0f0 })); win.position.set(-1.6, 2.05, 2.97); win.rotation.y = Math.PI; g.add(win);
  const wf = windowW(1.4, 1.0, { frame: '#fff6e0' }); wf.rotation.y = Math.PI; wf.position.set(-1.6, 2.05, 2.98); wf.children[0].visible = false; g.add(wf);
  const cur = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.32), tmat(TEX.cloth, { side: THREE.DoubleSide })); cur.position.set(-1.6, 2.5, 2.9); g.add(cur);
  // balcão com portas, pia, torneira, fogão, armários altos
  add(g, box(3.6, 0.88, 0.7, '#fff6e0'), -1.3, 0.44, 2.6); for (let i = 0; i < 5; i++) { add(g, box(0.62, 0.7, 0.02, '#f0e4cc', { outline: false }), -2.75 + i * 0.72, 0.44, 2.24); add(g, box(0.12, 0.03, 0.03, '#8a6a4a', { outline: false }), -2.75 + i * 0.72, 0.7, 2.22); }
  add(g, box(3.7, 0.06, 0.8, '#c8a070'), -1.3, 0.91, 2.58);
  add(g, box(0.8, 0.05, 0.45, '#b8bcc8', { outline: false }), -1.6, 0.95, 2.6); { const tp = add(g, cyl(0.025, 0.025, 0.35, '#c8c4d0'), -1.6, 1.12, 2.82); const sp = add(g, cyl(0.02, 0.02, 0.22, '#c8c4d0'), -1.6, 1.28, 2.72); sp.rotation.x = Math.PI / 2; }
  add(g, box(0.92, 0.9, 0.7, '#e8e4dc'), 0.95, 0.45, 2.6); add(g, box(0.7, 0.45, 0.02, '#2a2430', { outline: false }), 0.95, 0.42, 2.24); add(g, box(0.6, 0.03, 0.04, '#c8c4d0', { outline: false }), 0.95, 0.7, 2.21);
  for (const [sx, sz] of [[0.75, 2.45], [1.15, 2.45], [0.75, 2.75], [1.15, 2.75]]) add(g, cyl(0.12, 0.12, 0.02, '#2a2430', { outline: false }), sx, 0.92, sz);
  add(g, cyl(0.2, 0.18, 0.2, '#c8443c'), 0.75, 1.03, 2.45); add(g, box(0.25, 0.03, 0.03, '#2a2430'), 0.97, 1.08, 2.45);
  { const kt = add(g, sph(0.13, '#3a6ac0'), 1.15, 1.04, 2.75); kt.scale.y = 0.8; }
  for (const sx of [-2.7, -1.6, -0.5, 0.95]) { add(g, box(1.0, 0.75, 0.4, '#d8506a'), sx, 2.35, 2.78); add(g, box(0.03, 0.2, 0.03, '#fff6e0', { outline: false }), sx + 0.35, 2.15, 2.57); }
  // prateleira com potes
  add(g, box(1.4, 0.05, 0.3, '#c8a070'), 2.6, 1.7, 2.85); for (let i = 0; i < 4; i++) { add(g, cyl(0.09, 0.09, 0.22, ['#f2c230', '#e8503a', '#fff6e0', '#7b52b8'][i]), 2.1 + i * 0.33, 1.84, 2.85); add(g, cyl(0.1, 0.1, 0.04, '#8a6a4a', { outline: false }), 2.1 + i * 0.33, 1.97, 2.85); }
  // geladeira com ímãs e um desenho
  add(g, box(0.9, 1.95, 0.75, '#f4f6fa'), 3.4, 0.98, 2.3); add(g, box(0.04, 0.5, 0.04, '#b8bcc8'), 3.05, 1.5, 1.9); add(g, box(0.04, 0.4, 0.04, '#b8bcc8'), 3.05, 0.7, 1.9); add(g, box(0.86, 0.02, 0.02, '#b8bcc8', { outline: false }), 3.4, 1.3, 1.92);
  for (let i = 0; i < 4; i++) add(g, sph(0.035, ['#e8503a', '#f2c230', '#3a6ac0', '#ee8aaa'][i], { outline: false }), 3.2 + (i % 2) * 0.3, 1.6 + Math.floor(i / 2) * 0.2, 1.91);
  { const dr = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.36), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (q, w, h) => { q.fillStyle = '#fff'; q.fillRect(0, 0, w, h); q.strokeStyle = '#e8503a'; q.lineWidth = 3; q.beginPath(); q.arc(32, 30, 12, 0, 7); q.stroke(); q.beginPath(); q.moveTo(32, 42); q.lineTo(32, 66); q.moveTo(18, 52); q.lineTo(46, 52); q.stroke(); q.fillStyle = '#3a6ac0'; q.font = 'bold 12px sans-serif'; q.fillText('MÃE', 18, 78); }) })); dr.position.set(3.4, 1.45, 1.91); dr.rotation.y = Math.PI; g.add(dr); }
  // relógio de parede e calendário
  { const ck = add(g, cyl(0.25, 0.25, 0.05, '#fff6e0', { seg: 24 }), 1.5, 2.4, 2.95); ck.rotation.x = Math.PI / 2; add(g, box(0.02, 0.16, 0.01, '#1e1820', { outline: false }), 1.5, 2.45, 2.91); add(g, box(0.11, 0.02, 0.01, '#1e1820', { outline: false }), 1.54, 2.4, 2.91); }
  // parede esquerda: quadro com foto do Caio pequeno e um vaso de flores
  { const fr = add(g, box(0.06, 0.6, 0.5, '#c8a070'), -3.95, 1.8, -0.5); const pc = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.5), new THREE.MeshBasicMaterial({ map: canvasTex(64, 80, (q, w, h) => { q.fillStyle = '#f8d8b0'; q.fillRect(0, 0, w, h); q.fillStyle = '#c98b5e'; q.beginPath(); q.arc(32, 34, 14, 0, 7); q.fill(); q.fillStyle = '#1d1a22'; q.beginPath(); q.arc(32, 28, 14, Math.PI, 0); q.fill(); q.fillStyle = '#5a7ad0'; q.fillRect(14, 50, 36, 30); }) })); pc.position.set(-3.91, 1.8, -0.5); pc.rotation.y = Math.PI / 2; g.add(pc); }
  // mesa redonda com toalha xadrez, cadeiras com encosto, bolo e fruteira
  add(g, cyl(0.85, 0.85, 0.06, '#c8a070', { seg: 28 }), 0, 0.76, 0.3); add(g, cyl(0.08, 0.14, 0.74, '#8a6a4a'), 0, 0.37, 0.3); add(g, cyl(0.35, 0.35, 0.04, '#8a6a4a'), 0, 0.02, 0.3);
  add(g, M(new THREE.CylinderGeometry(0.9, 0.95, 0.12, 28, 1, true), '#fff', { outline: false, mat: tmat(TEX.cloth, { side: THREE.DoubleSide }) }), 0, 0.74, 0.3); add(g, M(new THREE.CircleGeometry(0.9, 28), '#fff', { outline: false, mat: tmat(TEX.cloth) }), 0, 0.801, 0.3).rotation.x = -Math.PI / 2;
  const chair = (x, z, ry) => { const c = G(); add(c, box(0.48, 0.06, 0.48, '#a46a3a'), 0, 0.47); add(c, box(0.48, 0.5, 0.05, '#a46a3a'), 0, 0.75, 0.22); for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) add(c, box(0.05, 0.47, 0.05, '#8a5a30'), a, 0.235, b); add(c, box(0.42, 0.04, 0.42, '#e8503a', { outline: false }), 0, 0.51); c.position.set(x, 0, z); c.rotation.y = ry; g.add(c); return c; };
  chair(0, 1.25, 0); chair(-1.1, 0.3, -Math.PI / 2 + Math.PI); chair(1.1, 0.3, Math.PI / 2 + Math.PI);
  const cake = G(); add(cake, cyl(0.22, 0.22, 0.04, '#fff6e0'), 0, 0.02); add(cake, cyl(0.17, 0.17, 0.16, '#8a4a2a'), 0, 0.12); add(cake, cyl(0.175, 0.175, 0.04, '#fff0f4'), 0, 0.21); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; add(cake, sph(0.028, '#e8503a'), Math.cos(a) * 0.11, 0.25, Math.sin(a) * 0.11); }
  cake.position.set(0.45, 0.81, -0.1); g.add(cake);
  { const fb = G(); add(fb, cyl(0.16, 0.1, 0.08, '#3a6ac0'), 0, 0.04); for (let i = 0; i < 5; i++) add(fb, sph(0.06, ['#e8503a', '#f2c230', '#f2a43a', '#e8503a', '#b88ae0'][i]), Math.cos(i) * 0.07, 0.1 + (i > 2 ? 0.06 : 0), Math.sin(i) * 0.07); fb.position.set(-0.6, 0.81, 0.1); g.add(fb); }
  { const vs = add(g, cyl(0.08, 0.06, 0.22, '#7b52b8'), 0.6, 0.92, 0.55); const fl2 = shrub(0.12, 5, ['#ee8aaa', '#f2c230']); fl2.position.set(0.6, 1.0, 0.55); g.add(fl2); }
  // tapete e luminária pendente
  const rug = add(g, new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.7), tmat(TEX.rug)), -1.3, 0.01, 1.8); rug.rotation.x = -Math.PI / 2;
  add(g, cyl(0.01, 0.01, 0.5, '#2e2a38'), 0, 2.75, 0.3); add(g, M(new THREE.CylinderGeometry(0.08, 0.36, 0.28, 16, 1, true), '#e8503a', { mat: toon('#e8503a', { side: THREE.DoubleSide }) }), 0, 2.4, 0.3); add(g, sph(0.08, '#fff6d0', { outline: false, mo: { emissive: new THREE.Color('#ffe0a0'), emissiveIntensity: 1 } }), 0, 2.3, 0.3);
  const pl = new THREE.PointLight(0xffe0b0, 1.25, 10, 1.4); pl.position.set(0, 2.2, 0.3); g.add(pl);
  const pl2 = new THREE.PointLight(0xfff0dc, 0.5, 14, 1); pl2.position.set(0, 2.6, -2.8); g.add(pl2);
  at(g, KX, 0, 0);
  return { g, win, pl, pl2, cake };
})();
function resetProps() { WORLD.cars.forEach(c => c.g.visible = true); audios([]); caixa(0, 0); if (WORLD.door) WORLD.door.rotation.y = 0;
  ROOM.pl.intensity = 1.1; ROOM.pl2.intensity = 0.55; KITCHEN.pl.intensity = 1.25; KITCHEN.pl2.intensity = 0.5; ROOM.scr.visible = true; }
function animateWorld(T) {
  for (const c of CLOUDS) c.position.x = ((c.userData.x0 + 150 + T * c.userData.sp) % 300) - 150;
  for (const tr of WORLD.trees) tr.rotation.z = Math.sin(T * 0.9 + tr.userData.sway) * 0.015;
  for (const c of WORLD.cars) { const L = 130, x = ((c.ph * 7 + T * 8 * c.lane) % L + L) % L - 65; c.g.position.set(x, 0, -16 + c.lane * 1.8); c.g.rotation.y = c.lane > 0 ? Math.PI / 2 : -Math.PI / 2; }
  if (WORLD.water) WORLD.water.scale.set(1 + 0.05 * Math.sin(T * 6), 1, 1 + 0.05 * Math.cos(T * 5));
}
function mood(name) {
  const P = { day: { sky: ['#6fa8d8', '#a8c8e0', '#f8d8b0', '#fde8c0'], sun: 0xffe0b8, si: 1.3, hemi: 0.65, fog: 0xf4dcc0, cloud: ['#fff6ee', '#f8d8c8'], lamp: 0 },
    dusk: { sky: ['#5a4a8a', '#c86a7a', '#f2a070', '#fde0b0'], sun: 0xffb880, si: 1.0, hemi: 0.55, fog: 0xe8a888, cloud: ['#f8c8b8', '#e8a0a0'], lamp: 0.5 },
    night: { sky: ['#0a0e2c', '#1a1f4a', '#2e2e66', '#4a4a86'], sun: 0x7a90ff, si: 0.38, hemi: 0.34, fog: 0x262a58, cloud: ['#3a3a70', '#2e2e5c'], lamp: 1 },
    sepia: { sky: ['#c8a070', '#dcb888', '#f0d4a8', '#f8e6c4'], sun: 0xffe2b4, si: 1.1, hemi: 0.75, fog: 0xead2ac, cloud: ['#fff2dc', '#f0d8b4'], lamp: 0 },
    dawn: { sky: ['#4a5a9a', '#a88ab8', '#f8b8a0', '#fde0b0'], sun: 0xffc8a0, si: 0.95, hemi: 0.55, fog: 0xd8b0b0, cloud: ['#f8d0c8', '#d8b0c0'], lamp: 0.4 } }[name] || null;
  if (!P || mood.cur === name) return; mood.cur = name;
  SUN.color.setHex(P.sun); SUN.intensity = P.si; HEMI.intensity = P.hemi; SCENE.fog.color.setHex(P.fog);
  const g = SKY.image.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512); P.sky.forEach((c, i) => gr.addColorStop([0, 0.35, 0.75, 1][i], c)); g.fillStyle = gr; g.fillRect(0, 0, 8, 512); SKY.needsUpdate = true;
  for (const c of CLOUDS) c.children.forEach((m, i) => { if (m.material && m.material.color) m.material.color.set(i % 2 ? P.cloud[1] : P.cloud[0]); });
  STARS.visible = name === 'night';
  for (const l of WORLD.lamps) l.traverse(m => { if (m.material && m.material.emissive) m.material.emissiveIntensity = 0.25 + P.lamp * 1.3; });
  for (const gl of WORLD.glows) gl.material.opacity = P.lamp * 0.85;
  LITM.color.setHex(P.lamp > 0.3 ? 0xffc870 : 0xcfe6ff);
  ROOM.win.material.color.setHex(name === 'night' ? 0x1a1f4a : name === 'dawn' ? 0xc8a0c0 : 0x9fd0f0);
  KITCHEN.win.material.color.setHex(name === 'night' ? 0x1a1f4a : name === 'sepia' ? 0xf8e0b0 : name === 'dusk' ? 0xf2a070 : 0x9fd0f0);
}
// ---------- câmera com enquadramento profissional ----------
// alvo (x,z); top = altura do topo da cabeça (m); vis = altura visível (m); az = de onde a câmera olha (graus, 0 = do lado -z);
// el = câmera acima (+) ou abaixo (−) da altura do alvo; off = desloca o alvo na tela (m, + = sujeito à esquerda)
const SIZE = { xwide: 9, wide: 4.6, full: 2.7, knee: 2.0, med: 1.45 };
function frameCam(x, z, o = {}) {
  const fov = o.fov || 38, vis = (o.vis || SIZE[o.size || 'full']) * (o.raw ? 1 : 1.45), top = o.top || 1.75;
  const d = vis / (2 * Math.tan(fov * Math.PI / 360)) * (o.dk || 1);
  const cy = top - vis * 0.36 + (o.dy || 0);                 // topo da cabeça a ~17% do alto do quadro
  const az = (o.az || 0) * Math.PI / 180, fx = Math.sin(az), fz = Math.cos(az);
  const rx = -fz, rz = fx;                                     // direita da tela
  const tx = x + rx * (o.off || 0), tz = z + rz * (o.off || 0);
  camSet(tx - fx * d, cy + (o.el || 0), tz - fz * d, tx, cy, tz, fov, o.roll || 0);
}
const lerpO = (a, b, u) => { const o = {}; for (const k in a) o[k] = typeof a[k] === 'number' && typeof b[k] === 'number' ? lerp(a[k], b[k], u) : a[k]; for (const k in b) if (!(k in o)) o[k] = b[k]; return o; };
// vista lateral correta: o boneco olha para onde anda na TELA
function sideFace(vx, vz) { const f = new THREE.Vector3(); CAM.getWorldDirection(f); f.y = 0; f.normalize(); const r = new THREE.Vector3(-f.z, 0, f.x); return (vx * r.x + vz * r.z) >= 0 ? 0.8 : -0.8; }
// vida: piscar, respirar, micro-movimentos de olhar e cabeça
function life(T, seed, o = {}) { return Object.assign({ headTilt: Math.sin(T * 1.1 + seed) * 2.5 + Math.sin(T * 2.3 + seed * 2) * 1.2, lx: Math.sin(T * 0.6 + seed) * 0.25, ly: Math.sin(T * 0.8 + seed * 3) * 0.12, squash: Math.sin(T * 2.2 + seed) * 0.008 }, o); }
