// Usage: node tools/render.js <outDir> <frames: "a-b" | "a,b,c" | "sheet"> [workerIndex workerCount]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const [out, spec, wi = '0', wc = '1'] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: +(process.env.VW||1920), height: +(process.env.VH||1080) }, deviceScaleFactor: +(process.env.DSF||1) });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const url = 'file://' + path.resolve(__dirname, process.env.WEBDIR ? '../'+process.env.WEBDIR+'/index.html' : '../web/index.html') + (spec === 'sheet' ? '?sheet=1' : '');
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  if (spec === 'sheet') { await page.screenshot({ path: path.join(out, 'sheet.png') }); }
  else {
    let frames = [];
    if (spec.includes('-')) { const [a, b] = spec.split('-').map(Number); for (let f = a; f <= b; f++) frames.push(f); }
    else frames = spec.split(',').map(Number);
    frames = frames.filter((f, i) => i % +wc === +wi);
    for (const f of frames) {
      const EXT = process.env.JPG ? 'jpg' : 'png';
      const file = path.join(out, `f${String(f).padStart(5, '0')}.${EXT}`);
      if (fs.existsSync(file) && fs.statSync(file).size > 10000) continue; // resume
      await page.evaluate(n => window.renderFrame(n), f);
      await page.screenshot(EXT === 'jpg' ? { path: file + '.tmp.jpg', type: 'jpeg', quality: 96 } : { path: file + '.tmp.png' });
      fs.renameSync(file + '.tmp.' + EXT, file);
    }
  }
  if (errs.length) { console.error('PAGE ERRORS:', errs.slice(0, 5)); process.exitCode = 2; }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
