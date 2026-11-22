// Baut src/*.js zu dist/smart-wall-card.js (eine Datei, minifiziert)
// node build.js <version> [tag]
const fs = require('fs'), path = require('path');
const { minify } = require('terser');
const csso = require('csso');
const VER = process.argv[2] || '3.0.0';
const TAG = process.argv[3] || 'smart-wall-card';
const src = d => fs.readFileSync(path.join(__dirname, 'src', d), 'utf8');
let main = src('10-main.js');
const rep = (s, a, b) => { if (s.split(a).length !== 2) throw new Error('Patch nicht eindeutig: ' + a.slice(0, 60)); return s.replace(a, () => b); };

// 1) Schrift lokal statt von Google (mit Rückfall auf Google, falls Dateien fehlen)
main = rep(main,
  "l.href='https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300&display=swap';document.head.appendChild(l);",
  "try{const B=new URL('./',import.meta.url).href;const st=document.createElement('style');st.id='sw-font';st.textContent=[['300','normal'],['400','normal'],['600','normal'],['300','italic']].map(([w,s])=>`@font-face{font-family:'Open Sans';font-style:${s};font-weight:${w};font-display:swap;src:url(${B}open-sans-latin-${w}-${s}.woff2) format('woff2')}`).join('');document.head.appendChild(st);}catch(_){l.href='https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300&display=swap';document.head.appendChild(l);}");
// 2) Inhalt nur neu zeichnen, wenn er sich wirklich geändert hat
main = rep(main,
  "const ct=sr.getElementById('swcontent');const sc=ct.scrollTop;ct.innerHTML=body;this._placeAlerts(ct,p);ct.scrollTop=sc;",
  "const ct=sr.getElementById('swcontent');const swk=p+'\\u0001'+body+'\\u0001'+JSON.stringify((this._alertIt||{})[p]||[]);if(force||ct._swk!==swk){const sc=ct.scrollTop;ct.innerHTML=body;this._placeAlerts(ct,p);ct.scrollTop=sc;ct._swk=swk;}");
// 3) Kurzschreibweisen in der Konfiguration
main = rep(main, "setConfig(c){this._cfg=Object.assign(", "setConfig(c){c=swExpandCfg(c);this._cfg=Object.assign(");
// 4) CSS verdichten
main = main.replace(/const SW_CSS=`([\s\S]*?)`;/, (_, css) => 'const SW_CSS=`' + csso.minify(css,{restructure:false}).css.replace(/`/g, '\\`') + '`;');

const parts = [src('05-config.js'), main, src('20-popups.js'), src('25-temp.js'), src('30-car.js'), src('40-post.js'), src('45-dwd.js'), src('50-groupdim.js'), src('52-xmas.js'), src('53-setextra.js'), src('54-entrytoggle.js'), src('55-collapse.js'), src('57-compact.js'), src('58-morepops.js'), src('59-heatpop.js'), src('61-energypop.js'), src('62-vent.js'), src('64-citytraffic.js'), src('60-perf.js')];
let all = parts.join('\n;\n');
if (TAG !== 'smart-wall-card') all = all.replace(/(['"])smart-wall-card\1/g, `$1${TAG}$1`);
(async () => {
  const out = await minify(all, { module: true, compress: { passes: 2 }, mangle: true, format: { comments: false } });
  const head = `/* Smart Wall Card ${VER} – ein Dashboard im Stil "Smart Wall" (Hauptkarte + Popups, Temperatur, Auto, Post, Gruppen-Dimmer) */\n`;
  fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'dist', 'smart-wall-card.js'), head + out.code);
  for (const f of ['300-normal', '400-normal', '600-normal', '300-italic'])
    fs.copyFileSync(`${__dirname}/node_modules/@fontsource/open-sans/files/open-sans-latin-${f}.woff2`, path.join(__dirname, 'dist', `open-sans-latin-${f}.woff2`));
  const z = s => require('zlib').gzipSync(s).length;
  console.log('Quelle', all.length, 'gzip', z(all), '| Bundle', out.code.length, 'gzip', z(out.code), '| Tag', TAG);
})().catch(e => { console.error(e); process.exit(1); });
