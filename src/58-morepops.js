/* Smart Wall Card – Erweiterung: weitere Popups v1.0 (Raumluft/Luftreiniger, Drucker, Waage, Server, Wetter – mit Verläufen aus dem Recorder) */
(function(){customElements.whenDefined('smart-wall-card').then(()=>{const C=customElements.get('smart-wall-card');if(!C||C.prototype.__swMore)return;C.prototype.__swMore=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=s=>{if(!s||['unavailable','unknown',''].includes(s.state))return NaN;return parseFloat(s.state);};
const de=(n,d)=>isNaN(n)?'–':Number(n).toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');};
const DAYS=['So','Mo','Di','Mi','Do','Fr','Sa'];
const WI={'clear-night':'weather-night','cloudy':'weather-cloudy','exceptional':'alert-circle-outline','fog':'weather-fog','hail':'weather-hail','lightning':'weather-lightning','lightning-rainy':'weather-lightning-rainy','partlycloudy':'weather-partly-cloudy','pouring':'weather-pouring','rainy':'weather-rainy','snowy':'weather-snowy','snowy-rainy':'weather-snowy-rainy','sunny':'weather-sunny','windy':'weather-windy','windy-variant':'weather-windy-variant'};
const WT={'clear-night':'Klar','cloudy':'Bewölkt','exceptional':'Unwetter','fog':'Nebel','hail':'Hagel','lightning':'Gewitter','lightning-rainy':'Gewitter mit Regen','partlycloudy':'Teils bewölkt','pouring':'Starkregen','rainy':'Regen','snowy':'Schnee','snowy-rainy':'Schneeregen','sunny':'Sonnig','windy':'Windig','windy-variant':'Windig, bewölkt'};
const PM={auto:'Auto',medium:'Mittel',turbo:'Turbo',sleep:'Schlaf',night:'Nacht',allergen:'Allergie',low:'Niedrig',high:'Hoch'};
const CSS=`
.mpw{width:min(640px,100%)!important}
.mpw .prow span{text-transform:none}
.mphero{display:flex;align-items:center;gap:22px;margin:14px 0 12px}
.mpring{position:relative;width:124px;height:124px;flex:none}
.mpring svg{width:100%;height:100%;transform:rotate(-90deg)}
.mpring .in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.mpring .mpbig{font-size:30px;font-weight:300;letter-spacing:.03em;line-height:1}
.mpring .mpsm{font-size:11px;letter-spacing:.12em;opacity:.7;margin-top:6px}
.mpinfo{flex:1;min-width:0}
.mpinfo .st{font-size:21px;font-weight:300;letter-spacing:.04em}
.mpinfo .su{font-size:13px;opacity:.75;margin-top:4px;line-height:1.4}
.mpsec{font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;opacity:.6;margin:16px 0 8px}
.mpopts{display:flex;flex-wrap:wrap;gap:6px}
.mpopt{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 15px;border-radius:19px;background:rgba(255,255,255,.1);font-size:12px;letter-spacing:.04em}
.mpopt.on{background:#9ccc65;color:#1d2427;font-weight:600}
.mpopt.warn{background:rgba(244,67,54,.25)}
.mpopt ha-icon{--mdc-icon-size:16px}
.mpg{position:relative;background:rgba(0,0,0,.12);padding:8px 10px 4px}
.mpg svg{display:block;width:100%;height:96px}
.mpg .gl{display:flex;justify-content:space-between;font-size:11px;opacity:.6;margin-top:2px}
.mpg .gt{position:absolute;top:6px;left:10px;font-size:11px;opacity:.75;letter-spacing:.06em}
.mpg .gx{position:absolute;top:6px;right:10px;font-size:11px;opacity:.6}
.mpg.empty{font-size:12px;opacity:.5;text-align:center;padding:26px 0}
.mpink{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:6px}
.mpink .c{text-align:center}
.mpink .b{height:84px;background:rgba(255,255,255,.1);position:relative;overflow:hidden}
.mpink .b div{position:absolute;left:0;right:0;bottom:0}
.mpink .l{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75;margin-top:6px}
.mpink .v{font-size:15px;font-weight:600;margin-top:2px}
.mpdays{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.mpday{background:rgba(255,255,255,.07);padding:9px 2px 8px;text-align:center;font-size:12px}
.mpday ha-icon{--mdc-icon-size:26px;margin:5px 0 3px;display:block}
.mpday .mx{font-size:15px;font-weight:600}
.mpday .mn{opacity:.6}
.mpday .pr{font-size:11px;color:#81d4fa;margin-top:4px;min-height:14px}
.mphours{display:flex;gap:4px;overflow-x:auto;padding-bottom:4px}
.mphour{flex:0 0 56px;background:rgba(255,255,255,.07);padding:7px 0 6px;text-align:center;font-size:11px}
.mphour ha-icon{--mdc-icon-size:20px;display:block;margin:4px auto 2px}
.mphour .t{font-size:13px;font-weight:600}
.mphour .pr{color:#81d4fa;min-height:13px}
.mpbtns{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.mptip{font-size:12px;opacity:.8;background:rgba(255,255,255,.07);padding:9px 11px;margin-top:10px;line-height:1.45}
`;
const sty=(sr)=>{if(sr&&!sr.getElementById('swmpcss')){const x=document.createElement('style');x.id='swmpcss';x.textContent=CSS;sr.appendChild(x);}};
const ring=(pct,col,big,sm)=>{const R=54,Cc=2*Math.PI*R;const p=Math.max(0,Math.min(100,pct||0));return `<div class="mpring"><svg viewBox="0 0 124 124"><circle cx="62" cy="62" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="8"/><circle cx="62" cy="62" r="${R}" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Cc}" stroke-dashoffset="${Cc*(1-p/100)}" style="transition:stroke-dashoffset .6s"/></svg><div class="in"><div class="mpbig">${big}</div><div class="mpsm">${esc(sm||'')}</div></div></div>`;};
/* Bewertung nach Einheit: CO2 (ppm) und Feinstaub (µg/m³) */
const ulab=(u,fb)=>/ppm/i.test(String(u||''))?'CO₂':(/g\/m|µg|μg/i.test(String(u||''))?'Feinstaub PM2,5':fb);
const rate=(v,u)=>{u=String(u||'');if(isNaN(v))return {t:'–',c:'rgba(255,255,255,.45)',p:0};
  if(/ppm/i.test(u)){if(v<800)return {t:'Gut',c:'#9ccc65',p:v/20};if(v<1000)return {t:'Okay',c:'#d4e157',p:v/20};if(v<1400)return {t:'Lüften empfohlen',c:'#FFB300',p:v/20};return {t:'Schlecht – lüften',c:'#F44336',p:Math.min(100,v/20)};}
  if(/g\/m|µg|μg/i.test(u)){if(v<=5)return {t:'Sehr gut',c:'#9ccc65',p:v*2};if(v<=15)return {t:'Gut',c:'#d4e157',p:v*2};if(v<=25)return {t:'Mäßig',c:'#FFB300',p:v*2};return {t:'Schlecht',c:'#F44336',p:Math.min(100,v*2)};}
  return {t:'',c:'#81d4fa',p:50};};
/* Verlauf als SVG */
const graph=(pts,o)=>{o=o||{};if(!pts||pts.length<2)return `<div class="mpg empty">${o.loading?'Verlauf lädt …':'Kein Verlauf vorhanden'}</div>`;
  const W=600,H=96,P=4;const t0=pts[0][0],t1=pts[pts.length-1][0];let mn=Math.min(...pts.map(p=>p[1])),mx=Math.max(...pts.map(p=>p[1]));if(o.min!=null)mn=Math.min(mn,o.min);if(mx-mn<(o.span||1)){const m=(mx+mn)/2;mn=m-(o.span||1)/2;mx=m+(o.span||1)/2;}
  const X=t=>P+(W-2*P)*(t-t0)/Math.max(1,t1-t0),Y=v=>H-P-(H-2*P)*(v-mn)/(mx-mn);
  const line=pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ');const col=o.color||'#81d4fa';
  const th=(o.lines||[]).filter(v=>v>mn&&v<mx).map(v=>`<line x1="0" x2="${W}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.25)" stroke-dasharray="4 4" stroke-width="1"/>`).join('');
  const lab=o.days?(t=>{const d=new Date(t);return d.getDate()+'.'+(d.getMonth()+1)+'.';}):hm;
  const f=v=>de(v,o.d!=null?o.d:(mx-mn<10?1:0));
  return `<div class="mpg"><div class="gt">${esc(o.title||'')}</div><div class="gx">${f(mn)} – ${f(mx)} ${esc(o.unit||'')}</div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${th}<path d="${line} L${X(t1).toFixed(1)} ${H} L${X(t0).toFixed(1)} ${H} Z" fill="${col}" opacity=".14"/><path d="${line}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg><div class="gl"><span>${lab(t0)}</span><span>${lab((t0+t1)/2)}</span><span>${o.nowLabel||lab(t1)}</span></div></div>`;};
/* Daten holen (Verlauf 24 h/7 d, Statistik für lange Zeiträume) – mit Zwischenspeicher */
C.prototype._mpHist=function(ids,hours,key){this._mpH=this._mpH||{};const k=key||(ids.join(',')+'|'+hours);const c=this._mpH[k];if(c&&(Date.now()-c.t<300000||c.busy))return c.d;
  const cc=this._mpH[k]=Object.assign(c||{d:null},{busy:true,t:Date.now()});const h=this._hass;if(!h||!h.callWS){cc.busy=false;return cc.d;}
  h.callWS({type:'history/history_during_period',start_time:new Date(Date.now()-hours*3600e3).toISOString(),entity_ids:ids,minimal_response:true,no_attributes:true,significant_changes_only:false}).then(r=>{const out={};ids.forEach(id=>{let last=null;out[id]=(r&&r[id]||[]).map(x=>{const t=x.lu!=null?x.lu*1000:(x.last_updated?new Date(x.last_updated).getTime():(x.last_changed?new Date(x.last_changed).getTime():null));if(t!=null)last=t;return [t!=null?t:last,parseFloat(x.s!=null?x.s:x.state)];}).filter(p=>p[0]!=null&&!isNaN(p[1]));});cc.d=out;cc.busy=false;this._mpRefresh(true);}).catch(()=>{cc.d=cc.d||{};cc.busy=false;this._mpRefresh(true);});return cc.d;};
C.prototype._mpStat=function(ids,days){this._mpH=this._mpH||{};const k='stat|'+ids.join(',')+'|'+days;const c=this._mpH[k];if(c&&(Date.now()-c.t<600000||c.busy))return c.d;
  const cc=this._mpH[k]=Object.assign(c||{d:null},{busy:true,t:Date.now()});const h=this._hass;if(!h||!h.callWS){cc.busy=false;return cc.d;}
  h.callWS({type:'recorder/statistics_during_period',start_time:new Date(Date.now()-days*864e5).toISOString(),statistic_ids:ids,period:'day',types:['mean']}).then(r=>{const out={};ids.forEach(id=>{out[id]=(r&&r[id]||[]).map(x=>[typeof x.start==='number'?x.start:new Date(x.start).getTime(),x.mean]).filter(p=>p[1]!=null&&!isNaN(p[1]));});cc.d=out;cc.busy=false;this._mpRefresh(true);}).catch(()=>{cc.d=cc.d||{};cc.busy=false;this._mpRefresh(true);});return cc.d;};
/* Wetter: stündliche Vorhersage abonnieren, solange das Popup offen ist */
C.prototype._mpHourly=function(eid){if(this._mpHrSub&&this._mpHrSub.e===eid)return this._mpHrSub.d;this._mpHrUnsub();const s={e:eid,d:null,u:null};this._mpHrSub=s;const h=this._hass;
  try{h.connection.subscribeMessage(m=>{s.d=m&&m.forecast||[];this._mpRefresh(true);},{type:'weather/subscribe_forecast',forecast_type:'hourly',entity_id:eid}).then(u=>{if(this._mpHrSub===s)s.u=u;else try{u();}catch(e){}}).catch(()=>{s.d=[];});}catch(e){s.d=[];}return null;};
C.prototype._mpHrUnsub=function(){const s=this._mpHrSub;this._mpHrSub=null;if(s&&s.u)try{s.u();}catch(e){}};
const appCard=(self,kind)=>{const m=/^(aq|srv):(\d+)$/.exec(kind);if(!m)return null;const L=m[1]==='aq'?self._cfg.airquality:self._cfg.servers;return (L||[])[Number(m[2])]||null;};
/* --- Popup-Inhalte --- */
C.prototype._mpAir=function(a){const st=id=>id?this._st(id):null;const P=a.popup||{};const val=st(a.value);const v=num(val);const u=val&&val.attributes.unit_of_measurement||'';const r=rate(v,u);
  const pw=st(a.power);const on=pw&&['on','auto','manual','sleep'].includes(pw.state);const fp=st(a.preset);
  const big=isNaN(v)?'–':(v>=100?Math.round(v):de(v,v%1?1:0));
  let h=`<div class="mphero">${ring(r.p,r.c,esc(big),u)}<div class="mpinfo"><div class="st" style="color:${r.c}">${esc(r.t)}</div><div class="su">${pw?esc((on?'Luftreiniger an':'Luftreiniger aus')+(on&&fp&&fp.attributes.preset_mode?' · '+(PM[fp.attributes.preset_mode]||fp.attributes.preset_mode):'')):esc(ulab(u,this._nm(a.value)))}${val?' · seit '+esc(swAgo(val.last_changed).replace(/^vor /,'')):''}</div></div></div>`;
  if(pw||fp){h+=`<div class="mpsec">Steuerung</div><div class="mpopts">`;if(pw)h+=`<button class="mpopt ${on?'on':''}" data-a="toggle" data-e="${esc(a.power)}"><ha-icon icon="mdi:power"></ha-icon>${on?'An':'Aus'}</button>`;
    if(fp)(fp.attributes.preset_modes||[]).forEach(o=>{h+=`<button class="mpopt ${on&&fp.attributes.preset_mode===o?'on':''}" data-a="svc" data-d="fan" data-s="set_preset_mode" data-e="${esc(a.preset)}" data-x="${esc(JSON.stringify({preset_mode:o}))}">${esc(PM[o]||o)}</button>`;});h+='</div>';}
  const gids=(P.graphs||[a.value]).filter(id=>st(id));const H=this._mpHist(gids,24);
  h+=`<div class="mpsec">Verlauf 24 Stunden</div>`+gids.map(id=>{const s=st(id);const uu=s.attributes.unit_of_measurement||'';const pp=H&&H[id];const lines=/ppm/i.test(uu)?[1000,1400]:(/g\/m|µg|μg/i.test(uu)?[15,25]:[]);return graph(pp&&pp.length?pp.concat([[Date.now(),num(s)]].filter(p=>!isNaN(p[1]))):null,{title:P.graph_names&&P.graph_names[id]||ulab(uu,this._nm(id)),unit:uu,color:rate(num(s),uu).c,lines,loading:!H,nowLabel:'jetzt'});}).join('<div style="height:6px"></div>');
  const rows=(P.rows||(a.info||[]).map(c=>c.e)).map(e=>typeof e==='string'?{e}:e).filter(c=>st(c.e));
  if(rows.length){h+=`<div class="mpsec">Werte</div><div class="vstats">`+rows.map(c=>{const s=st(c.e);const lab=c.l||((a.info||[]).find(x=>x.e===c.e)||{}).l||this._nm(c.e);const uu=s.attributes.unit_of_measurement||'';let tv=s.state;const n=parseFloat(tv);if(!isNaN(n))tv=de(n,n%1&&Math.abs(n)<100?1:0)+(uu?' '+uu:'');else tv=({good:'Gut',fair:'Mittel',poor:'Schlecht',very_poor:'Sehr schlecht',extremely_poor:'Extrem schlecht',moderate:'Mäßig',excellent:'Sehr gut'})[tv]||tv;const low=/%/.test(uu)&&!isNaN(n)&&n<10&&/filter/i.test(c.e);return `<div class="prow" data-a="more" data-e="${esc(c.e)}" style="cursor:pointer"><span>${esc(lab)}</span><span${low?' style="color:#FF9800"':''}>${esc(tv)}</span></div>`;}).join('')+'</div>';}
  if(/ppm/i.test(u)&&v>=1000)h+=`<div class="mptip">Tipp: 5–10 Minuten querlüften senkt den CO₂-Wert meist unter 800 ppm.</div>`;
  return h;};
const PR={'none':'Alles in Ordnung','marker-supply-low-warning':'Tinte bald leer','marker-supply-empty-error':'Tinte leer','marker-supply-missing-error':'Patrone fehlt','media-empty-error':'Papier leer','media-empty-warning':'Papier fast leer','media-low-warning':'Papier fast leer','media-needed':'Papier einlegen','media-jam-error':'Papierstau','media-jam-warning':'Papierstau','cover-open-error':'Abdeckung offen','door-open-error':'Klappe offen','input-tray-missing-error':'Papierfach fehlt','output-area-full-warning':'Ausgabefach voll','paused':'Angehalten','offline-report':'Offline','other-warning':'Warnung','other-error':'Fehler','marker-waste-almost-full-warning':'Resttintenbehälter fast voll','marker-waste-full-error':'Resttintenbehälter voll'};
const INKCOL={schwarz:'#d0d0d0',black:'#d0d0d0',cyan:'#00BCD4',magenta:'#E91E63',gelb:'#FFC107',yellow:'#FFC107'};
C.prototype._mpPrinter=function(a,P){const st=id=>id?this._st(id):null;const s=st(a.status);const off=!s||['unavailable','unknown'].includes(s.state);
  const inks=(a.info||[]).filter(c=>c.warn_below!=null||/%/.test((st(c.e)||{attributes:{}}).attributes.unit_of_measurement||''));
  const H=off?this._mpHist(inks.map(c=>c.e),24*7,'ink7'):null;const lastK=id=>{const p=H&&H[id];return p&&p.length?p[p.length-1][1]:NaN;};
  const reason=s&&s.attributes.state_reason;const stTxt=off?'Aus / nicht erreichbar':(({idle:'Bereit',printing:'Druckt',stopped:'Gestoppt'})[s.state]||s.state);
  const rTxt=reason&&reason!=='none'?(PR[reason]||PR[String(reason).replace(/-report$/,'')]||String(reason).replace(/-/g,' ')):'';
  let h=`<div class="mphero" style="margin-bottom:4px"><ha-icon icon="${esc(a.icon||'mdi:printer')}" style="--mdc-icon-size:54px;opacity:.85"></ha-icon><div class="mpinfo"><div class="st">${esc(stTxt)}</div><div class="su">${rTxt?`<span style="color:#FF9800">${esc(rTxt)}</span> · `:''}${s?esc(swAgo(s.last_changed)):''}</div></div></div>`;
  h+=`<div class="mpsec">Tinte${off?' (zuletzt bekannt)':''}</div><div class="mpink">`+inks.map(c=>{let v=num(st(c.e));if(isNaN(v))v=lastK(c.e);const col=INKCOL[String(c.l||'').toLowerCase()]||'#9ccc65';const low=!isNaN(v)&&c.warn_below!=null&&v<c.warn_below;return `<div class="c" data-a="more" data-e="${esc(c.e)}" style="cursor:pointer"><div class="b"><div style="height:${isNaN(v)?0:Math.max(2,Math.min(100,v))}%;background:${col}"></div></div><div class="l">${esc(c.l||this._nm(c.e))}</div><div class="v"${low?' style="color:#FF9800"':''}>${isNaN(v)?'–':Math.round(v)+' %'}</div></div>`;}).join('')+`</div>`;
  const rows=(P.rows||[]).filter(c=>st(c.e));if(rows.length)h+=`<div class="mpsec">Zähler</div><div class="vstats">`+rows.map(c=>{const sv=st(c.e);const n=num(sv);return `<div class="prow" data-a="more" data-e="${esc(c.e)}" style="cursor:pointer"><span>${esc(c.l)}</span><span>${isNaN(n)?(off?'–':esc(sv.state)):de(n,0)+(c.u?' '+esc(c.u):'')}</span></div>`;}).join('')+'</div>';
  if(off)h+=`<div class="mptip">Der Drucker ist aus. Tinte und Zähler zeigen die zuletzt gemeldeten Werte, sobald ein Verlauf vorhanden ist.</div>`;
  return h;};
C.prototype._mpScale=function(a,P){const st=id=>id?this._st(id):null;const wid=P.weight||a.value;const w=st(wid);const v=num(w);const u=w&&w.attributes.unit_of_measurement||'kg';
  const S=this._mpStat([wid,...(P.rows||[]).map(c=>c.e)],P.days||90);const ws=S&&S[wid]||[];
  const back=d=>{const t=Date.now()-d*864e5;let b=null;ws.forEach(p=>{if(p[0]<=t)b=p;});return b?b[1]:NaN;};const d7=v-back(7),d30=v-back(30);
  const dtx=(d,l)=>isNaN(d)?'':`<span style="color:${Math.abs(d)<0.05?'inherit':(d<0?'#9ccc65':'#FFB300')}">${d>0?'+':''}${de(d,1)} ${esc(u)}</span> ${l}`;
  const last=st(P.last);let h=`<div class="mphero">${ring(70,'#81d4fa',esc(de(v,1)),u)}<div class="mpinfo"><div class="st">${esc(a.status&&st(a.status)&&st(a.status).state==='on'?'Wartet auf Waage …':(P.person||'Gewicht'))}</div><div class="su">${last&&last.state&&!['unknown','unavailable'].includes(last.state)?'Gemessen '+esc(swAgo(last.state))+'<br>':''}${[dtx(d7,'in 7 Tagen'),dtx(d30,'in 30 Tagen')].filter(Boolean).join(' · ')}</div></div></div>`;
  h+=`<div class="mpsec">Gewicht ${P.days||90} Tage</div>`+graph(ws.length?ws.concat(isNaN(v)?[]:[[Date.now(),v]]):null,{title:'Tagesmittel',unit:u,d:1,days:true,span:1,loading:!S,nowLabel:'heute'});
  const rows=(P.rows||[]).filter(c=>st(c.e));if(rows.length)h+=`<div class="mpsec">Körperwerte</div><div class="vstats">`+rows.map(c=>{const s=st(c.e);const n=num(s);const uu=s.attributes.unit_of_measurement||'';const sp=S&&S[c.e]||[];let b=null;const t=Date.now()-30*864e5;sp.forEach(p=>{if(p[0]<=t)b=p;});const dd=b&&!isNaN(n)?n-b[1]:NaN;return `<div class="prow" data-a="more" data-e="${esc(c.e)}" style="cursor:pointer"><span>${esc(c.l)}</span><span>${esc(de(n,1))}${uu?' '+esc(uu):''}${isNaN(dd)?'':` <span style="opacity:.6;font-size:12px">(${dd>0?'+':''}${de(dd,1)} / 30 T)</span>`}</span></div>`;}).join('')+'</div>';
  if(a.actions&&a.actions.length)h+=`<div class="mpbtns" style="margin-top:12px">`+a.actions.map(x=>x.button?`<button class="mpopt" data-a="press" data-e="${esc(x.button)}"><ha-icon icon="mdi:${esc(x.icon||'gesture-tap')}"></ha-icon>${esc(x.label)}</button>`:'').join('')+'</div>';
  return h;};
C.prototype._mpServer=function(a){const st=id=>id?this._st(id):null;const s=st(a.status);const SMo=a.status_map;const sm=typeof SMo==='string'?SMo.split('|'):null;const okS=s&&!['off','unavailable','unknown','offline','OB','LB'].some(x=>String(s.state).indexOf(x)===0);
  const cpu=st(a.value);const cv=num(cpu);const ramC=(a.info||[]).find(c=>/^RAM$/i.test(c.l||''));const ram=ramC&&st(ramC.e);const rv=num(ram);
  const cap=x=>String(x).charAt(0).toUpperCase()+String(x).slice(1);const stTxt0=!s?'–':(sm&&sm.length===2?(s.state==='on'?sm[0]:sm[1]):((SMo&&typeof SMo==='object'&&SMo[s.state])||({on:'Online',off:'Offline',unavailable:'Nicht erreichbar'})[s.state]||s.state));const stTxt=cap(stTxt0);
  const cu=cpu&&cpu.attributes.unit_of_measurement||'%';const isPct=/%/.test(cu);
  let h=`<div class="mphero">${ring(isPct?cv:60,isNaN(cv)?'rgba(255,255,255,.45)':(isPct&&cv>85?'#F44336':isPct&&cv>60?'#FFB300':'#9ccc65'),esc(isNaN(cv)?'–':de(cv,isPct?0:1)),isPct?'CPU %':cu)}<div class="mpinfo"><div class="st" style="color:${okS?'#9ccc65':'#F44336'}">${esc(stTxt)}</div><div class="su">${!isNaN(rv)?'RAM '+de(rv,0)+' %':''}${s?(isNaN(rv)?'':' · ')+esc(swAgo(s.last_changed)):''}</div></div></div>`;
  const gids=[a.value,ramC&&ramC.e].filter(id=>id&&st(id)&&!isNaN(num(st(id))));const H=this._mpHist(gids,24);
  if(gids.length)h+=`<div class="mpsec">Verlauf 24 Stunden</div>`+gids.map(id=>{const sv=st(id);const uu=sv.attributes.unit_of_measurement||'';const pp=H&&H[id];return graph(pp&&pp.length?pp.concat([[Date.now(),num(sv)]]):null,{title:id===a.value?(isPct?'CPU':this._nm(id)):'RAM',unit:uu,color:id===a.value?'#81d4fa':'#ce93d8',min:id===a.value&&/%/.test(uu)?0:null,span:/%/.test(uu)?10:1,loading:!H,nowLabel:'jetzt'});}).join('<div style="height:6px"></div>');
  const rows=(a.info||[]).filter(c=>c!==ramC&&st(c.e));if(rows.length)h+=`<div class="mpsec">Details</div><div class="vstats">`+rows.map(c=>{const sv=st(c.e);let tv=sv.state;if(c.map){if(typeof c.map==='object'){if(c.map[tv]!=null)tv=c.map[tv];}else{const mm=String(c.map).split('|');if(['on','off'].includes(tv)&&mm.length===2)tv=tv==='on'?mm[0]:mm[1];}}else{const n=parseFloat(tv);const uu=sv.attributes.unit_of_measurement||'';if(sv.attributes.device_class==='timestamp')tv=swAgo(tv).replace(/^vor /,'');else if(!isNaN(n)&&/^-?[\d.]+$/.test(tv))tv=de(n,n%1&&Math.abs(n)<100?1:0)+(uu?' '+uu:'');}
    const n=parseFloat(sv.state);const warn=(c.warn||[]).includes(sv.state)||(c.warn_above!=null&&n>c.warn_above);return `<div class="prow" data-a="more" data-e="${esc(c.e)}" style="cursor:pointer"><span>${esc(c.l)}</span><span${warn?' style="color:#FF9800"':''}>${esc(tv)}</span></div>`;}).join('')+'</div>';
  if(a.actions&&a.actions.length)h+=`<div class="mpsec">Aktionen</div><div class="mpbtns">`+a.actions.map(x=>{const cf=x.confirm?` data-c="${esc(x.confirm)}"`:'';const warn=/stop|shutdown|reboot|herunter/i.test((x.label||'')+(x.icon||''))?' warn':'';
    if(x.button)return `<button class="mpopt${warn}" data-a="press" data-e="${esc(x.button)}"${cf}><ha-icon icon="mdi:${esc(x.icon||'gesture-tap')}"></ha-icon>${esc(x.label)}</button>`;if(x.service)return `<button class="mpopt${warn}" data-a="svc" data-d="${esc(x.service.split('.')[0])}" data-s="${esc(x.service.split('.')[1])}" data-e="${esc(x.entity||'')}"${x.data?` data-x="${esc(JSON.stringify(x.data))}"`:''}${cf}><ha-icon icon="mdi:${esc(x.icon||'gesture-tap')}"></ha-icon>${esc(x.label)}</button>`;return '';}).join('')+'</div>';
  return h;};
C.prototype._mpWeather=function(){const eid=this._cfg.weather;const w=this._st(eid);if(!w)return '<div class="muted">Kein Wetter konfiguriert.</div>';const A=w.attributes;
  const fc=(this._forecast||[]).slice(0,7);const today=fc[0];const hr=this._mpHourly(eid);
  const bits=[A.humidity!=null?'Feuchte '+Math.round(A.humidity)+' %':'',A.wind_speed!=null?'Wind '+Math.round(A.wind_speed)+(A.wind_gust_speed?'–'+Math.round(A.wind_gust_speed):'')+' '+(A.wind_speed_unit||'km/h'):'',A.pressure!=null?Math.round(A.pressure)+' '+(A.pressure_unit||'hPa'):'',A.cloud_coverage!=null?'Wolken '+Math.round(A.cloud_coverage)+' %':''].filter(Boolean);
  let h=`<div class="mphero"><ha-icon icon="mdi:${WI[w.state]||'weather-cloudy'}" style="--mdc-icon-size:76px"></ha-icon><div style="font-size:52px;font-weight:200;line-height:1">${A.temperature!=null?de(A.temperature,A.temperature%1?1:0)+'°':''}</div><div class="mpinfo"><div class="st">${esc(WT[w.state]||w.state)}</div><div class="su">${today&&today.temperature!=null?'Heute '+Math.round(today.temperature)+'° / '+(today.templow!=null?Math.round(today.templow)+'°':'–'):''}${bits.length?'<br>'+esc(bits.join(' · ')):''}</div></div></div>`;
  const hs=(hr||[]).filter(f=>new Date(f.datetime).getTime()>Date.now()-3600e3).slice(0,24);
  h+=`<div class="mpsec">Nächste Stunden</div>`+(hs.length?`<div class="mphours">`+hs.map(f=>{const d=new Date(f.datetime);const pr=f.precipitation_probability!=null&&f.precipitation_probability>=20?Math.round(f.precipitation_probability)+' %':(f.precipitation>0?de(f.precipitation,1)+' mm':'');return `<div class="mphour"><div>${String(d.getHours()).padStart(2,'0')} Uhr</div><ha-icon icon="mdi:${WI[f.condition]||'weather-cloudy'}"></ha-icon><div class="t">${Math.round(f.temperature)}°</div><div class="pr">${esc(pr)}</div></div>`;}).join('')+'</div>':`<div class="mpg empty">${hr?'Keine stündliche Vorhersage':'Lädt …'}</div>`);
  h+=`<div class="mpsec">7 Tage</div><div class="mpdays">`+fc.map((f,i)=>{const d=new Date(f.datetime);const pr=f.precipitation>0?de(f.precipitation,1)+' mm':(f.precipitation_probability>=20?Math.round(f.precipitation_probability)+' %':'');return `<div class="mpday"><div>${i===0?'Heute':DAYS[d.getDay()]}</div><ha-icon icon="mdi:${WI[f.condition]||'weather-cloudy'}"></ha-icon><div class="mx">${Math.round(f.temperature)}°</div><div class="mn">${f.templow!=null?Math.round(f.templow)+'°':''}</div><div class="pr">${esc(pr)}</div></div>`;}).join('')+'</div>';
  if(A.attribution)h+=`<div class="pmut">${esc(A.attribution)}</div>`;
  return h;};
/* Popup öffnen / aktualisieren */
C.prototype._mpTitle=function(kind){if(kind==='wx'){const w=this._st(this._cfg.weather);return 'Wetter'+(w&&w.attributes.friendly_name?' · '+w.attributes.friendly_name:'');}const a=appCard(this,kind);return a?(a.name||'Details'):'Details';};
C.prototype._mpBody=function(kind){if(kind==='wx')return this._mpWeather();const a=appCard(this,kind);if(!a)return '';return kind.startsWith('aq:')?this._mpAir(a):this._mpServer(a);};
C.prototype._mpRefresh=function(force){const k=this._popKind;const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p||!p.classList.contains('open'))return;
  if(/^(aq|srv):\d+$|^wx$/.test(String(k))){const b=p.querySelector('.pbody');const nb=this._mpBody(k);if(b&&b.__mp!==nb){const sc=b.scrollTop;b.innerHTML=nb;b.__mp=nb;b.scrollTop=sc;}return;}
  if(String(k||'').startsWith('vac:')&&this._mpAppT(k))this._vacPop();};
C.prototype._mpAppT=function(k){const i=Number(String(k).slice(4));const a=(this._cfg.appliances||[])[i];return a&&a.popup&&['printer','scale'].includes(a.popup.type)?a:null;};
const oop=C.prototype._openPop;
C.prototype._openPop=function(kind){const k=String(kind);if(/^(aq|srv):\d+$|^wx$/.test(k)){const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p)return;sty(sr);this._mpHrUnsub();this._popKind=k;const body=this._mpBody(k);
    p.innerHTML=`<div class="panel mpw"><div class="pt">${esc(this._mpTitle(k))}</div><div class="pbody" style="max-height:min(72vh,640px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__mp=body;p.classList.add('open');return;}
  return oop.call(this,kind);};
const ovp=C.prototype._vacPop;
if(ovp)C.prototype._vacPop=function(first){const a=this._mpAppT(this._popKind);if(!a)return ovp.call(this,first);const sr=this.shadowRoot;const p=sr&&sr.getElementById('swpop');if(!p)return;sty(sr);
  const body=a.popup.type==='printer'?this._mpPrinter(a,a.popup):this._mpScale(a,a.popup);
  if(!first&&p.classList.contains('open')){const b=p.querySelector('.pbody');if(b&&b.__mp!==body){const sc=b.scrollTop;b.innerHTML=body;b.__mp=body;b.scrollTop=sc;}return;}
  p.innerHTML=`<div class="panel mpw"><div class="pt">${esc(a.name||'Details')}</div><div class="pbody" style="max-height:min(72vh,640px)">${body}</div><button class="pclose" data-a="popclose">SCHLIESSEN</button></div>`;const b=p.querySelector('.pbody');if(b)b.__mp=body;p.classList.add('open');};
const occ=C.prototype._closeCt;
C.prototype._closeCt=function(){this._mpHrUnsub();return occ.apply(this,arguments);};
const orr=C.prototype._render;
C.prototype._render=function(f){const r=orr.apply(this,arguments);try{const k=String(this._popKind||'');if(/^(aq|srv):\d+$|^wx$/.test(k))this._mpRefresh();}catch(e){}return r;};
/* Kacheln anklickbar machen */
const tagAh=(h,pref)=>{let i=0;return h.replace(/<div class="ah">/g,()=>`<div class="ah vclick" data-a="openpop" data-p="${pref}:${i++}" style="cursor:pointer">`);};
const oaq=C.prototype._airQuality;
if(oaq)C.prototype._airQuality=function(){const h=oaq.apply(this,arguments);return this._cfg.more_popups===false?h:tagAh(h,'aq');};
const opa=C.prototype._pApp;
C.prototype._pApp=function(list,empty){const h=opa.apply(this,arguments);if(this._cfg.more_popups===false||!list||list!==this._cfg.servers)return h;return tagAh(h,'srv');};
const oph=C.prototype._pHome;
C.prototype._pHome=function(){const h=oph.apply(this,arguments);if(this._cfg.more_popups===false||!this._cfg.weather)return h;return h.replace(`<div class="now" data-a="more" data-e="${this._cfg.weather}">`,`<div class="now" data-a="openpop" data-p="wx" style="cursor:pointer">`);};
});})();
