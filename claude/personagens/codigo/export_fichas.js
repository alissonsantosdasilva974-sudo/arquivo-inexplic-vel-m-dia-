// Exports reusable character sheets: standalone transparent SVGs (front, side, expressions) + measured proportions.
// Usage: node video/tools/export_fichas.js   (run from repo root)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, 'claude/personagens/svg');
const CHARS = [
  ['polo', {}], ['mae', {}], ['padeira', {}], ['padeira_aposentada', { id: 'padeira', old: true }], ['padeiro_novo', { id: 'padeiro2' }],
  ['motorista', {}], ['barnabe', {}], ['menino', {}], ['mulher_oculos', { id: 'mulher' }], ['moca', {}],
  ['vizinho1', { id: 'viz1' }], ['vizinho2', { id: 'viz2' }], ['vizinha3', { id: 'viz3' }],
];
const EXPR = [['neutra', 'neutral'], ['surpreso', 'surprised'], ['rindo', 'laugh']];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'video/web9/index.html'));
  await p.evaluate(() => { window.autoBlink = () => 0; });
  const report = {};
  for (const [name, o] of CHARS) {
    const id = o.id || name;
    const res = await p.evaluate(({ id, old, EXPR }) => {
      const NS = 'http://www.w3.org/2000/svg';
      const host = document.createElementNS(NS, 'svg'); host.setAttribute('width', '1200'); host.setAttribute('height', '1200');
      document.body.appendChild(host);
      const mk = (opts) => person(id, Object.assign({ x: 0, y: 0, s: 1, t: 0.5, old }, opts));
      const bbox = (inner) => { host.innerHTML = DEFS + `<g id="c">${inner}</g>`; const r = host.querySelector('#c').getBBox(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
      const out = {};
      const wrap = (inner, vb, title) => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(v => v.toFixed(1)).join(' ')}" width="${Math.round(vb[2])}" height="${Math.round(vb[3])}"><title>${title}</title>${DEFS}${inner}</svg>\n`;
      const pad = 14;
      const front = mk({ expr: 'neutral', shadow: false });
      let bb = bbox(front);
      out.frente = wrap(front, [bb.x - pad, bb.y - pad, bb.w + 2 * pad, bb.h + 2 * pad], `${id} — frente`);
      out.metrics = bb;
      const side = mk({ expr: 'neutral', side: true, face: 0.8, shadow: false });
      let bs = bbox(side);
      out.lado = wrap(side, [bs.x - pad, bs.y - pad, bs.w + 2 * pad, bs.h + 2 * pad], `${id} — lado`);
      for (const [fname, ex] of EXPR) {
        const g = mk({ expr: ex, shadow: false, mouth: ex === 'laugh' ? 0.8 : 0 });
        const bf = bbox(g);
        const sc = (CAST2[old ? 'padeiraV' : id].scale || 1);
        const top = Math.min(bf.y, -460 * sc), bottom = -205 * sc, half = 165 * sc * Math.max(1, (CAST2[old ? 'padeiraV' : id].w || 1) * 0.9);
        out['expr_' + fname] = wrap(g, [-half, top - pad, half * 2, bottom - top + pad], `${id} — expressão ${fname}`);
      }
      host.remove();
      return out;
    }, { id, old: !!o.old, EXPR });
    const files = [];
    for (const k of ['frente', 'lado', 'expr_neutra', 'expr_surpreso', 'expr_rindo']) {
      const f = `${name}_${k}.svg`; fs.writeFileSync(path.join(OUT, f), res[k]); files.push(f);
    }
    report[name] = { id, files, bbox: res.metrics };
  }
  fs.writeFileSync(path.join(ROOT, 'claude/personagens/medidas.json'), JSON.stringify(report, null, 1));
  if (errs.length) console.error('PAGE ERRORS', errs);
  await b.close();
  console.log('ok', Object.keys(report).length, 'personagens');
})();
