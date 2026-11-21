/* Smart Wall Card – Erweiterung: Heizungs-Popup v1.0 (Ist/Soll mit −/+, Modus und Presets, 24-h-Verlauf Ist/Soll, Wochenplan aus schedule_data, Feuchte, Fenster, Batterien) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swHeat)return;C.prototype.__swHeat=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const de=(n,d)=>(n==null||isNaN(n))?'–':Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
const MODES={auto:['Automatik','calendar-clock'],heat:['Manuell','hand-back-right-outline'],off:['Aus','power']};
const PRES={boost:['Boost','fire'],comfort:['Komfort','sofa-outline'],eco:['Eco','leaf']};
const WD=[['MONDAY','Mo'],['TUESDAY','Di'],['WEDNESDAY','Mi'],['THURSDAY','Do'],['FRIDAY','Fr'],['SATURDAY','Sa'],['SUNDAY','So']];
const tcol=t=>{if(t==null||isNaN(t))return 'rgba(255,255,255,.1)';if(t<=12)return '#4fc3f7';if(t<=17)return 'rgba(129,212,250,.55)';if(t<=19)return '#ffcc80';if(t<=21)return '#FFA726';return '#FF7043';};
const CSS=`
.hpw{width:min(660px,100%)!important}
.hpw .prow span{text-transform:none}
.hphero{display:flex;align-items:center;gap:22px;margin:14px 0 10px}
.hpring{position:relative;width:132px;height:132px;flex:none}
.hpring svg{width:100%;height:100%;transform:rotate(-90deg)}
.hpring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.hpring .hpbig{font-size:34px;font-weight:300;line-height:1}
.hpring .hpsm{font-size:11px;letter-spacing:.1em;opacity:.75;margin-top:6px}
.hpinfo{flex:1;min-width:0}
.hpinfo .st{font-size:21px;font-weight:300;letter-spacing:.04em}
.hpinfo .su{font-size:13px;opacity:.75;margin-top:4px;line-height:1.45}
.hpctl{display:flex;align-items:center;gap:12px;margin-top:12px}
.hpctl .v{font-size:24px;font-weight:300;min-width:76px;text-align:center}
.hpb{all:unset;cursor:pointer;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.55)}
.hpb ha-icon{--mdc-icon-size:22px}
.hpsec{font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:.6;margin:16px 0 8px}
.hpopts{display:flex;flex-wrap:wrap;gap:6px}
.hpopt{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 15px;border-radius:19px;background:rgba(255,255,255,.1);font-size:12px;letter-spacing:.04em}
.hpopt.on{background:#FFA726;color:#1d2427;font-weight:600}
.hpopt ha-icon{--mdc-icon-size:16px}
.hpg{position:relative;background:rgba(0,0,0,.12);padding:8px 10px 4px}
.hpg svg{display:block;width:100%;height:110px}
.hpg .gl{display:flex;justify-content:space-between;font-size:11px;opacity:.6;margin-top:2px}
.hpg .lg{position:absolute;top:6px;left:10px;font-size:11px;display:flex;gap:12px}
.hpg .lg i{display:inline-block;width:14px;height:3px;vertical-align:middle;margin-right:5px}
.hpg .gx{position:absolute;top:6px;right:10px;font-size:11px;opacity:.6}
.hpg.empty{font-size:12px;opacity:.5;text-align:center;padding:30px 0}
.hpwk{display:grid;grid-template-columns:28px 1fr;gap:5px 8px;align-items:center;font-size:11px}
.hpwk .d{opacity:.7;letter-spacing:.06em}
.hpwk .d.today{opacity:1;font-weight:700}
.hpwk .bar{position:relative;height:20px;display:flex;overflow:hidden;background:rgba(255,255,255,.06)}
.hpwk .bar div{height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;color:#1d2427;font-weight:600;overflow:hidden;white-space:nowrap}
.hpwk .bar .now{position:absolute;top:-2px;bottom:-2px;width:2px;background:#fff;box-shadow:0 0 4px #000}
.hpwk .ax{grid-column:2;display:flex;justify-content:space-between;font-size:10px;opacity:.5}
.hptip{font-size:12px;background:rgba(255,152,0,.18);padding:9px 11px;margin-top:10px;line-height:1.45}
`;
const sty=sr=>{if(sr&&!sr.getElementById('swhpcss')){const x=document.createElement('style');x.id='swhpcss';x.textContent=CSS;sr.appendChild(x);}};
C.prototype._hpCfg=function(eid){return (this._grp?this._grp(this._cfg.climates):(this._cfg.climates||[])).find(g=>(g.entity||(g.entities&&this._eid(g.entities[0])))===eid)||{entity:eid};};
/* Verlauf: Ist aus Temperatursensor (oder Attribut), Soll aus Attribut temperature */
C.prototype._hpHist=function(eid,tsid){this._hpH=this._hpH||{};const k=eid;const c=this._hpH[k];if(c&&(Date.now()-c.t<300000||c.busy))return c.d;const cc=this._hpH[k]=Object.assign(c||{d:null},{busy:true,t:Date.now()});const h=this._hass;if(!h||!h.callWS){cc.busy=false;return cc.d;}
  const start=new Date(Date.now()-24*3600e3).toISOString();const T=x=>x.lu!=null?x.lu*1000:new Date(x.last_updated||x.last_changed).getTime();
  const pA=h.callWS({type:'history/history_during_period',start_time:start,entity_ids:[eid],minimal_response:false,no_attributes:false,significant_changes_only:false});
  const pB=tsid?h.callWS({type:'history/history_during_period',start_time:start,entity_ids:[tsid],minimal_response:true,no_attributes:true,significant_changes_only:false}):Promise.resolve(null);
  Promise.all([pA,pB]).then(([ra,rb])=>{const A=(ra&&ra[eid])||[];let lastA={};const soll=[],ist=[];A.forEach(x=>{const at=x.a||x.attributes||lastA;lastA=at;const t=T(x);if(at.temperature!=null&&x.s!=='off'&&x.state!=='off')soll.push([t,Number(at.temperature)]);else if((x.s||x.state)==='off')soll.push([t,NaN]);if(!tsid&&at.current_temperature!=null)ist.push([t,Number(at.current_temperature)]);});
    if(tsid)((rb&&rb[tsid])||[]).forEach(x=>{const v=parseFloat(x.s!=null?x.s:x.state);if(!isNaN(v))ist.push([T(x),v]);});cc.d={ist,soll};cc.busy=false;this._hpRefresh();}).catch(()=>{cc.d=cc.d||{ist:[],soll:[]};cc.busy=false;this._hpRefresh();});return cc.d;};
const graph=(ist,soll,curI,curS,loading)=>{const now=Date.now(),t0=now-24*3600e3;const I=(ist||[]).filter(p=>p[0]>=t0-3600e3).concat(curI!=null?[[now,curI]]:[]);const S0=(soll||[]);
  if(I.length<2)return `<div class="hpg empty">${loading?'Verlauf lädt …':'Kein Verlauf vorhanden'}</div>`;
  /* Soll als Treppe, beginnend mit dem letzten Wert vor dem Fenster */
  let S=[];let pre=null;S0.forEach(p=>{if(p[0]<t0)pre=p;else S.push(p);});if(pre)S.unshift([t0,pre[1]]);if(curS!=null)S.push([now,curS]);
  const vals=I.map(p=>p[1]).concat(S.map(p=>p[1]).filter(v=>!isNaN(v)));let mn=Math.min(...vals),mx=Math.max(...vals);if(mx-mn<4){const m=(mx+mn)/2;mn=m-2;mx=m+2;}mn=Math.floor(mn-0.5);mx=Math.ceil(mx+0.5);
  const W=600,H=110,P=4;const X=t=>P+(W-2*P)*(Math.max(t0,t)-t0)/(now-t0),Y=v=>H-P-(H-2*P)*(v-mn)/(mx-mn);
  const li=I.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ');
  let ls='';let pen=false;S.forEach((p,i)=>{if(isNaN(p[1])){pen=false;return;}const nx=S[i+1];const x1=X(p[0]),x2=X(nx?nx[0]:now),y=Y(p[1]);ls+=(pen?'L':'M')+x1.toFixed(1)+' '+y.toFixed(1)+' L'+x2.toFixed(1)+' '+y.toFixed(1)+' ';pen=true;});
  const grid=[];for(let v=Math.ceil(mn);v<=mx;v+=((mx-mn)>8?2:1))grid.push(`<line x1="0" x2="${W}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-width="1"/>`);
  return `<div class="hpg"><div class="lg"><span><i style="background:#81d4fa"></i>Ist</span><span><i style="background:#FFA726"></i>Soll</span></div><div class="gx">${de(mn,0)} – ${de(mx,0)} °C</div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid.join('')}<path d="${li} L${X(now).toFixed(1)} ${H} L${X(I[0][0]).toFixed(1)} ${H} Z" fill="#81d4fa" opacity=".12"/><path d="${ls}" fill="none" stroke="#FFA726" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/><path d="${li}" fill="none" stroke="#81d4fa" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="gl"><span>${hm(t0)}</span><span>${hm((t0+now)/2)}</span><span>jetzt</span></div></div>`;};
const week=sd=>{if(!sd||typeof sd!=='object'||!sd.MONDAY)return '';const now=new Date();const tk=WD[(now.getDay()+6)%7][0];const nowPct=(now.getHours()*60+now.getMinutes())/14.4;
  const mins=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+(m||0);};
  const rows=WD.map(([k,l])=>{const d=sd[k];if(!d)return '';const segs=[];let t=0;const P=(d.periods||[]).map(p=>({a:mins(p.starttime),b:mins(p.endtime),v:p.temperature})).sort((x,y)=>x.a-y.a);
    P.forEach(p=>{if(p.a>t)segs.push({a:t,b:p.a,v:d.base_temperature});segs.push(p);t=Math.max(t,p.b);});if(t<1440)segs.push({a:t,b:1440,v:d.base_temperature});
    const bar=segs.filter(s=>s.b>s.a).map(s=>{const w=(s.b-s.a)/14.4;return `<div style="width:${w}%;background:${tcol(s.v)}" title="${String(Math.floor(s.a/60)).padStart(2,'0')}:${String(s.a%60).padStart(2,'0')}–${String(Math.floor(s.b/60)).padStart(2,'0')}:${String(s.b%60).padStart(2,'0')} · ${de(s.v,1)} °C">${w>=7?de(s.v,0)+'°':''}</div>`;}).join('');
    return `<div class="d ${k===tk?'today':''}">${l}</div><div class="bar">${bar}${k===tk?`<div class="now" style="left:${nowPct}%"></div>`:''}</div>`;}).join('');
  return `<div class="hpwk">${rows}<div class="ax"><span>0</span><span>6</span><span>12</span><span>18</span><span>24 Uhr</span></div></div>`;};
C.prototype._hpBody=function(eid){const s=this._st(eid);if(!s)return '<div class="muted">Nicht verfügbar.</div>';const a=s.attributes;const g=this._hpCfg(eid);
  const ts=g.temperature&&this._st(g.temperature);const hs=g.humidity&&this._st(g.humidity);const cur=ts&&!isNaN(parseFloat(ts.state))?parseFloat(ts.state):a.current_temperature;const hum=hs&&!isNaN(parseFloat(hs.state))?parseFloat(hs.state):a.current_humidity;
  const tgt=a.temperature;const off=s.state==='off';const heating=!off&&cur!=null&&tgt!=null&&cur<tgt-0.2;const col=off?'rgba(255,255,255,.4)':(heating?'#FFA726':'#9ccc65');
  const lo=a.min_temp!=null?a.min_temp:5,hi=Math.min(a.max_temp!=null?a.max_temp:30,30);const pct=cur!=null?(cur-lo)/(hi-lo)*100:0;const R=58,Cc=2*Math.PI*R;
  const pm=a.preset_mode;const wp=/^week_program_(\d)/.exec(pm||'');
  const stTxt=off?'Heizung aus':(PRES[pm]?PRES[pm][0]+' aktiv':(heating?'Heizt auf '+de(tgt,1)+' °C':'Temperatur erreicht'));
  const sub=[MODES[s.state]?MODES[s.state][0]:this._tr(s.state),wp?'Wochenprogramm '+wp[1]:'',hum!=null?'Feuchte '+de(hum,0)+' %':''].filter(Boolean).join(' · ');
  let h=`<div class="hphero"><div class="hpring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="66" cy="66" r="${R}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Cc}" stroke-dashoffset="${Cc*(1-Math.max(0,Math.min(100,pct))/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="hpbig">${de(cur,1)}°</div><div class="hpsm">IST</div></div></div>
    <div class="hpinfo"><div class="st" style="color:${col}">${esc(stTxt)}</div><div class="su">${esc(sub)}</div>${off?'':`<div class="hpctl"><button class="hpb" data-a="temp" data-e="${esc(eid)}" data-dir="-1"><ha-icon icon="mdi:minus"></ha-icon></button><div class="v val">${tgt!=null?de(tgt,1)+'°':'–'}</div><button class="hpb" data-a="temp" data-e="${esc(eid)}" data-dir="1"><ha-icon icon="mdi:plus"></ha-icon></button><span style="font-size:11px;opacity:.6;letter-spacing:.1em">SOLL</span></div>`}</div></div>`;
  h+=`<div class="hpsec">Modus</div><div class="hpopts">`+(a.hvac_modes||[]).filter(m=>MODES[m]).map(m=>`<button class="hpopt ${s.state===m?'on':''}" data-a="svc" data-d="climate" data-s="set_hvac_mode" data-e="${esc(eid)}" data-x="${esc(JSON.stringify({hvac_mode:m}))}"><ha-icon icon="mdi:${MODES[m][1]}"></ha-icon>${MODES[m][0]}</button>`).join('')
    +(a.preset_modes||[]).filter(p=>PRES[p]).map(p=>`<button class="hpopt ${pm===p?'on':''}" data-a="svc" data-d="climate" data-s="set_preset_mode" data-e="${esc(eid)}" data-x="${esc(JSON.stringify({preset_mode:pm===p?'none':p}))}"><ha-icon icon="mdi:${PRES[p][1]}"></ha-icon>${PRES[p][0]}</button>`).join('')+'</div>';
  const H=this._hpHist(eid,g.temperature&&ts?g.temperature:null);h+=`<div class="hpsec">Verlauf 24 Stunden</div>`+graph(H&&H.ist,H&&H.soll,cur,off?null:tgt,!H);
  const wk=week(a.schedule_data);if(wk)h+=`<div class="hpsec">Wochenplan${a.current_schedule_profile?' · Profil '+esc(a.current_schedule_profile):''}</div>`+wk;
  /* Fenster im Raum */
  const room=String(g.room||'').toLowerCase();const win=[];(this._grp?this._grp(this._cfg.windows):(this._cfg.windows||[])).forEach(wg=>{if(String(wg.room||'').toLowerCase()!==room)return;(wg.entities||[]).forEach(e=>{const id=typeof e==='string'?e:e.entity;const ws=this._st(id);if(ws)win.push({n:(typeof e==='object'&&e.name)||this._nm(id),open:ws.state==='on',id});});});
  const bat=room?(this._lowBatteries?this._lowBatteries(10):[]).filter(x=>x.kind==='heat'&&String(x.room||'').toLowerCase()===room):[];
  const rows=[];if(hum!=null)rows.push(`<div class="prow"${g.humidity?` data-a="more" data-e="${esc(g.humidity)}" style="cursor:pointer"`:''}><span>Luftfeuchte</span><span${hum>65?' style="color:#FF9800"':''}>${de(hum,0)} %</span></div>`);
  win.forEach(w=>rows.push(`<div class="prow" data-a="more" data-e="${esc(w.id)}" style="cursor:pointer"><span>Fenster ${esc(w.n)}</span><span${w.open?' style="color:#FF9800"':''}>${w.open?'offen':'zu'}</span></div>`));
  rows.push(`<div class="prow"><span>Batterien Thermostate</span><span${bat.length?' style="color:#FF9800"':''}>${bat.length?esc(bat.map(x=>x.n).join(', '))+' leer':'OK'}</span></div>`);
  h+=`<div class="hpsec">Raum</div><div class="vstats">${rows.join('')}</div>`;
  if(win.some(w=>w.open)&&!off)h+=`<div class="hptip">Fenster offen – die Heizung regelt meist erst nach dem Schließen wieder normal.</div>`;
  return h;};
C.prototype._hpRefresh=function(){const k=String(this._popKind||'');if(!k.startsWith('heat:'))return;const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p||!p.classList.contains('open'))return;const b=p.querySelector('.pbody');const nb=this._hpBody(k.slice(5));if(b&&b.__hp!==nb){const sc=b.scrollTop;b.innerHTML=nb;b.__hp=nb;b.scrollTop=sc;try{this._tpApply&&this._tpApply();}catch(e){}}};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){const k=String(kind);if(k.startsWith('heat:')){const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p)return;sty(sr);this._popKind=k;const eid=k.slice(5);const g=this._hpCfg(eid);const s=this._st(eid);
    const title=g.room?(g.name?g.room+' · '+g.name:g.room):((s&&s.attributes.friendly_name)||eid).replace(/^Heizung\s+/,'');const body=this._hpBody(eid);
    p.innerHTML=`<div class="panel hpw"><div class="pt">Heizung · ${esc(title)}</div><div class="pbody" style="max-height:min(74vh,660px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__hp=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
const orr=C.prototype._render;
C.prototype._render=function(f){const r=orr.apply(this,arguments);try{this._hpRefresh();}catch(e){}return r;};
/* Raumname und Ist-Temperatur öffnen das Popup */
const opc=C.prototype._pClimate;
C.prototype._pClimate=function(){const h=opc.apply(this,arguments);if(this._cfg.heat_popup===false)return h;
  return h.replace(/cursor:pointer" data-a="more" data-e="(climate\.[a-z0-9_]+)">([\s\S]*?)<div class="cur">/g,(m,id,mid)=>`cursor:pointer" data-a="openpop" data-p="heat:${id}">${mid}<div class="cur" data-a="openpop" data-p="heat:${id}" style="cursor:pointer">`);};
});})();
