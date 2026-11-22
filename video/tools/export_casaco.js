// Exporta claude/personagens/homem-casaco.svg (frente com a nota dobrada, lado, costas, 3 expressões). node video/tools/export_casaco.js
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '../..');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'ep3/web/index.html')); await p.waitForTimeout(500);
  const svg = await p.evaluate(() => {
    const folded = `<g transform="translate(0 -6) rotate(-10)"><rect x="-26" y="-18" width="52" height="34" rx="4" fill="#e8907a" stroke="#1e1820" stroke-width="4"/><path d="M -26 -1 H 26 M 0 -18 V 16" stroke="#b8604c" stroke-width="3"/><text x="-20" y="-5" font-family="Fredoka" font-weight="700" font-size="11" fill="#7a2e22">10</text></g>`;
    const m = (o) => person('casaco', Object.assign({ s: 1, t: 0.5, shadow: false }, o));
    const items = [
      [m({ x: 150, y: 640, expr: 'smug', armR: 60, bendR: 40, holdR: folded, coatNote: false }), 'frente'],
      [m({ x: 430, y: 640, side: true, face: 0.8, expr: 'neutral' }), 'lado'],
      [m({ x: 690, y: 640, back: true }), 'costas'],
    ];
    const heads = [['smug', 'já sabia'], ['neutral', 'neutro'], ['surprised', 'surpreso']].map(([e, l], i) => [`<g transform="translate(${960 + i * 220} 690) scale(0.8)"><g transform="translate(0 0)">${m({ expr: e, coatNote: true })}</g></g>`, l]);
    let body = items.concat(heads).map(([g, l], i) => g + `<text x="${i < 3 ? [150, 430, 690][i] : 960 + (i - 3) * 220}" y="720" text-anchor="middle" font-family="Fredoka" font-size="26" fill="#1e1820">${l}</text>`).join('');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 760" width="1600" height="760"><title>Homem de casaco longo — ficha (ep. 3)</title>${DEFS}<rect width="1600" height="760" fill="#f4efe6"/>${body}</svg>`;
  });
  fs.writeFileSync(path.join(ROOT, 'claude/personagens/homem-casaco.svg'), svg);
  await p.setContent(svg.replace(/^<\?xml[^>]*>/, '')); await p.screenshot({ path: process.argv[2] || '/tmp/casaco.png' });
  console.log('ok', errs); await b.close();
})();
