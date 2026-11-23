// Lista os planos de um episódio (t0, tipo, Polo em close) e salva work/cuts.json. node video/tools/shot_list.js ep3
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
(async () => { const ep = process.argv[2]; const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(ep, 'web/index.html')); await p.waitForTimeout(300);
  const s = await p.evaluate(() => SHOTS.map(x => ({ t0: typeof unmapT === 'function' ? +unmapT(x.t0).toFixed(3) : x.t0, k: x.k, pc: +x.pc || 0, xf: x.xf || 0, cont: x.cont || 0 })));
  fs.writeFileSync(path.join(ep, 'work/cuts.json'), JSON.stringify(s)); console.log(s.length, 'planos', errs); await b.close(); })();
