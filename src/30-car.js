/* Smart Wall Card – Erweiterung: Auto-Meldungen v1.0 (Startseite: Blase + Popup mit Bestätigen, wie Homematic) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swCar)return;C.prototype.__swCar=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ago=ts=>{if(!ts)return '';const t=new Date(ts).getTime();if(isNaN(t))return '';const m=Math.max(0,Math.round((Date.now()-t)/60000));if(m<1)return 'gerade eben';if(m<60)return 'vor '+m+' min';const h=Math.round(m/60);if(h<48)return 'vor '+h+' h';return 'vor '+Math.round(h/24)+' Tagen';};
const when=ts=>{const d=new Date(ts);return isNaN(d)?'':d.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' Uhr';};

/* Zustand eines Autos: zu Hause? welche Teile offen? welche davon schon bestätigt? */
C.prototype._carState=function(car){const S=id=>id?this._st(id):null;const tr=S(car.tracker);const home=!car.tracker||(!!tr&&tr.state===(car.zone||'home'));
  const items=(car.items||[]).map(it=>{const s=S(it.e);const ak=S(it.ack);return Object.assign({},it,{open:!!s&&s.state==='on',acked:!!ak&&ak.state==='on',det:(it.detail||[]).filter(d=>{const x=S(d.e);return x&&x.state==='on';}).map(d=>d.l)});});
  const open=items.filter(i=>i.open);return {home,open,todo:home?open.filter(i=>!i.acked):[]};};

/* Neu zeichnen, wenn sich Auto-Werte ändern */
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);(this._cfg.car_alerts||[]).forEach(c=>{ids.push(c.tracker,c.last_update);(c.items||[]).forEach(i=>{ids.push(i.e,i.ack);(i.detail||[]).forEach(d=>ids.push(d.e));});});return ids.filter(Boolean);};

/* Blase auf der Startseite */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);(this._cfg.car_alerts||[]).forEach((car,i)=>{const st=this._carState(car);if(!st.todo.length&&!this._cfg.alerts_test)return;
  out+=this._bub(st.todo.length,'OFFEN',{cap:car.name||'Auto',txt:st.todo.length?st.todo.map(x=>x.l).join(', ').toUpperCase():'ALLES ZU'},st.todo.length?'#FF9800':null,'pop:car'+i);});return out;};

/* Popup */
C.prototype._carPop=function(kind){const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');const car=(this._cfg.car_alerts||[])[Number(String(kind).slice(3))];if(!p||!car)return;this._popKind=null;
  const st=this._carState(car);let body='';
  if(!st.open.length)body='<div class="muted">Alles geschlossen.</div>';
  else{body=st.open.map(it=>`<div class="hrow" style="${it.acked?'opacity:.55':''}"><div class="hi">🚗</div><div class="hx"><div class="hk">${esc(it.l)}${it.acked?' · bestätigt':''}</div><div class="ht">${esc(it.det.length?it.det.join(', ')+' offen':'offen')}</div></div>${it.ack&&this._st(it.ack)?(it.acked?`<button class="hack" data-a="carack" data-e="${esc(it.ack)}" data-on="0" data-k="${esc(kind)}">Wieder melden</button>`:`<button class="hack" data-a="carack" data-e="${esc(it.ack)}" data-on="1" data-k="${esc(kind)}">Bestätigen</button>`):''}</div>`).join('');
    const un=st.open.filter(i=>!i.acked&&i.ack);if(un.length>1)body+=`<div style="text-align:right;margin-top:10px"><button class="hack" data-a="carack" data-e="${esc(un.map(i=>i.ack).join(','))}" data-on="1" data-k="${esc(kind)}">Alle bestätigen</button></div>`;}
  if(!st.home&&st.open.length)body+='<div class="pmut">Das Auto ist gerade nicht zu Hause – auf der Startseite wird nur zu Hause gemeldet.</div>';
  const lu=car.last_update&&this._st(car.last_update);if(lu&&!['unknown','unavailable'].includes(lu.state))body+=`<div class="pmut" style="font-style:normal">Letzter Kontakt zum Auto: ${esc(ago(lu.state))} (${esc(when(lu.state))})</div>`;
  body+='<div class="pmut">„Bestätigen“ blendet die Meldung aus, bis das Teil wieder geschlossen ist oder das Auto wegfährt.</div>';
  p.innerHTML=`<div class="panel" data-carpop="${esc(kind)}"><div class="pt">${esc(car.name||'Auto')}</div><div class="pbody">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;p.classList.add('open');};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(/^car\d+$/.test(String(kind)))return this._carPop(kind);return oop.call(this,kind);};

/* Klick auf Bestätigen / Wieder melden */
const oc=C.prototype._onClick;
C.prototype._onClick=function(ev){if(!this._suppressClick){const el=ev.composedPath().find(n=>n.dataset&&n.dataset.a);if(el&&el.dataset.a==='carack'&&this._hass){const d=el.dataset;el.textContent='…';el.style.pointerEvents='none';
    Promise.resolve(this._hass.callService('input_boolean',d.on==='1'?'turn_on':'turn_off',{entity_id:String(d.e).split(',')})).then(()=>setTimeout(()=>{const sr=this.shadowRoot;const pp=sr&&sr.getElementById('swpop');if(pp&&pp.classList.contains('open')&&pp.querySelector('[data-carpop="'+d.k+'"]'))this._carPop(d.k);this._render(true);},400)).catch(e=>{console.warn('Auto bestätigen',e);el.textContent='Fehler';el.style.pointerEvents='';});return;}}
  return oc.call(this,ev);};
});})();
