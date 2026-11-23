// Usage: node shot.cjs <base-url> <out-dir> <path> [<path>...]
const { chromium } = require('playwright');
(async () => {
  const [,, base, out, ...paths] = process.argv;
  const b = await chromium.launch();
  for (const [name, w, h] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    for (const p of paths) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      const slug = p.replace(/\//g, '_') || '_';
      await page.screenshot({ path: `${out}/${slug}-${name}.png`, fullPage: true });
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      console.log(p, name, 'overflow-x', ov, errs.length ? 'ERRORS ' + errs.join(' | ') : '');
      errs.length = 0;
    }
    await ctx.close();
  }
  await b.close();
})();
