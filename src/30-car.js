/* Smart Wall Card – Erweiterung: Auto v2.0 (Startseiten-Blase + grafisches Popup mit Bestätigen, Aktualisieren) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCar)return;C.prototype.__swCar=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ago=ts=>{if(!ts)return '';const t=new Date(ts).getTime();if(isNaN(t))return '';const m=Math.max(0,Math.round((Date.now()-t)/60000));if(m<1)return 'gerade eben';if(m<60)return 'vor '+m+' min';const h=Math.round(m/60);if(h<48)return 'vor '+h+' h';return 'vor '+Math.round(h/24)+' Tagen';};
const when=ts=>{const d=new Date(ts);return isNaN(d)?'':d.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' Uhr';};
const O='#FF9800';
const CSS=`.panel.carp{width:min(640px,100%)}
.panel.carp .pbody{max-height:min(78vh,640px)}
.carhd{display:flex;align-items:center;justify-content:space-between;gap:12px}
.carbadge{font-size:11px;font-weight:600;letter-spacing:.15em;padding:4px 10px;white-space:nowrap}
.carsub{font-size:12px;opacity:.75;margin:6px 0 14px}
.cargrid{display:grid;grid-template-columns:minmax(0,190px) minmax(0,1fr);gap:22px;align-items:center}
.cargrid svg{width:100%;max-width:190px;display:block;margin:0 auto}
.carrow{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px}
.carrow .carl{flex:1;min-width:0}
.carrow .carv{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase}
.carrow.o .carv{color:${O}}
.carrow.ak{opacity:.55}
.carrow .hack{padding:5px 10px;font-size:10px}
.cartank{margin-top:16px;font-size:11px;letter-spacing:.2em;opacity:.75;text-transform:uppercase}
.carbar{height:6px;background:rgba(255,255,255,.15);margin-top:6px}.carbar>div{height:100%;background:#fff}
.carbtns{display:flex;gap:8px;margin-top:18px}.carbtns>button{flex:1}
@media (max-width:560px){.cargrid{grid-template-columns:1fr}.cargrid svg{max-width:150px}}`;

/* Zustand eines Autos: zu Hause? welche Teile offen? welche davon schon bestätigt? */
C.prototype._carState=function(car){const S=id=>id?this._st(id):null;const tr=S(car.tracker);const home=!car.tracker||(!!tr&&tr.state===(car.zone||'home'));
  const items=(car.items||[]).map(it=>{const s=S(it.e);const ak=S(it.ack);return Object.assign({},it,{open:!!s&&s.state==='on',acked:!!ak&&ak.state==='on',det:(it.detail||[]).filter(d=>{const x=S(d.e);return x&&x.state==='on';}).map(d=>d.l)});});
  const open=items.filter(i=>i.open);return {home,items,open,todo:home?open.filter(i=>!i.acked):[]};};

/* Neu zeichnen, wenn sich Auto-Werte ändern */
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);(this._cfg.car_alerts||[]).forEach(c=>{ids.push(c.tracker,c.last_update,c.lock,c.tank,c.range);const P=c.parts||{};['doors','windows'].forEach(k=>Object.values(P[k]||{}).forEach(x=>ids.push(x)));ids.push(P.sunroof,P.trunk,P.hood);(c.extra||[]).forEach(x=>ids.push(x.e));(c.items||[]).forEach(i=>{ids.push(i.e,i.ack);(i.detail||[]).forEach(d=>ids.push(d.e));});});return ids.filter(Boolean);};

/* Blase auf der Startseite */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);(this._cfg.car_alerts||[]).forEach((car,i)=>{const st=this._carState(car);if(!st.todo.length&&!this._cfg.alerts_test)return;
  out+=this._bub(st.todo.length,'OFFEN',{cap:car.name||'Auto',txt:st.todo.length?st.todo.map(x=>x.l).join(', ').toUpperCase():'ALLES ZU'},st.todo.length?O:null,'pop:car'+i);});return out;};

/* Auto von oben – offene Teile orange */
C.prototype._carSvg=function(car){const P=car.parts||{};const on=id=>{const s=id&&this._st(id);return !!s&&s.state==='on';};const D=P.doors||{},W=P.windows||{};
  const glass='rgba(160,190,210,.3)',line='rgba(255,255,255,.55)';
  const lid=(d,id)=>{const o=on(id);return `<path d="${d}" fill="${o?O:'rgba(255,255,255,.04)'}" fill-opacity="${o?.55:1}" stroke="${o?O:line}" stroke-width="${o?1.6:1}"/>`;};
  const win=(x,y,h,id)=>{const o=on(id);return `<rect x="${x}" y="${y}" width="8" height="${h}" rx="2" fill="${o?O:glass}" fill-opacity="${o?.75:1}" stroke="${o?O:line}"/>`;};
  const door=(x,y,h,id,L)=>{const o=on(id);const hx=L?x:x+6;return `<rect x="${x}" y="${y}" width="6" height="${h}" rx="2" fill="${o?O:'#fff'}"${o?` transform="rotate(${L?35:-35} ${hx} ${y})"`:''}/>`;};
  const sr=on(P.sunroof);
  return `<svg viewBox="0 0 200 360" role="img" aria-label="Auto von oben">
<rect x="40" y="18" width="120" height="324" rx="42" fill="rgba(255,255,255,.07)" stroke="#fff" stroke-width="1.6"/>
${lid('M58 30 Q100 16 142 30 L146 92 L54 92 Z',P.hood)}
<path d="M56 100 L144 100 L136 128 L64 128 Z" fill="${glass}" stroke="${line}"/>
<rect x="64" y="132" width="72" height="100" rx="6" fill="rgba(255,255,255,.05)" stroke="${line}"/>
${P.sunroof?`<rect x="74" y="142" width="52" height="44" rx="4" fill="${sr?O:'rgba(255,255,255,.06)'}" fill-opacity="${sr?.55:1}" stroke="${sr?O:line}" stroke-width="${sr?1.6:1}"/>`:''}
<path d="M64 236 L136 236 L142 258 L58 258 Z" fill="${glass}" stroke="${line}"/>
${lid('M54 264 L146 264 L142 330 Q100 344 58 330 Z',P.trunk)}
${win(50,132,46,W.lf)}${win(142,132,46,W.rf)}${win(50,184,44,W.lr)}${win(142,184,44,W.rr)}
${door(34,128,52,D.lf,true)}${door(160,128,52,D.rf,false)}${door(34,182,50,D.lr,true)}${door(160,182,50,D.rr,false)}
<rect x="26" y="70" width="12" height="40" rx="4" fill="rgba(255,255,255,.25)"/><rect x="162" y="70" width="12" height="40" rx="4" fill="rgba(255,255,255,.25)"/>
<rect x="26" y="250" width="12" height="40" rx="4" fill="rgba(255,255,255,.25)"/><rect x="162" y="250" width="12" height="40" rx="4" fill="rgba(255,255,255,.25)"/>
</svg>`;};

/* Popup */
C.prototype._carHtml=function(kind){const car=(this._cfg.car_alerts||[])[Number(String(kind).slice(3))];if(!car)return '';const S=id=>id?this._st(id):null;const ok=s=>s&&!['unknown','unavailable'].includes(s.state);
  const st=this._carState(car);const ex=(car.extra||[]).map(x=>({l:x.l,open:(S(x.e)||{}).state==='on'}));const nOpen=st.open.length+ex.filter(x=>x.open).length;
  const lk=S(car.lock);const tr=S(car.tracker);const lu=S(car.last_update);
  const sub=[lk?(lk.state==='locked'?'Abgeschlossen':lk.state==='unlocked'?'Nicht abgeschlossen':'Schloss unbekannt'):'',tr?(tr.state==='home'?'Zuhause':tr.state==='not_home'?'Unterwegs':tr.state):'',ok(lu)?'letzter Kontakt '+ago(lu.state):''].filter(Boolean).join(' · ');
  const badge=nOpen?`<div class="carbadge" style="color:${O};background:rgba(255,152,0,.22)">${nOpen} OFFEN</div>`:'<div class="carbadge" style="color:#9ccc65;background:rgba(156,204,101,.18)">ALLES ZU</div>';
  const rows=st.items.map(it=>{const can=it.ack&&S(it.ack);const btn=it.open&&can?(it.acked?`<button class="hack" data-a="carack" data-e="${esc(it.ack)}" data-on="0" data-k="${esc(kind)}">Wieder melden</button>`:`<button class="hack" data-a="carack" data-e="${esc(it.ack)}" data-on="1" data-k="${esc(kind)}">Bestätigen</button>`):'';
    const v=it.open?(it.det.length?it.det.join(', '):'offen')+(it.acked?' · bestätigt':''):'zu';return `<div class="carrow ${it.open?'o':''} ${it.open&&it.acked?'ak':''}"><div class="carl">${esc(it.l)}</div><div class="carv">${esc(v)}</div>${btn}</div>`;}).join('')
    +ex.map(x=>`<div class="carrow ${x.open?'o':''}"><div class="carl">${esc(x.l)}</div><div class="carv">${x.open?'offen':'zu'}</div></div>`).join('');
  const un=st.open.filter(i=>!i.acked&&i.ack&&S(i.ack));const all=un.length>1?`<div style="text-align:right;margin-top:10px"><button class="hack" data-a="carack" data-e="${esc(un.map(i=>i.ack).join(','))}" data-on="1" data-k="${esc(kind)}">Alle bestätigen</button></div>`:'';
  const tk=S(car.tank),rg=S(car.range);const tv=ok(tk)?Math.max(0,Math.min(100,parseFloat(tk.state)||0)):null;
  const tank=tv!=null?`<div class="cartank">Tank · ${Math.round(tv)} %${ok(rg)?' · '+esc(rg.state)+' '+esc(rg.attributes.unit_of_measurement||''):''}</div><div class="carbar"><div style="width:${tv}%${tv<20?';background:'+O:''}"></div></div>`:'';
  let notes='';if(!st.home&&st.open.length)notes+='<div class="pmut">Das Auto ist gerade nicht zu Hause – auf der Startseite wird nur zu Hause gemeldet.</div>';
  if(ok(lu))notes+=`<div class="pmut" style="font-style:normal">Letzte Daten vom Auto: ${esc(when(lu.state))}</div>`;
  notes+='<div class="pmut">„Bestätigen“ blendet die Meldung auf der Startseite aus, bis das Teil wieder geschlossen ist oder das Auto wegfährt.</div>';
  const rf=car.refresh&&S(car.refresh)?`<button class="pclose" data-a="press" data-e="${esc(car.refresh)}" data-c="Daten jetzt beim Auto abfragen? Das weckt das Auto auf und verbraucht eine Abfrage bei Audi.">AKTUALISIEREN</button>`:'';
  return `<div class="panel carp" data-carpop="${esc(kind)}"><div class="carhd"><div class="pt">${esc(car.name||'Auto')}</div>${badge}</div><div class="carsub">${esc(sub)}</div><div class="pbody"><div class="cargrid">${this._carSvg(car)}<div>${rows}${all}${tank}</div></div>${notes}</div><div class="carbtns">${rf}<button class="pclose" data-a="popclose">SCHLIESSEN</button></div></div>`;};
C.prototype._carPop=function(kind,keep){const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p)return;if(!sr.getElementById('swcarcss')){const x=document.createElement('style');x.id='swcarcss';x.textContent=CSS;sr.appendChild(x);}
  const h=this._carHtml(kind);if(!h)return;if(keep&&this._carLast===h)return;this._carLast=h;this._popKind=null;const b=p.querySelector('.pbody');const sc=b?b.scrollTop:0;p.innerHTML=h;const nb=p.querySelector('.pbody');if(keep&&nb)nb.scrollTop=sc;p.classList.add('open');};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(/^car\d+$/.test(String(kind)))return this._carPop(kind);return oop.call(this,kind);};

/* Offenes Auto-Popup live aktualisieren */
const ore=C.prototype._render;
C.prototype._render=function(f){const r=ore.call(this,f);try{const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');const m=p&&p.classList.contains('open')&&p.querySelector('[data-carpop]');if(m)this._carPop(m.dataset.carpop,true);}catch(e){}return r;};

/* Klick auf Bestätigen / Wieder melden */
const oc=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a);if(el&&el.dataset.a==='carack'&&this._hass){const d=el.dataset;el.textContent='…';el.style.pointerEvents='none';
    Promise.resolve(this._hass.callService('input_boolean',d.on==='1'?'turn_on':'turn_off',{entity_id:String(d.e).split(',')})).then(()=>setTimeout(()=>this._render(true),400)).catch(e=>{console.warn('Auto bestätigen',e);el.textContent='Fehler';el.style.pointerEvents='';});return;}}
  return oc.call(this,ev);};
});})();
