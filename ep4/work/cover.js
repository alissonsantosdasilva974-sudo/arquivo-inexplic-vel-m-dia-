// node ep4/work/cover.js -> ep4/out/capa_ep4.png
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../web/cover.html')); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.renderCover());
  await p.screenshot({ path: path.resolve(__dirname, '../out/capa_ep4.png') }); await b.close();
})();
