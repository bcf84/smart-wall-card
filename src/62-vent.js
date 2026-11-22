/* Smart Wall Card – Erweiterung: Lüftungsempfehlung v1.0 (Taupunkt innen/außen je Raum, CO₂, „Fenster zu“; Blase auf der Startseite, Zeile im Heizungs-Popup, Übersichts-Popup) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swVent)return;C.prototype.__swVent=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const de=(n,d)=>(n==null||isNaN(n))?'–':Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const dew=(t,rh)=>{if(t==null||rh==null||isNaN(t)||isNaN(rh)||rh<=0)return NaN;const a=17.62,b=243.12,g=Math.log(rh/100)+a*t/(b+t);return b*g/(a-g);};
const COL={vent:'#4fc3f7',close:'#ff8a50',useless:'rgba(255,255,255,.55)',airing:'#9ccc65',ok:'#9ccc65'};
const TXT={vent:'Lüften empfohlen',close:'Fenster schließen',useless:'Lüften bringt nichts',airing:'Wird gelüftet',ok:'Alles in Ordnung'};
C.prototype._vtCfg=function(){const V=this._cfg.ventilation;if(!V)return null;return Object.assign({humidity:60,humidity_bath:70,dew_diff:2,close_below:50,close_minutes:10,cold_below:10,co2_limit:1000,bath:['bad','badezimmer'],co2:{}},V===true?{}:V);};
C.prototype._vtNum=function(id){if(!id)return NaN;const s=this._st(id);if(!s||['unavailable','unknown',''].includes(s.state))return NaN;return parseFloat(s.state);};
C.prototype._vtOut=function(V){const w=this._st(V.weather||this._cfg.weather);let t=NaN,rh=NaN,dp=NaN;
  if(V.outdoor_temperature)t=this._vtNum(V.outdoor_temperature);if(V.outdoor_humidity)rh=this._vtNum(V.outdoor_humidity);
  if(w){const A=w.attributes||{};if(isNaN(t)&&A.temperature!=null)t=parseFloat(A.temperature);if(isNaN(rh)&&A.humidity!=null)rh=parseFloat(A.humidity);if(A.dew_point!=null&&!V.outdoor_humidity)dp=parseFloat(A.dew_point);}
  if(isNaN(dp))dp=dew(t,rh);return {t,rh,dp};};
/* Bewertung aller Räume aus climates (+ windows) */
C.prototype._vtRooms=function(){const V=this._vtCfg();if(!V)return [];const out=this._vtOut(V);const now=Date.now();const G=this._grp?this._grp(this._cfg.climates):(this._cfg.climates||[]);const W=this._grp?this._grp(this._cfg.windows):(this._cfg.windows||[]);
  const co2m={};Object.entries(V.co2||{}).forEach(([k,v])=>co2m[String(k).toLowerCase()]=v);const bath=(V.bath||[]).map(x=>String(x).toLowerCase());
  return G.map(g=>{const eid=g.entity||(g.entities&&this._eid(g.entities[0]));const s=eid&&this._st(eid);if(!g.room||!s)return null;const A=s.attributes||{};
    let t=this._vtNum(g.temperature);if(isNaN(t))t=parseFloat(A.current_temperature);let rh=this._vtNum(g.humidity);if(isNaN(rh))rh=parseFloat(A.current_humidity);
    const room=String(g.room);const rl=room.toLowerCase();const dpi=dew(t,rh);const co2id=co2m[rl];const co2=this._vtNum(co2id);
    const thr=bath.includes(rl)?V.humidity_bath:V.humidity;
    const win=[];W.forEach(wg=>{if(String(wg.room||'').toLowerCase()!==rl)return;(wg.entities||[]).forEach(e=>{const id=typeof e==='string'?e:e.entity;const ws=this._st(id);if(ws)win.push({id,open:ws.state==='on',since:new Date(ws.last_changed).getTime()});});});
    const open=win.filter(w=>w.open);const openMin=open.length?Math.max(...open.map(w=>(now-w.since)/60000)):0;
    const drier=!isNaN(dpi)&&!isNaN(out.dp)&&dpi-out.dp>=V.dew_diff;const humid=!isNaN(rh)&&rh>=thr;const co2hi=!isNaN(co2)&&co2>=V.co2_limit;
    let st='ok',why='';
    if(open.length){const cold=!isNaN(out.t)&&out.t<V.cold_below;
      if(!isNaN(rh)&&rh<V.close_below&&!co2hi){st='close';why='Feuchte '+de(rh,0)+' %';}
      else if(cold&&openMin>=V.close_minutes){st='close';why=Math.round(openMin)+' min offen';}
      else{st='airing';why=Math.round(openMin)+' min offen';}}
    else if(co2hi){st='vent';why='CO₂ '+de(co2,0)+' ppm';}
    else if(humid){if(drier){st='vent';why='Feuchte '+de(rh,0)+' %';}else{st='useless';why='Luft draußen feuchter';}}
    return {room,eid,t,rh,dpi,co2,co2id,st,why,open:open.length>0,openMin,thr,humidity:g.humidity};}).filter(Boolean);};
/* Startseite: Blase nur bei „Lüften“ oder „Fenster zu“ */
const ohb=C.prototype._homeBubbles;
C.prototype._homeBubbles=function(){let out=ohb.call(this);const V=this._vtCfg();if(!V)return out;const R=this._vtRooms();const cl=R.filter(r=>r.st==='close'),ve=R.filter(r=>r.st==='vent');
  if(cl.length){out+=this._bub(cl.length,'FENSTER ZU',{cap:'Lüften',txt:cl.map(r=>r.room).join(', ').toUpperCase()},COL.close,'pop:vent');}
  else if(ve.length){out+=this._bub(ve.length,ve.length===1?'RAUM':'RÄUME',{cap:'Lüften',txt:ve.map(r=>r.room).join(', ').toUpperCase()},COL.vent,'pop:vent');}
  else if(this._cfg.alerts_test)out+=this._bub(0,'RÄUME',{cap:'Lüften',txt:'ALLES OK'},null,'pop:vent');
  return out;};
/* Übersichts-Popup */
C.prototype._vtBody=function(){const V=this._vtCfg();if(!V)return '';const o=this._vtOut(V);const R=this._vtRooms();
  let h=`<div class="pmut" style="font-style:normal;margin:0 0 12px">Draußen ${de(o.t,1)} °C · Taupunkt ${de(o.dp,1)} °C</div>`;
  h+=R.map(r=>`<div class="prow" data-a="openpop" data-p="heat:${esc(r.eid)}" style="cursor:pointer;align-items:center"><span style="text-transform:none;display:flex;flex-direction:column;gap:2px"><b style="font-weight:600">${esc(r.room)}</b><span style="font-size:12px;opacity:.7;text-transform:none;letter-spacing:.02em">${de(r.t,1)} °C · ${de(r.rh,0)} % · Taupunkt ${de(r.dpi,1)} °C${isNaN(r.co2)?'':' · CO₂ '+de(r.co2,0)+' ppm'}</span></span><span style="text-transform:none;text-align:right;color:${COL[r.st]}">${esc(TXT[r.st])}${r.why&&r.st!=='ok'?`<br><span style="font-size:12px;opacity:.75;text-transform:none;letter-spacing:.02em">${esc(r.why)}</span>`:''}</span></div>`).join('');
  h+=`<div class="pmut">Lüften lohnt, wenn die Feuchte ab ${V.humidity} % (Bad ${V.humidity_bath} %) liegt und der Taupunkt draußen mindestens ${de(V.dew_diff,0)} °C niedriger ist – oder bei CO₂ ab ${V.co2_limit} ppm. Raum antippen für Details.</div>`;
  return `<div class="vstats">${h}</div>`;};
C.prototype._vtRefresh=function(){if(this._popKind!=='vent')return;const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p||!p.classList.contains('open'))return;const b=p.querySelector('.pbody');const nb=this._vtBody();if(b&&b.__vt!==nb){b.innerHTML=nb;b.__vt=nb;}};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){if(String(kind)==='vent'&&this._vtCfg()){const p=this.shadowRoot&&this.shadowRoot.getElementById('swpop');if(!p)return;this._popKind='vent';const body=this._vtBody();
    p.innerHTML=`<div class="panel" style="width:min(560px,100%)"><div class="pt">Lüften</div><div class="pbody" style="max-height:min(72vh,620px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__vt=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
const orr=C.prototype._render;
C.prototype._render=function(f){const r=orr.apply(this,arguments);try{this._vtRefresh();}catch(e){}return r;};
/* Neu zeichnen bei Änderungen an Feuchte, Temperatur, CO₂, Fenstern und Wetter */
const orl=C.prototype._relevant;
C.prototype._relevant=function(){const ids=orl.call(this);const V=this._vtCfg();if(V&&(this._page==='home'||this._popKind==='vent'||String(this._popKind||'').startsWith('heat:'))){const G=this._grp?this._grp(this._cfg.climates):(this._cfg.climates||[]);G.forEach(g=>ids.push(g.entity,g.temperature,g.humidity));Object.values(V.co2||{}).forEach(x=>ids.push(x));ids.push(V.weather||this._cfg.weather,V.outdoor_temperature,V.outdoor_humidity);const W=this._grp?this._grp(this._cfg.windows):(this._cfg.windows||[]);W.forEach(wg=>(wg.entities||[]).forEach(e=>ids.push(typeof e==='string'?e:e.entity)));}return ids.filter(Boolean);};
/* Heizungs-Popup: Zeile „Lüften“ im Abschnitt Raum */
const ohp=C.prototype._hpBody;
if(ohp)C.prototype._hpBody=function(eid){const h=ohp.apply(this,arguments);const V=this._vtCfg();if(!V)return h;const r=this._vtRooms().find(x=>x.eid===eid);if(!r)return h;const o=this._vtOut(V);
  const row=`<div class="prow" data-a="openpop" data-p="vent" style="cursor:pointer"><span>Lüften</span><span style="color:${COL[r.st]};text-transform:none">${esc(TXT[r.st])}</span></div><div class="prow"><span>Taupunkt innen / außen</span><span style="text-transform:none">${de(r.dpi,1)} °C / ${de(o.dp,1)} °C</span></div>`;
  return h.replace('<div class="hpsec">Raum</div><div class="vstats">','<div class="hpsec">Raum</div><div class="vstats">'+row);};
});})();
