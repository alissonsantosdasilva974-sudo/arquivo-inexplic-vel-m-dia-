function hideCuts() { for (const k in CUTS) { CUTS[k].root.visible = false; CUTS[k].shadow.visible = false; } }
// ---------- Ep. "Áudios": praça da caixa dos recados, rua da dona Lúcia, quarto do Caio e cozinha ----------
const WORLD = { trees: [], cars: [], lamps: [] };
const BOXP = { x: 0, z: 2 };                    // caixa dos recados (frente virada para -z)
const HOUSE = { x: 9, z: -24 };                 // casa da dona Lúcia (porta em z = -21.5)
const RX = 200, KX = 300;                        // quarto do Caio e cozinha (sets à parte)
function panel(w, h, col, o = {}) { return box(w, h, 0.08, col, o); }
function prism(w, h, d, col) { const g = new THREE.CylinderGeometry(1, 1, 1, 3); g.rotateZ(Math.PI / 2); g.rotateX(Math.PI / 6 * 0); const m = M(g, col, { ol: 0.04 }); m.scale.set(d, h, w * 0.58); return m; }
const audioTex = (col) => canvasTex(256, 96, (g, w, h) => { g.fillStyle = '#1e1820'; g.beginPath(); g.roundRect(4, 4, w - 8, h - 8, 44); g.fill(); g.fillStyle = col; g.beginPath(); g.roundRect(12, 12, w - 24, h - 24, 36); g.fill();
  g.fillStyle = '#1e1820'; g.beginPath(); g.moveTo(42, 30); g.lineTo(42, 66); g.lineTo(70, 48); g.fill(); for (let i = 0; i < 14; i++) { const hh = 8 + Math.abs(Math.sin(i * 1.7)) * 30; g.fillRect(90 + i * 10, 48 - hh / 2, 5, hh); } });
const ATEX = [audioTex('#ffd23f'), audioTex('#fff6e0'), audioTex('#9fd0ff')];
const GLOW = canvasTex(128, 128, (g, w, h) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,230,150,0.9)'); r.addColorStop(1, 'rgba(255,200,100,0)'); g.fillStyle = r; g.fillRect(0, 0, w, h); });
const AUD = []; for (let i = 0; i < 40; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ATEX[i % 3], transparent: true, depthWrite: false })); const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); SCENE.add(gl); SCENE.add(sp); AUD.push({ sp, gl }); }
// lista de áudios voando: {x,y,z,s=0.5,op=1,c}
function audios(list) { AUD.forEach((a, i) => { const o = list[i]; a.sp.visible = a.gl.visible = !!o; if (!o) return; const s = o.s || 0.5; a.sp.position.set(o.x, o.y, o.z); a.sp.scale.set(s * 2.6, s, 1); a.sp.material.opacity = o.op == null ? 1 : o.op; if (o.c != null) a.sp.material.map = ATEX[o.c]; a.gl.position.set(o.x, o.y, o.z); a.gl.scale.setScalar(s * 3.2); a.gl.material.opacity = 0.7 * (o.op == null ? 1 : o.op); }); }
// ---- caixa dos recados ----
const CAIXA = (() => {
  const g = new THREE.Group(), W = 1.5, H = 2.0, D = 0.9, C = '#c8443c', IN = '#4a2a34';
  const inner = toon(IN);
  const back = box(W, H, 0.08, IN); back.position.set(0, H / 2 + 0.2, D / 2); g.add(back);
  for (const sx of [-1, 1]) { const s = box(0.08, H, D, C); s.position.set(sx * W / 2, H / 2 + 0.2, 0); g.add(s); }
  const top = box(W + 0.24, 0.12, D + 0.24, '#8a2a28'); top.position.set(0, H + 0.26, 0); g.add(top);
  const roof = box(W + 0.1, 0.3, D + 0.1, C); roof.position.set(0, H + 0.42, 0); roof.rotation.x = 0; g.add(roof);
  const bot = box(W, 0.1, D, C); bot.position.set(0, 0.25, 0); g.add(bot);
  for (const sx of [-0.6, 0.6]) for (const sz of [-0.3, 0.3]) { const l = box(0.1, 0.2, 0.1, '#3a3448'); l.position.set(sx, 0.1, sz); g.add(l); }
  for (let k = 1; k < 4; k++) { const sh = box(W - 0.1, 0.05, D - 0.1, '#6a4048'); sh.position.set(0, 0.25 + k * H / 4, 0.02); g.add(sh); }
  // portas com dobradiça
  const doors = [];
  for (const sx of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sx * W / 2, 0.2, -D / 2 - 0.02); const d = box(W / 2, H, 0.07, C); d.position.set(-sx * W / 4, H / 2, 0); piv.add(d);
    const kn = sph(0.05, '#f2c230'); kn.position.set(-sx * (W / 2 - 0.1), H / 2, -0.06); piv.add(kn); g.add(piv); doors.push({ piv, sx }); }
  // placa e fenda (na porta esquerda+direita: placa em cima, presa no teto)
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.42), new THREE.MeshBasicMaterial({ map: canvasTex(512, 144, (q, w, h) => { q.fillStyle = '#ffd23f'; q.fillRect(0, 0, w, h); q.strokeStyle = '#1e1820'; q.lineWidth = 12; q.strokeRect(6, 6, w - 12, h - 12); q.fillStyle = '#1e1820'; q.font = 'bold 92px Fredoka, sans-serif'; q.textAlign = 'center'; q.fillText('RECADOS', w / 2, 108); }) }));
  sign.position.set(0, H + 0.42, -D / 2 - 0.08); g.add(sign);
  const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.07), new THREE.MeshBasicMaterial({ color: 0xffd27a })); slot.position.set(0, H - 0.15, -D / 2 - 0.11); g.add(slot);
  // áudios guardados dentro (bolinhas acesas)
  const orbs = [], r = rng(12), cols = [0xffd27a, 0xfff0c0, 0x9fd0ff, 0xffb070];
  for (let k = 0; k < 4; k++) for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.075 + r() * 0.03, 12, 8), new THREE.MeshBasicMaterial({ color: cols[(i + k) % 4] }));
    m.position.set(-0.6 + (i % 8) * 0.17 + r() * 0.03, 0.36 + k * H / 4 + (i < 8 ? 0 : 0.17), -0.15 + (i < 8 ? 0.15 : -0.1)); m.visible = false; g.add(m); orbs.push(m); }
  const light = new THREE.PointLight(0xffd890, 0, 5, 2); light.position.set(0, 1.2, -0.2); g.add(light);
  at(g, BOXP.x, 0, BOXP.z, 0);
  return { g, doors, orbs, light, slot };
})();
function caixa(open = 0, fill = 0, T = 0) {
  CAIXA.doors.forEach(d => d.piv.rotation.y = d.sx * open * 1.9);
  const n = Math.round(fill); CAIXA.orbs.forEach((m, i) => { m.visible = i < n; m.scale.setScalar(1 + 0.15 * Math.sin(T * 4 + i)); });
  CAIXA.light.intensity = (0.4 + open * 2.2) * Math.min(1, n / 20 + 0.2);
  CAIXA.slot.material.color.setHex(n > 0 ? 0xffd27a : 0x2a2030);
}
// ---- praça + rua + casas ----
(function build() {
  plane(400, 400, new THREE.MeshToonMaterial({ map: ASFALTO, gradientMap: GRAD }), 0, 0, 0);
  plane(34, 30, new THREE.MeshToonMaterial({ map: CALCADA, gradientMap: GRAD }), 0, 0.004, 4).material.map.repeat.set(12, 10);
  // canteiros de terra
  for (const [x, z] of [[-9, 8], [9, 8], [-9, -4], [9, -4]]) plane(5, 5, new THREE.MeshToonMaterial({ map: TERRA, gradientMap: GRAD }), x, 0.008, z);
  for (const [x, z] of [[-9, 8], [9, 8], [-9, -4], [9, -4]]) WORLD.trees.push(ipe3(x, z, (x * z) > 0 ? '#ee8aaa' : '#f2c230', 0.95));
  for (const x of [-12, 12]) for (const z of [-8, 2, 12]) WORLD.trees.push(ipe3(x + Math.sign(x) * 3, z + 2, z % 4 ? '#f2c230' : '#ee8aaa', 0.85));
  bench3(-2.6, 0.6, Math.PI); bench3(2.8, 0.6, Math.PI); bench3(-5, 9, 0);
  for (const [x, z] of [[-4.5, -1.5], [4.5, -1.5], [-7, 14], [7, 14], [0, 16]]) WORLD.lamps.push(lamp3(x, z));
  at(cyl(0.3, 0.25, 0.9, '#e07a3a'), 3.6, 0.45, -0.6);
  // chafariz no fundo
  at(cyl(2.2, 2.4, 0.6, '#d8cfc0'), 0, 0.3, 12); at(cyl(1.9, 1.9, 0.05, '#7ab8e0', { outline: false }), 0, 0.62, 12); at(cyl(0.25, 0.35, 1.6, '#d8cfc0'), 0, 0.8, 12);
  // banca de jornal
  at(box(2.4, 2.4, 1.8, '#3c6aa8'), 11, 1.2, -2).add(box(2.8, 0.2, 2.4, '#c8443c').translateY(1.3));
  // rua da frente (z = -16), faixa e calçada
  for (let x = -60; x < 60; x += 4) { const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.18), new THREE.MeshBasicMaterial({ color: 0xfff2c4 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.01, -16); SCENE.add(m); }
  plane(120, 3, toon('#d8cfc0'), 0, 0.03, -21.5);
  // casa da dona Lúcia
  { const g = new THREE.Group(), C = '#e8a8b8';
    g.add(box(6, 3.2, 5, C).translateY(1.6)); const rf = box(6.6, 0.4, 5.6, '#c8643c'); rf.position.y = 3.4; g.add(rf); const rf2 = box(5, 0.9, 4.2, '#c8643c'); rf2.position.y = 4.0; g.add(rf2);
    for (const sx of [-1.9, 1.9]) { const w = box(1.1, 1.0, 0.1, '#ffe2a0', { mo: { emissive: new THREE.Color('#ffc870'), emissiveIntensity: 0 } }); w.position.set(sx, 1.7, 2.53); g.add(w); WORLD.lamps.push(w); const fr = box(1.3, 0.12, 0.2, '#fff6e0'); fr.position.set(sx, 1.15, 2.58); g.add(fr); }
    const piv = new THREE.Group(); piv.position.set(-0.5, 0, 2.55); const dr = box(1.0, 2.1, 0.08, '#7a4a8a'); dr.position.set(0.5, 1.05, 0); piv.add(dr); const kn = sph(0.05, '#f2c230'); kn.position.set(0.85, 1.05, 0.08); piv.add(kn); g.add(piv); WORLD.door = piv;
    const fr = box(1.25, 0.15, 0.15, '#fff6e0'); fr.position.set(0, 2.18, 2.58); g.add(fr);
    const inside = box(1.0, 2.1, 0.05, '#ffd8a0', { outline: false, mo: { emissive: new THREE.Color('#ffb860'), emissiveIntensity: 0.5 } }); inside.position.set(0, 1.05, 2.45); g.add(inside);
    at(g, HOUSE.x, 0, HOUSE.z, 0); }
  // casas e prédios dos dois lados da rua e em volta da praça
  const r = rng(77);
  { let x = -60; while (x < 60) { const w = 5 + r() * 4; if (x + w > HOUSE.x - 3.4 && x < HOUSE.x + 3.4) { x = HOUSE.x + 3.5; continue; } const fl = r() < 0.5 ? 1 : r() < 0.8 ? 2 : 4; bldg3(x + w / 2, -26, w, 7, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.5, Math.floor(r() * 1e5), 0); x += w + 0.3; } }
  { let x = -60; while (x < 60) { const w = 6 + r() * 5, fl = 3 + Math.floor(r() * 6); bldg3(x + w / 2, 30, w, 8, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.6, Math.floor(r() * 1e5), Math.PI); x += w + 0.3; } }
  for (const s of [-1, 1]) { let z = -12; while (z < 26) { const w = 6 + r() * 5, fl = 2 + Math.floor(r() * 5); bldg3(s * 26, z + w / 2, 8, w, fl, PAL3[Math.floor(r() * PAL3.length)], r() < 0.6, Math.floor(r() * 1e5), s > 0 ? -Math.PI / 2 : Math.PI / 2); z += w + 0.3; } }
  for (let i = 0; i < 6; i++) WORLD.cars.push({ g: car3(CARC[(i * 3) % CARC.length]), lane: i % 2 ? 1 : -1, ph: i * 31 });
})();
// ---- quarto do Caio (set em x = RX) ----
const ROOM = (() => {
  const g = new THREE.Group();
  const WOOD = canvasTex(256, 256, (q, w, h) => { q.fillStyle = '#b07a4a'; q.fillRect(0, 0, w, h); q.strokeStyle = 'rgba(60,30,20,0.35)'; q.lineWidth = 4; for (let y = 0; y < h; y += 32) { q.beginPath(); q.moveTo(0, y); q.lineTo(w, y); q.stroke(); } }, [3, 3]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshToonMaterial({ map: WOOD, gradientMap: GRAD })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const WALL = '#8aa0d0';
  const bw = box(6, 3, 0.1, WALL); bw.position.set(0, 1.5, 3); g.add(bw);
  const lw = box(0.1, 3, 6, shade(WALL, 0.1)); lw.position.set(-3, 1.5, 0); g.add(lw);
  const rw = box(0.1, 3, 6, shade(WALL, 0.1)); rw.position.set(3, 1.5, 0); g.add(rw);
  // janela com céu
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.2), new THREE.MeshBasicMaterial({ color: 0x22285a })); win.position.set(0.8, 1.8, 2.94); g.add(win);
  const wf = box(1.8, 0.12, 0.15, '#fff6e0'); wf.position.set(0.8, 1.18, 2.9); g.add(wf); const wf2 = box(0.08, 1.2, 0.12, '#fff6e0'); wf2.position.set(0.8, 1.8, 2.9); g.add(wf2);
  // pôster
  const po = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.1), new THREE.MeshBasicMaterial({ map: canvasTex(128, 176, (q, w, h) => { q.fillStyle = '#f2c230'; q.fillRect(0, 0, w, h); q.fillStyle = '#e8503a'; q.beginPath(); q.arc(64, 70, 40, 0, 7); q.fill(); q.fillStyle = '#1e1820'; q.fillRect(20, 130, 88, 16); }) })); po.position.set(-1.6, 1.9, 2.94); g.add(po);
  // cama encostada na parede esquerda
  const bed = new THREE.Group(); bed.add(box(1.3, 0.4, 2.4, '#6a4a3a').translateY(0.2)); bed.add(box(1.2, 0.2, 2.3, '#e8e4f2').translateY(0.5)); bed.add(box(1.25, 0.12, 1.6, '#e8503a').translateY(0.62).translateZ(-0.35)); bed.add(box(0.8, 0.18, 0.45, '#fff6e0').translateY(0.68).translateZ(0.85)); bed.add(box(1.3, 0.9, 0.1, '#6a4a3a').translateY(0.45).translateZ(1.2));
  bed.position.set(-2.25, 0, 1.6); g.add(bed);
  // escrivaninha e abajur
  const desk = box(1.6, 0.08, 0.7, '#c8a070'); desk.position.set(2.1, 0.78, 1.5); g.add(desk); for (const sx of [1.4, 2.8]) { const l = box(0.06, 0.78, 0.6, '#8a6a4a'); l.position.set(sx, 0.39, 1.5); g.add(l); }
  const lamp = cyl(0.12, 0.22, 0.25, '#f2c230'); lamp.position.set(2.5, 1.2, 1.6); g.add(lamp); const ls = cyl(0.02, 0.02, 0.4, '#3a3448'); ls.position.set(2.5, 0.98, 1.6); g.add(ls);
  const pl = new THREE.PointLight(0xffd8a0, 1.1, 9, 1.6); pl.position.set(1.8, 1.8, 0.8); g.add(pl);
  const pl2 = new THREE.PointLight(0x9fb8ff, 0.5, 12, 1); pl2.position.set(0, 2.6, -2); g.add(pl2);
  // porta (parede direita)
  const dr = box(0.08, 2.1, 1.0, '#7a4a8a'); dr.position.set(2.95, 1.05, -1.2); g.add(dr);
  at(g, RX, 0, 0);
  return { g, win, pl, pl2 };
})();
// ---- cozinha da dona Lúcia (set em x = KX) ----
const KITCHEN = (() => {
  const g = new THREE.Group();
  const TILE = canvasTex(256, 256, (q, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { q.fillStyle = (i + j) % 2 ? '#f4ead4' : '#d8506a'; q.fillRect(i * 32, j * 32, 32, 32); } }, [4, 4]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshToonMaterial({ map: TILE, gradientMap: GRAD })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const WALL = '#f2d27a';
  const bw = box(7, 3, 0.1, WALL); bw.position.set(0, 1.5, 3); g.add(bw);
  const lw = box(0.1, 3, 7, shade(WALL, 0.08)); lw.position.set(-3.5, 1.5, 0); g.add(lw);
  const rw = box(0.1, 3, 7, shade(WALL, 0.08)); rw.position.set(3.5, 1.5, 0); g.add(rw);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.1), new THREE.MeshBasicMaterial({ color: 0x9fd0f0 })); win.position.set(-1.6, 1.85, 2.94); g.add(win);
  const wf = box(1.6, 0.1, 0.18, '#fff6e0'); wf.position.set(-1.6, 1.28, 2.9); g.add(wf);
  // balcão, fogão e armários
  const ct = box(3.4, 0.9, 0.7, '#fff6e0'); ct.position.set(-1.3, 0.45, 2.55); g.add(ct); const top = box(3.5, 0.06, 0.8, '#c8a070'); top.position.set(-1.3, 0.92, 2.55); g.add(top);
  const st = box(0.9, 0.92, 0.7, '#e8e4dc'); st.position.set(1.0, 0.46, 2.55); g.add(st); for (const sx of [0.8, 1.2]) { const b = cyl(0.12, 0.12, 0.03, '#2a2430'); b.position.set(sx, 0.94, 2.5); g.add(b); }
  const pan = cyl(0.2, 0.18, 0.2, '#c8443c'); pan.position.set(0.8, 1.05, 2.5); g.add(pan);
  for (const sx of [-2.3, -1.2, 0]) { const c = box(1.0, 0.7, 0.4, '#d8506a'); c.position.set(sx, 2.2, 2.75); g.add(c); }
  // geladeira
  const fr = box(0.9, 1.9, 0.8, '#e8f0f8'); fr.position.set(2.7, 0.95, 2.4); g.add(fr);
  // mesa, cadeiras, bolo
  const tb = cyl(0.8, 0.8, 0.06, '#c8a070', { seg: 24 }); tb.position.set(0, 0.78, 0.3); g.add(tb); const tl = cyl(0.08, 0.12, 0.76, '#8a6a4a'); tl.position.set(0, 0.38, 0.3); g.add(tl);
  const cloth = cyl(0.82, 0.82, 0.02, '#fff6e0', { seg: 24, outline: false }); cloth.position.set(0, 0.82, 0.3); g.add(cloth);
  for (const sx of [-1.1, 1.1]) { const ch = box(0.5, 0.06, 0.5, '#a46a3a'); ch.position.set(sx, 0.48, 0.3); g.add(ch); const cb = box(0.06, 0.6, 0.5, '#a46a3a'); cb.position.set(sx + Math.sign(sx) * 0.25, 0.78, 0.3); g.add(cb); }
  const cake = new THREE.Group(); cake.add(cyl(0.3, 0.3, 0.22, '#8a4a2a').translateY(0.11)); cake.add(cyl(0.31, 0.31, 0.06, '#fff0f4').translateY(0.24)); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; cake.add(sph(0.04, '#e8503a').translateX(Math.cos(a) * 0.2).translateZ(Math.sin(a) * 0.2).translateY(0.29)); }
  cake.position.set(0.15, 0.83, 0.2); g.add(cake);
  const pend = cyl(0.05, 0.35, 0.25, '#e8503a'); pend.position.set(0, 2.5, 0.3); g.add(pend);
  const pl = new THREE.PointLight(0xffe0b0, 1.2, 10, 1.4); pl.position.set(0, 2.3, 0.3); g.add(pl);
  const pl2 = new THREE.PointLight(0xfff0dc, 0.5, 12, 1); pl2.position.set(0, 2.6, -2.5); g.add(pl2);
  at(g, KX, 0, 0);
  return { g, win, pl, pl2, cake };
})();
function resetProps() { WORLD.cars.forEach(c => c.g.visible = true); audios([]); caixa(0, 0); if (WORLD.door) WORLD.door.rotation.y = 0; }
function animateWorld(T) {
  for (const c of CLOUDS) c.position.x = ((c.userData.x0 + 150 + T * c.userData.sp) % 300) - 150;
  for (const tr of WORLD.trees) tr.rotation.z = Math.sin(T * 0.9 + tr.userData.sway) * 0.015;
  for (const c of WORLD.cars) { const L = 130, x = ((c.ph * 7 + T * 8 * c.lane) % L + L) % L - 65; c.g.position.set(x, 0, -16 + c.lane * 1.8); c.g.rotation.y = c.lane > 0 ? Math.PI / 2 : -Math.PI / 2; }
}
// clima: dia, entardecer, noite, sépia (lembrança), madrugada
function mood(name) {
  const P = { day: { sky: ['#6fa8d8', '#a8c8e0', '#f8d8b0', '#fde8c0'], sun: 0xffe0b8, si: 1.3, hemi: 0.65, fog: 0xf4dcc0, cloud: ['#fff6ee', '#f8d8c8'], lamp: 0 },
    dusk: { sky: ['#5a4a8a', '#c86a7a', '#f2a070', '#fde0b0'], sun: 0xffb880, si: 1.0, hemi: 0.55, fog: 0xe8a888, cloud: ['#f8c8b8', '#e8a0a0'], lamp: 0.4 },
    night: { sky: ['#0e1236', '#22285a', '#3a3a78', '#5a5a96'], sun: 0x8aa0ff, si: 0.45, hemi: 0.4, fog: 0x2e3264, cloud: ['#4a4a80', '#3a3a6a'], lamp: 1 },
    sepia: { sky: ['#c8a070', '#dcb888', '#f0d4a8', '#f8e6c4'], sun: 0xffe2b4, si: 1.1, hemi: 0.75, fog: 0xead2ac, cloud: ['#fff2dc', '#f0d8b4'], lamp: 0 },
    dawn: { sky: ['#4a5a9a', '#a88ab8', '#f8b8a0', '#fde0b0'], sun: 0xffc8a0, si: 0.9, hemi: 0.55, fog: 0xd8b0b0, cloud: ['#f8d0c8', '#d8b0c0'], lamp: 0.3 } }[name] || null;
  if (!P || mood.cur === name) return; mood.cur = name;
  SUN.color.setHex(P.sun); SUN.intensity = P.si; HEMI.intensity = P.hemi; SCENE.fog.color.setHex(P.fog);
  const g = SKY.image.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 512); P.sky.forEach((c, i) => gr.addColorStop([0, 0.35, 0.75, 1][i], c)); g.fillStyle = gr; g.fillRect(0, 0, 8, 512); SKY.needsUpdate = true;
  for (const c of CLOUDS) c.children.forEach((m, i) => { if (m.material && m.material.color) m.material.color.set(i % 2 ? P.cloud[1] : P.cloud[0]); });
  STARS.visible = name === 'night';
  for (const l of WORLD.lamps) l.traverse(m => { if (m.material && m.material.emissive) m.material.emissiveIntensity = 0.3 + P.lamp * 1.2; });
  ROOM.win.material.color.setHex(name === 'night' ? 0x22285a : name === 'dawn' ? 0xc8a0c0 : 0x9fd0f0);
  KITCHEN.win.material.color.setHex(name === 'night' ? 0x22285a : name === 'sepia' ? 0xf8e0b0 : 0x9fd0f0);
}
