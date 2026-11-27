// Render do motor 3D: node render3d.js <outDir> <a-b|a,b,c> [worker workers]   (DSF=2 para 2x)
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
(async () => {
  const [out, spec, wi = '0', wc = '1'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: +(process.env.DSF || 1) });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  let fr = []; if (spec.includes('-')) { const [a, c] = spec.split('-').map(Number); for (let f = a; f <= c; f++) fr.push(f); } else fr = spec.split(',').map(Number);
  fr = fr.filter((f, i) => i % +wc === +wi);
  for (const f of fr) { const file = path.join(out, `f${String(f).padStart(5, '0')}.jpg`); if (fs.existsSync(file)) continue;
    await p.evaluate(n => window.renderFrame(n), f); await p.screenshot({ path: file + '.tmp.jpg', type: 'jpeg', quality: 95 }); fs.renameSync(file + '.tmp.jpg', file); }
  if (errs.length) console.error('ERR', errs.slice(0, 5)); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
